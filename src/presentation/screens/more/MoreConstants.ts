import { MenuSectionData, UtilityItemData } from './MoreInterfaces';

export const MORE_STRINGS = {
  HEADER_TITLE: 'Khác',
  VERSION: 'Phiên bản 1.0.0',
  LOGOUT_CONFIRM_TITLE: 'Đăng xuất',
  LOGOUT_CONFIRM_MSG: 'Bạn có chắc chắn muốn đăng xuất?',
  CANCEL: 'Hủy',
  AGREE: 'Đồng ý',
};

export const UTILITIES: UtilityItemData[] = [
  { id: 'rewards', label: 'RopReng\nRewards', icon: 'gift-outline' },
  { id: 'vouchers', label: 'Phiếu ưu đãi', icon: 'ticket-outline', badge: 3 },
  { id: 'history', label: 'Lịch sử\nđơn hàng', icon: 'receipt-outline' },
  { id: 'saved', label: 'Món yêu\nthích', icon: 'heart-outline' },
  { id: 'stores', label: 'Cửa hàng', icon: 'storefront-outline' },
  { id: 'rating', label: 'Góp ý', icon: 'chatbox-ellipses-outline' },
];

export const SUPPORT_MENU: MenuSectionData = {
  title: 'Tiện ích',
  items: [
    { id: 'profile', label: 'Tài khoản', icon: 'person-outline' },
    // { id: 'scan-qr', label: 'Scan QR', icon: 'qr-code-outline' },
    { id: 'settings', label: 'Cài đặt', icon: 'settings-outline' },
    { id: 'help', label: 'Gửi yêu cầu hỗ trợ', icon: 'help-circle-outline' },
    { id: 'terms', label: 'Điều khoản & Chính sách', icon: 'document-text-outline' },
  ],
};

export const ACCOUNT_MENU: MenuSectionData = {
  title: 'Tài khoản',
  items: [
    { id: 'payment', label: 'Phương thức thanh toán', icon: 'card-outline' },
    { id: 'logout', label: 'Đăng xuất', icon: 'log-out-outline', isDestructive: true },
  ],
};