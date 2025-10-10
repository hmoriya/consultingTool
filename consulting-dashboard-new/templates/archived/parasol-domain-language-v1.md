# [サービス名] - パラソルドメイン言語定義

## 1. ドメイン概要

### サービスの目的
[このサービスが提供する価値と目的を記述]

### 主要な価値提供
- [価値1]
- [価値2]
- [価値3]

## 2. エンティティ定義

### コアエンティティ

#### EntityName（エンティティ名）
**識別性**: [一意識別の方法]
**ライフサイクル**: [作成から削除までのライフサイクル]

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| name | STRING_100 | ○ | 名称 |
| description | TEXT | - | 説明 |
| status | ENUM | ○ | ステータス |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

### サポートエンティティ

#### SupportEntity（サポートエンティティ）
**識別性**: [一意識別の方法]

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| parentId | UUID | ○ | 親エンティティID |
| value | STRING_200 | ○ | 値 |

## 3. 値オブジェクト定義

### ValueObjectName（値オブジェクト名）
```typescript
interface ValueObjectName {
  property1: string;  // プロパティ1
  property2: number;  // プロパティ2
  property3: boolean; // プロパティ3
}
```

## 4. 集約定義

### AggregateRoot（集約名）
**集約ルート**: EntityName
**包含エンティティ**:
- SupportEntity
- RelatedEntity

**不変条件**:
- ビジネスルール1
- ビジネスルール2
- ビジネスルール3

## 5. ドメインサービス

### DomainService
```typescript
interface DomainService {
  // メソッド定義
  executeOperation(params: Params): Result;
  validateRule(entity: Entity): boolean;
  calculateValue(data: Data): Value;
}
```

## 6. ドメインイベント

### EventName
```typescript
class EventName {
  eventId: UUID;
  aggregateId: UUID;
  occurredAt: Date;
  payload: {
    field1: value1;
    field2: value2;
  };
}
```

## 7. ビジネスルール

### 基本ルール
1. **ルール1**: [ルールの説明]
2. **ルール2**: [ルールの説明]
3. **ルール3**: [ルールの説明]

### 制約条件
- [制約1]
- [制約2]
- [制約3]

## 8. リポジトリインターフェース

### EntityRepository
```typescript
interface EntityRepository {
  findById(id: UUID): Entity | null;
  findAll(): Entity[];
  save(entity: Entity): void;
  delete(id: UUID): void;
  findByCondition(condition: Condition): Entity[];
}
```