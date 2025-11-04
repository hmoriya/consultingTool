# BC-007: 会議管理API [Meeting API]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03

---

## 概要

Meeting APIは、会議スケジューリング、オンライン会議統合、議事録管理を提供します。

### エンドポイント一覧

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | `/api/v1/bc-007/meetings` | 会議作成 |
| GET | `/api/v1/bc-007/meetings/{meetingId}` | 会議取得 |
| PUT | `/api/v1/bc-007/meetings/{meetingId}` | 会議更新 |
| DELETE | `/api/v1/bc-007/meetings/{meetingId}` | 会議キャンセル |
| GET | `/api/v1/bc-007/meetings` | 会議リスト取得 |
| POST | `/api/v1/bc-007/meetings/{meetingId}/invite` | 参加者招待 |
| POST | `/api/v1/bc-007/meetings/{meetingId}/accept` | 招待承諾 |
| POST | `/api/v1/bc-007/meetings/{meetingId}/decline` | 招待辞退 |
| POST | `/api/v1/bc-007/meetings/{meetingId}/start` | 会議開始 |
| POST | `/api/v1/bc-007/meetings/{meetingId}/complete` | 会議終了 |
| POST | `/api/v1/bc-007/meetings/{meetingId}/minutes` | 議事録作成 |
| PUT | `/api/v1/bc-007/meetings/{meetingId}/minutes` | 議事録更新 |
| GET | `/api/v1/bc-007/meetings/available-slots` | 空き時間検索 |

---

## Meeting API

### 会議作成

**エンドポイント**: `POST /api/v1/bc-007/meetings`

**リクエスト**:
```json
{
  "title": "Project Review Meeting",
  "description": "Quarterly project review",
  "type": "project_meeting",
  "startTime": "2025-11-05T14:00:00.000Z",
  "endTime": "2025-11-05T15:00:00.000Z",
  "timezone": "Asia/Tokyo",
  "location": {
    "type": "online",
    "onlineProvider": "zoom"
  },
  "participantIds": ["user1-uuid", "user2-uuid"],
  "agenda": [
    "Q3 results review",
    "Q4 planning",
    "Resource allocation"
  ]
}
```

**レスポンス**: `201 Created`
```json
{
  "meetingId": "meeting-uuid",
  "title": "Project Review Meeting",
  "startTime": "2025-11-05T14:00:00.000Z",
  "endTime": "2025-11-05T15:00:00.000Z",
  "onlineMeetingInfo": {
    "provider": "zoom",
    "meetingUrl": "https://zoom.us/j/123456789",
    "meetingId": "123 456 789",
    "password": "abc123"
  },
  "status": "scheduled",
  "participantCount": 3,
  "createdAt": "2025-11-03T12:00:00.000Z"
}
```

---

### 空き時間検索

**エンドポイント**: `GET /api/v1/bc-007/meetings/available-slots`

**クエリパラメータ**:
```
participantIds=user1,user2,user3
&durationMinutes=60
&startDate=2025-11-05
&endDate=2025-11-10
```

**レスポンス**: `200 OK`
```json
{
  "availableSlots": [
    {
      "startTime": "2025-11-05T14:00:00.000Z",
      "endTime": "2025-11-05T15:00:00.000Z",
      "availableParticipants": ["user1-uuid", "user2-uuid", "user3-uuid"]
    },
    {
      "startTime": "2025-11-06T10:00:00.000Z",
      "endTime": "2025-11-06T11:00:00.000Z",
      "availableParticipants": ["user1-uuid", "user2-uuid", "user3-uuid"]
    }
  ],
  "totalSlots": 12
}
```

---

### 議事録作成

**エンドポイント**: `POST /api/v1/bc-007/meetings/{meetingId}/minutes`

**リクエスト**:
```json
{
  "content": "# Meeting Minutes\n\n## Attendees\n- Alice\n- Bob\n\n## Discussion Points\n...",
  "actionItems": [
    {
      "description": "Update project timeline",
      "assigneeId": "user1-uuid",
      "dueDate": "2025-11-10"
    }
  ]
}
```

**レスポンス**: `201 Created`
```json
{
  "minutesId": "minutes-uuid",
  "meetingId": "meeting-uuid",
  "content": "# Meeting Minutes...",
  "actionItems": [
    {
      "id": "action-uuid",
      "description": "Update project timeline",
      "assigneeId": "user1-uuid",
      "dueDate": "2025-11-10",
      "isCompleted": false
    }
  ],
  "createdAt": "2025-11-05T15:05:00.000Z"
}
```

---

**最終更新**: 2025-11-03
