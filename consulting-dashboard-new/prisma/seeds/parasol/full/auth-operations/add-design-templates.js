const fs = require('fs');
const path = require('path');

// 認証サービスのオペレーションにdesignテンプレートを追加するスクリプト

const templates = {
  'RegisterAndManageUsers': `# ビジネスオペレーション: ユーザーを登録・管理する [RegisterAndManageUsers] [REGISTER_AND_MANAGE_USERS]

## オペレーション概要

### 目的
ユーザーアカウントのライフサイクル（登録、更新、無効化、削除）を適切に管理し、正確なユーザー情報を維持する

### ビジネス価値
- **セキュリティ向上**: 不正アクセスリスクを80%削減
- **効率性向上**: ユーザー登録時間を70%短縮
- **コンプライアンス**: 監査要件100%準拠

### 実行頻度
- **頻度**: 日次（新規入社、退職、異動時）
- **トリガー**: 人事部門からの申請、ユーザー本人からの更新要求
- **所要時間**: 新規登録15分、更新5分

## ビジネスプロセス

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **登録完了率**: 申請から登録完了までの成功率
   - 目標値: 99%以上
2. **登録リードタイム**: 申請から有効化までの時間
   - 目標値: 1営業日以内
3. **データ精度**: ユーザー情報の正確性
   - 目標値: 99.5%以上`,

  'ManageOrganizationStructure': `# ビジネスオペレーション: 組織構造を管理する [ManageOrganizationStructure] [MANAGE_ORGANIZATION_STRUCTURE]

## オペレーション概要

### 目的
組織の部門、チーム、階層構造を正確に管理し、組織変更に迅速に対応する

### ビジネス価値
- **運用効率**: 組織変更対応時間を60%削減
- **データ整合性**: 組織情報の不整合を90%削減
- **可視性向上**: 組織全体の構造を即座に把握可能

### 実行頻度
- **頻度**: 月次（組織改編時は随時）
- **トリガー**: 組織改編通知、部門新設・統廃合
- **所要時間**: 小規模変更30分、大規模改編2-3日

## ビジネスプロセス

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **組織更新精度**: 実組織と登録情報の一致率
   - 目標値: 100%
2. **更新リードタイム**: 組織変更通知から反映までの時間
   - 目標値: 2営業日以内
3. **階層整合性**: 組織階層の論理的整合性
   - 目標値: エラー0件`,

  'ControlAccessPermissions': `# ビジネスオペレーション: アクセス権限を制御する [ControlAccessPermissions] [CONTROL_ACCESS_PERMISSIONS]

## オペレーション概要

### 目的
ロールベースアクセス制御（RBAC）を通じて、最小権限の原則に基づいた適切なアクセス権限を管理し、情報資産を保護する

### ビジネス価値
- **セキュリティ強化**: 不正アクセスを95%削減
- **コンプライアンス**: SOX法等の規制要件に100%準拠
- **運用効率**: 権限管理工数を50%削減

### 実行頻度
- **頻度**: 日次（権限変更）、四半期（定期レビュー）
- **トリガー**: 役職変更、プロジェクト参画、定期監査
- **所要時間**: 権限変更30分、定期レビュー1週間

## ビジネスプロセス

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **最小権限準拠率**: 不要な権限を持つユーザーの割合
   - 目標値: 5%以下
2. **権限設定時間**: 申請から設定完了までの時間
   - 目標値: 4時間以内
3. **定期レビュー実施率**: 計画通りレビューを実施した割合
   - 目標値: 100%`,

  'ExecuteAuthentication': `# ビジネスオペレーション: 認証を実行する [ExecuteAuthentication] [EXECUTE_AUTHENTICATION]

## オペレーション概要

### 目的
ユーザーの身元を確実に確認し、なりすましや不正アクセスを防止して、システムへの安全なアクセスを提供する

### ビジネス価値
- **セキュリティ**: 不正ログインを99.9%防止
- **ユーザビリティ**: シングルサインオンで利便性向上
- **監査対応**: 全認証イベントの完全な追跡可能性

### 実行頻度
- **頻度**: 常時（ユーザーログイン時）
- **トリガー**: ログイン要求、セッションタイムアウト
- **所要時間**: 認証処理3秒以内

## ビジネスプロセス

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **認証成功率**: 正当なユーザーの認証成功率
   - 目標値: 99.5%以上
2. **認証処理時間**: ログインから完了までの平均時間
   - 目標値: 3秒以内
3. **MFA採用率**: 多要素認証を有効化したユーザーの割合
   - 目標値: 90%以上`,

  'RecordAuditLogs': `# ビジネスオペレーション: 監査ログを記録する [RecordAuditLogs] [RECORD_AUDIT_LOGS]

## オペレーション概要

### 目的
すべてのセキュリティ関連イベントと重要な操作を完全に記録し、コンプライアンス要件を満たし、セキュリティインシデントの調査を可能にする

### ビジネス価値
- **コンプライアンス**: 監査要件に100%準拠
- **セキュリティ**: インシデント検知時間を90%短縮
- **説明責任**: 全操作の完全な追跡可能性確保

### 実行頻度
- **頻度**: リアルタイム（イベント発生時）
- **トリガー**: セキュリティイベント、管理操作
- **所要時間**: ログ記録100ミリ秒以内

## ビジネスプロセス

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **ログ完全性**: イベント記録の欠損率
   - 目標値: 0.01%以下
2. **ログ可用性**: 監査ログの検索可能率
   - 目標値: 99.99%以上
3. **保管期間準拠率**: 規定期間のログ保管率
   - 目標値: 100%`
};

// ファイルを更新する関数
function updateOperationFile(filePath, operationName) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('design:')) {
    console.log(`${operationName}: Already has design field, skipping`);
    return;
  }
  
  const template = templates[operationName];
  if (!template) {
    console.log(`${operationName}: No template found, skipping`);
    return;
  }
  
  // pattern: の後に design: を追加
  const updatedContent = content.replace(
    /pattern: 'Administration',/,
    `pattern: 'Administration',\n      design: \`${template}\`,`
  ).replace(
    /pattern: 'Workflow',/,
    `pattern: 'Workflow',\n      design: \`${template}\`,`
  );
  
  fs.writeFileSync(filePath, updatedContent);
  console.log(`${operationName}: Updated with design template`);
}

// メイン処理
const files = [
  { file: '01-register-and-manage-users.ts', operation: 'RegisterAndManageUsers' },
  { file: '02-manage-organization-structure.ts', operation: 'ManageOrganizationStructure' },
  { file: '03-control-access-permissions.ts', operation: 'ControlAccessPermissions' },
  { file: '04-execute-authentication.ts', operation: 'ExecuteAuthentication' },
  { file: '05-record-audit-logs.ts', operation: 'RecordAuditLogs' }
];

files.forEach(({ file, operation }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    updateOperationFile(filePath, operation);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('\nDone! Run the seed script to update the database.');