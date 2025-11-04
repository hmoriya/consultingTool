# OP-003: コストを配分し最適化する

**作成日**: 2025-10-31
**所属L3**: L3-002-cost-management-and-optimization: Cost Management And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/allocate-and-optimize-costs

---

## 📋 How: この操作の定義

### 操作の概要
コストを適切にプロジェクトや部門に配分し、コスト構造を最適化する。コスト削減機会の特定と実行により、収益性の向上を実現する。

### 実現する機能
- プロジェクト・部門へのコスト配分
- コスト配分ルールの設定と適用
- コスト削減機会の特定
- コスト最適化施策の提案

### 入力
- 記録されたコストデータ
- コスト配分ルール
- プロジェクト・部門情報
- 最適化目標

### 出力
- コスト配分結果
- コスト最適化提案
- 削減効果シミュレーション
- 最適化実施計画

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| costIds | ARRAY | Yes | - | 最低1件、有効なコストID | 配分対象コストID配列 |
| allocationStrategy | ENUM | Yes | - | PROPORTIONAL/EQUAL/WEIGHTED/CUSTOM | 配分戦略 |
| targetProjects | ARRAY | Conditional | - | strategy≠EQUALでは必須 | 配分先プロジェクトID配列 |
| weights | OBJECT | Conditional | - | strategy=WEIGHTEDで必須 | プロジェクト別配分比率 |
| optimizationGoals | ARRAY | No | - | MINIMIZE_COST/MAXIMIZE_EFFICIENCY/BALANCE_LOAD | 最適化目標 |
| constraints | OBJECT | No | - | - | 制約条件 |
| constraints.maxCostPerProject | DECIMAL | No | - | > 0 | プロジェクト別コスト上限 |
| constraints.minEfficiency | DECIMAL | No | - | 0-100 | 最小効率目標（%） |
| simulation | BOOLEAN | No | false | - | シミュレーションモード |

### バリデーションルール
1. **コスト確認**: costIds が有効なコストであること
2. **配分戦略**: allocationStrategy に応じた必須パラメータ存在確認
3. **重み合計**: weights の合計が100%であること（strategy=WEIGHTED時）
4. **プロジェクト確認**: targetProjects が有効なプロジェクト（BC-001）であること

## 📤 出力仕様

### 成功レスポンス
**HTTP 200 OK**
```json
{
  "allocationId": "uuid",
  "strategy": "WEIGHTED",
  "totalCost": "5000000.00",
  "allocations": [
    {
      "projectId": "uuid",
      "projectName": "プロジェクトA",
      "allocatedCost": "3000000.00",
      "weight": 60.0,
      "efficiency": 85.5
    }
  ],
  "optimizationResults": {
    "costSavings": "500000.00",
    "efficiencyImprovement": 12.5,
    "recommendations": [
      "プロジェクトBの外注費を20%削減可能"
    ]
  },
  "simulation": false,
  "allocatedAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC002_L3002_OP003_001**: 配分戦略パラメータ不足
- **ERR_BC002_L3002_OP003_002**: 重み合計が100%でない
- **ERR_BC002_L3002_OP003_003**: 制約条件を満たせない

#### HTTP 401 Unauthorized
- **ERR_BC002_L3002_OP003_401**: 認証トークン無効

#### HTTP 403 Forbidden
- **ERR_BC002_L3002_OP003_403**: コスト配分権限なし

#### HTTP 404 Not Found
- **ERR_BC002_L3002_OP003_404**: コストまたはプロジェクトが存在しない

#### HTTP 500 Internal Server Error
- **ERR_BC002_L3002_OP003_500**: システムエラー（最適化計算エラー等）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Cost Aggregate**: 参照 [../../../../domain/README.md](../../../../domain/README.md)
  - 集約ルート: Cost
  - ドメインサービス: CostOptimizationService
  - 値オブジェクト: AllocationStrategy, OptimizationGoal

#### ドメインメソッド
```typescript
// コスト配分最適化
const optimizationService = new CostOptimizationService();
const allocation = await optimizationService.allocate({
  costs: await costRepository.findByIds(costIds),
  strategy: allocationStrategy,
  targets: targetProjects,
  weights,
  goals: optimizationGoals,
  constraints
});

// シミュレーション
if (simulation) {
  return allocation.simulate();
}
allocation.apply();
```

### トランザクション境界
- **開始**: リクエスト受信時
- **コミット**: コスト配分適用完了時（simulation=falseの場合のみ）
- **ロールバック**: 制約違反時、最適化失敗時

### 副作用
- **ドメインイベント発行**: `CostAllocated`, `OptimizationCompleted`
- **BC間連携**:
  - BC-001: プロジェクトコスト更新
  - BC-007: コスト配分通知配信

### 実装手順
1. **コスト取得**: costIds で Cost集約を取得
2. **プロジェクト確認**: targetProjects の有効性確認（BC-001連携）
3. **配分計算**: allocationStrategy に基づく配分額計算（Decimal.js使用）
4. **最適化実行**: optimizationGoals に基づくコスト最適化
5. **制約確認**: constraints を満たすことを確認
6. **シミュレーション判定**: simulation=trueの場合は適用せず結果のみ返却
7. **配分適用**: Cost.allocateToProject() 実行
8. **プロジェクト更新**: プロジェクトコスト累計更新（BC-001連携）
9. **イベント発行**: CostAllocated, OptimizationCompleted
10. **通知配信**: BC-007経由でプロジェクト責任者へ通知

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 | 対処方法 |
|--------|---------------|------|-------------|----------|
| ERR_BC002_L3002_OP003_001 | 400 | パラメータ不足 | No | 戦略に応じた必須パラメータを追加 |
| ERR_BC002_L3002_OP003_002 | 400 | 重み合計不正 | No | 重みの合計を100%に調整 |
| ERR_BC002_L3002_OP003_003 | 400 | 制約違反 | No | 制約条件を緩和またはコスト削減 |
| ERR_BC002_L3002_OP003_401 | 401 | 認証エラー | No | 再ログイン |
| ERR_BC002_L3002_OP003_403 | 403 | 権限不足 | No | コスト配分権限を申請 |
| ERR_BC002_L3002_OP003_404 | 404 | 対象不存在 | No | 有効なコスト/プロジェクトを指定 |
| ERR_BC002_L3002_OP003_500 | 500 | システムエラー | Yes | 管理者に連絡 |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC002_L3002_OP003_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (1s, 2s, 4s)
- **タイムアウト**: 各リクエスト30秒

### ロールバック手順
1. **配分取消**: Cost.allocationを元に戻す
2. **プロジェクトコスト復元**: 更新したプロジェクトコストを元に戻す
3. **イベント補償**: AllocationCancelled イベント発行
4. **監査ログ記録**: ロールバック理由を記録

### ログ記録要件
- **INFO**: コスト配分成功時（allocationId, totalCost, strategy）
- **WARN**: 最適化目標未達成警告時
- **ERROR**: エラー発生時（エラーコード、スタックトレース）
- **AUDIT**: 全コスト配分操作（誰が・いつ・何を配分したか）

### コスト最適化特有の注意事項
- **最適化アルゴリズム**: 線形計画法による最適解探索
- **Decimal.js必須**: 配分計算でJavaScript number型では精度不足
- **シミュレーション推奨**: 本番適用前に必ずシミュレーション実行
- **制約バランス**: 複数制約の同時達成が困難な場合は優先順位付け

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
> - [services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/allocate-and-optimize-costs/](../../../../../../../services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/allocate-and-optimize-costs/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
