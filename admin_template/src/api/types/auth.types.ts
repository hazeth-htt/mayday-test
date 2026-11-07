export interface LoginRequest {
  phone: string;
  password: string;
}

export interface AuthUserInfo {
  user_id: number | string;
  full_name: string;
  phone: string;
  role_id: number | string;
  display_name?: string;
  permissions?: string[];
}

export interface LoginResponseData {
  token: string;
  user_info: AuthUserInfo;
}

export interface SignupRequest {
  full_name: string;
  phone: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
}

export interface SignupResponseData {
  user_id: number;
  full_name: string;
  phone: string;
  gender?: string;
  role_id: number;
  is_active: number;
  created_at: string;
}

export interface CreateStaffRequest {
  full_name: string;
  phone: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  role_id: number;
  branch_id: number;
  department_id: number;
  room_id?: number | null;
}

export interface UserProfileDto {
  user_id: number;
  full_name: string;
  phone: string;
  role_id: number;
  gender?: 'male' | 'female' | 'other';
  year_of_birth?: number;
  career?: string;
  ethnic?: string;
  hamlet_address?: string;
  commune_address?: string;
  city_address?: string;
  work_place?: string;
  health_insurance_number?: string;
  health_insurance_validate?: string;
  next_of_kin_name?: string;
  next_of_kin_phone?: string;
  first_visit?: string;
}

export interface UpdateUserProfileRequest {
  full_name?: string;
  gender?: 'male' | 'female' | 'other';
  year_of_birth?: number;
  career?: string;
  ethnic?: string;
  hamlet_address?: string;
  commune_address?: string;
  city_address?: string;
  work_place?: string;
  health_insurance_number?: string;
  health_insurance_validate?: string;
  next_of_kin_name?: string;
  next_of_kin_phone?: string;
}
