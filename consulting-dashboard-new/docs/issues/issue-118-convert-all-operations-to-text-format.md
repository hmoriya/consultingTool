# Issue #118: 全ビジネスオペレーションをMermaid形式からテキスト形式に変換

**作成日**: 2025-10-03
**Issue URL**: https://github.com/hmoriya/consultingTool/issues/118
**担当**: 未定
**優先度**: High

## 概要

現在、55個のビジネスオペレーションのうち54個がMermaid形式でプロセスフローを定義しています。Issue #117で「パスワードを管理する」オペレーションのみをテキスト形式に変換しましたが、システム全体の一貫性を保つため、全てのビジネスオペレーションをテキスト形式に統一する必要があります。

## 背景

### 現状
- **総ビジネスオペレーション数**: 55個
- **Mermaid形式使用**: 54個（ほぼ全て）
- **テキスト形式**: 1個（「パスワードを管理する」のみ）

### テキスト形式の利点
1. **代替フローと例外フローの視覚的分離**
   - 代替フロー：黄色ノードで表示
   - 例外フロー：オレンジノードで表示
2. **自動フローチャート生成機能の活用**
   - `diagram-converter.ts`のoperationToFlowDiagramメソッドが最適化済み
3. **編集の容易さ**
   - Markdownのリスト形式で直感的
4. **パース処理の簡素化**
   - 保守性とパフォーマンスの向上

## 問題点

現在のMermaid形式では以下の機能が利用できません：
- 代替フローの黄色ノード表示
- 例外フローのオレンジノード表示
- プロセスフローの自動分離と色分け

## 解決策

### 変換対象ファイル（55個）

#### 1. セキュアアクセスサービス（15個）
```
/docs/parasol/services/secure-access-service/capabilities/authenticate-and-manage-users/operations/
- implement-multi-factor-authentication/operation.md
- manage-passwords/operation.md ✅（変換済み）
- register-and-authenticate-users/operation.md

/docs/parasol/services/secure-access-service/capabilities/control-access-permissions/operations/
- audit-and-review-permissions/operation.md
- define-roles-and-permissions/operation.md
- grant-and-manage-permissions/operation.md

/docs/parasol/services/secure-access-service/capabilities/manage-organizational-structure/operations/
- change-and-reorganize-structure/operation.md
- define-and-build-organization/operation.md
- visualize-organizational-hierarchy/operation.md

/docs/parasol/services/secure-access-service/capabilities/audit-and-assure-security/operations/
- audit-and-report-compliance/operation.md
- detect-and-analyze-security-events/operation.md
- record-and-store-audit-logs/operation.md
```

#### 2. プロジェクト成功支援サービス（15個）
```
/docs/parasol/services/project-success-service/capabilities/plan-and-execute-project/operations/
- launch-project/operation.md
- execute-and-monitor-project/operation.md
- complete-and-evaluate-project/operation.md

/docs/parasol/services/project-success-service/capabilities/manage-and-complete-tasks/operations/
- decompose-and-define-tasks/operation.md
- assign-and-execute-tasks/operation.md
- track-task-progress/operation.md

/docs/parasol/services/project-success-service/capabilities/foresee-and-handle-risks/operations/
- identify-and-assess-risks/operation.md
- plan-risk-response/operation.md
- monitor-and-handle-risks/operation.md

/docs/parasol/services/project-success-service/capabilities/manage-and-ensure-deliverable-quality/operations/
- define-and-create-deliverables/operation.md
- review-and-approve-deliverables/operation.md
- version-control-deliverables/operation.md
```

#### 3. タレント最適化サービス（12個）
```
/docs/parasol/services/talent-optimization-service/capabilities/manage-and-develop-members/operations/
- register-and-manage-members/operation.md
- evaluate-performance/operation.md
- develop-and-support-career/operation.md

/docs/parasol/services/talent-optimization-service/capabilities/form-and-optimize-teams/operations/
- form-teams/operation.md
- monitor-team-performance/operation.md
- optimize-team-composition/operation.md

/docs/parasol/services/talent-optimization-service/capabilities/visualize-and-develop-skills/operations/
- create-skill-matrix/operation.md
- analyze-skill-gaps/operation.md
- execute-skill-development/operation.md

/docs/parasol/services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/
- forecast-resource-demand/operation.md
- allocate-resources/operation.md
- optimize-resource-utilization/operation.md
```

#### 4. 生産性可視化サービス（3個）
```
/docs/parasol/services/productivity-visualization-service/capabilities/workload-tracking/operations/
- record-time/operation.md
- approve-timesheet/operation.md
- analyze-utilization/operation.md
```

#### 5. ナレッジ共創サービス（3個）
```
/docs/parasol/services/knowledge-co-creation-service/capabilities/knowledge-management/operations/
- apply-knowledge/operation.md
- capture-knowledge/operation.md
- share-knowledge/operation.md
```

#### 6. 収益最適化サービス（13個）
```
/docs/parasol/services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/
- recognize-and-record-revenue/operation.md
- issue-invoice-and-manage-collection/operation.md
- forecast-and-maximize-revenue/operation.md

/docs/parasol/services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/
- record-and-categorize-costs/operation.md
- analyze-cost-trends/operation.md
- allocate-and-optimize-costs/operation.md

/docs/parasol/services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/
- formulate-budget/operation.md
- monitor-and-control-budget/operation.md
- revise-and-reallocate-budget/operation.md
- approve-and-finalize-budget/operation.md

/docs/parasol/services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/
- calculate-profitability/operation.md
- propose-improvement-actions/operation.md
- forecast-and-optimize-cashflow/operation.md
- analyze-profitability-trends/operation.md
```

#### 7. コラボレーション促進サービス（3個）
```
/docs/parasol/services/collaboration-facilitation-service/capabilities/communication-delivery/operations/
- send-notification/operation.md
- facilitate-communication/operation.md
- manage-meetings/operation.md
```

### 変換仕様

#### 変換前（Mermaid形式）:
```markdown
## プロセスフロー

```mermaid
flowchart LR
    A[ユーザー申請] --> B[情報確認]
    B --> C[アカウント作成]
    C --> D[初期パスワード発行]
    D --> E[アカウント通知]
```

#### 変換後（テキスト形式）:
```markdown
## プロセスフロー

> **重要**: プロセスフローは必ず番号付きリスト形式で記述してください。
> Mermaid形式は使用せず、テキスト形式で記述することで、代替フローと例外フローが視覚的に分離されたフローチャートが自動生成されます。

1. ユーザーがアカウント申請を行う
2. システムが申請情報を確認する
3. システムがアカウントを作成する
4. システムが初期パスワードを発行する
5. システムがアカウント通知を送信する

## 代替フロー

### 代替フロー1: 情報不備
- 2-1. システムが申請情報の不備を検知する
- 2-2. システムが修正要求を送信する
- 2-3. ユーザーが情報を修正し再申請する
- 2-4. 基本フロー2に戻る

## 例外処理

### 例外1: システムエラー
- システムエラーが発生した場合
- エラーメッセージを表示する
- 管理者に通知する
```

### 重要な注意点

1. **ビジネス状態図は変更しない**
   - 状態遷移図（stateDiagram-v2）はMermaid形式を維持
   - プロセスフロー（flowchart）のみテキスト形式に変換

2. **代替フローと例外処理の追加**
   - 既存のMermaidから分岐や例外を抽出
   - テキスト形式で代替フローと例外処理を明記

3. **文字エンコーディング**
   - UTF-8エンコーディングで保存
   - ANSIエスケープシーケンスの除去

## 期待される結果

変換後は以下のようなフローチャートが自動生成されること：

1. **基本フロー**：青色のノード（`[]`）
2. **代替フロー**：黄色のノード（`{}`）、点線矢印
3. **例外フロー**：オレンジ色のノード（`{{}}`）、点線矢印

## 影響範囲

### 変更対象
- **MDファイル**: 55個のoperation.mdファイル
- **データベース**: `business_operations`テーブルのdesignカラム

### 影響を受けないコンポーネント
- `lib/parasol/diagram-converter.ts` - 既に両形式をサポート済み
- `app/components/parasol/DiagramView.tsx` - 変更不要

## 実行計画

### Phase 1: 自動変換スクリプト作成
1. Mermaidフローチャートをテキスト形式に変換するスクリプト作成
2. 代替フローと例外処理の自動抽出機能追加

### Phase 2: バッチ変換実行
1. 全55個のMDファイルを一括変換
2. APIエンドポイント `/api/parasol/import` 経由でデータベース更新

### Phase 3: 動作確認
1. 各サービスのビジネスオペレーション表示確認
2. フローチャートの色分け動作確認
3. 代替フロー・例外フローの表示確認

## 成功条件

- [ ] 全55個のビジネスオペレーションがテキスト形式に変換される
- [ ] 基本フロー（青色）、代替フロー（黄色）、例外フロー（オレンジ）が正しく表示される
- [ ] ビジネス状態図（Mermaid）は変更されない
- [ ] 文字化けやエンコーディングエラーがない
- [ ] ダイアグラム表示に問題がない

## 関連Issue

- Issue #117: 「パスワードを管理する」オペレーションのテキスト形式変換（完了）
- Issue #101: ドメインダイアグラムフィルター機能追加（関連する`diagram-converter.ts`の改善）

## 参考資料

- `templates/business-operation-template.md` - 正しいテキスト形式のテンプレート
- `lib/parasol/diagram-converter.ts:384-426` - operationToFlowDiagramメソッド
- `lib/parasol/diagram-converter.ts:713-794` - parseAlternativeFlows, parseExceptionFlows