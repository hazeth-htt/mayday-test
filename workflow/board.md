# Bảng việc hoàn thiện DrMayDay (Production Roadmap)

| Mã | Tên công việc | Phân hệ | Phụ thuộc | Trạng thái | Số vòng |
|---|---|---|---|---|---|
| **T-001** | Màn đăng nhập production (Cô lập tài khoản mẫu, kiểm tra định dạng SĐT Việt Nam) | auth+shared | - | DONE | 1 |
| **T-002** | Chuyển đổi Lazy-Loading toàn bộ Route, Cô lập phân hệ & Trang 403 Forbidden | core+routes | T-001 | DONE | 1 |
| **T-003** | Global Error Handler & Dịch vụ ghi log y tế Zero-PII (Mã hóa SĐT, BHYT 15 ký tự, Token) | core+errors | - | DONE | 1 |
| **T-004** | Tự động khóa màn hình khi không hoạt động (Idle Timeout 15p & Modal đếm ngược 60s) | core+auth | T-001 | DONE | 1 |
| **T-005** | Luồng Quên & Đặt lại mật khẩu với xác thực OTP chuẩn y tế | auth | T-001 | DONE | 1 |
| **T-006** | Màn hình Lịch sử ca khám & Đơn thuốc điện tử chuẩn Bệnh viện Da liễu TW | features | T-002 | DONE | 1 |
| **T-007** | Dọn dẹp mã nguồn thừa template cũ, giải quyết triệt để 25 lỗi TypeScript (`tsc` 0 lỗi) | cleanup | T-002 | DONE | 1 |
| **T-008** | Thiết lập Pipeline CI/CD GitHub Actions tự động kiểm định (Build + Test + Scan) | devops | T-007 | DONE | 1 |
| **T-009** | Đóng gói phát hành & Biên soạn bộ tài liệu bàn giao chuẩn Bộ Y Tế (User & Internal) | docs+release | T-008 | DONE | 1 |
| **T-010** | Đẩy toàn bộ mã nguồn lên kho Git chính thức (mayday-test) | release | T-009 | DONE | 1 |
