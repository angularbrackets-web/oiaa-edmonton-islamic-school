const { test, expect } = require('@playwright/test');

test.describe('Hero Section - Escape Key Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=OIA Academy Edmonton', { timeout: 15000 });
    await page.waitForTimeout(3000); // Allow animations to complete
  });

  test('should exit gallery mode with Escape key', async ({ page }) => {
    // Take screenshot of normal mode
    await page.screenshot({ 
      path: 'test-results/normal-mode-initial.png',
      fullPage: true 
    });

    // Enter gallery mode
    await page.click('text=View Gallery');
    await page.waitForTimeout(2000);

    // Verify we're in gallery mode
    const exitButton = page.locator('button:has-text("Exit Gallery")');
    await expect(exitButton).toBeVisible();
    
    // Take screenshot of gallery mode
    await page.screenshot({ 
      path: 'test-results/gallery-mode-active.png',
      fullPage: true 
    });

    // Press Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Verify we've exited gallery mode
    await expect(exitButton).not.toBeVisible();
    await expect(page.locator('text=View Gallery')).toBeVisible();
    
    // Take screenshot after escape
    await page.screenshot({ 
      path: 'test-results/normal-mode-after-escape-gallery.png',
      fullPage: true 
    });
  });

  test('should exit video mode with Escape key', async ({ page }) => {
    // Enter video mode
    await page.click('text=Watch Videos');
    await page.waitForTimeout(3000);

    // Verify we're in video mode
    const exitButton = page.locator('button:has-text("Exit Video")');
    await expect(exitButton).toBeVisible();
    
    // Take screenshot of video mode
    await page.screenshot({ 
      path: 'test-results/video-mode-active.png',
      fullPage: true 
    });

    // Press Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Verify we've exited video mode
    await expect(exitButton).not.toBeVisible();
    await expect(page.locator('text=Watch Videos')).toBeVisible();
    
    // Take screenshot after escape
    await page.screenshot({ 
      path: 'test-results/normal-mode-after-escape-video.png',
      fullPage: true 
    });
  });

  test('should verify exit button styling improvements', async ({ page }) => {
    // Test gallery exit button styling
    await page.click('text=View Gallery');
    await page.waitForTimeout(2000);

    const galleryExitButton = page.locator('button:has-text("Exit Gallery")');
    await expect(galleryExitButton).toBeVisible();

    // Take close-up screenshot of gallery exit button
    await galleryExitButton.screenshot({ 
      path: 'test-results/gallery-exit-button-closeup.png'
    });

    // Exit gallery and test video button
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    await page.click('text=Watch Videos');
    await page.waitForTimeout(3000);

    const videoExitButton = page.locator('button:has-text("Exit Video")');
    await expect(videoExitButton).toBeVisible();

    // Take close-up screenshot of video exit button
    await videoExitButton.screenshot({ 
      path: 'test-results/video-exit-button-closeup.png'
    });
  });
});