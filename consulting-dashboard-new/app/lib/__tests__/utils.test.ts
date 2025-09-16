import { cn } from '../utils'

describe('utils', () => {
  describe('cn (classnames merger)', () => {
    test('単一のクラス名を返す', () => {
      expect(cn('text-red-500')).toBe('text-red-500')
    })

    test('複数のクラス名をマージする', () => {
      expect(cn('px-4', 'py-2', 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500')
    })

    test('条件付きクラス名を処理する', () => {
      const isActive = true
      const isDisabled = false

      expect(
        cn(
          'base-class',
          isActive && 'active-class',
          isDisabled && 'disabled-class'
        )
      ).toBe('base-class active-class')
    })

    test('undefinedやnullを無視する', () => {
      expect(cn('base', undefined, null, 'end')).toBe('base end')
    })

    test('Tailwind CSSのコンフリクトを解決する', () => {
      // tailwind-mergeが重複するクラスを適切に処理
      expect(cn('px-2', 'px-4')).toBe('px-4')
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
      expect(cn('mt-2 mb-2', 'my-4')).toBe('my-4')
    })

    test('オブジェクト形式のクラス名を処理する', () => {
      expect(
        cn({
          'bg-blue-500': true,
          'bg-red-500': false,
          'text-white': true
        })
      ).toBe('bg-blue-500 text-white')
    })

    test('配列形式のクラス名を処理する', () => {
      expect(cn(['px-4', 'py-2'], 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500')
    })

    test('空の入力で空文字列を返す', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
    })
  })
})