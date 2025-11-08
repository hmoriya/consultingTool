import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedBuildAndEmpowerTeams(service: unknown, capability: unknown) {
  console.log('    Creating business operation: チームを編成・強化する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'BuildAndEmpowerTeams',
      displayName: 'チームを編成・強化する',
      design: `# ビジネスオペレーション: チームを編成・強化する [BuildAndEmpowerTeams] [BUILD_AND_EMPOWER_TEAMS]

## オペレーション概要

### 目的
プロジェクトチームの編成から解散まで、チームメンバーの能力を最大限に引き出し、高いパフォーマンスを発揮できるチーム環境を構築・維持することで、プロジェクト成功と人材成長を実現する

### ビジネス価値
- **生産性向上**: チーム生産性40%向上、コラボレーション効率35%改善、意思決定速度50%向上
- **品質向上**: 成果物品質30%向上、手戻り60%削減、ベストプラクティス共有率80%達成
- **エンゲージメント向上**: チーム満足度85%達成、離職率50%減少、成長実感度40%向上

### 実行頻度
- **頻度**: チーム編成時、週次（チーム会議）、月次（パフォーマンスレビュー）
- **トリガー**: プロジェクト開始、メンバー変更、課題発生、フェーズ移行
- **所要時間**: チーム編成（1週間）、定例管理（週2-3時間）

## ロールと責任

### 関与者
- チームリーダー [TeamLeader] [TEAM_LEADER]
  - 責任: チーム運営全体、パフォーマンス管理、メンバー育成
  - 権限: チーム編成提案、役割分担決定、評価実施

- チームメンバー [TeamMember] [TEAM_MEMBER]
  - 責任: 役割遂行、協働、知識共有、自己管理
  - 権限: 改善提案、ピアサポート、学習機会活用

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: チーム目標設定、リソース確保、障害除去
  - 権限: チーム編成承認、予算配分、エスカレーション対応

- HR担当者 [HRRepresentative] [HR_REPRESENTATIVE]
  - 責任: 人材開発支援、組織ポリシー適用、キャリア相談
  - 権限: 研修提供、評価制度運用、異動調整

### RACI マトリクス
| ステップ | TL | メンバー | PM | HR |
|---------|----|---------|----|-----|
| チーム編成 | R | C | A | C |
| 役割定義 | R | C | C | I |
| 環境構築 | R | C | A | I |
| 日常運営 | R | R | I | I |
| パフォーマンス管理 | R | C | C | C |
| 成長支援 | R | R | C | C |
| 評価実施 | R | C | A | C |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：チーム管理サイクル]
  ↓
[ステップ1：チーム編成]
  ↓
[ステップ2：役割・責任定義]
  ↓
[ステップ3：チーム環境構築]
  ↓
[ステップ4：キックオフ実施]
  ↓
[ループ：運営期間中]
  ├─[ステップ5：日常チーム運営]
  ├─[ステップ6：パフォーマンス管理]
  └─[ステップ7：メンバー成長支援]
  ↓
[終了：チーム解散・振り返り]
\`\`\`

### 各ステップの詳細

#### ステップ1: チーム編成 [FormTeam] [FORM_TEAM]
- **目的**: プロジェクト要件に最適なチーム構成を設計・実現
- **入力**: プロジェクト要件、利用可能人材、スキルマトリクス
- **活動**:
  1. 必要な役割とスキルセットの定義
  2. チーム規模と構成の決定（5-9名が理想）
  3. メンバー候補の選定とスキル評価
  4. 個人の志向性と成長機会の考慮
  5. チームダイナミクスの予測（性格タイプ考慮）
  6. 最終メンバーの確定と通知
- **出力**: チーム編成表、メンバープロファイル
- **所要時間**: 3-5日

#### ステップ2: 役割・責任定義 [DefineRolesResponsibilities] [DEFINE_ROLES_RESPONSIBILITIES]
- **目的**: 各メンバーの役割と責任範囲を明確化し合意形成
- **入力**: チーム編成表、プロジェクト計画、職務記述
- **活動**:
  1. プロジェクト内での各役割の定義
  2. 責任範囲と権限の明確化
  3. 役割間のインターフェース定義
  4. 意思決定権限の設定
  5. エスカレーションパスの確立
  6. RACI チャートの作成と合意
- **出力**: 役割定義書、RACI チャート、権限マトリクス
- **所要時間**: 2日

#### ステップ3: チーム環境構築 [SetupTeamEnvironment] [SETUP_TEAM_ENVIRONMENT]
- **目的**: 効果的な協働を支える物理的・仮想的環境を整備
- **入力**: チーム要件、IT環境要件、予算
- **活動**:
  1. 作業スペースの確保と配置
  2. コラボレーションツールの導入・設定
  3. 情報共有プラットフォームの構築
  4. 開発・テスト環境の準備
  5. コミュニケーションルールの設定
  6. チーム規約・行動指針の策定
- **出力**: 作業環境、ツール環境、チーム規約
- **所要時間**: 3-4日

#### ステップ4: キックオフ実施 [ConductKickoff] [CONDUCT_KICKOFF]
- **目的**: チーム全体で目標・価値観を共有し一体感を醸成
- **入力**: プロジェクト計画、チーム編成、役割定義
- **活動**:
  1. プロジェクトビジョン・目標の共有
  2. 各メンバーの自己紹介と強み共有
  3. チームビルディング活動の実施
  4. 作業方法・ツールの説明
  5. 初期スケジュールの確認
  6. 質疑応答とコミットメント確認
- **出力**: キックオフ議事録、チーム憲章、コミットメント
- **所要時間**: 1日

#### ステップ5: 日常チーム運営 [ManageDailyOperations] [MANAGE_DAILY_OPERATIONS]
- **目的**: 日々の活動を円滑に進め、課題を早期発見・解決
- **入力**: タスク計画、前日の進捗、課題リスト
- **活動**:
  1. デイリースタンドアップの実施
  2. タスク進捗の確認と調整
  3. 障害・ブロッカーの特定と除去
  4. ペアワーク・モブワークの推進
  5. 知識共有セッションの開催
  6. チーム雰囲気の観察と改善
- **出力**: 進捗報告、課題解決、知識共有記録
- **所要時間**: 日次30分＋随時対応

#### ステップ6: パフォーマンス管理 [ManagePerformance] [MANAGE_PERFORMANCE]
- **目的**: チームと個人のパフォーマンスを可視化し継続的改善
- **入力**: 成果指標、進捗データ、品質メトリクス
- **活動**:
  1. チームベロシティの測定と分析
  2. 品質指標のモニタリング
  3. 個人パフォーマンスの評価
  4. 改善機会の特定
  5. 振り返り会（レトロスペクティブ）の実施
  6. 改善アクションの計画と実行
- **出力**: パフォーマンスレポート、改善計画、アクションリスト
- **所要時間**: 週次2時間、月次4時間

#### ステップ7: メンバー成長支援 [SupportMemberGrowth] [SUPPORT_MEMBER_GROWTH]
- **目的**: 各メンバーの能力開発とキャリア成長を支援
- **入力**: スキル評価、キャリア目標、学習機会
- **活動**:
  1. 1on1ミーティングの実施
  2. スキルギャップの特定と対策
  3. ストレッチ課題の提供
  4. メンタリング・コーチングの実施
  5. 外部研修・カンファレンス参加支援
  6. キャリアパス相談と機会提供
- **出力**: 成長計画、スキル向上記録、キャリア開発プラン
- **所要時間**: 週次1時間/人

## 状態遷移

### 状態定義
- 編成前 [PreFormation] [PRE_FORMATION]: チーム編成の必要性は認識
- 編成中 [Forming] [FORMING]: メンバー選定とチーム構築中
- 立ち上げ [Storming] [STORMING]: 役割調整と関係構築中
- 規範形成 [Norming] [NORMING]: チーム文化と作業方法確立中
- 機能発揮 [Performing] [PERFORMING]: 高パフォーマンス発揮中
- 変革中 [Transforming] [TRANSFORMING]: 大きな変更に対応中
- 解散準備 [Adjourning] [ADJOURNING]: プロジェクト終了に向けた準備
- 解散済み [Disbanded] [DISBANDED]: チーム活動終了

### 遷移条件
\`\`\`
編成前 --[プロジェクト開始]--> 編成中
編成中 --[メンバー確定]--> 立ち上げ
立ち上げ --[初期衝突解決]--> 規範形成
規範形成 --[ルール確立]--> 機能発揮
機能発揮 --[大幅変更発生]--> 変革中
変革中 --[適応完了]--> 機能発揮
機能発揮 --[プロジェクト終了間近]--> 解散準備
解散準備 --[活動終了]--> 解散済み
\`\`\`

## ビジネスルール

### 事前条件
1. プロジェクトの目標と範囲が明確である
2. 必要な人材プールが存在する
3. チーム運営の権限が付与されている
4. 必要な予算とリソースが確保されている

### 実行中の制約
1. チーム規模は5-9名を推奨（コミュニケーションパス最適化）
2. 定期的な1on1は最低月1回実施
3. 心理的安全性を最優先で確保
4. 多様性とインクルージョンを推進
5. 残業時間は月40時間を上限とする

### 事後条件
1. プロジェクト成果物が完成している
2. チームの知見がナレッジベースに蓄積されている
3. メンバーのスキルが向上している
4. 次プロジェクトへの推奨事項がまとめられている
5. メンバーの次のアサインが決定している

## パラソルドメインモデル

### エンティティ定義
- チーム [Team] [TEAM]
  - チームID、名称、プロジェクトID、リーダーID、開始日、終了日、状態
- チームメンバー [TeamMember] [TEAM_MEMBER]
  - メンバーID、チームID、ユーザーID、役割、参加日、退出日
- チーム活動 [TeamActivity] [TEAM_ACTIVITY]
  - 活動ID、チームID、種別、内容、実施日、参加者、成果
- パフォーマンス記録 [PerformanceRecord] [PERFORMANCE_RECORD]
  - 記録ID、チームID、測定日、指標、値、評価

### 値オブジェクト
- チーム規模 [TeamSize] [TEAM_SIZE]
  - 小規模（2-4名）、標準（5-9名）、大規模（10名以上）
- チーム成熟度 [TeamMaturity] [TEAM_MATURITY]
  - 形成期、混乱期、統一期、機能期、散会期

## KPI

1. **チーム生産性**: ベロシティの推移と目標達成率
   - 目標値: 計画比100%以上
   - 測定方法: (完了ストーリーポイント / 計画ストーリーポイント) × 100
   - 測定頻度: スプリント毎

2. **チーム満足度**: メンバーの満足度スコア
   - 目標値: 4.0/5.0以上
   - 測定方法: 定期サーベイの平均スコア
   - 測定頻度: 月次

3. **コラボレーション指数**: チーム協働の効果性
   - 目標値: 80%以上
   - 測定方法: ペア/モブ作業時間の割合、知識共有回数
   - 測定頻度: 週次

4. **成長実現率**: メンバーのスキル向上度
   - 目標値: 全メンバーが四半期に1つ以上新スキル習得
   - 測定方法: スキル評価の向上数
   - 測定頻度: 四半期

5. **心理的安全性スコア**: チームの心理的安全性レベル
   - 目標値: 4.2/5.0以上
   - 測定方法: 専用アセスメントツールでの測定
   - 測定頻度: 月次`,
      pattern: 'TeamManagement',
      goal: 'チームメンバーの能力を最大限に引き出し、高パフォーマンスなチーム環境を構築・維持する',
      roles: JSON.stringify([
        { name: 'TeamLeader', displayName: 'チームリーダー', systemName: 'TEAM_LEADER' },
        { name: 'TeamMember', displayName: 'チームメンバー', systemName: 'TEAM_MEMBER' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'HRRepresentative', displayName: 'HR担当者', systemName: 'HR_REPRESENTATIVE' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'FormTeam', displayName: 'チーム編成', systemName: 'FORM_TEAM' },
          { name: 'DefineRolesResponsibilities', displayName: '役割・責任定義', systemName: 'DEFINE_ROLES_RESPONSIBILITIES' },
          { name: 'SetupTeamEnvironment', displayName: 'チーム環境構築', systemName: 'SETUP_TEAM_ENVIRONMENT' },
          { name: 'ConductKickoff', displayName: 'キックオフ実施', systemName: 'CONDUCT_KICKOFF' },
          { name: 'ManageDailyOperations', displayName: '日常チーム運営', systemName: 'MANAGE_DAILY_OPERATIONS' },
          { name: 'ManagePerformance', displayName: 'パフォーマンス管理', systemName: 'MANAGE_PERFORMANCE' },
          { name: 'SupportMemberGrowth', displayName: 'メンバー成長支援', systemName: 'SUPPORT_MEMBER_GROWTH' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'PreFormation', displayName: '編成前', systemName: 'PRE_FORMATION' },
        { name: 'Forming', displayName: '編成中', systemName: 'FORMING' },
        { name: 'Storming', displayName: '立ち上げ', systemName: 'STORMING' },
        { name: 'Norming', displayName: '規範形成', systemName: 'NORMING' },
        { name: 'Performing', displayName: '機能発揮', systemName: 'PERFORMING' },
        { name: 'Transforming', displayName: '変革中', systemName: 'TRANSFORMING' },
        { name: 'Adjourning', displayName: '解散準備', systemName: 'ADJOURNING' },
        { name: 'Disbanded', displayName: '解散済み', systemName: 'DISBANDED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}