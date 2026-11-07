// ============================================================================
// HỆ THỐNG QUẢN LÝ KHÁM BỆNH & THEO DÕI MỀ ĐAY (DRMAYDAY)
// ĐẶC TẢ KIỂU DỮ LIỆU CHUẨN THEO 11 SLIDE KỸ THUẬT & BV DA LIỄU TRUNG ƯƠNG
// ============================================================================

export type RoleType = 'admin' | 'doctor' | 'patient' | 'staff';

// 1. Phân hệ Tài khoản & Nhân sự (Slide 2 & 3)
export interface User {
  id: string;
  phone_number: string;
  email?: string;
  full_name: string;
  role: RoleType;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Staff {
  id: string;
  user_id: string;
  employee_code: string;
  branch_id?: string;
  department_id?: string;
  room_id?: string;
  specialty?: string;
  title?: string; // Bác sĩ CK1, Thạc sĩ, Điều dưỡng trưởng...
}

export interface Patient {
  id: string;
  user_id: string;
  patient_code: string; // Mã HIS / Mã BN
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  insurance_number?: string; // Số thẻ BHYT
  identity_card?: string; // CCCD / CMND
  occupation?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// 2. Phân quyền RBAC (Slide 3)
export interface Permission {
  id: string;
  code: string; // e.g. 'manage_users', 'view_medical_records', 'prescribe_medication'
  name: string;
  module: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'SYSTEM';
  description?: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  parent_role_id?: string | null;
  description?: string;
  permissions?: string[]; // Mảng permission_id
}

// 3. Hạ tầng Cơ sở vật chất Topology (Slide 4)
export interface Branch {
  id: string;
  code: string; // e.g. 'CN-HN-01'
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
  departments_count?: number;
  staffs_count?: number;
}

export interface Department {
  id: string;
  branch_id: string;
  code: string; // e.g. 'KHA-DL-01'
  name: string;
  description?: string;
  is_active: boolean;
  rooms_count?: number;
}

export interface Room {
  id: string;
  department_id: string | null;
  branch_id: string;
  code: string; // e.g. 'PK-204'
  name: string;
  room_type: 'consultation' | 'laboratory' | 'treatment' | 'administrative';
  is_active: boolean;
  assigned_staff_id?: string | null;
}

// 4. Dynamic Form Builder (Slide 11 & Từ điển 183 biến lâm sàng BV Da liễu TW)
export type QuestionType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file';

export type FilledByRole = 'patient' | 'doctor' | 'both';

export interface QuestionOption {
  id: string;
  question_id: string;
  label: string;
  value: string;
  score_weight?: number;
}

export interface FormQuestion {
  id: string;
  section_id: string;
  code: string; // e.g. 'thoi_gian_khoi_phat', 'ngua_ban_dem', 'thuoc_da_uong'
  question_text: string;
  question_type: QuestionType;
  placeholder?: string;
  is_required: boolean;
  parent_question_id?: string | null;
  show_if_answer?: string | null; // Giá trị của parent_question_id để câu này hiển thị
  order_index: number;
  options?: QuestionOption[];
}

export interface FormSection {
  id: string;
  template_id: string;
  title: string;
  description?: string;
  filled_by: FilledByRole; // 'patient' | 'doctor' | 'both'
  order_index: number;
  questions: FormQuestion[];
}

export interface FormTemplate {
  id: string;
  code_template: string; // e.g. 'TMPL_MAY_DAY_CAP', 'TMPL_MAY_DAY_MAN'
  name: string;
  disease_category: 'acute_urticaria' | 'chronic_urticaria' | 'general';
  description?: string;
  is_active: boolean;
  created_at: string;
  sections?: FormSection[];
}

// 5. Hồ sơ Bệnh án & Khám chữa bệnh (Slide 5)
export type MedicalRecordStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface MedicalRecord {
  id: string;
  record_code: string; // e.g. 'BA-2026-0891'
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  patient_gender: 'male' | 'female';
  patient_dob: string;
  template_id: string;
  status: MedicalRecordStatus;
  assigned_doctor_id?: string | null;
  assigned_doctor_name?: string | null;
  room_id?: string;
  room_name?: string;
  branch_name?: string;
  clinical_type: 'acute' | 'chronic'; // Cấp tính (<6 tuần) hoặc Mạn tính (>=6 tuần)
  chief_complaint: string; // Lý do khám
  diagnosis?: string; // Chẩn đoán xác định
  instructions?: string; // Lời dặn / Chỉ dẫn điều trị
  created_by?: string | null;
  created_at: string;
  completed_at?: string | null;
  answers?: Record<string, any>; // Lưu câu trả lời Form động
}

// 6. Thang điểm UAS7 (Slide 6)
export interface UAS7DailyScore {
  id: string;
  patient_id: string;
  score_date: string; // YYYY-MM-DD
  iss7: number; // Điểm sẩn: 0 (Không có), 1 (Nhẹ <20 nốt), 2 (Vừa 20-50 nốt), 3 (Nặng >50 nốt)
  hss7: number; // Điểm ngứa: 0 (Không), 1 (Nhẹ), 2 (Vừa), 3 (Nặng cản trở sinh hoạt)
  daily_score: number; // = iss7 + hss7 (0 - 6)
  notes?: string;
}

// 7. Đơn thuốc & Cận lâm sàng (Slide 7)
export interface PrescriptionItem {
  id: string;
  medication_name: string;
  active_ingredient?: string; // Hoạt chất
  dosage: string; // e.g. '10mg'
  quantity: number;
  unit: string; // viên, gói, chai...
  instructions: string; // e.g. 'Uống 1 viên vào buổi tối sau ăn'
}

export interface Prescription {
  id: string;
  medical_record_id: string;
  doctor_id: string;
  diagnosis: string;
  notes?: string;
  created_at: string;
  items: PrescriptionItem[];
}

export interface LabRequestItem {
  id: string;
  test_name: string; // e.g. 'Tổng phân tích tế bào máu ngoại vi', 'Định lượng IgE toàn phần'
  category: 'Huyết học' | 'Sinh hóa' | 'Miễn dịch' | 'Dị nguyên';
  status: 'pending' | 'completed';
  result_value?: string;
  reference_range?: string;
  unit?: string;
  is_abnormal?: boolean;
}

export interface LabRequest {
  id: string;
  medical_record_id: string;
  requested_by_doctor_id: string;
  created_at: string;
  status: 'pending' | 'completed';
  items: LabRequestItem[];
}

// 8. Theo dõi Tổn thương da & Kho ảnh 3 mốc (Slide 8 & 9)
export type LesionMilestone = 'start' | 'peak' | 'normal';

export interface LesionPhoto {
  id: string;
  milestone: LesionMilestone;
  photo_url: string;
  taken_at: string;
  itch_score: number; // Thang 0 - 10
  pain_score: number; // Thang 0 - 10
  burn_score: number; // Thang 0 - 10
  hives_count?: number; // AI đếm số lượng sẩn
  auas_score?: number; // AI tính chỉ số AUAS
  ai_annotated_url?: string; // Ảnh khoanh vùng tổn thương AI
}

export interface LesionLocation {
  id: string;
  episode_id: string;
  body_part: string; // e.g. 'Cánh tay trái', 'Đùi phải', 'Lưng', 'Mặt'
  photos: LesionPhoto[];
}

export interface LesionEpisode {
  id: string;
  patient_id: string;
  medical_record_id?: string;
  onset_time: string; // Thời điểm phát tác
  context_tags: string[]; // ['Sau khi ăn hải sản', 'Tập thể dục', 'Thời tiết lạnh']
  medications_taken?: string; // Thuốc đã tự uống trước đó
  notes?: string;
  locations: LesionLocation[];
}

// 9. Thông báo hệ thống (Slide 10)
export interface SystemNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'appointment' | 'uas7_reminder' | 'lab_result' | 'system';
  is_read: boolean;
  created_at: string;
}
