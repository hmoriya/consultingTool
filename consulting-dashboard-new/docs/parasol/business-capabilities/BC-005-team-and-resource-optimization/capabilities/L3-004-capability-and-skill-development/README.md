# L3-004: Capability & Skill Development

**作成日**: 2025-10-31
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: visualize-and-develop-skills, execute-skill-development

---

## 📋 What: この能力の定義

### 能力の概要
組織のスキルを可視化・育成する能力。スキルギャップ分析、スキルマトリックス作成、スキル開発プログラムの実施を通じて、組織能力を強化します。

### 実現できること
- スキルギャップの識別
- スキルマトリックスの作成と可視化
- スキル開発プログラムの計画と実施
- スキル習得状況の追跡
- 組織全体のスキルポートフォリオ管理

### 必要な知識
- スキルマネジメント手法
- ギャップ分析技法
- 人材開発プログラム設計
- 学習効果測定
- コンピテンシーモデル

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: SkillAggregate ([../../domain/README.md](../../domain/README.md#skill-aggregate))
- **Entities**: Skill, SkillCategory, SkillMatrix, SkillDevelopmentProgram
- **Value Objects**: SkillLevel, ProficiencyScore, SkillGap, LearningProgress

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - GET /api/skills/gaps - ギャップ分析
  - POST /api/skills/matrix - マトリックス作成
  - POST /api/skills/develop - スキル開発実施

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: skills, skill_categories, skill_matrices, user_skills, skill_development_programs

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: スキルギャップを分析する | 必要スキルと現状の差分 | 2-3個 | analyze-skill-gaps |
| **OP-002**: スキルマトリックスを作成する | 組織スキルの可視化 | 2個 | create-skill-matrix |
| **OP-003**: スキル開発を実施する | 研修・OJTの実施 | 2-3個 | execute-skill-development (統合) |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 6-8個
- **V2からの移行**: execute-skill-development を統合（重複解消）

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/capabilities/visualize-and-develop-skills/](../../../../services/talent-optimization-service/capabilities/visualize-and-develop-skills/)
> - [services/talent-optimization-service/capabilities/execute-skill-development/](../../../../services/talent-optimization-service/capabilities/execute-skill-development/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-004 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
