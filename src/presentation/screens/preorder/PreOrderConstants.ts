import { PaymentMethod } from '../../../domain/shared';

export const PREORDER_TEXT = {
  TITLE: 'Xác nhận đơn hàng',
  CLEAR_BUTTON: 'Xóa',
  CONFIRM_CLEAR_TITLE: 'Xác nhận',
  CONFIRM_CLEAR_MESSAGE: 'Xóa toàn bộ sản phẩm đã chọn?',
  CONFIRM_CLEAR_CANCEL: 'Hủy',
  CONFIRM_CLEAR_CONFIRM: 'Xóa',
  ORDER_TYPE_SECTION_TITLE: 'Tự đến lấy hàng',
  ORDER_TYPE_MODAL_TITLE: 'Chọn phương thức đặt hàng',
  ORDER_TYPE_CHANGE: 'Thay đổi',
  PRODUCT_LIST_TITLE: 'Sản phẩm đã chọn',
  ADD_MORE_BUTTON: '+Thêm',
  SWIPE_EDIT: 'Sửa',
  SWIPE_DELETE: 'Xóa',
  TOTAL_SECTION_TITLE: 'Tổng cộng',
  SUBTOTAL_LABEL: 'Thành tiền',
  SHIPPING_FEE_LABEL: 'Phí giao hàng',
  PROMOTION_LABEL: 'Chọn khuyến mãi',
  FINAL_TOTAL_LABEL: 'Số tiền thanh toán',
  PAYMENT_SECTION_TITLE: 'Thanh toán',
  PAYMENT_SELECT_BUTTON: 'Chọn phương thức thanh toán >',
  PAYMENT_MODAL_TITLE: 'Phương thức thanh toán',
  PLACE_ORDER_BUTTON: 'ĐẶT HÀNG',
  ORDER_SUCCESS_TITLE: 'Đặt hàng thành công',
  ORDER_SUCCESS_MESSAGE: 'Đơn hàng của bạn đã được ghi nhận',
  COMING_SOON_MESSAGE: 'Tính năng đang được phát triển',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Tiền mặt',
  [PaymentMethod.VNPAY]: 'VNPay',
  [PaymentMethod.MOMO]: 'Momo',
};
