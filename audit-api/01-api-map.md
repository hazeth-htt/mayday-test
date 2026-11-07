# BẢN ĐỒ ĐẶC TẢ API HỆ THỐNG DRMAYDAY (01-API-MAP)
**Dự án:** Hệ thống Quản trị & Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
**Đơn vị chuyên môn:** Bệnh viện Da liễu Trung ương  
**Agent thực hiện:** A1 — `api-mapper`  
**Nguồn sự thật:** `/api-spec/api_spec.csv` (91 APIs, Bộ mã lỗi 1000 - 9903, Bitmask 19-bit)  
**Ngày thực hiện:** 08/11/2026  

---

## 1. QUY CHUẨN GIAO THỨC CHUNG (BASE CONTRACT)

### 1.1. Base URL & Header
* **Base URL:** Biến môi trường `environment.apiUrl` (mặc định: `/api`)
* **Headers bắt buộc:**
  * `Content-Type: application/json` (hoặc `multipart/form-data` khi upload tệp)
  * `Authorization: Bearer <jwt_token>` (cho toàn bộ API yêu cầu xác thực)

### 1.2. Cấu trúc Response Chuẩn (Envelope Format)
```json
{
  "code": "1000",       // "1000" (Thành công thông thường) | "1001" (Tạo mới thành công)
  "message": "OK",      // Thông báo kết quả
  "data": { ... },      // Object hoặc Array kết quả dữ liệu
  "total": 120          // (Tùy chọn) Tổng số bản ghi nếu có phân trang ngoài data
}
```

### 1.3. Hệ Thống Mã Lỗi Đặc Thù
* `1000`: Thành công
* `2001 - 2007`: Lỗi xác thực tham số (Missing param, invalid type, value, phone, email, date, JSON body)
* `3001 - 3009`: Lỗi định danh & mật khẩu (Token invalid, expired, not authenticated, OTP, user existed, password incorrect)
* `3101 - 3106`: Lỗi phân quyền (Permission denied, Admin/Doctor/Patient role required, Doctor not assigned, cannot access other user's data)
* `4001 - 4009`: Lỗi bệnh án (Not found, active required, already completed, not in pending, already accepted, answers empty, status invalid)
* `4101 - 4105`: Lỗi biểu mẫu động (Template not found, code exists, section/question not found, template in use)
* `5001 - 5005`: Lỗi thang điểm UAS7 (Not eligible, already submitted for date, invalid ISS7/HSS7 0-3, score_date required)
* `6001 - 6007`: Lỗi kho ảnh & MinIO (File required, unsupported format, size limit >5MB/10MB, max batch >10, attachment not found, MinIO error)
* `7001 - 7007`: Lỗi đợt tổn thương (Episode/Location/Photo not found, empty fields, invalid milestone start/peak/normal, symptom score 0-10)
* `8001 - 8003`: Lỗi đơn thuốc (Medicines empty, medicine name required, prescription already exists)
* `8101 - 8103`: Lỗi xét nghiệm (Lab tests empty, test name required, lab request not found)
* `9001 - 9003`: Lỗi mô hình YOLO AI (Inference failed, 502 unavailable, invalid itch severity)
* `9101 - 9102`: Lỗi thông báo (FCM token required, notification not found)
* `9901 - 9903`: Lỗi hệ thống (Internal error, DB connection error, 3rd party error)

---

## 2. PHÂN NHÓM 1: BỆNH NHÂN (PATIENT APIS)

| STT | Tên API | Method & Path | Mục đích | Vai trò | Request (Header/Query/Body) | Response (Data fields) | Phân trang / Lọc | Mã lỗi đặc thù |
|:---:|:---|:---|:---|:---:|:---|:---|:---:|:---|
| 1 | `get_uas7scores_eligibility` | `GET /api/uas7scores/eligibility` | Kiểm tra BN đủ điều kiện chấm UAS7 | Patient | Header: Auth | `eligible: "true"\|"false"`, `medical_record_id?: string` | Không | 3003, 5001 |
| 2 | `create_uas7scores` | `POST /api/uas7scores` | Gửi điểm chấm UAS7 mỗi ngày | Patient | Body: `{ medical_record_id, score_date, iss7, hss7, note? }` | Array: `[{ patient_id, medical_record_id, score_date, iss7, hss7, daily_score, note, created_at }]` | Không | 2001, 5001, 5002, 5003, 5004, 5005 |
| 3 | `get_uas7scores_week` | `GET /api/uas7scores/week` | Tổng kết điểm tuần UAS7 & phân loại nặng nhẹ | Patient | Query: `start_date?`, Path/Query: `patient_id` | `patient_id`, `week_score`, `severity_label`, `completed_days` | start_date | 3003, 4001, 5001 |
| 4 | `get_uas7scores_patient` | `GET /api/uas7scores/patient/{patient_id}` | Xem toàn bộ lịch sử điểm UAS7 | Patient | Path: `patient_id` | Array: `[{ patient_id, medical_record_id, score_date, iss7, hss7, daily_score, note }]` | Không | 3003, 3106 |
| 5 | `get_medicalrecords_classifyquestions` | `GET /api/medicalrecords/classifyquestions` | Lấy danh sách câu hỏi sàng lọc/phân loại | Patient | Header: Auth | Array: `[{ question_id, question_text, type_question, options: [{ id, option_text, option_value }] }]` | Không | 3003, 9901 |
| 6 | `set_medicalrecords_classify` | `POST /api/medicalrecords/classify` | Gửi câu trả lời sàng lọc để chọn template | Patient | Body: `{ answers: [{ question_id, option_value }] }` | `{ template_id, template_name }` | Không | 2001, 4006 |
| 7 | `set_medicalrecords_selfcreate` | `POST /api/medicalrecords/selfcreate` | BN tự tạo phiên khám & gửi câu trả lời ban đầu | Patient | Body: `{ template_id, answers?: [{ question_id, question_option_id?, answer_text?, answer_value? }] }` | `{ medical_record_id, patient_id, assigned_doctor_id, created_by, template_id, status, instructions, created_at }` | Không | 2001, 4101, 4007 |
| 8 | `set_medicalrecords_answers` | `POST /api/medicalrecords/{id}/answers` | Ghi đè/cập nhật câu trả lời biểu mẫu (Upsert) | Patient | Path: `id`, Body: `{ answers: [{ question_id, question_option_id?, answer_text?, answer_value? }] }` | `{ count: number }` | Không | 3003, 4001, 4003, 4008 |
| 9 | `create_lesion_episode` | `POST /api/lesion_episodes` | Tạo đợt tổn thương mề đay mới | Patient | Body: `{ medical_record_id, name, occurred_at?, context_tags?, context_other?, medication_name?, medication_taken_ago?, medication_unit?, description? }` | `{ episode_id, medical_record_id, patient_id, name, occurred_at, context_tags, description, created_at }` | Không | 2001, 4001, 7004 |
| 10 | `get_my_lesion_episodes` | `GET /api/lesion_episodes/my` | BN lấy danh sách đợt tổn thương của mình | Patient | Query: `medical_record_id?` | Array: `[{ episode_id, medical_record_id, patient_id, name, occurred_at, description, created_at }]` | medical_record_id | 3003 |
| 11 | `get_lesion_episode_detail` | `GET /api/lesion_episodes/{id}` | Xem chi tiết 1 đợt tổn thương | Patient | Path: `id` | `{ episode_id, medical_record_id, patient_id, name, occurred_at, context_tags, medication_name, description, ... }` | Không | 3003, 7001 |
| 12 | `edit_lesion_episode` | `PUT /api/lesion_episodes/{id}` | Cập nhật thông tin đợt tổn thương | Patient | Path: `id`, Body: `{ name?, occurred_at?, context_tags?, description?, ... }` | Object đợt tổn thương sau cập nhật | Không | 3003, 7001 |
| 13 | `delete_lesion_episode` | `DELETE /api/lesion_episodes/{id}` | Xóa đợt tổn thương | Patient | Path: `id` | `{}` | Không | 3003, 7001 |
| 14 | `set_lesion_location` | `POST /api/lesion_locations` | Tạo vị trí tổn thương theo đợt | Patient | Body: `{ episode_id, body_part, occurred_at?, context_tags?, medication_name?, ... }` | `{ lesion_location_id, episode_id, body_part, ... }` | Không | 2001, 7001, 7005 |
| 15 | `get_lesion_locations_by_episode` | `GET /api/lesion_locations/by_episode/{episode_id}` | Danh sách vị trí theo đợt | Patient | Path: `episode_id` | Array: `[{ lesion_location_id, episode_id, body_part, occurred_at, ... }]` | Không | 3003, 7001 |
| 16 | `edit_lesion_location` | `PUT /api/lesion_locations/{id}` | Sửa vị trí tổn thương | Patient | Path: `id`, Body: `{ body_part?, occurred_at?, ... }` | Object vị trí tổn thương sau cập nhật | Không | 3003, 7002 |
| 17 | `delete_lesion_location` | `DELETE /api/lesion_locations/{id}` | Xóa vị trí tổn thương | Patient | Path: `id` | `{}` | Không | 3003, 7002 |
| 18 | `set_lesion_photos` | `POST /api/lesion_photos` | Tải ảnh tổn thương kèm chấm điểm triệu chứng | Patient | Body: `{ episode_id, location_id?, attachment_id, taken_at?, milestone, itch_score?, pain_score?, burn_score?, hives_count?, local_auas?, annotated_url? }` | `{ photo_id, episode_id, location_id, attachment_id, milestone, itch_score, ... }` | Không | 2001, 6005, 7001, 7006, 7007 |
| 19 | `get_lesion_photos_by_location` | `GET /api/lesion_photos/by_location/{location_id}` | Xem danh sách ảnh theo vị trí | Patient | Path: `location_id` | Array: `[{ photo_id, episode_id, location_id, attachment_id, milestone, attachment: { file_url } }]` | Không | 3003, 7002 |
| 20 | `edit_lesion_photo_milestone` | `PUT /api/lesion_photos/{id}` | Cập nhật mốc giai đoạn ảnh tổn thương | Patient | Path: `id`, Body: `{ milestone?, itch_score?, pain_score?, burn_score?, hives_count?, local_auas?, annotated_url? }` | Object ảnh tổn thương sau cập nhật | Không | 3003, 7003, 7006, 7007 |
| 21 | `delete_lesion_photo` | `DELETE /api/lesion_photos/{id}` | Xóa ảnh tổn thương | Patient | Path: `id` | `{}` | Không | 3003, 7003 |
| 22 | `get_user_info` | `GET /api/users/info` | Xem thông tin cá nhân của bệnh nhân | Patient | Header: Auth | `{ user_id, full_name, phone, role_id, gender, year_of_birth, career, ethnic, hamlet_address, commune_address, city_address, work_place, health_insurance_number, health_insurance_validate, next_of_kin_name, next_of_kin_phone, first_visit }` | Không | 3003, 3007 |
| 23 | `set_user_info` | `PUT /api/users/info` | Cập nhật thông tin cá nhân của bệnh nhân | Patient | Body: (Ít nhất 1 trường profile cập nhật) | Thông tin chi tiết user sau cập nhật | Không | 2001, 3003, 3007 |
| 24 | `get_history_medicalrecords` | `GET /api/medicalrecords/history/{patient_id}` | BN xem lịch sử các lần khám cũ của mình | Patient | Path: `patient_id` | Array: `[{ medical_record_id, status, instructions, created_at }]` | Không | 3003, 3106 |

---

## 3. PHÂN NHÓM 2: BÁC SĨ (DOCTOR APIS)

| STT | Tên API | Method & Path | Mục đích | Vai trò | Request (Header/Query/Body) | Response (Data fields) | Phân trang / Lọc | Mã lỗi đặc thù |
|:---:|:---|:---|:---|:---:|:---|:---|:---:|:---|
| 25 | `get_medicalrecords_all` | `GET /api/medicalrecords` | Lấy danh sách hồ sơ khám (Hàng đợi) | Doctor | Query: `status?, patient_id?, page?, limit?` | Array: `[{ medical_record_id, patient_id, assigned_doctor_id, template_id, status, created_at }]` | status, page, limit | 3003, 3103 |
| 26 | `get_medicalrecords_id` | `GET /api/medicalrecords/{id}` | Xem chi tiết 1 hồ sơ bệnh án | Doctor | Path: `id` | `{ medical_record_id, patient_id, assigned_doctor_id, created_by, template_id, status, instructions, completed_at, created_at, updated_at }` | Không | 3003, 4001 |
| 27 | `get_medicalrecords_summary` | `GET /api/medicalrecords/{id}/summary` | Thẻ tóm tắt bệnh án cho danh sách | Doctor | Path: `id` | `{ medical_record_id, status, patient_name, created_at }` | Không | 3003, 4001 |
| 28 | `set_accept_medicalrecords` | `POST /api/medicalrecords/{id}/accept` | Bác sĩ tiếp nhận ca khám | Doctor | Path: `id` | `{ medical_record_id, assigned_doctor_id, status: "in_progress" }` | Không | 3003, 3103, 4001, 4004, 4005 |
| 29 | `get_medicalrecords_answers` | `GET /api/medicalrecords/{id}/answers` | Xem câu trả lời biểu mẫu của bệnh nhân | Doctor | Path: `id` | Array: `[{ id, medical_record_id, question_id, question_option_id, answer_text, answer_value, answered_by, created_at }]` | Không | 3003, 4001 |
| 30 | `add_answers` | `POST /api/medicalrecords/{id}/add_answers` | Thêm câu trả lời bổ sung vào bệnh án | Doctor | Path: `id`, Body: `{ answers: [{ question_id, answer_text?, option_id? }] }` | `{ count: string }` | Không | 3003, 4001, 4003 |
| 31 | `edit_medicalrecords` | `PUT /api/medicalrecords/{id}` | Kết luận khám, cập nhật status, chỉ dẫn | Doctor | Path: `id`, Body: `{ status, instructions? }` | `{ medical_record_id, patient_id, assigned_doctor_id, status, instructions, completed_at, updated_at }` | Không | 3003, 3105, 4001, 4003, 4009 |
| 32 | `edit_status_medicalrecords` | `PATCH /api/medicalrecords/{id}/status` | Đổi trạng thái bệnh án (e.g. cancelled) | Doctor | Path: `id`, Body: `{ status }` | `{ id, status }` | Không | 3003, 4001, 4009 |
| 33 | `search_patients` | `GET /api/patients/search` | Tìm kiếm bệnh nhân theo tên, sđt, năm sinh | Doctor | Query: `keyword?, gender?, min_year?, max_year?, page?, limit?` | Array: `[{ user_id, full_name, phone, gender, year_of_birth, total_records }]` | keyword, gender, min_year, max_year, page, limit | 3003, 3103 |
| 34 | `create_patient` | `POST /api/patients` | Bác sĩ/lễ tân tạo hồ sơ bệnh nhân mới | Doctor | Body: `{ full_name, phone, password, gender?, year_of_birth?, career?, ethnic?, hamlet_address?, commune_address?, city_address?, work_place?, health_insurance_number?, health_insurance_validate?, next_of_kin_name?, next_of_kin_phone? }` | Object Profile đầy đủ của bệnh nhân mới tạo | Không | 2001, 2004, 3006 |
| 35 | `set_prescription` | `POST /api/prescriptions` | Bác sĩ kê đơn thuốc điện tử | Doctor | Body: `{ medical_record_id, note?, items: [{ medicine_name, dosage?, frequency?, duration?, instruction? }] }` | `{ prescription_id, medical_record_id, created_by, note, items: [{ prescription_item_id, medicine_name, dosage, frequency, duration, instruction, created_at }] }` | Không | 2001, 4001, 8001, 8002, 8003 |
| 36 | `set_lab_request` | `POST /api/lab_requests` | Tạo yêu cầu xét nghiệm cận lâm sàng | Doctor | Body: `{ medical_record_id, note?, items: [{ test_name, description? }] }` | `{ id, medical_record_id, requested_by, status: "pending", note, items: [{ id, test_name, description, created_at }] }` | Không | 2001, 4001, 8101, 8102 |
| 37 | `get_lab_results` | `GET /api/lab_requests/{record_id}` | Xem danh sách & kết quả xét nghiệm | Doctor/Patient | Path: `record_id` | Array: `[{ id, requested_by, status, note, items: [{ id, test_name, result_id?, result_value?, concluded_by?, result_note?, created_at }] }]` | Không | 3003, 8103 |
| 38 | `export_ai_bounding_box` | `POST /api/ai/bounding_box` | Phân tích ảnh da & xuất bounding box AI | Doctor | Multipart Form: `image (file)` | Luồng nhị phân binary stream `image/jpeg` | Không | 6001, 6002, 9001, 9002 |

---

## 4. PHÂN NHÓM 3: QUẢN TRỊ HỆ THỐNG (ADMIN APIS)

| STT | Tên API | Method & Path | Mục đích | Vai trò | Request (Header/Query/Body) | Response (Data fields) | Phân trang / Lọc | Mã lỗi đặc thù |
|:---:|:---|:---|:---|:---:|:---|:---|:---:|:---|
| 39 | `create_staff` | `POST /api/auth/create_staff` | Tạo tài khoản nhân viên y tế | Admin | Body: `{ full_name, phone, password, gender?, role_id, branch_id, department_id, room_id? }` | `{ user_id, full_name, role_id, branch_id, department_id }` | Không | 2001, 2004, 3006, 3102 |
| 40 | `set_user` | `POST /api/users` | Admin tạo tài khoản người dùng chung | Admin | Body: `{ full_name, phone, password, gender?, role_id, is_active? }` | `{ user_id, full_name, phone, role_id, is_active }` | Không | 2001, 2004, 3006, 3102 |
| 41 | `get_list_users` | `GET /api/users` | Danh sách tài khoản người dùng (phân trang) | Admin | Query: `page?, limit?, role_id?` | Array: `[{ user_id, full_name, phone, role_id, is_active }]`, `total` | page, limit, role_id | 3003, 3102 |
| 42 | `get_user_detail` | `GET /api/users/{id}` | Chi tiết 1 tài khoản người dùng | Admin | Path: `id` | Profile chi tiết của user (bệnh nhân hoặc nhân viên) | Không | 3003, 3007, 3102 |
| 43 | `edit_user` | `PUT /api/users/{id}` | Sửa thông tin & vai trò người dùng | Admin | Path: `id`, Body: `{ full_name?, gender?, role_id?, is_active? }` | Object user sau cập nhật | Không | 3003, 3007, 3102 |
| 44 | `delete_user` | `DELETE /api/users/{id}` | Xóa tài khoản người dùng | Admin | Path: `id` | `{}` | Không | 3003, 3007, 3102 |
| 45 | `assign_staff` | `PUT /api/staffs/{id}/assign` | Phân công nhân viên vào chi nhánh/khoa/phòng | Admin | Path: `id`, Body: `{ branch_id, department_id, room_id? }` | `{ user_id, branch_id, department_id, room_id }` | Không | 2001, 3102 |
| 46 | `delete_medicalrecords` | `DELETE /api/medicalrecords/{id}` | Xóa hồ sơ bệnh án (Admin) | Admin | Path: `id` | `{}` | Không | 3003, 3102, 4001 |
| 47 | `set_branch` | `POST /api/branches` | Tạo mới chi nhánh | Admin | Body: `{ name, address, phone }` | `{ id, name, address, phone, created_at, updated_at }` | Không | 2001, 3102 |
| 48 | `get_list_branches` | `GET /api/branches` | Danh sách các chi nhánh | Admin/All | Header: Auth | Array: `[{ id, name, address, phone, is_active }]` | Không | 3003 |
| 49 | `get_branch_detail` | `GET /api/branches/{id}` | Chi tiết chi nhánh | Admin/All | Path: `id` | `{ id, name, address, phone, created_at, updated_at }` | Không | 3003, 4001 |
| 50 | `edit_branch` | `PUT /api/branches/{id}` | Cập nhật chi nhánh | Admin | Path: `id`, Body: `{ name?, address?, phone? }` | `{ id, name, address, phone, ... }` | Không | 3003, 3102 |
| 51 | `delete_branch` | `DELETE /api/branches/{id}` | Xóa chi nhánh | Admin | Path: `id` | `{}` | Không | 3003, 3102 |
| 52 | `set_department` | `POST /api/departments` | Tạo mới chuyên khoa/phòng ban | Admin | Body: `{ name, description?, branch_id }` | Array: `[{ id, name, branch_id, description, created_at }]` | Không | 2001, 3102 |
| 53 | `get_list_departments` | `GET /api/departments` | Danh sách khoa/phòng ban | Admin/All | Query: `branch_id?` | Array: `[{ id, name, branch_id, description }]` | branch_id | 3003 |
| 54 | `get_department_detail` | `GET /api/departments/{id}` | Chi tiết khoa/phòng ban | Admin/All | Path: `id` | `{ id, name, description, branch_id, created_at, updated_at }` | Không | 3003 |
| 55 | `edit_department` | `PUT /api/departments/{id}` | Cập nhật khoa/phòng ban | Admin | Path: `id`, Body: `{ name?, description?, branch_id? }` | `{ id, name, description, branch_id, ... }` | Không | 3003, 3102 |
| 56 | `delete_department` | `DELETE /api/departments/{id}` | Xóa khoa/phòng ban | Admin | Path: `id` | `{}` | Không | 3003, 3102 |
| 57 | `set_room` | `POST /api/rooms` | Thêm mới phòng khám | Admin | Body: `{ name, description?, department_id }` | `{ id, name, department_id, description, created_at }` | Không | 2001, 3102 |
| 58 | `get_list_rooms` | `GET /api/rooms` | Danh sách phòng khám | Admin/All | Query: `department_id?` | Array: `[{ id, name, department_id, description, created_at }]` | department_id | 3003 |
| 59 | `get_room_detail` | `GET /api/rooms/{id}` | Chi tiết phòng khám | Admin/All | Path: `id` | `{ id, name, description, department_id, created_at, updated_at }` | Không | 3003 |
| 60 | `edit_room` | `PUT /api/rooms/{id}` | Cập nhật phòng khám | Admin | Path: `id`, Body: `{ name?, description?, department_id? }` | `{ id, name, description, department_id, ... }` | Không | 3003, 3102 |
| 61 | `delete_room` | `DELETE /api/rooms/{id}` | Xóa phòng khám | Admin | Path: `id` | `{}` | Không | 3003, 3102 |
| 62 | `set_role` | `POST /api/roles` | Thêm vai trò mới | Admin | Body: `{ name, description?, parent_role_id? }` | `{ id, name, description, parent_role_id }` | Không | 2001, 3102 |
| 63 | `get_list_roles` | `GET /api/roles` | Lấy danh sách tất cả vai trò | Admin | Header: Auth | Array: `[{ id, name, description }]` | Không | 3003, 3102 |
| 64 | `set_permission` | `POST /api/permissions` | Thêm quyền thao tác mới | Admin | Body: `{ name, description? }` | `{ id, name, description }` | Không | 2001, 3102 |
| 65 | `get_list_permissions` | `GET /api/permissions` | Liệt kê tất cả quyền thao tác | Admin | Header: Auth | Array: `[{ id, name, description, created_at, updated_at }]` | Không | 3003, 3102 |
| 66 | `edit_permission` | `PUT /api/permissions/{id}` | Sửa quyền thao tác | Admin | Path: `id`, Body: `{ name?, description? }` | `{ id, name, description, created_at, updated_at }` | Không | 3003, 3102 |
| 67 | `delete_permission` | `DELETE /api/permissions/{id}` | Xóa quyền thao tác | Admin | Path: `id` | `{}` | Không | 3003, 3102 |
| 68 | `set_role_permissions` | `POST /api/roles/permissions` | Gán nhiều quyền cho một vai trò | Admin | Body: `{ role_id, permissions: [1, 2, 3] }` | `{}` | Không | 2001, 3102 |
| 69 | `get_role_permissions` | `GET /api/roles/{role_id}/permissions` | Xem quyền đã gán cho vai trò | Admin | Path: `role_id` | Array: `[{ role_permission_id, permission_id, name, description, assigned_at }]` | Không | 3003, 3102 |
| 70 | `delete_role_permission` | `DELETE /api/roles/{role_id}/permissions/{permission_id}` | Thu hồi quyền khỏi vai trò | Admin | Path: `role_id`, `permission_id` | `{}` | Không | 3003, 3102 |
| 71 | `set_template` | `POST /api/templates` | Khởi tạo mẫu phiếu khám gốc | Admin | Body: `{ code_template, name, description?, version?, is_active? }` | `{ code_template, name, description, version, is_active, created_at, updated_at }` | Không | 2001, 4102 |
| 72 | `get_list_templates` | `GET /api/templates` | Danh sách mẫu phiếu khám (phân trang) | Admin/Doctor | Query: `page?, limit?` | Array: `[{ code_template, name, description, version, is_active, created_at }]` | page, limit | 3003 |
| 73 | `get_template_detail` | `GET /api/templates/{id}` | Cấu trúc đầy đủ cây biểu mẫu (Sections, Questions, Options) | Admin/Doctor/Patient | Path: `id` | `{ code_template, name, sections: [{ section_id, title, questions: [{ question_id, question_text, type_question, options }] }] }` | Không | 3003, 4101 |
| 74 | `edit_template` | `PUT /api/templates/{id}` | Chỉnh sửa thông tin chung mẫu phiếu | Admin | Path: `id`, Body: `{ name?, description?, version?, is_active? }` | `{ code_template, name, version, is_active }` | Không | 3003, 4101 |
| 75 | `delete_template` | `DELETE /api/templates/{id}` | Xóa mẫu phiếu khám | Admin | Path: `id` | `{}` | Không | 3003, 4101, 4105 |
| 76 | `set_template_section` | `POST /api/templates/{template_id}/sections` | Thêm phần (section) mới vào mẫu | Admin | Path: `template_id`, Body: `{ title, order, is_required?, filled_by? }` | `{ section_id, template_id, title, order, is_required, filled_by }` | Không | 2001, 4101 |
| 77 | `edit_template_section` | `PUT /api/templates/sections/{id}` | Sửa thông tin section | Admin | Path: `id`, Body: `{ title?, order?, is_required?, filled_by? }` | `{ section_id, template_id, title, order, is_required, filled_by }` | Không | 3003, 4103 |
| 78 | `delete_template_section` | `DELETE /api/templates/sections/{id}` | Xóa section | Admin | Path: `id` | `{}` | Không | 3003, 4103 |
| 79 | `set_template_question` | `POST /api/templates/sections/{section_id}/questions` | Thêm câu hỏi & lựa chọn vào section | Admin | Path: `section_id`, Body: `{ question_id, question_text, type_question, placeholder?, order, is_required?, parent_question_id?, show_if_answer?, help_text?, allow_image?, options?: [{ option_text, option_value, order, trigger_image_upload? }] }` | `{ question_id, section_id, question_text, type_question, options: [{ id, option_text, option_value }] }` | Không | 2001, 4103, 4104 |
| 80 | `edit_template_question` | `PUT /api/templates/questions/{id}` | Sửa nội dung & cấu trúc lựa chọn câu hỏi | Admin | Path: `id`, Body: `{ question_text?, placeholder?, order?, show_if_answer?, options?: [{ id?, option_text, option_value }] }` | `{ question_id, section_id, question_text, type_question, options }` | Không | 3003, 4104 |
| 81 | `delete_template_question` | `DELETE /api/templates/questions/{id}` | Xóa câu hỏi | Admin | Path: `id` | `{}` | Không | 3003, 4104 |

---

## 5. PHÂN NHÓM 4: DÙNG CHUNG (COMMON / AUTH / MEDIA / NOTIFICATIONS)

| STT | Tên API | Method & Path | Mục đích | Vai trò | Request (Header/Query/Body) | Response (Data fields) | Phân trang / Lọc | Mã lỗi đặc thù |
|:---:|:---|:---|:---|:---:|:---|:---|:---:|:---|
| 82 | `signup` | `POST /api/auth/signup` | Đăng ký tài khoản người dùng mới | Public | Body: `{ full_name, phone, password, gender? }` | `{ user_id, full_name, phone, gender, role_id, is_active, created_at }` | Không | 2001, 2004, 2005, 3006 |
| 83 | `login` | `POST /api/auth/login` | Đăng nhập hệ thống, trả về Token | Public | Body: `{ phone, password }` | `{ token, user_info: { user_id, full_name, phone, role_id } }` | Không | 2001, 2004, 3007, 3008 |
| 84 | `logout` | `POST /api/auth/logout` | Đăng xuất, hủy phiên/Token | Auth | Header: `Authorization: Bearer <token>` | `{}` | Không | 3001, 3003 |
| 85 | `forgot_password` | `POST /api/auth/forgot_password` | Quên mật khẩu, gửi mã OTP | Public | Body: `{ phone }` | `{}` | Không | 2001, 2004, 3007 |
| 86 | `reset_password` | `POST /api/auth/reset_password` | Nhập mã OTP và mật khẩu mới | Public | Body: `{ phone, otp, new_password }` | `{}` | Không | 2001, 3004, 3005 |
| 87 | `change_password` | `POST /api/auth/change_password` | Đổi mật khẩu tài khoản đang đăng nhập | Auth | Body: `{ old_password, new_password, confirm_password }` | `{}` | Không | 2001, 3008, 3009 |
| 88 | `set_image_attachments` | `POST /api/image_attachments` | Upload 1 file ảnh (Multipart) | Auth | Form-Data: `file (file), medical_record_id?, question_id?, media_type?, category?, description?` | `{ id, user_id, medical_record_id, question_id, file_path, file_url, file_name, file_type, created_at }` | Không | 6001, 6002, 6003, 6007 |
| 89 | `set_multiple_image_attachments` | `POST /api/image_attachments/multiple` | Upload tối đa 10 file ảnh cùng lúc | Auth | Form-Data: `images (files[]), user_id` | `total: number, data: [{ id, file_url }]` | Không | 6001, 6002, 6003, 6004, 6007 |
| 90 | `get_image_attachments_user` | `GET /api/image_attachments/user/{user_id}` | Danh sách ảnh đã upload của user | Auth | Path: `user_id` | Array: `[{ id, medical_record_id, question_id, file_url, file_type, created_at }]` | Không | 3003, 3106 |
| 91 | `get_image_attachments_view` | `GET /api/image_attachments/{id}/view` | Xem trực tiếp luồng ảnh binary | Public/Auth | Path: `id` | Stream nhị phân `image/png` hoặc `image/jpeg` | Không | 6005 |
| 92 | `delete_image_attachments` | `DELETE /api/image_attachments/{id}` | Xóa tệp ảnh đính kèm | Auth | Path: `id` | `{}` | Không | 3003, 6005 |
| 93 | `set_answer_image` | `POST /api/answers/images` | Gắn 1 ảnh vào câu trả lời | Auth | Body: `{ answer_id, attachment_id, option_value? }` | `{ id, answer_id, attachment_id, option_value, created_at }` | Không | 2001, 6005, 6006 |
| 94 | `set_multiple_answer_images` | `POST /api/answers/multiple_images` | Gắn nhiều ảnh vào câu trả lời | Auth | Body: `{ answer_id, attachments: [{ attachment_id }] }` | `total, data: [{ id, answer_id, attachment_id }]` | Không | 2001, 6005, 6006 |
| 95 | `get_answer_images` | `GET /api/answers/{answer_id}/images` | Lấy danh sách ảnh của câu trả lời | Auth | Path: `answer_id` | Array: `[{ id, option_value, attachment: { attachment_id, file_url, file_name } }]` | Không | 3003 |
| 96 | `delete_answer_image` | `DELETE /api/answers/images/{id}` | Gỡ ảnh khỏi câu trả lời | Auth | Path: `id` | `{}` | Không | 3003 |
| 97 | `set_devtoken` | `POST /api/notifications/fcm_token` | Đăng ký FCM token nhận push noti | Auth | Body: `{ fcm_token, device_type: "android"\|"ios"\|"web" }` | `{ id, user_id, fcm_token, device_type, created_at }` | Không | 2001, 9101 |
| 98 | `get_notification` | `GET /api/notifications` | Lấy danh sách thông báo của user | Auth | Query: `page?, limit?` | Array: `[{ id, user_id, title, body, type, avatar?, reference_id?, is_read, created_at }]` | page, limit | 3003 |
| 99 | `set_read_notification` | `PUT /api/notifications/{id}/read` | Đánh dấu 1 thông báo đã đọc | Auth | Path: `id` | Chi tiết notification sau cập nhật (`is_read: "1"`) | Không | 3003, 9102 |
| 100 | `set_read_all_notifications` | `PUT /api/notifications/read_all` | Đánh dấu tất cả thông báo đã đọc | Auth | Header: Auth | `{}` | Không | 3003 |
| 101 | `delete_notification` | `DELETE /api/notifications/{id}` | Xóa thông báo | Auth | Path: `id` | `{}` | Không | 3003, 9102 |
