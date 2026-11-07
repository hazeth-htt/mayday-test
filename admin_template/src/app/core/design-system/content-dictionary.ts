/**
 * QUY CHUẨN TỪ ĐIỂN NỘI DUNG Y TẾ (CLINICAL CONTENT DICTIONARY)
 * Dự án: DrMayDay - Bệnh viện Da liễu Trung ương & Đề tài cấp Bộ Y Tế
 * Tuân thủ nghiêm ngặt docs-internal/naming-and-content-standard.md
 */

export const CLINICAL_GLOSSARY = {
  prescription: 'Đơn thuốc điện tử',
  antihistamine: 'Thuốc kháng dị ứng (Kháng Histamin H1)',
  medicalRecord: 'Hồ sơ bệnh án điện tử',
  emergencyAlert: 'Báo động nguy cấp (115)',
  wheals: 'Nốt sẩn phù',
  pruritus: 'Cảm giác ngứa ngáy',
  followUp: 'Lịch hẹn tái khám',
  labTest: 'Chỉ định cận lâm sàng',
  intakeSurvey: 'Phiếu khai thác bệnh sử ban đầu',
  uas7Tracker: 'Nhật ký theo dõi mày đay hàng ngày (UAS7)',
  aas7Tracker: 'Nhật ký theo dõi phù mạch hàng ngày (AAS7)',
  lesionTracker: 'Nhật ký theo dõi tổn thương da',
} as const;

export const ROLE_LABELS = {
  patient: {
    self: 'Bệnh nhân',
    doctor: 'Bác sĩ chuyên khoa Da liễu',
    admin: 'Hệ thống quản lý chuyên môn',
  },
  doctor: {
    self: 'Bác sĩ chuyên khoa khám & điều trị',
    patient: 'Bệnh nhân',
    admin: 'Ban Quản Trị Hệ Thống',
  },
  admin: {
    self: 'Ban Quản Trị Hệ Thống',
    doctor: 'Bác sĩ lâm sàng',
    patient: 'Tài khoản người bệnh',
  },
} as const;

export const STATUS_LABELS = {
  pending: {
    patient: 'Đang chờ bác sĩ tiếp nhận',
    doctor: 'Chờ khám lâm sàng',
    admin: 'Chờ xử lý điều phối',
  },
  in_progress: {
    patient: 'Đang trong ca khám chuyên khoa',
    doctor: 'Đang thực hiện tư vấn & khám',
    admin: 'Ca khám đang diễn ra',
  },
  completed: {
    patient: 'Đã hoàn tất ca khám',
    doctor: 'Đã kết luận bệnh án',
    admin: 'Hồ sơ đã khóa kết luận',
  },
  emergency: {
    patient: 'Cảnh báo: Cần can thiệp cấp cứu ngay',
    doctor: 'Báo động đỏ: Nguy cơ sốc phản vệ',
    admin: 'Ca nguy cấp: Đã chuyển hướng 115',
  },
} as const;

export const UAS7_SEVERITY_LEVELS = [
  { min: 0, max: 0, label: 'Hoàn toàn sạch sẩn & ngứa', severity: 'remission', badgeClass: 'base-tag-positive' },
  { min: 1, max: 6, label: 'Kiểm soát bệnh rất tốt', severity: 'well_controlled', badgeClass: 'base-tag-positive' },
  { min: 7, max: 15, label: 'Hoạt tính bệnh mức độ nhẹ', severity: 'mild', badgeClass: 'base-tag-info' },
  { min: 16, max: 27, label: 'Hoạt tính bệnh mức độ vừa (Cân nhắc tăng liều Bậc 2)', severity: 'moderate', badgeClass: 'base-tag-warning' },
  { min: 28, max: 42, label: 'Hoạt tính bệnh mức độ nặng (Khuyến nghị hội chẩn Bậc 3)', severity: 'severe', badgeClass: 'base-tag-negative' },
] as const;
