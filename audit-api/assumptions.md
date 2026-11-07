# DANH SÁCH CÁC GIẢ ĐỊNH KỸ THUẬT (ASSUMPTIONS)
**Dự án:** Hệ thống Quản lý Bệnh án DrMayDay — Bệnh viện Da liễu Trung ương  
**Mục đích:** Ghi nhận các giả định do Frontend thiết lập khi Backend chưa hoàn thiện, đảm bảo không bịa endpoint và có thể đối soát khi backend bàn giao.  
**Ngày lập:** 08/11/2026  

---

## 1. GIẢ ĐỊNH VỀ XÁC THỰC & ĐĂNG NHẬP
1. **Số điện thoại đăng nhập:** Mọi tài khoản trong hệ thống (Bác sĩ, Bệnh nhân, Admin) đăng nhập bằng **Số điện thoại** Việt Nam (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09) và mật khẩu tối thiểu 6 ký tự.
2. **Quy tắc phân giải vai trò (Role Mapping):**
   * Trường `role_id` trong JWT payload hoặc `user_info` được ánh xạ như sau:
     * `role_id = 1` (hoặc tương đương) ➔ Quản trị viên (`admin`)
     * `role_id = 2` (hoặc tương đương) ➔ Bác sĩ lâm sàng (`doctor`)
     * `role_id = 3` (hoặc tương đương) ➔ Bệnh nhân (`patient`)
   * Tầng Frontend dùng chuỗi vai trò `'admin' | 'doctor' | 'patient'` để điều hướng routing.
3. **Thời hạn Token:** Giả định Access Token có hạn 24 giờ, chưa cần cơ chế Refresh Token phức tạp trong phiên bản v1.0. Khi nhận mã `3001` (Token invalid) hoặc `3002` (Token expired), Frontend tự động xóa `localStorage` và chuyển hướng về `/login`.

---

## 2. GIẢ ĐỊNH VỀ HỒ SƠ BỆNH ÁN & BIỂU MẪU ĐỘNG
1. **Mã mẫu bệnh án mặc định:**
   * Mày đay cấp tính (< 6 tuần): Sử dụng mẫu `TMPL_MAY_DAY_CAP`.
   * Mày đay mạn tính (>= 6 tuần): Sử dụng mẫu `TMPL_MAY_DAY_MAN`.
   * Nếu API `POST /api/medicalrecords/classify` chưa sẵn sàng, hệ thống fallback về 2 mẫu trên dựa trên lựa chọn thời gian mắc bệnh của bệnh nhân.
2. **Trạng thái Bệnh án:**
   * Vòng đời trạng thái bệnh án gồm: `pending` (Chờ tiếp nhận) ➔ `in_progress` (Đang khám) ➔ `completed` (Đã hoàn tất/kết luận) hoặc `cancelled` (Hủy ca khám).
3. **Lưu trữ câu trả lời biểu mẫu động (Dynamic Form Answers):**
   * Dữ liệu câu trả lời dạng trắc nghiệm radio/select lưu `question_option_id` (nếu có) hoặc `option_value`.
   * Dữ liệu dạng văn bản tự do lưu vào trường `answer_text`.
   * Dữ liệu dạng danh sách/nhiều lựa chọn (checkbox) lưu vào trường `answer_value` dạng chuỗi JSON `JSON.stringify(values)`.

---

## 3. GIẢ ĐỊNH VỀ THANG ĐIỂM UAS7 & THEO DÕI TỔN THƯƠNG
1. **Điều kiện chấm UAS7:**
   * Chỉ bệnh nhân có ít nhất một hồ sơ bệnh án đang ở trạng thái hoạt động (`status = 'in_progress'` hoặc bệnh án mạn tính) mới được chấm điểm hàng ngày.
   * Nếu API `GET /api/uas7scores/eligibility` trả về `eligible: "false"`, giao diện hiển thị thông báo hướng dẫn bệnh nhân liên hệ bác sĩ để mở đợt theo dõi.
2. **3 Mốc ảnh tổn thương (Lesion Milestones):**
   * Giá trị enum cố định: `'start'` (Khởi phát), `'peak'` (Đỉnh điểm), `'normal'` (Thoái lui / Lặn sẩn).
   * Khi upload ảnh, frontend sẽ gọi API upload file trước (`POST /api/image_attachments`) để lấy `attachment_id`, sau đó mới gọi API `POST /api/lesion_photos` để gắn metadata (thời gian chụp, điểm ngứa/đau/rát, mốc tiến triển).

---

## 4. GIẢ ĐỊNH VỀ HẠ TẦNG TOPOLOGY & QUẢN TRỊ
1. **Mã code cho Cơ sở/Khoa/Phòng:**
   * Trong API Spec của Backend, bảng `branches`, `departments`, `rooms` không có cột `code`. Frontend giả định mã hiệu định danh nội bộ (ví dụ: `CN-HN-01`, `KHA-DL-01`, `PK-204`) có thể được lưu trữ nối vào trường `description` hoặc được sinh tự động bởi backend khi hiển thị.
2. **Quy tắc an toàn khi xóa dữ liệu (RESTRICT & SET NULL):**
   * Không cho phép xóa Chi nhánh khi còn Khoa phòng trực thuộc (Frontend chặn trước bằng dialog cảnh báo).
   * Khi xóa Khoa, các phòng khám trực thuộc sẽ được backend tự động cập nhật `department_id = NULL` (trạng thái chờ phân khoa).
