import { Stack } from "expo-router";
import { PROFILE_STRINGS } from "../src/presentation/screens/profile/ProfileConstants";
import ProfileScreen from "../src/presentation/screens/profile/ProfileScreen";
import { BRAND_COLORS } from "../src/presentation/theme/colors";

export default function ProfileRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: PROFILE_STRINGS.TITLE,
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: BRAND_COLORS.screenBg.bold },
                    headerTintColor: BRAND_COLORS.bta.primaryText,
                    headerTitleStyle: { fontFamily: 'Phudu-Bold' },
                }}
            />
            <ProfileScreen />
        </>
    );
}
