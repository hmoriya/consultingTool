import { authDb } from './app/lib/db/auth-db';
import { projectDb } from './app/lib/db/project-db';

async function checkAllocations() {
  try {
    // ユーザー情報を取得
    const users = await authDb.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' }
    });

    console.log('Current project member allocations:\n');

    for (const user of users) {
      const memberships = await projectDb.projectMember.findMany({
        where: { userId: user.id },
        include: {
          project: {
            select: { name: true, status: true }
          }
        }
      });

      if (memberships.length > 0) {
        const totalAllocation = memberships.reduce((sum, m) => sum + m.allocation, 0);
        console.log(`${user.name} (${user.email})`);
        console.log(`  Total allocation: ${totalAllocation}%`);
        memberships.forEach(m => {
          console.log(`  - ${m.project.name}: ${m.allocation}% (${m.project.status})`);
        });
        console.log('');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await authDb.$disconnect();
    await projectDb.$disconnect();
  }
}

checkAllocations();