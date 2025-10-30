# コンサルティングダッシュボード - セットアップガイド

## 🚀 クイックスタート（別のPCでのセットアップ）

別のPCで同じ環境を構築するための手順です。

### 前提条件
- Node.js 18以上
- npm または yarn
- Git

### セットアップ手順

1. **リポジトリのクローン**
```bash
git clone [リポジトリURL]
cd consulting-dashboard-new
```

2. **依存関係のインストール**
```bash
npm install
```

3. **環境変数の設定**
```bash
# .env.exampleから.envファイルを作成
cp .env.example .env

# 環境変数を自動生成（マシン固有のパスを設定）
node setup-env.js
```

4. **データベースの初期化とシードデータの投入**
```bash
# すべてのデータベースをリセットして、クリーンな状態からシードデータを投入
npx tsx prisma/reset-and-seed.ts
```

このコマンドは以下を自動的に実行します：
- 既存のデータベースファイルを削除（存在する場合）
- すべてのスキーマをプッシュ
- Prismaクライアントを生成
- すべてのサービスのシードデータを投入

5. **アプリケーションの起動**
```bash
npm run dev
```

6. **ブラウザでアクセス**
```
http://localhost:3000
```

## 📊 投入されるデータ

### テストユーザー
| メールアドレス | パスワード | ロール |
|---------------|----------|--------|
| exec@example.com | password123 | Executive (エグゼクティブ) |
| pm@example.com | password123 | PM (プロジェクトマネージャー) |
| consultant@example.com | password123 | Consultant (コンサルタント) |
| client@example.com | password123 | Client (クライアント) |

### サンプルデータ
- **組織**: テックイノベーション株式会社
- **プロジェクト**: 
  - DX推進プロジェクト (DX001)
  - ビジネスオペレーション最適化 (BPO001)
  - データ分析基盤構築 (DAP001)
- **パラソル設計**: 
  - 7つのサービス定義
  - 各サービスのビジネスケーパビリティ
  - ビジネスオペレーション（36個）
  - ユースケース、ページ定義、テスト定義
  - ドメイン言語定義（v1.2.0、アグリゲート定義付き）

## 🔧 個別のシード実行

特定のサービスのみシードを実行したい場合：

```bash
# 認証・組織管理
npx tsx prisma/seeds/core-seed.ts

# プロジェクト管理
npx tsx prisma/seeds/project-seed.ts

# リソース管理
npx tsx prisma/seeds/resource-seed.ts

# タイムシート管理
npx tsx prisma/seeds/timesheet-seed.ts

# 知識管理
npx tsx prisma/seeds/knowledge-seed.ts

# 通知
npx tsx prisma/seeds/notification-seed.ts

# パラソル設計（完全版）
npx tsx prisma/seeds/parasol/parasol-reset-and-seed-full.ts
```

## 🛠️ トラブルシューティング

### データベースエラーが発生する場合
```bash
# すべてをリセットして最初から
npx tsx prisma/reset-and-seed.ts
```

### 個別のデータベースをリセット
```bash
# 例：プロジェクトサービスのDBをリセット
rm -f prisma/project-service/data/project.db*
npx prisma db push --schema=prisma/project-service/schema.prisma
npx tsx prisma/seeds/project-seed.ts
```

### Prismaクライアントエラー
```bash
# すべてのクライアントを再生成
npm run db:generate
```

## 📝 重要な注意事項

1. **データの一貫性**: `reset-and-seed.ts`を実行すると、すべてのサービスで同じ初期データが投入されるため、別のPCでも同一の表示になります。

2. **パスワード**: すべてのテストユーザーのパスワードは `password123` です。本番環境では必ず変更してください。

3. **データベースファイル**: SQLiteファイルはGitに含まれていないため、各PCでシードを実行する必要があります。

4. **環境依存**: `setup-env.js`により、各PCの絶対パスが自動的に設定されます。

## 🔍 動作確認

1. ログイン画面でテストユーザーでログイン
2. ダッシュボードでプロジェクト一覧を確認
3. 設定 > パラソル設計 でドメイン言語やダイアグラムを確認
4. 各サービスのアグリゲート定義が正しく表示されることを確認

## 🤝 開発チーム向け

新しいメンバーがプロジェクトに参加する場合は、このREADMEの手順に従えば、既存メンバーと同じ開発環境を構築できます。