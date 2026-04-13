import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { Linking } from "react-native";
import { IS_IOS } from '../../utils/platform';

export interface PermissionStatusResult {
  location: boolean;
  camera: boolean;
  mediaLibrary: boolean;
}

export class PermissionService {
  private static instance: PermissionService;

  private constructor() { }

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  async requestInitialPermissions(): Promise<PermissionStatusResult> {
    const locationGranted = await this.checkOrRequestLocation();
    const cameraGranted = await this.checkOrRequestCamera();
    const mediaGranted = await this.checkOrRequestMediaLibrary();

    return {
      location: locationGranted,
      camera: cameraGranted,
      mediaLibrary: mediaGranted,
    };
  }

  async checkOrRequestLocation(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status === "granted") {
        return true;
      }

      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      return newStatus === "granted";
    } catch (error) {
      // Error captured by Sentry
      return false;
    }
  }

  async checkOrRequestCamera(): Promise<boolean> {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();

      if (status === "granted") {
        return true;
      }

      const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
      return newStatus === "granted";
    } catch (error) {
      // Error captured by Sentry
      return false;
    }
  }

  async checkOrRequestMediaLibrary(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();

      if (status === "granted") {
        return true;
      }

      const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
      return newStatus === "granted";
    } catch (error) {
      // Error captured by Sentry
      return false;
    }
  }

  openSettings() {

    if (IS_IOS) {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }
}

export const permissionService = PermissionService.getInstance();