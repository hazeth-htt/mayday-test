# DANH SÁCH CÂU HỎI & ĐỀ XUẤT CHO ĐỘI NGŨ BACKEND (QUESTIONS FOR BACKEND)
**Dự án:** Hệ thống Quản lý Bệnh án DrMayDay — Bệnh viện Da liễu Trung ương  
**Mục đích:** Làm rõ các điểm bất cập, mâu thuẫn kiểu dữ liệu và các API còn thiếu trước khi tích hợp hệ thống.  
**Ngày lập:** 08/11/2026  

---

## 1. NHÓM XÁC THỰC & TÀI KHOẢN (AUTH & USERS)

1. **Quy định phương thức đăng nhập:**
   * Trong `/api-spec`, `POST /api/auth/login` nhận `{ phone, password }`. Đối với Bác sĩ và Quản trị viên, hệ thống có hỗ trợ đăng nhập bằng **Email** hoặc **Mã nhân viên** không, hay bắt buộc 100% người dùng phải đăng nhập bằng số điện thoại?
2. **Quy chuẩn mã `role_id`:**
   * Trong response `user_info` và bảng `users`, trường `role_id` là số nguyên (`int`) hay chuỗi (`string`)? Giá trị cụ thể của các vai trò chuẩn là gì (Ví dụ: `1: admin, 2: doctor, 3: patient` hay dùng chuỗi `'ROLE_ADMIN'`)?
3. **Cơ chế phân quyền Frontend:**
   * Sau khi đăng nhập, Backend trả về mảng danh sách các permissions (`data.user_info.permissions: string[]`) hay chỉ trả về duy nhất `role_id`? (Frontend cần danh sách quyền để ẩn/hiện nút hành động trên giao diện).

---

## 2. NHÓM HỒ SƠ BỆNH ÁN, ĐƠN THUỐC & CẬN LÂM SÀNG

4. **Sửa đổi Đơn thuốc đã kê:**
   * Hiện tại spec chỉ có `POST /api/prescriptions` (Tạo đơn thuốc) kèm mã lỗi `8003: Prescription already exists for this record`. Nếu Bác sĩ cần sửa đơn thuốc (thêm bớt thuốc hoặc chỉnh liều) trước khi chốt bệnh án, Backend có hỗ trợ API `PUT /api/prescriptions/{id}` không?
5. **Truy xuất đơn thuốc của Bệnh nhân:**
   * Bệnh nhân xem đơn thuốc của mình qua API nào? Dữ liệu đơn thuốc được nhúng kèm trong `GET /api/medicalrecords/{id}` hay cần gọi API riêng (ví dụ `GET /api/prescriptions/by_record/{record_id}`)?
6. **Quyền truy cập kết quả Cận lâm sàng:**
   * Bệnh nhân có được phép gọi `GET /api/lab_requests/{record_id}` để xem kết quả xét nghiệm máu/IgE của mình không, hay chỉ Bác sĩ mới có quyền?

---

## 3. NHÓM THANG ĐIỂM UAS7 & THEO DÕI TỔN THƯƠNG

7. **Ràng buộc `medical_record_id` khi gửi điểm UAS7:**
   * `POST /api/uas7scores` yêu cầu bắt buộc `medical_record_id`. Nếu bệnh nhân đã khám xong (bệnh án chuyển sang `completed`) nhưng vẫn cần chấm điểm tiếp trong chu kỳ 7 ngày sau khám, backend có cho phép truyền `medical_record_id` của hồ sơ đã `completed` không, hay bắt buộc phải là `in_progress`?
8. **Đầu ra của mô hình AI YOLO (Bounding Box):**
   * API AI hiện tại trả về trực tiếp luồng nhị phân binary stream của ảnh đã vẽ sẵn khung viền (Bounding Box). Backend có thể trả thêm một API dạng JSON chứa tọa độ các nốt sẩn `[{ x, y, width, height, confidence }]` để Frontend có thể hiển thị tương tác hover/tooltip và đếm số lượng nốt sẩn trên giao diện được không?

---

## 4. NHÓM QUẢN TRỊ & HẠ TẦNG (TOPOLOGY & ADMIN)

9. **Mã hiệu định danh (Code) cho Cơ sở/Khoa/Phòng:**
   * Các bảng `branches`, `departments`, `rooms` hiện không có trường `code`. Để nhân viên y tế và bác sĩ dễ nhận diện phòng khám (ví dụ `PK-204`, `KHA-DL-01`), Backend có thể bổ sung trường `code (varchar 50)` vào schema các bảng này không?
10. **API Thống kê Tổng quan (Dashboard Stats):**
    * Trang `/admin/dashboard` cần hiển thị 4 chỉ số: Tổng chi nhánh, Tổng nhân sự, Tổng số ca khám, Tổng số ca cấp cứu. Backend có thể cung cấp 1 API tổng hợp `GET /api/admin/dashboard_stats` thay vì để Frontend phải gọi nhiều API danh sách rồi tự đếm không?

---

## 5. NHÓM CHUẨN HÓA DỮ LIỆU PHÂN TRANG (PAGINATION STANDARD)

11. **Chuẩn hóa cấu trúc phân trang:**
    * Trong spec, một số API trả về `total` nằm ngoài `data` (như `GET /api/users`), còn một số API khác không ghi rõ `total`. Đề xuất Backend chuẩn hóa toàn bộ các API có phân trang theo cấu trúc đồng nhất:
    ```

---

## 6. NHÓM BẢO MẬT PHIÊN LÀM VIỆC & OTP (SESSION SECURITY & OTP LIFECYCLE)

12. **Thời hạn Access Token & Cơ chế Refresh Token:**
    * Thời hạn sống của Access Token là bao lâu (đề xuất: 15 phút theo quy chuẩn bảo mật y tế đối với Bác sĩ/Admin)?
    * Backend có hỗ trợ endpoint `POST /api/auth/refresh_token` nhận `refresh_token` (hoặc HttpOnly Cookie) để cấp lại cặp token mới mà không ngắt quãng phiên khám bệnh không?
13. **Thu hồi phiên làm việc (Session Invalidation):**
    * Khi người dùng thực hiện đổi mật khẩu thành công qua luồng OTP (`POST /api/auth/reset_password`), Backend có tự động thu hồi (revoke / blacklist) toàn bộ token hiện có trên các thiết bị khác không?
14. **Khóa an toàn khi không hoạt động (Idle Lock & Concurrent Control):**
    * Phía Frontend đã cài đặt `IdleTimeoutService` tự động khóa màn hình sau 15 phút không thao tác. Backend có cơ chế kiểm tra thời gian nhàn rỗi (idle timeout) trên máy chủ hoặc kiểm soát đăng nhập đồng thời (chỉ cho phép 1 phiên Bác sĩ trực tại 1 thời điểm) không?
15. **Vòng đời & Giới hạn thử lại mã OTP SMS:**
    * Thời gian hết hạn của OTP SMS là 5 phút?
    * Có cơ chế giới hạn tần suất gửi SMS (rate limit: tối đa 3 lần/giờ trên 1 số điện thoại) và giới hạn số lần nhập sai (khóa tạm 15 phút nếu nhập sai quá 5 lần liên tiếp) không?json
    {
      "code": "1000",
      "message": "OK",
      "data": [ ... ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 120,
        "total_pages": 6
      }
    }
    ```

---

## 6. NHÓM BẢO MẬT PHIÊN LÀM VIỆC & OTP (SESSION SECURITY & OTP LIFECYCLE)

12. **Thời hạn Access Token & Cơ chế Refresh Token:**
    * Thời hạn sống của Access Token là bao lâu (đề xuất: 15 phút theo quy chuẩn bảo mật y tế đối với Bác sĩ/Admin)?
    * Backend có hỗ trợ endpoint `POST /api/auth/refresh_token` nhận `refresh_token` (hoặc HttpOnly Cookie) để cấp lại cặp token mới mà không ngắt quãng phiên khám bệnh không?
13. **Thu hồi phiên làm việc (Session Invalidation):**
    * Khi người dùng thực hiện đổi mật khẩu thành công qua luồng OTP (`POST /api/auth/reset_password`), Backend có tự động thu hồi (revoke / blacklist) toàn bộ token hiện có trên các thiết bị khác không?
14. **Khóa an toàn khi không hoạt động (Idle Lock & Concurrent Control):**
    * Phía Frontend đã cài đặt `IdleTimeoutService` tự động khóa màn hình sau 15 phút không thao tác. Backend có cơ chế kiểm tra thời gian nhàn rỗi (idle timeout) trên máy chủ hoặc kiểm soát đăng nhập đồng thời (chỉ cho phép 1 phiên Bác sĩ trực tại 1 thời điểm) không?
15. **Vòng đời & Giới hạn thử lại mã OTP SMS:**
    * Thời gian hết hạn của OTP SMS là 5 phút?
    * Có cơ chế giới hạn tần suất gửi SMS (rate limit: tối đa 3 lần/giờ trên 1 số điện thoại) và giới hạn số lần nhập sai (khóa tạm 15 phút nếu nhập sai quá 5 lần liên tiếp) không?
