'use client'

import { useEffect } from 'react'
import { extendSession } from '@/actions/session'

/**
 * セッションを維持するためのコンポーネント
 * 10分ごとにセッションを延長
 */
export function SessionKeeper() {
  useEffect(() => {
    // 初回実行
    extendSession()
    
    // 10分ごとに実行
    const interval = setInterval(() => {
      extendSession()
    }, 10 * 60 * 1000) // 10分
    
    return () => clearInterval(interval)
  }, [])
  
  return null
}