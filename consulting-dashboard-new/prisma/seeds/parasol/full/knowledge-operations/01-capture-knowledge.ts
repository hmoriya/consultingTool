import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedCaptureKnowledge(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 知識を収集・整理する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'CaptureKnowledge',
      displayName: '知識を収集・整理する',
      design: `# ビジネスオペレーション: 知識を収集・整理する [CaptureKnowledge] [CAPTURE_KNOWLEDGE]

## オペレーション概要

### 目的
プロジェクトやコンサルタントの経験から得られた貴重な知識・ノウハウを体系的に収集し、再利用可能な形で整理・構造化することで、組織の知的資産を増大させる

### ビジネス価値
- **効率性向上**: 類似案件の立ち上げ時間50%短縮、成果物作成時間40%削減
- **品質向上**: ベストプラクティス活用により成果物品質30%向上、手戻り70%削減
- **競争力強化**: 独自ナレッジの蓄積により提案勝率20%向上、差別化要素の増加

### 実行頻度
- **頻度**: プロジェクト完了時（必須）、マイルストーン達成時、随時（気づき発生時）
- **トリガー**: プロジェクト完了、重要な学び・発見、顧客からの評価、失敗からの教訓
- **所要時間**: 基本記録30分、詳細整理2-4時間、体系化1-2日

## ロールと責任

### 関与者
- コンサルタント [Consultant] [CONSULTANT]
  - 責任: 実践知識の記録、具体的事例の提供、暗黙知の形式化
  - 権限: ナレッジ投稿、タグ付け、コメント追加

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: プロジェクト知識の総括、教訓の抽出、品質確認
  - 権限: ナレッジ承認、カテゴリ設定、公開範囲決定

- ナレッジマネージャー [KnowledgeManager] [KNOWLEDGE_MANAGER]
  - 責任: 知識体系の設計、品質管理、活用促進
  - 権限: 体系化、編集、アーカイブ、推奨設定

- サブジェクトマターエキスパート [SubjectMatterExpert] [SUBJECT_MATTER_EXPERT]
  - 責任: 専門知識の提供、内容検証、高度化支援
  - 権限: 専門性認定、内容修正提案

### RACI マトリクス
| ステップ | コンサルタント | PM | KM | SME |
|---------|---------------|-----|-----|-----|
| 知識の特定 | R | C | I | I |
| 内容記録 | R | A | C | C |
| 構造化 | C | C | R | C |
| 品質確認 | I | R | A | C |
| 公開承認 | I | C | R | I |
| 活用促進 | C | C | R | A |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始:知識収集トリガー]
  ↓
[ステップ1:知識の特定]
  ↓
[ステップ2:内容の記録]
  ↓
[ステップ3:メタデータ付与]
  ↓
[ステップ4:構造化・整理]
  ↓
[ステップ5:品質確認]
  ↓
[判断:承認基準満足？]
  ├─ Yes → [ステップ6:公開・共有]
  └─ No  → [修正要請] → [ステップ2へ]
  ↓
[ステップ7:活用モニタリング]
  ↓
[終了:知識資産化完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: 知識の特定 [IdentifyKnowledge] [IDENTIFY_KNOWLEDGE]
- **目的**: 記録・共有すべき価値ある知識を識別
- **入力**: プロジェクト成果、経験、顧客フィードバック
- **活動**:
  1. プロジェクトでの成功要因・失敗要因の振り返り
  2. 独自の工夫やアプローチの抽出
  3. 汎用性・再現性の評価
  4. 既存ナレッジとの差分確認
  5. 記録優先度の判定
  6. 知識タイプの分類（方法論、事例、ツール等）
- **出力**: 記録対象知識リスト、優先順位
- **所要時間**: 30分-1時間

#### ステップ2: 内容の記録 [RecordContent] [RECORD_CONTENT]
- **目的**: 知識を明確かつ理解可能な形で文書化
- **入力**: 記録対象知識、関連資料、記憶・経験
- **活動**:
  1. 背景・コンテキストの記述
  2. 具体的な内容の詳細記載
  3. 実例・事例の追加（匿名化考慮）
  4. 図表・フローチャートの作成
  5. 重要ポイントの強調
  6. 制約事項・前提条件の明記
- **出力**: ナレッジドキュメント（初稿）
- **所要時間**: 1-3時間

#### ステップ3: メタデータ付与 [AddMetadata] [ADD_METADATA]
- **目的**: 検索性と発見性を高めるための属性情報付加
- **入力**: ナレッジドキュメント、分類体系
- **活動**:
  1. カテゴリ・サブカテゴリの選択
  2. タグの付与（業界、技術、手法等）
  3. 関連プロジェクト・顧客情報の紐付け
  4. 難易度・成熟度レベルの設定
  5. 想定利用者・利用シーンの定義
  6. キーワードの抽出・登録
- **出力**: メタデータ付きナレッジ
- **所要時間**: 30分

#### ステップ4: 構造化・整理 [StructureAndOrganize] [STRUCTURE_AND_ORGANIZE]
- **目的**: 知識を体系的に整理し関連性を明確化
- **入力**: メタデータ付きナレッジ、既存知識体系
- **活動**:
  1. 知識体系での位置づけ確認
  2. 関連ナレッジとのリンク設定
  3. 階層構造への組み込み
  4. テンプレート・フレームワーク化検討
  5. バージョン管理設定
  6. アクセス権限の設定
- **出力**: 構造化されたナレッジ
- **所要時間**: 1-2時間

#### ステップ5: 品質確認 [QualityAssurance] [QUALITY_ASSURANCE]
- **目的**: ナレッジの正確性・有用性・理解可能性を保証
- **入力**: 構造化されたナレッジ、品質基準
- **活動**:
  1. 内容の正確性・完全性チェック
  2. 表現の明確性・一貫性確認
  3. 機密情報・個人情報の確認
  4. 引用・参照の妥当性検証
  5. サンプルユーザーによるレビュー
  6. 改善点のフィードバック収集
- **出力**: 品質確認済みナレッジ、改善要望
- **所要時間**: 1-2時間

#### ステップ6: 公開・共有 [PublishAndShare] [PUBLISH_AND_SHARE]
- **目的**: 承認されたナレッジを適切な範囲で公開
- **入力**: 品質確認済みナレッジ、公開設定
- **活動**:
  1. 最終承認の取得
  2. 公開範囲の確定（全社/部門/チーム）
  3. ナレッジベースへの登録
  4. 新着通知の配信
  5. 関連コミュニティへの共有
  6. 初期フィードバックの収集
- **出力**: 公開済みナレッジ、通知記録
- **所要時間**: 30分

#### ステップ7: 活用モニタリング [MonitorUsage] [MONITOR_USAGE]
- **目的**: ナレッジの活用状況を把握し改善につなげる
- **入力**: 公開済みナレッジ、アクセスログ
- **活動**:
  1. 閲覧数・ダウンロード数の追跡
  2. 活用事例の収集
  3. フィードバック・評価の分析
  4. 改善要望の収集
  5. 更新必要性の判断
  6. 活用促進施策の検討
- **出力**: 活用レポート、改善提案
- **所要時間**: 月次30分

## 状態遷移

### 状態定義
- 識別済み [Identified] [IDENTIFIED]: 記録対象として特定された
- 記録中 [Recording] [RECORDING]: 内容を文書化中
- レビュー中 [UnderReview] [UNDER_REVIEW]: 品質確認実施中
- 承認待ち [PendingApproval] [PENDING_APPROVAL]: 公開承認待機中
- 公開済み [Published] [PUBLISHED]: ナレッジベースで公開中
- 更新中 [Updating] [UPDATING]: 内容を更新中
- アーカイブ [Archived] [ARCHIVED]: 古くなり参照のみ可能

### 遷移条件
\`\`\`
識別済み --[記録開始]--> 記録中
記録中 --[記録完了]--> レビュー中
レビュー中 --[品質OK]--> 承認待ち
レビュー中 --[要修正]--> 記録中
承認待ち --[承認]--> 公開済み
承認待ち --[差し戻し]--> 記録中
公開済み --[更新開始]--> 更新中
更新中 --[更新完了]--> レビュー中
公開済み --[陳腐化]--> アーカイブ
\`\`\`

## ビジネスルール

### 事前条件
1. ナレッジ管理ポリシーが策定されている
2. 知識体系・分類が定義されている
3. ナレッジ管理システムが利用可能
4. 投稿者が必要な権限を保有

### 実行中の制約
1. 機密情報・個人情報は適切にマスキング
2. 顧客固有情報は許可なく公開不可
3. 知的財産権を侵害しない
4. 事実に基づいた正確な記述
5. 建設的で前向きな表現を使用

### 事後条件
1. ナレッジがシステムに登録されている
2. 適切なメタデータが付与されている
3. アクセス権限が正しく設定されている
4. 関連ナレッジとリンクされている
5. 活用状況が追跡可能になっている

## パラソルドメインモデル

### エンティティ定義
- ナレッジ [Knowledge] [KNOWLEDGE]
  - ナレッジID、タイトル、内容、作成者、作成日、カテゴリ、ステータス、バージョン
- ナレッジカテゴリ [KnowledgeCategory] [KNOWLEDGE_CATEGORY]
  - カテゴリID、名称、親カテゴリID、説明、並び順
- ナレッジタグ [KnowledgeTag] [KNOWLEDGE_TAG]
  - タグID、タグ名、使用回数、カテゴリ
- ナレッジ評価 [KnowledgeRating] [KNOWLEDGE_RATING]
  - 評価ID、ナレッジID、評価者ID、評価値、コメント、評価日

### 値オブジェクト
- ナレッジタイプ [KnowledgeType] [KNOWLEDGE_TYPE]
  - 方法論、事例、テンプレート、ツール、FAQ、レッスンズラーンド
- 公開範囲 [PublicationScope] [PUBLICATION_SCOPE]
  - 全社公開、部門限定、チーム限定、個人限定

## KPI

1. **ナレッジ投稿率**: プロジェクト完了時のナレッジ投稿割合
   - 目標値: 90%以上
   - 測定方法: (ナレッジ投稿プロジェクト数 / 完了プロジェクト数) × 100
   - 測定頻度: 月次

2. **ナレッジ活用率**: 投稿されたナレッジの活用度
   - 目標値: 70%以上が3ヶ月以内に活用
   - 測定方法: (活用されたナレッジ数 / 投稿ナレッジ数) × 100
   - 測定頻度: 四半期

3. **ナレッジ品質スコア**: ユーザー評価の平均値
   - 目標値: 4.0/5.0以上
   - 測定方法: 全ナレッジの評価平均
   - 測定頻度: 月次

4. **検索ヒット率**: 検索でのナレッジ発見成功率
   - 目標値: 80%以上
   - 測定方法: (有用な結果を得た検索数 / 全検索数) × 100
   - 測定頻度: 週次

5. **知識資産ROI**: ナレッジ活用による価値創出
   - 目標値: 投資の5倍以上
   - 測定方法: (削減工数×単価 + 品質向上価値) / ナレッジ管理コスト
   - 測定頻度: 年次`,
      pattern: 'KnowledgeManagement',
      goal: 'プロジェクトで得られた知識を体系的に収集・整理し、組織の知的資産として蓄積する',
      roles: JSON.stringify([
        { name: 'Consultant', displayName: 'コンサルタント', systemName: 'CONSULTANT' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'KnowledgeManager', displayName: 'ナレッジマネージャー', systemName: 'KNOWLEDGE_MANAGER' },
        { name: 'SubjectMatterExpert', displayName: 'サブジェクトマターエキスパート', systemName: 'SUBJECT_MATTER_EXPERT' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'IdentifyKnowledge', displayName: '知識の特定', systemName: 'IDENTIFY_KNOWLEDGE' },
          { name: 'RecordContent', displayName: '内容の記録', systemName: 'RECORD_CONTENT' },
          { name: 'AddMetadata', displayName: 'メタデータ付与', systemName: 'ADD_METADATA' },
          { name: 'StructureAndOrganize', displayName: '構造化・整理', systemName: 'STRUCTURE_AND_ORGANIZE' },
          { name: 'QualityAssurance', displayName: '品質確認', systemName: 'QUALITY_ASSURANCE' },
          { name: 'PublishAndShare', displayName: '公開・共有', systemName: 'PUBLISH_AND_SHARE' },
          { name: 'MonitorUsage', displayName: '活用モニタリング', systemName: 'MONITOR_USAGE' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Identified', displayName: '識別済み', systemName: 'IDENTIFIED' },
        { name: 'Recording', displayName: '記録中', systemName: 'RECORDING' },
        { name: 'UnderReview', displayName: 'レビュー中', systemName: 'UNDER_REVIEW' },
        { name: 'PendingApproval', displayName: '承認待ち', systemName: 'PENDING_APPROVAL' },
        { name: 'Published', displayName: '公開済み', systemName: 'PUBLISHED' },
        { name: 'Updating', displayName: '更新中', systemName: 'UPDATING' },
        { name: 'Archived', displayName: 'アーカイブ', systemName: 'ARCHIVED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}