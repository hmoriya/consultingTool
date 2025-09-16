# マイクロサービス通信レイヤー

このディレクトリには、各マイクロサービスとの通信を抽象化するサービスクラスが含まれています。

## アーキテクチャ概要

```
フロントエンド
    ↓
Next.js Server Actions / API Routes
    ↓
Service Layer (このディレクトリ)
    ↓
各マイクロサービスのPrisma Client
```

## サービス構成

### 1. プロジェクトサービス (`project-service.ts`)
- プロジェクト管理
- タスク管理
- マイルストーン管理
- リスク・イシュー管理

### 2. リソースサービス (`resource-service.ts`)
- チーム管理
- スキル管理
- リソース配分
- キャパシティプランニング

### 3. ユーザーサービス (`user-service.ts`)
- ユーザー情報取得
- 認証・権限管理
- プロファイル管理

### 4. 通知サービス (`notification-service.ts`)
- メッセージング
- 通知管理
- リアルタイム通信

## 設計原則

1. **サービス間の疎結合**
   - 各サービスは独立して動作
   - IDベースの参照のみを保持

2. **データ整合性**
   - 結果整合性を採用
   - 必要に応じてサービス間でデータを同期

3. **エラーハンドリング**
   - 各サービスで適切なエラーハンドリング
   - サービス停止時のフォールバック

4. **パフォーマンス最適化**
   - 必要なデータのみを取得
   - バッチ処理でN+1問題を回避

## 使用例

```typescript
// プロジェクト一覧を取得（関連データも含む）
const projects = await projectService.getProjectsWithDetails({
  includeMembers: true,
  includeTasks: true
})

// リソース配分を確認
const allocation = await resourceService.checkResourceAvailability(
  userId,
  startDate,
  endDate
)
```