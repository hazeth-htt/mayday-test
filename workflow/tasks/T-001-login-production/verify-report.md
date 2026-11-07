# Báo cáo đối soát: T-001 (Vòng 1)

## Kết quả theo tiêu chí
| AC | Kết quả | Bằng chứng |
|---|---|---|
| AC-1 | ĐẠT | `grep -rn "Truy cập nhanh" admin_template/dist/ng-tailadmin` -> Không có kết quả nào. FileReplacement đã tráo đổi sang stub rỗng trong production. |
| AC-2 | ĐẠT | Kiểm tra `login.component.ts`: `phone = ''`, `password = ''`, không có giá trị khởi tạo sẵn. |
| AC-3 | ĐẠT | `login.component.html:92-105`: `inputmode="numeric"`, `pattern="[0-9]*"`, `autocomplete="username"`. Regex `/^(03|05|07|08|09)\d{8}$/` kiểm tra chuẩn SĐT Việt Nam 10 số. |
| AC-4 | ĐẠT | `login.component.ts:57-73`: Bắt các mã 401, 403, 500, lỗi mạng 0; thông báo bằng tiếng Việt tự nhiên, không lộ mã lỗi kỹ thuật hay enum thô. Nút submit khóa `[disabled]="isLoading"`. |
| AC-5 | ĐẠT | Unit test `AC-5: Role-based navigation on success` PASS. `AuthService.navigateToDashboard` chuyển đúng `/admin/dashboard`, `/doctor/queue`, `/patient/home`. |
| AC-6 | ĐẠT | Chạy `npm run scan:bundle`: `PASS: 0 forbidden strings found across 6 production files`. Hoàn toàn không có `mock-db`, `mock-http-interceptor`, `USE_MOCK`, `DEV ONLY`, credentials demo. |
| AC-7 | ĐẠT | `login.component.html:105-115`: Có liên kết `Quên mật khẩu?` dẫn tới `/forgot-password`, hỗ trợ `tabindex="0"`. |
| AC-8 | ĐẠT | Nhãn gắn chặt qua `for="login-phone"`, `for="login-password"`. Nút toggle mật khẩu có `aria-label`. Bố cục hiển thị chuẩn trên màn hình 360px. Sử dụng 100% token `uber-base-tokens.css`. |
| AC-9 | ĐẠT | `npx tsc --noEmit -p tsconfig.app.json` (exit 0), `npx tsc --noEmit -p tsconfig.spec.json` (exit 0), `npm test` (10/10 PASS), `ng build --configuration production` (exit 0). |
| AC-10 | ĐẠT | Không log phone/mật khẩu ra console, không đưa lên URL query parameters. |

## Đối chiếu nghiệp vụ
- Phân quyền 3 cấp (Quản trị, Bác sĩ, Người bệnh) | Khớp | `DATA_DICTIONARY_SPECIFICATION_v2.0` và tài liệu bệnh viện.
- API đăng nhập SĐT + Mật khẩu | Khớp | `api-spec/api_spec.csv:21` (API 2).
- API quên mật khẩu gửi OTP | Khớp | `api-spec/api_spec.csv:20` (API 14 & 15).

## Kiểm tra lại độc lập (do Verifier tự chạy)
| Lệnh | Kết quả |
|---|---|
| `cd admin_template && npx tsc --noEmit -p tsconfig.app.json` | Exit 0 |
| `cd admin_template && npx tsc --noEmit -p tsconfig.spec.json` | Exit 0 |
| `cd admin_template && npm test -- --watch=false --browsers=ChromeHeadless` | 10 passed, 0 failed |
| `cd admin_template && npm run build:prod` | Build thành công trong 4.3s |
| `cd admin_template && npm run scan:bundle` | 0 chuỗi cấm, PASSED 100% |

## Kiểm tra phạm vi
- Sửa ngoài phạm vi: Không. Các tệp được sửa đều nằm trong phạm vi brief T-001 hoặc đồng bộ giao diện Base Web tokens.
- Thêm chức năng ngoài tài liệu: Không.

## Phát hiện ngoài tiêu chí
| # | Mô tả | Mức độ | Vị trí |
|---|---|---|---|
| 1 | Các trang template cũ trong `pages/{blank, calender, charts, ...}` vẫn còn trong codebase nhưng không còn được link tới | Nhỏ (đã lên kế hoạch dọn dẹp ở T-006) | `admin_template/src/app/pages/` |

## Kết luận: PASS
Task T-001 đạt toàn bộ 10/10 tiêu chí nghiệm thu. Đề xuất Orchestrator tiến hành merge nhánh `task/T-001-login-production` vào `main`.
