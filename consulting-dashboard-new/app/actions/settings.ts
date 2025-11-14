'use server'

import { promises as fs } from 'fs'
import path from 'path'

// ファイルパスを取得するヘルパー関数
function getFilePath(category: 'schemas' | 'apis' | 'domains', fileName: string) {
  return path.join(process.cwd(), 'docs', category, `${fileName}.md`)
}

// スキーマコンテンツを取得
export async function getSchemaContent(service: string) {
  try {
    const filePath = getFilePath('schemas', service)
    const content = await fs.readFile(filePath, 'utf8')
    return {
      success: true,
      data: content
    }
  } catch (error) {
    // ファイルが存在しない場合
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'ENOENT') {
      return {
        success: true,
        data: null
      }
    }
    console.error('Error reading schema file:', error)
    return {
      success: false,
      error: 'ファイルの読み込みに失敗しました'
    }
  }
}

// スキーマコンテンツを保存
export async function saveSchemaContent(service: string, content: string) {
  try {
    const filePath = getFilePath('schemas', service)

    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })

    // ファイルを保存
    await fs.writeFile(filePath, content, 'utf8')

    return {
      success: true,
      message: 'ファイルを保存しました'
    }
  } catch (error) {
    console.error('Error saving schema file:', error)
    return {
      success: false,
      error: 'ファイルの保存に失敗しました'
    }
  }
}

// API仕様コンテンツを取得
export async function getApiContent(service: string) {
  try {
    const filePath = getFilePath('apis', service)
    const content = await fs.readFile(filePath, 'utf8')
    return {
      success: true,
      data: content
    }
  } catch (error) {
    // ファイルが存在しない場合
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'ENOENT') {
      return {
        success: true,
        data: null
      }
    }
    console.error('Error reading API file:', error)
    return {
      success: false,
      error: 'ファイルの読み込みに失敗しました'
    }
  }
}

// API仕様コンテンツを保存
export async function saveApiContent(service: string, content: string) {
  try {
    const filePath = getFilePath('apis', service)

    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })

    // ファイルを保存
    await fs.writeFile(filePath, content, 'utf8')

    return {
      success: true,
      message: 'ファイルを保存しました'
    }
  } catch (error) {
    console.error('Error saving API file:', error)
    return {
      success: false,
      error: 'ファイルの保存に失敗しました'
    }
  }
}

// ドメインコンテンツを取得
export async function getDomainContent(domain: string) {
  try {
    const filePath = getFilePath('domains', domain)
    const content = await fs.readFile(filePath, 'utf8')
    return {
      success: true,
      data: content
    }
  } catch (error) {
    // ファイルが存在しない場合
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'ENOENT') {
      return {
        success: true,
        data: null
      }
    }
    console.error('Error reading domain file:', error)
    return {
      success: false,
      error: 'ファイルの読み込みに失敗しました'
    }
  }
}

// ドメインコンテンツを保存
export async function saveDomainContent(domain: string, content: string) {
  try {
    const filePath = getFilePath('domains', domain)

    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })

    // ファイルを保存
    await fs.writeFile(filePath, content, 'utf8')

    return {
      success: true,
      message: 'ファイルを保存しました'
    }
  } catch (error) {
    console.error('Error saving domain file:', error)
    return {
      success: false,
      error: 'ファイルの保存に失敗しました'
    }
  }
}

// 全サービスのリストを取得
export async function getServicesList() {
  try {
    const services = [
      { id: 'auth-service', name: '認証サービス' },
      { id: 'project-service', name: 'プロジェクトサービス' },
      { id: 'resource-service', name: 'リソースサービス' },
      { id: 'timesheet-service', name: 'タイムシートサービス' },
      { id: 'notification-service', name: '通知サービス' },
      { id: 'knowledge-service', name: 'ナレッジサービス' },
    ]

    return {
      success: true,
      data: services
    }
  } catch (error) {
    console.error('Error getting services list:', error)
    return {
      success: false,
      error: 'サービスリストの取得に失敗しました'
    }
  }
}