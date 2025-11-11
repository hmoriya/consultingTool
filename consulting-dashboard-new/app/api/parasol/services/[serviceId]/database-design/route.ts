import { NextResponse } from 'next/server'
import { parasolDb } from '@/lib/prisma-vercel'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId: serviceName } = await params // パラメータ名はserviceIdだがservice名が入る

    // service nameからserviceIdを取得
    const service = await parasolDb.service.findUnique({
      where: { name: serviceName }
    })

    if (!service) {
      return NextResponse.json(
        { error: `サービス '${serviceName}' が見つかりません` },
        { status: 404 }
      )
    }

    const dbDesign = await parasolDb.databaseDesign.findUnique({
      where: { serviceId: service.id }
    })

    if (!dbDesign) {
      return NextResponse.json(
        { error: 'データベース設計ドキュメントが見つかりません' },
        { status: 404 }
      )
    }

    // MD形式のコンテンツとパース済みJSONの両方を返す
    return NextResponse.json({
      success: true,
      data: {
        id: dbDesign.id,
        serviceId: dbDesign.serviceId,
        dbms: dbDesign.dbms,
        content: dbDesign.content, // MD形式の全文
        parsed: {
          tables: dbDesign.tables ? JSON.parse(dbDesign.tables) : [],
          indexes: dbDesign.indexes ? JSON.parse(dbDesign.indexes) : [],
          constraints: dbDesign.constraints ? JSON.parse(dbDesign.constraints) : [],
          erDiagram: dbDesign.erDiagram || null
        },
        createdAt: dbDesign.createdAt,
        updatedAt: dbDesign.updatedAt
      }
    })
  } catch (_error) {
    console.error('Database design fetch error:', error)
    return NextResponse.json(
      { error: 'データベース設計の取得中にエラーが発生しました', details: error },
      { status: 500 }
    )
  } finally {
    await parasolDb.$disconnect()
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId: serviceName } = await params // パラメータ名はserviceIdだがservice名が入る
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'コンテンツが必要です' },
        { status: 400 }
      )
    }

    // service nameからserviceIdを取得
    const service = await parasolDb.service.findUnique({
      where: { name: serviceName }
    })

    if (!service) {
      return NextResponse.json(
        { error: `サービス '${serviceName}' が見つかりません` },
        { status: 404 }
      )
    }

    // Upsert: 存在すれば更新、なければ作成
    const dbDesign = await parasolDb.databaseDesign.upsert({
      where: { serviceId: service.id },
      update: {
        content,
        updatedAt: new Date()
      },
      create: {
        serviceId: service.id,
        content,
        dbms: 'SQLite'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: dbDesign.id,
        serviceId: dbDesign.serviceId,
        updatedAt: dbDesign.updatedAt
      }
    })
  } catch (_error) {
    console.error('Database design update error:', error)
    return NextResponse.json(
      { error: 'データベース設計の更新中にエラーが発生しました', details: error },
      { status: 500 }
    )
  } finally {
    await parasolDb.$disconnect()
  }
}
