// ナレッジサービス用シード
import { PrismaClient as KnowledgePrismaClient } from '../knowledge-service/generated/client'

const knowledgeDb = new KnowledgePrismaClient({
  log: ['error', 'warn']
})

export async function seedKnowledge(users?: any) {
  console.log('🌱 Seeding Knowledge Service...')
  
  try {
    // 既存のカテゴリをチェック
    const existingCategories = await knowledgeDb.knowledgeCategory.count()
    if (existingCategories > 0) {
      console.log('⚠️  Knowledge Service already has data. Skipping seed.')
      return
    }

    // ナレッジカテゴリの作成
    const categories = await Promise.all([
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'ベストプラクティス',
          description: 'プロジェクト管理とコンサルティングのベストプラクティス',
          icon: 'star',
          color: '#4F46E5',
          order: 1
        }
      }),
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'テクニカルガイド',
          description: '技術的な実装ガイドとチュートリアル',
          icon: 'code',
          color: '#059669',
          order: 2
        }
      }),
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'プロジェクトテンプレート',
          description: '各種プロジェクトで使用できるテンプレート集',
          icon: 'template',
          color: '#DC2626',
          order: 3
        }
      }),
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'FAQ',
          description: 'よくある質問と回答',
          icon: 'help-circle',
          color: '#7C3AED',
          order: 4
        }
      }),
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: '教訓・振り返り',
          description: 'プロジェクトから学んだ教訓と改善点',
          icon: 'lightbulb',
          color: '#EA580C',
          order: 5
        }
      })
    ])

    // サンプル記事の作成
    const articles = []
    
    // ベストプラクティス記事
    const bestPracticeArticles = await Promise.all([
      knowledgeDb.article.create({
        data: {
          title: 'プロジェクト計画の立て方',
          content: `# プロジェクト計画の立て方

## 概要
効果的なプロジェクト計画は成功の鍵となります。以下の手順に従って計画を立てましょう。

## 手順

### 1. 目標の明確化
- ビジネス目標の定義
- 成果物の明確化
- 成功指標の設定

### 2. スコープの定義
- 作業範囲の明確化
- 制約条件の整理
- リスクの洗い出し

### 3. タスクの分解
- WBS（Work Breakdown Structure）の作成
- タスクの依存関係の整理
- 見積もりの実施

### 4. スケジュールの作成
- クリティカルパスの特定
- マイルストーンの設定
- バッファの確保

## 注意点
- 計画は定期的に見直すこと
- ステークホルダーとのコミュニケーションを重視
- リスクの早期発見と対応`,
          summary: 'プロジェクトを成功に導くための計画立案の基本手順とポイントを解説',
          categoryId: categories[0].id,
          authorId: users?.pmUser?.id || 'pm-user-id',
          status: 'PUBLISHED',
          visibility: 'ORGANIZATION',
          tags: JSON.stringify(['プロジェクト管理', '計画', 'ベストプラクティス']),
          keywords: 'プロジェクト計画 WBS スケジュール マイルストーン',
          estimatedReadTime: 5,
          difficulty: 'INTERMEDIATE',
          publishedAt: new Date('2024-01-10T10:00:00Z')
        }
      }),
      knowledgeDb.article.create({
        data: {
          title: '効果的なチームコミュニケーション',
          content: `# 効果的なチームコミュニケーション

## はじめに
プロジェクトの成功にはチーム間の円滑なコミュニケーションが不可欠です。

## コミュニケーションの原則

### 1. 明確性
- 簡潔で分かりやすいメッセージ
- 専門用語の適切な使用
- 具体的な例の提示

### 2. 適時性
- 必要な情報を適切なタイミングで共有
- 定期的な進捗報告
- 問題の早期エスカレーション

### 3. 双方向性
- アクティブリスニング
- フィードバックの奨励
- オープンな議論の促進

## ツールの活用
- チャットツール：日常的なコミュニケーション
- ビデオ会議：重要な議論
- プロジェクト管理ツール：進捗共有`,
          summary: 'チーム内外での効果的なコミュニケーション手法とツール活用法',
          categoryId: categories[0].id,
          authorId: users?.consultantUser?.id || 'consultant-user-id',
          status: 'PUBLISHED',
          visibility: 'ORGANIZATION',
          tags: JSON.stringify(['コミュニケーション', 'チーム管理', 'ツール']),
          keywords: 'コミュニケーション チーム 会議 フィードバック',
          estimatedReadTime: 4,
          difficulty: 'BEGINNER',
          publishedAt: new Date('2024-01-12T14:30:00Z')
        }
      })
    ])
    articles.push(...bestPracticeArticles)

    // テクニカルガイド記事
    const technicalArticles = await Promise.all([
      knowledgeDb.article.create({
        data: {
          title: 'Next.js アプリケーションのパフォーマンス最適化',
          content: `# Next.js アプリケーションのパフォーマンス最適化

## 概要
Next.jsアプリケーションのパフォーマンスを向上させるための実践的な手法を紹介します。

## 最適化手法

### 1. 画像最適化
\`\`\`jsx
import Image from 'next/image'

function MyComponent() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority // Above the fold images
    />
  )
}
\`\`\`

### 2. 動的インポート
\`\`\`jsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/Chart'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
\`\`\`

### 3. API Routes最適化
- データベース接続の適切な管理
- キャッシュ戦略の実装
- エラーハンドリングの充実

### 4. バンドル分析
\`\`\`bash
npm install @next/bundle-analyzer
\`\`\`

## 計測とモニタリング
- Lighthouse によるパフォーマンス測定
- Web Vitals の監視
- Real User Monitoring (RUM) の導入`,
          summary: 'Next.jsアプリケーションのパフォーマンス最適化テクニック',
          categoryId: categories[1].id,
          authorId: users?.consultantUser?.id || 'consultant-user-id',
          status: 'PUBLISHED',
          visibility: 'ORGANIZATION',
          tags: JSON.stringify(['Next.js', 'パフォーマンス', 'React', 'フロントエンド']),
          keywords: 'Next.js パフォーマンス 最適化 画像 バンドル',
          estimatedReadTime: 8,
          difficulty: 'ADVANCED',
          publishedAt: new Date('2024-01-15T16:00:00Z')
        }
      })
    ])
    articles.push(...technicalArticles)

    // テンプレートの作成
    const templates = await Promise.all([
      knowledgeDb.template.create({
        data: {
          name: 'プロジェクト提案書テンプレート',
          description: '新規プロジェクトの提案書作成用テンプレート',
          content: `# プロジェクト提案書

## プロジェクト概要
- **プロジェクト名**: {{PROJECT_NAME}}
- **期間**: {{START_DATE}} ～ {{END_DATE}}
- **予算**: {{BUDGET}}

## 背景・目的
{{BACKGROUND}}

## 目標
{{OBJECTIVES}}

## 成果物
{{DELIVERABLES}}

## スケジュール
| フェーズ | 期間 | 主要活動 |
|---------|------|----------|
| {{PHASE1}} | {{PHASE1_DURATION}} | {{PHASE1_ACTIVITIES}} |
| {{PHASE2}} | {{PHASE2_DURATION}} | {{PHASE2_ACTIVITIES}} |

## リスク
{{RISKS}}

## チーム体制
{{TEAM_STRUCTURE}}`,
          categoryId: categories[2].id,
          authorId: users?.pmUser?.id || 'pm-user-id',
          type: 'PROPOSAL',
          tags: JSON.stringify(['提案書', 'プロジェクト', 'テンプレート']),
          variables: JSON.stringify([
            'PROJECT_NAME', 'START_DATE', 'END_DATE', 'BUDGET',
            'BACKGROUND', 'OBJECTIVES', 'DELIVERABLES',
            'PHASE1', 'PHASE1_DURATION', 'PHASE1_ACTIVITIES',
            'PHASE2', 'PHASE2_DURATION', 'PHASE2_ACTIVITIES',
            'RISKS', 'TEAM_STRUCTURE'
          ])
        }
      }),
      knowledgeDb.template.create({
        data: {
          name: '週次レポートテンプレート',
          description: 'プロジェクトの週次進捗レポート用テンプレート',
          content: `# 週次進捗レポート

**対象期間**: {{WEEK_PERIOD}}
**プロジェクト**: {{PROJECT_NAME}}
**報告者**: {{REPORTER}}

## 今週の実績
{{ACHIEVEMENTS}}

## 来週の予定
{{NEXT_WEEK_PLAN}}

## 課題・リスク
{{ISSUES_RISKS}}

## メトリクス
- **進捗率**: {{PROGRESS_RATE}}%
- **予算消化率**: {{BUDGET_USAGE}}%
- **品質指標**: {{QUALITY_METRICS}}

## その他
{{OTHERS}}`,
          categoryId: categories[2].id,
          authorId: users?.pmUser?.id || 'pm-user-id',
          type: 'REPORT',
          tags: JSON.stringify(['レポート', '進捗', '週次', 'テンプレート']),
          variables: JSON.stringify([
            'WEEK_PERIOD', 'PROJECT_NAME', 'REPORTER',
            'ACHIEVEMENTS', 'NEXT_WEEK_PLAN', 'ISSUES_RISKS',
            'PROGRESS_RATE', 'BUDGET_USAGE', 'QUALITY_METRICS', 'OTHERS'
          ])
        }
      })
    ])

    // FAQの作成
    const faqs = await Promise.all([
      knowledgeDb.fAQ.create({
        data: {
          question: 'プロジェクトが遅延している場合、どう対応すべきですか？',
          answer: `プロジェクト遅延への対応手順：

1. **原因分析**
   - 遅延の根本原因を特定
   - 影響範囲の評価

2. **ステークホルダーとの相談**
   - 早期にクライアントに報告
   - 選択肢の提示

3. **対応策の検討**
   - スコープの調整
   - リソースの追加
   - スケジュールの見直し

4. **再計画**
   - 新しいスケジュールの策定
   - リスク対策の強化

5. **継続的な監視**
   - より頻繁な進捗確認
   - 早期警告システムの導入`,
          categoryId: categories[3].id,
          authorId: users?.pmUser?.id || 'pm-user-id'
        }
      }),
      knowledgeDb.fAQ.create({
        data: {
          question: 'クライアントとの要件調整で注意すべき点は？',
          answer: `要件調整での重要ポイント：

1. **事前準備**
   - 議題の明確化
   - 関連資料の用意
   - 参加者の確認

2. **会議での心構え**
   - アクティブリスニング
   - 質問による深掘り
   - 曖昧な表現の確認

3. **記録と確認**
   - 議事録の作成
   - 決定事項の再確認
   - 次回アクションの明確化

4. **フォローアップ**
   - 議事録の共有
   - 約束事項の実行
   - 定期的な確認`,
          categoryId: categories[3].id,
          authorId: users?.consultantUser?.id || 'consultant-user-id'
        }
      })
    ])

    // エキスパート情報の作成（ユーザーがいる場合）
    const experts = []
    if (users?.pmUser) {
      const pmExpert = await knowledgeDb.expert.create({
        data: {
          userId: users.pmUser.id,
          bio: 'プロジェクト管理のエキスパートとして10年以上の経験を持つ。大規模システム開発からアジャイル開発まで幅広い分野で活躍。',
          specialties: JSON.stringify([
            'プロジェクト管理',
            'アジャイル開発',
            'リスク管理',
            'ステークホルダー管理'
          ]),
          certifications: JSON.stringify([
            'PMP (Project Management Professional)',
            'CSM (Certified Scrum Master)',
            'SAFe Agilist'
          ]),
          experience: '10年以上のプロジェクト管理経験。50以上のプロジェクトを成功に導く。',
          rating: 4.8,
          reviewCount: 15
        }
      })
      experts.push(pmExpert)
    }

    if (users?.consultantUser) {
      const consultantExpert = await knowledgeDb.expert.create({
        data: {
          userId: users.consultantUser.id,
          bio: 'フルスタック開発者として、最新技術を活用したシステム開発に特化。特にReact/Next.jsエコシステムに精通。',
          specialties: JSON.stringify([
            'フロントエンド開発',
            'React/Next.js',
            'TypeScript',
            'システム設計'
          ]),
          certifications: JSON.stringify([
            'AWS Solutions Architect',
            'Google Cloud Professional',
            'Microsoft Azure Developer'
          ]),
          experience: '8年以上の開発経験。20以上のWebアプリケーション開発をリード。',
          rating: 4.9,
          reviewCount: 22
        }
      })
      experts.push(consultantExpert)
    }

    console.log(`✅ Knowledge Service seeded successfully:`)
    console.log(`   - Categories: ${categories.length}`)
    console.log(`   - Articles: ${articles.length}`)
    console.log(`   - Templates: ${templates.length}`)
    console.log(`   - FAQs: ${faqs.length}`)
    console.log(`   - Experts: ${experts.length}`)
    
  } catch (error) {
    console.error('❌ Error seeding Knowledge Service:', error)
    throw error
  } finally {
    await knowledgeDb.$disconnect()
  }
}

// スクリプトが直接実行された場合の処理
if (require.main === module) {
  seedKnowledge()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}