#!/usr/bin/env npx tsx

/**
 * パラソルシードデータをAPI経由でインポートするスクリプト
 * MDファイルを読み込み、APIエンドポイントにPOSTします
 */

const API_URL = process.env.API_URL || 'http://localhost:3000'

async function seedParasolData() {
  console.log('🚀 Starting Parasol data seeding via API...')
  console.log(`📡 API URL: ${API_URL}`)

  try {
    // 1. まず現在のMDファイルの状況を確認
    console.log('\n📋 Checking MD files...')
    const checkResponse = await fetch(`${API_URL}/api/parasol/import`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!checkResponse.ok) {
      throw new Error(`Failed to check MD files: ${checkResponse.statusText}`)
    }

    const checkData: any = await checkResponse.json()
    console.log('✅ Found MD files:')
    console.log(`   - Services: ${checkData.servicesFound}`)

    if (checkData.services && checkData.services.length > 0) {
      checkData.services.forEach((service: any) => {
        console.log(`   - ${service.displayName}: ${service.capabilities} capabilities, ${service.operations} operations`)
      })
    }

    if (checkData.servicesFound === 0) {
      console.error('❌ No MD files found. Please run generate-md-files.ts first.')
      process.exit(1)
    }

    // 2. データベースにインポート
    console.log('\n📤 Importing to database...')
    const importResponse = await fetch(`${API_URL}/api/parasol/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })

    if (!importResponse.ok) {
      const errorText = await importResponse.text()
      throw new Error(`Failed to import data: ${errorText}`)
    }

    const importData: any = await importResponse.json()

    if (importData.success) {
      console.log('\n✨ Import completed successfully!')
      console.log('\n📊 Import Summary:')
      console.log(`   - Imported Services: ${importData.importedServices}`)
      console.log(`   - Imported Capabilities: ${importData.importedCapabilities}`)
      console.log(`   - Imported Operations: ${importData.importedOperations}`)

      if (importData.details && importData.details.length > 0) {
        console.log('\n📝 Details by service:')
        importData.details.forEach((detail: any) => {
          console.log(`   - ${detail.service}:`)
          console.log(`     - Capabilities: ${detail.capabilities}`)
          console.log(`     - Operations: ${detail.operations}`)
        })
      }
    } else {
      console.error('❌ Import failed:', importData.error)
      process.exit(1)
    }

    // 3. 検証のため再度データを確認
    console.log('\n🔍 Verifying imported data...')
    const verifyResponse = await fetch(`${API_URL}/api/parasol/import`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (verifyResponse.ok) {
      const verifyData: any = await verifyResponse.json()
      console.log('✅ Verification complete:')
      console.log(`   - Active services in MD files: ${verifyData.servicesFound}`)
    }

    console.log('\n🎉 Parasol seed completed successfully!')

  } catch (error) {
    console.error('\n❌ Error during seeding:', error)
    console.error('\n💡 Troubleshooting tips:')
    console.error('   1. Ensure the Next.js dev server is running (npm run dev)')
    console.error('   2. Check that the API endpoint is accessible')
    console.error('   3. Verify MD files exist (run generate-md-files.ts if needed)')
    process.exit(1)
  }
}

// スクリプト実行
if (require.main === module) {
  seedParasolData()
    .then(() => {
      console.log('\n✅ Script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error)
      process.exit(1)
    })
}

export { seedParasolData }