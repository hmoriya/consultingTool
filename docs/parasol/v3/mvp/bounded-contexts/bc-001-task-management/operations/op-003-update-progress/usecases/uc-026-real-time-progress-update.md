# UC-026: リアルタイム進捗更新

## 概要
担当者がタスクの進捗状況をリアルタイムで更新し、関係者に即座に共有するユースケース。

## 基本フロー
```mermaid
graph TD
    A[開始] --> B[進捗率入力]
    B --> C[コメント追加]
    C --> D[障害・課題記録]
    D --> E[リアルタイム更新]
    E --> F[関係者通知]
    F --> G[完了]
```

## インターフェース定義
```typescript
interface ProgressUpdate {
  taskId: string;
  progressPercentage: number; // 0-100
  updateComment: string;
  blockers: Blocker[];
  estimatedCompletion: Date;
  updatedBy: string;
  updatedAt: Date;
}
```

## 更新履歴
| バージョン | 更新日 | 更新者 | 更新内容 |
|-----------|--------|---------|----------|
| 1.0 | 2024-11-05 | Claude Code | 初版作成 |