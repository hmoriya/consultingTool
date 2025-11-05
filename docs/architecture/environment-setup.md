# 環境変数の設定

## 初期セットアップ

プロジェクトを新規にクローンした場合や、`.env`ファイルが存在しない場合は、以下の手順で環境変数を設定してください：

```bash
# consulting-dashboard-newディレクトリに移動
cd consulting-dashboard-new

# .env.exampleから.envファイルを複製
cp .env.example .env

# 必要に応じて.envファイルを編集
# デフォルト設定のままでもプロトタイプ開発は可能です
```

## .envファイルの内容

`.env`ファイルには以下の環境変数が設定されています（プロトタイプ用のデフォルト値で動作します）：

- `DATABASE_URL`: メインデータベース
- `CORE_DATABASE_URL`: コアサービスDB
- `PROJECT_DATABASE_URL`: プロジェクトサービスDB
- `RESOURCE_DATABASE_URL`: リソースサービスDB
- `TIMESHEET_DATABASE_URL`: タイムシートサービスDB
- `NOTIFICATION_DATABASE_URL`: 通知サービスDB
- `JWT_SECRET`: JWT認証用シークレット
- `NEXTAUTH_SECRET`: NextAuth認証用シークレット
- `NEXTAUTH_URL`: NextAuthのベースURL

**注意**: 本番環境では必ずシークレットキーを安全な値に変更してください。

## データベースの初期化とシード

### 初期セットアップ手順

```bash
# 1. データベーススキーマを作成
npm run db:push

# 2. テストデータを投入
npm run db:seed

# または、リセットして最初から実行
npm run db:reset
```

### シードデータ構成

プロジェクトはマイクロサービス構成に対応したシード構造を採用しています：

```
prisma/
├── seed.ts                    # メインシードスクリプト
└── seeds/                     # サービス毎のシードファイル
    ├── core-seed.ts          # コアサービス（ユーザー、組織、ロール）
    ├── project-seed.ts       # プロジェクトサービス（プロジェクト、タスク）
    ├── resource-seed.ts      # リソースサービス（チーム、スキル）
    ├── timesheet-seed.ts     # タイムシートサービス（工数データ）
    └── notification-seed.ts  # 通知サービス（通知、メッセージ）
```

### 利用可能なコマンド

- `npm run db:seed` - すべてのサービスのシードを実行
- `npm run db:seed:core` - コアサービスのみシード実行
- `npm run db:reset` - DBを削除して再作成＆シード

### テストユーザー

シード実行後、以下のテストユーザーが利用可能です：

- **exec@example.com** / password123 (Executive)
- **pm@example.com** / password123 (PM)
- **consultant@example.com** / password123 (Consultant)
- **client@example.com** / password123 (Client)