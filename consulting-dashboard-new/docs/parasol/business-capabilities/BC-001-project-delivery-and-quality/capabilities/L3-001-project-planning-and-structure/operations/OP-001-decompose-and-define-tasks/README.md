# OP-001: タスクを分解し定義する

**作成日**: 2025-10-31
**所属L3**: L3-001-project-planning-and-structure: Project Planning And Structure
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: services/project-success-service/capabilities/plan-and-structure-project/operations/decompose-and-define-tasks

---

## 📋 How: この操作の定義

### 操作の概要
タスクを分解し定義するを実行し、ビジネス価値を創出する。

### 実現する機能
- タスクを分解し定義するに必要な情報の入力と検証
- タスクを分解し定義するプロセスの実行と進捗管理
- 結果の記録と関係者への通知
- 監査証跡の記録

### 入力
- 操作実行に必要なビジネス情報
- 実行者の認証情報と権限
- 関連エンティティの参照情報

### 出力
- 操作結果（成功/失敗）
- 更新されたエンティティ情報
- 監査ログと履歴情報
- 次のアクションへのガイダンス

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| projectId | UUID | Yes | - | UUID形式 | タスクを作成するプロジェクトID |
| parentTaskId | UUID | No | null | UUID形式またはnull | 親タスクID（WBS階層構造用） |
| taskName | STRING_200 | Yes | - | 1-200文字 | タスク名 |
| description | TEXT | No | "" | 最大5000文字 | タスクの詳細説明 |
| estimatedHours | DECIMAL | Yes | - | > 0, 最大99999.99 | 見積工数（時間） |
| priority | STRING_20 | No | 'medium' | high/medium/low | 優先度 |
| startDate | DATE | No | null | YYYY-MM-DD形式 | 計画開始日 |
| dueDate | DATE | No | null | YYYY-MM-DD形式、startDate以降 | 完了期限 |
| assigneeId | UUID | No | null | UUID形式、User存在確認 | 担当者ID |
| predecessorTaskIds | Array<UUID> | No | [] | UUID配列、循環依存チェック | 先行タスクID配列 |

### バリデーションルール
1. **projectId**: BC-001プロジェクトが存在し、status='planning'または'executing'であること
2. **parentTaskId**: 指定する場合、同一projectId配下のタスクであること
3. **taskName**: 同一プロジェクト内で一意であること
4. **estimatedHours**: 親タスクが存在する場合、全子タスクの合計 ≤ 親タスクの見積工数
5. **dueDate**: プロジェクトの終了日以前であること
6. **predecessorTaskIds**: 循環依存が発生しないこと（トポロジカルソート検証）
7. **WBS階層深度**: 最大5階層まで

## 📤 出力仕様

### 成功レスポンス
**HTTP 201 Created**
```json
{
  "taskId": "uuid",
  "projectId": "uuid",
  "taskName": "システム設計タスク",
  "status": "not_started",
  "estimatedHours": 40.0,
  "createdAt": "2025-11-04T10:00:00Z",
  "wbsCode": "1.2.3"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC001_OP001_001**: projectIdが不正（UUID形式エラー）
- **ERR_BC001_OP001_002**: taskNameが1-200文字の範囲外
- **ERR_BC001_OP001_003**: estimatedHours ≤ 0（正の数値が必要）
- **ERR_BC001_OP001_004**: dueDateがstartDate以前（日付順序エラー）
- **ERR_BC001_OP001_005**: 循環依存検出（predecessorTaskIdsにサイクル発生）
- **ERR_BC001_OP001_006**: WBS階層深度超過（最大5階層）

#### HTTP 404 Not Found
- **ERR_BC001_OP001_404_01**: プロジェクトが存在しません
- **ERR_BC001_OP001_404_02**: 親タスクが存在しません
- **ERR_BC001_OP001_404_03**: 担当者（assigneeId）が存在しません

#### HTTP 409 Conflict
- **ERR_BC001_OP001_409**: 同名タスクが既に存在します

#### HTTP 500 Internal Server Error
- **ERR_BC001_OP001_500**: タスク作成処理中にシステムエラー（ログ参照）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Task Aggregate**: タスクのライフサイクル管理と依存関係制御
  - 参照: [../../../../domain/README.md#task-aggregate](../../../../domain/README.md#task-aggregate)
  - 集約ルート: Task
  - 包含エンティティ: SubTask, TaskDependency

#### ドメインメソッド
```typescript
// タスク作成
const task = Task.create({
  projectId,
  parentTaskId,
  taskName,
  estimatedHours
});

// 依存関係追加
task.addDependency(predecessorTaskId, 'FS', lagDays);

// 循環依存検証
const isValid = TaskDependency.validateNoCycles(projectId);
```

#### ドメインサービス
- **ProjectPlanningService.validateTaskDependencies()**: 依存関係の整合性検証
- **ProjectPlanningService.calculateCriticalPath()**: クリティカルパス再計算

### トランザクション境界
- **開始**: タスク作成リクエスト受信時
- **コミット**: Task作成 + TaskDependency作成 + WBSコード採番完了時
- **ロールバック**: バリデーションエラー、DB制約違反、循環依存検出時

### 副作用
- **ドメインイベント発行**: `TaskCreated` - BC-002（コスト予測）、BC-005（リソース計画）にイベント配信
- **通知**: プロジェクトオーナーにタスク追加通知（BC-007経由）
- **外部システム連携**: なし

### 実装手順
1. プロジェクト存在確認（status検証含む）
2. 親タスク存在確認（指定時）
3. 循環依存チェック（predecessorTaskIds指定時）
4. WBSコード自動採番
5. Task Aggregate作成
6. TaskDependency作成（predecessorTaskIds分）
7. TaskCreatedイベント発行
8. トランザクションコミット
9. BC-007へ通知配信（非同期）

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC001_OP001_001 | 400 | projectId形式エラー | No |
| ERR_BC001_OP001_002 | 400 | taskName長さエラー | No |
| ERR_BC001_OP001_003 | 400 | estimatedHours範囲エラー | No |
| ERR_BC001_OP001_004 | 400 | 日付順序エラー | No |
| ERR_BC001_OP001_005 | 400 | 循環依存検出 | No |
| ERR_BC001_OP001_006 | 400 | WBS階層深度超過 | No |
| ERR_BC001_OP001_404_01 | 404 | プロジェクト不存在 | No |
| ERR_BC001_OP001_404_02 | 404 | 親タスク不存在 | No |
| ERR_BC001_OP001_404_03 | 404 | 担当者不存在 | No |
| ERR_BC001_OP001_409 | 409 | タスク名重複 | No |
| ERR_BC001_OP001_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC001_OP001_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)
- **リトライ不可エラー**: バリデーションエラー（400系）、リソース不存在（404系）

### ロールバック手順
1. トランザクション開始前の状態に自動ロールバック
2. 作成途中のTask、TaskDependencyレコードを削除
3. 発行済みイベントのキャンセル通知（EventStoreにcompensationイベント記録）
4. エラーログ記録（ERROR level、スタックトレース含む）

### ログ記録要件
- **INFO**: タスク作成成功（taskId, projectId, taskName記録）
- **WARN**: 循環依存検出時（検出されたサイクルパス記録）、WBS階層深度警告（深度4以上）
- **ERROR**: システムエラー（スタックトレース、入力パラメータ全量記録）
- **監査ログ**: 全タスク作成操作（成功/失敗問わず）をAuditLogテーブルに記録

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

この操作に関連するドメインエンティティ、値オブジェクト、集約の詳細定義は、上記ドメインモデルドキュメントを参照してください。

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

この操作を実現するAPIエンドポイント、リクエスト/レスポンス形式、認証・認可要件は、上記API仕様ドキュメントを参照してください。

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

この操作が扱うデータ構造、永続化要件、データ整合性制約は、上記データモデルドキュメントを参照してください。

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

> **注記**: ユースケースは Phase 4 の実装フェーズで、V2構造から段階的に移行・作成されます。
> 
> **Phase 3 (現在)**: Operation構造とREADME作成
> **Phase 4 (次)**: UseCase定義とページ定義の移行
> **Phase 5**: API実装とテストコード

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/project-success-service/capabilities/plan-and-structure-project/operations/decompose-and-define-tasks/](../../../../../../services/project-success-service/capabilities/plan-and-structure-project/operations/decompose-and-define-tasks/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
