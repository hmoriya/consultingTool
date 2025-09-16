import { LoginSchema } from '../auth'

describe('LoginSchema', () => {
  describe('有効な入力値', () => {
    test('正しいメールアドレスとパスワードを受け入れる', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      }
      const result = LoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('様々な有効なメールアドレス形式を受け入れる', () => {
      const validEmails = [
        'user@domain.com',
        'user.name@domain.com',
        'user+tag@domain.co.jp',
        'user123@subdomain.domain.com'
      ]

      validEmails.forEach(email => {
        const result = LoginSchema.safeParse({
          email,
          password: 'password123'
        })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('無効な入力値', () => {
    test('無効なメールアドレスを拒否する', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@.com',
        'user space@domain.com'
      ]

      invalidEmails.forEach(email => {
        const result = LoginSchema.safeParse({
          email,
          password: 'password123'
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('有効なメールアドレスを入力してください')
        }
      })
    })

    test('短いパスワードを拒否する', () => {
      const shortPasswords = ['', '1234567', 'short']

      shortPasswords.forEach(password => {
        const result = LoginSchema.safeParse({
          email: 'test@example.com',
          password
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('パスワードは8文字以上で入力してください')
        }
      })
    })

    test('必須フィールドの欠落を検出する', () => {
      const missingEmail = LoginSchema.safeParse({
        password: 'password123'
      })
      expect(missingEmail.success).toBe(false)

      const missingPassword = LoginSchema.safeParse({
        email: 'test@example.com'
      })
      expect(missingPassword.success).toBe(false)

      const emptyObject = LoginSchema.safeParse({})
      expect(emptyObject.success).toBe(false)
    })
  })
})