# L3-003: Collaborative Workspace

**作成日**: 2025-10-31
**所属BC**: BC-007: Team Communication & Collaboration
**V2移行元**: provide-collaborative-environment

---

## 📋 What: この能力の定義

### 能力の概要
協働作業のための共有環境を提供する能力。共有ワークスペース、ドキュメント共有、共同編集を通じて、チームコラボレーションを促進します。

### 実現できること
- 共有ワークスペースの作成と管理
- ドキュメント共同編集
- ファイル共有と権限管理
- リアルタイム同期
- バージョン履歴管理

### 必要な知識
- コラボレーション技術
- ドキュメント管理
- 同期技術
- アクセス制御
- バージョン管理

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: WorkspaceAggregate ([../../domain/README.md](../../domain/README.md#workspace-aggregate))
- **Entities**: Workspace, SharedDocument, CollaborationSession, Version
- **Value Objects**: WorkspaceType, AccessPermission, SyncStatus

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/workspaces - ワークスペース作成
  - POST /api/workspaces/{id}/documents - ドキュメント共有
  - PUT /api/documents/{id}/collaborate - 共同編集

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: workspaces, shared_documents, collaboration_sessions, document_versions

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 協働環境を提供する | ワークスペースの管理 | 1-2個 | provide-collaborative-environment |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 1個
- **推定UseCase数**: 1-2個
- **V2からの移行**: そのまま移行（L4候補として検討中）

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/collaboration-facilitation-service/capabilities/provide-collaborative-environment/](../../../../services/collaboration-facilitation-service/capabilities/provide-collaborative-environment/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-003 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
