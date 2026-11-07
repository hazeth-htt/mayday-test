# Báo cáo đối soát: T-005 (Vòng 1)

## Kết quả theo tiêu chí
| AC | Kết quả | Bằng chứng |
|---|---|---|
| AC-1 | ĐẠT | `auth-api.service.ts:28-30` có `resetPassword(payload)`. |
| AC-2 | ĐẠT | `forgot-password.component.ts:16-107` quản lý `step: 1 \| 2 \| 3`. |
| AC-3 | ĐẠT | Bắt lỗi rỗng, sai định dạng SĐT, mật khẩu < 6 ký tự, mật khẩu không khớp. |
| AC-4 | ĐẠT | Step 3 hiển thị thông báo thành công và liên kết `<a routerLink="/login">`. |
| AC-5 | ĐẠT | Giao diện 2 cột đồng bộ, tuân thủ token Base Web. |
| AC-6 | ĐẠT | 4/4 test cases trong `forgot-password.component.spec.ts` PASS. Tổng 25/25 PASS. |
| AC-7 | ĐẠT | `npm run build:prod` và `npm run scan:bundle` xanh 100%. |

## Kết luận: PASS
Task T-005 đạt chuẩn nghiệm thu. Đề xuất Orchestrator merge vào `main`.
