# OP-002: 組織階層を可視化する

**作成日**: 2025-10-31
**所属L3**: L3-001-organization-design-and-structure: Organization Design And Structure
**所属BC**: BC-004: Organizational Structure & Governance
**V2移行元**: services/secure-access-service/capabilities/manage-organizational-structure/operations/visualize-organizational-hierarchy

---

## 📋 How: この操作の定義

### 操作の概要
組織の階層構造を視覚的に表現し、組織図として提供する。直感的な組織理解により、コミュニケーションとガバナンスを促進する。

### 実現する機能
- 組織図の動的生成
- 階層レベル別の表示切り替え
- 部門・チーム詳細情報の表示
- 組織図のエクスポート機能

### 入力
- 組織構造データ
- 表示レベルの指定
- フィルタ条件
- 表示形式の設定

### 出力
- 組織図（ツリー形式）
- 部門・チーム詳細情報
- エクスポートファイル（PDF、画像等）
- 組織統計情報

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
> - [services/secure-access-service/capabilities/manage-organizational-structure/operations/visualize-organizational-hierarchy/](../../../../../../../services/secure-access-service/capabilities/manage-organizational-structure/operations/visualize-organizational-hierarchy/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
