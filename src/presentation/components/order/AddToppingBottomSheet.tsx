import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../../../domain/entities/Product';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { TOPPING_TEXT } from './OrderConstants';
import { Topping } from './OrderInterfaces';
import { OrderService } from './OrderService';
import { SPRING_CONFIG } from '../../constants/animation-configs';

export interface AddToppingRef {
    present: (currentToppings: Topping[]) => void;
    dismiss: () => void;
}

interface AddToppingBottomSheetProps {
    onApply: (toppings: Topping[]) => void;
    availableToppings?: Product[];
}

export const AddToppingBottomSheet = forwardRef<AddToppingRef, AddToppingBottomSheetProps>(({ onApply, availableToppings = [] }, ref) => {
    const BRAND_COLORS = useBrandColors();
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetModal>(null);
    const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

    const snapPoints = useMemo(() => ['90%'], []);

    useImperativeHandle(ref, () => ({
        present: (currentToppings: Topping[]) => {
            setSelectedToppings([...currentToppings]);
            sheetRef.current?.present();
        },
        dismiss: () => {
            sheetRef.current?.dismiss();
        },
    }));

    const handleToggleTopping = (topping: Topping) => {
        setSelectedToppings((prev) => {
            const exists = prev.find((t) => t.id === topping.id);
            if (exists) {
                return prev.filter((t) => t.id !== topping.id);
            } else if (prev.length < 3) {
                return [...prev, topping];
            }
            return prev;
        });
    };

    const handleApply = () => {
        onApply(selectedToppings);
        sheetRef.current?.dismiss();
    };

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />,
        []
    );

    return (
        <BottomSheetModal
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            enableDismissOnClose={true}
            animationConfigs={SPRING_CONFIG}
            backdropComponent={renderBackdrop}
            backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: BRAND_COLORS.primary.p1 }]}
            handleIndicatorStyle={[styles.indicator, { backgroundColor: BRAND_COLORS.secondary.s3 }]}
            index={0}
            stackBehavior="push"
        >
            <View style={[styles.header, { borderBottomColor: BRAND_COLORS.ui.placeholder }]}>
                <TouchableOpacity onPress={() => sheetRef.current?.dismiss()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={BRAND_COLORS.ui.subtitle} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{TOPPING_TEXT.TITLE}</Text>
                    <Text style={[styles.subtitle, { color: BRAND_COLORS.ui.subtitle }]}>{TOPPING_TEXT.SUBTITLE}</Text>
                </View>
                <TouchableOpacity onPress={handleApply} style={styles.applyHeaderButton}>
                    <Text style={[styles.applyHeaderText, { color: BRAND_COLORS.secondary.s3 }]}>Áp dụng</Text>
                </TouchableOpacity>
            </View>

            <BottomSheetScrollView contentContainerStyle={[styles.contentWrapper, { paddingBottom: insets.bottom }]}>
                {availableToppings.map((topping) => {
                    const mappedTopping: Topping = { id: topping.id, name: topping.name, price: topping.price };
                    const isSelected = selectedToppings.some((t) => t.id === mappedTopping.id);
                    return (
                        <TouchableOpacity
                            key={mappedTopping.id}
                            style={[styles.toppingItem, { borderBottomColor: BRAND_COLORS.ui.placeholder }]}
                            onPress={() => handleToggleTopping(mappedTopping)}
                            disabled={!isSelected && selectedToppings.length >= 3}
                        >
                            <View style={[styles.checkbox, { borderColor: BRAND_COLORS.ui.placeholder }, isSelected && styles.checkboxSelected, isSelected && { backgroundColor: BRAND_COLORS.secondary.s3, borderColor: BRAND_COLORS.secondary.s3 }]}>
                                {isSelected && <Ionicons name="checkmark" size={16} color={BRAND_COLORS.bta.primaryText} />}
                            </View>
                            <Text style={[styles.toppingName, { color: BRAND_COLORS.ui.heading }, !isSelected && selectedToppings.length >= 3 && styles.toppingDisabled, !isSelected && selectedToppings.length >= 3 && { color: BRAND_COLORS.ui.placeholder }]}>
                                {mappedTopping.name}
                            </Text>
                            <Text style={[styles.toppingPrice, { color: BRAND_COLORS.ui.heading }]}>{OrderService.formatPrice(mappedTopping.price)}</Text>
                        </TouchableOpacity>
                    );
                })}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

AddToppingBottomSheet.displayName = 'AddToppingBottomSheet';

const styles = StyleSheet.create({
    bottomSheetBackground: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    indicator: {
        width: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 36,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    },
    applyHeaderButton: {
        paddingHorizontal: 6,
        paddingVertical: 6,
    },
    applyHeaderText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    },
    contentWrapper: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    toppingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
    },
    toppingName: {
        flex: 1,
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    },
    toppingDisabled: {
    },
    toppingPrice: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
    },
});
