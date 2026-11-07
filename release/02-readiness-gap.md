# ĐÁNH GIÁ SẴN SÀNG PRODUCTION (02-READINESS-GAP)

> **Dự án:** Hệ thống Quản trị & Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
> **Đơn vị:** Bệnh viện Da liễu Trung ương  
> **Tiêu chuẩn kiểm định:** Production Grade Readiness Checklist (Security, Scalability, Observability, Compliance)  
> **Đánh giá tổng quan:** **CHƯA ĐẠT (Cần xử lý các điều kiện tiên quyết trước khi Go-Live)**  

---

## 1. BẢNG MA TRẬN ĐÁNH GIÁ 9 TIÊU CHÍ SẴN SÀNG

| Hạng mục kiểm tra | Đánh giá | Bằng chứng kiểm tra thực tế | Khoảng trống kỹ thuật (Gap) & Hành động cần làm |
|:---|:---:|:---|:---|
| **1. Cấu hình Môi trường** | **CHƯA ĐẠT** | • `angular.json` đã cấu hình `fileReplacements` giữa `environment.ts` và `environment.prod.ts`.<br>• `sourceMap: false` đã bật cho production.<br>• `budgets: initial 4MB/5MB` còn quá rộng.<br>• Chưa có file `environment.staging.ts`.<br>• Chưa có file kiểm tra biến bắt buộc `.env.example`. | • Tạo file `environment.staging.ts` cho môi trường kiểm thử UAT.<br>• Siết chặt `budgets` trong `angular.json` xuống mức hợp lý (initial: 2MB).<br>• Thêm file `.env.example` và script kiểm tra biến bắt buộc trước khi build. |
| **2. Xác thực & Quản lý Phiên** | **CHƯA ĐẠT** | • Đăng nhập bằng SĐT chuẩn Việt Nam: **ĐẠT**.<br>• Đăng xuất xóa session: **ĐẠT**.<br>• Quên/đặt lại mật khẩu: **CHƯA CÓ** giao diện.<br>• Làm mới token êm dịu (Silent Refresh): **CHƯA CÓ**.<br>• Tự động khóa màn hình/đăng xuất khi không hoạt động: **CHƯA CÓ**.<br>• Lưu JWT trong `localStorage`: **RỦI RO XSS**. | • Bổ sung màn hình Quên / Đặt lại mật khẩu theo API `forgot_password` & `reset_password`.<br>• Tích hợp Idle Timeout Service (tự động khóa/đăng xuất sau 15 phút không thao tác cho Bác sĩ và Admin).<br>• Khuyến nghị Backend chuyển sang Set-Cookie `httpOnly` hoặc frontend lưu token trong RAM + refresh token. |
| **3. Phân quyền & Điều hướng** | **CHƯA ĐẠT** | • `auth.guard.ts` kiểm tra role & permission: **ĐẠT**.<br>• Không có đường vòng bằng đổi URL: **ĐẠT**.<br>• Lazy-loading theo vai trò: **CHƯA ĐẠT** (các trang đang được import tĩnh trong `app.routes.ts`, bundle Bệnh nhân vẫn chứa code Admin).<br>• Trang 403 chuyên biệt: **CHƯA CÓ** (đang tự redirect về dashboard). | • Tái cấu trúc `app.routes.ts` sang `loadComponent: () => import(...)` để tách bundle phân hệ.<br>• Xây dựng màn hình `403 Forbidden` thân thiện kèm nút quay về trang phù hợp. |
| **4. Bảo mật Trình duyệt & Mã nguồn** | **CHƯA ĐẠT** | • `npm audit` phát hiện **62 lỗ hổng** (4 Critical, 36 High, 21 Moderate, 1 Low) chủ yếu từ các gói phụ thuộc.<br>• Sử dụng `bypassSecurityTrustHtml` trong `safe-html.pipe.ts:8`.<br>• Chưa có cấu hình HTTP Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options). | • Chạy quy trình vá bảo mật `npm audit fix` có kiểm thử hồi quy.<br>• Loại bỏ hoặc bọc an toàn `bypassSecurityTrustHtml` bằng sanitize kiểm duyệt chuỗi SVG tĩnh.<br>• Cung cấp tài liệu cấu hình Nginx/Cloudflare áp dụng bộ Security Headers chuẩn Y tế (HSTS 1 năm, CSP chặn script ngoài). |
| **5. Quyền riêng tư Y tế (Zero-PII)** | **CHƯA ĐẠT** | • Không lộ PII trên URL query: **ĐẠT**.<br>• Upload ảnh tổn thương: Đã có chức năng tải ảnh thật nhưng **CHƯA KIỂM SOÁT** dung lượng client (>10MB), chưa validate MIME type ở client, chưa tự động dọn cache blob URL sau khi upload.<br>• Cảnh báo rời trang khi có dữ liệu chưa lưu (`canDeactivate`): **CHƯA CÓ**. | • Thêm kiểm tra kích thước (<10MB) và định dạng (`image/jpeg`, `image/png`) tại `LesionTrackerComponent` và `ConsultationComponent`.<br>• Xóa sạch `URL.revokeObjectURL()` giải phóng bộ nhớ.<br>• Thêm `pendingChangesGuard` cảnh báo trước khi rời trang bệnh án đang điền dở. |
| **6. Xử lý Lỗi & Giám sát** | **CHƯA ĐẠT** | • Ánh xạ 40+ mã lỗi y tế sang tiếng Việt: **ĐẠT**.<br>• Global Error Handler (`ErrorHandler` của Angular): **CHƯA ĐĂNG KÝ** (các lỗi runtime chưa được bắt tập trung).<br>• Lớp trừu tượng gửi log giám sát (Sentry/Log Collector) có lọc PII: **CHƯA CÓ**. | • Tạo và đăng ký `GlobalErrorHandler` implements `ErrorHandler`.<br>• Xây dựng `LoggingService` chuẩn hóa log lỗi, tự động che mờ SĐT, tên bệnh nhân, số thẻ BHYT trước khi ghi nhận. |
| **7. Chất lượng Mã nguồn & Truy cập** | **ĐẠT (Một phần)** | • TypeScript Strict Mode: **ĐẠT** (`strict: true`, `noImplicitReturns`, `strictTemplates` trong `tsconfig.json`).<br>• Build production thành công: **ĐẠT** (`ng build --configuration production` xanh 100%).<br>• Lint script: **CHƯA CÓ** trong `package.json`.<br>• Unit test: Mới chỉ có cấu hình mặc định, chưa có test suite cho các rule y tế quan trọng (công thức UAS7, sàng lọc báo động đỏ). | • Thêm ESLint cho Angular (`ng add @angular-eslint/schematics`).<br>• Viết bộ Unit Test kiểm chứng công thức tính điểm UAS7 (0-42) và hàm chặn báo động đỏ. |
| **8. Quy trình CI/CD Tự động hóa** | **CHƯA ĐẠT** | • Kho lưu trữ chưa có thư mục `.github/workflows/`.<br>• Chưa có pipeline tự động hóa: Lint &rarr; Test &rarr; Build Prod &rarr; Quét Bundle sạch Mock &rarr; Deploy. | • Khởi tạo workflow GitHub Actions `production-pipeline.yml` đầy đủ các bước kiểm soát chất lượng và phát hành.<br>• Thêm script quét thư mục `dist/` kiểm tra rò rỉ mock ("mock-db", "USE_MOCK") trước khi phát hành. |
| **9. Tài liệu Triển khai & Phát hành** | **CHƯA ĐẠT** | • `README.md` hiện tại là file mặc định của template TailAdmin.<br>• Chưa có hướng dẫn thiết lập biến môi trường, quy trình đổi sang API thật, kịch bản rollback khi có sự cố. | • Viết lại toàn bộ `README.md` theo chuẩn đề tài y tế Bộ Y Tế.<br>• Biên soạn tài liệu hướng dẫn bàn giao, checklist Go-Live và kế hoạch Rollback khẩn cấp. |

---

## 2. KẾT LUẬN & ĐIỀU KIỆN TIÊN QUYẾT ĐỂ GO-LIVE

1. **Điểm số sẵn sàng:** **3/9 ĐẠT** (Môi trường, Bảo mật, Phân quyền, CI/CD, Xử lý lỗi, Giám sát đang ở mức CHƯA ĐẠT).
2. **Khuyến nghị của Release Engineer:** 
   - Không được phép gắn nhãn bản phát hành cuối (Final Release) nếu chưa xử lý xong:
     1. Tách biệt hoàn toàn mã mock khỏi build production.
     2. Triển khai Lazy-loading phân hệ để cô lập mã nguồn Admin khỏi Bệnh nhân.
     3. Bổ sung `GlobalErrorHandler`, `IdleTimeoutService` và kiểm tra dung lượng upload ảnh.
     4. Thiết lập pipeline CI/CD kiểm định tự động.
