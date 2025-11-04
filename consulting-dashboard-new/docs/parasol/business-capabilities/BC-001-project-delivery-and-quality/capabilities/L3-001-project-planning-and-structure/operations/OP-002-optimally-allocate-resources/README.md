# OP-002: リソースを最適配分する

**作成日**: 2025-10-31
**所属L3**: L3-001-project-planning-and-structure: Project Planning And Structure
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: services/project-success-service/capabilities/plan-and-structure-project/operations/optimally-allocate-resources

---

## 📋 How: この操作の定義

### 操作の概要
リソースを最適配分するを実行し、ビジネス価値を創出する。

### 実現する機能
- リソースを最適配分するに必要な情報の入力と検証
- リソースを最適配分するプロセスの実行と進捗管理
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
| projectId | UUID | Yes | - | UUID形式 | リソース配分対象プロジェクトID |
| taskId | UUID | Yes | - | UUID形式 | リソース配分対象タスクID |
| userId | UUID | Yes | - | UUID形式 | 配分するリソース（ユーザー）ID |
| allocatedHours | DECIMAL | Yes | - | > 0, 最大9999.99 | 配分工数（時間） |
| allocationStartDate | DATE | Yes | - | YYYY-MM-DD形式 | 配分開始日 |
| allocationEndDate | DATE | Yes | - | YYYY-MM-DD形式、startDate以降 | 配分終了日 |
| utilizationRate | DECIMAL | No | 1.0 | 0.0-1.0 | 稼働率（0.5=50%稼働） |

### バリデーションルール
1. **projectId**: プロジェクトが存在し、status='planning'または'executing'であること
2. **taskId**: 指定プロジェクト配下のタスクであること、status='not_started'または'in_progress'
3. **userId**: BC-005で管理されるユーザーが存在すること（リソース利用可能性確認）
4. **allocatedHours**: タスクの見積工数（estimatedHours）以下であること
5. **allocationStartDate/EndDate**: タスクの計画開始日/期限の範囲内であること
6. **utilizationRate**: 同一期間内の他タスク配分と合計して1.0以下であること（過剰配分防止）
7. **スキルマッチ**: ユーザーが必要スキルを保有していること（BC-005 スキルマトリックス参照）

## 📤 出力仕様

### 成功レスポンス
**HTTP 200 OK**
```json
{
  "allocationId": "uuid",
  "taskId": "uuid",
  "userId": "uuid",
  "userName": "山田太郎",
  "allocatedHours": 80.0,
  "utilizationRate": 0.8,
  "allocationStatus": "confirmed",
  "createdAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC001_OP002_001**: allocatedHoursがタスクの見積工数を超過
- **ERR_BC001_OP002_002**: 配分期間がタスク期間外（日付範囲エラー）
- **ERR_BC001_OP002_003**: utilizationRateが範囲外（0.0-1.0）
- **ERR_BC001_OP002_004**: 同一期間内の過剰配分（合計稼働率 > 1.0）
- **ERR_BC001_OP002_005**: 必要スキル不足（BC-005スキルマッチング失敗）

#### HTTP 404 Not Found
- **ERR_BC001_OP002_404_01**: プロジェクトが存在しません
- **ERR_BC001_OP002_404_02**: タスクが存在しません
- **ERR_BC001_OP002_404_03**: ユーザー（リソース）が存在しません（BC-005照会）

#### HTTP 409 Conflict
- **ERR_BC001_OP002_409**: 同一タスクに既に配分済み

#### HTTP 500 Internal Server Error
- **ERR_BC001_OP002_500**: リソース配分処理中にシステムエラー

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Task Aggregate**: タスクへのリソース配分管理
  - 参照: [../../../../domain/README.md#task-aggregate](../../../../domain/README.md#task-aggregate)
  - 集約ルート: Task
  - assigneeIdフィールドの更新

#### ドメインメソッド
```typescript
// タスクへのリソース配分
const task = await taskRepository.findById(taskId);
task.assignResource(userId, allocatedHours);

// 稼働率検証（BC-005連携）
const utilizationCheck = await resourceService.validateUtilization(
  userId,
  allocationStartDate,
  allocationEndDate,
  utilizationRate
);
```

#### ドメインサービス
- **ProjectPlanningService.optimizeProjectSchedule()**: リソース配分後のスケジュール最適化
- **ProjectPlanningService.calculateCriticalPath()**: クリティカルパス再計算

### BC間連携
- **BC-005（Team & Resource Optimization）**:
  - ユーザー存在確認: `GET /api/resources/users/{userId}`
  - スキル検証: `GET /api/resources/users/{userId}/skills`
  - 稼働率確認: `GET /api/resources/users/{userId}/utilization?from={date}&to={date}`
  - リソース予約: `POST /api/resources/allocations`

### トランザクション境界
- **開始**: リソース配分リクエスト受信時
- **コミット**: Task.assigneeId更新 + BC-005リソース予約完了時
- **ロールバック**: スキル不足検出、過剰配分検出、BC-005予約失敗時

### 副作用
- **ドメインイベント発行**: `TaskAssigned` - BC-007（担当者通知）、BC-005（リソース使用率更新）
- **通知**: 配分されたユーザーにタスク割当通知（BC-007経由）
- **外部システム連携**: BC-005リソース管理システムへの配分情報同期

### 実装手順
1. プロジェクト・タスク存在確認
2. BC-005へユーザー存在確認・スキル検証
3. BC-005へ稼働率確認（過剰配分防止）
4. allocatedHours ≤ estimatedHours 検証
5. Task.assigneeId更新
6. BC-005へリソース予約登録
7. TaskAssignedイベント発行
8. トランザクションコミット（分散トランザクション: Task + BC-005予約）
9. BC-007へ担当者通知配信（非同期）

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC001_OP002_001 | 400 | 配分工数超過 | No |
| ERR_BC001_OP002_002 | 400 | 配分期間エラー | No |
| ERR_BC001_OP002_003 | 400 | 稼働率範囲外 | No |
| ERR_BC001_OP002_004 | 400 | 過剰配分検出 | No |
| ERR_BC001_OP002_005 | 400 | スキル不足 | No |
| ERR_BC001_OP002_404_01 | 404 | プロジェクト不存在 | No |
| ERR_BC001_OP002_404_02 | 404 | タスク不存在 | No |
| ERR_BC001_OP002_404_03 | 404 | ユーザー不存在（BC-005） | No |
| ERR_BC001_OP002_409 | 409 | 重複配分 | No |
| ERR_BC001_OP002_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC001_OP002_500、BC-005一時的接続エラー
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)
- **BC-005タイムアウト**: 5秒（デフォルト）、タイムアウト時はERR_BC001_OP002_500

### ロールバック手順
1. Task.assigneeIdを元の値に復元
2. BC-005へリソース予約キャンセル要求（DELETE /api/resources/allocations/{id}）
3. 発行済みTaskAssignedイベントのcompensationイベント発行
4. エラーログ記録（ERROR level、BC-005レスポンス含む）

### ログ記録要件
- **INFO**: リソース配分成功（taskId, userId, allocatedHours記録）
- **WARN**: 過剰配分警告（稼働率 > 0.9）、スキル部分一致（必須スキル不足だが代替スキルあり）
- **ERROR**: BC-005連携エラー（APIレスポンス全量）、システムエラー（スタックトレース）
- **監査ログ**: 全リソース配分操作（成功/失敗、BC-005連携結果含む）

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
> - [services/project-success-service/capabilities/plan-and-structure-project/operations/optimally-allocate-resources/](../../../../../../services/project-success-service/capabilities/plan-and-structure-project/operations/optimally-allocate-resources/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
