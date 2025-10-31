# 📦 V2サービス構造アーカイブ

**アーカイブ日**: 2025-10-31
**バージョン**: V2.0
**状態**: 🔴 読み取り専用

---

## 📋 このディレクトリについて

このディレクトリは、パラソル設計フレームワーク **V2.0（サービスベース構造）** のアーカイブです。

2025年10月31日、V3.0（ビジネスケーパビリティベース構造）への移行が完了し、V2構造は読み取り専用アーカイブとなりました。

---

## ⚠️ 重要な注意事項

### このアーカイブの利用について

✅ **可能な操作**:
- ドキュメントの閲覧・参照
- 移行履歴の確認
- 過去の設計判断の調査

❌ **禁止事項**:
- ドキュメントの更新・編集
- 新規ドキュメントの作成
- このアーカイブを新規プロジェクトで参照

### 最新情報の参照先

**すべての最新情報は V3構造 を参照してください**:

👉 **[../business-capabilities/](../business-capabilities/)**

---

## 🗂️ アーカイブ内容

### V2サービス一覧（7サービス）

| # | サービス名 | V3移行先 | ファイル数 |
|---|-----------|---------|-----------|
| 1 | collaboration-facilitation-service | BC-007 | ~60 |
| 2 | knowledge-co-creation-service | BC-006 | ~55 |
| 3 | productivity-visualization-service | BC-005（統合） | ~45 |
| 4 | project-success-service | BC-001 | ~85 |
| 5 | revenue-optimization-service | BC-002 | ~65 |
| 6 | secure-access-service | BC-003, BC-004 | ~70 |
| 7 | talent-optimization-service | BC-005 | ~75 |

**合計**: 約414個のMarkdownファイル

---

## 🔄 V2 → V3 移行情報

### サービス → ビジネスケーパビリティ マッピング

| V2サービス | V3 BC | BC名 |
|-----------|-------|------|
| project-success-service | BC-001 | Project Delivery & Quality Management |
| revenue-optimization-service | BC-002 | Financial Health & Profitability |
| secure-access-service (auth) | BC-003 | Access Control & Security |
| secure-access-service (org) | BC-004 | Organizational Structure & Governance |
| talent-optimization-service + productivity-visualization-service | BC-005 | Team & Resource Optimization |
| knowledge-co-creation-service | BC-006 | Knowledge Management & Learning |
| collaboration-facilitation-service | BC-007 | Team Communication & Collaboration |

### 詳細マッピングドキュメント

移行の詳細情報は以下を参照してください：

- **[../MIGRATION_STATUS.md](../MIGRATION_STATUS.md)** - 移行ステータスと完了日
- **[../V2_V3_MAPPING.md](../V2_V3_MAPPING.md)** - Capability/Operation詳細マッピング
- **[../V2_V3_OPERATIONS_SUMMARY.md](../V2_V3_OPERATIONS_SUMMARY.md)** - Operation層の統合・分割情報
- **[../V2_V3_COEXISTENCE_STRATEGY.md](../V2_V3_COEXISTENCE_STRATEGY.md)** - 共存戦略と移行手順

---

## 📊 V2とV3の構造比較

### V2.0構造（このアーカイブ）

```
services/
└── [service-name]/
    ├── service.md
    ├── domain-language.md
    ├── api-specification.md
    └── capabilities/
        └── [capability-name]/
            └── operations/
                └── [operation-name]/
                    └── usecases/
```

**問題点**:
- サービス単位の分割で、BC横断の設計が困難
- L3 CapabilityとOperationが同階層（親子関係が不明確）
- 設計情報がサービスに分散

### V3.0構造（最新）

```
business-capabilities/
└── BC-XXX-[capability-name]/
    ├── README.md              # BC概要（Why-What-How）
    ├── domain/                # ドメイン設計の一元化
    ├── api/                   # API設計の一元化
    ├── data/                  # データ設計の一元化
    └── capabilities/
        └── L3-XXX-[capability-name]/
            ├── README.md
            └── operations/
                └── OP-XXX-[operation-name]/
                    ├── README.md
                    └── usecases/
```

**改善点**:
- BC単位での設計情報の一元管理
- L3（What） ⊃ Operation（How）の明確な親子関係
- Why-What-Howの責務分離の徹底
- スケーラビリティと保守性の向上

---

## 📚 V2構造の設計原則（参考）

このアーカイブのドキュメントは以下の設計原則に基づいています：

### サービスベース設計

1. **サービス中心**: ビジネス機能をサービス単位で分割
2. **Capability層**: サービス配下にCapabilityを配置
3. **Operation層**: Capability配下にOperationを配置
4. **UseCase層**: 具体的な利用シナリオを定義

### ドキュメント構造

- **service.md**: サービス概要とビジネス価値
- **domain-language.md**: ドメイン言語と集約定義
- **api-specification.md**: API仕様（サービスレベル）
- **database-design.md**: データベース設計
- **operation.md**: 操作定義
- **usecase.md**: ユースケース定義
- **page.md**: UI/UX設計

---

## 🎯 V3構造への移行理由

### 主な移行理由

1. **階層構造の誤り修正**:
   - V2: L3 Capability = Operation（同階層）
   - V3: L3 Capability ⊃ Operations（親子関係）

2. **設計品質の向上**:
   - BC単位での設計情報の一元管理
   - Why-What-Howの明確な分離

3. **スケーラビリティの向上**:
   - BC横断の機能開発が容易
   - 再利用性の向上

4. **保守性の向上**:
   - 統一された構造による理解しやすさ
   - 新規開発者のオンボーディング効率化

### 移行の成果

- **7つのBC**に整理（V2の7サービスから）
- **22のL3 Capabilities**を定義
- **64のOperations**を構造化（V2の62から+3%、明確化のため）
- **重複の削除**: 4つの重複Operationを統合

---

## ⏰ アーカイブライフサイクル

| フェーズ | 日付 | 状態 | 説明 |
|---------|------|------|------|
| Phase 0: V3準備 | 2025-10-31 | ✅ 完了 | BC特定、マッピング作成 |
| Phase 1: V3構築 | 2025-10-31 | ✅ 完了 | BC層構造作成 |
| Phase 2: クロスリファレンス | 2025-10-31 | ✅ 完了 | L3層構築、V2リンク追加 |
| Phase 3: 段階的移行 | 2025-10-31 | ✅ 完了 | Operation層構築 |
| **Phase 4: V2アーカイブ** | **2025-10-31** | **✅ 完了** | **V2を読み取り専用化** |
| V2完全削除予定 | 2026-01-31 | ⏳ 予定 | アーカイブから3ヶ月後 |

---

## 🔍 アーカイブの参照方法

### ドキュメント検索

V2構造のドキュメントを検索する場合：

```bash
# このアーカイブ内でキーワード検索
grep -r "検索キーワード" consulting-dashboard-new/docs/parasol/services-v2-archive/

# V3での対応箇所を確認
# ../V2_V3_MAPPING.md を参照してV3の場所を特定
```

### V2 → V3 変換ガイド

V2のパスをV3に変換する方法：

1. **[../V2_V3_MAPPING.md](../V2_V3_MAPPING.md)** でサービス→BCマッピングを確認
2. **該当BCのREADME.md** で詳細な移行情報を確認
3. **V3構造** の該当箇所を参照

例:
```
V2: services/project-success-service/capabilities/plan-and-structure-project/
    ↓
V3: business-capabilities/BC-001-project-delivery-and-quality/capabilities/L3-001-project-planning-and-structure/
```

---

## 📝 アーカイブ保持理由

このアーカイブは以下の目的で保持されています：

1. **移行トレーサビリティ**: V2→V3の変更履歴を追跡
2. **参考情報**: 過去の設計判断や議論の経緯を確認
3. **監査対応**: 設計変更の正当性を説明
4. **ナレッジ保持**: V2時代のベストプラクティス参照
5. **緊急時対応**: 万が一の際のバックアップ情報

---

## 🎯 よくある質問（FAQ）

### Q1: V2のドキュメントを更新したい
**A**: V2は読み取り専用です。V3構造の該当箇所を更新してください。

### Q2: V2のUseCaseをどうやってV3で見つける？
**A**: [../V2_V3_MAPPING.md](../V2_V3_MAPPING.md)でマッピングを確認してください。

### Q3: V2構造を新規プロジェクトで使える？
**A**: いいえ。すべての新規開発はV3構造を使用してください。

### Q4: このアーカイブはいつ削除される？
**A**: 2026年1月31日（アーカイブから3ヶ月後）を予定しています。

### Q5: V2に戻したい場合は？
**A**: アーカイブから参照は可能ですが、V3への移行完了後の戻しは推奨しません。問題がある場合はV3構造を改善してください。

---

## 📞 サポート

移行に関する質問やV3構造の問題は、以下を参照してください：

- **移行ステータス**: [../MIGRATION_STATUS.md](../MIGRATION_STATUS.md)
- **移行計画**: [../../v3-migration-github-issue.md](../../v3-migration-github-issue.md)
- **共存戦略**: [../V2_V3_COEXISTENCE_STRATEGY.md](../V2_V3_COEXISTENCE_STRATEGY.md)

---

## 📜 アーカイブメタデータ

| 項目 | 値 |
|------|-----|
| アーカイブ作成日 | 2025-10-31 |
| 元のバージョン | V2.0 |
| サービス数 | 7 |
| ファイル数 | 約414 |
| 移行先バージョン | V3.0 |
| BC数 | 7 |
| L3数 | 22 |
| Operation数 | 64 |
| 削除予定日 | 2026-01-31 |

---

**V3構造をご利用ください**: [../business-capabilities/](../business-capabilities/)

**このアーカイブは2026年1月31日に削除予定です。**
