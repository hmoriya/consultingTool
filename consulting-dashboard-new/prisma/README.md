# Prisma マイクロサービス構成

このプロジェクトは、マイクロサービスアーキテクチャを採用しており、各サービスが独自のデータベースとスキーマを持っています。

## サービス構成

### 1. コアサービス (core-service)
- **パス**: `prisma/core-service/`
- **データベース**: `prisma/core-service/data/core.db`
- **責務**: ユーザー管理、認証、組織管理、権限管理
- **主要モデル**: User, Role, Permission, Organization, Session, AuditLog

### 2. プロジェクト管理サービス (project-service)
- **パス**: `prisma/project-service/`
- **データベース**: `prisma/project-service/data/project.db`
- **責務**: プロジェクト管理、タスク管理、マイルストーン、成果物、リスク管理
- **主要モデル**: Project, Task, Milestone, Deliverable, Risk, Issue, ChangeRequest

### 3. リソース管理サービス (resource-service)
- **パス**: `prisma/resource-service/`
- **データベース**: `prisma/resource-service/data/resource.db`
- **責務**: チーム管理、スキル管理、リソース配分、キャパシティプランニング
- **主要モデル**: Team, Skill, UserSkill, ResourceAllocation, CapacityPlan, ResourceRequest

### 4. タイムシートサービス (timesheet-service)
- **パス**: `prisma/timesheet-service/`
- **データベース**: `prisma/timesheet-service/data/timesheet.db`
- **責務**: 工数管理、承認フロー、稼働率分析
- **主要モデル**: TimeEntry, ApprovalRequest, Utilization

### 5. 通知サービス (notification-service)
- **パス**: `prisma/notification-service/`
- **データベース**: `prisma/notification-service/data/notification.db`
- **責務**: メッセージング、通知、コミュニケーション
- **主要モデル**: Channel, Message, Notification, MessageReaction

## データベース管理

### 環境変数設定
```env
DATABASE_URL="file:./prisma/core-service/data/core.db"
PROJECT_DATABASE_URL="file:./prisma/project-service/data/project.db"
RESOURCE_DATABASE_URL="file:./prisma/resource-service/data/resource.db"
TIMESHEET_DATABASE_URL="file:./prisma/timesheet-service/data/timesheet.db"
NOTIFICATION_DATABASE_URL="file:./prisma/notification-service/data/notification.db"
```

### マイグレーション実行
```bash
# コアサービス
npx prisma migrate dev --schema=./prisma/schema.prisma

# プロジェクト管理サービス
npx prisma migrate dev --schema=./prisma/project-service/schema.prisma

# リソース管理サービス
npx prisma migrate dev --schema=./prisma/resource-service/schema.prisma

# タイムシートサービス
npx prisma migrate dev --schema=./prisma/timesheet-service/schema.prisma

# 通知サービス
npx prisma migrate dev --schema=./prisma/notification-service/schema.prisma
```

### Prisma Studio起動
```bash
# コアサービス
npx prisma studio --schema=./prisma/schema.prisma

# プロジェクト管理サービス
npx prisma studio --schema=./prisma/project-service/schema.prisma --port 5556

# リソース管理サービス
npx prisma studio --schema=./prisma/resource-service/schema.prisma --port 5557

# タイムシートサービス
npx prisma studio --schema=./prisma/timesheet-service/schema.prisma --port 5558

# 通知サービス
npx prisma studio --schema=./prisma/notification-service/schema.prisma --port 5559
```

## 設計原則

1. **データの独立性**: 各サービスは独自のデータベースを持ち、他のサービスのデータに直接アクセスしない
2. **スキーマの分離**: 各サービスは独自のPrismaスキーマファイルを持つ
3. **クライアントの分離**: 各サービス用に個別のPrismaクライアントを生成
4. **トランザクション境界**: サービス間のトランザクションは避け、結果整合性を保つ

## ディレクトリ構造
```
prisma/
├── core-service/
│   ├── data/
│   │   └── core.db          # コアサービスのデータベース
│   └── schema.prisma        # コアサービスのスキーマ（将来作成予定）
├── project-service/
│   ├── data/
│   │   └── project.db       # プロジェクト管理サービスのデータベース
│   └── schema.prisma        # プロジェクト管理サービスのスキーマ
├── resource-service/
│   ├── data/
│   │   └── resource.db      # リソース管理サービスのデータベース
│   └── schema.prisma        # リソース管理サービスのスキーマ
├── timesheet-service/
│   ├── data/
│   │   └── timesheet.db     # タイムシートサービスのデータベース
│   └── schema.prisma        # タイムシートサービスのスキーマ
├── notification-service/
│   ├── data/
│   │   └── notification.db  # 通知サービスのデータベース
│   └── schema.prisma        # 通知サービスのスキーマ
└── schema.prisma            # 現在のコアスキーマ（将来core-serviceに移動予定）
```

## 今後の拡張予定

- **財務管理サービス**: 収益、コスト、請求管理
- **リソース管理サービス**: スキル管理、アサインメント最適化
- **知識管理サービス**: ナレッジ記事、テンプレート、FAQ
- **リスク管理サービス**: リスク評価、対応計画、教訓管理