import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

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

    const integrationSpec = await parasolDb.integrationSpecification.findUnique({
      where: { serviceId: service.id }
    })

    if (!integrationSpec) {
      return NextResponse.json(
        { error: '統合仕様ドキュメントが見つかりません' },
        { status: 404 }
      )
    }

    // MD形式のコンテンツとパース済みJSONの両方を返す
    return NextResponse.json({
      success: true,
      data: {
        id: integrationSpec.id,
        serviceId: integrationSpec.serviceId,
        content: integrationSpec.content, // MD形式の全文
        parsed: {
          dependencies: integrationSpec.dependencies ? JSON.parse(integrationSpec.dependencies) : [],
          providedEvents: integrationSpec.providedEvents ? JSON.parse(integrationSpec.providedEvents) : [],
          consumedEvents: integrationSpec.consumedEvents ? JSON.parse(integrationSpec.consumedEvents) : [],
          syncApis: integrationSpec.syncApis ? JSON.parse(integrationSpec.syncApis) : [],
          asyncPatterns: integrationSpec.asyncPatterns ? JSON.parse(integrationSpec.asyncPatterns) : []
        },
        createdAt: integrationSpec.createdAt,
        updatedAt: integrationSpec.updatedAt
      }
    })
  } catch (error) {
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
    const integrationSpec = await parasolDb.integrationSpecification.upsert({
      where: { serviceId: service.id },
      update: {
        content,
        updatedAt: new Date()
      },
      create: {
        serviceId: service.id,
        content
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: integrationSpec.id,
        serviceId: integrationSpec.serviceId,
        updatedAt: integrationSpec.updatedAt
      }
    })
  } catch (error) {
    console.error('Integration specification update error:', error)
    return NextResponse.json(
      { error: '統合仕様の更新中にエラーが発生しました', details: error },
      { status: 500 }
    )
  } finally {
    await parasolDb.$disconnect()
  }
}
