# 単体テスト仕様書

**更新日: 2025-01-09**

## テストフレームワーク
- **Jest**: テストランナー
- **React Testing Library**: Reactコンポーネントテスト
- **MSW (Mock Service Worker)**: APIモック

## 0リリース単体テスト

### 1. 認証関連テスト

#### LoginSchema バリデーションテスト
**ファイル**: `lib/schemas/auth.test.ts`

```typescript
describe('LoginSchema', () => {
  test('有効なメールアドレスとパスワードを受け入れる', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123'
    }
    expect(() => LoginSchema.parse(validData)).not.toThrow()
  })

  test('無効なメールアドレスを拒否する', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123'
    }
    expect(() => LoginSchema.parse(invalidData)).toThrow('有効なメールアドレスを入力してください')
  })

  test('短いパスワードを拒否する', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'short'
    }
    expect(() => LoginSchema.parse(invalidData)).toThrow('パスワードは8文字以上で入力してください')
  })
})
```

#### login Server Action テスト
**ファイル**: `app/actions/auth.test.ts`

```typescript
describe('login action', () => {
  test('正しい認証情報でログイン成功', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'テストユーザー',
      isActive: true,
      role: { name: 'consultant' }
    }
    
    prismaMock.user.findUnique.mockResolvedValue(mockUser)
    prismaMock.session.create.mockResolvedValue({
      id: 'session-1',
      userId: '1',
      token: 'token',
      expiresAt: new Date()
    })
    
    const result = await login({
      email: 'test@example.com',
      password: 'password123'
    })
    
    expect(result.success).toBe(true)
    expect(result.user?.email).toBe('test@example.com')
  })

  test('無効なパスワードでログイン失敗', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      isActive: true
    }
    
    prismaMock.user.findUnique.mockResolvedValue(mockUser)
    
    const result = await login({
      email: 'test@example.com',
      password: 'wrongpassword'
    })
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('INVALID_CREDENTIALS')
  })
})
```

### 2. UIコンポーネントテスト

#### Header コンポーネントテスト
**ファイル**: `components/layouts/header/header.test.tsx`

```typescript
describe('Header', () => {
  test('ログイン時にユーザー名を表示', () => {
    const mockUser = {
      id: '1',
      name: 'テストユーザー',
      email: 'test@example.com',
      role: 'consultant'
    }
    
    render(
      <UserContext.Provider value={{ user: mockUser, isLoading: false }}>
        <Header onMenuToggle={jest.fn()} />
      </UserContext.Provider>
    )
    
    expect(screen.getByText('テストユーザー')).toBeInTheDocument()
  })

  test('未ログイン時にログインボタンを表示', () => {
    render(
      <UserContext.Provider value={{ user: null, isLoading: false }}>
        <Header onMenuToggle={jest.fn()} />
      </UserContext.Provider>
    )
    
    expect(screen.getByText('ログイン')).toBeInTheDocument()
  })

  test('ハンバーガーメニューのクリック', () => {
    const mockToggle = jest.fn()
    
    render(
      <UserContext.Provider value={{ user: null, isLoading: false }}>
        <Header onMenuToggle={mockToggle} />
      </UserContext.Provider>
    )
    
    fireEvent.click(screen.getByTestId('hamburger-menu'))
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })
})
```

#### Sidebar コンポーネントテスト
**ファイル**: `components/layouts/sidebar/sidebar.test.tsx`

```typescript
describe('Sidebar', () => {
  test('ロールに応じたメニューを表示', () => {
    const mockUser = {
      id: '1',
      name: 'テストPM',
      role: 'pm'
    }
    
    render(
      <UserContext.Provider value={{ user: mockUser, isLoading: false }}>
        <Sidebar isOpen={true} isCollapsed={false} onCollapse={jest.fn()} />
      </UserContext.Provider>
    )
    
    expect(screen.getByText('プロジェクト管理')).toBeInTheDocument()
    expect(screen.getByText('チーム管理')).toBeInTheDocument()
  })

  test('折りたたみ状態でアイコンのみ表示', () => {
    render(
      <UserContext.Provider value={{ user: null, isLoading: false }}>
        <Sidebar isOpen={true} isCollapsed={true} onCollapse={jest.fn()} />
      </UserContext.Provider>
    )
    
    expect(screen.queryByText('ダッシュボード')).not.toBeInTheDocument()
    expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument()
  })
})
```

### 3. ユーティリティ関数テスト

#### セッション管理テスト
**ファイル**: `lib/auth/session.test.ts`

```typescript
describe('セッション管理', () => {
  test('セッショントークンの生成', () => {
    const token = generateSessionToken()
    expect(token).toMatch(/^[a-f0-9-]{36}$/)
  })

  test('セッションの有効期限チェック', () => {
    const validSession = {
      expiresAt: new Date(Date.now() + 60000) // 1分後
    }
    expect(isSessionValid(validSession)).toBe(true)
    
    const expiredSession = {
      expiresAt: new Date(Date.now() - 60000) // 1分前
    }
    expect(isSessionValid(expiredSession)).toBe(false)
  })
})
```

#### ロール権限チェックテスト
**ファイル**: `lib/auth/rbac.test.ts`

```typescript
describe('RBAC', () => {
  test('エグゼクティブはすべての読み取り権限を持つ', () => {
    const permissions = getPermissionsForRole('executive')
    
    expect(permissions).toContainEqual({
      resource: 'projects',
      action: 'read'
    })
    expect(permissions).toContainEqual({
      resource: 'reports',
      action: 'read'
    })
  })

  test('クライアントは限定的な権限を持つ', () => {
    const permissions = getPermissionsForRole('client')
    
    expect(permissions).toContainEqual({
      resource: 'projects',
      action: 'read'
    })
    expect(permissions).not.toContainEqual({
      resource: 'projects',
      action: 'write'
    })
  })
})
```

### 4. フォームバリデーションテスト

#### ログインフォームテスト
**ファイル**: `components/auth/login-form.test.tsx`

```typescript
describe('LoginForm', () => {
  test('フォーム送信時にバリデーションエラーを表示', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: 'ログイン' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
      expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
    })
  })

  test('有効な入力でフォーム送信', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true })
    
    render(<LoginForm onSubmit={mockLogin} />)
    
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }))
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })
})
```

## カバレッジ目標
- **全体**: 80%以上
- **重要機能（認証、権限）**: 90%以上
- **UIコンポーネント**: 70%以上

## 実行コマンド
```bash
# すべてのテスト実行
npm test

# カバレッジレポート生成
npm test -- --coverage

# 特定のファイルのテスト
npm test auth.test.ts

# ウォッチモード
npm test -- --watch
```