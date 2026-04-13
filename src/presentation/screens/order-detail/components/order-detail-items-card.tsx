import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Order } from '../../../../domain/entities/Order';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { ORDER_DETAIL_STRINGS } from '../OrderDetailConstants';
import { OrderDetailService } from '../OrderDetailService';

interface OrderDetailItemsCardProps {
  items: Order['items'];
}

const service = new OrderDetailService();

export const OrderDetailItemsCard = React.memo(function OrderDetailItemsCard({
  items,
}: OrderDetailItemsCardProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <View style={[styles.card, { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name="cafe-outline" size={18} color={BRAND_COLORS.ui.heading} />
        <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>{ORDER_DETAIL_STRINGS.ITEMS}</Text>
      </View>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.itemContainer,
            index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: BRAND_COLORS.ui.placeholder },
          ]}
        >
          <View style={styles.itemHeader}>
            <Text style={[styles.itemQty, { color: BRAND_COLORS.ui.subtitle }]}>{item.qty}x</Text>
            <Text style={[styles.itemName, { color: BRAND_COLORS.ui.heading }]}>{item.name || `Món #${item.menuItemId}`}</Text>
            <Text style={[styles.itemPrice, { color: BRAND_COLORS.ui.heading }]}>{service.formatCurrency(item.totalPrice)}</Text>
          </View>
          <View style={styles.optionsContainer}>
            <View style={styles.optionRow}>
              <Ionicons name="options-outline" size={13} color={BRAND_COLORS.ui.subtitle} />
              <Text style={[styles.optionText, { color: BRAND_COLORS.ui.subtitle }]}>
                {service.getOptionLabel('size', item.options.size)} •{' '}
                {service.getOptionLabel('ice', item.options.ice)} •{' '}
                {service.getOptionLabel('sweetness', item.options.sweetness)}
              </Text>
            </View>
            {item.options.toppings.length > 0 && (
              <View style={styles.optionRow}>
                <Ionicons name="add-circle-outline" size={13} color={BRAND_COLORS.ui.subtitle} />
                <Text style={[styles.optionText, { color: BRAND_COLORS.ui.subtitle }]}>
                  {item.options.toppings.join(', ')}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' },
  itemContainer: { paddingVertical: 12 },
  itemHeader: { flexDirection: 'row', alignItems: 'center' },
  itemQty: { width: 30, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' },
  itemName: { flex: 1, fontSize: 14, fontFamily: 'SpaceGrotesk-Medium' },
  itemPrice: { fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', marginLeft: 8 },
  optionsContainer: { marginLeft: 30, marginTop: 6, gap: 4 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  optionText: { fontSize: 12, fontFamily: 'SpaceGrotesk-Regular' },
});
