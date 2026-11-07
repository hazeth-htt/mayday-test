# Đặc tả thiết kế: T-004 Modal Cảnh báo Hết phiên không hoạt động

## Căn cứ
- Bản sắc: `workflow/design/direction.md` (Mục 2 & Mục 6 - Rào chắn an toàn lâm sàng).
- Chuẩn giao diện: Base Web Modal Dialog.

## Bố cục và thứ bậc thông tin
- Modal đè lớp phủ mờ (`bg-black/60 backdrop-blur-sm`), z-index cao nhất (`z-99999`).
- Hộp thoại căn giữa màn hình (`max-w-md w-full p-6`):
  - Icon đồng hồ cảnh báo vàng Iconsax (`.isax-b.icon-clock text-3xl text-[var(--base-warning-primary)]`).
  - H2: "Phiên Khám Sắp Tự Động Khóa"
  - Mô tả: "Hệ thống phát hiện không có thao tác trong gần 15 phút. Để bảo vệ dữ liệu hồ sơ bệnh án, phiên làm việc sẽ tự động kết thúc sau:"
  - Con số đếm lùi khổ lớn (`text-4xl font-mono font-black text-[var(--base-warning-primary)] text-center my-4`).
  - Nút hành động chính: "Tiếp Tục Phiên Khám" (`base-btn base-btn-primary base-btn-large w-full`).
  - Nút phụ: "Đăng Xuất Ngay" (`base-btn base-btn-tertiary base-btn-compact w-full mt-2`).

## Ánh xạ token
| Phần tử | Token |
|---|---|
| Hộp thoại | `var(--base-bg-surface)`, `border: 1px solid var(--base-border-opaque)`, `rounded-2xl` |
| Con số đếm lùi | `var(--base-warning-primary)`, `font-mono`, `text-4xl` |
| Nút tiếp tục | `var(--base-button-primary-bg)`, `height: 48px`, `rounded-lg` |
| Nút đăng xuất | `var(--base-negative-primary)`, `text-xs` |

## Tiêu chí thiết kế kiểm được (AC-D)
AC-D1. Modal có `role="dialog"`, `aria-modal="true"`.
AC-D2. Đồng hồ đếm lùi hiển thị rõ ràng số giây còn lại.
AC-D3. Không dùng các màu ngoài hệ thống token Uber Base.
