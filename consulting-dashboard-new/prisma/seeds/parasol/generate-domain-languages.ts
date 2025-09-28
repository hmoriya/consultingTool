/**
 * 各サービスのビジネスオペレーション定義からドメイン言語を生成して更新する
 */

import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import {
  generateAuthServiceDomainLanguage,
  generateProjectServiceDomainLanguage,
  generateResourceServiceDomainLanguage,
  generateTimesheetServiceDomainLanguage,
  generateKnowledgeServiceDomainLanguage,
  generateFinanceServiceDomainLanguage,
  generateNotificationServiceDomainLanguage
} from '../../../lib/parasol/generate-domain-from-operations'

const parasolDb = new ParasolPrismaClient()

interface ServiceDomainMapping {
  serviceName: string
  generateFunction: () => string
}

// サービス名とドメイン言語生成関数のマッピング
const serviceDomainMappings: ServiceDomainMapping[] = [
  {
    serviceName: 'secure-access',
    generateFunction: generateAuthServiceDomainLanguage
  },
  {
    serviceName: 'project-success-support',
    generateFunction: generateProjectServiceDomainLanguage
  },
  {
    serviceName: 'talent-optimization',
    generateFunction: generateResourceServiceDomainLanguage
  },
  {
    serviceName: 'productivity-visualization',
    generateFunction: generateTimesheetServiceDomainLanguage
  },
  {
    serviceName: 'knowledge-cocreation',
    generateFunction: generateKnowledgeServiceDomainLanguage
  },
  {
    serviceName: 'revenue-optimization',
    generateFunction: generateFinanceServiceDomainLanguage
  },
  {
    serviceName: 'collaboration-facilitation',
    generateFunction: generateNotificationServiceDomainLanguage
  }
]

async function updateServiceDomainLanguage(
  serviceName: string,
  generateFunction: () => string
) {
  console.log(`\n  Updating domain language for ${serviceName}...`)
  
  try {
    // サービスを検索
    const service = await parasolDb.service.findFirst({
      where: { name: serviceName }
    })
    
    if (!service) {
      console.log(`    ⚠️  Service ${serviceName} not found, skipping...`)
      return
    }
    
    // ドメイン言語を生成
    console.log(`    Generating domain language from business operations...`)
    const domainLanguageMarkdown = generateFunction()
    
    // サービスを更新
    await parasolDb.service.update({
      where: { id: service.id },
      data: {
        domainLanguageDefinition: domainLanguageMarkdown,
        // domainLanguageフィールドも更新（JSON形式で保存）
        domainLanguage: JSON.stringify({
          generatedFrom: 'business-operations',
          generatedAt: new Date().toISOString(),
          version: '1.0.0'
        })
      }
    })
    
    console.log(`    ✅ Domain language updated successfully`)
    console.log(`       - Length: ${domainLanguageMarkdown.length} characters`)
    console.log(`       - Service: ${service.displayName}`)
    
  } catch (error) {
    console.error(`    ❌ Error updating ${serviceName}:`, error)
  }
}

export async function generateAndUpdateDomainLanguages() {
  console.log('🔄 Generating domain languages from business operations...')
  
  try {
    // 各サービスのドメイン言語を更新
    for (const mapping of serviceDomainMappings) {
      await updateServiceDomainLanguage(
        mapping.serviceName,
        mapping.generateFunction
      )
    }
    
    // 統計情報を表示
    const services = await parasolDb.service.findMany({
      select: {
        name: true,
        displayName: true,
        domainLanguageDefinition: true
      }
    })
    
    console.log('\n📊 Domain Language Generation Summary:')
    console.log('  Total services:', services.length)
    console.log('  Services with domain language:', 
      services.filter(s => s.domainLanguageDefinition && s.domainLanguageDefinition.length > 0).length
    )
    
    console.log('\n✅ Domain language generation completed successfully!')
    
  } catch (error) {
    console.error('❌ Error generating domain languages:', error)
    throw error
  } finally {
    await parasolDb.$disconnect()
  }
}

// スタンドアロン実行のサポート
if (require.main === module) {
  generateAndUpdateDomainLanguages()
    .then(() => {
      console.log('Domain language generation completed')
      process.exit(0)
    })
    .catch((e) => {
      console.error('Error generating domain languages:', e)
      process.exit(1)
    })
}