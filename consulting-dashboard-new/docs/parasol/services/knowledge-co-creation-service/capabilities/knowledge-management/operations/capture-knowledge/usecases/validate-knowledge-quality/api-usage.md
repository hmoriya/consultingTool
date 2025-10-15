# API利用仕様: 知識品質を検証する

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 品質検証開始API | POST /api/knowledge-co-creation/processing/validate | AI+専門家による知識品質検証開始 | `knowledgeId`, `validationCriteria`, `validatorType` |
| 検証進捗監視API | GET /api/knowledge-co-creation/processing/{jobId}/progress | 品質検証プロセスの進捗確認 | `jobId`, `includeIntermediate` |
| 検証結果取得API | GET /api/knowledge-co-creation/processing/{jobId}/results | 品質検証結果と改善提案の取得 | `jobId`, `includeRecommendations` |
| 品質スコア算出API | POST /api/knowledge-co-creation/knowledge/{id}/quality-score | 知識の品質スコア算出 | `knowledgeId`, `scoringModel`, `weightings` |
| 改善提案適用API | PUT /api/knowledge-co-creation/knowledge/{id}/apply-improvements | 品質改善提案の適用 | `knowledgeId`, `improvements`, `validateAfter` |
| 品質履歴取得API | GET /api/knowledge-co-creation/knowledge/{id}/quality-history | 知識品質の変更履歴確認 | `knowledgeId`, `dateRange`, `includeDetails` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | 検証プロセス開始時 | 認証トークン取得・検証権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | 品質検証・更新前 | validate/update権限の確認 |
| collaboration-facilitation-service | UC-COLLAB-10: 専門家セッションを作成する | 専門家検証セッション時 | 専門家による協調品質評価 |
| collaboration-facilitation-service | UC-COLLAB-04: 通知を配信する | 検証完了・品質問題時 | 関係者への品質状況通知 |
| project-success-service | UC-PROJECT-05: プロジェクト文脈を取得する | 文脈的品質評価時 | プロジェクト要求基準の取得 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | 品質検証完了時 | 品質検証の監査ログ記録 |

## API呼び出しシーケンス

### 基本フロー: 包括的品質検証

1. **事前認証・権限確認**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - ユーザー認証と品質検証権限の確認

2. **プロジェクト文脈取得**:
   - `GET /api/projects/usecases/get-project-context` (project-success-service UC-PROJECT-05)
   - プロジェクト固有の品質基準・要求仕様の取得

3. **品質検証開始**:
   - `POST /api/knowledge-co-creation/processing/validate` (自サービス)
   - AI+ルールベース品質検証プロセスの開始

4. **検証進捗監視**:
   - `GET /api/knowledge-co-creation/processing/{jobId}/progress` (自サービス)
   - リアルタイム検証進捗の監視（WebSocket接続）

5. **専門家協調検証** (高度なケース):
   - `POST /api/collaboration/usecases/create-expert-session` (collaboration-facilitation-service UC-COLLAB-10)
   - 複数専門家による協調品質評価セッション

6. **品質スコア算出**:
   - `POST /api/knowledge-co-creation/knowledge/{id}/quality-score` (自サービス)
   - 多次元品質スコアの定量的算出

7. **検証結果取得・分析**:
   - `GET /api/knowledge-co-creation/processing/{jobId}/results` (自サービス)
   - 品質問題の詳細分析と改善提案取得

8. **品質改善適用** (必要に応じて):
   - `PUT /api/knowledge-co-creation/knowledge/{id}/apply-improvements` (自サービス)
   - AI提案による自動品質改善の適用

9. **品質状況通知**:
   - `POST /api/collaboration/usecases/send-notification` (collaboration-facilitation-service UC-COLLAB-04)
   - 関係者への品質検証結果通知

10. **監査ログ記録**:
    - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
    - 品質検証プロセスの完全監査記録

### 代替フロー: 段階的品質改善

1. **品質履歴分析**: 過去の品質変遷パターン分析
2. **比較検証**: 類似知識との品質比較分析
3. **反復改善**: 品質フィードバックに基づく反復改善

### WebSocketリアルタイム更新

1. **検証進捗**: `wss://api.../ws/knowledge-co-creation/validation-results/{sessionId}`
2. **専門家セッション**: `wss://api.../ws/knowledge-co-creation/expert-validation/{sessionId}`
3. **品質スコア**: `wss://api.../ws/knowledge-co-creation/quality-updates/{sessionId}`

## エラーハンドリング

### 検証処理エラー
- **VALIDATION_MODEL_ERROR**: AI検証モデル失敗時の代替モデル切り替え
- **INSUFFICIENT_CONTEXT**: 文脈情報不足時の追加情報要求
- **VALIDATION_TIMEOUT**: 検証タイムアウト時の簡易検証フォールバック

### 専門家セッションエラー
- **EXPERT_UNAVAILABLE**: 専門家不在時の代替専門家招聘
- **SESSION_SYNC_ERROR**: セッション同期エラー時の個別評価集約
- **CONSENSUS_FAILURE**: 専門家合意失敗時の多数決・重み付け判定

### 品質改善エラー
- **IMPROVEMENT_APPLICATION_FAILED**: 改善適用失敗時のロールバック
- **QUALITY_REGRESSION**: 品質劣化検出時の改善取り消し
- **VALIDATION_LOOP**: 検証ループ検出時の手動介入要求

### リトライ・復旧戦略
- **検証処理**: 3回まで自動リトライ（異なる検証モデル使用）
- **専門家セッション**: 24時間以内の再招聘・再評価
- **品質改善**: 失敗時の段階的適用・部分的改善

## 品質検証項目

### 技術的品質
- **正確性**: 事実確認・データ検証・引用確認
- **完全性**: 情報の網羅性・欠損情報の特定
- **一貫性**: 論理的整合性・矛盾検出
- **最新性**: 情報の鮮度・更新必要性

### 構造的品質
- **可読性**: 文章品質・構成の明確性
- **検索性**: メタデータ品質・タグ適切性
- **関連性**: 他知識との関連度・重複確認
- **活用性**: 実用性・適用可能性

### ビジネス品質
- **価値**: ビジネス価値・ROI貢献度
- **適用性**: プロジェクト適用可能性
- **影響度**: 組織への影響範囲
- **戦略適合**: 戦略目標との整合性

## 品質スコアリング

### 多次元品質スコア
```json
{
  "overallScore": 0.85,
  "dimensions": {
    "accuracy": 0.92,
    "completeness": 0.78,
    "consistency": 0.89,
    "currency": 0.71,
    "readability": 0.94,
    "searchability": 0.83,
    "businessValue": 0.88
  },
  "confidence": 0.91,
  "recommendedActions": [
    "update_references_2024",
    "add_missing_examples",
    "improve_metadata"
  ]
}
```

### 品質閾値管理
- **公開許可**: 総合スコア0.80以上
- **改善推奨**: 総合スコア0.60-0.79
- **要再作成**: 総合スコア0.60未満

## パフォーマンス最適化

### 検証処理最適化
- **並行検証**: 複数次元の並行品質検証
- **キャッシュ活用**: 類似知識の検証結果キャッシュ
- **段階的検証**: 重要度に応じた段階的詳細検証

### 専門家効率化
- **専門性マッチング**: 知識内容と専門家の最適マッチング
- **負荷分散**: 専門家の作業負荷均等分散
- **非同期評価**: 専門家の都合に合わせた非同期評価

### リアルタイム処理
- **インクリメンタル検証**: 知識更新時の差分検証
- **プリディクティブ検証**: AI予測による事前品質検証
- **適応学習**: 検証パターンの継続学習・改善

## レスポンス時間目標
- **基本品質検証**: 95%ile < 30秒、99%ile < 2分
- **詳細品質分析**: 95%ile < 5分、99%ile < 15分
- **専門家セッション開始**: 95%ile < 10秒
- **品質スコア算出**: 95%ile < 5秒、99%ile < 15秒
- **改善提案生成**: 95%ile < 1分、99%ile < 3分