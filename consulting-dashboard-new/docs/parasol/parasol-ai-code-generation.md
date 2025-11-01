# パラソルAIコード生成プロセス

**バージョン**: 1.0.0
**最終更新**: 2025-11-01

> 🌍 **パラソルワールド**: このドキュメントは、パラソルワールドにおけるAIコード生成プロセスの詳細を説明します。
>
> - **パラソルワールド全体**: [パラソルワールド - 概要](./parasol-world-overview.md)
> - **全体概要**: [パラソルV3設計 - 全体概要](./parasol-v3-design-overview.md)

---

## 📋 目次

1. [AI生成の概要](#ai生成の概要)
2. [生成プロセスの全体像](#生成プロセスの全体像)
3. [入力となるMDファイル](#入力となるmdファイル)
4. [生成されるコード](#生成されるコード)
5. [アーキテクチャベース生成](#アーキテクチャベース生成)
6. [生成ルールと規約](#生成ルールと規約)
7. [テンプレートエンジン](#テンプレートエンジン)
8. [Claude API統合](#claude-api統合)
9. [生成結果の検証](#生成結果の検証)
10. [トラブルシューティング](#トラブルシューティング)

---

## AI生成の概要

### パラソルワールドにおけるAI生成の位置づけ

```
人間の役割: 設計（MD作成）
    ↓
AI生成: MD → コード
    ↓
自動テスト
    ↓
✅ 成功 → デプロイ
❌ 失敗 → AI自動補正 → 設計更新
```

### AI生成の基本原則

1. **MDファイルが唯一の真実（Single Source of Truth）**
   - すべての設計情報はMDに記載
   - コードは常にMDから生成される
   - 手動でコード変更してはならない

2. **アーキテクチャベース生成**
   - 事前定義されたアーキテクチャパターンに従う
   - レイヤー構造、依存関係を自動適用

3. **100%自動生成**
   - UI、API、データアクセス層、テストコードまで全自動
   - 人間の介入なし

4. **AI解析可能な形式**
   - 構造化されたMarkdown
   - 明確なセクション区切り
   - 一貫したテーブル形式

---

## 生成プロセスの全体像

### 生成フェーズ

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: MDファイル解析                                        │
│ - ドメイン言語パース                                           │
│ - Page定義パース                                              │
│ - API仕様パース                                               │
│ - データモデルパース                                           │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: 中間表現生成（IR: Intermediate Representation）       │
│ - 抽象構文木（AST）生成                                        │
│ - 依存関係グラフ構築                                           │
│ - アーキテクチャマッピング                                      │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: コード生成                                           │
│ - UIコンポーネント生成（React/Vue/Angular）                    │
│ - API実装生成（NestJS/Express/FastAPI）                       │
│ - データアクセス層生成（Prisma/TypeORM/SQLAlchemy）            │
│ - テストコード生成（Jest/Vitest/Pytest）                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: コード最適化                                          │
│ - Lint実行                                                   │
│ - Format実行                                                 │
│ - 依存関係解決                                                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 5: 自動テスト                                           │
│ - 単体テスト実行                                              │
│ - 統合テスト実行                                              │
│ - E2Eテスト実行                                               │
└─────────────────────────────────────────────────────────────┘
```

### 生成時間の目安

| 生成対象 | 規模 | 生成時間 |
|---------|------|---------|
| 単一Page（UI + API） | 小規模 | 10-30秒 |
| 1つのBC全体 | 中規模 | 5-10分 |
| システム全体 | 大規模 | 30-60分 |

---

## 入力となるMDファイル

### Layer 3 MDファイルの役割

AI生成は、**Layer 3の成果物を主要な入力**として使用します。

#### 主要入力ファイル

| MDファイル | 生成対象 | 重要度 |
|-----------|---------|-------|
| `[page-name].md` | UIコンポーネント | ⭐⭐⭐ 最重要 |
| `refined-domain-language.md` | 型定義、Enum、定数 | ⭐⭐⭐ 最重要 |
| `api-specification.md` (Layer 2) | API実装 | ⭐⭐⭐ 最重要 |
| `database-design.md` (Layer 2) | データアクセス層 | ⭐⭐⭐ 最重要 |
| `ui-components.md` | 共通UIコンポーネント | ⭐⭐ 重要 |
| `business-components.md` | ビジネスロジック | ⭐⭐ 重要 |
| `usecase.md` | 統合テストシナリオ | ⭐ 参考 |

### MD解析のポイント

#### 1. 構造化されたテーブル

AI生成エンジンは、以下のテーブル構造を解析します:

```markdown
| プロパティ名 | 型 | 必須 | 説明 | バリデーション |
|-------------|----|----|------|---------------|
| projectName | string | ✅ | プロジェクト名 | 最大100文字 |
```

**解析結果**:
```typescript
interface CreateProjectRequest {
  projectName: string; // プロジェクト名（最大100文字）
}
```

#### 2. パラソルドメイン言語（3要素記法）

```markdown
プロジェクト [Project] [PROJECT]
```

**解析結果**:
```typescript
// Entity
export const PROJECT_ENTITY = "PROJECT";

export class Project {
  // ...
}

// UI Label
export const LABEL_PROJECT = "プロジェクト"; // 日本語
export const LABEL_PROJECT_EN = "Project"; // 英語
```

#### 3. APIリクエスト/レスポンス例

```markdown
### APIリクエスト例

\`\`\`json
{
  "projectName": "新しいプロジェクト",
  "startDate": "2025-11-01"
}
\`\`\`
```

**解析結果**:
```typescript
// 型定義が自動生成される
interface CreateProjectRequest {
  projectName: string;
  startDate: string; // ISO 8601 date
}

// バリデーションスキーマも自動生成
const createProjectSchema = z.object({
  projectName: z.string().max(100),
  startDate: z.string().datetime(),
});
```

---

## 生成されるコード

### フロントエンド（React + TypeScript）

#### 1. Pageコンポーネント

**入力**: `create-project-page.md`

**生成**: `src/pages/CreateProjectPage.tsx`

```typescript
// 自動生成コード
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '@/components/ProjectForm';
import { createProject } from '@/api/projects';
import { CreateProjectRequest } from '@/types/project';

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: CreateProjectRequest) => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await createProject(data);
      // 成功メッセージ表示（MDから取得）
      toast.success('プロジェクトを作成しました');
      navigate(`/projects/${result.id}`);
    } catch (error) {
      // エラーハンドリング（MDから取得）
      if (error.code === 'ERR_PRJ_001') {
        setErrors({ projectName: 'プロジェクト名は必須です' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-project-page">
      <h1>プロジェクト作成</h1>
      <ProjectForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errors={errors}
      />
    </div>
  );
};
```

#### 2. Formコンポーネント

**入力**: `create-project-page.md` のフォームフィールド定義

**生成**: `src/components/ProjectForm.tsx`

```typescript
// 自動生成コード
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema } from '@/schemas/project';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ProjectFormProps {
  onSubmit: (data: CreateProjectRequest) => void;
  isLoading: boolean;
  errors?: Record<string, string>;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isLoading,
  errors,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<CreateProjectRequest>({
    resolver: zodResolver(createProjectSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* プロジェクト名フィールド（MDから生成） */}
      <Input
        label="プロジェクト名"
        {...register('projectName')}
        error={errors?.projectName || formErrors.projectName?.message}
        required
        maxLength={100}
        placeholder="プロジェクト名を入力"
      />

      {/* 開始日フィールド（MDから生成） */}
      <Input
        label="開始日"
        type="date"
        {...register('startDate')}
        error={errors?.startDate || formErrors.startDate?.message}
        required
      />

      {/* ボタン（MDから生成） */}
      <div className="form-actions">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '保存'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          キャンセル
        </Button>
      </div>
    </form>
  );
};
```

#### 3. 型定義

**入力**: `refined-domain-language.md` + `api-specification.md`

**生成**: `src/types/project.ts`

```typescript
// 自動生成コード
/**
 * プロジェクト [Project] [PROJECT]
 * ビジネス目標を達成するための活動
 */
export interface Project {
  projectId: string; // プロジェクトID [PROJECT_ID]
  projectName: string; // プロジェクト名 [PROJECT_NAME]
  description?: string; // 説明 [DESCRIPTION]
  startDate: string; // 開始日 [START_DATE]
  endDate?: string; // 終了日 [END_DATE]
  status: ProjectStatus; // 状態 [STATUS]
  budget?: number; // 予算 [BUDGET]
  createdAt: string; // 作成日時 [CREATED_AT]
  updatedAt: string; // 更新日時 [UPDATED_AT]
}

/**
 * プロジェクト状態 [Project Status] [PROJECT_STATUS]
 */
export enum ProjectStatus {
  PLANNING = 'PLANNING', // 計画中
  IN_PROGRESS = 'IN_PROGRESS', // 進行中
  ON_HOLD = 'ON_HOLD', // 保留中
  COMPLETED = 'COMPLETED', // 完了
  CANCELLED = 'CANCELLED', // キャンセル
}

/**
 * プロジェクト作成リクエスト
 */
export interface CreateProjectRequest {
  projectName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
}

/**
 * プロジェクト作成レスポンス
 */
export interface CreateProjectResponse {
  success: boolean;
  data: Project;
}
```

#### 4. バリデーションスキーマ

**入力**: `create-project-page.md` のバリデーションルール

**生成**: `src/schemas/project.ts`

```typescript
// 自動生成コード
import { z } from 'zod';

export const createProjectSchema = z.object({
  projectName: z
    .string()
    .min(1, 'プロジェクト名は必須です') // ERR_PRJ_001
    .max(100, 'プロジェクト名は100文字以内で入力してください'), // ERR_PRJ_002

  description: z.string().optional(),

  startDate: z
    .string()
    .min(1, '開始日は必須です'), // ERR_PRJ_003

  endDate: z.string().optional(),

  budget: z
    .number()
    .nonnegative('予算は0以上の数値を入力してください') // ERR_PRJ_005
    .optional(),
}).refine(
  (data) => {
    if (data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  {
    message: '開始日は終了日より前である必要があります', // ERR_PRJ_004
    path: ['startDate'],
  }
);
```

### バックエンド（NestJS + TypeScript）

#### 1. Controller

**入力**: `api-specification.md`

**生成**: `src/modules/projects/projects.controller.ts`

```typescript
// 自動生成コード
import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectDto } from './dto';

@ApiTags('projects')
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'プロジェクト作成 [Create Project] [CREATE_PROJECT]' })
  @ApiResponse({ status: 201, description: 'プロジェクトを作成しました', type: ProjectDto })
  @ApiResponse({ status: 400, description: 'バリデーションエラー' })
  async create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectDto> {
    return this.projectsService.create(createProjectDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'プロジェクト取得 [Get Project] [GET_PROJECT]' })
  @ApiResponse({ status: 200, description: '成功', type: ProjectDto })
  @ApiResponse({ status: 404, description: 'プロジェクトが見つかりません' })
  async findOne(@Param('id') id: string): Promise<ProjectDto> {
    return this.projectsService.findOne(id);
  }

  // 他のエンドポイントも自動生成...
}
```

#### 2. Service

**入力**: `domain-language.md` + `api-specification.md`

**生成**: `src/modules/projects/projects.service.ts`

```typescript
// 自動生成コード
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectDto> {
    // ビジネスルール検証（MDから生成）
    await this.validateProjectName(createProjectDto.projectName);

    const project = await this.prisma.project.create({
      data: {
        projectName: createProjectDto.projectName,
        description: createProjectDto.description,
        startDate: new Date(createProjectDto.startDate),
        endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : null,
        status: 'PLANNING',
        budget: createProjectDto.budget,
      },
    });

    return this.mapToDto(project);
  }

  async findOne(id: string): Promise<ProjectDto> {
    const project = await this.prisma.project.findUnique({
      where: { projectId: id },
    });

    if (!project) {
      throw new NotFoundException('プロジェクトが見つかりません'); // ERR_SYS_003
    }

    return this.mapToDto(project);
  }

  // バリデーションメソッド（MDのビジネスルールから生成）
  private async validateProjectName(name: string): Promise<void> {
    const existing = await this.prisma.project.findFirst({
      where: { projectName: name },
    });

    if (existing) {
      throw new BadRequestException('このプロジェクトは既に存在します'); // ERR_SYS_004
    }
  }

  private mapToDto(project: any): ProjectDto {
    return {
      projectId: project.projectId,
      projectName: project.projectName,
      description: project.description,
      startDate: project.startDate.toISOString(),
      endDate: project.endDate?.toISOString(),
      status: project.status,
      budget: project.budget,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
```

#### 3. Prisma Schema

**入力**: `database-design.md` (Layer 2)

**生成**: `prisma/schema.prisma`

```prisma
// 自動生成コード

// プロジェクト [Project] [PROJECT]
model Project {
  projectId   String   @id @default(uuid()) @map("project_id")
  projectName String   @map("project_name") @db.VarChar(100)
  description String?  @db.Text
  startDate   DateTime @map("start_date") @db.Date
  endDate     DateTime? @map("end_date") @db.Date
  status      ProjectStatus @default(PLANNING)
  budget      Decimal?  @db.Decimal(15, 2)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  tasks       Task[]
  members     ProjectMember[]

  @@map("projects")
  @@index([projectName])
  @@index([status])
}

// プロジェクト状態 [Project Status] [PROJECT_STATUS]
enum ProjectStatus {
  PLANNING      // 計画中
  IN_PROGRESS   // 進行中
  ON_HOLD       // 保留中
  COMPLETED     // 完了
  CANCELLED     // キャンセル
}
```

### テストコード

#### 1. 単体テスト（Frontend）

**入力**: `create-project-page.md` のテストケース

**生成**: `src/pages/CreateProjectPage.test.tsx`

```typescript
// 自動生成コード
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateProjectPage } from './CreateProjectPage';
import { createProject } from '@/api/projects';

jest.mock('@/api/projects');

describe('CreateProjectPage', () => {
  // TC001: 正常系（MDから生成）
  it('should create project successfully', async () => {
    (createProject as jest.Mock).mockResolvedValue({
      id: 'test-id',
      projectName: 'テストプロジェクト',
    });

    render(<CreateProjectPage />);

    fireEvent.change(screen.getByLabelText('プロジェクト名'), {
      target: { value: 'テストプロジェクト' },
    });

    fireEvent.change(screen.getByLabelText('開始日'), {
      target: { value: '2025-11-01' },
    });

    fireEvent.click(screen.getByText('保存'));

    await waitFor(() => {
      expect(screen.getByText('プロジェクトを作成しました')).toBeInTheDocument();
    });
  });

  // TC101: バリデーションエラー（MDから生成）
  it('should show validation error when project name is empty', async () => {
    render(<CreateProjectPage />);

    fireEvent.click(screen.getByText('保存'));

    await waitFor(() => {
      expect(screen.getByText('プロジェクト名は必須です')).toBeInTheDocument();
    });
  });

  // 他のテストケースも自動生成...
});
```

#### 2. E2Eテスト

**入力**: `usecase.md` の基本フロー

**生成**: `e2e/create-project.spec.ts`

```typescript
// 自動生成コード
import { test, expect } from '@playwright/test';

test.describe('プロジェクト作成', () => {
  test('should create project from start to finish', async ({ page }) => {
    // Step 1: プロジェクト作成画面に移動
    await page.goto('/projects/new');
    await expect(page.getByRole('heading', { name: 'プロジェクト作成' })).toBeVisible();

    // Step 2: プロジェクト情報を入力
    await page.getByLabel('プロジェクト名').fill('E2Eテストプロジェクト');
    await page.getByLabel('開始日').fill('2025-11-01');
    await page.getByLabel('予算').fill('1000000');

    // Step 3: 保存ボタンをクリック
    await page.getByRole('button', { name: '保存' }).click();

    // Step 4: 成功メッセージを確認
    await expect(page.getByText('プロジェクトを作成しました')).toBeVisible();

    // Step 5: プロジェクト詳細画面に遷移
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+/);
    await expect(page.getByText('E2Eテストプロジェクト')).toBeVisible();
  });
});
```

---

## アーキテクチャベース生成

### アーキテクチャパターンの定義

AI生成は、事前定義された**アーキテクチャパターン**に従ってコードを生成します。

#### フロントエンド: Feature-Sliced Design

```
src/
├── app/                    # アプリケーション初期化
├── pages/                  # ページコンポーネント（自動生成）
├── features/               # 機能単位（自動生成）
│   └── projects/
│       ├── ui/             # UIコンポーネント
│       ├── api/            # API呼び出し
│       ├── model/          # 状態管理
│       └── lib/            # ユーティリティ
├── entities/               # ドメインエンティティ（自動生成）
│   └── project/
│       ├── model/          # 型定義
│       └── api/            # API
├── shared/                 # 共通コンポーネント（自動生成）
│   ├── ui/                 # UIコンポーネント
│   ├── lib/                # ユーティリティ
│   └── api/                # API基盤
└── widgets/                # 複合コンポーネント（自動生成）
```

#### バックエンド: Clean Architecture + DDD

```
src/
├── modules/                # ドメインモジュール（BC単位）
│   └── projects/           # Project BC（自動生成）
│       ├── domain/         # ドメイン層
│       │   ├── entities/   # エンティティ
│       │   ├── value-objects/ # 値オブジェクト
│       │   └── services/   # ドメインサービス
│       ├── application/    # アプリケーション層
│       │   ├── use-cases/  # ユースケース
│       │   └── dto/        # DTO
│       ├── infrastructure/ # インフラ層
│       │   ├── repositories/ # リポジトリ実装
│       │   └── adapters/   # アダプター
│       └── presentation/   # プレゼンテーション層
│           ├── controllers/ # コントローラー
│           └── middlewares/ # ミドルウェア
└── shared/                 # 共通基盤
    ├── domain/             # 共通ドメイン
    └── infrastructure/     # 共通インフラ
```

### レイヤー間の依存関係（自動適用）

AI生成時、以下の依存関係ルールが自動適用されます:

```
Presentation Layer (Controller)
        ↓ (依存)
Application Layer (Use Case)
        ↓ (依存)
Domain Layer (Entity, VO, Domain Service)
        ↑ (実装)
Infrastructure Layer (Repository, Adapter)
```

**ルール**:
- 内側のレイヤー（Domain）は外側のレイヤーに依存しない
- 外側のレイヤーは内側のレイヤーに依存できる
- Infrastructure層はDomain層のインターフェースを実装

---

## 生成ルールと規約

### 命名規約（自動適用）

AI生成時、パラソルドメイン言語から自動的に命名規約に従ったコードが生成されます。

| 対象 | 規約 | 例 |
|------|------|-----|
| クラス名 | PascalCase | `Project`, `CreateProjectDto` |
| インターフェース名 | PascalCase + I prefix (C#のみ) | `IProjectRepository` |
| 関数名 | camelCase | `createProject`, `findProjectById` |
| 定数 | UPPER_SNAKE_CASE | `MAX_PROJECT_NAME_LENGTH` |
| ファイル名 | kebab-case | `create-project-page.tsx` |
| データベーステーブル | snake_case | `projects`, `project_members` |
| データベースカラム | snake_case | `project_id`, `project_name` |

### パラソルドメイン言語からの命名生成

```markdown
プロジェクト [Project] [PROJECT]
```

**生成される名前**:

```typescript
// TypeScript
class Project {}                    // エンティティ
interface IProject {}               // インターフェース
type ProjectDto = {};               // DTO
const PROJECT_ENTITY = 'PROJECT';   // 定数
const projectRepository = {};       // 変数
```

```python
# Python
class Project:                      # エンティティ
    pass

class ProjectDto:                   # DTO
    pass

PROJECT_ENTITY = 'PROJECT'          # 定数
project_repository = {}             # 変数
```

```sql
-- SQL
CREATE TABLE projects (             -- テーブル
  project_id UUID PRIMARY KEY,      -- カラム
  project_name VARCHAR(100)
);
```

### コメント生成

すべての生成コードには、パラソルドメイン言語由来のコメントが自動付与されます:

```typescript
/**
 * プロジェクト [Project] [PROJECT]
 * ビジネス目標を達成するための活動
 *
 * Bounded Context: Project Management
 * Layer 2で定義
 */
export class Project {
  /**
   * プロジェクトID [Project ID] [PROJECT_ID]
   */
  projectId: string;

  /**
   * プロジェクト名 [Project Name] [PROJECT_NAME]
   * 最大100文字
   */
  projectName: string;
}
```

---

## テンプレートエンジン

### テンプレートの役割

AI生成は、**テンプレートエンジン**を使用してコードを生成します。

```
MDファイル（データ）
    +
テンプレート（構造）
    ↓
生成されたコード
```

### テンプレート例: Page Component

**テンプレート**: `templates/react-page.hbs`

```handlebars
// 自動生成コード - テンプレート: react-page.hbs
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { {{componentName}} } from '@/components/{{componentName}}';
import { {{apiFunction}} } from '@/api/{{apiModule}}';
import { {{requestType}} } from '@/types/{{typesModule}}';

export const {{pageName}}: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: {{requestType}}) => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await {{apiFunction}}(data);
      toast.success('{{successMessage}}');
      navigate('{{redirectPath}}');
    } catch (error) {
      {{#each errorCases}}
      if (error.code === '{{code}}') {
        setErrors({ {{field}}: '{{message}}' });
      }
      {{/each}}
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="{{pageClassName}}">
      <h1>{{pageTitle}}</h1>
      <{{componentName}}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errors={errors}
      />
    </div>
  );
};
```

**データ（MDから抽出）**:

```json
{
  "pageName": "CreateProjectPage",
  "componentName": "ProjectForm",
  "apiFunction": "createProject",
  "apiModule": "projects",
  "requestType": "CreateProjectRequest",
  "typesModule": "project",
  "successMessage": "プロジェクトを作成しました",
  "redirectPath": "/projects/${result.id}",
  "pageTitle": "プロジェクト作成",
  "pageClassName": "create-project-page",
  "errorCases": [
    {
      "code": "ERR_PRJ_001",
      "field": "projectName",
      "message": "プロジェクト名は必須です"
    }
  ]
}
```

---

## Claude API統合

### Claude API for Code Generation

パラソルワールドは、**Anthropic Claude API**を使用してコードを生成します。

#### 生成プロセス

```
1. MDファイルを読み込み
   ↓
2. Claude APIにプロンプト送信
   ├─ システムプロンプト: アーキテクチャルール、命名規約
   ├─ ユーザープロンプト: MD内容 + 生成指示
   └─ 例: "以下のPage定義からReactコンポーネントを生成してください"
   ↓
3. Claude APIからコード生成
   ↓
4. 生成コードを検証
   ↓
5. ファイルに書き込み
```

#### プロンプト例

**システムプロンプト**:

```
あなたは、パラソルワールドのAIコード生成エンジンです。

以下のルールに従ってコードを生成してください:

1. アーキテクチャ:
   - フロントエンド: Feature-Sliced Design
   - バックエンド: Clean Architecture + DDD

2. 命名規約:
   - クラス: PascalCase
   - 関数: camelCase
   - 定数: UPPER_SNAKE_CASE

3. パラソルドメイン言語:
   - 3要素記法 "日本語名 [英語名] [SYSTEM_NAME]" を解析
   - SYSTEM_NAMEを定数として使用

4. コメント:
   - すべてのクラス、関数にJSDocコメント
   - パラソルドメイン言語を含める

5. 型安全性:
   - TypeScript strict mode
   - すべての引数・戻り値に型定義

6. テスト:
   - MDのテストケースから単体テストを自動生成
```

**ユーザープロンプト**:

```
以下のPage定義MDファイルから、Reactコンポーネントを生成してください。

# Page定義MD
[MDファイルの内容を貼り付け]

生成対象:
1. src/pages/CreateProjectPage.tsx - Pageコンポーネント
2. src/components/ProjectForm.tsx - Formコンポーネント
3. src/types/project.ts - 型定義
4. src/schemas/project.ts - バリデーションスキーマ
5. src/pages/CreateProjectPage.test.tsx - 単体テスト

要件:
- Feature-Sliced Designに準拠
- React Hook Formを使用
- Zodでバリデーション
- エラーメッセージはMDから取得
```

#### Claude APIレスポンス

```json
{
  "files": [
    {
      "path": "src/pages/CreateProjectPage.tsx",
      "content": "// 生成されたコード..."
    },
    {
      "path": "src/components/ProjectForm.tsx",
      "content": "// 生成されたコード..."
    },
    ...
  ]
}
```

---

## 生成結果の検証

### 自動検証フロー

```
コード生成完了
    ↓
Lint実行（ESLint/Pylint）
    ↓
  ✅ 成功 → Format実行
  ❌ 失敗 → AI自動修正 → Lint再実行
    ↓
Format実行（Prettier/Black）
    ↓
型チェック（TypeScript/mypy）
    ↓
  ✅ 成功 → 単体テスト実行
  ❌ 失敗 → AI自動修正 → 型チェック再実行
    ↓
単体テスト実行
    ↓
  ✅ 成功 → 統合テスト実行
  ❌ 失敗 → AI自動修正（詳細は次のドキュメント）
```

### 検証ツール

| 検証項目 | ツール | 目的 |
|---------|-------|------|
| Lint | ESLint, Pylint | コード品質 |
| Format | Prettier, Black | コードフォーマット |
| 型チェック | TypeScript, mypy | 型安全性 |
| 単体テスト | Jest, Vitest, Pytest | 機能の正確性 |
| 統合テスト | Jest, Pytest | コンポーネント間連携 |
| E2Eテスト | Playwright, Cypress | エンドツーエンド |

---

## トラブルシューティング

### よくある生成エラーと対処法

#### エラー1: パラソルドメイン言語の解析失敗

**症状**:
```
Error: Cannot parse domain language: "プロジェクト Project [PROJECT]"
```

**原因**: 3要素記法が正しくない

**対処法**:
```markdown
❌ プロジェクト Project [PROJECT]
✅ プロジェクト [Project] [PROJECT]
```

#### エラー2: APIリクエスト例のJSON形式エラー

**症状**:
```
Error: Invalid JSON in API request example
```

**原因**: JSON形式が不正

**対処法**:
````markdown
✅ 正しい記述:

```json
{
  "projectName": "新しいプロジェクト",
  "startDate": "2025-11-01"
}
```
````

#### エラー3: バリデーションルールが曖昧

**症状**: 生成されたバリデーションコードが期待と異なる

**対処法**: MDで明確に定義

```markdown
❌ 曖昧:
- プロジェクト名は適切な長さ

✅ 明確:
- プロジェクト名: 最小1文字、最大100文字
```

---

## まとめ

### AI生成の成功要因

1. **明確なMD定義**
   - 構造化されたテーブル
   - 具体的なバリデーションルール
   - 明確なエラーメッセージ

2. **パラソルドメイン言語の一貫性**
   - 3要素記法の厳守
   - Layer間での整合性

3. **アーキテクチャ遵守**
   - 事前定義されたパターンに従う
   - レイヤー間の依存関係ルール

4. **継続的フィードバック**
   - テスト結果からの自動補正
   - 設計へのフィードバック

---

## 🔗 関連ドキュメント

- [パラソルワールド - 概要](./parasol-world-overview.md)
- [パラソルAI自動テストと補正](./parasol-ai-auto-testing.md)
- [Layer 3: パラソル開発設計](./parasol-v3-layer3-development-design.md)
- [ドメイン言語進化プロセス](./parasol-v3-domain-language-evolution.md)

---

**作成日**: 2025-11-01
**最終更新**: 2025-11-01
**バージョン**: 1.0.0
