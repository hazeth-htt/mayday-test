# BÁO CÁO PHÂN TÍCH ĐIỂM LỆCH HỆ THỐNG (03-GAP-ANALYSIS)
**Dự án:** Hệ thống Quản trị & Bệnh án Lâm sàng Mày đay — DrMayDay  
**Đơn vị chuyên môn:** Bệnh viện Da liễu Trung ương  
**Người tổng hợp:** Orchestrator  
**Nguồn đối chiếu:** `/api-spec/api_spec.csv` vs Mã nguồn Frontend `admin_template/src/app`  
**Ngày lập:** 08/11/2026  
**Trạng thái:** Hoàn thành Giai đoạn 1 — CỔNG 1 (Chờ duyệt trước khi triển khai Giai đoạn 2)  

---

## 1. BẢNG THỐNG KÊ TỔNG HỢP ĐIỂM LỆCH

### 1.1. Thống Kê Theo Phân Loại (Types A – F)

| Mã loại | Ý nghĩa phân loại | Số lượng điểm lệch | Tỷ lệ (%) |
|:---:|:---|:---:|:---:|
| **A** | API có trong spec nhưng UI chưa dùng / chưa nối | **18** | 31.0% |
| **B** | UI cần dùng nhưng Backend chưa có API trong spec | **5** | 8.6% |
| **C** | Lệch cấu trúc, kiểu dữ liệu, định dạng hoặc tên trường | **14** | 24.1% |
| **D** | Lệch phân quyền, bảo vệ route hoặc hiển thị sai vai trò | **4** | 6.9% |
| **E** | Thiếu trạng thái giao diện (Loading skeleton, Empty state, Lỗi 401/403/404/422/500, Chống bấm trùng) | **10** | 17.2% |
| **F** | Gọi API sai cách (Dùng in-memory signals, sai method, thiếu Token header, thiếu tham số bắt buộc) | **7** | 12.1% |
| **TỔNG CỘNG** | **Toàn bộ điểm lệch hệ thống** | **58** | **100%** |

---

### 1.2. Thống Kê Theo Mức Độ Nghiêm Trọng (Severity)

| Mức độ | Số lượng | Tỷ lệ | Định nghĩa tác động |
|:---|:---:|:---:|:---|
| 🔴 **CHẶN (Blocker)** | **14** | 24.1% | Khiến luồng nghiệp vụ cốt lõi không thể vận hành khi kết nối API thật (Đăng nhập sai kiểu, thiếu Token, thiếu API Client nền tảng). |
| 🟡 **QUAN TRỌNG (Major)** | **28** | 48.3% | Sai lệch schema, lệch trường dữ liệu, thiếu kiểm tra điều kiện hoặc thiếu trạng thái phản hồi lỗi. |
| 🟢 **NHỎ (Minor)** | **16** | 27.6% | Thiếu empty state, thiếu debounce chống bấm trùng hoặc thiếu bộ lọc phụ trợ. |

---

### 1.3. Thống Kê Theo Agent Chịu Trách Nhiệm (Ownership)

| Agent phụ trách | Vùng trách nhiệm | Chặn 🔴 | Quan trọng 🟡 | Nhỏ 🟢 | Tổng điểm lệch |
|:---|:---|:---:|:---:|:---:|:---:|
| **`foundation`** | Core Client, Types, Base Mappers, Base Mocks, Errors | 4 | 3 | 0 | **7** |
| **`shared-fe`** | Auth, Layout, Notifications, Guards, Profile | 3 | 5 | 2 | **10** |
| **`patient-fe`** | Patient Home, Screening, Intake, UAS7, Lesions | 4 | 9 | 5 | **18** |
| **`doctor-fe`** | Waiting Queue, Consultation, Rx, Lab, Patient Search | 2 | 7 | 5 | **14** |
| **`admin-fe`** | Dashboard, Topology, Users/Staff, RBAC, Form Builder | 1 | 4 | 4 | **9** |
| **TỔNG** | | **14** | **28** | **16** | **58** |

---

## 2. DANH MỤC CHI TIẾT 58 ĐIỂM LỆCH HỆ THỐNG

### 2.1. Phân Loại A: API Có Trong Spec — UI Chưa Dùng (18 điểm lệch)

| Mã điểm | Vị trí file / Màn hình | Mô tả API backend có sẵn | Mức độ | Agent | Công sức |
|:---|:---|:---|:---:|:---:|:---:|
| `GAP-A-01` | `emergency-screening.component.ts` | `GET /api/medicalrecords/classifyquestions` (Tải câu hỏi sàng lọc) | 🟡 Quan trọng | `patient-fe` | Vừa |
| `GAP-A-02` | `emergency-screening.component.ts` | `POST /api/medicalrecords/classify` (Gửi kết quả phân loại để lấy template_id) | 🔴 Chặn | `patient-fe` | Vừa |
| `GAP-A-03` | `dynamic-intake.component.ts` | `POST /api/medicalrecords/selfcreate` (BN tự tạo bệnh án mới kèm answers) | 🔴 Chặn | `patient-fe` | Lớn |
| `GAP-A-04` | `uas7-scoring.component.ts` | `GET /api/uas7scores/eligibility` (Kiểm tra điều kiện được chấm UAS7) | 🔴 Chặn | `patient-fe` | Nhỏ |
| `GAP-A-05` | `patient-home.component.ts` | `GET /api/uas7scores/week` (Lấy tổng điểm tuần và phân loại nặng nhẹ chuẩn) | 🟡 Quan trọng | `patient-fe` | Nhỏ |
| `GAP-A-06` | `lesion-tracker.component.ts` | `POST /api/image_attachments` (Upload file ảnh nhị phân lên MinIO) | 🔴 Chặn | `patient-fe` | Vừa |
| `GAP-A-07` | `lesion-tracker.component.ts` | `POST /api/ai/bounding_box` (Gửi ảnh da cho AI YOLO nhận diện nốt sẩn) | 🟡 Quan trọng | `patient-fe` | Vừa |
| `GAP-A-08` | `waiting-queue.component.ts` | `GET /api/patients/search` (Bác sĩ tìm kiếm hồ sơ bệnh nhân theo tên/sđt) | 🟢 Nhỏ | `doctor-fe` | Vừa |
| `GAP-A-09` | `waiting-queue.component.ts` | `POST /api/patients` (Bác sĩ/tiếp đón tạo nhanh hồ sơ bệnh nhân mới) | 🟢 Nhỏ | `doctor-fe` | Vừa |
| `GAP-A-10` | `consultation.component.ts` | `GET /api/medicalrecords/{id}/answers` (Lấy câu trả lời bệnh nhân đã điền) | 🔴 Chặn | `doctor-fe` | Vừa |
| `GAP-A-11` | `consultation.component.ts` | `POST /api/medicalrecords/{id}/add_answers` (Bác sĩ bổ sung câu trả lời lâm sàng) | 🟡 Quan trọng | `doctor-fe` | Nhỏ |
| `GAP-A-12` | `consultation.component.ts` | `POST /api/lab_requests` (Bác sĩ tạo phiếu chỉ định xét nghiệm) | 🔴 Chặn | `doctor-fe` | Vừa |
| `GAP-A-13` | `consultation.component.ts` | `GET /api/lab_requests/{record_id}` (Xem danh sách kết quả xét nghiệm) | 🟡 Quan trọng | `doctor-fe` | Nhỏ |
| `GAP-A-14` | `user-staff.component.ts` | `GET /api/users/{id}` (Xem chi tiết hồ sơ tài khoản người dùng) | 🟡 Quan trọng | `admin-fe` | Nhỏ |
| `GAP-A-15` | `user-staff.component.ts` | `POST /api/users` (Admin tạo người dùng thông thường) | 🟡 Quan trọng | `admin-fe` | Nhỏ |
| `GAP-A-16` | `notification-dropdown.component.ts` | `POST /api/notifications/fcm_token` (Đăng ký FCM Token thiết bị) | 🟡 Quan trọng | `shared-fe` | Vừa |
| `GAP-A-17` | `notification-dropdown.component.ts` | `PUT /api/notifications/{id}/read` (Đánh dấu đã đọc 1 thông báo) | 🟢 Nhỏ | `shared-fe` | Nhỏ |
| `GAP-A-18` | `notification-dropdown.component.ts` | `PUT /api/notifications/read_all` (Đánh dấu tất cả thông báo đã đọc) | 🟢 Nhỏ | `shared-fe` | Nhỏ |

---

### 2.2. Phân Loại B: UI Cần Nhưng Spec Chưa Có API (5 điểm lệch)

| Mã điểm | Vị trí file / Màn hình | Nhu cầu UI thực tế | Đề xuất xử lý | Agent | Công sức |
|:---|:---|:---|:---|:---:|:---:|
| `GAP-B-01` | `admin-dashboard.component.ts` | Cần số liệu thống kê tổng quan (Tổng chi nhánh, nhân sự, ca khám, cấp cứu) | Mock tổng hợp client-side từ các API danh sách; gửi câu hỏi backend số 10 | `admin-fe` | Nhỏ |
| `GAP-B-02` | `consultation.component.ts` | Bác sĩ sửa đổi đơn thuốc đã kê trước khi chốt bệnh án | Dùng mock tạm trong service; gửi câu hỏi backend số 4 (`PUT /api/prescriptions/{id}`) | `doctor-fe` | Nhỏ |
| `GAP-B-03` | `patient-home.component.ts` | Bệnh nhân xem chi tiết đơn thuốc của mình theo đợt khám | Lấy từ `recentRecord` hoặc nhúng trong record detail; gửi câu hỏi backend số 5 | `patient-fe` | Nhỏ |
| `GAP-B-04` | `lesion-tracker.component.ts` | Cần danh sách tọa độ bounding box nốt sẩn từ AI (để vẽ tooltip trên UI) | Tạm hiển thị ảnh nhị phân đã vẽ; gửi câu hỏi backend số 8 | `patient-fe` | Nhỏ |
| `GAP-B-05` | `login.component.ts` | Đăng nhập bằng Email cho cán bộ y tế | Chuyển đổi giao diện sang đăng nhập bằng Số điện thoại chuẩn theo spec; gửi câu hỏi số 1 | `shared-fe` | Nhỏ |

---

### 2.3. Phân Loại C: Lệch Cấu Trúc, Kiểu Dữ Liệu & Tên Trường (14 điểm lệch)

| Mã điểm | Vị trí file | Lệch giữa Frontend vs Backend Spec | Giải pháp Mapper / Sửa đổi | Mức độ | Agent |
|:---|:---|:---|:---|:---:|:---:|
| `GAP-C-01` | `auth.service.ts` / `login.component.html` | Form gửi `email` vs Backend nhận `phone` | Đổi input đăng nhập thành Số điện thoại (format 03/05/07/08/09) | 🔴 Chặn | `shared-fe` |
| `GAP-C-02` | Toàn bộ models | Frontend dùng ID dạng `string` (`rec-001`, `u-pat-01`) vs Backend dùng `int` (`user_id`, `medical_record_id`) | Xây dựng Base Mapper ép kiểu `string ↔ number` tự động | 🔴 Chặn | `foundation` |
| `GAP-C-03` | `patient-profile.component.ts` | `date_of_birth (YYYY-MM-DD)` vs Backend `year_of_birth (int)` | Mapper chuyển đổi năm sinh `year_of_birth` | 🟡 Quan trọng | `patient-fe` |
| `GAP-C-04` | `patient-profile.component.ts` | `address (string)` đơn nhất vs Backend chia 3 cấp (`hamlet_address`, `commune_address`, `city_address`) | Phân tách form địa chỉ thành 3 trường chuẩn CSDL | 🟡 Quan trọng | `patient-fe` |
| `GAP-C-05` | `patient-profile.component.ts` | `insurance_number` vs Backend `health_insurance_number` | Đồng bộ tên trường theo spec | 🟢 Nhỏ | `patient-fe` |
| `GAP-C-06` | `patient-profile.component.ts` | `emergency_contact` dạng object vs Backend tách phẳng `next_of_kin_name`, `next_of_kin_phone` | Đồng bộ cấu trúc phẳng của Profile | 🟡 Quan trọng | `patient-fe` |
| `GAP-C-07` | `uas7-scoring.component.ts` | Thiếu trường bắt buộc `medical_record_id` khi tạo điểm | Bổ sung `medical_record_id` từ active record | 🔴 Chặn | `patient-fe` |
| `GAP-C-08` | `topology.component.ts` | Form nhập `code` cho Branch/Dept/Room vs Backend không có cột `code` | Đưa mã hiệu vào `description` hoặc ẩn trường `code` | 🟡 Quan trọng | `admin-fe` |
| `GAP-C-09` | `form-builder.component.ts` | `FormQuestion.code` vs Backend `question_id (varchar 50)` | Ánh xạ 1:1 `code` sang `question_id` | 🟡 Quan trọng | `admin-fe` |
| `GAP-C-10` | `form-builder.component.ts` | `question_type` vs Backend `type_question` | Chuẩn hóa enum kiểu câu hỏi | 🟢 Nhỏ | `admin-fe` |
| `GAP-C-11` | `form-builder.component.ts` | `options: [{ label, value }]` vs Backend `[{ option_text, option_value }]` | Mapper chuyển đổi cấu trúc Option | 🟡 Quan trọng | `admin-fe` |
| `GAP-C-12` | `consultation.component.ts` | Đơn thuốc: `medication_name` vs Backend `medicine_name` | Chuẩn hóa tên trường trong `PrescriptionItem` | 🟢 Nhỏ | `doctor-fe` |
| `GAP-C-13` | `consultation.component.ts` | Xét nghiệm: `category` vs Backend chỉ nhận `test_name`, `description` | Tách phân loại vào `description` | 🟢 Nhỏ | `doctor-fe` |
| `GAP-C-14` | `lesion-tracker.component.ts` | `onset_time` vs Backend `occurred_at` | Mapper chuyển đổi tên trường thời điểm | 🟢 Nhỏ | `patient-fe` |

---

### 2.4. Phân Loại D: Lệch Phân Quyền & Vai Trò (4 điểm lệch)

| Mã điểm | Vị trí file | Mô tả điểm lệch quyền | Đề xuất xử lý | Mức độ | Agent |
|:---|:---|:---|:---|:---:|:---:|
| `GAP-D-01` | `auth.guard.ts` | Guard chỉ so sánh role tĩnh từ `localStorage`, chưa kiểm tra hạn sống JWT Token (exp) | Bổ sung hàm kiểm tra JWT expiration và bắt lỗi 401 | 🔴 Chặn | `shared-fe` |
| `GAP-D-02` | `app-sidebar.component.ts` | Phân quyền menu chỉ theo 3 vai trò thô, chưa kiểm tra dynamic permissions | Bổ sung `hasPermission(permCode)` vào `AuthService` | 🟡 Quan trọng | `shared-fe` |
| `GAP-D-03` | `waiting-queue.component.ts` | Bác sĩ có thể bấm tiếp nhận ca khám của bác sĩ khác | Khóa nút "Tiếp nhận" nếu `assigned_doctor_id` khác null | 🟡 Quan trọng | `doctor-fe` |
| `GAP-D-04` | `consultation.component.ts` | Bác sĩ không phụ trách vẫn vào xem/sửa bệnh án | Hiển thị chế độ Chỉ Đọc (Read-only) khi bác sĩ không phụ trách | 🟡 Quan trọng | `doctor-fe` |

---

### 2.5. Phân Loại E: Thiếu Trạng Thái Giao Diện (10 điểm lệch)

| Mã điểm | Vị trí file / Màn hình | Trạng thái còn thiếu | Đề xuất bổ sung | Mức độ | Agent |
|:---|:---|:---|:---|:---:|:---:|
| `GAP-E-01` | Toàn bộ ứng dụng | Thiếu bắt lỗi HTTP toàn cục (401, 403, 404, 500, mất mạng) | Xây dựng `HttpErrorInterceptor` và dịch mã lỗi 1000..9903 | 🔴 Chặn | `foundation` |
| `GAP-E-02` | `waiting-queue.component.html` | Thiếu Loading Skeleton khi tải danh sách ca khám | Thêm `<app-table-skeleton>` | 🟡 Quan trọng | `doctor-fe` |
| `GAP-E-03` | `waiting-queue.component.html` | Thiếu Empty State khi hàng đợi không có bệnh nhân | Thêm minh họa "Hiện không có ca khám nào đang chờ" | 🟢 Nhỏ | `doctor-fe` |
| `GAP-E-04` | `consultation.component.html` | Thiếu Loading Skeleton khi tải hồ sơ bệnh án & biểu đồ | Thêm Skeleton loader cho các tab | 🟡 Quan trọng | `doctor-fe` |
| `GAP-E-05` | `uas7-scoring.component.html` | Thiếu hiển thị lỗi trùng ngày (Mã 5002) cạnh trường ngày | Hiển thị thông báo đỏ cảnh báo đã chấm điểm hôm nay | 🟡 Quan trọng | `patient-fe` |
| `GAP-E-06` | `lesion-tracker.component.html` | Thiếu trạng thái Loading Spinner khi upload ảnh MinIO | Hiển thị thanh tiến trình tải ảnh | 🟡 Quan trọng | `patient-fe` |
| `GAP-E-07` | `user-staff.component.html` | Thiếu Empty State khi tìm kiếm không ra người dùng | Thêm thông báo "Không tìm thấy người dùng phù hợp" | 🟢 Nhỏ | `admin-fe` |
| `GAP-E-08` | `topology.component.html` | Thiếu Empty State khi một khoa chưa có phòng khám | Hiển thị nút "Tạo phòng đầu tiên" | 🟢 Nhỏ | `admin-fe` |
| `GAP-E-09` | `notification-dropdown.component.html` | Thiếu Empty State khi không có thông báo | Hiển thị icon chuông và chữ "Không có thông báo mới" | 🟢 Nhỏ | `shared-fe` |
| `GAP-E-10` | Toàn bộ các form submit | Thiếu cơ chế chống bấm trùng (Double-click Debounce) | Thêm cờ `isSubmitting` vô hiệu hóa nút khi đang gửi request | 🟡 Quan trọng | `shared-fe` |

---

### 2.6. Phân Loại F: Gọi API Sai Cách & Hạ Tầng Thiếu Sót (7 điểm lệch)

| Mã điểm | Vị trí file | Mô tả sai cách | Giải pháp khắc phục | Mức độ | Agent |
|:---|:---|:---|:---|:---:|:---:|
| `GAP-F-01` | Toàn bộ các Services | Đang gọi in-memory signals trực tiếp thay vì qua HTTP API Client | Thay thế bằng tầng Service chuẩn gọi qua `ApiClient` | 🔴 Chặn | `foundation` |
| `GAP-F-02` | `environment.ts` / `.prod.ts` | Chưa có biến cấu hình `apiUrl` và cờ công tắc `useMock` | Bổ sung `apiUrl: '/api'` và `useMock: true` | 🔴 Chặn | `foundation` |
| `GAP-F-03` | `app.config.ts` | Chưa cấu hình `provideHttpClient(withInterceptors([...]))` | Đăng ký `HttpClient` và các interceptor cần thiết | 🔴 Chặn | `foundation` |
| `GAP-F-04` | `dynamic-intake.component.ts` | Hardcode mã bệnh án `rec-001` khi nộp câu trả lời | Lấy `medical_record_id` từ kết quả tạo bệnh án hoặc route param | 🔴 Chặn | `patient-fe` |
| `GAP-F-05` | `patient-home.component.ts` | Hardcode ID bệnh nhân `patientId = 'u-pat-01'` | Lấy ID người dùng từ `authService.currentUser().id` | 🔴 Chặn | `patient-fe` |
| `GAP-F-06` | `consultation.component.ts` | Hardcode fallback ID `rec-001` trong `ngOnInit` | Bắt lỗi 404 khi ID không tồn tại trên URL | 🟡 Quan trọng | `doctor-fe` |
| `GAP-F-07` | Toàn bộ các form | Thiếu validate định dạng số điện thoại VN (Mã lỗi 2004) tại client | Thêm regex kiểm tra SĐT `^(03\|05\|07\|08\|09)[0-9]{8}$` | 🟡 Quan trọng | `shared-fe` |
