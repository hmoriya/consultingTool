import { authDb } from './app/lib/db/auth-db';
import { projectDb } from './app/lib/db/project-db';

async function updateAllocations() {
  try {
    console.log('Updating project member allocations to realistic values...\n');

    // 現実的な稼働率の設定
    // PMは2-3プロジェクトを担当、各20-30%
    // コンサルタントは1-2プロジェクトに集中、各40-80%
    
    const updates = [
      // 鈴木花子（PM） - 2プロジェクトで計60%
      { email: 'pm@example.com', projectName: 'デジタルトランスフォーメーション推進', allocation: 30 },
      { email: 'pm@example.com', projectName: 'オムニチャネル戦略推進', allocation: 30 },
      { email: 'pm@example.com', projectName: 'データ分析基盤構築', allocation: 0 }, // 削除
      { email: 'pm@example.com', projectName: 'デジタルバンキング戦略', allocation: 0 }, // 削除
      
      // 木村大輔（PM） - 2プロジェクトで計60%
      { email: 'pm2@example.com', projectName: 'ビジネスオペレーション最適化', allocation: 30 },
      { email: 'pm2@example.com', projectName: 'スマートファクトリー導入', allocation: 30 },
      { email: 'pm2@example.com', projectName: '電子カルテシステム統合', allocation: 0 }, // 削除
      { email: 'pm2@example.com', projectName: '再生可能エネルギー管理システム', allocation: 0 }, // 削除
      
      // 佐藤次郎（コンサルタント） - 2プロジェクトで計80%
      { email: 'consultant@example.com', projectName: 'デジタルトランスフォーメーション推進', allocation: 40 },
      { email: 'consultant@example.com', projectName: 'スマートファクトリー導入', allocation: 40 },
      { email: 'consultant@example.com', projectName: 'デジタルバンキング戦略', allocation: 0 }, // 削除
      { email: 'consultant@example.com', projectName: '再生可能エネルギー管理システム', allocation: 0 }, // 削除
      
      // 高橋愛（コンサルタント） - 1プロジェクトで80%
      { email: 'consultant2@example.com', projectName: 'デジタルトランスフォーメーション推進', allocation: 50 },
      { email: 'consultant2@example.com', projectName: 'ビジネスオペレーション最適化', allocation: 30 },
      { email: 'consultant2@example.com', projectName: 'スマートファクトリー導入', allocation: 0 }, // 削除
      { email: 'consultant2@example.com', projectName: 'デジタルバンキング戦略', allocation: 0 }, // 削除
      { email: 'consultant2@example.com', projectName: '電子カルテシステム統合', allocation: 0 }, // 削除
      { email: 'consultant2@example.com', projectName: '再生可能エネルギー管理システム', allocation: 0 }, // 削除
      
      // 渡辺健（コンサルタント） - 2プロジェクトで計80%
      { email: 'consultant3@example.com', projectName: 'ビジネスオペレーション最適化', allocation: 40 },
      { email: 'consultant3@example.com', projectName: '電子カルテシステム統合', allocation: 40 },
      { email: 'consultant3@example.com', projectName: 'データ分析基盤構築', allocation: 0 }, // 削除
      { email: 'consultant3@example.com', projectName: 'オムニチャネル戦略推進', allocation: 0 }, // 削除
      
      // 伊藤真由美（コンサルタント） - 2プロジェクトで計80%
      { email: 'consultant4@example.com', projectName: 'データ分析基盤構築', allocation: 50 },
      { email: 'consultant4@example.com', projectName: 'オムニチャネル戦略推進', allocation: 30 },
      { email: 'consultant4@example.com', projectName: 'ビジネスオペレーション最適化', allocation: 0 }, // 削除
      { email: 'consultant4@example.com', projectName: 'スマートファクトリー導入', allocation: 0 }, // 削除
      { email: 'consultant4@example.com', projectName: '電子カルテシステム統合', allocation: 0 }, // 削除
      { email: 'consultant4@example.com', projectName: '再生可能エネルギー管理システム', allocation: 0 }, // 削除
    ];

    for (const update of updates) {
      // ユーザーIDを取得
      const user = await authDb.user.findUnique({
        where: { email: update.email },
        select: { id: true, name: true }
      });

      if (!user) {
        console.warn(`User not found: ${update.email}`);
        continue;
      }

      // プロジェクトIDを取得
      const project = await projectDb.project.findFirst({
        where: { name: update.projectName },
        select: { id: true }
      });

      if (!project) {
        console.warn(`Project not found: ${update.projectName}`);
        continue;
      }

      if (update.allocation === 0) {
        // 稼働率0の場合は削除
        await projectDb.projectMember.deleteMany({
          where: {
            userId: user.id,
            projectId: project.id
          }
        });
        console.log(`Removed ${user.name} from ${update.projectName}`);
      } else {
        // 稼働率を更新
        await projectDb.projectMember.updateMany({
          where: {
            userId: user.id,
            projectId: project.id
          },
          data: {
            allocation: update.allocation
          }
        });
        console.log(`Updated ${user.name} on ${update.projectName}: ${update.allocation}%`);
      }
    }

    console.log('\nVerifying updated allocations...\n');

    // 更新後の確認
    const users = await authDb.user.findMany({
      where: {
        email: {
          in: ['pm@example.com', 'pm2@example.com', 'consultant@example.com', 
               'consultant2@example.com', 'consultant3@example.com', 'consultant4@example.com']
        }
      },
      orderBy: { name: 'asc' }
    });

    for (const user of users) {
      const memberships = await projectDb.projectMember.findMany({
        where: { userId: user.id },
        include: {
          project: {
            select: { name: true }
          }
        }
      });

      const totalAllocation = memberships.reduce((sum, m) => sum + m.allocation, 0);
      console.log(`${user.name}: Total ${totalAllocation}%`);
      memberships.forEach(m => {
        console.log(`  - ${m.project.name}: ${m.allocation}%`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await authDb.$disconnect();
    await projectDb.$disconnect();
  }
}

updateAllocations();