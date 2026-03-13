import { AppIcon } from '@/src/presentation/components/shared/AppIcon';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PaymentMethod } from '../../../../domain/shared';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';
import { PAYMENT_METHOD_LABELS, PREORDER_TEXT } from '../PreOrderConstants';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';

interface PaymentTypeModalProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const WINDOW_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = WINDOW_HEIGHT * 0.6;

export const PaymentTypeModal = forwardRef<BottomSheetModal, PaymentTypeModalProps>(
  ({ selectedMethod, onSelectMethod }, ref) => {
    const BRAND_COLORS = useBrandColors();
    const snapPoints = useMemo(() => [MODAL_HEIGHT], []);
    const paymentMethods = useMemo(
      () => [PaymentMethod.CASH, PaymentMethod.VNPAY, PaymentMethod.MOMO],
      []
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetDefaultBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleClose = useCallback(() => {
      if (typeof ref === 'object' && ref?.current) {
        ref.current.dismiss();
      }
    }, [ref]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={[styles.indicator, { backgroundColor: BRAND_COLORS.ui.placeholder }]}
        backgroundStyle={[styles.background, { backgroundColor: BRAND_COLORS.screenBg.warm }]}
        stackBehavior="push"
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        animateOnMount={true}
      >
        <BottomSheetScrollView
          style={[styles.scrollView, { backgroundColor: BRAND_COLORS.screenBg.warm }]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{PREORDER_TEXT.PAYMENT_MODAL_TITLE}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <AppIcon name="close" size={PREORDER_LAYOUT.HEADER_BUTTON_SIZE} color={BRAND_COLORS.ui.subtitle} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {paymentMethods.map((method) => {
              const isSelected = method === selectedMethod;
              const isAvailable = PreOrderService.isPaymentMethodAvailable(method);
              const iconName = PreOrderService.getPaymentMethodIcon(method);

              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.option,
                    { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder },
                    isSelected && [styles.optionSelected, { borderColor: BRAND_COLORS.bta.primaryBg, backgroundColor: `${BRAND_COLORS.screenBg.fresh}30` }],
                    !isAvailable && styles.optionDisabled,
                  ]}
                  onPress={() => {
                    if (isAvailable) {
                      onSelectMethod(method);
                    }
                  }}
                  activeOpacity={isAvailable ? 0.7 : 1}
                  disabled={!isAvailable}
                >
                  <View style={styles.optionContent}>
                    <Ionicons
                      name={iconName as any}
                      size={PREORDER_LAYOUT.ORDER_TYPE_ICON_SIZE}
                      color={
                        !isAvailable ? BRAND_COLORS.ui.placeholder : isSelected ? BRAND_COLORS.bta.primaryBg : BRAND_COLORS.ui.subtitle
                      }
                    />
                    <View style={styles.labelContainer}>
                      <Text
                        style={[
                          styles.optionLabel,
                          { color: BRAND_COLORS.ui.heading },
                          isSelected && [styles.optionLabelSelected, { color: BRAND_COLORS.bta.primaryBg }],
                          !isAvailable && [styles.optionLabelDisabled, { color: BRAND_COLORS.ui.placeholder }],
                        ]}
                      >
                        {PAYMENT_METHOD_LABELS[method]}
                      </Text>
                      {!isAvailable && (
                        <Text style={[styles.comingSoonText, { color: BRAND_COLORS.ui.placeholder }]}>Đang phát triển</Text>
                      )}
                    </View>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={BRAND_COLORS.bta.primaryBg}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

PaymentTypeModal.displayName = 'PaymentTypeModal';

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: PREORDER_LAYOUT.MODAL_BORDER_RADIUS,
    borderTopRightRadius: PREORDER_LAYOUT.MODAL_BORDER_RADIUS,
  },
  indicator: {
    width: 40,
    height: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: PREORDER_LAYOUT.MODAL_HEADER_HEIGHT,
    borderBottomWidth: 1,
    paddingHorizontal: PREORDER_LAYOUT.HEADER_PADDING_HORIZONTAL,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
  },
  closeButton: {
    position: 'absolute',
    right: PREORDER_LAYOUT.HEADER_PADDING_HORIZONTAL,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
  },
  optionsList: {
    padding: PREORDER_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: 12,
    marginTop: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: PREORDER_LAYOUT.MODAL_OPTION_HEIGHT,
    padding: PREORDER_LAYOUT.MODAL_OPTION_PADDING,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionSelected: {
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  labelContainer: {
    gap: 2,
  },
  optionLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
  },
  optionLabelSelected: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
  },
  optionLabelDisabled: {
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
  },
});