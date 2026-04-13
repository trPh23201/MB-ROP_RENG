import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { GoongMapView } from "../../../components/map/GoongMapView";
import { AppIcon } from "../../../components/shared/AppIcon";
import { useBrandColors } from "../../../theme/BrandColorContext";

interface AddressMapViewProps {
  initialRegion: [number, number] | undefined;
  showMapLoading: boolean;
  markerY: Animated.Value;
  onRegionWillChange: (feature: Record<string, unknown>) => void;
  onRegionDidChange: (feature: Record<string, unknown>) => void;
  onMapReady: () => void;
}

export const AddressMapView = React.memo(function AddressMapView({
  initialRegion,
  showMapLoading,
  markerY,
  onRegionWillChange,
  onRegionDidChange,
  onMapReady,
}: AddressMapViewProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <>
      {initialRegion && (
        <GoongMapView
          style={[styles.map, showMapLoading && styles.hiddenMap]}
          onRegionDidChange={onRegionDidChange}
          onRegionWillChange={onRegionWillChange}
          onMapReady={onMapReady}
        />
      )}

      <View style={styles.centerMarkerContainer} pointerEvents="none">
        <Animated.View
          style={[
            styles.markerPin,
            { backgroundColor: BRAND_COLORS.primary.p3 },
            { transform: [{ translateY: markerY }] },
          ]}
        >
          <AppIcon name="location" size={32} color={BRAND_COLORS.primary.p1} />
        </Animated.View>
        <View style={styles.markerShadow} />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  hiddenMap: { opacity: 0 },
  map: { flex: 1 },
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
});
