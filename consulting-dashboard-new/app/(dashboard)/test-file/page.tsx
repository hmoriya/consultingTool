'use client'

import React, { useState, useRef, useId } from 'react'
import { Upload, FileText, CheckCircle, X } from 'lucide-react'

export default function FileTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const [lastEvent, setLastEvent] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const htmlInputId = useId()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setLastEvent(`File selected: ${file.name} (${file.size} bytes)`)
    }
  }

  const handleButtonClick = () => {
    setClickCount(prev => prev + 1)
    setLastEvent(`Button clicked ${clickCount + 1} times`)
    fileInputRef.current?.click()
  }

  const handleLabelClick = () => {
    setClickCount(prev => prev + 1)
    setLastEvent(`Label clicked ${clickCount + 1} times`)
  }

  const handleDirectClick = () => {
    setClickCount(prev => prev + 1)
    setLastEvent(`Direct input trigger ${clickCount + 1} times`)
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (file) {
        setSelectedFile(file)
        setLastEvent(`File selected via direct: ${file.name}`)
      }
    }
    input.click()
  }

  const resetTest = () => {
    setSelectedFile(null)
    setClickCount(0)
    setLastEvent('Test reset')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ファイルダイアログテストページ</h1>

        {/* ステータス表示 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
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
            <p className="flex items-center">
              <span className="font-medium w-32">クリック回数:</span>
              <span>{clickCount}</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium w-32">最新イベント:</span>
              <span className="text-sm text-gray-600">{lastEvent}</span>
            </p>
          </div>
        </div>

        {/* テスト1: 標準的なHTML input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト1: 標準的なHTML input</h3>
          <input
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* テスト2: Labelとinputの組み合わせ */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト2: Label + Hidden Input</h3>
          <label
            htmlFor={htmlInputId}
            onClick={handleLabelClick}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            <Upload className="h-5 w-5 mr-2" />
            ファイルを選択（Label）
            <input
              id={htmlInputId}
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* テスト3: Buttonでref経由のクリック */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト3: Button + ref.click()</h3>
          <button
            onClick={handleButtonClick}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FileText className="h-5 w-5 mr-2" />
            ファイルを選択（Button）
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* テスト4: 動的に作成するinput */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">テスト4: 動的input作成</h3>
          <button
            onClick={handleDirectClick}
            className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <Upload className="h-5 w-5 mr-2" />
            動的にinputを作成
          </button>
        </div>

        {/* リセットボタン */}
        <div className="flex justify-center mt-8">
          <button
            onClick={resetTest}
            className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <X className="h-5 w-5 mr-2" />
            テストをリセット
          </button>
        </div>

        {/* 説明 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">テスト内容の説明</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><strong>テスト1:</strong> 最も基本的なHTML file inputの実装</li>
            <li><strong>テスト2:</strong> labelタグとhidden inputの組み合わせ（推奨パターン）</li>
            <li><strong>テスト3:</strong> ボタンクリックでref経由でinputをトリガー</li>
            <li><strong>テスト4:</strong> JavaScript で動的にinput要素を作成してクリック</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            各テスト方法でファイルダイアログが開くかどうかを確認してください。
            Chromeのセキュリティ制限により、一部の方法は動作しない可能性があります。
          </p>
        </div>
      </div>
    </div>
  )
}