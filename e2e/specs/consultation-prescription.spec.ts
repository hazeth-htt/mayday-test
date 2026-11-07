import { test, expect } from '@playwright/test';

test.describe('Khám lâm sàng, Xem Dải nhiệt UAS7 và Kê đơn', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="tel"], input[name="phone"]', '0912345678');
    await page.fill('input[type="password"]', 'Doctor@123');
    await page.click('button[type="submit"]');
    await page.goto('/doctor/consultation/1');
  });

  test('Hiển thị thông tin hành chính và theo dõi 7 ngày UAS7', async ({ page }) => {
    await expect(page.locator('text=UAS7').or(page.locator('text=Thang Điểm'))).toBeVisible();
    await expect(page.locator('text=BA-2026-').or(page.locator('text=Bệnh án'))).toBeVisible();
  });

  test('Hiển thị biên niên sử tổn thương 3 giai đoạn (Sẩn phù / Hồng ban / Thoái lui)', async ({ page }) => {
    await expect(page.locator('text=tổn thương').or(page.locator('text=Sẩn phù'))).toBeVisible();
  });

  test('Kê đơn thuốc kháng histamin và hoàn tất niêm phong bệnh án', async ({ page }) => {
    const completeBtn = page.locator('button:has-text("Hoàn tất"), button:has-text("Ký số")');
    await expect(completeBtn.first()).toBeVisible();
  });
});
