# HỆ THỐNG QUẢN LÝ BỆNH ÁN ĐIỆN TỬ MÀY ĐAY — DRMAYDAY
### Bệnh viện Da liễu Trung ương (National Hospital of Dermatology and Venereology)
*Đề tài Nghiên cứu Khoa học & Ứng dụng Y tế Số chuẩn Bộ Y Tế*

[![DrMayDay CI/CD](https://github.com/hazeth-htt/mayday-test/actions/workflows/production-pipeline.yml/badge.svg)](https://github.com/hazeth-htt/mayday-test/actions)
[![Angular](https://img.shields.io/badge/Angular-21.0-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org)
[![Design System](https://img.shields.io/badge/Design%20System-Uber%20Base-black.svg)](https://base.uber.com)
[![Icons](https://img.shields.io/badge/Icons-Iconsax%20895-blueviolet.svg)](https://iconsax.io)
[![License](https://img.shields.io/badge/License-Proprietary-green.svg)]()

---

## 1. Giới thiệu Dự án
**DrMayDay** là nền tảng quản lý bệnh án điện tử chuyên sâu dành cho bệnh nhân mày đay cấp tính và mày đay mạn tính (CSU), phục vụ công tác khám chữa bệnh, theo dõi đáp ứng điều trị và nghiên cứu lâm sàng tại **Bệnh viện Da liễu Trung ương**.

Hệ thống được thiết kế và xây dựng tuân thủ nghiêm ngặt:
- **Đặc tả Y tế Quốc gia**: `DATA_DICTIONARY_SPECIFICATION_v2.0` (Bệnh viện Da liễu TW).
- **Tiêu chuẩn Thiết kế**: **Uber Base Design System (base.uber.com)** và bộ biểu tượng vector **Iconsax Font** (895 biểu tượng).
- **Bảo mật Y tế (Zero-PII Compliance)**: Tự động ẩn giấu số điện thoại, số thẻ BHYT, mật khẩu và khóa phiên làm việc tự động sau 15 phút.
- **Kiến trúc Hiện đại**: Angular 21 Standalone Components, Signal Reactivity, Lazy-loading tối ưu theo phân vùng vai trò, bundle production sạch hoàn toàn không chứa mã mock.

---

## 2. Phân hệ Người dùng & Chức năng Cốt lõi

### 2.1. Phân hệ Bệnh nhân (Patient Portal - Spacious Density)
- **Đăng nhập & Khôi phục mật khẩu**: Xác thực số điện thoại chuẩn Việt Nam và cấp lại mật khẩu qua OTP SMS.
- **Sàng lọc khẩn cấp ("Báo động đỏ" < 30s)**: Phát hiện dấu hiệu sốc phản vệ (phù thanh quản, khó thở, tụt huyết áp), khóa tức thì các luồng thông thường và hiển thị nút gọi Cấp cứu 115 và Hotline Bệnh viện Da liễu TW: **1900 6951**.
- **Khai báo bệnh án thông minh (Intake Form)**: Điền biểu mẫu động theo phân loại thể bệnh mạn tính (CSU) hoặc cấp tính.
- **Nhật ký hoạt động bệnh UAS7 (7-day Urticaria Activity Score)**: Chấm điểm sẩn phù (0-3) và mức độ ngứa (0-3) hàng ngày, tự động tính tổng điểm tuần (0-42) theo tiêu chuẩn quốc tế.
- **Theo dõi tổn thương 3 giai đoạn**: Lưu trữ và cập nhật ảnh tổn thương theo dòng thời gian (Sẩn phù &rarr; Hồng ban &rarr; Thoái lui).
- **Lịch sử ca khám & Đơn thuốc điện tử**: Tra cứu toàn bộ hồ sơ khám bệnh, lọc theo thể bệnh và xem chi tiết hướng dẫn dùng thuốc từ bác sĩ.

### 2.2. Phân hệ Bác sĩ (Clinician Portal - Compact Density)
- **Hàng đợi ca khám thời gian thực (Waiting Queue)**: Tự động phân loại thứ tự ưu tiên (Báo động đỏ, Mày đay mạn CSU, Mày đay cấp).
- **Giao diện Khám lâm sàng tích hợp (Consultation Screen)**:
  - Xem chỉ số sinh tồn và tóm tắt tiền sử.
  - Phân tích trực quan dải nhiệt UAS7 7 ngày (7-day Heat Strip).
  - Soi biên niên sử hình thái tổn thương 3 giai đoạn (Tri-phase Lesion Chronicle).
  - Kê đơn thuốc kháng histamin thế hệ 2 chuẩn phác đồ bậc 1 & bậc 2.
  - Niêm phong và ký số bệnh án điện tử (EMR Clinical Seal).

### 2.3. Phân hệ Quản trị (Admin Portal)
- **Bảng điều khiển số liệu (Dashboard)**: Theo dõi KPI tiếp nhận ca khám, tỷ lệ phản vệ, mật độ bệnh nhân.
- **Quản lý hạ tầng & cơ sở (Topology)**: Sơ đồ phòng khám chuyên đề mày đay theo tầng và tòa nhà.
- **Quản lý nhân sự y tế (Staff Directory)**: Phân quyền bác sĩ điều trị và điều dưỡng.
- **Ma trận phân quyền (RBAC Matrix)**: Kiểm soát ranh giới dữ liệu giữa các phân hệ.
- **Trình tạo biểu mẫu động (Form Builder)**: Tự thiết kế và sửa đổi các trường câu hỏi của mẫu phiếu khám.

---

## 3. Cấu trúc Thư mục Dự án

```
BTL_CNWEB/
├── .github/
│   └── workflows/
│       └── production-pipeline.yml   # CI/CD pipeline kiểm định tự động trên GitHub
├── admin_template/                   # Frontend Angular 21 Application
│   ├── src/
│   │   ├── api/                      # Client HTTP, Types, Services, Mappers
│   │   ├── app/
│   │   │   ├── core/                 # Design System tokens, Guards, Services
│   │   │   │   ├── design-system/    # uber-base-tokens.css, iconsax.css
│   │   │   │   ├── guards/           # authGuard, internalDevGuard
│   │   │   │   └── services/         # AuthService, IdleTimeoutService, LoggingService
│   │   │   ├── pages/
│   │   │   │   ├── auth/             # Login, Forgot Password
│   │   │   │   ├── drmayday/         # Doctor, Patient, Admin feature pages
│   │   │   │   └── other-page/       # 403 Forbidden, 404 Not Found
│   │   │   └── shared/               # Base Layout, Modals, Headers, Sidebars
│   │   ├── environments/             # environment.ts & environment.prod.ts
│   │   └── lib/errors/               # AppError and Error Codes catalog (1000..9903)
│   ├── karma.conf.js                 # Headless Chrome CI runner
│   └── angular.json                  # Production fileReplacements and optimization
├── api-spec/                         # Đặc tả 91 API nguồn sự thật (api_spec.csv)
├── audit-api/                        # Báo cáo đối chiếu 91 API & xử lý sai lệch
├── release/                          # Bộ tài liệu chuyển giao & đóng gói phát hành
│   ├── user/                         # patient-guide.md, doctor-guide.md, admin-guide.md
│   └── internal/                     # architecture-overview.md, api-integration-guide.md
├── scripts/
│   └── scan-bundle.js                # Quét an ninh & zero-PII bundle release
└── workflow/                         # Khung quy trình 3 vai trò (Ra đề / Thực hiện / Đối soát)
```

---

## 4. Cài đặt & Vận hành

### Yêu cầu môi trường
- **Node.js**: v20.x hoặc v22.x LTS
- **NPM**: >= 10.x
- **Google Chrome**: Dành cho bộ kiểm thử Karma Headless

### Cài đặt gói thư viện
```bash
cd admin_template
npm install
```

### Chạy môi trường phát triển (Local Development)
```bash
npm start
# Ứng dụng khởi chạy tại: http://localhost:4200/
```

### Chạy bộ kiểm thử đơn vị tự động (Unit Tests)
```bash
npm test -- --watch=false --browsers=ChromeHeadless
# Toàn bộ 27 test suites PASS
```

### Biên dịch bản phát hành sản xuất (Production Build)
```bash
npm run build:prod
```

### Quét kiểm tra an ninh và rò rỉ dữ liệu nhạy cảm (Zero-PII Scan)
```bash
npm run scan:bundle
# Kết quả: ✅ Production bundle scan PASSED: 0 forbidden strings found across production files.
```

---

## 5. Tài liệu Chuyển giao Đóng gói (Release Package)
- 📖 [Cẩm nang Bệnh nhân](file:///Users/hazeth/BTL_CNWEB/release/user/patient-guide.md)
- 🩺 [Cẩm nang Bác sĩ](file:///Users/hazeth/BTL_CNWEB/release/user/doctor-guide.md)
- ⚙️ [Cẩm nang Quản trị viên](file:///Users/hazeth/BTL_CNWEB/release/user/admin-guide.md)
- 🏗️ [Tổng quan Kiến trúc Kỹ thuật](file:///Users/hazeth/BTL_CNWEB/release/internal/architecture-overview.md)
- 🔌 [Hướng dẫn Tích hợp Backend API](file:///Users/hazeth/BTL_CNWEB/release/internal/api-integration-guide.md)
- 🎨 [Đặc tả Uber Base Design System](file:///Users/hazeth/BTL_CNWEB/release/internal/design-system-spec.md)

---
*Bản quyền © 2026 Bệnh viện Da liễu Trung ương. Mọi quyền được bảo lưu.*
