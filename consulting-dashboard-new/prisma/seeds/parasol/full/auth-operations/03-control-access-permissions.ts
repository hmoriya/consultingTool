import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedControlAccessPermissions(service: any, capability: any) {
  console.log('    Creating business operation: アクセス権限を制御する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'ControlAccessPermissions',
      displayName: 'アクセス権限を制御する',
      pattern: 'Administration',
      design: `# ビジネスオペレーション: アクセス権限を制御する [ControlAccessPermissions] [CONTROL_ACCESS_PERMISSIONS]

## オペレーション概要

### 目的
ロールベースアクセス制御（RBAC）を通じて、最小権限の原則に基づいた適切なアクセス権限を管理し、情報資産を保護する

### ビジネス価値
- **セキュリティ強化**: 不正アクセスを95%削減
- **コンプライアンス**: SOX法等の規制要件に100%準拠
- **運用効率**: 権限管理工数を50%削減

### 実行頻度
- **頻度**: 日次（権限変更）、四半期（定期レビュー）
- **トリガー**: 役職変更、プロジェクト参画、定期監査
- **所要時間**: 権限変更30分、定期レビュー1週間

## ビジネスプロセス

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **最小権限準拠率**: 不要な権限を持つユーザーの割合
   - 目標値: 5%以下
2. **権限設定時間**: 申請から設定完了までの時間
   - 目標値: 4時間以内
3. **定期レビュー実施率**: 計画通りレビューを実施した割合
   - 目標値: 100%`,
      goal: 'ロールベースアクセス制御（RBAC）を通じて、最小権限の原則に基づいた適切なアクセス権限を管理し、情報資産を保護する',
      
      roles: JSON.stringify([
        {
          name: 'セキュリティ管理者 [Security Administrator] [SECURITY_ADMINISTRATOR]',
          responsibility: 'アクセス制御ポリシーの策定と権限設計'
        },
        {
          name: 'システム管理者 [System Administrator] [SYSTEM_ADMINISTRATOR]',
          responsibility: 'ロールと権限の実装・設定'
        },
        {
          name: '承認者 [Approver] [APPROVER]',
          responsibility: '権限変更申請の承認'
        },
        {
          name: 'ユーザー [User] [USER]',
          responsibility: '必要な権限の申請'
        },
        {
          name: '監査人 [Auditor] [AUDITOR]',
          responsibility: '権限設定の適切性監査'
        }
      ]),
      
      operations: JSON.stringify({
        steps: [
          {
            step: 1,
            name: 'ロールを定義する [Define Roles] [DEFINE_ROLES]',
            description: '業務に必要なロールと責任範囲を定義',
            actors: ['セキュリティ管理者', 'システム管理者'],
            raciMatrix: {
              responsible: 'セキュリティ管理者',
              accountable: 'セキュリティ管理者',
              consulted: '部門責任者',
              informed: 'システム管理者'
            }
          },
          {
            step: 2,
            name: '権限を設計する [Design Permissions] [DESIGN_PERMISSIONS]',
            description: '各ロールに必要な権限セットを設計',
            actors: ['セキュリティ管理者'],
            raciMatrix: {
              responsible: 'セキュリティ管理者',
              accountable: 'セキュリティ管理者',
              consulted: 'システム管理者',
              informed: '承認者'
            }
          },
          {
            step: 3,
            name: 'ロールを割り当てる [Assign Roles] [ASSIGN_ROLES]',
            description: 'ユーザーまたはグループにロールを割り当て',
            actors: ['システム管理者', '承認者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: '承認者',
              consulted: 'セキュリティ管理者',
              informed: 'ユーザー'
            }
          },
          {
            step: 4,
            name: '権限変更を申請する [Request Permission Change] [REQUEST_PERMISSION_CHANGE]',
            description: 'ユーザーが追加権限や権限変更を申請',
            actors: ['ユーザー', '承認者'],
            raciMatrix: {
              responsible: 'ユーザー',
              accountable: '承認者',
              consulted: 'セキュリティ管理者',
              informed: 'システム管理者'
            }
          },
          {
            step: 5,
            name: '権限を検証する [Validate Permissions] [VALIDATE_PERMISSIONS]',
            description: '設定された権限が適切に機能するか検証',
            actors: ['システム管理者', 'セキュリティ管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: 'ユーザー、承認者'
            }
          },
          {
            step: 6,
            name: '定期レビューを実施する [Conduct Periodic Review] [CONDUCT_PERIODIC_REVIEW]',
            description: '権限の適切性を定期的にレビュー',
            actors: ['セキュリティ管理者', '監査人'],
            raciMatrix: {
              responsible: 'セキュリティ管理者',
              accountable: '監査人',
              consulted: '承認者',
              informed: '全関係者'
            }
          },
          {
            step: 7,
            name: '不要権限を削除する [Remove Unnecessary Permissions] [REMOVE_UNNECESSARY_PERMISSIONS]',
            description: '最小権限の原則に基づき不要な権限を削除',
            actors: ['システム管理者', 'セキュリティ管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '承認者',
              informed: 'ユーザー'
            }
          }
        ]
      }),
      
      businessStates: JSON.stringify({
        states: [
          {
            name: '設計中 [Designing] [DESIGNING]',
            description: 'ロールと権限の設計を行っている状態'
          },
          {
            name: '申請中 [Requested] [REQUESTED]',
            description: '権限変更申請が提出され承認待ちの状態'
          },
          {
            name: '承認済み [Approved] [APPROVED]',
            description: '権限変更が承認され実装待ちの状態'
          },
          {
            name: '有効 [Active] [ACTIVE]',
            description: '権限が有効でアクセス制御が機能している状態'
          },
          {
            name: 'レビュー中 [Under Review] [UNDER_REVIEW]',
            description: '定期レビューで権限の適切性を確認中'
          },
          {
            name: '変更予定 [Scheduled Change] [SCHEDULED_CHANGE]',
            description: '権限変更が計画され実施待ちの状態'
          },
          {
            name: '無効化 [Revoked] [REVOKED]',
            description: '権限が取り消された状態'
          }
        ],
        transitions: [
          '設計中 → 申請中',
          '申請中 → 承認済み',
          '申請中 → 却下',
          '承認済み → 有効',
          '有効 → レビュー中',
          'レビュー中 → 有効',
          'レビュー中 → 変更予定',
          '変更予定 → 有効',
          '有効 → 無効化'
        ]
      }),
      
      useCases: JSON.stringify([
        {
          name: '新規ロールを作成する',
          actors: 'セキュリティ管理者',
          description: '新しい職務に対応するロールの作成'
        },
        {
          name: '権限昇格を申請する',
          actors: 'ユーザー',
          description: '追加業務のための権限拡張申請'
        },
        {
          name: '一時的権限を付与する',
          actors: 'システム管理者',
          description: '期間限定プロジェクトのための一時権限'
        },
        {
          name: '権限を委譲する',
          actors: '承認者',
          description: '不在時の権限委譲設定'
        },
        {
          name: '権限監査を実施する',
          actors: '監査人',
          description: '権限設定の適切性確認'
        }
      ]),
      
      uiDefinitions: JSON.stringify([
        {
          pageName: 'ロール管理画面',
          purpose: 'ロールの作成・編集・削除',
          elements: ['ロール一覧', '権限マトリクス', '継承設定']
        },
        {
          pageName: '権限申請フォーム',
          purpose: '権限変更の申請と承認',
          elements: ['申請理由', '必要権限', '期間設定']
        },
        {
          pageName: '権限レビューダッシュボード',
          purpose: '権限の利用状況と適切性の確認',
          elements: ['利用統計', '異常検知', 'レビュー履歴']
        }
      ]),
      
      testCases: JSON.stringify([
        {
          name: '正常系：権限付与',
          steps: ['権限申請', '承認', '権限設定', 'アクセステスト'],
          expectedResult: '申請した権限でのみアクセス可能'
        },
        {
          name: 'セキュリティ：権限分離',
          steps: ['相反する権限の同時付与試行'],
          expectedResult: 'システムが拒否、エラー表示'
        },
        {
          name: '境界値：大量権限',
          steps: ['1000個の権限を持つロール作成'],
          expectedResult: 'パフォーマンス劣化なく動作'
        }
      ])
    }
  })
  
  return operation
}