# API利用仕様テンプレート（共通パターン参照型）

**バージョン**: v2.1.0
**更新日**: 2025-10-13
**適用対象**: 重複解消後のAPI利用仕様

## 📋 テンプレート構造

このテンプレートは、共通パターン参照により重複を解消したAPI利用仕様の標準形式です。

```markdown
# API利用仕様: [ユースケース名]

## 共通パターン利用

### 必須パターン
{{INCLUDE: authentication-pattern}}              # 認証フロー（全ユースケース必須）
{{INCLUDE: audit-logging-pattern}}               # 監査ログ（全ユースケース必須）

### 条件付きパターン
{{INCLUDE: notification-pattern?priority=high}}  # 重要通知（他者連携時）
{{INCLUDE: collaboration-pattern}}               # 協調作業（複数人作業時）
{{INCLUDE: error-handling-pattern}}              # 高度エラー処理（複雑処理時）

## オペレーション共通API
{{INCLUDE: ../api-usage-common.md#knowledge-context}}  # オペレーション共通部分

## ユースケース固有API

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| [固有API1] | POST /api/... | [目的] | [パラメータ] |
| [固有API2] | GET /api/... | [目的] | [パラメータ] |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| [service] | UC-XXX-01: [ユースケース名] | [タイミング] | [結果] |

## カスタムシーケンス

### ユースケース固有フロー
1. {{INCLUDE: authentication-pattern#standard-flow}}
2. **固有処理開始**:
   - [ユースケース固有のAPI呼び出し]
   - [ビジネスロジック実行]
3. **[固有処理ステップ2]**:
   - [詳細処理内容]
4. {{INCLUDE: notification-pattern#completion-notification}}
5. {{INCLUDE: audit-logging-pattern#process-logging}}

### 例外フロー
1. **[例外条件]**の場合:
   - {{INCLUDE: error-handling-pattern#standard-recovery}}
   - [追加の例外処理]

## カスタムエラーハンドリング

### ユースケース固有エラー
- **[ERROR_CODE]**: [説明] → [対応策]
- **[ERROR_CODE]**: [説明] → [対応策]

### 共通エラー処理
{{INCLUDE: error-handling-pattern#common-errors}}

## パフォーマンス要件

### レスポンス時間目標
- **[処理1]**: 95%ile < Xs、99%ile < Ys
- **[処理2]**: 95%ile < Xs、99%ile < Ys

### 最適化戦略
{{INCLUDE: performance-optimization-pattern}}
```

## 🔧 参照記法仕様

### 基本参照
```markdown
{{INCLUDE: pattern-name}}                    # パターン全体を参照
```

### セクション参照
```markdown
{{INCLUDE: pattern-name#section-name}}       # 特定セクションのみ参照
```

### パラメータ付き参照
```markdown
{{INCLUDE: pattern-name?param1=value1&param2=value2}}  # パラメータ指定参照
```

### 条件付き参照
```markdown
{{INCLUDE: pattern-name?condition=true}}     # 条件満たす場合のみ参照
```

## 📝 実装例

### 例1: 知識品質検証ユースケース

```markdown
# API利用仕様: 知識品質を検証する

## 共通パターン利用
{{INCLUDE: authentication-pattern}}
{{INCLUDE: notification-pattern?priority=medium}}
{{INCLUDE: audit-logging-pattern}}

## オペレーション共通API
{{INCLUDE: ../api-usage-common.md#validation-context}}

## ユースケース固有API

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 品質検証開始API | POST /api/knowledge-co-creation/processing/validate | AI+専門家による知識品質検証開始 | `knowledgeId`, `validationCriteria` |
| 検証結果取得API | GET /api/knowledge-co-creation/processing/{jobId}/results | 品質検証結果と改善提案の取得 | `jobId`, `includeRecommendations` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| project-success-service | UC-PROJECT-05: プロジェクト文脈を取得する | 文脈的品質評価時 | プロジェクト要求基準の取得 |

## カスタムシーケンス

### 品質検証フロー
1. {{INCLUDE: authentication-pattern#standard-flow}}
2. **プロジェクト文脈取得**:
   - `GET /api/projects/usecases/get-project-context`
3. **品質検証実行**:
   - `POST /api/knowledge-co-creation/processing/validate`
   - 進捗監視とリアルタイム更新
4. **結果処理**:
   - `GET /api/knowledge-co-creation/processing/{jobId}/results`
   - 品質スコア算出と改善提案生成
5. {{INCLUDE: notification-pattern#completion-notification}}
6. {{INCLUDE: audit-logging-pattern#process-logging}}

## カスタムエラーハンドリング

### 品質検証固有エラー
- **VALIDATION_MODEL_ERROR**: AI検証モデル失敗 → 代替モデル切り替え
- **INSUFFICIENT_CONTEXT**: 文脈情報不足 → 追加情報要求

## パフォーマンス要件

### レスポンス時間目標
- **品質検証開始**: 95%ile < 5s、99%ile < 15s
- **検証結果取得**: 95%ile < 2s、99%ile < 5s
```

### 例2: 知識公開ユースケース

```markdown
# API利用仕様: 知識を公開・共有する

## 共通パターン利用
{{INCLUDE: authentication-pattern?authStrength=high}}
{{INCLUDE: notification-pattern?priority=high}}
{{INCLUDE: collaboration-pattern}}
{{INCLUDE: audit-logging-pattern}}

## オペレーション共通API
{{INCLUDE: ../api-usage-common.md#publication-context}}

## ユースケース固有API

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 知識公開API | POST /api/knowledge-co-creation/publication/publish | 検証済み知識の組織内外への公開 | `knowledgeId`, `publicationScope` |
| アクセス制御API | PUT /api/knowledge-co-creation/knowledge/{id}/access-control | 知識へのアクセス権限管理 | `knowledgeId`, `accessRules` |

## カスタムシーケンス

### 知識公開フロー
1. {{INCLUDE: authentication-pattern#high-security-flow}}
2. **公開前品質確認**:
   - 品質スコア・検証状況の最終確認
3. **アクセス制御設定**:
   - `PUT /api/knowledge-co-creation/knowledge/{id}/access-control`
4. **知識公開実行**:
   - `POST /api/knowledge-co-creation/publication/publish`
5. {{INCLUDE: collaboration-pattern#space-creation}}
6. {{INCLUDE: notification-pattern#publication-notification}}
7. {{INCLUDE: audit-logging-pattern#publication-logging}}
```

## 🔍 参照展開例

### 展開前（参照記法使用）
```markdown
{{INCLUDE: authentication-pattern#standard-flow}}
```

### 展開後（自動生成）
```markdown
## 認証・権限確認フロー

1. **ユーザー認証実行**:
   - `POST /api/auth/usecases/authenticate`
   - 認証トークン・セッション情報取得

2. **権限検証**:
   - `POST /api/auth/usecases/validate-permission`
   - 必要権限の確認と許可取得

3. **セッション確認**:
   - セッション有効性の確認
   - 必要に応じて更新
```

## 🛠️ 作成ガイドライン

### 1. 共通パターンの選択
- **必須パターン**: 認証・監査ログは全ユースケースで必須
- **条件付きパターン**: ユースケースの特性に応じて選択
- **カスタマイズ**: パラメータで動作を調整

### 2. ユースケース固有部分の記述
- **API仕様**: そのユースケースでのみ使用するAPI
- **シーケンス**: 共通パターンと固有処理の組み合わせ
- **エラー処理**: ユースケース固有のエラー対応

### 3. 参照記法の活用
- **標準参照**: `{{INCLUDE: pattern-name}}`
- **部分参照**: `{{INCLUDE: pattern-name#section}}`
- **条件参照**: `{{INCLUDE: pattern-name?condition=value}}`

### 4. 品質チェック
- **参照整合性**: 参照先パターンの存在確認
- **パラメータ有効性**: 指定パラメータの妥当性確認
- **循環参照**: 無限ループの防止

## 📊 効果測定

### 重複削減効果
- **記述量**: 70-80%削減（推定）
- **保守工数**: 50-60%削減（推定）
- **一貫性**: 95%以上向上（推定）

### 開発効率向上
- **作成時間**: 60%短縮（推定）
- **レビュー時間**: 40%短縮（推定）
- **更新時間**: 80%短縮（推定）

## 🔄 バージョン管理

### テンプレートバージョン
- **v2.1.0**: 共通パターン参照機能追加
- **v2.0.0**: WHAT/HOW分離対応
- **v1.0.0**: 基本形式

### 互換性
- **後方互換**: v2.0.0との互換性維持
- **移行支援**: 自動変換ツール提供
- **段階移行**: 混在期間の運用サポート