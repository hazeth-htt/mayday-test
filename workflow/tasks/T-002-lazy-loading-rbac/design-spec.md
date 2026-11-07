# Đặc tả thiết kế: T-002 Màn hình 403 Forbidden & Phân luồng RBAC

## Căn cứ
- Bản sắc: `workflow/design/direction.md` (Mục 2 & Mục 4 - Dual Density & An toàn nhận thức).
- Nghiệp vụ: Phân quyền y tế 3 cấp.

## Bố cục và thứ bậc thông tin
- **Desktop/Tablet:** Khung thẻ căn giữa màn hình (`max-w-lg mx-auto`), biểu tượng khiên bảo mật Iconsax (`.isax-b.icon-shield-cross text-4xl text-[var(--base-negative-primary)]`), tiêu đề phân cấp rõ ràng:
  - H1: "Khu Vực Giới Hạn Chuyên Môn"
  - Phụ đề: "Tài khoản hiện tại của bạn không có thẩm quyền truy cập phân hệ lâm sàng hoặc dữ liệu quản trị này."
  - Hộp thông tin chi tiết: Tên người dùng, vai trò hiện tại (Badge màu chuẩn Base Web), và phân hệ bị từ chối.
  - Nút hành động chính: "Quay Về Trang Làm Việc Chính" (`base-btn base-btn-primary base-btn-large`).
- **Mobile 360px:** Co giãn tự nhiên, nút bấm full-width với chiều cao $\ge 48$px.

## Ánh xạ token
| Phần tử | Token màu | Token chữ | Token khoảng cách/bo góc |
|---|---|---|---|
| Card chứa | `var(--base-bg-surface)` | - | `padding: 32px`, `border-radius: 12px`, `border: 1px solid var(--base-border-opaque)` |
| Icon khiên cấm | `var(--base-negative-primary)` | - | `width: 64px`, `height: 64px`, `rounded-full`, `bg: var(--base-bg-negative-tint)` |
| Tiêu đề H1 | `var(--base-content-primary)` | `.base-heading-lg` | `margin-bottom: 8px` |
| Đoạn mô tả | `var(--base-content-secondary)` | `.base-paragraph-sm` | `line-height: 22px` |
| Nút quay về | `var(--base-button-primary-bg)` | `.base-label-md` | `height: 48px`, `border-radius: 8px` |

## Tiêu chí thiết kế kiểm được (AC-D)
AC-D1. Không sử dụng mã lỗi thô như "HTTP 403" hay "Access Denied" làm tiêu đề chính. Tiêu đề bắt buộc là tiếng Việt chuẩn mực y tế.
AC-D2. Nút hành động chính có màu sắc tương phản cao, click vào sẽ tự điều hướng về đúng trang chủ của vai trò người dùng (không đưa về trang login nếu đang đăng nhập).
AC-D3. Không có giá trị màu sắc hay khoảng cách ngoài bộ token `uber-base-tokens.css`.
