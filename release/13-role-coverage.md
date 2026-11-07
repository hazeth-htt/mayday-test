# ĐÁNH GIÁ ĐỘ PHỦ TÁC VỤ THEO VAI TRÒ (13-ROLE-COVERAGE)

> **Dự án:** Hệ thống Quản trị & Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
> **Đơn vị:** Bệnh viện Da liễu Trung ương  
> **Phương pháp:** Mô phỏng kịch bản "Một ngày làm việc điển hình" (A Typical Day in the Life) cho từng đối tượng người dùng.  

---

## 1. VAI TRÒ BỆNH NHÂN (PATIENT JOURNEY)

### Kịch bản "Một ngày của người bệnh mày đay":
*Bệnh nhân Nguyễn Thị Mai (32 tuổi, mắc mày đay mạn tính CSU 2 năm nay) sử dụng ứng dụng web DrMayDay trên điện thoại để quản lý bệnh và tương tác với bác sĩ.*

| STT | Bước tác vụ trong ngày | Thao tác thực tế trên giao diện | Trạng thái kỹ thuật | Đánh giá trọn vẹn |
|:---:|:---|:---|:---:|:---:|
| 1 | **07:00 — Đăng nhập buổi sáng** | Mở web, nhập Số điện thoại `0988776655` và Mật khẩu cá nhân. | Đã hỗ trợ qua `LoginComponent` | **HOÀN THÀNH** |
| 2 | **07:05 — Sàng lọc dấu hiệu sốc** | Trả lời kiểm tra nhanh các dấu hiệu phù thanh quản, nghẹn thở, tụt huyết áp. | Đã hỗ trợ qua `EmergencyScreeningComponent` | **HOÀN THÀNH** |
| 3 | **07:10 — Chấm điểm nhật ký UAS7** | Chọn điểm sẩn phù (0-3) và điểm ngứa ngáy (0-3). Hệ thống tính điểm ngày (0-6). | Đã hỗ trợ qua `Uas7ScoringComponent` (chặn chấm 2 lần) | **HOÀN THÀNH** |
| 4 | **12:00 — Bùng phát cơn mày đay mới** | Xuất hiện đợt sẩn ngứa cấp tính sau bữa trưa, chụp ảnh Mốc 1 (Khởi phát). | Đã hỗ trợ qua `LesionTrackerComponent` | **HOÀN THÀNH** |
| 5 | **14:00 — Chụp ảnh Mốc 2 (Đỉnh điểm)** | Sẩn phù lan rộng toàn thân, mở web chụp tiếp ảnh Mốc 2 đỉnh điểm để gửi bác sĩ. | Đã hỗ trợ upload ảnh thật vào kho lưu trữ | **HOÀN THÀNH** |
| 6 | **16:00 — Chụp ảnh Mốc 3 (Sau dùng thuốc)** | Uống 1 viên Telfast 180mg, sau 2 giờ sẩn lặn bớt, chụp ảnh mốc 3 thuyên giảm. | Đã hỗ trợ lưu trữ theo đúng 3 mốc thời gian | **HOÀN THÀNH** |
| 7 | **18:00 — Khai báo đợt khám mới** | Điền các câu hỏi tiền sử dị nguyên, đợt bùng phát để đăng ký phiên khám trực tuyến. | Đã hỗ trợ qua `DynamicIntakeComponent` (sinh mã `BA-2026-xxx`) | **HOÀN THÀNH** |
| 8 | **19:00 — Xem kết luận & đơn thuốc** | Mở hồ sơ xem đơn thuốc bác sĩ đã kê (liều dùng, dặn dò uống sau ăn) và lịch tái khám. | Đã xem được đơn thuốc từ bác sĩ | **HOÀN THÀNH** |
| 9 | **21:00 — Đổi mật khẩu định kỳ** | Bệnh nhân muốn đổi mật khẩu bảo mật hoặc lấy lại mật khẩu khi quên. | **CHƯA CÓ** màn hình Quên / Đổi mật khẩu | ⚠️ **CHƯA TRỌN VẸN (Thiếu REQ-004)** |

---

## 2. VAI TRÒ BÁC SĨ (DOCTOR JOURNEY)

### Kịch bản "Một ca làm việc của Bác sĩ điều trị":
*TS.BS. Nguyễn Văn Hùng (Bác sĩ chuyên khoa Dị ứng - Miễn dịch lâm sàng, BV Da liễu TW) tiếp nhận và thăm khám các ca bệnh trong buổi sáng.*

| STT | Bước tác vụ trong ca khám | Thao tác thực tế trên giao diện | Trạng thái kỹ thuật | Đánh giá trọn vẹn |
|:---:|:---|:---|:---:|:---:|
| 1 | **07:45 — Đăng nhập phiên làm việc** | Nhập SĐT `0912345678` và Mật khẩu, truy cập phân hệ Bác sĩ. | Đã hỗ trợ qua `LoginComponent` | **HOÀN THÀNH** |
| 2 | **08:00 — Kiểm tra Hàng đợi ca khám** | Xem danh sách ca khám trực tuyến, lọc theo "Chờ tiếp nhận", tìm bệnh nhân theo tên. | Đã hỗ trợ qua `WaitingQueueComponent` | **HOÀN THÀNH** |
| 3 | **08:05 — Tiếp nhận ca khám (Accept)** | Bấm "Tiếp nhận ca khám" bệnh nhân Nguyễn Thị Mai, chuyển trạng thái sang "Đang khám". | Đã kết nối API `POST /medicalrecords/:id/accept` | **HOÀN THÀNH** |
| 4 | **08:10 — Khai thác dữ liệu tự khai** | Xem Tab 1: Đọc nhanh các triệu chứng bệnh nhân đã điền từ trước (không cần hỏi lại từ đầu). | Đã hiển thị đầy đủ câu trả lời động | **HOÀN THÀNH** |
| 5 | **08:15 — Đánh giá thang điểm UAS7** | Xem Tab 2: Xem đồ thị biến thiên điểm sẩn phù vs ngứa 7 ngày, tổng điểm tuần 28/42 (Mức độ nặng). | Đã tích hợp biểu đồ ApexCharts trực quan | **HOÀN THÀNH** |
| 6 | **08:20 — So sánh ảnh 3 mốc tổn thương** | Xem Tab 3: Đối chiếu ảnh Khởi phát &rarr; Đỉnh điểm &rarr; Sau dùng thuốc, xem kích thước nhận diện AI. | Đã tích hợp thư viện ảnh lâm sàng 3 mốc | **HOÀN THÀNH** |
| 7 | **08:25 — Kê đơn thuốc điện tử** | Xem Tab 4: Kê đơn Fexofenadine 180mg (1 viên/ngày x 14 ngày) + Kem dưỡng ẩm phục hồi da. | Đã kết nối API `POST /api/prescriptions` | **HOÀN THÀNH** |
| 8 | **08:30 — Chỉ định cận lâm sàng** | Xem Tab 5: Chỉ định xét nghiệm định lượng IgE toàn phần và công thức máu. | Đã kết nối API `POST /api/lab_requests` | **HOÀN THÀNH** |
| 9 | **08:35 — Kết luận & Chốt hoàn tất ca** | Nhập chẩn đoán xác định "Mày đay mạn tính tự phát (CSU)", ghi lời dặn và bấm "Chốt Hoàn Tất Bệnh Án". | Đã gọi `POST /medicalrecords/:id/complete` (khóa sửa) | **HOÀN THÀNH** |
| 10 | **08:40 — In đơn thuốc / bệnh án giấy** | Bác sĩ muốn in đơn thuốc ra máy in A4 để bệnh nhân cầm ra quầy thuốc viện. | **CHƯA CÓ** nút In đơn thuốc / CSS print chuyên biệt | ⚠️ **CHƯA TRỌN VẸN (Đề xuất P-FLOW-02)** |
| 11 | **11:30 — Tự động khóa màn hình** | Bác sĩ đi hội chẩn đột xuất 30 phút mà quên đăng xuất máy tính phòng khám. | **CHƯA CÓ** Idle Timeout tự khóa bảo vệ dữ liệu PII | ⚠️ **CHƯA TRỌN VẸN (Thiếu REQ-006)** |

---

## 3. VAI TRÒ QUẢN TRỊ VIÊN (ADMIN JOURNEY)

### Kịch bản "Quản trị vận hành hệ thống":
*Kỹ sư Quản trị hệ thống Bệnh viện Da liễu Trung ương vận hành và giám sát nền tảng DrMayDay.*

| STT | Bước tác vụ quản trị | Thao tác thực tế trên giao diện | Trạng thái kỹ thuật | Đánh giá trọn vẹn |
|:---:|:---|:---|:---:|:---:|
| 1 | **08:00 — Giám sát Dashboard toàn viện** | Xem tổng ca khám, số ca chờ tiếp nhận, số phòng khám đang hoạt động trực tuyến. | Đã hỗ trợ qua `AdminDashboardComponent` | **HOÀN THÀNH** |
| 2 | **08:30 — Mở rộng hạ tầng cơ sở** | Thêm phòng khám mới "Phòng 303 - Khám Mày Đay Dị Nguyên" trực thuộc Khoa Dị ứng. | Đã kết nối API `/branches`, `/departments`, `/rooms` | **HOÀN THÀNH** |
| 3 | **09:00 — Tạo tài khoản & Gán nhân sự** | Tạo tài khoản bác sĩ mới và gán phụ trách phòng khám 303 vừa tạo. | Đã kết nối API `POST /staff` và `/staff/:id/assign` | **HOÀN THÀNH** |
| 4 | **10:00 — Cấu hình ma trận phân quyền** | Kiểm tra vai trò "Bác sĩ lâm sàng", gán thêm quyền duyệt kết quả cận lâm sàng. | Đã kết nối API `POST /roles/:id/permissions` | **HOÀN THÀNH** |
| 5 | **14:00 — Cập nhật biểu mẫu khám động** | Thêm phân mục câu hỏi mới "Tiền sử dùng kháng sinh nhóm Beta-lactam" vào phiếu khám mạn tính. | Đã hỗ trợ qua `FormBuilderComponent` (4 tầng) | **HOÀN THÀNH** |
| 6 | **16:30 — Xem Nhật ký hoạt động (Audit Log)** | Quản trị viên muốn kiểm tra lịch sử thao tác của các tài khoản (ai đã chốt bệnh án lúc mấy giờ). | **CHƯA CÓ** màn hình Audit Log trong Frontend | ⚠️ **CHƯA TRỌN VẸN (Chờ Backend cung cấp API log)** |

---

## 4. TỔNG HỢP CÁC KHOẢNG TRỐNG CHƯA TRỌN VẸN

1. **Bệnh nhân:** Thiếu màn hình Quên & Đặt lại mật khẩu (`/forgot-password`).
2. **Bác sĩ:** Thiếu tính năng In đơn thuốc/bệnh án A4 (`@media print`) và thiếu tự động khóa màn hình Idle Timeout 15 phút.
3. **Quản trị viên:** Thiếu màn hình xem Nhật ký kiểm toán hoạt động (Audit Trail / Activity Log).
