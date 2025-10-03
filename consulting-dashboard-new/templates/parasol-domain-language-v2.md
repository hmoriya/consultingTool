# [サービス名] - パラソルドメイン言語定義

## 1. ドメイン概要

### サービスの目的
[このサービスが提供するビジネス価値と目的を明確に記述]

### 主要な価値提供
- [ビジネス価値1：具体的な成果や効果]
- [ビジネス価値2：具体的な成果や効果]
- [ビジネス価値3：具体的な成果や効果]

### ドメインコンテキスト境界
- **上流コンテキスト**: [依存する他サービス]
- **下流コンテキスト**: [このサービスに依存するサービス]
- **共有カーネル**: [他サービスと共有する概念]

## 2. エンティティ定義

### コアエンティティ

#### EntityName（エンティティ名）<<entity>>
**識別性**: [一意識別の方法（例：EntityNameIDによって一意に識別される）]
**ライフサイクル**: [作成から削除までのライフサイクル（例：作成→活性→非活性→削除）]
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | 一意識別子 | - |
| name | STRING_100 | ○ | 名称 | 1文字以上 |
| description | TEXT | - | 説明 | - |
| status | ENUM | ○ | ステータス(active/inactive/deleted) | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |
| updatedAt | TIMESTAMP | ○ | 更新日時 | - |
| deletedAt | TIMESTAMP | - | 削除日時（論理削除） | - |

### サポートエンティティ

#### SupportEntity（サポートエンティティ）<<entity>>
**識別性**: [一意識別の方法]
**集約への所属**: [どの集約に属するか明記]
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | 一意識別子 | - |
| parentId | UUID | ○ | 親エンティティID（IDのみ参照） | 外部キー |
| value | STRING_200 | ○ | 値 | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |

## 3. 値オブジェクト定義

### ValueObjectName（値オブジェクト名）<<value object>>
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value-object

```typescript
interface ValueObjectName {
  property1: string;      // プロパティ1の説明
  property2: number;      // プロパティ2の説明
  property3: boolean;     // プロパティ3の説明

  // 値オブジェクトの振る舞い
  equals(other: ValueObjectName): boolean;
  validate(): boolean;
}
```

### 列挙型定義

```typescript
enum StatusType {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}
```

## 4. 集約定義

### AggregateRoot（集約名）<<aggregate root>>
**集約ルート**: EntityName
**ステレオタイプ**: aggregate

**包含エンティティ**:
- SupportEntity（1対多）
- RelatedEntity（1対多）

**集約境界の理由**:
- トランザクション整合性が必要な範囲
- ビジネス不変条件を保証する単位

**不変条件**:
- [ビジネスルール1：具体的な制約]
- [ビジネスルール2：具体的な制約]
- [ビジネスルール3：具体的な制約]

**他集約との関係**:
- OtherAggregateとはIDのみで参照（OtherAggregateId）
- 直接のオブジェクト参照は行わない

## 5. ドメインサービス

### DomainService <<service>>
**責務**: [複数の集約をまたぐ処理の調整]
**ステレオタイプ**: service

```typescript
interface DomainService {
  // 集約をまたぐ操作
  coordinateAggregates(
    aggregate1Id: UUID,
    aggregate2Id: UUID,
    params: Params
  ): Result<void>;

  // ビジネスルールの検証
  validateBusinessRule(
    entities: Entity[]
  ): Result<boolean>;

  // 複雑な計算処理
  calculateComplexValue(
    data: InputData
  ): Result<CalculatedValue>;
}
```

## 6. リポジトリインターフェース

### EntityRepository <<repository>>
**責務**: 永続化層の抽象化
**ステレオタイプ**: repository

```typescript
interface EntityRepository {
  // 基本操作
  findById(id: UUID): Promise<Entity | null>;
  findAll(limit?: number, offset?: number): Promise<Entity[]>;
  save(entity: Entity): Promise<void>;
  delete(id: UUID): Promise<void>;

  // ドメイン固有の検索
  findByStatus(status: StatusType): Promise<Entity[]>;
  findByDateRange(start: Date, end: Date): Promise<Entity[]>;

  // 集約全体の保存
  saveAggregate(aggregate: AggregateRoot): Promise<void>;
}
```

## 7. ファクトリ

### EntityFactory <<factory>>
**責務**: 複雑なエンティティ生成ロジックのカプセル化
**ステレオタイプ**: factory

```typescript
class EntityFactory {
  // 新規作成
  static createNew(params: CreateParams): Entity {
    // バリデーション
    // デフォルト値設定
    // 複雑な初期化ロジック
    return new Entity(/* ... */);
  }

  // 既存データからの復元
  static reconstitute(data: PersistenceData): Entity {
    // データ変換
    // 整合性チェック
    return new Entity(/* ... */);
  }
}
```

## 8. ドメインイベント

### EventName <<event>>
**発生タイミング**: [いつ発生するか]
**ステレオタイプ**: event

```typescript
class EventName implements DomainEvent {
  readonly eventId: UUID;
  readonly aggregateId: UUID;
  readonly occurredAt: Date;
  readonly eventType: string = 'EventName';

  readonly payload: {
    field1: Type1;  // 変更前の値
    field2: Type2;  // 変更後の値
    userId: UUID;   // 実行者
  };

  constructor(aggregateId: UUID, payload: Payload) {
    this.eventId = generateUUID();
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
```

### イベントハンドラー

```typescript
interface EventHandler {
  handle(event: DomainEvent): Promise<void>;
  canHandle(event: DomainEvent): boolean;
}
```

## 9. 仕様オブジェクト

### SpecificationName <<specification>>
**目的**: [複雑なビジネスルールのカプセル化]
**ステレオタイプ**: specification

```typescript
class SpecificationName implements Specification<Entity> {
  isSatisfiedBy(entity: Entity): boolean {
    // 複雑なビジネスルールの判定ロジック
    return /* 条件を満たすか */;
  }

  and(other: Specification<Entity>): Specification<Entity> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<Entity>): Specification<Entity> {
    return new OrSpecification(this, other);
  }
}
```

## 10. ビジネスルール

### 基本ルール
1. **一意性制約**: [何が一意でなければならないか]
2. **必須項目**: [何が必須か、いつ必須か]
3. **状態遷移**: [許可される状態遷移パターン]

### 整合性ルール
- **集約内整合性**: [集約内で保証される整合性]
- **結果整合性**: [非同期で保証される整合性]
- **参照整合性**: [ID参照による整合性]

### バリデーションルール
| ルール名 | 対象 | 条件 | エラーメッセージ |
|---------|------|------|----------------|
| 名称必須 | Entity.name | 1文字以上 | 名称は必須です |
| 状態遷移 | Entity.status | 定義された遷移のみ | 不正な状態遷移です |

## 11. インターフェース仕様

### コマンドインターフェース

```typescript
// エンティティ作成コマンド
interface CreateEntityCommand {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

// エンティティ更新コマンド
interface UpdateEntityCommand {
  id: UUID;
  name?: string;
  description?: string;
  status?: StatusType;
}

// コマンドハンドラー
interface CommandHandler {
  execute(command: Command): Promise<Result<void>>;
}
```

### クエリインターフェース

```typescript
// エンティティ検索クエリ
interface SearchEntityQuery {
  name?: string;
  status?: StatusType;
  createdFrom?: Date;
  createdTo?: Date;
  limit?: number;
  offset?: number;
}

// クエリハンドラー
interface QueryHandler {
  execute(query: Query): Promise<Result<any>>;
}
```

## 12. 統合ポイント

### 他サービスとの連携

1. **サービスA連携**
   - 連携方法: REST API / イベント
   - データ形式: JSON
   - 認証: JWT
   - 同期/非同期: 非同期

2. **サービスB連携**
   - 連携方法: メッセージキュー
   - データ形式: Protocol Buffers
   - 認証: API Key
   - 同期/非同期: 非同期

### 外部システム連携

- **外部API**: [連携する外部システム]
- **データ同期**: [同期方法とタイミング]
- **エラーハンドリング**: [リトライ、フォールバック戦略]

## 13. パフォーマンス要件

### レスポンスタイム
- 検索API: < 100ms (95パーセンタイル)
- 更新API: < 200ms (95パーセンタイル)
- バッチ処理: < 60分

### スループット
- 同時接続数: 1000
- リクエスト/秒: 100

### スケーラビリティ
- 水平スケーリング対応
- ステートレス設計
- キャッシュ戦略: Redis

## 14. セキュリティ要件

### 認証・認可
- 認証方式: JWT / OAuth2
- 認可: ロールベース（RBAC）
- セッション管理: ステートレス

### データ保護
- 暗号化: 保存時（AES-256）、通信時（TLS 1.3）
- 個人情報: マスキング、暗号化
- 監査ログ: 全操作を記録

## 15. データ型定義

### 基本型
```typescript
type UUID = string;           // UUID v4形式
type EMAIL = string;          // RFC5322準拠
type URL = string;            // RFC3986準拠
type DATE = string;           // YYYY-MM-DD形式
type TIMESTAMP = string;      // ISO8601形式
type MONEY = {
  amount: number;
  currency: string;
};

// 文字列型（長さ制限付き）
type STRING_20 = string;      // 最大20文字
type STRING_50 = string;      // 最大50文字
type STRING_100 = string;     // 最大100文字
type STRING_255 = string;     // 最大255文字
type TEXT = string;           // 長文（制限なし）

// 数値型
type INTEGER = number;        // 整数
type DECIMAL = number;        // 小数
type PERCENTAGE = number;     // 0-100

// その他
type BOOLEAN = boolean;       // 真偽値
type JSON = object;           // JSON形式
type BINARY = ArrayBuffer;   // バイナリデータ
```

## 16. Result型定義

```typescript
// 成功/失敗を表現する型
type Result<T> =
  | { success: true; value: T }
  | { success: false; error: Error };

// エラー型
interface Error {
  code: string;
  message: string;
  details?: any;
}
```