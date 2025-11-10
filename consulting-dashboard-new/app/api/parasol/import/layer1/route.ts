import { NextResponse } from 'next/server'
import { parasolDb } from '@/lib/prisma-vercel'
import fs from 'fs/promises'
import path from 'path'

interface Layer1ImportRequest {
  sourceDirectory?: string
  validationLevel?: 'strict' | 'normal' | 'minimal'
  dryRun?: boolean
}

// Layer 1 (サービス横断共通) 専用インポート
export async function POST(request: Request) {
  try {
    const body: Layer1ImportRequest = await request.json()
    const {
      sourceDirectory = 'docs/parasol/services/global-shared-pages',
      validationLevel = 'strict',
      dryRun = false
    } = body

    console.log('Layer 1 インポート開始:', { sourceDirectory, validationLevel, dryRun })

    // 1. Layer 1 ディレクトリスキャン
    const basePath = process.cwd()
    const layer1Path = path.join(basePath, sourceDirectory)

    let pageFiles: string[] = []
    try {
      const files = await fs.readdir(layer1Path)
      pageFiles = files.filter(f => f.endsWith('.md'))
    } catch {
      return NextResponse.json({
        success: false,
        error: `Layer 1 ディレクトリが見つかりません: ${sourceDirectory}`,
        suggestion: 'ディレクトリパスを確認してください'
      }, { status: 400 })
    }

    console.log(`Layer 1 ページファイル発見: ${pageFiles.length}個`)

    // 2. ページ分析とバリデーション
    const pages = []
    const validationErrors = []

    for (const file of pageFiles) {
      const filePath = path.join(layer1Path, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const cleanContent = content.replace(/\x1b\[[0-9;]*m/g, '') // ANSI除去

      const pageData = {
        fileName: file,
        filePath,
        content: cleanContent,
        displayName: extractDisplayName(cleanContent) || file.replace('.md', ''),
        name: file.replace('.md', ''),
        layerType: 'global' as const
      }

      // Layer 1 バリデーション
      const validation = validateLayer1Page(pageData, validationLevel)
      if (validation.isValid) {
        pages.push(pageData)
      } else {
        validationErrors.push({
          file,
          errors: validation.errors
        })
      }
    }

    // 3. 全サービス影響分析
    const impactAnalysis = await analyzeGlobalPageImpact(pages)

    if (dryRun) {
      return NextResponse.json({
        success: true,
        preview: {
          scannedFiles: pageFiles.length,
          validPages: pages.length,
          validationErrors: validationErrors.length,
          impactAnalysis
        },
        pages: pages.map(p => ({
          name: p.name,
          displayName: p.displayName,
          validation: 'passed'
        })),
        validationErrors
      })
    }

    // 4. データベース更新
    const created = []
    const errors = []

    for (const page of pages) {
      try {
        // 既存の重複チェック
        const existing = await parasolDb.pageLayerDefinition.findFirst({
          where: {
            pageName: page.name,
            layerType: 'global'
          }
        })

        if (existing) {
          // 更新
          await parasolDb.pageLayerDefinition.update({
            where: { id: existing.id },
            data: {
              content: page.content,
              displayName: page.displayName,
              filePath: page.filePath
            }
          })
          created.push({ ...page, action: 'updated' })
        } else {
          // 新規作成
          await parasolDb.pageLayerDefinition.create({
            data: {
              pageName: page.name,
              layerType: 'global',
              filePath: page.filePath,
              content: page.content,
              displayName: page.displayName
            }
          })
          created.push({ ...page, action: 'created' })
        }
      } catch (_error) {
        errors.push({
          page: page.name,
          error: error instanceof Error ? error.message : '未知のエラー'
        })
      }
    }

    console.log('Layer 1 インポート完了:', {
      created: created.length,
      errors: errors.length,
      validationErrors: validationErrors.length
    })

    return NextResponse.json({
      success: true,
      result: {
        layerType: 'global',
        processedPages: created.length,
        createdPages: created.filter(p => p.action === 'created').length,
        updatedPages: created.filter(p => p.action === 'updated').length,
        errors: errors.length,
        validationErrors: validationErrors.length
      },
      impactAnalysis,
      created: created.map(p => ({
        name: p.name,
        displayName: p.displayName,
        action: p.action
      })),
      errors,
      validationErrors
    })

  } catch (_error) {
    console.error('Layer 1 インポートエラー:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知のエラー',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

function extractDisplayName(content: string): string | null {
  const lines = content.split('\n')
  const titleLine = lines.find(line => line.startsWith('# '))
  if (!titleLine) return null

  let title = titleLine.replace('# ', '').trim()

  // ページ定義プレフィックスを除去
  if (title.includes('ページ定義：') || title.includes('ページ定義:')) {
    title = title.replace(/ページ定義[：:]/, '').trim()
  }

  return title
}

function validateLayer1Page(page: unknown, level: string) {
  const errors = []

  // 基本検証
  if (!page.content.trim()) {
    errors.push('ページ内容が空です')
  }

  if (!page.displayName) {
    errors.push('ページタイトル（# 見出し）が見つかりません')
  }

  // Layer 1 固有の検証
  const globalKeywords = ['ログイン', 'ダッシュボード', '通知', 'エラー', '共通', '全サービス']
  const hasGlobalKeywords = globalKeywords.some(keyword =>
    page.content.includes(keyword) || page.displayName.includes(keyword)
  )

  if (level === 'strict' && !hasGlobalKeywords) {
    errors.push('Layer 1 ページには全サービス共通の機能を示すキーワードが必要です')
  }

  // 禁止キーワード（特定サービス・オペレーション固有）
  const forbiddenKeywords = ['ユースケース固有', '専用', 'オペレーション内', '特定サービス']
  const hasForbiddenKeywords = forbiddenKeywords.some(keyword =>
    page.content.includes(keyword)
  )

  if (hasForbiddenKeywords) {
    errors.push('Layer 1 ページに特定サービス固有のキーワードが含まれています')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

async function analyzeGlobalPageImpact(_pages: unknown[]) {
  // 全サービス影響分析
  try {
    const services = await parasolDb.service.findMany({
      select: { id: true, name: true, displayName: true }
    })

    const totalServices = services.length
    const affectedServices = services.length // Layer 1は全サービスに影響

    return {
      totalServices,
      affectedServices,
      impactLevel: 'high',
      services: services.map(s => ({
        id: s.id,
        name: s.name,
        displayName: s.displayName,
        affected: true
      })),
      recommendations: [
        'Layer 1 ページの変更は全サービスに影響します',
        '段階的リリース計画を検討してください',
        '各サービスチームへの事前通知が必要です'
      ]
    }
  } catch {
    return {
      totalServices: 0,
      affectedServices: 0,
      impactLevel: 'unknown',
      services: [],
      recommendations: ['サービス情報の取得に失敗しました']
    }
  }
}