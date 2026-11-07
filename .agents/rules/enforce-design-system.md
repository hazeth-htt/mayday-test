---
description: Enforce Uber Base Design System and Iconsax icon library for all UI development
trigger: always_on
---

# BẮT BUỘC TUÂN THỦ UBER BASE DESIGN SYSTEM

Khi xây dựng, chỉnh sửa, hoặc tối ưu hóa bất kỳ giao diện người dùng nào (HTML, CSS, TypeScript/Angular components, layouts, dialogs):

1. **Tuân thủ quy chuẩn Uber Base Design System (`https://base.uber.com/`):**
   - Áp dụng cấu trúc token semantic từ `src/app/core/design-system/uber-base-tokens.css`.
   - Sử dụng các lớp typography chuẩn: `.base-display`, `.base-heading-...`, `.base-label-...`, `.base-paragraph-...`, `.base-mono`.
   - Sử dụng thang khoảng cách cơ số 4px (scale100 -> scale900) và góc bo dứt khoát.
   - Luôn bảo đảm độ tương phản cao đạt chuẩn WCAG 2.1 AAA.

2. **Sử dụng bộ biểu tượng Iconsax Font (895 Icons):**
   - Bắt buộc dùng icon qua thẻ `<span class="isax icon-..."></span>` (hoặc `.isax-b` cho trạng thái được chọn/bold).
   - Tuyệt đối không dùng icon rời rạc không đồng bộ hoặc logo bên thứ ba.

3. **Kỷ luật thương hiệu (Zero External Branding):**
   - Tuyệt đối KHÔNG sử dụng logo hay nhận diện thương hiệu ngoài.
   - Giữ giao diện y tế thuần khiết, chuyên nghiệp chuẩn đề tài cấp Bộ Y Tế.
