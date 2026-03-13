import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../../src/presentation/components/shared/AppIcon';
import { BRAND_COLORS } from '../../src/presentation/theme/colors';
import { TAB_ICONS } from '../../src/presentation/theme/iconConstants';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND_COLORS.secondary.s3,
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.HOME} size="sm" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Đặt hàng',
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.COFFEE} size="sm" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: 'Cửa hàng',
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.STORE} size="sm" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: 'Ưu đãi',
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.TICKET} size="sm" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Khác',
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.MENU} size="sm" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BRAND_COLORS.background.default,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 4,
  },
  tabBarLabel: {
    fontSize: 10,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});