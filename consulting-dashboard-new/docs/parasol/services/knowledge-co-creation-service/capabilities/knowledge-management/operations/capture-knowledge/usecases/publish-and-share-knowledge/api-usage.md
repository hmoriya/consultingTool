# API利用仕様: 知識を公開・共有する

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 知識公開API | POST /api/knowledge-co-creation/publication/publish | 検証済み知識の組織内外への公開 | `knowledgeId`, `publicationScope`, `accessRules`, `publicationDate` |
| 知識共有API | POST /api/knowledge-co-creation/publication/share | 特定チーム・グループとの知識共有 | `knowledgeId`, `shareTargets`, `sharePermissions`, `expirationDate` |
| アクセス制御API | PUT /api/knowledge-co-creation/knowledge/{id}/access-control | 知識へのアクセス権限管理 | `knowledgeId`, `accessRules`, `inheritanceRules` |
| 公開統計API | GET /api/knowledge-co-creation/analytics/{knowledgeId} | 公開知識の利用統計・効果測定 | `knowledgeId`, `metricsType`, `dateRange` |
| コラボレーションセッションAPI | POST /api/knowledge-co-creation/collaboration/sessions | リアルタイム協調編集セッション作成 | `knowledgeId`, `participants`, `sessionType`, `permissions` |
| フィードバック収集API | POST /api/knowledge-co-creation/collaboration/feedback | 公開知識へのフィードバック・評価収集 | `knowledgeId`, `feedbackType`, `rating`, `comments` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | 公開プロセス開始時 | 認証トークン取得・公開権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | 知識公開・共有前 | publish/share権限の確認 |
| collaboration-facilitation-service | UC-COMM-01: 重要通知を配信する | 知識公開・共有時 | 対象者への公開・共有通知 |
| collaboration-facilitation-service | UC-COMM-02: 協調空間を提供する | リアルタイム編集時 | 協調編集環境の提供 |
| collaboration-facilitation-service | UC-COMM-03: フィードバックを収集する | 公開後の評価時 | フィードバック・評価の収集 |
| project-success-service | UC-PROJECT-09: 知識をプロジェクトに関連付ける | プロジェクト知識公開時 | プロジェクト成果物としての公開 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | 公開・アクセス時 | 知識公開・利用の監査記録 |

## API呼び出しシーケンス

### 基本フロー: 組織知識公開

1. **事前認証・権限確認**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - ユーザー認証と知識公開権限の確認

2. **公開前品質確認**:
   - 知識品質スコア・検証状況の最終確認
   - 公開適性の判定（品質閾値・コンプライアンス）

3. **アクセス制御設定**:
   - `PUT /api/knowledge-co-creation/knowledge/{id}/access-control` (自サービス)
   - 公開範囲・アクセス権限の詳細設定

4. **知識公開実行**:
   - `POST /api/knowledge-co-creation/publication/publish` (自サービス)
   - 組織内外への知識公開実行

5. **プロジェクト関連付け** (プロジェクト知識の場合):
   - `POST /api/projects/usecases/link-knowledge-to-project` (project-success-service UC-PROJECT-09)
   - プロジェクト成果物としての正式関連付け

6. **公開通知配信**:
   - `POST /api/communications/usecases/send-priority-notification` (collaboration-facilitation-service UC-COMM-01)
   - 関係者・対象読者への公開通知配信

7. **協調空間提供** (協調編集の場合):
   - `POST /api/communications/usecases/create-collaboration-space` (collaboration-facilitation-service UC-COMM-02)
   - リアルタイム協調編集環境の提供

8. **監査ログ記録**:
   - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
   - 知識公開の完全監査記録

### 代替フロー: 限定共有・段階公開

1. **限定共有**: 特定チーム・部門での限定共有
2. **段階的公開**: パイロットグループでの検証後の全社公開
3. **条件付き公開**: 利用者の権限・役割に応じた段階的アクセス

### WebSocketリアルタイム更新

1. **協調編集**: `wss://api.../ws/knowledge-co-creation/collaboration/{sessionId}`
2. **フィードバック**: `wss://api.../ws/knowledge-co-creation/feedback/{knowledgeId}`
3. **利用統計**: `wss://api.../ws/knowledge-co-creation/analytics/{knowledgeId}`

## エラーハンドリング

### 公開権限エラー
- **INSUFFICIENT_PUBLISH_PERMISSION**: 公開権限不足時の権限申請ガイド
- **COMPLIANCE_VIOLATION**: コンプライアンス違反時の修正ガイダンス
- **QUALITY_THRESHOLD_NOT_MET**: 品質基準未達時の改善提案

### アクセス制御エラー
- **ACCESS_RULE_CONFLICT**: アクセスルール競合時の優先度解決
- **INHERITANCE_ERROR**: 権限継承エラー時の手動設定フォールバック
- **EXTERNAL_AUTH_FAILURE**: 外部認証失敗時の内部権限による制限公開

### 協調編集エラー
- **SESSION_CREATION_FAILED**: セッション作成失敗時の代替協調方式
- **SYNC_CONFLICT**: 同期競合時の自動・手動競合解決
- **PARTICIPANT_LIMIT_EXCEEDED**: 参加者数上限時の待機列・分割セッション

### 通知配信エラー
- **NOTIFICATION_DELIVERY_FAILED**: 通知配信失敗時の代替配信手段
- **RECIPIENT_UNAVAILABLE**: 受信者不在時の配信保留・再試行
- **NOTIFICATION_RATE_LIMIT**: 通知頻度制限時の優先度配信

### リトライ・復旧戦略
- **公開処理**: 3回まで自動リトライ（段階的権限降格含む）
- **通知配信**: 24時間以内の配信再試行
- **協調セッション**: 接続失敗時の自動再接続（10回まで）

## 公開・共有パターン

### 公開範囲レベル
1. **内部限定**: 組織内部のみ（社員・契約者）
2. **パートナー共有**: 信頼できるパートナー組織との共有
3. **業界公開**: 業界コミュニティへの公開
4. **完全公開**: 一般公開（オープンナレッジ）

### アクセス制御マトリックス
```json
{
  "publicationLevel": "internal",
  "accessRules": {
    "read": ["employee", "contractor"],
    "comment": ["employee"],
    "edit": ["author", "reviewer", "admin"],
    "share": ["manager", "admin"],
    "download": ["employee"],
    "print": ["manager", "admin"]
  },
  "exceptions": {
    "confidential_sections": {
      "access": ["senior_manager", "admin"],
      "watermark": true,
      "tracking": true
    }
  }
}
```

### 協調編集権限
- **読み取り専用**: 内容確認・コメント可能
- **提案編集**: 変更提案・承認フロー
- **直接編集**: リアルタイム協調編集
- **管理者編集**: 構造変更・メタデータ編集

## 利用統計・効果測定

### 利用メトリクス
```json
{
  "accessMetrics": {
    "viewCount": 1234,
    "uniqueViewers": 456,
    "downloadCount": 89,
    "shareCount": 23,
    "averageReadTime": "8m 32s",
    "completionRate": 0.73
  },
  "engagementMetrics": {
    "commentCount": 45,
    "ratingAverage": 4.3,
    "feedbackCount": 28,
    "citationCount": 12,
    "referenceCount": 8
  },
  "businessMetrics": {
    "applicationCount": 15,
    "problemSolutionCount": 7,
    "costSavingEstimate": "$12,500",
    "timeReductionEstimate": "45 hours",
    "qualityImprovementScore": 0.23
  }
}
```

### ROI測定
- **直接効果**: 作業時間短縮・品質向上・エラー削減
- **間接効果**: 学習促進・イノベーション創出・組織能力向上
- **長期効果**: 組織知識資産価値・競争優位性向上

## 品質フィードバックループ

### フィードバック収集
- **利用者評価**: 5段階評価・詳細コメント
- **適用結果**: 実際の適用・活用結果報告
- **改善提案**: 具体的な改善・拡張提案

### フィードバック活用
- **知識改善**: フィードバックに基づく知識更新
- **関連知識**: 関連・補完知識の作成提案
- **活用支援**: より効果的な活用方法の提案

## パフォーマンス最適化

### 公開処理最適化
- **段階的公開**: 対象範囲の段階的拡大
- **キャッシュ戦略**: 頻繁アクセス知識のキャッシング
- **CDN活用**: グローバル配信の高速化

### 協調編集最適化
- **差分同期**: 変更差分のみの効率的同期
- **競合予測**: AI予測による競合事前回避
- **負荷分散**: 参加者数に応じた負荷分散

### 通知最適化
- **優先度制御**: 重要度に応じた通知優先度制御
- **配信最適化**: 受信者の嗜好・状況に応じた配信最適化
- **バッチ処理**: 効率的な一括通知配信

## セキュリティ・コンプライアンス

### データ保護
- **暗号化**: 機密知識の保存・転送時暗号化
- **透かし**: 印刷・ダウンロード時の透かし挿入
- **追跡**: アクセス・利用の完全追跡

### 法的コンプライアンス
- **GDPR**: 個人データ保護・削除権対応
- **業界規制**: 業界固有規制への準拠
- **輸出管理**: 技術輸出管理規制への対応

### 監査・ガバナンス
- **アクセス監査**: 全アクセス・操作の監査ログ
- **権限レビュー**: 定期的なアクセス権限レビュー
- **コンプライアンス報告**: 定期的なコンプライアンス状況報告

## レスポンス時間目標
- **知識公開**: 95%ile < 10秒、99%ile < 30秒
- **アクセス制御設定**: 95%ile < 5秒、99%ile < 15秒
- **協調セッション作成**: 95%ile < 3秒、99%ile < 10秒
- **通知配信**: 95%ile < 5秒、99%ile < 15秒
- **利用統計取得**: 95%ile < 2秒、99%ile < 5秒
- **フィードバック収集**: 95%ile < 3秒、99%ile < 10秒