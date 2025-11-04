# OP-002: 権限を付与し管理する

**作成日**: 2025-10-31
**所属L3**: L3-002-authorization-and-access-control: Authorization And Access Control
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/control-access-permissions/operations/grant-and-manage-permissions

---

## 📋 How: この操作の定義

### 操作の概要
権限を付与し管理するを実行し、ビジネス価値を創出する。

### 実現する機能
- 権限を付与し管理するに必要な情報の入力と検証
- 権限を付与し管理するプロセスの実行と進捗管理
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

### 権限付与リクエスト
**説明**: ユーザーまたはロールに権限を付与する際に必要な入力パラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| subjectType | ENUM | ○ | 付与対象タイプ (USER, ROLE, GROUP) | ['USER', 'ROLE', 'GROUP'] |
| subjectId | UUID | ○ | 付与対象ID | 有効なUUID形式 |
| resourceType | ENUM | ○ | リソースタイプ (PROJECT, DOCUMENT, SYSTEM) | BC-007統合リソース型 |
| resourceId | UUID | ○ | リソースID | 有効なUUID形式 |
| permissions | ARRAY<ENUM> | ○ | 付与する権限配列 | ['READ', 'WRITE', 'DELETE', 'ADMIN']の配列 |
| scope | ENUM | × | 権限スコープ | ['RESOURCE', 'DESCENDANT', 'GLOBAL'] デフォルト: RESOURCE |
| expiresAt | TIMESTAMP | × | 権限有効期限 | ISO8601形式、未来の日時 |
| grantedBy | UUID | ○ | 付与者ユーザーID | 有効なUUID形式 |
| reason | TEXT | × | 付与理由 | 最大500文字 |
| notifyUser | BOOLEAN | × | ユーザー通知フラグ | デフォルト: true |
| auditMetadata | OBJECT | × | 監査メタデータ | IP、デバイス情報等 |

### 一括権限付与リクエスト
**説明**: 複数のユーザー/ロールに一括で権限を付与

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| grants | ARRAY<GrantRequest> | ○ | 付与リクエスト配列 | 1-100件 |
| applyMode | ENUM | ○ | 適用モード | ['ADDITIVE', 'REPLACE', 'MERGE'] |
| rollbackOnError | BOOLEAN | × | エラー時ロールバック | デフォルト: true |
| dryRun | BOOLEAN | × | ドライラン実行 | デフォルト: false |

### 権限継承設定リクエスト
**説明**: リソース階層における権限継承を設定

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| resourceId | UUID | ○ | リソースID | 有効なUUID形式 |
| inheritFromParent | BOOLEAN | ○ | 親からの継承有効化 | - |
| propagateToChildren | BOOLEAN | ○ | 子への伝播有効化 | - |
| overrideMode | ENUM | ○ | 上書きモード | ['DENY_OVERRIDE', 'ALLOW_OVERRIDE'] |
| inheritablePermissions | ARRAY<ENUM> | × | 継承可能権限 | 権限配列 |

### 権限取り消しリクエスト
**説明**: 付与された権限を取り消す

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| permissionId | UUID | ○ | 権限レコードID | 有効なUUID形式 |
| revokedBy | UUID | ○ | 取り消し実行者ID | 有効なUUID形式 |
| reason | TEXT | ○ | 取り消し理由 | 必須、最大500文字 |
| immediateRevoke | BOOLEAN | × | 即時取り消し | デフォルト: true, false時は猶予期間適用 |
| gracePeriodHours | INTEGER | × | 猶予期間（時間） | 0-72時間 |
| notifyUser | BOOLEAN | × | ユーザー通知 | デフォルト: true |

### 権限検索・フィルターリクエスト
**説明**: 既存の権限を検索・フィルター

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| subjectId | UUID | × | 付与対象ID | UUID形式 |
| resourceId | UUID | × | リソースID | UUID形式 |
| permissionType | ENUM | × | 権限タイプフィルター | 権限配列 |
| includeInherited | BOOLEAN | × | 継承権限を含む | デフォルト: true |
| includeExpired | BOOLEAN | × | 期限切れを含む | デフォルト: false |
| sortBy | ENUM | × | ソート順 | ['GRANTED_AT', 'EXPIRES_AT', 'PERMISSION_TYPE'] |
| page | INTEGER | × | ページ番号 | デフォルト: 1 |
| limit | INTEGER | × | 取得件数 | デフォルト: 20, 最大: 100 |

---

## 📤 出力仕様

### 権限付与成功レスポンス
**HTTPステータス**: 201 Created

```json
{
  "success": true,
  "data": {
    "permissionId": "uuid-v4",
    "subjectType": "USER",
    "subjectId": "user-uuid",
    "subjectName": "田中太郎",
    "resourceType": "PROJECT",
    "resourceId": "project-uuid",
    "resourceName": "DXプロジェクト2025",
    "permissions": ["READ", "WRITE"],
    "scope": "RESOURCE",
    "grantedBy": "admin-uuid",
    "grantedByName": "管理者 花子",
    "grantedAt": "2025-11-04T10:00:00Z",
    "expiresAt": "2025-12-31T23:59:59Z",
    "status": "ACTIVE",
    "effectivePermissions": {
      "direct": ["READ", "WRITE"],
      "inherited": ["READ"],
      "effective": ["READ", "WRITE"]
    },
    "inheritanceChain": [
      {
        "level": 1,
        "resourceId": "org-uuid",
        "resourceName": "組織ルート",
        "permissions": ["READ"]
      }
    ]
  },
  "message": "権限が正常に付与されました。",
  "notifications": {
    "emailSent": true,
    "notificationCreated": true,
    "bc007Integration": {
      "notificationId": "notif-uuid",
      "deliveryStatus": "SENT"
    }
  }
}
```

### 一括権限付与成功レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "batchId": "batch-uuid",
    "totalRequests": 50,
    "successful": 48,
    "failed": 2,
    "results": [
      {
        "index": 0,
        "status": "SUCCESS",
        "permissionId": "perm-uuid-1",
        "subjectId": "user-uuid-1"
      },
      {
        "index": 15,
        "status": "FAILED",
        "subjectId": "user-uuid-15",
        "error": {
          "code": "E-PERM-2003",
          "message": "Permission already exists"
        }
      }
    ],
    "executionTime": 1250,
    "rollbackApplied": false
  },
  "summary": {
    "grantsCreated": 48,
    "duplicatesSkipped": 2,
    "conflictsResolved": 0
  },
  "message": "一括権限付与が完了しました。48件成功、2件失敗。"
}
```

### 権限継承設定成功レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "resourceId": "resource-uuid",
    "inheritanceConfig": {
      "inheritFromParent": true,
      "propagateToChildren": true,
      "overrideMode": "ALLOW_OVERRIDE",
      "inheritablePermissions": ["READ", "WRITE"]
    },
    "affectedResources": {
      "parent": 1,
      "self": 1,
      "children": 15,
      "total": 17
    },
    "permissionChanges": {
      "added": 23,
      "removed": 5,
      "modified": 3
    },
    "updatedAt": "2025-11-04T10:05:00Z"
  },
  "message": "権限継承設定が適用されました。",
  "warnings": [
    "5件の権限が親リソースの設定により削除されました。"
  ]
}
```

### 権限取り消し成功レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "permissionId": "perm-uuid",
    "revokedAt": "2025-11-04T10:10:00Z",
    "revokedBy": "admin-uuid",
    "revokedByName": "管理者 花子",
    "reason": "プロジェクト終了に伴う権限削除",
    "immediateRevoke": true,
    "affectedSessions": 3,
    "cascadeRevocations": {
      "childResources": 5,
      "inheritedPermissions": 12
    }
  },
  "message": "権限が取り消されました。",
  "sessionActions": {
    "activeSessions": [
      {
        "sessionId": "session-uuid-1",
        "action": "INVALIDATED",
        "userId": "user-uuid"
      }
    ]
  }
}
```

### 権限検索結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "permissions": [
      {
        "permissionId": "perm-uuid-1",
        "subjectType": "USER",
        "subjectId": "user-uuid",
        "subjectName": "田中太郎",
        "resourceType": "PROJECT",
        "resourceId": "project-uuid",
        "resourcePath": "/org/div/project",
        "permissions": ["READ", "WRITE"],
        "source": "DIRECT",
        "grantedAt": "2025-11-01T00:00:00Z",
        "expiresAt": null,
        "status": "ACTIVE"
      },
      {
        "permissionId": "inherited",
        "source": "INHERITED",
        "inheritedFrom": "parent-resource-uuid",
        "permissions": ["READ"],
        "grantedAt": "2025-10-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 127,
      "pages": 7,
      "hasNext": true,
      "hasPrevious": false
    },
    "aggregations": {
      "totalDirect": 87,
      "totalInherited": 40,
      "byPermissionType": {
        "READ": 127,
        "WRITE": 52,
        "DELETE": 15,
        "ADMIN": 8
      },
      "expiringIn7Days": 12
    }
  }
}
```

### エンティティ状態変更

#### Permission エンティティ作成
```typescript
{
  id: "uuid-v4",
  subjectType: "USER",
  subjectId: "user-uuid",
  resourceType: "PROJECT",
  resourceId: "project-uuid",
  permissions: ["READ", "WRITE"],
  scope: "RESOURCE",
  grantedBy: "admin-uuid",
  grantedAt: "2025-11-04T10:00:00Z",
  expiresAt: "2025-12-31T23:59:59Z",
  status: "ACTIVE",
  inheritanceSource: null,
  metadata: {
    reason: "プロジェクトメンバー追加",
    ipAddress: "192.168.1.100"
  }
}
```

#### RolePermission エンティティ更新
```typescript
{
  roleId: "role-uuid",
  permissions: ["READ"] → ["READ", "WRITE", "DELETE"],
  updatedAt: "2025-11-04T10:00:00Z",
  updatedBy: "admin-uuid"
}
```

#### BC-007 通知連携（権限付与通知）
```typescript
await bc007NotificationService.send({
  type: "PERMISSION_GRANTED",
  recipientId: "user-uuid",
  priority: "NORMAL",
  title: "新しい権限が付与されました",
  body: `プロジェクト「${projectName}」の READ, WRITE 権限が付与されました。`,
  actionUrl: `/projects/${projectId}`,
  metadata: {
    permissionId: "perm-uuid",
    resourceType: "PROJECT",
    permissions: ["READ", "WRITE"]
  }
});
```

---

## 🛠️ 実装ガイダンス

### RBAC (Role-Based Access Control) 実装

#### 1. 権限付与の実装
```typescript
import { prisma } from '@/lib/db';
import { auditLogger } from '@/lib/audit';
import { bc007NotificationService } from '@/lib/bc007';

interface GrantPermissionRequest {
  subjectType: 'USER' | 'ROLE' | 'GROUP';
  subjectId: string;
  resourceType: string;
  resourceId: string;
  permissions: string[];
  scope?: 'RESOURCE' | 'DESCENDANT' | 'GLOBAL';
  expiresAt?: Date;
  grantedBy: string;
  reason?: string;
}

async function grantPermission(request: GrantPermissionRequest) {
  // 1. 権限付与前の検証
  await validatePermissionGrant(request);

  // 2. 重複チェック
  const existing = await prisma.permission.findFirst({
    where: {
      subjectType: request.subjectType,
      subjectId: request.subjectId,
      resourceType: request.resourceType,
      resourceId: request.resourceId
    }
  });

  if (existing) {
    throw new PermissionAlreadyExistsError('E-PERM-2003');
  }

  // 3. 権限レコード作成
  const permission = await prisma.permission.create({
    data: {
      subjectType: request.subjectType,
      subjectId: request.subjectId,
      resourceType: request.resourceType,
      resourceId: request.resourceId,
      permissions: request.permissions,
      scope: request.scope || 'RESOURCE',
      grantedBy: request.grantedBy,
      grantedAt: new Date(),
      expiresAt: request.expiresAt,
      status: 'ACTIVE',
      metadata: {
        reason: request.reason,
        ipAddress: getClientIp(),
        userAgent: getUserAgent()
      }
    }
  });

  // 4. 監査ログ記録
  await auditLogger.log({
    eventType: 'PERMISSION_GRANTED',
    userId: request.grantedBy,
    targetUserId: request.subjectId,
    resourceId: request.resourceId,
    details: {
      permissions: request.permissions,
      scope: request.scope
    }
  });

  // 5. BC-007 通知送信
  if (request.subjectType === 'USER') {
    await bc007NotificationService.send({
      type: 'PERMISSION_GRANTED',
      recipientId: request.subjectId,
      title: '新しい権限が付与されました',
      body: `リソース「${resourceName}」の権限が付与されました。`,
      priority: 'NORMAL'
    });
  }

  return permission;
}
```

#### 2. 権限検証の実装
```typescript
interface CheckPermissionRequest {
  userId: string;
  resourceType: string;
  resourceId: string;
  requiredPermission: string;
  includeInherited?: boolean;
}

async function checkPermission(request: CheckPermissionRequest): Promise<boolean> {
  // 1. 直接付与された権限をチェック
  const directPermission = await prisma.permission.findFirst({
    where: {
      OR: [
        { subjectType: 'USER', subjectId: request.userId },
        {
          subjectType: 'ROLE',
          subjectId: {
            in: await getUserRoleIds(request.userId)
          }
        }
      ],
      resourceType: request.resourceType,
      resourceId: request.resourceId,
      status: 'ACTIVE',
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ],
      permissions: {
        has: request.requiredPermission
      }
    }
  });

  if (directPermission) {
    return true;
  }

  // 2. 継承された権限をチェック
  if (request.includeInherited !== false) {
    const inherited = await checkInheritedPermission(
      request.userId,
      request.resourceId,
      request.requiredPermission
    );

    if (inherited) {
      return true;
    }
  }

  return false;
}

async function checkInheritedPermission(
  userId: string,
  resourceId: string,
  requiredPermission: string
): Promise<boolean> {
  // リソース階層を遡って権限チェック
  const resource = await getResource(resourceId);
  let currentResource = resource;

  while (currentResource.parentId) {
    const parentPermission = await prisma.permission.findFirst({
      where: {
        subjectType: 'USER',
        subjectId: userId,
        resourceId: currentResource.parentId,
        scope: { in: ['DESCENDANT', 'GLOBAL'] },
        permissions: { has: requiredPermission },
        status: 'ACTIVE'
      }
    });

    if (parentPermission) {
      return true;
    }

    currentResource = await getResource(currentResource.parentId);
  }

  return false;
}
```

#### 3. 一括権限付与の実装
```typescript
interface BulkGrantRequest {
  grants: GrantPermissionRequest[];
  applyMode: 'ADDITIVE' | 'REPLACE' | 'MERGE';
  rollbackOnError?: boolean;
  dryRun?: boolean;
}

async function bulkGrantPermissions(request: BulkGrantRequest) {
  const results = [];
  const successful = [];
  const failed = [];

  // トランザクション開始
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < request.grants.length; i++) {
      const grant = request.grants[i];

      try {
        // Dry run モード
        if (request.dryRun) {
          const validation = await validatePermissionGrant(grant);
          results.push({
            index: i,
            status: 'DRY_RUN_SUCCESS',
            validation
          });
          continue;
        }

        // 実際の付与処理
        const permission = await grantPermissionWithinTx(tx, grant);
        successful.push({ index: i, permissionId: permission.id });
        results.push({
          index: i,
          status: 'SUCCESS',
          permissionId: permission.id
        });

      } catch (error) {
        failed.push({ index: i, error });
        results.push({
          index: i,
          status: 'FAILED',
          error: {
            code: error.code,
            message: error.message
          }
        });

        // ロールバック設定時はエラーで中断
        if (request.rollbackOnError) {
          throw error;
        }
      }
    }
  });

  return {
    batchId: generateUUID(),
    totalRequests: request.grants.length,
    successful: successful.length,
    failed: failed.length,
    results,
    dryRun: request.dryRun || false
  };
}
```

#### 4. 権限継承の実装
```typescript
interface InheritanceConfig {
  resourceId: string;
  inheritFromParent: boolean;
  propagateToChildren: boolean;
  overrideMode: 'DENY_OVERRIDE' | 'ALLOW_OVERRIDE';
  inheritablePermissions?: string[];
}

async function configureInheritance(config: InheritanceConfig) {
  // 1. 継承設定を保存
  const inheritanceConfig = await prisma.resourceInheritance.upsert({
    where: { resourceId: config.resourceId },
    create: config,
    update: config
  });

  // 2. 子リソースへの伝播
  if (config.propagateToChildren) {
    const children = await getChildResources(config.resourceId);
    const changes = { added: 0, removed: 0, modified: 0 };

    for (const child of children) {
      const result = await propagatePermissions(
        config.resourceId,
        child.id,
        config
      );

      changes.added += result.added;
      changes.removed += result.removed;
      changes.modified += result.modified;
    }

    return {
      inheritanceConfig,
      affectedResources: {
        parent: 1,
        self: 1,
        children: children.length,
        total: children.length + 2
      },
      permissionChanges: changes
    };
  }

  return { inheritanceConfig };
}

async function propagatePermissions(
  parentId: string,
  childId: string,
  config: InheritanceConfig
) {
  const changes = { added: 0, removed: 0, modified: 0 };

  // 親の権限を取得
  const parentPermissions = await prisma.permission.findMany({
    where: {
      resourceId: parentId,
      scope: { in: ['DESCENDANT', 'GLOBAL'] }
    }
  });

  for (const parentPerm of parentPermissions) {
    // 継承可能権限のフィルター
    const inheritablePerms = config.inheritablePermissions
      ? parentPerm.permissions.filter(p =>
          config.inheritablePermissions.includes(p)
        )
      : parentPerm.permissions;

    if (inheritablePerms.length === 0) continue;

    // 子リソースに継承権限を作成
    const existingChildPerm = await prisma.permission.findFirst({
      where: {
        subjectType: parentPerm.subjectType,
        subjectId: parentPerm.subjectId,
        resourceId: childId
      }
    });

    if (existingChildPerm) {
      // 上書きモードに応じて処理
      if (config.overrideMode === 'ALLOW_OVERRIDE') {
        const mergedPerms = Array.from(
          new Set([...existingChildPerm.permissions, ...inheritablePerms])
        );

        await prisma.permission.update({
          where: { id: existingChildPerm.id },
          data: { permissions: mergedPerms }
        });

        changes.modified++;
      }
    } else {
      await prisma.permission.create({
        data: {
          subjectType: parentPerm.subjectType,
          subjectId: parentPerm.subjectId,
          resourceId: childId,
          resourceType: parentPerm.resourceType,
          permissions: inheritablePerms,
          scope: 'RESOURCE',
          grantedBy: 'SYSTEM_INHERITANCE',
          grantedAt: new Date(),
          status: 'ACTIVE',
          inheritanceSource: parentId
        }
      });

      changes.added++;
    }
  }

  return changes;
}
```

#### 5. 権限取り消しの実装
```typescript
interface RevokePermissionRequest {
  permissionId: string;
  revokedBy: string;
  reason: string;
  immediateRevoke?: boolean;
  gracePeriodHours?: number;
}

async function revokePermission(request: RevokePermissionRequest) {
  // 1. 権限レコード取得
  const permission = await prisma.permission.findUnique({
    where: { id: request.permissionId }
  });

  if (!permission) {
    throw new PermissionNotFoundError('E-PERM-3001');
  }

  // 2. 即時取り消し vs 猶予期間
  const revokeAt = request.immediateRevoke
    ? new Date()
    : addHours(new Date(), request.gracePeriodHours || 0);

  // 3. 権限レコード更新
  const revokedPermission = await prisma.permission.update({
    where: { id: request.permissionId },
    data: {
      status: 'REVOKED',
      revokedAt: revokeAt,
      revokedBy: request.revokedBy,
      revokeReason: request.reason
    }
  });

  // 4. カスケード取り消し（子リソースの継承権限）
  const cascadeCount = await prisma.permission.updateMany({
    where: {
      inheritanceSource: permission.resourceId,
      subjectId: permission.subjectId,
      status: 'ACTIVE'
    },
    data: {
      status: 'REVOKED',
      revokedAt: revokeAt,
      revokedBy: 'SYSTEM_CASCADE',
      revokeReason: `親権限取り消しによる連鎖削除: ${request.reason}`
    }
  });

  // 5. アクティブセッションの無効化
  if (request.immediateRevoke && permission.subjectType === 'USER') {
    const invalidatedSessions = await invalidateUserSessions(
      permission.subjectId,
      permission.resourceId
    );

    // 6. 監査ログ
    await auditLogger.log({
      eventType: 'PERMISSION_REVOKED',
      userId: request.revokedBy,
      targetUserId: permission.subjectId,
      resourceId: permission.resourceId,
      details: {
        reason: request.reason,
        cascadeRevocations: cascadeCount.count,
        sessionsInvalidated: invalidatedSessions.length
      }
    });

    return {
      revokedPermission,
      cascadeRevocations: {
        childResources: cascadeCount.count,
        inheritedPermissions: cascadeCount.count
      },
      affectedSessions: invalidatedSessions.length
    };
  }

  return { revokedPermission };
}
```

### BC-004 組織階層統合

#### 組織ベースの権限管理
```typescript
// BC-004組織構造を考慮した権限付与
async function grantOrganizationScopedPermission(
  userId: string,
  organizationId: string,
  permission: string
) {
  // 組織階層取得（BC-004連携）
  const orgHierarchy = await bc004OrganizationService.getHierarchy(organizationId);

  // 組織スコープで権限付与
  await prisma.permission.create({
    data: {
      subjectType: 'USER',
      subjectId: userId,
      resourceType: 'ORGANIZATION',
      resourceId: organizationId,
      permissions: [permission],
      scope: 'DESCENDANT', // 配下全体に適用
      grantedBy: getCurrentUserId(),
      grantedAt: new Date()
    }
  });

  // 配下のプロジェクト・リソース全てに継承
  await propagateToOrganizationResources(userId, orgHierarchy, permission);
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### 権限付与エラー (E-PERM-1xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-PERM-1001 | 400 | Invalid subject type | 不正な付与対象タイプ | 'USER', 'ROLE', 'GROUP'のいずれかを指定 |
| E-PERM-1002 | 404 | Subject not found | 付与対象が存在しない | 有効なユーザー/ロール/グループIDを指定 |
| E-PERM-1003 | 404 | Resource not found | リソースが存在しない | 有効なリソースIDを指定 |
| E-PERM-1004 | 400 | Invalid permission type | 不正な権限タイプ | 有効な権限タイプを指定 |
| E-PERM-1005 | 403 | Insufficient privileges | 権限付与の権限なし | ADMIN権限が必要 |
| E-PERM-1006 | 400 | Invalid expiration date | 不正な有効期限 | 未来の日時を指定 |
| E-PERM-1007 | 400 | Invalid scope | 不正なスコープ | 'RESOURCE', 'DESCENDANT', 'GLOBAL'のいずれかを指定 |
| E-PERM-1008 | 500 | Permission grant failed | 権限付与処理失敗 | 再試行、失敗時はサポートに連絡 |

#### 権限重複エラー (E-PERM-2xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-PERM-2001 | 409 | Permission conflict | 権限の競合 | 既存権限を削除してから再付与 |
| E-PERM-2002 | 409 | Overlapping permission scope | スコープの重複 | スコープを調整 |
| E-PERM-2003 | 409 | Permission already exists | 権限が既に存在 | 既存権限を更新または削除 |
| E-PERM-2004 | 409 | Role assignment conflict | ロール割り当ての競合 | ロールを確認して再試行 |

#### 権限取り消しエラー (E-PERM-3xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-PERM-3001 | 404 | Permission not found | 権限が存在しない | 有効な権限IDを指定 |
| E-PERM-3002 | 403 | Cannot revoke own admin | 自身のADMIN権限を取り消せない | 他の管理者に依頼 |
| E-PERM-3003 | 403 | Cannot revoke system permission | システム権限は取り消し不可 | システム管理者に連絡 |
| E-PERM-3004 | 409 | Permission already revoked | 権限は既に取り消し済み | 取り消し不要 |
| E-PERM-3005 | 500 | Revocation failed | 取り消し処理失敗 | 再試行、失敗時はサポートに連絡 |

#### 権限継承エラー (E-PERM-4xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-PERM-4001 | 400 | Invalid inheritance config | 不正な継承設定 | 継承設定パラメータを確認 |
| E-PERM-4002 | 409 | Circular inheritance detected | 循環継承を検出 | リソース階層を確認 |
| E-PERM-4003 | 403 | Inheritance override denied | 継承上書きが拒否された | 親リソースの設定を確認 |
| E-PERM-4004 | 500 | Inheritance propagation failed | 継承伝播失敗 | 再試行、失敗時はサポートに連絡 |

#### 一括処理エラー (E-PERM-5xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-PERM-5001 | 400 | Batch size exceeded | 一括処理件数超過 | 100件以下に分割 |
| E-PERM-5002 | 400 | Invalid apply mode | 不正な適用モード | 'ADDITIVE', 'REPLACE', 'MERGE'のいずれかを指定 |
| E-PERM-5003 | 500 | Batch processing failed | 一括処理失敗 | ロールバック実施、再試行 |
| E-PERM-5004 | 207 | Partial success | 一部成功、一部失敗 | 失敗項目を確認して再実行 |

### エラーレスポンス形式

#### 標準エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "E-PERM-2003",
    "message": "Permission already exists",
    "details": "ユーザー「田中太郎」はリソース「DXプロジェクト2025」に対して既に READ, WRITE 権限を保持しています。",
    "timestamp": "2025-11-04T11:00:00Z",
    "requestId": "req-uuid"
  },
  "conflictingPermission": {
    "permissionId": "existing-perm-uuid",
    "grantedAt": "2025-10-01T00:00:00Z",
    "grantedBy": "admin-uuid",
    "expiresAt": null
  },
  "suggestedActions": [
    "既存の権限を更新する（PUT /api/permissions/{id}）",
    "既存の権限を削除してから再付与する",
    "ADDITIVEモードで追加権限のみを付与する"
  ]
}
```

#### 一括処理エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "E-PERM-5004",
    "message": "Partial success",
    "details": "50件中48件が成功、2件が失敗しました。",
    "timestamp": "2025-11-04T11:05:00Z"
  },
  "batchResults": {
    "totalRequests": 50,
    "successful": 48,
    "failed": 2,
    "failedItems": [
      {
        "index": 15,
        "subjectId": "user-uuid-15",
        "error": {
          "code": "E-PERM-2003",
          "message": "Permission already exists"
        }
      },
      {
        "index": 32,
        "subjectId": "user-uuid-32",
        "error": {
          "code": "E-PERM-1002",
          "message": "Subject not found"
        }
      }
    ]
  },
  "suggestedActions": [
    "失敗した2件を個別に確認して再実行",
    "rollbackOnError=trueで全件ロールバック"
  ]
}
```

### エラー処理フロー

#### 権限付与時のエラーハンドリング
```typescript
async function handlePermissionGrantError(
  error: PermissionError,
  request: GrantPermissionRequest
): Promise<ErrorResponse> {

  // 1. エラー種別の判定
  switch (error.code) {
    case 'E-PERM-2003': // 権限重複
      const existing = await getExistingPermission(request);
      return {
        code: error.code,
        message: 'Permission already exists',
        conflictingPermission: existing,
        suggestedActions: [
          '既存権限を更新',
          '既存権限を削除して再付与',
          'ADDITIVEモードで差分のみ付与'
        ]
      };

    case 'E-PERM-1005': // 権限不足
      await auditLogger.log({
        eventType: 'PERMISSION_GRANT_DENIED',
        userId: request.grantedBy,
        reason: 'Insufficient privileges',
        attemptedAction: 'GRANT_PERMISSION'
      });

      return {
        code: error.code,
        message: 'Insufficient privileges',
        requiredPermissions: ['ADMIN'],
        currentPermissions: await getUserPermissions(request.grantedBy)
      };

    case 'E-PERM-4002': // 循環継承
      const cycle = await detectInheritanceCycle(request.resourceId);
      return {
        code: error.code,
        message: 'Circular inheritance detected',
        inheritanceCycle: cycle,
        suggestedActions: [
          'リソース階層を再構築',
          '継承設定を見直す'
        ]
      };

    default:
      // システムエラーは詳細ログを記録
      await logError('PERMISSION_GRANT_ERROR', error, request);
      throw new PermissionSystemError('E-PERM-1008');
  }
}
```

#### トランザクションロールバック
```typescript
async function grantPermissionWithRollback(request: GrantPermissionRequest) {
  const savepoint = await prisma.$executeRaw`SAVEPOINT grant_permission`;

  try {
    // 権限付与処理
    const permission = await grantPermission(request);

    // BC-007通知送信
    await bc007NotificationService.send({
      type: 'PERMISSION_GRANTED',
      recipientId: request.subjectId
    });

    // コミット
    await prisma.$executeRaw`RELEASE SAVEPOINT grant_permission`;

    return permission;

  } catch (error) {
    // ロールバック
    await prisma.$executeRaw`ROLLBACK TO SAVEPOINT grant_permission`;

    await auditLogger.log({
      eventType: 'PERMISSION_GRANT_ROLLED_BACK',
      userId: request.grantedBy,
      error: error.message
    });

    throw error;
  }
}
```

### リトライポリシー

```typescript
const PERMISSION_RETRY_POLICY = {
  maxAttempts: 3,
  backoffMultiplier: 2,
  initialDelayMs: 500,
  retryableErrors: [
    'E-PERM-1008', // 権限付与処理失敗
    'E-PERM-3005', // 取り消し処理失敗
    'E-PERM-4004', // 継承伝播失敗
    'E-PERM-5003'  // 一括処理失敗
  ]
};

async function retryPermissionOperation<T>(
  operation: () => Promise<T>,
  errorCode: string
): Promise<T> {
  let attempt = 0;
  let delay = PERMISSION_RETRY_POLICY.initialDelayMs;

  while (attempt < PERMISSION_RETRY_POLICY.maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempt++;

      if (!PERMISSION_RETRY_POLICY.retryableErrors.includes(errorCode)) {
        throw error;
      }

      if (attempt >= PERMISSION_RETRY_POLICY.maxAttempts) {
        throw new PermissionMaxRetriesError(errorCode);
      }

      await sleep(delay);
      delay *= PERMISSION_RETRY_POLICY.backoffMultiplier;
    }
  }
}
```

### 監査ログ記録

```typescript
// 権限付与成功
await auditLog.record({
  eventType: 'PERMISSION_GRANTED',
  userId: request.grantedBy,
  targetUserId: request.subjectId,
  resourceType: request.resourceType,
  resourceId: request.resourceId,
  permissions: request.permissions,
  scope: request.scope,
  ipAddress: req.ip,
  timestamp: new Date()
});

// 権限取り消し
await auditLog.record({
  eventType: 'PERMISSION_REVOKED',
  userId: request.revokedBy,
  targetUserId: permission.subjectId,
  resourceId: permission.resourceId,
  reason: request.reason,
  cascadeCount: cascadeRevocations.count,
  timestamp: new Date()
});

// 権限検証失敗
await auditLog.record({
  eventType: 'PERMISSION_CHECK_FAILED',
  userId: request.userId,
  resourceId: request.resourceId,
  requiredPermission: request.requiredPermission,
  reason: 'PERMISSION_DENIED',
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
> - [services/secure-access-service/capabilities/control-access-permissions/operations/grant-and-manage-permissions/](../../../../../../services/secure-access-service/capabilities/control-access-permissions/operations/grant-and-manage-permissions/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
