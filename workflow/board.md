# Bảng việc hoàn thiện DrMayDay (Production Roadmap)

| Mã | Tên công việc | Phân hệ | Phụ thuộc | Trạng thái | Số vòng |
|---|---|---|---|---|---|
| **T-001** | Màn đăng nhập production | auth+shared | - | DONE | 1 |
| **T-002** | Chuyển đổi Lazy-Loading toàn bộ Route, Cô lập phân hệ & Trang 403 Forbidden | core+routes | T-001 | IN_PROGRESS | 0 |
| **T-003** | Global Error Handler & Dịch vụ ghi log y tế Zero-PII | core+errors | - | TODO | 0 |
| **T-004** | Tự động khóa màn hình khi không hoạt động (Idle Timeout 15p) | core+auth | T-001 | TODO | 0 |
| **T-005** | Luồng Quên & Đặt lại mật khẩu với xác thực OTP | auth | T-001 | TODO | 0 |
| **T-006** | Bổ sung màn hình còn thiếu (Lịch sử ca khám BN, Báo động đỏ <30s, Phân công ca trực) | features | T-002 | TODO | 0 |
| **T-007** | Dọn dẹp mã nguồn thừa template cũ, vá triệt để lỗi TypeScript | cleanup | T-002 | TODO | 0 |
| **T-008** | Thiết lập Pipeline CI/CD GitHub Actions tự động kiểm định | devops | T-007 | TODO | 0 |
| **T-009** | Đóng gói phát hành & Biên soạn tài liệu bàn giao chuẩn Bộ Y Tế | docs+release | T-008 | TODO | 0 |
| **T-010** | Đẩy toàn bộ mã nguồn lên kho Git chính thức (mayday-test) | release | T-009 | TODO | 0 |
