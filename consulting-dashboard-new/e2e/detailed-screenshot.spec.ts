import { test } from '@playwright/test'

test.describe('詳細なデザイン確認', () => {
  test('ログインページの詳細確認', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.waitForLoadState('networkidle')
    
    // HTMLの内容を取得
    const htmlContent = await page.content()
    console.log('HTML length:', htmlContent.length)
    
    // すべてのスタイルシート
    const styleLinks = await page.$$eval('link[rel="stylesheet"]', links => 
      links.map(link => ({
        href: link.getAttribute('href'),
        media: link.getAttribute('media')
      }))
    )
    console.log('Stylesheets:', styleLinks)
    
    // インラインスタイル
    const inlineStyles = await page.$$eval('style', styles => 
      styles.map(style => style.textContent?.substring(0, 100))
    )
    console.log('Inline styles:', inlineStyles)
    
    // Tailwindクラスが適用されているか確認
    const containerDiv = await page.$('.container')
    if (containerDiv) {
      const computedStyle = await containerDiv.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          display: styles.display,
          minHeight: styles.minHeight,
          position: styles.position
        }
      })
      console.log('Container computed styles:', computedStyle)
    } else {
      console.log('Container div not found!')
    }
    
    // ページのHTML構造を出力（最初の500文字）
    const bodyHtml = await page.$eval('body', el => el.innerHTML)
    console.log('Body HTML preview:', bodyHtml.substring(0, 500))
    
    // スクリーンショット
    await page.screenshot({ 
      path: 'login-page-detailed.png',
      fullPage: true 
    })
  })
})