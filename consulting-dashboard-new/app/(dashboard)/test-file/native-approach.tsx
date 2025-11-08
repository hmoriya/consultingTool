'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Upload, CheckCircle, AlertTriangle, FileText, X } from 'lucide-react'

export default function NativeApproachPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [debugLog, setDebugLog] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    setDebugLog(prev => [...prev, logMessage])
    console.log(logMessage)
  }

  useEffect(() => {
    // ネイティブDOMイベントを直接アタッチ
    if (!containerRef.current) return

    const container = containerRef.current

    // テスト1: 標準input
    const test1Input = container.querySelector('#native-test1') as HTMLInputElement
    if (test1Input) {
      test1Input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
          addLog(`Test1: ファイル選択成功 - ${file.name}`)
          setSelectedFile(file)
        }
      })
    }

    // テスト2: Label + Hidden Input
    const test2Input = container.querySelector('#native-test2') as HTMLInputElement
    if (test2Input) {
      test2Input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
          addLog(`Test2: ファイル選択成功 - ${file.name}`)
          setSelectedFile(file)
        }
      })
    }

    // テスト3: Button click
    const test3Button = container.querySelector('#native-test3-button') as HTMLButtonElement
    const test3Input = container.querySelector('#native-test3-input') as HTMLInputElement
    if (test3Button && test3Input) {
      test3Button.addEventListener('click', (e) => {
        addLog(`Test3: ボタンクリック (isTrusted: ${e.isTrusted})`)
        test3Input.click()
      })

      test3Input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
          addLog(`Test3: ファイル選択成功 - ${file.name}`)
          setSelectedFile(file)
        }
      })
    }

    // テスト4: 動的作成
    const test4Button = container.querySelector('#native-test4-button') as HTMLButtonElement
    if (test4Button) {
      test4Button.addEventListener('click', (e) => {
        addLog(`Test4: 動的作成開始 (isTrusted: ${e.isTrusted})`)

        const input = document.createElement('input')
        input.type = 'file'
        input.style.display = 'none'

        input.onchange = (evt) => {
          const target = evt.target as HTMLInputElement
          const file = target.files?.[0]
          if (file) {
            addLog(`Test4: ファイル選択成功 - ${file.name}`)
            setSelectedFile(file)
          }
          document.body.removeChild(input)
        }

        document.body.appendChild(input)
        input.click()

        setTimeout(() => {
          if (document.body.contains(input)) {
            document.body.removeChild(input)
            addLog('Test4: タイムアウトクリーンアップ')
          }
        }, 10000)
      })
    }

    // テスト5: useRefを使わないダイレクトDOM操作
    const test5Button = container.querySelector('#native-test5-button') as HTMLButtonElement
    if (test5Button) {
      test5Button.addEventListener('click', function(e) {
        addLog(`Test5: this binding (isTrusted: ${e.isTrusted})`)

        // ダイレクトにDOM要素を作成・操作
        const fileInput = document.getElementById('native-test5-input') as HTMLInputElement
        if (!fileInput) {
          const input = document.createElement('input')
          input.type = 'file'
          input.id = 'native-test5-input'
          input.style.position = 'absolute'
          input.style.left = '-9999px'

          input.addEventListener('change', function() {
            const file = this.files?.[0]
            if (file) {
              addLog(`Test5: ファイル選択成功 - ${file.name}`)
              setSelectedFile(file)
            }
          })

          document.body.appendChild(input)
          input.click()
        } else {
          fileInput.click()
        }
      })
    }

  }, [])

  const clearLog = () => {
    setDebugLog([])
  }

  const resetTests = () => {
    setSelectedFile(null)
    setDebugLog([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">ネイティブDOMアプローチテスト</h1>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">このページの特徴：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>React の onClick ハンドラーを使用しない</li>
                <li>ネイティブDOM の addEventListener を使用</li>
                <li>useEffect 内で全イベントを設定</li>
                <li>純粋HTMLで動作したコードをReactに適用</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ステータス表示 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">現在の状態</h2>
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="font-medium w-32">選択ファイル:</span>
              {selectedFile ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </span>
              ) : (
                <span className="text-gray-500">なし</span>
              )}
            </p>
          </div>
        </div>

        {/* テスト1: 標準input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト1: 標準的なfile input（ネイティブ）</h3>
          <input
            type="file"
            id="native-test1"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* テスト2: Label + Hidden Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト2: Label + Hidden Input（ネイティブ）</h3>
          <label
            htmlFor="native-test2"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            <Upload className="h-5 w-5 mr-2" />
            ファイルを選択（Label）
          </label>
          <input
            type="file"
            id="native-test2"
            style={{ display: 'none' }}
          />
        </div>

        {/* テスト3: Button click */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト3: Button + click()（ネイティブ）</h3>
          <button
            id="native-test3-button"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FileText className="h-5 w-5 mr-2" />
            ファイルを選択（Button）
          </button>
          <input
            type="file"
            id="native-test3-input"
            style={{ display: 'none' }}
          />
        </div>

        {/* テスト4: 動的作成 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト4: 動的input作成（ネイティブ）</h3>
          <button
            id="native-test4-button"
            className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <Upload className="h-5 w-5 mr-2" />
            動的にinputを作成
          </button>
        </div>

        {/* テスト5: ダイレクトDOM */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト5: ダイレクトDOM操作</h3>
          <button
            id="native-test5-button"
            className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <Upload className="h-5 w-5 mr-2" />
            ダイレクトDOM操作
          </button>
        </div>

        {/* デバッグログ */}
        <div className="bg-gray-900 text-green-400 rounded-lg shadow p-4 mb-6 font-mono text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white">Debug Console</h3>
            <button
              onClick={clearLog}
              className="text-xs px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
          <div className="h-32 overflow-y-auto">
            {debugLog.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>

        {/* リセットボタン */}
        <div className="flex justify-center">
          <button
            onClick={resetTests}
            className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <X className="h-5 w-5 mr-2" />
            テストをリセット
          </button>
        </div>
      </div>
    </div>
  )
}