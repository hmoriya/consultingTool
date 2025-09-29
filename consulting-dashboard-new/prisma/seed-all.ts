#!/usr/bin/env npx tsx
/**
 * 統合シードスクリプト
 * すべてのサービスのデータを正しい順序で投入し、
 * 別のPCでも同じ表示になるようにします。
 * 
 * 実行方法：
 * npx tsx prisma/seed-all.ts
 */

import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// シード実行関数
function runSeed(scriptPath: string, serviceName: string) {
  console.log(`\n📦 ${serviceName} のシードを実行中...`)
  console.log(`Script: ${scriptPath}`)
  
  try {
    execSync(`npx tsx ${scriptPath}`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    })
    console.log(`✅ ${serviceName} のシード完了`)
  } catch (error) {
    console.error(`❌ ${serviceName} のシードでエラーが発生しました:`, error)
    throw error
  }
}

async function main() {
  console.log('🌱 統合シード処理を開始します...\n')
  console.log('⚠️  注意: 既存のデータは保持されます。重複エラーが発生する場合があります。')
  
  try {
    // 1. 認証・組織管理サービス（他のサービスの基盤）
    runSeed('prisma/seeds/core-seed.ts', '認証・組織管理サービス')
    
    // 2. パラソル設計サービス（設計情報の管理）
    console.log('\n📦 パラソル設計サービスのシードを実行中...')
    console.log('パラソル設計データは複数のスクリプトで構成されています:')
    
    // 2-1. サービス定義
    runSeed('prisma/seeds/parasol/services-seed.ts', 'パラソル - サービス定義')
    
    // 2-2. ビジネスケーパビリティ
    runSeed('prisma/seeds/parasol/business-capabilities-seed.ts', 'パラソル - ビジネスケーパビリティ')
    
    // 2-3. ビジネスオペレーション
    runSeed('prisma/seeds/parasol/business-operations-seed.ts', 'パラソル - ビジネスオペレーション')
    
    // 2-4. ユースケース
    runSeed('prisma/seeds/parasol/use-cases-seed.ts', 'パラソル - ユースケース')
    
    // 2-5. ページ定義
    runSeed('prisma/seeds/parasol/page-definitions-seed.ts', 'パラソル - ページ定義')
    
    // 2-6. テスト定義
    runSeed('prisma/seeds/parasol/test-definitions-seed.ts', 'パラソル - テスト定義')
    
    // 2-7. ドメイン言語の生成・更新
    runSeed('prisma/seeds/parasol/generate-domain-languages.ts', 'パラソル - ドメイン言語生成')
    
    // 2-8. ドメイン言語v1.2.0への更新（アグリゲート追加）
    runSeed('prisma/seeds/parasol/update-domain-language-v2.ts', 'パラソル - ドメイン言語v1.2.0更新')
    
    console.log('✅ パラソル設計サービスのシード完了')
    
    // 3. プロジェクト管理サービス
    runSeed('prisma/seeds/project-seed.ts', 'プロジェクト管理サービス')
    
    // 4. リソース管理サービス
    runSeed('prisma/seeds/resource-seed.ts', 'リソース管理サービス')
    
    // 5. タイムシート管理サービス
    runSeed('prisma/seeds/timesheet-seed.ts', 'タイムシート管理サービス')
    
    // 6. 知識管理サービス
    runSeed('prisma/seeds/knowledge-seed.ts', '知識管理サービス')
    
    // 7. 通知サービス
    runSeed('prisma/seeds/notification-seed.ts', '通知サービス')
    
    console.log('\n✨ すべてのシードが正常に完了しました！')
    console.log('\n📊 投入されたデータ:')
    console.log('  - テストユーザー（exec@example.com, pm@example.com, consultant@example.com, client@example.com）')
    console.log('  - サンプル組織・チーム')
    console.log('  - 3つのサンプルプロジェクト')
    console.log('  - パラソル設計の完全なデータ（サービス、ケーパビリティ、オペレーション、ユースケース等）')
    console.log('  - 各サービスのドメイン言語定義（v1.2.0、アグリゲート定義付き）')
    console.log('  - サンプルの工数データ、知識記事、通知など')
    
    console.log('\n🚀 アプリケーションを起動してください:')
    console.log('   npm run dev')
    
    console.log('\n🔐 テストユーザーでログイン:')
    console.log('   メールアドレス: exec@example.com / パスワード: password123 (Executive)')
    console.log('   メールアドレス: pm@example.com / パスワード: password123 (PM)')
    console.log('   メールアドレス: consultant@example.com / パスワード: password123 (Consultant)')
    console.log('   メールアドレス: client@example.com / パスワード: password123 (Client)')
    
  } catch (error) {
    console.error('\n💥 シード処理中にエラーが発生しました:', error)
    process.exit(1)
  }
}

// メイン処理の実行
main().catch(console.error)