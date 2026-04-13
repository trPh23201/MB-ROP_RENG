import { APP_DEFAULT_LOCATION } from "@/src/core/config/locationConstants";
import * as Location from "expo-location";
import { ILocationCoordinate } from "../../domain/shared/types";
import { PermissionService } from "./PermissionService";

export type { ILocationCoordinate } from "../../domain/shared/types";

const LOCATION_TIMEOUT_MS = 3000;

export class LocationService {
  private permissionService: PermissionService;

  constructor(permissionService: PermissionService) {
    this.permissionService = permissionService;
  }

  async getCurrentPosition(accuracy: Location.Accuracy = Location.Accuracy.Balanced): Promise<ILocationCoordinate> {
    try {
      const hasPermission = await this.permissionService.checkOrRequestLocation();

      if (!hasPermission) {
        return APP_DEFAULT_LOCATION;
      }

      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        return {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };
      }

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy,
      });

      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          reject(new Error("LOCATION_TIMEOUT"));
        }, LOCATION_TIMEOUT_MS);
      });

      const location = await Promise.race([locationPromise, timeoutPromise]);

      if (location) {
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      }

      return APP_DEFAULT_LOCATION;

    } catch (error: unknown) {
      // Error captured by Sentry
      return APP_DEFAULT_LOCATION;
    }
  }

  async requestPermissions(): Promise<boolean> {
    return this.permissionService.checkOrRequestLocation();
  }
}
