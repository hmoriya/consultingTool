# パラソルドメイン言語生成機能改善 設計書

**作成日**: 2025-01-26  
**更新日**: 2025-01-26  
**バージョン**: 1.0.0

## 1. 概要

パラソルドメイン言語の生成機能を改善し、より柔軟で使いやすいシステムを構築する。主な改善点は以下の通り：

1. 生成単位の柔軟化（ケーパビリティ単位/サービス単位）
2. Markdown形式での編集対応
3. 生成ロジックの高度化

## 2. 現状の課題

### 2.1 生成単位の固定化
- サービス全体の一括生成のみ対応
- 部分的な更新や追加が困難
- 既存ドメイン言語への差分適用ができない

### 2.2 編集の困難さ
- JSON形式のみで編集が困難
- ドメインエキスパートにとって理解しにくい
- 微調整や手動追加が煩雑

### 2.3 生成品質
- エンティティ名が機械的
- ケーパビリティとオペレーションの関係性が不明確
- ドメインイベントの推論が限定的

## 3. 改善方針

### 3.1 生成単位の柔軟化

#### ケーパビリティ単位生成
```typescript
interface CapabilityGenerationOptions {
  capability: BusinessCapability;
  mode: 'create' | 'update' | 'append';
  targetEntities?: string[]; // 更新対象のエンティティ名
}
```

#### サービス単位生成
```typescript
interface ServiceGenerationOptions {
  service: Service;
  mode: 'full' | 'incremental';
  excludeCapabilities?: string[]; // 除外するケーパビリティ
}
```

### 3.2 Markdown形式サポート

#### ドメイン言語のMarkdown表現
```markdown
# プロジェクト管理サービス ドメイン言語

## エンティティ

### Project（プロジェクト）
プロジェクトの基本情報と状態を管理する集約ルート。

| プロパティ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| id | UUID | ✓ | プロジェクトID |
| name | STRING_100 | ✓ | プロジェクト名 |
| status | ENUM | ✓ | ステータス（draft/active/closed） |
| startDate | DATE | ✓ | 開始日 |
| endDate | DATE | ✓ | 終了日 |

**ビジネスルール**:
- 終了日は開始日より後でなければならない
- ステータスがclosedの場合、変更不可

**ドメインイベント**:
- ProjectCreated（プロジェクト作成済み）
- ProjectApproved（プロジェクト承認済み）
- ProjectClosed（プロジェクト完了済み）

## 値オブジェクト

### ProjectId（プロジェクトID）
プロジェクトを一意に識別する値オブジェクト。

| プロパティ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| value | UUID | ✓ | UUID値 |

**検証ルール**:
- UUID形式であること
- 空文字でないこと
```

#### 相互変換の実装
```typescript
// JSON → Markdown
function domainLanguageToMarkdown(domain: DomainLanguageDefinition): string {
  // 実装
}

// Markdown → JSON
function markdownToDomainLanguage(markdown: string): DomainLanguageDefinition {
  // 実装
}
```

### 3.3 生成ロジックの改善

#### エンティティ名の推論
```typescript
function inferEntityName(capability: BusinessCapability): string {
  // ケーパビリティ名から意味のあるエンティティ名を推論
  // 例: ProjectLifecycleManagement → Project
  // 例: TaskManagement → Task
  // 例: RiskManagement → Risk
}
```

#### プロパティの自動推論
```typescript
function inferProperties(
  capability: BusinessCapability, 
  operations: BusinessOperation[]
): Property[] {
  // オペレーションパターンから必要なプロパティを推論
  // CRUD → name, description
  // Workflow → status, approvedBy, approvedAt
  // Analytics → metrics, calculatedAt
}
```

#### ドメインイベントの推論
```typescript
function inferDomainEvents(
  entity: string,
  operations: BusinessOperation[]
): DomainEvent[] {
  // オペレーションからドメインイベントを推論
  // create* → *Created
  // approve* → *Approved
  // update*Status → *StatusChanged
}
```

## 4. UI/UX設計

### 4.1 生成オプションUI

```tsx
interface GenerationOptionsProps {
  mode: 'capability' | 'service';
  onGenerate: (options: GenerationOptions) => void;
}

// UIコンポーネント
<GenerationOptions>
  <RadioGroup>
    <Radio value="capability">選択したケーパビリティのみ</Radio>
    <Radio value="service">サービス全体</Radio>
  </RadioGroup>
  
  <Select label="生成モード">
    <Option value="create">新規作成</Option>
    <Option value="update">更新</Option>
    <Option value="append">追加</Option>
  </Select>
  
  <Checkbox label="既存エンティティを保持" />
  <Checkbox label="プレビューを表示" />
</GenerationOptions>
```

### 4.2 エディタUI

```tsx
interface DomainLanguageEditorProps {
  value: DomainLanguageDefinition;
  format: 'json' | 'markdown';
  onChange: (value: DomainLanguageDefinition) => void;
}

// タブ切り替えUI
<Tabs>
  <Tab label="JSON">
    <JSONEditor value={value} onChange={onChange} />
  </Tab>
  <Tab label="Markdown">
    <MarkdownEditor value={toMarkdown(value)} onChange={onChange} />
  </Tab>
  <Tab label="プレビュー">
    <DomainLanguagePreview value={value} />
  </Tab>
</Tabs>
```

### 4.3 差分表示UI

```tsx
interface DiffViewerProps {
  before: DomainLanguageDefinition;
  after: DomainLanguageDefinition;
  format: 'json' | 'markdown';
}

// 差分ビューア
<DiffViewer>
  <DiffHeader>
    <Badge>+3 エンティティ</Badge>
    <Badge>+5 プロパティ</Badge>
    <Badge>+2 ドメインイベント</Badge>
  </DiffHeader>
  <DiffContent>
    {/* 追加・変更・削除を色分けして表示 */}
  </DiffContent>
</DiffViewer>
```

## 5. 実装計画

### Phase 1: 基盤整備（1週間）
1. Markdown形式の定義とパーサー実装
2. JSON ⇔ Markdown 変換機能
3. 基本的なMarkdownエディタの統合

### Phase 2: 生成ロジック改善（1週間）
1. エンティティ名推論アルゴリズム
2. プロパティ自動推論
3. ドメインイベント推論
4. ケーパビリティ単位生成

### Phase 3: UI実装（1週間）
1. 生成オプションUI
2. タブ切り替えエディタ
3. 差分表示機能
4. プレビュー機能

### Phase 4: テスト・最適化（3日）
1. 単体テスト
2. 統合テスト
3. パフォーマンス最適化
4. ドキュメント整備

## 6. 技術選定

### Markdownパーサー
- **remark**: MDast（Markdown AST）を使用した高機能パーサー
- **markdown-it**: 高速で拡張可能なパーサー
- **推奨**: remark（ASTベースで変換処理が容易）

### エディタコンポーネント
- **Monaco Editor**: VSCodeベースの高機能エディタ
- **CodeMirror**: 軽量で拡張可能
- **推奨**: Monaco Editor（Markdown/JSON両対応、差分表示機能）

### 差分表示
- **diff**: シンプルな差分計算
- **jsdiff**: 高機能な差分ライブラリ
- **推奨**: jsdiff（単語単位、行単位の差分表示）

## 7. API設計

### 生成API拡張
```typescript
// Server Action
export async function generateDomainLanguage(options: {
  serviceId: string;
  capabilityIds?: string[];
  mode: 'create' | 'update' | 'append';
  format: 'json' | 'markdown';
}): Promise<{
  success: boolean;
  data?: DomainLanguageDefinition;
  markdown?: string;
  diff?: DiffResult;
  error?: string;
}>
```

### 変換API
```typescript
// Server Action
export async function convertDomainLanguageFormat(data: {
  content: string;
  fromFormat: 'json' | 'markdown';
  toFormat: 'json' | 'markdown';
}): Promise<{
  success: boolean;
  result?: string;
  error?: string;
}>
```

## 8. データモデル拡張

### DomainLanguageDefinition拡張
```typescript
interface DomainLanguageDefinition {
  // 既存フィールド...
  
  // 新規フィールド
  metadata?: {
    generatedFrom?: {
      capabilities: string[];
      timestamp: string;
      mode: string;
    };
    lastEditedFormat?: 'json' | 'markdown';
    customizations?: string[]; // 手動編集された箇所
  };
}
```

## 9. バリデーション

### Markdown形式のバリデーション
- テーブル形式の正確性
- 必須セクションの存在確認
- 型定義の妥当性
- 参照整合性

### 生成結果のバリデーション
- エンティティ名の重複チェック
- プロパティ名の妥当性
- ドメインイベントの命名規則
- 循環参照の検出

## 10. 今後の拡張可能性

1. **AI支援生成**
   - ケーパビリティ説明文からの自動推論
   - より自然なエンティティ名の提案

2. **テンプレート機能**
   - 業界別テンプレート
   - パターン別テンプレート

3. **バージョン管理**
   - 生成履歴の保存
   - ロールバック機能

4. **コラボレーション**
   - リアルタイム編集
   - コメント機能
   - レビューワークフロー