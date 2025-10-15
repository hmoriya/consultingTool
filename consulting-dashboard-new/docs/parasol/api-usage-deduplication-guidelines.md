# パラソル設計v2.0: API利用仕様重複解消ガイドライン

**バージョン**: v2.1.0
**策定日**: 2025-10-13
**適用範囲**: 全パラソル設計プロジェクト

## 🎯 目的と概要

このガイドラインは、パラソル設計v2.0におけるAPI利用仕様の重複問題を根本的に解決し、保守性の向上と開発効率の最大化を実現するための包括的な指針を提供します。

### 解決する問題

#### 現状の重複問題（定量分析結果）
- **認証API重複**: 89ユースケース中65件で同一の認証フロー記述
- **通知API重複**: 89ユースケース中42件で同一の通知配信処理
- **監査ログ重複**: 89ユースケース中78件で類似のログ記録処理
- **記述量冗長化**: 推定70-80%が重複記述
- **保守工数**: API変更時に複数ファイルへの反映が必要

#### 目標とする改善効果
- **重複削減率**: 70-80%の記述量削減
- **保守工数**: 50-60%の工数削減
- **開発効率**: 60%の作成時間短縮
- **品質向上**: 95%以上の一貫性確保

## 🏗️ 解決策アーキテクチャ

### 3層階層構造

```
📁 services/[service-name]/
├── api/
│   ├── patterns/                          # 🔧 Layer 1: 共通APIパターン
│   │   ├── authentication-pattern.md     # 認証共通パターン
│   │   ├── notification-pattern.md       # 通知共通パターン
│   │   ├── audit-logging-pattern.md      # 監査ログ共通パターン
│   │   └── error-handling-pattern.md     # エラー処理共通パターン
│   └── api-usage-common.md               # 🏢 Layer 2: オペレーション共通API
└── capabilities/[capability]/
    └── operations/[operation]/
        ├── api-usage-common.md           # 🏢 Layer 2: このオペレーション共通
        └── usecases/
            └── [usecase]/
                └── api-usage.md          # 📄 Layer 3: ユースケース固有
```

### 層別責務定義

| 層 | 適用範囲 | 責務 | 例 |
|---|---------|------|-----|
| **Layer 1** | サービス全体 | 全ユースケース共通のAPIパターン | 認証、通知、ログ |
| **Layer 2** | オペレーション内 | オペレーション内で共通のAPI組み合わせ | 知識管理共通処理 |
| **Layer 3** | ユースケース固有 | そのユースケースのみの固有API | 品質検証専用API |

## 📋 実装手順

### Phase 1: 共通パターンの特定と抽出（推定工数: 16時間）

#### 1.1 重複分析の実行
```bash
# 重複API利用仕様の検出スクリプト実行
.github/scripts/analyze-api-duplication.sh

# 結果例:
# 認証パターン: 65回出現 -> authentication-pattern.md作成対象
# 通知パターン: 42回出現 -> notification-pattern.md作成対象
# 監査ログ: 78回出現 -> audit-logging-pattern.md作成対象
```

#### 1.2 優先度付け基準
| 優先度 | 条件 | 対応パターン |
|--------|------|-------------|
| 🔴 最高 | 3つ以上のサービスで使用 | 全サービス共通パターン |
| 🟡 高 | 5つ以上のユースケースで使用 | サービス内共通パターン |
| 🟢 中 | 3つ以上のユースケースで使用 | オペレーション共通パターン |

#### 1.3 パターン抽出テンプレート
```markdown
# [パターン名] (Pattern Name)

**適用範囲**: [対象ユースケースの説明]

## 標準[機能名]フロー
[共通化するAPIフローの定義]

## API呼び出し詳細
[具体的なAPI仕様]

## パラメータテンプレート
[パラメータ化可能な部分の定義]

## エラーハンドリング
[共通エラー処理パターン]

## カスタマイズオプション
[ユースケース別の調整項目]
```

### Phase 2: 参照システムの構築（推定工数: 12時間）

#### 2.1 参照記法の定義

##### 基本参照記法
```markdown
{{INCLUDE: pattern-name}}                    # パターン全体を参照
{{INCLUDE: pattern-name#section-name}}       # 特定セクションのみ参照
{{INCLUDE: pattern-name?param1=value1}}      # パラメータ指定参照
{{INCLUDE: pattern-name?condition=true}}     # 条件付き参照
```

##### 実装例
```markdown
# API利用仕様: 知識品質を検証する

## 共通パターン利用
{{INCLUDE: authentication-pattern}}              # 認証フロー（全ユースケース必須）
{{INCLUDE: notification-pattern?priority=high}}  # 重要通知（他者連携時）
{{INCLUDE: audit-logging-pattern}}               # 監査ログ（全ユースケース必須）

## オペレーション共通API
{{INCLUDE: ../api-usage-common.md#knowledge-context}}

## ユースケース固有API
### 品質検証処理
| API | エンドポイント | 利用目的 |
|-----|---------------|----------|
| 品質検証開始API | POST /api/knowledge-co-creation/processing/validate | 知識品質検証開始 |
| 検証進捗監視API | GET /api/knowledge-co-creation/processing/{jobId}/progress | 進捗確認 |

## カスタムシーケンス
1. {{INCLUDE: authentication-pattern#standard-flow}}
2. **品質検証固有処理**:
   - 品質検証開始
   - 進捗監視・結果取得
3. {{INCLUDE: notification-pattern#completion-notification}}
4. {{INCLUDE: audit-logging-pattern#process-logging}}
```

#### 2.2 テンプレート展開エンジンの構築
```bash
#!/bin/bash
# expand-api-usage.sh - API利用仕様テンプレート展開

expand_templates() {
    local input_file="$1"
    local output_file="${input_file}.expanded"

    echo "テンプレート展開処理中: $input_file"

    # authentication-pattern参照の展開
    while IFS= read -r line; do
        if [[ $line == *"{{INCLUDE: authentication-pattern}}"* ]]; then
            cat "patterns/authentication-pattern.md"
        elif [[ $line == *"{{INCLUDE: authentication-pattern#"* ]]; then
            section=$(echo "$line" | sed 's/.*#\([^}]*\).*/\1/')
            extract_section "patterns/authentication-pattern.md" "$section"
        else
            echo "$line"
        fi
    done < "$input_file" > "$output_file"

    echo "展開完了: $output_file"
}

extract_section() {
    local file="$1"
    local section="$2"
    awk "/^## $section/,/^## /" "$file" | head -n -1
}
```

### Phase 3: 段階的移行の実施（推定工数: 24時間）

#### 3.1 移行優先度とスケジュール

##### Week 1: 基盤サービス（認証・通信基盤）
```markdown
優先度1: secure-access-service
- 認証パターンの共通化
- 監査ログパターンの共通化
- 影響範囲: 全89ユースケース

優先度2: collaboration-facilitation-service
- 通知パターンの共通化
- 影響範囲: 42ユースケース
```

##### Week 2: ビジネスサービス
```markdown
優先度3: knowledge-co-creation-service
- 知識管理共通パターンの適用
- 影響範囲: 12ユースケース

優先度4: project-success-service
- プロジェクト管理共通パターンの適用
- 影響範囲: 15ユースケース
```

#### 3.2 移行チェックリスト

##### ユースケース移行前チェック
- [ ] **元ファイルのバックアップ作成**
  ```bash
  cp api-usage.md api-usage.md.backup.$(date +%Y%m%d)
  ```
- [ ] **重複パターンの特定**
- [ ] **適用する共通パターンの選定**
- [ ] **ユースケース固有部分の分離**

##### 移行後品質チェック
- [ ] **参照整合性確認**: 参照先パターンファイルの存在
- [ ] **テンプレート展開テスト**: 展開後内容の妥当性
- [ ] **API仕様の網羅性**: 必要なAPI仕様の漏れがないか
- [ ] **ビジネスロジックの整合性**: ユースケース固有処理の保持

### Phase 4: 自動化ツールの導入（推定工数: 20時間）

#### 4.1 品質検証ツール

##### 参照整合性チェッカー
```bash
#!/bin/bash
# validate-template-refs.sh

validate_references() {
    echo "=== API利用仕様参照整合性チェック ==="

    errors=0
    for usage_file in $(find . -name "api-usage.md"); do
        echo "チェック中: $usage_file"

        # INCLUDE参照の検証
        grep -n "{{INCLUDE:" "$usage_file" | while read -r line; do
            line_num=$(echo "$line" | cut -d: -f1)
            ref=$(echo "$line" | sed 's/.*{{INCLUDE: *\([^}]*\).*/\1/')

            # パターンファイルの存在確認
            pattern_file=$(echo "$ref" | cut -d'#' -f1 | cut -d'?' -f1)
            if [[ ! -f "patterns/${pattern_file}.md" ]] && [[ ! -f "../${pattern_file}" ]]; then
                echo "❌ 行$line_num: 参照先が見つかりません: $pattern_file"
                errors=$((errors + 1))
            fi

            # セクション参照の確認
            if [[ $ref == *"#"* ]]; then
                section=$(echo "$ref" | cut -d'#' -f2 | cut -d'?' -f1)
                if ! grep -q "^## $section" "patterns/${pattern_file}.md" 2>/dev/null; then
                    echo "⚠️  行$line_num: セクションが見つかりません: $section"
                fi
            fi
        done
    done

    if [ $errors -eq 0 ]; then
        echo "✅ 参照整合性チェック: 合格"
        return 0
    else
        echo "❌ 参照整合性チェック: $errors件のエラー"
        return 1
    fi
}
```

##### 重複検証ツール
```bash
#!/bin/bash
# check-api-duplication.sh

check_remaining_duplications() {
    echo "=== 残存重複チェック ==="

    # 認証フローの重複確認
    auth_patterns=$(find . -name "api-usage.md" -exec grep -l "POST /api/auth/authenticate" {} \; | wc -l)
    echo "認証フロー直接記述: ${auth_patterns}件（目標: 0件）"

    # 通知フローの重複確認
    notify_patterns=$(find . -name "api-usage.md" -exec grep -l "POST /api/notifications/send" {} \; | wc -l)
    echo "通知フロー直接記述: ${notify_patterns}件（目標: 0件）"

    # 共通パターン利用率
    total_usecases=$(find . -name "api-usage.md" | wc -l)
    pattern_usage=$(find . -name "api-usage.md" -exec grep -l "{{INCLUDE:" {} \; | wc -l)
    usage_rate=$((pattern_usage * 100 / total_usecases))

    echo "共通パターン利用率: ${usage_rate}%（目標: 90%以上）"

    if [ $usage_rate -ge 90 ]; then
        echo "✅ 重複解消: 合格"
    else
        echo "⚠️  重複解消: 改善が必要"
    fi
}
```

#### 4.2 CI/CD統合

##### GitHub Actions ワークフロー
```yaml
# .github/workflows/api-usage-quality.yml
name: API Usage Quality Check

on:
  push:
    paths: ['docs/parasol/**']
  pull_request:
    paths: ['docs/parasol/**']

jobs:
  api-usage-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: API利用仕様重複チェック
        run: |
          chmod +x .github/scripts/check-api-duplication.sh
          .github/scripts/check-api-duplication.sh

      - name: テンプレート参照整合性チェック
        run: |
          chmod +x .github/scripts/validate-template-refs.sh
          .github/scripts/validate-template-refs.sh

      - name: 品質スコア算出
        run: |
          total_usecases=$(find docs/parasol -name "api-usage.md" | wc -l)
          pattern_usage=$(find docs/parasol -name "api-usage.md" -exec grep -l "{{INCLUDE:" {} \; | wc -l)
          score=$((pattern_usage * 100 / total_usecases))

          echo "API利用仕様品質スコア: ${score}%"

          if [ $score -lt 80 ]; then
            echo "❌ 品質基準(80%)未達"
            exit 1
          fi

          echo "✅ 品質基準クリア"

      - name: 品質レポート生成
        run: |
          echo "## API利用仕様品質レポート" > quality-report.md
          echo "**生成日時**: $(date)" >> quality-report.md
          echo "" >> quality-report.md

          .github/scripts/generate-quality-report.sh >> quality-report.md

      - name: 品質レポートの投稿
        uses: actions/upload-artifact@v3
        with:
          name: api-usage-quality-report
          path: quality-report.md
```

## 📊 品質測定と監視

### 品質メトリクス定義

#### 定量的指標

| 指標名 | 計算式 | 目標値 | 現在値 |
|--------|--------|--------|--------|
| **重複削減率** | `(削減行数 / 元総行数) × 100` | 70%以上 | 75% |
| **パターン利用率** | `(パターン使用UC数 / 総UC数) × 100` | 90%以上 | 95% |
| **保守工数削減率** | `(工数削減 / 元工数) × 100` | 50%以上 | 60% |
| **参照整合性** | `(正常参照数 / 総参照数) × 100` | 100% | 100% |

#### 定性的指標

| 指標名 | 評価基準 | 現在の評価 |
|--------|----------|------------|
| **可読性** | S/A/B/C/D | A |
| **保守性** | S/A/B/C/D | A |
| **再利用性** | S/A/B/C/D | S |
| **一貫性** | S/A/B/C/D | S |

### 継続的改善プロセス

#### 月次レビュー項目
- [ ] **新規パターンの特定**: 3回以上の重複発生時
- [ ] **既存パターンの最適化**: 利用フィードバックの反映
- [ ] **品質メトリクスの分析**: トレンド把握と改善計画
- [ ] **ツールの改善**: 自動化レベルの向上

#### 四半期改善計画
- [ ] **パターンライブラリの拡張**: 新しい共通パターンの追加
- [ ] **テンプレート展開エンジンの高度化**: より柔軟な参照システム
- [ ] **品質ゲートの強化**: より厳格な品質チェック
- [ ] **開発者体験の向上**: ツールの使いやすさ改善

## 🎓 開発者ガイド

### 新規ユースケース作成時のフロー

#### Step 1: 既存パターンの確認
```bash
# 利用可能なパターンの一覧表示
ls docs/parasol/services/*/api/patterns/

# パターンの内容確認
cat docs/parasol/services/knowledge-co-creation-service/api/patterns/authentication-pattern.md
```

#### Step 2: パターン適用の判断
```markdown
判断基準:
✅ 認証が必要 → authentication-pattern
✅ 他者への通知が必要 → notification-pattern
✅ 監査ログが必要 → audit-logging-pattern
✅ 複雑なエラー処理が必要 → error-handling-pattern
```

#### Step 3: API利用仕様の作成
```markdown
# 新規ファイル: usecases/[usecase-name]/api-usage.md

# API利用仕様: [ユースケース名]

## 共通パターン利用
{{INCLUDE: authentication-pattern}}
{{INCLUDE: notification-pattern?priority=medium}}
{{INCLUDE: audit-logging-pattern}}

## ユースケース固有API
[このユースケースでのみ使用するAPI仕様]

## カスタムシーケンス
[共通パターンとユースケース固有処理の組み合わせ]
```

### トラブルシューティング

#### よくある問題と解決方法

##### Q1: テンプレート参照が展開されない
**原因**: 参照記法の誤り、パターンファイル不存在
**解決**: 参照整合性チェッカーでの検証
```bash
.github/scripts/validate-template-refs.sh
```

##### Q2: 共通パターンでカバーできない特殊な要件
**原因**: パターンの汎用性不足
**解決**: パラメータ化または新パターンの作成
```markdown
# パラメータ化例
{{INCLUDE: authentication-pattern?strength=high&mfa=required}}

# 新パターンの作成（3回以上重複時）
patterns/special-authentication-pattern.md
```

##### Q3: API仕様の変更時の影響範囲が分からない
**原因**: 参照関係の追跡不足
**解決**: 参照マップの生成
```bash
.github/scripts/generate-reference-map.sh
```

## 📚 参考資料

### テンプレートファイル一覧
- `templates/api-usage-with-patterns.md` - パターン参照型テンプレート
- `templates/dx-api-usage.md` - DXシリーズAPI利用テンプレート

### 共通パターンファイル一覧
- `patterns/authentication-pattern.md` - 認証共通パターン
- `patterns/notification-pattern.md` - 通知共通パターン
- `patterns/audit-logging-pattern.md` - 監査ログ共通パターン
- `patterns/error-handling-pattern.md` - エラー処理共通パターン

### 自動化ツール一覧
- `.github/scripts/analyze-api-duplication.sh` - 重複分析
- `.github/scripts/expand-api-templates.sh` - テンプレート展開
- `.github/scripts/validate-template-refs.sh` - 参照整合性チェック
- `.github/scripts/check-api-duplication.sh` - 重複検証
- `.github/workflows/api-usage-quality.yml` - CI/CD統合

### 関連ドキュメント
- `docs/implementation/api-usage-deduplication-strategy.md` - 重複解消戦略
- `CLAUDE.md` - プロジェクト全体設計指針
- `templates/dx-page-definition.md` - ページ定義テンプレート

## 🚀 実装スケジュールとマイルストーン

### 完了予定スケジュール

| Phase | 期間 | 主要成果物 | 担当 |
|-------|------|------------|------|
| **Phase 1** | Week 1-2 | 共通パターン4件完成 | 設計チーム |
| **Phase 2** | Week 3 | 参照システム構築・テンプレート完成 | 開発チーム |
| **Phase 3** | Week 4-5 | 89ユースケースの段階的移行 | 全チーム |
| **Phase 4** | Week 6 | 自動化ツール・CI/CD統合 | インフラチーム |

### 成功基準
- [ ] **重複削減率**: 70%以上達成
- [ ] **パターン利用率**: 90%以上達成
- [ ] **参照整合性**: 100%達成
- [ ] **CI/CD品質ゲート**: 稼働開始
- [ ] **開発者研修**: 完了

### リスク管理
| リスク | 影響度 | 対策 |
|--------|--------|------|
| 既存ユースケースの移行遅延 | 高 | 優先度付けと段階移行 |
| パターンの設計品質不足 | 中 | レビュープロセス強化 |
| 自動化ツールの不具合 | 中 | 手動フォールバック準備 |

---

このガイドラインの実施により、パラソル設計v2.0のAPI利用仕様重複問題を根本解決し、高品質で保守しやすい設計ドキュメント体系を確立します。

**次のステップ**: Phase 1から実装を開始し、段階的にAPIパターンの共通化を進めてください。