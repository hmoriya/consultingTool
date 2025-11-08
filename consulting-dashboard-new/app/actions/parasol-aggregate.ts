'use server'

/**
 * パラソルドメイン言語へのアグリゲート追加アクション
 */

import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import { analyzeAggregates, generateDomainLanguageWithAggregates } from '@/lib/parasol/aggregate-analyzer'

const parasolDb = new ParasolPrismaClient()

interface EntityDefinition {
  name: string
  displayName: string
  systemName: string
  attributes: Array<{
    name: string
    displayName: string
    systemName: string
    type: string
    required: boolean
  }>
  businessRules: string[]
  states?: string[]
}

/**
 * ドメイン言語定義からエンティティを抽出
 */
function extractEntitiesFromDomainLanguage(markdown: string): EntityDefinition[] {
  const entities: EntityDefinition[] = []
  const lines = markdown.split('\n')
  
  let currentEntity: EntityDefinition | null = null
  let inEntitySection = false
  let inAttributeTable = false
  let inBusinessRules = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // エンティティセクション開始
    if (line === '## エンティティ（Entities）' || line === '## エンティティ') {
      inEntitySection = true
      continue
    }
    
    // 他のセクション開始（エンティティセクション終了）
    if (line.startsWith('## ') && !line.includes('エンティティ')) {
      inEntitySection = false
      if (currentEntity) {
        entities.push(currentEntity)
        currentEntity = null
      }
      continue
    }
    
    if (!inEntitySection) continue
    
    // エンティティ名の検出: ### ユーザー [User] [USER]
    if (line.startsWith('### ')) {
      // 前のエンティティを保存
      if (currentEntity) {
        entities.push(currentEntity)
      }
      
      const nameMatch = line.match(/^###\s+(.+?)\s*\[(.+?)\]\s*\[(.+?)\]$/)
      if (nameMatch) {
        currentEntity = {
          name: nameMatch[2].trim(),
          displayName: nameMatch[1].trim(),
          systemName: nameMatch[3].trim(),
          attributes: [],
          businessRules: []
        }
        inAttributeTable = false
        inBusinessRules = false
      }
      continue
    }
    
    if (!currentEntity) continue
    
    // 属性テーブルの開始
    if (line.startsWith('|') && (line.includes('日本語名') || line.includes('英語名'))) {
      inAttributeTable = true
      inBusinessRules = false
      continue
    }
    
    // テーブル区切り線
    if (line.startsWith('|--')) {
      continue
    }
    
    // 属性行の解析
    if (inAttributeTable && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c)
      if (cells.length >= 4) {
        const japaneseName = cells[0]
        const englishName = cells[1]
        const systemName = cells[2]
        const type = cells[3]
        const required = cells[4] === '○'
        
        if (englishName && !['日本語名', '英語名'].includes(englishName)) {
          currentEntity.attributes.push({
            name: englishName,
            displayName: japaneseName,
            systemName: systemName,
            type: type,
            required: required
          })
        }
      }
      continue
    }
    
    // ビジネスルールセクション
    if (line === '#### ビジネスルール') {
      inAttributeTable = false
      inBusinessRules = true
      continue
    }
    
    // ビジネスルールの収集
    if (inBusinessRules && line.startsWith('- ')) {
      currentEntity.businessRules.push(line.substring(2))
    }
    
    // 属性テーブル終了
    if (inAttributeTable && !line.startsWith('|') && line.length > 0) {
      inAttributeTable = false
    }
  }
  
  // 最後のエンティティを保存
  if (currentEntity) {
    entities.push(currentEntity)
  }
  
  return entities
}

/**
 * サービスのドメイン言語にアグリゲート定義を追加
 */
export async function addAggregatesToDomainLanguage(serviceId: string) {
  try {
    console.log(`[Aggregate Analysis] Starting for service ${serviceId}`)
    
    // サービスを取得
    const service = await parasolDb.service.findUnique({
      where: { id: serviceId }
    })
    
    if (!service) {
      return {
        success: false,
        error: 'サービスが見つかりません'
      }
    }
    
    if (!service.domainLanguageDefinition) {
      return {
        success: false,
        error: 'ドメイン言語定義が存在しません'
      }
    }
    
    console.log(`[Aggregate Analysis] Extracting entities from domain language...`)
    
    // ドメイン言語からエンティティを抽出
    const entities = extractEntitiesFromDomainLanguage(service.domainLanguageDefinition)
    
    console.log(`[Aggregate Analysis] Found ${entities.length} entities:`, 
      entities.map(e => e.name).join(', '))
    
    // アグリゲートを分析
    const aggregates = analyzeAggregates(entities)
    
    console.log(`[Aggregate Analysis] Identified ${aggregates.length} aggregates:`,
      aggregates.map(a => a.name).join(', '))
    
    // アグリゲート定義を含む新しいドメイン言語を生成
    const updatedDomainLanguage = generateDomainLanguageWithAggregates(
      service.name,
      entities,
      service.domainLanguageDefinition
    )
    
    // サービスを更新
    await parasolDb.service.update({
      where: { id: serviceId },
      data: {
        domainLanguageDefinition: updatedDomainLanguage,
        domainLanguage: JSON.stringify({
          generatedFrom: 'business-operations-with-aggregates',
          generatedAt: new Date().toISOString(),
          version: '1.1.0',
          aggregateCount: aggregates.length,
          entityCount: entities.length
        })
      }
    })
    
    console.log(`[Aggregate Analysis] Successfully updated service domain language`)
    
    return {
      success: true,
      aggregateCount: aggregates.length,
      entityCount: entities.length,
      aggregates: aggregates.map(a => ({
        name: a.displayName,
        rootEntity: a.rootEntity,
        entityCount: a.entities.length
      }))
    }
    
  } catch (_error) {
    console.error('[Aggregate Analysis] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }
  } finally {
    await parasolDb.$disconnect()
  }
}

/**
 * すべてのサービスにアグリゲート定義を追加
 */
export async function addAggregatesToAllServices() {
  try {
    console.log('[Aggregate Analysis] Starting batch analysis for all services...')
    
    const services = await parasolDb.service.findMany({
      where: {
        domainLanguageDefinition: {
          not: null
        }
      }
    })
    
    console.log(`[Aggregate Analysis] Found ${services.length} services with domain language`)
    
    const results = []
    
    for (const service of services) {
      console.log(`\n[Aggregate Analysis] Processing ${service.displayName}...`)
      const result = await addAggregatesToDomainLanguage(service.id)
      results.push({
        serviceName: service.displayName,
        ...result
      })
    }
    
    const successCount = results.filter(r => r.success).length
    const totalAggregates = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + (r.aggregateCount || 0), 0)
    
    console.log(`\n[Aggregate Analysis] Batch analysis completed:`)
    console.log(`  - Success: ${successCount}/${services.length}`)
    console.log(`  - Total aggregates identified: ${totalAggregates}`)
    
    return {
      success: true,
      results,
      summary: {
        totalServices: services.length,
        successCount,
        totalAggregates
      }
    }
    
  } catch (_error) {
    console.error('[Aggregate Analysis] Batch error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }
  } finally {
    await parasolDb.$disconnect()
  }
}