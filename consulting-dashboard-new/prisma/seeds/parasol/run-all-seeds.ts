import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import { seedProjectSuccess } from './project-success-seed'
import { seedSecureAccess } from './secure-access-seed'
import { seedProductivityVisualization } from './productivity-visualization-seed'
import { seedTalentOptimization } from './talent-optimization-seed'
import { seedCollaborationFacilitation } from './collaboration-facilitation-seed'
import { seedKnowledgeCocreation } from './knowledge-cocreation-seed'
import { seedRevenueOptimization } from './revenue-optimization-seed'

const parasolDb = new ParasolPrismaClient()

async function main() {
  console.log('🚀 Starting complete Parasol seed...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await parasolDb.testDefinition.deleteMany()
    await parasolDb.pageDefinition.deleteMany()
    await parasolDb.useCase.deleteMany()
    await parasolDb.businessOperation.deleteMany()
    await parasolDb.businessCapability.deleteMany()
    await parasolDb.service.deleteMany()

    // Seed each service
    console.log('\n📦 Seeding services with capabilities and operations...')

    // 1. Project Success Support Service
    console.log('\n1️⃣ Project Success Support Service')
    const project = await seedProjectSuccess()
    console.log(`   ✅ Created ${project.capabilities} capabilities, ${project.operations} operations`)

    // 2. Secure Access Service
    console.log('\n2️⃣ Secure Access Service')
    const secure = await seedSecureAccess()
    console.log(`   ✅ Created ${secure.capabilities} capabilities, ${secure.operations} operations`)

    // 3. Productivity Visualization Service
    console.log('\n3️⃣ Productivity Visualization Service')
    const productivity = await seedProductivityVisualization()
    console.log(`   ✅ Created ${productivity.capabilities} capabilities, ${productivity.operations} operations`)

    // 4. Talent Optimization Service
    console.log('\n4️⃣ Talent Optimization Service')
    const talent = await seedTalentOptimization()
    console.log(`   ✅ Created ${talent.capabilities} capabilities, ${talent.operations} operations`)

    // 5. Collaboration Facilitation Service
    console.log('\n5️⃣ Collaboration Facilitation Service')
    const collaboration = await seedCollaborationFacilitation()
    console.log(`   ✅ Created ${collaboration.capabilities} capabilities, ${collaboration.operations} operations`)

    // 6. Knowledge Co-creation Service
    console.log('\n6️⃣ Knowledge Co-creation Service')
    const knowledge = await seedKnowledgeCocreation()
    console.log(`   ✅ Created ${knowledge.capabilities} capabilities, ${knowledge.operations} operations`)

    // 7. Revenue Optimization Service
    console.log('\n7️⃣ Revenue Optimization Service')
    const revenue = await seedRevenueOptimization()
    console.log(`   ✅ Created ${revenue.capabilities} capabilities, ${revenue.operations} operations`)

    // Summary
    const services = await parasolDb.service.count()
    const capabilities = await parasolDb.businessCapability.count()
    const operations = await parasolDb.businessOperation.count()

    console.log('\n📊 Summary:')
    console.log(`   - Services: ${services}`)
    console.log(`   - Capabilities: ${capabilities}`)
    console.log(`   - Operations: ${operations}`)

    console.log('\n✅ Complete Parasol seed finished successfully!')

  } catch (error) {
    console.error('❌ Error seeding Parasol:', error)
    throw error
  } finally {
    await parasolDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit())