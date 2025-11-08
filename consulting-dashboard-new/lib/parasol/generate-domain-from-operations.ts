/**
 * ビジネスオペレーション定義からドメイン言語を生成する
 */

interface _OperationTemplate {
  serviceId: string
  serviceName: string
  serviceDisplayName: string
  operationPatterns: OperationPattern[]
}

interface OperationPattern {
  pattern: string
  entities: EntityDefinition[]
  valueObjects: ValueObjectDefinition[]
  domainServices: DomainServiceDefinition[]
}

interface EntityDefinition {
  name: string
  displayName: string
  systemName: string
  attributes: AttributeDefinition[]
  businessRules: string[]
  states?: StateDefinition[]
}

interface AttributeDefinition {
  name: string
  displayName: string
  systemName: string
  type: string
  required: boolean
  description?: string
}

interface StateDefinition {
  name: string
  displayName: string
  description: string
}

interface ValueObjectDefinition {
  name: string
  displayName: string
  systemName: string
  attributes: AttributeDefinition[]
  businessRules: string[]
}

interface DomainServiceDefinition {
  name: string
  displayName: string
  systemName: string
  operations: string[]
}

/**
 * 認証サービス用のドメイン言語生成
 */
export function generateAuthServiceDomainLanguage(): string {
  const entities: EntityDefinition[] = [
    {
      name: 'User',
      displayName: 'ユーザー',
      systemName: 'USER',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'USER_ID', type: 'UUID', required: true },
        { name: 'email', displayName: 'メールアドレス', systemName: 'EMAIL', type: 'EMAIL', required: true },
        { name: 'passwordHash', displayName: 'パスワードハッシュ', systemName: 'PASSWORD_HASH', type: 'STRING_255', required: true },
        { name: 'name', displayName: '名前', systemName: 'NAME', type: 'STRING_100', required: true },
        { name: 'role', displayName: 'ロール', systemName: 'ROLE', type: 'ENUM', required: true },
        { name: 'organizationId', displayName: '組織ID', systemName: 'ORGANIZATION_ID', type: 'UUID', required: true },
        { name: 'isActive', displayName: 'アクティブフラグ', systemName: 'IS_ACTIVE', type: 'BOOLEAN', required: true },
        { name: 'lastLoginAt', displayName: '最終ログイン日時', systemName: 'LAST_LOGIN_AT', type: 'TIMESTAMP', required: false },
        { name: 'createdAt', displayName: '作成日時', systemName: 'CREATED_AT', type: 'TIMESTAMP', required: true },
        { name: 'updatedAt', displayName: '更新日時', systemName: 'UPDATED_AT', type: 'TIMESTAMP', required: true }
      ],
      businessRules: [
        'メールアドレスはシステム全体で一意であること',
        'パスワードは最低8文字以上で、英数字・記号を含むこと',
        'ユーザーは必ず1つの組織に所属すること',
        'ロールの変更は管理者権限が必要'
      ],
      states: [
        { name: 'ACTIVE', displayName: 'アクティブ', description: '通常利用可能な状態' },
        { name: 'INACTIVE', displayName: '非アクティブ', description: '一時的に利用停止中' },
        { name: 'SUSPENDED', displayName: '停止', description: '規約違反等による強制停止' },
        { name: 'PENDING', displayName: '承認待ち', description: '登録後の承認待ち状態' }
      ]
    },
    {
      name: 'Organization',
      displayName: '組織',
      systemName: 'ORGANIZATION',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'ORGANIZATION_ID', type: 'UUID', required: true },
        { name: 'name', displayName: '組織名', systemName: 'NAME', type: 'STRING_200', required: true },
        { name: 'code', displayName: '組織コード', systemName: 'CODE', type: 'STRING_20', required: true },
        { name: 'parentId', displayName: '親組織ID', systemName: 'PARENT_ID', type: 'UUID', required: false },
        { name: 'level', displayName: '階層レベル', systemName: 'LEVEL', type: 'INTEGER', required: true },
        { name: 'path', displayName: '階層パス', systemName: 'PATH', type: 'STRING_500', required: true },
        { name: 'isActive', displayName: 'アクティブフラグ', systemName: 'IS_ACTIVE', type: 'BOOLEAN', required: true }
      ],
      businessRules: [
        '組織コードは全社で一意',
        '階層は最大5レベルまで',
        '親組織の削除時は子組織も連動'
      ]
    },
    {
      name: 'Role',
      displayName: 'ロール',
      systemName: 'ROLE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'ROLE_ID', type: 'UUID', required: true },
        { name: 'name', displayName: 'ロール名', systemName: 'NAME', type: 'STRING_50', required: true },
        { name: 'displayName', displayName: '表示名', systemName: 'DISPLAY_NAME', type: 'STRING_100', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'permissions', displayName: '権限', systemName: 'PERMISSIONS', type: 'JSON', required: true },
        { name: 'isSystem', displayName: 'システムロール', systemName: 'IS_SYSTEM', type: 'BOOLEAN', required: true }
      ],
      businessRules: [
        'システムロールは変更・削除不可',
        'ロール名は一意',
        '権限は階層的に継承される'
      ]
    },
    {
      name: 'Session',
      displayName: 'セッション',
      systemName: 'SESSION',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'SESSION_ID', type: 'UUID', required: true },
        { name: 'userId', displayName: 'ユーザーID', systemName: 'USER_ID', type: 'UUID', required: true },
        { name: 'token', displayName: 'トークン', systemName: 'TOKEN', type: 'STRING_500', required: true },
        { name: 'ipAddress', displayName: 'IPアドレス', systemName: 'IP_ADDRESS', type: 'STRING_50', required: true },
        { name: 'userAgent', displayName: 'ユーザーエージェント', systemName: 'USER_AGENT', type: 'STRING_500', required: true },
        { name: 'expiresAt', displayName: '有効期限', systemName: 'EXPIRES_AT', type: 'TIMESTAMP', required: true },
        { name: 'createdAt', displayName: '作成日時', systemName: 'CREATED_AT', type: 'TIMESTAMP', required: true }
      ],
      businessRules: [
        'セッションは24時間で自動失効',
        '同一ユーザーのセッションは最大5つまで',
        '異常なアクセスパターンで自動無効化'
      ]
    },
    {
      name: 'AuditLog',
      displayName: '監査ログ',
      systemName: 'AUDIT_LOG',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'AUDIT_LOG_ID', type: 'UUID', required: true },
        { name: 'userId', displayName: 'ユーザーID', systemName: 'USER_ID', type: 'UUID', required: true },
        { name: 'action', displayName: 'アクション', systemName: 'ACTION', type: 'STRING_100', required: true },
        { name: 'targetType', displayName: '対象種別', systemName: 'TARGET_TYPE', type: 'STRING_50', required: true },
        { name: 'targetId', displayName: '対象ID', systemName: 'TARGET_ID', type: 'UUID', required: false },
        { name: 'changes', displayName: '変更内容', systemName: 'CHANGES', type: 'JSON', required: false },
        { name: 'ipAddress', displayName: 'IPアドレス', systemName: 'IP_ADDRESS', type: 'STRING_50', required: true },
        { name: 'timestamp', displayName: 'タイムスタンプ', systemName: 'TIMESTAMP', type: 'TIMESTAMP', required: true }
      ],
      businessRules: [
        '監査ログは削除不可',
        '法定保存期間は7年',
        'セキュリティ重要操作は必ず記録'
      ]
    }
  ]

  const valueObjects: ValueObjectDefinition[] = [
    {
      name: 'Email',
      displayName: 'メールアドレス',
      systemName: 'EMAIL',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'STRING_255', required: true }
      ],
      businessRules: [
        'RFC5322準拠の形式',
        '大文字小文字は区別しない',
        'ドメイン部分の存在確認'
      ]
    },
    {
      name: 'Password',
      displayName: 'パスワード',
      systemName: 'PASSWORD',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'STRING', required: true }
      ],
      businessRules: [
        '最低8文字以上',
        '英大文字・小文字・数字・記号を含む',
        '過去3回のパスワードとは異なる'
      ]
    },
    {
      name: 'IPAddress',
      displayName: 'IPアドレス',
      systemName: 'IP_ADDRESS',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'STRING_50', required: true }
      ],
      businessRules: [
        'IPv4またはIPv6形式',
        'プライベートIPアドレスの識別',
        '地理情報の推定'
      ]
    }
  ]

  const domainServices: DomainServiceDefinition[] = [
    {
      name: 'AuthenticationService',
      displayName: '認証サービス',
      systemName: 'AUTHENTICATION_SERVICE',
      operations: [
        'ユーザー認証（メール・パスワード）',
        '多要素認証の実行',
        'セッショントークンの発行',
        'セッションの検証',
        'ログアウト処理'
      ]
    },
    {
      name: 'AuthorizationService',
      displayName: '認可サービス',
      systemName: 'AUTHORIZATION_SERVICE',
      operations: [
        'リソースへのアクセス権限確認',
        'ロールベース権限の評価',
        '組織階層に基づく権限継承',
        '動的権限の計算'
      ]
    },
    {
      name: 'UserManagementService',
      displayName: 'ユーザー管理サービス',
      systemName: 'USER_MANAGEMENT_SERVICE',
      operations: [
        'ユーザー登録の実行',
        'プロファイル更新',
        'パスワードリセット',
        'アカウントの有効化・無効化',
        'ロール割り当て'
      ]
    },
    {
      name: 'AuditService',
      displayName: '監査サービス',
      systemName: 'AUDIT_SERVICE',
      operations: [
        '操作ログの記録',
        '異常アクセスの検知',
        'コンプライアンスレポート生成',
        'ログの長期保存'
      ]
    }
  ]

  return formatDomainLanguage({
    serviceName: 'セキュアアクセスサービス',
    entities,
    valueObjects,
    domainServices
  })
}

/**
 * プロジェクトサービス用のドメイン言語生成
 */
export function generateProjectServiceDomainLanguage(): string {
  const entities: EntityDefinition[] = [
    {
      name: 'Project',
      displayName: 'プロジェクト',
      systemName: 'PROJECT',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'code', displayName: 'プロジェクトコード', systemName: 'CODE', type: 'STRING_20', required: true },
        { name: 'name', displayName: 'プロジェクト名', systemName: 'NAME', type: 'STRING_200', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'clientId', displayName: 'クライアントID', systemName: 'CLIENT_ID', type: 'UUID', required: true },
        { name: 'startDate', displayName: '開始日', systemName: 'START_DATE', type: 'DATE', required: true },
        { name: 'endDate', displayName: '終了日', systemName: 'END_DATE', type: 'DATE', required: true },
        { name: 'budget', displayName: '予算', systemName: 'BUDGET', type: 'MONEY', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'pmId', displayName: 'PM_ID', systemName: 'PM_ID', type: 'UUID', required: true },
        { name: 'priority', displayName: '優先度', systemName: 'PRIORITY', type: 'ENUM', required: true }
      ],
      businessRules: [
        'プロジェクトコードは全社で一意',
        '終了日は開始日以降',
        'PMの割り当ては必須',
        '予算超過時は承認が必要'
      ],
      states: [
        { name: 'PLANNING', displayName: '計画中', description: 'プロジェクト計画策定中' },
        { name: 'ACTIVE', displayName: '進行中', description: 'プロジェクト実行中' },
        { name: 'ON_HOLD', displayName: '一時停止', description: '何らかの理由で一時停止' },
        { name: 'COMPLETED', displayName: '完了', description: '正常に完了' },
        { name: 'CANCELLED', displayName: '中止', description: 'プロジェクト中止' }
      ]
    },
    {
      name: 'Task',
      displayName: 'タスク',
      systemName: 'TASK',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'TASK_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'parentTaskId', displayName: '親タスクID', systemName: 'PARENT_TASK_ID', type: 'UUID', required: false },
        { name: 'title', displayName: 'タイトル', systemName: 'TITLE', type: 'STRING_200', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'assigneeId', displayName: '担当者ID', systemName: 'ASSIGNEE_ID', type: 'UUID', required: false },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'priority', displayName: '優先度', systemName: 'PRIORITY', type: 'ENUM', required: true },
        { name: 'estimatedHours', displayName: '見積工数', systemName: 'ESTIMATED_HOURS', type: 'DECIMAL', required: false },
        { name: 'actualHours', displayName: '実績工数', systemName: 'ACTUAL_HOURS', type: 'DECIMAL', required: false },
        { name: 'startDate', displayName: '開始日', systemName: 'START_DATE', type: 'DATE', required: false },
        { name: 'dueDate', displayName: '期限', systemName: 'DUE_DATE', type: 'DATE', required: false },
        { name: 'completedDate', displayName: '完了日', systemName: 'COMPLETED_DATE', type: 'DATE', required: false }
      ],
      businessRules: [
        'タスクは必ずプロジェクトに所属',
        '親タスクの完了には子タスクの完了が必要',
        '実績工数は見積の200%を超えたら警告',
        '期限超過は自動でアラート'
      ],
      states: [
        { name: 'TODO', displayName: '未着手', description: 'まだ開始していない' },
        { name: 'IN_PROGRESS', displayName: '進行中', description: '作業中' },
        { name: 'IN_REVIEW', displayName: 'レビュー中', description: 'レビュー待ち' },
        { name: 'DONE', displayName: '完了', description: '作業完了' },
        { name: 'BLOCKED', displayName: 'ブロック', description: '何らかの理由で進行不可' }
      ]
    },
    {
      name: 'Milestone',
      displayName: 'マイルストーン',
      systemName: 'MILESTONE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'MILESTONE_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'name', displayName: '名称', systemName: 'NAME', type: 'STRING_200', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'targetDate', displayName: '目標日', systemName: 'TARGET_DATE', type: 'DATE', required: true },
        { name: 'actualDate', displayName: '実績日', systemName: 'ACTUAL_DATE', type: 'DATE', required: false },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'deliverables', displayName: '成果物', systemName: 'DELIVERABLES', type: 'JSON', required: false }
      ],
      businessRules: [
        'マイルストーンはプロジェクトの重要な節目',
        '達成条件を明確に定義',
        '遅延時は影響分析を実施'
      ]
    },
    {
      name: 'Risk',
      displayName: 'リスク',
      systemName: 'RISK',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'RISK_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'title', displayName: 'タイトル', systemName: 'TITLE', type: 'STRING_200', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: true },
        { name: 'category', displayName: 'カテゴリ', systemName: 'CATEGORY', type: 'ENUM', required: true },
        { name: 'probability', displayName: '発生確率', systemName: 'PROBABILITY', type: 'ENUM', required: true },
        { name: 'impact', displayName: '影響度', systemName: 'IMPACT', type: 'ENUM', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'mitigationPlan', displayName: '対策', systemName: 'MITIGATION_PLAN', type: 'TEXT', required: false },
        { name: 'owner', displayName: '責任者', systemName: 'OWNER', type: 'UUID', required: true },
        { name: 'identifiedDate', displayName: '識別日', systemName: 'IDENTIFIED_DATE', type: 'DATE', required: true },
        { name: 'reviewDate', displayName: 'レビュー日', systemName: 'REVIEW_DATE', type: 'DATE', required: false }
      ],
      businessRules: [
        'リスクスコア = 発生確率 × 影響度',
        '高リスクは週次でレビュー',
        '対策実施後は効果測定を実施'
      ]
    },
    {
      name: 'Issue',
      displayName: '課題',
      systemName: 'ISSUE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'ISSUE_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'title', displayName: 'タイトル', systemName: 'TITLE', type: 'STRING_200', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: true },
        { name: 'category', displayName: 'カテゴリ', systemName: 'CATEGORY', type: 'ENUM', required: true },
        { name: 'severity', displayName: '深刻度', systemName: 'SEVERITY', type: 'ENUM', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'assignee', displayName: '担当者', systemName: 'ASSIGNEE', type: 'UUID', required: true },
        { name: 'dueDate', displayName: '期限', systemName: 'DUE_DATE', type: 'DATE', required: false },
        { name: 'resolvedDate', displayName: '解決日', systemName: 'RESOLVED_DATE', type: 'DATE', required: false }
      ],
      businessRules: [
        '課題は48時間以内に初動対応',
        '重大課題はエスカレーション必須',
        '解決後は再発防止策を策定'
      ]
    },
    {
      name: 'Deliverable',
      displayName: '成果物',
      systemName: 'DELIVERABLE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'DELIVERABLE_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'name', displayName: '名称', systemName: 'NAME', type: 'STRING_200', required: true },
        { name: 'type', displayName: '種別', systemName: 'TYPE', type: 'ENUM', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'version', displayName: 'バージョン', systemName: 'VERSION', type: 'STRING_20', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'filePath', displayName: 'ファイルパス', systemName: 'FILE_PATH', type: 'STRING_500', required: false },
        { name: 'reviewStatus', displayName: 'レビューステータス', systemName: 'REVIEW_STATUS', type: 'ENUM', required: true },
        { name: 'submittedDate', displayName: '提出日', systemName: 'SUBMITTED_DATE', type: 'DATE', required: false },
        { name: 'approvedDate', displayName: '承認日', systemName: 'APPROVED_DATE', type: 'DATE', required: false }
      ],
      businessRules: [
        '成果物は必ずレビューを経て提出',
        'バージョン管理は必須',
        'クライアント承認で正式版'
      ]
    }
  ]

  const valueObjects: ValueObjectDefinition[] = [
    {
      name: 'ProjectCode',
      displayName: 'プロジェクトコード',
      systemName: 'PROJECT_CODE',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'STRING_20', required: true }
      ],
      businessRules: [
        'フォーマット: PRJ-YYYY-NNNN',
        '年度内で連番',
        '一度発番されたら変更不可'
      ]
    },
    {
      name: 'Priority',
      displayName: '優先度',
      systemName: 'PRIORITY',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'ENUM', required: true }
      ],
      businessRules: [
        '5段階評価（Critical, High, Medium, Low, Trivial）',
        '優先度による作業順序の自動調整'
      ]
    },
    {
      name: 'Progress',
      displayName: '進捗率',
      systemName: 'PROGRESS',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'PERCENTAGE', required: true }
      ],
      businessRules: [
        '0-100%の範囲',
        'タスクの重み付け考慮',
        '子タスクから自動計算'
      ]
    }
  ]

  const domainServices: DomainServiceDefinition[] = [
    {
      name: 'ProjectPlanningService',
      displayName: 'プロジェクト計画サービス',
      systemName: 'PROJECT_PLANNING_SERVICE',
      operations: [
        'WBS（作業分解構造）の作成',
        'リソース計画の策定',
        'スケジュール最適化',
        'クリティカルパスの算出',
        'バッファー管理'
      ]
    },
    {
      name: 'RiskManagementService',
      displayName: 'リスク管理サービス',
      systemName: 'RISK_MANAGEMENT_SERVICE',
      operations: [
        'リスクアセスメント実施',
        'リスクスコア計算',
        '対策効果の測定',
        'リスクレポート生成',
        '早期警告アラート'
      ]
    },
    {
      name: 'ProgressTrackingService',
      displayName: '進捗管理サービス',
      systemName: 'PROGRESS_TRACKING_SERVICE',
      operations: [
        '進捗率の自動計算',
        'EVMによる進捗分析',
        'バーンダウンチャート生成',
        '遅延タスクの特定',
        '完了予測'
      ]
    },
    {
      name: 'QualityAssuranceService',
      displayName: '品質保証サービス',
      systemName: 'QUALITY_ASSURANCE_SERVICE',
      operations: [
        'レビュープロセス管理',
        '品質メトリクス収集',
        '欠陥密度の分析',
        '品質レポート作成'
      ]
    }
  ]

  return formatDomainLanguage({
    serviceName: 'プロジェクト成功支援サービス',
    entities,
    valueObjects,
    domainServices
  })
}

/**
 * リソースサービス用のドメイン言語生成
 */
export function generateResourceServiceDomainLanguage(): string {
  const entities: EntityDefinition[] = [
    {
      name: 'Member',
      displayName: 'メンバー',
      systemName: 'MEMBER',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'MEMBER_ID', type: 'UUID', required: true },
        { name: 'userId', displayName: 'ユーザーID', systemName: 'USER_ID', type: 'UUID', required: true },
        { name: 'employeeCode', displayName: '社員番号', systemName: 'EMPLOYEE_CODE', type: 'STRING_20', required: true },
        { name: 'department', displayName: '部門', systemName: 'DEPARTMENT', type: 'STRING_100', required: true },
        { name: 'position', displayName: '役職', systemName: 'POSITION', type: 'STRING_100', required: true },
        { name: 'level', displayName: 'レベル', systemName: 'LEVEL', type: 'ENUM', required: true },
        { name: 'utilization', displayName: '稼働率', systemName: 'UTILIZATION', type: 'PERCENTAGE', required: false },
        { name: 'availableFrom', displayName: 'アサイン可能日', systemName: 'AVAILABLE_FROM', type: 'DATE', required: false },
        { name: 'costRate', displayName: '単価', systemName: 'COST_RATE', type: 'MONEY', required: true }
      ],
      businessRules: [
        'メンバーは複数のチームに所属可能',
        '稼働率は100%を超えない',
        '単価はレベルに応じて設定'
      ]
    },
    {
      name: 'Team',
      displayName: 'チーム',
      systemName: 'TEAM',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'TEAM_ID', type: 'UUID', required: true },
        { name: 'name', displayName: 'チーム名', systemName: 'NAME', type: 'STRING_100', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'leaderId', displayName: 'リーダーID', systemName: 'LEADER_ID', type: 'UUID', required: true },
        { name: 'startDate', displayName: '開始日', systemName: 'START_DATE', type: 'DATE', required: true },
        { name: 'endDate', displayName: '終了日', systemName: 'END_DATE', type: 'DATE', required: false },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true }
      ],
      businessRules: [
        'チームには必ずリーダーが必要',
        '最小構成は3名以上',
        'スキルバランスを考慮'
      ]
    },
    {
      name: 'Skill',
      displayName: 'スキル',
      systemName: 'SKILL',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'SKILL_ID', type: 'UUID', required: true },
        { name: 'name', displayName: 'スキル名', systemName: 'NAME', type: 'STRING_100', required: true },
        { name: 'category', displayName: 'カテゴリ', systemName: 'CATEGORY', type: 'ENUM', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'levels', displayName: 'レベル定義', systemName: 'LEVELS', type: 'JSON', required: true }
      ],
      businessRules: [
        'スキルは階層的に管理',
        'レベルは5段階評価',
        '定期的な見直しが必要'
      ]
    },
    {
      name: 'MemberSkill',
      displayName: 'メンバースキル',
      systemName: 'MEMBER_SKILL',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'MEMBER_SKILL_ID', type: 'UUID', required: true },
        { name: 'memberId', displayName: 'メンバーID', systemName: 'MEMBER_ID', type: 'UUID', required: true },
        { name: 'skillId', displayName: 'スキルID', systemName: 'SKILL_ID', type: 'UUID', required: true },
        { name: 'level', displayName: 'レベル', systemName: 'LEVEL', type: 'INTEGER', required: true },
        { name: 'experience', displayName: '経験年数', systemName: 'EXPERIENCE', type: 'DECIMAL', required: true },
        { name: 'certifications', displayName: '資格', systemName: 'CERTIFICATIONS', type: 'JSON', required: false },
        { name: 'evaluatedDate', displayName: '評価日', systemName: 'EVALUATED_DATE', type: 'DATE', required: true }
      ],
      businessRules: [
        'スキルレベルは客観的評価',
        '年次でスキル棚卸し実施',
        '資格取得でレベルアップ'
      ]
    },
    {
      name: 'Assignment',
      displayName: 'アサインメント',
      systemName: 'ASSIGNMENT',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'ASSIGNMENT_ID', type: 'UUID', required: true },
        { name: 'memberId', displayName: 'メンバーID', systemName: 'MEMBER_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'teamId', displayName: 'チームID', systemName: 'TEAM_ID', type: 'UUID', required: false },
        { name: 'role', displayName: 'ロール', systemName: 'ROLE', type: 'ENUM', required: true },
        { name: 'allocation', displayName: '配分率', systemName: 'ALLOCATION', type: 'PERCENTAGE', required: true },
        { name: 'startDate', displayName: '開始日', systemName: 'START_DATE', type: 'DATE', required: true },
        { name: 'endDate', displayName: '終了日', systemName: 'END_DATE', type: 'DATE', required: false },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true }
      ],
      businessRules: [
        '合計配分率は100%以下',
        '期間の重複チェック',
        'スキルマッチングを考慮'
      ]
    }
  ]

  const valueObjects: ValueObjectDefinition[] = [
    {
      name: 'SkillLevel',
      displayName: 'スキルレベル',
      systemName: 'SKILL_LEVEL',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'INTEGER', required: true }
      ],
      businessRules: [
        'レベル1: 初級（研修済み）',
        'レベル2: 基礎（指導下で実施可能）',
        'レベル3: 中級（独力で実施可能）',
        'レベル4: 上級（指導可能）',
        'レベル5: エキスパート（組織をリード）'
      ]
    },
    {
      name: 'Utilization',
      displayName: '稼働率',
      systemName: 'UTILIZATION',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'PERCENTAGE', required: true }
      ],
      businessRules: [
        '0-100%の範囲',
        '85%以上が理想',
        '100%超過は警告'
      ]
    },
    {
      name: 'CostRate',
      displayName: '単価',
      systemName: 'COST_RATE',
      attributes: [
        { name: 'amount', displayName: '金額', systemName: 'AMOUNT', type: 'DECIMAL', required: true },
        { name: 'unit', displayName: '単位', systemName: 'UNIT', type: 'ENUM', required: true }
      ],
      businessRules: [
        '時間単価または月額単価',
        'レベルと連動',
        '年次改定'
      ]
    }
  ]

  const domainServices: DomainServiceDefinition[] = [
    {
      name: 'ResourceAllocationService',
      displayName: 'リソース配分サービス',
      systemName: 'RESOURCE_ALLOCATION_SERVICE',
      operations: [
        '最適配置の計算',
        'スキルマッチング',
        '稼働率の最適化',
        'コンフリクト検出',
        '将来予測'
      ]
    },
    {
      name: 'SkillDevelopmentService',
      displayName: 'スキル開発サービス',
      systemName: 'SKILL_DEVELOPMENT_SERVICE',
      operations: [
        'スキルギャップ分析',
        '育成計画策定',
        '研修推奨',
        'キャリアパス提案',
        'スキル評価'
      ]
    },
    {
      name: 'TeamBuildingService',
      displayName: 'チーム編成サービス',
      systemName: 'TEAM_BUILDING_SERVICE',
      operations: [
        '最適チーム構成の提案',
        'スキルバランス評価',
        'コミュニケーション分析',
        'パフォーマンス予測'
      ]
    }
  ]

  return formatDomainLanguage({
    serviceName: 'タレント最適化サービス',
    entities,
    valueObjects,
    domainServices
  })
}

/**
 * 生産性可視化サービス（タイムシート）用のドメイン言語生成
 */
export function generateTimesheetServiceDomainLanguage(): string {
  const entities: EntityDefinition[] = [
    {
      name: 'TimeEntry',
      displayName: '工数入力',
      systemName: 'TIME_ENTRY',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'TIME_ENTRY_ID', type: 'UUID', required: true },
        { name: 'memberId', displayName: 'メンバーID', systemName: 'MEMBER_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'taskId', displayName: 'タスクID', systemName: 'TASK_ID', type: 'UUID', required: false },
        { name: 'date', displayName: '日付', systemName: 'DATE', type: 'DATE', required: true },
        { name: 'hours', displayName: '工数', systemName: 'HOURS', type: 'DECIMAL', required: true },
        { name: 'description', displayName: '作業内容', systemName: 'DESCRIPTION', type: 'TEXT', required: true },
        { name: 'category', displayName: 'カテゴリ', systemName: 'CATEGORY', type: 'ENUM', required: true },
        { name: 'billable', displayName: '請求可能', systemName: 'BILLABLE', type: 'BOOLEAN', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true }
      ],
      businessRules: [
        '1日の合計工数は24時間以下',
        '0.25時間（15分）単位で入力',
        '過去1ヶ月以内のみ編集可能',
        '承認後は編集不可'
      ]
    },
    {
      name: 'Timesheet',
      displayName: 'タイムシート',
      systemName: 'TIMESHEET',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'TIMESHEET_ID', type: 'UUID', required: true },
        { name: 'memberId', displayName: 'メンバーID', systemName: 'MEMBER_ID', type: 'UUID', required: true },
        { name: 'periodStart', displayName: '期間開始', systemName: 'PERIOD_START', type: 'DATE', required: true },
        { name: 'periodEnd', displayName: '期間終了', systemName: 'PERIOD_END', type: 'DATE', required: true },
        { name: 'totalHours', displayName: '合計工数', systemName: 'TOTAL_HOURS', type: 'DECIMAL', required: true },
        { name: 'billableHours', displayName: '請求可能工数', systemName: 'BILLABLE_HOURS', type: 'DECIMAL', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'submittedDate', displayName: '提出日', systemName: 'SUBMITTED_DATE', type: 'TIMESTAMP', required: false },
        { name: 'approvedDate', displayName: '承認日', systemName: 'APPROVED_DATE', type: 'TIMESTAMP', required: false },
        { name: 'approvedBy', displayName: '承認者', systemName: 'APPROVED_BY', type: 'UUID', required: false }
      ],
      businessRules: [
        '週次または月次で集計',
        '期限までに提出必須',
        '承認プロセスは組織階層に従う',
        '承認後の修正は再承認が必要'
      ]
    },
    {
      name: 'ApprovalFlow',
      displayName: '承認フロー',
      systemName: 'APPROVAL_FLOW',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'APPROVAL_FLOW_ID', type: 'UUID', required: true },
        { name: 'timesheetId', displayName: 'タイムシートID', systemName: 'TIMESHEET_ID', type: 'UUID', required: true },
        { name: 'step', displayName: 'ステップ', systemName: 'STEP', type: 'INTEGER', required: true },
        { name: 'approverId', displayName: '承認者ID', systemName: 'APPROVER_ID', type: 'UUID', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'comments', displayName: 'コメント', systemName: 'COMMENTS', type: 'TEXT', required: false },
        { name: 'actionDate', displayName: 'アクション日時', systemName: 'ACTION_DATE', type: 'TIMESTAMP', required: false }
      ],
      businessRules: [
        '承認は順序通りに実施',
        '却下時は理由必須',
        'エスカレーション可能'
      ]
    },
    {
      name: 'ProductivityMetrics',
      displayName: '生産性指標',
      systemName: 'PRODUCTIVITY_METRICS',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'PRODUCTIVITY_METRICS_ID', type: 'UUID', required: true },
        { name: 'memberId', displayName: 'メンバーID', systemName: 'MEMBER_ID', type: 'UUID', required: false },
        { name: 'teamId', displayName: 'チームID', systemName: 'TEAM_ID', type: 'UUID', required: false },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: false },
        { name: 'period', displayName: '期間', systemName: 'PERIOD', type: 'STRING_20', required: true },
        { name: 'utilization', displayName: '稼働率', systemName: 'UTILIZATION', type: 'PERCENTAGE', required: true },
        { name: 'billability', displayName: '請求可能率', systemName: 'BILLABILITY', type: 'PERCENTAGE', required: true },
        { name: 'overtime', displayName: '残業時間', systemName: 'OVERTIME', type: 'DECIMAL', required: true },
        { name: 'efficiency', displayName: '効率性', systemName: 'EFFICIENCY', type: 'PERCENTAGE', required: false }
      ],
      businessRules: [
        '月次で自動集計',
        'ベンチマークとの比較',
        '改善提案の自動生成'
      ]
    }
  ]

  const valueObjects: ValueObjectDefinition[] = [
    {
      name: 'WorkHours',
      displayName: '作業工数',
      systemName: 'WORK_HOURS',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'DECIMAL', required: true }
      ],
      businessRules: [
        '0.25時間（15分）単位',
        '1日最大24時間',
        '週40時間を標準'
      ]
    },
    {
      name: 'ApprovalStatus',
      displayName: '承認ステータス',
      systemName: 'APPROVAL_STATUS',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'ENUM', required: true }
      ],
      businessRules: [
        'DRAFT: 下書き',
        'SUBMITTED: 提出済み',
        'APPROVED: 承認済み',
        'REJECTED: 却下',
        'REVISION: 修正依頼'
      ]
    },
    {
      name: 'BillableRate',
      displayName: '請求可能率',
      systemName: 'BILLABLE_RATE',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'PERCENTAGE', required: true }
      ],
      businessRules: [
        '目標値: 70%以上',
        '部門・役職により異なる',
        '四半期ごとに見直し'
      ]
    }
  ]

  const domainServices: DomainServiceDefinition[] = [
    {
      name: 'TimeTrackingService',
      displayName: '工数記録サービス',
      systemName: 'TIME_TRACKING_SERVICE',
      operations: [
        '工数の自動集計',
        '入力漏れの検出',
        '異常値の警告',
        '定期リマインド送信',
        'カレンダー連携'
      ]
    },
    {
      name: 'ApprovalManagementService',
      displayName: '承認管理サービス',
      systemName: 'APPROVAL_MANAGEMENT_SERVICE',
      operations: [
        '承認ルートの決定',
        '承認依頼の送信',
        '承認期限の管理',
        'エスカレーション処理',
        '承認履歴の記録'
      ]
    },
    {
      name: 'ProductivityAnalysisService',
      displayName: '生産性分析サービス',
      systemName: 'PRODUCTIVITY_ANALYSIS_SERVICE',
      operations: [
        '稼働率の計算',
        '請求可能率の分析',
        'トレンド分析',
        'ベンチマーク比較',
        '改善提案生成'
      ]
    }
  ]

  return formatDomainLanguage({
    serviceName: '生産性可視化サービス',
    entities,
    valueObjects,
    domainServices
  })
}

/**
 * ナレッジ共創サービス用のドメイン言語生成
 */
export function generateKnowledgeServiceDomainLanguage(): string {
  const entities: EntityDefinition[] = [
    {
      name: 'Article',
      displayName: '記事',
      systemName: 'ARTICLE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'ARTICLE_ID', type: 'UUID', required: true },
        { name: 'title', displayName: 'タイトル', systemName: 'TITLE', type: 'STRING_200', required: true },
        { name: 'content', displayName: '本文', systemName: 'CONTENT', type: 'MARKDOWN', required: true },
        { name: 'summary', displayName: '要約', systemName: 'SUMMARY', type: 'TEXT', required: false },
        { name: 'categoryId', displayName: 'カテゴリID', systemName: 'CATEGORY_ID', type: 'UUID', required: true },
        { name: 'authorId', displayName: '作成者ID', systemName: 'AUTHOR_ID', type: 'UUID', required: true },
        { name: 'tags', displayName: 'タグ', systemName: 'TAGS', type: 'JSON', required: false },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'viewCount', displayName: '閲覧数', systemName: 'VIEW_COUNT', type: 'INTEGER', required: true },
        { name: 'likeCount', displayName: 'いいね数', systemName: 'LIKE_COUNT', type: 'INTEGER', required: true },
        { name: 'publishedDate', displayName: '公開日', systemName: 'PUBLISHED_DATE', type: 'TIMESTAMP', required: false },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: false }
      ],
      businessRules: [
        '公開前にレビュー必須',
        '機密情報のチェック',
        'タグは最大10個まで',
        'プロジェクト固有の知識は紐付け必須'
      ]
    },
    {
      name: 'Category',
      displayName: 'カテゴリ',
      systemName: 'CATEGORY',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'CATEGORY_ID', type: 'UUID', required: true },
        { name: 'name', displayName: 'カテゴリ名', systemName: 'NAME', type: 'STRING_100', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'parentId', displayName: '親カテゴリID', systemName: 'PARENT_ID', type: 'UUID', required: false },
        { name: 'path', displayName: 'パス', systemName: 'PATH', type: 'STRING_500', required: true },
        { name: 'order', displayName: '表示順', systemName: 'ORDER', type: 'INTEGER', required: true }
      ],
      businessRules: [
        'カテゴリは階層構造',
        '最大3階層まで',
        'パスは自動生成'
      ]
    },
    {
      name: 'Template',
      displayName: 'テンプレート',
      systemName: 'TEMPLATE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'TEMPLATE_ID', type: 'UUID', required: true },
        { name: 'name', displayName: 'テンプレート名', systemName: 'NAME', type: 'STRING_200', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'content', displayName: '内容', systemName: 'CONTENT', type: 'MARKDOWN', required: true },
        { name: 'categoryId', displayName: 'カテゴリID', systemName: 'CATEGORY_ID', type: 'UUID', required: true },
        { name: 'variables', displayName: '変数定義', systemName: 'VARIABLES', type: 'JSON', required: false },
        { name: 'usageCount', displayName: '使用回数', systemName: 'USAGE_COUNT', type: 'INTEGER', required: true },
        { name: 'rating', displayName: '評価', systemName: 'RATING', type: 'DECIMAL', required: false }
      ],
      businessRules: [
        'テンプレートは再利用可能',
        '変数置換機能を提供',
        '使用頻度で推奨順位決定'
      ]
    },
    {
      name: 'FAQ',
      displayName: 'FAQ',
      systemName: 'FAQ',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'FAQ_ID', type: 'UUID', required: true },
        { name: 'question', displayName: '質問', systemName: 'QUESTION', type: 'TEXT', required: true },
        { name: 'answer', displayName: '回答', systemName: 'ANSWER', type: 'MARKDOWN', required: true },
        { name: 'categoryId', displayName: 'カテゴリID', systemName: 'CATEGORY_ID', type: 'UUID', required: true },
        { name: 'keywords', displayName: 'キーワード', systemName: 'KEYWORDS', type: 'JSON', required: false },
        { name: 'viewCount', displayName: '閲覧数', systemName: 'VIEW_COUNT', type: 'INTEGER', required: true },
        { name: 'helpfulCount', displayName: '役立ち数', systemName: 'HELPFUL_COUNT', type: 'INTEGER', required: true },
        { name: 'relatedFAQs', displayName: '関連FAQ', systemName: 'RELATED_FAQS', type: 'JSON', required: false }
      ],
      businessRules: [
        '質問は明確かつ簡潔に',
        '回答は実例を含める',
        '関連FAQを自動推薦'
      ]
    },
    {
      name: 'Expert',
      displayName: 'エキスパート',
      systemName: 'EXPERT',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'EXPERT_ID', type: 'UUID', required: true },
        { name: 'memberId', displayName: 'メンバーID', systemName: 'MEMBER_ID', type: 'UUID', required: true },
        { name: 'expertiseAreas', displayName: '専門領域', systemName: 'EXPERTISE_AREAS', type: 'JSON', required: true },
        { name: 'bio', displayName: '経歴', systemName: 'BIO', type: 'TEXT', required: false },
        { name: 'achievements', displayName: '実績', systemName: 'ACHIEVEMENTS', type: 'JSON', required: false },
        { name: 'availability', displayName: '対応可能時間', systemName: 'AVAILABILITY', type: 'JSON', required: false },
        { name: 'rating', displayName: '評価', systemName: 'RATING', type: 'DECIMAL', required: false },
        { name: 'consultationCount', displayName: '相談回数', systemName: 'CONSULTATION_COUNT', type: 'INTEGER', required: true }
      ],
      businessRules: [
        '専門性の客観的評価',
        '実績に基づく認定',
        '定期的な更新必須'
      ]
    },
    {
      name: 'KnowledgeRequest',
      displayName: '知識リクエスト',
      systemName: 'KNOWLEDGE_REQUEST',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'KNOWLEDGE_REQUEST_ID', type: 'UUID', required: true },
        { name: 'title', displayName: 'タイトル', systemName: 'TITLE', type: 'STRING_200', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: true },
        { name: 'requesterId', displayName: 'リクエスト者ID', systemName: 'REQUESTER_ID', type: 'UUID', required: true },
        { name: 'categoryId', displayName: 'カテゴリID', systemName: 'CATEGORY_ID', type: 'UUID', required: true },
        { name: 'priority', displayName: '優先度', systemName: 'PRIORITY', type: 'ENUM', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'deadline', displayName: '期限', systemName: 'DEADLINE', type: 'DATE', required: false },
        { name: 'assignedExpertId', displayName: '担当エキスパートID', systemName: 'ASSIGNED_EXPERT_ID', type: 'UUID', required: false }
      ],
      businessRules: [
        '優先度に基づく対応',
        'エキスパートへの自動マッチング',
        'SLAに基づく期限管理'
      ]
    }
  ]

  const valueObjects: ValueObjectDefinition[] = [
    {
      name: 'Tag',
      displayName: 'タグ',
      systemName: 'TAG',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'STRING_50', required: true }
      ],
      businessRules: [
        '小文字に正規化',
        '特殊文字は除外',
        '最大20文字'
      ]
    },
    {
      name: 'Rating',
      displayName: '評価',
      systemName: 'RATING',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'DECIMAL', required: true }
      ],
      businessRules: [
        '5段階評価（1.0-5.0）',
        '小数点1位まで',
        '複数評価の平均値'
      ]
    },
    {
      name: 'SearchQuery',
      displayName: '検索クエリ',
      systemName: 'SEARCH_QUERY',
      attributes: [
        { name: 'keywords', displayName: 'キーワード', systemName: 'KEYWORDS', type: 'STRING_500', required: true },
        { name: 'filters', displayName: 'フィルタ', systemName: 'FILTERS', type: 'JSON', required: false }
      ],
      businessRules: [
        '全文検索対応',
        'あいまい検索',
        '類義語展開'
      ]
    }
  ]

  const domainServices: DomainServiceDefinition[] = [
    {
      name: 'KnowledgeSearchService',
      displayName: '知識検索サービス',
      systemName: 'KNOWLEDGE_SEARCH_SERVICE',
      operations: [
        '全文検索の実行',
        '関連記事の推薦',
        '検索結果のランキング',
        '検索履歴の分析',
        'パーソナライズ検索'
      ]
    },
    {
      name: 'ContentReviewService',
      displayName: 'コンテンツレビューサービス',
      systemName: 'CONTENT_REVIEW_SERVICE',
      operations: [
        '品質チェック実施',
        '機密情報の検出',
        'レビューワークフロー管理',
        '改善提案の生成'
      ]
    },
    {
      name: 'ExpertMatchingService',
      displayName: 'エキスパートマッチングサービス',
      systemName: 'EXPERT_MATCHING_SERVICE',
      operations: [
        '専門性のマッチング',
        '利用可能性の確認',
        '過去実績の評価',
        '最適エキスパートの推薦'
      ]
    },
    {
      name: 'KnowledgeAnalyticsService',
      displayName: '知識分析サービス',
      systemName: 'KNOWLEDGE_ANALYTICS_SERVICE',
      operations: [
        '利用状況の分析',
        'ナレッジギャップの特定',
        'トレンド分析',
        '価値評価の実施'
      ]
    }
  ]

  return formatDomainLanguage({
    serviceName: 'ナレッジ共創サービス',
    entities,
    valueObjects,
    domainServices
  })
}

/**
 * 収益最適化サービス（財務）用のドメイン言語生成
 */
export function generateFinanceServiceDomainLanguage(): string {
  const entities: EntityDefinition[] = [
    {
      name: 'Revenue',
      displayName: '収益',
      systemName: 'REVENUE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'REVENUE_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'type', displayName: '収益種別', systemName: 'TYPE', type: 'ENUM', required: true },
        { name: 'amount', displayName: '金額', systemName: 'AMOUNT', type: 'MONEY', required: true },
        { name: 'recordedDate', displayName: '記録日', systemName: 'RECORDED_DATE', type: 'DATE', required: true },
        { name: 'recognitionPeriod', displayName: '認識期間', systemName: 'RECOGNITION_PERIOD', type: 'STRING_20', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'approvedBy', displayName: '承認者ID', systemName: 'APPROVED_BY', type: 'UUID', required: false },
        { name: 'approvedDate', displayName: '承認日', systemName: 'APPROVED_DATE', type: 'DATE', required: false }
      ],
      businessRules: [
        '収益認識基準に従って計上',
        'プロジェクト完了時またはマイルストーン達成時に認識',
        '承認後の修正は原則不可'
      ]
    },
    {
      name: 'Cost',
      displayName: 'コスト',
      systemName: 'COST',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'COST_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'type', displayName: 'コスト種別', systemName: 'TYPE', type: 'ENUM', required: true },
        { name: 'amount', displayName: '金額', systemName: 'AMOUNT', type: 'MONEY', required: true },
        { name: 'incurredDate', displayName: '発生日', systemName: 'INCURRED_DATE', type: 'DATE', required: true },
        { name: 'memberId', displayName: 'メンバーID', systemName: 'MEMBER_ID', type: 'UUID', required: false },
        { name: 'hours', displayName: '工数', systemName: 'HOURS', type: 'DECIMAL', required: false },
        { name: 'rate', displayName: '単価', systemName: 'RATE', type: 'MONEY', required: false },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true }
      ],
      businessRules: [
        '人件費は工数×単価で自動計算',
        '経費は領収書と紐付け必須',
        '承認フロー完了後に確定'
      ]
    },
    {
      name: 'Invoice',
      displayName: '請求書',
      systemName: 'INVOICE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'INVOICE_ID', type: 'UUID', required: true },
        { name: 'invoiceNumber', displayName: '請求書番号', systemName: 'INVOICE_NUMBER', type: 'STRING_20', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'clientId', displayName: 'クライアントID', systemName: 'CLIENT_ID', type: 'UUID', required: true },
        { name: 'invoiceDate', displayName: '請求日', systemName: 'INVOICE_DATE', type: 'DATE', required: true },
        { name: 'dueDate', displayName: '支払期限', systemName: 'DUE_DATE', type: 'DATE', required: true },
        { name: 'amount', displayName: '請求額', systemName: 'AMOUNT', type: 'MONEY', required: true },
        { name: 'taxAmount', displayName: '税額', systemName: 'TAX_AMOUNT', type: 'MONEY', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'paidDate', displayName: '入金日', systemName: 'PAID_DATE', type: 'DATE', required: false }
      ],
      businessRules: [
        '請求書番号は全社で一意',
        '支払期限は請求日から30日後が標準',
        '入金確認後にステータスを「入金済」に変更'
      ]
    },
    {
      name: 'Budget',
      displayName: '予算',
      systemName: 'BUDGET',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'BUDGET_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'type', displayName: '予算種別', systemName: 'TYPE', type: 'ENUM', required: true },
        { name: 'plannedAmount', displayName: '予算額', systemName: 'PLANNED_AMOUNT', type: 'MONEY', required: true },
        { name: 'actualAmount', displayName: '実績額', systemName: 'ACTUAL_AMOUNT', type: 'MONEY', required: true },
        { name: 'period', displayName: '期間', systemName: 'PERIOD', type: 'STRING_20', required: true },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'approvedDate', displayName: '承認日', systemName: 'APPROVED_DATE', type: 'DATE', required: false }
      ],
      businessRules: [
        '予算はPMの承認が必須',
        '実績が予算の90%を超えたらアラート',
        '予算超過には追加承認が必要'
      ]
    },
    {
      name: 'Expense',
      displayName: '経費',
      systemName: 'EXPENSE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'EXPENSE_ID', type: 'UUID', required: true },
        { name: 'memberId', displayName: 'メンバーID', systemName: 'MEMBER_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'type', displayName: '経費種別', systemName: 'TYPE', type: 'ENUM', required: true },
        { name: 'amount', displayName: '金額', systemName: 'AMOUNT', type: 'MONEY', required: true },
        { name: 'expenseDate', displayName: '発生日', systemName: 'EXPENSE_DATE', type: 'DATE', required: true },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: true },
        { name: 'receiptUrl', displayName: '領収書URL', systemName: 'RECEIPT_URL', type: 'STRING_500', required: false },
        { name: 'status', displayName: 'ステータス', systemName: 'STATUS', type: 'ENUM', required: true },
        { name: 'approvedBy', displayName: '承認者ID', systemName: 'APPROVED_BY', type: 'UUID', required: false }
      ],
      businessRules: [
        '領収書の添付が必須（5000円以上）',
        '交通費は最安ルートが原則',
        '経費精算は月次で実施'
      ]
    },
    {
      name: 'ProfitabilityAnalysis',
      displayName: '収益性分析',
      systemName: 'PROFITABILITY_ANALYSIS',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'PROFITABILITY_ANALYSIS_ID', type: 'UUID', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: true },
        { name: 'analysisPeriod', displayName: '分析期間', systemName: 'ANALYSIS_PERIOD', type: 'STRING_20', required: true },
        { name: 'revenue', displayName: '収益', systemName: 'REVENUE', type: 'MONEY', required: true },
        { name: 'cost', displayName: 'コスト', systemName: 'COST', type: 'MONEY', required: true },
        { name: 'profit', displayName: '利益', systemName: 'PROFIT', type: 'MONEY', required: true },
        { name: 'profitRate', displayName: '利益率', systemName: 'PROFIT_RATE', type: 'PERCENTAGE', required: true },
        { name: 'roi', displayName: 'ROI', systemName: 'ROI', type: 'PERCENTAGE', required: true },
        { name: 'analyzedDate', displayName: '分析日', systemName: 'ANALYZED_DATE', type: 'DATE', required: true }
      ],
      businessRules: [
        '利益 = 収益 - コスト',
        '利益率 = 利益 / 収益 × 100',
        '月次で自動集計'
      ]
    }
  ]

  const valueObjects: ValueObjectDefinition[] = [
    {
      name: 'Money',
      displayName: '金額',
      systemName: 'MONEY',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'DECIMAL', required: true }
      ],
      businessRules: [
        '通貨はJPY（日本円）',
        '最小単位は1円',
        'マイナス値は不可（コストの場合）'
      ]
    },
    {
      name: 'ProfitRate',
      displayName: '利益率',
      systemName: 'PROFIT_RATE',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'PERCENTAGE', required: true }
      ],
      businessRules: [
        '-100%から100%の範囲',
        '小数点2位まで表示',
        '目標値: 25%以上'
      ]
    },
    {
      name: 'InvoiceNumber',
      displayName: '請求書番号',
      systemName: 'INVOICE_NUMBER',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'STRING_20', required: true }
      ],
      businessRules: [
        'フォーマット: INV-YYYY-NNNNN',
        '年度内で連番',
        '一度発番されたら変更不可'
      ]
    },
    {
      name: 'Variance',
      displayName: '予実差異',
      systemName: 'VARIANCE',
      attributes: [
        { name: 'budget', displayName: '予算', systemName: 'BUDGET', type: 'MONEY', required: true },
        { name: 'actual', displayName: '実績', systemName: 'ACTUAL', type: 'MONEY', required: true },
        { name: 'variance', displayName: '差異額', systemName: 'VARIANCE', type: 'MONEY', required: true },
        { name: 'varianceRate', displayName: '差異率', systemName: 'VARIANCE_RATE', type: 'PERCENTAGE', required: true }
      ],
      businessRules: [
        '差異額 = 実績 - 予算',
        '差異率 = 差異額 / 予算 × 100',
        '±10%以内が許容範囲'
      ]
    }
  ]

  const domainServices: DomainServiceDefinition[] = [
    {
      name: 'RevenueRecognitionService',
      displayName: '収益認識サービス',
      systemName: 'REVENUE_RECOGNITION_SERVICE',
      operations: [
        '収益認識タイミングの判定',
        '進行基準での計上',
        '完成基準での計上',
        '収益の配分計算'
      ]
    },
    {
      name: 'CostAllocationService',
      displayName: 'コスト配賦サービス',
      systemName: 'COST_ALLOCATION_SERVICE',
      operations: [
        '人件費の自動配賦',
        '共通費の按分',
        'プロジェクト別コスト集計',
        'コスト予測'
      ]
    },
    {
      name: 'InvoiceManagementService',
      displayName: '請求管理サービス',
      systemName: 'INVOICE_MANAGEMENT_SERVICE',
      operations: [
        '請求書番号の発番',
        '請求書PDF生成',
        '入金確認処理',
        '督促アラート'
      ]
    },
    {
      name: 'ProfitabilityAnalysisService',
      displayName: '収益性分析サービス',
      systemName: 'PROFITABILITY_ANALYSIS_SERVICE',
      operations: [
        'プロジェクト別収益性計算',
        '期間別分析',
        'トレンド分析',
        '予測モデル構築'
      ]
    }
  ]

  return formatDomainLanguage({
    serviceName: '収益最適化サービス',
    entities,
    valueObjects,
    domainServices
  })
}

/**
 * コラボレーション促進サービス（通知）用のドメイン言語生成
 */
export function generateNotificationServiceDomainLanguage(): string {
  const entities: EntityDefinition[] = [
    {
      name: 'Notification',
      displayName: '通知',
      systemName: 'NOTIFICATION',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'NOTIFICATION_ID', type: 'UUID', required: true },
        { name: 'recipientId', displayName: '受信者ID', systemName: 'RECIPIENT_ID', type: 'UUID', required: true },
        { name: 'type', displayName: '通知種別', systemName: 'TYPE', type: 'ENUM', required: true },
        { name: 'title', displayName: 'タイトル', systemName: 'TITLE', type: 'STRING_200', required: true },
        { name: 'content', displayName: '内容', systemName: 'CONTENT', type: 'TEXT', required: true },
        { name: 'priority', displayName: '優先度', systemName: 'PRIORITY', type: 'ENUM', required: true },
        { name: 'relatedEntityType', displayName: '関連エンティティ種別', systemName: 'RELATED_ENTITY_TYPE', type: 'STRING_50', required: false },
        { name: 'relatedEntityId', displayName: '関連エンティティID', systemName: 'RELATED_ENTITY_ID', type: 'UUID', required: false },
        { name: 'isRead', displayName: '既読フラグ', systemName: 'IS_READ', type: 'BOOLEAN', required: true },
        { name: 'readAt', displayName: '既読日時', systemName: 'READ_AT', type: 'TIMESTAMP', required: false },
        { name: 'createdAt', displayName: '作成日時', systemName: 'CREATED_AT', type: 'TIMESTAMP', required: true }
      ],
      businessRules: [
        '重要通知は必ず確認されるまで表示',
        '30日経過で自動アーカイブ',
        '未読通知の集約表示'
      ]
    },
    {
      name: 'Channel',
      displayName: 'チャンネル',
      systemName: 'CHANNEL',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'CHANNEL_ID', type: 'UUID', required: true },
        { name: 'name', displayName: 'チャンネル名', systemName: 'NAME', type: 'STRING_100', required: true },
        { name: 'type', displayName: '種別', systemName: 'TYPE', type: 'ENUM', required: true },
        { name: 'projectId', displayName: 'プロジェクトID', systemName: 'PROJECT_ID', type: 'UUID', required: false },
        { name: 'description', displayName: '説明', systemName: 'DESCRIPTION', type: 'TEXT', required: false },
        { name: 'members', displayName: 'メンバー', systemName: 'MEMBERS', type: 'JSON', required: true },
        { name: 'isPrivate', displayName: 'プライベートフラグ', systemName: 'IS_PRIVATE', type: 'BOOLEAN', required: true },
        { name: 'createdBy', displayName: '作成者ID', systemName: 'CREATED_BY', type: 'UUID', required: true }
      ],
      businessRules: [
        'プロジェクトチャンネルは自動作成',
        'メンバーの追加には権限が必要',
        'アーカイブ後は読み取り専用'
      ]
    },
    {
      name: 'Message',
      displayName: 'メッセージ',
      systemName: 'MESSAGE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'MESSAGE_ID', type: 'UUID', required: true },
        { name: 'channelId', displayName: 'チャンネルID', systemName: 'CHANNEL_ID', type: 'UUID', required: true },
        { name: 'senderId', displayName: '送信者ID', systemName: 'SENDER_ID', type: 'UUID', required: true },
        { name: 'content', displayName: '内容', systemName: 'CONTENT', type: 'TEXT', required: true },
        { name: 'attachments', displayName: '添付ファイル', systemName: 'ATTACHMENTS', type: 'JSON', required: false },
        { name: 'mentions', displayName: 'メンション', systemName: 'MENTIONS', type: 'JSON', required: false },
        { name: 'threadId', displayName: 'スレッドID', systemName: 'THREAD_ID', type: 'UUID', required: false },
        { name: 'isEdited', displayName: '編集済みフラグ', systemName: 'IS_EDITED', type: 'BOOLEAN', required: true },
        { name: 'createdAt', displayName: '作成日時', systemName: 'CREATED_AT', type: 'TIMESTAMP', required: true },
        { name: 'editedAt', displayName: '編集日時', systemName: 'EDITED_AT', type: 'TIMESTAMP', required: false }
      ],
      businessRules: [
        'メッセージは5分以内なら編集可能',
        'スレッドは最大100件まで',
        'メンションで通知発生'
      ]
    },
    {
      name: 'Alert',
      displayName: 'アラート',
      systemName: 'ALERT',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'ALERT_ID', type: 'UUID', required: true },
        { name: 'type', displayName: 'アラート種別', systemName: 'TYPE', type: 'ENUM', required: true },
        { name: 'severity', displayName: '深刻度', systemName: 'SEVERITY', type: 'ENUM', required: true },
        { name: 'targetType', displayName: '対象種別', systemName: 'TARGET_TYPE', type: 'STRING_50', required: true },
        { name: 'targetId', displayName: '対象ID', systemName: 'TARGET_ID', type: 'UUID', required: true },
        { name: 'condition', displayName: '条件', systemName: 'CONDITION', type: 'JSON', required: true },
        { name: 'message', displayName: 'メッセージ', systemName: 'MESSAGE', type: 'TEXT', required: true },
        { name: 'recipients', displayName: '受信者リスト', systemName: 'RECIPIENTS', type: 'JSON', required: true },
        { name: 'isActive', displayName: 'アクティブフラグ', systemName: 'IS_ACTIVE', type: 'BOOLEAN', required: true },
        { name: 'triggeredAt', displayName: '発生日時', systemName: 'TRIGGERED_AT', type: 'TIMESTAMP', required: false }
      ],
      businessRules: [
        '重要アラートは即座に配信',
        '同一アラートの重複防止',
        'エスカレーションルール適用'
      ]
    },
    {
      name: 'NotificationPreference',
      displayName: '通知設定',
      systemName: 'NOTIFICATION_PREFERENCE',
      attributes: [
        { name: 'id', displayName: 'ID', systemName: 'NOTIFICATION_PREFERENCE_ID', type: 'UUID', required: true },
        { name: 'userId', displayName: 'ユーザーID', systemName: 'USER_ID', type: 'UUID', required: true },
        { name: 'notificationType', displayName: '通知種別', systemName: 'NOTIFICATION_TYPE', type: 'ENUM', required: true },
        { name: 'emailEnabled', displayName: 'メール通知', systemName: 'EMAIL_ENABLED', type: 'BOOLEAN', required: true },
        { name: 'pushEnabled', displayName: 'プッシュ通知', systemName: 'PUSH_ENABLED', type: 'BOOLEAN', required: true },
        { name: 'inAppEnabled', displayName: 'アプリ内通知', systemName: 'IN_APP_ENABLED', type: 'BOOLEAN', required: true },
        { name: 'frequency', displayName: '頻度', systemName: 'FREQUENCY', type: 'ENUM', required: true },
        { name: 'quietHours', displayName: '通知停止時間', systemName: 'QUIET_HOURS', type: 'JSON', required: false }
      ],
      businessRules: [
        'デフォルトは全通知ON',
        '重要通知は設定不可',
        '時間帯による自動制御'
      ]
    }
  ]

  const valueObjects: ValueObjectDefinition[] = [
    {
      name: 'NotificationType',
      displayName: '通知種別',
      systemName: 'NOTIFICATION_TYPE',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'ENUM', required: true }
      ],
      businessRules: [
        'TASK_ASSIGNED: タスク割り当て',
        'MENTION: メンション',
        'DEADLINE: 期限通知',
        'APPROVAL_REQUIRED: 承認依頼',
        'SYSTEM_ALERT: システムアラート'
      ]
    },
    {
      name: 'Priority',
      displayName: '優先度',
      systemName: 'PRIORITY',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'ENUM', required: true }
      ],
      businessRules: [
        'URGENT: 緊急（即座に通知）',
        'HIGH: 高（1時間以内）',
        'NORMAL: 通常（日次ダイジェスト）',
        'LOW: 低（週次サマリー）'
      ]
    },
    {
      name: 'DeliveryStatus',
      displayName: '配信ステータス',
      systemName: 'DELIVERY_STATUS',
      attributes: [
        { name: 'value', displayName: '値', systemName: 'VALUE', type: 'ENUM', required: true }
      ],
      businessRules: [
        'PENDING: 配信待ち',
        'DELIVERED: 配信済み',
        'READ: 既読',
        'FAILED: 配信失敗'
      ]
    }
  ]

  const domainServices: DomainServiceDefinition[] = [
    {
      name: 'NotificationDeliveryService',
      displayName: '通知配信サービス',
      systemName: 'NOTIFICATION_DELIVERY_SERVICE',
      operations: [
        '配信チャンネルの選択',
        'バッチ配信の実行',
        '配信失敗時のリトライ',
        'テンプレートによる生成',
        '多言語対応'
      ]
    },
    {
      name: 'AlertManagementService',
      displayName: 'アラート管理サービス',
      systemName: 'ALERT_MANAGEMENT_SERVICE',
      operations: [
        'アラート条件の監視',
        'しきい値判定',
        'エスカレーション処理',
        'アラート履歴管理',
        '統計分析'
      ]
    },
    {
      name: 'CollaborationService',
      displayName: 'コラボレーションサービス',
      systemName: 'COLLABORATION_SERVICE',
      operations: [
        'リアルタイムメッセージング',
        'プレゼンス管理',
        'ファイル共有',
        '画面共有調整',
        'アクティビティ追跡'
      ]
    },
    {
      name: 'NotificationAggregationService',
      displayName: '通知集約サービス',
      systemName: 'NOTIFICATION_AGGREGATION_SERVICE',
      operations: [
        '通知のグループ化',
        'ダイジェスト作成',
        '重複除去',
        'スケジュール配信',
        'プリファレンス適用'
      ]
    }
  ]

  return formatDomainLanguage({
    serviceName: 'コラボレーション促進サービス',
    entities,
    valueObjects,
    domainServices
  })
}

/**
 * ドメイン言語をMarkdown形式にフォーマット
 */
function formatDomainLanguage(data: {
  serviceName: string
  entities: EntityDefinition[]
  valueObjects: ValueObjectDefinition[]
  domainServices: DomainServiceDefinition[]
}): string {
  const sections = []

  // ヘッダー
  sections.push(`# パラソルドメイン言語: ${data.serviceName}

## 概要
このドメイン言語定義は、${data.serviceName}のビジネスオペレーション定義から生成されたものです。

生成日時: ${new Date().toISOString()}

---
`)

  // エンティティセクション
  sections.push(`## エンティティ（Entities）

${data.entities.map(entity => `### ${entity.displayName} [${entity.name}] [${entity.systemName}]

#### 属性
| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|---------|--------|-----------|-----|------|------|
${entity.attributes.map(attr => 
  `| ${attr.displayName} | ${attr.name} | ${attr.systemName} | ${attr.type} | ${attr.required ? '○' : '-'} | ${attr.description || '-'} |`
).join('\n')}

#### ビジネスルール
${entity.businessRules.map(rule => `- ${rule}`).join('\n')}

${entity.states ? `#### 状態
${entity.states.map(state => `- **${state.name}** (${state.displayName}): ${state.description}`).join('\n')}` : ''}
`).join('\n')}`)

  // 値オブジェクトセクション
  sections.push(`## 値オブジェクト（Value Objects）

${data.valueObjects.map(vo => `### ${vo.displayName} [${vo.name}] [${vo.systemName}]

#### 属性
${vo.attributes.map(attr => `- **${attr.displayName}** [${attr.name}] [${attr.systemName}]: ${attr.type}`).join('\n')}

#### ビジネスルール
${vo.businessRules.map(rule => `- ${rule}`).join('\n')}
`).join('\n')}`)

  // ドメインサービスセクション
  sections.push(`## ドメインサービス（Domain Services）

${data.domainServices.map(service => `### ${service.displayName} [${service.name}] [${service.systemName}]

#### オペレーション
${service.operations.map(op => `- ${op}`).join('\n')}
`).join('\n')}`)

  // フッター
  sections.push(`---

## 補足事項

### データ型定義
- **UUID**: 一意識別子（36文字）
- **STRING_N**: 最大N文字の文字列
- **TEXT**: 長文テキスト（制限なし）
- **EMAIL**: メールアドレス形式
- **DATE**: 日付（YYYY-MM-DD）
- **TIMESTAMP**: 日時（ISO8601形式）
- **DECIMAL**: 小数
- **INTEGER**: 整数
- **PERCENTAGE**: パーセンテージ（0-100）
- **MONEY**: 金額（通貨単位付き）
- **BOOLEAN**: 真偽値
- **ENUM**: 列挙型
- **JSON**: JSON形式データ
- **MARKDOWN**: Markdown形式テキスト

### 更新履歴
- ${new Date().toISOString()}: ビジネスオペレーション定義から初期生成`)

  return sections.join('\n')
}