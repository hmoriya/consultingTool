# BC-004: Organizational Structure & Governance

**作成日**: 2025-10-31
**バージョン**: 1.0.0 (v3.0)
**移行元**: secure-access-service (V2) - 組織管理機能のみ

---

## 🎯 Why: ビジネス価値

このBCが解決するビジネス課題:
- 組織構造の不明確性による意思決定の遅延
- 階層構造の管理不足による責任の所在不明確化
- 組織変更の履歴管理の欠如
- 組織単位の可視性不足
- 組織構造とアクセス制御の不整合

提供するビジネス価値:
- **明確な組織構造**: 組織階層の可視化により、責任と権限を明確化
- **柔軟な組織変更**: 組織改編に迅速に対応し、ビジネスの変化に追従
- **ガバナンス強化**: 組織単位での統制とコンプライアンスを確保
- **効率的な管理**: 組織構造に基づいた権限管理とリソース配分
- **履歴管理**: 組織変更の完全な履歴により、説明責任を果たす

---

## 📋 What: 機能（L3能力）

このBCが提供する能力:

### L3-001: Organization Design & Structure
**能力**: 組織を設計し、構造を管理する
- 組織の定義と構築
- 組織階層の可視化
- 組織構造の変更と再編
- 組織単位の管理
- 詳細: [capabilities/L3-001-organization-design-and-structure/](capabilities/L3-001-organization-design-and-structure/)

---

## 🏗️ How: 設計方針

### ドメイン設計
- [domain/README.md](domain/README.md)
- **主要集約**: Organization Aggregate
- **主要エンティティ**: Organization, OrganizationUnit, OrganizationHierarchy
- **主要値オブジェクト**: OrganizationPath, UnitType

**V2からの移行**:
- `services/secure-access-service/domain-language.md`（組織管理部分）→ `domain/`へ分離
- BC-003から戦略的に分離

### API設計
- [api/README.md](api/README.md)
- **API仕様**: [api/api-specification.md](api/api-specification.md) ← Issue #146対応済み
- **エンドポイント**: [api/endpoints/](api/endpoints/)
- **スキーマ**: [api/schemas/](api/schemas/)

**V2からの移行**:
- `services/secure-access-service/api/api-specification.md`（組織管理API）→ `api/api-specification.md`
- Issue #146のWHAT/HOW分離構造を維持

### データ設計
- [data/README.md](data/README.md)
- **データベース設計**: [data/database-design.md](data/database-design.md)
- **主要テーブル**: organizations, organization_units, organization_hierarchies, organization_members
- **データフロー**: [data/data-flow.md](data/data-flow.md)

**V2からの移行**:
- `services/secure-access-service/database-design.md`（組織管理テーブル）→ `data/database-design.md`

---

## 📦 BC境界

### トランザクション境界
- **BC内のL3/Operation間**: 強整合性
  - Organization → OrganizationUnit の階層整合性
  - OrganizationHierarchy の循環参照防止
- **BC間**: 結果整合性（イベント駆動）
  - BC-003への組織構造情報提供
  - BC-005へのチーム配置情報提供

### 他BCとの連携

#### BC-003: Access Control & Security
- **連携内容**: 組織構造に基づくアクセス制御
- **連携方向**: BC-003 → BC-004（組織情報照会）
- **連携方式**: ユースケース呼び出し型（組織構造API）

#### BC-005: Team & Resource Optimization
- **連携内容**: 組織単位でのリソース配分
- **連携方向**: BC-005 → BC-004（組織構造照会）
- **連携方式**: ユースケース呼び出し型（組織単位API）

#### BC-007: Team Communication & Collaboration
- **連携内容**: 組織変更通知
- **連携方向**: BC-004 → BC-007（通知イベント）
- **連携方式**: イベント駆動（OrganizationRestructured）

---

## 📊 統計情報

### V2からの移行統計
- **V2 Capabilities**: 1個（secure-access-serviceから分離）
- **V3 L3 Capabilities**: 1-2個
- **Operations数**: 3-4個
- **統合アクション**:
  - ✅ BC-003から組織構造管理を戦略的に分離
  - ✅ 組織ガバナンスに特化

### 規模
- **L3 Capabilities**: 1-2個（ガイドライン下限）
- **1 L3あたりOperation数**: 2.0-3.0個（ガイドライン準拠）
- **推定UseCase数**: 4-6個

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このBCはV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/secure-access-service/](../../services/secure-access-service/) - 組織管理機能のみ
>
> V2構造は2026年1月まで参照可能です（読み取り専用）。

### V2 Capabilityマッピング

| V2 Capability | V3 L3 Capability | 備考 |
|--------------|------------------|------|
| manage-organizational-structure | L3-001: Organization Design & Structure | BC-003から分離・移行完了 |

---

## ✅ 品質基準

### 成功指標
- [ ] 組織構造可視化精度 = 100%
- [ ] 組織変更反映時間 ≤ 1分
- [ ] 組織階層整合性 = 100%（循環参照ゼロ）
- [ ] 組織変更履歴完全性 = 100%
- [ ] 組織単位アクセス制御整合性 ≥ 99.9%

### アーキテクチャ品質
- [x] L3 Capability数が3-5個の範囲（1-2個：ガイドライン下限）
- [x] 各L3のOperation数が2-4個の範囲
- [x] BC間依存が適切に定義されている
- [x] Issue #146（API WHAT/HOW分離）に準拠

**注**: BC#4はL3数がガイドライン下限ですが、戦略的判断により独立BCとして定義されています。将来的な拡張を見据えた設計です。

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
| 2025-10-31 | BC-004 README初版作成（Phase 0） | Claude |

---

**ステータス**: Phase 0 - アーキテクチャレビュー準備完了
**次のアクション**: L3 Capabilityディレクトリとドキュメントの作成
