import { Stack } from "expo-router";
import { CONFIRM_ORDER_TEXT } from "../src/presentation/screens/confirm-order/ConfirmOrderConstants";
import ConfirmOrderScreen from "../src/presentation/screens/confirm-order/ConfirmOrderScreen";
import { BRAND_COLORS } from "../src/presentation/theme/colors";

export default function ConfirmOrderRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: CONFIRM_ORDER_TEXT.SCREEN_TITLE,
                    headerTitleAlign: "center",
                    animation: 'slide_from_right',
                    headerStyle: { backgroundColor: BRAND_COLORS.screenBg.bold },
                    headerTintColor: BRAND_COLORS.bta.primaryText,
                    headerTitleStyle: { fontFamily: 'Phudu-Bold', fontSize: 20 },
                }}
            />
            <ConfirmOrderScreen />
        </>
    );
}
