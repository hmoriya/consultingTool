import { projectDb } from './app/lib/db/project-db'
import { authDb } from './app/lib/db/auth-db'

async function main() {
  console.log('🔧 プロジェクトメンバーのuserIdを修正中...')

  try {
    // ユーザーを取得
    const users = await authDb.user.findMany({
      include: {
        role: true
      }
    })

    console.log('ユーザー一覧:')
    users.forEach(u => {
      console.log(`- ${u.id}: ${u.name} (${u.email}) - ${u.role.name}`)
    })

    // すべてのプロジェクトを取得
    const projects = await projectDb.project.findMany()
    console.log(`\nプロジェクト数: ${projects.length}`)

    // 既存のプロジェクトメンバーをすべて削除
    await projectDb.projectMemberSkill.deleteMany({})
    await projectDb.projectMember.deleteMany({})
    console.log('✅ 既存のプロジェクトメンバーデータを削除')

    // PMユーザーを取得
    const pmUsers = users.filter(u => u.role.name === 'PM')
    const consultantUsers = users.filter(u => u.role.name === 'Consultant')

    let pmIndex = 0
    let consultantIndex = 0

    // 各プロジェクトにメンバーを割り当て
    for (const project of projects) {
      // PMを割り当て（ラウンドロビン）
      const pm = pmUsers[pmIndex % pmUsers.length]
      pmIndex++

      await projectDb.projectMember.create({
        data: {
          projectId: project.id,
          userId: pm.id,
          role: 'pm',
          startDate: project.startDate,
          endDate: project.endDate,
          allocation: 30, // PMは30%
          responsibilities: `${project.name}のプロジェクトマネージャーとして、以下の責任を担当:\n- プロジェクト計画の策定と実行\n- ステークホルダー管理\n- リスク管理とイシュー対応\n- チームメンバーの管理とモチベーション向上\n- 予算とスケジュールの管理`,
          achievements: `- プロジェクトを予定通り納期内に完了\n- 顧客満足度95%を達成\n- チームの生産性を20%向上\n- 予算内でプロジェクトを完了`
        }
      })
      console.log(`✅ ${project.name} - PM: ${pm.name}`)

      // コンサルタントを2-3人割り当て
      const numConsultants = 2 + Math.floor(Math.random() * 2)
      const selectedConsultants = new Set<string>()

      for (let i = 0; i < numConsultants && i < consultantUsers.length; i++) {
        let consultant
        do {
          consultant = consultantUsers[consultantIndex % consultantUsers.length]
          consultantIndex++
        } while (selectedConsultants.has(consultant.id) && selectedConsultants.size < consultantUsers.length)

        selectedConsultants.add(consultant.id)

        const roles = ['lead', 'senior', 'consultant']
        const role = roles[i] || 'consultant'

        await projectDb.projectMember.create({
          data: {
            projectId: project.id,
            userId: consultant.id,
            role,
            startDate: project.startDate,
            endDate: project.endDate,
            allocation: role === 'lead' ? 80 : 60, // リードは80%、その他は60%
            responsibilities: `${project.name}の${role}として、以下の業務を担当:\n- システム設計と実装\n- 技術的な課題の解決\n- クライアントへの技術提案\n- ドキュメント作成\n- コードレビューと品質管理`,
            achievements: `- 主要機能の設計と実装を完了\n- パフォーマンスを50%改善\n- 技術的負債を30%削減\n- ナレッジ共有セッションを月2回実施`
          }
        })
        console.log(`  - ${role}: ${consultant.name}`)
      }
    }

    console.log('\n✅ プロジェクトメンバーの修正が完了しました！')

  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await projectDb.$disconnect()
    await authDb.$disconnect()
  }
}

main()