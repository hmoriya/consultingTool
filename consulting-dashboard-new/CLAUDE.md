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

## フォルダ構造

```
consulting-dashboard-new/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   │   └── login/
│   ├── (dashboard)/       # ダッシュボードページ
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/               # API Routes
│   ├── components/        # 共通コンポーネント
│   │   ├── ui/           # UIコンポーネント
│   │   ├── layouts/      # レイアウトコンポーネント
│   │   └── auth/         # 認証コンポーネント
│   ├── lib/              # ユーティリティ
│   │   ├── auth/         # 認証ロジック
│   │   ├── db/          # Prismaクライアント
│   │   └── utils/       # 汎用ユーティリティ
│   └── types/           # 型定義
├── design/              # 設計ドキュメント
├── prisma/             # Prismaスキーマ
└── public/            # 静的ファイル
```

## 重要な実装指針

- Server Componentsを優先的に使用
- Client Componentsは必要最小限に
- セキュアな認証実装（bcrypt, httpOnly cookie）
- ロールベースアクセス制御（RBAC）
- レスポンシブデザイン対応

## 開発コマンド

```bash
npm run dev         # 開発サーバー起動
npm run build       # ビルド
npm run db:push     # DBスキーマ反映
npm run db:seed     # 初期データ投入
npm run db:studio   # Prisma Studio起動
```

## データベースファイル管理

### データベースファイル配置
開発用のサンプルデータベースはGitに含まれているため、新しいPCでclone後すぐに動作します。

```
dev.db                                    # 認証サービス用DB
prisma/project-service/data/project.db   # プロジェクト管理DB
prisma/resource-service/data/resource.db # リソース管理DB
prisma/timesheet-service/data/timesheet.db # タイムシート管理DB
prisma/notification-service/data/notification.db # 通知サービスDB
```

### 環境セットアップ手順
```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd consulting-dashboard-new

# 2. 依存関係インストール
npm install

# 3. 環境変数設定（マシン固有の絶対パス生成）
./setup-env.js

# 4. アプリケーション起動（データベースは既に含まれているのでシード不要）
npm run dev
```

### ⚠️ 重要：データベースの取り扱い

**データベースファイルは既にGitに含まれているため、新規作成は不要です！**

```bash
# ❌ 以下のコマンドは実行しないでください（データベースを上書きしてしまいます）
npx tsx prisma/seed.ts           # 実行不要
npx prisma db push                # 実行不要
npx prisma migrate reset          # 実行不要
```

### データベースの再初期化が必要な場合のみ（通常は不要）
データベースが破損した場合や、スキーマが大幅に変更された場合のみ：
```bash
# ⚠️ 警告：既存データが削除されます
npx tsx prisma/seed.ts
```

### 重要な注意事項
- **データベースファイルはGitに含まれています**（開発効率化のため）
- **本番環境では別途データベースを構築してください**
- **センシティブなデータは絶対に開発DBに入れないでください**
- **`.env`ファイルは各マシンで`setup-env.js`により生成されるため、Gitには含まれません**

## マイクロサービス設計方針

### 設計思想

- ビジネスケーパビリティ毎にPrismaスキーマを分離
- 将来的なマイクロサービス化を見据えた疎結合設計
- 結合度の高いドメインは同一サービス内で管理

### ドメイン分割戦略

#### 1. プロジェクト管理サービス

- **含まれるドメイン**: プロジェクト、タスク、マイルストーン、成果物
- **理由**: これらは密接に関連し、トランザクション整合性が必要
- **スキーマ**: `prisma/project-service/schema.prisma`

#### 2. リソース管理サービス

- **含まれるドメイン**: ユーザー、チーム、スキル、アサインメント
- **理由**: 人的リソースの管理は一元化が必要
- **スキーマ**: `prisma/resource-service/schema.prisma`

#### 3. 財務管理サービス

- **含まれるドメイン**: 収益、コスト、請求、予算
- **理由**: 財務データは独立性が高く、セキュリティ要件も異なる
- **スキーマ**: `prisma/finance-service/schema.prisma`

#### 4. 工数管理サービス

- **含まれるドメイン**: 工数入力、承認、稼働率
- **理由**: 工数データは頻繁に更新され、独立したスケーリングが必要
- **スキーマ**: `prisma/timesheet-service/schema.prisma`

#### 5. 通知・コミュニケーションサービス

- **含まれるドメイン**: 通知、コメント、承認フロー、会議
- **理由**: 非同期処理が中心で、他サービスとの結合度が低い
- **スキーマ**: `prisma/notification-service/schema.prisma`

#### 6. 知識管理サービス

- **含まれるドメイン**: ナレッジ記事、テンプレート、FAQ、エキスパート情報
- **理由**: 検索・推薦機能が中心で、独立したインフラが望ましい
- **スキーマ**: `prisma/knowledge-service/schema.prisma`

#### 7. リスク管理サービス

- **含まれるドメイン**: リスク、イシュー、対応計画、教訓
- **理由**: リスク管理は独立したワークフローを持つ
- **スキーマ**: `prisma/risk-service/schema.prisma`

### 実装アプローチ

#### フォルダ構造

```
src/
├── prisma/
│   ├── project-service/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── resource-service/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── finance-service/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── ... (他のサービス)
├── lib/
│   ├── clients/
│   │   ├── projectDb.ts
│   │   ├── resourceDb.ts
│   │   ├── financeDb.ts
│   │   └── ... (他のクライアント)
│   └── services/
│       ├── project/
│       ├── resource/
│       ├── finance/
│       └── ... (各サービスのビジネスロジック)
└── app/
    └── api/
        ├── projects/
        ├── resources/
        ├── finance/
        └── ... (APIエンドポイント)
```

#### Prismaクライアント管理

```typescript
// lib/clients/projectDb.ts
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-service'

export const projectDb = new ProjectPrismaClient({
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL
    }
  }
})

// 同様に他のサービス用クライアントも作成
```

#### データベース設定

##### 開発環境
各マイクロサービス毎に個別のSQLiteファイルを使用:

1. **認証サービス** (認証・ユーザー管理)
   - パス: `prisma/auth-service/data/auth.db`
   - 環境変数: `AUTH_DATABASE_URL="file:./prisma/auth-service/data/auth.db"`
   - ⚠️ **重要**: ルートディレクトリに`dev.db`を配置することは禁止

2. **プロジェクトサービス**
   - パス: `prisma/project-service/data/project.db`
   - 環境変数: `PROJECT_DATABASE_URL="file:./prisma/project-service/data/project.db"`

3. **リソースサービス** (チーム・スキル管理)
   - パス: `prisma/resource-service/data/resource.db`
   - 環境変数: `RESOURCE_DATABASE_URL="file:./prisma/resource-service/data/resource.db"`

4. **タイムシートサービス** (工数管理)
   - パス: `prisma/timesheet-service/data/timesheet.db`
   - 環境変数: `TIMESHEET_DATABASE_URL="file:./prisma/timesheet-service/data/timesheet.db"`

5. **通知サービス**
   - パス: `prisma/notification-service/data/notification.db`
   - 環境変数: `NOTIFICATION_DATABASE_URL="file:./prisma/notification-service/data/notification.db"`

##### 本番環境
将来的に各サービスを個別のデータベースインスタンスへ移行可能

### 現在のデータベースファイル構成

⚠️ **重要なルール**:
- **禁止**: ルートディレクトリに`dev.db`や他のデータベースファイルを配置すること
- **必須**: すべてのデータベースは各サービスの`prisma/[service-name]/data/`ディレクトリに配置
- **理由**: マイクロサービスの独立性を保ち、将来の分散化に備えるため

以下の5つのSQLiteデータベースファイルが正常に配置されています：

```
prisma/
├── auth-service/
│   └── data/
│       └── auth.db                 # 認証・ユーザー管理データ
├── project-service/
│   └── data/
│       └── project.db              # プロジェクト管理データ
├── resource-service/
│   └── data/
│       └── resource.db             # リソース・チーム管理データ
├── timesheet-service/
│   └── data/
│       └── timesheet.db            # 工数管理データ
└── notification-service/
    └── data/
        └── notification.db         # 通知・メッセージデータ
```

**重要**:
- 上記5つのファイルのみが正規のデータベースファイルです
- ルートディレクトリの`dev.db`は作成禁止
- 他の場所にある.dbファイルは重複ファイルのため削除してください

### 移行戦略

1. **フェーズ1**: 単一アプリケーション内で論理的分離（現在）
2. **フェーズ2**: APIゲートウェイパターンの導入
3. **フェーズ3**: 負荷の高いサービスから順次マイクロサービス化
4. **フェーズ4**: 完全なマイクロサービスアーキテクチャ

### 設計原則

- **DDD（ドメイン駆動設計）**: 各サービスは独自のドメインモデルを持つ
- **データの一貫性**: サービス間はイベント駆動で結果整合性を保つ
- **API設計**: RESTfulまたはGraphQLで統一的なインターフェース
- **認証・認可**: 中央集権的な認証サービスを共有

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

- ソースコード修正後は、Playwrite mcpでログインと動作確認をする
- ソースコード修正後は、設計書と相違がないか確認

## Prismaマルチデータベース構成のトラブルシューティング

### 問題: "The table `main.Project` does not exist"エラー

#### 原因
1. **Prismaの相対パス解決問題**
   - 環境変数の相対パス（`file:./prisma/...`）が実行時のカレントディレクトリから解決される
   - 結果として複数の場所にデータベースファイルが作成される

2. **SQLiteのスキーマ名問題**
   - SQLiteはデフォルトで`main`スキーマを使用
   - Prismaが生成するクエリに`main.Project`のようなスキーマ名が含まれる

3. **Prismaクライアントのキャッシュ問題**
   - Next.jsのホットリロードで古いDB接続が残る
   - 環境変数の変更が反映されない

#### 解決方法

1. **環境変数で絶対パスを使用**
   ```env
   # ❌ 避けるべき相対パス
   PROJECT_DATABASE_URL="file:./prisma/project-service/data/project.db"
   
   # ✅ 推奨: 絶対パス
   PROJECT_DATABASE_URL="file:/Users/.../prisma/project-service/data/project.db"
   ```

2. **Prismaクライアントの初期化を簡素化**
   ```typescript
   // ❌ カスタムdatasource設定は避ける
   export const projectDb = new ProjectPrismaClient({
     datasources: {
       db: { url: customPath }
     }
   })
   
   // ✅ 環境変数に依存
   export const projectDb = new ProjectPrismaClient({
     log: ['error', 'warn']
   })
   ```

3. **サーバーの完全再起動**
   ```bash
   # 環境変数やスキーマ変更後は必須
   pkill -f "next dev"
   npm run dev
   ```

4. **データベースファイルの確認**
   ```bash
   # 重複ファイルの検索
   find . -name "*.db" -type f | grep -v node_modules
   
   # 正しいDBファイルの確認
   sqlite3 prisma/project-service/data/project.db ".tables"
   ```

#### 予防策
- マイクロサービス化は段階的に実施
- 各サービスのDB初期化時に絶対パスを使用
- 定期的にデータベースファイルの場所を確認
- 開発環境では`db:generate`後にサーバー再起動を習慣化

## デザイン・UI実装の重要な注意事項

### Tailwind CSSのクラス使用について
- **必須**: `cn()`関数を使用する場合は、必ず`import { cn } from '@/lib/utils'`をファイルの先頭でインポートすること
- **禁止**: `cn()`関数をローカルで再定義しないこと
- **推奨**: 複数のクラスを条件付きで結合する場合は`cn()`関数を使用すること

### レイアウトの注意点
1. **グリッドレイアウト**
   - モバイルファースト: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`のように段階的に指定
   - `flex`と`grid`を同じ要素に混在させない
   
2. **レスポンシブデザイン**
   - 必ずモバイル・タブレット・デスクトップの3段階を考慮
   - ブレークポイント: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)

3. **背景色とテーマ**
   - `bg-background`、`text-foreground`などのセマンティックカラーを使用
   - `bg-gray-50`などの固定色は避ける（ダークモード対応のため）

### コンポーネント実装のルール
1. **AppLayoutの使用**
   - ダッシュボード系ページでは必ず`AppLayout`でラップする
   - ログインページなど認証前のページは`AppLayout`を使用しない

2. **パディングとマージン**
   - コンテナ: `p-4 md:p-6`のようにレスポンシブに
   - カード間のギャップ: `gap-4`または`gap-6`で統一

3. **フォームのレイアウト**
   - フォーム全体: `max-w-md`または`max-w-lg`で幅を制限
   - フィールド間隔: `space-y-4`または`space-y-6`

### エラーを防ぐためのチェックリスト
- [ ] `cn()`関数を使用する場合、インポートしているか
- [ ] レスポンシブクラスは小→大の順序で記述しているか
- [ ] セマンティックカラーを使用しているか
- [ ] 不要な`any`型を使用していないか

## 重要な実装指針

- Server Componentsを優先的に使用
- Client Componentsは必要最小限に
- セキュアな認証実装（bcrypt, httpOnly cookie）
- ロールベースアクセス制御（RBAC）
- レスポンシブデザイン対応

## 開発コマンド

```bash
npm run dev         # 開発サーバー起動
npm run build       # ビルド
npm run db:push     # DBスキーマ反映
npm run db:seed     # 初期データ投入
npm run db:studio   # Prisma Studio起動
```

## テストユーザー

- exec@example.com / password123 (エグゼクティブ)
- pm@example.com / password123 (PM)
- consultant@example.com / password123 (コンサルタント)
- client@example.com / password123 (クライアント)

## トラブルシューティング

### ログインできない場合
1. データベースが正しい場所にあるか確認: `prisma/core-service/data/core.db`
2. データベースにテストデータがあるか確認:
   ```bash
   sqlite3 prisma/core-service/data/core.db "SELECT email FROM User;"
   ```
3. データがない場合は、シードスクリプトを実行:
   ```bash
   npm run db:seed
   ```