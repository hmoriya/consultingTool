# ユースケース: 共有戦略を策定する

**バージョン**: 2.0.0
**更新日**: 2025-10-21
**設計方針**: 戦略的計画・対象最適化・効果最大化

## 基本情報
- **ユースケースID**: UC-SHARE-01
- **アクター**: ナレッジマネージャー（主アクター）、知識共有者（副アクター）、システム（戦略支援アクター）
- **概要**: 蓄積された知識の共有において、最大の組織価値を生むための戦略的計画を策定する

## 🏗️ パラソルドメイン連携

### 操作エンティティ
- **SharingStrategyEntity**（自サービス管理・状態更新: drafting → analyzing → planned → approved）: 共有戦略の計画・管理
- **TargetAnalysisEntity**（自サービス管理・CRUD）: 共有対象者・組織の分析結果
- **ChannelOptimizationEntity**（自サービス管理・CRUD）: 共有チャネルの最適化計画
- **EffectPredictionEntity**（自サービス管理・CRUD）: 期待効果の予測・目標設定
- **KnowledgeEntity**（参照のみ）: 共有対象知識の詳細情報参照
- **OrganizationStructureEntity**（参照のみ）: 組織構造・チーム編成情報の参照

### 他サービスユースケース利用
- **secure-access-service**: UC-AUTH-01: ユーザー認証を実行する（戦略策定開始時）
- **secure-access-service**: UC-AUTH-02: 権限を検証する（機密知識の共有戦略時）
- **project-success-service**: UC-PROJECT-04: プロジェクト状況を取得する（プロジェクト連携戦略時）
- **talent-optimization-service**: UC-TEAM-01: チーム構成を分析する（組織構造分析時）
- **collaboration-facilitation-service**: UC-COMM-04: コミュニケーション履歴を分析する（過去の共有効果分析時）

## 事前条件
- 共有対象の知識が明確に特定されている
- 知識の品質・完成度が共有可能レベルに達している
- ナレッジマネージャーが戦略策定権限を有している
- 組織の基本構造・チーム編成情報が利用可能である

## 事後条件
### 成功時
- SharingStrategyEntityが「approved」状態で保存されている
- 対象者・チャネル・タイミングが明確に定義されている
- 期待効果と成功指標が設定されている
- 次のステップ（知識配信）の実行準備が完了している

### 失敗時
- 戦略策定プロセスが「analyzing」状態で中断記録されている
- 分析困難な要因・制約事項が明確化されている
- 代替戦略アプローチの提案が準備されている

## 基本フロー
1. **ナレッジマネージャー**が共有対象知識を選定・確認する
2. **システム**が知識の特性・価値・適用性を分析する
3. **システム**が組織構造・チーム状況・プロジェクト状況を調査する（他サービス連携）
4. **ナレッジマネージャー**が共有目的・ビジネス価値を明確化する
5. **システム**が最適な対象者・対象範囲を推奨する
6. **ナレッジマネージャー**が共有チャネル（全社・部門・プロジェクト・個別）を選択する
7. **システム**が配信スケジュール・タイミングを最適化提案する
8. **システム**が期待効果・成功指標・ROI予測を算出する
9. **ナレッジマネージャー**が戦略計画を最終確認・承認する
10. **システム**が実行準備（配信プロセス初期化）を完了する

## 代替フロー

### 代替フロー1: マルチステージ戦略
- **分岐点**: ステップ6（チャネル選択）
- **条件**: 大規模組織で段階的展開が有効な場合
- **処理**:
  - 6a1. システムが段階的展開計画（パイロット→部門→全社）を提案
  - 6a2. 各段階の対象者・期間・評価ポイントを定義
  - 6a3. 段階間のフィードバック反映・改善プロセスを設計
  - 6a4. 全段階を通じた効果測定・評価計画を策定
  - 6a5. 基本フロー7に続行

### 代替フロー2: カスタマイズ重視戦略
- **分岐点**: ステップ4（共有目的明確化）
- **条件**: 受信者別のカスタマイズが重要な場合
- **処理**:
  - 4a1. システムが受信者グループの特性・ニーズを詳細分析
  - 4a2. グループ別の知識カスタマイズ要件を特定
  - 4a3. カスタマイズ版知識の作成計画を策定
  - 4a4. グループ別配信・フォローアップ計画を設計
  - 4a5. 基本フロー5に続行

### 代替フロー3: インタラクティブ戦略
- **分岐点**: ステップ7（配信スケジュール最適化）
- **条件**: 双方向コミュニケーションが重要な場合
- **処理**:
  - 7a1. システムがライブセッション・ワークショップ・Q&Aの企画提案
  - 7a2. 知識共有者の参加可能性・スケジュール調整
  - 7a3. インタラクティブセッションの進行計画・資料準備計画
  - 7a4. セッション後のフォローアップ・継続議論計画
  - 7a5. 基本フロー8に続行

## 例外フロー

### 例外1: 対象者分析困難
- **発生点**: ステップ3（組織調査）
- **処理**:
  - 3e1. システムが分析困難要因を特定（データ不足・権限制限等）
  - 3e2. 利用可能情報での限定的分析実施
  - 3e3. 仮定に基づく戦略案作成・リスク明記
  - 3e4. 戦略実行中の情報収集・戦略調整計画策定
  - 3e5. 限定戦略で基本フロー4に続行

### 例外2: 共有制約・機密性問題
- **発生点**: ステップ5（対象者推奨）
- **処理**:
  - 5e1. システムが知識の機密性レベル・アクセス制限を確認
  - 5e2. 共有可能範囲・対象者の制限分析
  - 5e3. 機密性に配慮した代替共有方法の提案
  - 5e4. セキュリティ要件を満たす戦略への修正
  - 5e5. 制限付き戦略で基本フロー6に続行

### 例外3: 期待効果予測困難
- **発生点**: ステップ8（効果・ROI予測）
- **処理**:
  - 8e1. システムが予測困難要因を分析（前例不足・複雑性等）
  - 8e2. 類似事例・部分データでの概算予測実施
  - 8e3. 予測の不確実性・前提条件を明記
  - 8e4. 実行中の効果測定強化・戦略調整計画策定
  - 8e5. 不確実性承知で基本フロー9に続行

## 特別要件

### 戦略精度要件
- **対象適合度**: 推奨対象者の知識適用可能性85%以上
- **効果予測精度**: 実際効果との誤差20%以内
- **実行可能性**: 提案戦略の実行成功率90%以上
- **価値創造性**: 期待ROI 3.0倍以上の戦略策定

### パフォーマンス要件
- **戦略策定時間**: 知識分析完了5分以内
- **組織分析時間**: 対象者分析完了3分以内
- **効果予測時間**: ROI計算完了2分以内
- **戦略保存時間**: 最終承認・保存完了1分以内

### 品質要件
- **戦略包括性**: 対象・チャネル・タイミング・効果の全要素網羅
- **戦略実用性**: 実行可能性・リソース要件の現実的評価
- **戦略柔軟性**: 実行中の調整・改善に対応可能な設計
- **戦略持続性**: 継続的改善・発展に対応する仕組み

## 入出力仕様

### 入力（知識蓄積からの引継ぎ）
```json
{
  "knowledgeData": {
    "knowledgeId": "UUID",
    "title": "プロジェクト課題解決手法v3.2",
    "category": "問題解決・分析",
    "complexity": "intermediate",
    "applicability": {
      "targetProjects": ["type-A", "type-B"],
      "requiredSkills": ["分析力", "課題定義"],
      "prerequisites": ["基本的なプロジェクト経験"]
    },
    "businessValue": {
      "problemSolving": "high",
      "efficiency": "medium",
      "qualityImprovement": "high"
    }
  },
  "organizationContext": {
    "totalMembers": 250,
    "activeProjects": 15,
    "teamStructure": {
      "consulting": 80,
      "analysts": 45,
      "pm": 25,
      "support": 100
    }
  }
}
```

### 出力（API → フロントエンド）
```json
{
  "result": "success|insufficient_data|approval_pending",
  "sharingStrategy": {
    "strategyId": "UUID",
    "status": "approved",
    "objectives": {
      "primary": "プロジェクト問題解決能力の全社向上",
      "secondary": ["効率化促進", "品質向上", "ノウハウ蓄積"],
      "businessImpact": "プロジェクト成功率向上・期間短縮・品質向上"
    },
    "targetAnalysis": {
      "primaryTargets": {
        "consulting": {
          "count": 60,
          "applicability": 0.95,
          "priority": "high"
        },
        "analysts": {
          "count": 35,
          "applicability": 0.85,
          "priority": "medium"
        },
        "pm": {
          "count": 20,
          "applicability": 0.90,
          "priority": "high"
        }
      },
      "totalReach": 115,
      "estimatedEngagement": 0.80
    },
    "distributionPlan": {
      "channels": [
        {
          "type": "email_newsletter",
          "reach": 115,
          "timing": "weekly_newsletter"
        },
        {
          "type": "knowledge_portal",
          "reach": 250,
          "timing": "immediate"
        },
        {
          "type": "team_meeting",
          "reach": 60,
          "timing": "next_team_meeting"
        }
      ],
      "schedule": {
        "startDate": "2024-10-25T09:00:00Z",
        "phases": [
          {
            "phase": "initial_distribution",
            "duration": "1 week",
            "targets": ["consulting", "pm"]
          },
          {
            "phase": "broader_distribution",
            "duration": "2 weeks",
            "targets": ["analysts", "support"]
          }
        ]
      }
    },
    "effectPrediction": {
      "expectedOutcomes": {
        "knowledgeAdoption": {
          "rate": 0.75,
          "timeline": "4 weeks"
        },
        "practicalApplication": {
          "rate": 0.60,
          "timeline": "8 weeks"
        },
        "organizationalLearning": {
          "improvement": "25%",
          "metrics": ["問題解決速度", "解決品質", "チーム協調"]
        }
      },
      "roi": {
        "timeInvestment": "40 hours",
        "expectedTimeSavings": "200 hours",
        "roi": 5.0,
        "paybackPeriod": "6 weeks"
      },
      "riskFactors": [
        {
          "risk": "知識複雑性による理解困難",
          "probability": "medium",
          "mitigation": "補足説明資料・Q&Aセッション追加"
        }
      ]
    }
  },
  "implementationReadiness": {
    "readyForDistribution": true,
    "nextStep": "UC-SHARE-02",
    "requiredResources": {
      "personnel": ["ナレッジマネージャー1名", "知識共有者1名"],
      "timeCommitment": "週3時間×4週間",
      "technicalRequirements": ["配信システム", "効果測定ツール"]
    }
  }
}
```

### 戦略最適化アルゴリズム
```json
{
  "strategyOptimization": {
    "targetSelectionScore": "適用可能性(0.4) + 学習意欲(0.3) + 影響度(0.3)",
    "channelEffectivenessScore": "到達率(0.3) + 理解促進(0.3) + エンゲージメント(0.4)",
    "timingOptimizationScore": "受信可能性(0.4) + 競合情報(0.3) + 緊急性(0.3)",
    "overallStrategyScore": "ターゲット(0.35) + チャネル(0.35) + タイミング(0.30)"
  }
}
```

## 戦略策定フレームワーク

### SMART目標設定
```
Specific（具体的）: 対象者・内容・期待成果の明確化
Measurable（測定可能）: 到達率・理解度・活用率の定量指標
Achievable（達成可能）: 組織リソース・能力に見合う現実的目標
Relevant（関連性）: ビジネス価値・組織戦略との整合性
Time-bound（期限設定）: 配信・浸透・効果発現の具体的タイムライン
```

### 3C分析適用
```
Company（自社）: 知識の価値・組織の能力・リソース制約
Competitor（競合）: 他の解決手法・情報源との差別化
Customer（顧客）: 知識受信者のニーズ・期待・制約
```

### PDCA戦略サイクル
```
Plan（計画）: 本ユースケースでの戦略策定
Do（実行）: UC-SHARE-02での知識配信実行
Check（評価）: UC-SHARE-03での効果測定・評価
Act（改善）: 戦略・知識・プロセスの継続的改善
```

## 関連ユースケース
- **UC-CAPTURE-04**: 知識を更新・改善する（戦略策定前の知識品質確保）
- **UC-SHARE-02**: 知識を組織に配信する（次のステップ）
- **UC-SHARE-03**: 共有効果を測定・改善する（戦略効果の検証）
- **UC-APPLY-01**: 活用文脈を特定する（共有された知識の活用開始）

---
*このユースケースは、知識共有の成功を決定づける戦略的計画段階であり、組織価値最大化を実現するパラソル設計v2.0仕様に基づく知識流通の起点となる重要な機能です*