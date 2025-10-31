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
