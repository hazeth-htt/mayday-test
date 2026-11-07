# BẢN ĐỒ HIỆN TRẠNG GIAO DIỆN PHÂN HỆ BỆNH NHÂN (02-UI-PATIENT)
**Dự án:** Hệ thống Quản lý Bệnh án DrMayDay — Bệnh viện Da liễu Trung ương  
**Agent thực hiện:** A2 — `ui-mapper-patient`  
**Ngày thực hiện:** 08/11/2026  

---

## 1. TỔNG QUAN CÁC MÀN HÌNH BỆNH NHÂN

| Màn hình | Route URL | File Component | Trạng thái kết nối API | Mức độ phụ thuộc Mock Data |
|:---|:---|:---|:---:|:---:|
| **Trang chủ Bệnh nhân** | `/patient/home` | `patient-home.component.ts` | Chưa kết nối | 100% Mock (`u-pat-01`, signal in-memory) |
| **Sàng lọc Khẩn cấp** | `/patient/emergency` | `emergency-screening.component.ts` | Chưa kết nối | Hardcode câu hỏi cờ đỏ & thời gian bệnh |
| **Khai bệnh Bệnh sử** | `/patient/intake` | `dynamic-intake.component.ts` | Chưa kết nối | Hardcode template `tmpl03`, hardcode `rec-001` |
| **Nhật ký Chấm điểm UAS7** | `/patient/uas7` | `uas7-scoring.component.ts` | Chưa kết nối | Ghi in-memory signal `createUAS7Score` |
| **Nhật ký Đợt tổn thương** | `/patient/lesions` | `lesion-tracker.component.ts` | Chưa kết nối | Mock đường dẫn ảnh `./images/cards/card-01.jpg` |
| **Hồ sơ Cá nhân** | `/patient/profile` | `patient-profile.component.ts` | Chưa kết nối | 100% Hardcode thông tin `Nguyễn Thị Mai` |

---

## 2. CHI TIẾT TỪNG MÀN HÌNH & ĐỐI CHIẾU API

### 2.1. Màn hình: Trang chủ Bệnh nhân (`/patient/home`)
* **File:** [`patient-home.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/patient/patient-home/patient-home.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Lời chào bệnh nhân (lấy từ `auth.currentUser().full_name`).
  * Trạng thái chấm điểm hôm nay (Đã chấm hay Chưa chấm).
  * Điểm sẩn (0-3), điểm ngứa (0-3) hôm nay.
  * Xu hướng điểm 7 ngày gần nhất (thanh bar trực quan).
  * Tổng điểm tuần (0 - 42) và nhãn mức độ: Kiểm soát tốt, Nhẹ, Vừa, Nặng.
  * Thông tin đợt khám gần nhất (`recentRecord`): Ngày khám, Bác sĩ phụ trách, Trạng thái hồ sơ.
  * Đơn thuốc hiện tại: Danh sách thuốc, liều lượng, cách uống, lời dặn.
* **Dữ liệu đang Mock / Hardcode:**
  * Hardcode ID bệnh nhân `patientId = 'u-pat-01'` trong code TS.
  * Lọc dữ liệu hồ sơ khám từ `drmayday.records()` in-memory.
  * Tự tính tổng tuần `weeklyTotal` và điểm trung bình `weeklyAvg` bằng JavaScript client thay vì lấy từ backend.
* **Hành động người dùng:**
  * Nút "Đánh giá ngay hôm nay" ➔ Chuyển hướng sang `/patient/uas7`.
  * Nút "Chụp ảnh tổn thương" ➔ Chuyển hướng sang `/patient/lesions`.
  * Nút "Xem lại hướng dẫn" ➔ Mở modal hoặc cuộn xem đơn thuốc.
* **API thực tế cần gọi (Theo `/api-spec`):**
  * `GET /api/uas7scores/week?patient_id={id}`: Lấy `week_score`, `severity_label`, `completed_days`.
  * `GET /api/uas7scores/patient/{id}`: Lấy danh sách điểm các ngày gần nhất.
  * `GET /api/medicalrecords/history/{patient_id}`: Lấy danh sách các đợt khám của bệnh nhân.
  * `GET /api/lab_requests/{record_id}`: Xem kết quả xét nghiệm (nếu có).

---

### 2.2. Màn hình: Sàng lọc Khẩn cấp & Phân loại (`/patient/emergency`)
* **File:** [`emergency-screening.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/patient/emergency-screening/emergency-screening.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Bộ 3 câu hỏi báo động đỏ: Khó thở/thở rít; Sưng phù họng/khàn tiếng; Chóng mặt/ngất xỉu.
  * Câu hỏi thời gian mắc bệnh: Dưới 6 tuần (Cấp tính) vs Trên 6 tuần (Mạn tính).
  * Cảnh báo nguy cấp phản vệ: Khóa nút tiếp tục, hiển thị nút gọi 115 và hotline cấp cứu `1900 6951`.
* **Dữ liệu đang Mock / Hardcode:**
  * Toàn bộ câu hỏi sàng lọc được viết cứng trong HTML/TS.
  * Điều hướng sang `/patient/intake` truyền tham số tĩnh qua `queryParams: { duration: ... }`.
* **Hành động người dùng:**
  * Chọn Có/Không cho 3 dấu hiệu nguy cấp.
  * Chọn mốc thời gian bệnh (Dưới 6 tuần / Trên 6 tuần).
  * Bấm "Tiếp tục khai bệnh sử" ➔ Chuyển hướng sang intake form.
  * Bấm "Gọi Cấp cứu 115" (khi có báo động đỏ).
* **API thực tế cần gọi:**
  * `GET /api/medicalrecords/classifyquestions`: Tải động các câu hỏi phân loại bệnh án từ database.
  * `POST /api/medicalrecords/classify`: Gửi câu trả lời `{ answers: [{ question_id, option_value }] }` để backend phân loại ra `template_id` chính xác (ví dụ `TMPL_MAY_DAY_CAP` hoặc `TMPL_MAY_DAY_MAN`).

---

### 2.3. Màn hình: Khai thác Bệnh sử Động (`/patient/intake`)
* **File:** [`dynamic-intake.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/patient/dynamic-intake/dynamic-intake.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Cây câu hỏi động theo từng phân mục (`template.sections`), câu hỏi trắc nghiệm (radio, checkbox), văn bản.
  * Logic rẽ nhánh: Câu hỏi phụ chỉ hiện khi câu cha đạt điều kiện (`shouldShowQuestion`).
  * Mã hồ sơ bệnh án đang kê khai (`recentRecordCode`).
* **Dữ liệu đang Mock / Hardcode:**
  * `this.template = this.drmayday.templates()[0]` (Lấy mẫu đầu tiên từ signal mock).
  * `this.drmayday.saveRecordAnswers('rec-001', this.answers)` (Hardcode mã record `rec-001`).
* **Hành động người dùng:**
  * Chọn phương án trắc nghiệm, nhập văn bản triệu chứng.
  * Bấm "Hoàn tất & Gửi hồ sơ" (`handleSubmitIntake`).
* **API thực tế cần gọi:**
  * `GET /api/templates/{template_id}`: Tải toàn bộ cây section, câu hỏi và lựa chọn của biểu mẫu phân loại.
  * `POST /api/medicalrecords/selfcreate`: Bệnh nhân tự tạo phiên khám mới kèm danh sách câu trả lời ban đầu.
  * `POST /api/medicalrecords/{id}/answers`: Cập nhật/bổ sung câu trả lời cho bệnh án đã tạo.

---

### 2.4. Màn hình: Nhật ký Chấm điểm UAS7 (`/patient/uas7`)
* **File:** [`uas7-scoring.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/patient/uas7-scoring/uas7-scoring.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Bộ chọn ngày chấm điểm (Mặc định hôm nay).
  * Câu 1: Số lượng nốt sẩn trong 24 giờ qua (Thang điểm 0 - 3).
  * Câu 2: Mức độ ngứa trong 24 giờ qua (Thang điểm 0 - 3).
  * Ghi chú bổ sung (yếu tố nghi ngờ kích hoạt).
  * Điểm tổng trong ngày tự tính: `dailyScore = iss7 + hss7` (0 - 6 điểm).
  * Biểu đồ xu hướng điểm theo ngày (ApexCharts).
  * Bảng lịch sử chấm điểm các ngày trước đó.
* **Dữ liệu đang Mock / Hardcode:**
  * Không kiểm tra điều kiện bệnh nhân có đang được phép chấm UAS7 hay không.
  * Không truyền `medical_record_id` khi ghi điểm.
  * Gọi `this.drmayday.createUAS7Score` lưu trực tiếp vào signal mảng cục bộ.
* **Hành động người dùng:**
  * Đổi ngày, chọn mức điểm sẩn, chọn mức điểm ngứa.
  * Nhập ghi chú.
  * Bấm "Lưu Đánh Giá Hôm Nay".
* **API thực tế cần gọi:**
  * `GET /api/uas7scores/eligibility`: Kiểm tra bệnh nhân có bệnh án mạn tính đang active không. Nếu `eligible === "false"`, khóa form và hướng dẫn khám bác sĩ.
  * `POST /api/uas7scores`: Gửi `{ medical_record_id, score_date, iss7, hss7, note }`.
  * `GET /api/uas7scores/patient/{patient_id}`: Tải lại lịch sử chấm điểm để cập nhật biểu đồ và bảng.

---

### 2.5. Màn hình: Nhật ký Đợt Tổn thương & Kho Ảnh 3 Mốc (`/patient/lesions`)
* **File:** [`lesion-tracker.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/patient/lesion-tracker/lesion-tracker.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Danh sách các đợt bùng phát tổn thương đã ghi nhận.
  * Chi tiết vị trí cơ thể (Body Map), mốc thời gian xuất hiện, thuốc đã uống.
  * Bộ ảnh 3 mốc tiến triển: Khởi phát (`start`), Đỉnh điểm (`peak`), Thoái lui (`normal`).
  * Điểm triệu chứng đi kèm ảnh: Ngứa (0-10), Đau (0-10), Rát (0-10).
  * Kết quả AI nhận diện (Số nốt sẩn, chỉ số AUAS, ảnh khoanh vùng).
* **Dữ liệu đang Mock / Hardcode:**
  * Ảnh chụp sử dụng file tĩnh `./images/cards/card-01.jpg`.
  * Tự sinh ID client dạng `loc-${Date.now()}` và `ph-${Date.now()}`.
  * Chỉ số AI và số nốt sẩn gán cứng (`hives_count: 12, auas_score: 2.8`).
* **Hành động người dùng:**
  * Nhập thời điểm phát tác, vị trí cơ thể, bối cảnh, thuốc đã dùng.
  * Chọn mốc (Khởi phát / Đỉnh điểm / Thoái lui), kéo thanh trượt điểm ngứa/đau/rát.
  * Bấm "Lưu đợt tổn thương".
* **API thực tế cần gọi:**
  * `POST /api/lesion_episodes`: Tạo đợt tổn thương.
  * `POST /api/lesion_locations`: Thêm vị trí cơ thể.
  * `POST /api/image_attachments`: Upload tệp ảnh chụp thật (Multipart/form-data).
  * `POST /api/lesion_photos`: Gắn ảnh vào vị trí với mốc milestone và điểm ngứa/đau/rát.
  * `POST /api/ai/bounding_box`: Gửi ảnh để AI trả về ảnh chú thích nốt sẩn.
  * `GET /api/lesion_episodes/my`: Lấy danh sách đợt tổn thương của bệnh nhân.

---

### 2.6. Màn hình: Hồ sơ Cá nhân Y tế (`/patient/profile`)
* **File:** [`patient-profile.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/patient/patient-profile/patient-profile.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Thông tin hành chính: Họ tên, Số điện thoại, Email, Ngày sinh, Giới tính, CCCD.
  * Địa chỉ liên hệ: Thôn/xóm, Xã/phường, Tỉnh/thành phố, Nơi làm việc.
  * Thông tin BHYT: Số thẻ BHYT, Hạn thẻ.
  * Người liên hệ khẩn cấp: Tên người nhà, Số điện thoại.
* **Dữ liệu đang Mock / Hardcode:**
  * 100% dữ liệu cứng trong biến `user` của component.
  * Nút "Lưu Thay Đổi" chỉ hiển thị thông báo alert timeout mà không lưu vào đâu.
* **Hành động người dùng:**
  * Chỉnh sửa các trường thông tin.
  * Bấm "Cập Nhật Hồ Sơ".
* **API thực tế cần gọi:**
  * `GET /api/users/info`: Tải thông tin cá nhân của bệnh nhân đăng nhập.
  * `PUT /api/users/info`: Cập nhật các trường thông tin (lưu ý mapping: `year_of_birth`, `hamlet_address`, `commune_address`, `city_address`, `health_insurance_number`, `next_of_kin_name`, `next_of_kin_phone`).
