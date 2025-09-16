import { test, expect } from '@playwright/test'

test.describe('Debug Login', () => {
  test('Direct API login test', async ({ page, request }) => {
    // First check if the login endpoint works
    const response = await request.post('http://localhost:3000/api/login', {
      data: {
        email: 'exec@example.com',
        password: 'password123'
      }
    })
    
    console.log('Login API response status:', response.status())
    const responseText = await response.text()
    console.log('Login API response:', responseText)
  })

  test('Form submission debug', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('Browser console:', msg.text()))
    page.on('pageerror', error => console.log('Page error:', error))
    
    await page.goto('http://localhost:3000/login')
    
    // Wait for the form to be ready
    await page.waitForLoadState('networkidle')
    
    // Fill the form
    await page.fill('input[type="email"]', 'exec@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Listen to network requests
    page.on('request', request => {
      console.log('Request:', request.method(), request.url())
    })
    
    page.on('response', response => {
      console.log('Response:', response.status(), response.url())
    })
    
    // Submit the form and wait for navigation
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForLoadState('networkidle')
    ])
    
    // Check current URL
    await page.waitForTimeout(2000) // Wait 2 seconds
    console.log('Current URL:', page.url())
    
    // Check if we're still on login page
    const isLoginPage = page.url().includes('/login')
    console.log('Still on login page?', isLoginPage)
    
    // Check for any error messages
    const errorElement = await page.locator('text=メールアドレスまたはパスワードが正しくありません').isVisible()
    console.log('Error visible?', errorElement)
  })

  test('Manual navigation after login', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // Fill and submit form
    await page.fill('input[type="email"]', 'exec@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Wait for any response
    await page.waitForTimeout(3000)
    
    // Try to manually navigate to dashboard
    await page.goto('http://localhost:3000/dashboard/executive')
    await page.waitForTimeout(1000)
    
    // Check final URL
    console.log('Final URL after manual navigation:', page.url())
    
    // Check if we can see dashboard content
    const dashboardTitle = await page.locator('h1').textContent()
    console.log('Page title:', dashboardTitle)
  })
})