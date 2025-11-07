import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'ファイルが選択されていません' })
    }

    // ファイルサイズ制限（10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'ファイルサイズが大きすぎます（10MB以下にしてください）' })
    }

    // 許可されたファイル形式
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'サポートされていないファイル形式です' })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // ファイル名を生成（重複を避けるためnanoIDを使用）
    const fileExtension = file.name.split('.').pop()
    const fileName = `${nanoid()}.${fileExtension}`
    const filePath = join(process.cwd(), 'public', 'uploads', fileName)

    // ファイルを保存
    await writeFile(filePath, buffer)

    // アクセス可能なURLを生成
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })
  } catch (_error) {
    console.error('File upload error:', error)
    return NextResponse.json({ success: false, error: 'ファイルのアップロードに失敗しました' })
  }
}