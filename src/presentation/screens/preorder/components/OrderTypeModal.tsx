import { AppIcon } from '@/src/presentation/components/shared/AppIcon';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrderType } from '../../../../domain/shared';
import { ORDER_TYPE_LABELS } from '../../../components/order/OrderConstants';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';
import { PREORDER_TEXT } from '../PreOrderConstants';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';

interface OrderTypeModalProps {
  selectedType: OrderType;
  onSelectType: (type: OrderType) => void;
}

const WINDOW_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = WINDOW_HEIGHT * 0.6;

export const OrderTypeModal = forwardRef<BottomSheetModal, OrderTypeModalProps>(
  ({ selectedType, onSelectType }, ref) => {
    const BRAND_COLORS = useBrandColors();
    const snapPoints = useMemo(() => [MODAL_HEIGHT], []);
    const orderTypes = useMemo(() => [OrderType.DELIVERY, OrderType.TAKEAWAY, OrderType.DINE_IN], []);

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
          <View style={[styles.header, { borderBottomColor: BRAND_COLORS.screenBg.fresh }]}>
            <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{PREORDER_TEXT.ORDER_TYPE_MODAL_TITLE}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <AppIcon name="close" size={PREORDER_LAYOUT.HEADER_BUTTON_SIZE} color={BRAND_COLORS.ui.subtitle} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {orderTypes.map((type) => {
              const isSelected = type === selectedType;
              const iconName = PreOrderService.getOrderTypeIcon(type);

              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.option,
                    { borderColor: BRAND_COLORS.screenBg.fresh },
                    isSelected && [styles.optionSelected, { borderColor: BRAND_COLORS.bta.primaryBg, backgroundColor: `${BRAND_COLORS.screenBg.fresh}30` }]
                  ]}
                  onPress={() => onSelectType(type)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Ionicons
                      name={iconName as any}
                      size={PREORDER_LAYOUT.ORDER_TYPE_ICON_SIZE}
                      color={isSelected ? BRAND_COLORS.bta.primaryBg : BRAND_COLORS.ui.subtitle}
                    />
                    <Text style={[
                      styles.optionLabel,
                      { color: BRAND_COLORS.ui.subtitle },
                      isSelected && [styles.optionLabelSelected, { color: BRAND_COLORS.bta.primaryBg }]
                    ]}>
                      {ORDER_TYPE_LABELS[type]}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={BRAND_COLORS.bta.primaryBg} />
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

OrderTypeModal.displayName = 'OrderTypeModal';

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
    height: PREORDER_LAYOUT.MODAL_OPTION_HEIGHT,
    padding: PREORDER_LAYOUT.MODAL_OPTION_PADDING,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
  },
  optionSelected: {
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
  },
  optionLabelSelected: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
  },
});