# パラソルV3 MVP ドメイン言語定義書

## 概要

パラソルV3 MVP（タスク管理境界コンテキスト）におけるドメインエンティティ、値オブジェクト、集約、ドメインサービスの定義。

## バージョン情報

| 項目 | 内容 |
|------|------|
| バージョン | 1.0 |
| 作成日 | 2024-11-05 |
| 作成者 | Claude Code |
| 対象システム | パラソルV3 MVP - BC-001タスク管理 |

---

## 1. ドメインエンティティ

### 1.1 Task（タスク）

**概要**: システムで管理される作業単位の中核エンティティ

**属性**:
- `taskId`: タスク識別子（一意）
- `title`: タスク名
- `description`: タスク詳細説明
- `status`: タスクステータス
- `priority`: 優先度
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `dueDate`: 期限日
- `estimatedHours`: 見積時間
- `actualHours`: 実績時間
- `completionRate`: 完了率

**ビジネスルール**:
- タスクIDは一度設定されたら変更不可
- ステータス変更には特定の遷移ルールが適用される
- 完了率は0-100%の範囲でのみ有効

### 1.2 User（ユーザー）

**概要**: システム利用者を表すエンティティ

**属性**:
- `userId`: ユーザー識別子（一意）
- `email`: メールアドレス
- `displayName`: 表示名
- `role`: ロール
- `isActive`: アクティブ状態
- `createdAt`: 作成日時
- `lastLoginAt`: 最終ログイン日時

**ビジネスルール**:
- メールアドレスは一意である必要がある
- 非アクティブユーザーはタスクにアサインできない

### 1.3 Project（プロジェクト）

**概要**: タスクをグループ化する上位概念

**属性**:
- `projectId`: プロジェクト識別子（一意）
- `name`: プロジェクト名
- `description`: プロジェクト説明
- `status`: プロジェクトステータス
- `startDate`: 開始日
- `endDate`: 終了日
- `ownerId`: オーナーユーザーID

---

## 2. 値オブジェクト

### 2.1 TaskStatus（タスクステータス）

**概要**: タスクの現在の状態を表す値オブジェクト

**値**:
- `TODO`: 未着手
- `IN_PROGRESS`: 進行中
- `REVIEW`: レビュー中
- `DONE`: 完了
- `CANCELLED`: キャンセル

**ビジネスルール**:
- 状態遷移は以下のパターンのみ許可:
  - TODO → IN_PROGRESS
  - IN_PROGRESS → REVIEW
  - REVIEW → DONE
  - REVIEW → IN_PROGRESS（差し戻し）
  - 任意の状態 → CANCELLED

### 2.2 Priority（優先度）

**概要**: タスクの重要度・緊急度を表す値オブジェクト

**値**:
- `CRITICAL`: 最重要（1）
- `HIGH`: 高（2）
- `MEDIUM`: 中（3）
- `LOW`: 低（4）

### 2.3 UserRole（ユーザーロール）

**概要**: ユーザーの権限レベルを表す値オブジェクト

**値**:
- `ADMIN`: システム管理者
- `MANAGER`: プロジェクトマネージャー
- `MEMBER`: 一般メンバー
- `VIEWER`: 閲覧専用

### 2.4 TimeRange（時間範囲）

**概要**: 期間を表す値オブジェクト

**属性**:
- `startTime`: 開始時刻
- `endTime`: 終了時刻

**ビジネスルール**:
- 開始時刻は終了時刻より前である必要がある
- 同一日時の範囲も有効

---

## 3. 集約

### 3.1 TaskAggregate（タスク集約）

**概要**: タスクとその関連情報をまとめて管理する集約

**集約ルート**: Task

**含まれるエンティティ**:
- Task（ルート）
- TaskAssignment（アサイン情報）
- TaskComment（コメント）
- TaskAttachment（添付ファイル）

**ビジネスルール**:
- タスクの削除時は関連するすべての情報も削除される
- アサイン情報の変更はタスクの更新日時を更新する

### 3.2 ProjectAggregate（プロジェクト集約）

**概要**: プロジェクトとその配下のタスクを管理する集約

**集約ルート**: Project

**含まれるエンティティ**:
- Project（ルート）
- ProjectMember（プロジェクトメンバー）
- ProjectMilestone（マイルストーン）

**ビジネスルール**:
- プロジェクトにはオーナーが必須
- プロジェクト削除時は配下タスクの処理方針を決定する必要がある

---

## 4. ドメインサービス

### 4.1 TaskAssignmentService（タスクアサインサービス）

**責務**: タスクのアサイン・アサイン解除の複雑なビジネスロジックを管理

**主要メソッド**:
- `assignTask(taskId, userId, role)`: タスクアサイン
- `unassignTask(taskId, userId)`: アサイン解除
- `reassignTask(taskId, fromUserId, toUserId)`: アサイン変更
- `validateAssignment(taskId, userId)`: アサイン可能性チェック

**ビジネスルール**:
- ユーザーのアクティブ状態チェック
- 同時アサイン可能数の制限チェック
- 必要スキルのマッチング

### 4.2 TaskProgressService（タスク進捗サービス）

**責務**: タスクの進捗管理と状態遷移の制御

**主要メソッド**:
- `updateProgress(taskId, completionRate)`: 進捗率更新
- `changeStatus(taskId, newStatus)`: ステータス変更
- `calculateProjectProgress(projectId)`: プロジェクト進捗計算

**ビジネスルール**:
- ステータス遷移の妥当性チェック
- 進捗率と状態の整合性確保

### 4.3 TaskValidationService（タスク検証サービス）

**責務**: タスク作成・更新時の複合的な検証

**主要メソッド**:
- `validateTaskCreation(taskData)`: タスク作成時検証
- `validateTaskUpdate(taskId, updates)`: タスク更新時検証
- `validateDependencies(taskId, dependencies)`: 依存関係検証

**ビジネスルール**:
- 依存関係の循環参照チェック
- 期限日の妥当性チェック
- 必須項目の存在チェック

---

## 5. ドメインイベント

### 5.1 TaskCreated（タスク作成イベント）

**発生タイミング**: 新しいタスクが作成された時

**イベントデータ**:
- `taskId`: 作成されたタスクID
- `createdBy`: 作成者ユーザーID
- `projectId`: 所属プロジェクトID
- `createdAt`: 作成日時

### 5.2 TaskAssigned（タスクアサインイベント）

**発生タイミング**: タスクがユーザーにアサインされた時

**イベントデータ**:
- `taskId`: 対象タスクID
- `assignedUserId`: アサインされたユーザーID
- `assignedBy`: アサイン実行者ユーザーID
- `assignedAt`: アサイン日時

### 5.3 TaskCompleted（タスク完了イベント）

**発生タイミング**: タスクが完了状態になった時

**イベントデータ**:
- `taskId`: 完了したタスクID
- `completedBy`: 完了者ユーザーID
- `completedAt`: 完了日時
- `actualHours`: 実績時間

---

## 6. ビジネス不変条件

### 6.1 タスクレベル
1. **一意性**: タスクIDはシステム内で一意である
2. **完了率制約**: 完了率は0以上100以下の値である
3. **期限制約**: 期限日は作成日以降の日付である
4. **ステータス制約**: 定義されたステータス遷移ルールに従う

### 6.2 ユーザーレベル
1. **一意性**: メールアドレスはシステム内で一意である
2. **アクティブ制約**: 非アクティブユーザーは新規タスクにアサインできない
3. **権限制約**: ロールに応じた操作権限が適用される

### 6.3 プロジェクトレベル
1. **オーナー必須**: すべてのプロジェクトにはオーナーが設定されている
2. **期間制約**: 開始日は終了日以前である
3. **ステータス制約**: アクティブなプロジェクトのみ新規タスクを受け入れる

---

## 7. ドメインクラス図

```mermaid
classDiagram
    class Task {
        +String taskId
        +String title
        +String description
        +TaskStatus status
        +Priority priority
        +DateTime createdAt
        +DateTime updatedAt
        +Date dueDate
        +Integer estimatedHours
        +Integer actualHours
        +Integer completionRate
        +updateStatus(TaskStatus)
        +updateProgress(Integer)
    }

    class User {
        +String userId
        +String email
        +String displayName
        +UserRole role
        +Boolean isActive
        +DateTime createdAt
        +DateTime lastLoginAt
        +isAvailableForAssignment()
    }

    class Project {
        +String projectId
        +String name
        +String description
        +ProjectStatus status
        +Date startDate
        +Date endDate
        +String ownerId
        +addTask(Task)
        +removeTask(String)
    }

    class TaskStatus {
        <<enumeration>>
        TODO
        IN_PROGRESS
        REVIEW
        DONE
        CANCELLED
    }

    class Priority {
        <<enumeration>>
        CRITICAL
        HIGH
        MEDIUM
        LOW
    }

    class UserRole {
        <<enumeration>>
        ADMIN
        MANAGER
        MEMBER
        VIEWER
    }

    class TaskAssignment {
        +String taskId
        +String userId
        +AssignmentRole role
        +DateTime assignedAt
    }

    class TaskComment {
        +String commentId
        +String taskId
        +String userId
        +String content
        +DateTime createdAt
    }

    class TaskAttachment {
        +String attachmentId
        +String taskId
        +String fileName
        +String fileUrl
        +DateTime uploadedAt
    }

    %% リレーションシップ
    Task }|--|| TaskStatus : has
    Task }|--|| Priority : has
    User }|--|| UserRole : has
    Project ||--o{ Task : contains
    User ||--o{ TaskAssignment : participates
    Task ||--o{ TaskAssignment : has
    Task ||--o{ TaskComment : has
    Task ||--o{ TaskAttachment : has
    User ||--o{ TaskComment : writes
    Project ||--|| User : owned_by
```

---

## 8. 更新履歴

| バージョン | 更新日 | 更新者 | 更新内容 |
|-----------|--------|---------|----------|
| 1.0 | 2024-11-05 | Claude Code | 初版作成 |

---

## 9. 関連ドキュメント

- [MVP実装計画書](mvp-implementation-plan.md)
- [API仕様書](api-specification.md)
- [データベース設計書](database-design.md)
- [統合仕様書](integration-specification.md)