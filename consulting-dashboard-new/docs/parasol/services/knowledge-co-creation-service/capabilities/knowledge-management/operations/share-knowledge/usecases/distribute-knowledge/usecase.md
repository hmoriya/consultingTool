# ユースケース: 知識を組織に配信する

**バージョン**: 2.0.0
**更新日**: 2025-10-21
**設計方針**: 効率配信・確実到達・適応最適化

## 基本情報
- **ユースケースID**: UC-SHARE-02
- **アクター**: ナレッジマネージャー（主アクター）、知識共有者（副アクター）、システム（配信支援アクター）
- **概要**: 策定された共有戦略に基づき、知識を適切なチャネル経由で組織内に効果的に配信・流通させる

## 🏗️ パラソルドメイン連携

### 操作エンティティ
- **KnowledgeDistributionEntity**（自サービス管理・状態更新: scheduled → distributing → completed → analyzed）: 知識配信プロセスの管理
- **DistributionChannelEntity**（自サービス管理・CRUD）: 配信チャネル（メール・ポータル・会議）の管理
- **DeliveryTrackingEntity**（自サービス管理・CRUD）: 配信状況・到達確認の追跡記録
- **RecipientInteractionEntity**（自サービス管理・CRUD）: 受信者の反応・エンゲージメント記録
- **SharingStrategyEntity**（参照のみ）: 策定済み共有戦略の詳細情報参照
- **KnowledgeEntity**（参照のみ）: 配信対象知識の内容・メタデータ参照

### 他サービスユースケース利用
- **secure-access-service**: UC-AUTH-01: ユーザー認証を実行する（配信開始時）
- **secure-access-service**: UC-AUTH-02: 権限を検証する（機密知識配信時）
- **collaboration-facilitation-service**: UC-COMM-01: 配信通知を送信する（全チャネル配信時）
- **collaboration-facilitation-service**: UC-COMM-02: 進捗更新を通知する（配信状況通知時）
- **collaboration-facilitation-service**: UC-COMM-03: フィードバックを収集する（受信者反応時）
- **talent-optimization-service**: UC-TEAM-02: チーム活動スケジュールを確認する（会議配信調整時）

## 事前条件
- UC-SHARE-01で共有戦略が承認・策定されている
- 配信対象知識が配信可能状態（品質確認済み）にある
- 対象者・チャネル・スケジュールが明確に定義されている
- 必要な配信権限・アクセス権が確保されている

## 事後条件
### 成功時
- KnowledgeDistributionEntityが「completed」状態で保存されている
- 全ての対象者に知識が配信され、到達確認が完了している
- 配信効果の初期データ（開封率・閲覧率）が記録されている
- 次のステップ（効果測定）の準備が完了している

### 失敗時
- 配信プロセスが「distributing」状態で中断記録されている
- 配信失敗の原因分析と対象者への影響評価が記録されている
- 再配信・代替配信の実行計画が策定されている

## 基本フロー
1. **ナレッジマネージャー**が配信実行を承認・開始する
2. **システム**が共有戦略に基づき配信計画を詳細化する
3. **システム**が各配信チャネルの準備・設定を完了する
4. **システム**が段階的配信スケジュールを開始する
5. **システム**が知識コンテンツを各チャネル用に最適化する
6. **システム**が対象者に知識を配信する（他サービス連携）
7. **システム**が配信状況・到達確認をリアルタイム監視する
8. **知識共有者**が配信内容の補足・質疑対応を実施する
9. **システム**が受信者の初期反応・エンゲージメントを記録する
10. **ナレッジマネージャー**が配信完了を確認し効果測定へ移行する

## 代替フロー

### 代替フロー1: 段階的配信実行
- **分岐点**: ステップ4（配信スケジュール開始）
- **条件**: 戦略で段階的展開が計画されている場合
- **処理**:
  - 4a1. システムがPhase 1（パイロットグループ）配信を開始
  - 4a2. 初期配信の反応・効果を1-2日間監視・分析
  - 4a3. 初期結果に基づく配信内容・方法の微調整
  - 4a4. Phase 2（拡大グループ）配信を実行
  - 4a5. 全段階完了後、基本フロー8に続行

### 代替フロー2: マルチチャネル同期配信
- **分岐点**: ステップ6（知識配信）
- **条件**: 複数チャネルでの同期配信が計画されている場合
- **処理**:
  - 6a1. システムがメール・ポータル・チャット等の複数チャネルを同期準備
  - 6a2. 各チャネル用にコンテンツを最適化（文字数・形式・リンク）
  - 6a3. 統一タイミングでの一斉配信を実行
  - 6a4. チャネル別到達状況・エンゲージメントを並行監視
  - 6a5. 基本フロー7に続行

### 代替フロー3: インタラクティブ配信セッション
- **分岐点**: ステップ8（補足・質疑対応）
- **条件**: ライブセッション・説明会が計画されている場合
- **処理**:
  - 8a1. システムがライブセッション（オンライン説明会）をスケジュール
  - 8a2. 知識共有者がリアルタイム説明・デモンストレーションを実施
  - 8a3. 参加者がライブ質疑・ディスカッションに参加
  - 8a4. セッション内容を録画・議事録として追加配信
  - 8a5. 基本フロー9に続行

## 例外フロー

### 例外1: 配信チャネル障害
- **発生点**: ステップ6（知識配信）
- **処理**:
  - 6e1. システムが配信チャネルの障害を即座検知・記録
  - 6e2. 利用可能な代替チャネルでの緊急配信を実行
  - 6e3. 影響を受けた対象者の特定と個別フォローアップ実施
  - 6e4. 障害復旧後の自動再配信スケジューリング
  - 6e5. 障害影響の最小化確認後、基本フロー7に続行

### 例外2: 大量配信拒否・未到達
- **発生点**: ステップ7（配信状況監視）
- **処理**:
  - 7e1. システムが配信拒否・未到達の異常な増加を検知
  - 7e2. 配信内容・方法・タイミングの問題分析実施
  - 7e3. ナレッジマネージャーへの緊急アラート・対策協議
  - 7e4. 配信戦略の緊急修正・代替手法の検討
  - 7e5. 改善された配信方法での再実行

### 例外3: 知識理解困難・否定的反応
- **発生点**: ステップ9（初期反応記録）
- **処理**:
  - 9e1. システムが理解困難・否定的反応の急増を検知
  - 9e2. 知識共有者による追加説明・補足資料の緊急準備
  - 9e3. 理解支援のための個別フォローアップ・Q&Aセッション開催
  - 9e4. 知識内容の改善・カスタマイズの検討
  - 9e5. 理解改善確認後、基本フロー10に続行

## 特別要件

### 配信品質要件
- **到達率**: 配信対象者の95%以上への確実な到達
- **配信速度**: 全対象者への配信完了2時間以内
- **配信精度**: 対象者・内容・タイミングの100%正確性
- **可用性**: 配信システムの99.5%以上の稼働率確保

### パフォーマンス要件
- **配信準備**: チャネル設定完了5分以内
- **コンテンツ最適化**: 各チャネル用変換1分以内
- **配信実行**: 100名規模配信10分以内、全社規模配信1時間以内
- **状況監視**: リアルタイム配信状況更新（30秒間隔）

### 品質要件
- **配信一貫性**: 全チャネルでの内容・メッセージの統一性
- **個人化**: 受信者属性に応じた適切なカスタマイズ
- **追跡可能性**: 全配信プロセスの詳細ログ・監査証跡
- **フィードバック**: 受信者反応の迅速な収集・対応

## 入出力仕様

### 入力（共有戦略からの引継ぎ）
```json
{
  "distributionPlan": {
    "strategyId": "UUID",
    "knowledgeId": "UUID",
    "approvedStrategy": {
      "targetGroups": [
        {
          "groupId": "consulting-dept",
          "memberCount": 60,
          "priority": "high",
          "customization": "technical-focus"
        }
      ],
      "distributionChannels": [
        {
          "channelType": "email_newsletter",
          "scheduledTime": "2024-10-25T09:00:00Z",
          "expectedReach": 115
        },
        {
          "channelType": "knowledge_portal",
          "scheduledTime": "immediate",
          "expectedReach": 250
        }
      ],
      "phaseSchedule": {
        "totalPhases": 2,
        "currentPhase": 1,
        "phaseDetails": [
          {
            "phase": 1,
            "duration": "1 week",
            "targets": ["consulting", "pm"],
            "methods": ["email", "team_meeting"]
          }
        ]
      }
    }
  }
}
```

### 出力（API → フロントエンド）
```json
{
  "result": "success|partial_failure|distribution_failed",
  "distributionExecution": {
    "executionId": "UUID",
    "status": "completed",
    "executionSummary": {
      "totalTargets": 115,
      "successfulDeliveries": 112,
      "failedDeliveries": 3,
      "overallSuccessRate": 0.974,
      "executionDuration": "1.5 hours"
    },
    "channelResults": [
      {
        "channel": "email_newsletter",
        "status": "completed",
        "metrics": {
          "sent": 115,
          "delivered": 113,
          "opened": 89,
          "clickedThrough": 67,
          "deliveryRate": 0.983,
          "openRate": 0.788,
          "engagementRate": 0.593
        }
      },
      {
        "channel": "knowledge_portal",
        "status": "completed",
        "metrics": {
          "published": true,
          "views": 156,
          "uniqueVisitors": 98,
          "avgTimeOnPage": "4.2 minutes",
          "downloadCount": 23
        }
      }
    ],
    "audienceEngagement": {
      "byGroup": [
        {
          "groupId": "consulting-dept",
          "engagementScore": 4.2,
          "initialFeedback": "positive",
          "questionCount": 8,
          "participationRate": 0.85
        }
      ],
      "overallSentiment": "positive",
      "immediateQuestions": 12,
      "requestForClarification": 4
    }
  },
  "distributionInsights": {
    "effectiveChannels": [
      {
        "channel": "email_newsletter",
        "effectiveness": "high",
        "reason": "高い開封率とクリック率"
      }
    ],
    "audienceReactions": [
      {
        "reaction": "enthusiastic_adoption",
        "percentage": 0.65,
        "description": "積極的な学習意欲を示すグループ"
      },
      {
        "reaction": "cautious_interest",
        "percentage": 0.25,
        "description": "関心はあるが慎重なアプローチを取るグループ"
      }
    ],
    "optimizationRecommendations": [
      {
        "area": "配信タイミング",
        "recommendation": "火曜日午前の配信が最も効果的",
        "evidenceBasis": "開封率データ分析結果"
      }
    ]
  },
  "nextStepPreparation": {
    "readyForMeasurement": true,
    "measurementStartDate": "2024-10-28T00:00:00Z",
    "baselineDataCollection": {
      "completed": true,
      "metrics": ["engagement", "comprehension", "application_intent"]
    },
    "followUpSchedule": [
      {
        "activity": "initial_feedback_collection",
        "scheduledDate": "2024-10-26T00:00:00Z"
      },
      {
        "activity": "effectiveness_measurement",
        "scheduledDate": "2024-11-01T00:00:00Z"
      }
    ]
  }
}
```

### 配信実行レポート
```json
{
  "executionReport": {
    "executiveSummary": {
      "distributionSuccess": "97.4%",
      "audienceReaction": "predominantly positive",
      "keyAchievements": [
        "113/115対象者への確実配信",
        "平均エンゲージメント率59%",
        "即座の質問・関心12件"
      ],
      "criticalInsights": [
        "コンサルティング部門での特に高い関心",
        "技術的詳細への追加説明要求"
      ]
    },
    "detailedMetrics": {
      "reachMetrics": {
        "totalReach": 112,
        "uniqueEngagement": 89,
        "deepEngagement": 67,
        "conversionToAction": 23
      },
      "timelineAnalysis": {
        "immediateResponse": "0-2 hours: 45%反応",
        "earlyAdopters": "2-24 hours: 78%到達",
        "fullPenetration": "24-48 hours: 97%完了"
      }
    },
    "qualitativeAnalysis": {
      "positiveIndicators": [
        "具体的な適用計画の質問",
        "チーム内での知識共有開始",
        "類似課題での活用検討"
      ],
      "concernsIdentified": [
        "一部手順の詳細化要求",
        "チーム適用時のカスタマイズ相談"
      ],
      "improvementOpportunities": [
        "説明資料の補強",
        "個別相談セッションの追加"
      ]
    }
  }
}
```

## 配信最適化アルゴリズム

### チャネル効果最適化
```json
{
  "channelOptimization": {
    "emailOptimization": {
      "subjectLineScore": "緊急度(0.3) + 関連性(0.4) + 具体性(0.3)",
      "timingScore": "受信可能性(0.4) + 競合少なさ(0.3) + 緊急性(0.3)",
      "contentScore": "理解しやすさ(0.35) + 実用性(0.35) + 行動促進(0.30)"
    },
    "portalOptimization": {
      "visibilityScore": "配置位置(0.4) + カテゴリ関連性(0.3) + 検索性(0.3)",
      "accessibilityScore": "ナビゲーション(0.4) + 権限適合(0.3) + 読み込み速度(0.3)"
    },
    "meetingOptimization": {
      "engagementScore": "関心度(0.4) + 参加可能性(0.3) + 議論促進(0.3)",
      "effectivenessScore": "理解度向上(0.4) + 質疑活発さ(0.3) + 行動計画(0.3)"
    }
  }
}
```

### 受信者適合度分析
```json
{
  "audienceMatching": {
    "contentRelevanceScore": "業務関連性(0.4) + スキル適合(0.3) + 緊急性(0.3)",
    "engagementPrediction": "過去反応率(0.3) + 現在関心度(0.4) + 利用可能時間(0.3)",
    "adoptionLikelihood": "学習意欲(0.3) + 活用環境(0.4) + 支援体制(0.3)"
  }
}
```

## 配信パターンライブラリ

### 高効果配信パターン
```
【専門知識集中配信】
- 対象: 専門性の高い部門・チーム
- 方法: 詳細メール + 専門ポータル + 説明セッション
- タイミング: 業務開始時間 + 十分な理解時間確保

【広範囲意識向上配信】
- 対象: 全社・大規模グループ
- 方法: 概要メール + ポータル掲載 + SNS拡散
- タイミング: 週初め + リマインダー配信

【プロジェクト連動配信】
- 対象: 特定プロジェクトチーム
- 方法: プロジェクト会議 + 専用チャネル + 実践支援
- タイミング: プロジェクト節目 + 実践直前
```

### 配信効果最大化戦略
```
【段階的浸透戦略】
Phase 1: 関心喚起（概要・価値の伝達）
Phase 2: 理解促進（詳細・手順の説明）
Phase 3: 実践支援（適用・活用の支援）

【マルチタッチポイント戦略】
Touch 1: 初回認知（メール・通知）
Touch 2: 詳細理解（ポータル・資料）
Touch 3: 実践準備（説明・Q&A）
Touch 4: 適用支援（フォローアップ）
```

## 関連ユースケース
- **UC-SHARE-01**: 共有戦略を策定する（前のステップ）
- **UC-SHARE-03**: 共有効果を測定・改善する（次のステップ）
- **UC-COMM-01〜03**: コミュニケーション促進（配信チャネル連携）
- **UC-APPLY-01**: 活用文脈を特定する（配信後の知識活用開始）

---
*このユースケースは、策定された共有戦略を効果的に実行し、知識の確実な組織内流通を実現する、パラソル設計v2.0仕様に基づく知識配信の中核機能です*