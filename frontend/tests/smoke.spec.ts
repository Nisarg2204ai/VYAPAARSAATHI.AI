import { test, expect } from '@playwright/test';

test.describe('Vyapari WhatsApp Assistant Smoke Tests', () => {
  test('loads homepage and navigates to Vyapari assistant', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/VyapaarSathi|Vyapari/i);

    // Navigate to Vyapari Kirana page
    await page.goto('/vyapari');
    await expect(page.locator('h1, h2, h3')).toContainText(/Vyapari|Kirana/i);
  });

  test('creates an invoice from natural language message', async ({ page }) => {
    await page.goto('/vyapari');

    const input = page.locator('input[placeholder*="invoice"], textarea[placeholder*="invoice"], input[type="text"]').first();
    if (await input.isVisible()) {
      await input.fill('2 kg cheeni 90, 1 Parle-G 10, chai 20');
      
      const sendBtn = page.locator('button:has-text("Send"), button:has-text("Create"), button[type="submit"]').first();
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
      } else {
        await input.press('Enter');
      }

      await expect(page.locator('body')).toContainText(/Total|₹120|Invoice/i);
    }
  });

  test('reconciles bank SMS paste', async ({ page }) => {
    await page.goto('/vyapari');

    // Switch to Reconcile tab if present
    const reconcileTab = page.locator('button:has-text("Reconcile"), button:has-text("UPI")').first();
    if (await reconcileTab.isVisible()) {
      await reconcileTab.click();
    }

    const smsInput = page.locator('textarea, input[placeholder*="SMS"]').first();
    if (await smsInput.isVisible()) {
      await smsInput.fill('Rs.200.00 credited to a/c XX1234 on 30-07-26 from VPA parleg@okaxis (Ramesh Kumar) UPI Ref 123456789012');
      const matchBtn = page.locator('button:has-text("Match"), button:has-text("Reconcile")').first();
      if (await matchBtn.isVisible()) {
        await matchBtn.click();
      }
      await expect(page.locator('body')).toContainText(/AUTO_MATCH|Ramesh Kumar|Score/i);
    }
  });
});
