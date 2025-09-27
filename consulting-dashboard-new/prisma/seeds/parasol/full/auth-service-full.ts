import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// 認証・組織管理サービスの完全なパラソルデータ
export async function seedAuthServiceFullParasol() {
  console.log('  Seeding auth-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'auth-service' }
  })
  
  if (existingService) {
    console.log('  Auth service already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'auth-service',
      displayName: '認証・組織管理サービス',
      description: 'ユーザー認証、組織・ロール管理、アクセス制御を提供する基盤サービス',

      domainLanguage: JSON.stringify({}),
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
- ユーザーを登録・管理する [RegisterAndManageUsers] [REGISTER_AND_MANAGE_USERS]
  - 目的: ユーザーアカウントのライフサイクル全体を管理
- 組織構造を管理する [ManageOrganizationStructure] [MANAGE_ORGANIZATION_STRUCTURE]
  - 目的: 組織階層、部門、チーム構造を維持管理

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