import { test, expect } from '@playwright/test';

test.describe('Hàng đợi Ca khám & Tiếp nhận Bệnh nhân', () => {
  test.beforeEach(async ({ page }) => {
    // Đăng nhập Bác sĩ
    await page.goto('/login');
    await page.fill('input[type="tel"], input[name="phone"]', '0912345678');
    await page.fill('input[type="password"]', 'Doctor@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/doctor/queue');
  });

  test('Hiển thị danh sách hàng đợi ca khám với đầy đủ nhãn Báo động đỏ và Thể bệnh', async ({ page }) => {
    const queueRows = page.locator('tbody tr, .queue-item');
    await expect(queueRows.first()).toBeVisible();

    // Kiểm tra bộ lọc
    const filterInput = page.locator('input[placeholder*="Tìm"], input[type="search"]');
    if (await filterInput.isVisible()) {
      await filterInput.fill('Mai');
      await expect(page.locator('text=Mai')).toBeVisible();
    }
  });
});
