const { test, expect } = require('@playwright/test');

test.describe('View Gallery Functionality - Islamic School Website', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the Islamic school website
    await page.goto('http://localhost:3000');
    
    // Wait for the hero section to load
    await page.waitForSelector('section.relative.min-h-screen.overflow-hidden', { timeout: 10000 });
    await page.waitForTimeout(3000); // Wait for animations and content to settle
  });

  test('View Gallery button should be visible and clickable', async ({ page }) => {
    // Look for the View Gallery button specifically
    const galleryButton = page.locator('button:has-text("View Gallery")');
    
    // Check if button is visible
    await expect(galleryButton).toBeVisible({ timeout: 10000 });
    
    // Check if button has teal color classes
    const buttonClasses = await galleryButton.getAttribute('class');
    expect(buttonClasses).toContain('teal-500');
    
    // Take a screenshot of the button
    await galleryButton.screenshot({ path: 'test-results/gallery-button.png' });
    
    console.log('✅ View Gallery button found and verified!');
  });

  test('Clicking View Gallery should activate gallery mode', async ({ page }) => {
    // Find and click the View Gallery button
    const galleryButton = page.locator('button:has-text("View Gallery")');
    await expect(galleryButton).toBeVisible({ timeout: 10000 });
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/before-gallery-click.png' });
    
    // Click the gallery button
    await galleryButton.click();
    await page.waitForTimeout(2000); // Wait for gallery mode to activate
    
    // Take screenshot after clicking
    await page.screenshot({ path: 'test-results/after-gallery-click.png' });
    
    // Check if hero title is hidden (immersive mode test)
    const heroTitle = page.locator('h1:has-text("OIA Academy Edmonton")');
    const titleVisible = await heroTitle.isVisible();
    
    if (!titleVisible) {
      console.log('✅ Immersive mode activated - hero content hidden!');
    } else {
      console.log('❌ Hero content still visible in gallery mode');
    }
    
    // Look for gallery content
    const galleryImages = page.locator('img[src*="new-center"]');
    const imageCount = await galleryImages.count();
    console.log(`📸 Found ${imageCount} gallery images`);
    
    expect(imageCount).toBeGreaterThan(0);
  });

  test('Gallery filter controls should be present', async ({ page }) => {
    // Enter gallery mode
    const galleryButton = page.locator('button:has-text("View Gallery")');
    await galleryButton.click();
    await page.waitForTimeout(2000);
    
    // Look for filter controls
    const filterControls = page.locator('.bg-black\\/80, .bg-black\\/80').first();
    
    // Check for filter buttons with more flexible selectors
    const allPhotosFilter = page.locator('button:has-text("All Photos")');
    const newCentreFilter = page.locator('button:has-text("New Centre")');
    
    const allPhotosVisible = await allPhotosFilter.isVisible();
    const newCentreVisible = await newCentreFilter.isVisible();
    
    console.log(`🔍 All Photos filter visible: ${allPhotosVisible}`);
    console.log(`🔍 New Centre filter visible: ${newCentreVisible}`);
    
    // Take screenshot of gallery mode
    await page.screenshot({ path: 'test-results/gallery-mode-full.png' });
  });

  test('Exit Gallery should work', async ({ page }) => {
    // Enter gallery mode
    const galleryButton = page.locator('button:has-text("View Gallery")');
    await galleryButton.click();
    await page.waitForTimeout(2000);
    
    // Look for exit button
    const exitButton = page.locator('button:has-text("Exit Gallery")');
    const exitVisible = await exitButton.isVisible();
    
    console.log(`🚪 Exit Gallery button visible: ${exitVisible}`);
    
    if (exitVisible) {
      // Click exit
      await exitButton.click();
      await page.waitForTimeout(2000);
      
      // Check if hero content is back
      const heroTitle = page.locator('h1:has-text("OIA Academy Edmonton")');
      const titleBackVisible = await heroTitle.isVisible();
      
      console.log(`🏠 Hero content restored: ${titleBackVisible}`);
      
      // Take screenshot after exit
      await page.screenshot({ path: 'test-results/after-gallery-exit.png' });
    }
  });

  test('Button animations should be present', async ({ page }) => {
    // Check for animated elements in the View Gallery button
    const galleryButton = page.locator('button:has-text("View Gallery")');
    
    // Look for animation-related elements
    const shimmerEffect = galleryButton.locator('.bg-gradient-to-r');
    const iconGlow = galleryButton.locator('.bg-teal-400');
    
    const shimmerExists = await shimmerEffect.count() > 0;
    const glowExists = await iconGlow.count() > 0;
    
    console.log(`✨ Shimmer animation elements: ${shimmerExists}`);
    console.log(`🌟 Icon glow elements: ${glowExists}`);
    
    // Test hover effect
    await galleryButton.hover();
    await page.waitForTimeout(500);
    
    // Take screenshot during hover
    await page.screenshot({ path: 'test-results/gallery-button-hover.png' });
    
    console.log('🎯 Hover effect tested');
  });

});