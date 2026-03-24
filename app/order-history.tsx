import { Stack } from "expo-router";
import { ORDER_HISTORY_STRINGS } from "../src/presentation/screens/order-history/OrderHistoryConstants";
import OrderHistoryScreen from "../src/presentation/screens/order-history/OrderHistoryScreen";
import { BRAND_COLORS } from "../src/presentation/theme/colors";

export default function OrderHistoryRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: ORDER_HISTORY_STRINGS.TITLE,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: BRAND_COLORS.screenBg.bold },
          headerTintColor: BRAND_COLORS.bta.primaryText,
          headerTitleStyle: { fontFamily: 'Phudu-Bold' },
        }}
      />
      <OrderHistoryScreen />
    </>
  );
}
