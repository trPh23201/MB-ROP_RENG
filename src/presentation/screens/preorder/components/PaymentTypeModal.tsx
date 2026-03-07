import { AppIcon } from '@/src/presentation/components/shared/AppIcon';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PaymentMethod } from '../../../../domain/shared';
import { BRAND_COLORS } from '../../../theme/colors';
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
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.background}
        stackBehavior="push"
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        animateOnMount={true}
      >
        <BottomSheetScrollView
          style={styles.scrollView}
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
                    isSelected && styles.optionSelected,
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
                          isSelected && styles.optionLabelSelected,
                          !isAvailable && styles.optionLabelDisabled,
                        ]}
                      >
                        {PAYMENT_METHOD_LABELS[method]}
                      </Text>
                      {!isAvailable && (
                        <Text style={styles.comingSoonText}>Đang phát triển</Text>
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
    backgroundColor: BRAND_COLORS.screenBg.warm,
    borderTopLeftRadius: PREORDER_LAYOUT.MODAL_BORDER_RADIUS,
    borderTopRightRadius: PREORDER_LAYOUT.MODAL_BORDER_RADIUS,
  },
  indicator: {
    backgroundColor: BRAND_COLORS.ui.placeholder,
    width: 40,
    height: 4,
  },
  scrollView: {
    flex: 1,
    backgroundColor: BRAND_COLORS.screenBg.warm,
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
    borderBottomColor: BRAND_COLORS.screenBg.fresh,
    paddingHorizontal: PREORDER_LAYOUT.HEADER_PADDING_HORIZONTAL,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.ui.heading,
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
    color: BRAND_COLORS.ui.subtitle,
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
    backgroundColor: BRAND_COLORS.screenBg.warm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BRAND_COLORS.ui.placeholder,
  },
  optionSelected: {
    borderColor: BRAND_COLORS.bta.primaryBg,
    backgroundColor: `${BRAND_COLORS.screenBg.fresh}30`,
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
    color: BRAND_COLORS.ui.heading,
  },
  optionLabelSelected: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.bta.primaryBg,
  },
  optionLabelDisabled: {
    color: BRAND_COLORS.ui.placeholder,
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.ui.placeholder,
  },
});