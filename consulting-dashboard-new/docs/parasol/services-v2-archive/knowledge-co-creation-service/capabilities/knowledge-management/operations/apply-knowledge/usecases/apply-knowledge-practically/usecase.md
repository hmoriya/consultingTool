# ユースケース: 知識を実際に適用する

**バージョン**: 2.0.0
**更新日**: 2025-10-21
**設計方針**: 実践支援・行動促進・成果創出

## 基本情報
- **ユースケースID**: UC-APPLY-03
- **アクター**: コンサルタント（主アクター）、システム（副アクター）、知識作成者（情報提供者）
- **概要**: 推奨された知識を実際の業務・プロジェクトで適用し、実践的な価値創造を実現する

## 🏗️ パラソルドメイン連携

### 操作エンティティ
- **KnowledgeApplicationEntity**（自サービス管理・状態更新: planned → executing → completed → evaluated）: 知識適用実行の管理
- **ApplicationPlanEntity**（自サービス管理・CRUD）: 適用計画の詳細管理
- **ApplicationProgressEntity**（自サービス管理・CRUD）: 適用進捗の追跡
- **ApplicationResultEntity**（自サービス管理・CRUD）: 適用結果の記録
- **KnowledgeEntity**（参照のみ）: 適用対象知識の詳細情報参照
- **ApplicationContextEntity**（参照のみ）: 適用文脈情報の参照

### 他サービスユースケース利用
- **secure-access-service**: UC-AUTH-01: ユーザー認証を実行する（適用開始時）
- **secure-access-service**: UC-AUTH-02: 権限を検証する（機密知識適用時）
- **collaboration-facilitation-service**: UC-COMM-01: 適用開始を通知する（チーム連携時）
- **collaboration-facilitation-service**: UC-COMM-02: 進捗状況を共有する（定期報告時）
- **project-success-service**: UC-TASK-01: 関連タスクを作成する（適用計画実行時）
- **project-success-service**: UC-DELIVERABLE-01: 成果物を作成する（適用結果記録時）

## 事前条件
- UC-APPLY-02で知識推奨が完了し、適用すべき知識が選択されている
- 知識適用に必要なリソース（時間、人材、ツール）が確保されている
- 適用対象の業務・プロジェクトが明確に定義されている
- 知識適用権限が確認されている

## 事後条件
### 成功時
- KnowledgeApplicationEntityが「completed」状態で保存されている
- 適用結果が詳細に記録され、効果測定の準備が完了している
- 適用プロセスが他メンバーに共有されている
- 次のユースケース（効果測定・評価）の実行準備が完了している

### 失敗時
- 適用プロセスが「executing」状態で中断記録されている
- 中断理由と復旧計画が明確化されている
- 失敗要因分析の結果が記録されている

## 基本フロー
1. **コンサルタント**が適用計画の詳細を策定する
2. **システム**が適用計画の実行可能性を検証する
3. **コンサルタント**が知識適用を実際に開始する
4. **システム**が適用プロセスの進捗を追跡する
5. **コンサルタント**が適用中の課題・発見事項を記録する
6. **システム**が適用状況をチーム・関係者に共有する（他サービス連携）
7. **コンサルタント**が知識適用を完了する
8. **システム**が適用結果を構造化して記録する
9. **システム**が効果測定フェーズへの移行準備を完了する

## 代替フロー

### 代替フロー1: 段階的適用の実行
- **分岐点**: ステップ3（適用開始）
- **条件**: 大規模・複雑な知識を段階的に適用する場合
- **処理**:
  - 3a1. システムが知識を複数フェーズに分割提案
  - 3a2. コンサルタントが第1フェーズの適用を開始
  - 3a3. システムが段階別進捗を管理
  - 3a4. 各フェーズ完了後に次フェーズ移行を判定
  - 3a5. 全フェーズ完了で基本フロー7に続行

### 代替フロー2: チーム協働適用
- **分岐点**: ステップ3（適用開始）
- **条件**: チーム全体で知識を適用する場合
- **処理**:
  - 3b1. システムがチームメンバーの役割分担を提案
  - 3b2. コンサルタントが役割分担を確定・配信
  - 3b3. システムがメンバー別進捗を個別追跡
  - 3b4. 定期的なチーム同期会議をスケジュール
  - 3b5. 全メンバー完了で基本フロー7に続行

### 代替フロー3: 知識カスタマイズ適用
- **分岐点**: ステップ4（進捗追跡）
- **条件**: 適用文脈に合わせて知識をカスタマイズする必要がある場合
- **処理**:
  - 4a1. コンサルタントが知識の修正必要性を報告
  - 4a2. システムが元知識と修正内容を比較分析
  - 4a3. カスタマイズ版知識として新規記録
  - 4a4. カスタマイズ内容を元知識フィードバックとして記録
  - 4a5. 修正版で適用を継続、基本フロー5に戻る

## 例外フロー

### 例外1: 知識適用実行困難
- **発生点**: ステップ3（適用開始）
- **処理**:
  - 3e1. システムが適用阻害要因を分析
  - 3e2. 代替知識の推奨、または知識修正の提案
  - 3e3. 適用計画の見直し・修正
  - 3e4. 必要に応じて専門家コンサルテーション要請
  - 3e5. 修正計画で再実行、または適用中止判定

### 例外2: 適用中の重大問題発生
- **発生点**: ステップ5（課題記録）
- **処理**:
  - 5e1. システムが問題の重大度を自動判定
  - 5e2. 緊急停止の要否をコンサルタントに確認
  - 5e3. 必要に応じて適用を一時停止
  - 5e4. 問題解決計画の策定、専門家への相談要請
  - 5e5. 解決後に適用再開、または適用方法変更

### 例外3: 他サービス連携障害
- **発生点**: ステップ6（情報共有）
- **処理**:
  - 6e1. システムが連携サービス障害を検知
  - 6e2. ローカル記録での情報保持を継続
  - 6e3. 障害復旧後の自動同期スケジュール設定
  - 6e4. 手動での重要情報共有手段を提供

## 特別要件

### 実践支援要件
- **ガイダンス提供**: 適用手順の段階的ガイド表示
- **リアルタイム支援**: 適用中の質問・相談への即座対応
- **進捗可視化**: 適用進捗の分かりやすい可視化
- **ベストプラクティス**: 類似適用事例のリアルタイム参照

### パフォーマンス要件
- **計画策定支援**: 計画立案支援機能3秒以内
- **進捗記録**: 進捗更新処理1秒以内
- **共有処理**: チーム共有処理5秒以内
- **結果記録**: 適用結果保存10秒以内

### 品質要件
- **適用精度**: 計画通りの適用実行率90%以上
- **完了率**: 適用開始から完了までの成功率85%以上
- **記録品質**: 適用プロセスの詳細記録完成度95%以上
- **知識改善**: 適用結果による知識改善提案率30%以上

## 入出力仕様

### 入力（前ステップからの引継ぎ）
```json
{
  "recommendationData": {
    "recommendationId": "UUID",
    "selectedKnowledge": [
      {
        "knowledgeId": "UUID",
        "title": "プロジェクト課題解決手法",
        "applicationType": "direct|customized|hybrid",
        "priority": "high|medium|low",
        "estimatedTime": "2-3 hours",
        "complexity": "intermediate"
      }
    ],
    "applicationContext": {
      "contextId": "UUID",
      "problemStatement": "構造化された課題定義",
      "targetOutcome": "期待する成果",
      "constraints": ["制約条件1", "制約条件2"],
      "availableResources": {
        "time": "2 weeks",
        "team": ["member1", "member2"],
        "tools": ["tool1", "tool2"]
      }
    }
  }
}
```

### 出力（API → フロントエンド）
```json
{
  "result": "success|in_progress|failed|suspended",
  "applicationData": {
    "applicationId": "UUID",
    "status": "completed",
    "executionPlan": {
      "phases": [
        {
          "phaseId": 1,
          "name": "準備フェーズ",
          "tasks": ["task1", "task2"],
          "estimatedDuration": "2 days",
          "status": "completed"
        },
        {
          "phaseId": 2,
          "name": "実行フェーズ",
          "tasks": ["task3", "task4", "task5"],
          "estimatedDuration": "1 week",
          "status": "completed"
        }
      ]
    },
    "executionResults": {
      "actualDuration": "8 days",
      "tasksCompleted": 5,
      "tasksTotal": 5,
      "issuesEncountered": 2,
      "customizationsApplied": 1,
      "knowledgeUtilizationRate": 0.95
    }
  },
  "applicationRecord": {
    "startDate": "2024-10-01T09:00:00Z",
    "completionDate": "2024-10-09T17:00:00Z",
    "participantSummary": {
      "primaryApplicator": "user-uuid",
      "teamMembers": ["member1-uuid", "member2-uuid"],
      "consultedExperts": ["expert1-uuid"]
    },
    "processNotes": [
      {
        "timestamp": "2024-10-03T14:00:00Z",
        "type": "issue",
        "description": "手順3での予期しない問題発生",
        "resolution": "代替アプローチで解決"
      }
    ]
  },
  "knowledgeFeedback": {
    "effectivenessRating": 4.2,
    "usabilityRating": 4.5,
    "accuracyRating": 4.0,
    "improvementSuggestions": [
      "手順3の説明をより詳細化すべき",
      "図解の追加が効果的と思われる"
    ]
  },
  "nextSteps": {
    "readyForEvaluation": true,
    "evaluationProcess": "UC-APPLY-04",
    "recommendedEvaluationDate": "2024-10-16T09:00:00Z"
  }
}
```

### 進捗追跡データ構造
```json
{
  "progressTracking": {
    "overallProgress": {
      "completionRate": 100,
      "currentPhase": "completed",
      "timeSpent": "40 hours",
      "remainingTime": "0 hours"
    },
    "phaseProgress": [
      {
        "phaseId": 1,
        "name": "準備フェーズ",
        "progress": 100,
        "startDate": "2024-10-01T09:00:00Z",
        "completionDate": "2024-10-02T17:00:00Z",
        "achievements": ["環境整備完了", "チーム編成完了"]
      }
    ],
    "qualityMetrics": {
      "adherenceToKnowledge": 0.95,
      "processDocumentationQuality": 0.88,
      "teamCollaborationEffectiveness": 0.92,
      "issueResolutionSpeed": "average 2 hours"
    }
  }
}
```

## 知識適用パターン

### パターン1: 直接適用
- **適用方法**: 推奨知識をそのまま適用
- **適用条件**: 文脈が完全に一致する場合
- **実行難易度**: 低
- **期待効果**: 高い確実性

### パターン2: カスタマイズ適用
- **適用方法**: 文脈に合わせて知識を修正・調整
- **適用条件**: 部分的な文脈適合の場合
- **実行難易度**: 中
- **期待効果**: 中〜高い適合性

### パターン3: ハイブリッド適用
- **適用方法**: 複数知識を組み合わせて適用
- **適用条件**: 複雑な課題で単一知識では不十分な場合
- **実行難易度**: 高
- **期待効果**: 包括的な解決

### パターン4: 段階的適用
- **適用方法**: 知識を段階に分けて順次適用
- **適用条件**: 大規模・長期の適用が必要な場合
- **実行難易度**: 高
- **期待効果**: 確実な定着

## 適用品質管理

### 品質チェックポイント
1. **計画段階**: 適用可能性・リスク分析
2. **実行開始**: 初期条件・準備状況確認
3. **中間段階**: 進捗・課題・調整必要性確認
4. **完了段階**: 目標達成度・結果品質確認

### 品質保証メトリクス
```
適用品質スコア =
  (計画遵守度 × 0.25) +
  (実行効率 × 0.25) +
  (結果品質 × 0.30) +
  (学習効果 × 0.20)

計画遵守度: 計画通りの実行率
実行効率: 想定時間内完了率
結果品質: 期待成果の達成度
学習効果: 知識定着・応用可能性
```

## 関連ユースケース
- **UC-APPLY-02**: 適切な知識を推奨する（前のステップ）
- **UC-APPLY-04**: 活用効果を測定・評価する（次のステップ）
- **UC-CAPTURE-03**: 知識を更新・改善する（適用結果のフィードバック）
- **UC-SHARE-01**: 適用結果を共有する（組織学習のため）

---
*このユースケースは、推奨された知識を実際の価値創造につなげる実践的な適用プロセスを実現し、パラソル設計v2.0仕様に基づく知識活用の核心機能を提供しています*