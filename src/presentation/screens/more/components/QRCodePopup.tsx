import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarcodeCreatorView, BarcodeFormat } from 'react-native-barcode-creator';
import { CustomPopupProps } from '../../../layouts/popup/types';
import { useBrandColors } from '../../../theme/BrandColorContext';

interface QRCodePopupExtraProps {
  uuid: string;
}

type QRCodePopupProps = CustomPopupProps<void> & QRCodePopupExtraProps;

type CodeMode = 'qr' | 'barcode';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const POPUP_WIDTH_QR = Math.min(SCREEN_WIDTH, 400);
const POPUP_WIDTH_BARCODE = Math.min(SCREEN_WIDTH, 400);
const FIXED_HEIGHT = 400;

export function QRCodePopup({ uuid, onDismiss }: QRCodePopupProps) {
  const BRAND_COLORS = useBrandColors();
  const [mode, setMode] = useState<CodeMode>('qr');
  const isQR = mode === 'qr';

  return (
    <View style={[styles.card, { width: isQR ? POPUP_WIDTH_QR : POPUP_WIDTH_BARCODE }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{isQR ? 'Mã QR' : 'Barcode'}</Text>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: BRAND_COLORS.background.tertiary }]}
          onPress={onDismiss}
          activeOpacity={0.6}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={20} color={BRAND_COLORS.ui.placeholder} />
        </TouchableOpacity>
      </View>

      <View style={styles.codeArea}>
        <View style={[styles.codeContainer, { borderColor: BRAND_COLORS.border.focus }]}>
          <BarcodeCreatorView
            value={uuid}
            format={isQR ? BarcodeFormat.QR : BarcodeFormat.CODE128}
            background={BRAND_COLORS.background.tertiary}
            foregroundColor={BRAND_COLORS.ui.heading}
            style={isQR ? styles.qrCode : styles.barcode}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.toggleButton, { backgroundColor: BRAND_COLORS.ui.iconFill }]}
        onPress={() => setMode(isQR ? 'barcode' : 'qr')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isQR ? 'barcode-outline' : 'qr-code-outline'}
          size={18}
          color={BRAND_COLORS.bta.accentText}
          style={{ marginRight: 6 }}
        />
        <Text style={[styles.toggleText, { color: BRAND_COLORS.bta.accentText }]}>
          {isQR ? 'Barcode' : 'QR Code'}

        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: FIXED_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Phudu-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  codeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  qrCode: {
    width: 250,
    height: 250,
  },
  barcode: {
    width: POPUP_WIDTH_BARCODE - 40,
    height: 125,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    marginHorizontal: 100,
    marginBottom: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  toggleText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
  },
});
