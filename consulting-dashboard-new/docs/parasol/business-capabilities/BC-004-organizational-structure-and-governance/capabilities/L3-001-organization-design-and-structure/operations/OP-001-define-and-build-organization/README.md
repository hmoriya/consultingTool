# OP-001: 組織を定義し構築する

**作成日**: 2025-10-31
**所属L3**: L3-001-organization-design-and-structure: Organization Design And Structure
**所属BC**: BC-004: Organizational Structure & Governance
**V2移行元**: services/secure-access-service/capabilities/manage-organizational-structure/operations/define-and-build-organization

---

## 📋 How: この操作の定義

### 操作の概要
組織の構造を定義し、部門・チーム・役職の階層を構築する。明確な組織設計により、効率的なガバナンスと責任体制を実現する。

### 実現する機能
- 組織構造の定義（部門、チーム、役職）
- 組織階層の構築と設定
- 組織単位の責任範囲定義
- 組織メタデータの管理

### 入力
- 組織設計方針
- 部門・チーム情報
- 役職定義
- 責任範囲

### 出力
- 定義された組織構造
- 組織階層データ
- 組織単位マスタ
- 組織図の基本データ

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| organizationName | STRING_200 | Yes | - | 1-200文字 | 組織名 |
| organizationCode | STRING_100 | Yes | - | 3-50文字、英数字とハイフン | 組織コード（一意） |
| organizationType | STRING_20 | Yes | - | headquarters/branch/division/subsidiary | 組織タイプ |
| description | TEXT | No | "" | 最大5000文字 | 組織説明 |
| rootUnitName | STRING_200 | Yes | - | 1-200文字 | ルート組織単位名 |
| rootUnitType | STRING_20 | Yes | - | root/division/department | ルート単位タイプ |
| organizationalUnits | Array | No | [] | 最大100件 | 初期組織単位配列 |
| ├─ unitName | STRING_200 | Yes | - | 1-200文字 | 単位名 |
| ├─ unitType | STRING_20 | Yes | - | division/department/section/team | 単位タイプ |
| ├─ parentUnitPath | STRING_100 | No | null | パス形式 | 親単位パス |
| └─ description | TEXT | No | "" | 最大5000文字 | 単位説明 |
| createdBy | UUID | Yes | - | UUID形式、BC-003 User参照 | 作成者ID |

### バリデーションルール
1. **organizationCode**: 全組織で一意、3-50文字、英数字とハイフンのみ
2. **organizationName**: 1-200文字、空白のみ不可
3. **rootUnitName**: ルート単位は必須、organizationNameと同一可
4. **organizationalUnits**: 階層レベル最大10まで、循環参照禁止
5. **unitType**: 階層レベルに応じた適切なタイプ（root=0, division=1, department=2, section=3, team=4）
6. **parentUnitPath**: 指定する場合、存在する単位パスであること
7. **createdBy**: BC-003のUserエンティティが存在し、Active状態であること

## 📤 出力仕様

### 成功レスポンス
**HTTP 201 Created**
```json
{
  "organizationId": "uuid",
  "organizationCode": "HQ-001",
  "organizationName": "本社",
  "organizationType": "headquarters",
  "rootUnitId": "uuid",
  "rootUnitName": "本社",
  "rootUnitPath": "/本社",
  "hierarchyLevel": 0,
  "createdUnitsCount": 5,
  "organizationalUnits": [
    {
      "unitId": "uuid",
      "unitName": "営業本部",
      "unitType": "division",
      "hierarchyLevel": 1,
      "path": "/本社/営業本部",
      "parentUnitId": "rootUnitId"
    }
  ],
  "createdAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC004_L3001_OP001_001**: organizationCodeが不正（3-50文字、英数字とハイフン要件）
- **ERR_BC004_L3001_OP001_002**: organizationNameが1-200文字の範囲外
- **ERR_BC004_L3001_OP001_003**: organizationTypeが不正（未定義のタイプ）
- **ERR_BC004_L3001_OP001_004**: unitType階層レベル不整合（親より深いレベルが必要）
- **ERR_BC004_L3001_OP001_005**: 循環参照検出（単位パスにサイクル発生）
- **ERR_BC004_L3001_OP001_006**: 階層深度超過（最大10階層）
- **ERR_BC004_L3001_OP001_007**: parentUnitPathが存在しない

#### HTTP 404 Not Found
- **ERR_BC004_L3001_OP001_404_01**: 作成者（createdBy）が存在しません
- **ERR_BC004_L3001_OP001_404_02**: 指定された親単位が存在しません

#### HTTP 409 Conflict
- **ERR_BC004_L3001_OP001_409**: 組織コードが既に存在します

#### HTTP 500 Internal Server Error
- **ERR_BC004_L3001_OP001_500**: 組織作成処理中にシステムエラー（ログ参照）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Organization Aggregate**: 組織全体のライフサイクル管理
  - 参照: [../../../../domain/README.md#organization-aggregate](../../../../domain/README.md#organization-aggregate)
  - 集約ルート: Organization
  - 包含エンティティ: OrganizationUnit（ルートのみ初期含む）

- **OrganizationUnit Aggregate**: 組織単位の階層管理
  - 参照: [../../../../domain/README.md#organizationunit-aggregate](../../../../domain/README.md#organizationunit-aggregate)
  - 集約ルート: OrganizationUnit
  - 包含エンティティ: OrganizationMember（初期は0件）

#### ドメインメソッド
```typescript
// 組織作成
const organization = Organization.create(
  organizationName,
  organizationCode,
  organizationType
);

// ルート単位作成
const rootUnit = OrganizationUnit.createRoot(
  organization.id,
  rootUnitName,
  rootUnitType
);

// 子単位作成
const childUnit = OrganizationUnit.create(
  organization.id,
  unitName,
  parentUnitId,
  unitType
);

// 階層関係構築
const hierarchy = OrganizationHierarchyService.buildHierarchy(
  unitId,
  parentUnitId
);
```

#### ドメインサービス
- **OrganizationHierarchyService.buildHierarchy()**: 階層関係の構築（閉包テーブルパターン）
- **OrganizationHierarchyService.hasCircularReference()**: 循環参照チェック
- **OrganizationHierarchyService.calculateDepth()**: 深度計算
- **OrganizationHierarchyService.calculatePath()**: 組織パス計算

### トランザクション境界
- **開始**: 組織作成リクエスト受信時
- **コミット**: Organization作成 + ルートUnit作成 + 全子Unit作成 + 階層関係構築完了時
- **ロールバック**: バリデーションエラー、循環参照検出、階層深度超過時

### 副作用
- **ドメインイベント発行**:
  - `OrganizationCreated` - BC-003（RBAC初期設定）、BC-005（チーム管理初期化）にイベント配信
  - `OrganizationUnitCreated` - 各単位作成ごとに発行
- **通知**: 作成者に組織作成完了通知（BC-007経由）
- **外部システム連携**: BC-003へ組織ベースのロール初期設定要求

### BC間連携
- **BC-003依存**: Userエンティティ参照（createdBy検証）、組織ベースRBAC初期化
- **BC-005依存**: 組織単位へのチーム配置機能の準備

### 実装手順
1. 作成者存在確認（BC-003 User）
2. organizationCode一意性確認
3. Organization Aggregate作成
4. ルートOrganizationUnit作成（hierarchyLevel=0）
5. 階層関係初期化（閉包テーブル）
6. 子OrganizationUnit作成（配列ループ）
   - 各単位でparentUnitPath解決
   - 循環参照チェック
   - 階層深度検証
   - 組織パス計算
7. OrganizationCreatedイベント発行
8. OrganizationUnitCreatedイベント発行（各単位）
9. トランザクションコミット
10. BC-003へRBAC初期化要求（非同期）
11. BC-007へ通知配信（非同期）

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC004_L3001_OP001_001 | 400 | organizationCode形式エラー | No |
| ERR_BC004_L3001_OP001_002 | 400 | organizationName長さエラー | No |
| ERR_BC004_L3001_OP001_003 | 400 | organizationType不正 | No |
| ERR_BC004_L3001_OP001_004 | 400 | 階層レベル不整合 | No |
| ERR_BC004_L3001_OP001_005 | 400 | 循環参照検出 | No |
| ERR_BC004_L3001_OP001_006 | 400 | 階層深度超過 | No |
| ERR_BC004_L3001_OP001_007 | 400 | 親単位パス不存在 | No |
| ERR_BC004_L3001_OP001_404_01 | 404 | 作成者不存在 | No |
| ERR_BC004_L3001_OP001_404_02 | 404 | 親単位不存在 | No |
| ERR_BC004_L3001_OP001_409 | 409 | 組織コード重複 | No |
| ERR_BC004_L3001_OP001_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC004_L3001_OP001_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)
- **リトライ不可エラー**: バリデーションエラー（400系）、リソース不存在（404系）

### ロールバック手順
1. トランザクション開始前の状態に自動ロールバック
2. 作成途中のOrganization、OrganizationUnit、階層関係レコードを削除
3. 発行済みイベントのキャンセル通知（EventStoreにcompensationイベント記録）
4. エラーログ記録（ERROR level、スタックトレース含む）
5. BC-003へのRBAC初期化要求キャンセル

### ログ記録要件
- **INFO**: 組織作成成功（organizationId, organizationCode, 作成単位数記録）
- **WARN**: 循環参照検出時（検出されたサイクルパス記録）、階層深度警告（深度8以上）
- **ERROR**: システムエラー（スタックトレース、入力パラメータ全量記録）
- **監査ログ**: 全組織作成操作（成功/失敗問わず）をAuditLogテーブルに記録（BC-003経由）

### BC間エラー連携
- **BC-003エラー**: User不存在時、RBAC初期化失敗時のエラー伝播
- **BC-005エラー**: チーム配置初期化失敗時の警告（組織作成は継続）

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
> - [services/secure-access-service/capabilities/manage-organizational-structure/operations/define-and-build-organization/](../../../../../../../services/secure-access-service/capabilities/manage-organizational-structure/operations/define-and-build-organization/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
