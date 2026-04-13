import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

export class HapticFeedback {
  static light() {
    if (isSupported) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }

  static medium() {
    if (isSupported) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }

  static heavy() {
    if (isSupported) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  }

  static success() {
    if (isSupported) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  static error() {
    if (isSupported) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }

  static selection() {
    if (isSupported) Haptics.selectionAsync().catch(() => {});
  }
}
