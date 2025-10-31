# API仕様: ナレッジ共創サービス

## API概要
**目的**: 組織の知識を蓄積・共有・活用し、新たな価値を創造するRESTful API
**バージョン**: v1.0.0
**ベースURL**: `https://api.example.com/v1/knowledge-co-creation`

## 認証
**認証方式**: JWT (JSON Web Token)
**ヘッダー**: `Authorization: Bearer {token}`

## 共通仕様

### リクエストヘッダー
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
```

### レスポンス形式
```json
{
  "success": boolean,
  "data": object,
  "message": string,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## エンドポイント定義

### Knowledge API

#### GET /knowledge
**概要**: ナレッジ一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/knowledge`
- **Parameters**:
  - `page` (query, optional): ページ番号 (default: 1)
  - `limit` (query, optional): 件数 (default: 20, max: 100)
  - `category` (query, optional): カテゴリフィルタ (Technical/Business/Process/Tool/Domain)
  - `type` (query, optional): タイプフィルタ (Article/FAQ/HowTo/BestPractice/LessonLearned)
  - `status` (query, optional): ステータスフィルタ (Draft/Review/Published/Archived)
  - `tags` (query, optional): タグフィルタ（カンマ区切り）
  - `sort` (query, optional): ソート順 (viewCount_desc, publishedAt_desc, likeCount_desc)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "DXプロジェクトでのアジャイル適用事例",
        "summary": "製造業DXプロジェクトでスクラムを適用した成功事例",
        "category": "Technical",
        "type": "BestPractice",
        "authorId": "uuid",
        "projectId": "uuid",
        "tags": ["DX", "Agile", "Scrum"],
        "status": "Published",
        "visibility": "Public",
        "version": "1.0",
        "viewCount": 150,
        "likeCount": 25,
        "publishedAt": "2024-01-15T00:00:00Z",
        "createdAt": "2024-01-10T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

#### POST /knowledge
**概要**: 新規ナレッジを作成

**リクエスト**:
- **Method**: POST
- **URL**: `/knowledge`
- **Body**:
```json
{
  "title": "DXプロジェクトでのアジャイル適用事例",
  "summary": "製造業DXプロジェクトでスクラムを適用した成功事例",
  "content": "# 背景\n\n製造業のお客様...",
  "category": "Technical",
  "type": "BestPractice",
  "projectId": "uuid",
  "tags": ["DX", "Agile", "Scrum"],
  "keywords": ["アジャイル", "スクラム", "製造業"],
  "visibility": "Public"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "DXプロジェクトでのアジャイル適用事例",
    "summary": "製造業DXプロジェクトでスクラムを適用した成功事例",
    "content": "# 背景\n\n製造業のお客様...",
    "category": "Technical",
    "type": "BestPractice",
    "authorId": "uuid",
    "projectId": "uuid",
    "tags": ["DX", "Agile", "Scrum"],
    "status": "Draft",
    "visibility": "Public",
    "version": "1.0",
    "viewCount": 0,
    "likeCount": 0,
    "createdAt": "2024-01-10T00:00:00Z",
    "updatedAt": "2024-01-10T00:00:00Z"
  }
}
```

#### GET /knowledge/{id}
**概要**: 特定ナレッジの詳細を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/knowledge/{id}`
- **Path Parameters**:
  - `id` (required): ナレッジID (UUID形式)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "DXプロジェクトでのアジャイル適用事例",
    "summary": "製造業DXプロジェクトでスクラムを適用した成功事例",
    "content": "# 背景\n\n製造業のお客様...",
    "category": "Technical",
    "type": "BestPractice",
    "authorId": "uuid",
    "projectId": "uuid",
    "tags": ["DX", "Agile", "Scrum"],
    "keywords": ["アジャイル", "スクラム", "製造業"],
    "status": "Published",
    "visibility": "Public",
    "version": "1.0",
    "previousVersionId": null,
    "viewCount": 150,
    "likeCount": 25,
    "publishedAt": "2024-01-15T00:00:00Z",
    "expiresAt": null,
    "createdAt": "2024-01-10T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z",
    "documents": [
      {
        "id": "uuid",
        "name": "スクラム実践ガイド.pdf",
        "fileType": "PDF",
        "size": 2048576,
        "url": "https://storage.example.com/docs/guide.pdf"
      }
    ]
  }
}
```

#### PUT /knowledge/{id}
**概要**: ナレッジを更新

**リクエスト**:
- **Method**: PUT
- **URL**: `/knowledge/{id}`
- **Body**:
```json
{
  "title": "DXプロジェクトでのアジャイル適用事例（更新版）",
  "summary": "製造業DXプロジェクトでスクラムを適用した成功事例 - 追加知見を含む",
  "content": "# 背景\n\n製造業のお客様...\n\n## 追加の知見\n...",
  "tags": ["DX", "Agile", "Scrum", "製造業"]
}
```

#### DELETE /knowledge/{id}
**概要**: ナレッジを削除（論理削除）

#### POST /knowledge/{id}/publish
**概要**: ナレッジを公開

**リクエスト**:
- **Method**: POST
- **URL**: `/knowledge/{id}/publish`
- **Body**:
```json
{
  "publishedAt": "2024-01-15T00:00:00Z",
  "expiresAt": "2025-01-15T00:00:00Z"
}
```

#### POST /knowledge/{id}/like
**概要**: ナレッジに「いいね」を付ける

#### POST /knowledge/{id}/view
**概要**: ナレッジの閲覧数を記録

#### GET /knowledge/search
**概要**: ナレッジを検索

**リクエスト**:
- **Method**: GET
- **URL**: `/knowledge/search`
- **Parameters**:
  - `q` (query, required): 検索キーワード
  - `category` (query, optional): カテゴリフィルタ
  - `tags` (query, optional): タグフィルタ
  - `dateFrom` (query, optional): 公開日の開始
  - `dateTo` (query, optional): 公開日の終了
  - `sort` (query, optional): relevance_desc, publishedAt_desc

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "DXプロジェクトでのアジャイル適用事例",
        "summary": "製造業DXプロジェクトでスクラムを適用した成功事例",
        "category": "Technical",
        "type": "BestPractice",
        "tags": ["DX", "Agile", "Scrum"],
        "relevanceScore": 0.95,
        "highlights": ["...アジャイル...手法を適用..."]
      }
    ],
    "total": 25,
    "searchTime": 45
  }
}
```

### Document API

#### GET /knowledge/{knowledgeId}/documents
**概要**: ナレッジに関連するドキュメント一覧を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "knowledgeId": "uuid",
        "name": "スクラム実践ガイド.pdf",
        "description": "スクラム導入時の実践的なガイド",
        "fileType": "PDF",
        "mimeType": "application/pdf",
        "size": 2048576,
        "url": "https://storage.example.com/docs/guide.pdf",
        "checksum": "sha256hash",
        "uploadedBy": "uuid",
        "accessLevel": "Public",
        "downloadCount": 50,
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ]
  }
}
```

#### POST /knowledge/{knowledgeId}/documents
**概要**: ドキュメントをアップロード

**リクエスト**:
- **Method**: POST
- **URL**: `/knowledge/{knowledgeId}/documents`
- **Content-Type**: multipart/form-data
- **Body**:
  - `file` (file, required): アップロードファイル
  - `name` (string, optional): ファイル名（指定しない場合は元のファイル名）
  - `description` (string, optional): 説明
  - `accessLevel` (string, optional): アクセスレベル (Public/Internal/Confidential)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "knowledgeId": "uuid",
    "name": "スクラム実践ガイド.pdf",
    "fileType": "PDF",
    "size": 2048576,
    "url": "https://storage.example.com/docs/guide.pdf",
    "uploadedBy": "uuid",
    "createdAt": "2024-01-10T00:00:00Z"
  }
}
```

#### DELETE /documents/{id}
**概要**: ドキュメントを削除

### BestPractice API

#### GET /best-practices
**概要**: ベストプラクティス一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/best-practices`
- **Parameters**:
  - `page` (query, optional): ページ番号
  - `limit` (query, optional): 件数
  - `category` (query, optional): カテゴリフィルタ
  - `industryId` (query, optional): 業界IDフィルタ
  - `minEffectivenessScore` (query, optional): 最小有効性スコア

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "スクラムの導入パターン",
        "description": "段階的なスクラム導入のベストプラクティス",
        "context": "組織規模: 50-200名、従来ウォーターフォール",
        "problem": "変化への対応が遅く、リリースサイクルが長い",
        "solution": "スクラムを段階的に導入し、2週間スプリントを確立",
        "benefits": ["リリース頻度2倍", "顧客満足度30%向上"],
        "category": "Process",
        "effectivenessScore": 8.5,
        "adoptionRate": 75.0,
        "validatedBy": "uuid",
        "validatedAt": "2024-01-01"
      }
    ]
  }
}
```

#### POST /best-practices
**概要**: 新規ベストプラクティスを作成

**リクエスト**:
```json
{
  "title": "スクラムの導入パターン",
  "description": "段階的なスクラム導入のベストプラクティス",
  "context": "組織規模: 50-200名、従来ウォーターフォール",
  "problem": "変化への対応が遅く、リリースサイクルが長い",
  "solution": "スクラムを段階的に導入し、2週間スプリントを確立",
  "benefits": ["リリース頻度2倍", "顧客満足度30%向上"],
  "implementation": "# ステップ1\n\nチーム編成...",
  "prerequisites": ["スクラムマスター1名以上"],
  "limitations": ["既存プロセスとの調整が必要"],
  "alternativeApproaches": ["カンバンの採用"],
  "category": "Process",
  "industryId": "uuid",
  "projectIds": ["uuid1", "uuid2"]
}
```

#### PUT /best-practices/{id}/validate
**概要**: ベストプラクティスを検証

**リクエスト**:
```json
{
  "validatedBy": "uuid",
  "effectivenessScore": 8.5,
  "validationNotes": "複数プロジェクトで有効性を確認"
}
```

### Expert API

#### GET /experts
**概要**: エキスパート一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/experts`
- **Parameters**:
  - `expertiseArea` (query, optional): 専門分野フィルタ
  - `availabilityStatus` (query, optional): 相談可否フィルタ
  - `minRating` (query, optional): 最小評価

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "expertiseAreas": ["アジャイル", "スクラム", "DevOps"],
        "yearsOfExperience": 10,
        "certifications": ["CSM", "CSPO", "AWS SAA"],
        "publications": ["アジャイル実践ガイド"],
        "projects": ["uuid1", "uuid2"],
        "bio": "大規模システム開発でのアジャイル導入支援を専門としています",
        "availabilityStatus": "Available",
        "rating": 4.8,
        "reviewCount": 25,
        "languages": ["日本語", "英語"]
      }
    ]
  }
}
```

#### POST /experts
**概要**: エキスパートを登録

**リクエスト**:
```json
{
  "userId": "uuid",
  "expertiseAreas": ["アジャイル", "スクラム"],
  "yearsOfExperience": 10,
  "certifications": ["CSM", "CSPO"],
  "bio": "アジャイル導入支援を専門としています"
}
```

#### GET /experts/{id}
**概要**: エキスパート詳細を取得

#### PUT /experts/{id}
**概要**: エキスパート情報を更新

#### PUT /experts/{id}/availability
**概要**: エキスパートの相談可否を更新

**リクエスト**:
```json
{
  "availabilityStatus": "Busy",
  "reason": "大型プロジェクト対応中"
}
```

### Question API

#### GET /questions
**概要**: 質問一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/questions`
- **Parameters**:
  - `status` (query, optional): ステータスフィルタ (Open/Answered/Closed)
  - `category` (query, optional): カテゴリフィルタ
  - `priority` (query, optional): 優先度フィルタ

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "スクラムでの見積もり方法について",
        "content": "ストーリーポイントの付け方で悩んでいます...",
        "askedBy": "uuid",
        "category": "Process",
        "tags": ["スクラム", "見積もり"],
        "status": "Answered",
        "priority": "Medium",
        "viewCount": 45,
        "answerCount": 3,
        "acceptedAnswerId": "uuid",
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ]
  }
}
```

#### POST /questions
**概要**: 新規質問を投稿

**リクエスト**:
```json
{
  "title": "スクラムでの見積もり方法について",
  "content": "ストーリーポイントの付け方で悩んでいます...",
  "category": "Process",
  "tags": ["スクラム", "見積もり"],
  "priority": "Medium"
}
```

#### GET /questions/{id}
**概要**: 質問詳細と回答を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "スクラムでの見積もり方法について",
    "content": "ストーリーポイントの付け方で悩んでいます...",
    "askedBy": "uuid",
    "category": "Process",
    "status": "Answered",
    "viewCount": 45,
    "answers": [
      {
        "id": "uuid",
        "content": "プランニングポーカーを使うのが効果的です...",
        "answeredBy": "uuid",
        "isAccepted": true,
        "voteCount": 15,
        "references": ["https://example.com/planning-poker"],
        "createdAt": "2024-01-11T00:00:00Z"
      }
    ],
    "relatedKnowledge": [
      {
        "id": "uuid",
        "title": "スクラム見積もりガイド"
      }
    ]
  }
}
```

#### POST /questions/{questionId}/answers
**概要**: 質問に回答

**リクエスト**:
```json
{
  "content": "プランニングポーカーを使うのが効果的です...",
  "references": ["https://example.com/planning-poker"]
}
```

#### PUT /questions/{questionId}/answers/{answerId}/accept
**概要**: 回答を採用

#### POST /questions/{questionId}/answers/{answerId}/vote
**概要**: 回答に投票

### LearningPath API

#### GET /learning-paths
**概要**: 学習パス一覧を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "アジャイルコーチ育成パス",
        "description": "アジャイルコーチとして必要なスキルを体系的に学習",
        "targetRole": "Agile Coach",
        "targetLevel": "Advanced",
        "estimatedDuration": 90,
        "objectives": ["スクラムマスタリング", "組織変革支援"],
        "modules": [
          {
            "order": 1,
            "title": "スクラム基礎",
            "duration": 14
          }
        ],
        "completionCount": 25,
        "averageRating": 4.5
      }
    ]
  }
}
```

#### POST /learning-paths
**概要**: 学習パスを作成

#### GET /learning-paths/{id}
**概要**: 学習パス詳細を取得

#### POST /learning-paths/{id}/enroll
**概要**: 学習パスに登録

### KnowledgeShare API

#### GET /knowledge-shares
**概要**: 知識共有セッション一覧を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "アジャイル実践事例共有会",
        "description": "最新プロジェクトでの実践事例を共有",
        "type": "Presentation",
        "presenterId": "uuid",
        "scheduledAt": "2024-02-01T14:00:00Z",
        "duration": 60,
        "location": "会議室A",
        "isVirtual": true,
        "meetingUrl": "https://meet.example.com/xxx",
        "maxParticipants": 50,
        "registeredCount": 35,
        "attendedCount": null,
        "recordingUrl": null
      }
    ]
  }
}
```

#### POST /knowledge-shares
**概要**: 知識共有セッションを作成

#### POST /knowledge-shares/{id}/register
**概要**: セッションに参加登録

#### POST /knowledge-shares/{id}/feedback
**概要**: セッションのフィードバックを送信

**リクエスト**:
```json
{
  "rating": 5,
  "comment": "非常に参考になりました",
  "recommendations": ["他のチームにも共有してほしい"]
}
```

## エラーコード

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| INVALID_REQUEST | 400 | リクエストが不正 |
| UNAUTHORIZED | 401 | 認証が必要 |
| FORBIDDEN | 403 | アクセス権限なし |
| NOT_FOUND | 404 | リソースが見つからない |
| CONFLICT | 409 | リソースの競合 |
| VALIDATION_ERROR | 422 | バリデーションエラー |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

### ビジネスルール違反の詳細エラーコード

| コード | 説明 |
|--------|------|
| KNOWLEDGE_ALREADY_PUBLISHED | ナレッジが既に公開済み |
| INVALID_STATUS_TRANSITION | 不正なステータス遷移 |
| DOCUMENT_SIZE_EXCEEDED | ドキュメントサイズが制限超過 |
| EXPERT_NOT_AVAILABLE | エキスパートが相談不可 |
| QUESTION_ALREADY_ANSWERED | 質問が既に回答済み |
| SESSION_FULL | セッションが満席 |

## レート制限
- **一般API**: 1000リクエスト/時間
- **検索API**: 100リクエスト/時間
- **アップロードAPI**: 50リクエスト/時間
- **制限時のレスポンス**: 429 Too Many Requests

## バージョン管理
- **現在**: v1.0.0
- **サポート**: v1.x系をサポート
- **廃止予定**: なし

## Webhooks

### 対応イベント
- `knowledge.published`: ナレッジ公開時
- `question.asked`: 質問投稿時
- `expert.identified`: エキスパート認定時
- `knowledge-share.scheduled`: セッション予定時

### Webhook設定
```json
POST /webhooks
{
  "url": "https://client.example.com/webhook",
  "events": ["knowledge.published", "question.asked"],
  "secret": "webhook_secret"
}
```

### Webhookペイロード例
```json
{
  "event": "knowledge.published",
  "timestamp": "2024-01-15T00:00:00Z",
  "data": {
    "knowledgeId": "uuid",
    "title": "DXプロジェクトでのアジャイル適用事例",
    "category": "Technical",
    "tags": ["DX", "Agile"]
  }
}
```
