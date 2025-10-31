# L3-002: Project Execution & Delivery

**作成日**: 2025-10-31
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: plan-and-execute-project

---

## 📋 What: この能力の定義

### 能力の概要
プロジェクトの立ち上げから完了まで、実行フェーズ全体を管理する能力。プロジェクトキックオフ、進捗モニタリング、ステークホルダー管理、プロジェクトクロージャまでをカバーします。

### 実現できること
- プロジェクトキックオフの実施
- 進捗状況のモニタリングと報告
- ステークホルダーとのコミュニケーション管理
- プロジェクト完了評価の実施
- 教訓のドキュメント化

### 必要な知識
- プロジェクトライフサイクル管理
- ステークホルダー管理技法
- 進捗管理手法（EVMなど）
- プロジェクトクロージャプロセス
- レトロスペクティブ手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: ProjectExecutionAggregate ([../../domain/README.md](../../domain/README.md#project-execution-aggregate))
- **Entities**: Project, ProjectMember, StakeholderEngagement, ProgressReport, LessonsLearned
- **Value Objects**: ProjectStatus, CompletionRate, StakeholderSatisfaction

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/projects/{id}/launch - プロジェクト開始
  - PUT /api/projects/{id}/execute - 実行状況更新
  - POST /api/projects/{id}/monitor - 進捗監視
  - POST /api/projects/{id}/complete - プロジェクト完了

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: projects, project_members, stakeholders, progress_reports, lessons_learned

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: プロジェクトを立ち上げる | キックオフとチーム編成 | 2-3個 | launch-project |
| **OP-002**: プロジェクトを実行・監視する | 日常的な実行管理 | 3-4個 | execute-and-monitor-project |
| **OP-003**: プロジェクトを完了・評価する | クロージャと振り返り | 2-3個 | complete-and-evaluate-project |

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
> - [services/project-success-service/capabilities/plan-and-execute-project/](../../../../services/project-success-service/capabilities/plan-and-execute-project/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-002 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
