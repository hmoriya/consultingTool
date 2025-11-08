import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId: serviceName } = await params // パラメータ名はserviceIdだがservice名が入る

    // service nameからserviceを取得（MD形式フィールドを含む）
    const service = await parasolDb.service.findUnique({
      where: { name: serviceName },
      select: {
        id: true,
        name: true,
        displayName: true,
        integrationSpecificationDefinition: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: `サービス '${serviceName}' が見つかりません` },
        { status: 404 }
      )
    }

    if (!service.integrationSpecificationDefinition) {
      return NextResponse.json(
        { error: '統合仕様ドキュメントが見つかりません' },
        { status: 404 }
      )
    }

    // MD形式のコンテンツを返す
    return NextResponse.json({
      success: true,
      data: {
        id: service.id,
        serviceId: service.id,
        serviceName: service.name,
        displayName: service.displayName,
        content: service.integrationSpecificationDefinition, // MD形式の全文
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }
    })
  } catch (_error) {
    console.error('Integration specification fetch error:', error)
    return NextResponse.json(
      { error: '統合仕様の取得中にエラーが発生しました', details: error },
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

    // service nameからserviceを取得・更新
    const service = await parasolDb.service.findUnique({
      where: { name: serviceName }
    })

    if (!service) {
      return NextResponse.json(
        { error: `サービス '${serviceName}' が見つかりません` },
        { status: 404 }
      )
    }

    // Serviceテーブルの統合仕様フィールドを直接更新
    const updatedService = await parasolDb.service.update({
      where: { name: serviceName },
      data: {
        integrationSpecificationDefinition: content,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedService.id,
        serviceId: updatedService.id,
        serviceName: updatedService.name,
        updatedAt: updatedService.updatedAt
      }
    })
  } catch (_error) {
    console.error('Integration specification update error:', error)
    return NextResponse.json(
      { error: '統合仕様の更新中にエラーが発生しました', details: error },
      { status: 500 }
    )
  } finally {
    await parasolDb.$disconnect()
  }
}
