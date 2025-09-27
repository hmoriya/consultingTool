import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedRegisterAndManageUsers(service: any, capability: any) {
  console.log('    Creating business operation: ユーザーを登録・管理する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'RegisterAndManageUsers',
      displayName: 'ユーザーを登録・管理する',
      pattern: 'Administration',
      design: `# ビジネスオペレーション: ユーザーを登録・管理する [RegisterAndManageUsers] [REGISTER_AND_MANAGE_USERS]

## オペレーション概要

### 目的
ユーザーアカウントのライフサイクル（登録、更新、無効化、削除）を適切に管理し、正確なユーザー情報を維持する

### ビジネス価値
- **セキュリティ向上**: 不正アクセスリスクを80%削減
- **効率性向上**: ユーザー登録時間を70%短縮
- **コンプライアンス**: 監査要件100%準拠

### 実行頻度
- **頻度**: 日次（新規入社、退職、異動時）
- **トリガー**: 人事部門からの申請、ユーザー本人からの更新要求
- **所要時間**: 新規登録15分、更新5分

## ビジネスプロセス

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **登録完了率**: 申請から登録完了までの成功率
   - 目標値: 99%以上
2. **登録リードタイム**: 申請から有効化までの時間
   - 目標値: 1営業日以内
3. **データ精度**: ユーザー情報の正確性
   - 目標値: 99.5%以上`,
      goal: 'ユーザーアカウントのライフサイクル（登録、更新、無効化、削除）を適切に管理し、正確なユーザー情報を維持する',
      
      roles: JSON.stringify([
        {
          name: 'システム管理者 [System Administrator] [SYSTEM_ADMINISTRATOR]',
          responsibility: 'ユーザーアカウントの作成・管理・削除の実行'
        },
        {
          name: 'セキュリティ管理者 [Security Administrator] [SECURITY_ADMINISTRATOR]',
          responsibility: 'ユーザー登録ポリシーの策定と監査'
        },
        {
          name: 'ユーザー [User] [USER]',
          responsibility: '自身のプロファイル情報の更新と管理'
        },
        {
          name: '承認者 [Approver] [APPROVER]',
          responsibility: '新規ユーザー登録の承認'
        }
      ]),
      
      operations: JSON.stringify({
        steps: [
          {
            step: 1,
            name: '登録要求を受付ける [Receive Registration Request] [RECEIVE_REGISTRATION_REQUEST]',
            description: '新規ユーザー登録要求を受け付け、基本情報を検証',
            actors: ['システム管理者', '承認者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '承認者',
              informed: 'ユーザー'
            }
          },
          {
            step: 2,
            name: '本人確認を実施する [Verify Identity] [VERIFY_IDENTITY]',
            description: '登録者の本人確認と所属組織の確認を実施',
            actors: ['システム管理者', 'セキュリティ管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '承認者',
              informed: 'ユーザー'
            }
          },
          {
            step: 3,
            name: 'アカウントを作成する [Create Account] [CREATE_ACCOUNT]',
            description: 'ユーザーアカウントを作成し、初期パスワードを設定',
            actors: ['システム管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: 'ユーザー、承認者'
            }
          },
          {
            step: 4,
            name: '初期権限を設定する [Set Initial Permissions] [SET_INITIAL_PERMISSIONS]',
            description: '役職・部門に基づく初期ロールと権限を割り当て',
            actors: ['システム管理者', 'セキュリティ管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '承認者',
              informed: 'ユーザー'
            }
          },
          {
            step: 5,
            name: 'アクセス情報を通知する [Notify Access Information] [NOTIFY_ACCESS_INFORMATION]',
            description: 'ログイン情報と初回ログイン手順をユーザーに通知',
            actors: ['システム管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'システム管理者',
              consulted: '',
              informed: 'ユーザー、承認者'
            }
          },
          {
            step: 6,
            name: '定期レビューを実施する [Conduct Periodic Review] [CONDUCT_PERIODIC_REVIEW]',
            description: 'ユーザー情報の正確性と有効性を定期的に確認',
            actors: ['システム管理者', 'セキュリティ管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '承認者',
              informed: 'ユーザー'
            }
          },
          {
            step: 7,
            name: 'アカウントを無効化する [Deactivate Account] [DEACTIVATE_ACCOUNT]',
            description: '退職・異動時にアカウントを適切に無効化または削除',
            actors: ['システム管理者', 'セキュリティ管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '承認者',
              informed: ''
            }
          }
        ]
      }),
      
      businessStates: JSON.stringify({
        states: [
          {
            name: '登録申請中 [Registration Requested] [REGISTRATION_REQUESTED]',
            description: 'ユーザー登録申請が提出され、承認待ちの状態'
          },
          {
            name: '本人確認中 [Identity Verification] [IDENTITY_VERIFICATION]',
            description: '申請者の本人確認プロセスが進行中'
          },
          {
            name: '承認済み [Approved] [APPROVED]',
            description: '登録申請が承認され、アカウント作成可能な状態'
          },
          {
            name: 'アクティブ [Active] [ACTIVE]',
            description: 'アカウントが有効で、システム利用可能な状態'
          },
          {
            name: '一時停止 [Suspended] [SUSPENDED]',
            description: 'セキュリティまたは管理上の理由で一時的に無効化'
          },
          {
            name: '期限切れ [Expired] [EXPIRED]',
            description: 'パスワード期限切れなどで再設定が必要な状態'
          },
          {
            name: '無効化済み [Deactivated] [DEACTIVATED]',
            description: '退職・異動によりアカウントが無効化された状態'
          },
          {
            name: '削除済み [Deleted] [DELETED]',
            description: '保管期限経過後、完全に削除された状態'
          }
        ],
        transitions: [
          '登録申請中 → 本人確認中',
          '本人確認中 → 承認済み',
          '本人確認中 → 却下',
          '承認済み → アクティブ',
          'アクティブ → 一時停止',
          'アクティブ → 期限切れ',
          'アクティブ → 無効化済み',
          '一時停止 → アクティブ',
          '期限切れ → アクティブ',
          '無効化済み → 削除済み'
        ]
      }),
      
      useCases: JSON.stringify([
        {
          name: '新規ユーザーを登録する',
          actors: 'システム管理者',
          description: '新入社員や新規プロジェクトメンバーのアカウントを作成'
        },
        {
          name: 'ユーザー情報を更新する',
          actors: 'システム管理者、ユーザー',
          description: '氏名、部署、連絡先などの基本情報を更新'
        },
        {
          name: 'パスワードをリセットする',
          actors: 'システム管理者、ユーザー',
          description: 'パスワード忘れや期限切れ時の再設定'
        },
        {
          name: 'アカウントを一時停止する',
          actors: 'セキュリティ管理者',
          description: 'セキュリティインシデント発生時の緊急対応'
        },
        {
          name: 'アカウントを削除する',
          actors: 'システム管理者',
          description: '退職者のアカウントを適切に処理'
        }
      ]),
      
      uiDefinitions: JSON.stringify([
        {
          pageName: 'ユーザー登録フォーム',
          purpose: '新規ユーザーの基本情報を入力',
          elements: ['氏名入力', 'メールアドレス', '所属組織', '役職']
        },
        {
          pageName: 'ユーザー一覧画面',
          purpose: '登録済みユーザーの検索と管理',
          elements: ['検索フィルタ', 'ユーザーリスト', 'ステータス表示']
        },
        {
          pageName: 'ユーザー詳細画面',
          purpose: 'ユーザー情報の詳細表示と編集',
          elements: ['基本情報', 'ロール・権限', 'アクセス履歴']
        }
      ]),
      
      testCases: JSON.stringify([
        {
          name: '正常系：新規ユーザー登録',
          steps: ['登録フォーム入力', '本人確認', '承認', 'アカウント作成確認'],
          expectedResult: 'アカウントが作成され、ログイン可能'
        },
        {
          name: '異常系：重複メールアドレス',
          steps: ['既存メールアドレスで登録試行'],
          expectedResult: 'エラーメッセージ表示、登録失敗'
        },
        {
          name: 'セキュリティ：権限昇格防止',
          steps: ['一般ユーザーが管理者権限を自己付与試行'],
          expectedResult: '権限エラー、操作失敗、監査ログ記録'
        }
      ])
    }
  })
  
  return operation
}