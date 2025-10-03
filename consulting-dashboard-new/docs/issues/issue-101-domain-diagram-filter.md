# Issue #101: パラソルドメイン言語ダイアグラムにDDDステレオタイプフィルター機能を追加

## 概要
パラソル設計ページにおいて、パラソルドメイン言語のダイアグラム表示時にDDDステレオタイプによるフィルタリング機能を実装する。

## 背景
現在、ビジネスオペレーション設計のダイアグラムにはステレオタイプフィルターが実装されているが、パラソルドメイン言語のダイアグラムには同様のフィルター機能が存在しない。ドメインモデルが複雑になると、特定のステレオタイプ（Entity、Value Object、Aggregate等）のみを表示したいニーズがある。

## 要件

### 機能要件
1. **パラソルドメイン言語ダイアグラムへのフィルター追加**
   - ドメイン言語タブでダイアグラム表示時にフィルター機能を有効化
   - ビジネスオペレーション設計と同じUIデザインでフィルターを実装

2. **フィルター対象のDDDステレオタイプ**
   - Entity（エンティティ）
   - Value Object（値オブジェクト）
   - Aggregate（集約）
   - Service（サービス）
   - Repository（リポジトリ）
   - Factory（ファクトリ）
   - Event（イベント）
   - Specification（仕様）

3. **フィルター動作**
   - チェックボックスのON/OFFで表示/非表示を切り替え
   - フィルター適用時は該当要素の透明度を下げる（opacity: 0.2）
   - 「すべて表示」「すべて非表示」ボタンで一括操作

### 技術要件
- 既存のDiagramViewコンポーネントを拡張
- diagram-converterでドメイン言語からMermaidダイアグラムを生成する際にステレオタイプ情報を保持
- フィルター状態はコンポーネントのローカルステートで管理

## 実装ファイル
- `app/components/parasol/DiagramView.tsx` - フィルター機能の実装
- `lib/parasol/diagram-converter.ts` - ステレオタイプ情報の処理

## 受入条件
- [ ] パラソルドメイン言語のダイアグラムでフィルターが表示される
- [ ] 各ステレオタイプのチェックボックスが機能する
- [ ] フィルター適用時に該当要素の表示が変更される
- [ ] 一括操作ボタンが正常に動作する
- [ ] ビジネスオペレーション設計のフィルターと同じUIである

## 実装ステータス
- [x] ビジネスオペレーション設計のフィルター実装完了
- [ ] パラソルドメイン言語のフィルター実装
- [x] Mermaidクラス図のエラー修正完了（Parse error解決）

## 新たに発見された問題
### Mermaidクラス図の要素欠損問題
**症状**: エラーは解決したが、アグリゲート、リレーションなどの重要な要素がほぼ表示されなくなった

**影響範囲**:
- 集約（Aggregate）の関係性が表示されない
- エンティティ間のリレーションが大幅に減少
- ドメインモデルの構造が不完全に表示される

**緊急度**: 高（ダイアグラムの本質的な価値が損なわれている）

**原因分析が必要な箇所**:
- `lib/parasol/diagram-converter.ts`の関係定義ロジック
- `sanitizeNameForMermaid()`関数による名前変換
- 関係先の存在チェックロジックが過度に厳格になっている可能性

## 新たに発見された問題2
### ズーム倍率の永続化問題
**症状**: DiagramViewでズーム倍率を変更すると、他のサービスやダイアグラムに切り替えても倍率が保持される

**影響範囲**:
- あるサービスで200%に設定すると、他のサービスでも200%で表示される
- ダイアグラムタブを切り替えても倍率がリセットされない
- ユーザー体験を損なう（各ダイアグラムで適切な倍率が異なる）

**緊急度**: 中（操作性に影響）

**原因**:
- `DiagramView.tsx`のzoomステートがコンポーネント間で共有されている
- コンポーネントのアンマウント時にzoomがリセットされない

**解決策**:
- ダイアグラムタブ切り替え時にzoomを100%にリセット
- またはサービスごとに独立したzoom値を管理

## 新たに発見された問題3
### フィルター機能が動作しない問題
**症状**: DiagramViewのステレオタイプフィルターが機能していない

**影響範囲**:
- フィルターチェックボックスを操作してもダイアグラムの表示が変わらない
- opacity設定が適用されない
- フィルター機能が完全に動作していない

**緊急度**: 高（主要機能が動作しない）

**原因**:
- `DiagramView.tsx`のuseEffectでzoomとstereotypeFiltersの両方の変更を監視しているが、SVGの更新ロジックに問題がある可能性
- SVG要素の選択やクラス名の不一致
- Mermaidが生成するSVG構造との不整合

**解決策**:
- SVG要素の正確な選択方法を実装
- Mermaidが生成する実際のSVG構造を調査
- フィルター適用ロジックの修正

## 作業ログ

### 2024-12-30 パラソルドメイン言語ファイルの改善作業

#### 完了した作業
1. **collaboration-facilitation-serviceのDDD化**
   - すべてのエンティティに明確なステレオタイプを追加（`<<entity>>`, `<<aggregate root>>`, `<<value object>>`等）
   - 4つの集約を明確化：
     - WorkspaceAggregate（Workspace + Notification）
     - ChannelAggregate（Channel + Message + Thread + ChannelMember）
     - DocumentAggregate（Document + DocumentVersion）
     - MeetingAggregate（Meeting + MeetingParticipant）
   - 全エンティティを適切な集約に配置（孤立エンティティを解消）
   - ドメインサービスで集約間の連携を定義
   - ID参照による疎結合を徹底（外部キーのみで参照）

#### 特定した問題
1. **フィルター機能の前提条件**
   - Mermaidダイアグラムにステレオタイプ情報が含まれる必要がある
   - 現在のMDファイルは改善されたが、データベースに反映されていない
   - API経由での再投入が必要

2. **フィルター機能自体の実装**
   - DiagramView.tsxのフィルターロジックは実装済み
   - SVG要素の選択とopacity設定のロジックも実装済み
   - ステレオタイプの検出パターンも網羅的に実装済み

#### 次の作業予定
1. 改善されたドメイン言語MDファイルをAPI経由でデータベースに投入
2. 他の6サービスも同様にDDD原則に基づいて改善
3. フィルター機能の動作確認とテスト
4. **【新規】パラソルドメイン言語の仕様とテンプレートの修正**
   - 現在の各サービス改善で得られた知見を基に仕様を更新
   - DDD原則に基づいたテンプレートの改良
   - ステレオタイプマーキングの標準化

#### 技術的詳細
- ステレオタイプマーキング例：`#### User（ユーザー）<<entity>><<aggregate root>>`
- 集約境界の明確化：各集約の不変条件と責務を定義
- ドメインサービスの活用：`CollaborationCoordinator`, `DocumentCollaborationService`等
- 値オブジェクトの不変性：`equals()`と`validate()`メソッドを定義

### 2024-12-30 knowledge-co-creation-serviceのDDD化完了

#### 完了した作業
1. **knowledge-co-creation-serviceのDDD化**
   - すべてのエンティティに明確なステレオタイプを追加（`<<entity>>`, `<<aggregate root>>`, `<<value object>>`等）
   - 5つの集約を明確化：
     - KnowledgeAggregate（Knowledge + Document + KnowledgeRating）
     - BestPracticeAggregate（BestPractice）
     - ExpertAggregate（Expert）
     - QuestionAggregate（Question + Answer）
     - LearningAggregate（LearningPath + KnowledgeShare）
   - 全エンティティを適切な集約に配置（孤立エンティティを解消）
   - ドメインサービスで集約間の連携を定義：`KnowledgeSearchService`, `KnowledgeSharingCoordinator`, `LearningProgressService`
   - ID参照による疎結合を徹底（外部キーのみで参照）
   - リポジトリインターフェースの完全定義

#### 改善された構造
- **エンティティ**: Knowledge, Document, BestPractice, Expert, Question, Answer, LearningPath, KnowledgeShare（全て適切な集約に所属）
- **値オブジェクト**: KnowledgeRating, SearchQuery（不変性と等価性を明確化）
- **ドメインイベント**: KnowledgePublished, QuestionAsked, ExpertIdentified, KnowledgeShareScheduled（全てにステレオタイプマーキング）
- **集約境界**: 明確なトランザクション境界と不変条件を定義
- **疎結合設計**: 集約間はIDのみで参照し、直接のオブジェクト参照を排除

### 2024-12-30 productivity-visualization-serviceのDDD化完了

#### 完了した作業
1. **productivity-visualization-serviceのDDD化**
   - すべてのエンティティに明確なステレオタイプを追加（`<<entity>>`, `<<aggregate root>>`, `<<value object>>`等）
   - 3つの集約を明確化：
     - TimesheetAggregate（Timesheet + TimeEntry + ApprovalWorkflow + ApprovalStep）
     - WorkPatternAggregate（WorkPattern）
     - UtilizationAggregate（UtilizationRate + ProductivityMetric）
   - 全エンティティを適切な集約に配置（孤立エンティティを解消）
   - ドメインサービスで集約間の連携を定義：`TimesheetCalculationService`, `UtilizationAnalysisService`, `ProductivityMeasurementService`
   - ID参照による疎結合を徹底（外部キーのみで参照）
   - リポジトリインターフェースの完全定義（WorkPatternRepositoryを新規追加）

#### 改善された構造
- **エンティティ**: Timesheet, TimeEntry, WorkPattern, UtilizationRate, ProductivityMetric, ApprovalWorkflow, ApprovalStep（全て適切な集約に所属）
- **値オブジェクト**: TimeRange, ProductivityScore（不変性と等価性を明確化）
- **ドメインイベント**: TimesheetSubmitted, TimesheetApproved, OvertimeDetected, LowUtilizationAlert（全てにステレオタイプマーキング）
- **集約境界**: 工数管理、勤務パターン管理、稼働率分析の明確な境界を定義
- **疎結合設計**: 集約間はIDのみで参照し、直接のオブジェクト参照を排除

## スクリーンショット
### 現状（ビジネスオペレーション設計）
- フィルター機能が実装済み
- 右側パネルにステレオタイプフィルターが表示

### 期待される結果（パラソルドメイン言語）
- 同様のフィルター機能が必要
- ドメインモデルの要素をステレオタイプ別にフィルタリング可能