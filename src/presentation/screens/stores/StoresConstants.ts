export const STORES_TEXT = {
  SCREEN_TITLE: 'Cửa hàng',
  SEARCH_PLACEHOLDER: 'Tìm kiếm',
  SECTION_NEARBY: 'Cửa hàng gần bạn',
  SECTION_OTHERS: 'Các cửa hàng khác',
  DISTANCE_PREFIX: 'Cách đây',
  DISTANCE_SUFFIX: 'km',
  VOUCHER_BADGE: '17',
  NOTIFICATION_COUNT: '2',
  LOADING_MESSAGE: 'Đang tải danh sách cửa hàng...',
  RETRY_BUTTON: 'Thử lại',
  EMPTY_MESSAGE_SELECT: 'Không có cửa hàng nào có sản phẩm này',
  EMPTY_MESSAGE_BROWSE: 'Không tìm thấy cửa hàng',
  ALERT_TITLE: 'Đổi cửa hàng',
  ALERT_MESSAGE: (itemCount: number) =>
    `Bạn đang có ${itemCount} sản phẩm trong giỏ hàng. Đổi cửa hàng sẽ xóa toàn bộ giỏ hàng hiện tại. Bạn có chắc chắn muốn tiếp tục?`,
  ALERT_CANCEL: 'Không',
  ALERT_CONFIRM: 'Đồng ý',
} as const;