# Đề bài (Brief) - Việc T-008

- Tên việc: Thiết lập CI/CD GitHub Actions Pipeline cho dự án Bệnh viện DrMayDay
- Mục tiêu:
  1. Xây dựng quy trình tự động hóa kiểm định chất lượng phần mềm trên GitHub Actions: `.github/workflows/production-pipeline.yml`.
  2. Các bước trong pipeline:
     - Setup Node.js (v20/v22 LTS).
     - Cài đặt dependencies (`npm ci`).
     - Kiểm tra kiểu dữ liệu TypeScript (`npx tsc --noEmit`).
     - Chạy toàn bộ bộ kiểm thử đơn vị (`npm test -- --watch=false --browsers=ChromeHeadless`).
     - Biên dịch bản phát hành (`npm run build:prod`).
     - Quét bảo mật bundle và cấm rò rỉ thông tin nhạy cảm (`npm run scan:bundle`).
  3. Kích hoạt khi `push` hoặc `pull_request` vào nhánh `main`.
- Tiêu chí nghiệm thu:
  - Tệp `.github/workflows/production-pipeline.yml` hợp lệ cú pháp GitHub Actions.
  - Các bước ánh xạ đúng thư mục `admin_template`.
  - Thiết lập cờ Chrome Headless hỗ trợ CI Linux (`--no-sandbox`, `--disable-gpu`).
