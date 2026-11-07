# Báo cáo Thực hiện (Builder) - Việc T-009

- Người thực hiện: Builder
- Thời gian: 2026-11-08 03:56
- Nhánh: `task/T-009-release-docs`

## 1. Công việc đã làm
1. **Bộ tài liệu người dùng cuối (`release/user/`)**:
   - `patient-guide.md`: Hướng dẫn Bệnh nhân về quy trình đăng nhập, khôi phục mật khẩu, xử trí báo động đỏ 115, khai báo bệnh án thông minh, nhật ký UAS7 7 ngày, ảnh tổn thương 3 giai đoạn và xem đơn thuốc điện tử.
   - `doctor-guide.md`: Hướng dẫn Bác sĩ về vận hành hàng đợi, tiếp nhận ca khám, phân tích dải nhiệt UAS7, soi ảnh 3 giai đoạn, kê đơn thuốc và niêm phong ký số bệnh án điện tử.
   - `admin-guide.md`: Hướng dẫn Quản trị viên về giám sát KPI dashboard, cơ sở hạ tầng phòng khám topology, nhân sự bác sĩ, ma trận RBAC và trình tạo biểu mẫu động.
2. **Bộ tài liệu kỹ thuật nội bộ (`release/internal/`)**:
   - `architecture-overview.md`: Kiến trúc Angular 21 Standalone, lazy-loading chunks, guards phân quyền, timeout bảo mật 15 phút, zero-PII logging và cơ chế fileReplacements.
   - `api-integration-guide.md`: Hướng dẫn đội ngũ backend tích hợp 91 API nguồn sự thật (`api_spec.csv`), bảng mã lỗi 1000..9903, cấu hình proxy Nginx và các bước kiểm thử.
   - `design-system-spec.md`: Quy chuẩn Uber Base Design System tokens, Iconsax font 895 icons và hệ thống hiển thị mật độ kép (Dual-density).
3. **Cập nhật `README.md` chính**:
   - Biên soạn lại toàn bộ `README.md` gốc của kho mã nguồn theo tiêu chuẩn Đề tài Nghiên cứu Khoa học Bệnh viện Da liễu Trung ương, loại bỏ hoàn toàn các thông tin mẫu bên thứ ba.
   - Cập nhật `admin_template/README.md` gọn gàng dẫn về tài liệu chuẩn.
