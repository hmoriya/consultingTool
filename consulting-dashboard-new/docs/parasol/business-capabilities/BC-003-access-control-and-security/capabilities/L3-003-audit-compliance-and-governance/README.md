# L3-003: Audit, Compliance & Governance

**作成日**: 2025-10-31
**所属BC**: BC-003: Access Control & Security
**V2移行元**: audit-and-assure-security

---

## 📋 What: この能力の定義

### 能力の概要
セキュリティ監査とコンプライアンスを確保する能力。監査ログ管理、コンプライアンス監視、セキュリティイベント検知を通じて、セキュリティガバナンスを実現します。

### 実現できること
- 包括的な監査ログの記録と管理
- コンプライアンス状況の監視
- セキュリティイベントの検知と対応
- 監査レポートの生成
- インシデント分析と改善

### 必要な知識
- 監査基準（ISO27001、SOC2）
- コンプライアンス要件（GDPR、個人情報保護法）
- ログ管理ベストプラクティス
- セキュリティイベント分析
- インシデント対応プロセス

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: AuditAggregate ([../../domain/README.md](../../domain/README.md#audit-aggregate))
- **Entities**: AuditLog, ComplianceCheck, SecurityEvent, IncidentReport
- **Value Objects**: EventType, Severity, ComplianceStatus, AuditTrail

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/audit/logs - 監査ログ記録
  - GET /api/audit/logs - ログ検索
  - GET /api/compliance/status - コンプライアンス状況
  - POST /api/security/events - イベント検知

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: audit_logs, compliance_checks, security_events, incident_reports

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **監査ログ不変性**: Write-Once-Read-Many（WORM）パターン
- **改ざん検知**: ハッシュチェーン（各ログに前ログのハッシュを含む）
- **異常検知**: 機械学習ベースの異常パターン検知（Isolation Forest）
- **デザインパターン**:
  - Observer Pattern（ドメインイベントからの監査ログ自動記録）
  - Chain of Responsibility（監査ログ処理パイプライン）
  - Immutable Object Pattern（ログの不変性保証）

#### 推奨ライブラリ・フレームワーク
- **ログ収集**: [winston](https://github.com/winstonjs/winston) - 構造化ロギング
- **ログ集約**: [Elasticsearch](https://www.elastic.co/) - ログ検索・分析
- **異常検知**: [scikit-learn](https://scikit-learn.org/)（Python） - 機械学習
- **レポート生成**: [pdfmake](https://github.com/bpampuch/pdfmake) - PDF監査レポート

### パフォーマンス考慮事項

#### スケーラビリティ
- **ログ記録**: 最大10,000イベント/秒（非同期処理）
- **ログ検索**: 1億件のログから1秒以内に検索結果を返す（Elasticsearch活用）
- **レポート生成**: 複雑なレポートでも30秒以内に生成

#### キャッシュ戦略
- **コンプライアンス状況**: Redis cache（TTL: 1時間、ポリシー変更時に無効化）
- **頻繁に検索されるログ**: Redis cache（TTL: 5分）
- **集計レポート**: 日次バッチで事前計算、キャッシュ保持

#### 最適化ポイント
- **非同期ログ記録**: ログ記録をメッセージキュー経由で非同期化
- **パーティション**: 日付ベースでテーブルパーティション（高速検索）
- **インデックス活用**: `audit_logs(user_id, recorded_at)`, `audit_logs(action, recorded_at)`

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **全BC**: 全BCからのドメインイベントをサブスクライブして監査ログ記録
  - イベント: `*Created`, `*Updated`, `*Deleted`, `*Approved` など
- **BC-006: Knowledge Management & Learning** - コンプライアンスレポートの保存
  - 使用API: `POST /api/bc-006/documents` - 監査レポート保存

#### 提供API（他BCから利用）
- **全BC**: 監査ログ記録・検索機能を提供
  - `POST /api/bc-003/audit/logs` - 監査ログ記録
  - `GET /api/bc-003/audit/logs` - ログ検索
  - `GET /api/bc-003/compliance/status` - コンプライアンス状況取得

### データ整合性要件

#### トランザクション境界
- **監査ログ記録**: AuditLog + SecurityEvent を1トランザクションで作成
- **不変性保証**: 作成後の更新・削除は完全に禁止（データベーススキーマレベルで強制）
- **整合性レベル**: 最終的整合性（非同期イベント処理）

#### データ制約
- 監査ログは作成専用（INSERT ONLY、UPDATE/DELETE禁止）
- ハッシュチェーンの連続性（前ログハッシュの整合性）
- ログ保持期間: 最低7年間（コンプライアンス要件）

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003認証機能）
- **必要権限**:
  - ログ検索: `audit:read`
  - コンプライアンスレポート生成: `compliance:report:generate`
  - セキュリティアラート送信: `security:alert:send`

#### データ保護
- **機密度**: 監査ログはConfidential（最高機密）
- **暗号化**:
  - ログデータベース: TDE（Transparent Data Encryption）
  - ログアーカイブ: AES-256暗号化
- **アクセス制御**: 監査ログは監査担当者とシステム管理者のみアクセス可能

### スケーラビリティ制約

#### 最大同時処理
- **ログ記録**: 10,000イベント/秒（メッセージキュー経由）
- **ログ検索**: 100リクエスト/秒（Elasticsearch）
- **レポート生成**: 10リクエスト/秒

#### データ量上限
- **ログ保持**: 7年間（コンプライアンス要件）
- **ログ総数**: 100億件（パーティション・アーカイブ活用）
- **アーカイブ**: 1年経過後は低頻度アクセスストレージに移行

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **AuditLog Aggregate** ([../../domain/README.md#auditlog-aggregate](../../domain/README.md#auditlog-aggregate))
  - AuditLog（集約ルート）: 監査ログ
  - SecurityEvent: セキュリティイベント詳細
  - AccessLog: アクセスログ
  - ComplianceCheck: コンプライアンスチェック結果

#### Value Objects
- **EventType**: イベントタイプ（authentication/authorization/data_access）
- **Severity**: 重要度（info/warning/error/critical）
- **ComplianceStatus**: コンプライアンス状況（compliant/non_compliant/warning）

### 呼び出すAPI例

#### 監査ログ記録
```http
POST /api/v1/bc-003/audit/logs
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user-uuid",
  "action": "PROJECT_CREATED",
  "resource": "project:project-123",
  "ipAddress": "203.0.113.45",
  "userAgent": "Mozilla/5.0...",
  "success": true,
  "metadata": {
    "projectName": "新製品開発",
    "createdBy": "user-uuid"
  }
}

Response:
{
  "logId": "log-uuid",
  "recordedAt": "2025-11-03T10:00:00Z",
  "hashChain": "abc123def456..."
}
```

#### 監査ログ検索
```http
GET /api/v1/bc-003/audit/logs?userId=user-uuid&action=LOGIN&startDate=2025-11-01&endDate=2025-11-03&limit=100

Response:
{
  "total": 25,
  "logs": [
    {
      "logId": "log-uuid",
      "userId": "user-uuid",
      "action": "LOGIN",
      "ipAddress": "203.0.113.45",
      "success": true,
      "recordedAt": "2025-11-03T09:00:00Z"
    }
  ]
}
```

#### コンプライアンス状況取得
```http
GET /api/v1/bc-003/compliance/status?organizationId=org-123

Response:
{
  "organizationId": "org-123",
  "complianceStatus": "compliant",
  "checks": [
    {
      "checkType": "PASSWORD_POLICY",
      "status": "compliant",
      "lastCheckedAt": "2025-11-03T08:00:00Z"
    },
    {
      "checkType": "MFA_ENFORCEMENT",
      "status": "warning",
      "details": "50% of admins have not enabled MFA"
    }
  ]
}
```

#### セキュリティアラート発行
```http
POST /api/v1/bc-003/security/alerts
Content-Type: application/json

{
  "alertType": "SUSPICIOUS_ACTIVITY",
  "severity": "high",
  "userId": "user-uuid",
  "description": "Multiple login failures from unusual location",
  "details": {
    "ipAddress": "198.51.100.23",
    "failureCount": 5,
    "location": "Unknown"
  }
}
```

#### コンプライアンスレポート生成
```http
POST /api/v1/bc-003/compliance/reports
Content-Type: application/json

{
  "reportType": "GDPR_COMPLIANCE",
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  },
  "organizationId": "org-123",
  "format": "pdf"
}

Response:
{
  "reportId": "report-uuid",
  "generatedAt": "2025-11-03T10:00:00Z",
  "downloadUrl": "/api/bc-003/compliance/reports/report-uuid/download"
}
```

### データアクセスパターン

#### 読み取り
- **audit_logs テーブル**:
  - インデックス: `idx_audit_logs_user_id_recorded_at`（ユーザー別ログ）
  - インデックス: `idx_audit_logs_action_recorded_at`（アクション別ログ）
  - パーティション: 日付ベースパーティション（年月）
- **security_events テーブル**:
  - インデックス: `idx_security_events_severity_detected_at`（重要度別イベント）
- **compliance_checks テーブル**:
  - インデックス: `idx_compliance_checks_organization_id`（組織別チェック結果）

#### 書き込み
- **監査ログ記録**（非同期）:
  ```
  Message Queue → Audit Log Service → INSERT INTO audit_logs
  ```
- **ハッシュチェーン生成**:
  ```sql
  INSERT INTO audit_logs (
    id, user_id, action, resource, recorded_at, previous_log_hash, current_hash
  ) VALUES (
    'log-uuid', 'user-uuid', 'LOGIN', 'system',
    NOW(), (SELECT current_hash FROM audit_logs ORDER BY recorded_at DESC LIMIT 1),
    SHA256(CONCAT(previous_hash, 'log-data'))
  );
  ```

#### キャッシュアクセス
- **コンプライアンス状況キャッシュ**:
  ```
  Key: `compliance:org:{orgId}:status`
  Value: JSON（コンプライアンス状況）
  TTL: 3600秒（1時間）
  ```
- **頻繁に検索されるログ**:
  ```
  Key: `audit:recent:{userId}`
  Value: 最近の監査ログ（JSON配列）
  TTL: 300秒（5分）
  ```

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 監査ログを管理する | ログの記録と検索 | 3-4個 | audit-log-management |
| **OP-002**: コンプライアンスを監視する | 規制準拠の確認 | 2-3個 | compliance-monitoring |
| **OP-003**: セキュリティイベントを検知する | 脅威の早期発見 | 2-3個 | security-event-detection |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 7-10個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/secure-access-service/capabilities/audit-and-assure-security/](../../../../services/secure-access-service/capabilities/audit-and-assure-security/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-003 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
