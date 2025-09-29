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

## パラソルドメイン言語（Parasol Domain Language）

### 概要
パラソルドメイン言語は、実装言語に依存しない中間言語として、ドメインモデルを記述するための独自言語です。この言語で定義されたドメインモデルから、データベーススキーマやAPI仕様を自動生成することを目的としています。

### 設計思想
- **実装中立性**: 特定のプログラミング言語に依存しない
- **ドメイン駆動設計（DDD）準拠**: エンティティ、値オブジェクト、集約などのDDD概念を表現
- **ユビキタス言語**: ビジネスとテクノロジーの橋渡しとなる共通語彙
- **生成可能**: ドメイン定義から実装コード（DB、API）を自動生成

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_N: 最大N文字の文字列（例: STRING_20, STRING_50, STRING_100）
TEXT: 長文テキスト（制限なし）
EMAIL: メールアドレス形式（RFC5322準拠）
PASSWORD_HASH: ハッシュ化されたパスワード
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
PERCENTAGE: パーセンテージ（0-100）
MONEY: 金額（通貨単位付き）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
```

### ドメインモデルの構成要素

#### 1. エンティティ（Entities）
- ユニークな識別子を持つ
- ライフサイクルを持つ
- ビジネスロジックを含む
- 表形式で属性を定義

#### 2. 値オブジェクト（Value Objects）
- 不変性を持つ
- 識別子を持たない
- 値の等価性で比較
- ビジネスルールによる制約

#### 3. 集約（Aggregates）
- 集約ルートを持つ
- トランザクション境界を定義
- 一貫性を保証

#### 4. ドメインサービス
- 複数のエンティティに跨る処理
- ビジネスロジックの実装

#### 5. ドメインイベント
- システム内で発生する重要な出来事
- 非同期処理の起点
- 監査ログの記録

#### 6. ビジネスルール
- ドメインの制約と不変条件
- バリデーションルール
- 業務フローのルール

#### 7. リポジトリインターフェース
- データ永続化の抽象化
- CRUDおよび検索メソッドの定義

### 自動生成フロー
```
[ドメインモデル（パラソル言語）]
        ↓
[パーサー/ジェネレーター]
        ↓
    ├─[データベーススキーマ（Prisma）]
    ├─[API仕様（OpenAPI/REST）]
    └─[型定義（TypeScript）]
```

### ドメインファイルの管理
- **配置場所**: `docs/domains/`ディレクトリ
- **ファイル形式**: Markdown（.md）
- **命名規則**: `{domain-name}-domain.md`
- **編集方法**: 設定ページのドメインエディタから編集可能

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

## データベース構成

### サービス別データベース構成
コンサルティングダッシュボードは、マイクロサービス指向の設計により、サービスごとに独立したデータベースを保持します。

#### データベースファイル一覧（8サービス）
```
prisma/auth-service/data/auth.db           # 認証サービス
prisma/project-service/data/project.db     # プロジェクトサービス
prisma/resource-service/data/resource.db   # リソースサービス
prisma/timesheet-service/data/timesheet.db # タイムシートサービス
prisma/notification-service/data/notification.db # 通知サービス
prisma/knowledge-service/data/knowledge.db # ナレッジサービス
prisma/finance-service/data/finance.db     # 財務サービス
prisma/parasol-service/data/parasol.db     # パラソルサービス
```

#### 1. 認証サービスデータベース
- **パス**: `prisma/auth-service/data/auth.db`
- **環境変数**: `DATABASE_URL="file:./prisma/auth-service/data/auth.db"`
- **管理エンティティ**: User, Organization, Role, AuditLog
- **用途**: ユーザー認証、組織管理、ロール管理、監査ログ

#### 2. プロジェクトサービスデータベース
- **パス**: `prisma/project-service/data/project.db`
- **環境変数**: `PROJECT_DATABASE_URL="file:./prisma/project-service/data/project.db"`
- **管理エンティティ**: Project, Task, Milestone, ProjectMember, Risk, Deliverable
- **用途**: プロジェクト管理全般、タスク管理、マイルストーン管理

#### 3. リソースサービスデータベース
- **パス**: `prisma/resource-service/data/resource.db`
- **環境変数**: `RESOURCE_DATABASE_URL="file:./prisma/resource-service/data/resource.db"`
- **管理エンティティ**: Team, TeamMember, Skill, UserSkill
- **用途**: チーム管理、スキル管理、リソース配分

#### 4. タイムシートサービスデータベース
- **パス**: `prisma/timesheet-service/data/timesheet.db`
- **環境変数**: `TIMESHEET_DATABASE_URL="file:./prisma/timesheet-service/data/timesheet.db"`
- **管理エンティティ**: Timesheet, TimesheetEntry, TimesheetApproval
- **用途**: 工数管理、タイムシート承認フロー

#### 5. 通知サービスデータベース
- **パス**: `prisma/notification-service/data/notification.db`
- **環境変数**: `NOTIFICATION_DATABASE_URL="file:./prisma/notification-service/data/notification.db"`
- **管理エンティティ**: Notification, Message
- **用途**: 通知配信、メッセージ管理

#### 6. ナレッジサービスデータベース
- **パス**: `prisma/knowledge-service/data/knowledge.db`
- **環境変数**: `KNOWLEDGE_DATABASE_URL="file:./prisma/knowledge-service/data/knowledge.db"`
- **管理エンティティ**: KnowledgeArticle, Tag, Category
- **用途**: ナレッジ記事管理、ベストプラクティス共有

#### 7. 財務サービスデータベース
- **パス**: `prisma/finance-service/data/finance.db`
- **環境変数**: `FINANCE_DATABASE_URL="file:./prisma/finance-service/data/finance.db"`
- **管理エンティティ**: Revenue, Cost, Budget, Invoice（将来実装）
- **用途**: 収益管理、コスト管理、予算管理

#### 8. パラソルサービスデータベース
- **パス**: `prisma/parasol-service/data/parasol.db`
- **環境変数**: `PARASOL_DATABASE_URL="file:./prisma/parasol-service/data/parasol.db"`
- **管理エンティティ**: Service, BusinessCapability, BusinessOperation, UseCase, PageDefinition, TestDefinition
- **用途**: パラソル設計ドキュメント管理、ドメイン言語定義

### データベース初期化手順
```bash
# すべてのサービスのデータベースを初期化
npm run db:push

# シードデータを投入
npm run db:seed
```

### 重要な注意事項
- **メインデータベース（dev.db）は存在しません**
- 全ての機能は8つのサービス別データベースに分割されています
- 各データベースは`prisma/[service-name]/data/[service].db`の形式で配置
- 不要な重複DBファイルが存在する場合は削除が必要

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

### 重複DBファイルのクリーンアップ

開発中に生成された重複DBファイルを削除する必要がある場合：

```bash
# 重複ファイルの削除
rm -f ./consulting-dashboard-new/prisma/parasol-service/data/parasol.db
rm -f ./parasol.db
rm -f ./prisma/auth-service/prisma/auth-service/data/auth.db
rm -f ./prisma/auth-service/prisma/dev.db
rm -f ./prisma/notification-service/prisma/notification-service/data/notification.db
rm -f ./prisma/parasol-service/prisma/parasol-service/data/parasol.db
rm -f ./prisma/prisma/auth-service/data/auth.db
rm -f ./prisma/resource-service/prisma/resource-service/data/resource.db
rm -f ./prisma/timesheet-service/prisma/timesheet-service/data/timesheet.db

# 重複ディレクトリの削除
rm -rf ./prisma/auth-service/prisma/
rm -rf ./prisma/notification-service/prisma/
rm -rf ./prisma/parasol-service/prisma/
rm -rf ./prisma/prisma/
rm -rf ./prisma/resource-service/prisma/
rm -rf ./prisma/timesheet-service/prisma/
```

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
1. データベースが正しい場所にあるか確認: `prisma/auth-service/data/auth.db`
2. データベースにテストデータがあるか確認:
   ```bash
   sqlite3 prisma/auth-service/data/auth.db "SELECT email FROM User;"
   ```
3. データがない場合は、シードスクリプトを実行:
   ```bash
   npm run db:seed
   ```

### ロール名に関する重要な注意事項

⚠️ **ロール名の大文字小文字が原因でエラーが頻繁に発生します**

#### 問題の背景
- **Userテーブルのロール**: `Executive`, `PM`, `Consultant`, `Client`, `Admin` (大文字)
- **ProjectMemberのロール**: `pm`, `member`, `reviewer`, `observer` (小文字)
- この不一致により、ロールチェック時にデータが表示されない問題が発生

#### 解決策
`constants/roles.ts` ファイルで一元管理：

```typescript
// ユーザーロール（認証サービス）
export const USER_ROLES = {
  EXECUTIVE: 'Executive',
  PM: 'PM',
  CONSULTANT: 'Consultant',
  CLIENT: 'Client',
  ADMIN: 'Admin'
} as const

// プロジェクトメンバーロール（プロジェクトサービス）
export const PROJECT_MEMBER_ROLES = {
  PM: 'pm',
  MEMBER: 'member',
  REVIEWER: 'reviewer',
  OBSERVER: 'observer'
} as const
```

#### 使用例
```typescript
// ❌ 避けるべき直接文字列の使用
if (member.role === 'PM') { ... }  // 大文字小文字の違いでマッチしない

// ✅ 推奨: 定数を使用
import { PROJECT_MEMBER_ROLES } from '@/constants/roles'
if (member.role === PROJECT_MEMBER_ROLES.PM) { ... }  // 常に正しい値
```

#### tsconfig.json の設定
constants フォルダへのパスマッピングが必要：
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./app/*"],
      "@/components/*": ["./components/*", "./app/components/*"],
      "@/constants/*": ["./constants/*"]
    }
  }
}

## パラソル設計の階層構造

### 完全な階層構造
```
サービス
└── ビジネスケーパビリティ（複数）
    └── ビジネスオペレーション群（ケーパビリティに関連）
        └── ユースケース群（オペレーションを実現）
            ├── ページ定義
            └── テスト定義
```

### 階層別の責務

#### 1. サービスレベル
- **目的**: ビジネス価値の提供
- **定義内容**:
  - サービスの目的と提供価値
  - ケーパビリティ一覧
  - サービスレベルのドメインモデル概要
  - API方針
  - DB方針

#### 2. ケーパビリティレベル
- **目的**: 組織能力の定義
- **定義内容**:
  - ケーパビリティの定義
  - ビジネス価値
  - 関連するビジネスオペレーション群
  - ケーパビリティ別ドメインモデル

#### 3. ビジネスオペレーションレベル
- **目的**: 業務プロセスの定義
- **定義内容**:
  - 目的
  - ロール（関係者）
  - ビジネスプロセス（ステップ）
  - 状態遷移
  - KPI
  - 詳細ドメインモデル

#### 4. ユースケースレベル
- **目的**: システム機能の定義
- **定義内容**:
  - アクター
  - 事前条件/事後条件
  - 基本フロー/代替フロー/例外フロー
  - エンティティ詳細
  - API仕様確定
  - DBスキーマ確定

### ビジネスオペレーションのMD形式定義例

```markdown
# ビジネスオペレーション: プロジェクト知識を保全する

## 目的
プロジェクトで得られた知識・ノウハウを組織の資産として保全し、将来のプロジェクトで活用可能にする

## 関係者とロール
- **コンサルタント**: 知識の記録・整理
- **PM**: 知識の承認・カテゴライズ
- **ナレッジマネージャー**: 知識の体系化・配信

## ビジネスプロセス
1. **知識の記録** (ユースケース)
   - ページ定義: 知識記録フォーム
   - 状態: draft → recorded
   
2. **知識の整理・タグ付け** (ユースケース)
   - ページ定義: 知識編集画面
   - 状態: recorded → organized

## 状態遷移
\`\`\`mermaid
stateDiagram-v2
    [*] --> draft: 作成開始
    draft --> recorded: 記録完了
    recorded --> organized: 整理完了
    organized --> approved: 承認
    approved --> published: 公開
\`\`\`
```

### 段階的詳細化
ビジネスオペレーションからユースケースへの分解に伴い、以下が段階的に詳細化されます：

1. **パラソルドメイン言語**: 概要から詳細エンティティへ
2. **API設計**: 方針から具体的なエンドポイントへ
3. **DB設計**: 概要から詳細スキーマへ

### ビジネスケーパビリティ命名規則
- 形式: 「XXXする能力」（例: 「プロジェクトを成功に導く能力」）
- 禁止: 「XXX管理」（CRUDを連想させるため）

### サービス命名規則

#### 重要な原則
- **価値を表現する名前**：サービスが提供する価値やアウトカムを明確に表現
- **顧客視点**：利用者が得られるメリットを表す名前
- **能動的表現**：受動的な「管理」ではなく、能動的な価値創造を表現

#### 禁止事項
- 「〜管理サービス」（CRUD操作を連想させるため）
- 「〜システム」（技術中心の名称）
- 「〜処理サービス」（プロセス中心の名称）

#### 推奨される命名パターン
| パターン | 例 | 説明 |
|---------|-----|------|
| 〜支援サービス | プロジェクト成功支援サービス | 何かを成功に導く支援 |
| 〜最適化サービス | タレント最適化サービス | リソースの最適活用 |
| 〜可視化サービス | 生産性可視化サービス | 見える化による改善 |
| 〜促進サービス | コラボレーション促進サービス | 活動の活性化 |
| 〜共創サービス | ナレッジ共創サービス | 共同での価値創造 |
| セキュア〜サービス | セキュアアクセスサービス | 安全性の保証 |

#### 具体例
| ❌ 避けるべき名前 | ✅ 推奨される名前 | 価値の表現 |
|-----------------|----------------|----------|
| プロジェクト管理サービス | プロジェクト成功支援サービス | プロジェクトを成功に導く |
| リソース管理サービス | タレント最適化サービス | 人材の能力を最大化する |
| タイムシート管理サービス | 生産性可視化サービス | 生産性を見える化し改善する |
| 知識管理サービス | ナレッジ共創サービス | 知識を共有し新たな価値を創る |
| 財務管理サービス | 収益最適化サービス | 収益を最大化する |
| 認証・組織管理サービス | セキュアアクセスサービス | 安全なアクセスを保証する |
| 通知・コミュニケーションサービス | コラボレーション促進サービス | チーム連携を促進する |

### ビジネスオペレーション命名規則
- アクション指向（動詞 + 目的語）
- 価値を表現する名前
- 顧客視点での命名
- 禁止: CRUD用語（作成、更新、削除、一覧）

### ユースケース命名規則
- **形式**: 「〜を（が）〜する」または「〜する」
- **視点**: システムユーザー（アクター）視点
- **粒度**: 1つの明確な目的を達成する単位
- **例**:
  - ✅ 良い例:
    - 「知識を記録する」
    - 「レビューを依頼する」
    - 「承認を得る」
    - 「成果物を共有する」
  - ❌ 避けるべき例:
    - 「データ登録」（CRUD的）
    - 「情報更新」（曖昧）
    - 「画面表示」（実装寄り）
- **禁止事項**:
  - CRUD用語の使用
  - 実装技術の露出
  - システム内部処理の表現

### ページ定義とテスト定義の設計原則

#### 重要: 実装非依存の自然言語設計
パラソル開発のすべての設計（ページ定義、テスト定義を含む）は、以下の原則に従います：
- **MD（Markdown）形式のみで記述**
- **実装技術に依存しない自然言語で表現**
- **ビジネス視点での記述を徹底**
- **コードやJSON形式は使用禁止**

#### ページ定義の自然言語表現
```markdown
# ページ定義：[ページの目的を表す名前]

## 画面の目的
[この画面で達成したいビジネス目的を記述]

## 利用者
- [主要な利用者とその役割]
- [副次的な利用者]

## 画面構成
### [エリア名1]
- [表示項目や機能の説明]

### [エリア名2]  
- [表示項目や機能の説明]

## 画面の振る舞い
- [ユーザー操作に対する画面の反応]
- [ビジネスルールに基づく制御]

## 画面遷移
- [どこから来るか]
- [どこへ行くか]
```

#### テスト定義の自然言語表現
```markdown
# テスト定義：[テストの目的を表す名前]

## テストの目的
[何を確認したいのかを明確に記述]

## テストケース：[ケース名]

### 事前条件
- [テスト実行前に満たすべき条件]

### テスト手順
1. [具体的な操作手順]
2. [次の操作]

### 期待結果
- [期待される画面表示や動作]
- [確認すべきデータの状態]
```

#### データベースへの格納方法
- PageDefinitionとTestDefinitionエンティティの`content`フィールドに、上記MD形式のテキスト全体を文字列として格納
- 実装詳細（HTMLタグ、CSSクラス、JSONスキーマ等）は一切含めない
- ビジネスドメインの言葉のみを使用

## パラソル設計ドキュメント種別と仕様

パラソル設計手法では、以下の種別のドキュメントを作成し、各々の仕様とテンプレートに従います。

### 1. ビジネスケーパビリティ定義
- **仕様**: `design/parasol/specifications/business-capability-spec.md`
- **テンプレート**: `design/parasol/templates/business-capability-template.md`

### 2. ビジネスオペレーション設計
- **仕様**: `design/parasol/specifications/business-operation-spec.md`
- **テンプレート**: `design/parasol/templates/business-operation-template.md`

### 3. ユースケース定義
- **仕様**: `design/parasol/specifications/use-case-spec.md`
- **テンプレート**: `design/parasol/templates/use-case-template.md`

### 4. ドメイン言語モデル
- **仕様**: `design/parasol/specifications/domain-language-spec.md`
- **テンプレート**: `design/parasol/templates/domain-language-template.md`

### 5. ページ定義
- **仕様**: `design/parasol/specifications/page-definition-spec.md`
- **テンプレート**: `design/parasol/templates/page-definition-template.md`

### 6. テスト定義
- **仕様**: `design/parasol/specifications/test-definition-spec.md`
- **テンプレート**: `design/parasol/templates/test-definition-template.md`

### 7. API仕様
- **仕様**: `design/parasol/specifications/api-specification-spec.md`
- **テンプレート**: `design/parasol/templates/api-specification-template.md`

### 8. ロバストネス図
- **仕様**: `design/parasol/specifications/robustness-diagram-spec.md`
- **テンプレート**: `design/parasol/templates/robustness-diagram-template.md`

### 9. データベース設計
- **仕様**: `design/parasol/specifications/database-design-spec.md`
- **テンプレート**: `design/parasol/templates/database-design-template.md`

### 10. イテレーション計画
- **仕様**: `design/parasol/specifications/iteration-plan-spec.md`
- **テンプレート**: `design/parasol/templates/iteration-plan-template.md`

## シードデータ管理

### シードデータの構成
コンサルティングダッシュボードでは、開発・テスト環境のために包括的なシードデータセットを提供しています。

#### シードファイルの構造
```
prisma/
├── seed.ts                    # メインシードスクリプト（全サービス一括実行）
├── reset-and-seed.ts         # DBリセット後にシード実行
└── seeds/                    # サービス別シードファイル
    ├── core-seed.ts         # 認証サービス（ユーザー、組織、ロール）
    ├── project-seed.ts      # プロジェクトサービス（8プロジェクト）
    ├── resource-seed.ts     # リソースサービス（チーム、スキル）
    ├── timesheet-seed.ts    # タイムシートサービス（工数データ）
    ├── notification-seed.ts # 通知サービス（通知、メッセージ）
    ├── finance-seed.ts      # 財務サービス（収益、コスト）
    ├── knowledge-seed.ts    # ナレッジサービス（記事、タグ）
    ├── parasol-seed-full.ts # パラソルサービス（全7サービスの設計データ）
    └── parasol/             # パラソル個別サービスシード
        ├── secure-access-seed.ts
        ├── project-success-seed.ts
        ├── talent-optimization-seed.ts
        ├── productivity-visualization-seed.ts
        ├── knowledge-co-creation-seed.ts
        ├── revenue-optimization-seed.ts
        └── collaboration-promotion-seed.ts
```

#### 主要なテストデータ

##### 1. テストユーザー
```
- exec@example.com / password123 (Executive - 経営層)
- pm@example.com / password123 (PM - プロジェクトマネージャー)
- consultant@example.com / password123 (Consultant - コンサルタント)
- client@example.com / password123 (Client - クライアント)
```

##### 2. プロジェクトデータ
- **合計8プロジェクト**（アクティブ4件、計画中2件、完了2件）
- 各プロジェクトには以下が含まれます：
  - プロジェクトメンバー（PM、コンサルタント）
  - タスク（20-30件/プロジェクト）
  - マイルストーン（3-4件/プロジェクト）

##### 3. パラソル設計データ
- **7サービス** × **3-4ケーパビリティ** × **2-3オペレーション** = **合計72オペレーション**
- 各オペレーションには以下が含まれます：
  - パラソルドメイン言語定義（エンティティ、値オブジェクト、集約）
  - ユースケース（3-4件/オペレーション）
  - ページ定義とテスト定義

### シードデータの実行方法

#### 初回セットアップ
```bash
# DBスキーマを作成
npm run db:push

# シードデータを投入
npm run db:seed
```

#### データリセット（推奨）
```bash
# DBをクリアして新しいデータを投入
npm run db:reset
```

#### 個別サービスのシード
```bash
# 認証サービスのみ
npm run db:seed:auth

# プロジェクトサービスのみ
tsx prisma/seeds/project-seed.ts
```

### シードデータの特徴

1. **リアルなビジネスシナリオ**
   - 実際のコンサルティングプロジェクトを想定
   - デジタルトランスフォーメーション、データ分析基盤構築など

2. **ロール別の検証**
   - 各ロール（Executive、PM、Consultant、Client）でのフィルタリング動作確認
   - プロジェクトメンバー権限による表示制御

3. **パラソル設計の実例**
   - DDD（ドメイン駆動設計）に基づいたモデル定義
   - 値オブジェクトとエンティティの関連表示
   - Mermaidダイアグラムでの可視化

### トラブルシューティング

#### 古いデータとの競合
**症状**: PMでログインしてもプロジェクトが表示されない
**原因**: 古いProjectMemberデータが残存
**解決策**: `npm run db:reset`でクリーンな状態から開始

#### 今後の改善（Issue #100）
シード実行時に自動的に既存データをクリアする機能を実装予定

## 現在のサービス・ケーパビリティ構成

### サービス階層構造
```
コンサルティングダッシュボード
├── セキュアアクセスサービス（旧：認証・組織管理サービス）
│   └── アクセスを安全に管理する能力
│       ├── ユーザーを登録・管理する
│       ├── 組織構造を管理する
│       ├── アクセス権限を制御する
│       ├── 認証を実行する
│       └── 監査ログを記録する
│
├── プロジェクト成功支援サービス（旧：プロジェクト管理サービス）
│   └── プロジェクトを成功に導く能力
│       ├── プロジェクトを正確に計画する
│       ├── リスクを先回りして管理する
│       ├── リソースを最適に配分する
│       ├── 進捗を可視化し統制する
│       ├── 品質を保証する
│       ├── 課題を迅速に解決する
│       └── 成果物を確実に配信する
│
├── タレント最適化サービス（旧：リソース管理サービス）
│   └── チームの生産性を最大化する能力
│       ├── リソースを最適配分する
│       ├── スキルを育成する
│       ├── チームを編成する
│       ├── パフォーマンスを評価する
│       └── キャリアを開発する
│
├── 生産性可視化サービス（旧：タイムシート管理サービス）
│   └── 工数を正確に把握する能力
│       ├── 工数を記録する
│       ├── タイムシートを承認する
│       └── 稼働率を分析する
│
├── ナレッジ共創サービス（旧：知識管理サービス）
│   └── 知識を組織資産化する能力
│       ├── 知識を蓄積する
│       ├── 知識を検索・活用する
│       ├── 知識を共有する
│       └── ベストプラクティスを抽出する
│
├── 収益最適化サービス（旧：財務管理サービス）
│   └── 収益性を最適化する能力
│       ├── 収益を追跡する
│       ├── コストを管理する
│       └── 収益性を最適化する
│
└── コラボレーション促進サービス（旧：通知・コミュニケーションサービス）
    └── 情報を即座に届ける能力
        ├── 通知を配信する
        └── コミュニケーションを促進する
```

### 今後の改善点
1. **ケーパビリティの細分化**（Issue #93）
   - 各サービスに1つのケーパビリティではなく、3〜5個に分割
   - 責務を明確化し、保守性を向上

2. **サービス名の価値表現**（Issue #94）
   - 「管理」を削除し、価値を表現する名前に変更
   - 上記の新サービス名への移行を実施中