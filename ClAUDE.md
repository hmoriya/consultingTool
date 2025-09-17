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
