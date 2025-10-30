# パラソル開発ガイド - DX価値創造型フレームワーク

**バージョン**: 3.4.0（v3.0階層構造対応）
**更新日**: 2025-10-24
**ステータス**: Draft

> ⚠️ **v3.0階層構造への対応**: このガイドにv3.0の詳細階層構造（BC → L3 → Operation）を反映しています。
>
> **最新の階層構造設計については**:
> - [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) - L3 Capability ⊃ Operation階層の詳細
> - [PARASOL_LAYERED_DIRECTORY_STRATEGY.md](PARASOL_LAYERED_DIRECTORY_STRATEGY.md) - 3層ディレクトリ分離戦略
>
> **v3.0の核心**:
> - BC（Business Capability）= ビジネスケーパビリティ（Why-What-Howの中心）
> - L3 Capability = What（何ができるか：能力の定義）
> - Operation = How（どうやるか：能力を実現する操作）
> - 階層: BC ⊃ L3 Capability ⊃ Operation ⊃ UseCase

## 目次

1. [フレームワーク概要](#1-フレームワーク概要)
2. [DX促進アーキテクチャ](#2-dx促進アーキテクチャ)
3. [マイクロサービスとバウンデッドコンテキストの違い](#3-マイクロサービスとバウンデッドコンテキストの違い)
4. [MDファイル構成（実際の構造）](#4-mdファイル構成実際の構造)
5. [DX階層構造定義](#5-dx階層構造定義)
6. [価値創造型開発プロセス](#6-価値創造型開発プロセス)
7. [DXテンプレート・仕様書](#7-dxテンプレート仕様書)
8. [DX実装ガイド](#8-dx実装ガイド)
9. [DX品質管理](#9-dx品質管理)
10. [MD形式統一による品質保証](#10-md形式統一による品質保証)

---

## 1. フレームワーク概要

### パラソルドメイン言語とは

パラソルドメイン言語は、**MD形式でAIに解析しやすい、実装テクノロジー非依存の設計ファイル**です。**デジタルトランスフォーメーション（DX）を促進**するために設計され、従来の「管理」思考を脱却し、**価値創造型のビジネス設計**を推進します。

**パラソルの3つの本質**:

```
1. MD形式（Markdown）
   └─ 人間が読みやすく、AIが解析・生成しやすい
   └─ GitHub、GitLab等のバージョン管理と完全統合
   └─ コードレビュー、差分管理が容易

2. AI解析可能性
   └─ Claude、ChatGPT等のLLMが設計を理解・提案できる
   └─ 設計からコード生成、コードから設計抽出が可能
   └─ AI時代の開発生産性向上の鍵

3. 実装テクノロジー非依存
   └─ TypeScript、Go、Java等、どの言語でも実装可能
   └─ ドメイン設計と実装技術の分離
   └─ 長期的な保守性・柔軟性を確保
```

#### 基本原則

```
❌ 管理思考（従来型）     ✅ 価値創造思考（DX型）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
顧客管理               → 顧客エンゲージメント強化
プロジェクト管理       → プロジェクト成功支援
データ管理             → データから洞察を創出
在庫管理               → 在庫を最適化
```

#### DX促進の設計思想

1. **MD形式統一**: すべての設計ドキュメントをMarkdown形式で記述
   - AIによる解析・生成・提案が容易
   - バージョン管理（Git）と完全統合
   - 差分レビュー、変更履歴管理が自然にできる
   - プログラマブルなドキュメント（スクリプトで処理可能）

2. **AI解析可能性**: Claude、ChatGPT等のLLMとの協働を前提
   - 設計MDをAIが読み取り、実装コードを生成
   - 既存コードからAIが設計MDを抽出・提案
   - AIとペアプログラミング、ペア設計が可能
   - 継続的な設計改善のフィードバックループ

3. **実装テクノロジー非依存**: 特定のプログラミング言語に依存しない
   - TypeScript、Go、Java、Python等、どの言語でも実装可能
   - フレームワーク選択の自由（NestJS、Spring Boot、Django等）
   - 技術スタックの変更に強い設計

4. **ドメイン駆動設計（DDD）準拠**: エンティティ、値オブジェクト、集約などのDDD概念を表現
   - 問題領域（Subdomain）と解決領域（BC）の明確な分離
   - 戦略的設計と戦術的設計の統合

5. **ユビキタス言語**: ビジネスとテクノロジーの橋渡しとなる共通語彙
   - ビジネス部門とエンジニアが同じ言葉で対話
   - AIもユビキタス言語を理解し、提案できる

6. **価値創造指向**: 「管理」ではなく「価値創造」にフォーカス
   - バリューストリーム、バリューステージ中心の設計
   - ビジネス成果に直結するケーパビリティマッピング

### DXを促進する価値創造メトリクス

```
従来の管理指標 → DX価値創造指標:
- データ登録件数      → ビジネス洞察創出数
- システム稼働率      → 業務改善実現数
- ユーザー数         → 価値創造に参画するアクティブユーザー数
- 処理時間          → 意思決定速度向上率
- エラー発生率       → イノベーション創出頻度
```

---

## 2. DX促進アーキテクチャ

### システム全体構成（価値創造視点）

```mermaid
graph TB
    subgraph "DX価値創造層"
        UX[ユーザーエクスペリエンス向上]
        IN[イノベーション促進]
        DA[データドリブン意思決定]
    end

    subgraph "パラソルフレームワーク層"
        PDL[パラソルドメイン言語]
        VCM[価値創造モデリング]
        DXP[DXプロセス定義]
    end

    subgraph "マイクロサービス価値連携"
        direction LR
        SS[セキュアアクセス<br/>サービス]
        PS[プロジェクト成功<br/>支援サービス]
        TO[タレント最適化<br/>サービス]
        PV[生産性可視化<br/>サービス]
        KC[ナレッジ共創<br/>サービス]
        RO[収益最適化<br/>サービス]
        CF[コラボレーション<br/>促進サービス]
    end

    subgraph "データ基盤（洞察創出）"
        DB[(価値創造データ)]
        AI[AI/ML分析エンジン]
        BI[ビジネス洞察]
    end

    UX --> PDL
    IN --> VCM
    DA --> DXP

    PDL --> SS
    VCM --> PS
    DXP --> TO

    SS --> DB
    PS --> AI
    TO --> BI
    PV --> DB
    KC --> AI
    RO --> BI
    CF --> DB
```

### マイクロサービス間の価値連携

```
価値連携パターン:
1. データ洞察共有: 生産性可視化 → 収益最適化
2. ナレッジ流通: ナレッジ共創 → プロジェクト成功支援
3. セキュリティ基盤: セキュアアクセス → 全サービス
4. コラボレーション促進: 全サービス → コラボレーション促進
```

---

## 3. マイクロサービスとバウンデッドコンテキストの違い

### 3.1 概念の整理

パラソル開発では、**バウンデッドコンテキスト（設計概念）**と**マイクロサービス（実装形態）**を明確に区別することが重要です。

#### バウンデッドコンテキスト（Bounded Context）

**定義**: DDDにおける論理的な境界であり、特定のドメインモデルが一貫性を持って適用される範囲

```
特徴:
✓ 設計上の概念（論理境界）
✓ ドメインモデルの一貫性を保証
✓ ユビキタス言語の適用範囲
✓ ビジネス機能・能力の境界
✓ 実装方法に依存しない
```

**パラソルでの位置づけ**:
- `Service` レベル = バウンデッドコンテキスト
- 例: "セキュアアクセスサービス" は1つのバウンデッドコンテキスト

#### マイクロサービス（Microservice）

**定義**: 独立してデプロイ可能な実装単位であり、技術的なアーキテクチャパターン

```
特徴:
✓ 実装上の概念（物理境界）
✓ 独立したデプロイメント単位
✓ 独自のデータベースを持つ
✓ API経由で通信
✓ 技術スタック選択の自由
```

**パラソルでの位置づけ**:
- 実装フェーズで決定される物理的な配置
- 1つのバウンデッドコンテキスト = 1つ以上のマイクロサービス

#### サブドメイン（Subdomain）との違い

DDDにおいて、**サブドメイン**と**バウンデッドコンテキスト**は異なる概念です。

**サブドメイン（Subdomain）**:

```
定義: 問題空間（Problem Space）における、ビジネスドメインの論理的な分割

特徴:
✓ ビジネス視点（「何をするか」）
✓ 問題領域の切り分け
✓ ビジネスの優先度・戦略で決まる
✓ システム実装前から存在
✓ 実装に依存しない
```

**サブドメインの3つのタイプ**:

| タイプ | 説明 | 例 | 戦略 |
|--------|------|-----|------|
| **Core Subdomain**<br/>（コアサブドメイン） | 競争優位性を生む<br/>最も重要な領域 | パラソル: "プロジェクト成功支援"<br/>Amazon: "商品推薦" | 自社開発<br/>最高の人材を投入 |
| **Supporting Subdomain**<br/>（支援サブドメイン） | ビジネスに必要だが<br/>差別化にはならない | パラソル: "タレント最適化"<br/>Amazon: "在庫管理" | 自社開発<br/>または外注 |
| **Generic Subdomain**<br/>（汎用サブドメイン） | 既製品で代替可能 | パラソル: "セキュアアクセス"<br/>Amazon: "決済処理" | 既製品・SaaS利用 |

---

**サブドメインとBounded Contextの関係**:

```
サブドメイン（問題空間） → Bounded Context（解決空間）

理想的なマッピング: 1サブドメイン = 1 BC（1対1）

現実的なマッピング:
├─ 1サブドメイン = 複数BC（複雑さやチーム構成で分割）
└─ 複数サブドメイン = 1 BC（小さいサブドメインを統合）
```

**マッピング例**:

```mermaid
graph LR
    subgraph "問題空間（Subdomain）"
        SD1[Core: プロジェクト<br/>成功支援]
        SD2[Supporting: タレント<br/>最適化]
        SD3[Generic: 認証・認可]
    end

    subgraph "解決空間（Bounded Context）"
        BC1[Project Success<br/>Service]
        BC2[Talent Optimization<br/>Service]
        BC3[Secure Access<br/>Service]
    end

    SD1 --> BC1
    SD2 --> BC2
    SD3 --> BC3
```

**パラソルでの位置づけ**:

| 概念 | パラソル階層 | 決定時期 | 成果物 |
|------|------------|---------|--------|
| **Subdomain** | （明示的には定義せず）<br/>B1: 戦略レベルに相当 | ビジネス戦略策定時 | ビジネス戦略書 |
| **Bounded Context** | L2: Service レベル | 設計フェーズ | service.md, context.md, context-map.md |

**重要な違い**:

| 観点 | Subdomain（サブドメイン） | Bounded Context（BC） |
|------|-------------------------|---------------------|
| **空間** | 問題空間（Problem Space） | 解決空間（Solution Space） |
| **視点** | ビジネス視点（What） | システム設計視点（How） |
| **誰が定義** | ビジネス部門・ドメインエキスパート | 設計者・アーキテクト |
| **決定要因** | ビジネス戦略・競争優位性 | 技術的制約・チーム構成・複雑さ |
| **変更頻度** | 低い（ビジネス戦略の変更時） | 中程度（設計の見直し時） |
| **成果物** | ビジネスモデル、戦略書 | ドメインモデル、コンテキストマップ |

**例: パラソルにおける対応**:

```
Core Subdomain: "DX価値創造" → BC: "Project Success Service"
                                  + BC: "Productivity Visualization Service"

Supporting Subdomain: "人材最適化" → BC: "Talent Optimization Service"

Generic Subdomain: "認証基盤" → BC: "Secure Access Service"（Auth0等で代替可能）
```

**設計上の推奨**:
1. まずサブドメインを特定（ビジネス分析）
2. 各サブドメインのタイプを決定（Core/Supporting/Generic）
3. BCへのマッピングを決定（1対1を基本、必要に応じて分割/統合）
4. Core SubdomainのBCに最高の人材とリソースを投入

### 3.2 重要な用語の明確化：問題領域・解決領域・ソリューション構成

パラソル開発では、**3つの異なる概念レベル**を明確に区別します。これらは同義語ではなく、それぞれ異なる視点と目的を持っています。

#### 3つの概念レベルの定義

| 日本語 | 英語 | 対応する概念 | 焦点 | 誰が定義するか | 成果物 |
|--------|------|------------|------|--------------|--------|
| **問題領域** | **Problem Space** | **Subdomain** | 何を解決するか（What） | ビジネス部門<br/>ドメインエキスパート | ビジネス戦略書<br/>サブドメインマップ |
| **解決領域** | **Solution Space** | **Bounded Context** | どうモデル化するか<br/>（How to Model） | 設計者<br/>アーキテクト | context.md<br/>ドメインモデル図<br/>コンテキストマップ |
| **ソリューション構成** | **Solution Composition**<br/>**Implementation** | **Microservice** | どう実装・デプロイするか<br/>（How to Implement） | エンジニア<br/>DevOpsチーム | ソースコード<br/>インフラ構成<br/>API仕様 |

#### 具体例: パラソルの「プロジェクト成功支援」

```
1. 問題領域（Subdomain）: "プロジェクト計画"
   └─ ビジネス上の問題: プロジェクトの成功率を上げたい
   └─ サブドメインタイプ: Core Subdomain（競争優位性）
   └─ ビジネス戦略: 自社開発、最高の人材を投入

   ↓

2. 解決領域（Bounded Context）: "Project Success Service"
   └─ ドメインモデル設計:
       ├─ Aggregate Root: Project, Milestone, Risk
       ├─ Entity: Task, Deliverable
       ├─ Value Object: ProjectStatus, Priority
       └─ Repository: ProjectRepository
   └─ ユビキタス言語: "プロジェクトを構想する"、"マイルストーンを設定する"
   └─ 設計ドキュメント: context.md, domain-model.md

   ↓

3. ソリューション構成（Microservice）: "Project Service"
   └─ 実装技術:
       ├─ Framework: NestJS (TypeScript)
       ├─ Database: PostgreSQL (project_service schema)
       ├─ API: REST API (/api/projects)
       └─ Deployment: Docker Container
   └─ 物理構成: src/contexts/project-success/
   └─ 実装コード: ProjectService, ProjectController, ProjectEntity
```

#### 階層構造での位置づけ

```
バリューステージ（価値創造の段階）
  └─ ケーパビリティL1（戦略的組織能力）
      ├─ 【問題領域】Subdomain（Core/Supporting/Generic）
      ├─ 【解決領域】Bounded Context（ドメインモデル）
      └─ 【ソリューション構成】Microservice（実装）
```

#### 多重度の関係

```
1つのSubdomain（問題領域）
  ↓
1つ以上のBounded Context（解決領域）
  ↓
1つ以上のMicroservice（ソリューション構成）

例:
Core Subdomain: "DX価値創造"
  → BC1: "Project Success Service"（解決領域）
      → MS1: "Project Service"（モノリス内モジュール）
      → MS2: "Project Analytics Service"（将来的に分離）
  → BC2: "Productivity Visualization Service"（解決領域）
      → MS3: "Productivity Service"（独立マイクロサービス）
```

#### 重要な注意点

**❌ よくある誤解**:
- "解決領域"と"ソリューション構成"は同じもの
- Bounded ContextとMicroserviceは1対1の関係
- 問題領域（Subdomain）は実装フェーズで決める

**✅ 正しい理解**:
- **解決領域（BC）は設計書**、**ソリューション構成（MS）はコード**
- 1つのBCは複数のMSに実装される可能性がある
- 問題領域（Subdomain）はビジネス戦略策定時に決定

#### プロセスでの流れ

```
ステップ3: サブドメインの特定（問題領域の分析）
├─ Core/Supporting/Generic の判定
├─ サブドメインマップ作成
└─ 成果物: SUBDOMAIN_MAP.md

↓

ステップ4: Bounded Contextの設計（解決領域の設計）
├─ Subdomain → BC へのマッピング決定
├─ ドメインモデル設計
├─ コンテキストマップ作成
└─ 成果物: context.md, context-map.md, domain-model.md

↓

ステップ5: マイクロサービスの決定（ソリューション構成）
├─ BC → Microservice へのマッピング決定
├─ デプロイメント戦略（モノリス or 独立MS）
├─ 技術スタック選択
└─ 成果物: api-specification.md, 実装コード
```

#### ディレクトリ構造での対応

```
docs/
├─ domain/                          # 問題領域（Problem Space）
│   ├─ SUBDOMAIN_MAP.md             # サブドメイン全体マップ
│   └─ subdomains/
│       ├─ project-planning/        # Core Subdomain定義
│       │   └─ subdomain-type.md
│       └─ talent-optimization/     # Supporting Subdomain定義
│           └─ subdomain-type.md
│
├─ design/bounded-contexts/         # 解決領域（Solution Space）
│   ├─ project-success/
│   │   ├─ context.md               # BC定義（ドメインモデル）
│   │   └─ domain-model.md
│   └─ talent-optimization/
│       ├─ context.md
│       └─ domain-model.md
│
└─ api/                             # ソリューション構成の仕様
    └─ services/
        ├─ project-service/
        │   └─ api-specification.md # MS API仕様
        └─ talent-service/
            └─ api-specification.md

src/contexts/                       # ソリューション構成の実装
├─ project-success/                 # MS実装コード
│   ├─ domain/
│   ├─ application/
│   └─ infrastructure/
└─ talent-optimization/
    ├─ domain/
    ├─ application/
    └─ infrastructure/
```

**まとめ**:
- **問題領域（Subdomain）** = ビジネスの問題を定義（What）
- **解決領域（BC）** = その問題をどうモデル化するか設計（How to Model）
- **ソリューション構成（MS）** = その設計をどう実装・デプロイするか（How to Implement）

これらは異なる視点・異なるフェーズ・異なる担当者によって決定される、独立した概念です。

### 3.4 関係性マッピング

```mermaid
graph TB
    subgraph "設計レイヤー（パラソル定義）"
        BC1[バウンデッドコンテキスト1<br/>セキュアアクセスサービス]
        BC2[バウンデッドコンテキスト2<br/>プロジェクト成功支援サービス]
        BC3[バウンデッドコンテキスト3<br/>タレント最適化サービス]
    end

    subgraph "実装レイヤー（技術選択）"
        subgraph "実装パターン1: 1BC = 1MS"
            MS1[マイクロサービス1<br/>Auth API]
        end

        subgraph "実装パターン2: 1BC = 複数MS"
            MS2A[マイクロサービス2A<br/>Project Core API]
            MS2B[マイクロサービス2B<br/>Project Analytics API]
        end

        subgraph "実装パターン3: モノリス内モジュール"
            MOD3[モジュール3<br/>Talent Module]
        end
    end

    BC1 --> MS1
    BC2 --> MS2A
    BC2 --> MS2B
    BC3 --> MOD3

    style BC1 fill:#e1f5ff
    style BC2 fill:#e1f5ff
    style BC3 fill:#e1f5ff
    style MS1 fill:#fff4e6
    style MS2A fill:#fff4e6
    style MS2B fill:#fff4e6
    style MOD3 fill:#f3e5f5
```

### 3.5 パラソルにおける設計原則

#### 原則1: 設計はバウンデッドコンテキストで行う

```markdown
✅ DO: バウンデッドコンテキスト視点で設計
- ドメイン境界の明確化
- ビジネス機能の凝集性
- ユビキタス言語の定義

❌ DON'T: 最初から実装を考える
- "このAPIはどのサーバーに配置するか"
- "DBをどう分割するか"
→ これらは実装フェーズで決定
```

#### 原則2: 実装時に物理配置を決定

バウンデッドコンテキストを実装する際の選択肢:

| 実装パターン | 適用ケース | メリット | デメリット |
|------------|----------|---------|---------|
| **1BC = 1マイクロサービス** | 標準パターン | シンプル、独立性高 | 運用コスト |
| **1BC = 複数マイクロサービス** | 大規模・高負荷 | スケーラビリティ | 複雑性増加 |
| **複数BC = 1モノリス** | 小規模・初期段階 | 開発効率、低コスト | 結合度高 |

#### 原則3: パラソル定義は実装非依存

```
パラソル設計ドキュメント（MD形式）
↓
実装方法は自由に選択可能:
- Node.js + Express
- Python + FastAPI
- Java + Spring Boot
- Go + Gin
- モノリス内モジュール
```

### 3.6 実践ガイド

#### ステップ1: バウンデッドコンテキスト境界の特定

```markdown
質問リスト:
□ この機能は独自のドメインモデルを持つか？
□ 他のコンテキストと異なるユビキタス言語を使うか？
□ この機能の変更が他の機能に影響を与えないか？
□ ビジネス上、独立した価値を提供するか？

すべて YES → 独立したバウンデッドコンテキスト
```

#### ステップ2: パラソルでの定義

```bash
# バウンデッドコンテキスト = サービス
docs/parasol/services/
├── secure-access-service/        # BC1: 認証・認可
├── project-success-service/      # BC2: プロジェクト管理
└── talent-optimization-service/  # BC3: 人材最適化
```

#### ステップ3: 実装方法の選択（後工程）

```typescript
// 例: セキュアアクセスサービス（BC）の実装選択

// オプション1: 単一マイクロサービス
// apps/auth-service/
//   ├── src/
//   └── package.json

// オプション2: 複数マイクロサービス
// apps/auth-core/      # 認証ロジック
// apps/auth-gateway/   # API Gateway
// apps/auth-session/   # セッション管理

// オプション3: モノリス内モジュール
// apps/main-app/
//   └── modules/
//       └── auth/
```

### 3.7 よくある誤解と正しい理解

| 誤解 | 正しい理解 |
|------|----------|
| "マイクロサービス = バウンデッドコンテキスト" | バウンデッドコンテキストは設計概念、マイクロサービスは実装選択肢の1つ |
| "7つのサービス = 7つのマイクロサービス" | 7つのバウンデッドコンテキスト。実装は1つでも複数でも可 |
| "パラソルはマイクロサービス設計ツール" | パラソルはドメイン設計ツール。実装方法は自由 |
| "最初にアーキテクチャを決める" | 最初にドメイン境界を決め、実装は後で選択 |

### 3.8 バリューストリームとパラソルの完全な階層構造

パラソル開発では、**バリューストリーム**を最上位概念とし、その中に**バリューステージ**、**ケーパビリティ階層**が存在し、各レベルで**3つの異なる概念体系**を扱います。

#### 完全な階層構造

```
バリューストリーム（Value Stream）- 価値の流れ全体
  └─ バリューステージ（Value Stage）- 価値創造の各段階
      └─ ケーパビリティ階層（Capability Hierarchy L1/L2/L3）
          ├─ 問題領域（Problem Space）→ サブドメイン
          ├─ 解決領域（Solution Space）→ Bounded Context
          └─ ソリューション構成（Implementation）→ マイクロサービス
```

---

#### バリューストリームとバリューステージ

**バリューストリーム（Value Stream）**:

```
定義: 顧客に価値を提供するための一連の活動の流れ

特徴:
✓ エンドツーエンドの価値創造プロセス
✓ 顧客視点での価値の流れ
✓ 複数のバリューステージで構成
✓ ビジネス成果に直結
```

**バリューステージ（Value Stage）**:

```
定義: バリューストリーム内の価値創造の各段階

特徴:
✓ 明確な価値提供ポイント
✓ ケーパビリティ階層を内包
✓ 各ステージで問題領域→解決領域→実装へ展開
```

**パラソルにおけるバリューストリーム例**:

```
バリューストリーム: "DXプロジェクト成功支援"
  ├─ バリューステージ1: プロジェクト計画支援
  │   └─ ケーパビリティL1: プロジェクト構想する能力
  │       ├─ 問題領域: プロジェクト計画サブドメイン
  │       ├─ 解決領域: Project Success BC
  │       └─ 実装: Project Service (MS)
  │
  ├─ バリューステージ2: プロジェクト実行支援
  │   └─ ケーパビリティL2: プロジェクト実行する能力
  │       ├─ 問題領域: プロジェクト実行サブドメイン
  │       ├─ 解決領域: Project Success BC
  │       └─ 実装: Project Service (MS)
  │
  └─ バリューステージ3: 成果可視化支援
      └─ ケーパビリティL3: 生産性を可視化する能力
          ├─ 問題領域: 生産性可視化サブドメイン
          ├─ 解決領域: Productivity Visualization BC
          └─ 実装: Productivity Service (MS)
```

---

#### 3つの概念体系（各バリューステージ内）

各バリューステージ内のケーパビリティ階層において、3つの概念体系が存在します：

| 概念体系 | 主要概念 | 空間/レベル | 目的 | 焦点 | 担当者と責任範囲 | 成果物 |
|---------|---------|-----------|------|------|----------------|--------|
| **ビジネスの階層**<br/>（バリューステージ構造） | **バリューストリーム**<br/>**バリューステージ**<br/>**ビジネスケーパビリティ**<br/>**ビジネスオペレーション**<br/>**ユースケース** | - | 何をするか（What） | ビジネス価値・組織能力 | **ビジネス部門・経営層**<br/>━━━━━━━━━━━━━━━━<br/>【責任範囲】<br/>・バリューストリーム定義<br/>・バリューステージ特定<br/>・ケーパビリティブレークダウン（L1→L2→L3）<br/>・ビジネスオペレーション定義<br/>・ユースケース定義 | バリューストリームマップ<br/>ケーパビリティマップ<br/>業務フロー図 |
| **DDDの階層**<br/>（問題領域→解決領域） | **Subdomain**（問題領域）<br/>**Bounded Context**（解決領域） | **問題領域**: Subdomain<br/>**解決領域**: BC | どうモデル化するか（How to Model） | ドメイン知識の構造化 | **ドメインエキスパート・アーキテクト**<br/>━━━━━━━━━━━━━━━━<br/>【責任範囲】<br/>・サブドメイン抽出（問題領域）<br/>・BC境界設計（解決領域）<br/>・ドメインモデル設計<br/>・コンテキストマップ作成 | サブドメインマップ<br/>ドメインモデル<br/>コンテキストマップ |
| **実装の階層**<br/>（ソリューション構成） | **Microservice**<br/>**Service Module** | **ソリューション構成**: MS | どう実装・構成するか（How to Implement） | システムの物理構造 | **エンジニア・DevOpsチーム**<br/>━━━━━━━━━━━━━━━━<br/>【責任範囲】<br/>・MS/モノリス判断<br/>・技術スタック選択<br/>・API/DB設計<br/>・インフラ構成 | ソースコード<br/>API仕様<br/>インフラ構成 |

---

#### 概念体系の詳細と対応表

##### 1. ビジネスの階層（Business Hierarchy）

**目的**: ビジネス価値と組織能力の構造化（バリューストリーム中心）

**責任者**: **ビジネス部門・経営層**

**責任範囲**: ビジネス階層全体（B0-B6）のブレークダウン
- バリューストリームの定義（B0）
- バリューステージの特定（B1）
- ケーパビリティのブレークダウン（B2→B3→B4）
- ビジネスオペレーション/プロセスの定義（B5）
- ユースケース/アクティビティの定義（B6）

| レベル | 名称 | 説明 | ビジネス部門の役割 | 例 |
|--------|------|------|------------------|-----|
| **B0** | **バリューストリームレベル** | 顧客への価値の流れ全体 | 経営層が価値の流れを定義 | "DXプロジェクト成功支援" |
| **B1** | **バリューステージレベル** | 価値創造の各段階 | 経営層・事業部長が各段階を特定 | "プロジェクト計画支援"、"実行支援"、"成果可視化" |
| **B2** | **ケーパビリティL1レベル** | 戦略的組織能力 | 事業部長・部門長が戦略能力を定義 | "プロジェクト構想する能力" |
| **B3** | **ケーパビリティL2レベル** | 戦術的組織能力 | 部門長・マネージャーが戦術能力を定義 | "プロジェクト実行する能力" |
| **B4** | **ケーパビリティL3レベル** | 具体的な業務能力 | マネージャー・リーダーが業務能力を定義 | "タスクを管理する能力" |
| **B5** | **プロセスレベル**<br/>（ビジネスオペレーション） | 具体的なビジネスオペレーション | 現場リーダーが業務プロセスを定義 | "ユーザー認証プロセス" |
| **B6** | **アクティビティレベル**<br/>（ユースケース） | エンドユーザーの活動 | 現場担当者がユースケースを定義 | "パスワードでログインする" |

**バリューストリーム→バリューステージ→ケーパビリティ階層の関係**:
```
B0: バリューストリーム "DXプロジェクト成功支援"
  │
  ├─ B1: バリューステージ "プロジェクト計画支援"
  │   ├─ B2: ケーパビリティL1 "プロジェクト構想する能力"
  │   ├─ B3: ケーパビリティL2 "計画を策定する能力"
  │   └─ B4: ケーパビリティL3 "スケジュールを作成する能力"
  │
  ├─ B1: バリューステージ "プロジェクト実行支援"
  │   ├─ B2: ケーパビリティL1 "プロジェクト実行する能力"
  │   └─ B3: ケーパビリティL2 "進捗を追跡する能力"
  │
  └─ B1: バリューステージ "成果可視化支援"
      └─ B2: ケーパビリティL1 "生産性を可視化する能力"
```

---

##### 2. DDDの階層（DDD Hierarchy）

**目的**: ドメイン知識の構造化とモデリング（問題領域→解決領域）

| レベル | 空間/領域 | 名称 | 説明 | 例 |
|--------|----------|------|------|-----|
| **D0** | **問題領域**<br/>**Problem Space** | **Subdomainレベル** | ビジネスドメインの論理的な分割<br/>何を解決するか | Core/Supporting/Generic Subdomain<br/>"プロジェクト計画"、"認証基盤" |
| **D1** | **解決領域**<br/>**Solution Space** | **Bounded Contextレベル** | ドメインモデルの一貫性境界<br/>どうモデル化するか | Bounded Context, Context Map<br/>"Project Success Service" |
| **D2** | **解決領域**<br/>**Solution Space** | **戦術的設計レベル** | ドメインモデルの詳細構造 | Aggregate, Entity, Value Object<br/>"Project Aggregate"、"TaskEntity" |
| **D3** | **解決領域**<br/>**Solution Space** | **実装パターンレベル** | DDD実装パターン | Repository, Domain Service, Factory<br/>"ProjectRepository" |

**問題領域（D0: Problem Space）の主要概念**:
- **Subdomain**: ビジネスドメインの論理的な分割
  - **Core Subdomain**: 競争優位性を生む最重要領域（例: "プロジェクト成功支援"）
  - **Supporting Subdomain**: ビジネスに必要だが差別化にならない（例: "タレント最適化"）
  - **Generic Subdomain**: 既製品で代替可能（例: "認証基盤"）

**解決領域（D1-D3: Solution Space）の主要概念**:
- **Bounded Context（D1）**: ドメインモデルの一貫性境界、ユビキタス言語の適用範囲
- **Aggregate（D2）**: トランザクション境界、不変条件を守る単位
- **Entity（D2）**: ライフサイクルと一意性を持つオブジェクト
- **Value Object（D2）**: 不変で等価性で比較されるオブジェクト
- **Repository（D3）**: 集約の永続化パターン
- **Domain Service（D3）**: エンティティやVOに属さないドメインロジック

**問題領域 vs 解決領域の関係**:
```
問題領域（Problem Space）           解決領域（Solution Space）
D0: Subdomain                  →    D1: Bounded Context
├─ Core Subdomain                   ├─ ドメインモデル（D2）
│  "プロジェクト成功支援"            │  ├─ Project Aggregate
│                                   │  ├─ Milestone Entity
│                                   │  └─ Priority Value Object
├─ Supporting Subdomain             │
│  "タレント最適化"                 ├─ ユビキタス言語
│                                   │  "プロジェクトを構想する"
└─ Generic Subdomain                │
   "認証基盤"                       └─ コンテキストマップ（D1）
                                       Customer/Supplier関係
```

---

##### 3. 実装の階層（Implementation Hierarchy）- ソリューション構成

**目的**: システムの物理的な実装・構成・デプロイメント（どう実装・構成するか）

| レベル | 領域 | 名称 | 説明 | 例 |
|--------|------|------|------|-----|
| **S1** | **ソリューション構成**<br/>**Solution Composition** | **マイクロサービスレベル** | 独立したデプロイ単位<br/>どう構成・配置するか | Microservice, Container, Pod<br/>"Project Service"、"Auth Service" |
| **S2** | **ソリューション構成**<br/>**Solution Composition** | **モジュールレベル** | コードの構造化単位 | Service Module, Package<br/>"ProjectModule"、"AuthModule" |
| **S3** | **ソリューション構成**<br/>**Solution Composition** | **コードレベル** | 実装の詳細 | Class, Function, API Endpoint<br/>"ProjectController"、"POST /api/projects" |
| **S4** | **ソリューション構成**<br/>**Solution Composition** | **データレベル** | データの物理配置 | Database, Schema, Table<br/>"PostgreSQL"、"project_service schema" |

**ソリューション構成の主要概念**:
- **Microservice（S1）**: BCの実装・デプロイ単位。独立したプロセス、DB、API
- **Service Module（S2）**: モノリス内でのBC実装単位。NestJSモジュール等
- **Controller/UseCase（S3）**: ビジネスロジックの実装。API エンドポイント
- **Database Schema（S4）**: BCごとのデータ分離。スキーマまたは物理DB

**ソリューション構成のパターン**:
```
ソリューション構成（Solution Composition）

パターン1: モノリス構成
└─ 1つのデプロイメント単位
    ├─ 複数のService Module（BC単位）
    ├─ 単一のプロセス・アプリケーション
    └─ Schema分離されたDB

パターン2: マイクロサービス構成
└─ 複数の独立したデプロイメント単位
    ├─ BC = Microservice（1対1または1対多）
    ├─ 独立したプロセス・コンテナ
    └─ 独立した物理DB

パターン3: ハイブリッド構成
└─ モノリス + 一部MS
    ├─ コアBCはモノリス内モジュール
    ├─ 独立性が高いBCはMS化
    └─ Schema分離 + 物理DB分離の混在
```

---

#### パラソルにおける完全な階層マッピング

**重要**: バリューステージ内のケーパビリティ階層（L1/L2/L3）に、**問題領域（Subdomain）→解決領域（BC）→ソリューション構成（MS）**の3層が対応します。

| パラソル階層 | ビジネス階層 | DDD階層<br/>（問題領域→解決領域） | 実装階層<br/>（ソリューション構成） | 多重度 |
|------------|------------|---------------------------|---------------------------|--------|
| **Value Stream** | **B0: バリューストリーム** | - | - | - |
| | "DXプロジェクト成功支援" | - | - | |
| ↓ | ↓ | | | 1 VS = N Stages |
| **Value Stage** | **B1: バリューステージ** | - | - | |
| | "プロジェクト計画支援" | - | - | |
| ↓ | ↓ | | | 1 Stage = N L1 |
| **Capability L1** | **B2: ケーパビリティL1** | **【問題領域】**<br/>**D0: Subdomain** | - | |
| | "プロジェクト構想する能力" | Core Subdomain<br/>"プロジェクト計画" | - | |
| ↓ | ↓ | ↓ | | 1 SD = 1..* BC |
| **Bounded Context**<br/>(= Service) | B2: ケーパビリティL1相当 | **【解決領域】**<br/>**D1: Bounded Context** | **【ソリューション構成】**<br/>**S1: Microservice** | |
| | "プロジェクト成功支援" | "Project Success Context"<br/>ドメインモデル設計 | "Project Service"<br/>実装・デプロイ単位 | 1 BC = 1..* MS |
| ↓ | ↓ | ↓ | ↓ | 1 BC = 1..* L2 |
| **Capability L2** | **B3: ケーパビリティL2** | **【解決領域】**<br/>D2: Aggregate | **【ソリューション構成】**<br/>S2: Service Module | |
| | "計画を策定する能力" | "Planning Aggregate"<br/>トランザクション境界 | "PlanningModule"<br/>コード構造化単位 | |
| ↓ | ↓ | ↓ | ↓ | 1 L2 = 1..* L3 |
| **Capability L3**<br/>(= Operation) | **B4: ケーパビリティL3** | **【解決領域】**<br/>D2: Entity/VO | **【ソリューション構成】**<br/>S3: UseCase/Controller | |
| | "スケジュールを作成する能力" | "Schedule Entity"<br/>ドメインオブジェクト | "ScheduleUseCase.ts"<br/>ビジネスロジック実装 | |
| ↓ | ↓ | ↓ | ↓ | 1 L3 = 1..* UC |
| **Use Case / Page** | **B5/B6: プロセス/<br/>アクティビティ** | **【解決領域】**<br/>D3: Application Service | **【ソリューション構成】**<br/>S3: API + UI | |
| | "スケジュールを登録する" | "CreateScheduleUseCase"<br/>アプリケーションロジック | "POST /api/schedules"<br/>+ "schedule-form.tsx"<br/>API・UI実装 | |

**3つの領域の流れ**:
```
問題領域（D0）              解決領域（D1-D3）                    ソリューション構成（S1-S4）
何を解決するか          →   どうモデル化するか              →   どう実装・構成するか
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subdomain                   Bounded Context                     Microservice
"プロジェクト計画"     →    "Project Success Context"      →   "Project Service"
(Core/Supporting/Generic)   ├─ Aggregate (D2)                   ├─ NestJS Module (S2)
                            ├─ Entity/VO (D2)                   ├─ Controller (S3)
                            ├─ Domain Service (D2)              ├─ UseCase (S3)
                            └─ Repository (D3)                  └─ PostgreSQL Schema (S4)
```

---

#### バリューステージとサブドメイン・BCの関係

**重要な原則**:

```
バリューステージ（価値創造の段階）
  └─ ケーパビリティL1（戦略的組織能力）
      ├─ 問題領域: Subdomain（Core/Supporting/Generic）
      ├─ 解決領域: Bounded Context（ドメインモデル）
      └─ ソリューション構成: Microservice（実装）
```

**パラソルにおける例**:

```
バリューステージ: "プロジェクト計画支援"
  │
  ├─ ケーパビリティL1: "プロジェクト構想する能力"
  │   ├─ 問題領域: Core Subdomain "プロジェクト計画"
  │   ├─ 解決領域: BC "Project Success Service"
  │   └─ ソリューション: MS "Project Service"
  │
  └─ ケーパビリティL2: "計画を策定する能力"
      ├─ 問題領域: （ケーパビリティL1のSubdomainに含まれる）
      ├─ 解決領域: Aggregate "Planning Aggregate"
      └─ ソリューション: Module "PlanningModule"

バリューステージ: "成果可視化支援"
  │
  └─ ケーパビリティL1: "生産性を可視化する能力"
      ├─ 問題領域: Core Subdomain "生産性可視化"
      ├─ 解決領域: BC "Productivity Visualization Service"
      └─ ソリューション: MS "Productivity Service"
```

**Subdomainタイプの決定**:

| バリューステージ | ケーパビリティL1 | Subdomainタイプ | 対応BC | 戦略 |
|---------------|----------------|----------------|--------|------|
| プロジェクト計画支援 | プロジェクト構想する能力 | **Core** | Project Success | 自社開発・最優先 |
| 成果可視化支援 | 生産性を可視化する能力 | **Core** | Productivity Visualization | 自社開発・最優先 |
| 人材最適化支援 | 人材を最適配置する能力 | Supporting | Talent Optimization | 自社開発or外注 |
| セキュリティ提供 | 認証基盤を提供する能力 | Generic | Secure Access | 既製品利用 |

---

#### 重要な原則：概念の分離と統合

**分離の原則**:
```
✅ ビジネス階層: ビジネス価値を中心に考える
   → 技術的な制約を考えない

✅ DDD階層: ドメインモデルの一貫性を中心に考える
   → 実装方法を考えない

✅ サービス/実装階層: 技術的な最適化を中心に考える
   → ビジネスロジックを含めない
```

**統合の原則**:
```
パラソルでは3つの概念を統合:
1. ビジネス価値（What）を明確にする
2. DDDパターン（How to Model）で構造化する
3. サービス実装（How to Implement）で実現する
```

---

#### パラソル階層の決定順序（バリューストリームから開始）

```
ステップ0: バリューストリームの定義（価値の流れ全体）
├─ 顧客に提供する価値の明確化
├─ エンドツーエンドの価値創造プロセスの可視化
└─ バリューストリームマップの作成

↓

ステップ1: バリューステージの特定（価値創造の各段階）
├─ 価値創造の段階を分解
├─ 各ステージの価値提供ポイントを明確化
└─ ステージ間の依存関係を整理

↓

ステップ2: ケーパビリティ階層の分析（バリューステージ内）
├─ ケーパビリティL1（戦略的組織能力）の特定
├─ ケーパビリティL2（戦術的組織能力）の特定
├─ ケーパビリティL3（具体的な業務能力）の特定
└─ ケーパビリティマップの作成

↓

ステップ3: サブドメインの特定（問題領域の分析）
├─ 各ケーパビリティL1に対するサブドメインを抽出
├─ サブドメインのタイプ決定（Core/Supporting/Generic）
└─ サブドメインマップの作成

↓

ステップ4: Bounded Contextの設計（解決領域の設計）
├─ Subdomain → Bounded Contextへのマッピング決定
├─ Bounded Contextの境界確定
├─ コンテキストマップの作成
├─ Aggregateの設計
└─ Entity/Value Objectの定義

↓

ステップ5: マイクロサービスの決定（ソリューション構成）
├─ BC → Microserviceへのマッピング決定
├─ デプロイメント戦略（モノリス or MS）
├─ モジュール構造の設計
└─ API/データベース設計
```

**重要な原則**:
- **ステップ0-2は必須**：バリューストリーム、バリューステージ、ケーパビリティ階層の分析は必須
- **ステップ3は推奨**：サブドメイン分析により戦略的な意思決定が可能（Core/Supporting/Genericの判断）
- **ステップ4は必須**：Bounded Contextの設計は必ず実施
- **ステップ5は後から変更可能**：実装方法は後から柔軟に変更できる

**各ステップの成果物とMD作成手順**:

#### ステップ0: VALUE_STREAM_MAP.md の作成

**目的**: 顧客への価値の流れ全体を可視化

**責任者**: **ビジネス部門（経営層）**

**作成手順**:
1. **ビジネス部門・経営層**がワークショップを主導
2. 顧客視点で価値の流れを洗い出す
3. AIにドラフトを依頼（例: "医療DXのバリューストリームマップを作成して"）
4. **ビジネス部門**がレビュー・調整してMD形式で保存
5. アーキテクトは参加するが、ビジネス判断はビジネス部門が行う

**MDファイル構造例**:
```markdown
# バリューストリームマップ: [サービス名]

## 顧客提供価値
[エンドツーエンドの価値創造プロセス]

## バリューステージ一覧
1. [ステージ1名]: [価値提供ポイント]
2. [ステージ2名]: [価値提供ポイント]
3. [ステージ3名]: [価値提供ポイント]

## 価値の流れ図
[Mermaid図またはASCII図]
```

**保存場所**: `docs/domain/VALUE_STREAM_MAP.md`

---

#### ステップ1: VALUE_STAGE_DEFINITION.md の作成

**目的**: 各バリューステージの詳細定義

**責任者**: **ビジネス部門（経営層・事業部長）**

**作成手順**:
1. **ビジネス部門**がVALUE_STREAM_MAP.mdから各ステージを抽出
2. **ビジネス部門**が各ステージの価値提供ポイント、成果指標を定義
3. AIに各ステージの詳細化を依頼
4. **ビジネス部門**がステージ間の依存関係を整理

**MDファイル構造例**:
```markdown
# バリューステージ定義

## ステージ1: [名称]
- **価値提供**: [具体的な価値]
- **成果指標**: [測定可能な指標]
- **前提条件**: [依存する前ステージ]

## ステージ2: [名称]
...
```

**保存場所**: `docs/domain/VALUE_STAGE_DEFINITION.md`

---

#### ステップ2: CAPABILITY_MAP.md の作成

**目的**: 組織能力の階層構造を可視化（L1/L2/L3）

**責任者**: **ビジネス部門（事業部長・部門長・マネージャー）**

**作成手順**:
1. **ビジネス部門**が各バリューステージ内のケーパビリティを分析
2. **ビジネス部門**がL1（戦略）→ L2（戦術）→ L3（具体）の階層化を実施
   - L1: 事業部長・部門長が戦略的組織能力を定義
   - L2: 部門長・マネージャーが戦術的組織能力を定義
   - L3: マネージャー・リーダーが具体的な業務能力を定義
3. AIにケーパビリティマップのドラフトを依頼
4. **ビジネス部門**が主導でレビュー（アーキテクトは助言のみ）

**MDファイル構造例**:
```markdown
# ケーパビリティマップ

## バリューステージ: [ステージ名]

### ケーパビリティL1（戦略的組織能力）
- **[能力名]**: [説明]
  - ケーパビリティL2（戦術的）
    - [能力名]: [説明]
      - ケーパビリティL3（具体的）
        - [能力名]: [説明]
```

**保存場所**: `docs/domain/CAPABILITY_MAP.md`

---

#### ステップ3: SUBDOMAIN_MAP.md の作成

**目的**: 問題領域の分析とサブドメインタイプの決定

**責任者**: **ビジネス部門 + ドメインエキスパート・アーキテクト（協働）**

**作成手順**:
1. **ドメインエキスパート・アーキテクト**が各ケーパビリティL1に対応するサブドメインを抽出
2. **ビジネス部門 + ドメインエキスパート**がCore/Supporting/Genericのタイプ判定
   - Core: 競争優位性を生む → ビジネス戦略的判断（ビジネス部門主導）
   - Supporting: 必要だが差別化にならない → 協働判断
   - Generic: 既製品で代替可能 → アーキテクト主導
3. AIに戦略的な判断基準を提案させる
4. **ビジネス部門**が最終決定、ドメインエキスパートが合意形成

**MDファイル構造例**:
```markdown
# サブドメインマップ

## サブドメイン一覧

### Core Subdomain（競争優位性）
| サブドメイン名 | 説明 | 戦略 | 対応ケーパビリティL1 |
|--------------|------|------|-------------------|
| [名称] | [説明] | 自社開発・最高の人材投入 | [L1名] |

### Supporting Subdomain（必要だが差別化にならない）
...

### Generic Subdomain（既製品で代替可能）
...
```

**保存場所**: `docs/domain/SUBDOMAIN_MAP.md`

---

#### ステップ4: context.md, context-map.md の作成

**目的**: 解決領域の設計（Bounded Contextの境界確定）

**責任者**: **ドメインエキスパート・アーキテクト**

**作成手順**:
1. **アーキテクト**がSubdomain → Bounded Contextのマッピング決定
2. **ドメインエキスパート + アーキテクト**が各BCのドメインモデル設計（Aggregate, Entity, VO）
3. AIにドメインモデルのドラフトを依頼
4. **アーキテクト**がコンテキストマップ（BC間の関係）を作成
5. ビジネス部門はレビューに参加するが、技術的判断はアーキテクトが行う

**MDファイル構造例（context.md）**:
```markdown
# Bounded Context: [BC名]

## ユビキタス言語
- **[用語]**: [定義]

## ドメインモデル
### Aggregate Root
- **[名称]**: [説明]
  - Entity: [...]
  - Value Object: [...]

## 境界内のルール
...
```

**MDファイル構造例（context-map.md）**:
```markdown
# コンテキストマップ

## BC間の関係

### [BC1] → [BC2]
- **関係タイプ**: Customer/Supplier
- **統合パターン**: REST API
- **Shared Kernel**: [共有する概念]
```

**保存場所**: `docs/design/bounded-contexts/[bc-name]/context.md`

---

#### ステップ5: api-specification.md の作成

**目的**: ソリューション構成の具体化（実装仕様）

**責任者**: **エンジニア・DevOpsチーム**

**作成手順**:
1. **エンジニア + アーキテクト**がBC → Microserviceのマッピング決定
2. **DevOpsチーム + エンジニア**がデプロイメント戦略（モノリス/MS/ハイブリッド）を選択
3. AIにAPI仕様、DB設計のドラフトを生成させる
4. **エンジニア**がレビュー・実装・テスト
5. ビジネス部門・アーキテクトはレビューに参加するが、技術選択はエンジニアが行う

**MDファイル構造例**:
```markdown
# API仕様: [MS名]

## エンドポイント一覧

### POST /api/[resource]
- **目的**: [...]
- **リクエスト**: [...]
- **レスポンス**: [...]
- **ビジネスロジック**: [対応するUseCase名]
```

**保存場所**: `docs/api/services/[service-name]/api-specification.md`

---

**AI協働のベストプラクティスと責任分担**:

```
【ビジネス階層】ステップ0-2: ビジネス部門が主導
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 責任者: ビジネス部門（経営層・事業部長・部門長・マネージャー）
- AI活用: 「[業務ドメイン]のバリューストリームマップを作成して」
         「[業務]のケーパビリティマップを作成して」
  → AIがドラフトを生成
  → ビジネス部門がレビュー・調整・最終決定
- アーキテクトの役割: 助言・支援のみ（意思決定はビジネス部門）

【問題領域】ステップ3: ビジネス部門 + ドメインエキスパート協働
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 責任者: ビジネス部門 + ドメインエキスパート・アーキテクト
- AI活用: 「[業務ドメイン]のサブドメインマップを作成して」
  → AIがCore/Supporting/Generic分類を提案
  → ビジネス部門が戦略的判断（Core判定）
  → ドメインエキスパートが技術的判断（Generic判定）

【解決領域】ステップ4: ドメインエキスパート・アーキテクトが主導
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 責任者: ドメインエキスパート・アーキテクト
- AI活用: 「[Subdomain名]のBounded Contextを設計して」
  → AIがドメインモデルを提案
  → アーキテクトがレビュー・精緻化・最終決定
- ビジネス部門の役割: レビュー参加のみ（技術判断はアーキテクト）

【ソリューション構成】ステップ5: エンジニアが主導
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 責任者: エンジニア・DevOpsチーム
- AI活用: 「[BC名]のREST API仕様を生成して」
         「[ドメインモデル]からTypeScriptコードを生成して」
  → AIが実装仕様・コードを生成
  → エンジニアが実装・テスト・デプロイ
- アーキテクトの役割: アーキテクチャレビューのみ

このMD形式により、AIが設計を理解し、コード生成や改善提案が可能になります。
各ステップで明確な責任分担を行うことで、効率的な協働開発が実現します。
```

**階層の対応関係**:
```
バリューストリーム（1つ）
  └─ バリューステージ（複数）
      └─ ケーパビリティL1（複数）
          ├─ サブドメイン（1つ） → 問題領域
          ├─ Bounded Context（1つ以上） → 解決領域
          └─ Microservice（1つ以上） → ソリューション構成
```

#### 実装パターンとの対応

```
パターンA: 1つのMSに1つのBC
┌─────────────────────┐
│ Auth MS             │
│ ┌─────────────────┐ │
│ │ Secure Access   │ │
│ │ (BC)            │ │
│ │ ├─ Cap1         │ │
│ │ └─ Cap2         │ │
│ └─────────────────┘ │
└─────────────────────┘

パターンB: 1つのMSに複数のBC
┌─────────────────────┐
│ Auth Platform MS    │
│ ┌─────────────────┐ │
│ │ Secure Access   │ │
│ │ (BC1)           │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ User Management │ │
│ │ (BC2)           │ │
│ └─────────────────┘ │
└─────────────────────┘

パターンC: モノリス（1つのMSに全BC）
┌─────────────────────┐
│ Monolith MS         │
│ ├─ BC1 (Auth)       │
│ ├─ BC2 (Project)    │
│ ├─ BC3 (Talent)     │
│ └─ BC4 (...)        │
└─────────────────────┘
```

#### ディレクトリマッピング例

```
bounded-contexts/secure-access/     # L2: バウンデッドコンテキスト
  └── capabilities/                 # L3: ビジネスケーパビリティ
      ├── authenticate/             # "認証する能力"
      │   └── operations/           # L4: ビジネスオペレーション
      │       ├── login/            # "ログインする"
      │       │   └── usecases/     # L5: ユースケース
      │       │       ├── password-login/  # "パスワードでログインする"
      │       │       │   ├── usecase.md
      │       │       │   └── page.md
      │       │       └── sso-login/       # "SSOでログインする"
      │       └── logout/           # "ログアウトする"
      └── manage-sessions/          # "セッション管理する能力"
```

**重要な原則**:
- **L1（MS範囲）**: 実装フェーズで決定。モノリスから始めて段階的に分離
- **L2（BC）**: 設計の最初に確定。ドメイン境界を明確化
- **L3-L5**: ビジネス分析に基づき段階的に詳細化

### 3.9 実装移行パターン

```
フェーズ1: モノリスからスタート（1 MS = 全 BC）
┌────────────────────────┐
│ Monolith Application   │
│ ├── Auth Module (BC1)  │
│ ├── Project Module (BC2)│
│ └── Talent Module (BC3)│
└────────────────────────┘

↓ 成長・負荷増加

フェーズ2: 段階的分離（BC1を独立MS化）
┌──────────────┐  ┌────────────────────┐
│ Auth Service │  │ Main Application   │
│ (BC1のみ)    │  │ ├── Project (BC2)  │
└──────────────┘  │ └── Talent (BC3)   │
                  └────────────────────┘

↓ さらなる成長

フェーズ3: 完全マイクロサービス化（各BC = 独立MS）
┌──────────────┐
│ Auth Service │ (BC1)
└──────────────┘
┌──────────────┐
│Project Service│ (BC2)
└──────────────┘
┌──────────────┐
│Talent Service│ (BC3)
└──────────────┘
```

**重要**: パラソル設計は**フェーズ1から一貫**しています。実装が変わっても、ドメインモデルは不変です。

### 3.10 コンテキストマップ（Context Map）

#### コンテキストマップとは

**定義**: バウンデッドコンテキスト間の関係性と統合パターンを可視化したマップ

コンテキストマップは、システム全体のアーキテクチャを理解し、各コンテキスト間のコミュニケーションと依存関係を明確にするための戦略的ツールです。

#### DDDにおけるコンテキスト関係パターン

| パターン | 説明 | パラソルでの適用例 |
|---------|------|------------------|
| **Shared Kernel (共有カーネル)** | 複数のコンテキストで共有されるドメインモデル | 共通エンティティ（ユーザー、組織） |
| **Customer/Supplier (顧客/供給者)** | 下流が上流のAPIを利用（上流が優先） | 認証サービス → 他サービス |
| **Conformist (順応者)** | 下流が上流のモデルに完全に従う | 外部API統合 |
| **Anti-Corruption Layer (腐敗防止層)** | 下流が独自モデルを保ち変換層を持つ | レガシーシステム統合 |
| **Open Host Service (公開ホストサービス)** | 標準化されたAPIを提供 | 各サービスのREST API |
| **Published Language (公開言語)** | 共通のデータ交換フォーマット | JSON API、イベントスキーマ |
| **Partnership (パートナーシップ)** | 対等な関係で協調的に開発 | プロジェクト成功 ⇄ ナレッジ共創 |
| **Separate Ways (独立路線)** | 統合せず独立して運用 | 外部の独立システム |

#### パラソルコンテキストマップ

```mermaid
graph TB
    %% コンテキスト定義
    SA[セキュアアクセス<br/>サービス<br/><br/>認証・認可]
    PS[プロジェクト成功<br/>支援サービス<br/><br/>プロジェクト管理]
    TO[タレント最適化<br/>サービス<br/><br/>人材配置]
    PV[生産性可視化<br/>サービス<br/><br/>工数・成果分析]
    KC[ナレッジ共創<br/>サービス<br/><br/>知識管理]
    RO[収益最適化<br/>サービス<br/><br/>売上・収益管理]
    CF[コラボレーション<br/>促進サービス<br/><br/>チーム協働]

    %% Customer/Supplier 関係（認証基盤）
    SA -->|Customer/Supplier<br/>認証・認可提供| PS
    SA -->|Customer/Supplier<br/>認証・認可提供| TO
    SA -->|Customer/Supplier<br/>認証・認可提供| PV
    SA -->|Customer/Supplier<br/>認証・認可提供| KC
    SA -->|Customer/Supplier<br/>認証・認可提供| RO
    SA -->|Customer/Supplier<br/>認証・認可提供| CF

    %% Partnership 関係（協調的連携）
    PS <-->|Partnership<br/>プロジェクト情報共有| TO
    PS <-->|Partnership<br/>知見蓄積・活用| KC
    PV <-->|Partnership<br/>工数データ連携| RO

    %% Customer/Supplier 関係（データ提供）
    TO -->|Customer/Supplier<br/>人材スキル情報| PS
    PV -->|Customer/Supplier<br/>実績データ| PS
    KC -->|Customer/Supplier<br/>ベストプラクティス| PS

    PS -->|Customer/Supplier<br/>プロジェクト情報| RO
    TO -->|Customer/Supplier<br/>稼働情報| PV

    %% Open Host Service（全体基盤）
    CF -.->|Open Host Service<br/>通知・コミュニケーション| PS
    CF -.->|Open Host Service<br/>通知・コミュニケーション| TO
    CF -.->|Open Host Service<br/>通知・コミュニケーション| PV

    %% スタイル定義
    style SA fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style PS fill:#4ecdc4,stroke:#0a9396,stroke-width:2px,color:#fff
    style TO fill:#45b7d1,stroke:#0077b6,stroke-width:2px,color:#fff
    style PV fill:#96ceb4,stroke:#52b788,stroke-width:2px,color:#fff
    style KC fill:#ffeaa7,stroke:#fdcb6e,stroke-width:2px,color:#333
    style RO fill:#dfe6e9,stroke:#74b9ff,stroke-width:2px,color:#333
    style CF fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
```

#### コンテキスト間の関係詳細

##### 1. セキュアアクセスサービス（中核基盤）

```
役割: Upstream（上流）供給者
パターン: Customer/Supplier, Open Host Service

提供内容:
- ユーザー認証API
- 権限管理API
- セッション管理
- 監査ログ

依存関係:
→ すべてのサービスが依存（必須基盤）
```

##### 2. プロジェクト成功支援サービス（中心ハブ）

```
役割: 中核的な協調ハブ
パターン: Partnership（多方向）

連携関係:
⇄ タレント最適化: プロジェクトアサイン情報の双方向連携
⇄ ナレッジ共創: プロジェクト知見の蓄積・活用
← 生産性可視化: 実績データの受信
→ 収益最適化: プロジェクト売上情報の提供
```

##### 3. 生産性可視化 ⇄ 収益最適化（データ連携）

```
役割: 分析・最適化ペア
パターン: Partnership

連携内容:
- 工数データ → 原価計算
- 稼働率データ → 収益性分析
- パフォーマンス指標 → 収益予測
```

##### 4. コラボレーション促進サービス（横断的基盤）

```
役割: 横断的なコミュニケーション基盤
パターン: Open Host Service

提供内容:
- 通知配信API
- チャット・会議機能
- ファイル共有
- アクティビティフィード

特徴: すべてのサービスから呼び出し可能
```

#### コンテキストマップから実装へ

##### 統合パターンの実装ガイド

| コンテキスト関係 | 推奨実装パターン | 実装例 |
|----------------|----------------|--------|
| **Customer/Supplier** | REST API呼び出し | GET /api/auth/verify-token |
| **Partnership** | REST API + 定期同期 | GET /api/projects/{id} + キャッシュ |
| **Open Host Service** | 標準化API Gateway | API Gateway + OpenAPI Spec |
| **Shared Kernel** | 共有ライブラリ | @parasol/shared-types (npm package) |

##### 実装例: セキュアアクセス統合

```typescript
// プロジェクト成功支援サービスでの認証統合
// パターン: Customer/Supplier

// ❌ 緊密な結合（避けるべき）
import { User } from '@secure-access/domain-model';

// ✅ Anti-Corruption Layer（推奨）
interface AuthService {
  verifyToken(token: string): Promise<AuthResult>;
  getUserPermissions(userId: string): Promise<Permission[]>;
}

class SecureAccessAdapter implements AuthService {
  async verifyToken(token: string): Promise<AuthResult> {
    // 外部APIを呼び出し、内部モデルに変換
    const response = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const externalUser = await response.json();

    // 内部ドメインモデルに変換（腐敗防止）
    return this.toDomainModel(externalUser);
  }

  private toDomainModel(externalUser: any): AuthResult {
    // 外部モデル → 内部モデル変換
    return {
      userId: externalUser.id,
      name: externalUser.displayName,
      roles: externalUser.permissions.map(p => p.role)
    };
  }
}
```

##### 実装例: パートナーシップ統合（REST API同期）

```typescript
// プロジェクト成功支援 ⇄ ナレッジ共創
// パターン: Partnership (双方向API連携)

// プロジェクト成功支援サービス
class ProjectService {
  constructor(
    private knowledgeServiceClient: KnowledgeServiceClient
  ) {}

  async completeProject(projectId: string) {
    // ... プロジェクト完了処理

    // ナレッジ共創サービスに知見を送信
    try {
      await this.knowledgeServiceClient.submitProjectLessons({
        projectId,
        outcomes: project.outcomes,
        lessons: project.lessons
      });
    } catch (error) {
      // エラーハンドリング（リトライ、ログなど）
      console.error('Failed to submit lessons:', error);
    }
  }
}

// ナレッジ共創サービス
class KnowledgeServiceClient {
  async submitProjectLessons(data: ProjectLessonsDto) {
    const response = await fetch('/api/knowledge/project-lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit: ${response.status}`);
    }

    return response.json();
  }
}
```

#### コンテキストマップのメンテナンス

##### 定期的な見直しポイント

```markdown
□ 新しい統合要件が発生していないか
□ 既存の関係パターンは適切か（変更の必要性）
□ パフォーマンス問題が発生している統合はないか
□ セキュリティリスクが増加している箇所はないか
□ 循環依存が発生していないか
□ 各コンテキストの境界は明確か
```

##### コンテキストマップの進化

```
フェーズ1: 初期設計
- 基本的なCustomer/Supplier関係
- 同期的なREST API統合
- 直接API呼び出し

↓

フェーズ2: キャッシング導入
- Partnership関係に読み取りキャッシュ追加
- 定期的なデータ同期（ポーリング）
- レスポンス改善

↓

フェーズ3: 高度な統合
- Sagaパターンによる分散トランザクション（REST APIベース）
- API Gatewayによる統一アクセス
- サーキットブレーカー・リトライ機構
```

#### コンテキストマップのベストプラクティス

##### DO（推奨）

```
✓ コンテキスト境界を明確に保つ
✓ 各関係に適切なパターンを適用
✓ Anti-Corruption Layerで独立性を保つ
✓ REST APIで明確な契約を定義
✓ API仕様を明確にドキュメント化
✓ 定期的にマップを更新
```

##### DON'T（非推奨）

```
✗ 直接的なDB共有（Strong Coupling）
✗ ドメインモデルの直接共有
✗ 循環依存の許容
✗ 暗黙的な統合（ドキュメントなし）
✗ 適切なタイムアウト・リトライなしの統合
✗ コンテキスト境界の曖昧さ
```

### 3.11 ディレクトリ構成戦略：コンテキストとサービスの分離

#### 問題提起

バウンデッドコンテキスト（設計）とマイクロサービス（実装）の関係をディレクトリ構造でどう表現するかは、プロジェクトの長期的な成功に影響します。

**核心的な問いかけ**:
- コンテキストとサービスを同一視するか、明確に分離するか？
- ドメインモデルはどこに配置するか？
- 1BC = 複数MSの場合、どう表現するか？

#### パターン比較：5つのアプローチ

##### パターンA：完全分離型（設計・実装レイヤー分離）

```
プロジェクトルート/
├── design/                          # 設計レイヤー（実装非依存）
│   └── bounded-contexts/           # バウンデッドコンテキスト定義
│       ├── secure-access/          # コンテキスト名（実装非依存）
│       │   ├── context.md          # コンテキスト定義
│       │   ├── domain-language.md  # ドメイン言語
│       │   ├── ubiquitous-language.md
│       │   ├── context-map.md      # 他コンテキストとの関係
│       │   └── domain-model/       # 概念モデル（MD形式）
│       │       ├── entities.md
│       │       ├── value-objects.md
│       │       └── aggregates.md
│       ├── project-success/
│       └── talent-optimization/
│
├── implementation/                  # 実装レイヤー（技術依存）
│   ├── services/                   # マイクロサービス実装
│   │   ├── auth-service/           # BC: secure-access の実装
│   │   │   ├── src/
│   │   │   │   ├── domain/        # ドメインモデル実装
│   │   │   │   ├── application/   # アプリケーション層
│   │   │   │   ├── infrastructure/
│   │   │   │   └── api/
│   │   │   ├── tests/
│   │   │   └── package.json
│   │   │
│   │   ├── project-core-service/   # BC: project-success のコア実装
│   │   ├── project-analytics-service/ # BC: project-success の分析実装
│   │   └── ...
│   │
│   ├── shared/                     # Shared Kernel（複数BCで共有）
│   │   ├── domain/
│   │   │   ├── common-types.ts    # 共通型定義
│   │   │   └── user.ts            # 共有エンティティ
│   │   └── infrastructure/
│   │       └── event-bus.ts
│   │
│   └── monolith/                   # モノリス実装（初期段階）
│       └── src/
│           ├── contexts/          # コンテキスト別モジュール
│           │   ├── secure-access/
│           │   ├── project-success/
│           │   └── talent-optimization/
│           └── shared/
│
└── docs/
    ├── architecture/
    │   ├── context-mapping.md     # コンテキストマップ
    │   └── service-mapping.md     # BC→実装サービスのマッピング
    └── implementation/
        └── migration-guide.md     # モノリス→MS移行ガイド
```

**長所**:
- ✅ 設計と実装の完全分離（関心の分離）
- ✅ 1BC = 複数MSのケースを自然に表現
- ✅ ドメインモデルの共有範囲が明確
- ✅ 実装方法の変更が設計に影響しない
- ✅ 複数チームでの並行開発がしやすい

**短所**:
- ❌ ディレクトリ階層が深い
- ❌ BC→実装のマッピングが間接的
- ❌ 小規模プロジェクトには過剰

**適用場面**:
- 大規模プロジェクト（10+ BC）
- 複数チーム開発
- 1BC = 複数MSが一般的

---

##### パターンB：コンテキスト中心型（BCをルートに）

```
プロジェクトルート/
├── contexts/                       # バウンデッドコンテキストがルート
│   ├── secure-access/             # コンテキスト = トップレベル
│   │   ├── design/                # 設計ドキュメント
│   │   │   ├── context.md
│   │   │   ├── domain-language.md
│   │   │   └── api-specification.md
│   │   │
│   │   ├── domain/                # ドメインモデル（実装）
│   │   │   ├── entities/
│   │   │   │   ├── User.ts
│   │   │   │   └── Session.ts
│   │   │   ├── value-objects/
│   │   │   └── services/
│   │   │
│   │   ├── application/           # アプリケーション層
│   │   │   ├── use-cases/
│   │   │   └── services/
│   │   │
│   │   └── services/              # 実装サービス（複数可）
│   │       ├── auth-api/          # REST API実装
│   │       │   ├── src/
│   │       │   └── package.json
│   │       └── auth-worker/       # バックグラウンドワーカー
│   │           ├── src/
│   │           └── package.json
│   │
│   ├── project-success/
│   │   ├── design/
│   │   ├── domain/                # プロジェクトドメインモデル
│   │   ├── application/
│   │   └── services/
│   │       ├── project-core/      # コア機能
│   │       └── project-analytics/ # 分析機能
│   │
│   └── talent-optimization/
│
└── shared/                        # Shared Kernel
    ├── domain/
    └── infrastructure/
```

**長所**:
- ✅ コンテキスト境界が明確
- ✅ ドメインモデルがコンテキスト内に集約
- ✅ チーム分割が容易（1チーム = 1コンテキスト）
- ✅ コンテキスト内の凝集性が高い
- ✅ 設計→実装のトレーサビリティが高い

**短所**:
- ❌ services/配下に複数実装がある場合、選択が必要
- ❌ 共有コード（Shared Kernel）の管理が別領域

**適用場面**:
- 中〜大規模プロジェクト
- チーム別にコンテキスト担当
- 1BC = 1〜3実装サービス

---

##### パターンC：サービス中心型（実装ファースト）

```
プロジェクトルート/
├── services/                      # 実装サービスがルート
│   ├── auth-service/             # マイクロサービス単位
│   │   ├── design/               # このサービスの設計
│   │   │   └── bounded-context.md # 属するBCを明記
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   └── infrastructure/
│   │   └── package.json
│   │
│   ├── project-core-service/
│   └── project-analytics-service/
│
└── design/                        # 全体設計
    ├── bounded-contexts/
    │   ├── secure-access.md      # BC定義
    │   ├── project-success.md
    │   └── context-map.md
    └── service-mapping.md         # サービス→BCマッピング
```

**長所**:
- ✅ デプロイ単位と一致（運用しやすい）
- ✅ 各サービスの独立性が高い
- ✅ マイクロサービスアーキテクチャに自然

**短所**:
- ❌ ドメインモデルの共有が難しい
- ❌ コンテキスト境界が不明瞭
- ❌ 1BC = 複数サービスの関係が見えにくい
- ❌ 設計思考よりも実装思考に偏る

**適用場面**:
- マイクロサービス前提
- 小規模チーム
- 1BC = 1サービスが基本

---

##### パターンD：ハイブリッド型（推奨）

```
プロジェクトルート/
├── bounded-contexts/              # 設計：バウンデッドコンテキスト定義
│   ├── secure-access/
│   │   ├── README.md             # コンテキスト概要
│   │   ├── domain-language.md    # ドメイン言語
│   │   ├── context-map.md        # 他BCとの関係
│   │   ├── api-specification.md  # 公開API仕様
│   │   ├── database-design.md    # データ設計
│   │   │
│   │   └── domain-model/         # ドメインモデル定義（MD）
│   │       ├── entities.md       # エンティティ定義
│   │       ├── value-objects.md
│   │       ├── aggregates.md
│   │       └── domain-services.md
│   │
│   ├── project-success/
│   ├── talent-optimization/
│   └── _shared/                  # 共有概念（Shared Kernel設計）
│       └── common-entities.md
│
├── src/                           # 実装：現在の実装方法
│   ├── contexts/                 # モノリス内のコンテキスト実装
│   │   ├── secure-access/       # BC実装（モジュール）
│   │   │   ├── domain/          # ドメイン層実装
│   │   │   │   ├── entities/
│   │   │   │   │   ├── User.ts
│   │   │   │   │   └── Session.ts
│   │   │   │   ├── value-objects/
│   │   │   │   ├── aggregates/
│   │   │   │   └── services/
│   │   │   │
│   │   │   ├── application/     # アプリケーション層
│   │   │   │   ├── use-cases/
│   │   │   │   ├── commands/
│   │   │   │   └── queries/
│   │   │   │
│   │   │   ├── infrastructure/  # インフラ層
│   │   │   │   ├── repositories/
│   │   │   │   └── adapters/
│   │   │   │
│   │   │   └── api/             # APIエンドポイント
│   │   │       └── routes.ts
│   │   │
│   │   ├── project-success/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── api/
│   │   │
│   │   └── _shared/             # Shared Kernel実装
│   │       ├── domain/
│   │       │   ├── User.ts     # 共通エンティティ
│   │       │   └── Organization.ts
│   │       └── infrastructure/
│   │           └── event-bus.ts
│   │
│   └── _cross-cutting/          # 横断的関心事
│       ├── auth/                # 認証ミドルウェア
│       ├── logging/
│       └── monitoring/
│
├── services/                     # 将来：マイクロサービス実装
│   ├── auth-service/            # secure-accessの独立実装
│   │   ├── .context-mapping.json # BCとの紐付け
│   │   ├── src/
│   │   │   └── （src/contexts/secure-accessから移行）
│   │   └── package.json
│   │
│   └── _migration-guide.md      # モノリス→MS移行ガイド
│
├── docs/
│   ├── architecture/
│   │   ├── CONTEXT_MAP.md       # 全体コンテキストマップ
│   │   ├── IMPLEMENTATION_STRATEGY.md
│   │   └── bc-to-service-mapping.md # BC→実装マッピング
│   │
│   └── bounded-contexts/         # → bounded-contexts/ へのシンボリックリンク
│
└── .context-rules.json           # BC→実装のルール定義
```

**`.context-rules.json`の例**:
```json
{
  "version": "1.0",
  "strategy": "monolith-first",
  "mappings": [
    {
      "boundedContext": "secure-access",
      "implementations": [
        {
          "type": "module",
          "path": "src/contexts/secure-access",
          "status": "active"
        },
        {
          "type": "microservice",
          "path": "services/auth-service",
          "status": "planned"
        }
      ]
    },
    {
      "boundedContext": "project-success",
      "implementations": [
        {
          "type": "module",
          "path": "src/contexts/project-success",
          "status": "active"
        }
      ]
    }
  ],
  "sharedKernel": {
    "design": "bounded-contexts/_shared",
    "implementation": "src/contexts/_shared"
  }
}
```

**長所**:
- ✅ 設計と実装の対応が明確
- ✅ モノリス→マイクロサービスの移行パスが自然
- ✅ ドメインモデルがコンテキスト別に整理
- ✅ 設計ドキュメントと実装の距離が近い
- ✅ 段階的な移行が可能
- ✅ ツールで検証可能（.context-rules.json）

**短所**:
- ❌ bounded-contexts/とsrc/contexts/の二重管理
- ❌ ルール定義ファイルのメンテナンスが必要

**適用場面**:
- パラソルに最適
- モノリスからスタート、段階的にMS化
- 設計重視だが実装も重要視

---

##### パターンE：フラット型（シンプル）

```
プロジェクトルート/
├── secure-access/                # BC = ディレクトリ名
│   ├── design.md                 # 設計ドキュメント（1ファイル）
│   └── src/                      # 実装
│       ├── domain/
│       ├── application/
│       └── infrastructure/
│
├── project-success/
│   ├── design.md
│   └── src/
│
└── shared/
    └── src/
```

**長所**:
- ✅ 非常にシンプル
- ✅ 小規模に最適

**短所**:
- ❌ 大規模には不向き
- ❌ 設計ドキュメントが貧弱
- ❌ 複数実装の表現ができない

**適用場面**:
- 小規模プロジェクト（< 5 BC）
- プロトタイピング

---

#### パターン比較表

| 観点 | パターンA<br/>完全分離型 | パターンB<br/>コンテキスト中心 | パターンC<br/>サービス中心 | パターンD<br/>ハイブリッド | パターンE<br/>フラット |
|------|----------|------------|------------|-----------|---------|
| **設計と実装の分離** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| **トレーサビリティ** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **1BC=複数MS対応** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| **モノリス対応** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **移行容易性** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **学習コスト** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **小規模適性** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **大規模適性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **運用理解性** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

#### パラソルへの推奨：パターンD（ハイブリッド型）

**理由**:

1. **現状との整合性**
   - 既存の `docs/parasol/services/` → `bounded-contexts/` へリネーム
   - 実装は `src/contexts/` で管理（モノリス）
   - 将来の `services/` ディレクトリを予約

2. **段階的移行の実現**
   - Phase 1: モノリス（src/contexts/）
   - Phase 2: 一部MS化（services/auth-service）
   - Phase 3: 完全MS化（services/配下に全て）

3. **ドメインモデルの明確化**
   - 設計: `bounded-contexts/*/domain-model/`（MD形式）
   - 実装: `src/contexts/*/domain/`（TypeScript）
   - 対応関係が明確

4. **チーム開発の支援**
   - 1チーム = 1バウンデッドコンテキスト担当
   - 設計と実装の両方を管理

---

#### 具体的な移行手順（パラソル向け）

##### ステップ1: ディレクトリリネーム

```bash
# 現在
docs/parasol/services/

# 変更後
bounded-contexts/
```

##### ステップ2: 実装構造の整理

```bash
# 新規作成
src/contexts/
├── secure-access/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── api/
├── project-success/
└── _shared/
```

##### ステップ3: マッピングファイル作成

```bash
# 新規作成
.context-rules.json
docs/architecture/CONTEXT_MAP.md
docs/architecture/bc-to-service-mapping.md
```

##### ステップ4: 検証スクリプト

```typescript
// scripts/validate-context-mapping.ts
// BC定義と実装の整合性チェック
```

---

#### 運用ルール

##### Rule 1: ドメインモデルの配置

```
設計定義: bounded-contexts/{context-name}/domain-model/*.md
実装コード: src/contexts/{context-name}/domain/**/*.ts

例:
bounded-contexts/secure-access/domain-model/entities.md
  ↓ 実装
src/contexts/secure-access/domain/entities/User.ts
```

##### Rule 2: API仕様の配置

```
設計仕様: bounded-contexts/{context-name}/api-specification.md
実装: src/contexts/{context-name}/api/routes.ts

APIスキーマ: src/contexts/{context-name}/api/schema/
OpenAPI生成: src/contexts/{context-name}/api/openapi.yaml（自動生成）
```

##### Rule 3: Shared Kernelの管理

```
設計: bounded-contexts/_shared/
実装: src/contexts/_shared/

共有ドメインモデル例:
- User（全BCで共通のユーザー概念）
- Organization（組織概念）
- Currency（通貨値オブジェクト）

注意: 安易な共有は避け、必要最小限に
```

##### Rule 4: コンテキスト間通信

```typescript
// ❌ 直接import（避ける）
import { Project } from '../project-success/domain/entities/Project';

// ✅ Anti-Corruption Layer経由
import { ProjectService } from './infrastructure/adapters/ProjectServiceAdapter';
```

##### Rule 5: マイクロサービス化の判断基準

以下の条件を満たす場合、BC→MSへ分離:
- スケーリング要件が異なる
- デプロイ頻度が大きく異なる
- 技術スタックを変えたい
- チームが完全に分離されている

---

#### ツールサポート

##### 1. VS Code設定

```json
// .vscode/settings.json
{
  "files.associations": {
    "bounded-contexts/**/*.md": "parasol-design",
    "src/contexts/**/domain/**/*.ts": "parasol-domain-model"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/services": true  // 将来のMS用ディレクトリを検索から除外
  }
}
```

##### 2. 整合性チェックスクリプト

```bash
# 実装されていないBCを検出
npm run parasol:check-missing-implementations

# BC定義とドメインモデル実装の齟齬を検出
npm run parasol:validate-domain-models

# コンテキスト間の不正な依存を検出
npm run parasol:check-dependencies
```

---

#### まとめ：推奨ディレクトリ構成

```
consultingTool/
├── bounded-contexts/          # ⭐ 設計の真実（Source of Truth）
│   ├── secure-access/
│   ├── project-success/
│   ├── talent-optimization/
│   ├── productivity-visualization/
│   ├── knowledge-co-creation/
│   ├── revenue-optimization/
│   ├── collaboration-facilitation/
│   └── _shared/
│
├── src/contexts/              # ⭐ 現在の実装（モノリス）
│   ├── secure-access/
│   ├── project-success/
│   └── _shared/
│
├── services/                  # ⭐ 将来の実装（マイクロサービス）
│   └── _migration-guide.md
│
├── docs/
│   └── architecture/
│       ├── CONTEXT_MAP.md
│       └── bc-to-service-mapping.md
│
└── .context-rules.json        # ⭐ BC→実装のマッピングルール
```

**この構成の価値**:
- 設計思考を優先しつつ、実装の現実も尊重
- モノリス→マイクロサービスの自然な移行パス
- ツールによる検証が可能
- チーム拡大・縮小に柔軟に対応

### 3.10 データベース分離戦略：最大の難関を段階的に攻略

#### 重要な原則：モノリスでもコンテキスト分離を徹底

> ⚠️ **初期モノリスであってもコンテキストベースで、ドメイン言語、DB、APIを分離しておく**

この原則により：
- **ドメイン言語の分離**: 各コンテキストで独自のユビキタス言語を使用
- **DBスキーマの分離**: Phase 1から実施（外部キー禁止）
- **APIの分離**: コンテキスト境界を明確にしたエンドポイント設計

これにより、将来的なマイクロサービス化が容易になり、初期段階からコンテキスト境界を保つことができます。

---

#### DB分離の重要性と課題

**マイクロサービス化の本質はDB分離**です。APIを分離するだけでは不十分で、真の独立性を得るにはデータベースの分離が不可欠です。

##### DB分離が難しい理由

```
❌ 課題1: データの依存関係
- 外部キー制約の解消
- トランザクション境界の再設計
- 参照整合性の維持

❌ 課題2: パフォーマンス劣化
- JOINができなくなる
- N+1問題の発生
- データ重複の管理

❌ 課題3: 移行コスト
- データ移行の複雑さ
- ダウンタイムの発生リスク
- ロールバック困難性

❌ 課題4: 運用負荷
- 複数DBの監視
- バックアップ戦略の複雑化
- 障害時の影響範囲拡大
```

**だからこそ、段階的アプローチが必須**です。

---

#### 段階的DB分離：5つのフェーズ

##### Phase 0: モノリスDB（現状）

```
┌─────────────────────────────────────┐
│     Single PostgreSQL Database      │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  users   │  │ projects │       │
│  │  roles   │  │  tasks   │       │
│  │sessions  │  │  members │       │
│  └──────────┘  └──────────┘       │
│       ↑ FK          ↑ FK           │
│       └─────────────┘              │
│    外部キーで結合可能               │
└─────────────────────────────────────┘
         ↑
    全APIから直接アクセス
```

**問題点**：
- すべてのコンテキストが1つのDBを共有
- コンテキスト境界が曖昧
- スケーリングが困難

---

##### Phase 1: スキーマ分離（まずここから！）

```
┌─────────────────────────────────────────────────┐
│       Single PostgreSQL Database                │
│                                                 │
│  ┌────────────────┐  ┌────────────────┐       │
│  │ auth schema    │  │ project schema │       │
│  │                │  │                │       │
│  │  auth.users    │  │ project.projects│      │
│  │  auth.roles    │  │ project.tasks  │       │
│  │  auth.sessions │  │ project.members│       │
│  └────────────────┘  └────────────────┘       │
│         ↑                    ↑                 │
│         └────── ❌ FK禁止 ───┘                 │
│                                                 │
│  ┌────────────────┐  ┌────────────────┐       │
│  │ talent schema  │  │ revenue schema │       │
│  └────────────────┘  └────────────────┘       │
└─────────────────────────────────────────────────┘
```

**ディレクトリ構成**：

```
bounded-contexts/
├── secure-access/
│   └── database-design.md        # auth スキーマ設計
├── project-success/
│   └── database-design.md        # project スキーマ設計
└── _shared/
    └── database-design.md        # 共有データ設計

prisma/                           # または migrations/
├── schema.prisma                 # 全体スキーマ
├── migrations/
│   ├── 001_create_auth_schema.sql
│   ├── 002_create_project_schema.sql
│   └── 003_migrate_to_schemas.sql
│
└── schemas/                      # スキーマ別定義
    ├── auth.prisma              # auth スキーマ
    ├── project.prisma           # project スキーマ
    └── shared.prisma            # 共有テーブル
```

**実装ルール**：

```typescript
// ❌ NG: スキーマ間の外部キー
CREATE TABLE project.tasks (
  id UUID PRIMARY KEY,
  assigned_to UUID REFERENCES auth.users(id)  // ← 禁止！
);

// ✅ OK: IDだけ保持（参照整合性はアプリ層で）
CREATE TABLE project.tasks (
  id UUID PRIMARY KEY,
  assigned_user_id UUID  -- auth.users.id を保持（FK なし）
);

// アプリケーション層で整合性チェック
class AssignTaskUseCase {
  async execute(taskId: string, userId: string) {
    // 1. ユーザー存在確認（auth スキーマ）
    const user = await authRepo.findUser(userId);
    if (!user) throw new Error('User not found');

    // 2. タスク割り当て（project スキーマ）
    await projectRepo.assignTask(taskId, userId);
  }
}
```

**移行手順**：

```sql
-- ステップ1: スキーマ作成
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS project;
CREATE SCHEMA IF NOT EXISTS talent;

-- ステップ2: 外部キー制約の削除
ALTER TABLE tasks DROP CONSTRAINT fk_tasks_assigned_to_users;

-- ステップ3: テーブル移動
ALTER TABLE users SET SCHEMA auth;
ALTER TABLE projects SET SCHEMA project;

-- ステップ4: アプリケーション層でのバリデーション追加
-- （コード修正）
```

**メリット**：
- ✅ ダウンタイムなし
- ✅ ロールバック容易
- ✅ コンテキスト境界の可視化
- ✅ 次フェーズへの準備

---

##### Phase 2: スキーマ別接続プール

```
┌─────────────────────────────────────┐
│    PostgreSQL (同一DB)              │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐    │
│  │auth  │  │project│  │talent│    │
│  │schema│  │schema │  │schema│    │
│  └──────┘  └──────┘  └──────┘    │
└─────────────────────────────────────┘
      ↑          ↑          ↑
   Pool A     Pool B     Pool C
      │          │          │
┌─────┴──┐  ┌───┴───┐  ┌──┴────┐
│ Auth   │  │Project│  │Talent │
│ API    │  │ API   │  │ API   │
└────────┘  └───────┘  └───────┘
```

**実装例**：

```typescript
// src/contexts/secure-access/infrastructure/database.ts
export const authDbPool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  schema: 'auth',  // ← スキーマ固定
  max: 10,
  idleTimeoutMillis: 30000
});

// src/contexts/project-success/infrastructure/database.ts
export const projectDbPool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  schema: 'project',  // ← スキーマ固定
  max: 20,  // プロジェクトは負荷高いので多めに
  idleTimeoutMillis: 30000
});
```

**メリット**：
- ✅ コンテキスト別にリソース調整可能
- ✅ 監視・メトリクスが分離される
- ✅ 物理DB分離への準備

---

##### Phase 3: 論理DB分離（Read Replica活用）

```
┌────────────────────────┐
│   Primary DB           │
│  ┌─────┐  ┌─────┐    │
│  │auth │  │proj │    │
│  └─────┘  └─────┘    │
└────────┬───────────────┘
         │ Replication
         ↓
┌────────────────────────┐
│   Read Replica 1       │
│  ┌─────┐              │  ← Auth コンテキスト専用
│  │auth │              │
│  └─────┘              │
└────────────────────────┘

┌────────────────────────┐
│   Read Replica 2       │
│  ┌─────┐              │  ← Project コンテキスト専用
│  │proj │              │
│  └─────┘              │
└────────────────────────┘
```

**メリット**：
- ✅ 読み取り負荷を分散
- ✅ コンテキスト別の最適化
- ✅ 物理分離のテスト環境

---

##### Phase 4: 物理DB分離（本番MS化）

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Auth DB     │  │  Project DB  │  │  Talent DB   │
│              │  │              │  │              │
│ auth.users   │  │ proj.projects│  │talent.members│
│ auth.roles   │  │ proj.tasks   │  │talent.skills │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Auth Service  │  │Project Service│  │Talent Service│
│              │  │              │  │              │
│ :3001        │  │ :3002        │  │ :3003        │
└──────────────┘  └──────────────┘  └──────────────┘
```

**ディレクトリ構成**：

```
services/
├── auth-service/
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma         # auth DB専用スキーマ
│   ├── docker-compose.yml        # auth DB専用コンテナ
│   └── .env
│       DATABASE_URL=postgresql://auth_db:5432/auth
│
├── project-service/
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma         # project DB専用スキーマ
│   ├── docker-compose.yml
│   └── .env
│       DATABASE_URL=postgresql://project_db:5433/project
│
└── talent-service/
    └── ...
```

**docker-compose.yml例**：

```yaml
# services/auth-service/docker-compose.yml
version: '3.8'
services:
  auth-db:
    image: postgres:15
    environment:
      POSTGRES_DB: auth
      POSTGRES_USER: auth_user
      POSTGRES_PASSWORD: ${AUTH_DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - auth_data:/var/lib/postgresql/data

  auth-api:
    build: .
    environment:
      DATABASE_URL: postgresql://auth_user:${AUTH_DB_PASSWORD}@auth-db:5432/auth
    ports:
      - "3001:3000"
    depends_on:
      - auth-db

volumes:
  auth_data:
```

---

##### Phase 5: 分散データ管理（最終形態）

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Auth DB     │  │  Project DB  │  │  Talent DB   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Auth Service  │  │Project Service│  │Talent Service│
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │    REST API     │    REST API     │
       │   ←───────────→ │   ←───────────→ │
       │                 │                 │
       └────────┬────────┴─────────┬───────┘
                │                  │
                ↓                  ↓
         ┌─────────────┐    ┌─────────────┐
         │ API Gateway │    │  Read Cache │
         │  (Nginx)    │    │  (Redis)    │
         └─────────────┘    └─────────────┘
              ↓                    ↓
       REST API統合と        キャッシュで
       負荷分散              高速レスポンス
```

**実装パターン**：

```typescript
// REST API同期によるデータ管理
class UserService {
  async createUser(data: CreateUserDto) {
    // 1. Auth DBに保存
    const user = await this.authRepo.create(data);

    // 2. Webhookで他サービスに通知（オプション）
    await this.notifyUserCreated(user);

    return user;
  }

  private async notifyUserCreated(user: User) {
    // 他サービスへのWebhook通知
    const services = ['project-service', 'talent-service'];
    await Promise.allSettled(
      services.map(service =>
        fetch(`${service}/api/webhooks/user-created`, {
          method: 'POST',
          body: JSON.stringify({ userId: user.id })
        })
      )
    );
  }
}

// Project Service側でWebhook受信またはポーリング
class ProjectUserCacheService {
  // Webhook受信
  async handleUserCreatedWebhook(userId: string) {
    // Auth Serviceに最新データを問い合わせ
    const user = await this.authServiceClient.getUser(userId);
    await this.userCacheRepo.upsert(user);
  }

  // 定期ポーリング（バックアップ）
  @Cron('0 */5 * * * *') // 5分ごと
  async syncUserCache() {
    const updatedUsers = await this.authServiceClient.getUpdatedUsers(
      this.lastSyncTime
    );
    for (const user of updatedUsers) {
      await this.userCacheRepo.upsert(user);
    }
    this.lastSyncTime = new Date();
  }
}
```

---

#### Shared Kernel のデータ戦略

##### 問題：全BCで共通のデータをどう扱うか

```
例: User, Organization, Currency などの共通エンティティ
```

##### 戦略A: マスターDBパターン

```
┌─────────────────┐
│   Shared DB     │  ← ユーザー、組織のマスター
│                 │
│  users          │
│  organizations  │
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    ↓         ↓        ↓        ↓
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│Auth DB│ │Proj DB│ │Tal DB│ │Rev DB│
│       │ │       │ │       │ │       │
│user_id│ │user_id│ │user_id│ │user_id│
│(FK)   │ │(FK)   │ │(FK)   │ │(FK)   │
└───────┘ └───────┘ └───────┘ └───────┘
```

**問題点**：Shared DBがボトルネック、SPOF（単一障害点）

---

##### 戦略B: データ複製パターン（推奨）

```
┌───────────────────────────────────────────┐
│          REST API 同期戦略                 │
└───┬────────┬──────────┬───────────┬───────┘
    │        │          │           │
    │ REST   │ REST     │ REST      │ REST
    ↓        ↓          ↓           ↓
┌────────┐┌────────┐┌────────┐┌────────┐
│Auth DB ││Proj DB ││Tal DB  ││Rev DB  │
│        ││        ││        ││        │
│users   ││users   ││users   ││users   │
│(master)││(cache) ││(cache) ││(cache) │
└────────┘└────────┘└────────┘└────────┘
```

**実装例**：

```typescript
// Auth Service が Master
class AuthUserService {
  async updateUser(userId: string, data: UpdateUserDto) {
    // 1. Auth DBを更新（マスター）
    const user = await this.userRepo.update(userId, data);

    // 2. 更新フラグを記録（他サービスがポーリングで検知）
    await this.userSyncLogRepo.create({
      userId: user.id,
      updatedAt: new Date()
    });

    return user;
  }

  // 他サービス用の差分取得API
  async getUpdatedUsers(since: Date): Promise<User[]> {
    return this.userRepo.findUpdatedSince(since);
  }
}

// Project Service はキャッシュを保持
class ProjectUserCacheService {
  // 定期ポーリングで同期（5分ごと）
  @Cron('0 */5 * * * *')
  async syncUserCache() {
    const updatedUsers = await this.authServiceClient.getUpdatedUsers(
      this.lastSyncTime
    );

    for (const user of updatedUsers) {
      await this.userCacheRepo.upsert({
        userId: user.id,
        name: user.name,
        email: user.email,
        syncedAt: new Date()
      });
    }

    this.lastSyncTime = new Date();
  }

  async getUser(userId: string): Promise<User> {
    // キャッシュから取得
    let user = await this.userCacheRepo.findById(userId);

    // キャッシュミスの場合、Auth Serviceに問い合わせ
    if (!user) {
      user = await this.authServiceClient.getUser(userId);
      await this.userCacheRepo.upsert(user);
    }

    return user;
  }
}
```

---

#### トランザクション境界の再設計

##### モノリスでのトランザクション（簡単）

```typescript
// ❌ モノリスでは簡単だが、MS化で壊れる
async function assignTaskToUser(taskId: string, userId: string) {
  await db.transaction(async (tx) => {
    // 1. ユーザー確認
    const user = await tx.users.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // 2. タスク割り当て
    await tx.tasks.update({
      where: { id: taskId },
      data: { assignedTo: userId }
    });

    // 3. ユーザーの負荷更新
    await tx.users.update({
      where: { id: userId },
      data: { taskCount: { increment: 1 } }
    });
  });
  // すべて成功するかすべて失敗（ACID保証）
}
```

##### MS化後のトランザクション（困難）

```typescript
// ✅ Sagaパターンで分散トランザクション
class AssignTaskSaga {
  async execute(taskId: string, userId: string) {
    const sagaId = generateId();

    try {
      // Step 1: ユーザー確認（Auth Service）
      const user = await this.authServiceClient.getUser(userId);
      if (!user) throw new Error('User not found');

      // Step 2: ユーザー負荷確認（Auth Service）
      await this.authServiceClient.incrementTaskCount(userId, sagaId);

      // Step 3: タスク割り当て（Project Service）
      await this.projectServiceClient.assignTask(taskId, userId, sagaId);

      // Step 4: Saga完了
      await this.sagaRepo.markCompleted(sagaId);

    } catch (error) {
      // 補償トランザクション（ロールバック）
      await this.compensate(sagaId);
      throw error;
    }
  }

  private async compensate(sagaId: string) {
    // 実行済みの操作を逆順で取り消し
    const steps = await this.sagaRepo.getExecutedSteps(sagaId);

    for (const step of steps.reverse()) {
      switch (step.type) {
        case 'INCREMENT_TASK_COUNT':
          await this.authServiceClient.decrementTaskCount(step.userId);
          break;
        case 'ASSIGN_TASK':
          await this.projectServiceClient.unassignTask(step.taskId);
          break;
      }
    }
  }
}
```

---

#### データ移行チェックリスト

##### Phase 1 → Phase 2 移行時

```markdown
□ 外部キー制約の棚卸し
□ 制約削除の影響範囲調査
□ アプリケーション層バリデーション実装
□ ロールバック手順の準備
□ 本番環境での段階的ロールアウト計画
```

##### Phase 3 → Phase 4 移行時（最も困難）

```markdown
□ データ量の調査（移行時間見積もり）
□ ダウンタイム許容時間の確認
□ 移行スクリプトの作成とテスト
□ ブルー/グリーンデプロイメント準備
□ データ同期メカニズムの実装
  - 二重書き込み期間の設定
  - データ整合性チェック
  - 切り戻し手順の確立
□ 移行リハーサル（本番コピーで実施）
□ 監視・アラート設定
□ インシデント対応手順書作成
```

---

#### パラソルでの推奨ロードマップ

```
Year 1: Phase 0 → Phase 1（スキーマ分離）
├── Q1: スキーマ設計（bounded-contexts/*/database-design.md）
├── Q2: 外部キー制約の調査と削除計画
├── Q3: スキーマ移行の実施
└── Q4: アプリケーション層バリデーション強化

Year 2: Phase 1 → Phase 2（接続プール分離）
├── Q1: コンテキスト別接続プール実装
├── Q2: モニタリング強化
├── Q3: パフォーマンスチューニング
└── Q4: 次フェーズ準備（Read Replica検討）

Year 3以降: Phase 3 → Phase 4（物理DB分離）
└── 負荷の高いコンテキストから段階的に分離
    - 最優先: Secure Access（認証）
    - 次: Productivity Visualization（分析）
    - 最後: 残りのコンテキスト
```

---

#### まとめ：DB分離の鉄則

```
1. 一気に分離しない（段階的に）
2. Phase 1（スキーマ分離）を最優先
3. 外部キー制約は早めに削除
4. データ複製パターンを活用
5. Sagaパターンで分散トランザクション
6. 移行は本番コピーで十分にリハーサル
7. ロールバック手順を必ず用意
```

**DB分離は時間がかかる**ことを前提に、**今できることから始める**のが成功の鍵です。

---

## 4. MDファイル構成の見直し：コンテキスト中心設計

### 4.1 現状と課題

#### 現在の構造（services/）

```
docs/parasol/services/
├── [service-name]/                           # 7サービス存在
│   ├── service.md                           # サービス定義 ✅
│   ├── domain-language.md                   # ドメイン言語定義 ✅
│   ├── api-specification.md                 # API仕様 ✅
│   ├── database-design.md                   # DB設計 ✅
│   ├── integration-specification.md         # 統合仕様 ✅
│   └── capabilities/                        # ビジネスケーパビリティ
│       └── [capability-name]/
│           └── operations/                  # ビジネスオペレーション
│               └── [operation-name]/
│                   ├── operation.md
│                   ├── usecases/           # ユースケース
│                   │   └── [usecase]/
│                   │       ├── usecase.md
│                   │       ├── page.md
│                   │       └── api-usage.md
│                   └── pages/              # ページ定義
```

**問題点**：
- ❌ ディレクトリ名が `services/` だが、これは**バウンデッドコンテキスト**
- ❌ コンテキストマップの概念がない
- ❌ コンテキスト間の関係が不明確

---

### 4.2 推奨構成：bounded-contexts/

#### 基本方針

✅ **ディレクトリ名を変更**：`services/` → `bounded-contexts/`
✅ **コンテキストマップ概念を追加**
✅ **既存の階層構造は維持**（ケーパビリティ → オペレーション → ユースケース）

#### 新しい構造

```
bounded-contexts/                        # ⭐ リネーム（services → bounded-contexts）
├── CONTEXT_MAP.md                       # ⭐ 新規：全体コンテキストマップ
├── _shared/                             # ⭐ 新規：共有概念
│   ├── domain-language.md              # 共通エンティティ定義
│   └── database-design.md              # 共有データ設計
│
├── secure-access/                       # バウンデッドコンテキスト
│   ├── README.md                        # ⭐ 新規：コンテキスト概要
│   ├── context.md                       # ⭐ 新規：コンテキスト定義
│   ├── context-map.md                   # ⭐ 新規：他コンテキストとの関係
│   │
│   ├── service.md                       # 既存：サービス定義
│   ├── domain-language.md               # 既存：ドメイン言語
│   ├── api-specification.md             # 既存：API仕様
│   ├── database-design.md               # 既存：DB設計
│   ├── integration-specification.md     # 既存：統合仕様
│   │
│   └── capabilities/                    # 既存：ビジネスケーパビリティ
│       └── [capability-name]/
│           ├── capability.md
│           └── operations/
│               └── [operation-name]/
│                   ├── operation.md
│                   ├── usecases/
│                   │   └── [usecase]/
│                   │       ├── usecase.md
│                   │       ├── page.md
│                   │       └── api-usage.md
│                   └── pages/
│
├── project-success/
│   ├── README.md
│   ├── context.md
│   ├── context-map.md
│   ├── service.md
│   └── ... (同様の構造)
│
├── talent-optimization/
├── productivity-visualization/
├── knowledge-co-creation/
├── revenue-optimization/
└── collaboration-facilitation/
```

---

### 4.3 新規ファイルの詳細

#### CONTEXT_MAP.md（全体マップ）

**配置**：`bounded-contexts/CONTEXT_MAP.md`

**目的**：7つのバウンデッドコンテキスト全体の関係を可視化

**内容例**：

```markdown
# パラソルコンテキストマップ

## 概要

パラソルシステムは7つのバウンデッドコンテキストで構成されています。

## コンテキスト一覧

| コンテキスト名 | 役割 | 主要な関係 |
|--------------|------|----------|
| Secure Access | 認証・認可基盤 | すべてのコンテキストに認証を提供 |
| Project Success | プロジェクト管理 | 中心ハブ、多方向連携 |
| Talent Optimization | 人材配置 | Project Success と双方向連携 |
| Productivity Visualization | 生産性分析 | Revenue Optimization とデータ連携 |
| Knowledge Co-creation | 知識管理 | Project Success と知見共有 |
| Revenue Optimization | 収益最適化 | Project Success から情報受信 |
| Collaboration Facilitation | 協働促進 | 全コンテキストに通知提供 |

## 全体マップ図

（Mermaid図：セクション3.7のコンテキストマップ図を参照）

## コンテキスト関係パターン

### Customer/Supplier 関係
- Secure Access → すべてのコンテキスト（認証提供）

### Partnership 関係
- Project Success ⇄ Talent Optimization
- Project Success ⇄ Knowledge Co-creation
- Productivity Visualization ⇄ Revenue Optimization

### Open Host Service
- Collaboration Facilitation → すべてのコンテキスト（通知提供）

## 統合ポイント

各コンテキストの詳細な統合仕様は、各コンテキスト配下の
`integration-specification.md` を参照してください。
```

---

#### context.md（コンテキスト定義）

**配置**：`bounded-contexts/[context-name]/context.md`

**目的**：バウンデッドコンテキストの境界と責務を明確化

**内容例**：

```markdown
# バウンデッドコンテキスト：Secure Access

## コンテキスト定義

### 境界（Boundary）

**このコンテキストが扱う範囲**：
- ユーザー認証（Authentication）
- ユーザー認可（Authorization）
- セッション管理
- アクセス制御
- 監査ログ

**このコンテキストが扱わない範囲**：
- ユーザープロファイル詳細（Talent Optimization の責務）
- 組織階層管理（別コンテキストの責務）
- ビジネスロジック（各コンテキストの責務）

### ユビキタス言語（Ubiquitous Language）

このコンテキスト内で使用される主要用語：

- **User**: システムにアクセスする主体
- **Role**: ユーザーに付与される役割
- **Permission**: 具体的なアクセス権限
- **Session**: 認証済みユーザーのセッション
- **Token**: 認証トークン（JWT）

### 不変条件（Invariants）

- 1ユーザーは複数のロールを持つことができる
- セッションは有効期限を持つ
- トークンは署名されている必要がある
- すべてのアクセスは監査ログに記録される

### コンテキストの責務

1. **認証の提供**: すべてのコンテキストに対して認証サービスを提供
2. **権限管理**: ロールと権限の定義・管理
3. **アクセス制御**: リソースへのアクセス可否判定
4. **監査**: セキュリティ関連イベントの記録

## 関連ドキュメント

- [ドメイン言語](./domain-language.md): 詳細なエンティティ・値オブジェクト定義
- [コンテキストマップ](./context-map.md): 他コンテキストとの関係
- [API仕様](./api-specification.md): 公開API
- [データベース設計](./database-design.md): DB スキーマ設計
```

---

#### context-map.md（個別コンテキストマップ）

**配置**：`bounded-contexts/[context-name]/context-map.md`

**目的**：このコンテキストと他コンテキストの関係を詳細記述

**内容例**：

```markdown
# コンテキストマップ：Secure Access

## このコンテキストの役割

**パターン**: Customer/Supplier (Upstream)
**役割**: 認証・認可サービスの提供者

## 下流コンテキスト（依存される側）

### すべてのコンテキストへの提供

| コンテキスト | 関係パターン | 提供内容 | 統合方法 |
|------------|------------|---------|---------|
| Project Success | Customer/Supplier | 認証API | REST API |
| Talent Optimization | Customer/Supplier | 認証API | REST API |
| Productivity Visualization | Customer/Supplier | 認証API | REST API |
| Knowledge Co-creation | Customer/Supplier | 認証API | REST API |
| Revenue Optimization | Customer/Supplier | 認証API | REST API |
| Collaboration Facilitation | Customer/Supplier | 認証API | REST API |

### 提供API

```
POST /api/auth/login          # ログイン
POST /api/auth/logout         # ログアウト
GET  /api/auth/verify-token   # トークン検証
GET  /api/auth/permissions    # 権限取得
```

## 上流コンテキスト（依存する側）

**なし**（このコンテキストは他のコンテキストに依存しない）

## 共有カーネル（Shared Kernel）

### 共有エンティティ

- **User**: 基本的なユーザー情報
  - ID, Name, Email
  - 他コンテキストはUserIDのみを保持

### データ複製戦略

```
Secure Access が User のマスター
  ↓ REST API提供（GET /api/users/:id, GET /api/users/updated）
他コンテキストはキャッシュを保持＋定期ポーリング
  - Project Success: user cache (name, email) + 5分ごと同期
  - Talent Optimization: user cache (name, email) + 5分ごと同期
```

## Anti-Corruption Layer

他コンテキストは直接 User エンティティをimportせず、
アダプターを通してアクセス：

```typescript
// ❌ 直接import禁止
import { User } from '@secure-access/domain';

// ✅ アダプター経由
interface AuthServiceAdapter {
  verifyToken(token: string): Promise<AuthResult>;
  getUser(userId: string): Promise<UserInfo>;
}
```

## 統合仕様詳細

詳細は [integration-specification.md](./integration-specification.md) を参照
```

---

#### _shared/（共有概念）

**配置**：`bounded-contexts/_shared/`

**目的**：Shared Kernel（複数コンテキストで共有される概念）の管理

**構成**：

```
bounded-contexts/_shared/
├── README.md                  # Shared Kernel の説明
├── domain-language.md         # 共通エンティティ定義
├── database-design.md         # 共有データ設計
└── integration-patterns.md    # 共通統合パターン
```

**domain-language.md 例**：

```markdown
# 共有ドメイン言語（Shared Kernel）

## 概要

複数のバウンデッドコンテキストで共有される概念を定義します。

⚠️ **注意**: Shared Kernel は最小限にすべきです。
安易な共有は各コンテキストの独立性を損ないます。

## 共有エンティティ

### User（ユーザー）

**マスター**: Secure Access コンテキスト
**共有範囲**: 全コンテキスト
**共有方法**: データ複製パターン

| 属性 | 型 | 説明 | 共有範囲 |
|-----|---|------|---------|
| id | UUID | ユーザーID | ✅ 全コンテキスト |
| name | String | 氏名 | ✅ 全コンテキスト |
| email | String | メールアドレス | ✅ 全コンテキスト |
| roles | Role[] | ロール | ❌ Secure Access のみ |
| password | String | パスワード | ❌ Secure Access のみ |

### Organization（組織）

**マスター**: （TBD: 組織管理コンテキスト）
**共有範囲**: 一部コンテキスト

| 属性 | 型 | 説明 |
|-----|---|------|
| id | UUID | 組織ID |
| name | String | 組織名 |
| type | OrganizationType | 組織タイプ |

## 共有値オブジェクト

### Money（金額）

**共有範囲**: Revenue Optimization, Project Success

```typescript
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: Currency
  ) {}
}
```

### Period（期間）

**共有範囲**: Project Success, Productivity Visualization

```typescript
class Period {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {}
}
```

## データ同期API

### GET /api/users/:id（個別取得）

```typescript
interface UserResponse {
  userId: string;
  name: string;
  email: string;
  updatedAt: string;  // ISO 8601
}
```

### GET /api/users/updated（差分取得）

```typescript
interface UpdatedUsersRequest {
  since: string;  // ISO 8601 datetime
  limit?: number; // default: 100
}

interface UpdatedUsersResponse {
  users: Array<{
    userId: string;
    name: string;
    email: string;
    updatedAt: string;
  }>;
  nextCursor?: string;  // ページネーション用
}
```

**使用パターン**：

```typescript
// 他コンテキストからの呼び出し
class UserCacheSyncService {
  @Cron('0 */5 * * * *')  // 5分ごと
  async syncUsers() {
    const response = await this.authClient.getUpdatedUsers({
      since: this.lastSyncTime.toISOString()
    });

    for (const user of response.users) {
      await this.userCache.upsert(user);
    }

    this.lastSyncTime = new Date();
  }
}
```
```

---

### 4.4 移行手順

#### ステップ1: ディレクトリリネーム

```bash
cd consulting-dashboard-new

# バックアップ
cp -r docs/parasol/services docs/parasol/services.backup

# リネーム
mv docs/parasol/services docs/parasol/bounded-contexts

# または
git mv docs/parasol/services docs/parasol/bounded-contexts
```

#### ステップ2: 新規ファイルの作成

```bash
# 全体コンテキストマップ
touch docs/parasol/bounded-contexts/CONTEXT_MAP.md

# Shared Kernel
mkdir -p docs/parasol/bounded-contexts/_shared
touch docs/parasol/bounded-contexts/_shared/README.md
touch docs/parasol/bounded-contexts/_shared/domain-language.md
touch docs/parasol/bounded-contexts/_shared/database-design.md

# 各コンテキストにファイル追加
for context in secure-access project-success talent-optimization \
               productivity-visualization knowledge-co-creation \
               revenue-optimization collaboration-facilitation; do

  mkdir -p docs/parasol/bounded-contexts/$context
  touch docs/parasol/bounded-contexts/$context/README.md
  touch docs/parasol/bounded-contexts/$context/context.md
  touch docs/parasol/bounded-contexts/$context/context-map.md
done
```

#### ステップ3: コード内のパス参照を更新

```bash
# スクリプトやコード内の参照を更新
grep -r "docs/parasol/services" --include="*.ts" --include="*.js" \
  | sed 's/docs\/parasol\/services/docs\/parasol\/bounded-contexts/g'

# 具体的には：
# - scripts/restore-usecase-definitions.js
# - app/actions/parasol.ts
# - app/components/parasol/*
```

#### ステップ4: ドキュメントの更新

```bash
# ガイドドキュメント内の参照を更新
sed -i 's/docs\/parasol\/services/bounded-contexts/g' \
  docs/parasol/PARASOL_DEVELOPMENT_GUIDE.md
```

---

### 4.5 各ファイルの役割まとめ

| レベル | ファイル | 目的 | 新規/既存 |
|-------|---------|------|----------|
| **全体** | `CONTEXT_MAP.md` | 7コンテキスト全体の関係 | 🆕 新規 |
| **全体** | `_shared/domain-language.md` | 共有エンティティ定義 | 🆕 新規 |
| **コンテキスト** | `README.md` | コンテキスト概要 | 🆕 新規 |
| **コンテキスト** | `context.md` | コンテキスト定義・境界 | 🆕 新規 |
| **コンテキスト** | `context-map.md` | 他コンテキストとの関係 | 🆕 新規 |
| **コンテキスト** | `service.md` | サービス定義 | ✅ 既存 |
| **コンテキスト** | `domain-language.md` | ドメイン言語 | ✅ 既存 |
| **コンテキスト** | `api-specification.md` | API仕様 | ✅ 既存 |
| **コンテキスト** | `database-design.md` | DB設計 | ✅ 既存 |
| **コンテキスト** | `integration-specification.md` | 統合仕様 | ✅ 既存 |
| **ケーパビリティ** | `capability.md` | ビジネスケーパビリティ | ✅ 既存 |
| **オペレーション** | `operation.md` | ビジネスオペレーション | ✅ 既存 |
| **ユースケース** | `usecase.md` | ユースケース定義 | ✅ 既存 |
| **ユースケース** | `page.md` | ページ定義 | ✅ 既存 |
| **ユースケース** | `api-usage.md` | API使用方法 | ✅ 既存 |

---

### 4.6 パラソル階層と3概念体系のマッピング（再掲）

**重要**: パラソルの階層は**ビジネス階層**、**DDD階層**、**サービス/実装階層**の3つを統合しています。

#### 完全な階層構造

```
✅ パラソル階層（3概念体系の統合）：

Microservice Scope（サービス/実装階層のみ）
  └── 1つまたは複数の Bounded Context（3概念体系の交差点）
      └── 1つまたは複数の Business Capability（ビジネス階層 + DDD階層）
          └── 1つまたは複数の Business Operation（ビジネス階層 + DDD階層）
              └── 1つまたは複数の UseCase / Page（ビジネス階層 + サービス/実装階層）
                  ├── usecase.md
                  ├── page.md
                  └── api-usage.md
```

#### 3概念体系とのマッピング表

| パラソル階層 | ビジネス階層 | DDD階層 | サービス/実装階層 | 多重度 |
|------------|------------|---------|------------------|--------|
| **Microservice Scope** | - | - | S1: デプロイメント単位 | - |
| **Bounded Context** | B1/B2: 戦略/ケーパビリティ | D1: Bounded Context | S2: Service Module | 1 MS = 1..* BC |
| **Business Capability** | B2: ケーパビリティ | D2: Aggregate Root候補 | S2: Sub Module | 1 BC = 1..* Cap |
| **Business Operation** | B3: ビジネスオペレーション | D2: Domain Service | S3: Service Class | 1 Cap = 1..* Op |
| **Use Case / Page** | B4: ユーザーアクティビティ | D3: Application Service | S3: API + UI | 1 Op = 1..* UC |

この階層は**ビジネス価値**、**ドメインモデル**、**物理実装**の3つを明確に分離しつつ統合しています。

---

### 4.7 変更の影響範囲

#### 影響を受けるもの

```
✅ ディレクトリパス
  - docs/parasol/services/* → docs/parasol/bounded-contexts/*

✅ スクリプト
  - scripts/restore-usecase-definitions.js（パス参照）

✅ アプリケーションコード
  - app/actions/parasol.ts（ファイル読み込みパス）
  - app/components/parasol/*（表示ロジック）
```

#### 影響を受けないもの

```
✅ ファイルの内容（service.md, domain-language.md など）
✅ ケーパビリティ/オペレーション/ユースケースの構造
✅ データベースのデータ（既存データはそのまま）
```

---

### 4.8 問題空間と解決空間を分離した構成（修正案）

#### 修正案A：問題空間と解決空間を明示的に分離（推奨）

```
consultingTool/
│
├── docs/
│   ├── domain/                    # ⭐ 問題空間（Problem Space）
│   │   ├── SUBDOMAIN_MAP.md      # サブドメインマップ（Core/Supporting/Generic分類）
│   │   ├── business-model.md     # ビジネスモデル全体
│   │   └── subdomains/           # サブドメイン別分析
│   │       ├── dx-value-creation/      # Core Subdomain
│   │       │   ├── README.md           # サブドメイン概要
│   │       │   ├── business-analysis.md # ビジネス分析
│   │       │   ├── competitive-advantage.md # 競争優位性
│   │       │   └── strategy.md         # 戦略（自社開発・最優先）
│   │       ├── talent-optimization/    # Supporting Subdomain
│   │       │   ├── README.md
│   │       │   ├── business-analysis.md
│   │       │   └── strategy.md         # 戦略（自社開発or外注）
│   │       └── authentication/         # Generic Subdomain
│   │           ├── README.md
│   │           ├── business-analysis.md
│   │           └── strategy.md         # 戦略（既製品利用）
│   │
│   ├── design/                    # ⭐ 解決空間（Solution Space）
│   │   └── bounded-contexts/
│   │       ├── CONTEXT_MAP.md          # BC間の関係マップ
│   │       ├── SUBDOMAIN_BC_MAPPING.md # Subdomain→BCマッピング
│   │       ├── _shared/                # Shared Kernel
│   │       │
│   │       ├── secure-access/          # BC（Generic Subdomainから）
│   │       │   ├── README.md           # コンテキスト概要
│   │       │   ├── context.md          # コンテキスト定義
│   │       │   ├── subdomain-ref.md    # 🆕 対応するSubdomainへの参照
│   │       │   ├── context-map.md      # 他BCとの関係
│   │       │   ├── service.md          # サービス定義
│   │       │   ├── domain-language.md  # ドメイン言語
│   │       │   └── capabilities/
│   │       │
│   │       ├── project-success/        # BC（Core Subdomainから）
│   │       │   ├── README.md
│   │       │   ├── subdomain-ref.md    # 🆕 dx-value-creation へ参照
│   │       │   └── ...
│   │       │
│   │       ├── productivity-visualization/ # BC（Core Subdomainから）
│   │       │   ├── README.md
│   │       │   ├── subdomain-ref.md    # 🆕 dx-value-creation へ参照
│   │       │   └── ...
│   │       │
│   │       └── talent-optimization/    # BC（Supporting Subdomainから）
│   │           ├── README.md
│   │           ├── subdomain-ref.md    # 🆕 talent-optimization へ参照
│   │           └── ...
│   │
│   └── parasol/
│       └── PARASOL_DEVELOPMENT_GUIDE.md
│
├── src/contexts/                  # 実装（モノリス）
├── services/                      # 将来（マイクロサービス）
└── .context-rules.json           # BC→実装マッピング
```

**新規ファイルの説明**：

**SUBDOMAIN_MAP.md**（サブドメインマップ）:
```markdown
# サブドメインマップ

## 概要

DX価値創造ドメインにおけるサブドメインの分類と戦略

## サブドメイン分類

| サブドメイン | タイプ | 説明 | 戦略 | 対応BC |
|------------|-------|------|------|--------|
| DX価値創造 | **Core** | 競争優位性の源泉 | 自社開発・最優先 | Project Success, Productivity Visualization |
| 人材最適化 | Supporting | ビジネスに必要 | 自社開発or外注 | Talent Optimization |
| 認証基盤 | Generic | 汎用機能 | 既製品利用 | Secure Access |
| ナレッジ管理 | Supporting | ビジネスに必要 | 自社開発or外注 | Knowledge Co-creation |
| 収益管理 | Supporting | ビジネスに必要 | 自社開発or外注 | Revenue Optimization |
| コラボレーション | Generic | 汎用機能 | 既製品検討 | Collaboration Facilitation |

## Core Subdomain: DX価値創造

**競争優位性**: プロジェクトの成功を可視化し、生産性を最大化する独自ノウハウ

**戦略**:
- ✅ 自社開発必須
- ✅ 最高の人材を投入
- ✅ 継続的な改善・イノベーション
- ❌ 外部委託禁止

**対応BC**: Project Success, Productivity Visualization
```

**SUBDOMAIN_BC_MAPPING.md**（Subdomain→BCマッピング）:
```markdown
# Subdomain → Bounded Context マッピング

## マッピング方針

| Subdomain | Bounded Context(s) | マッピング理由 |
|----------|-------------------|--------------|
| DX価値創造 | Project Success<br/>Productivity Visualization | 複雑さのため2つのBCに分割 |
| 人材最適化 | Talent Optimization | 1対1マッピング |
| 認証基盤 | Secure Access | 1対1マッピング |
| ナレッジ管理 | Knowledge Co-creation | 1対1マッピング |
| 収益管理 | Revenue Optimization | 1対1マッピング |
| コラボレーション | Collaboration Facilitation | 1対1マッピング |

## Core Subdomain の分割詳細

**DX価値創造 → 2つのBCへ分割**:

理由：
1. ドメインの複雑さ（プロジェクト管理 vs 生産性分析）
2. チーム構成（2チームに分割）
3. リリースサイクルの違い
```

**subdomain-ref.md**（各BCディレクトリ内）:
```markdown
# Subdomain参照

## 対応するSubdomain

**Subdomain**: DX価値創造（Core Subdomain）
**参照**: [../../domain/subdomains/dx-value-creation/](../../domain/subdomains/dx-value-creation/)

## Subdomainからの要求

- 競争優位性を生む機能であること
- 継続的な改善・イノベーションが必要
- 最高品質の実装が求められる

## BCの役割

このBounded Contextは、Core Subdomainの一部を実装します。
プロジェクトの成功支援に特化し、以下を提供します：

- プロジェクト計画・実行支援
- 成功指標の定義・追跡
- リスク管理・対策
```

---

#### 修正案B：統合型（現実的・推奨）

問題空間の分析は重要ですが、小規模プロジェクトでは過度に複雑になる可能性があります。
現在の `bounded-contexts/` 構成を維持しつつ、Subdomainマッピングを追加する案：

```
consultingTool/
│
├── docs/
│   ├── parasol/
│   │   ├── PARASOL_DEVELOPMENT_GUIDE.md
│   │   ├── SUBDOMAIN_MAP.md          # 🆕 Subdomainマップ追加
│   │   └── bounded-contexts/
│   │       ├── CONTEXT_MAP.md
│   │       ├── SUBDOMAIN_BC_MAPPING.md  # 🆕 SD→BCマッピング
│   │       ├── _shared/
│   │       │
│   │       ├── secure-access/
│   │       │   ├── README.md
│   │       │   ├── context.md
│   │       │   ├── subdomain-type.md   # 🆕 "Generic Subdomain"と明記
│   │       │   ├── service.md
│   │       │   └── ...
│   │       │
│   │       ├── project-success/
│   │       │   ├── README.md
│   │       │   ├── context.md
│   │       │   ├── subdomain-type.md   # 🆕 "Core Subdomain: DX価値創造"
│   │       │   ├── service.md
│   │       │   └── ...
│   │       │
│   │       └── talent-optimization/
│   │           ├── README.md
│   │           ├── subdomain-type.md   # 🆕 "Supporting Subdomain"
│   │           └── ...
│   │
│   └── architecture/
│       └── BOUNDED_CONTEXT_STRATEGY.md
│
├── src/contexts/                  # 実装（モノリス）
└── services/                      # 将来（マイクロサービス）
```

**subdomain-type.md**（各BCディレクトリ内）:
```markdown
# Subdomain分類

## このBCが対応するSubdomain

**Subdomain名**: DX価値創造
**Subdomainタイプ**: **Core Subdomain**

## 戦略的重要性

✅ **最優先**: 競争優位性の源泉
✅ **自社開発**: 外部委託禁止
✅ **最高品質**: 最優秀な人材を投入
✅ **継続改善**: イノベーションを追求

## ビジネス価値

このコンテキストは組織の競争優位性を生み出す中核機能です。
プロジェクトの成功を最大化することで、顧客に直接的な価値を提供します。

## 開発方針

- 品質を最優先（速度よりも品質）
- 継続的なリファクタリング
- 最新の技術・パターンの積極採用
- ドメインエキスパートとの密な連携
```

---

#### 比較表

| 観点 | 修正案A（分離型） | 修正案B（統合型） |
|------|----------------|----------------|
| **明確さ** | ⭐⭐⭐⭐⭐<br/>問題空間と解決空間が物理的に分離 | ⭐⭐⭐<br/>同一階層に混在 |
| **シンプルさ** | ⭐⭐<br/>ディレクトリが増える | ⭐⭐⭐⭐⭐<br/>既存構成を維持 |
| **学習コスト** | ⭐⭐<br/>DDD概念の理解が必要 | ⭐⭐⭐⭐<br/>既存メンバーに優しい |
| **保守性** | ⭐⭐⭐⭐<br/>責務が明確 | ⭐⭐⭐<br/>一部混在 |
| **適用場面** | 大規模・複雑ドメイン | 中小規模・実用重視 |

---

#### 推奨

**小〜中規模プロジェクト（パラソル）**: **修正案B（統合型）**
- 既存構成を最小限の変更で改善
- `SUBDOMAIN_MAP.md` と各BCの `subdomain-type.md` を追加
- 問題空間の分析結果を文書化しつつ、過度な複雑化を避ける

**大規模・複雑ドメイン**: **修正案A（分離型）**
- 問題空間と解決空間を物理的に分離
- Subdomainごとにビジネス分析を詳細化
- より厳密なDDD実践

---

### 4.9 実装ロードマップ（修正案B採用の場合）

#### フェーズ1: Subdomainマッピングの追加（1-2時間）

```bash
# 1. Subdomainマップの作成
touch docs/parasol/SUBDOMAIN_MAP.md

# 2. SD→BCマッピングの作成
touch docs/parasol/bounded-contexts/SUBDOMAIN_BC_MAPPING.md

# 3. 各BCにSubdomainタイプを追加
for context in secure-access project-success talent-optimization \
               productivity-visualization knowledge-co-creation \
               revenue-optimization collaboration-facilitation; do
  touch docs/parasol/bounded-contexts/$context/subdomain-type.md
done
```

#### フェーズ2: ドキュメント記述（2-4時間）

1. `SUBDOMAIN_MAP.md` にサブドメイン分類を記述
2. `SUBDOMAIN_BC_MAPPING.md` にマッピング理由を記述
3. 各 `subdomain-type.md` に戦略的重要性と開発方針を記述

#### フェーズ3: チーム教育（1-2時間）

- Subdomain vs Bounded Contextの違いを共有
- Core/Supporting/Genericの戦略的意味を説明
- 各BCの優先順位を明確化

---

### 4.10 まとめ

**現在の構成からの変更（修正案B採用時）**：
1. ✅ `services/` → `bounded-contexts/` へリネーム（既存）
2. ✅ コンテキストマップファイルを追加（既存）
3. ✅ Shared Kernel ディレクトリを追加（既存）
4. 🆕 `SUBDOMAIN_MAP.md` を追加（問題空間の分析）
5. 🆕 `SUBDOMAIN_BC_MAPPING.md` を追加（SD→BCマッピング）
6. 🆕 各BCに `subdomain-type.md` を追加（戦略的重要性の明記）
7. ✅ 既存の階層構造は維持

**作業時間見積もり**：
- ディレクトリリネーム：5分
- 新規ファイル作成：30分（テンプレートベース）
- コード修正：1-2時間（パス参照の更新）
- テスト：30分

**リスク**：
- 低リスク（ファイル移動が主）
- git mv でバージョン履歴を保持可能
- ロールバックも容易

---

## 5. DX階層構造定義

### 5.1 パラソル階層における3概念体系の統合

パラソルのDX階層構造は、**ビジネスの階層**、**DDDの階層**、**サービス/実装の階層**を統合したものです。

#### 5.1.1 L2 Capability vs Bounded Context: 分析アプローチの違い

**重要**: パラソル設計では、**2つの異なる分析アプローチ**を統合します。

##### L2 Capability: トップダウン分析（演繹的）

```
企業戦略・ビジネス価値
  ↓ 分解
ValueStream → ValueStage
  ↓ ケーパビリティマッピング
L1 Capability（大分類）
  ↓ 分解
L2 Capability（中分類）← Enterprise Architecture起点
  ↓ 分解
L3 Capability（小分類）
```

**特徴**:
- **Enterprise Architecture**的なアプローチ
- ビジネス価値・戦略から演繹的に導出
- **トップダウン**：上位概念から下位概念へ分解
- 主導：経営層、事業企画部門、エンタープライズアーキテクト

**成果物**: Capability Map、ValueStream Map

##### Bounded Context: ボトムアップ分析（帰納的）

```
実際の業務プロセス・現場の課題
  ↓ ドメイン分析
ドメインエキスパートとの対話
  ↓ 発見
ユビキタス言語の抽出
  ↓ 境界発見
Bounded Context← Domain-Driven Design起点
  ├── Aggregates
  ├── Entities
  └── Value Objects
```

**特徴**:
- **Domain-Driven Design**的なアプローチ
- 現場の業務・用語から帰納的に発見
- **ボトムアップ**：具体的な業務から抽象的な境界を発見
- 主導：ドメインエキスパート、DDD実践者、アーキテクト

**成果物**: Context Map、Ubiquitous Language定義、ドメインモデル

##### 統合プロセス：パラソル設計の核心

```
トップダウン分析          ボトムアップ分析
（L2 Capability）         （Bounded Context）
       ↓                        ↓
  ビジネス戦略               現場の業務実態
       ↓                        ↓
       └──────→ 照合・統合 ←──────┘
                    ↓
         パラソル設計における最終的なBC
         （L2とDDD BCの最適な融合）
                    ↓
            L3 Capability層
                    ↓
             Operation層
                    ↓
              UseCase層
```

**統合の原則**:
1. **L2とBounded Contextは同義ではない**
   - 分析手法が異なるため、結果も異なる可能性
   - 1対1になる場合もあれば、M:Nになる場合もある

2. **両方の視点で検証**
   - L2から見て：ビジネス戦略上必要なケーパビリティが揃っているか
   - BCから見て：ユビキタス言語の一貫性が保たれているか

3. **不一致時の判断**
   - L2にあってBCにない：戦略的に必要だが現場で認識されていない能力
   - BCにあってL2にない：現場で必要だが戦略で考慮されていない能力
   - **両方を照合して最適な境界を決定**

**具体例**:

```
トップダウン分析結果:
L2-001: プロジェクト管理能力
L2-002: タスク管理能力
L2-003: リスク管理能力

ボトムアップ分析結果:
BC: プロジェクト計画コンテキスト
  ユビキタス言語: WBS, タスク, マイルストーン, 依存関係
  集約: Project, Task, Schedule

BC: リスク管理コンテキスト
  ユビキタス言語: リスク, 影響度, 発生確率, 対応策
  集約: Risk, Mitigation

照合結果:
→ L2のタスク管理能力は、BCのプロジェクト計画コンテキストに含まれる
→ 最終的なBC: プロジェクト計画BC（L2-001 + L2-002を統合）
→ 最終的なBC: リスク管理BC（L2-003と一致）
```

---

#### 3概念体系の統合マッピング

| パラソル階層 | ビジネス階層 | DDD階層 | サービス/実装階層 | 多重度 |
|------------|------------|---------|------------------|--------|
| **Microservice Scope** | - | - | S1: デプロイメント単位<br/>Container, Pod | - |
| **Bounded Context**<br/>(= Service) | B1/B2: 戦略/ケーパビリティ<br/>"認証基盤を提供する能力" | D1: Bounded Context<br/>ユビキタス言語の境界 | S2: Service Module<br/>"AuthServiceModule" | 1 MS = 1..* BC |
| **Business Capability** | B2: ケーパビリティ<br/>"認証する能力" | D2: Aggregate Root候補<br/>"Authentication" | S2: Sub Module<br/>"AuthModule" | 1 BC = 1..* Cap |
| **Business Operation** | B3: ビジネスオペレーション<br/>"ログインプロセス" | D2: Domain Service<br/>"LoginService" | S3: Service Class<br/>"LoginUseCase.ts" | 1 Cap = 1..* Op |
| **Use Case / Page** | B4: ユーザーアクティビティ<br/>"パスワードでログインする" | D3: Application Service<br/>"PasswordLoginUseCase" | S3: API + UI<br/>"POST /api/login"<br/>+ "login.tsx" | 1 Op = 1..* UC |

---

### 5.2 DX価値創造型階層定義（データ構造）

```typescript
// パラソルのデータモデル（3概念体系を統合）

interface MicroserviceScope {
  // サービス/実装階層のみ
  deploymentUnit: string;        // 独立したデプロイメント単位
  scalingStrategy: string;       // スケーリング戦略
  boundedContexts: BoundedContext[];
}

interface BoundedContext {
  // ビジネス階層 + DDD階層 + サービス/実装階層
  displayName: string;           // ビジネス: DX価値表現サービス名（XXX支援/最適化）
  ubiquitousLanguage: string;    // DDD: ユビキタス言語定義
  serviceModule: string;         // サービス/実装: モジュール名

  // 成果物
  domainLanguage: DomainLanguage;      // DDD: ドメインモデル定義
  apiSpecification: ApiSpec;           // サービス/実装: API仕様
  databaseDesign: DatabaseDesign;      // サービス/実装: DB設計
  integrationSpec: IntegrationSpec;    // DDD + サービス/実装: 統合仕様

  capabilities: BusinessCapability[];
}

interface BusinessCapability {
  // ビジネス階層 + DDD階層
  displayName: string;           // ビジネス: 「XXXする能力」形式
  aggregateRoot: string;         // DDD: 集約ルート候補
  subModule: string;             // サービス/実装: サブモジュール名

  operations: BusinessOperation[];
}

interface BusinessOperation {
  // ビジネス階層 + DDD階層 + サービス/実装階層
  displayName: string;           // ビジネス: 価値創造アクション指向名
  pattern: OperationPattern;     // ビジネス: Workflow/CRUD/Analytics/...
  domainService: string;         // DDD: ドメインサービス名
  serviceClass: string;          // サービス/実装: サービスクラス名

  useCases: UseCase[];
}

interface UseCase {
  // ビジネス階層 + DDD階層 + サービス/実装階層
  displayName: string;           // ビジネス: ユーザーアクティビティ
  applicationService: string;    // DDD: アプリケーションサービス
  apiEndpoint: string;           // サービス/実装: API エンドポイント
  uiComponent: string;           // サービス/実装: UI コンポーネント

  pages: PageDefinition[];
  tests: TestDefinition[];
  robustnessDiagram?: RobustnessDiagram;
}
```

---

### 5.3 各階層の責務（3概念体系別）

#### 0. マイクロサービス範囲層

| 概念体系 | 責務 | 成果物 |
|---------|------|--------|
| **サービス/実装** | デプロイメント戦略の定義 | docker-compose.yml, k8s manifest |
| ビジネス | - | - |
| DDD | - | - |

- **多重度**: 1 MS = 1..* BC
- **決定時期**: 実装フェーズ（モノリスから始めて段階的に分離）

---

#### 1. バウンデッドコンテキスト層（= パラソルService）

| 概念体系 | 責務 | 成果物 |
|---------|------|--------|
| **ビジネス** | ビジネス価値の提供、組織能力の定義 | service.md（価値提供の定義） |
| **DDD** | ドメインモデルの一貫性境界、ユビキタス言語 | domain-language.md, context-map.md |
| **サービス/実装** | サービスモジュールの境界 | api-specification.md, database-design.md |

- **DX効果**: ビジネス成果の最大化
- **命名原則**: 価値創造動詞 + 対象 + サービス（例：「プロジェクト成功支援サービス」）
- **多重度**: 1 BC = 1..* Capability

---

#### 2. ケーパビリティ層

| 概念体系 | 責務 | 成果物 |
|---------|------|--------|
| **ビジネス** | 組織の競争優位性を生む能力 | capability.md |
| **DDD** | Aggregate Root候補の特定 | domain-language.md（Aggregate定義） |
| **サービス/実装** | サブモジュールの構造 | サブディレクトリ構造 |

- **DX効果**: 継続的な価値創造能力の構築
- **命名原則**: 「[価値創造動詞] + [対象] + する能力」（例：「認証する能力」）
- **多重度**: 1 Capability = 1..* Operation

---

#### 3. オペレーション層

| 概念体系 | 責務 | 成果物 |
|---------|------|--------|
| **ビジネス** | 具体的なビジネスオペレーション | operation.md |
| **DDD** | Domain Service、Use Caseの定義 | ドメインサービス設計 |
| **サービス/実装** | サービスクラスの実装 | XXXService.ts, XXXUseCase.ts |

- **DX効果**: 業務効率化とイノベーション促進
- **命名原則**: [変革動詞] + [対象] + [成果・価値]（例：「ログインする」）
- **多重度**: 1 Operation = 1..* UseCase

---

#### 4. ユースケース層

| 概念体系 | 責務 | 成果物 |
|---------|------|--------|
| **ビジネス** | エンドユーザーの具体的な活動 | usecase.md |
| **DDD** | Application Serviceの実装 | XXXApplicationService.ts |
| **サービス/実装** | API + UIの実装 | API endpoint, UI component, page.md |

- **DX効果**: ユーザーエクスペリエンスの向上
- **命名原則**: 「〜を（が）〜する」（例：「パスワードでログインする」）
- **多重度**: 1 UseCase = 1..* Page/Test/Diagram

---

### 5.4 3概念体系の分離と統合の実践

#### 分離の原則

```
設計時の思考の分離:

1️⃣ ビジネス階層で考える時
   → ビジネス価値、組織能力、競争優位性
   → 技術的な制約は考えない

2️⃣ DDD階層で考える時
   → ドメインモデル、境界、一貫性
   → 実装方法は考えない

3️⃣ サービス/実装階層で考える時
   → 技術的な最適化、パフォーマンス
   → ビジネスロジックは含めない
```

#### 統合の実践

```
パラソルでの作業フロー:

ステップ1: ビジネス階層の分析
├─ 戦略・ケーパビリティの特定 → service.md
├─ ビジネスオペレーションの整理 → operation.md
└─ ユーザーアクティビティ → usecase.md

↓

ステップ2: DDD階層の設計
├─ Bounded Contextの境界確定 → context.md, context-map.md
├─ Aggregateの設計 → domain-language.md
└─ Entity/Value Objectの定義 → domain-language.md

↓

ステップ3: サービス/実装階層の決定
├─ デプロイメント戦略 → docker-compose.yml
├─ API設計 → api-specification.md
└─ DB設計 → database-design.md
```

---

## 6. 価値創造型開発プロセス

### MDファイル作成 → DB登録 → UI表示の流れ

```mermaid
flowchart TD
    MD[📝 MD形式設計ドキュメント作成] --> SCRIPT[🔄 復旧スクリプト実行]
    SCRIPT --> API[📡 API経由データ投入]
    API --> DB[(🗃️ SQLiteデータベース)]
    DB --> UI[🖥️ パラソル開発画面表示]

    subgraph "価値創造チェックポイント"
        VC1[✅ DX命名規則準拠]
        VC2[✅ 価値表現の妥当性]
        VC3[✅ ビジネス成果との関連性]
    end

    MD --> VC1
    VC1 --> VC2
    VC2 --> VC3
    VC3 --> SCRIPT
```

### 復旧スクリプトの動作原理

#### 1. データ収集フェーズ
```javascript
// scripts/restore-usecase-definitions.js
const collectServiceData = async (serviceName) => {
  // 1. サービス基本情報読み込み
  const serviceContent = await readUsecaseFile(`${servicePath}/service.md`);

  // 2. ケーパビリティ・オペレーション階層探索
  const capabilities = await fs.readdir(`${servicePath}/capabilities`);

  // 3. 日本語表示名の抽出（DX命名規則チェック）
  const titleMatch = content.match(/^#\s*ユースケース[：:]\s*(.+)$/m);
  const displayName = titleMatch ? titleMatch[1].trim() : defaultName;

  return serviceData; // DX価値創造構造に変換
};
```

#### 2. 一括送信フェーズ
```javascript
// 全7サービスを一括でAPI送信（データベース上書き問題を解決）
const allServices = [];
for (const serviceName of services) {
  const serviceData = await collectServiceData(serviceName);
  allServices.push(serviceData);
}
const success = await uploadParasolData(allServices);
```

### API仕様（価値創造指向）

#### POST /api/parasol/import
- **目的**: パラソル設計データの一括インポート
- **価値**: 設計効率化とトレーサビリティ確保
- **特徴**: 日本語表示名の保持、DX命名規則の検証

---

## 7. DXテンプレート・仕様書

### 価値創造型テンプレートの使い方

#### 1. DXサービス定義テンプレート
**ファイル**: `templates/dx-service-definition.md`

```markdown
# [サービス名] - DX価値創造サービス

## DX価値提案
**解決する課題**: [従来の管理的課題]
**提供価値**: [DXによる変革効果]
**成果指標**: [測定可能なDX効果]

## 価値創造戦略
- **効率化**: [○○%の時間短縮、○○%のコスト削減]
- **イノベーション**: [新規ビジネス機会、創造的な解決策]
- **体験向上**: [ユーザー満足度向上、使いやすさ改善]

## DX成果測定
- **定量効果**: [ROI、効率化指標]
- **定性効果**: [満足度、イノベーション創出]
```

#### 2. 価値創造ケーパビリティテンプレート
**ファイル**: `templates/dx-business-capability.md`

```markdown
# [ケーパビリティ名] - 価値創造能力

## 組織競争力への貢献
**差別化要因**: [競合との差別化ポイント]
**持続的優位性**: [長期的な競争優位の源泉]
**イノベーション創出**: [新たな価値創造の可能性]

## 成熟度レベル
- **レベル1（基本）**: 従来型管理業務
- **レベル2（効率化）**: プロセス自動化・最適化
- **レベル3（変革）**: データドリブン意思決定
- **レベル4（創造）**: AI活用・予測分析
- **レベル5（革新）**: 新ビジネスモデル創出
```

### DX評価基準・バリデーション要件

#### DX促進度チェックリスト

```
□ 価値創造命名: 「管理」用語を使用していない
□ 成果指向: 明確なビジネス成果が定義されている
□ データ活用: データドリブンな意思決定を促進する
□ 自動化: 手作業を削減し効率化を実現する
□ 連携強化: サービス間の価値連携が設計されている
□ 学習促進: 継続的な改善・学習メカニズムがある
□ イノベーション: 新たな価値創造の可能性がある
```

#### DX品質ゲート

| ゲート | 評価項目 | 合格基準 |
|--------|---------|----------|
| **設計ゲート** | DX命名規則準拠 | 100% |
| **設計ゲート** | 価値創造の明確性 | 定性評価A以上 |
| **実装ゲート** | 効率化指標達成 | 目標の80%以上 |
| **運用ゲート** | ユーザー満足度 | 4.0/5.0以上 |

---

## 8. DX実装ガイド

### 新規DXサービス追加手順

#### ステップ1: DXサービス設計
```bash
# 1. サービスディレクトリ作成
mkdir -p docs/parasol/services/[new-dx-service]

# 2. DXテンプレート適用
cp templates/dx-service-definition.md docs/parasol/services/[new-dx-service]/service.md

# 3. DX命名規則チェック
# ✅ 「XXX支援」「XXX最適化」「XXX可視化」「XXX促進」「XXX共創」パターン
# ❌ 「XXX管理」「XXXシステム」は使用禁止
```

#### ステップ2: ケーパビリティ定義
```bash
# 1. ケーパビリティディレクトリ作成
mkdir -p docs/parasol/services/[service]/capabilities/[capability]

# 2. 価値創造型ケーパビリティ定義
# 形式: 「[価値創造動詞] + [対象] + する能力」
# 例: 「顧客エンゲージメントを強化する能力」
```

#### ステップ3: オペレーション・ユースケース設計
```bash
# 1. 価値創造プロセス定義
mkdir -p docs/parasol/services/[service]/capabilities/[capability]/operations/[operation]

# 2. ユースケース・ページ・テスト定義
mkdir -p docs/parasol/services/[service]/capabilities/[capability]/operations/[operation]/{usecases,pages,tests}
```

#### ステップ4: データベース登録
```bash
# 復旧スクリプト実行
npm run db:reset
node scripts/restore-usecase-definitions.js
```

### 既存サービスのDX化手順

#### 1. DX診断（現状分析）
```bash
# DX成熟度診断スクリプト実行
node scripts/dx-maturity-assessment.js [service-name]
```

#### 2. DX変革計画策定
```markdown
## DX変革ロードマップ

### フェーズ1: 効率化（3ヶ月）
- [ ] 手作業プロセスの自動化
- [ ] データ可視化ダッシュボード構築
- [ ] 基本的な予測分析導入

### フェーズ2: 最適化（6ヶ月）
- [ ] AI/ML分析エンジン導入
- [ ] リアルタイム意思決定支援
- [ ] プロセス最適化エンジン

### フェーズ3: 革新（12ヶ月）
- [ ] 新ビジネスモデル実証
- [ ] エコシステム連携強化
- [ ] 継続的イノベーション基盤
```

### 価値創造評価とトラブルシューティング

#### よくある問題と解決策

| 問題 | 原因 | DX解決策 |
|------|------|----------|
| 効率化が進まない | 手作業依存 | プロセス自動化、RPA導入 |
| データ活用できない | サイロ化 | データ統合基盤、BI構築 |
| 意思決定が遅い | 情報収集時間 | リアルタイム分析、予測AI |
| イノベーションが起きない | 固定思考 | 実験文化、アジャイル手法 |

---

## 9. DX品質管理

### 価値創造テスト戦略

#### 1. DX効果測定テスト
```markdown
## DX効果検証テストケース

### 効率化効果テスト
- **測定項目**: タスク実行時間
- **目標**: 30%以上の短縮
- **測定方法**: 自動化前後の比較

### 意思決定速度テスト
- **測定項目**: 意思決定までの時間
- **目標**: 50%以上の短縮
- **測定方法**: データ可視化前後の比較

### ユーザー体験テスト
- **測定項目**: ユーザー満足度
- **目標**: 4.0/5.0以上
- **測定方法**: NPS、CSAT調査
```

#### 2. 価値創造ユニットテスト
```javascript
// 例: 価値創造ロジックのテスト
describe('DX価値創造エンジン', () => {
  test('効率化効果を正確に計算する', () => {
    const before = { taskTime: 120, errorRate: 0.15 };
    const after = { taskTime: 80, errorRate: 0.05 };

    const dxEffect = calculateDxEffect(before, after);

    expect(dxEffect.efficiencyImprovement).toBeGreaterThan(0.3); // 30%以上改善
    expect(dxEffect.qualityImprovement).toBeGreaterThan(0.6);    // 60%以上改善
  });
});
```

### DXコードレビュー基準

#### チェック項目
```
□ DX命名規則準拠（価値創造動詞使用）
□ ビジネス価値の明確性
□ 効率化・自動化要素の組み込み
□ データドリブン意思決定の促進
□ ユーザーエクスペリエンス向上
□ 継続的改善メカニズム
□ 測定可能なKPI設定
```

### ビジネス価値パフォーマンス要件

#### DX成果基準
```
レベル1: 基本DX（必須）
- 手作業削減率: 20%以上
- データ可視化: 主要指標の可視化
- 応答時間改善: 30%以上

レベル2: 高度DX（推奨）
- 自動化率: 50%以上
- 予測分析: 基本的な予測機能
- 意思決定速度: 50%以上向上

レベル3: 革新DX（目標）
- AI活用度: 主要プロセスでのAI活用
- イノベーション創出: 新ビジネス機会創出
- エコシステム連携: 外部システムとの価値連携
```

---

## 付録

### A. DX用語集

| 用語 | 定義 | DX文脈での意味 |
|------|------|---------------|
| **価値創造** | 顧客・ビジネスに新たな価値を生み出すこと | DXの最終目的 |
| **デジタル変革** | デジタル技術による業務・ビジネスモデル変革 | DXの手段 |
| **洞察創出** | データから意味のある知見を発見すること | データドリブン経営の核 |
| **自動化** | 人手作業をシステムで代替すること | 効率化の基盤 |
| **最適化** | 既存プロセスの効率・品質向上 | 継続的改善 |

### B. DXテンプレートファイル一覧

```
templates/
├── dx-service-definition.md           # DXサービス定義
├── dx-business-capability.md         # 価値創造ケーパビリティ
├── dx-business-operation.md          # 変革オペレーション
├── dx-usecase-definition.md          # 価値実現ユースケース
├── dx-page-definition.md             # 価値体験ページ設計
├── dx-test-definition.md             # DX効果検証テスト
├── dx-api-specification.md           # 価値連携API仕様
└── dx-database-design.md             # 洞察創出DB設計
```

### C. 参考リンク

- [マイクロサービス設計原則](./microservices-design-principles.md)
- [パラソル階層構造詳細](./parasol-hierarchy-details.md)
- [DX成熟度評価モデル](./dx-maturity-model.md)
- [価値創造メトリクス設計](./value-creation-metrics.md)

## 10. MD形式統一による品質保証

### 10.1 パラソル設計の核心原則

#### MD形式の絶対性

パラソル開発では、**すべての設計ドキュメントをMarkdown形式で記述**することが基本原則です。これは単なる表記法の選択ではなく、**実装非依存性を保証する**ための戦略的決定です。

```markdown
✅ パラソル準拠（MD形式）
# API仕様: ユーザー認証サービス
システムがユーザーの身元を確認し、安全なアクセスを提供する

❌ 実装依存（JSON/Code形式）
{
  "endpoint": "/api/auth",
  "method": "POST",
  "schema": {...}
}
```

### 10.2 データ消失問題の根本解決

#### 問題の本質

API仕様・DB設計が「消える」現象の根本原因は、**JSON形式とMD形式の混在**です：

```typescript
// ❌ データ消失の原因パターン
apiSpecificationDefinition: service.apiSpecificationDoc?.content || '',
//                                   ↑ 存在しないリレーション

// ✅ 正しいMD形式参照
apiSpecificationDefinition: service.apiSpecificationDefinition || '',
//                                   ↑ 直接フィールド参照
```

#### データベース構造の純化

```sql
-- ❌ 廃止対象（実装依存のJSON形式）
domainLanguage TEXT NOT NULL,       -- JSON: パラソル思想に反する
apiSpecification TEXT NOT NULL,     -- JSON: 実装詳細を含む
dbSchema TEXT NOT NULL,            -- JSON: 技術仕様に依存

-- ✅ 推奨（実装非依存のMD形式）
domainLanguageDefinition TEXT,      -- MD: 自然言語設計
apiSpecificationDefinition TEXT,    -- MD: ビジネス観点の仕様
databaseDesignDefinition TEXT,      -- MD: 概念レベルの設計
```

### 10.3 開発ベストプラクティス

#### 1. 新規開発時の鉄則

```markdown
✅ DO: MD形式のみを使用
- 自然言語でビジネス価値を記述
- 実装技術の詳細は記載しない
- ステークホルダー全員が理解可能な表現

❌ DON'T: JSON/Code形式の混入
- 技術的な実装詳細の記述
- プログラミング言語依存の表現
- データベース固有の構文使用
```

#### 2. 品質チェック項目

```bash
# MD形式データの存在確認
sqlite3 parasol.db "SELECT name,
  CASE WHEN apiSpecificationDefinition IS NULL OR apiSpecificationDefinition = ''
       THEN 'NG' ELSE 'OK' END as status
  FROM services;"

# 実装非依存性チェック
grep -i "CREATE TABLE\|SELECT\|POST\|GET" *.md && echo "❌ 実装詳細検出"
```

### 10.4 移行戦略とロードマップ

#### フェーズ1: 現状把握と修正（完了）
- [x] データ表示問題の修正
- [x] MD形式フィールドへの正しい参照
- [x] UI表示の正常化確認

#### フェーズ2: コード品質向上
- [ ] JSON.parse()処理の段階的削除
- [ ] TypeScript型定義の統一
- [ ] エラーハンドリングの強化

#### フェーズ3: データ構造の純化
- [ ] JSON形式フィールドの廃止
- [ ] スキーマの簡素化
- [ ] マイグレーション実行

#### フェーズ4: 品質保証体制
- [ ] 自動検証ツールの導入
- [ ] CI/CDでのMD形式チェック
- [ ] 開発者教育の実施

### 10.5 期待効果

#### 技術的価値
- **データ消失問題の根絶**: 表示不具合の完全解消
- **保守性向上**: 統一された理解しやすいコード
- **品質向上**: 一貫したデータ処理ロジック

#### ビジネス価値
- **パラソル思想の実現**: 真の実装非依存設計
- **コミュニケーション改善**: 全員が理解可能な設計書
- **DX促進**: 技術的負債の解消による開発加速

---

**⚠️ 重要**: MD形式統一は、パラソル開発の成功を左右する**最重要原則**です。この原則を守ることで、真の価値創造型開発が実現されます。

---

**📧 フィードバック**: パラソル開発に関するご質問・改善提案は [GitHub Issues](https://github.com/hmoriya/consultingTool/issues) までお寄せください。

**🚀 DXの旅**: このガイドを活用して、価値創造型のデジタルトランスフォーメーションを実現してください！