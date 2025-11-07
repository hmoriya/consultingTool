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

    // ヘルパー関数：スキル名からIDを安全に取得
    const getSkillId = (skillName: string): string => {
      const skill = skills.find(s => s.name === skillName)
      if (!skill) {
        throw new Error(`Skill not found: ${skillName}`)
      }
      return skill.id
    }

    // ユーザーIDの定義（authサービスのシードデータと同期）
    // これらのIDはauth-service/seed.tsで作成されたユーザーのIDと一致する必要があります
    // 実際のユーザーIDをハードコーディング（本来は環境変数や別ファイルから取得すべき）
    const userIds = {
      pm1: 'cmfpgd1d60011z5kwcikmwrfn',      // 鈴木花子
      pm2: 'cmfpgd1d2000pz5kw7vcj5in7',      // 木村大輔
      consultant1: 'cmfpgd1d2000mz5kw8jlans3g', // 佐藤次郎
      consultant2: 'cmfpgd1d2000hz5kw30szns2b', // 高橋愛
      consultant3: 'cmfpgd1d2000iz5kwl5477yk7', // 渡辺健
      consultant4: 'cmfpgd1d2000nz5kwvraucmfp'  // 伊藤真由美
    }

    // ユーザースキルデータを作成
    const userSkillData = [
      // 鈴木花子（PM）のスキル
      {
        userId: userIds.pm1,
        skillId: getSkillId('プロジェクト管理'),
        level: 5,
        experienceYears: 10,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 15,
        notes: '大規模プロジェクトの経験豊富'
      },
      {
        userId: userIds.pm1,
        skillId: getSkillId('英語'),
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
        skillId: getSkillId('プロジェクト管理'),
        level: 4,
        experienceYears: 7,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 10,
        notes: 'アジャイル開発に精通'
      },
      {
        userId: userIds.pm2,
        skillId: getSkillId('JavaScript'),
        level: 3,
        experienceYears: 5,
        selfAssessment: 3,
        managerAssessment: 3,
        projectCount: 3
      },

      // 佐藤次郎（コンサルタント）のスキル
      {
        userId: userIds.consultant1,
        skillId: getSkillId('JavaScript'),
        level: 5,
        experienceYears: 8,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 12,
        notes: 'フルスタック開発可能'
      },
      {
        userId: userIds.consultant1,
        skillId: getSkillId('React'),
        level: 5,
        experienceYears: 6,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 10
      },
      {
        userId: userIds.consultant1,
        skillId: getSkillId('Node.js'),
        level: 4,
        experienceYears: 5,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 8
      },

      // 高橋愛（コンサルタント）のスキル
      {
        userId: userIds.consultant2,
        skillId: getSkillId('React'),
        level: 4,
        experienceYears: 4,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 6
      },
      {
        userId: userIds.consultant2,
        skillId: getSkillId('JavaScript'),
        level: 4,
        experienceYears: 5,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 8
      },
      {
        userId: userIds.consultant2,
        skillId: getSkillId('英語'),
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
        skillId: getSkillId('Node.js'),
        level: 5,
        experienceYears: 7,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 15,
        notes: 'パフォーマンス最適化のエキスパート'
      },
      {
        userId: userIds.consultant3,
        skillId: getSkillId('JavaScript'),
        level: 4,
        experienceYears: 6,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 10
      },

      // 伊藤真由美（コンサルタント）のスキル
      {
        userId: userIds.consultant4,
        skillId: getSkillId('React'),
        level: 3,
        experienceYears: 2,
        selfAssessment: 3,
        managerAssessment: 3,
        projectCount: 3
      },
      {
        userId: userIds.consultant4,
        skillId: getSkillId('JavaScript'),
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

  } catch (_error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await resourceDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))