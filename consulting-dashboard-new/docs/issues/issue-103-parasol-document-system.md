# Issue #103: パラソルドキュメント体系の完全実装

**作成日**: 2025-10-01
**優先度**: 高
**担当**: 開発チーム
**関連Issue**: #102

## 概要

パラソル設計手法に基づく完全なドキュメント体系を実装する。現在は`service.md`と`domain-language.md`のみだが、API仕様、DB設計、統合仕様を追加し、それぞれをAPI経由でインポート可能にする。

## 背景

### 現状の問題
1. **ドキュメントの混在**: `service.md`にサービス概要、ドメイン言語、API、DBが全て含まれている
2. **仕様の不明確**: API仕様書、DB設計書の標準テンプレートが存在しない
3. **DBスキーマの不足**: 新しいドキュメントタイプを格納するテーブルがない
4. **パーサーの不足**: ドメイン言語以外のパーサーが未実装

### あるべき姿
各サービスに以下のドキュメントが揃い、全てAPI経由でインポート可能：

```
services/{service-name}/
├── service.md                      # サービス概要（目次的役割）
├── domain-language.md              # パラソルドメイン言語仕様 ✅
├── api-specification.md            # API仕様（NEW）
├── database-design.md              # DB設計（NEW）
├── integration-specification.md    # 統合仕様（NEW）
└── capabilities/                   # ケーパビリティ別詳細 ✅
```

## 目標

1. ✅ **標準テンプレート策定**
   - API仕様書テンプレート
   - DB設計書テンプレート
   - 統合仕様書テンプレート

2. ✅ **データベーススキーマ拡張**
   - DomainLanguageテーブル
   - ApiSpecificationテーブル
   - DatabaseDesignテーブル
   - IntegrationSpecificationテーブル

3. ✅ **パーサー実装**
   - API仕様パーサー
   - DB設計パーサー
   - 統合仕様パーサー

4. ✅ **1サービスでの試作**
   - secure-access-serviceで3つのドキュメント作成
   - API経由でインポート
   - データベースに正しく格納されることを確認

5. ⏭️ **全サービスへの展開**（別Issue）

## タスク分解

### Phase 1: 設計フェーズ

#### 1.1 API仕様書テンプレート設計
- [ ] CLAUDE.mdのテンプレートをベースに詳細化
- [ ] RESTful API標準に準拠
- [ ] 認証、エラーハンドリング、レート制限を含む
- [ ] Mermaid図（シーケンス図）を活用

**成果物**: `docs/parasol/templates/api-specification-template.md`

#### 1.2 DB設計書テンプレート設計
- [ ] CLAUDE.mdのテンプレートをベースに詳細化
- [ ] 論理設計（ER図）+ 物理設計（テーブル定義）
- [ ] インデックス戦略、パフォーマンス要件を含む
- [ ] Mermaid ERD活用

**成果物**: `docs/parasol/templates/database-design-template.md`

#### 1.3 統合仕様書テンプレート設計
- [ ] サービス間連携の定義方法を策定
- [ ] ドメインイベント定義
- [ ] 依存関係の表現
- [ ] 同期・非同期通信パターン

**成果物**: `docs/parasol/templates/integration-specification-template.md`

### Phase 2: データベース拡張

#### 2.1 Prismaスキーマ拡張
**ファイル**: `prisma/parasol-service/schema.prisma`

```prisma
model DomainLanguage {
  id              String   @id @default(uuid())
  serviceId       String   @unique
  version         String
  content         String   // MD形式の全文
  entities        Json     // パース済みエンティティ
  valueObjects    Json     // パース済み値オブジェクト
  aggregates      Json     // パース済み集約
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  service         Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  @@map("domain_languages")
}

model ApiSpecification {
  id              String   @id @default(uuid())
  serviceId       String   @unique
  version         String
  baseUrl         String
  authMethod      String
  content         String   // MD形式の全文
  endpoints       Json     // パース済みエンドポイント
  errorCodes      Json     // パース済みエラーコード
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  service         Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  @@map("api_specifications")
}

model DatabaseDesign {
  id              String   @id @default(uuid())
  serviceId       String   @unique
  dbms            String   // PostgreSQL/MySQL/SQLite
  content         String   // MD形式の全文
  tables          Json     // パース済みテーブル定義
  erDiagram       String?  // Mermaid ERD
  indexes         Json     // パース済みインデックス定義
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  service         Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  @@map("database_designs")
}

model IntegrationSpecification {
  id              String   @id @default(uuid())
  serviceId       String   @unique
  content         String   // MD形式の全文
  dependencies    Json     // 依存サービス
  providedEvents  Json     // 提供するドメインイベント
  consumedEvents  Json     // 購読するドメインイベント
  syncApis        Json     // 同期API呼び出し
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  service         Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  @@map("integration_specifications")
}
```

- [ ] スキーマ定義
- [ ] マイグレーション実行
- [ ] Prismaクライアント生成

#### 2.2 Service modelへのリレーション追加
```prisma
model Service {
  // 既存フィールド...

  domainLanguage        DomainLanguage?
  apiSpecification      ApiSpecification?
  databaseDesign        DatabaseDesign?
  integrationSpec       IntegrationSpecification?
}
```

### Phase 3: パーサー実装

#### 3.1 API仕様パーサー
**ファイル**: `lib/parasol/parsers/api-specification-parser.ts`

```typescript
export interface ParsedApiSpecification {
  version: string
  baseUrl: string
  authMethod: string
  endpoints: {
    path: string
    method: string
    summary: string
    parameters: any[]
    requestBody?: any
    responses: any
  }[]
  errorCodes: {
    code: string
    status: number
    message: string
  }[]
}

export function parseApiSpecification(content: string): ParsedApiSpecification
```

- [ ] MDファイルからのパース処理
- [ ] エンドポイント抽出
- [ ] リクエスト/レスポンス仕様の構造化
- [ ] エラーコード抽出

#### 3.2 DB設計パーサー
**ファイル**: `lib/parasol/parsers/database-design-parser.ts`

```typescript
export interface ParsedDatabaseDesign {
  dbms: string
  tables: {
    name: string
    purpose: string
    columns: {
      name: string
      type: string
      nullable: boolean
      constraints: string[]
      description: string
    }[]
    indexes: any[]
    constraints: any[]
  }[]
  erDiagram?: string
}

export function parseDatabaseDesign(content: string): ParsedDatabaseDesign
```

- [ ] テーブル定義の抽出
- [ ] カラム仕様の構造化
- [ ] インデックス定義の抽出
- [ ] Mermaid ERDの抽出

#### 3.3 統合仕様パーサー
**ファイル**: `lib/parasol/parsers/integration-specification-parser.ts`

```typescript
export interface ParsedIntegrationSpecification {
  dependencies: string[]
  providedEvents: {
    name: string
    description: string
    payload: any
  }[]
  consumedEvents: {
    name: string
    source: string
    handler: string
  }[]
  syncApis: {
    targetService: string
    endpoint: string
    purpose: string
  }[]
}

export function parseIntegrationSpecification(content: string): ParsedIntegrationSpecification
```

- [ ] 依存サービスの抽出
- [ ] ドメインイベント定義の抽出
- [ ] API呼び出しの抽出

### Phase 4: APIエンドポイント拡張

#### 4.1 インポートAPIの拡張
**ファイル**: `app/api/parasol/import/route.ts`

既存の処理を拡張：
```typescript
export async function POST(request: Request) {
  const { content, documentType } = await request.json()

  switch (documentType) {
    case 'service':
      return await importService(content)
    case 'domain-language':
      return await importDomainLanguage(content)
    case 'api-specification':
      return await importApiSpecification(content)
    case 'database-design':
      return await importDatabaseDesign(content)
    case 'integration-specification':
      return await importIntegrationSpecification(content)
    default:
      // 自動判定ロジック
      return await autoDetectAndImport(content)
  }
}
```

- [ ] ドキュメントタイプ判定ロジック
- [ ] 各パーサーの呼び出し
- [ ] データベース保存処理
- [ ] エラーハンドリング

#### 4.2 取得APIの実装
```typescript
GET /api/parasol/services/{serviceId}/documents
GET /api/parasol/services/{serviceId}/domain-language
GET /api/parasol/services/{serviceId}/api-specification
GET /api/parasol/services/{serviceId}/database-design
GET /api/parasol/services/{serviceId}/integration-specification
```

- [ ] 各ドキュメントの取得API
- [ ] JSON形式での返却
- [ ] パース済みデータの取得

### Phase 5: secure-access-serviceでの試作

#### 5.1 API仕様書作成
**ファイル**: `docs/parasol/services/secure-access-service/api-specification.md`

- [ ] テンプレートに基づいて作成
- [ ] 認証API（ユーザー登録、ログイン、MFA）
- [ ] ロール・権限API
- [ ] 組織管理API
- [ ] 監査ログAPI

#### 5.2 DB設計書作成
**ファイル**: `docs/parasol/services/secure-access-service/database-design.md`

- [ ] ER図作成（Mermaid）
- [ ] 全テーブル定義（User, Role, Permission, Organization, AuditLog, Session）
- [ ] インデックス戦略
- [ ] パフォーマンス最適化方針

#### 5.3 統合仕様書作成
**ファイル**: `docs/parasol/services/secure-access-service/integration-specification.md`

- [ ] 依存サービス: なし（独立サービス）
- [ ] 提供イベント: UserCreated, UserAuthenticated, UserLockedなど
- [ ] 他サービスからのAPI呼び出し定義

#### 5.4 APIインポートとテスト
```bash
# ドメイン言語
curl -X POST http://localhost:3000/api/parasol/import \
  -H "Content-Type: application/json" \
  -d @domain-language.json

# API仕様
curl -X POST http://localhost:3000/api/parasol/import \
  -H "Content-Type: application/json" \
  -d @api-specification.json

# DB設計
curl -X POST http://localhost:3000/api/parasol/import \
  -H "Content-Type: application/json" \
  -d @database-design.json

# 統合仕様
curl -X POST http://localhost:3000/api/parasol/import \
  -H "Content-Type: application/json" \
  -d @integration-specification.json
```

- [ ] 各ドキュメントのインポート実行
- [ ] データベースへの正しい格納確認
- [ ] パース済みJSON構造の確認

### Phase 6: フロントエンド実装（オプション）

#### 6.1 ドキュメント閲覧UI
- [ ] サービス詳細ページでのタブ表示
  - 概要
  - ドメイン言語
  - API仕様
  - DB設計
  - 統合仕様
- [ ] MDコンテンツのレンダリング
- [ ] Mermaid図の表示

#### 6.2 ドキュメント編集UI
- [ ] MDエディタ統合
- [ ] リアルタイムプレビュー
- [ ] 保存・更新機能

## 成功条件

1. ✅ 3つの新しいドキュメントテンプレートが策定されている
2. ✅ Prismaスキーマに4つの新テーブルが追加されている
3. ✅ 3つのパーサーが実装され、MDからJSON構造を抽出できる
4. ✅ secure-access-serviceに3つの新ドキュメントが作成されている
5. ✅ API経由で全てのドキュメントがインポートできる
6. ✅ データベースに正しく格納され、取得APIで確認できる

## 非機能要件

- **拡張性**: 将来的なドキュメントタイプ追加が容易
- **整合性**: サービスとドキュメントの1対1リレーション
- **パフォーマンス**: インポート処理が10秒以内
- **エラーハンドリング**: パースエラー時の詳細なメッセージ

## リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| MDパースの複雑性 | 高 | シンプルな構造を維持、正規表現ベースのパーサー |
| データ量の増加 | 中 | JSON圧縮、必要に応じてページネーション |
| 既存データとの互換性 | 中 | マイグレーションスクリプト、フォールバック処理 |

## 参考資料

- [CLAUDE.md - パラソルドメイン言語](../../../CLAUDE.md#パラソルドメイン言語)
- [CLAUDE.md - パラソル設計ドキュメント種別](../../../CLAUDE.md#パラソル設計ドキュメント種別と仕様)
- [Issue #102](./issue-102-parasol-capability-structure.md)

## 次のステップ（Phase 7以降、別Issue）

- 全7サービスへの展開
- ドキュメント間のリンク機能
- ドキュメントのバージョン管理
- 差分表示機能
- 自動生成機能（ドメイン言語 → Prismaスキーマ、API仕様 → OpenAPI）
