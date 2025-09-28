import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// 認証・組織管理サービスの完全なパラソルデータ
export async function seedAuthServiceFullParasol() {
  console.log('  Seeding auth-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'secure-access' }
  })
  
  if (existingService) {
    console.log('  セキュアアクセスサービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'secure-access',
      displayName: 'セキュアアクセスサービス',
      description: '安全なアクセスを保証し、組織のセキュリティとガバナンスを実現',

      domainLanguage: JSON.stringify({
        entities: [
          {
            name: 'ユーザー [User] [USER]',
            attributes: [
              { name: 'ID [id] [USER_ID]', type: 'UUID' },
              { name: 'メールアドレス [email] [EMAIL]', type: 'EMAIL' },
              { name: 'パスワードハッシュ [passwordHash] [PASSWORD_HASH]', type: 'PASSWORD_HASH' },
              { name: '氏名 [name] [NAME]', type: 'STRING_100' },
              { name: 'ロール [role] [ROLE]', type: 'ENUM' },
              { name: '有効フラグ [isActive] [IS_ACTIVE]', type: 'BOOLEAN' },
              { name: '最終ログイン日時 [lastLoginAt] [LAST_LOGIN_AT]', type: 'TIMESTAMP' },
              { name: '作成日時 [createdAt] [CREATED_AT]', type: 'TIMESTAMP' },
              { name: '更新日時 [updatedAt] [UPDATED_AT]', type: 'TIMESTAMP' }
            ],
            businessRules: [
              'メールアドレスはシステム全体で一意であること',
              'パスワードは最低8文字以上で、英数字・記号を含むこと',
              'ユーザーは必ず1つの組織に所属すること'
            ]
          },
          {
            name: '組織 [Organization] [ORGANIZATION]',
            attributes: [
              { name: 'ID [id] [ORGANIZATION_ID]', type: 'UUID' },
              { name: '組織名 [name] [NAME]', type: 'STRING_100' },
              { name: '組織コード [code] [CODE]', type: 'STRING_50' },
              { name: '親組織ID [parentId] [PARENT_ID]', type: 'UUID' },
              { name: '階層レベル [level] [LEVEL]', type: 'INTEGER' },
              { name: 'パス [path] [PATH]', type: 'STRING_500' },
              { name: '有効フラグ [isActive] [IS_ACTIVE]', type: 'BOOLEAN' }
            ],
            businessRules: [
              '組織コードは企業内で一意であること',
              '組織階層は最大5レベルまで',
              '親組織の削除時は子組織を先に処理すること'
            ]
          },
          {
            name: 'ロール [Role] [ROLE]',
            attributes: [
              { name: 'ID [id] [ROLE_ID]', type: 'UUID' },
              { name: 'ロール名 [name] [NAME]', type: 'STRING_50' },
              { name: '表示名 [displayName] [DISPLAY_NAME]', type: 'STRING_100' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: '権限 [permissions] [PERMISSIONS]', type: 'JSON' }
            ],
            businessRules: [
              'システム定義ロールは削除・変更不可',
              '権限の組み合わせは矛盾がないこと',
              'ロール名は企業内で一意であること'
            ]
          },
          {
            name: 'セッション [Session] [SESSION]',
            attributes: [
              { name: 'ID [id] [SESSION_ID]', type: 'UUID' },
              { name: 'ユーザーID [userId] [USER_ID]', type: 'UUID' },
              { name: 'トークン [token] [TOKEN]', type: 'STRING_500' },
              { name: 'IPアドレス [ipAddress] [IP_ADDRESS]', type: 'STRING_50' },
              { name: 'ユーザーエージェント [userAgent] [USER_AGENT]', type: 'STRING_500' },
              { name: '有効期限 [expiresAt] [EXPIRES_AT]', type: 'TIMESTAMP' },
              { name: '作成日時 [createdAt] [CREATED_AT]', type: 'TIMESTAMP' }
            ],
            businessRules: [
              'セッションは24時間で自動失効',
              '同一ユーザーの同時セッション数は最大5',
              'トークンはランダムに生成され予測不可能であること'
            ]
          },
          {
            name: '監査ログ [AuditLog] [AUDIT_LOG]',
            attributes: [
              { name: 'ID [id] [AUDIT_LOG_ID]', type: 'UUID' },
              { name: 'ユーザーID [userId] [USER_ID]', type: 'UUID' },
              { name: 'アクション [action] [ACTION]', type: 'STRING_100' },
              { name: 'リソースタイプ [resourceType] [RESOURCE_TYPE]', type: 'STRING_50' },
              { name: 'リソースID [resourceId] [RESOURCE_ID]', type: 'UUID' },
              { name: '変更前 [before] [BEFORE]', type: 'JSON' },
              { name: '変更後 [after] [AFTER]', type: 'JSON' },
              { name: 'IPアドレス [ipAddress] [IP_ADDRESS]', type: 'STRING_50' },
              { name: '実行日時 [performedAt] [PERFORMED_AT]', type: 'TIMESTAMP' }
            ],
            businessRules: [
              '監査ログは一切変更・削除不可',
              '最低7年間の保管が必須',
              'すべてのデータ変更操作を記録すること'
            ]
          }
        ],
        valueObjects: [
          {
            name: 'メールアドレス [Email] [EMAIL]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'EMAIL' }],
            businessRules: ['RFC5322に準拠したフォーマットであること']
          },
          {
            name: 'パスワード [Password] [PASSWORD]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'STRING' }],
            businessRules: [
              '最低8文字以上',
              '大文字、小文字、数字、記号をそれぞれ1文字以上含む',
              '一般的な弱いパスワードを拒否'
            ]
          }
        ],
        domainServices: [
          {
            name: '認証サービス [AuthenticationService] [AUTHENTICATION_SERVICE]',
            operations: [
              'ユーザー認証の実行',
              'セッションの発行・管理',
              'パスワードリセット',
              '多要素認証の実施'
            ]
          },
          {
            name: 'アクセス制御サービス [AccessControlService] [ACCESS_CONTROL_SERVICE]',
            operations: [
              '権限チェック',
              'ロール割り当て',
              'アクセスポリシー適用',
              '権限の委譲'
            ]
          }
        ]
      }),
      apiSpecification: JSON.stringify({}),
      dbSchema: JSON.stringify({})
    }
  })
  
  // ビジネスケーパビリティ: アクセスを安全に管理する能力
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'SecureAccessManagementCapability',
      displayName: 'アクセスを安全に管理する能力',
      description: 'ユーザー認証、権限制御、組織管理を通じて、システムへの安全なアクセスを保証し、セキュリティとコンプライアンスを維持する能力',
      definition: `# ビジネスケーパビリティ: アクセスを安全に管理する能力 [SecureAccessManagementCapability] [SECURE_ACCESS_MANAGEMENT_CAPABILITY]

## ケーパビリティ概要

### 定義
組織のユーザーアイデンティティを一元管理し、適切な認証・認可を通じてシステムリソースへの安全なアクセスを制御し、セキュリティポリシーとコンプライアンス要件を満たす組織的能力。

### ビジネス価値
- **直接的価値**: セキュリティインシデント95%削減、不正アクセス防止、監査対応効率化
- **間接的価値**: ユーザー生産性向上（シングルサインオン）、IT管理コスト30%削減
- **戦略的価値**: コンプライアンス要件の充足、情報資産の保護、信頼性の向上

### 成熟度レベル
- **現在**: レベル3（確立段階） - 基本的な認証・認可機能が実装され、ロールベースアクセス制御が機能
- **目標**: レベル4（予測可能段階） - ゼロトラストセキュリティモデルの実現（2025年Q4）

## ビジネスオペレーション群

### アイデンティティ管理グループ
- ユーザーアイデンティティを確立する [EstablishUserIdentity] [ESTABLISH_USER_IDENTITY]
  - 目的: ユーザーアカウントのライフサイクル全体を管理
- 組織構造を最適化する [OptimizeOrganizationStructure] [OPTIMIZE_ORGANIZATION_STRUCTURE]
  - 目的: 組織階層、部門、チーム構造を最適化

### アクセス制御グループ
- アクセス権限を制御する [ControlAccessPermissions] [CONTROL_ACCESS_PERMISSIONS]
  - 目的: ロールと権限の定義、割り当て、変更を管理
- 認証を実行する [ExecuteAuthentication] [EXECUTE_AUTHENTICATION]
  - 目的: ユーザー認証と多要素認証の実施

### 監査・コンプライアンスグループ
- 監査ログを記録する [RecordAuditLogs] [RECORD_AUDIT_LOGS]
  - 目的: すべてのアクセスと操作の証跡を記録・保管

## 関連ケーパビリティ

### 前提ケーパビリティ
- なし（認証は最も基礎的なケーパビリティ）

### 連携ケーパビリティ
- プロジェクトを成功に導く能力 [ProjectSuccessCapability] [PROJECT_SUCCESS_CAPABILITY]
  - 連携価値: プロジェクトメンバーの適切なアクセス権限管理
- 知識を組織資産化する能力 [KnowledgeAssetCapability] [KNOWLEDGE_ASSET_CAPABILITY]
  - 連携価値: 知識へのセキュアなアクセス制御
- 収益性を最適化する能力 [ProfitabilityOptimizationCapability] [PROFITABILITY_OPTIMIZATION_CAPABILITY]
  - 連携価値: 財務データへの厳格なアクセス制御

## パラソルドメインモデル概要

### 中核エンティティ
- ユーザー [User] [USER]
- ロール [Role] [ROLE]
- 権限 [Permission] [PERMISSION]
- 組織 [Organization] [ORGANIZATION]
- セッション [Session] [SESSION]

### 主要な集約
- ユーザー集約（ユーザー、認証情報、セッション）
- 組織集約（組織、部門、チーム）
- アクセス制御集約（ロール、権限、ポリシー）

## 評価指標（KPI）

1. **認証成功率**: 正当なユーザーの認証成功率
   - 目標値: 99.9%以上
   - 測定方法: (成功認証数 / 全認証試行数) × 100
   - 測定頻度: リアルタイム監視

2. **不正アクセス試行検知率**: 不正なアクセス試行の検知率
   - 目標値: 99%以上
   - 測定方法: (検知した不正試行 / 実際の不正試行) × 100
   - 測定頻度: 日次

3. **パスワードポリシー遵守率**: セキュアなパスワードの使用率
   - 目標値: 100%
   - 測定方法: (ポリシー準拠パスワード / 全パスワード) × 100
   - 測定頻度: 月次

4. **アクセス権限レビュー完了率**: 定期的な権限見直しの実施率
   - 目標値: 100%
   - 測定方法: (レビュー済みユーザー / 全ユーザー) × 100
   - 測定頻度: 四半期

5. **MFA（多要素認証）利用率**: 多要素認証を有効化しているユーザーの割合
   - 目標値: 90%以上
   - 測定方法: (MFA有効ユーザー / 全ユーザー) × 100
   - 測定頻度: 月次

## 必要なリソース

### 人的リソース
- **セキュリティ管理者**: 認証・認可ポリシーの策定と管理
  - 人数: 1-2名
  - スキル要件: CISSP、情報セキュリティ、IAM専門知識

- **システム管理者**: ユーザー・組織管理の実務
  - 人数: 2-3名
  - スキル要件: Active Directory、LDAP、RBAC理解

- **監査担当者**: アクセスログの監視と分析
  - 人数: 1名
  - スキル要件: セキュリティ監査、ログ分析、コンプライアンス

### 技術リソース
- **認証基盤**: ユーザー認証とセッション管理
  - 用途: ログイン、ログアウト、セッション制御
  - 要件: OAuth2.0、SAML、JWT対応

- **アクセス制御システム**: 権限管理と認可
  - 用途: RBAC、権限チェック、ポリシー適用
  - 要件: 細粒度の権限制御、動的ポリシー

- **監査ログシステム**: 操作ログの記録と保管
  - 用途: 全操作の記録、検索、レポート生成
  - 要件: 改ざん防止、長期保管、高速検索

### 情報リソース
- **セキュリティポリシー**: 組織のセキュリティ基準
  - 用途: 認証強度、パスワードポリシー定義
  - 更新頻度: 年次見直し

- **コンプライアンス要件**: 法規制・業界標準
  - 用途: GDPR、SOX法等への準拠
  - 更新頻度: 法改正時

## 実現ロードマップ

### Phase 1: 基盤強化（2024 Q1-Q2）
- パスワードポリシーの強化
- 多要素認証（MFA）の導入
- ロールベースアクセス制御の改善
- 基本的な監査ログ機能

### Phase 2: 高度化（2024 Q3-Q4）
- シングルサインオン（SSO）実装
- リスクベース認証の導入
- 自動化された権限レビュー
- 高度な異常検知機能

### Phase 3: 最適化（2025 Q1-Q2）
- ゼロトラストモデルへの移行
- AIを活用した不正検知
- アダプティブ認証
- 統合ID管理プラットフォーム`,
      category: 'Core'
    }
  })
  
  // ビジネスオペレーションを作成
  const { seedAuthOperationsFull } = await import('./auth-operations-full')
  await seedAuthOperationsFull(service, capability)
  
  return { service, capability }
}