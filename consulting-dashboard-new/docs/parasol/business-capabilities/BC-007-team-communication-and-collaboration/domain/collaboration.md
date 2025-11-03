# BC-007: コラボレーション詳細 [Collaboration Details]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**Context**: Collaboration Context [コラボレーションコンテキスト]

---

## 目次

1. [概要](#overview)
2. [Workspace Aggregate](#workspace-aggregate)
3. [Document Sharing](#document-sharing)
4. [Real-time Collaboration](#realtime-collaboration)
5. [Version Control](#version-control)
6. [Permission Management](#permission-management)
7. [Business Rules](#business-rules)
8. [Domain Events](#domain-events)
9. [Implementation Examples](#implementation-examples)

---

## 概要 {#overview}

Collaboration Contextは、チームワークスペース、ドキュメント共有、リアルタイム共同編集を提供します。

### 責務

- **ワークスペース管理**: プロジェクト・チーム単位のワークスペース
- **ドキュメント共有**: ファイルアップロード・共有
- **共同編集**: リアルタイム同時編集
- **バージョン管理**: 変更履歴の保存
- **権限管理**: ワークスペース・ドキュメント別権限
- **コメント**: ドキュメントへのコメント機能

---

## Workspace Aggregate {#workspace-aggregate}

### 概念モデル

Workspace Aggregateは、チームコラボレーションの基盤となる空間を管理します。

**集約ルート**: Workspace [ワークスペース] [WORKSPACE]

**エンティティ**:
- Workspace - ワークスペース本体
- WorkspaceMember - メンバー
- SharedDocument - 共有ドキュメント
- DocumentVersion - ドキュメントバージョン

**値オブジェクト**:
- WorkspaceId - ワークスペースID
- DocumentId - ドキュメントID
- WorkspaceType - ワークスペース種別
- AccessPermission - アクセス権限
- DocumentMetadata - ドキュメントメタデータ

### TypeScript実装

```typescript
// ========================================
// Value Objects
// ========================================

/**
 * WorkspaceId - ワークスペースID
 */
export class WorkspaceId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || !this.isValidUUID(value)) {
      throw new InvalidWorkspaceIdError(value);
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: WorkspaceId): boolean {
    return this.value === other.value;
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  public static generate(): WorkspaceId {
    return new WorkspaceId(crypto.randomUUID());
  }
}

/**
 * DocumentId - ドキュメントID
 */
export class DocumentId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || !this.isValidUUID(value)) {
      throw new InvalidDocumentIdError(value);
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: DocumentId): boolean {
    return this.value === other.value;
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  public static generate(): DocumentId {
    return new DocumentId(crypto.randomUUID());
  }
}

/**
 * WorkspaceType - ワークスペース種別
 */
export enum WorkspaceType {
  PROJECT = 'project',       // プロジェクトワークスペース
  TEAM = 'team',             // チームワークスペース
  DEPARTMENT = 'department', // 部門ワークスペース
  PERSONAL = 'personal'      // 個人ワークスペース
}

/**
 * AccessPermission - アクセス権限
 */
export enum AccessPermission {
  OWNER = 'owner',           // オーナー（全権限）
  ADMIN = 'admin',           // 管理者（メンバー管理可）
  EDITOR = 'editor',         // 編集者（ドキュメント編集可）
  COMMENTER = 'commenter',   // コメンター（コメントのみ）
  VIEWER = 'viewer'          // 閲覧者（閲覧のみ）
}

/**
 * DocumentMetadata - ドキュメントメタデータ
 */
export class DocumentMetadata {
  public readonly fileName: string;
  public readonly fileSize: number;
  public readonly mimeType: string;
  public readonly fileExtension: string;
  public readonly checksum: string;

  constructor(
    fileName: string,
    fileSize: number,
    mimeType: string,
    checksum: string
  ) {
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.mimeType = mimeType;
    this.fileExtension = this.extractExtension(fileName);
    this.checksum = checksum;
  }

  private extractExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot > 0 ? fileName.substring(lastDot + 1).toLowerCase() : '';
  }

  public isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  public isDocument(): boolean {
    const docTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    return docTypes.includes(this.mimeType);
  }

  public isCode(): boolean {
    const codeExtensions = ['js', 'ts', 'py', 'java', 'go', 'rb', 'php', 'c', 'cpp', 'h'];
    return codeExtensions.includes(this.fileExtension);
  }
}

// ========================================
// Entities
// ========================================

/**
 * Workspace - ワークスペースエンティティ（集約ルート）
 */
export class Workspace {
  private id: WorkspaceId;
  private name: string;
  private description: string;
  private type: WorkspaceType;
  private ownerId: string;
  private members: WorkspaceMember[];
  private documents: SharedDocument[];
  private createdAt: Date;
  private updatedAt: Date;
  private archivedAt: Date | null;
  private settings: WorkspaceSettings;

  // Domain Events
  private domainEvents: DomainEvent[] = [];

  constructor(
    id: WorkspaceId,
    name: string,
    description: string,
    type: WorkspaceType,
    ownerId: string
  ) {
    this.id = id;
    this.name = this.validateName(name);
    this.description = description;
    this.type = type;
    this.ownerId = ownerId;
    this.members = [new WorkspaceMember(ownerId, AccessPermission.OWNER, new Date())];
    this.documents = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.archivedAt = null;
    this.settings = WorkspaceSettings.default();
  }

  // ========================================
  // Factory Methods
  // ========================================

  /**
   * プロジェクトワークスペースを作成
   */
  public static createForProject(
    projectId: string,
    projectName: string,
    ownerId: string
  ): Workspace {
    const workspace = new Workspace(
      WorkspaceId.generate(),
      `${projectName} Workspace`,
      `Workspace for project ${projectName}`,
      WorkspaceType.PROJECT,
      ownerId
    );

    workspace.addDomainEvent(new WorkspaceCreatedEvent(
      workspace.id.toString(),
      workspace.name,
      WorkspaceType.PROJECT,
      ownerId,
      workspace.createdAt
    ));

    return workspace;
  }

  /**
   * チームワークスペースを作成
   */
  public static createForTeam(
    teamName: string,
    ownerId: string
  ): Workspace {
    const workspace = new Workspace(
      WorkspaceId.generate(),
      `${teamName} Team Workspace`,
      `Workspace for ${teamName} team`,
      WorkspaceType.TEAM,
      ownerId
    );

    workspace.addDomainEvent(new WorkspaceCreatedEvent(
      workspace.id.toString(),
      workspace.name,
      WorkspaceType.TEAM,
      ownerId,
      workspace.createdAt
    ));

    return workspace;
  }

  // ========================================
  // Business Logic - Member Management
  // ========================================

  /**
   * メンバーを追加
   */
  public addMember(userId: string, permission: AccessPermission, addedBy: string): void {
    // BR-WS-001: オーナーまたは管理者のみメンバー追加可能
    const adder = this.getMember(addedBy);
    if (!adder || ![AccessPermission.OWNER, AccessPermission.ADMIN].includes(adder.permission)) {
      throw new UnauthorizedMemberAddError(this.id.toString(), addedBy);
    }

    // BR-WS-002: 既にメンバーの場合はエラー
    if (this.isMember(userId)) {
      throw new UserAlreadyMemberError(this.id.toString(), userId);
    }

    // BR-WS-003: アーカイブ済みワークスペースにメンバー追加不可
    if (this.isArchived()) {
      throw new CannotAddMemberToArchivedWorkspaceError(this.id.toString());
    }

    const member = new WorkspaceMember(userId, permission, new Date());
    this.members.push(member);
    this.updatedAt = new Date();

    this.addDomainEvent(new MemberAddedToWorkspaceEvent(
      this.id.toString(),
      userId,
      permission,
      addedBy,
      new Date()
    ));
  }

  /**
   * メンバーを削除
   */
  public removeMember(userId: string, removedBy: string): void {
    // BR-WS-004: オーナーは削除不可
    if (userId === this.ownerId) {
      throw new CannotRemoveOwnerError(this.id.toString());
    }

    // BR-WS-005: オーナーまたは管理者、または本人のみ削除可能
    const remover = this.getMember(removedBy);
    if (!remover ||
        (![AccessPermission.OWNER, AccessPermission.ADMIN].includes(remover.permission) &&
         removedBy !== userId)) {
      throw new UnauthorizedMemberRemoveError(this.id.toString(), removedBy);
    }

    const memberIndex = this.members.findIndex(m => m.userId === userId);
    if (memberIndex === -1) {
      throw new UserNotMemberError(this.id.toString(), userId);
    }

    this.members.splice(memberIndex, 1);
    this.updatedAt = new Date();

    this.addDomainEvent(new MemberRemovedFromWorkspaceEvent(
      this.id.toString(),
      userId,
      removedBy,
      new Date()
    ));
  }

  /**
   * メンバーの権限を変更
   */
  public changeMemberPermission(
    userId: string,
    newPermission: AccessPermission,
    changedBy: string
  ): void {
    // BR-WS-006: オーナーのみ権限変更可能
    if (changedBy !== this.ownerId) {
      throw new UnauthorizedPermissionChangeError(this.id.toString(), changedBy);
    }

    // BR-WS-007: オーナーの権限は変更不可
    if (userId === this.ownerId) {
      throw new CannotChangeOwnerPermissionError(this.id.toString());
    }

    const member = this.getMember(userId);
    if (!member) {
      throw new UserNotMemberError(this.id.toString(), userId);
    }

    const oldPermission = member.permission;
    member.changePermission(newPermission);
    this.updatedAt = new Date();

    this.addDomainEvent(new MemberPermissionChangedEvent(
      this.id.toString(),
      userId,
      oldPermission,
      newPermission,
      changedBy,
      new Date()
    ));
  }

  // ========================================
  // Business Logic - Document Management
  // ========================================

  /**
   * ドキュメントを共有
   */
  public shareDocument(
    title: string,
    metadata: DocumentMetadata,
    storageUrl: string,
    sharedBy: string
  ): SharedDocument {
    // BR-WS-008: メンバーのみドキュメント共有可能
    if (!this.isMember(sharedBy)) {
      throw new UnauthorizedDocumentShareError(this.id.toString(), sharedBy);
    }

    // BR-WS-009: 編集者以上の権限が必要
    const member = this.getMember(sharedBy);
    if (!member || ![AccessPermission.OWNER, AccessPermission.ADMIN, AccessPermission.EDITOR].includes(member.permission)) {
      throw new InsufficientPermissionForDocumentShareError(this.id.toString(), sharedBy);
    }

    // BR-WS-010: アーカイブ済みワークスペースにドキュメント共有不可
    if (this.isArchived()) {
      throw new CannotShareDocumentToArchivedWorkspaceError(this.id.toString());
    }

    const document = new SharedDocument(
      DocumentId.generate(),
      this.id.toString(),
      title,
      metadata,
      storageUrl,
      sharedBy
    );

    this.documents.push(document);
    this.updatedAt = new Date();

    this.addDomainEvent(new DocumentSharedEvent(
      this.id.toString(),
      document.getId().toString(),
      title,
      sharedBy,
      new Date()
    ));

    return document;
  }

  /**
   * ドキュメントを削除
   */
  public deleteDocument(documentId: string, deletedBy: string): void {
    const document = this.getDocument(documentId);
    if (!document) {
      throw new DocumentNotFoundError(documentId);
    }

    // BR-WS-011: ドキュメント所有者、管理者、オーナーのみ削除可能
    const member = this.getMember(deletedBy);
    if (!member ||
        (deletedBy !== document.getOwnerId() &&
         ![AccessPermission.OWNER, AccessPermission.ADMIN].includes(member.permission))) {
      throw new UnauthorizedDocumentDeleteError(this.id.toString(), documentId, deletedBy);
    }

    document.delete(deletedBy);
    this.updatedAt = new Date();

    this.addDomainEvent(new DocumentDeletedEvent(
      this.id.toString(),
      documentId,
      deletedBy,
      new Date()
    ));
  }

  /**
   * ドキュメントを更新
   */
  public updateDocument(
    documentId: string,
    newContent: string,
    updatedBy: string
  ): void {
    const document = this.getDocument(documentId);
    if (!document) {
      throw new DocumentNotFoundError(documentId);
    }

    // BR-WS-012: 編集者以上の権限が必要
    const member = this.getMember(updatedBy);
    if (!member ||
        ![AccessPermission.OWNER, AccessPermission.ADMIN, AccessPermission.EDITOR].includes(member.permission)) {
      throw new InsufficientPermissionForDocumentEditError(this.id.toString(), documentId, updatedBy);
    }

    document.update(newContent, updatedBy);
    this.updatedAt = new Date();

    this.addDomainEvent(new DocumentUpdatedEvent(
      this.id.toString(),
      documentId,
      updatedBy,
      new Date()
    ));
  }

  // ========================================
  // Business Logic - Workspace Operations
  // ========================================

  /**
   * ワークスペースをアーカイブ
   */
  public archive(archivedBy: string): void {
    // BR-WS-013: オーナーのみアーカイブ可能
    if (archivedBy !== this.ownerId) {
      throw new UnauthorizedWorkspaceArchiveError(this.id.toString(), archivedBy);
    }

    // BR-WS-014: 既にアーカイブ済みの場合はエラー
    if (this.isArchived()) {
      throw new WorkspaceAlreadyArchivedError(this.id.toString());
    }

    this.archivedAt = new Date();
    this.updatedAt = new Date();

    this.addDomainEvent(new WorkspaceArchivedEvent(
      this.id.toString(),
      archivedBy,
      this.archivedAt
    ));
  }

  /**
   * アーカイブを解除
   */
  public unarchive(unarchivedBy: string): void {
    // BR-WS-015: オーナーのみアーカイブ解除可能
    if (unarchivedBy !== this.ownerId) {
      throw new UnauthorizedWorkspaceUnarchiveError(this.id.toString(), unarchivedBy);
    }

    if (!this.isArchived()) {
      throw new WorkspaceNotArchivedError(this.id.toString());
    }

    this.archivedAt = null;
    this.updatedAt = new Date();

    this.addDomainEvent(new WorkspaceUnarchivedEvent(
      this.id.toString(),
      unarchivedBy,
      new Date()
    ));
  }

  // ========================================
  // Query Methods
  // ========================================

  public getId(): WorkspaceId {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): WorkspaceType {
    return this.type;
  }

  public getOwnerId(): string {
    return this.ownerId;
  }

  public getMembers(): WorkspaceMember[] {
    return [...this.members];
  }

  public getMember(userId: string): WorkspaceMember | undefined {
    return this.members.find(m => m.userId === userId);
  }

  public isMember(userId: string): boolean {
    return this.members.some(m => m.userId === userId);
  }

  public getDocuments(): SharedDocument[] {
    return this.documents.filter(d => !d.isDeleted());
  }

  public getDocument(documentId: string): SharedDocument | undefined {
    return this.documents.find(d => d.getId().toString() === documentId);
  }

  public isArchived(): boolean {
    return this.archivedAt !== null;
  }

  public getMemberCount(): number {
    return this.members.length;
  }

  public getDocumentCount(): number {
    return this.documents.filter(d => !d.isDeleted()).length;
  }

  // ========================================
  // Validation
  // ========================================

  private validateName(name: string): string {
    // BR-WS-016: ワークスペース名は3-100文字
    if (name.length < 3 || name.length > 100) {
      throw new InvalidWorkspaceNameLengthError(name.length);
    }
    return name;
  }

  // ========================================
  // Domain Events
  // ========================================

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}

/**
 * WorkspaceMember - ワークスペースメンバーエンティティ
 */
export class WorkspaceMember {
  public readonly userId: string;
  public permission: AccessPermission;
  public readonly joinedAt: Date;
  public lastAccessedAt: Date | null;

  constructor(userId: string, permission: AccessPermission, joinedAt: Date) {
    this.userId = userId;
    this.permission = permission;
    this.joinedAt = joinedAt;
    this.lastAccessedAt = null;
  }

  public changePermission(newPermission: AccessPermission): void {
    this.permission = newPermission;
  }

  public updateLastAccess(): void {
    this.lastAccessedAt = new Date();
  }

  public hasPermission(required: AccessPermission): boolean {
    const hierarchy = [
      AccessPermission.VIEWER,
      AccessPermission.COMMENTER,
      AccessPermission.EDITOR,
      AccessPermission.ADMIN,
      AccessPermission.OWNER
    ];

    const currentLevel = hierarchy.indexOf(this.permission);
    const requiredLevel = hierarchy.indexOf(required);

    return currentLevel >= requiredLevel;
  }
}

/**
 * SharedDocument - 共有ドキュメントエンティティ
 */
export class SharedDocument {
  private id: DocumentId;
  private workspaceId: string;
  private title: string;
  private metadata: DocumentMetadata;
  private storageUrl: string;
  private ownerId: string;
  private versions: DocumentVersion[];
  private currentVersionNumber: number;
  private collaborators: string[]; // User IDs currently editing
  private comments: DocumentComment[];
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    id: DocumentId,
    workspaceId: string,
    title: string,
    metadata: DocumentMetadata,
    storageUrl: string,
    ownerId: string
  ) {
    this.id = id;
    this.workspaceId = workspaceId;
    this.title = title;
    this.metadata = metadata;
    this.storageUrl = storageUrl;
    this.ownerId = ownerId;
    this.versions = [new DocumentVersion(1, storageUrl, ownerId, new Date())];
    this.currentVersionNumber = 1;
    this.collaborators = [];
    this.comments = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
  }

  /**
   * ドキュメントを更新（新バージョン作成）
   */
  public update(newStorageUrl: string, updatedBy: string): void {
    // BR-DOC-001: 削除済みドキュメントは更新不可
    if (this.isDeleted()) {
      throw new CannotUpdateDeletedDocumentError(this.id.toString());
    }

    this.currentVersionNumber++;
    const newVersion = new DocumentVersion(
      this.currentVersionNumber,
      newStorageUrl,
      updatedBy,
      new Date()
    );
    this.versions.push(newVersion);
    this.storageUrl = newStorageUrl;
    this.updatedAt = new Date();
  }

  /**
   * ドキュメントを削除
   */
  public delete(deletedBy: string): void {
    // BR-DOC-002: 既に削除済みの場合はエラー
    if (this.isDeleted()) {
      throw new DocumentAlreadyDeletedError(this.id.toString());
    }

    this.deletedAt = new Date();
  }

  /**
   * コラボレーターを追加（リアルタイム編集開始）
   */
  public addCollaborator(userId: string): void {
    if (!this.collaborators.includes(userId)) {
      this.collaborators.push(userId);
    }
  }

  /**
   * コラボレーターを削除（リアルタイム編集終了）
   */
  public removeCollaborator(userId: string): void {
    const index = this.collaborators.indexOf(userId);
    if (index > -1) {
      this.collaborators.splice(index, 1);
    }
  }

  /**
   * コメントを追加
   */
  public addComment(userId: string, content: string, position?: CommentPosition): void {
    const comment = new DocumentComment(
      crypto.randomUUID(),
      userId,
      content,
      new Date(),
      position
    );
    this.comments.push(comment);
    this.updatedAt = new Date();
  }

  /**
   * 特定バージョンを取得
   */
  public getVersion(versionNumber: number): DocumentVersion | undefined {
    return this.versions.find(v => v.versionNumber === versionNumber);
  }

  /**
   * 最新バージョンを取得
   */
  public getCurrentVersion(): DocumentVersion {
    return this.versions[this.versions.length - 1];
  }

  public getId(): DocumentId {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getOwnerId(): string {
    return this.ownerId;
  }

  public getMetadata(): DocumentMetadata {
    return this.metadata;
  }

  public getStorageUrl(): string {
    return this.storageUrl;
  }

  public getVersions(): DocumentVersion[] {
    return [...this.versions];
  }

  public getCollaborators(): string[] {
    return [...this.collaborators];
  }

  public getComments(): DocumentComment[] {
    return [...this.comments];
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  public isBeingEdited(): boolean {
    return this.collaborators.length > 0;
  }
}

/**
 * DocumentVersion - ドキュメントバージョンエンティティ
 */
export class DocumentVersion {
  public readonly versionNumber: number;
  public readonly storageUrl: string;
  public readonly createdBy: string;
  public readonly createdAt: Date;
  public readonly changeDescription?: string;

  constructor(
    versionNumber: number,
    storageUrl: string,
    createdBy: string,
    createdAt: Date,
    changeDescription?: string
  ) {
    this.versionNumber = versionNumber;
    this.storageUrl = storageUrl;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.changeDescription = changeDescription;
  }
}

/**
 * DocumentComment - ドキュメントコメント
 */
export class DocumentComment {
  public readonly id: string;
  public readonly userId: string;
  public readonly content: string;
  public readonly createdAt: Date;
  public readonly position?: CommentPosition;
  public resolved: boolean;
  public resolvedAt: Date | null;
  public resolvedBy: string | null;

  constructor(
    id: string,
    userId: string,
    content: string,
    createdAt: Date,
    position?: CommentPosition
  ) {
    this.id = id;
    this.userId = userId;
    this.content = content;
    this.createdAt = createdAt;
    this.position = position;
    this.resolved = false;
    this.resolvedAt = null;
    this.resolvedBy = null;
  }

  public resolve(userId: string): void {
    this.resolved = true;
    this.resolvedAt = new Date();
    this.resolvedBy = userId;
  }
}

/**
 * CommentPosition - コメント位置
 */
export interface CommentPosition {
  page?: number;
  line?: number;
  character?: number;
  selection?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}

/**
 * WorkspaceSettings - ワークスペース設定
 */
export class WorkspaceSettings {
  public readonly allowExternalSharing: boolean;
  public readonly requireApprovalForSharing: boolean;
  public readonly maxDocumentSize: number; // MB
  public readonly allowedFileTypes: string[];

  private constructor(
    allowExternalSharing: boolean,
    requireApprovalForSharing: boolean,
    maxDocumentSize: number,
    allowedFileTypes: string[]
  ) {
    this.allowExternalSharing = allowExternalSharing;
    this.requireApprovalForSharing = requireApprovalForSharing;
    this.maxDocumentSize = maxDocumentSize;
    this.allowedFileTypes = allowedFileTypes;
  }

  public static default(): WorkspaceSettings {
    return new WorkspaceSettings(
      false, // External sharing disabled by default
      true,  // Approval required by default
      100,   // 100 MB max
      ['*']  // All file types allowed
    );
  }
}
```

---

## Real-time Collaboration {#realtime-collaboration}

### リアルタイム共同編集サービス

```typescript
/**
 * RealtimeCollaborationService - リアルタイム共同編集サービス
 */
export class RealtimeCollaborationService {
  constructor(
    private documentRepository: DocumentRepository,
    private webSocketGateway: WebSocketGateway,
    private conflictResolver: ConflictResolver
  ) {}

  /**
   * 編集セッションを開始
   */
  public async startEditingSession(
    documentId: string,
    userId: string
  ): Promise<void> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new DocumentNotFoundError(documentId);
    }

    // コラボレーターとして追加
    document.addCollaborator(userId);
    await this.documentRepository.save(document);

    // 既存のコラボレーターに通知
    const otherCollaborators = document.getCollaborators()
      .filter(id => id !== userId);

    await this.webSocketGateway.sendToUsers(otherCollaborators, {
      type: 'collaborator_joined',
      data: {
        documentId,
        userId,
        timestamp: new Date()
      }
    });
  }

  /**
   * 編集操作を同期
   */
  public async synchronizeEdit(
    documentId: string,
    userId: string,
    operation: EditOperation
  ): Promise<void> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new DocumentNotFoundError(documentId);
    }

    // 競合チェック
    const conflicts = await this.conflictResolver.detectConflicts(
      documentId,
      operation
    );

    if (conflicts.length > 0) {
      // 競合解決
      const resolved = await this.conflictResolver.resolve(operation, conflicts);
      operation = resolved;
    }

    // 他のコラボレーターに操作をブロードキャスト
    const otherCollaborators = document.getCollaborators()
      .filter(id => id !== userId);

    await this.webSocketGateway.sendToUsers(otherCollaborators, {
      type: 'document_edit',
      data: {
        documentId,
        userId,
        operation,
        timestamp: new Date()
      }
    });
  }

  /**
   * 編集セッションを終了
   */
  public async endEditingSession(
    documentId: string,
    userId: string
  ): Promise<void> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      return;
    }

    // コラボレーターから削除
    document.removeCollaborator(userId);
    await this.documentRepository.save(document);

    // 他のコラボレーターに通知
    const otherCollaborators = document.getCollaborators();

    await this.webSocketGateway.sendToUsers(otherCollaborators, {
      type: 'collaborator_left',
      data: {
        documentId,
        userId,
        timestamp: new Date()
      }
    });
  }
}

/**
 * EditOperation - 編集操作
 */
export interface EditOperation {
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content?: string;
  length?: number;
  timestamp: Date;
  version: number;
}

/**
 * ConflictResolver - 競合解決
 */
export class ConflictResolver {
  public async detectConflicts(
    documentId: string,
    operation: EditOperation
  ): Promise<Conflict[]> {
    // Operational Transformation (OT) or CRDT based conflict detection
    // Implementation details omitted for brevity
    return [];
  }

  public async resolve(
    operation: EditOperation,
    conflicts: Conflict[]
  ): Promise<EditOperation> {
    // Conflict resolution logic
    // Implementation details omitted for brevity
    return operation;
  }
}

interface Conflict {
  operationId: string;
  conflictType: 'position' | 'content';
}
```

---

## Business Rules {#business-rules}

| ルールID | ルール内容 | 実装箇所 |
|---------|----------|----------|
| BR-WS-001 | オーナーまたは管理者のみメンバー追加可能 | Workspace.addMember() |
| BR-WS-002 | 既にメンバーの場合はエラー | Workspace.addMember() |
| BR-WS-003 | アーカイブ済みワークスペースにメンバー追加不可 | Workspace.addMember() |
| BR-WS-004 | オーナーは削除不可 | Workspace.removeMember() |
| BR-WS-005 | オーナーまたは管理者、または本人のみ削除可能 | Workspace.removeMember() |
| BR-WS-006 | オーナーのみ権限変更可能 | Workspace.changeMemberPermission() |
| BR-WS-007 | オーナーの権限は変更不可 | Workspace.changeMemberPermission() |
| BR-WS-008 | メンバーのみドキュメント共有可能 | Workspace.shareDocument() |
| BR-WS-009 | 編集者以上の権限が必要 | Workspace.shareDocument() |
| BR-WS-010 | アーカイブ済みワークスペースにドキュメント共有不可 | Workspace.shareDocument() |
| BR-WS-011 | ドキュメント所有者、管理者、オーナーのみ削除可能 | Workspace.deleteDocument() |
| BR-WS-012 | 編集者以上の権限が必要 | Workspace.updateDocument() |
| BR-WS-013 | オーナーのみアーカイブ可能 | Workspace.archive() |
| BR-WS-014 | 既にアーカイブ済みの場合はエラー | Workspace.archive() |
| BR-WS-015 | オーナーのみアーカイブ解除可能 | Workspace.unarchive() |
| BR-WS-016 | ワークスペース名は3-100文字 | Workspace.validateName() |
| BR-DOC-001 | 削除済みドキュメントは更新不可 | SharedDocument.update() |
| BR-DOC-002 | 既に削除済みの場合はエラー | SharedDocument.delete() |

---

## Domain Events {#domain-events}

```typescript
/**
 * WorkspaceCreatedEvent - ワークスペース作成イベント
 */
export class WorkspaceCreatedEvent implements DomainEvent {
  public readonly eventType = 'WorkspaceCreated';
  public readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly name: string,
    public readonly type: WorkspaceType,
    public readonly ownerId: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MemberAddedToWorkspaceEvent - ワークスペースメンバー追加イベント
 */
export class MemberAddedToWorkspaceEvent implements DomainEvent {
  public readonly eventType = 'MemberAddedToWorkspace';
  public readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly userId: string,
    public readonly permission: AccessPermission,
    public readonly addedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * DocumentSharedEvent - ドキュメント共有イベント
 */
export class DocumentSharedEvent implements DomainEvent {
  public readonly eventType = 'DocumentShared';
  public readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly documentId: string,
    public readonly title: string,
    public readonly sharedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * DocumentUpdatedEvent - ドキュメント更新イベント
 */
export class DocumentUpdatedEvent implements DomainEvent {
  public readonly eventType = 'DocumentUpdated';
  public readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly documentId: string,
    public readonly updatedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * WorkspaceArchivedEvent - ワークスペースアーカイブイベント
 */
export class WorkspaceArchivedEvent implements DomainEvent {
  public readonly eventType = 'WorkspaceArchived';
  public readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly archivedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}
```

---

## Implementation Examples {#implementation-examples}

### 使用例1: プロジェクトワークスペース作成

```typescript
// Application Service
export class CollaborationApplicationService {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private eventBus: EventBus
  ) {}

  async createProjectWorkspace(
    projectId: string,
    projectName: string,
    ownerId: string,
    teamMemberIds: string[]
  ): Promise<string> {
    // ワークスペース作成
    const workspace = Workspace.createForProject(
      projectId,
      projectName,
      ownerId
    );

    // チームメンバー追加
    for (const memberId of teamMemberIds) {
      workspace.addMember(memberId, AccessPermission.EDITOR, ownerId);
    }

    // 保存
    await this.workspaceRepository.save(workspace);

    // イベント発行
    for (const event of workspace.getDomainEvents()) {
      await this.eventBus.publish(event);
    }

    workspace.clearDomainEvents();

    return workspace.getId().toString();
  }
}
```

### 使用例2: ドキュメント共有とリアルタイム編集

```typescript
async shareAndEditDocument(
  workspaceId: string,
  title: string,
  file: File,
  userId: string
): Promise<string> {
  // ファイルをストレージにアップロード
  const storageUrl = await this.storageService.upload(file);

  // メタデータ作成
  const metadata = new DocumentMetadata(
    file.name,
    file.size,
    file.type,
    await this.calculateChecksum(file)
  );

  // ワークスペース取得
  const workspace = await this.workspaceRepository.findById(workspaceId);
  if (!workspace) {
    throw new WorkspaceNotFoundError(workspaceId);
  }

  // ドキュメント共有
  const document = workspace.shareDocument(title, metadata, storageUrl, userId);

  // 保存
  await this.workspaceRepository.save(workspace);

  // イベント発行
  for (const event of workspace.getDomainEvents()) {
    await this.eventBus.publish(event);
  }

  // リアルタイム編集セッション開始
  await this.realtimeService.startEditingSession(
    document.getId().toString(),
    userId
  );

  return document.getId().toString();
}
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 コラボレーション詳細化
