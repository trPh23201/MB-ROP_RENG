import { APP_DEFAULT_LOCATION } from "@/src/core/config/locationConstants";
import { IAddressSuggestion, ILocationCoordinate } from "@/src/domain/shared/types";
import { locationService } from "@/src/infrastructure/services";
import { useAddressSearch } from "@/src/utils/hooks/useAddressSearch";
import { Camera, CameraRef, UserLocation } from "@maplibre/maplibre-react-native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { GoongGeocodingRepository } from "../../../infrastructure/repositories/GoongGeocodingRepository";
import { selectSelectedAddress, setDeliveryAddress } from "../../../state/slices/deliverySlice";
import { useAppSelector } from "../../../utils/hooks";
import { GoongMapView } from "../../components/map/GoongMapView";
import { MapSearchBar } from "../../components/map/MapSearchBar";
import { AppIcon } from "../../components/shared/AppIcon";
import { BaseAuthenticatedLayout } from "../../layouts/BaseAuthenticatedLayout";
import { popupService } from "../../layouts/popup/PopupService";
import { useBrandColors } from '../../theme/BrandColorContext';

const repo = new GoongGeocodingRepository();
const DEBOUNCE_MS = 400;
const MIN_DISTANCE_THRESHOLD = 0.0001;

type MapLoadingState = "loading" | "ready" | "error";

interface GeocodingState {
  isLoading: boolean;
  error: string | null;
}

export default function AddressManagementScreen() {
  const BRAND_COLORS = useBrandColors();
  const router = useRouter();
  const dispatch = useDispatch();
  const cameraRef = useRef<CameraRef>(null);

  const savedAddress = useAppSelector(selectSelectedAddress);

  const { suggestions, isLoading, onSearch, onSelectAddress, sessionToken, refreshSessionToken } = useAddressSearch();

  const [selectedLocation, setSelectedLocation] = useState<ILocationCoordinate | null>(null);
  const [addressString, setAddressString] = useState("");
  const [searchBarValue, setSearchBarValue] = useState("");
  const [initialRegion, setInitialRegion] = useState<[number, number]>();
  const [mapState, setMapState] = useState<MapLoadingState>("loading");
  const [geocodingState, setGeocodingState] = useState<GeocodingState>({
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  const selectedLocationRef = useRef<ILocationCoordinate | null>(null);
  useEffect(() => {
    selectedLocationRef.current = selectedLocation;
  }, [selectedLocation]);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const initLocation = useCallback(async () => {
    try {
      if (savedAddress?.lat && savedAddress?.lng) {
        const coords: [number, number] = [savedAddress.lng, savedAddress.lat];

        console.log("[AddressManagement] INIT from Redux:", {
          lat: savedAddress.lat,
          lng: savedAddress.lng,
          address: savedAddress.addressString,
        });

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
      } catch (error: any) {
        console.error("[AddressManagement] Reverse geocode failed:", error);

        const shouldRetry = await popupService.confirm(
          "Không thể xác định tên đường do lỗi kết nối. Bạn có muốn thử lại?",
          { title: "Lỗi kết nối", confirmText: "Thử lại", cancelText: "Để sau" }
        );

        if (shouldRetry) {
          initLocation();
          return;
        }

        setGeocodingState({
          isLoading: false,
          error: error?.message || "Không thể xác định địa chỉ",
        });
      }
    } catch (error) {
      console.log("[AddressManagement] GPS Error:", error);

      const shouldRetry = await popupService.confirm(
        "Không thể lấy vị trí hiện tại. Vui lòng kiểm tra GPS và thử lại.",
        { title: "Lỗi vị trí", confirmText: "Thử lại", cancelText: "Hủy" }
      );

      if (shouldRetry) {
        initLocation();
        return;
      }

      setInitialRegion([APP_DEFAULT_LOCATION.longitude, APP_DEFAULT_LOCATION.latitude]);
    }
  }, [savedAddress]);

  useEffect(() => {
    initLocation();
  }, [initLocation]);

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

      cameraRef.current?.setCamera({
        centerCoordinate: [coords.longitude, coords.latitude],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    } catch (error: any) {
      console.error("[AddressManagement] Select suggestion error:", error);
      setGeocodingState({ isLoading: false, error: null });
      popupService.alert(
        "Không thể lấy thông tin địa điểm này. Vui lòng thử lại.",
        { title: "Lỗi", type: 'error' }
      );
    }
  };

  const markerY = useRef(new Animated.Value(0)).current;

  const animateMarker = (toValue: number) => {
    Animated.timing(markerY, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();
  };

  const onRegionWillChange = useCallback((feature: any) => {
    const { isUserInteraction = false, animated = false } = feature.properties || {};
    if (isUserInteraction) {
      animateMarker(-5);
    }
  }, []);

  const onRegionDidChange = useCallback((feature: any) => {
    const { isUserInteraction = false, animated = false } = feature.properties || {};

    if (isUserInteraction) {
      animateMarker(0);
    }

    if (!isUserInteraction || animated) {
      console.log("[AddressManagement] Skipping - programmatic move:", { isUserInteraction, animated });
      return;
    }

    const [lng, lat] = feature.geometry.coordinates;

    const currentLocation = selectedLocationRef.current;
    if (currentLocation) {
      const dist = Math.sqrt(
        Math.pow(lng - currentLocation.longitude, 2) + Math.pow(lat - currentLocation.latitude, 2),
      );
      if (dist < MIN_DISTANCE_THRESHOLD) return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const currentRequestId = ++requestIdRef.current;

      setGeocodingState({ isLoading: true, error: null });

      try {
        const newAddress = await repo.reverseGeocode({ latitude: lat, longitude: lng });

        if (currentRequestId !== requestIdRef.current) {
          console.log("[AddressManagement] Stale response ignored:", currentRequestId);
          return;
        }

        setAddressString(newAddress);
        setSelectedLocation({ latitude: lat, longitude: lng });
        setGeocodingState({ isLoading: false, error: null });
      } catch (error: any) {
        if (error?.name === "AbortError") {
          console.log("[AddressManagement] Request aborted");
          return;
        }

        if (currentRequestId !== requestIdRef.current) return;

        console.error("[AddressManagement] Reverse geocode error:", error);
        setGeocodingState({ isLoading: false, error: "Không thể xác định địa chỉ" });
      }
    }, DEBOUNCE_MS);
  }, []);

  const onGoToMyLocation = async () => {
    try {
      const location = await locationService.getCurrentPosition();

      cameraRef.current?.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    } catch (error) {
      console.log("[AddressManagement] Error getting location:", error);
      setGeocodingState((prev) => ({ ...prev, error: "Không thể lấy vị trí hiện tại" }));
    }
  };

  const onConfirm = () => {
    if (!selectedLocation) return;

    console.log("[AddressManagement] CONFIRM button pressed:", {
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
      address: addressString,
    });

    dispatch(
      setDeliveryAddress({
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
        detail: addressString,
        addressString: addressString,
      }),
    );

    router.back();
  };

  const onBack = () => {
    router.back();
  };

  const handleMapReady = () => {
    console.log("[AddressManagement] Map ready");
    setMapState("ready");

    if (initialRegion) {
      cameraRef.current?.setCamera({
        centerCoordinate: initialRegion,
        zoomLevel: 15,
        animationDuration: 300,
      });
    }
  };

  const clearError = () => {
    setGeocodingState((prev) => ({ ...prev, error: null }));
  };

  const isConfirmDisabled = !selectedLocation || geocodingState.isLoading;
  const showMapLoading = mapState === "loading" || !initialRegion;

  return (
    <BaseAuthenticatedLayout
      headerMode="hidden"
      safeAreaEdges={['bottom']}
      backgroundColor={BRAND_COLORS.primary.p1}
    >
      {showMapLoading && (
        <View style={[styles.loadingContainer, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary.p3} />
          <Text style={[styles.loadingText, { color: BRAND_COLORS.secondary.s3 }]}>Đang tải bản đồ...</Text>
        </View>
      )}

      {initialRegion && (
        <GoongMapView
          style={[styles.map, showMapLoading && styles.hiddenMap]}
          onRegionDidChange={onRegionDidChange}
          onRegionWillChange={onRegionWillChange}
          onMapReady={handleMapReady}
        >
          <Camera
            ref={cameraRef}
          />
          <UserLocation visible={true} />
        </GoongMapView>
      )}

      <View style={styles.centerMarkerContainer} pointerEvents="none">
        <Animated.View style={[styles.markerPin, { backgroundColor: BRAND_COLORS.primary.p3 }, { transform: [{ translateY: markerY }] }]}>
          <AppIcon name="location" size={32} color={BRAND_COLORS.primary.p1} />
        </Animated.View>
        <View style={styles.markerShadow} />
      </View>

      <TouchableOpacity style={[styles.backButton, { backgroundColor: BRAND_COLORS.primary.p1 }]} onPress={onBack} activeOpacity={0.8}>
        <AppIcon name="arrow-back" size={20} color={BRAND_COLORS.text.primary} />
      </TouchableOpacity>

      <MapSearchBar
        suggestions={suggestions}
        isLoading={isLoading}
        onSearch={onSearch}
        onSelectSuggestion={handleSelectSuggestion}
        initialValue={searchBarValue}
      />

      <TouchableOpacity style={[styles.myLocationBtn, { backgroundColor: BRAND_COLORS.primary.p1 }]} onPress={onGoToMyLocation} activeOpacity={0.8}>
        <AppIcon name="location-sharp" size={22} color={BRAND_COLORS.primary.p3} />
      </TouchableOpacity>

      {geocodingState.error && (
        <TouchableOpacity style={styles.errorToast} onPress={clearError} activeOpacity={0.9}>
          <Text style={styles.errorText}>{geocodingState.error}</Text>
          <Text style={styles.errorDismiss}>Nhấn để đóng</Text>
        </TouchableOpacity>
      )}

      <View style={[styles.footer, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
        <View style={styles.addressPreview}>
          <Text style={[styles.label, { color: BRAND_COLORS.secondary.s3 }]}>ĐỊA CHỈ GIAO HÀNG</Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressText} numberOfLines={2}>
              {geocodingState.isLoading
                ? "Đang xác định vị trí..."
                : addressString || "Di chuyển bản đồ để chọn địa chỉ"}
            </Text>
            {geocodingState.isLoading && (
              <ActivityIndicator size="small" color={BRAND_COLORS.primary.p3} style={styles.addressLoader} />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btnConfirm, { backgroundColor: BRAND_COLORS.primary.p3 }, isConfirmDisabled && styles.btnDisabled]}
          onPress={onConfirm}
          disabled={isConfirmDisabled}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, { color: BRAND_COLORS.primary.p1 }]}>Xác nhận địa chỉ này</Text>
        </TouchableOpacity>
      </View>
    </BaseAuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    zIndex: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  hiddenMap: {
    opacity: 0,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  centerMarkerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -22,
    marginTop: -54,
    zIndex: 5,
    alignItems: "center",
  },
  markerPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  markerShadow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(15, 175, 0, 1)",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  addressPreview: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 22,
  },
  addressLoader: {
    marginLeft: 8,
  },
  btnConfirm: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "#CCCCCC",
  },
  btnText: {
    fontWeight: "700",
    fontSize: 16,
  },
  myLocationBtn: {
    position: "absolute",
    bottom: 200,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    zIndex: 10,
  },
  errorToast: {
    position: "absolute",
    top: 110,
    left: 16,
    right: 16,
    backgroundColor: "#FF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  errorDismiss: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 4,
  },
});
