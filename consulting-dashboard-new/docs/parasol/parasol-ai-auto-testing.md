# パラソルAI自動テストと補正プロセス

**バージョン**: 1.0.0
**最終更新**: 2025-11-01

> 🌍 **パラソルワールド**: このドキュメントは、パラソルワールドにおけるAI自動テストと補正プロセスの詳細を説明します。
>
> - **パラソルワールド全体**: [パラソルワールド - 概要](./parasol-world-overview.md)
> - **AI生成**: [パラソルAIコード生成](./parasol-ai-code-generation.md)

---

## 📋 目次

1. [自動テストと補正の概要](#自動テストと補正の概要)
2. [テストの種類](#テストの種類)
3. [自動テスト実行フロー](#自動テスト実行フロー)
4. [エラー検出と分析](#エラー検出と分析)
5. [AI自動補正プロセス](#ai自動補正プロセス)
6. [設計へのフィードバック](#設計へのフィードバック)
7. [補正戦略](#補正戦略)
8. [実践例](#実践例)

---

## 自動テストと補正の概要

### パラソルワールドにおける自動テストの位置づけ

```
設計（MD）
    ↓
AI生成
    ↓
自動テスト実行 ← 📍 このプロセス
    ↓
  ✅ 成功 → デプロイ
  ❌ 失敗 → AI自動補正 → 設計更新 → AI再生成
```

### 自動テストと補正の基本原則

1. **完全自動化**
   - 人間の介入なし
   - テスト → 分析 → 補正 → 再テストまで自動

2. **即座のフィードバック**
   - エラー検出から数秒〜数分で補正案生成
   - 迅速なイテレーション

3. **設計の真実性維持**
   - コードの修正は必ずMDにフィードバック
   - MDが常に最新の状態を反映

4. **段階的補正**
   - 簡単なエラーから順に修正
   - 複雑なエラーは段階的にアプローチ

---

## テストの種類

### テストピラミッド

```
        ┌─────────────┐
        │   E2Eテスト   │ ← 少ない（重い、遅い）
        └─────────────┘
            ↑
      ┌───────────────────┐
      │   統合テスト        │ ← 中程度
      └───────────────────┘
            ↑
    ┌─────────────────────────┐
    │      単体テスト            │ ← 多い（軽い、速い）
    └─────────────────────────┘
```

### 各テストの役割

| テストタイプ | 実行タイミング | 目的 | 所要時間 |
|------------|--------------|------|---------|
| **Lint** | コード生成直後 | コード品質チェック | 数秒 |
| **型チェック** | Lint後 | 型安全性チェック | 数秒〜数十秒 |
| **単体テスト** | 型チェック後 | 個別関数/コンポーネントの正確性 | 数秒〜1分 |
| **統合テスト** | 単体テスト後 | コンポーネント間連携 | 数分 |
| **E2Eテスト** | 統合テスト後 | エンドツーエンドシナリオ | 数分〜数十分 |

---

## 自動テスト実行フロー

### 完全な自動テストフロー

```
┌─────────────────────────────────────────────────────────────┐
│ コード生成完了                                                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: 静的解析                                             │
│ ├─ Lint実行（ESLint/Pylint）                                 │
│ ├─ Format検証（Prettier/Black）                              │
│ └─ 型チェック（TypeScript/mypy）                              │
└─────────────────────────────────────────────────────────────┘
                         ↓
                   ✅ 成功 / ❌ 失敗
                         ↓
           ❌ 失敗 → AI自動補正 → Phase 1再実行
                         ↓
                   ✅ 成功
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: 単体テスト                                           │
│ ├─ フロントエンド単体テスト（Jest/Vitest）                     │
│ ├─ バックエンド単体テスト（Jest/Pytest）                       │
│ └─ カバレッジ計測（目標: 80%以上）                             │
└─────────────────────────────────────────────────────────────┘
                         ↓
                   ✅ 成功 / ❌ 失敗
                         ↓
           ❌ 失敗 → AI自動補正 → Phase 2再実行
                         ↓
                   ✅ 成功
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: 統合テスト                                           │
│ ├─ API統合テスト                                             │
│ ├─ データベース統合テスト                                      │
│ └─ サービス間連携テスト                                        │
└─────────────────────────────────────────────────────────────┘
                         ↓
                   ✅ 成功 / ❌ 失敗
                         ↓
           ❌ 失敗 → AI自動補正 → Phase 3再実行
                         ↓
                   ✅ 成功
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: E2Eテスト                                            │
│ ├─ UseCaseシナリオテスト（Playwright/Cypress）                 │
│ ├─ ブラウザテスト（Chrome, Firefox, Safari）                   │
│ └─ スクリーンショット比較                                      │
└─────────────────────────────────────────────────────────────┘
                         ↓
                   ✅ 成功 / ❌ 失敗
                         ↓
           ❌ 失敗 → AI自動補正 → Phase 4再実行
                         ↓
                   ✅ 成功
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 5: パフォーマンステスト                                   │
│ ├─ レスポンスタイム測定                                        │
│ ├─ メモリ使用量測定                                           │
│ └─ 負荷テスト                                                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
                   ✅ 成功 / ❌ 失敗
                         ↓
           ❌ 失敗 → AI自動補正 → Phase 5再実行
                         ↓
                   ✅ 成功
                         ↓
                    デプロイ準備完了
```

### テスト実行ログ例

```
[2025-11-01 10:00:00] Starting automated testing...

[Phase 1: 静的解析]
[10:00:01] Running ESLint... ✅ PASSED (0 errors, 0 warnings)
[10:00:03] Running Prettier check... ✅ PASSED
[10:00:05] Running TypeScript check... ✅ PASSED (0 errors)

[Phase 2: 単体テスト]
[10:00:10] Running frontend unit tests...
  ✅ CreateProjectPage.test.tsx (8/8 passed)
  ✅ ProjectForm.test.tsx (12/12 passed)
  ✅ Total: 20/20 passed, Coverage: 85%

[10:00:30] Running backend unit tests...
  ✅ projects.service.spec.ts (15/15 passed)
  ✅ projects.controller.spec.ts (10/10 passed)
  ✅ Total: 25/25 passed, Coverage: 82%

[Phase 3: 統合テスト]
[10:01:00] Running API integration tests...
  ✅ POST /api/projects (success case)
  ❌ POST /api/projects (validation error case) - FAILED
      Expected: 400 Bad Request
      Actual: 500 Internal Server Error

[10:01:15] AI analyzing error...
[10:01:20] AI correction generated. Applying fix...
[10:01:25] Re-running failed test...
  ✅ POST /api/projects (validation error case) - PASSED

[Phase 4: E2Eテスト]
[10:02:00] Running E2E tests...
  ✅ Create project end-to-end (5 steps)
  ✅ Edit project end-to-end (4 steps)
  ✅ Delete project end-to-end (3 steps)

[Phase 5: パフォーマンステスト]
[10:05:00] Running performance tests...
  ✅ Page load time: 1.2s (target: < 3s)
  ✅ API response time: 150ms (target: < 500ms)
  ✅ Memory usage: 45MB (target: < 100MB)

[10:06:00] All tests passed! ✅
[10:06:00] Total time: 6 minutes
[10:06:00] Ready for deployment.
```

---

## エラー検出と分析

### エラーの分類

| エラータイプ | 検出方法 | 重要度 | 自動補正可能性 |
|------------|---------|-------|---------------|
| **構文エラー** | Lint, コンパイラ | 🔴 Critical | 高（90%） |
| **型エラー** | TypeScript, mypy | 🔴 Critical | 高（85%） |
| **ロジックエラー** | 単体テスト失敗 | 🟡 High | 中（60%） |
| **統合エラー** | 統合テスト失敗 | 🟡 High | 中（50%） |
| **UI/UXエラー** | E2Eテスト失敗 | 🟢 Medium | 低（30%） |
| **パフォーマンスエラー** | 性能テスト | 🟢 Medium | 低（20%） |

### AI エラー分析プロセス

```
エラー検出
    ↓
エラー情報収集
  ├─ エラーメッセージ
  ├─ スタックトレース
  ├─ テストコード
  ├─ 生成されたコード
  └─ MDファイル（設計）
    ↓
Claude APIにエラー分析依頼
  ├─ エラーの原因特定
  ├─ 設計の問題 vs 実装の問題
  └─ 補正戦略の提案
    ↓
補正案生成
```

### エラー分析例

**検出されたエラー**:

```
FAIL src/services/projects.service.spec.ts
  ● ProjectsService › create › should throw error when project name already exists

    expect(received).rejects.toThrow(expected)

    Expected message: "このプロジェクトは既に存在します"
    Received message: "Project already exists"

      65 |     it('should throw error when project name already exists', async () => {
      66 |       jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(existingProject);
    > 67 |       await expect(service.create(createDto)).rejects.toThrow('このプロジェクトは既に存在します');
         |             ^
```

**AI分析結果**:

```json
{
  "errorType": "LogicError",
  "severity": "High",
  "rootCause": "エラーメッセージが英語で実装されているが、MDでは日本語が指定されている",
  "affectedFile": "src/services/projects.service.ts",
  "mdSource": "docs/parasol/3-DEVELOPMENT-DESIGN/.../refined-domain-language.md",
  "correctionStrategy": "UpdateErrorMessage",
  "proposedFix": {
    "file": "src/services/projects.service.ts",
    "line": 45,
    "oldCode": "throw new BadRequestException('Project already exists');",
    "newCode": "throw new BadRequestException('このプロジェクトは既に存在します'); // ERR_SYS_004"
  },
  "needsMdUpdate": false,
  "confidence": 0.95
}
```

---

## AI自動補正プロセス

### 補正の判断基準

```
エラー分析完了
    ↓
補正可能性の判定
    ├─ 信頼度 >= 90% → 自動補正実行
    ├─ 信頼度 60-89% → 補正案を生成し、人間に確認を求める
    └─ 信頼度 < 60% → 人間の介入が必要
```

### 自動補正フロー

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: エラー情報収集                                         │
│ - エラーメッセージ、スタックトレース                             │
│ - 失敗したテストケース                                         │
│ - 生成されたコード                                             │
│ - MDファイル（設計の真実）                                      │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Claude APIでエラー分析                                 │
│ - 原因特定                                                    │
│ - 設計問題 or 実装問題                                         │
│ - 補正戦略決定                                                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: 補正案生成                                            │
│ - コード修正案                                                 │
│ - MD更新案（必要な場合）                                        │
│ - テスト修正案（必要な場合）                                     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: 補正実行                                              │
│ - コードファイル更新                                           │
│ - MDファイル更新（設計フィードバック）                           │
│ - Git commit（自動コミット）                                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: 再テスト実行                                          │
│ - 同じテストを再実行                                           │
│ - ✅ 成功 → 次のテストフェーズへ                                │
│ - ❌ 失敗 → Step 1に戻る（最大3回まで）                         │
└─────────────────────────────────────────────────────────────┘
```

### Claude API補正プロンプト例

**システムプロンプト**:

```
あなたは、パラソルワールドのAI自動補正エンジンです。

以下のルールに従ってエラーを修正してください:

1. MDファイルが真実（Source of Truth）
   - コードとMDが矛盾する場合、MDが正しい
   - MDに従ってコードを修正

2. 段階的補正
   - 最小限の変更で修正
   - 1つのエラーに集中

3. トレーサビリティ
   - 修正理由をコメントで明記
   - エラーコードを記載

4. 設計フィードバック
   - MDの曖昧さや不足があれば指摘
   - MD更新案を提案

5. テストの尊重
   - テストが期待する動作が正しい
   - テストに合わせてコードを修正
```

**ユーザープロンプト**:

```
以下のテストが失敗しました。原因を分析し、修正してください。

# 失敗したテスト
[テストコード]

# エラーメッセージ
[エラーメッセージとスタックトレース]

# 生成されたコード
[失敗の原因と思われるコード]

# MD定義（設計の真実）
[関連するMDファイルの内容]

タスク:
1. エラーの原因を特定
2. 修正案を生成
3. MD更新が必要か判断
4. 修正後のコードを出力

出力形式:
{
  "analysis": "エラーの原因分析",
  "correctionStrategy": "補正戦略",
  "codeChanges": [
    {
      "file": "ファイルパス",
      "changes": "修正内容"
    }
  ],
  "mdUpdates": [
    {
      "file": "MDファイルパス",
      "changes": "MD更新内容",
      "reason": "更新理由"
    }
  ],
  "confidence": 0.95
}
```

### Claude APIレスポンス例

```json
{
  "analysis": "エラーメッセージが英語 'Project already exists' で実装されているが、MDのrefined-domain-language.mdでは日本語 'このプロジェクトは既に存在します' が定義されている。エラーコードERR_SYS_004も欠落している。",

  "correctionStrategy": "UpdateErrorMessage",

  "codeChanges": [
    {
      "file": "src/services/projects.service.ts",
      "oldCode": "throw new BadRequestException('Project already exists');",
      "newCode": "throw new BadRequestException('このプロジェクトは既に存在します'); // ERR_SYS_004",
      "line": 45,
      "reason": "MDで定義された日本語エラーメッセージとエラーコードに準拠"
    }
  ],

  "mdUpdates": [],

  "needsRegeneration": false,

  "confidence": 0.95,

  "nextSteps": [
    "コードを修正",
    "テストを再実行",
    "成功を確認"
  ]
}
```

---

## 設計へのフィードバック

### MDフィードバックの種類

| フィードバックタイプ | 発生原因 | 対応 |
|------------------|---------|------|
| **曖昧さ検出** | AI生成時に解釈が分かれる | MDを明確化 |
| **不足情報検出** | 生成に必要な情報がない | MDに情報追加 |
| **矛盾検出** | MD内で矛盾する定義 | MDを整合 |
| **用語不足** | コード生成時に用語がない | ドメイン言語に追加 |
| **バリデーション不足** | テスト失敗で判明 | バリデーションルール追加 |

### フィードバックフロー

```
テスト失敗
    ↓
AI分析
    ↓
設計の問題を検出
    ↓
MD更新案生成
    ↓
MDファイル自動更新
    ↓
Git commit（"AI feedback: [説明]"）
    ↓
コード再生成
    ↓
テスト再実行
```

### MD更新例

#### ケース1: バリデーションルールの不足

**テスト失敗**:

```javascript
it('should reject negative budget', async () => {
  const dto = { ...validDto, budget: -1000 };
  await expect(service.create(dto)).rejects.toThrow();
});
// FAILED: No error thrown for negative budget
```

**AI分析**:

```
MD `create-project-page.md` のバリデーションルールに
「予算は0以上」の記載がない
```

**MD更新（自動）**:

```markdown
## 📝 フォームフィールド定義

| フィールド名 | バリデーション |
|------------|---------------|
| budget | [追加] 0以上の数値 |

## ✅ ビジネスルール

### バリデーションルール
- [追加] 予算は0以上の数値を入力してください
```

**refined-domain-language.md 更新（自動）**:

```markdown
## ⚠️ エラー用語

| エラーコード | 日本語メッセージ |
|------------|----------------|
| [追加] ERR_PRJ_006 | 予算は0以上の数値を入力してください |
```

**Git commit（自動）**:

```
commit abc123
Author: Parasol AI <ai@parasol.dev>
Date: 2025-11-01 10:15:23

AI feedback: Add budget validation rule

- テスト失敗により、予算のバリデーションルール不足を検出
- create-project-page.md にバリデーションルール追加
- refined-domain-language.md にエラーメッセージ追加

Related test: should reject negative budget
```

#### ケース2: ドメイン言語の曖昧さ

**生成エラー**:

```
Error: Ambiguous domain language
"プロジェクト状態 [Project State] [PROJECT_STATE]"
vs
"プロジェクト状態 [Project Status] [PROJECT_STATUS]"

AI cannot determine which to use.
```

**AI分析**:

```
同じ日本語名「プロジェクト状態」に対して、
英語名が "State" と "Status" の2つ存在。
一貫性がない。
```

**MD更新（自動）**:

```markdown
# refined-domain-language.md

## 🔄 変更履歴

### v1.1.0 (2025-11-01) - AI自動補正
- **修正**: "プロジェクト状態" の英語名を統一
  - 旧: Project State / Project Status（混在）
  - 新: Project Status（統一）
  - 理由: AI生成時の曖昧さ解消

## 📊 状態・ステータス用語

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| プロジェクト状態 | Project Status | PROJECT_STATUS | ✅ 統一
```

---

## 補正戦略

### 補正戦略の選択

AI は以下の戦略から最適なものを選択します:

| 戦略 | 説明 | 適用ケース | 成功率 |
|------|------|-----------|-------|
| **UpdateCode** | コードのみ修正 | MDが正しく、実装ミス | 90% |
| **UpdateMD** | MDのみ更新 | MD不足・曖昧 | 85% |
| **UpdateBoth** | コードとMD両方 | 設計と実装の両方に問題 | 70% |
| **Regenerate** | 完全再生成 | 構造的な問題 | 80% |
| **HumanIntervention** | 人間の判断が必要 | 複雑な設計判断 | - |

### 戦略の詳細

#### 1. UpdateCode戦略

**適用ケース**:
- MDが明確で、コードが従っていない
- エラーメッセージの言語不一致
- バリデーションの実装ミス

**例**:
```typescript
// 生成されたコード（誤）
throw new Error('Invalid input');

// MD定義
エラーコード: ERR_PRJ_001
メッセージ: プロジェクト名は必須です

// 補正後
throw new BadRequestException('プロジェクト名は必須です'); // ERR_PRJ_001
```

#### 2. UpdateMD戦略

**適用ケース**:
- MDに情報不足
- MDに曖昧な記述
- テストで新しい要件が判明

**例**:
```markdown
<!-- 補正前のMD -->
| budget | number | ❌ | 予算 | - |

<!-- AI補正後 -->
| budget | number | ❌ | 予算 | 0以上の数値 |
```

#### 3. UpdateBoth戦略

**適用ケース**:
- MDとコードの両方に問題
- ドメイン言語の不整合

**例**:
```markdown
<!-- MD更新 -->
+ エラーコード ERR_PRJ_007 追加

<!-- コード更新 -->
+ エラーハンドリング追加
```

#### 4. Regenerate戦略

**適用ケース**:
- 構造的な問題（アーキテクチャ違反）
- 複数の深刻なエラー
- 依存関係の問題

**フロー**:
```
1. 問題のあるコードを削除
2. MD確認・更新
3. Claude APIで完全再生成
4. テスト実行
```

---

## 実践例

### 例1: バリデーションエラーの自動補正

#### 初期状態

**MD**: `create-project-page.md`

```markdown
| projectName | string | ✅ | プロジェクト名 | 最大100文字 |
```

**生成されたコード**: `project.schema.ts`

```typescript
export const createProjectSchema = z.object({
  projectName: z.string().max(100),
});
```

**テスト**: `projects.service.spec.ts`

```typescript
it('should reject empty project name', async () => {
  const dto = { projectName: '' };
  await expect(service.create(dto)).rejects.toThrow('プロジェクト名は必須です');
});
```

#### テスト失敗

```
FAIL: should reject empty project name
Expected error: "プロジェクト名は必須です"
Actual: No error thrown (empty string accepted)
```

#### AI自動補正

**分析**:
```json
{
  "issue": "MDに「必須」の記載はあるが、「空文字不可」が明示されていない",
  "strategy": "UpdateBoth"
}
```

**MD更新**:
```markdown
| projectName | string | ✅ | プロジェクト名 | 必須、1文字以上、最大100文字 |
```

**コード補正**:
```typescript
export const createProjectSchema = z.object({
  projectName: z.string()
    .min(1, 'プロジェクト名は必須です') // ERR_PRJ_001
    .max(100, 'プロジェクト名は100文字以内で入力してください'), // ERR_PRJ_002
});
```

**再テスト**:
```
✅ PASS: should reject empty project name
```

---

### 例2: API統合テストエラーの自動補正

#### 初期状態

**API仕様MD**: `api-specification.md`

```markdown
### POST /api/projects

#### レスポンス（成功）
```json
{
  "success": true,
  "data": { ... }
}
```
```

**生成されたコード**: `projects.controller.ts`

```typescript
@Post()
async create(@Body() dto: CreateProjectDto): Promise<ProjectDto> {
  return this.service.create(dto);
}
```

**統合テスト**:

```typescript
it('POST /api/projects should return success response', async () => {
  const response = await request(app.getHttpServer())
    .post('/api/projects')
    .send(validDto);

  expect(response.body.success).toBe(true);
  expect(response.body.data).toBeDefined();
});
```

#### テスト失敗

```
FAIL: POST /api/projects should return success response
Expected: response.body.success to be true
Actual: response.body.success is undefined
Received: { projectId: "...", projectName: "..." }
```

#### AI自動補正

**分析**:
```json
{
  "issue": "MDではラップされたレスポンス { success, data } だが、実装は直接Entityを返している",
  "strategy": "UpdateCode",
  "reason": "MDが明確なので、コードをMDに合わせる"
}
```

**コード補正**:
```typescript
@Post()
async create(@Body() dto: CreateProjectDto): Promise<{ success: boolean; data: ProjectDto }> {
  const project = await this.service.create(dto);
  return {
    success: true,
    data: project,
  };
}
```

**再テスト**:
```
✅ PASS: POST /api/projects should return success response
```

---

### 例3: E2Eテストエラーと画面遷移の補正

#### 初期状態

**UseCase MD**: `create-project-usecase.md`

```markdown
## 📱 画面遷移

1. プロジェクト作成画面
2. 保存ボタンクリック
3. → プロジェクト一覧画面に遷移
```

**生成されたコード**: `CreateProjectPage.tsx`

```typescript
const handleSubmit = async (data) => {
  await createProject(data);
  navigate('/projects'); // 一覧画面に遷移
};
```

**E2Eテスト** (UseCaseから自動生成):

```typescript
test('create project and navigate to detail page', async ({ page }) => {
  await page.goto('/projects/new');
  // ... フォーム入力 ...
  await page.click('button:has-text("保存")');

  // 期待: プロジェクト詳細画面に遷移
  await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
});
```

#### テスト失敗

```
FAIL: create project and navigate to detail page
Expected URL: /projects/[id]
Actual URL: /projects
```

#### AI自動補正

**分析**:
```json
{
  "issue": "MDとテストに矛盾。MDは「一覧画面」、テストは「詳細画面」を期待",
  "strategy": "HumanIntervention",
  "reason": "どちらが正しいビジネス要件か、人間の判断が必要",
  "suggestions": [
    {
      "option": "A",
      "description": "一覧画面に遷移（MD通り）",
      "changes": "テストを修正"
    },
    {
      "option": "B",
      "description": "詳細画面に遷移（テスト通り）",
      "changes": "MDとコードを修正"
    }
  ]
}
```

**人間の判断**:
```
選択: Option B（詳細画面に遷移）
理由: 作成後に詳細を確認できる方がUX的に良い
```

**AI補正実行**:

**MD更新**:
```markdown
## 📱 画面遷移

1. プロジェクト作成画面
2. 保存ボタンクリック
3. → プロジェクト詳細画面に遷移（作成されたプロジェクト）
```

**コード更新**:
```typescript
const handleSubmit = async (data) => {
  const result = await createProject(data);
  navigate(`/projects/${result.id}`); // 詳細画面に遷移
};
```

**再テスト**:
```
✅ PASS: create project and navigate to detail page
```

---

## まとめ

### AI自動テストと補正の価値

1. **開発速度の向上**
   - テスト → 補正 → 再テストが自動化
   - 人間の介入を最小化

2. **品質の向上**
   - すべてのコードが自動テスト済み
   - MDとコードの整合性が保証される

3. **設計の改善**
   - テストからのフィードバックでMDが改善
   - ドメイン言語が継続的に精緻化

4. **トレーサビリティ**
   - すべての変更がGitに記録
   - AIの判断理由が明確

### 成功のポイント

1. **明確なMD定義**
   - 曖昧さを避ける
   - 具体的なバリデーションルール

2. **包括的なテストケース**
   - MDにテストケースを記載
   - エッジケースも含める

3. **AIへの信頼と検証**
   - 高信頼度の補正は自動実行
   - 低信頼度は人間が確認

4. **継続的改善**
   - フィードバックループを回す
   - MDとコードを常に最新に

---

## 🔗 関連ドキュメント

- [パラソルワールド - 概要](./parasol-world-overview.md)
- [パラソルAIコード生成](./parasol-ai-code-generation.md)
- [ドメイン言語進化プロセス](./parasol-v3-domain-language-evolution.md)
- [Layer 3: パラソル開発設計](./parasol-v3-layer3-development-design.md)

---

**作成日**: 2025-11-01
**最終更新**: 2025-11-01
**バージョン**: 1.0.0
