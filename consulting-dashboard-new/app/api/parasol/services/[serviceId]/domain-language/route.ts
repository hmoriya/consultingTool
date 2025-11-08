import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params

    const domainLanguage = await parasolDb.domainLanguage.findUnique({
      where: { serviceId }
    })

    if (!domainLanguage) {
      return NextResponse.json(
        { error: 'ドメイン言語ドキュメントが見つかりません' },
        { status: 404 }
      )
    }

    // MD形式のコンテンツとパース済みJSONの両方を返す
    return NextResponse.json({
      success: true,
      data: {
        id: domainLanguage.id,
        serviceId: domainLanguage.serviceId,
        version: domainLanguage.version,
        content: domainLanguage.content, // MD形式の全文
        parsed: {
          entities: domainLanguage.entities ? JSON.parse(domainLanguage.entities) : [],
          valueObjects: domainLanguage.valueObjects ? JSON.parse(domainLanguage.valueObjects) : [],
          aggregates: domainLanguage.aggregates ? JSON.parse(domainLanguage.aggregates) : [],
          domainServices: domainLanguage.domainServices ? JSON.parse(domainLanguage.domainServices) : [],
          domainEvents: domainLanguage.domainEvents ? JSON.parse(domainLanguage.domainEvents) : [],
          businessRules: domainLanguage.businessRules ? JSON.parse(domainLanguage.businessRules) : []
        },
        createdAt: domainLanguage.createdAt,
        updatedAt: domainLanguage.updatedAt
      }
    })
  } catch (_error) {
    console.error('Domain language fetch error:', error)
    return NextResponse.json(
      { error: 'ドメイン言語の取得中にエラーが発生しました', details: error },
      { status: 500 }
    )
  } finally {
    await parasolDb.$disconnect()
  }
}
