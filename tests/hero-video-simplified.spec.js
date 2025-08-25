const { test, expect } = require('@playwright/test');

test.describe('Hero Section Video Functionality - Simplified Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the Islamic school website
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await expect(page.locator('section').first()).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(3000); // Wait for animations to settle
  });

  test('1. Watch Videos button should be visible and functional', async ({ page }) => {
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/01-initial-state.png' });
    
    // Check if Watch Videos button exists and is visible
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await expect(videoButton).toBeVisible();
    
    // Verify button styling (red/orange theme)
    const buttonClasses = await videoButton.getAttribute('class');
    expect(buttonClasses).toContain('red-500');
    
    // Check if play icon is present
    const playIcon = videoButton.locator('svg');
    await expect(playIcon).toBeVisible();
    
    console.log('✅ Watch Videos button found and verified!');
  });

  test('2. Clicking Watch Videos should activate video mode', async ({ page }) => {
    // Click the Watch Videos button
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    
    // Wait for video mode to activate
    await page.waitForTimeout(3000);
    
    // Take screenshot of video mode
    await page.screenshot({ path: 'test-results/02-video-mode-active.png' });
    
    // Check if main hero title is hidden (immersive mode)
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    const isHidden = await heroTitle.isHidden();
    
    if (isHidden) {
      console.log('✅ Immersive video mode activated - hero content hidden!');
    } else {
      console.log('⚠️ Hero content still visible in video mode');
    }
    
    // Verify we're in video mode by checking for video-specific elements
    const videoContainer = page.locator('iframe[src*="streamable.com"], video');
    const videoExists = await videoContainer.count() > 0;
    
    if (videoExists) {
      console.log('✅ Video player detected!');
    }
    
    expect(videoExists).toBe(true);
  });

  test('3. Video mode should show correct top navigation', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check for "Video Player" text in top navigation
    const videoPlayerText = page.locator('text=Video Player');
    await expect(videoPlayerText).toBeVisible();
    
    // Check for "Now Playing" text
    const nowPlayingText = page.locator('text=Now Playing');
    await expect(nowPlayingText).toBeVisible();
    
    // Take screenshot of top navigation
    await page.screenshot({ path: 'test-results/03-video-navigation.png' });
    
    console.log('✅ Video mode top navigation verified!');
  });

  test('4. Exit Video button should work correctly', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Look for Exit Video button in top bar
    const exitButton = page.locator('button', { hasText: 'Exit Video' });
    await expect(exitButton).toBeVisible();
    
    // Take screenshot showing exit button
    await page.screenshot({ path: 'test-results/04-exit-button-visible.png' });
    
    // Click exit button
    await exitButton.click();
    await page.waitForTimeout(2000);
    
    // Verify we're back to normal mode
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    await expect(heroTitle).toBeVisible();
    
    // Verify Watch Videos button is visible again
    await expect(videoButton).toBeVisible();
    
    // Take screenshot after exit
    await page.screenshot({ path: 'test-results/05-back-to-normal.png' });
    
    console.log('✅ Exit Video functionality verified!');
  });

  test('5. Video controls should be present', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check for mute/unmute button
    const muteButton = page.locator('button[title*="Mute"], button[title*="Unmute"]');
    const muteButtonExists = await muteButton.count() > 0;
    
    // Check for navigation arrows
    const leftArrow = page.locator('button').filter({ has: page.locator('svg[data-lucide="chevron-left"]') });
    const rightArrow = page.locator('button').filter({ has: page.locator('svg[data-lucide="chevron-right"]') });
    
    const leftArrowExists = await leftArrow.count() > 0;
    const rightArrowExists = await rightArrow.count() > 0;
    
    console.log(`🔇 Mute button present: ${muteButtonExists}`);
    console.log(`◀️ Left arrow present: ${leftArrowExists}`);
    console.log(`▶️ Right arrow present: ${rightArrowExists}`);
    
    // Take screenshot of video controls
    await page.screenshot({ path: 'test-results/06-video-controls.png' });
    
    expect(muteButtonExists || leftArrowExists || rightArrowExists).toBe(true);
  });

  test('6. Video titles should be visible and functional', async ({ page }) => {
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Check for video titles
    const newCentreTitle = page.locator('text=New Centre Preview');
    const schoolAnnouncementTitle = page.locator('text=School Announcement');
    const studentLifeTitle = page.locator('text=Student Life');
    
    const newCentreExists = await newCentreTitle.count() > 0;
    const announcementExists = await schoolAnnouncementTitle.count() > 0;
    const studentLifeExists = await studentLifeTitle.count() > 0;
    
    console.log(`🎬 "New Centre Preview" visible: ${newCentreExists}`);
    console.log(`📢 "School Announcement" visible: ${announcementExists}`);
    console.log(`🎓 "Student Life" visible: ${studentLifeExists}`);
    
    // Take screenshot of video titles bar
    await page.screenshot({ path: 'test-results/07-video-titles.png' });
    
    expect(newCentreExists || announcementExists || studentLifeExists).toBe(true);
  });

  test('7. User cannot get stuck in video mode', async ({ page }) => {
    console.log('🎬 Testing that user cannot get stuck in video mode...');
    
    // Enter video mode
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await videoButton.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot in video mode
    await page.screenshot({ path: 'test-results/08-video-mode-stuck-test.png' });
    
    // Try multiple exit methods
    let exitSuccessful = false;
    
    // Method 1: Top bar exit button
    const topBarExitButton = page.locator('button', { hasText: 'Exit Video' });
    if (await topBarExitButton.isVisible()) {
      await topBarExitButton.click();
      await page.waitForTimeout(2000);
      
      const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
      if (await heroTitle.isVisible()) {
        exitSuccessful = true;
        console.log('✅ Exit via top bar button successful!');
      }
    }
    
    // If first method didn't work, try Method 2: Top-right X button
    if (!exitSuccessful) {
      // Re-enter video mode if we exited
      if (await videoButton.isVisible()) {
        await videoButton.click();
        await page.waitForTimeout(2000);
      }
      
      const topRightExitButton = page.locator('button[title="Exit Video"]');
      if (await topRightExitButton.isVisible()) {
        await topRightExitButton.click();
        await page.waitForTimeout(2000);
        
        const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
        if (await heroTitle.isVisible()) {
          exitSuccessful = true;
          console.log('✅ Exit via top-right X button successful!');
        }
      }
    }
    
    // Final verification screenshot
    await page.screenshot({ path: 'test-results/09-exit-verification.png' });
    
    expect(exitSuccessful).toBe(true);
    console.log('✅ User cannot get stuck in video mode - exit paths verified!');
  });

  test('8. Complete video workflow test', async ({ page }) => {
    console.log('🎬 Running complete video workflow test...');
    
    // Step 1: Initial state
    await page.screenshot({ path: 'test-results/workflow-01-initial.png' });
    const videoButton = page.locator('button', { hasText: 'Watch Videos' });
    await expect(videoButton).toBeVisible();
    console.log('✅ Step 1: Initial state verified');
    
    // Step 2: Enter video mode
    await videoButton.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/workflow-02-video-active.png' });
    
    // Verify video mode is active
    const videoPlayerText = page.locator('text=Video Player');
    await expect(videoPlayerText).toBeVisible();
    console.log('✅ Step 2: Video mode activated');
    
    // Step 3: Test video controls if available
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
      await page.screenshot({ path: 'test-results/workflow-03-navigation.png' });
      console.log('✅ Step 4: Video navigation tested');
    }
    
    // Step 5: Exit video mode
    const exitButton = page.locator('button', { hasText: 'Exit Video' });
    await exitButton.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/workflow-04-exit.png' });
    
    // Verify back to normal
    const heroTitle = page.locator('h1', { hasText: 'OIA Academy Edmonton' });
    await expect(heroTitle).toBeVisible();
    console.log('✅ Step 5: Successfully exited video mode');
    
    console.log('🎉 Complete video workflow test PASSED!');
  });

});