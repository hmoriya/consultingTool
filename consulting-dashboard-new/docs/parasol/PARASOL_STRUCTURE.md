# パラソル設計ディレクトリ完全構造

> ⚠️ **構造進化のお知らせ**: このドキュメントは現在のサービス構造を記録しています。
>
> **最新の階層構造設計（v3.0）については**:
> - [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) - L3 Capability ⊃ Operation階層
> - [PARASOL_LAYERED_DIRECTORY_STRATEGY.md](PARASOL_LAYERED_DIRECTORY_STRATEGY.md) - 3層ディレクトリ分離戦略
>
> **v3.0の核心**:
> - **Service** = 複数のBC（Business Capability）を含む
> - **BC** = ビジネスケーパビリティ（Why-What-Howの中心）
> - **L3 Capability** = What（能力の定義）
> - **Operation** = How（能力を実現する操作）
> - 階層: Service ⊃ BC ⊃ L3 ⊃ Operation ⊃ UseCase

## 📊 統計情報
- **合計サービス**: 7
- **合計ケーパビリティ**: 22
- **合計オペレーション**: 66

## 🎯 Issue #102 完了サマリー

### 完了した作業
1. ✅ **4サービスの構造化完了**
   - project-success-service: 4 capabilities + 12 operations
   - revenue-optimization-service: 5 capabilities + 15 operations
   - talent-optimization-service: 5 capabilities + 15 operations
   - secure-access-service: 4 capabilities + 12 operations

2. ✅ **ディレクトリ構造作成**
   - 各operationディレクトリに `operation.md`, `pages/`, `tests/` を配置

3. ✅ **ケーパビリティファイル作成**
   - 16個の capability.md ファイル作成完了

4. ✅ **オペレーションファイル作成**
   - 54個の operation.md ファイル作成完了

5. ✅ **APIインポート完了**
   - 全7サービス、22ケーパビリティ、66オペレーションをデータベースに登録

---

## 📁 サービス別ディレクトリ構造

### 1. collaboration-facilitation-service (コラボレーション促進サービス)

**ケーパビリティ**: 1個 | **オペレーション**: 3個

```
capabilities/
└── communication-delivery/ (情報を即座に届ける能力)
    ├── capability.md
    └── operations/
        ├── facilitate-communication/
        │   ├── operation.md
        │   ├── pages/
        │   └── tests/
        ├── manage-meetings/
        │   ├── operation.md
        │   ├── pages/
        │   └── tests/
        └── send-notification/
            ├── operation.md
            ├── pages/
            └── tests/
```

---

### 2. knowledge-co-creation-service (ナレッジ共創サービス)

**ケーパビリティ**: 1個 | **オペレーション**: 3個

```
capabilities/
└── knowledge-management/ (知識を組織資産化する能力)
    ├── capability.md
    └── operations/
        ├── apply-knowledge/
        │   ├── operation.md
        │   ├── pages/
        │   └── tests/
        ├── capture-knowledge/
        │   ├── operation.md
        │   ├── pages/
        │   └── tests/
        └── share-knowledge/
            ├── operation.md
            ├── pages/
            └── tests/
```

---

### 3. productivity-visualization-service (生産性可視化サービス)

**ケーパビリティ**: 1個 | **オペレーション**: 3個

```
capabilities/
└── workload-tracking/ (工数を正確に把握する能力)
    ├── capability.md
    └── operations/
        ├── analyze-utilization/
        │   ├── operation.md
        │   ├── pages/
        │   └── tests/
        ├── approve-timesheet/
        │   ├── operation.md
        │   ├── pages/
        │   └── tests/
        └── record-time/
            ├── operation.md
            ├── pages/
            └── tests/
```

---

### 4. project-success-service (プロジェクト成功支援サービス) ⭐

**ケーパビリティ**: 4個 | **オペレーション**: 12個

#### ケーパビリティ一覧
1. プロジェクトを計画し実行する能力
2. タスクを管理し完遂する能力
3. リスクを先読みし対処する能力
4. 成果物を管理し品質を保証する能力

#### オペレーション一覧
- プロジェクトを立ち上げる
- プロジェクトを実行し監視する
- プロジェクトを完了し評価する
- タスクを分解し定義する
- タスクを割り当て実行する
- タスク進捗を追跡する
- リスクを識別し評価する
- リスク対応を計画する
- リスクを監視し対処する
- 成果物を定義し作成する
- 成果物をレビューし承認する
- 成果物をバージョン管理する

---

### 5. revenue-optimization-service (収益最適化サービス) ⭐

**ケーパビリティ**: 5個 | **オペレーション**: 15個

#### ケーパビリティ一覧
1. 収益を認識し最大化する能力
2. コストを統制し最適化する能力
3. 予算を策定し統制する能力
4. 収益性を分析し改善する能力
5. 財務を最適化する能力（旧）

#### オペレーション一覧
- 収益を認識し記録する
- 請求書を発行し回収を管理する
- 収益を予測し最大化する
- コストを記録し分類する
- コスト推移を分析する
- コストを配賦し最適化する
- 予算を策定する
- 予算を承認し確定する
- 予算を監視し統制する
- 予算を見直し再配分する
- 収益性を計算する
- 収益性推移を分析する
- 改善アクションを提案する
- キャッシュフローを予測し最適化する
- （旧）収益を追跡する／コストを管理する／収益性を最適化する

---

### 6. talent-optimization-service (タレント最適化サービス) ⭐

**ケーパビリティ**: 5個 | **オペレーション**: 15個

#### ケーパビリティ一覧
1. メンバーを管理し育成する能力
2. チームを編成し最適化する能力
3. スキルを可視化し育成する能力
4. リソースを最適に配分する能力
5. チーム生産性を最大化する能力（旧）

#### オペレーション一覧
- メンバーを登録し管理する
- パフォーマンスを評価する
- キャリアを開発する
- チームを編成する
- チームパフォーマンスを監視する
- チーム構造を最適化する
- スキルを定義し体系化する
- スキルギャップを分析する
- スキル開発を計画し実行する
- リソース需要を予測する
- リソースを配分し調整する
- 稼働率を監視し最適化する
- （旧）チームを構築する／スキルを育成する／リソースを最適化する

---

### 7. secure-access-service (セキュアアクセスサービス) ⭐

**ケーパビリティ**: 4個 | **オペレーション**: 12個

#### ケーパビリティ一覧
1. ユーザーを認証し管理する能力
2. アクセス権限を制御する能力
3. 組織構造を管理する能力
4. セキュリティを監査し保証する能力

#### オペレーション一覧
- ユーザーを登録し認証する
- 多要素認証を実施する
- パスワードを管理する
- ロールと権限を定義する
- 権限を付与し管理する
- 権限を監査し見直す
- 組織を定義し構築する
- 組織を変更し再編成する
- 組織階層を可視化する
- 監査ログを記録し保管する
- セキュリティイベントを検知し分析する
- コンプライアンスを監査し報告する

---

## 📝 標準ファイル構成

### サービスレベル (各サービスのルート)
- `service.md` - サービス概要、ビジネス価値、ドメイン言語定義
- `domain-language.md` - パラソルドメイン言語の詳細定義
- `capabilities-and-operations.md` - ケーパビリティとオペレーションの詳細設計（⭐マーク付きサービスのみ）

### ケーパビリティレベル
- `capability.md` - ケーパビリティの定義、責務、提供価値、成熟度レベル

### オペレーションレベル
各オペレーションディレクトリには以下が配置されます：
```
{operation-name}/
├── operation.md     # オペレーション定義
│                    # - 目的、パターン、ゴール
│                    # - 関係者とロール
│                    # - プロセスフロー（Mermaid）
│                    # - ビジネス状態（Mermaid）
│                    # - KPI
│                    # - ビジネスルール
│                    # - 入出力仕様
│                    # - 例外処理
│                    # - 派生ユースケース
├── pages/          # ページ定義用ディレクトリ
└── tests/          # テスト定義用ディレクトリ
```

---

## 🔍 ファイル数統計

### capability.md ファイル
- collaboration-facilitation-service: 1
- knowledge-co-creation-service: 1
- productivity-visualization-service: 1
- project-success-service: 4 ⭐
- revenue-optimization-service: 5 ⭐
- talent-optimization-service: 5 ⭐
- secure-access-service: 4 ⭐
- **合計**: 22 capability.md

### operation.md ファイル
- collaboration-facilitation-service: 3
- knowledge-co-creation-service: 3
- productivity-visualization-service: 3
- project-success-service: 12 ⭐
- revenue-optimization-service: 15 ⭐
- talent-optimization-service: 15 ⭐
- secure-access-service: 12 ⭐
- **合計**: 66 operation.md

### ディレクトリ
- pages/ディレクトリ: 66個
- tests/ディレクトリ: 66個

---

## 🎨 パターン分類

### ビジネスオペレーションパターン
各operation.mdファイルには以下のいずれかのパターンが定義されています：

- **CRUD**: 基本的なデータ管理
- **Workflow**: 複数ステップの処理フロー
- **Analytics**: 分析・レポーティング
- **Communication**: コミュニケーション・通知
- **Administration**: システム管理・設定

---

## 📚 関連ドキュメント

- [Issue #102](../../../docs/issues/issue-102-parasol-capability-structure.md) - パラソルケーパビリティ構造化タスク
- [CLAUDE.md](../../../CLAUDE.md) - プロジェクト全体のガイドライン
- [パラソル設計手法](../README.md) - パラソル設計の概要

---

**作成日**: 2025-10-01
**最終更新**: 2025-10-01
**Issue**: #102
