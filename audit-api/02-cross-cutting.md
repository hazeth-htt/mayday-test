# BÁO CÁO RÀ SOÁT CÁC VẤN ĐỀ NỀN TẢNG XUYÊN SUỐT (02-CROSS-CUTTING)
**Dự án:** Hệ thống Quản trị & Bệnh án DrMayDay — Bệnh viện Da liễu Trung ương  
**Agent thực hiện:** A5 — `cross-cutting-scanner`  
**Ngày thực hiện:** 08/11/2026  

---

## 1. TỔNG QUAN HIỆN TRẠNG KIẾN TRÚC KẾT NỐI API

Qua rà soát toàn bộ codebase tại `admin_template/src/app`:
1. **Hoàn toàn vắng bóng tầng HTTP Client:** Hệ thống hiện tại **chưa sử dụng `HttpClient` của Angular hay `fetch`/`axios`** để kết nối đến bất kỳ API backend nào.
2. **Dữ liệu thuần in-memory Signals:** 100% các màn hình Bệnh nhân, Bác sĩ và Quản trị viên đang đọc và ghi dữ liệu đồng bộ qua các `signal<T>` được khởi tạo từ `mock-data.ts` trong `DrMayDayService`.
3. **Chưa có hạ tầng quản lý trạng thái mạng:** Không có Interceptor gắn Bearer Token, không có cơ chế bắt lỗi HTTP tập trung, không có cơ chế làm mới phiên (Refresh Token), không có xử lý Timeout hoặc Retry khi mất mạng.

---

## 2. CHI TIẾT CÁC ĐIỂM LỆCH VÀ BẤT CẬP XUYÊN SUỐT

### 2.1. Thiếu Base URL & Cấu Hình Môi Trường API
* Trong `environment.ts` và `environment.prod.ts`, mới chỉ có các cờ `production: boolean` và `enableInternalDevRoutes: boolean`.
* **Chưa có biến `apiUrl`** để định nghĩa endpoint backend (ví dụ: `apiUrl: 'http://localhost:3000/api'` hoặc `/api`).

### 2.2. Lệch Kiểu Dữ Liệu & Cấu Trúc Khóa Chính (Type & Schema Mismatches)

| Nhóm đối tượng | Frontend Model hiện tại (`drmayday.models.ts`) | Backend API Spec (`/api-spec`) | Điểm lệch kỹ thuật |
|:---|:---|:---|:---|
| **Khóa chính ID** | Toàn bộ ID là chuỗi dạng UUID/Mock: `'u-admin-01'`, `'rec-001'`, `'loc-1712...'` | CSDL Backend dùng hỗn hợp: `user_id (int)`, `medical_record_id (int)`, `branch_id (int)`, mã code string cho biểu mẫu | Cần Mapper 2 chiều ép kiểu `string ↔ number` để không bị lỗi kiểu khi gửi payload |
| **Xác thực Đăng nhập** | Form dùng `email` và `password` (`AuthService.login(email, pass)`) | `POST /api/auth/login` nhận `{ phone, password }` | Đăng nhập bắt buộc bằng **Số điện thoại**, không nhận Email |
| **Hồ sơ Bệnh nhân** | `Patient` có: `date_of_birth (YYYY-MM-DD)`, `address (string)`, `emergency_contact: { name, phone }` | `GET / PUT /api/users/info` có: `year_of_birth (int)`, địa chỉ chia 3 cấp (`hamlet_address`, `commune_address`, `city_address`), `next_of_kin_name`, `next_of_kin_phone` | Lệch tên trường và định dạng địa chỉ, năm sinh |
| **Hạ tầng Topology** | `Branch`, `Department`, `Room` đều có trường `code` (mã hiệu) | Trong API Spec, `Branch`, `Department`, `Room` **không có trường `code`** | Cần đưa `code` vào trường `description` hoặc ghi câu hỏi cho backend |
| **Biểu mẫu Khảo sát** | Câu hỏi dùng mã `code: 'thoi_gian_khoi_phat'`, `options: [{ label, value }]` | CSDL Backend dùng `question_id (varchar 50)`, `type_question`, `options: [{ option_text, option_value }]` | Lệch tên thuộc tính: `label` vs `option_text`, `question_type` vs `type_question` |
| **UAS7 Scoring** | Chỉ lưu `patient_id, score_date, iss7, hss7` | `POST /api/uas7scores` bắt buộc phải có `medical_record_id` (FK nối với bệnh án đang active) | Frontend gửi thiếu trường bắt buộc `medical_record_id` |

### 2.3. Bất Cập Về Xử Lý Lỗi (Inconsistent Error Handling)
* Mỗi component hiện tự cài đặt một hàm `showAlert(text: string, type: 'success' | 'error')` với biến trạng thái cục bộ `alertMessage` và dùng `setTimeout(..., 4000)` để ẩn.
* Chưa có cơ chế phân tách:
  * **Lỗi người dùng (Validation 2001-2007, 422):** Cần hiển thị màu đỏ ngay dưới từng trường input của form.
  * **Lỗi hết phiên (401 / 3001, 3002):** Cần xóa token, hiển thị thông báo "Phiên đăng nhập đã hết hạn" và tự động chuyển về `/login`.
  * **Lỗi không đủ quyền (403 / 3101-3106):** Cần chặn thao tác, thông báo rõ quyền hạn và chuyển hướng an toàn.
  * **Lỗi không tìm thấy (404):** Chuyển đến trang Empty State hoặc 404 thân thiện.
  * **Lỗi hệ thống (500 / 9901-9903):** Hiển thị câu thông báo lịch sự "Hệ thống đang bảo trì, vui lòng thử lại sau" và gửi mã lỗi vào log nội bộ.

### 2.4. Thiếu Toàn Diện Các Trạng Thái Giao Diện (Missing UI States)

| Màn hình | Thiếu Loading Skeleton | Thiếu Empty State | Thiếu Error State | Thiếu Chống Bấm Trùng (Debounce) |
|:---|:---:|:---:|:---:|:---:|
| `waiting-queue` (Hàng đợi khám) | ❌ Có (Đang thiếu) | ❌ Thiếu khi hàng đợi rỗng | ❌ Thiếu khi API 500 | ❌ Có nguy cơ bấm nhận ca nhiều lần |
| `consultation` (Bàn khám) | ❌ Thiếu skeleton tải hồ sơ | ❌ Thiếu khi chưa có kết quả lab/rx | ❌ Thiếu | ❌ Có nguy cơ bấm chốt bệnh án 2 lần |
| `uas7-scoring` (Chấm điểm UAS7) | ❌ Thiếu khi tải lịch sử | ❌ Thiếu khi chưa có điểm tuần | ❌ Thiếu khi bị trùng ngày (5002) | ❌ Thiếu |
| `lesion-tracker` (Nhật ký ảnh) | ❌ Thiếu khi upload ảnh MinIO | ❌ Thiếu khi chưa có đợt tổn thương | ❌ Thiếu khi ảnh quá 10MB (6003) | ❌ Thiếu khi bấm tải ảnh |
| `dynamic-intake` (Phiếu khám) | ❌ Thiếu khi tải cây template | — | ❌ Thiếu khi gửi answers lỗi | ❌ Thiếu khi nộp hồ sơ |
| `user-staff` (Quản lý nhân sự) | ❌ Thiếu skeleton bảng | ❌ Thiếu khi tìm không ra user | ❌ Thiếu | ❌ Thiếu khi tạo tài khoản |
| `topology` (Hạ tầng) | ❌ Thiếu skeleton bảng | ❌ Thiếu khi khoa chưa có phòng | ❌ Thiếu | ❌ Thiếu khi bấm xóa cơ sở |
| `rbac-matrix` (Phân quyền) | ❌ Thiếu skeleton cây quyền | — | ❌ Thiếu khi lưu quyền lỗi | ❌ Thiếu khi click toggle liên tục |

---

## 3. ĐỀ XUẤT KIẾN TRÚC TẦNG NỀN TẢNG (FOUNDATION REQUIREMENTS)

Để các Agent Giao diện (`patient-fe`, `doctor-fe`, `admin-fe`, `shared-fe`) có thể sửa giao diện song song mà không xung đột, Agent **FOUNDATION** ở Giai đoạn 2 cần xây dựng:
1. **Core API Client (`ApiClient`):** Wrapper trên nền `HttpClient` của Angular với:
   * Base URL lấy từ `environment.apiUrl`.
   * Gắn tự động `Authorization: Bearer <token>`.
   * Bộ Interceptor chuẩn hóa Base Response Envelope `{ code, message, data }` và tự động unwrap dữ liệu.
   * Chuyển đổi mã lỗi `1000..9903` thành các đối tượng `AppError` thân thiện.
2. **Hệ Thống Mappers Hai Chiều (`_base`):**
   * Định dạng ngày: `ISO string ↔ DD/MM/YYYY`.
   * ID: `string ↔ number`.
   * Mapping Enum CSDL sang nhãn hiển thị tiếng Việt chuẩn từ `content-dictionary.ts`.
3. **Cơ Chế Mock Linh Hoạt (`USE_MOCK`):**
   * Công tắc cờ môi trường `environment.useMock: boolean`.
   * Mock Interceptor giả lập đúng 100% path, response, delay (300ms) và mã lỗi của spec.
