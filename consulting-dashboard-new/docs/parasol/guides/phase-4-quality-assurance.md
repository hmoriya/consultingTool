# Phase 4: 品質保証と統合

**Phase**: 4/4
**目的**: パラソル設計の品質検証と統合テスト
**前提**: [Phase 3: 実装設計](./phase-3-implementation-design.md) が完了していること
**次**: [継続的改善](./continuous-improvement.md)

---

## 📋 Phase 4 概要

Phase 4では、Phase 1-3で作成した設計成果物の品質を検証し、統合テストを実施します。

### Phase 4の成果物

- 品質チェックレポート
- 統合テスト結果
- リリース判定書

### 所要時間

- 標準: 1週間
- 小規模サービス: 3-5日
- 大規模サービス: 2週間

---

## Step 4.1: 段階別品質チェック

### Level 1: 設計時品質チェック

#### v2.0仕様適用確認

```bash
# v2.0仕様適用確認
grep -q "## パラソルドメイン連携" operation.md
grep -q "ユースケース・ページ分解マトリックス" operation.md

# 1対1関係確認
usecase_count=$(find usecases -name "usecase.md" | wc -l)
page_count=$(find usecases -name "page.md" | wc -l)
# usecase_count == page_count の確認
```

#### チェック項目

- [ ] パラソルドメイン連携セクションが存在する
- [ ] ユースケース・ページ分解マトリックスが存在する
- [ ] ユースケースとページが1対1対応している
- [ ] 3要素記法が一貫して使用されている

### Level 2: 実装時品質チェック

#### パラソルドメイン連携APIの実装確認

```bash
# パラソルドメイン連携APIの実装確認
find app/api -name "*.ts" | xargs grep -l "parasol"

# 他サービスユースケース利用の実装確認
find app/api -name "*.ts" | xargs grep -l "POST /api/.*usecases"
```

#### チェック項目

- [ ] パラソルドメイン言語がコードに反映されている
- [ ] ユースケース指向のAPIが実装されている
- [ ] 他サービスはユースケース呼び出し型で連携している
- [ ] エンティティ直接参照が存在しない

### Level 3: 統合品質チェック

#### エンドツーエンドテスト

```bash
# エンドツーエンドテスト
npm run test:e2e -- --grep "v2.0"

# パフォーマンステスト
npm run test:performance -- --grep "parasol"
```

#### チェック項目

- [ ] 全ユースケースのE2Eテストが成功する
- [ ] サービス間連携が正常に動作する
- [ ] パフォーマンス要件を満たしている
- [ ] セキュリティ要件を満たしている

---

## Step 4.2: 自動品質チェック

### pre-commit フック

```bash
#!/bin/bash
# パラソル設計品質チェック
echo "🔍 パラソル設計v2.0品質チェック実行中..."

# 必須セクション確認
required_sections=("パラソルドメイン連携" "ユースケース・ページ分解マトリックス")
for section in "${required_sections[@]}"; do
  if ! grep -q "$section" operation.md; then
    echo "❌ 必須セクション不足: $section"
    exit 1
  fi
done

echo "✅ 品質チェック完了"
```

### CI/CD パイプライン

```yaml
# .github/workflows/parasol-quality-check.yml
- name: パラソル設計v2.0仕様チェック
  run: |
    total=$(find docs/parasol -name "operation.md" | wc -l)
    v2_compliant=$(grep -l "パラソルドメイン連携" docs/parasol/services/*/capabilities/*/operations/*/operation.md | wc -l)
    score=$((v2_compliant * 100 / total))

    echo "パラソル設計v2.0適用率: $score%"

    if [ $score -lt 80 ]; then
      echo "❌ 品質スコアが基準(80%)を下回りました"
      exit 1
    fi
```

---

## 品質評価基準

### 設計品質スコア

| 評価項目 | 配点 | 合格基準 |
|---------|------|----------|
| v2.0仕様準拠 | 30% | 95%以上 |
| 1対1関係達成 | 20% | 98%以上 |
| 3要素記法一貫性 | 15% | 100% |
| ビジネス価値表現 | 15% | 80%以上 |
| 実装非依存性 | 10% | 90%以上 |
| ドキュメント完全性 | 10% | 95%以上 |
| **総合スコア** | **100%** | **85%以上** |

### 品質ランク

- **🥇 Excellent (90%以上)**: そのままリリース可能
- **🥈 Good (85-89%)**: 軽微な修正後リリース可能
- **🥉 Acceptable (80-84%)**: 改善が推奨されるがリリース可
- **❌ Needs Improvement (80%未満)**: 改善必須

---

## 統合テストシナリオ

### シナリオ1: ユースケース実行フロー

```gherkin
Feature: プロジェクト成功支援サービス

Scenario: プロジェクトを立ち上げる
  Given ユーザーがログインしている
  When プロジェクト提案を作成する
  And プロジェクト承認を申請する
  And 承認者がプロジェクトを承認する
  Then プロジェクトが開始状態になる
  And タスク分解が可能になる
```

### シナリオ2: サービス間連携

```gherkin
Feature: サービス間連携（ユースケース利用型）

Scenario: プロジェクト作成時の認証とナレッジ記録
  Given ユーザーがログインしている
  When プロジェクト作成ユースケースを実行する
  Then セキュアアクセスサービスの認証ユースケースが呼ばれる
  And ナレッジ共創サービスの記録ユースケースが呼ばれる
  And プロジェクトが正常に作成される
```

---

## Phase 4 完了チェックリスト

### 品質チェック

- [ ] Level 1: 設計時品質チェックが完了している
- [ ] Level 2: 実装時品質チェックが完了している
- [ ] Level 3: 統合品質チェックが完了している
- [ ] 品質スコアが85%以上である

### 自動化

- [ ] pre-commitフックが設定されている
- [ ] CI/CDパイプラインが設定されている
- [ ] 自動品質チェックが正常に動作している

### テスト

- [ ] E2Eテストが全て成功している
- [ ] パフォーマンステストが基準を満たしている
- [ ] セキュリティテストが基準を満たしている
- [ ] サービス間連携テストが成功している

### リリース判定

- [ ] 品質基準を満たしている
- [ ] ステークホルダーの承認が得られている
- [ ] リリース計画が策定されている
- [ ] ロールバック計画が準備されている

---

## 次のステップ

Phase 4が完了したら、[継続的改善](./continuous-improvement.md) に進み、PDCAサイクルを回して設計プロセスを継続的に改善します。

---

## 関連リソース

- [メインガイド](./README.md)
- [Phase 3: 実装設計](./phase-3-implementation-design.md)
- [品質保証ガイド（詳細版）](../parasol-quality-assurance-guide.md)
- [PARASOL_DEVELOPMENT_GUIDE](../PARASOL_DEVELOPMENT_GUIDE.md)
