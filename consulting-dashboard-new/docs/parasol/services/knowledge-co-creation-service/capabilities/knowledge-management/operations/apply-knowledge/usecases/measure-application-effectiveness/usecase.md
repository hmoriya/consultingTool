# ユースケース: 活用効果を測定・評価する

**バージョン**: 2.0.0
**更新日**: 2025-10-21
**設計方針**: 定量測定・価値評価・継続改善

## 基本情報
- **ユースケースID**: UC-APPLY-04
- **アクター**: ナレッジマネージャー（主アクター）、コンサルタント（副アクター）、システム（評価支援アクター）
- **概要**: 知識適用の効果を多角的に測定・評価し、知識価値の定量化と継続的改善に向けた洞察を提供する

## 🏗️ パラソルドメイン連携

### 操作エンティティ
- **EffectivenessMeasurementEntity**（自サービス管理・状態更新: planning → measuring → analyzed → reported）: 効果測定の管理
- **EffectivenessMetricsEntity**（自サービス管理・CRUD）: 測定指標の定義・管理
- **MeasurementResultEntity**（自サービス管理・CRUD）: 測定結果データの記録
- **EvaluationReportEntity**（自サービス管理・CRUD）: 評価レポートの作成・管理
- **KnowledgeApplicationEntity**（参照のみ）: 適用実績データの参照
- **ApplicationContextEntity**（参照のみ）: 適用文脈情報の参照

### 他サービスユースケース利用
- **secure-access-service**: UC-AUTH-01: ユーザー認証を実行する（評価開始時）
- **secure-access-service**: UC-AUTH-02: 権限を検証する（機密評価データアクセス時）
- **collaboration-facilitation-service**: UC-COMM-01: 評価結果を共有する（レポート配信時）
- **collaboration-facilitation-service**: UC-COMM-02: 改善提案を通知する（フィードバック時）
- **project-success-service**: UC-PROJECT-07: プロジェクト成果指標を取得する（効果比較時）
- **productivity-visualization-service**: UC-METRICS-01: 生産性指標を分析する（効率改善測定時）

## 事前条件
- UC-APPLY-03で知識適用が完了し、適用結果が記録されている
- 効果測定に必要な基準データ（適用前状態）が利用可能である
- 測定期間が適切に経過している（最低1週間〜最大3ヶ月）
- 評価に必要な権限とデータアクセス権が確保されている

## 事後条件
### 成功時
- EffectivenessMeasurementEntityが「reported」状態で保存されている
- 定量・定性の両面から効果が評価され、レポートが作成されている
- 知識改善提案が具体的に策定されている
- 評価結果が関係者に共有され、組織学習に貢献している

### 失敗時
- 測定プロセスが「measuring」状態で中断記録されている
- 測定困難な要因分析結果が記録されている
- 代替評価手法の提案が準備されている

## 基本フロー
1. **ナレッジマネージャー**が効果測定計画を策定する
2. **システム**が測定可能指標と基準データを特定する
3. **システム**が定量データを自動収集・分析する
4. **ナレッジマネージャー**が定性評価データを収集する
5. **コンサルタント**が適用体験・学習効果をフィードバックする
6. **システム**が多角的効果分析を実行する
7. **システム**が効果評価レポートを生成する
8. **ナレッジマネージャー**が知識改善提案を策定する
9. **システム**が評価結果を関係者に配信する（他サービス連携）
10. **システム**が評価結果を知識ベースにフィードバックする

## 代替フロー

### 代替フロー1: 段階的効果測定
- **分岐点**: ステップ3（定量データ収集）
- **条件**: 長期的な効果測定が必要な場合
- **処理**:
  - 3a1. システムが測定期間を複数段階に分割
  - 3a2. 短期効果（1-2週間）の初期測定実施
  - 3a3. 中期効果（1-2ヶ月）の中間測定実施
  - 3a4. 長期効果（3-6ヶ月）の最終測定実施
  - 3a5. 各段階の結果を統合分析し、基本フロー6に続行

### 代替フロー2: 比較対照分析
- **分岐点**: ステップ6（多角的効果分析）
- **条件**: 他の解決手法との比較が可能な場合
- **処理**:
  - 6a1. システムが類似課題の他手法適用事例を特定
  - 6a2. 比較対照群との効果差分を定量分析
  - 6a3. 知識適用の相対的優位性を評価
  - 6a4. 比較結果を効果レポートに統合
  - 6a5. 基本フロー7に続行

### 代替フロー3: ステークホルダー別評価
- **分岐点**: ステップ4（定性評価収集）
- **条件**: 多様なステークホルダーの視点が重要な場合
- **処理**:
  - 4a1. 適用者、チームメンバー、クライアント等の評価を個別収集
  - 4a2. ステークホルダー別の満足度・効果認識を分析
  - 4a3. 視点の違いによる効果認識のギャップを特定
  - 4a4. 統合的な効果評価を策定
  - 4a5. 基本フロー5に続行

## 例外フロー

### 例外1: 測定データ不足
- **発生点**: ステップ3（定量データ収集）
- **処理**:
  - 3e1. システムが利用可能データの範囲を確認
  - 3e2. 代替指標による効果推定を提案
  - 3e3. 定性評価を重視した評価手法に切り替え
  - 3e4. データ不足の要因分析と改善提案を記録
  - 3e5. 限定的データでの評価実行、基本フロー4に続行

### 例外2: 効果測定期間不適切
- **発生点**: ステップ2（測定可能指標特定）
- **処理**:
  - 2e1. システムが適用からの経過期間を確認
  - 2e2. 測定期間延長の必要性を判定
  - 2e3. 暫定評価と本評価のスケジュール提案
  - 2e4. 期間不足による評価制限事項を明記
  - 2e5. 利用可能データでの限定評価を実施

### 例外3: 外部要因の影響
- **発生点**: ステップ6（多角的効果分析）
- **処理**:
  - 6e1. システムが同期間の外部変化要因を分析
  - 6e2. 知識適用以外の改善要因を特定・分離
  - 6e3. 純粋な知識適用効果の推定実施
  - 6e4. 外部要因の影響度を評価レポートに明記
  - 6e5. 補正された効果評価で基本フロー7に続行

## 特別要件

### 測定精度要件
- **定量測定精度**: 基準データとの比較で±5%以内の測定精度
- **定性評価信頼性**: 複数評価者による評価の一致率80%以上
- **効果因果関係**: 知識適用との因果関係の信頼度85%以上
- **測定再現性**: 同条件での測定結果の再現性90%以上

### パフォーマンス要件
- **データ収集**: 自動収集処理5分以内
- **分析処理**: 効果分析完了10分以内
- **レポート生成**: 評価レポート作成3分以内
- **配信処理**: 結果共有完了2分以内

### 品質要件
- **評価網羅性**: 定量・定性・多面的評価の包括実施
- **評価客観性**: バイアス排除と中立的評価の実現
- **改善提案**: 具体的・実行可能な改善提案の策定
- **学習促進**: 組織学習に資する洞察の提供

## 入出力仕様

### 入力（前ステップからの引継ぎ）
```json
{
  "applicationData": {
    "applicationId": "UUID",
    "knowledgeId": "UUID",
    "applicationContext": {
      "problemStatement": "構造化された課題定義",
      "targetOutcome": "期待する成果",
      "successMetrics": ["定量指標1", "定性指標2"]
    },
    "executionResults": {
      "executionDuration": "8 days",
      "tasksCompleted": 5,
      "issuesEncountered": 2,
      "customizationsApplied": 1
    },
    "baselineData": {
      "preApplicationMetrics": {
        "efficiency": 0.65,
        "quality": 0.70,
        "satisfaction": 3.2
      },
      "measurementDate": "2024-09-01T00:00:00Z"
    }
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
      "startDate": "2024-10-01T00:00:00Z",
      "endDate": "2024-10-21T00:00:00Z",
      "duration": "21 days"
    },
    "quantitativeResults": {
      "overallEffectiveness": 0.78,
      "improvementMetrics": {
        "efficiency": {
          "before": 0.65,
          "after": 0.83,
          "improvement": "+27.7%",
          "significance": "high"
        },
        "quality": {
          "before": 0.70,
          "after": 0.89,
          "improvement": "+27.1%",
          "significance": "high"
        },
        "satisfaction": {
          "before": 3.2,
          "after": 4.1,
          "improvement": "+28.1%",
          "significance": "medium"
        }
      },
      "roi": {
        "timeInvestment": "40 hours",
        "timeSaved": "120 hours",
        "roi": 3.0,
        "paybackPeriod": "2 weeks"
      }
    },
    "qualitativeResults": {
      "stakeholderFeedback": {
        "applicatorSatisfaction": 4.3,
        "teamImpact": 4.1,
        "clientValue": 4.0,
        "overallRating": 4.1
      },
      "learningEffects": {
        "skillDevelopment": "significant",
        "knowledgeTransfer": "high",
        "processImprovement": "moderate",
        "culturalImpact": "low"
      }
    }
  },
  "improvementRecommendations": {
    "knowledgeEnhancements": [
      {
        "area": "手順3の詳細化",
        "priority": "high",
        "description": "より具体的な手順説明が必要",
        "estimatedImpact": "20%効果向上"
      }
    ],
    "applicationOptimizations": [
      {
        "area": "チーム準備時間",
        "priority": "medium",
        "description": "事前準備期間の延長推奨",
        "estimatedImpact": "10%効率向上"
      }
    ]
  },
  "organizationalInsights": {
    "bestPractices": [
      "段階的適用アプローチが効果的",
      "チーム協働により効果が増大"
    ],
    "lessonsLearned": [
      "カスタマイズは慎重に実施すべき",
      "定期的な進捗確認が重要"
    ],
    "scalabilityAssessment": {
      "replicability": "high",
      "scalingPotential": "medium",
      "resourceRequirement": "moderate"
    }
  }
}
```

### 評価レポート構造
```json
{
  "evaluationReport": {
    "executiveSummary": {
      "overallScore": 4.1,
      "keyAchievements": ["効率27%向上", "品質27%向上"],
      "criticalInsights": ["段階的適用が成功要因"],
      "recommendation": "他プロジェクトへの適用推奨"
    },
    "detailedAnalysis": {
      "effectivenessBreakdown": {
        "immediateImpact": "短期的に効率向上を実現",
        "mediumTermBenefits": "チーム全体のスキル向上",
        "longTermValue": "組織学習文化の醸成"
      },
      "comparativeAnalysis": {
        "vsBaseline": "+27%平均改善",
        "vsSimilarMethods": "+15%優位性",
        "vsExpectations": "+5%期待値超過"
      }
    },
    "actionableInsights": [
      {
        "insight": "カスタマイズ適用が特に効果的",
        "recommendation": "カスタマイズガイドラインの充実",
        "priority": "high"
      }
    ]
  }
}
```

## 効果測定フレームワーク

### カークパトリックモデル適用
```
Level 1: 反応（Reaction）
- 知識適用者の満足度・感想
- 適用プロセスの使いやすさ評価

Level 2: 学習（Learning）
- 知識・スキルの習得度
- 適用能力の向上度

Level 3: 行動（Behavior）
- 実際の業務での行動変化
- 知識活用頻度の向上

Level 4: 結果（Results）
- ビジネス成果への貢献
- ROI・効率向上の定量化
```

### 効果測定指標体系
```
【定量指標】
- 効率性: 作業時間短縮率、エラー削減率
- 品質: 成果物品質向上率、顧客満足度向上
- 生産性: アウトプット量増加率、付加価値向上

【定性指標】
- 満足度: 適用者・チーム・クライアント満足度
- 学習効果: スキル向上・知識定着度
- 文化的影響: 学習文化・知識共有促進

【経済指標】
- ROI: 投資対効果（時間・コスト）
- ペイバック期間: 投資回収期間
- 機会コスト: 代替手法との比較優位性
```

### 測定タイミング
- **即時測定**: 適用完了直後（満足度・初期効果）
- **短期測定**: 1-2週間後（行動変化・効率改善）
- **中期測定**: 1-2ヶ月後（定着度・品質向上）
- **長期測定**: 3-6ヶ月後（文化的影響・組織学習）

## 関連ユースケース
- **UC-APPLY-03**: 知識を実際に適用する（前のステップ）
- **UC-CAPTURE-04**: 知識を更新・改善する（評価結果のフィードバック）
- **UC-SHARE-03**: 評価結果を組織に共有する（学習促進のため）
- **UC-ANALYZE-01**: 知識活用パターンを分析する（傾向分析のため）

---
*このユースケースは、知識適用の価値を科学的に測定・評価し、継続的な知識改善と組織学習の促進を実現する、パラソル設計v2.0仕様に基づく価値創造の最終段階を担っています*