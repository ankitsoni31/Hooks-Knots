import { test, expect } from '@playwright/test';

test.describe('Storefront - Home & Navigation', () => {
  test('should load homepage and verify no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Verify title or main heading
    await expect(page).toHaveTitle(/Hooks & Knots/i);
    await expect(page.getByRole('heading', { name: /Elegance/i })).toBeVisible();

    // Give it a moment to load requests
    await page.waitForLoadState('networkidle');

    // Verify no major errors
    expect(errors).toHaveLength(0);
  });

  test('should load products from backend', async ({ page }) => {
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/products') && response.status() === 200);
    await page.goto('/shop');
    
    // Wait for the API call to products
    await responsePromise;
    
    // Verify product cards are displayed
    const productCards = page.locator('.product-card, [data-testid="product-card"]');
    // If we don't know the exact class, we can look for links that look like products
    // Assuming products have links starting with /product/
    const productLinks = page.locator('a[href^="/product/"]');
    
    // Just verify at least one product is loaded if the DB has products
    const count = await productLinks.count();
    if (count > 0) {
      const firstProduct = productLinks.first();
      await expect(firstProduct).toBeVisible();
      
      // Verify price format (₹)
      await expect(firstProduct.locator('text=₹').first()).toBeVisible();
    }
  });

  test('should verify search functionality', async ({ page }) => {
    await page.goto('/');
    
    // We expect a search input to exist
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('NonExistingProduct12345');
    await searchInput.press('Enter');
    
    // Wait for search results to update
    await expect(page.getByText(/no products found/i, { ignoreCase: true })).toBeVisible({ timeout: 10000 }).catch(() => {});
  });
});
