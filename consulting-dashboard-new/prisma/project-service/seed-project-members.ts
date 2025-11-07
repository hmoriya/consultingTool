import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { PrismaClient as AuthPrismaClient } from '@prisma/client'
import { subMonths } from 'date-fns'
import path from 'path'

const projectRoot = path.resolve(__dirname, '../..')

const authDb = new AuthPrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL || `file:${path.join(projectRoot, 'prisma/auth-service/data/auth.db')}`
    }
  }
})

const projectDb = new ProjectPrismaClient({
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL || `file:${path.join(projectRoot, 'prisma/project-service/data/project.db')}`
    }
  }
})

async function main() {
  try {
    console.log('Project root:', projectRoot)
    console.log('Auth DB path:', path.join(projectRoot, 'prisma/auth-service/data/auth.db'))
    console.log('Project DB path:', path.join(projectRoot, 'prisma/project-service/data/project.db'))
    
    // Get 鈴木花子 (PM user)
    const pmUser = await authDb.user.findFirst({
      where: {
        email: 'pm@example.com'
      }
    })

    if (!pmUser) {
      console.error('PM user not found')
      return
    }

    console.log('Found PM user:', pmUser.name)

    // Get all projects
    const projects = await projectDb.project.findMany()
    console.log(`Found ${projects.length} projects`)

    // Assign 鈴木花子 as PM to all projects
    for (const project of projects) {
      // Check if already assigned
      const existingMember = await projectDb.projectMember.findFirst({
        where: {
          projectId: project.id,
          userId: pmUser.id
        }
      })

      if (existingMember) {
        console.log(`${pmUser.name} is already assigned to ${project.name}`)
        continue
      }

      // Create project member assignment
      const member = await projectDb.projectMember.create({
        data: {
          projectId: project.id,
          userId: pmUser.id,
          role: 'pm',
          allocation: 30, // 30% allocation per project
          startDate: subMonths(new Date(), 6),
          endDate: null
        }
      })

      console.log(`Assigned ${pmUser.name} as PM to ${project.name} with ${member.allocation}% allocation`)
    }

    console.log('✅ Project member assignment completed')

  } catch (_error) {
    console.error('Error seeding project members:', error)
    throw error
  } finally {
    await authDb.$disconnect()
    await projectDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))