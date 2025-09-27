import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedExecuteAuthentication(service: any, capability: any) {
  console.log('    Creating business operation: 認証を実行する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'ExecuteAuthentication',
      displayName: '認証を実行する',
      pattern: 'Workflow',
      design: `# ビジネスオペレーション: 認証を実行する [ExecuteAuthentication] [EXECUTE_AUTHENTICATION]

## オペレーション概要

### 目的
ユーザーの身元を確実に確認し、なりすましや不正アクセスを防止して、システムへの安全なアクセスを提供する

### ビジネス価値
- **セキュリティ**: 不正ログインを99.9%防止
- **ユーザビリティ**: シングルサインオンで利便性向上
- **監査対応**: 全認証イベントの完全な追跡可能性

### 実行頻度
- **頻度**: 常時（ユーザーログイン時）
- **トリガー**: ログイン要求、セッションタイムアウト
- **所要時間**: 認証処理3秒以内

## ビジネスプロセス

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **認証成功率**: 正当なユーザーの認証成功率
   - 目標値: 99.5%以上
2. **認証処理時間**: ログインから完了までの平均時間
   - 目標値: 3秒以内
3. **MFA採用率**: 多要素認証を有効化したユーザーの割合
   - 目標値: 90%以上`,
      goal: 'ユーザーの身元を確実に確認し、なりすましや不正アクセスを防止して、システムへの安全なアクセスを提供する',
      
      roles: JSON.stringify([
        {
          name: 'ユーザー [User] [USER]',
          responsibility: '正しい認証情報の提供と保護'
        },
        {
          name: '認証システム [Authentication System] [AUTHENTICATION_SYSTEM]',
          responsibility: '認証処理の実行と結果の判定'
        },
        {
          name: 'セキュリティ管理者 [Security Administrator] [SECURITY_ADMINISTRATOR]',
          responsibility: '認証ポリシーの設定と監視'
        },
        {
          name: 'システム管理者 [System Administrator] [SYSTEM_ADMINISTRATOR]',
          responsibility: '認証システムの運用と障害対応'
        }
      ]),
      
      operations: JSON.stringify({
        steps: [
          {
            step: 1,
            name: '認証要求を受信する [Receive Authentication Request] [RECEIVE_AUTHENTICATION_REQUEST]',
            description: 'ユーザーからのログイン要求を受信し初期検証',
            actors: ['ユーザー', '認証システム'],
            raciMatrix: {
              responsible: '認証システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: 'システム管理者'
            }
          },
          {
            step: 2,
            name: '資格情報を検証する [Verify Credentials] [VERIFY_CREDENTIALS]',
            description: 'ユーザー名とパスワードの正確性を確認',
            actors: ['認証システム'],
            raciMatrix: {
              responsible: '認証システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: ''
            }
          },
          {
            step: 3,
            name: '多要素認証を実行する [Execute Multi-Factor Authentication] [EXECUTE_MFA]',
            description: '追加の認証要素（OTP、生体認証等）を確認',
            actors: ['ユーザー', '認証システム'],
            raciMatrix: {
              responsible: '認証システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: 'ユーザー'
            }
          },
          {
            step: 4,
            name: 'リスク評価を行う [Assess Risk] [ASSESS_RISK]',
            description: 'ログイン環境やパターンからリスクを評価',
            actors: ['認証システム'],
            raciMatrix: {
              responsible: '認証システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: 'システム管理者'
            }
          },
          {
            step: 5,
            name: 'セッションを作成する [Create Session] [CREATE_SESSION]',
            description: '認証成功時にセキュアなセッションを生成',
            actors: ['認証システム'],
            raciMatrix: {
              responsible: '認証システム',
              accountable: 'システム管理者',
              consulted: '',
              informed: 'ユーザー'
            }
          },
          {
            step: 6,
            name: 'アクセストークンを発行する [Issue Access Token] [ISSUE_ACCESS_TOKEN]',
            description: 'API利用のためのアクセストークンを生成',
            actors: ['認証システム'],
            raciMatrix: {
              responsible: '認証システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: 'ユーザー'
            }
          },
          {
            step: 7,
            name: '認証イベントを記録する [Log Authentication Event] [LOG_AUTHENTICATION_EVENT]',
            description: '認証の成功/失敗を監査ログに記録',
            actors: ['認証システム'],
            raciMatrix: {
              responsible: '認証システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: '監査人'
            }
          }
        ]
      }),
      
      businessStates: JSON.stringify({
        states: [
          {
            name: '未認証 [Unauthenticated] [UNAUTHENTICATED]',
            description: 'ユーザーが認証されていない初期状態'
          },
          {
            name: '認証中 [Authenticating] [AUTHENTICATING]',
            description: '認証プロセスが進行中の状態'
          },
          {
            name: 'MFA待機 [Awaiting MFA] [AWAITING_MFA]',
            description: '多要素認証の入力を待っている状態'
          },
          {
            name: '認証成功 [Authenticated] [AUTHENTICATED]',
            description: 'すべての認証が成功し、アクセス許可された状態'
          },
          {
            name: '認証失敗 [Authentication Failed] [AUTHENTICATION_FAILED]',
            description: '認証に失敗し、アクセスが拒否された状態'
          },
          {
            name: 'ロックアウト [Locked Out] [LOCKED_OUT]',
            description: '連続失敗によりアカウントがロックされた状態'
          },
          {
            name: 'セッション有効 [Session Active] [SESSION_ACTIVE]',
            description: '認証済みセッションが有効な状態'
          },
          {
            name: 'セッション期限切れ [Session Expired] [SESSION_EXPIRED]',
            description: 'セッションがタイムアウトした状態'
          }
        ],
        transitions: [
          '未認証 → 認証中',
          '認証中 → MFA待機',
          '認証中 → 認証失敗',
          'MFA待機 → 認証成功',
          'MFA待機 → 認証失敗',
          '認証失敗 → ロックアウト',
          '認証成功 → セッション有効',
          'セッション有効 → セッション期限切れ',
          'セッション期限切れ → 未認証'
        ]
      }),
      
      useCases: JSON.stringify([
        {
          name: 'パスワードでログインする',
          actors: 'ユーザー',
          description: '通常のユーザー名とパスワードによる認証'
        },
        {
          name: 'SSOでログインする',
          actors: 'ユーザー',
          description: 'シングルサインオンによる認証'
        },
        {
          name: '生体認証を使用する',
          actors: 'ユーザー',
          description: '指紋や顔認証による本人確認'
        },
        {
          name: 'APIキーで認証する',
          actors: '外部システム',
          description: 'システム間連携のためのAPI認証'
        },
        {
          name: '緊急アクセスを要求する',
          actors: '管理者',
          description: '緊急時の特権アクセス'
        }
      ]),
      
      uiDefinitions: JSON.stringify([
        {
          pageName: 'ログイン画面',
          purpose: 'ユーザー認証情報の入力',
          elements: ['ユーザー名', 'パスワード', 'ログインボタン', 'パスワード忘れ']
        },
        {
          pageName: 'MFA入力画面',
          purpose: '多要素認証コードの入力',
          elements: ['OTPコード', '確認ボタン', '再送信リンク']
        },
        {
          pageName: 'セッション管理画面',
          purpose: 'アクティブセッションの表示と管理',
          elements: ['セッション一覧', 'ログアウトボタン', 'デバイス情報']
        }
      ]),
      
      testCases: JSON.stringify([
        {
          name: '正常系：パスワード認証',
          steps: ['正しいユーザー名入力', '正しいパスワード入力', 'ログイン'],
          expectedResult: '認証成功、ダッシュボード表示'
        },
        {
          name: 'セキュリティ：ブルートフォース防止',
          steps: ['5回連続で誤ったパスワード入力'],
          expectedResult: 'アカウントロック、管理者通知'
        },
        {
          name: '性能：同時認証',
          steps: ['1000ユーザーが同時ログイン'],
          expectedResult: '3秒以内に全認証完了'
        }
      ])
    }
  })
  
  return operation
}