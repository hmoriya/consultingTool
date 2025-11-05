# データベース構成

## 重要: DBファイルの配置ルール

**⚠️ 警告: 重複は絶対に許可されません！**

**正式なDBファイルの配置場所（これ以外の場所にDBファイルを作成しないでください）:**

以下の**8つのデータベースのみ**が存在を許可されています：

### 1. 認証サービスデータベース
- **正式パス**: `prisma/auth-service/data/auth.db`
- **環境変数**: `AUTH_DATABASE_URL="file:./prisma/auth-service/data/auth.db"`
- **用途**: ユーザー認証、ロール管理、組織情報、監査ログ

### 2. プロジェクトサービスデータベース
- **正式パス**: `prisma/project-service/data/project.db`
- **環境変数**: `PROJECT_DATABASE_URL="file:./prisma/project-service/data/project.db"`
- **用途**: プロジェクト、タスク、マイルストーン、プロジェクトメンバー、リスク管理

### 3. リソースサービスデータベース
- **正式パス**: `prisma/resource-service/data/resource.db`
- **環境変数**: `RESOURCE_DATABASE_URL="file:./prisma/resource-service/data/resource.db"`
- **用途**: チーム管理、スキル管理、リソース配分

### 4. タイムシートサービスデータベース
- **正式パス**: `prisma/timesheet-service/data/timesheet.db`
- **環境変数**: `TIMESHEET_DATABASE_URL="file:./prisma/timesheet-service/data/timesheet.db"`
- **用途**: 工数管理、承認フロー

### 5. 通知サービスデータベース
- **正式パス**: `prisma/notification-service/data/notification.db`
- **環境変数**: `NOTIFICATION_DATABASE_URL="file:./prisma/notification-service/data/notification.db"`
- **用途**: 通知、メッセージ、アラート

### 6. ナレッジサービスデータベース
- **正式パス**: `prisma/knowledge-service/data/knowledge.db`
- **環境変数**: `KNOWLEDGE_DATABASE_URL="file:./prisma/knowledge-service/data/knowledge.db"`
- **用途**: ナレッジ記事、タグ、カテゴリ

### 7. 財務サービスデータベース
- **正式パス**: `prisma/finance-service/data/finance.db`
- **環境変数**: `FINANCE_DATABASE_URL="file:./prisma/finance-service/data/finance.db"`
- **用途**: 収益管理、コスト管理、予算管理

### 8. パラソルサービスデータベース
- **正式パス**: `prisma/parasol-service/data/parasol.db`
- **環境変数**: `PARASOL_DATABASE_URL="file:./prisma/parasol-service/data/parasol.db"`
- **用途**: パラソル設計ドキュメント管理、ドメイン言語定義

## 重複チェックコマンド

定期的に以下のコマンドで重複がないことを確認してください：

```bash
# データベースファイル一覧を表示（8つのみであることを確認）
find prisma -name "*.db" -type f | grep -v node_modules | sort

# 期待される出力（8行のみ）:
# prisma/auth-service/data/auth.db
# prisma/finance-service/data/finance.db
# prisma/knowledge-service/data/knowledge.db
# prisma/notification-service/data/notification.db
# prisma/parasol-service/data/parasol.db
# prisma/project-service/data/project.db
# prisma/resource-service/data/resource.db
# prisma/timesheet-service/data/timesheet.db
```

## 重複が見つかった場合の削除手順

もし重複ディレクトリ（`prisma/*/prisma/`パターン）が見つかった場合は即座に削除：

```bash
# 重複ディレクトリの検出
find prisma -type d -name "prisma" | grep -v node_modules

# 重複ディレクトリの削除（見つかった場合のみ）
rm -rf prisma/*/prisma/
```

## DBファイル作成時の厳格なルール

- ✅ **許可**: `prisma/[service-name]/data/[service].db` の形式のみ
- ❌ **禁止**: `prisma/[service-name]/prisma/` のようなネストされた構造
- ❌ **禁止**: `prisma/dev.db` のようなルート直下のDB
- ❌ **禁止**: 上記8つ以外のデータベースファイル

## 重複防止のベストプラクティス

1. Prismaのmigrationやdb pushは**必ず正しいディレクトリから実行**
2. 環境変数は**絶対に相対パスで設定**（例: `file:./prisma/auth-service/data/auth.db`）
3. 新サービス追加時は**この8つのリストを更新**
4. **週次で重複チェックコマンドを実行**