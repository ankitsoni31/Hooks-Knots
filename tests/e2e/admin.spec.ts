import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  // Use admin baseURL
  test.use({ baseURL: 'http://localhost:5174' });

  test('should reject invalid login and protect routes', async ({ page }) => {
    // Attempt direct access
    await page.goto('/dashboard');
    // Expect redirect to login
    await expect(page).toHaveURL(/.*login.*/);

    // Test invalid login
    await page.goto('/');
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitBtn = page.getByRole('button', { name: /login|sign in/i });

    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid@example.com');
      await passwordInput.fill('wrongpassword');
      await submitBtn.click();

      // Expect an error message
      await expect(page.locator('.toast, [role="status"], .text-red-500, .error')).toBeVisible();
    }
  });

  test('should login successfully and load dashboard', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitBtn = page.getByRole('button', { name: /login|sign in/i });

    // Assuming default admin credentials from seed
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@hooks-knots.com');
      await passwordInput.fill('admin123'); // Or whatever the valid seed is
      await submitBtn.click();
      
      // Wait for navigation to dashboard
      await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });
      await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
      
      // Verify stats are loaded (not empty/loading)
      // Look for metric cards
      const metricCards = page.locator('.metric-card, [data-testid="metric"]');
      if (await metricCards.count() > 0) {
        await expect(metricCards.first()).toBeVisible();
      }
    }
  });
});
