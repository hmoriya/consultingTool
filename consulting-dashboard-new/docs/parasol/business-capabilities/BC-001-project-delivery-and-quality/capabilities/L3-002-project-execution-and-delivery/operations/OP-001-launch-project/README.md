# OP-001: プロジェクトを立ち上げる

**作成日**: 2025-10-31
**所属L3**: L3-002-project-execution-and-delivery: Project Execution And Delivery
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: services/project-success-service/capabilities/plan-and-execute-project/operations/launch-project

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトを立ち上げるを実行し、ビジネス価値を創出する。

### 実現する機能
- プロジェクトを立ち上げるに必要な情報の入力と検証
- プロジェクトを立ち上げるプロセスの実行と進捗管理
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
| projectName | String | Yes | - | 1-200文字、プロジェクト名一意性 | プロジェクト名 |
| description | Text | No | "" | 最大5000文字 | プロジェクト説明 |
| ownerId | UUID | Yes | - | UUID形式、User存在確認 | プロジェクトオーナー（責任者）ID |
| startDate | Date | Yes | - | YYYY-MM-DD形式 | 計画開始日 |
| endDate | Date | Yes | - | YYYY-MM-DD形式、startDate以降 | 計画終了日 |
| budget | Decimal | No | null | ≥ 0, 最大999999999.99 | 予算額 |
| initialMilestones | Array<Object> | No | [] | 最大10件 | 初期マイルストーン定義 |

### バリデーションルール
1. **projectName**: 同一組織内で一意であること
2. **ownerId**: 組織に所属し、PM権限を持つユーザーであること
3. **startDate/endDate**: 期間が7日以上、3年以内であること
4. **budget**: 設定する場合、budget > 0であること
5. **initialMilestones**: 各マイルストーン日付がプロジェクト期間内であること
6. **プロジェクト開始条件**: 最低1つのマイルストーンが定義されていること

## 📤 出力仕様

### 成功レスポンス
**HTTP 201 Created**
```json
{
  "projectId": "uuid",
  "projectName": "DXプロジェクト2025",
  "status": "planning",
  "ownerId": "uuid",
  "ownerName": "山田太郎",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "budget": 50000000.00,
  "milestones": [
    {
      "milestoneId": "uuid",
      "name": "要件定義完了",
      "targetDate": "2025-03-31"
    }
  ],
  "createdAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC001_OP001_001**: projectName重複（同名プロジェクト存在）
- **ERR_BC001_OP001_002**: 期間エラー（endDate ≤ startDate）
- **ERR_BC001_OP001_003**: 期間範囲エラー（7日未満または3年超過）
- **ERR_BC001_OP001_004**: budget < 0（負の予算）
- **ERR_BC001_OP001_005**: マイルストーン日付範囲外

#### HTTP 404 Not Found
- **ERR_BC001_OP001_404**: オーナー（ownerId）が存在しません

#### HTTP 403 Forbidden
- **ERR_BC001_OP001_403**: オーナーがPM権限を持っていません

#### HTTP 500 Internal Server Error
- **ERR_BC001_OP001_500**: プロジェクト作成処理中にシステムエラー

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Project Aggregate**: プロジェクトライフサイクル管理
  - 参照: [../../../../domain/README.md#project-aggregate](../../../../domain/README.md#project-aggregate)
  - 集約ルート: Project
  - 包含エンティティ: Milestone, ProjectSchedule

#### ドメインメソッド
```typescript
// プロジェクト作成
const project = Project.create({
  projectName,
  ownerId,
  startDate,
  endDate,
  budget
});

// マイルストーン追加
initialMilestones.forEach(milestone => {
  project.addMilestone(milestone.name, milestone.targetDate);
});

// プロジェクト開始条件検証
const canStart = project.validateStartConditions();
```

### BC間連携
- **BC-002（Financial Health）**: 予算登録 `POST /api/finance/budgets`
- **BC-005（Team & Resource）**: リソース計画作成 `POST /api/resources/project-plans`
- **BC-007（Team Communication）**: ステークホルダー通知 `POST /api/notifications/send`

### トランザクション境界
- **開始**: プロジェクト作成リクエスト受信時
- **コミット**: Project作成 + Milestone作成 + BC-002予算登録完了時
- **ロールバック**: バリデーションエラー、BC-002予算登録失敗時

### 副作用
- **ドメインイベント発行**: `ProjectCreated` - BC-002（予算登録）、BC-005（リソース計画）、BC-006（知識ベース初期化）
- **通知**: オーナーとステークホルダーへプロジェクト開始通知（BC-007経由）
- **外部システム連携**: BC-002財務システムへ予算情報同期

### 実装手順
1. プロジェクト名重複チェック
2. オーナー存在確認・権限検証
3. Project Aggregate作成（status='planning'）
4. Milestone作成（initialMilestones分）
5. BC-002へ予算登録要求
6. ProjectCreatedイベント発行
7. トランザクションコミット（分散トランザクション）
8. BC-007へステークホルダー通知（非同期）

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC001_OP001_001 | 400 | プロジェクト名重複 | No |
| ERR_BC001_OP001_002 | 400 | 期間順序エラー | No |
| ERR_BC001_OP001_003 | 400 | 期間範囲エラー | No |
| ERR_BC001_OP001_004 | 400 | 負の予算 | No |
| ERR_BC001_OP001_005 | 400 | マイルストーン日付エラー | No |
| ERR_BC001_OP001_404 | 404 | オーナー不存在 | No |
| ERR_BC001_OP001_403 | 403 | 権限不足 | No |
| ERR_BC001_OP001_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC001_OP001_500、BC-002一時的エラー
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)

### ロールバック手順
1. 作成されたProject、Milestoneレコードを削除
2. BC-002へ予算削除要求（DELETE /api/finance/budgets/{id}）
3. ProjectCreatedイベントのcompensationイベント発行
4. エラーログ記録（ERROR level、BC-002レスポンス含む）

### ログ記録要件
- **INFO**: プロジェクト作成成功（projectId, projectName, ownerId記録）
- **WARN**: 長期プロジェクト警告（期間 > 1年）
- **ERROR**: BC-002連携エラー、システムエラー（スタックトレース）
- **監査ログ**: 全プロジェクト作成操作（成功/失敗、BC間連携結果含む）

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
> - [services/project-success-service/capabilities/plan-and-execute-project/operations/launch-project/](../../../../../../services/project-success-service/capabilities/plan-and-execute-project/operations/launch-project/)
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
