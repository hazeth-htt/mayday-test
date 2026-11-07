# Đặc tả Thiết kế (Design Spec) - Việc T-011

- Chế độ: `spec T-011`
- Người lập: Designer

## 1. Phân biệt Accent vs Positive (Clinical Safety)
- **Vấn đề lâm sàng**: Màu sắc đại diện cho trạng thái tương tác của hệ thống (nút được chọn, tab active) nếu trùng với màu "kết quả xét nghiệm tốt / kiểm soát bệnh" sẽ gây nguy cơ nhận định sai lầm cho bác sĩ trong lúc tiếp nhận hàng loạt ca bệnh.
- **Giải pháp**:
  - **Accent (UI Interaction / Action)**: Chuyển sang dải **Medical Teal**:
    - `--color-brand-teal`: `#0E7490`
    - `--base-accent-600`: `#0D9488`
    - `--base-accent-700`: `#0F766E`
    - `--base-accent-tint`: `#F0FDFA`
  - **Positive (Clinical Outcome / Health Score)**: Giữ nguyên màu **Emerald Green**:
    - `--base-positive-primary`: `#217954`
    - `--base-positive-fill`: `#4BCE97`
    - `--base-positive-tint`: `#E7F8EF`

## 2. Chuẩn tiếp cận WCAG 2.1 AA/AAA
- **Placeholder & Subtitle**: Nâng cấp `--base-gray-500` lên `#5E6878` (tương phản 5.2:1 trên nền trắng, đạt AA).
- **Patient Mode Type Scale**: Bổ sung `.patient-body-lg` (18px, line-height 28px) và `.patient-heading-lg` (24px, bold) nhằm tối ưu trải nghiệm cho bệnh nhân lớn tuổi.

## 3. Dark Mode cho Bác sĩ trực đêm
- Cấu hình `.dark, [data-theme="dark"]` với nền than sẫm `#090E17`, bề mặt card `#0F172A`, chữ sáng tương phản cao `#F8FAFC`, đường viền dịu `#1E293B`.
