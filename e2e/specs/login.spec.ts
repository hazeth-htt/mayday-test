import { test, expect } from '@playwright/test';

test.describe('Phân hệ Đăng nhập & Khởi tạo (Authentication & Onboarding Flow)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Hiển thị giao diện đăng nhập đạt chuẩn Base Design System và không có dev tools', async ({ page }) => {
    await expect(page).toHaveTitle(/Đăng Nhập/);
    const heading = page.locator('h1, h2, .base-heading-lg, .base-heading-xl');
    await expect(heading.first()).toBeVisible();
    await expect(page.locator('input[type="tel"], input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Tuyệt đối không chứa dev tools hoặc 3 nút chọn sẵn role
    await expect(page.locator('app-login-dev-tools')).toHaveCount(0);
    await expect(page.locator('text=DEV ONLY')).toHaveCount(0);
    await expect(page.locator('text=Điền tài khoản kiểm thử')).toHaveCount(0);
  });

  test('Hiển thị liên kết đăng ký tài khoản mới và sàng lọc khẩn cấp', async ({ page }) => {
    const registerLink = page.locator('a[href*="/register"]');
    await expect(registerLink.first()).toBeVisible();

    const emergencyLink = page.locator('a[href*="/emergency"]');
    await expect(emergencyLink.first()).toBeVisible();
  });

  test('Từ chối số điện thoại không hợp lệ định dạng Việt Nam', async ({ page }) => {
    await page.fill('input[type="tel"], input[name="phone"]', '12345');
    await page.fill('input[type="password"]', 'Doctor@123');
    await page.click('button[type="submit"]');

    const errorMsg = page.locator('.text-red-600, .base-negative, .text-\\[var\\(--base-negative-primary\\)\\]');
    await expect(errorMsg.first()).toBeVisible();
  });

  test('Đăng nhập thành công với vai trò Bác sĩ và chuyển hướng vào Hàng đợi', async ({ page }) => {
    await page.fill('input[type="tel"], input[name="phone"]', '0912345678');
    await page.fill('input[type="password"]', 'Doctor@123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*doctor\/queue/);
    await expect(page.locator('h1, h2, .base-heading-lg').filter({ hasText: /Hàng Đợi/i })).toBeVisible();
  });
});
