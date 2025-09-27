# [パラソルドメイン名] [[Domain Name]] [[DOMAIN_NAME]]

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
[カスタム型名]: [型の説明] (基本型: [基枬となる型])
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
- [属性名] [[AttributeName]] [[ATTRIBUTE_NAME]]
  - 型: [型] [[Type]] [[TYPE]]
  - 説明: [属性の説明]

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
- 制約: [有効な値の範囲]
- 例: [具体例]

## 集約（Aggregates）

### [集約名] [[Aggregate Name]] [[AGGREGATE_NAME]]
- **集約ルート**: [エンティティ名] [[EntityName]] [[ENTITY_NAME]]
- **含まれるエンティティ**: [エンティティ名1]、[エンティティ名2]
- **トランザクション境界**: [境界の説明]
- **不変条件**: [不変条件の説明]

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
2. **[ルール名]**: [ルールの内容]
   - 例: [具体例]

### エラーパターン
- 1xxx: ドメインエラー
  - 1001: [具体的なエラー名]
  - 1002: [具体的なエラー名]
- 2xxx: アプリケーションエラー
  - 2001: [具体的なエラー名]
- 3xxx: システムエラー
  - 3001: [具体的なエラー名]

## リポジトリインターフェース

### [リポジトリ名] [[Repository Name]] [[REPOSITORY_NAME]]
- findById(id: UUID): [エンティティ名] [[EntityName]] [[ENTITY_NAME]]
- findBy[条件](param: [型]): [戻り値型]
- save([entity]: [エンティティ名]): void
- delete(id: UUID): void