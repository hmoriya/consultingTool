'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Eye, 
  Copy, 
  Download, 
  Upload, 
  RotateCcw,
  Save,
  FileCode2,
  GitBranch
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useToast } from '@/app/hooks/use-toast';
import { DiagramView } from './DiagramView';
import { DiagramConverter } from '../../../lib/parasol/diagram-converter';

export type MDEditorType =
  | 'service-description'
  | 'domain-language'
  | 'api-specification'
  | 'database-design'
  | 'capability-definition'
  | 'operation-design'
  | 'usecase-definition'
  | 'robustness-diagram'
  | 'page-definition'
  | 'test-definition'
  | 'api-usage';

interface MDTemplate {
  name: string;
  type: MDEditorType;
  template: string;
}

const mdTemplates: MDTemplate[] = [
  {
    name: 'サービス説明',
    type: 'service-description',
    template: `# サービス名

## 概要
このサービスの目的と役割を記述します。

## 責務
- 責務1
- 責務2
- 責務3

## 依存関係
### 依存するサービス
- サービスA：理由
- サービスB：理由

### 依存されるサービス
- サービスC：理由
- サービスD：理由

## API概要
主要なAPIエンドポイントとその用途を記述します。

## 技術スタック
- 言語/フレームワーク
- データベース
- その他の技術`
  },
  {
    name: 'ドメイン言語定義',
    type: 'domain-language',
    template: `# ドメイン言語定義

## ドメイン概要
[ドメインの目的と責務を記述]

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
STRING_500: 最大500文字の文字列
TEXT: 長文テキスト（制限なし）
MARKDOWN: Markdown形式のテキスト
EMAIL: メールアドレス形式（RFC5322準拠）
PASSWORD_HASH: ハッシュ化されたパスワード
URL: URL形式（RFC3986準拠）
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
PERCENTAGE: パーセンテージ（0-100）
MONEY: 金額（通貨単位付き）
BOOLEAN: 真偽値（true/false）
JSON: JSON形式のデータ
ENUM: 列挙型
\`\`\`

## エンティティ

### [エンティティ名]
[エンティティの説明]

| 属性名 | 型 | 必須 | 説明 |
|--------|-----|------|------|
| ID | UUID | ○ | 一意識別子 |
| 名称 | STRING_100 | ○ | エンティティの名称 |
| 説明 | TEXT | - | 詳細説明 |
| ステータス | ENUM | ○ | 状態 |
| 作成日時 | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | TIMESTAMP | ○ | 最終更新日時 |

#### ビジネスルール
- [ルール1]: 詳細説明
- [ルール2]: 詳細説明

#### ドメインイベント
- [イベント名]: トリガー条件と内容

#### 集約ルート
[この場合のみ記載] このエンティティは[集約名]集約のルートエンティティ

## 値オブジェクト

### [値オブジェクト名]
[値オブジェクトの説明]

#### 属性
- [属性名]: [型] - [説明]

#### 制約
- [制約1]
- [制約2]

## 集約

### [集約名]
- **集約ルート**: [エンティティ名]
- **含まれるエンティティ**: [エンティティ1], [エンティティ2]
- **トランザクション境界**: [説明]
- **不変条件**: [条件説明]

## ドメインサービス

### [サービス名]
[サービスの説明]

#### 提供機能
- [メソッド名]([パラメータ]): [説明]

## ドメインイベント

### [イベント名]
- **発生タイミング**: [説明]
- **ペイロード**: 
  - [属性1]: [型]
  - [属性2]: [型]

## リポジトリインターフェース

### [リポジトリ名]
- findById(id: UUID): [エンティティ名]
- save(entity: [エンティティ名]): void
- delete(id: UUID): void
- [カスタムメソッド]: [説明]`
  },
  {
    name: 'API仕様',
    type: 'api-specification',
    template: `# API仕様

## エンドポイント一覧

### GET /api/resources
**概要**: リソース一覧を取得する

**パラメータ**:
| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| page | number | No | ページ番号 |
| limit | number | No | 取得件数 |

**レスポンス**:
\`\`\`json
{
  "items": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "total": 100,
  "page": 1
}
\`\`\`

### POST /api/resources
**概要**: 新規リソースを作成する

**リクエストボディ**:
\`\`\`json
{
  "name": "string",
  "description": "string"
}
\`\`\`

**レスポンス**:
\`\`\`json
{
  "id": "string",
  "name": "string",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\``
  },
  {
    name: 'データベース設計',
    type: 'database-design',
    template: `# データベース設計

## テーブル一覧

### テーブル名: users
**概要**: ユーザー情報を管理するテーブル

**カラム定義**:
| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | uuid_generate_v4() | 主キー |
| email | VARCHAR(255) | NO | - | メールアドレス |
| name | VARCHAR(100) | NO | - | ユーザー名 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 更新日時 |

**インデックス**:
- PRIMARY KEY (id)
- UNIQUE INDEX idx_email (email)

**リレーション**:
- profiles (1:1) - user_id
- posts (1:N) - author_id`
  },
  {
    name: 'ケーパビリティ定義',
    type: 'capability-definition',
    template: `# ケーパビリティ: ケーパビリティ名

## 概要
このケーパビリティが提供する業務能力の説明

## 責務
- 責務1：詳細説明
- 責務2：詳細説明
- 責務3：詳細説明

## 提供する価値
- ビジネス価値1
- ビジネス価値2
- ビジネス価値3

## 関連するビジネスオペレーション
- オペレーション1
- オペレーション2
- オペレーション3

## 必要なリソース
- 人的リソース
- システムリソース
- その他のリソース`
  },
  {
    name: 'ビジネスオペレーション設計',
    type: 'operation-design',
    template: `# ビジネスオペレーション: オペレーション名

## 概要
このオペレーションの目的と概要

## トリガー
オペレーションを開始するきっかけ

## 入力
- 入力1：説明
- 入力2：説明

## 処理フロー
1. ステップ1：処理内容
2. ステップ2：処理内容
3. ステップ3：処理内容
4. 分岐条件
   - 条件A：処理A
   - 条件B：処理B
5. ステップ5：処理内容

## 出力
- 出力1：説明
- 出力2：説明

## 例外処理
- 例外1：対処方法
- 例外2：対処方法

## SLA
- 処理時間：X秒以内
- 可用性：99.9%`
  },
  {
    name: 'ユースケース定義',
    type: 'usecase-definition',
    template: `# ユースケース: ユースケース名

## アクター
- 主アクター：役割
- 副アクター：役割

## 概要
ユースケースの目的と概要

## 事前条件
- 条件1
- 条件2

## 事後条件
### 成功時
- 条件1
- 条件2

### 失敗時
- 条件1
- 条件2

## 基本フロー
1. アクターが〇〇する
2. システムが〇〇を表示する
3. アクターが〇〇を入力する
4. システムが〇〇を検証する
5. システムが〇〇を保存する
6. システムが完了メッセージを表示する

## 代替フロー
### 代替フロー1：〇〇の場合
4a. 条件：〇〇の場合
4b. システムが〇〇する
4c. 基本フロー3に戻る

## 例外フロー
### 例外1：〇〇エラー
4x. システムがエラーを検出
4y. システムがエラーメッセージを表示
4z. ユースケース終了`
  },
  {
    name: 'ページ定義',
    type: 'page-definition',
    template: `# ページ定義: ページ名

## 画面の目的
この画面で実現する機能の概要

## URL
/path/to/page

## アクセス権限
- 必要なロール：Admin, User
- 認証：必須/不要

## 画面構成

### ヘッダー部
- ロゴ
- ナビゲーションメニュー
- ユーザー情報

### メインコンテンツ
#### セクション1：〇〇表示エリア
- 要素1：説明
- 要素2：説明

#### セクション2：〇〇入力エリア
- フィールド1：型、必須/任意、バリデーション
- フィールド2：型、必須/任意、バリデーション

### アクション
- ボタン1：クリック時の動作
- ボタン2：クリック時の動作

## 画面遷移
- 遷移元：〇〇画面
- 遷移先：〇〇画面（条件）

## エラー処理
- エラー1：表示方法と対処
- エラー2：表示方法と対処`
  },
  {
    name: 'テスト定義',
    type: 'test-definition',
    template: `# テスト定義: テスト名

## テストの目的
このテストで検証する内容

## テスト種別
- 単体テスト/結合テスト/E2Eテスト

## 前提条件
- 環境：開発/ステージング/本番
- データ：必要なテストデータ
- 状態：システムの初期状態

## テストケース

### テストケース1：正常系
**Given**: 前提条件
**When**: 実行するアクション
**Then**: 期待される結果

### テストケース2：異常系
**Given**: 前提条件
**When**: 実行するアクション
**Then**: 期待される結果

### テストケース3：境界値
**Given**: 前提条件
**When**: 実行するアクション
**Then**: 期待される結果

## 期待される結果の詳細
- 画面表示
- データの状態
- ログ出力

## 確認項目チェックリスト
- [ ] 項目1
- [ ] 項目2
- [ ] 項目3`
  },
  {
    name: 'API利用仕様',
    type: 'api-usage',
    template: `# API利用仕様: [ユースケース名] (HOW: 具体的利用方法)

<!--
🎯 このファイルはIssue #146 API仕様WHAT/HOW分離統一化の一環で作成されました
📋 「HOW（どう使うか）」を定義します
👥 対象読者: 実装エンジニア
🔗 配置場所: usecases/[usecase-name]/api-usage.md

💡 「WHAT（何ができるか）」は以下で定義:
📄 サービス仕様: services/[service-name]/api/api-specification.md
👥 対象読者: API設計者・サービス連携者
🛠️ テンプレート: templates/dx-api-specification.md
-->

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|--------------|
| [API名1] | POST /api/[service]/[resource] | [利用目的の説明] | \`title\`, \`content\`, \`status\` |
| [API名2] | GET /api/[service]/[resource]/{id} | [利用目的の説明] | \`id\` (required) |
| [API名3] | PUT /api/[service]/[resource]/{id} | [利用目的の説明] | \`id\`, \`title\`, \`content\` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | ユースケース開始時 | 認証トークン取得・操作権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | 処理実行前 | 操作権限の確認 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | 操作完了時 | 監査ログ記録 |

## API呼び出しシーケンス

### 基本フロー: [メインシナリオ名]

1. **事前認証・権限確認**:
   - \`POST /api/auth/usecases/authenticate\` (secure-access-service UC-AUTH-01)
   - \`POST /api/auth/usecases/validate-permission\` (secure-access-service UC-AUTH-02)
   - ユーザー認証と操作権限の確認

2. **メイン処理開始**:
   - \`POST /api/[service]/[resource]\` (自サービス)
   - [処理内容の説明]

3. **データ更新・検証**:
   - \`PUT /api/[service]/[resource]/{id}\` (自サービス)
   - [処理内容の説明]

4. **結果確認・通知**:
   - \`GET /api/[service]/[resource]/{id}\` (自サービス)
   - 他サービス通知API (必要に応じて)

5. **監査ログ記録**:
   - \`POST /api/auth/usecases/log-access\` (secure-access-service UC-AUTH-03)
   - 操作完了の監査記録

### 代替フロー: [代替シナリオ名]

1. **代替条件**: [条件の説明]
2. **代替処理**: [処理内容]
3. **復帰処理**: 基本フロー[X]に戻る

## エラーハンドリング

### 認証・権限エラー
- **AUTH_FAILED**: 認証失敗時のトークン再取得処理
- **PERMISSION_DENIED**: 操作権限不足時のエラー表示
- **SESSION_EXPIRED**: セッション期限切れ時の再認証

### API操作エラー
- **VALIDATION_ERROR**: 入力内容検証エラー時の詳細エラー表示
- **RESOURCE_NOT_FOUND**: リソース未存在時の処理
- **CONFLICT_ERROR**: 同時更新競合時の解決

### システムエラー
- **SERVICE_UNAVAILABLE**: サービス停止時のローカル保存・再試行
- **NETWORK_ERROR**: ネットワーク障害時のオフライン対応
- **TIMEOUT_ERROR**: タイムアウト時の処理

### リトライ・復旧戦略
- **保存エラー**: 3回まで自動リトライ（指数バックオフ）
- **ネットワーク障害**: ローカルストレージでの一時保存
- **認証エラー**: 自動再認証・トークンリフレッシュ

## パフォーマンス最適化

### API呼び出し最適化
- **並列処理**: 独立した処理の並列実行
- **バッチ処理**: 複数データの一括処理
- **キャッシュ活用**: 頻繁アクセスデータのメモリキャッシュ

### UI/UX最適化
- **非同期処理**: UIブロックしない背景処理
- **プログレッシブロード**: 大量データの段階的読み込み
- **楽観的更新**: UI即座反映・エラー時ロールバック

## 品質保証

### API利用品質
- **成功率**: 99.5%以上 - 正常時のAPI呼び出し成功率
- **レスポンス時間**: 95%ile < 2秒 - API呼び出し時間
- **エラー回復率**: 95%以上 - エラー発生時の自動回復成功率

### レスポンス時間目標
- **認証API**: 95%ile < 0.5秒、99%ile < 1秒
- **メインAPI**: 95%ile < 1秒、99%ile < 2秒
- **検索API**: 95%ile < 2秒、99%ile < 5秒
- **通知API**: 95%ile < 0.3秒、99%ile < 0.5秒`
  }
];

interface UnifiedMDEditorProps {
  type: MDEditorType;
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => void;
  title?: string;
  description?: string;
  readOnly?: boolean;
  className?: string;
}

export function UnifiedMDEditor({
  type,
  value,
  onChange,
  onSave,
  title,
  description,
  readOnly = false,
  className
}: UnifiedMDEditorProps) {
  const [markdown, setMarkdown] = useState(value);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'diagram'>('edit');
  const [diagramCode, setDiagramCode] = useState<string>('');
  const [diagramType, setDiagramType] = useState<'mermaid' | 'plantuml'>('mermaid');
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // 値の変更を検知
  useEffect(() => {
    setMarkdown(value);
  }, [value]);

  // ダイアグラムコードの生成
  useEffect(() => {
    if (!markdown) {
      setDiagramCode('');
      return;
    }

    try {
      let code = '';
      let diagType: 'mermaid' | 'plantuml' = 'mermaid';

      console.log('UnifiedMDEditor: Generating diagram for type:', type);
      
      switch (type) {
        case 'domain-language':
          code = DiagramConverter.domainToClassDiagram(markdown);
          break;
        case 'database-design':
          code = DiagramConverter.dbToERDiagram(markdown);
          break;
        case 'operation-design':
          code = DiagramConverter.operationToFlowDiagram(markdown);
          break;
        case 'usecase-definition':
          // ユースケース定義MDファイルからMermaidコードを抽出
          code = DiagramConverter.extractMermaidFromUseCase(markdown);
          diagType = 'mermaid';
          break;
        case 'robustness-diagram':
          // ロバストネス図MDファイルからMermaidコードを抽出
          code = DiagramConverter.extractMermaidFromRobustness(markdown);
          diagType = 'mermaid';
          break;
        default:
          code = '';
      }

      console.log('UnifiedMDEditor: Generated diagram code:', code);
      setDiagramCode(code);
      setDiagramType(diagType);
    } catch (err) {
      console.error('Diagram generation error:', err);
      setDiagramCode('');
    }
  }, [markdown, type]);

  // Markdown変更ハンドラ
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMarkdown(newValue);
    onChange(newValue);
    setHasChanges(true);
  };

  // テンプレート適用
  const applyTemplate = () => {
    const template = mdTemplates.find(t => t.type === type);
    if (template) {
      setMarkdown(template.template);
      onChange(template.template);
      setHasChanges(true);
      toast({
        title: 'テンプレート適用',
        description: `${template.name}のテンプレートを適用しました。`,
      });
    }
  };

  // クリップボードにコピー
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast({
        title: 'コピー完了',
        description: 'Markdownをクリップボードにコピーしました。',
      });
    } catch (err) {
      toast({
        title: 'エラー',
        description: 'コピーに失敗しました。',
        variant: 'destructive',
      });
    }
  };

  // ファイルダウンロード
  const downloadFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ファイルアップロード
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMarkdown(content);
        onChange(content);
        setHasChanges(true);
        toast({
          title: 'ファイル読み込み完了',
          description: 'Markdownファイルを読み込みました。',
        });
      };
      reader.readAsText(file);
    }
  };

  // 保存処理
  const handleSave = () => {
    if (onSave) {
      onSave(markdown);
      setHasChanges(false);
    }
  };

  // リセット処理
  const handleReset = () => {
    setMarkdown(value);
    setHasChanges(false);
    toast({
      title: 'リセット完了',
      description: '変更を破棄しました。',
    });
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title || 'Markdownエディタ'}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {!readOnly && (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={applyTemplate}
                  title="テンプレート適用"
                >
                  <FileCode2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  title="ファイルアップロード"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".md,.markdown"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </>
            )}
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
              title="コピー"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={downloadFile}
              title="ダウンロード"
            >
              <Download className="h-4 w-4" />
            </Button>
            {!readOnly && hasChanges && (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleReset}
                  title="変更を破棄"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                {onSave && (
                  <Button
                    size="icon"
                    onClick={handleSave}
                    title="保存"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="edit" className="flex items-center gap-2" disabled={readOnly}>
              <FileText className="h-4 w-4" />
              編集
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              プレビュー
            </TabsTrigger>
            <TabsTrigger 
              value="diagram" 
              className="flex items-center gap-2"
              disabled={!diagramCode}
            >
              <GitBranch className="h-4 w-4" />
              ダイアグラム
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-4">
            <Textarea
              ref={textareaRef}
              value={markdown}
              onChange={handleMarkdownChange}
              className="font-mono text-sm min-h-[600px] resize-y"
              placeholder="Markdownを入力..."
              readOnly={readOnly}
              disabled={readOnly}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[600px] border rounded-md p-6 bg-background">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-border">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-muted/50">{children}</thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-border">{children}</tbody>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 text-sm">{children}</td>
                    ),
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="px-1 py-0.5 text-sm font-mono bg-muted rounded">
                          {children}
                        </code>
                      ) : (
                        <code className="block p-4 text-sm font-mono bg-muted rounded-md overflow-x-auto">
                          {children}
                        </code>
                      ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="diagram" className="mt-4">
            <div className="flex-1 min-h-0 overflow-hidden">
              {diagramCode ? (
                <DiagramView
                type={diagramType}
                code={diagramCode}
                title={title}
                onError={(error) => {
                  console.error('Diagram error:', error);
                  toast({
                    title: 'ダイアグラムエラー',
                    description: error,
                    variant: 'destructive',
                  });
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <p>ダイアグラムを生成できません</p>
              </div>
            )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}