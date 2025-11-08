import { resourceDb } from './app/lib/db/resource-db'

async function main() {
  console.log('🌱 スキルマスタデータのシード投入を開始...')

  try {
    // スキルカテゴリを作成
    const categories = [
      {
        id: 'cat1',
        name: 'プロジェクト管理',
        order: 1
      },
      {
        id: 'cat2',
        name: 'プログラミング言語',
        order: 2
      },
      {
        id: 'cat3',
        name: 'データベース・インフラ',
        order: 3
      },
      {
        id: 'cat4',
        name: 'ビジネススキル',
        order: 4
      },
      {
        id: 'cat5',
        name: '言語・コミュニケーション',
        order: 5
      }
    ]

    for (const category of categories) {
      await resourceDb.skillCategory.upsert({
        where: { id: category.id },
        update: {},
        create: category
      })
      console.log(`✅ カテゴリ作成: ${category.name}`)
    }

    // スキルを作成
    const skills = [
      // プロジェクト管理
      { id: 'skill1', name: 'プロジェクト管理', categoryId: 'cat1', description: 'PMBOKベースのプロジェクト管理手法' },
      { id: 'skill2', name: 'アジャイル開発', categoryId: 'cat1', description: 'スクラム、カンバンなどのアジャイル手法' },
      { id: 'skill3', name: 'リスク管理', categoryId: 'cat1', description: 'リスクの識別、評価、対応策の立案' },
      { id: 'skill4', name: 'ステークホルダー管理', categoryId: 'cat1', description: 'ステークホルダーとの効果的なコミュニケーション' },

      // プログラミング言語
      { id: 'skill5', name: 'JavaScript', categoryId: 'cat2', description: 'JavaScriptとES6+の機能' },
      { id: 'skill6', name: 'TypeScript', categoryId: 'cat2', description: 'TypeScriptによる型安全な開発' },
      { id: 'skill7', name: 'React', categoryId: 'cat2', description: 'Reactフレームワークとエコシステム' },
      { id: 'skill8', name: 'Node.js', categoryId: 'cat2', description: 'Node.jsによるサーバーサイド開発' },
      { id: 'skill9', name: 'Python', categoryId: 'cat2', description: 'Pythonによるデータ分析とWeb開発' },
      { id: 'skill10', name: 'Java', categoryId: 'cat2', description: 'Javaによるエンタープライズ開発' },
      { id: 'skill11', name: 'Go', categoryId: 'cat2', description: 'Go言語によるマイクロサービス開発' },

      // データベース・インフラ
      { id: 'skill12', name: 'PostgreSQL', categoryId: 'cat3', description: '高度なSQLとPostgreSQL固有機能' },
      { id: 'skill13', name: 'MongoDB', categoryId: 'cat3', description: 'NoSQLデータベースの設計と運用' },
      { id: 'skill14', name: 'AWS', categoryId: 'cat3', description: 'AWSクラウドサービスの活用' },
      { id: 'skill15', name: 'Docker', categoryId: 'cat3', description: 'コンテナ化とオーケストレーション' },
      { id: 'skill16', name: 'Kubernetes', categoryId: 'cat3', description: 'Kubernetesによるコンテナ管理' },
      { id: 'skill17', name: 'CI/CD', categoryId: 'cat3', description: '継続的インテグレーション/デプロイメント' },

      // ビジネススキル
      { id: 'skill18', name: '要件定義', categoryId: 'cat4', description: 'ビジネス要求の分析と要件定義' },
      { id: 'skill19', name: 'システム設計', categoryId: 'cat4', description: 'システムアーキテクチャ設計' },
      { id: 'skill20', name: 'データ分析', categoryId: 'cat4', description: 'データの可視化と統計分析' },
      { id: 'skill21', name: 'プレゼンテーション', categoryId: 'cat4', description: '効果的なプレゼンテーション技術' },
      { id: 'skill22', name: 'ファシリテーション', categoryId: 'cat4', description: '会議やワークショップの進行' },

      // 言語・コミュニケーション
      { id: 'skill23', name: '英語', categoryId: 'cat5', description: 'ビジネスレベルの英語コミュニケーション' },
      { id: 'skill24', name: '中国語', categoryId: 'cat5', description: '中国語によるビジネスコミュニケーション' },
      { id: 'skill25', name: 'ドキュメント作成', categoryId: 'cat5', description: '技術文書とビジネス文書の作成' },
      { id: 'skill26', name: 'チームビルディング', categoryId: 'cat5', description: 'チームの構築と育成' }
    ]

    for (const skill of skills) {
      await resourceDb.skill.upsert({
        where: { id: skill.id },
        update: {},
        create: skill
      })
      console.log(`✅ スキル作成: ${skill.name}`)
    }

    console.log('\n✅ スキルマスタデータの投入が完了しました！')
    console.log(`カテゴリ数: ${categories.length}`)
    console.log(`スキル数: ${skills.length}`)

  } catch (_error) {
    console.error('❌ エラー:', error)
  } finally {
    await resourceDb.$disconnect()
  }
}

main()