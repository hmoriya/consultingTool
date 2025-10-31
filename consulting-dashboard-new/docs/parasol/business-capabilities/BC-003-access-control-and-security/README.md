# BC-003: Access Control & Security

**作成日**: 2025-10-31
**バージョン**: 1.0.0 (v3.0)
**移行元**: secure-access-service (V2) - セキュリティ関連機能のみ

---

## 🎯 Why: ビジネス価値

このBCが解決するビジネス課題:
- 不正アクセスによる機密情報漏洩のリスク
- 権限管理の不備による不適切なデータアクセス
- セキュリティインシデントの検知遅延
- コンプライアンス要件への対応不足
- 監査証跡の不足による説明責任の欠如

提供するビジネス価値:
- **セキュアアクセス**: 多要素認証により、不正アクセスを防止
- **適切な権限管理**: きめ細かなアクセス制御により、情報漏洩リスクを最小化
- **早期脅威検知**: リアルタイムセキュリティ監視により、インシデントを早期発見
- **コンプライアンス準拠**: 業界標準に準拠したセキュリティ体制の構築
- **完全な監査証跡**: 全アクセスログの記録により、説明責任を果たす

---

## 📋 What: 機能（L3能力）

このBCが提供する能力:

### L3-001: Identity & Authentication
**能力**: ユーザーの身元を確認し、認証する
- ユーザー登録と管理
- パスワード管理
- 多要素認証（MFA）
- シングルサインオン（SSO）
- 詳細: [capabilities/L3-001-identity-and-authentication/](capabilities/L3-001-identity-and-authentication/)

### L3-002: Authorization & Access Control
**能力**: リソースへのアクセスを制御する
- ロールと権限の定義
- 権限の付与と管理
- アクセス権限の監査とレビュー
- 詳細: [capabilities/L3-002-authorization-and-access-control/](capabilities/L3-002-authorization-and-access-control/)

### L3-003: Audit, Compliance & Governance
**能力**: セキュリティを監査し、コンプライアンスを保証する
- 監査ログの管理
- コンプライアンスモニタリング
- セキュリティイベントの検知
- セキュリティレポートの生成
- 詳細: [capabilities/L3-003-audit-compliance-and-governance/](capabilities/L3-003-audit-compliance-and-governance/)

---

## 🏗️ How: 設計方針

### ドメイン設計
- [domain/README.md](domain/README.md)
- **主要集約**: User Aggregate, Permission Aggregate, AuditLog Aggregate
- **主要エンティティ**: User, Role, Permission, Session, AuditLog, SecurityEvent
- **主要値オブジェクト**: Credential, AccessToken, SecurityPolicy

**V2からの移行**:
- `services/secure-access-service/domain-language.md` → `domain/`へ分割整理
- 組織構造管理機能はBC-004へ分離

### API設計
- [api/README.md](api/README.md)
- **API仕様**: [api/api-specification.md](api/api-specification.md) ← Issue #146対応済み
- **エンドポイント**: [api/endpoints/](api/endpoints/)
- **スキーマ**: [api/schemas/](api/schemas/)

**V2からの移行**:
- `services/secure-access-service/api/api-specification.md` → `api/api-specification.md`
- Issue #146のWHAT/HOW分離構造を維持

### データ設計
- [data/README.md](data/README.md)
- **データベース設計**: [data/database-design.md](data/database-design.md)
- **主要テーブル**: users, roles, permissions, role_permissions, sessions, audit_logs, security_events
- **データフロー**: [data/data-flow.md](data/data-flow.md)

**V2からの移行**:
- `services/secure-access-service/database-design.md` → `data/database-design.md`
- 組織構造テーブルはBC-004へ移行

---

## 📦 BC境界

### トランザクション境界
- **BC内のL3/Operation間**: 強整合性
  - User → Session の一貫性保証
  - Role → Permission の関連性維持
  - AuditLog の完全性保証
- **BC間**: 結果整合性（イベント駆動）
  - 全BC への認証・認可サービス提供

### 他BCとの連携

#### 全BC共通（BC-001, BC-002, BC-004, BC-005, BC-006, BC-007）
- **連携内容**: 認証・認可・監査機能の提供
- **連携方向**: 全BC → BC-003（認証・認可要求）
- **連携方式**: ユースケース呼び出し型（認証API、権限検証API）

#### BC-004: Organizational Structure & Governance
- **連携内容**: 組織構造情報の参照
- **連携方向**: BC-003 → BC-004（組織情報照会）
- **連携方式**: ユースケース呼び出し型（組織構造API）

#### BC-007: Team Communication & Collaboration
- **連携内容**: セキュリティアラート、監査通知
- **連携方向**: BC-003 → BC-007（通知イベント）
- **連携方式**: イベント駆動（SecurityAlertRaised, AuditReportGenerated）

---

## 📊 統計情報

### V2からの移行統計
- **V2 Capabilities**: 4個（secure-access-service全体）
- **V3 L3 Capabilities**: 3個（セキュリティ機能のみ）
- **Operations数**: 9個
- **統合アクション**:
  - ✅ 組織構造管理をBC-004に分離
  - ✅ セキュリティ機能に特化

### 規模
- **L3 Capabilities**: 3個（ガイドライン準拠）
- **1 L3あたりOperation数**: 3.0個（ガイドライン準拠）
- **推定UseCase数**: 12-15個

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このBCはV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/secure-access-service/](../../services/secure-access-service/) - セキュリティ機能のみ
>
> V2構造は2026年1月まで参照可能です（読み取り専用）。

### V2 Capabilityマッピング

| V2 Capability | V3 L3 Capability | 備考 |
|--------------|------------------|------|
| authenticate-and-manage-users | L3-001: Identity & Authentication | 移行完了 |
| control-access-permissions | L3-002: Authorization & Access Control | 移行完了 |
| audit-and-assure-security | L3-003: Audit, Compliance & Governance | 移行完了 |
| manage-organizational-structure | BC-004に移行 | 戦略的分離 |

---

## ✅ 品質基準

### 成功指標
- [ ] 認証成功率 ≥ 99.9%
- [ ] MFA有効化率 ≥ 90%
- [ ] 不正アクセス検知率 ≥ 95%
- [ ] セキュリティインシデント対応時間 ≤ 30分
- [ ] 監査ログ完全性 = 100%

### アーキテクチャ品質
- [x] L3 Capability数が3-5個の範囲（3個）
- [x] 各L3のOperation数が2-4個の範囲
- [x] BC間依存が適切に定義されている
- [x] Issue #146（API WHAT/HOW分離）に準拠

---

## 📚 関連ドキュメント

### 必須参照
- [V2_V3_MAPPING.md](../../V2_V3_MAPPING.md) - V2→V3詳細マッピング
- [MIGRATION_STATUS.md](../../MIGRATION_STATUS.md) - 移行ステータス
- [V2_V3_COEXISTENCE_STRATEGY.md](../../V2_V3_COEXISTENCE_STRATEGY.md) - 共存戦略

### 設計ガイド
- [parasol-design-process-guide.md](../../parasol-design-process-guide.md) - v3.0対応プロセス

### Issue #146関連
- API WHAT/HOW分離ガイド（Issue #146対応）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | BC-003 README初版作成（Phase 0） | Claude |

---

**ステータス**: Phase 0 - アーキテクチャレビュー準備完了
**次のアクション**: L3 Capabilityディレクトリとドキュメントの作成
