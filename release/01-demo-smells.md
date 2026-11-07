# BÁO CÁO KIỂM TOÁN: "MÙI DEMO" VÀ ĐỘ SẠCH MÃ NGUỒN (01-DEMO-SMELLS)

> **Dự án:** Hệ thống Quản trị & Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
> **Đơn vị chủ quản:** Bệnh viện Da liễu Trung ương  
> **Người thực hiện:** Staff Frontend Engineer kiêm Release & Security Engineer  
> **Trạng thái:** BẢN KIỂM TOÁN GIAI ĐOẠN 1 (CHỈ ĐỌC — CHỜ DUYỆT)  
> **Ngày lập:** 08/11/2026  

---

## 1. BẢNG TỔNG HỢP CÁC ĐIỂM "MÙI DEMO" & PHÁT HIỆN KỸ THUẬT

| STT | Vị trí (File:Dòng) | Vấn đề / "Mùi demo" phát hiện | Mức độ | Rủi ro nếu đưa lên Production | Đề xuất giải pháp xử lý |
|:---:|:---|:---|:---:|:---|:---|
| 1 | `admin_template/src/app/pages/auth/login/login.component.html:150-184` | Khối **"Truy Cập Nhanh Theo Phân Hệ"** với 3 nút bấm đăng nhập nhanh: Quản trị, Bác sĩ, Bệnh nhân. | **CHẶN (Blocker)** | Người dùng ngoài có thể bấm vào đăng nhập thẳng vào tài khoản demo mà không cần xác thực thật; lộ cấu trúc tài khoản. | Gỡ bỏ hoàn toàn khối này khỏi bản production. Nếu dùng cho dev/test nội bộ, bọc dưới cờ `!environment.production` và dán nhãn `[DEV ONLY]`. |
| 2 | `admin_template/src/app/pages/auth/login/login.component.ts:58-68` | Hàm `quickLogin()` hard-code SĐT và mật khẩu tĩnh: `admin: 0901234567 / Admin@123`, `doctor: 0912345678 / Doctor@123`, `patient: 0988776655 / Patient@123`. | **CHẶN (Blocker)** | Lộ thông tin đăng nhập và mật khẩu mẫu trong bundle JavaScript client. | Xóa bỏ hàm `quickLogin` và đối tượng `accounts` tĩnh khỏi `LoginComponent`. |
| 3 | `admin_template/src/app/app.config.ts:11` | `provideHttpClient(withInterceptors([mockHttpInterceptor]))` được đăng ký cứng (unconditional registration). | **CHẶN (Blocker)** | Toàn bộ mã nguồn `mockHttpInterceptor.ts` và `mock-db.ts` (chứa mock users, hồ sơ giả lập) bị đóng gói vào bundle `dist/` production, phình kích thước và lộ dữ liệu giả. | Chuyển sang nạp có điều kiện thông qua file replacement môi trường (Environment Provider) hoặc dynamic provider: chỉ nạp `mockHttpInterceptor` khi `environment.useMock === true` ở dev. Thêm bước CI quét dist chặn từ khóa `mock-db`. |
| 4 | `admin_template/src/app/app.routes.ts:160-174` | Route `internal/design-system` và alias `design-system` vẫn tồn tại trong routing table của ứng dụng. | **QUAN TRỌNG** | Bị phát hiện trang nội bộ nếu người dùng đoán URL hoặc xem manifest script, không đúng chuẩn tách bạch hai thế giới. | Tách route này thành một module dev độc lập, loại bỏ hoàn toàn khỏi `routes` khi build production (`fileReplacements` cho routes hoặc kiểm tra cờ môi trường trước khi push route). |
| 5 | `admin_template/src/app/pages/` (nhiều thư mục con) | Hàng loạt trang demo thừa từ template gốc `ng-tailadmin`: `auth-pages/`, `blank/`, `calender/`, `charts/`, `dashboard/ecommerce/`, `forms/form-elements/`, `invoices/`, `profile/`, `tables/basic-tables/`, `ui-elements/`. | **QUAN TRỌNG** | Làm phình dung lượng source code repo, nguy cơ bị routing nhầm hoặc để lộ các thành phần UI chưa kiểm toán bảo mật. | Di chuyển toàn bộ các thư mục trang demo này vào vùng lưu trữ chờ duyệt `/archive-template/` hoặc loại bỏ khỏi compilation, không để lẫn trong `pages/`. |
| 6 | `admin_template/src/app/shared/components/` | Các component thừa từ template gốc: `ecommerce/`, `invoice/`, `transactions/`, `ui-example/`. | **QUAN TRỌNG** | Rác mã nguồn, tăng thời gian quét lint và build, vi phạm tính nghiêm ngặt của dự án cấp Bộ Y Tế. | Di chuyển vào vùng archive, chỉ giữ lại các component dùng chung thực sự phục vụ DrMayDay (`header`, `layout`, `dropdown`). |
| 7 | `admin_template/public/images/` | Nhiều thư mục ảnh demo không liên quan y tế: `product/`, `carousel/`, `cards/`, `country/`, `logistics/`, `video-thumb/`. | **QUAN TRỌNG** | Tăng kích thước package deploy production thêm hàng chục megabyte không cần thiết. | Dọn dẹp, chỉ giữ lại ảnh y tế, favicon, avatar mặc định và icon chuyên dụng. |
| 8 | `admin_template/src/app/shared/pipe/safe-html.pipe.ts:8` | Sử dụng `this.sanitizer.bypassSecurityTrustHtml(value)` trực tiếp mà không kiểm tra hay sanitize nội dung HTML/SVG. | **QUAN TRỌNG** | Tiềm ẩn nguy cơ tấn công XSS (Cross-Site Scripting) nếu chuỗi HTML nhận từ API hoặc người dùng có chứa script độc hại. | Giới hạn chỉ bypass cho các icon SVG/HTML nội bộ đã được kiểm duyệt, hoặc dùng sanitizer an toàn (DOMPurify). |
| 9 | `admin_template/src/app/core/services/auth.service.ts:47-48`, `api-client.ts:137` | Lưu JWT Token (`drmayday_token`) và thông tin người dùng trong `localStorage`. | **QUAN TRỌNG** | `localStorage` dễ bị khai thác bởi các lỗ hổng XSS trong trình duyệt. | Khuyến nghị chuyển sang cơ chế Cookie `httpOnly`, `Secure`, `SameSite=Strict` do Backend cấp phát. Nếu backend hiện tại chỉ hỗ trợ Bearer Token qua header, lưu token trong bộ nhớ RAM (`BehaviorSubject`/Signal) kết hợp Silent Refresh Token. |
| 10 | `admin_template/src/app/app.routes.ts` | Toàn bộ component trang (`AdminDashboardComponent`, `ConsultationComponent`, `PatientHomeComponent`...) đều được import tĩnh (static import). | **QUAN TRỌNG** | Mã nguồn của Quản trị viên và Bác sĩ bị tải chung vào bundle chính của Bệnh nhân (không lazy-loading theo vai trò), vi phạm nguyên tắc "Bệnh nhân không tải mã Admin". | Cấu hình `loadComponent: () => import(...)` cho toàn bộ các route trang theo từng phân hệ vai trò. |
| 11 | `admin_template/src/main.ts:11` | Vô hiệu hóa log bằng cách gán đè: `window.console.log = () => {};` trong file `main.ts`. | **NHỎ** | Cách tiếp cận tạm thời (monkey-patching), có thể bỏ sót `console.warn`, `console.error` hoặc bị khôi phục lại qua `iframe`/prototype. | Sử dụng cấu hình compiler của esbuild/terser loại bỏ hoàn toàn `drop: ['console', 'debugger']` ở bản build production. |
| 12 | `admin_template/public/fonts/iconsax/` | Tải trọn bộ font Iconsax (~716KB gồm bold, outline, css) trên mọi màn hình. | **NHỎ (Tối ưu)** | Tăng thời gian tải trang ban đầu (FCP/LCP) đặc biệt trên mạng 3G/4G của bệnh nhân dùng điện thoại. | Cân nhắc trích xuất tập con (subsetting) các icon thực dùng hoặc cấu hình font-display: swap. |
| 13 | `admin_template/src/lib/errors/error-codes.ts` & `app-error.ts` | Hiển thị thông báo lỗi y tế: một số nơi trong form vẫn hiển thị trực tiếp `err.message` thô kèm mã số lỗi. | **QUAN TRỌNG** | Bệnh nhân lớn tuổi có thể hoang mang khi thấy các mã lỗi kỹ thuật như `Lỗi 5002`, `Lỗi 4003`. | Chuẩn hóa tầng hiển thị: Bệnh nhân chỉ thấy thông điệp hướng dẫn xử lý dễ hiểu (ví dụ: *"Hôm nay bạn đã ghi nhật ký rồi, hẹn bạn quay lại vào ngày mai"*). Chỉ vai trò Bác sĩ/Admin mới có nút xem chi tiết mã lỗi tham chiếu. |

---

## 2. KẾT LUẬN KIỂM TOÁN "MÙI DEMO"

1. **Tổng số mục phát hiện:** 13 mục.
2. **Phân loại theo mức độ:**
   - **CHẶN (Blocker):** 3 mục (Mục 1: Khối truy cập nhanh Login; Mục 2: Hardcode SĐT/mật khẩu demo; Mục 3: Đăng ký cứng `mockHttpInterceptor`).
   - **QUAN TRỌNG (Critical/High):** 7 mục (Tách route nội bộ, dọn rác template, lọc ảnh thừa, XSS trong pipe, lưu token localStorage, lazy-loading theo vai trò, phân lớp thông báo lỗi).
   - **NHỎ (Low/Optimization):** 3 mục (Cấu hình drop console bằng build compiler, tối ưu kích thước font Iconsax).
3. **Đánh giá chung:** Hệ thống đã hoàn thiện tốt về mặt giao diện và logic gọi API, nhưng **CHƯA ĐẠT TIÊU CHUẨN PRODUCTION** nếu chưa gỡ bỏ 3 mục CHẶN và dọn dẹp các tệp rác thừa của template.
