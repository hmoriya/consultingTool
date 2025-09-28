import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// 各サービスのMD形式定義
export const serviceDefinitions = [
  {
    name: 'secure-access',
    displayName: 'セキュアアクセスサービス',
    description: 'ユーザー認証、組織管理、アクセス制御を担当するサービス',
    serviceDescription: `# セキュアアクセスサービス

## サービス概要
システムへのセキュアなアクセスを提供し、組織とユーザーの基本情報を管理する

## 提供価値
- **セキュリティ**: 安全な認証・認可機能
- **統制**: 組織全体のアクセス制御
- **効率**: シングルサインオン対応

## 主要機能
- ユーザー認証（ログイン/ログアウト）
- パスワード管理
- ロールベースアクセス制御
- 組織・ユーザー情報管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: 認証ドメイン

## 主要エンティティ

### 組織 [Organization] [ORGANIZATION]
コンサルティングファームまたはクライアント企業

### ユーザー [User] [USER]
システムを利用する人物

### ロール [Role] [ROLE]
ユーザーの役割と権限

## ドメインルール
- 1ユーザーは1つの組織に所属
- 1ユーザーは複数のロールを持てる
- パスワードは暗号化して保存`
  },
  
  {
    name: 'project-success-support',
    displayName: 'プロジェクト成功支援サービス',
    description: 'プロジェクトのライフサイクル全体を管理するサービス',
    serviceDescription: `# プロジェクト成功支援サービス

## サービス概要
コンサルティングプロジェクトの計画から完了までを一元管理

## 提供価値
- **可視性**: プロジェクト状況のリアルタイム把握
- **効率**: タスク・成果物の体系的管理
- **品質**: マイルストーン管理による進捗統制

## 主要機能
- プロジェクト計画・実行管理
- タスク管理
- マイルストーン管理
- 成果物管理
- プロジェクトメンバー管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: プロジェクトドメイン

## 主要エンティティ

### プロジェクト [Project] [PROJECT]
クライアントの課題解決のための活動単位

### タスク [Task] [TASK]
プロジェクトを構成する作業単位

### マイルストーン [Milestone] [MILESTONE]
プロジェクトの重要な節目

### 成果物 [Deliverable] [DELIVERABLE]
プロジェクトで作成される具体的な成果

## ドメインルール
- プロジェクトには1名以上のPMが必要
- タスクは必ずプロジェクトに紐づく
- 成果物はマイルストーンに関連付け`
  },
  
  {
    name: 'talent-optimization',
    displayName: 'タレント最適化サービス',
    description: 'チーム編成、スキル管理、リソース配分を担当するサービス',
    serviceDescription: `# タレント最適化サービス

## サービス概要
人材のスキルと配置を最適化し、組織の生産性を最大化

## 提供価値
- **最適化**: スキルマッチングによる適材適所
- **透明性**: リソース稼働状況の可視化
- **成長**: スキル開発の促進

## 主要機能
- チーム管理
- スキル管理
- リソース配分計画
- 稼働率管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: リソースドメイン

## 主要エンティティ

### チーム [Team] [TEAM]
組織内の業務単位

### スキル [Skill] [SKILL]
業務遂行に必要な能力

### リソース配分 [ResourceAllocation] [RESOURCE_ALLOCATION]
人材のプロジェクトへの割当

## ドメインルール
- リソースの合計稼働率は100%を超えない
- スキルレベルは1-5の5段階
- チームは階層構造を持てる`
  },
  
  {
    name: 'productivity-visualization',
    displayName: '生産性可視化サービス',
    description: '工数入力、承認、集計を担当するサービス',
    serviceDescription: `# 生産性可視化サービス

## サービス概要
コンサルタントの作業時間を正確に記録・管理し、プロジェクト収益性を分析

## 提供価値
- **正確性**: 日次の詳細な工数記録
- **効率**: 承認フローの自動化
- **分析**: プロジェクト収益性の可視化

## 主要機能
- 工数入力
- 承認フロー
- 工数集計・分析
- 請求可能時間の管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: 工数ドメイン

## 主要エンティティ

### 工数エントリ [TimeEntry] [TIME_ENTRY]
日次の作業時間記録

### 承認ワークフロー [ApprovalWorkflow] [APPROVAL_WORKFLOW]
工数承認のプロセス

## ドメインルール
- 1日の工数は0-24時間
- 承認されていない工数は請求不可
- 月次で工数を締める`
  },
  
  {
    name: 'collaboration-facilitation',
    displayName: 'コラボレーション促進サービス',
    description: 'システム通知、メッセージング、チャンネル管理を担当するサービス',
    serviceDescription: `# コラボレーション促進サービス

## サービス概要
リアルタイムな情報共有とコミュニケーションを実現

## 提供価値
- **即時性**: リアルタイム通知
- **文脈**: プロジェクト単位のコミュニケーション
- **透明性**: 情報の一元管理

## 主要機能
- システム通知
- チャンネル管理
- メッセージング
- 通知設定管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: 通知ドメイン

## 主要エンティティ

### 通知 [Notification] [NOTIFICATION]
システムからのお知らせ

### チャンネル [Channel] [CHANNEL]
コミュニケーションの場

### メッセージ [Message] [MESSAGE]
チャンネル内の発言

## ドメインルール
- 通知は既読/未読を管理
- チャンネルはプロジェクト単位または全体
- メッセージは編集・削除可能`
  },
  
  {
    name: 'knowledge-cocreation',
    displayName: 'ナレッジ共創サービス',
    description: 'ナレッジ記事、テンプレート、FAQの管理を担当するサービス',
    serviceDescription: `# ナレッジ共創サービス

## サービス概要
プロジェクトで得られた知識を体系化し、組織の知的資産として蓄積

## 提供価値
- **再利用**: 過去の知見の活用
- **標準化**: ベストプラクティスの共有
- **効率化**: テンプレートによる作業削減

## 主要機能
- ナレッジ記事管理
- テンプレート管理
- FAQ管理
- エキスパート情報管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: ナレッジドメイン

## 主要エンティティ

### ナレッジ記事 [Article] [ARTICLE]
知識やノウハウを記録した記事

### テンプレート [Template] [TEMPLATE]
再利用可能なドキュメント

### FAQ [FAQ] [FAQ]
よくある質問と回答

## ドメインルール
- 記事は公開前にレビュー必須
- カテゴリは階層構造
- 記事には評価とコメントが可能`
  },
  
  {
    name: 'revenue-optimization',
    displayName: '収益最適化サービス',
    description: '収益、コスト、請求の管理を担当するサービス',
    serviceDescription: `# 収益最適化サービス

## サービス概要
プロジェクトの収益性を管理し、財務健全性を維持

## 提供価値
- **可視性**: リアルタイムな収益状況
- **予測**: 財務予測と分析
- **統制**: コスト管理

## 主要機能
- 収益管理
- コスト管理
- 請求管理
- 予算管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: 財務ドメイン

## 主要エンティティ

### 収益 [Revenue] [REVENUE]
プロジェクトからの収入

### コスト [Cost] [COST]
プロジェクトの支出

### 請求 [Invoice] [INVOICE]
クライアントへの請求

## ドメインルール
- 収益は発生主義で計上
- コストは実績ベースで管理
- 請求は月次または成果物単位`
  }
]

// サービス定義の作成
export async function createServices() {
  console.log('  Creating service definitions...')
  
  const services = []
  for (const serviceDef of serviceDefinitions) {
    const service = await parasolDb.service.create({
      data: {
        name: serviceDef.name,
        displayName: serviceDef.displayName,
        description: serviceDef.description,
        serviceDescription: serviceDef.serviceDescription,
        domainLanguageDefinition: serviceDef.domainLanguageDefinition,
        apiSpecificationDefinition: '# API仕様\n\n実装時に定義',
        databaseDesignDefinition: '# DB設計\n\n既存スキーマ参照',
        // 旧形式（後方互換性のため）
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    services.push(service)
  }
  
  console.log(`  Created ${services.length} services`)
  return services
}