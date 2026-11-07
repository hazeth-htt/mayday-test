# Đề bài (Brief) - Việc T-014

- Tên việc: Redesign giao diện Liền kề (Seamless Adjacent Sections) trên Nền trắng thuần khiết chuẩn Uber Base
- Phân hệ: UI/UX & Design System
- Yêu cầu người dùng:
  - "redesign lại và cập nhật vào design system: tôi muốn các section để liền kề nhau chứ không cách khoảng kiểu kia nữa, tất cả để trên nền trắng theo design system, bạn hãy promt lại, lưu ý chỉ sửa style chứ vẫn tuân theo rule"
- Căn cứ & Quy tắc:
  - Ảnh đính kèm: Cổng người bệnh (`/patient/home`) hiện có các khối floating cards rời rạc, tách rời nhau bởi khoảng cách lớn (`space-y-6`, `gap-4`) trên nền xám nhạt, banner tối màu nổi cục bộ.
  - Uber Base Design System: Cấu trúc bề mặt thống nhất (Unified Surface), nền trắng tinh khiết (`#FFFFFF`), phân cách bằng đường kẻ 1px sắc nét (`var(--base-border-opaque)`), không dùng khoảng cách thừa hay các thẻ card trôi nổi.
  - Bộ icon độc quyền: Iconsax vector glyphs (`.isax` / `.isax-b`).
  - Màu thương hiệu chính thức: Deep Brand Navy `#091F5B`, Clinical Royal Blue `#3B63A8`.
  - Độ tương phản: Chuẩn WCAG 2.1 AAA.
- Phạm vi thực hiện:
  1. Cập nhật Design System (`uber-base-tokens.css` & `DESIGN_SYSTEM_UBER_BASE.md`):
     - Định nghĩa quy chuẩn giao diện bề mặt liền mạch `.base-unified-surface`, `.base-section-flush`, `.base-metrics-strip`, `.base-metrics-cell`, `.base-alert-flush`.
  2. Redesign Cổng Người Bệnh (`patient-home.component.html`):
     - Gom toàn bộ các phần (Header chào đón, Dải cảnh báo nhắc nhở UAS7, Dải 3 chỉ số lâm sàng, Biểu đồ diễn tiến 7 ngày) vào một bề mặt nền trắng thống nhất liền kề nhau, triệt tiêu hoàn toàn khoảng cách cách đoạn (`space-y-6`).
     - Header chuyển về nền trắng tinh khôi với tiêu đề xanh Navy `#091F5B` và nút hành động chuẩn Base Button.
     - Dải chỉ số 3 cột đặt liền kề tiếp nối bằng đường kẻ phân tách 1px (`divide-x`).
  3. Cập nhật Bảng Điều Khiển Quản Trị (`admin-dashboard.component.html`) đồng bộ quy chuẩn liền kề trên nền trắng.
- Tiêu chí nghiệm thu:
  - Các section tiếp giáp liền kề hoàn toàn (flush/seamless), phân cách bằng viền 1px chuẩn Base Web.
  - Toàn bộ nội dung nằm trên nền trắng sáng y tế (`#FFFFFF`), hỗ trợ Dark Mode tương ứng.
  - Không thay đổi logic nghiệp vụ, giữ nguyên toàn bộ data-binding, routing, unit tests.
  - `npx tsc --noEmit` 0 lỗi, Karma `npm test` 37/37 tests PASS, `npm run build:prod && npm run scan:bundle` 100% PASS.
