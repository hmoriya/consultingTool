# API利用仕様重複解決戦略

## 🎯 問題の概要

パラソル設計v2.0において、ユースケース配下のAPI利用仕様で以下の重複問題が発生しています：

### 確認された重複パターン

#### 1. 他サービスAPI利用の重複
```markdown
# 複数ユースケースで共通
- secure-access-service UC-AUTH-01: ユーザー認証を実行する
- secure-access-service UC-AUTH-02: 権限を検証する
- secure-access-service UC-AUTH-03: アクセスログを記録する
- collaboration-facilitation-service UC-COMM-01: 重要通知を配信する
```

#### 2. API呼び出しシーケンスの重複
```markdown
# ほぼ全ユースケースで共通の事前処理
1. POST /api/auth/usecases/authenticate (認証)
2. POST /api/auth/usecases/validate-permission (権限確認)
3. [ユースケース固有処理]
4. POST /api/auth/usecases/log-access (監査ログ)
```

#### 3. エラーハンドリングの重複
- 認証エラー処理
- 権限不足エラー処理
- 通信タイムアウト処理
- リトライ戦略

## 🛠️ 解決策: 3層階層構造

### 階層1: 共通APIパターン（Common API Patterns）

**場所**: `services/[service-name]/api/patterns/`

共通的に使用されるAPI利用パターンを抽象化

```
services/knowledge-co-creation-service/api/
└── patterns/
    ├── authentication-pattern.md      # 認証共通パターン
    ├── notification-pattern.md        # 通知共通パターン
    ├── audit-logging-pattern.md       # 監査ログ共通パターン
    ├── collaboration-pattern.md       # 協調作業共通パターン
    └── error-handling-pattern.md      # エラー処理共通パターン
```

### 階層2: オペレーション共通API（Operation Common APIs）

**場所**: `operations/[operation-name]/api-usage-common.md`

オペレーション内で共通利用されるAPI組み合わせ

```
operations/capture-knowledge/
├── operation.md
├── api-usage-common.md               # このオペレーション共通のAPI利用
└── usecases/
    ├── validate-knowledge-quality/
    │   ├── usecase.md
    │   ├── page.md
    │   └── api-usage.md              # ユースケース固有 + 共通参照
    └── publish-and-share-knowledge/
        ├── usecase.md
        ├── page.md
        └── api-usage.md              # ユースケース固有 + 共通参照
```

### 階層3: ユースケース固有API（Usecase Specific APIs）

**場所**: `usecases/[usecase-name]/api-usage.md`

そのユースケースでのみ使用する固有API利用方法

## 📋 実装アプローチ

### Step 1: 共通パターンの抽出

#### authentication-pattern.md の例
```markdown
# 認証共通パターン

## 適用ユースケース
- 全ユースケース（認証が必要な処理）

## 標準認証フロー
1. **ユーザー認証**: `POST /api/auth/usecases/authenticate`
2. **権限検証**: `POST /api/auth/usecases/validate-permission`
3. **セッション確認**: セッション状態の確認

## パラメータテンプレート
- `userId`: {current_user_id}
- `requestedPermission`: {permission_name}
- `resourceContext`: {resource_context}

## エラーハンドリング
- AUTHENTICATION_FAILED: 再認証フロー
- PERMISSION_DENIED: 権限申請ガイダンス
- SESSION_EXPIRED: セッション更新

## 使用例
`{{INCLUDE: authentication-pattern}}`で参照
```

### Step 2: 参照システムの構築

#### ユースケースでの参照方法
```markdown
# API利用仕様: 知識品質を検証する

## 共通パターン利用
- {{INCLUDE: authentication-pattern}}     # 標準認証フロー
- {{INCLUDE: notification-pattern}}       # 標準通知フロー
- {{INCLUDE: audit-logging-pattern}}      # 標準監査ログ

## オペレーション共通API
- {{INCLUDE: ../api-usage-common.md#knowledge-validation-context}}

## ユースケース固有API
### 品質検証処理
| API | エンドポイント | 利用目的 |
|-----|---------------|----------|
| 品質検証開始API | POST /api/knowledge-co-creation/processing/validate | AI+専門家による知識品質検証開始 |
| 検証進捗監視API | GET /api/knowledge-co-creation/processing/{jobId}/progress | 品質検証プロセスの進捗確認 |

## カスタムシーケンス
1. {{INCLUDE: authentication-pattern#standard-flow}}
2. **品質検証固有処理**:
   - 品質検証開始
   - 進捗監視
   - 結果取得
3. {{INCLUDE: notification-pattern#completion-notification}}
4. {{INCLUDE: audit-logging-pattern#process-logging}}
```

### Step 3: 自動生成・検証システム

#### テンプレート展開エンジン
```bash
#!/bin/bash
# expand-api-usage.sh - API利用仕様テンプレート展開

expand_templates() {
    local usecase_file="$1"
    local output_file="${usecase_file}.expanded"

    # 共通パターン展開
    sed 's/{{INCLUDE: authentication-pattern}}/'"$(cat patterns/authentication-pattern.md)"'/g' "$usecase_file" > "$output_file"

    # オペレーション共通参照展開
    # ユースケース固有処理はそのまま保持
}
```

#### 重複検証スクリプト
```bash
#!/bin/bash
# check-api-duplication.sh - API利用仕様重複検証

check_duplications() {
    echo "=== API利用仕様重複検証 ==="

    # 1. 共通パターン候補の検出
    find . -name "api-usage.md" -exec grep -h "POST /api/auth/usecases" {} \; | sort | uniq -c | sort -nr

    # 2. 重複度の高いシーケンスの特定
    find . -name "api-usage.md" -exec grep -A 5 "呼び出しシーケンス" {} \; | grep -v "^--" | sort | uniq -c | sort -nr

    # 3. 改善提案の生成
    echo "推奨共通パターン候補:"
    echo "- authentication-pattern (利用回数: X回)"
    echo "- notification-pattern (利用回数: Y回)"
}
```

### Step 4: 段階的移行戦略

#### Phase 1: 共通パターン特定・抽出（1週間）
```markdown
優先度1: 認証関連API利用
- 全ユースケースで使用される認証フロー
- 権限検証パターン
- セッション管理

優先度2: 通知・協調関連API利用
- 通知配信パターン
- 協調作業セッション作成
- フィードバック収集

優先度3: 監査・ログ関連API利用
- アクセスログ記録
- 操作履歴追跡
- コンプライアンス記録
```

#### Phase 2: 参照システム構築（1週間）
```markdown
1. テンプレート参照記法の確立
2. 自動展開エンジンの開発
3. 検証ツールの構築
4. CI/CDパイプラインへの統合
```

#### Phase 3: 段階的適用（2週間）
```markdown
Week 1: knowledge-co-creation-service 内の重複解消
Week 2: 他サービスへの適用拡大
```

## 📊 期待効果

### 定量的効果
- **重複削減率**: 70-80% (推定)
- **API利用仕様作成時間**: 60% 短縮
- **保守工数**: 50% 削減
- **一貫性**: 95% 向上

### 定性的効果
- **API利用パターンの標準化**: 開発効率向上
- **エラーハンドリングの統一**: 品質向上
- **ドキュメント保守性**: 大幅改善
- **新規ユースケース開発**: 迅速化

## 🔧 実装ツール

### 1. テンプレート展開エンジン
```bash
.github/scripts/expand-api-templates.sh
```

### 2. 重複検証ツール
```bash
.github/scripts/check-api-duplication.sh
```

### 3. 共通パターンジェネレータ
```bash
.github/scripts/generate-common-patterns.sh
```

### 4. CI/CD統合
```yaml
# .github/workflows/api-usage-validation.yml
name: API Usage Validation
on: [push, pull_request]
jobs:
  validate-api-usage:
    runs-on: ubuntu-latest
    steps:
      - name: Check API duplications
        run: .github/scripts/check-api-duplication.sh
      - name: Validate template references
        run: .github/scripts/validate-template-refs.sh
```

## 📝 ガイドライン

### 共通パターン作成ルール
1. **再利用性**: 3つ以上のユースケースで使用される場合は共通化
2. **安定性**: 頻繁に変更されないパターンを共通化
3. **明確性**: パターンの目的・適用条件を明確に記述

### 参照記法ルール
1. **完全参照**: `{{INCLUDE: pattern-name}}` - パターン全体
2. **部分参照**: `{{INCLUDE: pattern-name#section}}` - 特定セクション
3. **パラメータ付き**: `{{INCLUDE: pattern-name?param=value}}` - パラメータ指定

### バージョン管理ルール
1. **共通パターンのバージョニング**: 破壊的変更時の影響分析
2. **後方互換性**: 既存参照への影響最小化
3. **変更通知**: パターン変更時の影響範囲通知

## 🚀 実装優先度

### 🔴 最優先（今週実装）
1. authentication-pattern.md の作成
2. 基本的な参照システムの構築
3. knowledge-co-creation-service での適用開始

### 🟡 高優先（来週実装）
1. notification-pattern.md の作成
2. audit-logging-pattern.md の作成
3. 自動検証ツールの開発

### 🟢 中優先（今月実装）
1. 残り共通パターンの作成
2. 全サービスへの適用
3. CI/CD統合の完成

---

**この戦略により、API利用仕様の重複問題を根本的に解決し、パラソル設計の保守性と開発効率を大幅に向上させることができます。**