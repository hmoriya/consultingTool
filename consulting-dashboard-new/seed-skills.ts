import { authDb } from './app/lib/db/auth-db'
import { resourceDb } from './app/lib/db/resource-db'

async function main() {
  try {
    console.log('🌱 Seeding user skills...')

    // スキルデータを取得
    const skills = await resourceDb.skill.findMany()
    console.log(`Found ${skills.length} skills`)

    // ユーザーを取得
    const users = await authDb.user.findMany({
      where: {
        role: {
          name: {
            in: ['PM', 'Consultant']
          }
        }
      },
      include: {
        role: true
      }
    })

    console.log(`Found ${users.length} users`)

    // ユーザースキルデータを作成
    const userSkillData = [
      // 鈴木花子（PM）のスキル
      {
        userId: users.find(u => u.email === 'pm@example.com')?.id || '',
        skillId: skills.find(s => s.name === 'プロジェクト管理')?.id || '',
        level: 5,
        experienceYears: 10,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 15,
        notes: '大規模プロジェクトの経験豊富'
      },
      {
        userId: users.find(u => u.email === 'pm@example.com')?.id || '',
        skillId: skills.find(s => s.name === '英語')?.id || '',
        level: 4,
        experienceYears: 8,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 5,
        notes: 'ビジネスレベル'
      },

      // 佐藤次郎（コンサルタント）のスキル
      {
        userId: users.find(u => u.email === 'consultant@example.com')?.id || '',
        skillId: skills.find(s => s.name === 'JavaScript')?.id || '',
        level: 5,
        experienceYears: 8,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 12,
        notes: 'フルスタック開発可能'
      },
      {
        userId: users.find(u => u.email === 'consultant@example.com')?.id || '',
        skillId: skills.find(s => s.name === 'React')?.id || '',
        level: 5,
        experienceYears: 6,
        selfAssessment: 5,
        managerAssessment: 5,
        projectCount: 10
      },
      {
        userId: users.find(u => u.email === 'consultant@example.com')?.id || '',
        skillId: skills.find(s => s.name === 'Node.js')?.id || '',
        level: 4,
        experienceYears: 5,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 8
      },

      // 高橋愛（コンサルタント）のスキル
      {
        userId: users.find(u => u.email === 'consultant2@example.com')?.id || '',
        skillId: skills.find(s => s.name === 'React')?.id || '',
        level: 4,
        experienceYears: 4,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 6
      },
      {
        userId: users.find(u => u.email === 'consultant2@example.com')?.id || '',
        skillId: skills.find(s => s.name === 'JavaScript')?.id || '',
        level: 4,
        experienceYears: 5,
        selfAssessment: 4,
        managerAssessment: 4,
        projectCount: 8
      }
    ]

    // UserSkillデータを投入
    let successCount = 0
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
          successCount++
          const user = users.find(u => u.id === data.userId)
          const skill = skills.find(s => s.id === data.skillId)
          console.log(`✅ Added skill "${skill?.name}" for ${user?.name}`)
        }
      }
    }

    console.log(`\n✅ Successfully created ${successCount} user skill records!`)

  } catch (_error) {
    console.error('Error seeding skills:', error)
  } finally {
    await authDb.$disconnect()
    await resourceDb.$disconnect()
  }
}

main()