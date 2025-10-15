# パラソル設計v2.0: API仕様WHAT/HOW分離統一化ガイド

**更新日**: 2025-10-13
**対応Issue**: [GitHub Issue #146](https://github.com/hmoriya/consultingTool/issues/146)
**ステータス**: 緊急実施中

## 🎯 統一化の目的

同一サービス内に混在する複数レベルのAPI仕様を整理し、利用者の混乱を完全に解消することで、パラソル設計の実用性を劇的に向上させる。

## 📊 現状分析（2025-10-13時点）

### 混在問題の数値
- **総ユースケース数**: 89個
- **api-usage.mdファイル**: 5個のみ（**94.4%不足**）
- **重複API仕様**: 同一サービス内でv1.0とv2.0が混在
- **利用者混乱度**: 3つのレベルから適切な仕様を選択困難

### 混在パターンの具体例
```
knowledge-co-creation-service/
├── api-specification.md                    # ❌ レベル1: 旧仕様（廃止予定）
├── api/
│   └── api-specification.md                # ✅ レベル2: 新仕様（WHAT）
└── capabilities/.../usecases/.../
    └── api-usage.md                        # ⚠️ レベル3: 利用仕様（HOW・不足）
```

## 🛠️ WHAT/HOW分離の原則

### 基本分離ルール

| 分離レベル | ファイル配置 | 役割 | 対象読者 | 更新頻度 |
|-----------|-------------|------|----------|----------|
| **WHAT** | `services/[service]/api/api-specification.md` | サービス能力定義 | API設計者・アーキテクト | 低（機能追加時） |
| **HOW** | `services/[service]/.../usecases/[usecase]/api-usage.md` | 具体的利用方法 | 実装エンジニア | 高（実装改善時） |

### 責務分担の詳細

#### WHAT（何ができるか）: `api/api-specification.md`
```markdown
# 含むべき内容
✅ パラソルドメイン連携仕様
✅ 他サービスユースケース利用型
✅ エンドポイント概要（詳細は endpoints/ に分割）
✅ 認証・認可方式
✅ SLA・レート制限・制約
✅ セキュリティ・コンプライアンス仕様
✅ WebSocketエンドポイント
✅ エラーコード体系

# 含まないべき内容
❌ 具体的なAPI呼び出しシーケンス
❌ ユースケース固有のエラーハンドリング
❌ パフォーマンス最適化手法
❌ 実装レベルの詳細手順
```

#### HOW（どう使うか）: `usecases/[usecase]/api-usage.md`
```markdown
# 含むべき内容
✅ API呼び出しシーケンス（基本・代替・例外フロー）
✅ 自サービスAPI + 他サービスユースケース利用
✅ エラーハンドリング戦略
✅ リトライ・復旧戦略
✅ パフォーマンス最適化手法
✅ WebSocketリアルタイム更新
✅ 品質保証指標
✅ レスポンス時間目標

# 含まないべき内容
❌ API仕様の技術的詳細
❌ 他ユースケースでの利用方法
❌ サービス全体のSLA
❌ 全体的なセキュリティ方針
```

## 📋 統一化実施手順

### Phase 1: 緊急対応（1週間）

#### 1.1 旧API仕様の段階的廃止
```bash
# 1. バックアップ作成
mkdir -p docs/parasol/services/*/archived/

# 2. 旧仕様の移動
for service in docs/parasol/services/*/; do
    if [ -f "$service/api-specification.md" ] && [ -f "$service/api/api-specification.md" ]; then
        echo "移動: $service/api-specification.md → $service/archived/"
        mv "$service/api-specification.md" "$service/archived/api-specification-v1-archived-$(date +%Y%m%d).md"
    fi
done
```

#### 1.2 混在状況の全体確認
```bash
# 現状確認スクリプト
echo "=== API仕様混在状況確認 ==="
echo "旧仕様（廃止対象）:"
find docs/parasol/services -name "api-specification.md" -not -path "*/api/*" | wc -l

echo "新仕様（WHAT）:"
find docs/parasol/services -path "*/api/api-specification.md" | wc -l

echo "利用仕様（HOW）:"
find docs/parasol/services -name "api-usage.md" | wc -l

echo "ユースケース総数:"
find docs/parasol/services -name "usecase.md" | wc -l
```

### Phase 2: 統一化実施（2週間）

#### 2.1 優先度順サービス対応

##### 🔴 最高優先度
1. **secure-access-service** (認証基盤・他サービス依存度高)
   - 13個のユースケース → 13個のapi-usage.md作成
   - 他サービスから最も利用される

2. **collaboration-facilitation-service** (通信基盤)
   - 12個のユースケース → 12個のapi-usage.md作成
   - 通知・コミュニケーション機能

##### 🟡 高優先度
3. **project-success-service** (ビジネス中核)
   - 35個のユースケース → 35個のapi-usage.md作成
   - 業務プロセスの中心機能

##### 🟢 中優先度
4. **talent-optimization-service** (8個)
5. **revenue-optimization-service** (9個)
6. **productivity-visualization-service** (7個)

#### 2.2 api-usage.md作成の標準プロセス

```bash
# 1. テンプレート適用
cp templates/dx-api-usage.md "docs/parasol/services/$service/capabilities/$capability/operations/$operation/usecases/$usecase/api-usage.md"

# 2. ユースケース固有情報の記入
# - [ユースケース名]: usecase.mdから取得
# - 自サービスAPI: 対応するapi-specification.mdから抽出
# - 他サービス連携: パラソルドメイン連携から特定
# - API呼び出しシーケンス: ビジネスフローから構築

# 3. 品質チェック
# - テンプレートの全セクション記入完了
# - 他サービス連携がユースケース経由
# - エラーハンドリング・パフォーマンス要件記載
```

### Phase 3: 品質保証（1週間）

#### 3.1 統一化品質チェック
```bash
# 自動チェックスクリプト
#!/bin/bash
echo "=== WHAT/HOW分離品質チェック ==="

# WHAT仕様の確認
echo "1. WHAT仕様の存在確認:"
for service in docs/parasol/services/*/; do
    if [ ! -f "$service/api/api-specification.md" ]; then
        echo "❌ 不足: $service/api/api-specification.md"
    fi
done

# HOW仕様の確認
echo "2. HOW仕様の網羅性確認:"
usecase_count=$(find docs/parasol/services -name "usecase.md" | wc -l)
apiusage_count=$(find docs/parasol/services -name "api-usage.md" | wc -l)
echo "ユースケース: $usecase_count, API利用仕様: $apiusage_count"

if [ $usecase_count -eq $apiusage_count ]; then
    echo "✅ HOW仕様100%達成"
else
    echo "⚠️ HOW仕様不足: $((usecase_count - apiusage_count))個"
fi

# 旧仕様の残存確認
echo "3. 旧仕様の残存確認:"
old_specs=$(find docs/parasol/services -name "api-specification.md" -not -path "*/api/*" | wc -l)
if [ $old_specs -eq 0 ]; then
    echo "✅ 旧仕様完全廃止"
else
    echo "❌ 旧仕様残存: $old_specs個"
fi
```

#### 3.2 CI/CD自動検証の実装
```yaml
# .github/workflows/api-what-how-separation-check.yml
name: API WHAT/HOW Separation Quality Check

on: [push, pull_request]

jobs:
  what-how-separation-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: WHAT仕様存在確認
        run: |
          for service in docs/parasol/services/*/; do
            if [ ! -f "$service/api/api-specification.md" ]; then
              echo "❌ 不足: $service/api/api-specification.md"
              exit 1
            fi
          done
          echo "✅ 全サービスのWHAT仕様存在確認完了"

      - name: HOW仕様網羅性確認
        run: |
          usecase_count=$(find docs/parasol/services -name "usecase.md" | wc -l)
          apiusage_count=$(find docs/parasol/services -name "api-usage.md" | wc -l)

          if [ $usecase_count -ne $apiusage_count ]; then
            echo "❌ HOW仕様不足: $((usecase_count - apiusage_count))個"
            exit 1
          fi
          echo "✅ HOW仕様100%達成"

      - name: 旧仕様残存確認
        run: |
          old_specs=$(find docs/parasol/services -name "api-specification.md" -not -path "*/api/*" | wc -l)
          if [ $old_specs -ne 0 ]; then
            echo "❌ 旧仕様残存: $old_specs個"
            exit 1
          fi
          echo "✅ 旧仕様完全廃止確認"
```

## 🎯 利用者向けガイドライン

### 利用者の質問別参照ガイド

| 利用者の質問 | 参照すべきファイル | 期待される回答例 |
|-------------|------------------|-----------------|
| 「このサービスは何ができるの？」 | `api/api-specification.md` | • パラソルドメイン連携能力<br>• 他サービスとの連携方法<br>• SLA・制約・セキュリティ仕様 |
| 「具体的なエンドポイントは？」 | `api/endpoints/[function].md` | • RESTful APIの詳細仕様<br>• リクエスト・レスポンス形式<br>• 認証・認可方法 |
| 「このユースケースの実装方法は？」 | `usecases/[usecase]/api-usage.md` | • API呼び出しシーケンス<br>• エラーハンドリング方法<br>• 最適化手法 |
| 「他サービスとどう連携する？」 | `api/api-specification.md` + `api-usage.md` | • 他サービスユースケース利用型<br>• 具体的な連携パターン |

### API仕様作成者向けのベストプラクティス

#### WHAT仕様作成時
```markdown
✅ DO（推奨）
- パラソルドメイン連携を必ず記載
- 他サービスとの連携はユースケース利用型で定義
- エンドポイント詳細は endpoints/ に分割
- セキュリティ・SLA仕様を明確化

❌ DON'T（非推奨）
- 具体的な実装手順を詳細記載
- 特定ユースケースでの利用例を混入
- 他サービスのエンティティ直接参照
```

#### HOW仕様作成時
```markdown
✅ DO（推奨）
- テンプレート（dx-api-usage.md）を必ず使用
- API呼び出しシーケンスを具体的に記載
- エラーハンドリング・リトライ戦略を詳細化
- パフォーマンス要件を数値で明記

❌ DON'T（非推奨）
- 他ユースケースでの利用方法を記載
- サービス全体のSLA仕様を重複記載
- API仕様の技術詳細を再記載
```

## 📊 統一化効果の測定指標

### 定量的指標

| 指標名 | 統一化前 | 統一化後（目標） | 測定方法 |
|--------|----------|-----------------|----------|
| **API利用仕様充足率** | 5.6% (5/89) | 100% (89/89) | `find -name "api-usage.md" \| wc -l` |
| **API仕様重複数** | 7件 | 0件 | 旧仕様ファイル数 |
| **利用者混乱解消率** | 0% | 100% | 明確な役割分離 |
| **実装時の仕様参照時間** | 平均15分 | 平均6分（60%短縮） | 利用者アンケート |

### 定性的指標

| 指標名 | 評価方法 | 期待される改善 |
|--------|----------|---------------|
| **利用者体験満足度** | 5段階評価アンケート | 2.5 → 4.5 |
| **実装品質一貫性** | コードレビュー評価 | B → A |
| **保守性向上度** | 変更影響分析 | 50%工数削減 |

## 🚀 次期発展計画

### Phase 4: 高度化（1ヶ月後）
- **自動API仕様生成**: OpenAPI仕様からの自動生成
- **ユースケース連動**: ユースケース変更時のAPI利用仕様自動更新
- **品質スコアリング**: API仕様の品質自動評価

### Phase 5: 統合化（3ヶ月後）
- **実装コード生成**: API利用仕様からの実装コード自動生成
- **テストケース生成**: エラーハンドリング仕様からのテスト自動生成
- **監視仕様生成**: SLA仕様からの監視設定自動生成

## 📚 関連資料

- **GitHub Issue**: [#146 - API仕様混在問題の解決とWHAT/HOW分離統一化](https://github.com/hmoriya/consultingTool/issues/146)
- **テンプレート**: `templates/dx-api-usage.md`
- **パラソル設計v2.0仕様**: `CLAUDE.md#パラソル設計v2.0`
- **高品質事例**: `knowledge-co-creation-service/capabilities/.../api-usage.md`

## ✅ チェックリスト

### 実装者向けチェックリスト
- [ ] 旧API仕様を archived/ に移動済み
- [ ] 全サービスで api/api-specification.md 存在確認
- [ ] 全ユースケースで api-usage.md 作成完了
- [ ] WHAT/HOW分離原則に準拠
- [ ] CI/CD品質チェック実装済み

### 利用者向けチェックリスト
- [ ] 質問に応じた適切なファイル参照方法を理解
- [ ] WHAT（能力）とHOW（利用方法）の区別を把握
- [ ] 実装時のAPI利用仕様参照フローを習得

---

**この統一化により、パラソル設計API仕様の利用者体験が劇的に改善され、混乱のない明確な設計環境が実現されます。**