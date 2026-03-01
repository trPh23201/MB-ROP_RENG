import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../../../domain/entities/Product';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { TOPPING_TEXT } from './OrderConstants';
import { Topping } from './OrderInterfaces';
import { OrderService } from './OrderService';

export interface AddToppingRef {
    present: (currentToppings: Topping[]) => void;
    dismiss: () => void;
}

interface AddToppingBottomSheetProps {
    onApply: (toppings: Topping[]) => void;
    availableToppings?: Product[];
}

export const AddToppingBottomSheet = forwardRef<AddToppingRef, AddToppingBottomSheetProps>(({ onApply, availableToppings = [] }, ref) => {
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
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />,
        []
    );

    return (
        <BottomSheetModal
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            enableDismissOnClose={true}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.indicator}
            index={0}
            stackBehavior="push"
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => sheetRef.current?.dismiss()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={BRAND_COLORS.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>{TOPPING_TEXT.TITLE}</Text>
                    <Text style={styles.subtitle}>{TOPPING_TEXT.SUBTITLE}</Text>
                </View>
                <TouchableOpacity onPress={handleApply} style={styles.applyHeaderButton}>
                    <Text style={styles.applyHeaderText}>Áp dụng</Text>
                </TouchableOpacity>
            </View>

            <BottomSheetScrollView contentContainerStyle={[styles.contentWrapper, { paddingBottom: insets.bottom }]}>
                {availableToppings.map((topping) => {
                    const mappedTopping: Topping = { id: topping.menuItemId?.toString() || topping.id, name: topping.name, price: topping.price };
                    const isSelected = selectedToppings.some((t) => t.id === mappedTopping.id);
                    return (
                        <TouchableOpacity
                            key={mappedTopping.id}
                            style={styles.toppingItem}
                            onPress={() => handleToggleTopping(mappedTopping)}
                            disabled={!isSelected && selectedToppings.length >= 3}
                        >
                            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                {isSelected && <Ionicons name="checkmark" size={16} color={BRAND_COLORS.text.inverse} />}
                            </View>
                            <Text style={[styles.toppingName, !isSelected && selectedToppings.length >= 3 && styles.toppingDisabled]}>
                                {topping.name}
                            </Text>
                            <Text style={styles.toppingPrice}>{OrderService.formatPrice(topping.price)}</Text>
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
        backgroundColor: BRAND_COLORS.background.default,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    indicator: {
        backgroundColor: '#DDDDDD',
        width: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: BRAND_COLORS.border.light,
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
        color: BRAND_COLORS.text.primary,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.text.tertiary,
    },
    applyHeaderButton: {
        paddingHorizontal: 6,
        paddingVertical: 6,
    },
    applyHeaderText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.secondary.nauEspresso,
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
        borderBottomColor: BRAND_COLORS.border.light,
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: BRAND_COLORS.text.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: BRAND_COLORS.secondary.nauEspresso,
        borderColor: BRAND_COLORS.secondary.nauEspresso,
    },
    toppingName: {
        flex: 1,
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.text.primary,
    },
    toppingDisabled: {
        color: BRAND_COLORS.text.tertiary,
    },
    toppingPrice: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
        color: BRAND_COLORS.text.primary,
    },
});
