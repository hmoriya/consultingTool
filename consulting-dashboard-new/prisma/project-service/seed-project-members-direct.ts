import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { subMonths } from 'date-fns'

const projectDb = new ProjectPrismaClient()

async function main() {
  try {
    // 鈴木花子's ID from the auth DB seed
    const pmUserId = 'cln8abc120001qs01example2' // This is the PM user ID from our seed data

    // Get all projects
    const projects = await projectDb.project.findMany()
    console.log(`Found ${projects.length} projects`)

    // Assign 鈴木花子 as PM to all projects
    for (const project of projects) {
      // Check if already assigned
      const existingMember = await projectDb.projectMember.findFirst({
        where: {
          projectId: project.id,
          userId: pmUserId
        }
      })

      if (existingMember) {
        console.log(`PM is already assigned to ${project.name}`)
        continue
      }

      // Create project member assignment
      const member = await projectDb.projectMember.create({
        data: {
          projectId: project.id,
          userId: pmUserId,
          role: 'pm',
          allocation: 30, // 30% allocation per project
          startDate: subMonths(new Date(), 6),
          endDate: null
        }
      })

      console.log(`Assigned PM to ${project.name} with ${member.allocation}% allocation`)
    }

    console.log('✅ Project member assignment completed')

  } catch (error) {
    console.error('Error seeding project members:', error)
    throw error
  } finally {
    await projectDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))