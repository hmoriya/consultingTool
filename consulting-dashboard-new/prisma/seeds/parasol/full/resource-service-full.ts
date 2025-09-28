import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// リソース管理サービスの完全なパラソルデータ
export async function seedResourceServiceFullParasol() {
  console.log('  Seeding resource-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'talent-optimization' }
  })
  
  if (existingService) {
    console.log('  タレント最適化サービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'talent-optimization',
      displayName: 'タレント最適化サービス',
      description: '人材の能力を最大化し、最適なチーム編成とスキル開発を実現',

      domainLanguage: JSON.stringify({
        entities: [
          {
            name: 'メンバー [Member] [MEMBER]',
            attributes: [
              { name: 'ID [id] [MEMBER_ID]', type: 'UUID' },
              { name: '社員番号 [employeeNumber] [EMPLOYEE_NUMBER]', type: 'STRING_20' },
              { name: '氏名 [name] [NAME]', type: 'STRING_100' },
              { name: 'メールアドレス [email] [EMAIL]', type: 'EMAIL' },
              { name: '部門ID [departmentId] [DEPARTMENT_ID]', type: 'UUID' },
              { name: '役職 [position] [POSITION]', type: 'STRING_50' },
              { name: 'ランク [rank] [RANK]', type: 'ENUM' },
              { name: '入社日 [joinedDate] [JOINED_DATE]', type: 'DATE' },
              { name: '稼働率 [utilization] [UTILIZATION]', type: 'PERCENTAGE' },
              { name: '単価 [hourlyRate] [HOURLY_RATE]', type: 'MONEY' }
            ],
            businessRules: [
              '社員番号は企業内で一意',
              '稼働率は80%を目標とする',
              '単価はランクとスキルにより決定'
            ]
          },
          {
            name: 'チーム [Team] [TEAM]',
            attributes: [
              { name: 'ID [id] [TEAM_ID]', type: 'UUID' },
              { name: 'チーム名 [name] [NAME]', type: 'STRING_100' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: 'リーダーID [leaderId] [LEADER_ID]', type: 'UUID' },
              { name: '開始日 [startDate] [START_DATE]', type: 'DATE' },
              { name: '終了日 [endDate] [END_DATE]', type: 'DATE' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' }
            ],
            businessRules: [
              'チームには必ずリーダーを置く',
              'チームメンバーは3-10名が適正',
              'チーム編成はスキルバランスを考慮'
            ]
          },
          {
            name: 'スキル [Skill] [SKILL]',
            attributes: [
              { name: 'ID [id] [SKILL_ID]', type: 'UUID' },
              { name: 'スキル名 [name] [NAME]', type: 'STRING_100' },
              { name: 'カテゴリ [category] [CATEGORY]', type: 'ENUM' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'レベル定義 [levelDefinition] [LEVEL_DEFINITION]', type: 'JSON' }
            ],
            businessRules: [
              'スキルは技術スキルとビジネススキルに分類',
              'レベルは1-5の5段階評価',
              'スキル定義は定期的に見直し'
            ]
          },
          {
            name: 'メンバースキル [MemberSkill] [MEMBER_SKILL]',
            attributes: [
              { name: 'ID [id] [MEMBER_SKILL_ID]', type: 'UUID' },
              { name: 'メンバーID [memberId] [MEMBER_ID]', type: 'UUID' },
              { name: 'スキルID [skillId] [SKILL_ID]', type: 'UUID' },
              { name: 'レベル [level] [LEVEL]', type: 'INTEGER' },
              { name: '経験年数 [experienceYears] [EXPERIENCE_YEARS]', type: 'DECIMAL' },
              { name: '認定日 [certifiedDate] [CERTIFIED_DATE]', type: 'DATE' },
              { name: '次回評価日 [nextReviewDate] [NEXT_REVIEW_DATE]', type: 'DATE' }
            ],
            businessRules: [
              'スキルレベルは実務経験と試験で評価',
              '年次でスキルレビューを実施',
              'レベル3以上はプロジェクトリード可能'
            ]
          },
          {
            name: 'アサインメント [Assignment] [ASSIGNMENT]',
            attributes: [
              { name: 'ID [id] [ASSIGNMENT_ID]', type: 'UUID' },
              { name: 'メンバーID [memberId] [MEMBER_ID]', type: 'UUID' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: 'チームID [teamId] [TEAM_ID]', type: 'UUID' },
              { name: '役割 [role] [ROLE]', type: 'ENUM' },
              { name: '稼働率 [allocationPercent] [ALLOCATION_PERCENT]', type: 'PERCENTAGE' },
              { name: '開始日 [startDate] [START_DATE]', type: 'DATE' },
              { name: '終了日 [endDate] [END_DATE]', type: 'DATE' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' }
            ],
            businessRules: [
              '同時期の稼働率合計は100%を超えない',
              'アサイン変更は2週間前までに通知',
              'スキルマッチ度を考慮したアサイン'
            ]
          }
        ],
        valueObjects: [
          {
            name: 'ランク [Rank] [RANK]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'ENUM' }],
            businessRules: [
              'ランク: ジュニア、ミドル、シニア、マネージャー、エグゼクティブ',
              '升格には最低期間とパフォーマンス要件あり',
              'ランクごとに期待スキルセットを定義'
            ]
          },
          {
            name: '稼働率 [Utilization] [UTILIZATION]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'PERCENTAGE' }],
            businessRules: [
              '0-100%の範囲',
              '80%が標準目標',
              '90%超は過負荷アラート'
            ]
          }
        ],
        domainServices: [
          {
            name: 'チーム編成サービス [TeamFormationService] [TEAM_FORMATION_SERVICE]',
            operations: [
              '最適チームの提案',
              'スキルギャップ分析',
              'ロードバランシング',
              'チームパフォーマンス予測'
            ]
          },
          {
            name: 'スキル管理サービス [SkillManagementService] [SKILL_MANAGEMENT_SERVICE]',
            operations: [
              'スキルアセスメント',
              '学習パスの提案',
              'スキルマップの作成',
              '組織スキル棚卸'
            ]
          }
        ]
      }),
      apiSpecification: JSON.stringify({}),
      dbSchema: JSON.stringify({})
    }
  })
  
  // ビジネスケーパビリティ: チームの生産性を最大化する能力
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'TeamProductivityCapability',
      displayName: 'チームの生産性を最大化する能力',
      description: '最適なスキルを持つ人材を適切なプロジェクトに配置し、チームの生産性と個人の成長を同時に実現する能力',
      definition: `# ビジネスケーパビリティ: チームの生産性を最大化する能力 [TeamProductivityCapability] [TEAM_PRODUCTIVITY_CAPABILITY]

## ケーパビリティ概要

### 定義
組織に所属するコンサルタント一人ひとりのスキルと適性を把握し、プロジェクトの要求に最適にマッチングすることで、チーム全体の生産性を最大化し、同時に個人の成長機会を提供する組織的能力。

### ビジネス価値
- **直接的価値**: プロジェクト生産性30%向上、リソース稼働率85%以上維持、スキルミスマッチによる手戻り50%削減
- **間接的価値**: 従業員満足度向上（eNPS +20ポイント）、離職率低減（業界平均の50%以下）、スキル成長速度2倍
- **戦略的価値**: 組織のケーパビリティの可視化、戦略的スキル投資の実現、競合優位性の構築

### 成熟度レベル
- **現在**: レベル2（管理段階） - 基本的なスキル管理とアサインメントプロセスが存在
- **目標**: レベル4（予測可能段階） - データ駆動でリソース配置を最適化し、成果を予測可能にする（2025年Q4）

## ビジネスオペレーション群

### スキル管理グループ
- スキルを可視化する [VisualizeSkills] [VISUALIZE_SKILLS]
  - 目的: 組織全体のスキルポートフォリオを可視化し、強み・弱みを把握
- スキルを育成する [DevelopSkills] [DEVELOP_SKILLS]
  - 目的: 戦略的にスキルギャップを埋め、組織能力を強化
- スキルを認定する [CertifySkills] [CERTIFY_SKILLS]
  - 目的: 客観的な基準でスキルレベルを評価・認定

### リソース配分グループ
- リソースを最適配置する [AllocateResourcesOptimally] [ALLOCATE_RESOURCES_OPTIMALLY]
  - 目的: プロジェクトニーズとコンサルタントのスキル・キャリア志向を最適にマッチング
- リソース状況を監視する [MonitorResourceUtilization] [MONITOR_RESOURCE_UTILIZATION]
  - 目的: 稼働率と負荷状況をリアルタイムで把握し、過剰負荷や遊休を防止
- リソース計画を立案する [PlanResourceCapacity] [PLAN_RESOURCE_CAPACITY]
  - 目的: 中長期的なリソース需給を予測し、採用・育成計画に反映

### チーム編成グループ
- チームを編成する [FormTeams] [FORM_TEAMS]
  - 目的: プロジェクトに最適なスキルミックスとチームダイナミクスを持つチームを構成
- チーム協働を促進する [FacilitateTeamCollaboration] [FACILITATE_TEAM_COLLABORATION]
  - 目的: チーム内のコミュニケーションと協働を円滑化し生産性を向上

## 関連ケーパビリティ

### 前提ケーパビリティ
- 人材を採用する能力 [RecruitmentCapability] [RECRUITMENT_CAPABILITY]
  - 依存理由: 適切なスキルを持つ人材を採用することが前提
- 人材を評価する能力 [PerformanceEvaluationCapability] [PERFORMANCE_EVALUATION_CAPABILITY]
  - 依存理由: 客観的なスキル評価には定期的なパフォーマンス評価が必要

### 連携ケーパビリティ
- プロジェクトを成功に導く能力 [ProjectSuccessCapability] [PROJECT_SUCCESS_CAPABILITY]
  - 連携価値: 適切なリソース配置がプロジェクト成功の基盤となる
- 知識を組織資産化する能力 [KnowledgeAssetCapability] [KNOWLEDGE_ASSET_CAPABILITY]
  - 連携価値: スキル開発に必要な知識を体系的に提供

## パラソルドメインモデル概要

### 中核エンティティ
- チーム [Team] [TEAM]
- コンサルタント [Consultant] [CONSULTANT]
- スキル [Skill] [SKILL]
- スキル保有 [SkillPossession] [SKILL_POSSESSION]
- リソース配分 [ResourceAllocation] [RESOURCE_ALLOCATION]

### 主要な集約
- チーム集約（チーム、チームメンバー、チーム目標）
- スキル集約（スキル、スキルカテゴリ、習熟度基準）
- リソース集約（コンサルタント、スキル保有、配分履歴）

## 評価指標（KPI）

1. **リソース稼働率**: コンサルタントの稼働時間の割合
   - 目標値: 85%以上（過剰負荷を避け、自己研鑽時間も確保）
   - 測定方法: (プロジェクト作業時間 / 総労働時間) × 100
   - 測定頻度: 週次

2. **スキルマッチング率**: プロジェクト要求スキルとアサイン人材スキルの適合度
   - 目標値: 90%以上
   - 測定方法: (マッチしたスキル数 / 必要スキル総数) × 100
   - 測定頻度: プロジェクト開始時

3. **スキル成長速度**: コンサルタントのスキルレベル向上速度
   - 目標値: 年間平均1.5レベル向上（5段階評価）
   - 測定方法: (期末スキルレベル - 期首スキルレベル) / 保有スキル数
   - 測定頻度: 四半期

4. **リソース配置リードタイム**: プロジェクト要請から配置確定までの日数
   - 目標値: 5営業日以内
   - 測定方法: 配置確定日 - 要請日
   - 測定頻度: 月次

5. **従業員満足度（eNPS）**: リソース配置・キャリア開発に対する満足度
   - 目標値: +20ポイント以上
   - 測定方法: 「推奨度 - 批判度」（11段階評価から算出）
   - 測定頻度: 四半期

## 必要なリソース

### 人的リソース
- **リソースマネージャー**: リソース全体の配置統制
  - 人数: 組織全体で2-3名
  - スキル要件: 組織全体の業務理解、調整力、データ分析スキル

- **スキルアセッサー**: スキル評価と認定
  - 人数: スキルカテゴリごとに1-2名
  - スキル要件: 各領域の専門性、評価スキル

- **キャリアカウンセラー**: 個人のキャリア開発支援
  - 人数: 50名のコンサルタントあたり1名
  - スキル要件: コーチングスキル、業界知識

### 技術リソース
- **リソース管理システム**: スキルとアサインメントの一元管理
  - 用途: スキルマトリクス、配置計画、稼働率管理
  - 要件: リアルタイム更新、予測分析機能

- **スキル評価ツール**: 客観的なスキル評価
  - 用途: スキルテスト、360度評価、自己評価
  - 要件: 多様な評価方法、履歴管理

- **可視化ダッシュボード**: リソース状況の可視化
  - 用途: 稼働率、スキルギャップ、配置状況の可視化
  - 要件: リアルタイム表示、ドリルダウン可能

### 情報リソース
- **スキルフレームワーク**: 組織で必要なスキルの体系
  - 用途: スキル評価基準、育成計画の基盤
  - 更新頻度: 年次（市場動向に応じて更新）

- **プロジェクト実績データ**: 過去の配置とパフォーマンス
  - 用途: 最適配置のパターン学習、予測精度向上
  - 蓄積方法: プロジェクト完了時に自動記録

- **市場動向データ**: 業界で求められるスキルのトレンド
  - 用途: 戦略的スキル投資の判断材料
  - 取得方法: 業界調査、求人動向分析

## 実現ロードマップ

### Phase 1: 基盤構築（2024 Q1-Q2）
- スキルフレームワークの策定と合意形成
- リソース管理システムの導入
- スキル評価プロセスの標準化
- 基本的なスキルマトリクスの整備

### Phase 2: 機能拡張（2024 Q3-Q4）
- リアルタイム稼働率モニタリングの実装
- スキルマッチングアルゴリズムの導入
- キャリアパスの可視化
- 育成計画テンプレートの整備

### Phase 3: 最適化（2025 Q1-Q2）
- AI活用による最適配置の推薦
- 予測分析によるリソース需給計画
- スキルギャップ自動検出と育成提案
- 個人のキャリア志向に基づく配置最適化`,
      category: 'Core'
    }
  })
  
  // ビジネスオペレーションを作成
  const { seedResourceOperationsFull } = await import('./resource-operations-full')
  await seedResourceOperationsFull(service, capability)
  
  return { service, capability }
}