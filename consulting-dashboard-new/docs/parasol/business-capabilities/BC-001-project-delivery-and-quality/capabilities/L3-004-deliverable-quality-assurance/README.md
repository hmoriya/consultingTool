# L3-004: Deliverable Quality Assurance

**作成日**: 2025-10-31
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: manage-and-ensure-deliverable-quality

---

## 📋 What: この能力の定義

### 能力の概要
成果物の品質を定義・確保し、クライアント要件を満たす成果物を提供する能力。成果物定義、レビュー、承認、バージョン管理を通じて、高品質な成果物を保証します。

### 実現できること
- 成果物品質基準の定義
- 成果物の作成とレビュープロセス管理
- 品質承認ワークフローの実施
- 成果物バージョン管理
- 成果物配信とトレーサビリティ確保

### 必要な知識
- 品質管理手法（ISO9001、TQM）
- レビュー技法（インスペクション、ウォークスルー）
- バージョン管理システム
- 成果物管理プロセス
- クライアント要件分析

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: DeliverableQualityAggregate ([../../domain/README.md](../../domain/README.md#deliverable-quality-aggregate))
- **Entities**: Deliverable, DeliverableTemplate, QualityCriteria, ReviewComment, ApprovalRecord
- **Value Objects**: QualityScore, ReviewStatus, Version, ApprovalStatus

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/deliverables - 成果物作成
  - POST /api/deliverables/{id}/review - レビュー実施
  - PUT /api/deliverables/{id}/approve - 承認処理
  - GET /api/deliverables/{id}/versions - バージョン管理

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: deliverables, deliverable_templates, quality_criteria, reviews, review_comments, approvals, versions

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **品質評価アルゴリズム**: 品質基準マトリックス評価（重み付けスコアリング）
- **バージョン管理**: Semantic Versioning（major.minor.patch）
- **レビューワークフロー**: 状態機械パターン（draft → in_review → approved/rejected）
- **デザインパターン**:
  - State Pattern（成果物ステータス遷移）
  - Template Method Pattern（レビュープロセス）
  - Decorator Pattern（品質チェック層の追加）

#### 推奨ライブラリ・フレームワーク
- **ドキュメントレビュー**: Collaborative editing library（ProseMirror, Draft.js）
- **バージョン管理**: Diff/Patch library（diff-match-patch）
- **品質チェック**: Custom validation engine（Zod, Yup）
- **PDF生成**: PDFKit - 成果物レポート生成

### パフォーマンス考慮事項

#### スケーラビリティ
- **成果物数上限**: 1プロジェクトあたり最大1,000成果物
- **バージョン履歴**: 1成果物あたり最大100バージョン
- **同時レビュー**: 1成果物に最大10レビュアー

#### キャッシュ戦略
- **成果物メタデータ**: Redis cache（TTL: 10分、更新時に無効化）
- **品質スコア**: メモリキャッシュ（レビュー完了時に再計算）
- **承認フロー状態**: 5分間隔でキャッシュ更新

#### 最適化ポイント
- **遅延読み込み**: バージョン履歴は必要時のみロード
- **差分計算**: バージョン間の差分は初回計算後キャッシュ
- **インデックス活用**: `deliverables(project_id, status)`, `versions(deliverable_id, version_number)`, `reviews(deliverable_id, reviewer_id)`

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-006: Knowledge Management & Learning** - 承認済み成果物の知識ベース登録
  - 使用API: `POST /api/bc-006/knowledge/deliverable` - 成果物ナレッジ化
  - 使用API: `GET /api/bc-006/templates/{type}` - 成果物テンプレート取得
- **BC-007: Team Communication & Collaboration** - レビュー通知とコメント機能
  - 使用API: `POST /api/bc-007/notifications` - レビュー依頼通知
  - 使用API: `POST /api/bc-007/comments` - レビューコメント
  - 使用API: `POST /api/bc-007/alerts` - 承認期限アラート
- **BC-003: Access Control & Security** - 成果物アクセス権限管理
  - 使用API: `POST /api/bc-003/authorize` - 閲覧・編集権限検証

#### 提供API（他BCから利用）
- **BC-001 L3-002**: 成果物完了状況の参照
- **BC-006**: 承認済み成果物情報の提供

### データ整合性要件

#### トランザクション境界
- **レビュー提出**: 成果物ステータス更新 + レビュアーアサイン + 通知送信（BC-007）
- **承認処理**: ステータス更新 + バージョン確定 + 知識ベース登録（BC-006）
- **整合性レベル**: 強整合性（レビュー状態）、結果整合性（通知・知識登録）

#### データ制約
- バージョン番号は単調増加（major.minor.patch形式）
- レビュー承認済みの成果物のみ確定可能
- 差戻し時は理由コメント必須

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003発行）
- **必要権限**:
  - 成果物作成: `deliverable:create` + プロジェクトメンバー権限
  - レビュー実施: `deliverable:review` + 指定レビュアー
  - 承認処理: `deliverable:approve` + 承認者権限

#### データ保護
- **機密度**: 成果物はConfidential（プロジェクトメンバー + クライアント）
- **バージョン管理**: 全バージョン履歴を暗号化保存
- **監査ログ**: レビュー、承認、差戻しは全て監査ログに記録
- **アクセス制御**: 成果物ごとにアクセスリスト管理

### スケーラビリティ制約

#### 最大同時処理
- **レビュー提出**: 同時50リクエスト/秒
- **バージョン作成**: 1成果物あたり最大10バージョン/日
- **承認処理**: 同時20承認/秒

#### データ量上限
- **成果物ファイルサイズ**: 1ファイル最大100MB
- **バージョン履歴保持**: 全バージョン無期限保持（アーカイブ可）
- **レビューコメント**: 1成果物あたり最大500コメント

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Deliverable Aggregate** ([../../domain/README.md#deliverable-aggregate](../../domain/README.md#deliverable-aggregate))
  - Deliverable（集約ルート）: 成果物品質保証
  - DeliverableVersion: バージョン履歴
  - QualityReview: 品質レビュー記録
  - ReviewComment: レビューコメント
  - ApprovalRecord: 承認記録

#### Value Objects
- **QualityStatus**: 品質状態（not_reviewed, in_review, approved, rejected）
- **Version**: バージョン番号（SemVer形式）
- **QualityScore**: 品質スコア（0-100点）
- **ReviewStatus**: レビュー状態（pending, in_progress, completed）
- **ApprovalStatus**: 承認状態（pending, approved, rejected）

#### Domain Events
- **DeliverableCreated**: 成果物作成イベント
- **DeliverableSubmittedForReview**: レビュー提出イベント → BC-007レビュアー通知
- **DeliverableApproved**: 承認イベント → BC-007作成者通知, BC-006知識ベース登録
- **DeliverableRejected**: 差戻しイベント → BC-007作成者通知・改善依頼
- **DeliverableVersionUpdated**: 新バージョン作成イベント

### 呼び出すAPI例

#### 成果物作成
```http
POST /api/v1/bc-001/deliverables
Content-Type: application/json
Authorization: Bearer {token}

{
  "projectId": "project-uuid",
  "taskId": "task-uuid",
  "name": "要件定義書",
  "description": "製品要件定義の詳細ドキュメント",
  "type": "document",
  "version": "1.0.0",
  "qualityCriteria": [
    { "name": "完全性", "weight": 30, "required": true },
    { "name": "明確性", "weight": 25, "required": true },
    { "name": "一貫性", "weight": 25, "required": true },
    { "name": "検証可能性", "weight": 20, "required": false }
  ],
  "filePath": "/documents/requirements-v1.0.pdf"
}
```

#### レビュー提出
```http
POST /api/v1/bc-001/deliverables/{deliverableId}/review
Content-Type: application/json

{
  "reviewerId": "user-uuid-reviewer",
  "reviewDeadline": "2025-11-20",
  "reviewType": "formal",
  "checklistItems": [
    "要件の網羅性確認",
    "用語の統一性確認",
    "図表の正確性確認"
  ],
  "notifyReviewer": true
}
```

#### 承認処理
```http
PUT /api/v1/bc-001/deliverables/{deliverableId}/approve
Content-Type: application/json

{
  "reviewerId": "user-uuid-reviewer",
  "decision": "approved",
  "qualityScores": [
    { "criteriaName": "完全性", "score": 90 },
    { "criteriaName": "明確性", "score": 85 },
    { "criteriaName": "一貫性", "score": 95 },
    { "criteriaName": "検証可能性", "score": 88 }
  ],
  "overallScore": 89.5,
  "comments": "全体的に高品質。一部用語の統一性に改善余地あり。",
  "registerToKnowledgeBase": true
}
```

#### バージョン管理
```http
GET /api/v1/bc-001/deliverables/{deliverableId}/versions
```

#### BC連携: レビュー通知（BC-007）
```http
POST /api/v1/bc-007/notifications
Content-Type: application/json

{
  "type": "deliverable_review_request",
  "recipientId": "user-uuid-reviewer",
  "priority": "high",
  "content": {
    "deliverableId": "deliverable-uuid",
    "deliverableName": "要件定義書",
    "reviewDeadline": "2025-11-20",
    "projectName": "新製品開発"
  }
}
```

#### BC連携: 知識ベース登録（BC-006）
```http
POST /api/v1/bc-006/knowledge/deliverable
Content-Type: application/json

{
  "deliverableId": "deliverable-uuid",
  "title": "要件定義書（承認済み）",
  "category": "project-deliverable",
  "tags": ["requirements", "approved", "新製品開発"],
  "qualityScore": 89.5,
  "accessLevel": "internal"
}
```

### データアクセスパターン

#### 読み取り
- **deliverables テーブル**:
  - インデックス: `idx_deliverables_project_id`（プロジェクト配下成果物）
  - インデックス: `idx_deliverables_status`（ステータス別フィルタ）
  - インデックス: `idx_deliverables_created_by`（作成者別成果物）
- **deliverable_versions テーブル**:
  - インデックス: `idx_versions_deliverable_id`（バージョン履歴取得）
  - クエリ: 最新バージョン取得（`ORDER BY version_number DESC LIMIT 1`）
- **quality_reviews テーブル**:
  - インデックス: `idx_reviews_deliverable_reviewer`（レビュー担当一覧）
  - インデックス: `idx_reviews_status`（レビュー状態別）

#### 書き込み
- **レビュー提出トランザクション**:
  ```sql
  BEGIN;
  UPDATE deliverables SET quality_status = 'in_review', reviewed_by_id = ?, review_deadline = ?
  WHERE id = ?;
  INSERT INTO quality_reviews (deliverable_id, reviewer_id, review_type, deadline, status)
  VALUES (?, ?, ?, ?, 'pending');
  -- イベント発行: DeliverableSubmittedForReview
  COMMIT;
  ```
- **承認処理トランザクション**:
  ```sql
  BEGIN;
  UPDATE deliverables SET quality_status = 'approved', overall_quality_score = ?
  WHERE id = ?;
  UPDATE quality_reviews SET status = 'completed', decision = 'approved', completed_at = NOW()
  WHERE id = ?;
  INSERT INTO approval_records (deliverable_id, approver_id, approved_at, comments)
  VALUES (?, ?, NOW(), ?);
  -- イベント発行: DeliverableApproved
  COMMIT;
  ```

#### キャッシュアクセス
- **成果物ステータス**:
  ```
  Key: `deliverable:status:{deliverableId}`
  Value: { status: 'in_review', reviewer: 'user-uuid', deadline: '2025-11-20' }
  TTL: 600秒
  Invalidation: ステータス変更時
  ```
- **品質スコア集計**:
  ```
  Key: `project:deliverable:quality:{projectId}`
  Value: { totalDeliverables: 15, approved: 12, avgQualityScore: 87.5 }
  TTL: 900秒
  Invalidation: 承認時
  ```

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 成果物を定義・作成する | 成果物の定義と初期作成 | 2-3個 | define-and-create-deliverables |
| **OP-002**: 成果物をレビュー・承認する | 品質レビューと承認フロー | 3-4個 | review-and-approve-deliverables |
| **OP-003**: 成果物をバージョン管理する | バージョン管理と履歴追跡 | 2個 | version-control-deliverables |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 7-9個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/project-success-service/capabilities/manage-and-ensure-deliverable-quality/](../../../../services/project-success-service/capabilities/manage-and-ensure-deliverable-quality/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-004 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
