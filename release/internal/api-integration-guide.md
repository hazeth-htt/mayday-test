# HƯỚNG DẪN TÍCH HỢP BACKEND & KẾT NỐI API THỰC TẾ
*Tài liệu nội bộ dành cho Đội ngũ Backend & Kỹ sư Tích hợp Hệ thống DrMayDay*

---

## 1. Nguồn sự thật API & Định danh
Toàn bộ hệ thống Frontend đã được xây dựng và đối chiếu chính xác theo:
- Danh mục 91 API tại `api-spec/api_spec.csv`.
- Báo cáo đối chiếu tại `audit-api/01-api-map.md` và `audit-api/03-gap-analysis.md`.
- Hợp đồng giao diện tại `src/api/types/`.

---

## 2. Các bước chuyển đổi từ Mock API sang Backend thực tế

### Bước 1: Cấu hình biến môi trường
Mở tệp `admin_template/src/environments/environment.prod.ts` (hoặc `environment.ts` khi phát triển):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.drmayday.vn/api/v1', // Trỏ tới domain API Gateway Backend thực tế
  useMockApi: false,                          // Tắt cơ chế giả lập dữ liệu
  sessionTimeoutMinutes: 15,
};
```

### Bước 2: Cấu hình CORS & Reverse Proxy (Nginx)
Đảm bảo máy chủ Backend cho phép các Origin của Frontend và hỗ trợ đầy đủ các Header:
```nginx
location /api/v1/ {
    proxy_pass http://backend-upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Authorization $http_authorization;
}
```

### Bước 3: Chuẩn hóa Định dạng Payload & Bảng Mã Lỗi
Frontend giao tiếp qua lớp `AppError` (`src/lib/errors/app-error.ts`). Backend cần trả về đúng mã lỗi quy ước:
- **Xác thực & Ủy quyền (1000 - 1004)**:
  - `1001`: Sai số điện thoại hoặc mật khẩu.
  - `1002`: Mã OTP không chính xác hoặc đã hết hạn (sau 5 phút).
  - `1003`: Phiên đăng nhập hết hiệu lực (Token expired / Refresh required).
  - `1004`: Không có quyền truy cập tài nguyên (Role mismatch).
- **Hồ sơ & Bệnh án (2000 - 2005)**:
  - `2001`: Không tìm thấy hồ sơ bệnh án (`medical_record_id`).
  - `2002`: Bệnh án đã đóng (`completed`), không thể chỉnh sửa thêm.
  - `2003`: Bệnh nhân đã có ca khám đang trong trạng thái chờ.
- **Biểu mẫu Khai báo & Thang điểm (3000 - 3004)**:
  - `3001`: Điểm UAS7 không hợp lệ (ngoài khoảng 0 - 42).
  - `3002`: Dữ liệu câu trả lời thiếu các trường bắt buộc trong `template_id`.

---

## 3. Quy trình Kiểm thử Xác nhận Sau khi Ghép Backend
1. Chạy lệnh kiểm thử đơn vị:
   ```bash
   cd admin_template && npm test -- --watch=false --browsers=ChromeHeadless
   ```
2. Chạy lệnh biên dịch bản phát hành:
   ```bash
   cd admin_template && npm run build:prod
   ```
3. Chạy lệnh quét an ninh & PII:
   ```bash
   cd admin_template && npm run scan:bundle
   ```
4. Kiểm tra các luồng nghiệp vụ cốt lõi:
   - Luồng Đăng nhập & Đổi mật khẩu qua OTP.
   - Luồng Sàng lọc Báo động đỏ phản vệ & Tạo hồ sơ bệnh nhân.
   - Luồng Bác sĩ tiếp nhận ca, xem dải nhiệt UAS7, ảnh 3 giai đoạn và ký số kết thúc ca.
   - Luồng Bệnh nhân tra cứu lịch sử ca khám và xem đơn thuốc.
