const { PrismaClient } = require('@prisma/parasol-client');

const parasolDb = new PrismaClient();

const serviceDefinitions = [
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
    
    domainLanguageDefinition: `# パラソルドメイン言語: 工数ドメイン v1.2.0

更新日: 2024-12-28

## エンティティ（Entities）

### 工数エントリ [TimeEntry] [TIME_ENTRY]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| ユーザーID | userId | USER_ID | UUID | ○ | 作業者 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 対象プロジェクト |
| 作業日 | workDate | WORK_DATE | DATE | ○ | 作業実施日 |
| 作業時間 | hours | HOURS | DECIMAL | ○ | 作業時間（時間） |
| 作業内容 | description | DESCRIPTION | STRING_500 | ○ | 作業内容の説明 |
| カテゴリ | category | CATEGORY | WorkCategory | ○ | 作業分類 |
| ステータス | status | STATUS | TimeEntryStatus | ○ | 承認状態 |
| 請求可能フラグ | billable | BILLABLE | BOOLEAN | ○ | 請求対象可否 |
| 承認者ID | approverId | APPROVER_ID | UUID |  | 承認者 |
| 承認日時 | approvedAt | APPROVED_AT | TIMESTAMP |  | 承認日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

#### 集約ルート
- 工数エントリが集約ルート

### 承認ワークフロー [ApprovalWorkflow] [APPROVAL_WORKFLOW]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| 名称 | name | NAME | STRING_100 | ○ | ワークフロー名 |
| 承認ステップ | steps | STEPS | ApprovalStep | ○ | 承認手順 |
| 対象範囲 | scope | SCOPE | STRING_100 | ○ | 適用範囲 |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | 有効/無効 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

## 値オブジェクト（Value Objects）

### 作業分類 [WorkCategory] [WORK_CATEGORY]

- **分類コード** [code] [CODE]: STRING_20
- **分類名** [name] [NAME]: STRING_50
- **説明** [description] [DESCRIPTION]: STRING_200

### 工数ステータス [TimeEntryStatus] [TIME_ENTRY_STATUS]

- **ステータス** [status] [STATUS]: ENUM('draft', 'submitted', 'approved', 'rejected')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### 承認ステップ [ApprovalStep] [APPROVAL_STEP]

- **ステップ番号** [stepNumber] [STEP_NUMBER]: INTEGER
- **承認者ロール** [approverRole] [APPROVER_ROLE]: STRING_50
- **必須フラグ** [required] [REQUIRED]: BOOLEAN

## 集約（Aggregates）

### 工数管理集約 [TimeManagementAggregate] [TIME_MANAGEMENT_AGGREGATE]

#### 集約ルート
- TimeEntry

#### 含まれるエンティティ
- TimeEntry
- ApprovalWorkflow

#### ビジネスルール
- 工数エントリの承認は設定されたワークフローに従う
- 承認済み工数の変更は禁止
- 1日の工数合計は24時間を超えない

## ドメインサービス

### 工数承認サービス [TimeApprovalService] [TIME_APPROVAL_SERVICE]

#### 責務
- 工数エントリの承認処理
- 承認ワークフローの実行
- 承認権限のチェック

#### メソッド
- submitTimeEntry(): 工数提出
- approveTimeEntry(): 工数承認
- rejectTimeEntry(): 工数却下

## ドメインイベント

### 工数提出イベント [TimeEntrySubmitted] [TIME_ENTRY_SUBMITTED]

#### 発生タイミング
- 工数エントリが提出された時

#### イベントデータ
- timeEntryId: 工数エントリID
- userId: 提出者ID
- submittedAt: 提出日時

### 工数承認イベント [TimeEntryApproved] [TIME_ENTRY_APPROVED]

#### 発生タイミング
- 工数エントリが承認された時

#### イベントデータ
- timeEntryId: 工数エントリID
- approverId: 承認者ID
- approvedAt: 承認日時

## ビジネスルール

### 工数入力ルール [TimeEntryRules] [TIME_ENTRY_RULES]

#### 基本制約
- [時間制約]: 1日の工数は0-24時間の範囲内
- [日付制約]: 作業日は未来日不可
- [必須項目]: 作業内容は必須入力

#### 承認制約
- [承認権限]: 直属の上司または指定された承認者のみ承認可能
- [変更制約]: 承認済み工数の修正は禁止

### ワークフロールール [WorkflowRules] [WORKFLOW_RULES]

#### 承認プロセス
- [順次承認]: 設定されたステップに従い順次承認
- [期限管理]: 承認期限を設定可能
- [代理承認]: 承認者不在時の代理承認機能

## リポジトリインターフェース

### 工数エントリリポジトリ [TimeEntryRepository] [TIME_ENTRY_REPOSITORY]

#### メソッド
- findById(id: UUID): TimeEntry
- findByUserId(userId: UUID): TimeEntry[]
- findByProjectId(projectId: UUID): TimeEntry[]
- findPendingApproval(): TimeEntry[]
- save(timeEntry: TimeEntry): void
- delete(id: UUID): void

### 承認ワークフローリポジトリ [ApprovalWorkflowRepository] [APPROVAL_WORKFLOW_REPOSITORY]

#### メソッド
- findById(id: UUID): ApprovalWorkflow
- findByScope(scope: string): ApprovalWorkflow
- findActive(): ApprovalWorkflow[]
- save(workflow: ApprovalWorkflow): void

## DDD設計チェックリスト

### ✅ 完了項目
- [x] エンティティにはすべて集約が定義されている
- [x] 集約ルートが明確に識別されている
- [x] Value Objectが適切に定義されている
- [x] ドメインサービスとビジネスルールが分離されている
- [x] ドメインイベントが定義されている
- [x] リポジトリインターフェースが定義されている

### 🔄 進行中項目
- [ ] 集約境界の最適化
- [ ] パフォーマンス考慮した設計見直し`
  }
];

async function createServices() {
  console.log('Creating service definitions...');
  
  try {
    // Clear existing services
    await parasolDb.service.deleteMany({});
    console.log('Cleared existing services');
    
    const services = [];
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
      });
      services.push(service);
      console.log(`Created service: ${service.displayName}`);
    }
    
    console.log(`Created ${services.length} services successfully!`);
    return services;
  } catch (error) {
    console.error('Error creating services:', error);
    throw error;
  } finally {
    await parasolDb.$disconnect();
  }
}

// Run the function
createServices()
  .then(() => {
    console.log('Services seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Services seed failed:', error);
    process.exit(1);
  });