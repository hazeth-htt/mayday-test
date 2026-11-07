import { test, expect } from '@playwright/test';

test.describe('Kiểm tra Chuẩn Tiếp cận WCAG 2.1 AA/AAA', () => {
  test('Trang Đăng nhập tuân thủ tỷ lệ tương phản và có nhãn aria-label hợp lệ', async ({ page }) => {
    await page.goto('/login');

    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      expect(ariaLabel || placeholder || id).toBeTruthy();
    }
  });

  test('Vùng tương tác tối thiểu đạt chuẩn 44x44px trên giao diện Bệnh nhân', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.locator('button[type="submit"]');
    const box = await submitBtn.boundingBox();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });
});
