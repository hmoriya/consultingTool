# UC-064: チームコミュニケーション

## 概要
タスクに関連するチームメンバー間のリアルタイムコミュニケーション。

## インターフェース定義
```typescript
interface TeamCommunication {
  communicationId: string;
  taskId: string;
  participants: ParticipantInfo[];
  communicationType: 'CHAT' | 'VIDEO_CALL' | 'SCREEN_SHARE' | 'WHITEBOARD';
  startedAt: Date;
  endedAt?: Date;
  recordingUrl?: string;
}
```

## 更新履歴
| バージョン | 更新日 | 更新者 | 更新内容 |
|-----------|--------|---------|----------|
| 1.0 | 2024-11-05 | Claude Code | 初版作成 |