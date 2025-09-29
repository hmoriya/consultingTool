import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

async function main() {
  console.log('Adding remaining capabilities and operations...')

  // タレント最適化サービス
  const talentService = await parasolDb.service.findFirst({
    where: { name: 'talent-optimization' }
  })

  if (talentService) {
    const existingCap = await parasolDb.businessCapability.findFirst({
      where: { serviceId: talentService.id }
    })

    if (!existingCap) {
      const capability = await parasolDb.businessCapability.create({
        data: {
          serviceId: talentService.id,
          name: 'TeamProductivityCapability',
          displayName: 'チームの生産性を最大化する能力',
          description: '人材の能力を最大限に引き出し、適材適所の配置で組織全体の生産性を向上',
          category: 'Core'
        }
      })

      const operations = [
        'リソースを最適配置する',
        'スキルを開発する',
        'チームを編成・強化する',
        'パフォーマンスを評価する',
        'キャリアを開発・支援する'
      ]

      for (const op of operations) {
        await parasolDb.businessOperation.create({
          data: {
            serviceId: talentService.id,
            capabilityId: capability.id,
            name: op.replace(/[を・]/g, '-').toLowerCase(),
            displayName: op,
            pattern: 'Workflow',
            goal: `${op}ための包括的な支援`,
            roles: JSON.stringify(['PM', 'HR', 'メンバー']),
            operations: JSON.stringify([]),
            businessStates: JSON.stringify([]),
            useCases: JSON.stringify([]),
            uiDefinitions: JSON.stringify([]),
            testCases: JSON.stringify([]),
            robustnessModel: JSON.stringify({})
          }
        })
      }
      console.log('✅ Added Talent Optimization operations')
    }
  }

  // 生産性可視化サービス
  const productivityService = await parasolDb.service.findFirst({
    where: { name: 'productivity-visualization' }
  })

  if (productivityService) {
    const existingCap = await parasolDb.businessCapability.findFirst({
      where: { serviceId: productivityService.id }
    })

    if (!existingCap) {
      const capability = await parasolDb.businessCapability.create({
        data: {
          serviceId: productivityService.id,
          name: 'TimeTrackingAccuracyCapability',
          displayName: '工数を正確に把握する能力',
          description: '正確な工数データを収集・分析し、生産性向上のインサイトを提供',
          category: 'Supporting'
        }
      })

      const operations = [
        '工数を記録する',
        '工数を承認する',
        '稼働率を分析する'
      ]

      for (const op of operations) {
        await parasolDb.businessOperation.create({
          data: {
            serviceId: productivityService.id,
            capabilityId: capability.id,
            name: op.replace(/[を・]/g, '-').toLowerCase(),
            displayName: op,
            pattern: 'CRUD',
            goal: `${op}ための仕組み`,
            roles: JSON.stringify(['コンサルタント', 'PM', 'HR']),
            operations: JSON.stringify([]),
            businessStates: JSON.stringify([]),
            useCases: JSON.stringify([]),
            uiDefinitions: JSON.stringify([]),
            testCases: JSON.stringify([]),
            robustnessModel: JSON.stringify({})
          }
        })
      }
      console.log('✅ Added Productivity Visualization operations')
    }
  }

  // コラボレーション促進サービス
  const collabService = await parasolDb.service.findFirst({
    where: { name: 'collaboration-facilitation' }
  })

  if (collabService) {
    const existingCap = await parasolDb.businessCapability.findFirst({
      where: { serviceId: collabService.id }
    })

    if (!existingCap) {
      const capability = await parasolDb.businessCapability.create({
        data: {
          serviceId: collabService.id,
          name: 'InstantCommunicationCapability',
          displayName: '情報を即座に届ける能力',
          description: 'リアルタイムでの情報共有とコミュニケーションを実現',
          category: 'Supporting'
        }
      })

      const operations = [
        '通知を配信する',
        'コミュニケーションを円滑化する'
      ]

      for (const op of operations) {
        await parasolDb.businessOperation.create({
          data: {
            serviceId: collabService.id,
            capabilityId: capability.id,
            name: op.replace(/[を・]/g, '-').toLowerCase(),
            displayName: op,
            pattern: 'Communication',
            goal: `${op}ためのプラットフォーム`,
            roles: JSON.stringify(['全メンバー']),
            operations: JSON.stringify([]),
            businessStates: JSON.stringify([]),
            useCases: JSON.stringify([]),
            uiDefinitions: JSON.stringify([]),
            testCases: JSON.stringify([]),
            robustnessModel: JSON.stringify({})
          }
        })
      }
      console.log('✅ Added Collaboration Facilitation operations')
    }
  }

  // ナレッジ共創サービス
  const knowledgeService = await parasolDb.service.findFirst({
    where: { name: 'knowledge-cocreation' }
  })

  if (knowledgeService) {
    const existingCap = await parasolDb.businessCapability.findFirst({
      where: { serviceId: knowledgeService.id }
    })

    if (!existingCap) {
      const capability = await parasolDb.businessCapability.create({
        data: {
          serviceId: knowledgeService.id,
          name: 'KnowledgeAssetCapability',
          displayName: '知識を組織資産化する能力',
          description: '個人の知識を組織の資産として蓄積・活用',
          category: 'Supporting'
        }
      })

      const operations = [
        '知識を収集・整理する',
        '知識を検索・活用する',
        '知識を共有・伝承する',
        'ベストプラクティスを抽出する'
      ]

      for (const op of operations) {
        await parasolDb.businessOperation.create({
          data: {
            serviceId: knowledgeService.id,
            capabilityId: capability.id,
            name: op.replace(/[を・]/g, '-').toLowerCase(),
            displayName: op,
            pattern: 'Analytics',
            goal: `${op}ための知識基盤`,
            roles: JSON.stringify(['全メンバー', 'ナレッジマネージャー']),
            operations: JSON.stringify([]),
            businessStates: JSON.stringify([]),
            useCases: JSON.stringify([]),
            uiDefinitions: JSON.stringify([]),
            testCases: JSON.stringify([]),
            robustnessModel: JSON.stringify({})
          }
        })
      }
      console.log('✅ Added Knowledge Co-creation operations')
    }
  }

  // 収益最適化サービス
  const revenueService = await parasolDb.service.findFirst({
    where: { name: 'revenue-optimization' }
  })

  if (revenueService) {
    const existingCap = await parasolDb.businessCapability.findFirst({
      where: { serviceId: revenueService.id }
    })

    if (!existingCap) {
      const capability = await parasolDb.businessCapability.create({
        data: {
          serviceId: revenueService.id,
          name: 'ProfitabilityOptimizationCapability',
          displayName: '収益性を最適化する能力',
          description: 'プロジェクト収益を最大化し、コスト効率を継続的に改善',
          category: 'Core'
        }
      })

      const operations = [
        '収益を正確に追跡する',
        'コストを最適化する',
        '収益性を最適化する'
      ]

      for (const op of operations) {
        await parasolDb.businessOperation.create({
          data: {
            serviceId: revenueService.id,
            capabilityId: capability.id,
            name: op.replace(/[を・]/g, '-').toLowerCase(),
            displayName: op,
            pattern: 'Analytics',
            goal: `${op}ための財務管理システム`,
            roles: JSON.stringify(['財務マネージャー', 'PM', 'Executive']),
            operations: JSON.stringify([]),
            businessStates: JSON.stringify([]),
            useCases: JSON.stringify([]),
            uiDefinitions: JSON.stringify([]),
            testCases: JSON.stringify([]),
            robustnessModel: JSON.stringify({})
          }
        })
      }
      console.log('✅ Added Revenue Optimization operations')
    }
  }

  console.log('✅ All remaining operations added successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })