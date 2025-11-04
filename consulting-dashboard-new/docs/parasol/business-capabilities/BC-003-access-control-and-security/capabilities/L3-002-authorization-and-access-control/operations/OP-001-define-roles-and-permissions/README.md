# OP-001: ロールと権限を定義する

**作成日**: 2025-10-31
**所属L3**: L3-002-authorization-and-access-control: Authorization And Access Control
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/control-access-permissions/operations/define-roles-and-permissions

---

## 📋 How: この操作の定義

### 操作の概要
ロールと権限を定義するを実行し、ビジネス価値を創出する。

### 実現する機能
- ロールと権限を定義するに必要な情報の入力と検証
- ロールと権限を定義するプロセスの実行と進捗管理
- 結果の記録と関係者への通知
- 監査証跡の記録

### 入力
- 操作実行に必要なビジネス情報
- 実行者の認証情報と権限
- 関連エンティティの参照情報

### 出力
- 操作結果（成功/失敗）
- 更新されたエンティティ情報
- 監査ログと履歴情報
- 次のアクションへのガイダンス

---

## 📥 入力パラメータ

### ロール定義リクエスト
**説明**: 新しいロールを定義する際に必要な入力パラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| roleName | STRING_100 | ○ | ロール名（一意） | 英数字とハイフン、3-100文字 |
| displayName | STRING_100 | ○ | 表示名 | 1-100文字 |
| description | TEXT | ○ | ロールの説明 | 最大1000文字 |
| organizationId | UUID | ○ | 所属組織ID | 有効なUUID形式 |
| parentRoleId | UUID | × | 親ロールID（階層構造） | 有効なUUID形式 |
| roleType | ENUM | ○ | ロール種別 | ['SYSTEM', 'ORGANIZATION', 'CUSTOM'] |
| level | INTEGER | ○ | ロールレベル（階層深度） | 1-10 |
| isActive | BOOLEAN | ○ | 有効/無効 | デフォルト: true |
| maxUsers | INTEGER | × | 最大ユーザー数制限 | 1-10000、無制限: null |

### 権限定義リクエスト
**説明**: 新しい権限を定義する際のパラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| permissionName | STRING_100 | ○ | 権限名（一意） | 英数字とハイフン、3-100文字 |
| displayName | STRING_100 | ○ | 表示名 | 1-100文字 |
| description | TEXT | ○ | 権限の説明 | 最大1000文字 |
| resource | STRING_100 | ○ | 対象リソース | 'users', 'projects', 'documents'等 |
| action | ENUM | ○ | アクション種別 | ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXECUTE'] |
| scope | ENUM | ○ | スコープ | ['GLOBAL', 'ORGANIZATION', 'PROJECT', 'PERSONAL'] |
| category | STRING_50 | ○ | カテゴリ | 'user_management', 'content_access'等 |
| riskLevel | ENUM | ○ | リスクレベル | ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] |
| requiresMfa | BOOLEAN | ○ | MFA必須 | デフォルト: false |

### ロール・権限割当リクエスト
**説明**: ロールに権限を割り当てる際のパラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| roleId | UUID | ○ | ロールID | 有効なUUID形式 |
| permissionIds | ARRAY<UUID> | ○ | 権限ID配列 | UUID配列、最大500個 |
| assignedBy | UUID | ○ | 割当実行者ID | 有効なUUID形式 |
| effectiveFrom | TIMESTAMP | × | 有効開始日時 | ISO8601形式、デフォルト: now |
| effectiveUntil | TIMESTAMP | × | 有効終了日時 | ISO8601形式、開始日時より後 |
| conditions | JSON | × | 条件付与（時間帯制限等） | JSONスキーマ検証 |

### ロールテンプレート作成リクエスト
**説明**: 再利用可能なロールテンプレートを作成

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| templateName | STRING_100 | ○ | テンプレート名 | 3-100文字 |
| description | TEXT | ○ | テンプレートの説明 | 最大1000文字 |
| baseRoleId | UUID | ○ | ベースロールID | 有効なUUID形式 |
| includedPermissions | ARRAY<UUID> | ○ | 含まれる権限ID配列 | UUID配列 |
| category | STRING_50 | ○ | カテゴリ | 'consultant', 'manager', 'admin'等 |
| isPublic | BOOLEAN | ○ | 公開/非公開 | デフォルト: false |

---

## 📤 出力仕様

### ロール定義成功レスポンス
**HTTPステータス**: 201 Created

```json
{
  "success": true,
  "data": {
    "roleId": "uuid-v4",
    "roleName": "project-manager",
    "displayName": "プロジェクトマネージャー",
    "description": "プロジェクト全体を管理し、チームをリードする権限",
    "organizationId": "uuid-v4",
    "parentRoleId": "uuid-v4",
    "roleType": "ORGANIZATION",
    "level": 2,
    "hierarchy": ["executive", "project-manager"],
    "isActive": true,
    "maxUsers": 50,
    "assignedUsers": 0,
    "assignedPermissions": [],
    "createdAt": "2025-11-04T11:00:00Z",
    "createdBy": "uuid-v4",
    "updatedAt": "2025-11-04T11:00:00Z"
  },
  "message": "ロール 'プロジェクトマネージャー' が正常に作成されました。",
  "nextAction": {
    "action": "ASSIGN_PERMISSIONS",
    "endpoint": "/api/roles/{roleId}/permissions",
    "suggestedPermissions": ["project.read", "project.update", "team.manage"]
  }
}
```

### 権限定義成功レスポンス
**HTTPステータス**: 201 Created

```json
{
  "success": true,
  "data": {
    "permissionId": "uuid-v4",
    "permissionName": "project.update",
    "displayName": "プロジェクト更新",
    "description": "プロジェクト情報の更新権限",
    "resource": "projects",
    "action": "UPDATE",
    "scope": "PROJECT",
    "category": "project_management",
    "riskLevel": "MEDIUM",
    "requiresMfa": false,
    "effectiveRoles": 0,
    "affectedUsers": 0,
    "createdAt": "2025-11-04T11:05:00Z",
    "createdBy": "uuid-v4"
  },
  "message": "権限 'プロジェクト更新' が正常に定義されました。",
  "warning": "この権限をロールに割り当てるまで有効になりません。"
}
```

### ロール・権限割当成功レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "roleId": "uuid-v4",
    "roleName": "project-manager",
    "assignedPermissions": [
      {
        "permissionId": "uuid-v4",
        "permissionName": "project.update",
        "assignedAt": "2025-11-04T11:10:00Z",
        "effectiveFrom": "2025-11-04T11:10:00Z",
        "effectiveUntil": null
      },
      {
        "permissionId": "uuid-v4",
        "permissionName": "team.manage",
        "assignedAt": "2025-11-04T11:10:00Z",
        "effectiveFrom": "2025-11-04T11:10:00Z",
        "effectiveUntil": null
      }
    ],
    "totalPermissions": 2,
    "affectedUsers": 15,
    "assignedBy": "uuid-v4",
    "assignedAt": "2025-11-04T11:10:00Z"
  },
  "message": "2件の権限がロール 'プロジェクトマネージャー' に割り当てられました。",
  "impact": {
    "affectedUsers": 15,
    "notificationsSent": 15,
    "auditLogsCreated": 17
  }
}
```

### ロールテンプレート作成成功レスポンス
**HTTPステータス**: 201 Created

```json
{
  "success": true,
  "data": {
    "templateId": "uuid-v4",
    "templateName": "consultant-standard",
    "description": "標準コンサルタント権限セット",
    "baseRoleId": "uuid-v4",
    "includedPermissions": [
      "uuid-1", "uuid-2", "uuid-3", "uuid-4", "uuid-5"
    ],
    "permissionCount": 5,
    "category": "consultant",
    "isPublic": true,
    "usageCount": 0,
    "createdAt": "2025-11-04T11:15:00Z",
    "createdBy": "uuid-v4"
  },
  "message": "ロールテンプレート 'consultant-standard' が作成されました。",
  "usage": "このテンプレートから新しいロールを作成できます。"
}
```

### エンティティ状態変更
**操作対象エンティティ**: Role, Permission, RolePermission

#### Role エンティティ作成
```typescript
{
  id: "uuid-v4",
  roleName: "project-manager",
  displayName: "プロジェクトマネージャー",
  description: "プロジェクト全体を管理し、チームをリードする権限",
  organizationId: "uuid-v4",
  parentRoleId: "uuid-v4",
  roleType: "ORGANIZATION",
  level: 2,
  isActive: true,
  maxUsers: 50,
  assignedUsers: 0,
  createdAt: "2025-11-04T11:00:00Z",
  createdBy: "uuid-v4",
  updatedAt: "2025-11-04T11:00:00Z"
}
```

#### Permission エンティティ作成
```typescript
{
  id: "uuid-v4",
  permissionName: "project.update",
  displayName: "プロジェクト更新",
  description: "プロジェクト情報の更新権限",
  resource: "projects",
  action: "UPDATE",
  scope: "PROJECT",
  category: "project_management",
  riskLevel: "MEDIUM",
  requiresMfa: false,
  createdAt: "2025-11-04T11:05:00Z",
  createdBy: "uuid-v4"
}
```

#### RolePermission エンティティ作成（関連テーブル）
```typescript
{
  id: "uuid-v4",
  roleId: "uuid-v4",
  permissionId: "uuid-v4",
  assignedBy: "uuid-v4",
  assignedAt: "2025-11-04T11:10:00Z",
  effectiveFrom: "2025-11-04T11:10:00Z",
  effectiveUntil: null,
  conditions: null
}
```

---

## 🛠️ 実装ガイダンス

### ロール階層構造の実装

#### RBAC階層モデル
```typescript
interface RoleHierarchy {
  id: string;
  roleName: string;
  level: number;
  parentRoleId: string | null;
  children: RoleHierarchy[];
  permissions: Permission[];
  inheritedPermissions: Permission[];
}

// ロール階層の構築
async function buildRoleHierarchy(roleId: string): Promise<RoleHierarchy> {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: true,
      parentRole: true,
      childRoles: true
    }
  });

  if (!role) throw new Error('Role not found');

  // 親ロールから権限を継承
  const inheritedPermissions = role.parentRole
    ? await getInheritedPermissions(role.parentRoleId)
    : [];

  return {
    id: role.id,
    roleName: role.roleName,
    level: role.level,
    parentRoleId: role.parentRoleId,
    children: await Promise.all(
      role.childRoles.map(child => buildRoleHierarchy(child.id))
    ),
    permissions: role.permissions,
    inheritedPermissions
  };
}

// 権限継承の実装
async function getInheritedPermissions(roleId: string): Promise<Permission[]> {
  const permissions: Permission[] = [];
  let currentRoleId = roleId;

  while (currentRoleId) {
    const role = await prisma.role.findUnique({
      where: { id: currentRoleId },
      include: { permissions: true, parentRole: true }
    });

    if (!role) break;

    permissions.push(...role.permissions);
    currentRoleId = role.parentRoleId;
  }

  // 重複を除去
  return Array.from(
    new Map(permissions.map(p => [p.id, p])).values()
  );
}
```

### 権限命名規則の実装

#### リソース.アクション形式
```typescript
const PERMISSION_NAMING_CONVENTION = {
  pattern: /^[a-z][a-z0-9_]*\.(create|read|update|delete|execute|manage|admin)$/,
  examples: [
    'project.create',      // プロジェクト作成
    'project.read',        // プロジェクト参照
    'project.update',      // プロジェクト更新
    'project.delete',      // プロジェクト削除
    'project.manage',      // プロジェクト管理（CRUD全て）
    'user.admin',          // ユーザー管理者権限
    'document.read',       // ドキュメント参照
    'timesheet.approve'    // タイムシート承認
  ]
};

// 権限名のバリデーション
function validatePermissionName(permissionName: string): boolean {
  if (!PERMISSION_NAMING_CONVENTION.pattern.test(permissionName)) {
    throw new Error(
      'Permission name must follow pattern: resource.action (e.g., project.read)'
    );
  }

  const [resource, action] = permissionName.split('.');

  if (!isValidResource(resource)) {
    throw new Error(`Invalid resource: ${resource}`);
  }

  if (!isValidAction(action)) {
    throw new Error(`Invalid action: ${action}`);
  }

  return true;
}
```

### RBAC権限チェックの実装

#### 権限検証ミドルウェア
```typescript
import { Request, Response, NextFunction } from 'express';

// 権限チェックミドルウェア
function requirePermission(...requiredPermissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'E-RBAC-1001',
          message: 'Unauthorized'
        }
      });
    }

    try {
      // ユーザーの全権限を取得（ロール継承含む）
      const userPermissions = await getUserPermissions(userId);

      // 必要な権限をすべて持っているか確認
      const hasPermission = requiredPermissions.every(required =>
        userPermissions.some(p => p.permissionName === required)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'E-RBAC-2001',
            message: 'Insufficient permissions',
            details: `Required permissions: ${requiredPermissions.join(', ')}`
          }
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'E-RBAC-5001',
          message: 'Permission check failed'
        }
      });
    }
  };
}

// 使用例
app.put(
  '/api/projects/:id',
  requirePermission('project.update'),
  updateProject
);

app.delete(
  '/api/users/:id',
  requirePermission('user.delete', 'user.admin'),
  deleteUser
);
```

### ロールベース認可ポリシーの実装

#### ポリシー定義
```typescript
interface AuthorizationPolicy {
  resource: string;
  actions: string[];
  conditions?: PolicyCondition[];
  effect: 'ALLOW' | 'DENY';
}

interface PolicyCondition {
  type: 'TIME_RANGE' | 'IP_WHITELIST' | 'MFA_REQUIRED' | 'RESOURCE_OWNER';
  value: any;
}

const PROJECT_MANAGER_POLICY: AuthorizationPolicy[] = [
  {
    resource: 'projects',
    actions: ['create', 'read', 'update'],
    effect: 'ALLOW'
  },
  {
    resource: 'projects',
    actions: ['delete'],
    conditions: [
      { type: 'MFA_REQUIRED', value: true },
      { type: 'RESOURCE_OWNER', value: true }
    ],
    effect: 'ALLOW'
  },
  {
    resource: 'users',
    actions: ['read'],
    effect: 'ALLOW'
  },
  {
    resource: 'users',
    actions: ['create', 'update', 'delete'],
    effect: 'DENY' // プロジェクトマネージャーはユーザー管理不可
  }
];

// ポリシー評価
async function evaluatePolicy(
  user: User,
  resource: string,
  action: string,
  context: PolicyContext
): Promise<boolean> {
  const policies = await getUserPolicies(user.id);

  for (const policy of policies) {
    if (policy.resource !== resource) continue;
    if (!policy.actions.includes(action)) continue;

    // 条件評価
    if (policy.conditions) {
      const conditionsMet = await evaluateConditions(
        policy.conditions,
        user,
        context
      );
      if (!conditionsMet) continue;
    }

    // DENYが優先
    if (policy.effect === 'DENY') return false;
    if (policy.effect === 'ALLOW') return true;
  }

  return false; // デフォルト: 拒否
}
```

### ロールテンプレートシステムの実装

#### テンプレートからロール作成
```typescript
interface RoleTemplate {
  id: string;
  templateName: string;
  description: string;
  baseRoleId: string;
  includedPermissions: string[];
  category: string;
  isPublic: boolean;
}

async function createRoleFromTemplate(
  templateId: string,
  customization: Partial<Role>
): Promise<Role> {
  const template = await prisma.roleTemplate.findUnique({
    where: { id: templateId },
    include: {
      baseRole: true,
      permissions: true
    }
  });

  if (!template) {
    throw new Error('Template not found');
  }

  // テンプレートからロール作成
  const newRole = await prisma.role.create({
    data: {
      roleName: customization.roleName || `${template.templateName}-${Date.now()}`,
      displayName: customization.displayName || template.description,
      description: customization.description || template.description,
      organizationId: customization.organizationId,
      parentRoleId: template.baseRoleId,
      roleType: 'CUSTOM',
      level: template.baseRole.level + 1,
      isActive: true
    }
  });

  // 権限を一括割当
  await prisma.rolePermission.createMany({
    data: template.permissions.map(permission => ({
      roleId: newRole.id,
      permissionId: permission.id,
      assignedBy: customization.createdBy,
      assignedAt: new Date(),
      effectiveFrom: new Date()
    }))
  });

  // テンプレート使用回数を更新
  await prisma.roleTemplate.update({
    where: { id: templateId },
    data: { usageCount: { increment: 1 } }
  });

  return newRole;
}

// 標準テンプレートの定義
const STANDARD_TEMPLATES: RoleTemplate[] = [
  {
    templateName: 'consultant-standard',
    description: '標準コンサルタント権限セット',
    category: 'consultant',
    includedPermissions: [
      'project.read',
      'task.create',
      'task.update',
      'timesheet.create',
      'document.read',
      'knowledge.read',
      'knowledge.create'
    ]
  },
  {
    templateName: 'manager-standard',
    description: '標準マネージャー権限セット',
    category: 'manager',
    includedPermissions: [
      'project.read',
      'project.update',
      'task.manage',
      'team.read',
      'team.manage',
      'timesheet.approve',
      'report.read',
      'budget.read'
    ]
  },
  {
    templateName: 'admin-standard',
    description: '標準管理者権限セット',
    category: 'admin',
    includedPermissions: [
      'user.admin',
      'role.admin',
      'permission.admin',
      'organization.admin',
      'system.admin'
    ]
  }
];
```

### 権限の動的評価システム

#### コンテキストベース権限チェック
```typescript
interface PermissionContext {
  userId: string;
  resource: string;
  resourceId: string;
  action: string;
  organizationId?: string;
  projectId?: string;
  ipAddress?: string;
  mfaVerified: boolean;
  timestamp: Date;
}

async function checkPermissionWithContext(
  context: PermissionContext
): Promise<{authorized: boolean, reason?: string}> {

  // 1. 基本権限チェック
  const hasBasicPermission = await hasPermission(
    context.userId,
    `${context.resource}.${context.action}`
  );

  if (!hasBasicPermission) {
    return {
      authorized: false,
      reason: 'User does not have the required permission'
    };
  }

  // 2. スコープチェック
  const scopeValid = await validatePermissionScope(context);
  if (!scopeValid) {
    return {
      authorized: false,
      reason: 'Permission scope does not cover this resource'
    };
  }

  // 3. MFA要件チェック
  const permission = await getPermission(`${context.resource}.${context.action}`);
  if (permission.requiresMfa && !context.mfaVerified) {
    return {
      authorized: false,
      reason: 'MFA verification required for this operation'
    };
  }

  // 4. 時間帯制限チェック
  const timeRestriction = await getTimeRestriction(context.userId, permission.id);
  if (timeRestriction && !isWithinTimeRange(context.timestamp, timeRestriction)) {
    return {
      authorized: false,
      reason: 'Operation not allowed at this time'
    };
  }

  // 5. IPアドレス制限チェック
  const ipWhitelist = await getIpWhitelist(context.organizationId);
  if (ipWhitelist && !ipWhitelist.includes(context.ipAddress)) {
    return {
      authorized: false,
      reason: 'Operation not allowed from this IP address'
    };
  }

  return { authorized: true };
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### ロール定義エラー (E-RBAC-1xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-RBAC-1001 | 400 | Role name already exists | ロール名が重複 | 異なるロール名を指定 |
| E-RBAC-1002 | 400 | Invalid role name format | ロール名の形式が不正 | 英数字とハイフン、3-100文字で指定 |
| E-RBAC-1003 | 400 | Invalid parent role | 親ロールが存在しない | 有効な親ロールIDを指定 |
| E-RBAC-1004 | 400 | Circular role hierarchy | ロール階層に循環参照 | 階層構造を見直し |
| E-RBAC-1005 | 400 | Role level out of range | ロールレベルが範囲外 | 1-10の範囲で指定 |
| E-RBAC-1006 | 403 | Insufficient permissions | ロール作成権限なし | role.admin権限が必要 |
| E-RBAC-1007 | 500 | Failed to create role | ロール作成処理失敗 | 再試行、失敗時はサポートに連絡 |

#### 権限定義エラー (E-RBAC-2xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-RBAC-2001 | 400 | Permission name already exists | 権限名が重複 | 異なる権限名を指定 |
| E-RBAC-2002 | 400 | Invalid permission name format | 権限名の形式が不正 | resource.action形式で指定 |
| E-RBAC-2003 | 400 | Invalid resource | 無効なリソース名 | 有効なリソース名を指定 |
| E-RBAC-2004 | 400 | Invalid action | 無効なアクション | 有効なアクションを指定 |
| E-RBAC-2005 | 400 | Invalid scope | 無効なスコープ | GLOBAL/ORGANIZATION/PROJECT/PERSONALから選択 |
| E-RBAC-2006 | 403 | Insufficient permissions | 権限定義権限なし | permission.admin権限が必要 |
| E-RBAC-2007 | 500 | Failed to create permission | 権限作成処理失敗 | 再試行、失敗時はサポートに連絡 |

#### ロール・権限割当エラー (E-RBAC-3xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-RBAC-3001 | 404 | Role not found | ロールが存在しない | 有効なロールIDを指定 |
| E-RBAC-3002 | 404 | Permission not found | 権限が存在しない | 有効な権限IDを指定 |
| E-RBAC-3003 | 400 | Permission already assigned | 権限が既に割当済み | 重複割当は不要 |
| E-RBAC-3004 | 400 | Too many permissions | 権限数が上限超過 | 最大500個まで |
| E-RBAC-3005 | 400 | Invalid effective date range | 有効期限が不正 | 開始日時 < 終了日時 |
| E-RBAC-3006 | 403 | Insufficient permissions | 権限割当権限なし | role.manage権限が必要 |
| E-RBAC-3007 | 409 | Conflicting permissions | 矛盾する権限の組合せ | 権限の組合せを見直し |
| E-RBAC-3008 | 500 | Failed to assign permissions | 権限割当処理失敗 | 再試行、失敗時はサポートに連絡 |

#### ロールテンプレートエラー (E-RBAC-4xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-RBAC-4001 | 404 | Template not found | テンプレートが存在しない | 有効なテンプレートIDを指定 |
| E-RBAC-4002 | 400 | Template name already exists | テンプレート名が重複 | 異なるテンプレート名を指定 |
| E-RBAC-4003 | 400 | Invalid base role | ベースロールが無効 | 有効なベースロールを指定 |
| E-RBAC-4004 | 403 | Template not accessible | テンプレートにアクセス権なし | 公開テンプレートまたは自組織のテンプレートを使用 |
| E-RBAC-4005 | 500 | Failed to create from template | テンプレートからの作成失敗 | 再試行、失敗時はサポートに連絡 |

### エラーレスポンス形式

#### 標準エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "E-RBAC-1001",
    "message": "Role name already exists",
    "details": "ロール名 'project-manager' は既に存在します。",
    "timestamp": "2025-11-04T11:20:00Z",
    "requestId": "uuid-v4"
  },
  "troubleshooting": {
    "possibleCauses": [
      "同じ組織内に同名のロールが既に存在",
      "削除されたロールの名前を再利用しようとしている"
    ],
    "suggestedActions": [
      "異なるロール名を使用",
      "既存のロールを確認して削除または名前変更"
    ]
  }
}
```

### エラー処理フロー

#### ロール階層循環参照チェック
```typescript
async function detectCircularHierarchy(
  roleId: string,
  parentRoleId: string
): Promise<boolean> {
  const visited = new Set<string>();
  let currentRoleId = parentRoleId;

  while (currentRoleId) {
    if (visited.has(currentRoleId)) {
      return true; // 循環参照検出
    }

    if (currentRoleId === roleId) {
      return true; // 自分自身を親にしようとしている
    }

    visited.add(currentRoleId);

    const parentRole = await prisma.role.findUnique({
      where: { id: currentRoleId }
    });

    if (!parentRole) break;
    currentRoleId = parentRole.parentRoleId;
  }

  return false; // 循環参照なし
}
```

### 監査ログ記録

#### RBAC関連イベントの監査ログ
```typescript
// ロール作成
await auditLog.record({
  eventType: 'ROLE_CREATED',
  roleId: role.id,
  roleName: role.roleName,
  organizationId: role.organizationId,
  createdBy: userId,
  timestamp: new Date()
});

// 権限定義
await auditLog.record({
  eventType: 'PERMISSION_CREATED',
  permissionId: permission.id,
  permissionName: permission.permissionName,
  resource: permission.resource,
  action: permission.action,
  riskLevel: permission.riskLevel,
  createdBy: userId,
  timestamp: new Date()
});

// ロール・権限割当
await auditLog.record({
  eventType: 'PERMISSIONS_ASSIGNED_TO_ROLE',
  roleId: role.id,
  permissionIds: assignedPermissions.map(p => p.id),
  assignedBy: userId,
  affectedUsers: affectedUsers.length,
  timestamp: new Date()
});
```

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

この操作に関連するドメインエンティティ、値オブジェクト、集約の詳細定義は、上記ドメインモデルドキュメントを参照してください。

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

この操作を実現するAPIエンドポイント、リクエスト/レスポンス形式、認証・認可要件は、上記API仕様ドキュメントを参照してください。

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

この操作が扱うデータ構造、永続化要件、データ整合性制約は、上記データモデルドキュメントを参照してください。

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

> **注記**: ユースケースは Phase 4 の実装フェーズで、V2構造から段階的に移行・作成されます。
> 
> **Phase 3 (現在)**: Operation構造とREADME作成
> **Phase 4 (次)**: UseCase定義とページ定義の移行
> **Phase 5**: API実装とテストコード

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/secure-access-service/capabilities/control-access-permissions/operations/define-roles-and-permissions/](../../../../../../services/secure-access-service/capabilities/control-access-permissions/operations/define-roles-and-permissions/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
