# DrMayDay Hospital System — Frontend Angular 21 Application
*Bệnh viện Da liễu Trung ương • Đề tài Nghiên cứu Khoa học Công nghệ Cấp Bộ Y Tế*

Tuân thủ nghiêm ngặt **Uber Base Design System (base.uber.com)** và Bộ từ điển lâm sàng Bệnh viện Da liễu TW.

---

## 1. Danh Sách Tài Khoản Thử Nghiệm Chuẩn Hóa
Hệ thống vận hành như một sản phẩm thật (Zero technical jargon / Không nút switch role trên giao diện). Người dùng nhập số điện thoại và mật khẩu:

| Phân hệ / Vai trò | Số điện thoại | Mật khẩu | Phân luồng mặc định | Mô tả nghiệp vụ |
|:---|:---|:---|:---|:---|
| **Ban Quản Trị Hệ Thống** | `0901234567` | `Admin@123` | `/admin/dashboard` | Quản trị hạ tầng cơ sở, khoa phòng, phân công bác sĩ, ma trận RBAC, bộ tạo mẫu phiếu khám |
| **Bác Sĩ Chuyên Khoa** | `0912345678` | `Doctor@123` | `/doctor/queue` | Hàng đợi Triage, khám thực thể, cận lâm sàng, kê đơn điện tử theo phác đồ 4 bậc EAACI |
| **Bệnh Nhân (Đã có hồ sơ)** | `0988776655` | `Patient@123` | `/patient/home` | Xem lịch sử bệnh án, hồ sơ BHYT, nhật ký theo dõi UAS7 hằng ngày, thư viện ảnh tổn thương da |
| **Bệnh Nhân Mới** | *(Tự đăng ký)* | *(Tự tạo)* | `/register` &rarr; `/patient/home` | Khởi tạo hồ sơ mới hoặc đối soát mã bệnh nhân HIS bệnh viện (`DL-2026-0888`), xác thực OTP |

---

## 2. Các Luồng Nghiệp Vụ Cửa Ngõ (Onboarding & Sàng Lọc)
- **Sàng Lọc Báo Động Nguy Cấp (< 30 giây):** `/emergency` (hoặc `/screening`). Công khai, không yêu cầu đăng nhập. Sàng lọc 4 dấu hiệu sốc phản vệ khẩn cấp theo tiêu chuẩn WAO 2020.
- **Đăng Ký Hồ Sơ Khám Bệnh:** `/register`. Công khai. Hỗ trợ 2 luồng: Bệnh nhân cũ liên kết mã HIS vs Bệnh nhân mới tính chỉ số BMI lâm sàng tự động.
- **Khôi Phục Mật Khẩu:** `/forgot-password`. Nhận mã OTP và đặt lại mật khẩu an toàn.

---

## 3. Các Lệnh Vận Hành:
- `npm start`: Khởi động máy chủ phát triển (port 4200)
- `npx ng test --watch=false`: Chạy 37 bài kiểm thử đơn vị tự động (100% PASS)
- `npm run build`: Biên dịch gói phát hành kiểm tra bundle
- `node ../scripts/scan-bundle.js`: Quét an ninh Zero-PII và kiểm tra rò rỉ mã định danh kỹ thuật
