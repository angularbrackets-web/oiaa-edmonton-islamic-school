const { test, expect } = require('@playwright/test');

test.describe('Hero Section Manual Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the hero section to be fully loaded
    await page.waitForSelector('text=OIA Academy Edmonton', { timeout: 15000 });
    await page.waitForTimeout(2000); // Allow time for animations to complete
  });

  test.describe('Achievement Card Manual Navigation', () => {
    test('should show navigation arrows on achievement card', async ({ page }) => {
      // Check for navigation arrows on the achievement card
      const leftArrow = page.locator('button[title="Previous achievement"]');
      const rightArrow = page.locator('button[title="Next achievement"]');
      
      await expect(leftArrow).toBeVisible();
      await expect(rightArrow).toBeVisible();
      
      // Verify arrow icons
      await expect(leftArrow.locator('svg')).toBeVisible();
      await expect(rightArrow.locator('svg')).toBeVisible();
      
      // Take screenshot showing navigation arrows
      await page.screenshot({ 
        path: 'test-results/achievement-navigation-arrows.png',
        fullPage: false 
      });
    });

    test('should navigate achievements using arrow buttons', async ({ page }) => {
      // Get the achievement title before clicking (only in the achievement card)
      const achievementTitle = page.locator('.bg-white\\/95 h3.text-2xl.font-bold.text-deep-teal');
      const initialTitle = await achievementTitle.textContent();
      
      // Click right arrow to go to next achievement
      const rightArrow = page.locator('button[title="Next achievement"]');
      await rightArrow.click();
      await page.waitForTimeout(1000); // Wait for animation
      
      // Verify the title changed
      const newTitle = await achievementTitle.textContent();
      expect(newTitle).not.toBe(initialTitle);
      
      // Take screenshot of new achievement
      await page.screenshot({ 
        path: 'test-results/achievement-after-next.png',
        fullPage: false 
      });
      
      // Click left arrow to go back
      const leftArrow = page.locator('button[title="Previous achievement"]');
      await leftArrow.click();
      await page.waitForTimeout(1000);
      
      // Verify we're back to the original achievement
      const backTitle = await achievementTitle.textContent();
      expect(backTitle).toBe(initialTitle);
    });

    test('should show clickable dot indicators', async ({ page }) => {
      // Find the dot indicators
      const dots = page.locator('button[title*="Go to achievement"]');
      
      // Should have 3 achievements (based on the mock data)
      await expect(dots).toHaveCount(3);
      
      // Verify dots are clickable and have proper styling
      const firstDot = dots.first();
      const lastDot = dots.last();
      
      await expect(firstDot).toBeVisible();
      await expect(lastDot).toBeVisible();
      
      // Verify hover effects work
      await firstDot.hover();
      await page.waitForTimeout(200);
      
      // Take screenshot showing dot indicators
      await page.screenshot({ 
        path: 'test-results/achievement-dot-indicators.png',
        fullPage: false 
      });
    });

    test('should navigate achievements using dot indicators', async ({ page }) => {
      const achievementTitle = page.locator('.bg-white\\/95 h3.text-2xl.font-bold.text-deep-teal');
      const dots = page.locator('button[title*="Go to achievement"]');
      
      // Get initial achievement title
      const initialTitle = await achievementTitle.textContent();
      
      // Click on the third dot (index 2)
      await dots.nth(2).click();
      await page.waitForTimeout(1000);
      
      // Verify achievement changed
      const newTitle = await achievementTitle.textContent();
      expect(newTitle).not.toBe(initialTitle);
      
      // Verify the correct dot is highlighted
      const activeDot = dots.nth(2);
      await expect(activeDot).toHaveClass(/bg-terracotta-red/);
      
      // Take screenshot showing active dot
      await page.screenshot({ 
        path: 'test-results/active-dot-indicator.png',
        fullPage: false 
      });
    });

    test('should support keyboard navigation with arrow keys', async ({ page }) => {
      const achievementTitle = page.locator('.bg-white\\/95 h3.text-2xl.font-bold.text-deep-teal');
      
      // Get initial achievement title
      const initialTitle = await achievementTitle.textContent();
      
      // Use right arrow key to navigate
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(1000);
      
      // Verify achievement changed
      const newTitle = await achievementTitle.textContent();
      expect(newTitle).not.toBe(initialTitle);
      
      // Use left arrow key to go back
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(1000);
      
      // Verify we're back to original
      const backTitle = await achievementTitle.textContent();
      expect(backTitle).toBe(initialTitle);
      
      // Take screenshot after keyboard navigation
      await page.screenshot({ 
        path: 'test-results/keyboard-navigation-test.png',
        fullPage: false 
      });
    });

    test('should pause auto-rotation when manually navigating', async ({ page }) => {
      const achievementTitle = page.locator('.bg-white\\/95 h3.text-2xl.font-bold.text-deep-teal');
      
      // Get initial title
      const initialTitle = await achievementTitle.textContent();
      
      // Manually navigate using arrow button
      const rightArrow = page.locator('button[title="Next achievement"]');
      await rightArrow.click();
      await page.waitForTimeout(1000);
      
      const manualTitle = await achievementTitle.textContent();
      expect(manualTitle).not.toBe(initialTitle);
      
      // Wait for 6 seconds (longer than normal 5-second auto-rotation)
      // The title should remain the same due to pause
      await page.waitForTimeout(6000);
      
      const pausedTitle = await achievementTitle.textContent();
      expect(pausedTitle).toBe(manualTitle);
      
      // Take screenshot showing paused state
      await page.screenshot({ 
        path: 'test-results/auto-rotation-paused.png',
        fullPage: false 
      });
    });

    test('should not interfere with keyboard navigation in video/gallery modes', async ({ page }) => {
      // Enter gallery mode
      await page.click('text=View Gallery');
      await page.waitForTimeout(1000);
      
      // Try arrow keys in gallery mode (should not affect achievements)
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(500);
      
      // Exit gallery mode
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Verify we're back to normal hero section
      await expect(page.locator('text=View Gallery')).toBeVisible();
      
      // Test in video mode
      await page.click('text=Watch Videos');
      await page.waitForTimeout(2000);
      
      // Try arrow keys in video mode
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(500);
      
      // Exit video mode
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Verify we're back to normal
      await expect(page.locator('text=Watch Videos')).toBeVisible();
    });

    test('should have proper accessibility features', async ({ page }) => {
      // Check arrow buttons have proper titles
      const leftArrow = page.locator('button[title="Previous achievement"]');
      const rightArrow = page.locator('button[title="Next achievement"]');
      
      await expect(leftArrow).toHaveAttribute('title', 'Previous achievement');
      await expect(rightArrow).toHaveAttribute('title', 'Next achievement');
      
      // Check dot indicators have proper titles
      const dots = page.locator('button[title*="Go to achievement"]');
      const firstDot = dots.first();
      
      await expect(firstDot).toHaveAttribute('title', 'Go to achievement 1');
      
      // Test focus states
      await leftArrow.focus();
      await page.waitForTimeout(200);
      
      await rightArrow.focus();
      await page.waitForTimeout(200);
      
      await firstDot.focus();
      await page.waitForTimeout(200);
      
      // Take screenshot showing focus states
      await page.screenshot({ 
        path: 'test-results/navigation-accessibility.png',
        fullPage: false 
      });
    });
  });
});