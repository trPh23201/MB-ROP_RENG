import { Stack } from "expo-router";
import { PROFILE_STRINGS } from "../src/presentation/screens/profile/ProfileConstants";
import ProfileScreen from "../src/presentation/screens/profile/ProfileScreen";

export default function ProfileRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: PROFILE_STRINGS.TITLE,
                    headerTitleAlign: "center",
                }}
            />
            <ProfileScreen />
        </>
    );
}
