#!/usr/bin/env npx tsx
/**
 * データベースリセット＆シードスクリプト
 * 
 * すべてのデータベースをリセットして、クリーンな状態から
 * シードデータを投入します。
 * 
 * 実行方法：
 * npx tsx prisma/reset-and-seed.ts
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// データベースファイルのパス
const databases = [
  'prisma/auth-service/data/auth.db',
  'prisma/project-service/data/project.db',
  'prisma/resource-service/data/resource.db',
  'prisma/timesheet-service/data/timesheet.db',
  'prisma/knowledge-service/data/knowledge.db',
  'prisma/notification-service/data/notification.db',
  'prisma/parasol-service/data/parasol.db',
  'prisma/finance-service/data/finance.db'
]

// データベースファイルを削除
function deleteDatabases() {
  console.log('🗑️  既存のデータベースファイルを削除中...')
  
  databases.forEach(dbPath => {
    const fullPath = path.join(__dirname, '..', dbPath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      console.log(`  ✅ ${dbPath} を削除しました`)
    } else {
      console.log(`  ⏭️  ${dbPath} は存在しません（スキップ）`)
    }
    
    // -journal ファイルも削除
    const journalPath = fullPath + '-journal'
    if (fs.existsSync(journalPath)) {
      fs.unlinkSync(journalPath)
    }
    
    // -wal ファイルも削除
    const walPath = fullPath + '-wal'
    if (fs.existsSync(walPath)) {
      fs.unlinkSync(walPath)
    }
    
    // -shm ファイルも削除
    const shmPath = fullPath + '-shm'
    if (fs.existsSync(shmPath)) {
      fs.unlinkSync(shmPath)
    }
  })
}

// Prismaスキーマをプッシュ
function pushSchemas() {
  console.log('\n📋 データベーススキーマを作成中...')
  
  const schemas = [
    'prisma/auth-service/schema.prisma',
    'prisma/project-service/schema.prisma',
    'prisma/resource-service/schema.prisma',
    'prisma/timesheet-service/schema.prisma',
    'prisma/knowledge-service/schema.prisma',
    'prisma/notification-service/schema.prisma',
    'prisma/parasol-service/schema.prisma',
    'prisma/finance-service/schema.prisma'
  ]
  
  schemas.forEach(schema => {
    console.log(`  📄 ${schema} をプッシュ中...`)
    try {
      execSync(`npx prisma db push --skip-generate --schema=${schema}`, {
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '..')
      })
      console.log(`  ✅ ${schema} のプッシュ完了`)
    } catch (error: any) {
      console.error(`  ❌ ${schema} のプッシュに失敗:`, error.toString())
      throw error
    }
  })
}

// Prismaクライアントを生成
function generateClients() {
  console.log('\n🔧 Prismaクライアントを生成中...')
  
  const schemas = [
    'prisma/auth-service/schema.prisma',
    'prisma/project-service/schema.prisma',
    'prisma/resource-service/schema.prisma',
    'prisma/timesheet-service/schema.prisma',
    'prisma/knowledge-service/schema.prisma',
    'prisma/notification-service/schema.prisma',
    'prisma/parasol-service/schema.prisma',
    'prisma/finance-service/schema.prisma'
  ]
  
  schemas.forEach(schema => {
    console.log(`  🔧 ${schema} のクライアントを生成中...`)
    try {
      execSync(`npx prisma generate --schema=${schema}`, {
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '..')
      })
      console.log(`  ✅ ${schema} のクライアント生成完了`)
    } catch (error: any) {
      console.error(`  ❌ ${schema} のクライアント生成に失敗:`, error.toString())
      throw error
    }
  })
}

// シードデータを投入
function seedData() {
  console.log('\n🌱 シードデータを投入中...')
  
  try {
    // seed.tsを使用（seed-all.tsではなく）
    execSync('npx tsx prisma/seed.ts', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    })
  } catch (error) {
    console.error('❌ シードデータの投入に失敗しました:', error)
    throw error
  }
}

async function main() {
  console.log('🔄 データベースリセット＆シード処理を開始します...\n')
  console.log('⚠️  警告: すべてのデータが削除されます！')
  console.log('続行するには5秒待ってください... (Ctrl+Cでキャンセル)\n')
  
  // 5秒待つ
  await new Promise(resolve => setTimeout(resolve, 5000))
  
  try {
    // 1. データベース削除
    deleteDatabases()
    
    // 2. スキーマプッシュ
    pushSchemas()
    
    // 3. クライアント生成
    generateClients()
    
    // 4. シードデータ投入
    seedData()
    
    console.log('\n✨ データベースのリセット＆シードが完了しました！')
    console.log('\n🎉 別のPCでもこのスクリプトを実行すれば、同じデータ状態になります。')
    
  } catch (error) {
    console.error('\n💥 処理中にエラーが発生しました:', error)
    process.exit(1)
  }
}

// メイン処理の実行
main().catch(console.error)