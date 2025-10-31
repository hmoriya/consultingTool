# BC-007: Team Communication & Collaboration

**作成日**: 2025-10-31
**バージョン**: 1.0.0 (v3.0)
**移行元**: collaboration-facilitation-service (V2)

---

## 🎯 Why: ビジネス価値

このBCが解決するビジネス課題:
- コミュニケーションの遅延による意思決定の遅れ
- 情報の分散による見落としや重複作業
- 非同期コミュニケーションの効率性不足
- 緊急時の通知の遅延
- コラボレーション環境の分散

提供するビジネス価値:
- **リアルタイム連携**: 同期的コミュニケーションにより、迅速な意思決定を実現
- **情報の一元化**: 統合された通知により、重要情報の見落としを防止
- **効率的な非同期通信**: 通知の優先度管理により、情報過多を防止
- **緊急対応の迅速化**: 即座通知により、クリティカルな問題に即座対応
- **コラボレーション促進**: 統合されたワークスペースにより、チーム連携を強化

---

## 📋 What: 機能（L3能力）

このBCが提供する能力:

### L3-001: Synchronous Communication
**能力**: リアルタイムにコミュニケーションする
- コミュニケーションの促進
- 会議の管理
- リアルタイムメッセージング
- 詳細: [capabilities/L3-001-synchronous-communication/](capabilities/L3-001-synchronous-communication/)

### L3-002: Asynchronous Communication & Notifications
**能力**: 非同期に情報を伝達し、通知する
- 一般通知の配信
- 緊急通知の配信
- 通知の管理と設定
- 詳細: [capabilities/L3-002-asynchronous-communication-and-notifications/](capabilities/L3-002-asynchronous-communication-and-notifications/)

### L3-003: Collaborative Workspace
**能力**: コラボレーション環境を提供する
- 共有ワークスペースの提供
- ドキュメント共同編集
- コメントとフィードバック
- 詳細: [capabilities/L3-003-collaborative-workspace/](capabilities/L3-003-collaborative-workspace/)

---

## 🏗️ How: 設計方針

### ドメイン設計
- [domain/README.md](domain/README.md)
- **主要集約**: Message Aggregate, Notification Aggregate, Workspace Aggregate
- **主要エンティティ**: Message, Notification, Meeting, Workspace, Comment
- **主要値オブジェクト**: NotificationPriority, MessageContent, WorkspacePermission

**V2からの移行**:
- `services/collaboration-facilitation-service/domain-language.md` → `domain/`へ分割整理
- 通知機能の統合（communication-delivery + deliver-immediate-information）

### API設計
- [api/README.md](api/README.md)
- **API仕様**: [api/api-specification.md](api/api-specification.md) ← Issue #146対応済み
- **エンドポイント**: [api/endpoints/](api/endpoints/)
- **スキーマ**: [api/schemas/](api/schemas/)

**V2からの移行**:
- `services/collaboration-facilitation-service/api/api-specification.md` → `api/api-specification.md`
- Issue #146のWHAT/HOW分離構造を維持

### データ設計
- [data/README.md](data/README.md)
- **データベース設計**: [data/database-design.md](data/database-design.md)
- **主要テーブル**: messages, notifications, meetings, workspaces, comments
- **データフロー**: [data/data-flow.md](data/data-flow.md)

**V2からの移行**:
- `services/collaboration-facilitation-service/database-design.md` → `data/database-design.md`

---

## 📦 BC境界

### トランザクション境界
- **BC内のL3/Operation間**: 強整合性
  - Message → Notification の配信整合性
  - Meeting → Notification の通知整合性
- **BC間**: 結果整合性（イベント駆動）
  - 全BCからの通知要求受信

### 他BCとの連携

#### 全BC共通（BC-001～BC-006）
- **連携内容**: 通知配信サービスの提供
- **連携方向**: 全BC → BC-007（通知要求）
- **連携方式**: ユースケース呼び出し型（通知配信API）

#### 主要な通知シナリオ例
- **BC-001**: プロジェクトマイルストーン達成通知、リスクアラート
- **BC-002**: 予算超過アラート、請求書発行通知
- **BC-003**: セキュリティアラート、不正アクセス通知
- **BC-004**: 組織変更通知
- **BC-005**: タイムシート承認依頼、パフォーマンス評価通知
- **BC-006**: 新規ナレッジ公開通知

---

## 📊 統計情報

### V2からの移行統計
- **V2 Capabilities**: 3個
- **V3 L3 Capabilities**: 2-3個（通知統合により-1）
- **Operations数**: 4-5個
- **統合アクション**:
  - ✅ 「deliver-immediate-information」を「send-notification」に統合
  - ✅ 通知をSLAで分割（一般通知 vs 緊急通知）

### 規模
- **L3 Capabilities**: 2-3個（ガイドライン準拠）
- **1 L3あたりOperation数**: 1.7-2.5個（ガイドライン準拠）
- **推定UseCase数**: 6-10個

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このBCはV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/collaboration-facilitation-service/](../../services/collaboration-facilitation-service/)
>
> V2構造は2026年1月まで参照可能です（読み取り専用）。

### V2 Capabilityマッピング

| V2 Capability | V3 L3 Capability | 備考 |
|--------------|------------------|------|
| communication-delivery | L3-001: Synchronous Communication | 同期通信部分 |
| communication-delivery + deliver-immediate-information | L3-002: Asynchronous Communication & Notifications | 非同期通信統合 |
| provide-collaborative-environment | L3-003: Collaborative Workspace | L4候補 |

---

## ✅ 品質基準

### 成功指標
- [ ] 通知配信成功率 ≥ 99.9%
- [ ] 緊急通知配信時間 ≤ 10秒
- [ ] 一般通知配信時間 ≤ 1分
- [ ] メッセージ到達率 = 100%
- [ ] ユーザー満足度 ≥ 4.0/5.0

### アーキテクチャ品質
- [x] L3 Capability数が3-5個の範囲（2-3個）
- [x] 各L3のOperation数が2-4個の範囲
- [x] BC間依存が適切に定義されている
- [x] Issue #146（API WHAT/HOW分離）に準拠

---

## 📚 関連ドキュメント

### 必須参照
- [V2_V3_MAPPING.md](../../V2_V3_MAPPING.md) - V2→V3詳細マッピング
- [MIGRATION_STATUS.md](../../MIGRATION_STATUS.md) - 移行ステータス
- [V2_V3_COEXISTENCE_STRATEGY.md](../../V2_V3_COEXISTENCE_STRATEGY.md) - 共存戦略

### 設計ガイド
- [parasol-design-process-guide.md](../../parasol-design-process-guide.md) - v3.0対応プロセス

### Issue #146関連
- API WHAT/HOW分離ガイド（Issue #146対応）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | BC-007 README初版作成（Phase 0） | Claude |

---

**ステータス**: Phase 0 - アーキテクチャレビュー準備完了
**次のアクション**: L3 Capabilityディレクトリとドキュメントの作成
