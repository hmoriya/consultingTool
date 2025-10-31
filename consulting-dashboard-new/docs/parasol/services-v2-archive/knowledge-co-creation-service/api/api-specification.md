# API仕様: Knowledge Co-Creation Service

## 🏗️ パラソルドメイン連携API設計

### 📊 操作エンティティと状態管理（サービス統合）
**自サービス管理エンティティ**:
- **Knowledge**: 知識情報（状態更新: draft → processing → validated → published → archived）
- **KnowledgeExtraction**: 抽出情報（状態更新: planned → extracting → extracted → validated）
- **QualityValidation**: 品質検証（状態更新: pending → analyzing → reviewed → approved）
- **KnowledgeClassification**: 分類情報（状態更新: unclassified → analyzing → classified → validated）
- **KnowledgePublication**: 公開情報（状態更新: draft → review → scheduled → published → archived）

### 🎯 パラソル集約設計（サービス統合）
**KnowledgeCapture集約 - 知識収集統合管理**:
- 集約ルート: Knowledge
- 包含エンティティ: KnowledgeContent, ExtractionSession, ValidationResult, ClassificationInfo, PublicationSettings
- 不変条件: 知識は適切な品質検証と分類を経て公開される

### 🔗 他サービスユースケース利用（ユースケース呼び出し型）
**責務**: ❌ エンティティ知識不要 ✅ ユースケース利用のみ

[secure-access-service] ユースケース利用:
├── UC-AUTH-01: ユーザー認証を実行する → POST /api/auth/usecases/authenticate
├── UC-AUTH-02: 権限を検証する → POST /api/auth/usecases/validate-permission
└── UC-AUTH-03: アクセスログを記録する → POST /api/auth/usecases/log-access

[collaboration-facilitation-service] ユースケース利用:
├── UC-COLLAB-06: 協調空間を作成する → POST /api/collaboration/usecases/create-collaboration-space
├── UC-COLLAB-10: 専門家セッションを作成する → POST /api/collaboration/usecases/create-expert-session
└── UC-COLLAB-04: 通知を配信する → POST /api/collaboration/usecases/send-notification

[project-success-service] ユースケース利用:
├── UC-PROJECT-05: プロジェクト文脈を取得する → GET /api/projects/usecases/get-project-context
└── UC-PROJECT-09: 知識をプロジェクトに関連付ける → POST /api/projects/usecases/link-knowledge-to-project

### 🧠 ドメインサービス設計（サービス統合）
**KnowledgeCoCreationService（知識共創サービス）**:
- enhance[KnowledgeQuality]() - 知識品質向上・AI学習最適化・専門家協調
- coordinate[ExpertCollaboration]() - 専門家協調・集合知活用・合意形成支援
- strengthen[KnowledgeStructure]() - 知識構造強化・分類体系進化・検索最適化
- amplify[KnowledgeImpact]() - 知識影響拡大・組織学習促進・価値創造最大化

## 📋 基本情報

**サービス名**: knowledge-co-creation-service
**目的**: AI技術と専門家協調による知識の収集・構造化・品質向上・公開・共有の統合プラットフォーム
**バージョン**: v2.0.0
**ベースURL**: `https://api.consulting-dashboard.com/v2`
**認証**: JWT Bearer Token

## 📡 API分類と構造

### 1. 🔧 基本管理API（CRUD）
知識の基本的な作成・読み取り・更新・削除とメタデータ管理

#### 詳細仕様
- **参照**: [endpoints/knowledge-crud.md]
- **主要エンドポイント**:
  - `POST /api/knowledge-co-creation/knowledge` - 知識作成
  - `GET /api/knowledge-co-creation/knowledge/{id}` - 知識詳細取得
  - `PUT /api/knowledge-co-creation/knowledge/{id}` - 知識更新
  - `DELETE /api/knowledge-co-creation/knowledge/{id}` - 知識削除
  - `GET /api/knowledge-co-creation/knowledge` - 知識一覧・検索

### 2. 🤖 AI処理・分析API
知識の抽出・構造化・品質検証・分類などのAI支援処理

#### 詳細仕様
- **参照**: [endpoints/knowledge-ai-processing.md]
- **主要エンドポイント**:
  - `POST /api/knowledge-co-creation/processing/extract` - 知識抽出開始
  - `POST /api/knowledge-co-creation/processing/validate` - 品質検証開始
  - `POST /api/knowledge-co-creation/processing/classify` - 分類・タグ付け開始
  - `GET /api/knowledge-co-creation/processing/{jobId}/progress` - 処理進捗監視
  - `GET /api/knowledge-co-creation/processing/{jobId}/results` - 処理結果取得

### 3. 🤝 協調・共有API
専門家協調・知識公開・共有・リアルタイム編集

#### 詳細仕様
- **参照**: [endpoints/knowledge-collaboration.md]
- **主要エンドポイント**:
  - `POST /api/knowledge-co-creation/collaboration/sessions` - 協調セッション作成
  - `POST /api/knowledge-co-creation/publication/publish` - 知識公開
  - `POST /api/knowledge-co-creation/publication/share` - 知識共有
  - `POST /api/knowledge-co-creation/collaboration/feedback` - 専門家フィードバック
  - `GET /api/knowledge-co-creation/analytics/{knowledgeId}` - 公開統計

## 🔗 共通仕様

### 認証・認可
```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
```

#### JWT Claims
```json
{
  "sub": "user-12345",
  "roles": ["knowledge_analyst", "domain_expert"],
  "permissions": [
    "knowledge:create",
    "knowledge:extract",
    "knowledge:validate",
    "knowledge:classify",
    "knowledge:publish",
    "expert:collaborate"
  ],
  "security_clearance": "confidential",
  "project_access": ["proj-alpha-001", "proj-beta-002"]
}
```

### 共通レスポンス形式
```json
{
  "success": boolean,
  "data": object,
  "externalServiceCalls": [
    {
      "service": "service-name",
      "usecase": "UC-XXX-XX",
      "endpoint": "POST /api/service/usecases/action",
      "purpose": "処理目的の説明"
    }
  ],
  "timestamp": "2025-10-10T12:00:00Z"
}
```

### 共通エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {
      "stage": "処理段階",
      "errorType": "エラー種別",
      "retryable": boolean,
      "suggestedAction": "推奨対応"
    }
  },
  "timestamp": "2025-10-10T12:00:00Z"
}
```

### WebSocketエンドポイント
```
wss://api.consulting-dashboard.com/ws/knowledge-co-creation/{function}/{sessionId}
```

**サポート機能**:
- `extract-progress/{sessionId}` - 抽出進捗リアルタイム更新
- `validation-results/{sessionId}` - 検証結果リアルタイム配信
- `classification-updates/{sessionId}` - 分類処理リアルタイム監視
- `collaboration/{sessionId}` - 協調編集リアルタイム同期

## 🔒 セキュリティ仕様

### データ分類とアクセス制御
| データ分類 | アクセス権限 | 処理制限 |
|-----------|-------------|----------|
| **public** | 全員 | 基本検索・閲覧のみ |
| **internal** | 社員のみ | 検索・コメント可能 |
| **confidential** | 部門メンバー | 編集・共有可能 |
| **secret** | 指定ユーザー | 全機能利用可能 |

### 監査・コンプライアンス
- **処理証跡**: 全AI処理・専門家評価の完全記録
- **アクセスログ**: ユーザー操作・データアクセスの追跡
- **変更履歴**: 知識内容・メタデータ変更の版本管理
- **品質監査**: 品質検証プロセス・結果の監査証跡

## 📊 パフォーマンス・SLA仕様

### 応答時間目標
- **CRUD操作**: 95%ile < 500ms、99%ile < 1000ms
- **AI処理開始**: 95%ile < 200ms（非同期開始）
- **品質分析**: 95%ile < 3分、99%ile < 5分
- **分類処理**: 95%ile < 2分、99%ile < 5分
- **公開・共有**: 95%ile < 800ms、99%ile < 1500ms
- **WebSocket**: レイテンシー < 100ms、throughput > 1000 msg/sec

### スケーラビリティ仕様
- **同時処理**: 1000セッション並行処理
- **ファイル処理**: 単一セッション最大10GB
- **専門家協調**: 100名同時協調セッション
- **リアルタイム編集**: 50名/文書の同時編集
- **データ容量**: 100万知識・10万カテゴリ対応

### 品質保証指標
- **AI精度**: 85%以上の概念抽出精度
- **専門家一致度**: 90%以上の専門家評価一致
- **処理完了率**: 99%以上の正常完了
- **システム可用性**: 99.9%のサービス可用性
- **ユーザー満足度**: 4.0以上（5点満点）

## 🔄 バージョン管理・移行

### APIバージョニング
- **現在バージョン**: v2.0.0
- **サポートポリシー**: メジャーバージョン2世代サポート
- **廃止予告**: 6ヶ月前の事前通知
- **互換性保証**: マイナーバージョン内の後方互換性

### 移行ガイド
1. **v1.0からv2.0**: パラソルドメイン連携仕様への移行
2. **認証**: JWT形式・権限スキームの変更対応
3. **エンドポイント**: URL構造の統一（/usecases/から/processing/等へ）
4. **レスポンス**: externalServiceCalls追加対応

---

**このAPI仕様により、AI技術と専門家協調を統合した包括的な知識共創プラットフォームが実現され、組織の知識資産価値最大化と継続的学習促進が可能になります。**