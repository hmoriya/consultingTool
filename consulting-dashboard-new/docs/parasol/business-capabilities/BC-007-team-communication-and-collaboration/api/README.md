# BC-007: API設計

**BC**: Team Communication & Collaboration
**作成日**: 2025-10-31
**V2移行元**: services/collaboration-facilitation-service/api/

---

## 概要

このディレクトリは、BC-007（チームコミュニケーションとコラボレーション）のAPI設計を定義します。

**重要**: Issue #146対応により、API設計はWHAT（能力定義）とHOW（利用方法）に分離されています。

---

## 主要APIエンドポイント

### Messaging API
```
POST   /api/bc-007/messages
GET    /api/bc-007/messages/{messageId}
DELETE /api/bc-007/messages/{messageId}
GET    /api/bc-007/messages
POST   /api/bc-007/messages/broadcast
```

### Notification API
```
POST   /api/bc-007/notifications
GET    /api/bc-007/notifications/{notificationId}
PUT    /api/bc-007/notifications/{notificationId}/read
GET    /api/bc-007/notifications
POST   /api/bc-007/notifications/urgent
GET    /api/bc-007/notifications/unread
```

### Meeting Management API
```
POST   /api/bc-007/meetings
GET    /api/bc-007/meetings/{meetingId}
PUT    /api/bc-007/meetings/{meetingId}
DELETE /api/bc-007/meetings/{meetingId}
GET    /api/bc-007/meetings
POST   /api/bc-007/meetings/{meetingId}/invite
```

### Workspace Management API
```
POST   /api/bc-007/workspaces
GET    /api/bc-007/workspaces/{workspaceId}
PUT    /api/bc-007/workspaces/{workspaceId}
DELETE /api/bc-007/workspaces/{workspaceId}
GET    /api/bc-007/workspaces
POST   /api/bc-007/workspaces/{workspaceId}/members
POST   /api/bc-007/workspaces/{workspaceId}/documents
```

---

## BC間連携API

### 全BCからの通知要求受信
```
POST /api/bc-007/notifications
Body: {
  type: string,
  priority: 'low'|'normal'|'high'|'urgent',
  recipients: UUID[],
  message: string,
  sourceBC: string
}
```

### BC-003 (Access Control) へのアクセス制御要求
```
POST /api/bc-003/auth/check-permission
Body: { userId, resource: 'workspace', action: 'read' }
```

---

**ステータス**: Phase 0 - 基本構造作成完了
