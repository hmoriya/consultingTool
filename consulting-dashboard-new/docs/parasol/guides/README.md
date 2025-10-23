# パラソル開発統合設計プロセスガイド

**作成日**: 2025-10-10
**更新日**: 2025-10-23
**バージョン**: 2.0.0
**目的**: パラソル開発の真髄である体系的設計手順の確立

---

## 📖 ガイド構成

本ガイドは、パラソル開発プロセスをPhase別に分割して提供しています。

### Phase別ガイド

| Phase | ガイドファイル | 内容 |
|-------|--------------|------|
| **Phase 0** | [phase-0-business-analysis.md](./phase-0-business-analysis.md) | ビジネス分析・要求定義（バリューストリーム分析、As-Is/To-Be） |
| **Phase 1** | [phase-1-basic-design.md](./phase-1-basic-design.md) | 基本設計（サービス定義、ケーパビリティ、オペレーション設計） |
| **Phase 2** | [phase-2-detailed-design.md](./phase-2-detailed-design.md) | 詳細設計（ドメイン言語、ユースケース、ページ・API設計） |
| **Phase 3** | [phase-3-implementation-design.md](./phase-3-implementation-design.md) | 実装設計（データベース、ロバストネス図、テスト仕様） |
| **Phase 4** | [phase-4-quality-assurance.md](./phase-4-quality-assurance.md) | 品質保証と統合（品質チェック、統合テスト） |
| **継続改善** | [continuous-improvement.md](./continuous-improvement.md) | 継続的改善、育成プログラム、まとめ |

---

## 🎯 パラソル開発の核心原則

> **パラソル開発の真髄**: ビジネス価値を起点とした段階的詳細化による、実装非依存の高品質設計

### 基本思想

1. **ビジネス価値駆動**: 技術ありきではなく、ビジネス価値を起点とした設計
2. **段階的詳細化**: 大きな概念から具体的な実装へと段階的に詳細化
3. **実装非依存**: 特定の技術に依存しない中間言語による設計
4. **品質内在**: 各段階で品質を作り込み、後戻りを最小化

---

## 📐 パラソル設計の階層構造

```
🔍 ビジネス分析層（Phase 0）
  └── バリューストリーム分析・As-Is/To-Be
      ↓
🏢 サービス層（Phase 1）
  └── 🎯 ビジネスケーパビリティ層
      └── ⚙️ ビジネスオペレーション層
          ↓
🎬 ユースケース層（Phase 2）
  └── 📄 ページ・API層
      ↓
💾 実装層（Phase 3）
  └── データベース・コード
      ↓
🔍 品質保証層（Phase 4）
  └── テスト・統合検証
```

### 各層の責務と成果物

| Phase | 層 | 責務 | 主な成果物 | 品質基準 |
|-------|---|-----|-----------|----------|
| **Phase 0** | **ビジネス分析** | 現状分析・要求定義 | VSM、As-Is/To-Be | 要求の明確性 |
| **Phase 1** | **サービス** | ビジネス価値の定義 | サービス定義書 | 価値の明確性 |
| **Phase 1** | **ケーパビリティ** | 組織能力の体系化 | ケーパビリティマップ | 能力の完全性 |
| **Phase 1** | **オペレーション** | 業務プロセスの設計 | オペレーション設計書（v2.0） | プロセスの最適性 |
| **Phase 2** | **ユースケース** | システム機能の定義 | ユースケース仕様書 | 機能の完全性 |
| **Phase 2** | **ページ・API** | インターフェース設計 | ページ定義・API仕様 | インターフェースの使いやすさ |
| **Phase 3** | **実装** | 技術的実現 | ソースコード・DB | 実装品質 |
| **Phase 4** | **品質保証** | 品質検証・統合 | テスト結果・品質レポート | 品質基準達成 |

---

## 🚀 開発プロセスの流れ

### 標準的な開発フロー

```
Phase 0: ビジネス分析・要求定義（1-2週間）
  ↓
Phase 1: 基本設計（2週間）
  ↓
Phase 2: 詳細設計（2週間）
  ↓
Phase 3: 実装設計（1週間）
  ↓
Phase 4: 品質保証（1週間）
  ↓
継続的改善サイクル（PDCA）
```

### Phase 0から始める意義

従来のパラソル開発ガイドはPhase 1（サービス定義）から開始していましたが、**実際のプロジェクトではビジネス分析が必須**です。Phase 0では：

- **バリューストリームマッピング（VSM）**: 現状の価値の流れを可視化
- **As-Is分析**: 現行業務プロセスの詳細調査と課題抽出
- **To-Be設計**: 理想的な業務プロセスとビジネス価値の定義
- **ギャップ分析**: As-Is/To-Beの差分から優先順位を決定

これにより、**明確なビジネス価値を起点とした設計**が可能になります。

---

## 📚 関連ドキュメント

### 仕様書
- [ビジネスオペレーション仕様書](../../design/parasol/specifications/business-operation-spec.md)
- [ドメイン言語仕様書](../../design/parasol/specifications/domain-language-spec.md)
- [ユースケース仕様書](../../design/parasol/specifications/use-case-spec.md)

### テンプレート
- [DXサービス定義](../../templates/dx-service-definition.md)
- [ビジネスケーパビリティ](../../templates/dx-business-capability.md)
- [ビジネスオペレーション（v2.0）](../../templates/business-operation-enhanced-template.md)
- [パラソルドメイン言語（v2.0）](../../templates/parasol-domain-language-v2.md)
- [ユースケース定義](../../templates/dx-usecase-definition.md)
- [ページ定義](../../templates/dx-page-definition.md)

### 品質保証
- [品質保証ガイド](../parasol-quality-assurance-guide.md)
- [構造定義](../PARASOL_STRUCTURE.md)

---

## 🎓 学習パス

### 初学者向け

1. **本README** を読んで全体像を理解
2. **[Phase 0](./phase-0-business-analysis.md)** でビジネス分析手法を学ぶ
3. **[Phase 1](./phase-1-basic-design.md)** で基本設計を実践
4. **[Phase 2](./phase-2-detailed-design.md)** で詳細設計を学ぶ

### 経験者向け

- 各Phaseガイドを必要に応じて参照
- [品質保証ガイド](../parasol-quality-assurance-guide.md) で品質向上
- [継続的改善](./continuous-improvement.md) で手順を最適化

---

## 🚀 まとめ：パラソル開発の成功要因

### 成功の条件

1. **ビジネス価値を起点とした設計思考**
2. **段階的詳細化による品質作り込み**
3. **v2.0仕様の厳格な適用**
4. **継続的な品質チェック**
5. **チーム全体での設計手順の共有**

### パラソル開発の真髄

> **「設計手順こそがパラソル開発の真髄」**
>
> 優れた設計手順により、ビジネス価値を確実に技術実装へと変換し、
> 継続的に価値を創出し続けるシステムを構築する。

---

**次のアクション**: [Phase 0: ビジネス分析・要求定義](./phase-0-business-analysis.md) から開始し、実際のプロジェクトでの設計実践を進めてください。
