import { PrismaClient as ResourcePrismaClient } from '@prisma/resource-client'

const resourceDb = new ResourcePrismaClient({
  datasources: {
    db: {
      url: process.env.RESOURCE_DATABASE_URL || 'file:./prisma/resource-service/data/resource.db'
    }
  }
})

export async function seedResources(users?: any) {
  console.log('🌱 Seeding Resource Service...')
  
  try {
    // 既存のスキルカテゴリをチェック
    const existingCategories = await resourceDb.skillCategory.count()
    if (existingCategories > 0) {
      console.log('⚠️  Resource Service already has skill data. Checking user skills...')
      
      // 既存のスキルを取得
      const skills = await resourceDb.skill.findMany()
      
      // ユーザースキルのチェックと作成
      if (users && skills.length > 0) {
        const existingUserSkills = await resourceDb.userSkill.count()
        if (existingUserSkills === 0) {
          console.log('  - Creating user skills...')
          await seedUserSkills(users, skills)
        } else {
          console.log('  - User skills already exist.')
        }
      }
      
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
    
    // ユーザースキルの作成
    if (users) {
      await seedUserSkills(users, skills)
    }
    
  } catch (error) {
    console.error('❌ Error seeding Resource Service:', error)
    throw error
  } finally {
    await resourceDb.$disconnect()
  }
}

async function seedUserSkills(users: any, skills?: any[]) {
  try {
    // スキルがまだ取得されていない場合は取得
    if (!skills) {
      skills = await resourceDb.skill.findMany()
    }
    
    // 各ユーザーのスキルを設定
    const userSkillData = []
    
    // PM向けスキル
    if (users.pmUser) {
      userSkillData.push(
        { userId: users.pmUser.id, skillId: skills.find(s => s.name === 'プロジェクトマネジメント').id, level: 5 },
        { userId: users.pmUser.id, skillId: skills.find(s => s.name === '要件定義').id, level: 5 },
        { userId: users.pmUser.id, skillId: skills.find(s => s.name === 'プレゼンテーション').id, level: 4 },
        { userId: users.pmUser.id, skillId: skills.find(s => s.name === 'TypeScript').id, level: 3 }
      )
    }
    
    // Consultant向けスキル
    if (users.consultantUser) {
      userSkillData.push(
        { userId: users.consultantUser.id, skillId: skills.find(s => s.name === 'TypeScript').id, level: 5 },
        { userId: users.consultantUser.id, skillId: skills.find(s => s.name === 'React').id, level: 5 },
        { userId: users.consultantUser.id, skillId: skills.find(s => s.name === 'Next.js').id, level: 4 },
        { userId: users.consultantUser.id, skillId: skills.find(s => s.name === 'PostgreSQL').id, level: 4 },
        { userId: users.consultantUser.id, skillId: skills.find(s => s.name === '要件定義').id, level: 3 }
      )
    }
    
    // その他のコンサルタント
    if (users.allUsers) {
      const consultants = users.allUsers.filter((u: any) => u.email.includes('consultant'))
      for (const consultant of consultants) {
        const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3))
        for (const skill of randomSkills) {
          userSkillData.push({
            userId: consultant.id,
            skillId: skill.id,
            level: 2 + Math.floor(Math.random() * 4) // 2-5のランダム
          })
        }
      }
    }
    
    // 重複チェック: 同じユーザー+スキルの組み合わせを除去
    const uniqueUserSkills = userSkillData.filter((userSkill, index, self) =>
      index === self.findIndex(u => u.userId === userSkill.userId && u.skillId === userSkill.skillId)
    )
    
    console.log(`  - Total user skills before filtering: ${userSkillData.length}`)
    console.log(`  - Unique user skills after filtering: ${uniqueUserSkills.length}`)
    
    // ユーザースキルを一括作成
    if (uniqueUserSkills.length > 0) {
      await resourceDb.userSkill.createMany({
        data: uniqueUserSkills
      })
    }
    
    console.log(`  - Created ${uniqueUserSkills.length} user skills`)
  } catch (error) {
    console.error('Error creating user skills:', error)
  }
}