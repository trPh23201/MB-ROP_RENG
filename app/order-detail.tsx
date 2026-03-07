import { Stack } from 'expo-router';
import { ORDER_DETAIL_STRINGS } from '../src/presentation/screens/order-detail/OrderDetailConstants';
import OrderDetailScreen from '../src/presentation/screens/order-detail/OrderDetailScreen';
import { BRAND_COLORS } from '../src/presentation/theme/colors';

export default function OrderDetailRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: ORDER_DETAIL_STRINGS.TITLE,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: BRAND_COLORS.screenBg.bold },
          headerTintColor: BRAND_COLORS.bta.primaryText,
          headerTitleStyle: { fontFamily: 'Phudu-Bold' },
        }}
      />
      <OrderDetailScreen />
    </>
  );
}