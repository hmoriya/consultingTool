# BC-001: タスク管理 - Bounded Context設計書

## 概要

タスクのライフサイクル全体を管理し、チームコラボレーションとパフォーマンス監視を統合した包括的なタスク管理システムの設計です。

## ビジネス価値

### 主要な価値提案
1. **生産性向上**: タスクの可視化と効率的な進捗管理
2. **品質保証**: レビューとQAプロセスの統合
3. **チームコラボレーション**: リアルタイムな情報共有と協力
4. **データ駆動の改善**: パフォーマンス分析による継続的改善

### 成功指標
- タスク完了率: 95%以上
- 平均処理時間: 従来比30%短縮
- チーム満足度: 4.5/5.0以上
- 品質スコア: 90%以上

## BC-001のスコープ

### 含まれる概念
- **タスク**: 作業単位の管理
- **プロジェクト**: タスクのグループ化
- **チームメンバー**: タスクの実行者・レビュアー
- **進捗状態**: タスクのライフサイクル状態
- **依存関係**: タスク間の前後関係
- **リソース**: タスク実行に必要な人的・物的資源
- **品質指標**: タスクの品質評価基準

### 境界
- **含む**: タスクの作成〜完了〜分析のライフサイクル全体
- **含まない**: 人事評価、給与計算、外部システム連携

## L3 Capability構成（3個）

### cap-001-task-lifecycle: タスクライフサイクル能力
タスクの作成から完了までの基本的なライフサイクルを管理する能力

**対応Operation**:
- op-001-create-task: タスク作成
- op-002-assign-task: タスク割り当て
- op-004-complete-task: タスク完了

### cap-002-task-collaboration: タスクコラボレーション能力
チーム間でのタスク協力とレビューを促進する能力

**対応Operation**:
- op-003-update-progress: 進捗更新
- op-005-review-task: タスクレビュー
- op-006-collaborate-task: タスク協力

### cap-003-task-monitoring: タスク監視能力
タスクの進捗監視とパフォーマンス分析を提供する能力

**対応Operation**:
- op-007-monitor-progress: 進捗監視
- op-008-analyze-performance: パフォーマンス分析

## Operation構成（8個）

| ID | Operation名 | 説明 | Capability |
|----|-----------|----|------------|
| op-001 | create-task | 新しいタスクを作成し、基本情報を設定する | cap-001 |
| op-002 | assign-task | タスクを適切なチームメンバーに割り当てる | cap-001 |
| op-003 | update-progress | タスクの進捗状況を更新し、関係者に通知する | cap-002 |
| op-004 | complete-task | タスクを完了状態にし、成果物を確定する | cap-001 |
| op-005 | review-task | タスクの品質レビューを実施し、承認/差し戻しを行う | cap-002 |
| op-006 | collaborate-task | チームメンバー間でタスクに関する協力を行う | cap-002 |
| op-007 | monitor-progress | プロジェクト全体の進捗を監視し、問題を早期発見する | cap-003 |
| op-008 | analyze-performance | タスクの実績データを分析し、改善点を特定する | cap-003 |

## UseCase構成（12個）

| ID | UseCase名 | 説明 | Page | Operation |
|----|----------|----|----|-----------|
| uc-001 | task-creation | 新規タスクの作成 | page-001 | op-001 |
| uc-002 | task-assignment | タスクの割り当て | page-004 | op-002 |
| uc-003 | progress-update | 進捗の更新 | page-003 | op-003 |
| uc-004 | task-completion | タスクの完了 | page-003 | op-004 |
| uc-005 | task-review | タスクのレビュー | page-007 | op-005 |
| uc-006 | task-collaboration | チーム協力 | page-006 | op-006 |
| uc-007 | progress-monitoring | 進捗監視 | page-005 | op-007 |
| uc-008 | performance-analysis | パフォーマンス分析 | page-008 | op-008 |
| uc-009 | task-escalation | タスクエスカレーション | page-009 | op-007 |
| uc-010 | dependency-management | 依存関係管理 | page-010 | op-007 |
| uc-011 | resource-allocation | リソース配分 | page-011 | op-002 |
| uc-012 | quality-assurance | 品質保証 | page-012 | op-005 |

## Page構成（12個）

| ID | Page名 | 説明 | 主要機能 | UseCase |
|----|--------|----|---------|---------|
| page-001 | task-creation | タスク作成ページ | タスク情報入力、優先度設定 | uc-001 |
| page-002 | task-list | タスク一覧ページ | フィルタ、ソート、検索 | - |
| page-003 | task-detail | タスク詳細ページ | 詳細表示、進捗更新、完了 | uc-003, uc-004 |
| page-004 | task-assignment | タスク割り当てページ | メンバー選択、スキルマッチング | uc-002, uc-011 |
| page-005 | progress-dashboard | 進捗ダッシュボード | 進捗可視化、アラート表示 | uc-007 |
| page-006 | collaboration-workspace | 協力ワークスペース | チャット、ファイル共有 | uc-006 |
| page-007 | review-dashboard | レビューダッシュボード | レビュー待ち一覧、承認履歴 | uc-005, uc-012 |
| page-008 | analytics-dashboard | 分析ダッシュボード | KPI表示、トレンド分析 | uc-008 |
| page-009 | escalation-management | エスカレーション管理 | 問題タスク一覧、対応履歴 | uc-009 |
| page-010 | dependency-view | 依存関係ビュー | 依存関係図、クリティカルパス | uc-010 |
| page-011 | resource-allocation | リソース配分ページ | 人員配置、負荷分散 | uc-011 |
| page-012 | quality-dashboard | 品質ダッシュボード | 品質指標、改善提案 | uc-012 |

## ドメイン言語

### 主要エンティティ
- **Task**: タスク（ID、タイトル、説明、ステータス、優先度、期限）
- **Project**: プロジェクト（ID、名前、説明、開始日、終了日）
- **TeamMember**: チームメンバー（ID、名前、役割、スキル）
- **TaskAssignment**: タスク割り当て（タスクID、メンバーID、割り当て日）
- **ProgressUpdate**: 進捗更新（ID、タスクID、進捗率、更新日、コメント）

### 主要値オブジェクト
- **TaskStatus**: タスクステータス（Todo, InProgress, Review, Done, Blocked）
- **Priority**: 優先度（High, Medium, Low）
- **SkillLevel**: スキルレベル（Beginner, Intermediate, Advanced, Expert）

### 集約
- **TaskAggregate**: タスクを中心とした集約
- **ProjectAggregate**: プロジェクトを中心とした集約

## 技術仕様

### データ永続化
- SQLiteデータベース
- Prisma ORM

### API設計
- RESTful API
- Next.js Server Actions

### UI技術
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui

## 実装優先度

### Phase 1（高優先度）
1. **op-001-create-task**: タスク作成（基盤機能）
2. **op-002-assign-task**: タスク割り当て（基盤機能）
3. **uc-001-task-creation**: タスク作成UseCase
4. **page-001-task-creation**: タスク作成ページ

### Phase 2（中優先度）
5. **op-003-update-progress**: 進捗更新
6. **op-004-complete-task**: タスク完了
7. **uc-003-progress-update**: 進捗更新UseCase
8. **page-003-task-detail**: タスク詳細ページ

### Phase 3（低優先度）
9. レビュー・監視機能
10. 分析・レポート機能

## 次のステップ

1. **L3 Capability定義作成** → `l3-capabilities/`
2. **Operation詳細設計作成** → `operations/`
3. **UseCase設計作成** → `usecases/`
4. **ページ定義作成** → `pages/`
5. **ドメイン言語詳細化** → `domain-language/`

## 更新履歴

- 2025-11-05: BC-001設計書を作成（Issue #199対応）