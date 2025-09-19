# コンサルティングプロジェクトダッシュボード

## アプリケーション概要

コンサルティングファームが複数のクライアントプロジェクトを効率的に管理・監視するための統合ダッシュボードシステム。プロジェクトの進捗状況、リソース配分、財務状況を一元的に可視化し、意思決定を支援する。

## アーキテクチャスタック

- **フロントエンド**: Next.js 15.1.0 (App Router), React 19.0, TypeScript 5.7, Tailwind CSS 3.4.1
- **UI コンポーネント**: shadcn/ui (MCP経由)
- **バックエンド**: Next.js Server Actions
- **データベース**: SQLite (ファイルベースDB)
- **ORM**: Prisma 6.0
- **バリデーション**: Zod (スキーマベースバリデーション)
- **フォーム管理**: React Hook Form (Zod連携)

## データベース構成

### 重要: DBファイルの配置ルール

**正式なDBファイルの配置場所（これ以外の場所にDBファイルを作成しないでください）:**

1. **メインデータベース**
   - **正式パス**: `consulting-dashboard-new/prisma/dev.db`
   - **環境変数**: `DATABASE_URL="file:./dev.db"`
   - **用途**: ユーザー認証、ロール管理、組織情報、基本的なメトリクス

2. **コアサービスデータベース**
   - **正式パス**: `consulting-dashboard-new/prisma/core-service/data/core.db`
   - **環境変数**: `CORE_DATABASE_URL="file:./prisma/core-service/data/core.db"`
   - **用途**: ユーザー認証、組織管理

3. **プロジェクトサービスデータベース**
   - **正式パス**: `consulting-dashboard-new/prisma/project-service/data/project.db`
   - **環境変数**: `PROJECT_DATABASE_URL="file:./prisma/project-service/data/project.db"`
   - **用途**: プロジェクト、タスク、マイルストーン、プロジェクトメンバー、リスク管理
   - **シードデータ**:
     - デジタルトランスフォーメーション推進 (DX001)
     - ビジネスプロセス最適化 (BPO001)
     - データ分析基盤構築 (DAP001)

4. **リソースサービスデータベース**
   - **正式パス**: `consulting-dashboard-new/prisma/resource-service/data/resource.db`
   - **環境変数**: `RESOURCE_DATABASE_URL="file:./prisma/resource-service/data/resource.db"`
   - **用途**: チーム管理、スキル管理、リソース配分

5. **タイムシートサービスデータベース**
   - **正式パス**: `consulting-dashboard-new/prisma/timesheet-service/data/timesheet.db`
   - **環境変数**: `TIMESHEET_DATABASE_URL="file:./prisma/timesheet-service/data/timesheet.db"`
   - **用途**: 工数管理、承認フロー

6. **通知サービスデータベース**
   - **正式パス**: `consulting-dashboard-new/prisma/notification-service/data/notification.db`
   - **環境変数**: `NOTIFICATION_DATABASE_URL="file:./prisma/notification-service/data/notification.db"`
   - **用途**: 通知、メッセージ、アラート

### 重複DBファイルの削除手順

現在、以下の重複ファイルが存在しており、削除が必要です:

```bash
# 削除すべき重複ファイル:
rm -f ./prisma/core-service/prisma/core-service/data/core.db
rm -f ./prisma/prisma/core-service/data/core.db
rm -f ./prisma/project-service/data/prisma/project-service/data/project.db
rm -f ./prisma/project-service/prisma/project-service/data/project.db
rm -f ./prisma/resource-service/prisma/resource-service/data/resource.db
rm -f ./prisma/timesheet-service/prisma/timesheet-service/data/timesheet.db

# 重複ディレクトリの削除:
rm -rf ./prisma/core-service/prisma/
rm -rf ./prisma/prisma/
rm -rf ./prisma/project-service/prisma/
rm -rf ./prisma/resource-service/prisma/
rm -rf ./prisma/timesheet-service/prisma/
```

### DBファイル作成時の注意事項

- Prismaのmigrationやdb pushを実行する際は、必ず正しいディレクトリから実行してください
- 新しいサービスを追加する場合は、`prisma/[service-name]/data/[service].db`の形式でDBファイルを配置してください
- 環境変数は相対パスで設定し、プロジェクトルートからの相対位置を維持してください

## 環境変数の設定

### 初期セットアップ

プロジェクトを新規にクローンした場合や、`.env`ファイルが存在しない場合は、以下の手順で環境変数を設定してください：

```bash
# consulting-dashboard-newディレクトリに移動
cd consulting-dashboard-new

# .env.exampleから.envファイルを複製
cp .env.example .env

# 必要に応じて.envファイルを編集
# デフォルト設定のままでもプロトタイプ開発は可能です
```

### .envファイルの内容

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

## 主要ユースケース

### 0. ０リリース

- ログイン、トップページの表示のみ

### 1. エグゼクティブ向け

- 全社のプロジェクトポートフォリオを俯瞰
- 収益性分析とリソース最適化

### 2. プロジェクトマネージャー向け

- プロジェクト進捗管理とチーム管理
- リスク管理と成果物管理

### 3. コンサルタント向け

- 個人タスク管理と工数入力
- ナレッジ共有

### 4. クライアント向け

- プロジェクト進捗確認
- 成果物レビューとコミュニケーション

## ナビゲーションシステム仕様

- **ヘッダー**: 固定配置、高さ64px、アカウントセクション含む
- **サイドバー**: 折りたたみ可能、幅256px（展開時）/64px（折りたたみ時）
- **レスポンシブ対応**: モバイル時はドロワー形式

## 基本的なUI構成

### ヘッダー

- ロゴ/ブランド（左側）
- ユーザープロファイルアイコン（右側）
  - プロファイル編集、設定、ログアウト
- ログインボタン（未ログイン時）

### サイドメニュー

- ハンバーガーアイコンで開閉可能
- メニュー項目（ロール別に動的変更）:
  - ダッシュボード
  - プロジェクト一覧
  - レポート
  - 設定
  - ヘルプ

## 認証とロール管理

- **認証方式**: メールアドレス/パスワード、MFA対応
- **ロール**: Executive, PM, Consultant, Client, Admin
- **アクセス制御**: ロールベースアクセス制御（RBAC）

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

## 設計書 designディレクトリに配置複数あるものは、ディレクトリを作成 更新日をそれぞれ記載

- プロジェクト定義
- ビジネスケーパビリティ定義
- ユースケース（ビジネスケーパビリティをブレークダウンしてユースケースを生成）
- ロバストネス図
- API定義
- UI定義
- ドメイン言語モデル（MD形式）
- DB定義
- 受け入れテスト
- 単体テスト
- イテレーション計画

## Git開発フローとissue管理

### 標準的な開発フロー

開発を行う際は、以下のGitフローに従ってください：

#### 1. Issue作成
```
Issue #31: ヘルプドキュメントの記述レベル向上
```

##### Issueテンプレートの活用

プロジェクトには以下のissueテンプレートが用意されています：

- **bug_report.md**: バグ報告用
  - 現象、再現手順、期待動作、環境情報を記載
- **feature_request.md**: 機能追加要望用
  - 背景、提案内容、代替案を記載
- **enhancement.md**: 既存機能の改善提案用
  - 改善対象、理由、影響範囲を記載
- **documentation.md**: ドキュメント関連
  - 対象ドキュメント、問題点、改善案を記載
- **question.md**: 質問用
  - 質問内容と背景情報を記載

GitHubでissueを作成する際は、適切なテンプレートを選択することで、必要な情報を漏れなく記載できます。

#### 2. ブランチ作成
issue番号を含めたブランチ名を使用：
```bash
# 推奨フォーマット
git checkout -b feature/31-improve-help-docs
git checkout -b bugfix/42-login-error
git checkout -b hotfix/55-security-patch
git checkout -b docs/67-api-documentation

# 避けるべき例
git checkout -b feature/new-feature  # issue番号なし
git checkout -b 31                   # 説明なし
```

#### 3. コミット
各コミットにissue番号を含める：
```bash
# 基本フォーマット
git commit -m "feat: 機能の説明 (#31)"
git commit -m "fix: バグの修正内容 (#42)"
git commit -m "docs: ドキュメント更新 (#67)"

# 詳細な例
git commit -m "feat: ヘルプシステムに詳細ステップビューを追加 (#31)"
git commit -m "test: ヘルプページのE2Eテスト追加 (#31)"
git commit -m "refactor: 詳細情報の型定義を整理 (#31)"
```

#### 4. プルリクエスト
PRタイトルと本文にissue番号を含める：
```markdown
# PRタイトル
feat: ヘルプシステムの詳細情報機能を追加 (#31)

# PR本文
## 概要
Issue #31 の対応です。

## 変更内容
- 詳細ステップビューコンポーネントを追加
- 全12ユースケースに詳細情報を追加
- 代替手段の表示機能を実装

## 関連Issue
Closes #31  # これによりマージ時に自動的にissueがクローズされます

## スクリーンショット
[必要に応じて画像を添付]

## レビューポイント
- UIの使いやすさ
- 情報の網羅性
```

### issue番号を入れる場所

| 場所 | 例 | 必須度 | 目的 |
|------|-----|---------|------|
| **ブランチ名** | `feature/31-help-docs` | ◎推奨 | 作業内容の明確化 |
| **コミットメッセージ** | `feat: 機能追加 (#31)` | ◎推奨 | 変更履歴の追跡 |
| **PRタイトル** | `新機能追加 (#31)` | ○任意 | 一覧での識別 |
| **PR本文** | `Closes #31` | ◎必須 | 自動クローズ、関連付け |

### 自動クローズのキーワード

PR本文で以下のキーワードを使うと、マージ時にissueが自動的にクローズされます：
- `Close #31` / `Closes #31`
- `Fix #31` / `Fixes #31` 
- `Resolve #31` / `Resolves #31`

複数issueの場合：
```markdown
Closes #31, #32
```

### なぜissue番号が重要か

1. **トレーサビリティ**: 変更の理由と背景が明確になる
2. **プロジェクト管理**: issueとコードの関連を自動追跡
3. **コラボレーション**: チームメンバーが文脈を理解しやすい
4. **自動化**: issue自動クローズ、プロジェクトボード連携
5. **レビュー効率化**: レビュアーが背景を把握しやすい

## 動作確認

- 起動しているサーバをKillして新たにサーバーを起動
- ソースコード修正後は、Playwrite mcpでログインと動作確認をする
- ソースコード修正後は、設計書と相違がないか確認

## Playwright MCP使用ルール

### 絶対的な禁止事項

1. **いかなる形式のコード実行も禁止**

   - Python、JavaScript、Bash等でのブラウザ操作
   - MCPツールを調査するためのコード実行
   - subprocessやコマンド実行によるアプローチ

2. **利用可能なのはMCPツールの直接呼び出しのみ**

   - playwright:browser_navigate
   - playwright:browser_screenshot
   - 他のPlaywright MCPツール

3. **エラー時は即座に報告**
   - 回避策を探さない
   - 代替手段を実行しない
   - エラーメッセージをそのまま伝える
