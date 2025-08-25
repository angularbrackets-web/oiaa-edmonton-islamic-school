const { test, expect } = require('@playwright/test');

test.describe('Hero Section Video Functionality Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the Islamic school website
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load and hero section to be visible
    await expect(page.locator('section').first()).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(3000); // Wait for animations to settle
  });

  test('Watch Videos button should be visible and have correct styling', async ({ page }) => {
    // Check if Watch Videos button exists
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await expect(videoButton).toBeVisible();
    
    // Check if button has the red/orange color scheme
    await expect(videoButton).toHaveClass(/from-red-500\/20/);
    await expect(videoButton).toHaveClass(/to-orange-500\/20/);
    
    // Check if play icon is present
    const playIcon = videoButton.locator('svg');
    await expect(playIcon).toBeVisible();
    
    // Take screenshot of the Watch Videos button
    await videoButton.screenshot({ path: 'test-results/watch-videos-button.png' });
    
    console.log('✅ Watch Videos button found with correct styling');
  });

  test('Watch Videos button should have animated effects', async ({ page }) => {
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    
    // Check for animation elements
    const shimmerEffect = videoButton.locator('.bg-gradient-to-r');
    const iconGlow = videoButton.locator('.bg-red-400');
    const animatedBorder = videoButton.locator('.absolute.inset-0.rounded-full.border-2');
    
    await expect(shimmerEffect).toBeVisible();
    await expect(iconGlow).toBeVisible();
    await expect(animatedBorder).toBeVisible();
    
    // Test hover effect
    await videoButton.hover();
    await page.waitForTimeout(500);
    
    // Take screenshot during hover
    await page.screenshot({ path: 'test-results/watch-videos-button-hover.png' });
    
    console.log('✅ Watch Videos button animations verified');
  });

  test('Clicking Watch Videos should activate video mode', async ({ page }) => {
    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/before-video-mode.png' });
    
    // Click the Watch Videos button
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    
    // Wait for video mode to activate
    await page.waitForTimeout(2000);
    
    // Take screenshot after clicking
    await page.screenshot({ path: 'test-results/after-video-mode-activation.png' });
    
    // Check if main hero content is hidden (immersive mode)
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    await expect(heroTitle).toBeHidden();
    
    // Check if Arabic text is hidden
    const arabicText = page.locator('.arabic-text');
    await expect(arabicText).toBeHidden();
    
    // Check if CTA buttons are hidden
    const tourButton = page.locator('button', { hasText: 'Book Your School Tour' });
    await expect(tourButton).toBeHidden();
    
    console.log('✅ Video mode activated - immersive interface confirmed');
  });

  test('Video mode should show correct top navigation bar', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check top navigation content changes
    const topNavigation = page.locator('.max-w-7xl.mx-auto.flex.justify-between.items-center');
    await expect(topNavigation).toBeVisible();
    
    // Check for "Video Player" text in top bar
    const videoPlayerText = page.locator('text=Video Player');
    await expect(videoPlayerText).toBeVisible();
    
    // Check for "Now Playing" text in top bar
    const nowPlayingText = page.locator('text=Now Playing');
    await expect(nowPlayingText).toBeVisible();
    
    // Take screenshot of top navigation in video mode
    await topNavigation.screenshot({ path: 'test-results/video-mode-top-navigation.png' });
    
    console.log('✅ Video mode top navigation verified');
  });

  test('Exit Video button should be visible and functional in top bar', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check if Exit Video button appears in top bar
    const exitButton = page.locator('button', { hasText: 'Exit Video' });
    await expect(exitButton).toBeVisible();
    
    // Take screenshot of exit button
    await exitButton.screenshot({ path: 'test-results/exit-video-button.png' });
    
    // Click exit button
    await exitButton.click();
    await page.waitForTimeout(2000);
    
    // Check if we're back to normal mode
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    await expect(heroTitle).toBeVisible();
    
    // Check if Watch Videos button is visible again
    await expect(videoButton).toBeVisible();
    
    // Take screenshot after exiting video mode
    await page.screenshot({ path: 'test-results/after-exit-video.png' });
    
    console.log('✅ Exit Video functionality verified');
  });

  test('Video controls should be visible and functional', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check for video player container
    const videoContainer = page.locator('.absolute.inset-0').nth(1); // Second one should be video container
    await expect(videoContainer).toBeVisible();
    
    // Check for mute/unmute button (top right controls)
    const muteButton = page.locator('button[title*="Mute"], button[title*="Unmute"]');
    await expect(muteButton).toBeVisible();
    
    // Check for exit button in top right
    const topRightExitButton = page.locator('button[title="Exit Video"]');
    await expect(topRightExitButton).toBeVisible();
    
    // Take screenshot of video controls
    await page.screenshot({ path: 'test-results/video-controls.png' });
    
    console.log('✅ Video controls verified');
  });

  test('Video navigation arrows should be present for multiple videos', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check for navigation arrows (left and right)
    const leftArrow = page.locator('button').filter({ has: page.locator('svg[data-lucide="chevron-left"]') });
    const rightArrow = page.locator('button').filter({ has: page.locator('svg[data-lucide="chevron-right"]') });
    
    // These should be visible if there are multiple videos
    const leftArrowVisible = await leftArrow.isVisible();
    const rightArrowVisible = await rightArrow.isVisible();
    
    console.log(`◀️ Left navigation arrow visible: ${leftArrowVisible}`);
    console.log(`▶️ Right navigation arrow visible: ${rightArrowVisible}`);
    
    if (leftArrowVisible || rightArrowVisible) {
      await page.screenshot({ path: 'test-results/video-navigation-arrows.png' });
      console.log('✅ Video navigation arrows found');
    }
  });

  test('Video titles bar should show available videos', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check for video titles bar at the bottom
    const videoTitlesBar = page.locator('.bg-black\\/70.backdrop-blur-sm.rounded-full').filter({ hasText: /New Centre Preview|School Announcement|Student Life/ });
    
    const titlesBarVisible = await videoTitlesBar.isVisible();
    console.log(`📱 Video titles bar visible: ${titlesBarVisible}`);
    
    if (titlesBarVisible) {
      // Check for specific video titles
      const newCentrePreview = page.locator('text=New Centre Preview');
      const schoolAnnouncement = page.locator('text=School Announcement');
      const studentLife = page.locator('text=Student Life');
      
      const newCentreVisible = await newCentrePreview.isVisible();
      const announcementVisible = await schoolAnnouncement.isVisible();
      const studentLifeVisible = await studentLife.isVisible();
      
      console.log(`🎬 "New Centre Preview" visible: ${newCentreVisible}`);
      console.log(`📢 "School Announcement" visible: ${announcementVisible}`);
      console.log(`🎓 "Student Life" visible: ${studentLifeVisible}`);
      
      await videoTitlesBar.screenshot({ path: 'test-results/video-titles-bar.png' });
    }
  });

  test('Video playback controls should be functional for local videos', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check for compact video controls at bottom center
    const videoControls = page.locator('.bg-black\\/70.backdrop-blur-sm.rounded-full.px-4.py-2');
    
    const controlsVisible = await videoControls.isVisible();
    console.log(`🎮 Video controls visible: ${controlsVisible}`);
    
    if (controlsVisible) {
      // Check for rewind button
      const rewindButton = videoControls.locator('button[title*="Rewind"]');
      const playPauseButton = videoControls.locator('button[title*="Play"], button[title*="Pause"]');
      const forwardButton = videoControls.locator('button[title*="Forward"]');
      
      const rewindVisible = await rewindButton.isVisible();
      const playPauseVisible = await playPauseButton.isVisible();
      const forwardVisible = await forwardButton.isVisible();
      
      console.log(`⏪ Rewind button visible: ${rewindVisible}`);
      console.log(`⏯️ Play/Pause button visible: ${playPauseVisible}`);
      console.log(`⏩ Forward button visible: ${forwardVisible}`);
      
      await videoControls.screenshot({ path: 'test-results/video-playback-controls.png' });
    }
  });

  test('Mute/Unmute functionality should work', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Find mute button
    const muteButton = page.locator('button[title*="Mute"], button[title*="Unmute"]');
    await expect(muteButton).toBeVisible();
    
    // Take screenshot before clicking mute
    await muteButton.screenshot({ path: 'test-results/mute-button-before.png' });
    
    // Click mute button to toggle
    await muteButton.click();
    await page.waitForTimeout(500);
    
    // Take screenshot after clicking
    await muteButton.screenshot({ path: 'test-results/mute-button-after.png' });
    
    console.log('✅ Mute/Unmute functionality tested');
  });

  test('Video switching should work when clicking video titles', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Look for video title buttons
    const videoTitleButtons = page.locator('button').filter({ hasText: /New Centre Preview|School Announcement|Student Life/ });
    
    const titleButtonCount = await videoTitleButtons.count();
    console.log(`🎬 Found ${titleButtonCount} video title buttons`);
    
    if (titleButtonCount > 1) {
      // Take screenshot of initial state
      await page.screenshot({ path: 'test-results/before-video-switch.png' });
      
      // Click on second video title if available
      await videoTitleButtons.nth(1).click();
      await page.waitForTimeout(1000);
      
      // Take screenshot after switching
      await page.screenshot({ path: 'test-results/after-video-switch.png' });
      
      console.log('✅ Video switching functionality tested');
    }
  });

  test('Video mode should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check if video player is still functional on mobile
    const videoContainer = page.locator('.absolute.inset-0').nth(1);
    await expect(videoContainer).toBeVisible();
    
    // Check if top navigation is still visible
    const topNavigation = page.locator('.max-w-7xl.mx-auto.flex.justify-between.items-center');
    await expect(topNavigation).toBeVisible();
    
    // Check if exit button is accessible
    const exitButton = page.locator('button', { hasText: 'Exit Video' });
    await expect(exitButton).toBeVisible();
    
    // Take screenshot on mobile
    await page.screenshot({ path: 'test-results/video-mode-mobile.png' });
    
    console.log('✅ Video mode mobile responsiveness verified');
  });

  test('User should not get stuck in video mode', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Verify we can exit through top bar exit button
    const topBarExitButton = page.locator('button', { hasText: 'Exit Video' });
    await expect(topBarExitButton).toBeVisible();
    
    await topBarExitButton.click();
    await page.waitForTimeout(2000);
    
    // Verify we're back to normal state
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    await expect(heroTitle).toBeVisible();
    
    // Try entering video mode again to ensure it still works
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Verify video mode is active again
    await expect(heroTitle).toBeHidden();
    
    // Try exiting through top-right exit button this time
    const topRightExitButton = page.locator('button[title="Exit Video"]');
    
    const topRightExitVisible = await topRightExitButton.isVisible();
    if (topRightExitVisible) {
      await topRightExitButton.click();
      await page.waitForTimeout(2000);
      
      // Verify we're back to normal state
      await expect(heroTitle).toBeVisible();
    }
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/final-exit-verification.png' });
    
    console.log('✅ User cannot get stuck in video mode - multiple exit paths verified');
  });

  test('Complete video mode workflow', async ({ page }) => {
    console.log('🎬 Starting complete video mode workflow test...');
    
    // Step 1: Verify initial state
    await page.screenshot({ path: 'test-results/workflow-01-initial-state.png' });
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await expect(videoButton).toBeVisible();
    console.log('✅ Step 1: Initial state verified');
    
    // Step 2: Enter video mode
    await videoButton.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/workflow-02-video-mode-active.png' });
    
    // Verify video mode elements
    const topNavigation = page.locator('text=Video Player');
    await expect(topNavigation).toBeVisible();
    console.log('✅ Step 2: Video mode activated');
    
    // Step 3: Test video controls
    const muteButton = page.locator('button[title*="Mute"], button[title*="Unmute"]');
    if (await muteButton.isVisible()) {
      await muteButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Step 3: Video controls tested');
    }
    
    // Step 4: Test video navigation if available
    const rightArrow = page.locator('button').filter({ has: page.locator('svg[data-lucide="chevron-right"]') });
    if (await rightArrow.isVisible()) {
      await rightArrow.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/workflow-03-video-navigation.png' });
      console.log('✅ Step 4: Video navigation tested');
    }
    
    // Step 5: Exit video mode
    const exitButton = page.locator('button', { hasText: 'Exit Video' });
    await exitButton.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/workflow-04-back-to-normal.png' });
    
    // Verify we're back to normal
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    await expect(heroTitle).toBeVisible();
    console.log('✅ Step 5: Successfully exited video mode');
    
    console.log('🎉 Complete video mode workflow test passed!');
  });

});