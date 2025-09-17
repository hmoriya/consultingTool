import { PrismaClient } from '@prisma/resource-client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.RESOURCE_DATABASE_URL || 'file:./prisma/resource-service/data/resource.db'
    }
  }
})

async function main() {
  console.log('Seeding resource database...')
  console.log('Database URL:', process.env.RESOURCE_DATABASE_URL || 'file:./prisma/resource-service/data/resource.db')

  // Clean existing data
  console.log('Cleaning existing data...')
  await prisma.userSkill.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.skillCategory.deleteMany()
  console.log('Existing data cleaned.')

  // Create skill categories
  const technicalCategory = await prisma.skillCategory.create({
    data: {
      name: '技術スキル',
      order: 1
    }
  })

  const businessCategory = await prisma.skillCategory.create({
    data: {
      name: 'ビジネススキル',
      order: 2
    }
  })

  const industryCategory = await prisma.skillCategory.create({
    data: {
      name: '業界知識',
      order: 3
    }
  })

  // Create skills
  const skills = await Promise.all([
    // 技術スキル
    prisma.skill.create({
      data: {
        name: 'JavaScript/TypeScript',
        categoryId: technicalCategory.id,
        description: 'JavaScriptおよびTypeScriptプログラミング'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'React/Next.js',
        categoryId: technicalCategory.id,
        description: 'Reactフレームワークを使用したフロントエンド開発'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'Python',
        categoryId: technicalCategory.id,
        description: 'Pythonプログラミングとデータ分析'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'データベース設計',
        categoryId: technicalCategory.id,
        description: 'RDBMSおよびNoSQLデータベースの設計と最適化'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'クラウドアーキテクチャ',
        categoryId: technicalCategory.id,
        description: 'AWS/Azure/GCPを使用したクラウドシステム設計'
      }
    }),

    // ビジネススキル
    prisma.skill.create({
      data: {
        name: 'プロジェクト管理',
        categoryId: businessCategory.id,
        description: 'アジャイル/ウォーターフォールプロジェクト管理'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'ビジネス分析',
        categoryId: businessCategory.id,
        description: 'ビジネスプロセス分析と改善提案'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'プレゼンテーション',
        categoryId: businessCategory.id,
        description: 'エグゼクティブ向けプレゼンテーション'
      }
    }),
    prisma.skill.create({
      data: {
        name: '要件定義',
        categoryId: businessCategory.id,
        description: 'システム要件の収集と文書化'
      }
    }),

    // 業界知識
    prisma.skill.create({
      data: {
        name: '金融業界',
        categoryId: industryCategory.id,
        description: '銀行・証券・保険業界の知識'
      }
    }),
    prisma.skill.create({
      data: {
        name: '製造業',
        categoryId: industryCategory.id,
        description: '製造業のプロセスとシステム'
      }
    }),
    prisma.skill.create({
      data: {
        name: '小売・流通',
        categoryId: industryCategory.id,
        description: '小売・流通業界のビジネスモデル'
      }
    })
  ])

  // Create teams
  const consultingTeam = await prisma.team.create({
    data: {
      name: 'コンサルティング第1チーム',
      description: 'DXプロジェクトを専門とするコンサルティングチーム',
      leaderId: 'cmflvzkcb000hz5jxuduxtr7d' // PM user from core database
    }
  })

  const developmentTeam = await prisma.team.create({
    data: {
      name: '開発チーム',
      description: 'システム開発とインプリメンテーションチーム',
      leaderId: '3' // Senior consultant
    }
  })

  // Create team members
  await Promise.all([
    prisma.teamMember.create({
      data: {
        teamId: consultingTeam.id,
        userId: 'cmflvzkcb000hz5jxuduxtr7d', // PM
        role: 'lead',
        startDate: new Date('2024-01-01')
      }
    }),
    prisma.teamMember.create({
      data: {
        teamId: consultingTeam.id,
        userId: '3', // Senior consultant
        role: 'member',
        startDate: new Date('2024-01-01')
      }
    }),
    prisma.teamMember.create({
      data: {
        teamId: consultingTeam.id,
        userId: '4', // Consultant
        role: 'member',
        startDate: new Date('2024-02-01')
      }
    }),
    prisma.teamMember.create({
      data: {
        teamId: developmentTeam.id,
        userId: '3', // Senior consultant (also in dev team)
        role: 'lead',
        startDate: new Date('2024-01-01')
      }
    })
  ])

  // Create user skills
  await Promise.all([
    // PM skills
    prisma.userSkill.create({
      data: {
        userId: 'cmflvzkcb000hz5jxuduxtr7d',
        skillId: skills.find(s => s.name === 'プロジェクト管理')!.id,
        level: 5, // expert
        experienceYears: 10
      }
    }),
    prisma.userSkill.create({
      data: {
        userId: 'cmflvzkcb000hz5jxuduxtr7d',
        skillId: skills.find(s => s.name === 'ビジネス分析')!.id,
        level: 4, // advanced
        experienceYears: 8
      }
    }),
    prisma.userSkill.create({
      data: {
        userId: 'cmflvzkcb000hz5jxuduxtr7d',
        skillId: skills.find(s => s.name === '金融業界')!.id,
        level: 3, // intermediate
        experienceYears: 5
      }
    }),

    // Senior consultant skills
    prisma.userSkill.create({
      data: {
        userId: '3',
        skillId: skills.find(s => s.name === 'JavaScript/TypeScript')!.id,
        level: 5, // expert
        experienceYears: 7
      }
    }),
    prisma.userSkill.create({
      data: {
        userId: '3',
        skillId: skills.find(s => s.name === 'React/Next.js')!.id,
        level: 5, // expert
        experienceYears: 5
      }
    }),
    prisma.userSkill.create({
      data: {
        userId: '3',
        skillId: skills.find(s => s.name === 'クラウドアーキテクチャ')!.id,
        level: 4, // advanced
        experienceYears: 4
      }
    }),

    // Consultant skills
    prisma.userSkill.create({
      data: {
        userId: '4',
        skillId: skills.find(s => s.name === 'Python')!.id,
        level: 3, // intermediate
        experienceYears: 3
      }
    }),
    prisma.userSkill.create({
      data: {
        userId: '4',
        skillId: skills.find(s => s.name === 'データベース設計')!.id,
        level: 3, // intermediate
        experienceYears: 3
      }
    }),
    prisma.userSkill.create({
      data: {
        userId: '4',
        skillId: skills.find(s => s.name === '要件定義')!.id,
        level: 2, // beginner
        experienceYears: 2
      }
    })
  ])

  console.log('Created skills, teams, and assignments')

  // Verify data was inserted
  const teamCount = await prisma.team.count()
  const skillCount = await prisma.skill.count()
  const memberCount = await prisma.teamMember.count()
  const userSkillCount = await prisma.userSkill.count()

  console.log(`Total teams in database: ${teamCount}`)
  console.log(`Total skills in database: ${skillCount}`)
  console.log(`Total team members in database: ${memberCount}`)
  console.log(`Total user skills in database: ${userSkillCount}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })