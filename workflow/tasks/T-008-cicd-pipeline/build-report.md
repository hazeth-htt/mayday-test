# Báo cáo Thực hiện (Builder) - Việc T-008

- Người thực hiện: Builder
- Thời gian: 2026-11-08 03:54
- Nhánh: `task/T-008-cicd-pipeline`

## 1. Công việc đã làm
1. **Cấu hình Karma CI Runner**:
   - Tạo `admin_template/karma.conf.js` với custom launcher `ChromeHeadlessCI` (`--no-sandbox`, `--disable-gpu`) tương thích hoàn hảo với môi trường Ubuntu Linux của GitHub Actions.
   - Khai báo `"karmaConfig": "karma.conf.js"` trong `angular.json`.
2. **Thiết lập GitHub Actions Workflow**:
   - Tạo `.github/workflows/production-pipeline.yml` gồm 7 bước:
     - Checkout mã nguồn.
     - Setup Node.js 20 LTS và cache npm.
     - Cài đặt dependencies sạch qua `npm ci`.
     - Kiểm tra kiểu dữ liệu TypeScript (`npx tsc --noEmit`).
     - Chạy 27 unit tests độc lập (`npm test -- --watch=false --browsers=ChromeHeadlessCI`).
     - Biên dịch bản phát hành production (`npm run build:prod`).
     - Quét bảo mật bundle zero-PII và kiểm tra chuỗi cấm (`npm run scan:bundle`).
