import { PrismaClient as KnowledgePrismaClient } from '@prisma/knowledge-client'

const knowledgeDb = new KnowledgePrismaClient({
  datasources: {
    db: {
      url: process.env.KNOWLEDGE_DATABASE_URL || 'file:./prisma/knowledge-service/data/knowledge.db'
    }
  }
})

async function seed() {
  console.log('🌱 Starting knowledge service seeding...')

  try {
    // 既存データをクリア
    await knowledgeDb.searchLog.deleteMany()
    await knowledgeDb.expertReview.deleteMany()
    await knowledgeDb.expert.deleteMany()
    await knowledgeDb.fAQFeedback.deleteMany()
    await knowledgeDb.fAQ.deleteMany()
    await knowledgeDb.template.deleteMany()
    await knowledgeDb.articleAttachment.deleteMany()
    await knowledgeDb.articleView.deleteMany()
    await knowledgeDb.articleLike.deleteMany()
    await knowledgeDb.articleComment.deleteMany()
    await knowledgeDb.articleRevision.deleteMany()
    await knowledgeDb.article.deleteMany()
    await knowledgeDb.knowledgeCategory.deleteMany()

    // カテゴリを作成
    const categories = await Promise.all([
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'プロジェクト管理',
          description: 'プロジェクト管理に関するナレッジ',
          icon: '📊',
          color: 'blue',
          order: 1
        }
      }),
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'テクノロジー',
          description: '技術的なナレッジと実装ガイド',
          icon: '💻',
          color: 'green',
          order: 2
        }
      }),
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'ビジネス戦略',
          description: 'ビジネス戦略とコンサルティング手法',
          icon: '🎯',
          color: 'purple',
          order: 3
        }
      }),
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'コミュニケーション',
          description: 'クライアント対応とチームコミュニケーション',
          icon: '💬',
          color: 'orange',
          order: 4
        }
      }),
      knowledgeDb.knowledgeCategory.create({
        data: {
          name: 'ベストプラクティス',
          description: '業界のベストプラクティスと事例',
          icon: '⭐',
          color: 'yellow',
          order: 5
        }
      })
    ])

    console.log(`✅ Created ${categories.length} categories`)

    // サンプル記事を作成
    const articles = await Promise.all([
      // プロジェクト管理
      knowledgeDb.article.create({
        data: {
          title: 'アジャイル開発の効果的な導入方法',
          content: `# アジャイル開発の効果的な導入方法

## 概要
アジャイル開発は、変化に柔軟に対応しながらソフトウェア開発を進める手法です。本記事では、アジャイル開発を組織に効果的に導入する方法について解説します。

## アジャイル開発とは

アジャイル開発は、以下の4つの価値を重視します：

1. **プロセスやツールよりも個人と対話を**
2. **包括的なドキュメントよりも動くソフトウェアを**
3. **契約交渉よりも顧客との協調を**
4. **計画に従うことよりも変化への対応を**

## 導入ステップ

### 1. 組織の現状分析
- 現在の開発プロセスの課題を洗い出す
- ステークホルダーの期待値を確認する
- チームのスキルレベルを評価する

### 2. パイロットプロジェクトの選定
- 小規模で影響範囲が限定的なプロジェクトを選ぶ
- 成功の可能性が高いチームを選定する
- 明確な成功基準を設定する

### 3. トレーニングと準備
- チームメンバーへのアジャイル研修を実施
- スクラムマスターやプロダクトオーナーの育成
- 必要なツールの導入（Jira、Trello等）

### 4. 段階的な導入
- スプリント期間を2週間から開始
- デイリースクラムを導入
- レトロスペクティブで継続的改善

## ベストプラクティス

- **透明性を保つ**: プロジェクトの進捗を可視化
- **継続的な改善**: 各スプリントの振り返りを重視
- **顧客との頻繁なコミュニケーション**: フィードバックループを短く

## よくある課題と対策

### 課題1: 組織の抵抗
**対策**: 段階的導入とメリットの可視化

### 課題2: スキル不足
**対策**: 継続的なトレーニングと外部コーチの活用

### 課題3: ツールの乱立
**対策**: 最小限のツールから始めて徐々に拡張

## まとめ

アジャイル開発の導入は一朝一夕には行きません。組織の文化と現状を理解し、段階的に導入することが成功の鍵となります。`,
          summary: 'アジャイル開発を組織に効果的に導入するための具体的なステップとベストプラクティス',
          categoryId: categories[0].id,
          authorId: 'pm-user-id',
          status: 'PUBLISHED',
          tags: JSON.stringify(['アジャイル', 'スクラム', 'プロジェクト管理', '導入方法']),
          keywords: 'アジャイル開発 導入 スクラム プロジェクト管理',
          estimatedReadTime: 8,
          difficulty: 'INTERMEDIATE',
          viewCount: 342,
          likeCount: 45,
          publishedAt: new Date('2024-01-15')
        }
      }),

      // テクノロジー
      knowledgeDb.article.create({
        data: {
          title: 'Next.js 14でのパフォーマンス最適化テクニック',
          content: `# Next.js 14でのパフォーマンス最適化テクニック

## はじめに
Next.js 14では、パフォーマンス向上のための新機能が多数追加されました。本記事では、実践的な最適化テクニックを紹介します。

## Server Componentsの活用

### 基本概念
Server Componentsは、サーバー側でレンダリングされ、クライアントに送信されるJavaScriptの量を削減します。

\`\`\`typescript
// app/components/HeavyComponent.tsx
// これはServer Componentとして動作
export default async function HeavyComponent() {
  const data = await fetchHeavyData()
  return <div>{/* レンダリング */}</div>
}
\`\`\`

## 画像最適化

### next/imageの活用
\`\`\`typescript
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL={blurDataUrl}
    />
  )
}
\`\`\`

## バンドルサイズの削減

### 動的インポート
\`\`\`typescript
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false
})
\`\`\`

## キャッシング戦略

### ISRの活用
\`\`\`typescript
export const revalidate = 3600 // 1時間ごとに再検証
\`\`\`

## パフォーマンス測定

Core Web Vitalsを定期的に測定し、改善の効果を確認することが重要です。

## まとめ
Next.js 14の新機能を活用することで、大幅なパフォーマンス改善が可能です。`,
          summary: 'Next.js 14の新機能を活用したWebアプリケーションのパフォーマンス最適化手法',
          categoryId: categories[1].id,
          authorId: 'consultant-user-id',
          status: 'PUBLISHED',
          tags: JSON.stringify(['Next.js', 'React', 'パフォーマンス', '最適化']),
          keywords: 'Next.js 14 パフォーマンス 最適化 Server Components',
          estimatedReadTime: 10,
          difficulty: 'ADVANCED',
          viewCount: 567,
          likeCount: 89,
          publishedAt: new Date('2024-02-10')
        }
      }),

      // ビジネス戦略
      knowledgeDb.article.create({
        data: {
          title: 'DX推進における組織変革の進め方',
          content: `# DX推進における組織変革の進め方

## DXとは何か

デジタルトランスフォーメーション（DX）は、デジタル技術を活用してビジネスモデルや組織文化を変革することです。

## 組織変革のフレームワーク

### 1. ビジョンの策定
- 明確なゴール設定
- ステークホルダーの巻き込み
- 成功指標の定義

### 2. 現状分析
- デジタル成熟度の評価
- ギャップ分析
- リソースの棚卸し

### 3. ロードマップの作成
- 短期・中期・長期の目標設定
- クイックウィンの特定
- マイルストーンの設定

### 4. 組織体制の構築
- DX推進チームの組成
- 権限と責任の明確化
- 部門横断的な協力体制

## 成功のポイント

1. **経営層のコミットメント**
2. **従業員の意識改革**
3. **失敗を許容する文化**
4. **継続的な学習**

## まとめ

DX推進は技術導入だけでなく、組織全体の変革が必要です。`,
          summary: 'DX推進を成功に導くための組織変革の進め方とポイント',
          categoryId: categories[2].id,
          authorId: 'exec-user-id',
          status: 'PUBLISHED',
          tags: JSON.stringify(['DX', '組織変革', 'デジタル化', '戦略']),
          keywords: 'DX デジタルトランスフォーメーション 組織変革 推進',
          estimatedReadTime: 6,
          difficulty: 'INTERMEDIATE',
          viewCount: 892,
          likeCount: 156,
          publishedAt: new Date('2024-01-20')
        }
      }),

      // コミュニケーション
      knowledgeDb.article.create({
        data: {
          title: '効果的なステークホルダー管理の実践',
          content: `# 効果的なステークホルダー管理の実践

## ステークホルダー管理の重要性

プロジェクト成功の鍵は、ステークホルダーとの良好な関係構築にあります。

## ステークホルダー分析

### ステークホルダーマッピング
1. **特定**: 全てのステークホルダーをリストアップ
2. **分類**: 影響力と関心度でマトリクス化
3. **優先順位付け**: リソース配分の最適化

## コミュニケーション戦略

### 1. 定期的な情報共有
- 週次レポート
- 月次ステアリングコミッティ
- 四半期レビュー

### 2. チャネルの最適化
- メール: 正式な連絡
- Slack: 日常的なやり取り
- 対面会議: 重要な意思決定

### 3. フィードバックループ
- 積極的な意見収集
- 迅速な対応
- 改善の可視化

## 期待値管理

### 期待値の調整
- 現実的な目標設定
- リスクの事前共有
- 成果の定期的な確認

## まとめ

ステークホルダー管理は継続的なプロセスです。`,
          summary: 'プロジェクト成功に欠かせないステークホルダー管理の実践的手法',
          categoryId: categories[3].id,
          authorId: 'pm-user-id',
          status: 'PUBLISHED',
          tags: JSON.stringify(['ステークホルダー', 'コミュニケーション', 'プロジェクト管理']),
          keywords: 'ステークホルダー管理 コミュニケーション 期待値調整',
          estimatedReadTime: 5,
          difficulty: 'BEGINNER',
          viewCount: 445,
          likeCount: 72,
          publishedAt: new Date('2024-02-05')
        }
      }),

      // ベストプラクティス
      knowledgeDb.article.create({
        data: {
          title: 'リモートワーク環境でのチーム生産性向上',
          content: `# リモートワーク環境でのチーム生産性向上

## はじめに

リモートワークが一般化した今、チームの生産性を維持・向上させる方法を解説します。

## コミュニケーションの最適化

### 非同期コミュニケーションの活用
- ドキュメント化の徹底
- 録画ミーティングの活用
- タイムゾーンを考慮した連携

### ツールの統一
- Notion: ナレッジ管理
- Slack: チャット
- Zoom: ビデオ会議
- Miro: コラボレーション

## ワークライフバランス

### 境界線の設定
- 勤務時間の明確化
- プライベート空間の確保
- 通知の管理

## チームビルディング

### バーチャル交流
- オンラインランチ
- バーチャルコーヒーブレイク
- チームゲーム

## 生産性の測定

### KPIの設定
- アウトプット重視
- 品質指標の導入
- 定期的なフィードバック

## まとめ

リモートワーク環境でも、適切な仕組みとツールで生産性は向上できます。`,
          summary: 'リモートワーク環境でチームの生産性を向上させる実践的な方法',
          categoryId: categories[4].id,
          authorId: 'consultant-user-id',
          status: 'PUBLISHED',
          tags: JSON.stringify(['リモートワーク', '生産性', 'チーム管理', 'ベストプラクティス']),
          keywords: 'リモートワーク 生産性 チーム管理 コミュニケーション',
          estimatedReadTime: 7,
          difficulty: 'INTERMEDIATE',
          viewCount: 678,
          likeCount: 134,
          publishedAt: new Date('2024-02-15')
        }
      })
    ])

    console.log(`✅ Created ${articles.length} articles`)

    // テンプレートを作成
    const templates = await Promise.all([
      knowledgeDb.template.create({
        data: {
          name: 'プロジェクト提案書テンプレート',
          description: '新規プロジェクト提案時に使用する標準テンプレート',
          content: `# プロジェクト提案書

## 1. エグゼクティブサマリー
[プロジェクトの概要を簡潔に記載]

## 2. 背景と課題
### 2.1 現状分析
[現在の状況と課題を記載]

### 2.2 解決すべき課題
[具体的な課題をリスト化]

## 3. 提案内容
### 3.1 ソリューション概要
[提案するソリューションの概要]

### 3.2 期待効果
[定量的・定性的効果を記載]

## 4. 実施計画
### 4.1 スケジュール
[マイルストーンとタイムライン]

### 4.2 体制
[プロジェクト体制図]

## 5. 予算
[概算費用と内訳]

## 6. リスクと対策
[想定されるリスクと mitigation plan]`,
          categoryId: categories[0].id,
          authorId: 'pm-user-id',
          type: 'PROPOSAL',
          tags: JSON.stringify(['提案書', 'テンプレート', 'プロジェクト']),
          variables: JSON.stringify({
            projectName: '',
            clientName: '',
            budget: '',
            duration: ''
          }),
          useCount: 23
        }
      }),
      knowledgeDb.template.create({
        data: {
          name: '週次レポートテンプレート',
          description: 'クライアント向け週次進捗レポート',
          content: `# 週次進捗レポート

**プロジェクト名**: [プロジェクト名]
**期間**: [開始日] - [終了日]
**報告者**: [報告者名]

## 今週の成果
- [成果1]
- [成果2]
- [成果3]

## 進捗状況
| タスク | 計画 | 実績 | 進捗率 |
|--------|------|------|--------|
| [タスク1] | [計画] | [実績] | [%] |

## 課題とリスク
| 項目 | 内容 | 対応策 | 期限 |
|------|------|--------|------|
| [課題1] | [内容] | [対策] | [期限] |

## 来週の予定
- [予定1]
- [予定2]
- [予定3]

## 依頼事項
- [依頼事項がある場合に記載]`,
          categoryId: categories[3].id,
          authorId: 'consultant-user-id',
          type: 'REPORT',
          tags: JSON.stringify(['レポート', '週次', 'テンプレート']),
          useCount: 45
        }
      })
    ])

    console.log(`✅ Created ${templates.length} templates`)

    // FAQを作成
    const faqs = await Promise.all([
      knowledgeDb.fAQ.create({
        data: {
          question: 'アジャイル開発とウォーターフォール開発の使い分けは？',
          answer: `アジャイル開発とウォーターフォール開発の選択は、プロジェクトの特性によって決まります。

**アジャイル開発が適している場合**:
- 要件が不明確または変更が多い
- 早期にフィードバックを得たい
- 小規模〜中規模のプロジェクト
- イノベーティブな製品開発

**ウォーターフォール開発が適している場合**:
- 要件が明確で変更が少ない
- 規制やコンプライアンスが厳しい
- 大規模な基幹システム開発
- 予算と期限が固定されている

多くの場合、ハイブリッドアプローチも検討する価値があります。`,
          categoryId: categories[0].id,
          authorId: 'pm-user-id',
          viewCount: 234,
          helpfulCount: 189
        }
      }),
      knowledgeDb.fAQ.create({
        data: {
          question: 'リモートワークでのセキュリティ対策は？',
          answer: `リモートワーク環境でのセキュリティ対策として、以下を推奨します：

1. **VPN の使用**: 社内ネットワークへの安全な接続
2. **2要素認証**: すべてのアカウントで有効化
3. **エンドポイント保護**: ウイルス対策ソフトの導入
4. **データ暗号化**: 重要データの暗号化
5. **定期的なバックアップ**: クラウドストレージの活用
6. **セキュリティ研修**: 従業員の意識向上`,
          categoryId: categories[1].id,
          authorId: 'consultant-user-id',
          viewCount: 456,
          helpfulCount: 402
        }
      })
    ])

    console.log(`✅ Created ${faqs.length} FAQs`)

    // エキスパート情報を作成
    const experts = await Promise.all([
      knowledgeDb.expert.create({
        data: {
          userId: 'exec-user-id',
          bio: '経営戦略とDX推進のスペシャリスト。15年以上のコンサルティング経験を持ち、Fortune 500企業の変革を多数支援。',
          specialties: JSON.stringify(['経営戦略', 'DX推進', '組織変革', 'M&A']),
          certifications: JSON.stringify(['PMP', 'TOGAF', 'MBA']),
          experience: '大手コンサルティングファームでパートナーとして10年、独立後5年',
          contactInfo: JSON.stringify({
            email: 'expert@example.com',
            availability: '月・水・金の午後'
          }),
          rating: 4.8,
          reviewCount: 24
        }
      }),
      knowledgeDb.expert.create({
        data: {
          userId: 'pm-user-id',
          bio: 'アジャイル開発とプロジェクト管理のエキスパート。CSMおよびPMP認定保持者。',
          specialties: JSON.stringify(['アジャイル', 'スクラム', 'プロジェクト管理', 'チーム育成']),
          certifications: JSON.stringify(['CSM', 'PMP', 'SAFe']),
          experience: '10年以上のプロジェクト管理経験、50以上のプロジェクトを成功に導く',
          rating: 4.6,
          reviewCount: 18
        }
      })
    ])

    console.log(`✅ Created ${experts.length} experts`)

    console.log('✅ Knowledge service seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding knowledge service:', error)
    throw error
  } finally {
    await knowledgeDb.$disconnect()
  }
}

seed()
  .catch((error) => {
    console.error('Failed to seed knowledge service:', error)
    process.exit(1)
  })