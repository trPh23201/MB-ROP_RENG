import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';

interface ConfirmOrderSubmittingOverlayProps {
  visible: boolean;
}

export const ConfirmOrderSubmittingOverlay = React.memo(function ConfirmOrderSubmittingOverlay({
  visible,
}: ConfirmOrderSubmittingOverlayProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="fade">
      <View style={styles.overlayContainer}>
        <View style={[styles.loadingBox, { backgroundColor: BRAND_COLORS.screenBg.warm }]}>
          <ActivityIndicator size="large" color={BRAND_COLORS.bta.primaryBg} />
          <Text style={[styles.loadingText, { color: BRAND_COLORS.ui.subtitle }]}>Đang gửi đơn hàng...</Text>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    minWidth: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
  },
});
