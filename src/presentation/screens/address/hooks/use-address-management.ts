import { APP_DEFAULT_LOCATION } from "@/src/core/config/locationConstants";
import { IAddressSuggestion, ILocationCoordinate } from "@/src/domain/shared/types";
import { locationService } from "@/src/infrastructure/services";
import { useAddressSearch } from "@/src/utils/hooks/useAddressSearch";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { useDispatch } from "react-redux";
import { GoongGeocodingRepository } from "../../../../infrastructure/repositories/GoongGeocodingRepository";
import { selectSelectedAddress, setDeliveryAddress } from "../../../../state/slices/deliverySlice";
import { useAppSelector } from "../../../../utils/hooks";
import { popupService } from "../../../layouts/popup/PopupService";

const repo = new GoongGeocodingRepository();
const DEBOUNCE_MS = 400;
const MIN_DISTANCE_THRESHOLD = 0.0001;

export type MapLoadingState = "loading" | "ready" | "error";

export interface GeocodingState {
  isLoading: boolean;
  error: string | null;
}

export function useAddressManagement() {
  const router = useRouter();
  const dispatch = useDispatch();
  const savedAddress = useAppSelector(selectSelectedAddress);

  const { suggestions, isLoading, onSearch, onSelectAddress, sessionToken, refreshSessionToken } = useAddressSearch();

  const [selectedLocation, setSelectedLocation] = useState<ILocationCoordinate | null>(null);
  const [addressString, setAddressString] = useState("");
  const [searchBarValue, setSearchBarValue] = useState("");
  const [initialRegion, setInitialRegion] = useState<[number, number]>();
  const [mapState, setMapState] = useState<MapLoadingState>("loading");
  const [geocodingState, setGeocodingState] = useState<GeocodingState>({ isLoading: false, error: null });

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);
  const selectedLocationRef = useRef<ILocationCoordinate | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markerY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    selectedLocationRef.current = selectedLocation;
  }, [selectedLocation]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const animateMarker = (toValue: number) => {
    Animated.timing(markerY, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();
  };

  const initLocation = useCallback(async () => {
    try {
      if (savedAddress?.lat && savedAddress?.lng) {
        const coords: [number, number] = [savedAddress.lng, savedAddress.lat];
        setInitialRegion(coords);
        setSelectedLocation({ latitude: savedAddress.lat, longitude: savedAddress.lng });
        setAddressString(savedAddress.addressString || "");
        setSearchBarValue(savedAddress.addressString || "");
        return;
      }

      const location = await locationService.getCurrentPosition();
      const coords: [number, number] = [location.longitude, location.latitude];
      setInitialRegion(coords);
      setSelectedLocation(location);
      setGeocodingState({ isLoading: true, error: null });

      try {
        const address = await repo.reverseGeocode(location);
        setAddressString(address);
        setSearchBarValue(address);
        setGeocodingState({ isLoading: false, error: null });
      } catch (error: unknown) {
        const shouldRetry = await popupService.confirm(
          "Không thể xác định tên đường do lỗi kết nối. Bạn có muốn thử lại?",
          { title: "Lỗi kết nối", confirmText: "Thử lại", cancelText: "Để sau" }
        );
        if (shouldRetry) { initLocation(); return; }
        setGeocodingState({ isLoading: false, error: error instanceof Error ? error.message : "Không thể xác định địa chỉ" });
      }
    } catch (error) {
      const shouldRetry = await popupService.confirm(
        "Không thể lấy vị trí hiện tại. Vui lòng kiểm tra GPS và thử lại.",
        { title: "Lỗi vị trí", confirmText: "Thử lại", cancelText: "Hủy" }
      );
      if (shouldRetry) { initLocation(); return; }
      setInitialRegion([APP_DEFAULT_LOCATION.longitude, APP_DEFAULT_LOCATION.latitude]);
    }
  }, [savedAddress]);

  useEffect(() => { initLocation(); }, [initLocation]);

  const handleSelectSuggestion = async (item: IAddressSuggestion) => {
    try {
      setSearchBarValue(item.description);
      setAddressString(item.description);
      onSelectAddress(item);
      setGeocodingState({ isLoading: true, error: null });
      const coords = await repo.getPlaceDetail(item.placeId, sessionToken);
      refreshSessionToken();
      setSelectedLocation(coords);
      setGeocodingState({ isLoading: false, error: null });
    } catch (error: unknown) {
      setGeocodingState({ isLoading: false, error: null });
      popupService.alert("Không thể lấy thông tin địa điểm này. Vui lòng thử lại.", { title: "Lỗi", type: 'error' });
    }
  };

  const onRegionWillChange = useCallback((feature: Record<string, unknown>) => {
    const properties = (feature.properties || {}) as Record<string, boolean>;
    const isUserInteraction = properties.isUserInteraction ?? false;
    if (isUserInteraction) animateMarker(-5);
  }, []);

  const onRegionDidChange = useCallback((feature: Record<string, unknown>) => {
    const properties = (feature.properties || {}) as Record<string, boolean>;
    const isUserInteraction = properties.isUserInteraction ?? false;
    const animated = properties.animated ?? false;
    if (isUserInteraction) animateMarker(0);
    if (!isUserInteraction || animated) return;

    const geometry = feature.geometry as { coordinates: [number, number] };
    const [lng, lat] = geometry.coordinates;
    const currentLocation = selectedLocationRef.current;
    if (currentLocation) {
      const dist = Math.sqrt(
        Math.pow(lng - currentLocation.longitude, 2) + Math.pow(lat - currentLocation.latitude, 2)
      );
      if (dist < MIN_DISTANCE_THRESHOLD) return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const currentRequestId = ++requestIdRef.current;
      setGeocodingState({ isLoading: true, error: null });

      try {
        const newAddress = await repo.reverseGeocode({ latitude: lat, longitude: lng });
        if (currentRequestId !== requestIdRef.current) return;
        setAddressString(newAddress);
        setSelectedLocation({ latitude: lat, longitude: lng });
        setGeocodingState({ isLoading: false, error: null });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") return;
        if (currentRequestId !== requestIdRef.current) return;
        setGeocodingState({ isLoading: false, error: "Không thể xác định địa chỉ" });
      }
    }, DEBOUNCE_MS);
  }, []);

  const onGoToMyLocation = async () => {
    try {
      await locationService.getCurrentPosition();
    } catch (error) {
      setGeocodingState((prev) => ({ ...prev, error: "Không thể lấy vị trí hiện tại" }));
    }
  };

  const onConfirm = () => {
    if (!selectedLocation) return;
    dispatch(setDeliveryAddress({
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
      detail: addressString,
      addressString: addressString,
    }));
    router.back();
  };

  const onBack = () => router.back();

  const handleMapReady = () => setMapState("ready");

  const clearError = () => setGeocodingState((prev) => ({ ...prev, error: null }));

  return {
    suggestions,
    isLoading,
    onSearch,
    searchBarValue,
    initialRegion,
    mapState,
    geocodingState,
    markerY,
    selectedLocation,
    addressString,
    handleSelectSuggestion,
    onRegionWillChange,
    onRegionDidChange,
    onGoToMyLocation,
    onConfirm,
    onBack,
    handleMapReady,
    clearError,
  };
}
