# BẢN ĐỒ HIỆN TRẠNG GIAO DIỆN PHÂN HỆ BÁC SĨ (02-UI-DOCTOR)
**Dự án:** Hệ thống Quản lý Bệnh án DrMayDay — Bệnh viện Da liễu Trung ương  
**Agent thực hiện:** A3 — `ui-mapper-doctor`  
**Ngày thực hiện:** 08/11/2026  

---

## 1. TỔNG QUAN CÁC MÀN HÌNH BÁC SĨ

| Màn hình | Route URL | File Component | Trạng thái kết nối API | Mức độ phụ thuộc Mock Data |
|:---|:---|:---|:---:|:---:|
| **Hàng Đợi Ca Khám** | `/doctor/queue` | `waiting-queue.component.ts` | Chưa kết nối | 100% Mock (`drmayday.records()`) |
| **Khám Lâm Sàng & Kết Luận** | `/doctor/consultation/:id` | `consultation.component.ts` | Chưa kết nối | Mock hồ sơ `rec-001`, signal in-memory |
| **Tìm kiếm / Tra cứu Bệnh nhân** | *(Chưa có màn hình riêng)* | *(Thiếu UI)* | Có API trong spec | Chưa xây dựng UI tìm kiếm bệnh nhân |
| **Tạo Bệnh nhân mới (Lễ tân/BS)** | *(Chưa có màn hình riêng)* | *(Thiếu UI)* | Có API trong spec | Chưa xây dựng UI tạo bệnh nhân |

---

## 2. CHI TIẾT TỪNG MÀN HÌNH & ĐỐI CHIẾU API

### 2.1. Màn hình: Hàng Đợi Ca Khám Lâm Sàng (`/doctor/queue`)
* **File:** [`waiting-queue.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/doctor/waiting-queue/waiting-queue.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Thống kê tổng số ca: Chờ khám, Đang khám, Đã khám xong.
  * Bộ lọc trạng thái tab: Tất cả, Chờ khám (`pending`), Đang khám (`in_progress`), Đã hoàn tất (`completed`).
  * Bảng danh sách ca khám:
    * Mã bệnh án (e.g. `BA-2026-0891`).
    * Thông tin bệnh nhân: Họ tên, Năm sinh, Giới tính, Số điện thoại.
    * Phân loại lâm sàng: Mày đay cấp tính vs Mày đay mạn tính.
    * Lý do khám / Triệu chứng chính.
    * Bác sĩ phụ trách.
    * Nút hành động: "Tiếp Nhận Ca Khám" (khi ở trạng thái `pending`) hoặc "Vào Khám" (khi đã tiếp nhận).
* **Dữ liệu đang Mock / Hardcode:**
  * Lấy danh sách từ signal `drmayday.records()` in-memory.
  * Tiếp nhận ca khám bằng cách gọi `drmayday.assignDoctorToRecord()` cập nhật state trong RAM.
  * Chưa có phân trang (`page`, `limit`), chưa có ô tìm kiếm lọc bệnh nhân theo từ khóa hay ngày khám.
* **Hành động người dùng:**
  * Chuyển tab lọc trạng thái ca khám.
  * Bấm "Tiếp Nhận Ca Khám" ➔ Chuyển trạng thái sang `in_progress` và gán tên Bác sĩ.
  * Bấm "Vào Khám" ➔ Chuyển hướng sang `/doctor/consultation/{record.id}`.
* **API thực tế cần gọi (Theo `/api-spec`):**
  * `GET /api/medicalrecords`: Lấy danh sách bệnh án, truyền tham số query `status`, `page`, `limit`.
  * `POST /api/medicalrecords/{id}/accept`: Bác sĩ tiếp nhận ca khám (Backend tự trích xuất `assigned_doctor_id` từ Token, chuyển trạng thái thành `in_progress`).

---

### 2.2. Màn hình: Bàn Khám & Kết Luận Điều Trị (`/doctor/consultation/:id`)
* **File:** [`consultation.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/doctor/consultation/consultation.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Header ca khám: Mã bệnh án, Họ tên bệnh nhân, Tuổi, Giới tính, Phòng khám phụ trách, Trạng thái ca khám.
  * Hệ thống 5 Tab chuyên môn:
    1. **Tab Phiếu Khảo Sát (`form`):** Cây câu trả lời bệnh sử mà bệnh nhân đã kê khai ban đầu (kèm các câu hỏi bác sĩ cần khai thác thêm).
    2. **Tab Thang Điểm UAS7 (`uas7`):** Biểu đồ đa đường (Sẩn, Ngứa, Điểm ngày 0-6), lịch sử 7 ngày gần nhất, đánh giá hoạt tính bệnh.
    3. **Tab Ảnh Tổn Thương & AI (`lesions`):** Thư viện ảnh theo 3 mốc (Khởi phát, Đỉnh điểm, Thoái lui), kết quả nhận diện nốt sẩn và chỉ số AUAS.
    4. **Tab Đơn Thuốc Điện Tử (`rx`):** Danh sách thuốc đã kê (Tên thuốc, Hàm lượng, Số lượng, Đơn vị, Cách dùng), nút "Thêm Thuốc Mới".
    5. **Tab Cận Lâm Sàng (`lab`):** Danh sách xét nghiệm đã chỉ định (Tổng phân tích máu, IgE toàn phần...), trạng thái kết quả, chỉ số đo được và cảnh báo bất thường.
  * Khu vực Kết luận Lâm sàng:
    * Ô nhập "Chẩn đoán xác định" (Bắt buộc).
    * Ô nhập "Lời dặn & Chỉ dẫn điều trị".
    * Nút bấm "Chốt Hoàn Tất Ca Khám" (kèm cảnh báo xác nhận trước khi khóa hồ sơ).
* **Dữ liệu đang Mock / Hardcode:**
  * `this.recordId = params.get('id') || 'rec-001'`.
  * Đọc dữ liệu từ `drmayday.getRecordDetails(this.recordId)` in-memory.
  * Thêm thuốc vào đơn thuốc bằng cách push vào mảng `prescription.items` in-memory.
  * Chưa kết nối với API tạo xét nghiệm `set_lab_request` hoặc xem kết quả `get_lab_results`.
  * Kết luận ca khám gọi `drmayday.completeMedicalRecord()` chỉ đổi state trong RAM.
* **Hành động người dùng:**
  * Chuyển đổi giữa 5 tabs dữ liệu.
  * Mở modal "Thêm Thuốc Vào Đơn", nhập tên thuốc, liều lượng, số lượng, hướng dẫn uống ➔ Bấm lưu.
  * Nhập Chẩn đoán xác định và Lời dặn.
  * Bấm "Chốt Hoàn Tất Ca Khám".
* **API thực tế cần gọi:**
  * `GET /api/medicalrecords/{id}`: Tải thông tin chung hồ sơ bệnh án.
  * `GET /api/medicalrecords/{id}/answers`: Tải danh sách câu trả lời biểu mẫu của bệnh nhân.
  * `POST /api/medicalrecords/{id}/add_answers`: Bác sĩ bổ sung các câu trả lời chuyên môn.
  * `GET /api/uas7scores/patient/{patient_id}`: Lấy điểm UAS7 để vẽ biểu đồ và phân tích hoạt tính.
  * `GET /api/lesion_photos/by_location/{location_id}`: Tải ảnh tổn thương thực tế.
  * `POST /api/prescriptions`: Kê đơn thuốc mới `{ medical_record_id, note, items: [...] }`.
  * `POST /api/lab_requests`: Tạo chỉ định cận lâm sàng `{ medical_record_id, note, items: [...] }`.
  * `GET /api/lab_requests/{record_id}`: Lấy kết quả xét nghiệm cập nhật từ phòng lab.
  * `PUT /api/medicalrecords/{id}`: Hoàn tất ca khám `{ status: "completed", instructions: "..." }`.

---

### 2.3. Các Tính Năng Bác Sĩ Còn Thiếu Giao Diện (UI Missing - Type B)
Dựa trên đối chiếu `/api-spec`, phía backend cung cấp 2 API dành cho Bác sĩ / Nhân viên tiếp đón nhưng frontend hiện chưa có giao diện:
1. **Tìm kiếm Bệnh nhân (`GET /api/patients/search`):**
   * *Mục đích:* Bác sĩ tra cứu nhanh bệnh nhân theo tên, số điện thoại, năm sinh để xem lại lịch sử hoặc tạo bệnh án mới.
   * *Đề xuất:* Bổ sung ô tìm kiếm nhanh (Search Bar) ngay trên trang Hàng đợi `/doctor/queue`.
2. **Khởi tạo Bệnh nhân mới (`POST /api/patients`):**
   * *Mục đích:* Tiếp nhận bệnh nhân vãng lai lần đầu đến khám tại phòng khám Da liễu.
   * *Đề xuất:* Bổ sung nút modal "Thêm Bệnh Nhân Mới" trên thanh công cụ của Bác sĩ.
