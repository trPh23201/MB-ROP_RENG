// import * as MapLibreGL from "@maplibre/maplibre-react-native";
// import { Camera, MapView } from "@maplibre/maplibre-react-native";
import React, { useEffect } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { GOONG_CONFIG } from "../../../infrastructure/api/goong/GoongConfig";

// MapLibreGL.setAccessToken(null);
// MapLibreGL.setConnected(true);

interface GoongMapViewProps extends ViewProps {
  centerCoordinate?: [number, number];
  zoomLevel?: number;
  onMapReady?: () => void;
  onRegionDidChange?: (feature: Record<string, unknown>) => void;
  onRegionWillChange?: (feature: Record<string, unknown>) => void;
  children?: React.ReactNode;
}

const DEFAULT_CENTER: [number, number] = [106.6297, 10.8231];

export const GoongMapView: React.FC<GoongMapViewProps> = ({ centerCoordinate = DEFAULT_CENTER, zoomLevel = 14, onMapReady, onRegionDidChange, onRegionWillChange, children, style, ...props }) => {
  const styleUrl = `${GOONG_CONFIG.STYLE_URL}?api_key=${GOONG_CONFIG.MAP_TILES_KEY}`;
  const hasChildren = React.Children.count(children) > 0;

  useEffect(() => {
    const initCache = async () => {
      try {
        // await MapLibreGL.OfflineManager.setMaximumAmbientCacheSize(500 * 1024 * 1024);
        // await MapLibreGL.OfflineManager.invalidateAmbientCache(); // Use only if cache is corrupted
      } catch (error) {
        // Error captured by Sentry
      }
    };
    initCache();
  }, []);

  return (
    <View style={[styles.container, style]} {...props}>
      {/* <MapView
        style={styles.map}
        mapStyle={styleUrl}
        logoEnabled={false}
        attributionEnabled={true}
        onDidFinishLoadingMap={onMapReady}
        onRegionDidChange={onRegionDidChange}
        onRegionWillChange={onRegionWillChange}
        surfaceView={true}
      >
        {!hasChildren && (
          <Camera
            zoomLevel={zoomLevel}
            centerCoordinate={centerCoordinate}
            animationMode={"flyTo"}
            animationDuration={500}
          />
        )}
        {children}
      </MapView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});
