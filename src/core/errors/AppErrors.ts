export class AppError extends Error {
  constructor(
    public message: string,
    public code: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ============ Network Errors ============

export class NetworkError extends AppError {
  constructor() {
    super('Kết nối internet không ổn định, vui lòng kiểm tra', 'NETWORK_ERROR');
  }
}

export class QuotaExceededError extends AppError {
  constructor() {
    super('Máy chủ đang quá tải vui lòng thử lại sau', 'QUOTA_EXCEEDED');
  }
}

export class ApiError extends AppError {
  constructor(message: string) {
    super(message, 'API_ERROR');
  }
}

// ============ Auth Errors ============

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR');
  }
}

export class OtpInvalidError extends AppError {
  constructor() {
    super('Mã OTP không chính xác', 'OTP_INVALID');
  }
}

export class OtpExpiredError extends AppError {
  constructor() {
    super('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới', 'OTP_EXPIRED');
  }
}

export class PhoneNotRegisteredError extends AppError {
  constructor() {
    super('Số điện thoại chưa được đăng ký', 'PHONE_NOT_REGISTERED');
  }
}

export class PhoneExistedError extends AppError {
  constructor() {
    super('Số điện thoại đã được đăng ký', 'PHONE_EXISTED');
  }
}

export class SessionExpiredError extends AppError {
  constructor() {
    super('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại', 'SESSION_EXPIRED');
  }
}

// ============ Location Errors ============

export class LocationPermissionError extends AppError {
  constructor() {
    super('Vui lòng cấp quyền truy cập vị trí để sử dụng tính năng này', 'PERMISSION_DENIED');
  }
}

export class LocationServiceError extends AppError {
  constructor() {
    super('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra GPS.', 'LOCATION_SERVICE_ERROR');
  }
}

// ============ Validation Errors ============

export class ValidationError extends AppError {
  constructor(
    public readonly field: string,
    message: string
  ) {
    super(message, 'VALIDATION_ERROR');
  }
}