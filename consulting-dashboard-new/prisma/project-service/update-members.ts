import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'

const projectDb = new ProjectPrismaClient()

async function updateProjectMembers() {
  console.log('🔄 Updating project members...')

  try {
    // 既存のプロジェクトを取得
    const projects = await projectDb.project.findMany({
      orderBy: { createdAt: 'asc' }
    })

    if (projects.length === 0) {
      console.log('❌ No projects found')
      return
    }

    console.log(`Found ${projects.length} projects`)

    // PMユーザーのIDを直接使用 (pm@example.com)
    const pmUserId = 'cmfoiscfi000cym9dvineq5jx'

    // 各プロジェクトにPMユーザーを追加
    for (const project of projects) {
      // 既存のPMメンバーをチェック
      const existingPM = await projectDb.projectMember.findFirst({
        where: {
          projectId: project.id,
          userId: pmUserId,
          role: 'PM'
        }
      })

      if (!existingPM) {
        // PMメンバーを追加
        await projectDb.projectMember.create({
          data: {
            projectId: project.id,
            userId: pmUserId,
            role: 'PM',
            allocation: project.code === 'DX001' ? 0.5 :
                       project.code === 'BPO001' ? 0.3 : 0.5,
            startDate: project.startDate
          }
        })
        console.log(`✅ Added PM to project: ${project.name} (${project.code})`)
      } else {
        // ロールを大文字に更新
        await projectDb.projectMember.update({
          where: { id: existingPM.id },
          data: { role: 'PM' }
        })
        console.log(`✅ Updated PM role for project: ${project.name} (${project.code})`)
      }
    }

    // すべてのプロジェクトメンバーのロールを大文字に更新
    await projectDb.projectMember.updateMany({
      where: { role: 'pm' },
      data: { role: 'PM' }
    })

    console.log('✅ Project members updated successfully')

  } catch (error) {
    console.error('❌ Error updating project members:', error)
    throw error
  }
}

if (require.main === module) {
  updateProjectMembers()
    .then(() => {
      console.log('Update completed')
    })
    .catch((e) => {
      console.error('Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await projectDb.$disconnect()
    })
}