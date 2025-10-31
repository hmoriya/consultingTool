# ユースケース: 共有効果を測定・改善する

**バージョン**: 2.0.0
**更新日**: 2025-10-21
**設計方針**: 定量評価・価値測定・継続改善

## 基本情報
- **ユースケースID**: UC-SHARE-03
- **アクター**: ナレッジマネージャー（主アクター）、知識共有者（副アクター）、システム（分析支援アクター）
- **概要**: 実行された知識共有の効果を多角的に測定・評価し、定量的な価値創造の証明と継続的改善のための洞察を提供する

## 🏗️ パラソルドメイン連携

### 操作エンティティ
- **SharingEffectivenessEntity**（自サービス管理・状態更新: analyzing → measured → improved → reported）: 共有効果測定の管理
- **EffectivenessMetricsEntity**（自サービス管理・CRUD）: 効果測定指標の定義・管理
- **ImprovementPlanEntity**（自サービス管理・CRUD）: 改善計画の策定・追跡
- **ValueAssessmentEntity**（自サービス管理・CRUD）: 価値評価結果の記録
- **KnowledgeDistributionEntity**（参照のみ）: 配信実績データの参照
- **SharingFeedbackEntity**（参照のみ）: 受信者フィードバックの参照

### 他サービスユースケース利用
- **secure-access-service**: UC-AUTH-01: ユーザー認証を実行する（効果測定開始時）
- **secure-access-service**: UC-AUTH-02: 権限を検証する（機密評価データアクセス時）
- **collaboration-facilitation-service**: UC-COMM-01: 改善提案を共有する（レポート配信時）
- **collaboration-facilitation-service**: UC-COMM-02: フィードバックを収集する（追加評価時）
- **project-success-service**: UC-PROJECT-08: プロジェクト成果指標を取得する（効果比較時）
- **productivity-visualization-service**: UC-METRICS-02: 生産性変化を分析する（効率改善測定時）

## 事前条件
- UC-SHARE-02で知識配信が完了している
- 効果測定に必要な基準データ（配信前状態）が利用可能である
- 測定期間が適切に経過している（最低1週間〜最大6ヶ月）
- 効果評価に必要な権限とデータアクセス権が確保されている

## 事後条件
### 成功時
- SharingEffectivenessEntityが「reported」状態で保存されている
- 定量・定性の両面から共有効果が評価され、価値が数値化されている
- 具体的な改善計画が策定され、次回共有への提言が明確化されている
- 評価結果が関係者に共有され、組織学習に貢献している

### 失敗時
- 効果測定プロセスが「analyzing」状態で中断記録されている
- 測定困難な要因分析結果が記録されている
- 代替評価手法の提案が準備されている

## 基本フロー
1. **ナレッジマネージャー**が効果測定計画を策定する
2. **システム**が配信結果と測定可能指標を特定する
3. **システム**が定量データを自動収集・分析する
4. **ナレッジマネージャー**が定性評価データを収集する
5. **知識共有者**が受信者反応・活用状況をフィードバックする
6. **システム**が多角的効果分析を実行する
7. **システム**が ROI・価値創造評価を算出する
8. **ナレッジマネージャー**が改善提案を策定する
9. **システム**が評価結果を関係者に配信する（他サービス連携）
10. **システム**が評価結果を知識ベースと戦略にフィードバックする

## 代替フロー

### 代替フロー1: 長期効果追跡
- **分岐点**: ステップ3（定量データ収集）
- **条件**: 長期的な組織学習効果が重要な場合
- **処理**:
  - 3a1. システムが測定期間を複数段階に分割（短期・中期・長期）
  - 3a2. 短期効果（1-2週間）の初期測定実施
  - 3a3. 中期効果（1-3ヶ月）の定着度測定実施
  - 3a4. 長期効果（3-6ヶ月）の組織変化測定実施
  - 3a5. 各段階の結果を統合分析し、基本フロー6に続行

### 代替フロー2: 比較分析実施
- **分岐点**: ステップ6（多角的効果分析）
- **条件**: 他の手法・過去実績との比較が可能な場合
- **処理**:
  - 6a1. システムが類似知識の過去共有実績を特定
  - 6a2. 他の解決手法との効果比較分析を実施
  - 6a3. 業界標準・ベンチマークとの比較評価
  - 6a4. 相対的優位性・改善余地を評価
  - 6a5. 比較結果を効果レポートに統合し、基本フロー7に続行

### 代替フロー3: 組織学習効果深堀り
- **分岐点**: ステップ5（定性評価収集）
- **条件**: 組織文化・学習慣行への影響が重要な場合
- **処理**:
  - 5a1. 知識受信者・チーム・部門レベルでの学習効果を個別調査
  - 5a2. 知識活用による行動変化・スキル向上の詳細分析
  - 5a3. 組織学習文化への波及効果・二次的影響の評価
  - 5a4. 長期的な組織能力向上への貢献度測定
  - 5a5. 組織学習総合評価で基本フロー6に続行

## 例外フロー

### 例外1: 効果測定データ不足
- **発生点**: ステップ3（定量データ収集）
- **処理**:
  - 3e1. システムが利用可能データの範囲・品質を確認
  - 3e2. 代替指標・推定手法による効果評価を提案
  - 3e3. 定性評価を重視した総合評価手法に切り替え
  - 3e4. データ不足の要因分析と将来改善提案を記録
  - 3e5. 限定的データでの評価実行、基本フロー4に続行

### 例外2: 効果測定期間不適切
- **発生点**: ステップ2（測定可能指標特定）
- **処理**:
  - 2e1. システムが配信からの経過期間・効果発現可能性を確認
  - 2e2. 測定期間延長の必要性・適切なタイミングを判定
  - 2e3. 暫定評価と本格評価のスケジュール提案
  - 2e4. 期間不足による評価制限事項を明記
  - 2e5. 利用可能データでの中間評価を実施

### 例外3: 外部要因による効果阻害
- **発生点**: ステップ6（多角的効果分析）
- **処理**:
  - 6e1. システムが同時期の組織変化・外部要因を分析
  - 6e2. 知識共有以外の影響要因を特定・分離
  - 6e3. 純粋な知識共有効果の推定・補正を実施
  - 6e4. 外部要因の影響度・今後の対処法を評価レポートに明記
  - 6e5. 補正された効果評価で基本フロー7に続行

## 特別要件

### 測定精度要件
- **定量測定精度**: 基準データとの比較で±10%以内の測定精度
- **定性評価信頼性**: 複数評価者による評価の一致率80%以上
- **効果因果関係**: 知識共有との因果関係の信頼度80%以上
- **ROI計算精度**: 投資対効果の算出誤差15%以内

### パフォーマンス要件
- **データ収集**: 自動収集処理10分以内
- **分析処理**: 効果分析完了15分以内
- **レポート生成**: 評価レポート作成5分以内
- **配信処理**: 結果共有完了3分以内

### 品質要件
- **評価網羅性**: 定量・定性・多面的評価の包括実施
- **評価客観性**: バイアス排除と中立的評価の実現
- **改善提案**: 具体的・実行可能な改善提案の策定
- **学習促進**: 組織学習に資する洞察の提供

## 入出力仕様

### 入力（配信実績からの引継ぎ）
```json
{
  "distributionResults": {
    "distributionId": "UUID",
    "knowledgeId": "UUID",
    "executionSummary": {
      "totalTargets": 115,
      "successfulDeliveries": 112,
      "overallSuccessRate": 0.974,
      "executionDuration": "1.5 hours"
    },
    "channelResults": [
      {
        "channel": "email_newsletter",
        "deliveryRate": 0.983,
        "openRate": 0.788,
        "engagementRate": 0.593
      }
    ],
    "audienceEngagement": {
      "overallSentiment": "positive",
      "immediateQuestions": 12,
      "participationRate": 0.85
    }
  },
  "baselineData": {
    "preDistributionMetrics": {
      "knowledgeAwareness": 0.15,
      "skillLevel": 3.2,
      "problemSolvingEfficiency": 0.68
    },
    "measurementDate": "2024-10-01T00:00:00Z"
  }
}
```

### 出力（API → フロントエンド）
```json
{
  "result": "success|insufficient_data|measurement_pending",
  "effectivenessEvaluation": {
    "evaluationId": "UUID",
    "status": "reported",
    "measurementPeriod": {
      "startDate": "2024-10-25T00:00:00Z",
      "endDate": "2024-11-25T00:00:00Z",
      "duration": "31 days",
      "phases": ["immediate", "short_term", "medium_term"]
    },
    "quantitativeResults": {
      "overallEffectiveness": 0.84,
      "knowledgeAdoption": {
        "awarenessIncrease": {
          "before": 0.15,
          "after": 0.89,
          "improvement": "+493%",
          "significance": "very_high"
        },
        "comprehensionRate": {
          "measured": 0.87,
          "target": 0.85,
          "achievement": "102%"
        },
        "applicationIntention": {
          "expressed": 0.73,
          "actualApplication": 0.58,
          "conversionRate": "79%"
        }
      },
      "skillImprovementMetrics": {
        "problemSolvingEfficiency": {
          "before": 0.68,
          "after": 0.91,
          "improvement": "+34%",
          "significance": "high"
        },
        "knowledgeApplicationSpeed": {
          "before": "45 minutes",
          "after": "28 minutes",
          "improvement": "+38%"
        },
        "solutionQuality": {
          "before": 3.2,
          "after": 4.1,
          "improvement": "+28%"
        }
      },
      "organizationalImpact": {
        "teamCollaboration": {
          "knowledgeSharing": "+45%",
          "crossFunctionalWork": "+23%",
          "mentoring": "+67%"
        },
        "processImprovement": {
          "standardization": "+31%",
          "efficiency": "+29%",
          "qualityControl": "+25%"
        }
      },
      "roi": {
        "totalInvestment": "¥250,000",
        "measuredValue": "¥1,450,000",
        "roi": 5.8,
        "paybackPeriod": "4.2 weeks",
        "npv": "¥1,200,000"
      }
    },
    "qualitativeResults": {
      "stakeholderFeedback": {
        "knowledgeRecipients": {
          "satisfaction": 4.3,
          "usability": 4.1,
          "relevance": 4.4,
          "overallValue": 4.3
        },
        "managers": {
          "teamPerformanceImprovement": 4.2,
          "knowledgeApplicationObservation": 4.0,
          "organizationalValue": 4.4
        },
        "clients": {
          "solutionQuality": 4.5,
          "deliverySpeed": 4.2,
          "satisfactionImprovement": 4.3
        }
      },
      "behavioralChanges": {
        "knowledgeSeeking": "significantly_increased",
        "collaborativeApproach": "moderately_increased",
        "innovativeProblemSolving": "significantly_increased",
        "continuousLearning": "moderately_increased"
      },
      "culturalImpact": {
        "learningCulture": "strengthened",
        "knowledgeSharing": "highly_improved",
        "innovationMindset": "moderately_improved",
        "qualityFocus": "improved"
      }
    }
  },
  "improvementRecommendations": {
    "knowledgeEnhancements": [
      {
        "area": "適用事例の充実",
        "priority": "high",
        "description": "より多様な業界・プロジェクト事例の追加",
        "estimatedImpact": "理解度20%向上",
        "implementationEffort": "medium"
      },
      {
        "area": "インタラクティブ要素",
        "priority": "medium",
        "description": "チェックリスト・テンプレートの統合",
        "estimatedImpact": "適用率15%向上",
        "implementationEffort": "low"
      }
    ],
    "distributionOptimizations": [
      {
        "area": "配信タイミング",
        "priority": "high",
        "description": "プロジェクト開始時期に合わせた配信",
        "estimatedImpact": "適用率25%向上",
        "implementationEffort": "low"
      },
      {
        "area": "フォローアップ強化",
        "priority": "medium",
        "description": "配信後2週間時点での活用支援",
        "estimatedImpact": "定着率30%向上",
        "implementationEffort": "medium"
      }
    ],
    "organizationalImprovements": [
      {
        "area": "知識活用インセンティブ",
        "priority": "medium",
        "description": "活用実績の評価・表彰制度導入",
        "estimatedImpact": "活用率40%向上",
        "implementationEffort": "high"
      }
    ]
  },
  "organizationalInsights": {
    "successFactors": [
      "段階的配信により受信者の負担を軽減",
      "実際のプロジェクト課題と知識内容の高い関連性",
      "知識共有者による積極的なフォローアップ",
      "チーム内でのディスカッション促進"
    ],
    "lessonsLearned": [
      "配信タイミングがプロジェクト状況と一致すると効果が最大化",
      "抽象的知識は具体的事例との組み合わせで理解が促進",
      "受信者の主体的参加が知識定着の鍵",
      "継続的フォローアップが長期定着に不可欠"
    ],
    "futureOpportunities": [
      "類似知識の体系的整備による相乗効果",
      "知識活用コミュニティの形成による持続的学習",
      "AI支援による個別最適化配信の導入"
    ],
    "scalabilityAssessment": {
      "replicability": "high",
      "scalingPotential": "high",
      "resourceRequirement": "moderate",
      "riskFactors": ["配信頻度の調整", "品質管理の標準化"]
    }
  }
}
```

### 効果評価レポート構造
```json
{
  "effectivenessReport": {
    "executiveSummary": {
      "overallScore": 4.3,
      "keyAchievements": [
        "知識認知度493%向上",
        "問題解決効率34%改善",
        "ROI 5.8倍達成"
      ],
      "criticalInsights": [
        "段階的配信が成功の主要因",
        "プロジェクト連携により実用性向上"
      ],
      "recommendation": "同手法の他知識への水平展開推奨"
    },
    "detailedAnalysis": {
      "effectivenessBreakdown": {
        "immediateImpact": "配信直後から高い関心と理解を確認",
        "mediumTermBenefits": "1ヶ月後の実際適用で効率改善を実現",
        "longTermValue": "組織学習文化の定着と知識共有促進"
      },
      "comparativeAnalysis": {
        "vsBaseline": "+340%平均改善（過去最高実績）",
        "vsSimilarKnowledge": "+25%優位性",
        "vsExpectations": "+15%期待値超過"
      },
      "valueCreationMetrics": {
        "directValue": "問題解決時間短縮による直接的価値創造",
        "indirectValue": "チーム協調・知識共有文化による間接的価値",
        "futureValue": "組織学習能力向上による将来価値創造"
      }
    },
    "actionableInsights": [
      {
        "insight": "プロジェクト開始タイミングでの配信が特に効果的",
        "recommendation": "プロジェクトカレンダー連携配信システムの構築",
        "priority": "high",
        "estimatedROI": "現行の150%"
      },
      {
        "insight": "チーム内ディスカッションが知識定着を大幅促進",
        "recommendation": "配信後のチーム議論ガイドライン策定",
        "priority": "medium",
        "estimatedROI": "現行の120%"
      }
    ]
  }
}
```

## 効果測定フレームワーク

### カークパトリックモデル拡張適用
```
Level 1: 反応（Reaction）
- 知識配信に対する満足度・感想
- 配信方法・内容の評価
- 初期の関心・意欲レベル

Level 2: 学習（Learning）
- 知識・概念の理解度
- スキル・手法の習得度
- 適用能力の向上度

Level 3: 行動（Behavior）
- 実際の業務での知識活用
- 行動パターンの変化
- 知識適用頻度・質の向上

Level 4: 結果（Results）
- ビジネス成果への貢献
- ROI・効率向上の定量化
- 組織価値創造の測定

Level 5: 組織変革（Organizational Transformation）
- 学習文化の醸成・定着
- 知識共有慣行の組織的改善
- 継続的改善文化の確立
```

### 効果測定指標体系
```
【即時効果指標（配信後1-7日）】
- 到達率・開封率・エンゲージメント率
- 初期理解度・関心度・質問数
- 即座反応・フィードバック内容

【短期効果指標（配信後1-4週間）】
- 知識適用率・活用頻度
- 問題解決効率・品質向上
- スキル向上・行動変化

【中期効果指標（配信後1-3ヶ月）】
- 知識定着度・継続活用率
- チーム全体での活用拡散
- プロセス改善・標準化進展

【長期効果指標（配信後3-6ヶ月）】
- 組織学習文化への影響
- 知識共有慣行の変化
- 継続的改善メカニズムの定着

【経済効果指標】
- ROI・NPV・ペイバック期間
- 時間節約・コスト削減効果
- 品質向上・顧客満足度改善
```

### 測定手法・ツール
```
【定量測定】
- アクセスログ分析（閲覧・滞在・操作パターン）
- アンケート調査（満足度・理解度・適用意向）
- パフォーマンス指標（効率・品質・成果指標）
- 経済指標分析（時間・コスト・収益データ）

【定性測定】
- インタビュー調査（深掘り理解・体験評価）
- フォーカスグループ（集団での意見・体験共有）
- 観察調査（実際の行動・活用場面の観察）
- 事例収集（成功・失敗事例の体系的収集）

【統合分析】
- 相関分析（複数指標間の関係性分析）
- 因果分析（知識共有→成果の因果関係特定）
- 比較分析（他手法・過去実績との比較）
- トレンド分析（時系列での効果変化追跡）
```

## 関連ユースケース
- **UC-SHARE-02**: 知識を組織に配信する（前のステップ）
- **UC-SHARE-04**: 知識コミュニティを育成する（効果を基にした発展）
- **UC-CAPTURE-04**: 知識を更新・改善する（評価結果のフィードバック）
- **UC-APPLY-04**: 活用効果を測定・評価する（知識活用レベルでの評価）

---
*このユースケースは、知識共有の価値を科学的に測定・証明し、継続的改善による組織学習の高度化を実現する、パラソル設計v2.0仕様に基づく価値創造の評価・改善段階を担っています*