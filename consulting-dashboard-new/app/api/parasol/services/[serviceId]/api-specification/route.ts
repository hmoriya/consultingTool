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

    const apiSpec = await parasolDb.apiSpecification.findUnique({
      where: { serviceId: service.id }
    })

    if (!apiSpec) {
      return NextResponse.json(
        { error: 'API仕様ドキュメントが見つかりません' },
        { status: 404 }
      )
    }

    // MD形式のコンテンツとパース済みJSONの両方を返す
    return NextResponse.json({
      success: true,
      data: {
        id: apiSpec.id,
        serviceId: apiSpec.serviceId,
        version: apiSpec.version,
        baseUrl: apiSpec.baseUrl,
        authMethod: apiSpec.authMethod,
        content: apiSpec.content, // MD形式の全文
        parsed: {
          endpoints: apiSpec.endpoints ? JSON.parse(apiSpec.endpoints) : [],
          errorCodes: apiSpec.errorCodes ? JSON.parse(apiSpec.errorCodes) : [],
          rateLimits: apiSpec.rateLimits ? JSON.parse(apiSpec.rateLimits) : []
        },
        createdAt: apiSpec.createdAt,
        updatedAt: apiSpec.updatedAt
      }
    })
  } catch (_error) {
    console.error('API specification fetch error:', error)
    return NextResponse.json(
      { error: 'API仕様の取得中にエラーが発生しました', details: error },
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
    const apiSpec = await parasolDb.apiSpecification.upsert({
      where: { serviceId: service.id },
      update: {
        content,
        updatedAt: new Date()
      },
      create: {
        serviceId: service.id,
        content,
        version: '1.0.0',
        baseUrl: '',
        authMethod: 'JWT'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: apiSpec.id,
        serviceId: apiSpec.serviceId,
        updatedAt: apiSpec.updatedAt
      }
    })
  } catch (_error) {
    console.error('API specification update error:', error)
    return NextResponse.json(
      { error: 'API仕様の更新中にエラーが発生しました', details: error },
      { status: 500 }
    )
  } finally {
    await parasolDb.$disconnect()
  }
}
