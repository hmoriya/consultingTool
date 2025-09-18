import { PrismaClient as ResourcePrismaClient } from '@prisma/resource-client'

const resourceDb = new ResourcePrismaClient({
  datasources: {
    db: {
      url: process.env.RESOURCE_DATABASE_URL || 'file:./prisma/resource-service/data/resource.db'
    }
  }
})

export async function seedResources() {
  console.log('🌱 Seeding Resource Service...')
  
  try {
    // 既存のスキルカテゴリをチェック
    const existingCategories = await resourceDb.skillCategory.count()
    if (existingCategories > 0) {
      console.log('⚠️  Resource Service already has data. Skipping seed.')
      return
    }

    // スキルカテゴリの作成
    const skillCategories = await Promise.all([
      resourceDb.skillCategory.create({
        data: { name: 'プログラミング言語' }
      }),
      resourceDb.skillCategory.create({
        data: { name: 'フレームワーク' }
      }),
      resourceDb.skillCategory.create({
        data: { name: 'データベース' }
      }),
      resourceDb.skillCategory.create({
        data: { name: 'ビジネススキル' }
      })
    ])

    // スキルの作成
    const skills = []
    
    // プログラミング言語
    const programmingSkills = await Promise.all([
      resourceDb.skill.create({
        data: { name: 'JavaScript', categoryId: skillCategories[0].id }
      }),
      resourceDb.skill.create({
        data: { name: 'TypeScript', categoryId: skillCategories[0].id }
      }),
      resourceDb.skill.create({
        data: { name: 'Python', categoryId: skillCategories[0].id }
      }),
      resourceDb.skill.create({
        data: { name: 'Java', categoryId: skillCategories[0].id }
      })
    ])
    skills.push(...programmingSkills)

    // フレームワーク
    const frameworkSkills = await Promise.all([
      resourceDb.skill.create({
        data: { name: 'React', categoryId: skillCategories[1].id }
      }),
      resourceDb.skill.create({
        data: { name: 'Next.js', categoryId: skillCategories[1].id }
      }),
      resourceDb.skill.create({
        data: { name: 'Spring Boot', categoryId: skillCategories[1].id }
      })
    ])
    skills.push(...frameworkSkills)

    // データベース
    const databaseSkills = await Promise.all([
      resourceDb.skill.create({
        data: { name: 'PostgreSQL', categoryId: skillCategories[2].id }
      }),
      resourceDb.skill.create({
        data: { name: 'MySQL', categoryId: skillCategories[2].id }
      }),
      resourceDb.skill.create({
        data: { name: 'MongoDB', categoryId: skillCategories[2].id }
      })
    ])
    skills.push(...databaseSkills)

    // ビジネススキル
    const businessSkills = await Promise.all([
      resourceDb.skill.create({
        data: { name: 'プロジェクトマネジメント', categoryId: skillCategories[3].id }
      }),
      resourceDb.skill.create({
        data: { name: '要件定義', categoryId: skillCategories[3].id }
      }),
      resourceDb.skill.create({
        data: { name: 'プレゼンテーション', categoryId: skillCategories[3].id }
      })
    ])
    skills.push(...businessSkills)

    console.log('✅ Resource Service seeded successfully')
    console.log(`  - Created ${skillCategories.length} skill categories`)
    console.log(`  - Created ${skills.length} skills`)
    
  } catch (error) {
    console.error('❌ Error seeding Resource Service:', error)
    throw error
  } finally {
    await resourceDb.$disconnect()
  }
}