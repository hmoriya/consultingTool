# L3-003: Talent Development & Performance

**作成日**: 2025-10-31
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: manage-and-develop-members

---

## 📋 What: この能力の定義

### 能力の概要
人材を育成しパフォーマンスを向上させる能力。メンバー管理、パフォーマンス評価、キャリア開発を通じて、組織の人的資本を最大化します。

### 実現できること
- メンバー情報の一元管理
- 定期的なパフォーマンス評価
- キャリア開発計画の策定
- フィードバックと育成支援
- 後継者計画の策定

### 必要な知識
- 人材育成手法
- パフォーマンス管理フレームワーク
- キャリア開発理論
- フィードバック技法
- タレントマネジメント

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: TalentAggregate ([../../domain/README.md](../../domain/README.md#talent-aggregate))
- **Entities**: Member, PerformanceReview, CareerPlan, DevelopmentGoal
- **Value Objects**: PerformanceRating, CareerStage, DevelopmentStatus

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/members - メンバー登録
  - POST /api/performance/reviews - 評価実施
  - POST /api/careers/plans - キャリア計画

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: members, performance_reviews, career_plans, development_goals

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: メンバーを登録・管理する | 基本情報の管理 | 2-3個 | register-and-manage-members |
| **OP-002**: パフォーマンスを評価する | 定期評価の実施 | 2-3個 | evaluate-performance |
| **OP-003**: キャリアを開発・支援する | キャリアパス策定 | 2-3個 | develop-and-support-career |

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
> - [services/talent-optimization-service/capabilities/manage-and-develop-members/](../../../../services/talent-optimization-service/capabilities/manage-and-develop-members/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-003 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
