# PROJECT RULES — DR MAY DAY

## 1. Design System Enforcement
Mọi thành phần giao diện (UI) trong dự án này bắt buộc phải tuân thủ nghiêm ngặt **Uber Base Design System (base.uber.com)**:
- Nguồn token màu sắc, spacing, typography, radii nằm tại: `admin_template/src/app/core/design-system/uber-base-tokens.css`.
- Biểu tượng hệ thống sử dụng độc quyền font vector **Iconsax** (`.isax.icon-...` cho outline, `.isax-b.icon-...` cho bold).
- Tuyệt đối không sử dụng logo hoặc thương hiệu bên ngoài.
- Tuân thủ độ tương phản cao WCAG 2.1 AAA và hỗ trợ 2 chế độ mật độ (Clinician Compact vs Patient Spacious).

## 2. Clinical Specification Compliance
- Tuân thủ tài liệu đặc tả y tế Bệnh viện Da liễu Trung ương (`DATA_DICTIONARY_SPECIFICATION_v2.0` và `TAI_LIEU_NGHIEP_VU_HE_THONG_DRMAYDAY.md`).
- Sàng lọc "Báo động đỏ" (< 30s) luôn có độ ưu tiên cao nhất, khóa luồng và chuyển hướng gọi 115 khi có dấu hiệu phản vệ.
- Thang điểm hoạt động bệnh UAS7 (0-42đ) và AAS7 phải tính toán chính xác theo công thức quốc tế.
