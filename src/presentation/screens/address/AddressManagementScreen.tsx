import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MapSearchBar } from "../../components/map/MapSearchBar";
import { AppIcon } from "../../components/shared/AppIcon";
import { BaseAuthenticatedLayout } from "../../layouts/BaseAuthenticatedLayout";
import { useBrandColors } from "../../theme/BrandColorContext";
import { AddressConfirmFooter } from "./components/address-confirm-footer";
import { AddressMapView } from "./components/address-map-view";
import { useAddressManagement } from "./hooks/use-address-management";

export default function AddressManagementScreen() {
  const BRAND_COLORS = useBrandColors();
  const {
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
  } = useAddressManagement();

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

      <AddressMapView
        initialRegion={initialRegion}
        showMapLoading={showMapLoading}
        markerY={markerY}
        onRegionWillChange={onRegionWillChange}
        onRegionDidChange={onRegionDidChange}
        onMapReady={handleMapReady}
      />

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: BRAND_COLORS.primary.p1 }]}
        onPress={onBack}
        activeOpacity={0.8}
      >
        <AppIcon name="arrow-back" size={20} color={BRAND_COLORS.text.primary} />
      </TouchableOpacity>

      <MapSearchBar
        suggestions={suggestions}
        isLoading={isLoading}
        onSearch={onSearch}
        onSelectSuggestion={handleSelectSuggestion}
        initialValue={searchBarValue}
      />

      <TouchableOpacity
        style={[styles.myLocationBtn, { backgroundColor: BRAND_COLORS.primary.p1 }]}
        onPress={onGoToMyLocation}
        activeOpacity={0.8}
      >
        <AppIcon name="location-sharp" size={22} color={BRAND_COLORS.primary.p3} />
      </TouchableOpacity>

      {geocodingState.error && (
        <TouchableOpacity style={styles.errorToast} onPress={clearError} activeOpacity={0.9}>
          <Text style={styles.errorText}>{geocodingState.error}</Text>
          <Text style={styles.errorDismiss}>Nhấn để đóng</Text>
        </TouchableOpacity>
      )}

      <AddressConfirmFooter
        addressString={addressString}
        isLoading={geocodingState.isLoading}
        isDisabled={isConfirmDisabled}
        onConfirm={onConfirm}
      />
    </BaseAuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    zIndex: 100,
  },
  loadingText: { marginTop: 12, fontSize: 14 },
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
  errorText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  errorDismiss: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 },
});
