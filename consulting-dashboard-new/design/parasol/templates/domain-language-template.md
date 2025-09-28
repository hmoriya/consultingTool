# [パラソルドメイン名] [[Domain Name]] [[DOMAIN_NAME]]

**バージョン**: 1.0.0  
**更新日**: YYYY-MM-DD

## パラソルドメイン概要
[このパラソルドメインの目的と責務を記述]

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
STRING_500: 最大500文字の文字列
TEXT: 長文テキスト（制限なし）
MARKDOWN: Markdown形式のテキスト
EMAIL: メールアドレス形式（RFC5322準拠）
URL: URL形式（RFC3986準拠）
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
DECIMAL: 小数点数値
BOOLEAN: 真偽値（true/false）
JSON: JSON形式のデータ
ENUM: 列挙型
PERCENTAGE: パーセンテージ（0-100）
MONEY: 金額（通貨単位付き）
```

### カスタム型定義
```
[カスタム型名]: [型の説明] (基本型: [基本となる型])
例:
プロジェクトステータス: プロジェクトの状態 (基本型: ENUM)
  - planning: 計画中
  - active: 進行中
  - completed: 完了
  - onhold: 保留
```

## 状態遷移

```
[初期状態] → [状態2] → [状態3] → [最終状態]
            ↓
         [例外状態]
```

## エンティティ（Entities）

### [エンティティ名] [[Entity Name]] [[ENTITY_NAME]]
説明: [エンティティの説明]

属性:
- [エンティティ]ID [[EntityID]] [[ENTITY_ID]]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: [エンティティ]の一意識別子
- [外部エンティティ]リファレンス [[ExternalEntityRef]] [[EXTERNAL_ENTITY_REF]]
  - 型: [外部エンティティ]ID [[ExternalEntityID]] [[EXTERNAL_ENTITY_ID]]（参照）
  - 説明: [関連の説明]
  - 関連: [外部エンティティ] [[ExternalEntity]] → [このエンティティ] [[ThisEntity]]（1..*）
- [値オブジェクトプロパティ] [[ValueObjectProperty]] [[VALUE_OBJECT_PROPERTY]]
  - 型: [値オブジェクト名] [[ValueObjectName]] [[VALUE_OBJECT_NAME]]（値オブジェクト）
  - 説明: [値オブジェクトの用途]
- [コレクション属性] [[CollectionAttribute]] [[COLLECTION_ATTRIBUTE]]
  - 型: [子エンティティ]の配列 [[ChildEntity[]]] [[CHILD_ENTITY_ARRAY]]（0..*）
  - 説明: [コレクションの説明]
  - 関連: [このエンティティ] [[ThisEntity]] *→ [子エンティティ] [[ChildEntity]]（集約内包含）

不変条件:
- [不変条件1]
- [不変条件2]

振る舞い:
- [振る舞い名] [[BehaviorName]] [[BEHAVIOR_NAME]]
  - 目的: [振る舞いの目的]
  - 入力: [入力パラメータ]
  - 出力: [出力結果]
  - 事前条件: [実行前の条件]
  - 事後条件: [実行後の状態]

#### パラソルドメインイベント
- [イベント名]済み [[EventNameCompleted]] [[EVENT_NAME_COMPLETED]]：[発生タイミング]

#### 集約ルート
このエンティティは[集約名]集約のルートエンティティ

## 値オブジェクト（Value Objects）

### [値オブジェクト名] [[ValueObject Name]] [[VALUE_OBJECT_NAME]]
- 定義: [ビジネス上の意味]
- 属性:
  - [属性名] [[attribute]] [[ATTRIBUTE]]: [型] [[Type]] [[TYPE]]
  - [属性名] [[attribute]] [[ATTRIBUTE]]: [型] [[Type]] [[TYPE]]
- 制約: [有効な値の範囲]
- 使用エンティティ: [エンティティ1] [[Entity1]], [エンティティ2] [[Entity2]]
- 例: [具体例]

## 集約（Aggregates）

### [集約名] [[Aggregate Name]] [[AGGREGATE_NAME]]
- **集約ルート**: [エンティティ名] [[EntityName]] [[ENTITY_NAME]]
- **含まれるエンティティ**: 
  - [エンティティ名1] [[Entity1]] [[ENTITY1]]：[ルートとの関係と責務]
  - [エンティティ名2] [[Entity2]] [[ENTITY2]]：[ルートとの関係と責務]
- **含まれる値オブジェクト**:
  - [値オブジェクト1] [[ValueObject1]] [[VALUE_OBJECT1]]：[使用場所・目的]
  - [値オブジェクト2] [[ValueObject2]] [[VALUE_OBJECT2]]：[使用場所・目的]
- **トランザクション境界**: [境界の説明]
- **不変条件**: 
  - [不変条件1]
  - [不変条件2]
- **外部参照ルール**:
  - 集約外からは[ルートエンティティ]のIDのみで参照
  - 集約内のエンティティへの直接参照は禁止

## パラソルドメインサービス

### [サービス名] [[Service Name]] [[SERVICE_NAME]]
[サービスの説明]

#### 提供機能
- [機能名] [[OperationName]] [[OPERATION_NAME]]
  - 目的: [ビジネス上の目的]
  - 入力: [必要な情報]
  - 出力: [結果として得られるもの]
  - 制約: [実行条件や制限]

## パラソルドメインイベント

### [イベント名]済み [[EventNameCompleted]] [[EVENT_NAME_COMPLETED]]
- **発生タイミング**: [いつ発生するか]
- **ペイロード**: 
  - [属性名] [[AttributeName]] [[ATTRIBUTE_NAME]]: [型] [[Type]] [[TYPE]]
  - [属性名] [[AttributeName]] [[ATTRIBUTE_NAME]]: [型] [[Type]] [[TYPE]]

## ビジネスルール

### [カテゴリ]ルール
1. **[ルール名]**: [ルールの内容]
   - 例: [具体例]
   - 適用エンティティ: [エンティティ名] [[EntityName]]
2. **[ルール名]**: [ルールの内容]
   - 例: [具体例]
   - 適用集約: [集約名] [[AggregateName]]

### エラーパターン
- 1xxx: ドメインエラー
  - 1001: [具体的なエラー名]
  - 1002: [具体的なエラー名]
- 2xxx: アプリケーションエラー
  - 2001: [具体的なエラー名]
- 3xxx: システムエラー
  - 3001: [具体的なエラー名]

## DDDパターンチェックリスト

### エンティティ
- [ ] 一意識別子を持つ
- [ ] ライフサイクルを持つ
- [ ] ビジネスロジックを含む

### 値オブジェクト
- [ ] 不変性を保つ
- [ ] 識別子を持たない
- [ ] 等価性で比較される
- [ ] 使用エンティティが明確

### 集約
- [ ] 集約ルートが定義されている
- [ ] トランザクション境界が明確
- [ ] 不変条件が定義されている
- [ ] 外部参照ルールが明確

## リポジトリインターフェース

### [リポジトリ名] [[Repository Name]] [[REPOSITORY_NAME]]
集約: [集約名] [[AggregateName]] [[AGGREGATE_NAME]]

基本操作:
- findById(id: UUID): [エンティティ名] [[EntityName]] [[ENTITY_NAME]]
- save([entity]: [エンティティ名]): void
- delete(id: UUID): void

検索操作:
- findBy[条件](param: [型]): [戻り値型]
- findAll[条件](param: [型]): [エンティティ名][]

## リレーションシップ一覧

### エンティティ間の関連
- [エンティティ1] [[Entity1]] → [エンティティ2] [[Entity2]]（[多重度]）：[関連の説明]
- [エンティティ3] [[Entity3]] *→ [エンティティ4] [[Entity4]]（[多重度]）：[集約内の関連]

### 値オブジェクトの使用
- [エンティティ] [[Entity]] 使用 [値オブジェクト] [[ValueObject]]：[使用目的]

### 集約境界
- [集約名1] [[Aggregate1]]：[ルートエンティティ] [[RootEntity]]