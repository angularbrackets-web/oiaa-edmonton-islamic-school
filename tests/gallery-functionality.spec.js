const { test, expect } = require('@playwright/test');

test.describe('View Gallery Functionality Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the Islamic school website
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load and hero section to be visible
    await expect(page.locator('section')).toBeVisible();
    await page.waitForTimeout(2000); // Wait for animations to settle
  });

  test('View Gallery button should be visible and have correct styling', async ({ page }) => {
    // Check if View Gallery button exists
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    await expect(galleryButton).toBeVisible();
    
    // Check if button has the teal/emerald color scheme
    await expect(galleryButton).toHaveClass(/from-teal-500\/20/);
    await expect(galleryButton).toHaveClass(/to-emerald-500\/20/);
    
    // Check if camera icon is present
    const cameraIcon = galleryButton.locator('svg');
    await expect(cameraIcon).toBeVisible();
  });

  test('Clicking View Gallery should enter gallery mode', async ({ page }) => {
    // Click the View Gallery button
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    await galleryButton.click();
    
    // Wait for gallery mode to activate
    await page.waitForTimeout(1000);
    
    // Check if main hero content is hidden (immersive mode)
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    await expect(heroTitle).toBeHidden();
    
    // Check if Arabic text is hidden
    const arabicText = page.locator('.arabic-text');
    await expect(arabicText).toBeHidden();
    
    // Check if CTA buttons are hidden
    const tourButton = page.locator('button', { hasText: 'Book Your School Tour' });
    await expect(tourButton).toBeHidden();
  });

  test('Gallery mode should show infinite scroll gallery', async ({ page }) => {
    // Enter gallery mode
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    await galleryButton.click();
    await page.waitForTimeout(1000);
    
    // Check if gallery grid is visible
    const galleryGrid = page.locator('.grid.grid-cols-4');
    await expect(galleryGrid).toBeVisible();
    
    // Check if images are loading
    const galleryImages = page.locator('img[src*="/uploads/images/new-center"]');
    await expect(galleryImages.first()).toBeVisible();
    
    // Verify multiple images are present
    const imageCount = await galleryImages.count();
    expect(imageCount).toBeGreaterThan(5);
  });

  test('Gallery filter controls should be functional', async ({ page }) => {
    // Enter gallery mode
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    await galleryButton.click();
    await page.waitForTimeout(1000);
    
    // Check if filter controls are visible
    const filterControls = page.locator('.bg-black\\/80.backdrop-blur-sm.rounded-full');
    await expect(filterControls).toBeVisible();
    
    // Check for filter buttons
    const allPhotosFilter = page.locator('button', { hasText: 'All Photos' });
    const newCentreFilter = page.locator('button', { hasText: 'New Centre' });
    const groundBreakingFilter = page.locator('button', { hasText: 'Ground Breaking' });
    
    await expect(allPhotosFilter).toBeVisible();
    await expect(newCentreFilter).toBeVisible();
    await expect(groundBreakingFilter).toBeVisible();
    
    // Test filter functionality
    await newCentreFilter.click();
    await page.waitForTimeout(500);
    
    // Check if filter is applied (active state)
    await expect(newCentreFilter).toHaveClass(/bg-white\/20/);
  });

  test('Gallery images should have hover effects', async ({ page }) => {
    // Enter gallery mode
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    await galleryButton.click();
    await page.waitForTimeout(1000);
    
    // Get first gallery image container
    const firstImageContainer = page.locator('.relative.rounded-2xl.overflow-hidden').first();
    await expect(firstImageContainer).toBeVisible();
    
    // Hover over the image
    await firstImageContainer.hover();
    await page.waitForTimeout(300);
    
    // Check if text overlay appears on hover
    const textOverlay = firstImageContainer.locator('.absolute.bottom-0');
    await expect(textOverlay).toBeVisible();
  });

  test('Exit Gallery functionality should work', async ({ page }) => {
    // Enter gallery mode
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    await galleryButton.click();
    await page.waitForTimeout(1000);
    
    // Check if Exit Gallery button appears
    const exitButton = page.locator('button', { hasText: 'Exit Gallery' });
    await expect(exitButton).toBeVisible();
    
    // Click exit button
    await exitButton.click();
    await page.waitForTimeout(1000);
    
    // Check if we're back to normal mode
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    await expect(heroTitle).toBeVisible();
    
    // Check if gallery grid is hidden
    const galleryGrid = page.locator('.grid.grid-cols-4');
    await expect(galleryGrid).toBeHidden();
    
    // Check if View Gallery button is visible again
    await expect(galleryButton).toBeVisible();
  });

  test('Gallery should have smooth animations', async ({ page }) => {
    // Enter gallery mode
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    await galleryButton.click();
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Check if gallery content has proper motion classes
    const galleryContainer = page.locator('.grid.grid-cols-4');
    await expect(galleryContainer).toBeVisible();
    
    // Verify infinite scroll animation is running
    const animatedContainer = galleryContainer.locator('[style*="transform"]');
    await expect(animatedContainer).toBeVisible();
  });

  test('Gallery should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Enter gallery mode
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    await galleryButton.click();
    await page.waitForTimeout(1000);
    
    // Check if gallery is still functional on mobile
    const galleryGrid = page.locator('.grid.grid-cols-4');
    await expect(galleryGrid).toBeVisible();
    
    // Check if filter controls are still accessible
    const filterControls = page.locator('.bg-black\\/80.backdrop-blur-sm.rounded-full');
    await expect(filterControls).toBeVisible();
    
    // Test touch interactions
    const firstImage = page.locator('.relative.rounded-2xl.overflow-hidden').first();
    await firstImage.tap();
    await page.waitForTimeout(300);
  });

  test('Gallery button animations should be active', async ({ page }) => {
    // Check if View Gallery button has animation classes
    const galleryButton = page.locator('button', { hasText: 'View Gallery' });
    
    // Verify button has motion properties (animated border, shimmer, etc.)
    const animatedBorder = galleryButton.locator('.absolute.inset-0.rounded-full.border-2');
    await expect(animatedBorder).toBeVisible();
    
    // Check for shimmer effect
    const shimmerEffect = galleryButton.locator('.absolute.inset-0.bg-gradient-to-r');
    await expect(shimmerEffect).toBeVisible();
    
    // Verify icon has glow effect
    const iconGlow = galleryButton.locator('.bg-teal-400.rounded-full.blur-sm');
    await expect(iconGlow).toBeVisible();
  });

});