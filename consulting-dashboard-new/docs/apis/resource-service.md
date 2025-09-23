# リソースサービス API仕様

## 基本情報
- ベースパス: `/api/resources`
- 認証方式: JWT Bearer Token
- レート制限: 100リクエスト/分/IP
- バージョン: v1.0.0

## エンドポイント定義

### 1. リソース管理

#### GET /api/resources
**説明**: リソース（人材）一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| page | INTEGER | - | ページ番号（デフォルト: 1） |
| limit | INTEGER | - | 件数（デフォルト: 20） |
| teamId | UUID | - | チームIDフィルター |
| skillId | UUID | - | スキルIDフィルター |
| availability | ENUM | - | 稼働状況フィルター |
| search | STRING | - | 検索キーワード |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| resources | ARRAY[RESOURCE] | リソース一覧 |
| total | INTEGER | 総件数 |
| page | INTEGER | 現在のページ |
| totalPages | INTEGER | 総ページ数 |

---

#### GET /api/resources/:id
**説明**: リソース詳細の取得

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | リソースID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | リソースID |
| userId | UUID | ユーザーID |
| employeeCode | STRING_20 | 社員番号 |
| department | STRING_50 | 部署 |
| position | STRING_50 | 役職 |
| level | ENUM | レベル |
| baseRate | MONEY | 基本単価 |
| skills | ARRAY[SKILL_ASSIGNMENT] | スキル一覧 |
| currentProjects | ARRAY[PROJECT_ASSIGNMENT] | 現在のプロジェクト |
| availability | PERCENTAGE | 稼働可能率 |
| location | STRING_50 | 勤務地 |

---

#### GET /api/resources/:id/availability
**説明**: リソースの稼働状況取得

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | リソースID |

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| startDate | DATE | ✓ | 開始日 |
| endDate | DATE | ✓ | 終了日 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| availability | ARRAY[AVAILABILITY_SLOT] | 稼働状況スロット |
| summary | OBJECT | 期間サマリー |

---

### 2. チーム管理

#### GET /api/teams
**説明**: チーム一覧の取得

**認証**: 必要

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| teams | ARRAY[TEAM] | チーム一覧 |

---

#### GET /api/teams/:id
**説明**: チーム詳細の取得

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | チームID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | チームID |
| name | STRING_100 | チーム名 |
| description | TEXT | チーム説明 |
| leaderId | UUID | リーダーID |
| members | ARRAY[TEAM_MEMBER] | メンバー一覧 |
| specialization | STRING_50 | 専門分野 |
| createdAt | TIMESTAMP | 作成日時 |

---

#### POST /api/teams
**説明**: 新規チームの作成

**認証**: 管理者権限

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| name | STRING_100 | ✓ | チーム名 |
| description | TEXT | - | チーム説明 |
| leaderId | UUID | ✓ | リーダーID |
| specialization | STRING_50 | - | 専門分野 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| team | TEAM_OBJECT | 作成されたチーム |

---

#### POST /api/teams/:id/members
**説明**: チームメンバーの追加

**認証**: チームリーダーまたは管理者

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | チームID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| userId | UUID | ✓ | ユーザーID |
| role | ENUM | ✓ | チーム内ロール |
| joinDate | DATE | ✓ | 参加日 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| member | TEAM_MEMBER_OBJECT | 追加されたメンバー |

---

### 3. スキル管理

#### GET /api/skills
**説明**: スキル一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| category | STRING | - | カテゴリーフィルター |
| search | STRING | - | 検索キーワード |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| skills | ARRAY[SKILL] | スキル一覧 |

---

#### POST /api/skills
**説明**: 新規スキルの登録

**認証**: 管理者権限

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| name | STRING_100 | ✓ | スキル名 |
| category | STRING_50 | ✓ | カテゴリー |
| description | TEXT | - | スキル説明 |
| levels | ARRAY[SKILL_LEVEL] | ✓ | レベル定義 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| skill | SKILL_OBJECT | 登録されたスキル |

---

#### POST /api/resources/:resourceId/skills
**説明**: リソースへのスキル割り当て

**認証**: 本人または管理者

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| resourceId | UUID | リソースID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| skillId | UUID | ✓ | スキルID |
| level | ENUM | ✓ | スキルレベル |
| yearsOfExperience | INTEGER | - | 経験年数 |
| certificationDate | DATE | - | 認定日 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| assignment | SKILL_ASSIGNMENT_OBJECT | 割り当て情報 |

---

### 4. アサインメント管理

#### GET /api/assignments
**説明**: アサインメント一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| resourceId | UUID | - | リソースIDフィルター |
| projectId | UUID | - | プロジェクトIDフィルター |
| status | ENUM | - | ステータスフィルター |
| startDate | DATE | - | 開始日フィルター |
| endDate | DATE | - | 終了日フィルター |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| assignments | ARRAY[ASSIGNMENT] | アサインメント一覧 |

---

#### POST /api/assignments
**説明**: 新規アサインメントの作成

**認証**: PM以上の権限

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| resourceId | UUID | ✓ | リソースID |
| projectId | UUID | ✓ | プロジェクトID |
| role | ENUM | ✓ | プロジェクト内ロール |
| allocationRate | PERCENTAGE | ✓ | 稼働率 |
| startDate | DATE | ✓ | 開始日 |
| endDate | DATE | ✓ | 終了予定日 |
| billableRate | MONEY | - | 請求単価 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| assignment | ASSIGNMENT_OBJECT | 作成されたアサインメント |

---

#### PUT /api/assignments/:id
**説明**: アサインメントの更新

**認証**: PM以上の権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | アサインメントID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| allocationRate | PERCENTAGE | - | 稼働率 |
| endDate | DATE | - | 終了予定日 |
| status | ENUM | - | ステータス |
| actualEndDate | DATE | - | 実終了日 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| assignment | ASSIGNMENT_OBJECT | 更新されたアサインメント |

---

## 型定義

### RESOURCE_OBJECT
```
{
  id: UUID,
  userId: UUID,
  employeeCode: STRING_20,
  department: STRING_50,
  position: STRING_50,
  level: ENUM[Junior|Middle|Senior|Expert|Principal],
  baseRate: MONEY,
  availability: PERCENTAGE
}
```

### TEAM_OBJECT
```
{
  id: UUID,
  name: STRING_100,
  description: TEXT,
  leaderId: UUID,
  specialization: STRING_50,
  memberCount: INTEGER
}
```

### SKILL_OBJECT
```
{
  id: UUID,
  name: STRING_100,
  category: STRING_50,
  description: TEXT,
  levels: ARRAY[SKILL_LEVEL]
}
```

### ASSIGNMENT_OBJECT
```
{
  id: UUID,
  resourceId: UUID,
  projectId: UUID,
  role: ENUM,
  allocationRate: PERCENTAGE,
  startDate: DATE,
  endDate: DATE,
  actualEndDate: DATE,
  status: ENUM[Planned|Active|Completed|Cancelled],
  billableRate: MONEY
}
```

### SKILL_ASSIGNMENT_OBJECT
```
{
  skillId: UUID,
  resourceId: UUID,
  level: ENUM[Beginner|Intermediate|Advanced|Expert],
  yearsOfExperience: INTEGER,
  certificationDate: DATE,
  lastUsedDate: DATE
}
```

### AVAILABILITY_SLOT
```
{
  date: DATE,
  availableHours: DECIMAL,
  allocatedHours: DECIMAL,
  projects: ARRAY[{
    projectId: UUID,
    hours: DECIMAL
  }]
}
```

## エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| RESOURCE_NOT_FOUND | 404 | リソースが存在しない |
| TEAM_NOT_FOUND | 404 | チームが存在しない |
| SKILL_NOT_FOUND | 404 | スキルが存在しない |
| ASSIGNMENT_CONFLICT | 409 | アサインメント競合 |
| ALLOCATION_EXCEEDS_100 | 400 | 稼働率が100%を超過 |
| INVALID_DATE_RANGE | 400 | 無効な日付範囲 |
| MEMBER_ALREADY_IN_TEAM | 409 | メンバー既にチーム所属 |
| SKILL_ALREADY_ASSIGNED | 409 | スキル既に割り当て済み |