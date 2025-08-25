const { test, expect } = require('@playwright/test');

test.describe('Hero Section Improvements Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the hero section to be fully loaded
    await page.waitForSelector('text=OIA Academy Edmonton', { timeout: 15000 });
    await page.waitForTimeout(2000); // Allow time for animations to complete
  });

  test.describe('Exit Button Styling Improvements', () => {
    test('should show improved exit button styling in gallery mode', async ({ page }) => {
      // Enter gallery mode
      await page.click('text=View Gallery');
      await page.waitForTimeout(1000);

      // Find the exit gallery button
      const exitButton = page.locator('button:has-text("Exit Gallery")');
      await expect(exitButton).toBeVisible();

      // Take screenshot of the improved button styling
      await page.screenshot({ 
        path: 'test-results/gallery-exit-button-styling.png',
        fullPage: false 
      });

      // Verify button has the improved styling classes
      await expect(exitButton).toHaveClass(/bg-black\/80/);
      await expect(exitButton).toHaveClass(/border-2/);
      await expect(exitButton).toHaveClass(/border-white\/40/);
      await expect(exitButton).toHaveClass(/px-5/);
      await expect(exitButton).toHaveClass(/py-3/);
      await expect(exitButton).toHaveClass(/shadow-lg/);

      // Verify the icon size (w-5 h-5)
      const xIcon = exitButton.locator('svg');
      await expect(xIcon).toHaveClass(/w-5/);
      await expect(xIcon).toHaveClass(/h-5/);

      // Test hover effect
      await exitButton.hover();
      await page.waitForTimeout(500);
      await expect(exitButton).toHaveClass(/hover:bg-black\/90/);
      await expect(exitButton).toHaveClass(/hover:border-white\/60/);
      await expect(exitButton).toHaveClass(/hover:shadow-xl/);

      // Take screenshot of hover state
      await page.screenshot({ 
        path: 'test-results/gallery-exit-button-hover.png',
        fullPage: false 
      });
    });

    test('should show improved exit button styling in video mode', async ({ page }) => {
      // Enter video mode
      await page.click('text=Watch Videos');
      await page.waitForTimeout(2000);

      // Find the exit video button
      const exitButton = page.locator('button:has-text("Exit Video")');
      await expect(exitButton).toBeVisible();

      // Take screenshot of the improved button styling
      await page.screenshot({ 
        path: 'test-results/video-exit-button-styling.png',
        fullPage: false 
      });

      // Verify button has the improved styling classes
      await expect(exitButton).toHaveClass(/bg-black\/80/);
      await expect(exitButton).toHaveClass(/border-2/);
      await expect(exitButton).toHaveClass(/border-white\/40/);
      await expect(exitButton).toHaveClass(/px-5/);
      await expect(exitButton).toHaveClass(/py-3/);
      await expect(exitButton).toHaveClass(/shadow-lg/);

      // Verify the icon size (w-5 h-5)
      const xIcon = exitButton.locator('svg');
      await expect(xIcon).toHaveClass(/w-5/);
      await expect(xIcon).toHaveClass(/h-5/);

      // Test hover effect
      await exitButton.hover();
      await page.waitForTimeout(500);
      await expect(exitButton).toHaveClass(/hover:bg-black\/90/);
      await expect(exitButton).toHaveClass(/hover:border-white\/60/);
      await expect(exitButton).toHaveClass(/hover:shadow-xl/);

      // Take screenshot of hover state
      await page.screenshot({ 
        path: 'test-results/video-exit-button-hover.png',
        fullPage: false 
      });
    });
  });

  test.describe('Escape Key Functionality', () => {
    test('should exit gallery mode when Escape key is pressed', async ({ page }) => {
      // Enter gallery mode
      await page.click('text=View Gallery');
      await page.waitForTimeout(1000);

      // Verify we're in gallery mode
      await expect(page.locator('button:has-text("Exit Gallery")')).toBeVisible();
      
      // Take screenshot showing gallery mode
      await page.screenshot({ 
        path: 'test-results/gallery-mode-before-escape.png',
        fullPage: true 
      });

      // Press Escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Verify we've exited gallery mode
      await expect(page.locator('button:has-text("Exit Gallery")')).not.toBeVisible();
      await expect(page.locator('text=View Gallery')).toBeVisible();
      
      // Take screenshot showing normal mode after escape
      await page.screenshot({ 
        path: 'test-results/normal-mode-after-escape-from-gallery.png',
        fullPage: true 
      });
    });

    test('should exit video mode when Escape key is pressed', async ({ page }) => {
      // Enter video mode
      await page.click('text=Watch Videos');
      await page.waitForTimeout(2000);

      // Verify we're in video mode
      await expect(page.locator('button:has-text("Exit Video")')).toBeVisible();
      
      // Take screenshot showing video mode
      await page.screenshot({ 
        path: 'test-results/video-mode-before-escape.png',
        fullPage: true 
      });

      // Press Escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Verify we've exited video mode
      await expect(page.locator('button:has-text("Exit Video")')).not.toBeVisible();
      await expect(page.locator('text=Watch Videos')).toBeVisible();
      
      // Take screenshot showing normal mode after escape
      await page.screenshot({ 
        path: 'test-results/normal-mode-after-escape-from-video.png',
        fullPage: true 
      });
    });

    test('should not interfere with other functionality when Escape is pressed in normal mode', async ({ page }) => {
      // Ensure we're in normal mode
      await expect(page.locator('text=Watch Videos')).toBeVisible();
      await expect(page.locator('text=View Gallery')).toBeVisible();

      // Press Escape key in normal mode
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Verify normal functionality still works
      await expect(page.locator('text=Watch Videos')).toBeVisible();
      await expect(page.locator('text=View Gallery')).toBeVisible();
      
      // Take screenshot showing normal mode remains unchanged
      await page.screenshot({ 
        path: 'test-results/normal-mode-escape-no-effect.png',
        fullPage: true 
      });
    });

    test('should handle rapid Escape key presses gracefully', async ({ page }) => {
      // Enter gallery mode
      await page.click('text=View Gallery');
      await page.waitForTimeout(1000);

      // Press Escape multiple times rapidly
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Verify we're still in normal mode (no errors)
      await expect(page.locator('text=View Gallery')).toBeVisible();
      await expect(page.locator('button:has-text("Exit Gallery")')).not.toBeVisible();
    });
  });

  test.describe('Overall UX Improvements', () => {
    test('should provide clear visual cues for mode transitions', async ({ page }) => {
      // Test gallery transition
      await page.click('text=View Gallery');
      await page.waitForTimeout(1000);
      
      // Verify gallery mode visual indicators
      await expect(page.locator('text=School Gallery')).toBeVisible();
      await expect(page.locator('text=Photo Gallery')).toBeVisible();
      
      // Take screenshot of gallery mode UI
      await page.screenshot({ 
        path: 'test-results/gallery-mode-visual-cues.png',
        fullPage: true 
      });

      // Exit gallery mode
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Test video transition
      await page.click('text=Watch Videos');
      await page.waitForTimeout(2000);
      
      // Verify video mode visual indicators
      await expect(page.locator('text=Video Player')).toBeVisible();
      await expect(page.locator('text=Now Playing')).toBeVisible();
      
      // Take screenshot of video mode UI
      await page.screenshot({ 
        path: 'test-results/video-mode-visual-cues.png',
        fullPage: true 
      });
    });

    test('should maintain responsive design with improved buttons', async ({ page }) => {
      // Test on mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Enter gallery mode
      await page.click('text=View Gallery');
      await page.waitForTimeout(1000);
      
      // Verify button is visible and properly styled on mobile
      const exitButton = page.locator('button:has-text("Exit Gallery")');
      await expect(exitButton).toBeVisible();
      
      // Take mobile screenshot
      await page.screenshot({ 
        path: 'test-results/mobile-gallery-exit-button.png',
        fullPage: false 
      });

      // Test escape functionality on mobile
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      await expect(exitButton).not.toBeVisible();

      // Reset to desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    test('should show proper tooltips and accessibility features', async ({ page }) => {
      // Enter gallery mode
      await page.click('text=View Gallery');
      await page.waitForTimeout(1000);

      // Check tooltip text
      const exitButton = page.locator('button:has-text("Exit Gallery")');
      await expect(exitButton).toHaveAttribute('title', 'Exit Gallery (Press Escape)');

      // Enter video mode
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      await page.click('text=Watch Videos');
      await page.waitForTimeout(2000);

      // Check video exit button tooltip
      const videoExitButton = page.locator('button:has-text("Exit Video")');
      await expect(videoExitButton).toHaveAttribute('title', 'Exit Video (Press Escape)');
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work consistently across different browsers', async ({ page, browserName }) => {
      console.log(`Testing on ${browserName}`);
      
      // Enter gallery mode
      await page.click('text=View Gallery');
      await page.waitForTimeout(1000);

      // Test escape functionality
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Verify exit worked
      await expect(page.locator('text=View Gallery')).toBeVisible();
      
      // Take browser-specific screenshot
      await page.screenshot({ 
        path: `test-results/cross-browser-${browserName}-escape-test.png`,
        fullPage: true 
      });
    });
  });
});