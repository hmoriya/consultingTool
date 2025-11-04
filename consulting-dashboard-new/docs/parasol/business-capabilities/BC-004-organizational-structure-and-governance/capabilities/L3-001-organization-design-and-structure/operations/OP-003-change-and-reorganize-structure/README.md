# OP-003: 組織構造を変更し再編する

**作成日**: 2025-10-31
**所属L3**: L3-001-organization-design-and-structure: Organization Design And Structure
**所属BC**: BC-004: Organizational Structure & Governance
**V2移行元**: services/secure-access-service/capabilities/manage-organizational-structure/operations/change-and-reorganize-structure

---

## 📋 How: この操作の定義

### 操作の概要
ビジネス環境の変化に応じて組織構造を変更し、再編成する。柔軟な組織運営により、戦略的変化への迅速な適応を実現する。

### 実現する機能
- 組織変更計画の作成
- 部門・チームの統廃合
- 組織階層の再編成
- 変更履歴とバージョン管理

### 入力
- 組織変更計画
- 変更理由と根拠
- 影響分析データ
- 承認情報

### 出力
- 変更後の組織構造
- 組織変更履歴
- 影響を受けるメンバーリスト
- 変更通知データ

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| unitId | UUID | Yes | - | UUID形式 | 変更対象単位ID |
| changeType | STRING_20 | Yes | - | move/rename/merge/split/delete | 変更タイプ |
| newParentUnitId | UUID | No | null | UUID形式（move時必須） | 新親単位ID |
| newName | STRING_200 | No | null | 1-200文字（rename時必須） | 新単位名 |
| mergeTargetUnitId | UUID | No | null | UUID形式（merge時必須） | 統合先単位ID |
| splitUnits | Array | No | [] | 最大10件（split時必須） | 分割後単位配列 |
| ├─ unitName | STRING_200 | Yes | - | 1-200文字 | 分割単位名 |
| ├─ unitType | STRING_20 | Yes | - | division/department/section/team | 分割単位タイプ |
| └─ memberIds | Array<UUID> | No | [] | UUID配列 | 移動メンバーID配列 |
| reason | TEXT | Yes | - | 10-5000文字 | 変更理由 |
| effectiveDate | DATE | No | today | YYYY-MM-DD形式 | 変更有効日 |
| changedBy | UUID | Yes | - | UUID形式、BC-003 User参照 | 変更者ID |

### バリデーションルール
1. **unitId**: 存在する単位、ルート単位は変更不可
2. **changeType=move**: newParentUnitId必須、循環参照禁止、階層深度10以下
3. **changeType=rename**: newName必須、同一組織内で一意
4. **changeType=merge**: mergeTargetUnitId必須、同一組織内、階層レベル同一
5. **changeType=split**: splitUnits必須（2-10件）、全メンバーの再配置必要
6. **changeType=delete**: 子単位なし、メンバーなし、または再配置先指定
7. **changedBy**: BC-003のUser、組織のUPDATE権限保持

## 📤 出力仕様

### 成功レスポンス
**HTTP 200 OK**
```json
{
  "changeId": "uuid",
  "unitId": "uuid",
  "changeType": "move",
  "previousState": {
    "unitName": "営業第一部",
    "parentUnitId": "old-parent-uuid",
    "path": "/本社/営業本部/営業第一部",
    "hierarchyLevel": 3
  },
  "newState": {
    "unitName": "営業第一部",
    "parentUnitId": "new-parent-uuid",
    "path": "/本社/開発本部/営業第一部",
    "hierarchyLevel": 3
  },
  "affectedUnits": 5,
  "affectedMembers": 25,
  "affectedDescendants": [
    {
      "unitId": "uuid",
      "unitName": "営業第一課",
      "newPath": "/本社/開発本部/営業第一部/営業第一課"
    }
  ],
  "effectiveDate": "2025-11-04",
  "changedBy": "uuid",
  "changedAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC004_L3001_OP003_001**: unitIdが不正（UUID形式エラー）
- **ERR_BC004_L3001_OP003_002**: changeTypeが不正
- **ERR_BC004_L3001_OP003_003**: move時にnewParentUnitId未指定
- **ERR_BC004_L3001_OP003_004**: 循環参照検出（移動先が子孫）
- **ERR_BC004_L3001_OP003_005**: 階層深度超過（移動後10階層超）
- **ERR_BC004_L3001_OP003_006**: rename時に同名単位が存在
- **ERR_BC004_L3001_OP003_007**: merge時に階層レベル不一致
- **ERR_BC004_L3001_OP003_008**: split時に全メンバー未配置
- **ERR_BC004_L3001_OP003_009**: delete時に子単位またはメンバーが存在
- **ERR_BC004_L3001_OP003_010**: ルート単位の変更試行

#### HTTP 403 Forbidden
- **ERR_BC004_L3001_OP003_403**: 組織変更権限がありません

#### HTTP 404 Not Found
- **ERR_BC004_L3001_OP003_404_01**: 変更対象単位が存在しません
- **ERR_BC004_L3001_OP003_404_02**: 新親単位が存在しません
- **ERR_BC004_L3001_OP003_404_03**: 統合先単位が存在しません

#### HTTP 500 Internal Server Error
- **ERR_BC004_L3001_OP003_500**: 組織変更処理中にシステムエラー（ログ参照）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **OrganizationUnit Aggregate**: 組織単位の変更管理
  - 参照: [../../../../domain/README.md#organizationunit-aggregate](../../../../domain/README.md#organizationunit-aggregate)
  - 集約ルート: OrganizationUnit
  - 包含エンティティ: OrganizationMember

#### ドメインメソッド
```typescript
// 親単位変更（移動）
unit.changeParent(
  newParentUnitId,
  hierarchyService
);

// 単位名変更
unit.rename(newName);

// 単位統合
OrganizationUnit.merge(
  sourceUnit,
  targetUnit,
  hierarchyService
);

// 単位分割
OrganizationUnit.split(
  sourceUnit,
  splitUnits,
  hierarchyService
);

// 単位削除
unit.archive(changedBy);
```

#### ドメインサービス
- **OrganizationHierarchyService.rebuildHierarchy()**: 階層再構築（閉包テーブル更新）
- **OrganizationHierarchyService.hasCircularReference()**: 循環参照チェック
- **OrganizationHierarchyService.calculateDepth()**: 深度再計算
- **OrganizationRestructuringService.validateRestructuring()**: 再編妥当性検証
- **OrganizationRestructuringService.applyRestructuring()**: 再編実行

### トランザクション境界
- **開始**: 組織変更リクエスト受信時
- **コミット**: Unit更新 + 階層関係更新 + 全子孫パス更新 + イベント発行完了時
- **ロールバック**: バリデーションエラー、循環参照検出、階層深度超過時

### 副作用
- **ドメインイベント発行**:
  - `OrganizationUnitParentChanged` (move)
  - `OrganizationUnitRenamed` (rename)
  - `OrganizationUnitMerged` (merge)
  - `OrganizationUnitSplit` (split)
  - `OrganizationUnitArchived` (delete)
- **通知**: 影響を受けるメンバー全員に変更通知（BC-007経由）
- **外部システム連携**:
  - BC-003: 組織ベースRBACの再計算
  - BC-005: チーム配置の再評価

### BC間連携
- **BC-003依存**: User権限検証、RBAC再計算トリガー
- **BC-005依存**: チーム配置の影響分析、再配置提案

### 実装手順
1. 変更者権限確認（BC-003、組織のUPDATE権限）
2. 変更対象単位存在確認
3. changeType別バリデーション
   - **move**: 循環参照チェック、階層深度チェック
   - **rename**: 同名単位チェック
   - **merge**: 階層レベル一致チェック
   - **split**: 全メンバー配置チェック
   - **delete**: 子単位・メンバーなしチェック
4. 影響分析（全子孫単位、全メンバー）
5. トランザクション開始
6. 単位更新
7. 階層関係再構築（閉包テーブル）
8. パス再計算（全子孫）
9. ドメインイベント発行
10. トランザクションコミット
11. BC-003へRBAC再計算要求（非同期）
12. BC-007へ通知配信（非同期、影響メンバー全員）

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC004_L3001_OP003_001 | 400 | unitId形式エラー | No |
| ERR_BC004_L3001_OP003_002 | 400 | changeType不正 | No |
| ERR_BC004_L3001_OP003_003 | 400 | move時パラメータ不足 | No |
| ERR_BC004_L3001_OP003_004 | 400 | 循環参照検出 | No |
| ERR_BC004_L3001_OP003_005 | 400 | 階層深度超過 | No |
| ERR_BC004_L3001_OP003_006 | 400 | rename時同名存在 | No |
| ERR_BC004_L3001_OP003_007 | 400 | merge階層不一致 | No |
| ERR_BC004_L3001_OP003_008 | 400 | split時メンバー未配置 | No |
| ERR_BC004_L3001_OP003_009 | 400 | delete時子単位存在 | No |
| ERR_BC004_L3001_OP003_010 | 400 | ルート単位変更禁止 | No |
| ERR_BC004_L3001_OP003_403 | 403 | 変更権限なし | No |
| ERR_BC004_L3001_OP003_404_01 | 404 | 対象単位不存在 | No |
| ERR_BC004_L3001_OP003_404_02 | 404 | 新親単位不存在 | No |
| ERR_BC004_L3001_OP003_404_03 | 404 | 統合先不存在 | No |
| ERR_BC004_L3001_OP003_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC004_L3001_OP003_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)
- **リトライ不可エラー**: バリデーションエラー（400系）、権限エラー（403）

### ロールバック手順
1. トランザクション開始前の状態に自動ロールバック
2. 変更途中の単位、階層関係、パスを元に戻す
3. 発行済みイベントのキャンセル通知（compensationイベント記録）
4. エラーログ記録（ERROR level、スタックトレース含む）
5. BC-003へのRBAC再計算要求キャンセル
6. 影響メンバーへのエラー通知（BC-007経由）

### ログ記録要件
- **INFO**: 組織変更成功（changeId, unitId, changeType, 影響単位数・メンバー数記録）
- **WARN**: 大規模影響警告（100単位以上、1000メンバー以上）、循環参照試行
- **ERROR**: システムエラー（スタックトレース、入力パラメータ全量、変更前状態記録）
- **監査ログ**: 全組織変更操作（成功/失敗問わず）をAuditLogテーブルに記録（BC-003経由）

### 変更履歴管理
- **OrgStructureChangeLog**: 全変更を記録（変更前・変更後・理由・承認者）
- **保存期間**: 永続（コンプライアンス要件）
- **検索**: changeType、日付範囲、影響単位でフィルタ可能

### BC間エラー連携
- **BC-003エラー**: User権限不足、RBAC再計算失敗時のエラー伝播
- **BC-005エラー**: チーム配置再評価失敗時の警告（組織変更は継続）
- **BC-007エラー**: 通知配信失敗時の警告（組織変更は継続、再送キュー登録）

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
> - [services/secure-access-service/capabilities/manage-organizational-structure/operations/change-and-reorganize-structure/](../../../../../../../services/secure-access-service/capabilities/manage-organizational-structure/operations/change-and-reorganize-structure/)
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
