# CẨM NANG HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN — DRMAYDAY
*Phân hệ Quản trị Hệ thống — Bệnh viện Da liễu Trung ương*

---

## 1. Bảng điều khiển Quản trị (Admin Dashboard)
- Giám sát tổng thể hoạt động của toàn hệ thống bệnh viện theo thời gian thực:
  - Tổng số ca khám trong ngày / tuần / tháng.
  - Tỷ lệ phân bổ mày đay mạn tính (CSU) và mày đay cấp tính.
  - Số lượng ca kích hoạt "Báo động đỏ" phản vệ.
  - Thời gian xử lý trung bình của bác sĩ trên từng ca bệnh.

---

## 2. Quản lý Hạ tầng & Cơ sở y tế (Topology)
- Thiết lập cây sơ đồ tổ chức bệnh viện:
  - Tòa nhà &rarr; Tầng &rarr; Khoa (Khoa Khám bệnh, Khoa Dị ứng Miễn dịch, Khoa Điều trị ban ngày).
  - Quản lý danh sách phòng khám chuyên đề mày đay, gán bác sĩ phụ trách từng phòng.

---

## 3. Quản lý Nhân sự & Bác sĩ (Staff Directory)
- Thêm mới, chỉnh sửa thông tin đội ngũ bác sĩ, điều dưỡng, nhân viên hỗ trợ.
- Cấp quyền chuyên môn, số hiệu chứng chỉ hành nghề và trạng thái hoạt động (Đang trực, Nghỉ phép, Tạm khóa).

---

## 4. Ma trận Phân quyền (RBAC Matrix)
- Kiểm soát phân quyền chi tiết theo vai trò: `patient`, `doctor`, `admin`.
- Quản lý quyền hạn truy cập tài nguyên: xem hồ sơ bệnh án, duyệt ca khám, kê đơn thuốc, cấu hình hệ thống, trích xuất báo cáo thống kê.

---

## 5. Trình tạo mẫu phiếu khám động (Form Builder)
- Thiết lập các biểu mẫu khai báo bệnh án thông minh phục vụ nghiên cứu lâm sàng của Bệnh viện Da liễu TW:
  - Thêm / sửa các phân mục (Section): Tiền sử dị ứng, Triệu chứng lâm sàng, Xét nghiệm cận lâm sàng.
  - Cấu hình loại câu hỏi: Trắc nghiệm một lựa chọn (Radio), Nhiều lựa chọn (Checkbox), Điền thang điểm số (Number), Văn bản mô tả (Textarea).
  - Quản lý phiên bản mẫu phiếu khám (`template_id`: Mày đay mạn, Mày đay cấp).
