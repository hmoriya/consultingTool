# 📦 V2サービス構造アーカイブ通知

**アーカイブ日**: 2025-10-31
**状態**: 🔴 読み取り専用（アーカイブ）

---

## ⚠️ 重要なお知らせ

このディレクトリ（`services/`）は、パラソル設計フレームワークV2.0の構造を保持しています。

**V3.0への移行が完了しました。今後は新しいV3構造をご利用ください。**

---

## 🔄 V3構造への移行

### 新しい参照先

すべてのビジネスケーパビリティは以下のV3構造に移行されました：

```
docs/parasol/business-capabilities/
├── BC-001-project-delivery-and-quality/
├── BC-002-financial-health-and-profitability/
├── BC-003-access-control-and-security/
├── BC-004-organizational-structure-and-governance/
├── BC-005-team-and-resource-optimization/
├── BC-006-knowledge-management-and-learning/
└── BC-007-team-communication-and-collaboration/
```

### V2 → V3 サービスマッピング

| V2サービス | V3 ビジネスケーパビリティ | 参照先 |
|-----------|------------------------|--------|
| project-success-service | BC-001 | [BC-001](../business-capabilities/BC-001-project-delivery-and-quality/) |
| revenue-optimization-service | BC-002 | [BC-002](../business-capabilities/BC-002-financial-health-and-profitability/) |
| secure-access-service | BC-003, BC-004 | [BC-003](../business-capabilities/BC-003-access-control-and-security/), [BC-004](../business-capabilities/BC-004-organizational-structure-and-governance/) |
| talent-optimization-service | BC-005 | [BC-005](../business-capabilities/BC-005-team-and-resource-optimization/) |
| productivity-visualization-service | BC-005 (統合) | [BC-005](../business-capabilities/BC-005-team-and-resource-optimization/) |
| knowledge-co-creation-service | BC-006 | [BC-006](../business-capabilities/BC-006-knowledge-management-and-learning/) |
| collaboration-facilitation-service | BC-007 | [BC-007](../business-capabilities/BC-007-team-communication-and-collaboration/) |

---

## 📚 詳細な移行情報

### マッピングドキュメント

V2からV3への詳細なマッピング情報は以下のドキュメントを参照してください：

- **[MIGRATION_STATUS.md](../MIGRATION_STATUS.md)** - 移行ステータスと進捗
- **[V2_V3_MAPPING.md](../V2_V3_MAPPING.md)** - 詳細マッピング表
- **[V2_V3_OPERATIONS_SUMMARY.md](../V2_V3_OPERATIONS_SUMMARY.md)** - Operation層マッピング
- **[V2_V3_COEXISTENCE_STRATEGY.md](../V2_V3_COEXISTENCE_STRATEGY.md)** - 共存戦略

### V3構造の特徴

V3.0構造では、以下の改善が行われました：

1. **階層構造の明確化**: BC層 ⊃ L3 Capability層 ⊃ Operation層
2. **Why-What-Howの責務分離**: 各層の役割が明確
3. **設計情報の一元化**: BC層にdomain/api/dataを集約
4. **スケーラビリティの向上**: BC単位での管理

---

## 🔍 このアーカイブの利用目的

このV2構造は以下の目的で保持されています：

1. **移行履歴の保持**: V2からV3への変遷を追跡
2. **参考情報**: 過去の設計判断や経緯の確認
3. **ロールバック**: 万が一の際のバックアップ

**注意**: このディレクトリのドキュメントは更新されません。最新情報はV3構造を参照してください。

---

## ⏰ アーカイブスケジュール

| フェーズ | 期間 | 状態 |
|---------|------|------|
| Phase 0: 準備 | 2025-10-31 | ✅ 完了 |
| Phase 1: 並行構築 | 2025-10-31 | ✅ 完了 |
| Phase 2: クロスリファレンス | 2025-10-31 | ✅ 完了 |
| Phase 3: 段階的移行 | 2025-10-31 | ✅ 完了 |
| Phase 4: V2アーカイブ | 2025-10-31 | ✅ 完了 |

**アーカイブ完了日**: 2025-10-31

---

## 🎯 次のステップ

新しい機能開発やドキュメント作成は、V3構造をご利用ください：

👉 **[business-capabilities/](../business-capabilities/)** に移動

問題や質問がある場合は、[MIGRATION_STATUS.md](../MIGRATION_STATUS.md)を確認してください。

---

**V2構造の完全削除予定**: 2026年1月31日（アーカイブから3ヶ月後）
