# API仕様統合提案: usecases/api-usage.md の最適化

**作成日**: 2025-10-23
**バージョン**: 1.0.0
**対象**: usecases配下のapi-usage.md
**結論**: **段階的に廃止し、BC API仕様とUseCase README.mdに統合**

---

## 🎯 現状の問題分析

### 現在の構造

```
3-BUSINESS-CAPABILITIES/
└── [bc-name]/
    ├── api/
    │   └── api-specification.md      ← WHAT: APIができること
    │
    └── operations/
        └── [l3-operation]/
            └── usecases/
                └── [usecase-name]/
                    ├── usecase.md
                    ├── page.md
                    └── api-usage.md  ← HOW: APIの使い方 ⚠️
```

### api-usage.md の現在の内容

```markdown
# API利用仕様: 通知コンテンツを作成する

## 利用するAPI一覧
### 自サービスAPI
- POST /api/notifications/content
- GET /api/notifications/templates
- POST /api/notifications/content/preview

### 他サービスAPI
- UC-AUTH-01: ユーザー認証を実行する
- UC-AUTH-02: 権限を検証する

## API呼び出しシーケンス
1. 事前認証・権限確認
2. テンプレート検索・取得
3. コンテンツ作成
4. コンテンツプレビュー生成

## エラーハンドリング
- AUTH_FAILED: 認証失敗
- PERMISSION_DENIED: 権限不足
```

---

## ⚠️ 問題点

### 1. 情報の重複

```
問題: API情報が2箇所に分散

【BC API仕様】（api-specification.md）
- API定義
- エンドポイント
- リクエスト/レスポンススキーマ
- 認証・認可

【UseCase API利用】（api-usage.md）
- 利用するAPI一覧 ← 重複
- 呼び出しシーケンス
- エラーハンドリング ← 重複

→ 保守の二重化、不整合のリスク
```

### 2. WHAT/HOW の分離

```
問題: API設計者と実装者が別ファイルを見る

【API設計者】
→ api-specification.md を読む
→ APIができることを定義（WHAT）

【実装エンジニア】
→ api-specification.md を読む（WHAT）
→ api-usage.md を読む（HOW）
→ 2ファイル参照が必要

→ 学習コストが高い
```

### 3. Why-What-How-Impl統合モデルとの不整合

```
問題: 提案したREADME.md統合モデルと矛盾

【提案したモデル】
usecases/[name]/README.md
├── Why: ビジネス価値
├── What: 機能要件
├── How: 技術設計（API含む）← ここに統合すべき
└── Implementation: 実装詳細

【現状】
usecases/[name]/
├── usecase.md
├── page.md
└── api-usage.md  ← 分離されている

→ 統合ビューの実現を阻害
```

---

## ✅ 提案: 段階的統合と廃止

### Phase 1: BC API仕様の強化（WHAT層）

**ファイル**: `3-BUSINESS-CAPABILITIES/[bc-name]/api/api-specification.md`

```yaml
# BC: プロジェクト計画BC のAPI仕様

## 概要
このBCが提供する全APIの定義（WHAT）

---

## API一覧

### L3/Operation: WBSを作成する のAPI

#### POST /api/bc/project-planning/wbs
**目的**: WBSを作成する
**認証**: 必須
**権限**: project.plan.write

**リクエスト**:
```json
{
  "planId": "uuid",
  "tasks": [{
    "name": "タスク名",
    "parentId": "uuid",
    "estimatedHours": 10
  }]
}
```

**レスポンス（成功）**:
```json
{
  "wbsId": "uuid",
  "planId": "uuid",
  "tasks": [...],
  "createdAt": "2025-01-15T10:00:00Z"
}
```

**エラー**:
- `400 BAD_REQUEST`: 不正なリクエスト
- `401 UNAUTHORIZED`: 認証失敗
- `403 FORBIDDEN`: 権限不足
- `409 CONFLICT`: WBS既存

**使用例（追加）**: ← 新設
```typescript
// UseCase: WBSを階層的に作成する での使用例
const response = await fetch('/api/bc/project-planning/wbs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    planId: projectPlanId,
    tasks: wbsTasks
  })
});

if (!response.ok) {
  if (response.status === 403) {
    throw new PermissionError('WBS作成権限がありません');
  }
  throw new APIError('WBS作成に失敗しました');
}

const { wbsId } = await response.json();
```

---

## BC間連携API

### 他BCのAPI利用（ユースケース呼び出し型）

#### secure-access-service
```yaml
UC-AUTH-01: ユーザー認証を実行する
  エンドポイント: POST /api/auth/usecases/authenticate
  利用タイミング: 全ユースケース開始時
  リクエスト: { username, password }
  レスポンス: { token, userId, permissions }

UC-AUTH-02: 権限を検証する
  エンドポイント: POST /api/auth/usecases/validate-permission
  利用タイミング: BC操作前
  リクエスト: { token, resource, action }
  レスポンス: { authorized: boolean }
```

---

## API呼び出しパターン（追加）← 新設

### パターン1: 基本的なCRUD操作
```typescript
// 1. 認証
const { token } = await authenticate(username, password);

// 2. 権限確認
const { authorized } = await validatePermission(token, 'project.plan', 'write');

// 3. BC操作実行
const result = await createWBS(token, wbsData);
```

### パターン2: BC間連携操作
```typescript
// 1. 自BC操作
const wbs = await createWBS(token, wbsData);

// 2. 他BCへのイベント通知
await publishEvent('WBSCreated', { wbsId: wbs.id });

// 3. 他BCからのデータ取得（非同期）
const teamMembers = await fetchTeamMembers(projectId);
```
```

**改善点**:
- ✅ WHAT（API定義）とHOW（使用例）を同一ファイルに統合
- ✅ BC単位でAPI全体を俯瞰可能
- ✅ 実装エンジニアが1ファイルで完結

---

### Phase 2: UseCase README.md への統合（HOW+Implementation層）

**ファイル**: `usecases/[usecase-name]/README.md`

```markdown
# ユースケース実装ガイド: WBSを階層的に作成する

## 🏗️ How: どのように実装するか

### API利用

このユースケースでは、以下のBC APIを使用します：

#### 使用するAPI

| API | エンドポイント | 利用タイミング | 目的 |
|-----|---------------|---------------|------|
| WBS作成API | POST /api/bc/project-planning/wbs | メインフロー | WBS構造を作成 |
| 認証API | POST /api/auth/usecases/authenticate | 事前処理 | ユーザー認証 |
| 権限確認API | POST /api/auth/usecases/validate-permission | 事前処理 | 権限検証 |

**📖 API詳細**: [BC API仕様](../../../api/api-specification.md#post-apibc-project-planningwbs)

---

## 💻 Implementation: 具体的な実装方法

### API呼び出しシーケンス

```typescript
/**
 * UseCase: WBSを階層的に作成する
 * API呼び出しフロー
 */
async function createWBSHierarchically(wbsData: WBSData) {
  // 1. 認証（BC間連携）
  const auth = await authenticateUser();

  // 2. 権限確認（BC間連携）
  await validatePermission(auth.token, 'project.plan.write');

  // 3. WBS作成（BC内操作）
  const wbs = await createWBS(auth.token, {
    planId: wbsData.planId,
    tasks: wbsData.tasks
  });

  // 4. 成功レスポンス
  return wbs;
}
```

### エラーハンドリング

```typescript
try {
  const wbs = await createWBSHierarchically(wbsData);
  showSuccess('WBSを作成しました');
} catch (error) {
  if (error instanceof PermissionError) {
    showError('WBS作成の権限がありません');
  } else if (error instanceof ConflictError) {
    showError('WBSは既に存在します');
  } else {
    showError('WBS作成に失敗しました');
  }
}
```

### API クライアント実装

```typescript
// src/api/projectPlanningApi.ts

export async function createWBS(
  token: string,
  data: WBSCreationData
): Promise<WBSStructure> {
  const response = await fetch('/api/bc/project-planning/wbs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(error.message, response.status);
  }

  return response.json();
}
```

**📖 BC API仕様**: [詳細定義](../../../api/api-specification.md)
```

**改善点**:
- ✅ Why-What-How-Implの一貫した流れ
- ✅ API利用方法が実装コードと統合
- ✅ BC API仕様へのリンクで詳細参照可能

---

### Phase 3: api-usage.md の廃止

```bash
# 移行完了後のディレクトリ構造

usecases/[usecase-name]/
├── README.md          ← API利用情報を統合
├── usecase.md         ← 保持（ビジネスロジック詳細）
├── page.md            ← 保持（UI仕様）
└── api-usage.md       ← 削除 ✂️

# api-usage.mdの内容は以下に分散統合:
# 1. BC API仕様（WHAT + 使用例）
# 2. UseCase README.md（HOW + Implementation）
```

---

## 📊 統合後の情報配置

### 3層構造での明確な分離

```
【WHAT層】BC API仕様
ファイル: 3-BUSINESS-CAPABILITIES/[bc-name]/api/api-specification.md
内容:
  ✅ API定義（エンドポイント、スキーマ）
  ✅ 認証・認可要件
  ✅ エラーコード定義
  ✅ 基本的な使用例（追加）
対象読者: API設計者、サービス連携者、実装エンジニア

【HOW層】API利用パターン
ファイル: usecases/[usecase-name]/README.md § How
内容:
  ✅ このユースケースで使用するAPI一覧
  ✅ BC API仕様へのリンク
  ✅ API呼び出しタイミング
対象読者: 実装エンジニア

【IMPL層】実装コード
ファイル: usecases/[usecase-name]/README.md § Implementation
内容:
  ✅ API呼び出しシーケンス（TypeScriptコード）
  ✅ エラーハンドリング（実装例）
  ✅ APIクライアント実装（完全なコード）
対象読者: 実装エンジニア
```

---

## 🔄 移行ステップ

### Step 1: BC API仕様の強化（2週間）

```bash
# タスク
1. 既存api-specification.mdに使用例セクションを追加
2. BC間連携APIの明示的な定義
3. API呼び出しパターンの追加

# 成果物
- 強化されたapi-specification.md
- API使用例ライブラリ
```

### Step 2: UseCase README.md の作成（4週間）

```bash
# タスク
1. 優先度の高いユースケースからREADME.md作成
2. api-usage.mdの内容をREADME.mdに統合
3. BC API仕様へのリンク追加

# 成果物
- Why-What-How-Impl統合README.md
- API利用情報の統合
```

### Step 3: api-usage.md の段階的廃止（2週間）

```bash
# タスク
1. 全ユースケースでREADME.md移行完了確認
2. api-usage.mdを非推奨化（README.mdへのリンク追加）
3. api-usage.mdを削除

# 検証
- README.mdでAPI利用情報が完結しているか
- BC API仕様へのリンクが正しいか
- 実装エンジニアのフィードバック
```

---

## 📈 期待効果

### 保守性の向上

| 指標 | 現状 | 統合後 | 改善率 |
|------|------|--------|--------|
| API情報の重複箇所 | 2箇所 | 1箇所 | 50%削減 |
| 参照ファイル数 | 2-3ファイル | 1ファイル | 66%削減 |
| API変更時の更新箇所 | 2箇所 | 1箇所 | 50%削減 |
| 情報の不整合リスク | 高 | 低 | 大幅改善 |

### 開発者体験の向上

| 指標 | 現状 | 統合後 | 改善率 |
|------|------|--------|--------|
| API理解時間 | 30分 | 15分 | 50%短縮 |
| 必要なファイル参照 | 3ファイル | 1ファイル | 66%削減 |
| 実装準備時間 | 1時間 | 30分 | 50%短縮 |

---

## ❓ FAQ

### Q1: api-usage.mdは完全に不要？

**A**: **段階的に不要になります**。

```
【移行期間】（2-3ヶ月）
✅ api-usage.md: 保持（非推奨マーク）
✅ README.md: 新規作成（推奨）
→ 開発者が選択可能

【移行完了後】
❌ api-usage.md: 削除
✅ README.md: 標準
→ 統合ビューのみ
```

### Q2: BC API仕様との役割分担は？

**A**: **WHAT（定義）とHOW（利用）を統合**。

```
【BC API仕様】
- API定義（エンドポイント、スキーマ）← WHAT
- 基本的な使用例（追加）← HOW の一部

【UseCase README.md】
- このユースケースでの具体的な使い方 ← HOW
- 実装コード例 ← Implementation
- BC API仕様へのリンク ← 詳細参照
```

### Q3: 既存のapi-usage.mdはどうする？

**A**: **段階的に移行**。

```
Phase 1（Week 1-2）:
  - README.mdテンプレート作成
  - 5個のユースケースで試験導入

Phase 2（Week 3-6）:
  - 全ユースケースにREADME.md作成
  - api-usage.md内容を統合

Phase 3（Week 7-8）:
  - api-usage.mdに非推奨マーク
  - README.mdへのリダイレクト追加

Phase 4（Week 9-10）:
  - api-usage.mdを削除
  - ドキュメント整備完了
```

---

## ✅ 推奨アクション

### 即座に実施（Week 1-2）

1. **BC API仕様の強化**
   - [ ] 使用例セクションを追加
   - [ ] BC間連携APIを明示化
   - [ ] API呼び出しパターンを追加

2. **README.mdテンプレート作成**
   - [ ] Why-What-How-Impl構造
   - [ ] API利用セクション
   - [ ] 実装コード例セクション

### 段階的に実施（Week 3-10）

3. **ユースケースごとの移行**
   - [ ] README.md作成
   - [ ] api-usage.md内容の統合
   - [ ] BC API仕様へのリンク追加

4. **api-usage.md の廃止**
   - [ ] 非推奨マーク追加
   - [ ] リダイレクト追加
   - [ ] 最終的に削除

---

## 📝 結論

### usecases/api-usage.md は不要

**理由**:
1. ✅ BC API仕様と重複
2. ✅ Why-What-How-Impl統合モデルと不整合
3. ✅ 保守コストが二重化
4. ✅ 実装者の学習コストが高い

**代替策**:
1. ✅ BC API仕様を強化（WHAT + 基本的なHOW）
2. ✅ UseCase README.mdに統合（HOW + Implementation）
3. ✅ リンクで相互参照

**移行期間**: 2-3ヶ月（段階的廃止）

**期待効果**:
- 保守性50%向上
- 開発者体験50%向上
- 情報の不整合リスク大幅削減

---

**作成日**: 2025-10-23
**承認**: 要レビュー
**実装**: Phase 1から順次
