# DANH SÁCH CÂU HỎI THỐNG NHẤT (QUESTIONS FOR BACKEND & HOSPITAL)

> **Dự án:** Hệ thống Quản trị & Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
> **Đơn vị:** Bệnh viện Da liễu Trung ương  
> **Người tổng hợp:** Staff Frontend Engineer kiêm Release/Security Engineer  
> **Mục đích:** Thống nhất các điểm mấu chốt giữa Frontend, Backend và Hội đồng Y tế trước khi ghép nối hệ thống và nghiệm thu Go-Live.  

---

## 1. CÂU HỎI KỸ THUẬT GỬI ĐỘI NGŨ BACKEND (BACKEND TEAM)

1. **Cơ chế lưu trữ và truyền JWT Token (Security Standard):**
   - *Hiện trạng:* Frontend hiện đang nhận Token từ `POST /api/auth/login` và lưu tạm trong `localStorage`.
   - *Câu hỏi:* Backend có hỗ trợ cơ chế Set-Cookie `httpOnly`, `Secure`, `SameSite=Strict` để chống hoàn toàn nguy cơ rò rỉ token qua XSS không? Nếu vẫn dùng Bearer Token qua Header, Backend có cung cấp API làm mới token `POST /api/auth/refresh_token` để duy trì phiên làm việc không bị gián đoạn hay không?

2. **Kênh gửi mã OTP trong tính năng Quên Mật Khẩu:**
   - *Hiện trạng:* Trong `api_spec.csv:5` ghi chú: *"Người dùng nhập mã OTP từ email để đặt mật khẩu mới"*, nhưng định danh tài khoản đăng nhập toàn viện lại là Số điện thoại.
   - *Câu hỏi:* Khi bệnh nhân bấm quên mật khẩu, mã OTP 6 số sẽ được gửi qua **SMS về Số điện thoại đăng ký** hay gửi qua **Email**? Nếu gửi qua Email, đối với bệnh nhân không có email thì quy trình khôi phục mật khẩu sẽ xử lý như thế nào?

3. **Quy chuẩn tải tệp hình ảnh tổn thương (Media & MinIO Upload):**
   - *Hiện trạng:* Mã lỗi `6003` ghi *"Kích thước tệp vượt quá giới hạn"*.
   - *Câu hỏi:* Giới hạn kích thước tệp tối đa trên server là **5MB** hay **10MB**? Danh sách MIME type server chấp nhận là gì (`image/jpeg`, `image/png`, `image/webp`)? Khi upload hàng loạt (batch), số lượng ảnh tối đa trong 1 request là bao nhiêu ảnh?

4. **API hỗ trợ Xuất / In Bệnh án & Đơn thuốc:**
   - *Hiện trạng:* Bác sĩ lâm sàng cần in đơn thuốc và tóm tắt bệnh án ra giấy A4 có chữ ký để giao bệnh nhân.
   - *Câu hỏi:* Backend có cung cấp endpoint kết xuất PDF server-side (ví dụ: `GET /api/prescriptions/{id}/pdf`) hay Frontend sẽ tự xử lý giao diện in chuẩn `@media print`?

5. **API Nhật ký kiểm toán hoạt động (Audit Trail / Activity Log):**
   - *Hiện trạng:* Theo Luật Khám bệnh, chữa bệnh, mọi thao tác sửa/chốt bệnh án phải được lưu vết kiểm toán.
   - *Câu hỏi:* Backend có bảng `audit_logs` để ghi nhận: ai đã thao tác, thời gian, IP và hành vi không? Có API nào để Quản trị viên xem nhật ký này trên web không?

---

## 2. CÂU HỎI NGHIỆP VỤ LÂM SÀNG GỬI HỘI ĐỒNG BỆNH VIỆN DA LIỄU TW

1. **Ngưỡng tiêu chí cụ thể để hệ thống tự động cảnh báo "NÊN NHẬP VIỆN NGAY" (Nhánh Cấp tính):**
   - *Hiện trạng:* Trong `Thiet_ke_Luong_App_Benh_nhan_Cap_nhat_1.docx: Bước 3`, tài liệu ghi chú: *"Cần bác sĩ lâm sàng xác định tiêu chí chính xác dựa trên số lượng yếu tố nguy cơ và tiền sử phản vệ"*.
   - *Câu hỏi:* Xin Hội đồng chuyên môn xác nhận quy tắc thuật toán: Bệnh nhân có từ mấy triệu chứng nguy cơ trở lên (hoặc chỉ cần có tiền sử phù mạch/phản vệ) thì hệ thống sẽ tự động hiển thị khuyến nghị màu cam *"Nên đến viện khám ngay"* thay vì *"Theo dõi tại nhà"*?

2. **Nội dung khuyến nghị chuẩn cho bệnh nhân "Theo dõi tại nhà":**
   - *Hiện trạng:* Cần có nội dung trấn an người bệnh mày đay cấp mức độ nhẹ.
   - *Câu hỏi:* Nội dung hiển thị có được phép gợi ý nhóm thuốc kháng histamin thế hệ 2 không kê đơn (như Cetirizine, Loratadine, Fexofenadine) và các biện pháp chăm sóc da dịu mát không? Khi có dấu hiệu nào thì yêu cầu bệnh nhân phải đến viện tái khám ngay lập tức?

3. **Triển khai bộ câu hỏi đánh giá Chất lượng cuộc sống (DLQI / CU-Q2oL):**
   - *Hiện trạng:* Bác sĩ hiện đang nhập điểm tổng đánh giá (0-30 điểm).
   - *Câu hỏi:* Bệnh viện có chủ trương đưa toàn bộ 10 câu trắc nghiệm DLQI và bộ câu hỏi CU-Q2oL lên giao diện để bệnh nhân tự trả lời trước buổi khám không, hay vẫn giữ nguyên cơ chế Bác sĩ tự phỏng vấn và nhập điểm tổng?
