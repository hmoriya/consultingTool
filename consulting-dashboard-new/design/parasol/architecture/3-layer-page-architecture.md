# パラソル 3層分離ページアーキテクチャ

**目的**: ページ定義の重複解消と保守性向上
**対象**: 700ページ → 450ページ (36%削減)
**関連Issue**: [#135](https://github.com/hmoriya/consultingTool/issues/135)

## アーキテクチャ全体図

```mermaid
graph TB
    subgraph "コンサルティングダッシュボード"
        subgraph "🏢 Layer 1: サービス横断共通ページ"
            GL1[ログイン・ログアウト]
            GL2[ダッシュボード]
            GL3[通知一覧]
            GL4[エラーページ]
        end

        subgraph "📦 サービス層"
            subgraph "セキュアアクセスサービス"
                subgraph "🔧 Layer 2: オペレーション共有ページ"
                    SA_OP1[ユーザー一覧]
                    SA_OP2[権限管理画面]
                    SA_OP3[監査ログ画面]
                end

                subgraph "📄 Layer 3: ユースケース専用ページ"
                    SA_UC1[アカウント作成ウィザード]
                    SA_UC2[MFA設定画面]
                    SA_UC3[権限承認フロー]
                end
            end

            subgraph "プロジェクト成功支援サービス"
                subgraph "🔧 Layer 2: オペレーション共有ページ"
                    PS_OP1[成果物提出画面]
                    PS_OP2[タスク一覧]
                    PS_OP3[承認ワークフロー]
                end

                subgraph "📄 Layer 3: ユースケース専用ページ"
                    PS_UC1[プロジェクト計画ウィザード]
                    PS_UC2[リスク評価画面]
                    PS_UC3[成果物レビュー画面]
                end
            end

            subgraph "タレント最適化サービス"
                subgraph "🔧 Layer 2: オペレーション共有ページ"
                    TO_OP1[メンバー一覧・検索]
                    TO_OP2[スキルマトリックス]
                    TO_OP3[配分調整画面]
                end

                subgraph "📄 Layer 3: ユースケース専用ページ"
                    TO_UC1[メンバー登録ウィザード]
                    TO_UC2[スキル評価画面]
                    TO_UC3[チーム編成画面]
                end
            end

            subgraph "収益最適化サービス"
                subgraph "🔧 Layer 2: オペレーション共有ページ"
                    RO_OP1[請求書作成画面]
                    RO_OP2[コスト記録画面]
                    RO_OP3[収益分析画面]
                end

                subgraph "📄 Layer 3: ユースケース専用ページ"
                    RO_UC1[予算策定ウィザード]
                    RO_UC2[コスト配賦画面]
                    RO_UC3[収益予測画面]
                end
            end
        end
    end

    GL1 -.-> SA_UC1
    GL1 -.-> PS_UC1
    GL1 -.-> TO_UC1
    GL1 -.-> RO_UC1

    PS_OP1 -.-> PS_UC1
    PS_OP1 -.-> TO_UC1
    PS_OP1 -.-> RO_UC1

    style GL1 fill:#e1f5fe
    style GL2 fill:#e1f5fe
    style GL3 fill:#e1f5fe
    style GL4 fill:#e1f5fe

    style SA_OP1 fill:#f3e5f5
    style SA_OP2 fill:#f3e5f5
    style SA_OP3 fill:#f3e5f5

    style PS_OP1 fill:#f3e5f5
    style PS_OP2 fill:#f3e5f5
    style PS_OP3 fill:#f3e5f5

    style TO_OP1 fill:#f3e5f5
    style TO_OP2 fill:#f3e5f5
    style TO_OP3 fill:#f3e5f5

    style RO_OP1 fill:#f3e5f5
    style RO_OP2 fill:#f3e5f5
    style RO_OP3 fill:#f3e5f5

    style SA_UC1 fill:#fff3e0
    style SA_UC2 fill:#fff3e0
    style SA_UC3 fill:#fff3e0

    style PS_UC1 fill:#fff3e0
    style PS_UC2 fill:#fff3e0
    style PS_UC3 fill:#fff3e0

    style TO_UC1 fill:#fff3e0
    style TO_UC2 fill:#fff3e0
    style TO_UC3 fill:#fff3e0

    style RO_UC1 fill:#fff3e0
    style RO_UC2 fill:#fff3e0
    style RO_UC3 fill:#fff3e0
```

## ディレクトリ構造マッピング

```
services/
├── global-shared-pages/                    # 🏢 Layer 1
│   ├── login-page.md                      # 全サービス共通
│   ├── dashboard-page.md
│   ├── notification-page.md
│   └── error-page.md
├── secure-access-service/
│   ├── capabilities/
│   │   └── manage-access-safely/
│   │       └── operations/
│   │           ├── register-and-authenticate-users/
│   │           │   ├── shared-pages/       # 🔧 Layer 2
│   │           │   │   ├── user-list-page.md
│   │           │   │   └── user-search-page.md
│   │           │   └── usecases/
│   │           │       ├── create-account/
│   │           │       │   └── dedicated-pages/ # 📄 Layer 3
│   │           │       │       └── account-wizard-page.md
│   │           │       └── setup-mfa/
│   │           │           └── dedicated-pages/
│   │           │               └── mfa-setup-page.md
│   │           └── control-access-permissions/
│   └── ...
├── project-success-service/
│   ├── capabilities/
│   │   └── lead-projects-to-success/
│   │       └── operations/
│   │           ├── assign-and-execute-tasks/
│   │           │   ├── shared-pages/       # 🔧 Layer 2
│   │           │   │   ├── deliverable-submission-page.md
│   │           │   │   └── task-list-page.md
│   │           │   └── usecases/
│   │           │       ├── assign-tasks/
│   │           │       │   └── dedicated-pages/ # 📄 Layer 3
│   │           │       │       └── task-assignment-wizard.md
│   │           │       └── submit-deliverables/
│   │           │           └── dedicated-pages/
│   │           │               └── submission-review-page.md
│   │           └── ...
│   └── ...
└── talent-optimization-service/
    ├── capabilities/
    │   └── maximize-team-productivity/
    │       └── operations/
    │           ├── register-and-manage-members/
    │           │   ├── shared-pages/        # 🔧 Layer 2
    │           │   │   ├── member-list-page.md
    │           │   │   └── member-search-page.md
    │           │   └── usecases/
    │           │       ├── register-new-member/
    │           │       │   └── dedicated-pages/ # 📄 Layer 3
    │           │       │       └── member-registration-wizard.md
    │           │       └── update-member-info/
    │           │           └── dedicated-pages/
    │           │               └── member-history-page.md
    │           └── ...
    └── ...
```

## 重複解消マッピング

### Before: 重複ページ (削除対象)

```
❌ 削除される重複ページ (250ページ)
├── 成果物提出画面 (8重複) → 1つに統合
├── ログイン・認証 (5重複) → 1つに統合
├── 請求書作成・コスト記録 (5重複) → 各1つに統合
├── メンバー一覧・検索 (4重複) → 1つに統合
└── その他 (228重複) → 対応数に統合
```

### After: 統合後ページ (450ページ)

```
✅ 統合後の構造
├── 🏢 Layer 1: 20ページ (サービス横断共通)
├── 🔧 Layer 2: 180ページ (オペレーション共有)
└── 📄 Layer 3: 250ページ (ユースケース専用)
```

## 効果シミュレーション

### 保守工数削減効果

| 変更種別 | 現状 | 提案後 | 削減効果 |
|---------|------|--------|---------|
| **UI共通変更** | 150箇所 | 20箇所 | **87%削減** |
| **ワークフロー変更** | 75箇所 | 25箇所 | **67%削減** |
| **機能追加** | 8箇所 | 3箇所 | **63%削減** |
| **バグ修正** | 重複調査必要 | 一箇所修正 | **大幅効率化** |

### 開発効率向上効果

```mermaid
graph LR
    A[新規ページ開発] --> B{既存ページ確認}
    B -->|現状| C[重複有無の調査<br/>5-10分]
    B -->|提案後| D[3層分類判定<br/>1-2分]

    C --> E[類似ページの統合検討<br/>10-20分]
    D --> F[適切な層に配置<br/>2-3分]

    E --> G[複数箇所への影響確認<br/>15-30分]
    F --> H[単一箇所での管理<br/>3-5分]

    G --> I[開発完了<br/>30-60分]
    H --> J[開発完了<br/>6-10分]

    style I fill:#ffebee
    style J fill:#e8f5e8
```

## 段階的移行計画

### Phase 1: 高影響度ページ (Week 1-2)
```
🎯 対象: 重複度5以上のページ (25ページ)
📊 効果: 125重複 → 25ページ (100重複削除)
🚀 リスク: 低 (明確な重複のため)
```

### Phase 2: 中影響度ページ (Week 3-4)
```
🎯 対象: 重複度2-4のページ (125ページ)
📊 効果: 250重複 → 125ページ (125重複削除)
🚀 リスク: 中 (統合判定が必要)
```

### Phase 3: 最適化・完了 (Week 5)
```
🎯 対象: 最終調整・検証
📊 効果: 全体最適化
🚀 リスク: 低 (最終検証のみ)
```

## 運用フロー

### 新規ページ作成時

```mermaid
flowchart TD
    A[新規ページ定義要求] --> B{全サービス共通？}
    B -->|Yes| C[🏢 global-shared-pages/]
    B -->|No| D{オペレーション内複数UC？}
    D -->|Yes| E[🔧 shared-pages/]
    D -->|No| F[📄 dedicated-pages/]

    C --> G[影響範囲: 全サービス]
    E --> H[影響範囲: オペレーション内]
    F --> I[影響範囲: ユースケース内]

    G --> J[レビュー必須: アーキテクト]
    H --> K[レビュー必須: 技術リーダー]
    I --> L[レビュー任意: 開発者判断]
```

### ページ変更時

```mermaid
flowchart TD
    A[ページ変更要求] --> B{どの層？}
    B -->|🏢 Layer 1| C[全サービス影響分析]
    B -->|🔧 Layer 2| D[オペレーション影響分析]
    B -->|📄 Layer 3| E[ユースケース単位実装]

    C --> F[全サービス代表者レビュー]
    D --> G[関連ユースケース確認]
    E --> H[直接実装可能]

    F --> I[段階的リリース計画]
    G --> J[影響範囲限定実装]
    H --> K[即座実装可能]
```

## 成功指標

### 定量指標
- ✅ **ページ数**: 700 → 450 (36%削減)
- ✅ **重複数**: 150 → 0 (100%解消)
- ✅ **変更工数**: 30-60分 → 6-10分 (80%削減)

### 定性指標
- ✅ **保守性**: 一元管理による品質向上
- ✅ **開発速度**: 重複調査時間の削減
- ✅ **一貫性**: UI/UX統一による体験向上