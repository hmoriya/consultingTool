# ユースケース: MFAをリセットする

**バージョン**: 2.0.0
**更新日**: 2025-10-21
**設計方針**: 管理者権限・セキュリティ確保・緊急時対応

## 基本情報
- **ユースケースID**: UC-MFA-04
- **アクター**: 管理者（主アクター）、ユーザー（副アクター）、システム（副アクター）
- **概要**: 管理者権限により、ユーザーのMFA設定を完全にリセットし、緊急時アクセス復旧や新規MFA設定を可能にする

## 🏗️ パラソルドメイン連携

### 操作エンティティ
- **MFAConfigurationEntity**（自サービス管理・状態更新: verified → disabled → deleted）: MFA設定の完全削除
- **MFASecretEntity**（自サービス管理・削除）: TOTP秘密鍵の完全削除
- **BackupCodeEntity**（自サービス管理・削除）: 全バックアップコードの無効化・削除
- **UserEntity**（自サービス管理・状態更新）: ユーザーのMFA設定状態リセット

### 他サービスユースケース利用
- **collaboration-facilitation-service**: UC-NOTIFY-01: 緊急セキュリティアラートを送信する
- **collaboration-facilitation-service**: UC-COMM-01: IT管理者への緊急連絡を実行する
- **project-success-service**: UC-AUDIT-01: セキュリティ監査ログを記録する
- **knowledge-co-creation-service**: UC-KNOWLEDGE-05: セキュリティインシデント記録を作成する

## 事前条件
- 実行者が管理者権限（Admin、Security Admin）を持っている
- 対象ユーザーのアカウントが存在し、MFAが有効化されている
- MFAリセットが必要な正当な理由が存在する（デバイス紛失、アプリ削除、バックアップコード全消費等）
- セキュリティポリシーに基づく承認プロセスが完了している（重要アカウントの場合）

## 事後条件
### 成功時
- 対象ユーザーのMFAConfigurationEntityが完全に削除されている
- 関連するMFASecretEntityとBackupCodeEntityがすべて削除されている
- ユーザーが通常のパスワード認証のみでログイン可能になっている
- MFAリセット実行の詳細な監査ログが記録されている
- セキュリティアラートが関係者に送信されている
- 対象ユーザーにMFAリセット完了通知が送信されている

### 失敗時
- 対象ユーザーのMFA設定は変更されていない
- エラーログが記録され、失敗理由が明確化されている
- 管理者に失敗通知が送信されている
- セキュリティインシデントとして記録されている

## 基本フロー
1. **管理者**がセキュリティ管理画面にアクセスする
2. **システム**が管理者権限を確認する
3. **管理者**がMFAリセット対象ユーザーを検索・選択する
4. **システム**が対象ユーザーのMFA設定状況を表示する
5. **管理者**がMFAリセットの理由と緊急度を入力する
6. **システム**がリセット実行前の最終確認画面を表示する
7. **管理者**がリセット実行を最終承認する
8. **システム**がMFASecurityAggregateの完全削除を実行する
9. **システム**がMFAConfigurationEntity、MFASecretEntity、BackupCodeEntityを順次削除する
10. **システム**がUserEntityのMFA設定状態をリセットする
11. **システム**が対象ユーザーの既存セッションを強制終了する
12. **システム**が緊急セキュリティアラートを送信する（他サービス連携）
13. **システム**が詳細な監査ログを記録する（他サービス連携）
14. **システム**が対象ユーザーにMFAリセット完了通知を送信する
15. **システム**がMFAリセット完了画面を表示する

## 代替フロー

### 代替フロー1: 重要アカウント追加承認
- **分岐点**: ステップ4（MFA設定状況表示）
- **条件**: 対象ユーザーが重要アカウント（Executive、Security Admin等）
- **処理**:
  - 4a1. システムが重要アカウントである旨を警告表示する
  - 4a2. システムが二次承認者（上級管理者）の承認を要求する
  - 4a3. 管理者が二次承認者に承認依頼を送信する
  - 4a4. 二次承認者が承認完了後、ステップ5に続行

### 代替フロー2: 一時的無効化オプション
- **分岐点**: ステップ5（理由・緊急度入力）
- **条件**: 完全削除ではなく一時的無効化を選択
- **処理**:
  - 5a1. 管理者が「一時的無効化」オプションを選択する
  - 5a2. システムがMFAConfigurationEntityの状態をverified → suspendedに変更
  - 5a3. バックアップコードは保持、秘密鍵のみ一時無効化
  - 5a4. 7日間の自動復旧期限を設定
  - 5a5. ステップ11に続行

### 代替フロー3: 即座新規MFA設定
- **分岐点**: ステップ15（完了画面表示）
- **条件**: リセット後即座に新しいMFA設定を実行
- **処理**:
  - 15a1. 管理者が「新しいMFA設定を開始」を選択する
  - 15a2. システムがUC-MFA-01（MFA有効化）を管理者権限で実行する
  - 15a3. 対象ユーザー用の新しいMFA設定を生成・表示する
  - 15a4. 管理者が対象ユーザーに新設定を安全に提供する

## 例外フロー

### 例外1: 権限不足
- **発生点**: ステップ2（権限確認）
- **処理**:
  - 2e1. 管理者権限が不足している場合
  - 2e2. 「MFAリセットには管理者権限が必要です」を表示
  - 2e3. 権限昇格手順または適切な管理者への連絡方法を案内
  - 2e4. 不正アクセス試行として監査ログに記録
  - 2e5. ユースケース終了

### 例外2: システムエラー・部分的失敗
- **発生点**: ステップ8-10（削除処理）
- **処理**:
  - 8e1. MFA関連エンティティの削除で部分的失敗が発生
  - 8e2. システムがロールバック処理を実行（データ整合性確保）
  - 8e3. 失敗したエンティティのみ手動修復が必要な状態をログに記録
  - 8e4. 緊急技術者アラートを送信する（他サービス連携）
  - 8e5. 管理者に部分的失敗と手動対応要求を通知

### 例外3: 対象ユーザー不存在・MFA未設定
- **発生点**: ステップ3（ユーザー検索・選択）
- **処理**:
  - 3e1. 指定されたユーザーが存在しないまたはMFA未設定の場合
  - 3e2. 「指定されたユーザーはMFAが設定されていません」を表示
  - 3e3. 対象ユーザーの詳細確認と代替操作を案内
  - 3e4. 検索・選択操作のログを記録
  - 3e5. ステップ3に戻る

## 特別要件

### セキュリティ要件
- **管理者認証**: MFAリセット実行時の管理者再認証必須
- **完全削除**: 関連データの暗号学的消去、復旧不可能な削除
- **操作ログ**: 全操作の詳細ログ記録、改ざん防止
- **権限分離**: 通常管理者と上級管理者の役割分離

### 承認・監査要件
- **二次承認**: 重要アカウントの場合の上級管理者承認
- **理由記録**: リセット理由の必須入力と証跡保管
- **即座通知**: リセット実行の即座関係者通知
- **定期監査**: MFAリセット実行状況の定期レビュー

### 運用要件
- **緊急時対応**: 24時間体制での緊急リセット対応
- **エスカレーション**: 複雑ケースの上級管理者エスカレーション
- **手順文書**: 詳細な操作手順とトラブルシューティング
- **バックアップ手順**: システム障害時の手動リセット手順

### 性能要件
- **削除処理**: 5秒以内での完全削除処理完了
- **通知配信**: 10秒以内での関係者通知完了
- **セッション終了**: 3秒以内での強制ログアウト実行

## ドメインサービス連携
- **MFARecoveryService.coordinate[EmergencyAccess]()**: 緊急時アクセス回復の調整
- **SecurityAuditService.record[CriticalOperation]()**: 重要操作の監査記録
- **AdminNotificationService.alert[SecurityIncident]()**: セキュリティインシデントの通知

## 入出力仕様

### 入力（フロントエンド → API）
```json
{
  "mfaReset": {
    "adminId": "UUID",
    "targetUserId": "UUID",
    "resetReason": "device_lost|app_deleted|backup_exhausted|emergency",
    "resetType": "complete|temporary|immediate_reconfigure",
    "urgencyLevel": "low|medium|high|critical",
    "additionalNotes": "詳細な理由説明",
    "approverIds": ["UUID"],
    "adminReauthToken": "token"
  }
}
```

### 出力（API → フロントエンド）
```json
{
  "result": "success|partial_failure|failure",
  "resetData": {
    "resetId": "UUID",
    "executedAt": "2024-10-21T10:30:00Z",
    "targetUser": {
      "id": "UUID",
      "email": "user@example.com",
      "name": "User Name"
    },
    "resetScope": {
      "mfaConfiguration": "deleted",
      "secretKeys": "deleted",
      "backupCodes": "deleted",
      "sessions": "terminated"
    }
  },
  "notifications": {
    "userNotified": true,
    "adminNotified": true,
    "auditLogged": true,
    "securityAlerted": true
  },
  "nextActions": {
    "newMfaSetup": "available",
    "temporaryAccess": "enabled",
    "supportContact": "admin@example.com"
  }
}
```

### 部分的失敗レスポンス例
```json
{
  "result": "partial_failure",
  "error": {
    "code": "PARTIAL_DELETION_FAILURE",
    "message": "一部のMFAデータの削除に失敗しました",
    "details": "BackupCodeEntity削除で技術的問題が発生"
  },
  "completedActions": [
    "mfa_configuration_deleted",
    "secret_keys_deleted",
    "sessions_terminated"
  ],
  "failedActions": [
    "backup_codes_deletion"
  ],
  "requiredManualActions": [
    "手動でのバックアップコード削除が必要",
    "技術者による直接DB操作を要求"
  ]
}
```

## 関連ユースケース
- **UC-MFA-01**: MFAを有効化する（リセット後の新規設定）
- **UC-MFA-02**: 認証コードを入力する（リセット前の最終認証）
- **UC-MFA-03**: バックアップコードを使用する（リセット原因の特定）

---
*このユースケースは、緊急時の迅速な問題解決とセキュリティ確保を両立し、適切な管理者権限による安全なMFAリセットを実現するパラソル設計v2.0仕様に基づいています*