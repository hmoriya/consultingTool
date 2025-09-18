import { PrismaClient as ResourcePrismaClient } from '@prisma/resource-client'
import path from 'path'

// データベースのパスを設定
const resourceDbPath = `file:${path.resolve(process.cwd(), 'prisma/resource-service/data/resource.db')}`

const resourceDb = new ResourcePrismaClient({
  datasources: {
    db: { url: resourceDbPath }
  }
})

async function main() {
  try {
    console.log('🌱 Seeding resource database...')

    // 既存のスキルカテゴリとスキルを確認
    const categories = await resourceDb.skillCategory.findMany()
    console.log(`Found ${categories.length} skill categories`)

    const skills = await resourceDb.skill.findMany()
    console.log(`Found ${skills.length} skills`)

    // ユーザーIDの定義（authサービスのシードデータと同期）
    // これらのIDはauth-service/seed.tsで作成されたユーザーのIDと一致する必要があります
    const userIds = {
      pm1: 'user1',      // 鈴木花子
      pm2: 'user2',      // 木村大輔  
      consultant1: 'user3', // 佐藤次郎
      consultant2: 'user4', // 高橋愛
      consultant3: 'user5', // 渡辺健
      consultant4: 'user6'  // 伊藤真由美
    }

    // ユーザースキルデータを作成
    const userSkillData = [
      // 鈴木花子（PM）のスキル
      {
        userId: userIds.pm1,
        skillId: skills.find(s => s.name === 'プロジェクト管理')?.id!,
        level: 5,
        experienceYears: 10,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 15,
        notes: '大規模プロジェクトの経験豊富'
      },
      {
        userId: userIds.pm1,
        skillId: skills.find(s => s.name === '英語')?.id!,
        level: 4,
        experienceYears: 8,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 5,
        notes: 'ビジネスレベル'
      },

      // 木村大輔（PM）のスキル
      {
        userId: userIds.pm2,
        skillId: skills.find(s => s.name === 'プロジェクト管理')?.id!,
        level: 4,
        experienceYears: 7,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 10,
        notes: 'アジャイル開発に精通'
      },
      {
        userId: userIds.pm2,
        skillId: skills.find(s => s.name === 'JavaScript')?.id!,
        level: 3,
        experienceYears: 5,
        selfAssessment: 3,
        managerAssessment: 3,
        projectCount: 3
      },

      // 佐藤次郎（コンサルタント）のスキル
      {
        userId: userIds.consultant1,
        skillId: skills.find(s => s.name === 'JavaScript')?.id!,
        level: 5,
        experienceYears: 8,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 12,
        notes: 'フルスタック開発可能'
      },
      {
        userId: userIds.consultant1,
        skillId: skills.find(s => s.name === 'React')?.id!,
        level: 5,
        experienceYears: 6,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 10
      },
      {
        userId: userIds.consultant1,
        skillId: skills.find(s => s.name === 'Node.js')?.id!,
        level: 4,
        experienceYears: 5,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 8
      },

      // 高橋愛（コンサルタント）のスキル
      {
        userId: userIds.consultant2,
        skillId: skills.find(s => s.name === 'React')?.id!,
        level: 4,
        experienceYears: 4,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 6
      },
      {
        userId: userIds.consultant2,
        skillId: skills.find(s => s.name === 'JavaScript')?.id!,
        level: 4,
        experienceYears: 5,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 8
      },
      {
        userId: userIds.consultant2,
        skillId: skills.find(s => s.name === '英語')?.id!,
        level: 3,
        experienceYears: 3,
        selfAssessment: 3,
        managerAssessment: 3,
        projectCount: 2,
        notes: '日常会話レベル'
      },

      // 渡辺健（コンサルタント）のスキル
      {
        userId: userIds.consultant3,
        skillId: skills.find(s => s.name === 'Node.js')?.id!,
        level: 5,
        experienceYears: 7,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 15,
        notes: 'パフォーマンス最適化のエキスパート'
      },
      {
        userId: userIds.consultant3,
        skillId: skills.find(s => s.name === 'JavaScript')?.id!,
        level: 4,
        experienceYears: 6,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 10
      },

      // 伊藤真由美（コンサルタント）のスキル
      {
        userId: userIds.consultant4,
        skillId: skills.find(s => s.name === 'React')?.id!,
        level: 3,
        experienceYears: 2,
        selfAssessment: 3,
        managerAssessment: 3,
        projectCount: 3
      },
      {
        userId: userIds.consultant4,
        skillId: skills.find(s => s.name === 'JavaScript')?.id!,
        level: 3,
        experienceYears: 3,
        selfAssessment: 3,
        managerAssessment: 3,
        projectCount: 4
      }
    ]

    // UserSkillデータを投入
    for (const data of userSkillData) {
      if (data.userId && data.skillId) {
        const existing = await resourceDb.userSkill.findFirst({
          where: {
            userId: data.userId,
            skillId: data.skillId
          }
        })

        if (!existing) {
          await resourceDb.userSkill.create({
            data: {
              ...data,
              lastUsedDate: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          console.log(`Created skill assignment for user ${data.userId}`)
        }
      }
    }

    // 追加のスキルカテゴリとスキル
    const additionalCategories = [
      { id: 'cat4', name: 'データベース', order: 4 },
      { id: 'cat5', name: 'クラウド', order: 5 }
    ]

    for (const cat of additionalCategories) {
      const exists = await resourceDb.skillCategory.findUnique({
        where: { id: cat.id }
      })
      if (!exists) {
        await resourceDb.skillCategory.create({ data: cat })
        console.log(`Created category: ${cat.name}`)
      }
    }

    const additionalSkills = [
      { id: 'skill6', name: 'PostgreSQL', categoryId: 'cat4', description: 'リレーショナルデータベース', demandLevel: 'high' },
      { id: 'skill7', name: 'MongoDB', categoryId: 'cat4', description: 'NoSQLデータベース', demandLevel: 'medium' },
      { id: 'skill8', name: 'AWS', categoryId: 'cat5', description: 'Amazon Web Services', demandLevel: 'high' },
      { id: 'skill9', name: 'Docker', categoryId: 'cat5', description: 'コンテナ技術', demandLevel: 'high' },
      { id: 'skill10', name: 'Python', categoryId: 'cat1', description: 'プログラミング言語', demandLevel: 'high' }
    ]

    for (const skill of additionalSkills) {
      const exists = await resourceDb.skill.findUnique({
        where: { id: skill.id }
      })
      if (!exists) {
        await resourceDb.skill.create({ data: skill })
        console.log(`Created skill: ${skill.name}`)
      }
    }

    console.log('✅ Resource database seeding completed!')

  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await resourceDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))