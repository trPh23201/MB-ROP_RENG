import { OrderType } from '../../../domain/shared';

export const ORDER_TEXT = {
    PRODUCT_LIST_TITLE: 'Sản phẩm đã chọn',
    ADD_MORE_BUTTON: '+Thêm',
    EMPTY_PRODUCT_TEXT: 'Chưa có sản phẩm nào',
    TOTAL_SECTION_TITLE: 'Tổng cộng',
    SUBTOTAL_LABEL: 'Thành tiền',
    SHIPPING_FEE_LABEL: 'Phí giao hàng',
    DISCOUNT_LABEL: 'Giảm giá',
    PROMOTION_LABEL: 'Chọn khuyến mãi',
    FINAL_TOTAL_LABEL: 'Số tiền thanh toán',
    ADDRESS_HEADER_TITLE: 'Giao tới',
    ADDRESS_CHANGE_BUTTON: 'Thay đổi',
    ADDRESS_PLACEHOLDER: 'Chọn địa chỉ giao hàng',
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
    [OrderType.DELIVERY]: 'Giao hàng',
    [OrderType.TAKEAWAY]: 'Mang đi',
    [OrderType.DINE_IN]: 'Dùng tại chỗ',
};

export const ORDER_TYPE_SECTION_TITLES: Record<OrderType, string> = {
    [OrderType.DELIVERY]: 'Giao hàng',
    [OrderType.TAKEAWAY]: 'Tự đến lấy hàng',
    [OrderType.DINE_IN]: 'Dùng tại chỗ',
};

export const SIZE_LABELS: Record<string, string> = {
    small: 'Nhỏ',
    medium: 'Vừa',
    large: 'Lớn',
};

export const ICE_LABELS: Record<string, string> = {
    normal: 'Đá bình thường',
    less: 'Ít đá',
    separate: 'Đá riêng',
};

export const SWEETNESS_LABELS: Record<string, string> = {
    normal: 'Đường bình thường',
    less: 'Ít đường',
    more: 'Nhiều đường',
};

export const SIZE_OPTIONS = [
    { id: 'large', label: 'Lớn', priceAdjust: 10000 },
    { id: 'medium', label: 'Vừa', priceAdjust: 0 },
    { id: 'small', label: 'Nhỏ', priceAdjust: -10000 },
];

export const ICE_OPTIONS = [
    { id: 'normal', label: 'Bình Thường' },
    { id: 'separate', label: 'Đá Riêng' },
    { id: 'less', label: 'Ít Đá' },
];

export const SWEETNESS_OPTIONS = [
    { id: 'normal', label: 'Bình thường' },
    { id: 'less', label: 'Ít ngọt' },
    { id: 'more', label: 'Thêm ngọt' },
];

export const EDIT_PRODUCT_TEXT = {
    SIZE_LABEL: 'Size',
    SIZE_HINT: 'Chọn 1 loại size',
    ICE_LABEL: 'Lượng đá',
    SWEETNESS_LABEL: 'Độ ngọt',
    TOPPING_LABEL: 'THÊM LỰA CHỌN',
    TOPPING_HINT: 'Tùy chọn thêm topping yêu thích để Rốp Rẻng pha đúng gu bạn nhất (Một số lựa chọn có phụ phí).',
    NOTE_LABEL: 'Thêm ghi chú',
    CHANGE_BUTTON: 'Thay đổi',
    DELETE_CONFIRM_TITLE: 'Xác nhận',
    DELETE_CONFIRM_MESSAGE: 'Sản phẩm sẽ bị xóa khỏi giỏ hàng. Bạn có chắc chắn?',
    DELETE_CONFIRM_CANCEL: 'Hủy',
    DELETE_CONFIRM_OK: 'Xác nhận',
};

export const TOPPING_TEXT = {
    TITLE: 'Topping mua kèm món',
    SUBTITLE: 'Chọn tối đa 3 loại Topping',
    APPLY_BUTTON: 'Áp dụng',
};
