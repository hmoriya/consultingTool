import { projectDb } from './app/lib/db/project-db'
import { authDb } from './app/lib/db/auth-db'
import { resourceDb } from './app/lib/db/resource-db'

async function main() {
  console.log('🌱 プロジェクト経験データのシード投入を開始...')

  try {
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

    console.log(`ユーザー数: ${users.length}`)

    // プロジェクトを取得
    const projects = await projectDb.project.findMany()
    console.log(`プロジェクト数: ${projects.length}`)

    // スキルを取得
    const skills = await resourceDb.skill.findMany()
    console.log(`スキル数: ${skills.length}`)

    // プロジェクトメンバーの既存データを更新
    const projectMembers = await projectDb.projectMember.findMany({
      include: {
        project: true
      }
    })

    for (const member of projectMembers) {
      // PMの場合の詳細情報を追加
      if (member.role === 'pm') {
        await projectDb.projectMember.update({
          where: { id: member.id },
          data: {
            responsibilities: `${member.project.name}のプロジェクトマネージャーとして、以下の責任を担当:\n- プロジェクト計画の策定と実行\n- ステークホルダー管理\n- リスク管理とイシュー対応\n- チームメンバーの管理とモチベーション向上\n- 予算とスケジュールの管理`,
            achievements: `- プロジェクトを予定通り納期内に完了\n- 顧客満足度95%を達成\n- チームの生産性を20%向上\n- 予算内でプロジェクトを完了`,
            allocation: member.allocation || 30
          }
        })
      } else {
        // コンサルタントの場合
        await projectDb.projectMember.update({
          where: { id: member.id },
          data: {
            responsibilities: `${member.project.name}の${member.role}として、以下の業務を担当:\n- システム設計と実装\n- 技術的な課題の解決\n- クライアントへの技術提案\n- ドキュメント作成\n- コードレビューと品質管理`,
            achievements: `- 主要機能の設計と実装を完了\n- パフォーマンスを50%改善\n- 技術的負債を30%削減\n- ナレッジ共有セッションを月2回実施`,
            allocation: member.allocation || 80
          }
        })
      }

      console.log(`✅ ${member.project.name} - ${users.find(u => u.id === member.userId)?.name} の経験情報を更新`)

      // プロジェクトで使用したスキルを追加
      const userSkills = await resourceDb.userSkill.findMany({
        where: { userId: member.userId }
      })

      // ユーザーが持っているスキルから関連するものを選択
      for (const userSkill of userSkills) {
        // スキルの使用レベル（1-5）をランダムに設定
        const usageLevel = Math.min(5, Math.max(3, userSkill.level || 3) + Math.floor(Math.random() * 2) - 1)

        try {
          await projectDb.projectMemberSkill.create({
            data: {
              projectMemberId: member.id,
              skillId: userSkill.skillId,
              usageLevel
            }
          })
          
          // UserSkillの最終使用日を更新
          await resourceDb.userSkill.update({
            where: { id: userSkill.id },
            data: {
              lastUsedDate: member.endDate || new Date(),
              projectCount: {
                increment: 1
              }
            }
          })

          const skill = skills.find(s => s.id === userSkill.skillId)
          console.log(`  - スキル「${skill?.name}」を追加（レベル: ${usageLevel}）`)
        } catch (error) {
          // 既に存在する場合はスキップ
          if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            console.log(`  - スキル「${skills.find(s => s.id === userSkill.skillId)?.name}」は既に登録済み`)
          } else {
            throw error
          }
        }
      }
    }

    console.log('\n✅ プロジェクト経験データの投入が完了しました！')

  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await projectDb.$disconnect()
    await authDb.$disconnect()
    await resourceDb.$disconnect()
  }
}

main()