# OP-003: 知識を共有する

**作成日**: 2025-10-31
**所属L3**: L3-002-knowledge-discovery-and-application: Knowledge Discovery And Application
**所属BC**: BC-006: Knowledge Management & Learning
**V2移行元**: services/knowledge-co-creation-service/capabilities/knowledge-management/operations/share-knowledge

---

## 📋 How: この操作の定義

### 操作の概要
有用な知識を組織内で共有し、知識の循環を促進する。積極的な知識共有により、組織全体の学習と成長を加速する。

### 実現する機能
- 知識の共有と配信
- 関係者への通知
- ディスカッションとコメント
- 知識の評価とフィードバック

### 入力
- 共有する知識
- 共有対象（チーム、部門、全社）
- 共有メッセージ
- 重要度・緊急度

### 出力
- 共有された知識
- 共有通知
- コメント・ディスカッション
- 閲覧・評価統計

---

## 📥 入力パラメータ

### 必須パラメータ

#### 共有リクエスト
```typescript
interface KnowledgeSharingInput {
  // 共有対象
  articleId: UUID;                      // 共有する記事ID（必須）
  sharedBy: UUID;                       // 共有者ID（必須）

  // 共有先
  shareTargets: ShareTargets;           // 共有先（必須）

  // 共有設定
  shareOptions?: ShareOptions;          // 共有オプション

  // メッセージ
  message?: string;                     // 共有メッセージ（任意、最大500文字）
  tags?: string[];                      // 共有タグ（最大10個）
}

interface ShareTargets {
  // ユーザー指定
  userIds?: UUID[];                     // 個別ユーザーID配列

  // グループ指定
  teamIds?: UUID[];                     // チームID配列
  departmentIds?: UUID[];               // 部門ID配列
  projectIds?: UUID[];                  // プロジェクトID配列

  // 範囲指定
  scope?: 'private' | 'team' | 'department' | 'organization' | 'public';

  // ロール指定
  roleIds?: UUID[];                     // ロールID配列（特定ロールに共有）
}
```

#### 共有オプション
```typescript
interface ShareOptions {
  // 通知設定
  notification?: {
    enabled: boolean;                   // 通知送信（デフォルト: true）
    priority: 'low' | 'normal' | 'high' | 'urgent';
    channels: NotificationChannel[];    // 通知チャネル
    scheduleAt?: ISO8601DateTime;       // 通知予約日時
  };

  // アクセス制御
  accessControl?: {
    canComment: boolean;                // コメント可能（デフォルト: true）
    canShare: boolean;                  // 再共有可能（デフォルト: true）
    canDownload: boolean;               // ダウンロード可能（デフォルト: true）
    expiresAt?: ISO8601DateTime;        // アクセス期限
  };

  // アクティビティフィード
  activityFeed?: {
    publishToFeed: boolean;             // フィード公開（デフォルト: true）
    pinToTop: boolean;                  // トップ固定（デフォルト: false）
    highlightUntil?: ISO8601DateTime;   // ハイライト期限
  };
}

enum NotificationChannel {
  IN_APP = 'in_app',                    // アプリ内通知
  EMAIL = 'email',                      // メール
  SLACK = 'slack',                      // Slack
  TEAMS = 'teams',                      // Microsoft Teams
  MOBILE_PUSH = 'mobile_push'           // モバイルプッシュ
}
```

### 任意パラメータ

#### コメント・注釈設定
```typescript
interface CommentAnnotationInput {
  // コメント
  commentId?: UUID;                     // コメントID（返信の場合）
  content: string;                      // コメント内容（必須、最大1000文字）
  commentType?: 'general' | 'question' | 'suggestion' | 'concern';

  // 注釈（アノテーション）
  annotations?: Array<{
    startPosition: number;              // 開始位置（文字位置）
    endPosition: number;                // 終了位置
    annotationType: 'highlight' | 'note' | 'correction' | 'question';
    content: string;                    // 注釈内容
    severity?: 'info' | 'warning' | 'critical';
  }>;

  // メンション
  mentions?: UUID[];                    // メンションユーザーID配列
}
```

#### 配信チャネル設定
```typescript
interface DistributionChannelOptions {
  // メール配信
  email?: {
    enabled: boolean;
    template: string;                   // メールテンプレートID
    subject?: string;                   // カスタム件名
    includeSummary: boolean;            // 要約含む
  };

  // Slack配信
  slack?: {
    enabled: boolean;
    workspaceId: string;
    channelIds: string[];               // Slackチャネル配列
    includePreview: boolean;            // プレビュー含む
  };

  // Teams配信
  teams?: {
    enabled: boolean;
    tenantId: string;
    channelIds: string[];               // Teamsチャネル配列
  };
}
```

---

## 📤 出力仕様

### 成功レスポンス

#### 共有完了レスポンス
```typescript
interface KnowledgeSharingResponse {
  success: true;
  statusCode: 201;
  message: '知識が正常に共有されました';

  data: {
    // 共有情報
    sharing: {
      sharingId: UUID;                  // 共有ID
      articleId: UUID;
      articleTitle: string;
      sharedBy: {
        id: UUID;
        name: string;
        email: string;
      };
      sharedAt: ISO8601DateTime;
    };

    // 共有先統計
    shareTargetStats: {
      totalRecipients: number;          // 総受信者数
      recipientBreakdown: {
        individualUsers: number;        // 個別ユーザー数
        teams: number;                  // チーム数
        departments: number;            // 部門数
        projects: number;               // プロジェクト数
      };
      estimatedReach: number;           // 推定到達人数
    };

    // 通知配信状況（BC-007連携）
    notificationStatus: {
      requested: number;                // 通知リクエスト数
      sent: number;                     // 送信完了数
      pending: number;                  // 送信待ち数
      failed: number;                   // 送信失敗数

      // チャネル別ステータス
      byChannel: {
        in_app: { sent: number; failed: number; };
        email: { sent: number; failed: number; };
        slack: { sent: number; failed: number; };
        teams: { sent: number; failed: number; };
        mobile_push: { sent: number; failed: number; };
      };

      // 失敗詳細
      failures?: Array<{
        recipientId: UUID;
        channel: NotificationChannel;
        reason: string;
      }>;
    };

    // アクティビティフィード
    activityFeed?: {
      feedId: UUID;
      published: boolean;
      publishedAt?: ISO8601DateTime;
      feedUrl: string;                  // フィードURL
      visibility: string;               // 公開範囲
    };

    // アクセス制御
    accessControl: {
      canComment: boolean;
      canShare: boolean;
      canDownload: boolean;
      expiresAt?: ISO8601DateTime;
      accessUrl: string;                // アクセスURL
    };

    // 次のアクション
    nextActions: {
      viewActivityUrl: string;          // アクティビティ表示URL
      manageAccessUrl: string;          // アクセス管理URL
      viewStatisticsUrl: string;        // 統計表示URL
    };
  };

  meta: {
    processingTime: number;             // 処理時間（ms）
    bc007IntegrationStatus: 'success' | 'partial' | 'failed';
  };
}
```

#### コメント投稿レスポンス
```typescript
interface CommentResponse {
  success: true;
  statusCode: 201;
  message: 'コメントが投稿されました';

  data: {
    comment: {
      id: UUID;
      articleId: UUID;
      userId: UUID;
      userName: string;
      content: string;
      commentType: string;

      // 返信情報
      parentCommentId?: UUID;
      replyCount: number;

      // 注釈情報
      annotations?: Array<{
        id: UUID;
        startPosition: number;
        endPosition: number;
        annotationType: string;
        content: string;
      }>;

      // メンション
      mentions?: Array<{
        userId: UUID;
        userName: string;
        notified: boolean;
      }>;

      // ステータス
      status: 'published' | 'flagged' | 'hidden';
      createdAt: ISO8601DateTime;
      updatedAt: ISO8601DateTime;
    };

    // メンション通知（BC-007連携）
    mentionNotifications?: {
      sent: number;
      recipients: UUID[];
    };
  };
}
```

#### 閲覧統計レスポンス
```typescript
interface SharingStatisticsResponse {
  success: true;
  statusCode: 200;
  message: '共有統計が取得されました';

  data: {
    sharingId: UUID;
    articleId: UUID;

    // 閲覧統計
    viewStats: {
      totalViews: number;               // 総閲覧数
      uniqueViewers: number;            // ユニーク閲覧者数
      avgViewDuration: number;          // 平均閲覧時間（秒）
      completionRate: number;           // 読了率（%）

      // 時系列データ
      viewsOverTime: Array<{
        date: string;
        views: number;
        uniqueViewers: number;
      }>;
    };

    // エンゲージメント統計
    engagementStats: {
      likes: number;                    // いいね数
      bookmarks: number;                // ブックマーク数
      shares: number;                   // 再共有数
      comments: number;                 // コメント数
      engagementRate: number;           // エンゲージメント率（%）
    };

    // トップビューアー
    topViewers: Array<{
      userId: UUID;
      userName: string;
      viewCount: number;
      lastViewedAt: ISO8601DateTime;
    }>;

    // コメントサマリー
    commentSummary: {
      totalComments: number;
      questions: number;
      suggestions: number;
      concerns: number;
      recentComments: Array<{
        id: UUID;
        userName: string;
        content: string;
        createdAt: ISO8601DateTime;
      }>;
    };
  };
}
```

---

## 🛠️ 実装ガイダンス

### アーキテクチャパターン

```
API Layer
    ↓
Application Service Layer
    ↓
Domain Service Layer
    ├─→ Knowledge Sharing Service
    ├─→ Access Control Service
    ├─→ Comment & Annotation Service
    └─→ Activity Feed Service
    ↓
Integration Layer
    ├─→ BC-007 Notification Service (通知配信)
    ├─→ BC-001 Authentication Service (アクセス制御)
    └─→ BC-005 Project Service (プロジェクト連携)
    ↓
Data Layer
    ├─→ PostgreSQL (共有履歴、コメント)
    ├─→ Redis (リアルタイムアクティビティ)
    └─→ Elasticsearch (アクティビティ検索)
```

### 核心実装コンポーネント

#### 1. Knowledge Sharing Service
```typescript
@Injectable()
export class KnowledgeSharingService {
  constructor(
    private readonly sharingRepo: SharingHistoryRepository,
    private readonly notificationService: BC007NotificationService,  // BC-007連携
    private readonly accessControlService: AccessControlService,
    private readonly activityFeedService: ActivityFeedService
  ) {}

  async shareKnowledge(
    input: KnowledgeSharingInput
  ): Promise<SharingRecord> {

    // 1. 共有対象記事の取得と権限確認
    const article = await this.articleRepo.findById(input.articleId);
    await this.validateSharingPermission(input.sharedBy, article);

    // 2. 受信者リスト解決
    const recipients = await this.resolveRecipients(input.shareTargets);

    // 3. 共有レコード作成
    const sharing = SharingRecord.create({
      articleId: input.articleId,
      sharedBy: input.sharedBy,
      recipients: recipients.map(r => r.id),
      message: input.message,
      tags: input.tags,
      options: input.shareOptions
    });

    await this.sharingRepo.save(sharing);

    // 4. アクセス制御設定（BC-001連携）
    if (input.shareOptions?.accessControl) {
      await this.accessControlService.setupAccess(
        article.id,
        recipients,
        input.shareOptions.accessControl
      );
    }

    // 5. 通知配信（BC-007連携）
    if (input.shareOptions?.notification?.enabled !== false) {
      await this.sendNotifications(sharing, article, recipients, input.shareOptions?.notification);
    }

    // 6. アクティビティフィード公開
    if (input.shareOptions?.activityFeed?.publishToFeed !== false) {
      await this.activityFeedService.publish(sharing, article, input.shareOptions?.activityFeed);
    }

    // 7. ドメインイベント発行
    sharing.addDomainEvent(new KnowledgeSharedEvent(sharing));

    return sharing;
  }

  private async resolveRecipients(
    targets: ShareTargets
  ): Promise<Recipient[]> {
    const recipients: Recipient[] = [];

    // 個別ユーザー
    if (targets.userIds?.length > 0) {
      const users = await this.userRepo.findByIds(targets.userIds);
      recipients.push(...users.map(u => ({ id: u.id, type: 'user', email: u.email })));
    }

    // チーム
    if (targets.teamIds?.length > 0) {
      for (const teamId of targets.teamIds) {
        const teamMembers = await this.teamRepo.getMembers(teamId);
        recipients.push(...teamMembers.map(m => ({ id: m.userId, type: 'team', email: m.email })));
      }
    }

    // 部門
    if (targets.departmentIds?.length > 0) {
      for (const deptId of targets.departmentIds) {
        const deptUsers = await this.departmentRepo.getUsers(deptId);
        recipients.push(...deptUsers.map(u => ({ id: u.id, type: 'department', email: u.email })));
      }
    }

    // プロジェクト（BC-005連携）
    if (targets.projectIds?.length > 0) {
      for (const projectId of targets.projectIds) {
        const projectMembers = await this.projectService.getMembers(projectId);
        recipients.push(...projectMembers.map(m => ({ id: m.userId, type: 'project', email: m.email })));
      }
    }

    // 重複除去
    return this.deduplicateRecipients(recipients);
  }

  private async sendNotifications(
    sharing: SharingRecord,
    article: KnowledgeArticle,
    recipients: Recipient[],
    notificationOptions?: any
  ): Promise<NotificationResult> {

    // BC-007のOP-001 (send-notification)を利用
    const results: NotificationResult = {
      sent: 0,
      failed: 0,
      byChannel: {}
    };

    for (const recipient of recipients) {
      try {
        await this.notificationService.sendNotification({
          recipientId: recipient.id,
          type: 'knowledge_shared',
          priority: notificationOptions?.priority || 'normal',
          title: `${sharing.sharedBy.name}さんが知識を共有しました`,
          content: sharing.message || article.title,
          actionUrl: `/knowledge/articles/${article.id}`,
          channels: notificationOptions?.channels || ['in_app', 'email'],
          metadata: {
            sharingId: sharing.id,
            articleId: article.id,
            articleTitle: article.title
          }
        });

        results.sent++;
      } catch (error) {
        results.failed++;
        console.error(`Notification failed for recipient ${recipient.id}:`, error);
      }
    }

    return results;
  }
}
```

#### 2. Comment & Annotation Service
```typescript
@Injectable()
export class CommentAnnotationService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly notificationService: BC007NotificationService
  ) {}

  async addComment(
    articleId: UUID,
    userId: UUID,
    input: CommentAnnotationInput
  ): Promise<Comment> {

    // 1. コメント作成
    const comment = Comment.create({
      articleId,
      userId,
      content: input.content,
      commentType: input.commentType || 'general',
      parentCommentId: input.commentId,
      annotations: input.annotations
    });

    await this.commentRepo.save(comment);

    // 2. メンション通知（BC-007連携）
    if (input.mentions?.length > 0) {
      await this.sendMentionNotifications(comment, input.mentions);
    }

    // 3. 返信通知（親コメントの投稿者に通知）
    if (input.commentId) {
      const parentComment = await this.commentRepo.findById(input.commentId);
      if (parentComment && parentComment.userId !== userId) {
        await this.notificationService.sendNotification({
          recipientId: parentComment.userId,
          type: 'comment_reply',
          priority: 'normal',
          title: 'コメントに返信がありました',
          content: input.content.substring(0, 100),
          actionUrl: `/knowledge/articles/${articleId}#comment-${comment.id}`
        });
      }
    }

    return comment;
  }

  private async sendMentionNotifications(
    comment: Comment,
    mentionedUserIds: UUID[]
  ): Promise<void> {
    for (const userId of mentionedUserIds) {
      // BC-007通知配信
      await this.notificationService.sendNotification({
        recipientId: userId,
        type: 'mention',
        priority: 'high',
        title: 'コメントでメンションされました',
        content: comment.content.substring(0, 100),
        actionUrl: `/knowledge/articles/${comment.articleId}#comment-${comment.id}`
      });
    }
  }

  async getComments(
    articleId: UUID,
    options?: {
      includeAnnotations?: boolean;
      sortBy?: 'newest' | 'oldest' | 'most_liked';
    }
  ): Promise<Comment[]> {
    return this.commentRepo.findByArticle(articleId, options);
  }
}
```

#### 3. Activity Feed Service
```typescript
@Injectable()
export class ActivityFeedService {
  constructor(
    private readonly feedRepo: ActivityFeedRepository,
    private readonly esClient: ElasticsearchClient
  ) {}

  async publish(
    sharing: SharingRecord,
    article: KnowledgeArticle,
    options?: any
  ): Promise<ActivityFeed> {

    // アクティビティフィードアイテム作成
    const feedItem = ActivityFeed.create({
      activityType: 'knowledge_shared',
      actorId: sharing.sharedBy,
      objectId: article.id,
      objectType: 'knowledge_article',
      visibility: this.determineVisibility(sharing.shareTargets),
      content: {
        title: article.title,
        summary: article.summary,
        message: sharing.message,
        tags: sharing.tags
      },
      metadata: {
        sharingId: sharing.id,
        recipientCount: sharing.recipients.length
      },
      pinToTop: options?.pinToTop || false,
      highlightUntil: options?.highlightUntil
    });

    await this.feedRepo.save(feedItem);

    // Elasticsearchにインデックス（検索用）
    await this.esClient.index({
      index: 'activity_feed',
      id: feedItem.id,
      document: {
        ...feedItem,
        timestamp: feedItem.createdAt
      }
    });

    return feedItem;
  }

  async getActivityFeed(
    userId: UUID,
    options?: {
      page?: number;
      limit?: number;
      activityTypes?: string[];
    }
  ): Promise<ActivityFeedItem[]> {
    // ユーザーが閲覧可能なアクティビティ取得
    return this.feedRepo.findAccessibleActivities(userId, options);
  }
}
```

### データベーススキーマ

```sql
-- 共有履歴テーブル
CREATE TABLE sharing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id),
  shared_by UUID NOT NULL REFERENCES users(id),
  message TEXT,
  tags TEXT[],

  -- 共有先
  recipients JSONB NOT NULL,            -- 受信者情報配列
  share_targets JSONB NOT NULL,         -- 共有対象設定

  -- オプション
  share_options JSONB,

  -- ステータス
  status VARCHAR(20) DEFAULT 'active',
  expires_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT check_status CHECK (status IN ('active', 'expired', 'revoked'))
);

-- コメントテーブル
CREATE TABLE article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id),
  user_id UUID NOT NULL REFERENCES users(id),
  parent_comment_id UUID REFERENCES article_comments(id),

  content TEXT NOT NULL,
  comment_type VARCHAR(50) DEFAULT 'general',

  -- 注釈
  annotations JSONB,

  -- メンション
  mentions UUID[],

  -- ステータス
  status VARCHAR(20) DEFAULT 'published',
  flagged BOOLEAN DEFAULT FALSE,

  -- 統計
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT check_comment_type CHECK (comment_type IN ('general', 'question', 'suggestion', 'concern')),
  CONSTRAINT check_status CHECK (status IN ('published', 'flagged', 'hidden', 'deleted'))
);

-- アクティビティフィードテーブル
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type VARCHAR(50) NOT NULL,
  actor_id UUID NOT NULL REFERENCES users(id),
  object_id UUID NOT NULL,
  object_type VARCHAR(50) NOT NULL,

  visibility VARCHAR(20) NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB,

  pin_to_top BOOLEAN DEFAULT FALSE,
  highlight_until TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT check_activity_type CHECK (activity_type IN ('knowledge_shared', 'comment_added', 'article_published', 'article_updated')),
  CONSTRAINT check_visibility CHECK (visibility IN ('private', 'team', 'department', 'organization', 'public'))
);

-- インデックス
CREATE INDEX idx_sharing_history_article ON sharing_history(article_id);
CREATE INDEX idx_sharing_history_shared_by ON sharing_history(shared_by);
CREATE INDEX idx_sharing_history_created ON sharing_history(created_at DESC);
CREATE INDEX idx_article_comments_article ON article_comments(article_id, created_at DESC);
CREATE INDEX idx_article_comments_user ON article_comments(user_id);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_visibility ON activity_feed(visibility);
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

```
ERR_BC006_L3002_OP003_XXX
```

### エラーカテゴリ

#### 1. バリデーションエラー (400)
```typescript
// ERR_BC006_L3002_OP003_001: 受信者未指定
{
  code: 'ERR_BC006_L3002_OP003_001',
  message: '共有先を指定してください。',
  field: 'shareTargets'
}

// ERR_BC006_L3002_OP003_002: メッセージ長超過
{
  code: 'ERR_BC006_L3002_OP003_002',
  message: '共有メッセージは500文字以内である必要があります。',
  field: 'message',
  currentLength: 600,
  maxLength: 500
}
```

#### 2. ビジネスルールエラー (422)
```typescript
// ERR_BC006_L3002_OP003_101: 共有権限なし
{
  code: 'ERR_BC006_L3002_OP003_101',
  message: 'この記事を共有する権限がありません。',
  details: {
    articleId: 'uuid-xxxxx',
    requiredPermission: 'knowledge:share'
  }
}

// ERR_BC006_L3002_OP003_102: 受信者アクセス不可
{
  code: 'ERR_BC006_L3002_OP003_102',
  message: '一部の受信者はこの記事にアクセスできません。',
  details: {
    inaccessibleRecipients: ['user-id-1', 'user-id-2']
  }
}
```

#### 3. 外部サービスエラー (502/503)
```typescript
// ERR_BC006_L3002_OP003_401: BC-007通知失敗
{
  code: 'ERR_BC006_L3002_OP003_401',
  message: '通知の送信に失敗しました。',
  statusCode: 502,
  details: {
    service: 'BC-007 Notification Service',
    failedCount: 5,
    impact: '記事は共有されましたが、一部の通知が送信されませんでした。'
  }
}
```

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/operations/share-knowledge/](../../../../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/operations/share-knowledge/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
