# L3-002: Team Formation & Composition

**作成日**: 2025-10-31
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: form-and-optimize-teams

---

## 📋 What: この能力の定義

### 能力の概要
効果的なチームを編成・最適化する能力。チーム編成、構成最適化、パフォーマンス監視を通じて、高パフォーマンスチームを実現します。

### 実現できること
- プロジェクトに最適なチーム編成
- チーム構成の継続的最適化
- チームパフォーマンスの監視
- チームダイナミクスの分析
- チーム間のシナジー創出

### 必要な知識
- チームビルディング理論
- チームダイナミクス
- パフォーマンス管理
- 多様性管理
- チーム最適化手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: TeamAggregate ([../../domain/README.md](../../domain/README.md#team-aggregate))
- **Entities**: Team, TeamMember, TeamRole, TeamPerformance
- **Value Objects**: TeamComposition, TeamSize, PerformanceScore, TeamDynamics

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/teams - チーム作成
  - PUT /api/teams/{id}/optimize - 構成最適化
  - GET /api/teams/{id}/performance - パフォーマンス監視

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: teams, team_members, team_roles, team_performance_metrics

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: チームを編成する | 新規チームの構築 | 2-3個 | form-teams |
| **OP-002**: チーム構成を最適化する | メンバー構成の改善 | 2-3個 | optimize-team-composition |
| **OP-003**: チームパフォーマンスを監視する | 継続的なパフォーマンス追跡 | 2-3個 | monitor-team-performance |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 6-9個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/capabilities/form-and-optimize-teams/](../../../../services/talent-optimization-service/capabilities/form-and-optimize-teams/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-002 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
