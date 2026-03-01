export interface RegisterRequestDTO {
  phone: string;
}

export interface LoginRequestDTO {
  phone: string;
  otp: string;
}

export interface UserResponseDTO {
  id: number;
  uuid: string;
  phone: string;
  email: string | null;
  password_hash: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
  store_id: number | null;
  is_active: number;
  loyalty_point: number;
  available_point: number;
  current_level_id: number | null;
  next_level_id: number | null;
  otp: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  store?: any | null;
}

export interface RegisterResponseDTO {
  user: UserResponseDTO;
}

export interface LoginResponseDTO {
  code: number;
  message: string;
  data: {
    user: UserResponseDTO;
    token: string;
  };
}