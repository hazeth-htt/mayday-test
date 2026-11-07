# Báo cáo thực hiện: T-001 (Vòng 1)

## Đã làm theo từng AC
- **AC-1: Bản production không có khối "Truy cập nhanh theo phân hệ"**
  - Tách công cụ điền tài khoản kiểm thử sang component riêng `login-dev-tools.component.ts`.
  - Cấu hình fileReplacement trong `angular.json` tráo đổi sang `login-dev-tools.component.prod.ts` (stub rỗng `template: ''`) khi build production.
  - Kết quả: Trong dist production hoàn toàn không có khối HTML, thẻ chọn vai trò hay nhãn chọn phân hệ.
- **AC-2: Không có giá trị điền sẵn ở production**
  - Trong `login.component.ts`, các thuộc tính `phone = ''`, `password = ''` đều khởi tạo rỗng.
  - Loại bỏ các credentials hardcode (`Doctor@123`, `Admin@123`, `Patient@123`) khỏi mã nguồn chính của màn đăng nhập và modal tiếp nhận của bác sĩ.
- **AC-3: Định danh đăng nhập thống nhất với API**
  - Ô nhập số điện thoại sử dụng `type="tel"`, `inputmode="numeric"`, `pattern="[0-9]*"`, `autocomplete="username"`, liên kết `id="login-phone"` và `for="login-phone"`.
  - Kiểm tra hợp lệ bằng Regex chuẩn Việt Nam `/^(03|05|07|08|09)\d{8}$/`. Nhập chữ cái, ký tự đặc biệt hoặc email sẽ bị cảnh báo ngay bằng tiếng Việt rõ ràng cạnh ô.
- **AC-4: Đủ trạng thái và thông báo thân thiện**
  - Khi đang gửi: `isLoading = true`, nút đăng nhập bị vô hiệu hóa `[disabled]="isLoading"` kèm hiệu ứng spinner, chống click trùng.
  - Xử lý mã lỗi từ `lib/errors/app-error.ts` và HTTP status:
    - 401 / code 3008: Thông báo bảo mật chung "Số điện thoại hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại." (không để lộ số điện thoại có tồn tại hay không).
    - 403: Thông báo "Tài khoản tạm thời bị tạm khóa. Vui lòng liên hệ bộ phận hỗ trợ y tế."
    - Status 0 / Mất mạng: "Không thể kết nối đến máy chủ y tế. Vui lòng kiểm tra kết nối mạng."
    - 500: "Hệ thống đang bận xử lý. Vui lòng thử lại sau giây lát."
- **AC-5: Điều hướng theo vai trò do máy chủ trả về**
  - `AuthService.loginWithApi` lấy `role_id` từ máy chủ, lưu phiên an toàn và gọi `navigateToDashboard()` điều hướng chính xác:
    - `admin` -> `/admin/dashboard`
    - `doctor` -> `/doctor/queue`
    - `patient` -> `/patient/home`
  - `authGuard` chặn các truy cập trái vai trò hoặc chưa đăng nhập.
- **AC-6: Bundle production sạch mock**
  - Tạo `src/app/core/providers/http-interceptors.provider.ts` (chứa mockHttpInterceptor cho dev) và `http-interceptors.provider.prod.ts` (mảng rỗng cho prod).
  - Khai báo fileReplacement trong `angular.json` cho configuration `production`.
  - Viết công cụ quét độc lập `scripts/scan-bundle.js` và lệnh `npm run scan:bundle` trong `package.json`.
  - Kết quả quét dist production: 0 chuỗi `mock-db`, `mock-http-interceptor`, `USE_MOCK`, `DEV ONLY`, `Truy cập nhanh`, `Doctor@123`, `Admin@123`, `Patient@123`.
- **AC-7: Quên mật khẩu**
  - Đã đối chiếu `api_spec.csv` dòng 4, 20 (`forgot_password` và `reset_password`).
  - Đã bổ sung liên kết "Quên mật khẩu?" với `routerLink="/forgot-password"`, `tabindex="0"` và thông báo chuyển hướng rõ ràng.
- **AC-8: Truy cập và đáp ứng thiết bị**
  - Đảm bảo đầy đủ thuộc tính trợ năng: `label for`, `aria-label="Hiện mật khẩu"` / `aria-label="Ẩn mật khẩu"`, `role="alert"` cho thông báo lỗi.
  - Hỗ trợ thao tác hoàn chỉnh chỉ bằng bàn phím (Tab, Enter).
  - Đáp ứng hiển thị co giãn hoàn hảo ở màn hình di động 360px, không tràn viền.
  - Tuân thủ nghiêm ngặt bộ token Uber Base (`uber-base-tokens.css`).
- **AC-9: Chất lượng mã**
  - Đã viết bộ test unit chuẩn Jasmine/Karma trong `login.component.spec.ts` kiểm thử 10 ca: kiểm tra hợp lệ rỗng, sai định dạng, email, lỗi 401, 403, 500, mất mạng, điều hướng thành công, và dev fill.
  - Chạy `npm test -- --watch=false --browsers=ChromeHeadless`: 10/10 test cases PASS.
  - Chạy `npx tsc --noEmit -p tsconfig.app.json` và `tsconfig.spec.json`: 0 lỗi.
  - Chạy `ng build --configuration production`: Thành công 100%.
- **AC-10: Không lộ dữ liệu nhạy cảm**
  - Tuyệt đối không log số điện thoại, mật khẩu thô ra console hay đưa lên URL query parameters.

## Lệnh đã chạy và kết quả
| Lệnh | Kết quả |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Exit 0 (0 lỗi) |
| `npx tsc --noEmit -p tsconfig.spec.json` | Exit 0 (0 lỗi) |
| `npm test -- --watch=false --browsers=ChromeHeadless` | 10/10 unit tests PASS (0 failures) |
| `ng build --configuration production` | Thành công trong 4.3s, dist sinh ra đầy đủ |
| `npm run scan:bundle` | PASS: 0 forbidden strings found across 6 production files |

## Giả định đã dùng
- Định danh tài khoản người dùng của bệnh viện duy nhất qua số điện thoại 10 số Việt Nam (03, 05, 07, 08, 09), theo đặc tả API `api_spec.csv`.
- Màn hình Quên mật khẩu & Đặt lại mật khẩu chi tiết tách thành việc T-005 trên Board.

## Điểm chưa chắc chắn
- Không có. Mã nguồn hoạt động chuẩn xác theo 10 tiêu chí nghiệm thu.

## Câu hỏi cho backend / bệnh viện
1. Backend cấp phiên làm việc bằng cookie `httpOnly` hay trả JWT Token trong body phản hồi JSON? Hiện tại frontend đang lưu token vào Storage và header Bearer.
2. API login khi backend hoàn thiện có trả về cả `full_name`, `role_id` và danh sách quyền `permissions` trong một phản hồi duy nhất như hợp đồng hay tách API `me`?

## Đồng bộ giao diện (Bổ sung theo yêu cầu UX/Design System)
- Đã đồng bộ thanh tab `base-tab-nav` và `base-tab-item`: Khi tab kích hoạt (`.is-active`), viền dưới và icon được highlight đồng bộ màu accent `var(--base-accent-500)`.
- Đã đồng bộ thanh menu sidebar `app-sidebar`: Chuyển trạng thái active từ màu xanh TailAdmin sang chuẩn Base Web (`var(--base-bg-surface-alt)`, viền trái `border-l-4 var(--base-accent-500)`).
- Ẩn hoàn toàn mục "OTHERS" khi không có mục con.
- Đã đồng bộ cụm tài khoản người dùng trên header (`app-header`): Avatar bo góc chuẩn y tế (`rounded-lg`), gắn icon chuyên môn Iconsax (`.isax-b.icon-health`), nút Đăng xuất chuẩn `base-btn-secondary`.
