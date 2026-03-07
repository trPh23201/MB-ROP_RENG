import { CartRepository } from '@/src/infrastructure/db/sqlite/repositories/CartRepository';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { logout } from '../../../state/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { BaseFullScreenLayout } from '../../layouts/BaseFullScreenLayout';
import { popupService } from '../../layouts/popup/PopupService';
import { BRAND_COLORS } from '../../theme/colors';
import { ACCOUNT_MENU, MORE_STRINGS, SUPPORT_MENU } from './MoreConstants';
import { MenuSectionData } from './MoreInterfaces';
import { MenuSection } from './components/MenuSection';
import { MoreHeader } from './components/MoreHeader';
import { UtilityGrid } from './components/UtilityGrid';
import { VersionFooter } from './components/VersionFooter';

export default function MoreScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const db = useSQLiteContext();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  const accountMenuSection: MenuSectionData = useMemo(() => {
    if (isAuthenticated) {
      return ACCOUNT_MENU;
    } else {
      return {
        title: 'Tài khoản',
        items: [
          { id: 'login', label: 'Đăng nhập', icon: 'log-in-outline' },
          { id: 'register', label: 'Đăng ký', icon: 'person-add-outline' },
        ],
      };
    }
  }, [isAuthenticated]);

  const handleLogout = useCallback(async () => {
    console.log('[MoreScreen] Processing logout...');

    if (user?.uuid) {
      try {
        const cartRepo = new CartRepository(db);
        await cartRepo.clearAllCartsForUser(user?.uuid);
        console.log('[MoreScreen] SQLite cart cleared');
      } catch (error) {
        console.error('[MoreScreen] Failed to clear SQLite cart', error);
      }
    }

    dispatch(logout());

  }, [dispatch, user?.uuid, db]);

  const handleMenuPress = useCallback((id: string) => {
    console.log(`[MoreScreen] Menu pressed: ${id}, Auth: ${isAuthenticated}`);
    switch (id) {
      case 'logout':
        popupService.confirm(
          MORE_STRINGS.LOGOUT_CONFIRM_MSG,
          {
            title: MORE_STRINGS.LOGOUT_CONFIRM_TITLE,
            cancelText: MORE_STRINGS.CANCEL,
            confirmText: MORE_STRINGS.AGREE,
            confirmStyle: 'destructive',
          }
        ).then((confirmed) => {
          if (confirmed) {
            handleLogout();
          }
        });
        break;

      case 'login':
        router.push('../(auth)/login');
        break;

      case 'register':
        router.push('../(auth)/register');
        break;

      case 'profile':
        if (isAuthenticated) {
          router.push('../profile');
        } else {
          router.push('../(auth)/login');
        }
        break;

      case 'history':
        if (isAuthenticated) {
          router.push('../order-history');
        } else {
          router.push('../(auth)/login');
        }
        break;

      case 'scan-qr':
        popupService.alert('Feature is comming soon');
        break;

      default:
        break;
    }
  }, [handleLogout, isAuthenticated, router]);

  return (
    <BaseFullScreenLayout
      renderHeader={() => <MoreHeader />}
      safeAreaEdges={['left', 'right']}
      backgroundColor={BRAND_COLORS.screenBg.fresh}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <UtilityGrid onItemPress={handleMenuPress} />
        <MenuSection section={SUPPORT_MENU} onItemPress={handleMenuPress} />
        <MenuSection section={accountMenuSection} onItemPress={handleMenuPress} />
        <VersionFooter />
        <View style={{ height: 20 }} />
      </ScrollView>
    </BaseFullScreenLayout>
  );
}