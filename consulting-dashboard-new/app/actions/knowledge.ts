'use server'

import { PrismaClient as KnowledgePrismaClient } from '@prisma/knowledge-client'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'

const knowledgeDb = new KnowledgePrismaClient({
  datasources: {
    db: {
      url: process.env.KNOWLEDGE_DATABASE_URL || 'file:./prisma/knowledge-service/data/knowledge.db'
    }
  }
})

// 記事一覧を取得
export async function getArticles() {
  try {
    const articles = await knowledgeDb.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        category: true,
        attachments: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    return {
      success: true,
      data: articles
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return {
      success: false,
      error: '記事の取得に失敗しました'
    }
  }
}

// 記事詳細を取得
export async function getArticle(id: string) {
  try {
    const article = await knowledgeDb.article.findUnique({
      where: { id },
      include: {
        category: true,
        attachments: true,
        comments: {
          include: {
            replies: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!article) {
      return {
        success: false,
        error: '記事が見つかりません'
      }
    }

    // ユーザー固有の閲覧数カウント
    const user = await getCurrentUser()
    if (user) {
      // 既存の閲覧記録を確認
      const existingView = await knowledgeDb.articleView.findUnique({
        where: {
          articleId_userId: {
            articleId: id,
            userId: user.id
          }
        }
      })

      if (!existingView) {
        // 新規閲覧の場合のみカウントアップ
        await knowledgeDb.articleView.create({
          data: {
            articleId: id,
            userId: user.id
          }
        })

        await knowledgeDb.article.update({
          where: { id },
          data: {
            viewCount: {
              increment: 1
            }
          }
        })
      } else {
        // 既存の閲覧者の場合は、閲覧日時だけ更新
        await knowledgeDb.articleView.update({
          where: {
            articleId_userId: {
              articleId: id,
              userId: user.id
            }
          },
          data: {
            viewedAt: new Date()
          }
        })
      }

      // 最新の記事データを再取得（カウント更新後）
      const updatedArticle = await knowledgeDb.article.findUnique({
        where: { id },
        include: {
          category: true,
          attachments: true,
          comments: {
            include: {
              replies: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })

      // ユーザーのいいね状態を確認
      const userLike = await knowledgeDb.articleLike.findUnique({
        where: {
          articleId_userId: {
            articleId: id,
            userId: user.id
          }
        }
      })

      return {
        success: true,
        data: {
          ...updatedArticle,
          isLikedByUser: !!userLike
        }
      }
    }

    return {
      success: true,
      data: article
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return {
      success: false,
      error: '記事の取得に失敗しました'
    }
  }
}

// 新規記事を作成
export async function createArticle(data: {
  title: string
  content: string
  summary?: string
  categoryId: string
  tags?: string[]
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED'
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: 'ユーザー認証が必要です'
      }
    }

    const article = await knowledgeDb.article.create({
      data: {
        title: data.title,
        content: data.content,
        summary: data.summary,
        categoryId: data.categoryId,
        authorId: user.id,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        status: data.status || 'DRAFT',
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null
      },
      include: {
        category: true
      }
    })

    revalidatePath('/knowledge')

    return {
      success: true,
      data: article
    }
  } catch (error) {
    console.error('Error creating article:', error)
    return {
      success: false,
      error: '記事の作成に失敗しました'
    }
  }
}

// 記事を更新
export async function updateArticle(
  id: string,
  data: {
    title?: string
    content?: string
    summary?: string
    categoryId?: string
    tags?: string[]
    status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
  }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: 'ユーザー認証が必要です'
      }
    }

    const updateData: any = {
      ...data,
      updatedAt: new Date()
    }

    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags)
    }

    if (data.status === 'PUBLISHED' && data.status !== undefined) {
      updateData.publishedAt = new Date()
    }

    const article = await knowledgeDb.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    })

    revalidatePath('/knowledge')
    revalidatePath(`/knowledge/${id}`)

    return {
      success: true,
      data: article
    }
  } catch (error) {
    console.error('Error updating article:', error)
    return {
      success: false,
      error: '記事の更新に失敗しました'
    }
  }
}

// カテゴリ一覧を取得
export async function getCategories() {
  try {
    const categories = await knowledgeDb.knowledgeCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return {
      success: true,
      data: categories
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      error: 'カテゴリの取得に失敗しました'
    }
  }
}

// テンプレート一覧を取得
export async function getTemplates() {
  try {
    const templates = await knowledgeDb.template.findMany({
      where: {
        isActive: true
      },
      include: {
        category: true
      },
      orderBy: {
        useCount: 'desc'
      }
    })

    return {
      success: true,
      data: templates
    }
  } catch (error) {
    console.error('Error fetching templates:', error)
    return {
      success: false,
      error: 'テンプレートの取得に失敗しました'
    }
  }
}

// FAQ一覧を取得
export async function getFAQs() {
  try {
    const faqs = await knowledgeDb.fAQ.findMany({
      where: {
        isActive: true
      },
      include: {
        category: true
      },
      orderBy: {
        viewCount: 'desc'
      }
    })

    return {
      success: true,
      data: faqs
    }
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return {
      success: false,
      error: 'FAQの取得に失敗しました'
    }
  }
}

// 記事にいいねを追加
export async function likeArticle(articleId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: 'ユーザー認証が必要です'
      }
    }

    // 既存のいいねを確認
    const existingLike = await knowledgeDb.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId,
          userId: user.id
        }
      }
    })

    if (existingLike) {
      // いいねを削除
      await knowledgeDb.articleLike.delete({
        where: {
          id: existingLike.id
        }
      })

      await knowledgeDb.article.update({
        where: { id: articleId },
        data: {
          likeCount: {
            decrement: 1
          }
        }
      })

      return {
        success: true,
        liked: false
      }
    } else {
      // いいねを追加
      await knowledgeDb.articleLike.create({
        data: {
          articleId,
          userId: user.id
        }
      })

      await knowledgeDb.article.update({
        where: { id: articleId },
        data: {
          likeCount: {
            increment: 1
          }
        }
      })

      return {
        success: true,
        liked: true
      }
    }
  } catch (error) {
    console.error('Error liking article:', error)
    return {
      success: false,
      error: 'いいねの処理に失敗しました'
    }
  }
}

// 検索
export async function searchArticles(query: string) {
  try {
    const user = await getCurrentUser()

    // 検索ログを記録
    if (user) {
      await knowledgeDb.searchLog.create({
        data: {
          userId: user.id,
          query,
          results: 0
        }
      })
    }

    const articles = await knowledgeDb.article.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query
            }
          },
          {
            content: {
              contains: query
            }
          },
          {
            summary: {
              contains: query
            }
          },
          {
            keywords: {
              contains: query
            }
          }
        ],
        status: 'PUBLISHED'
      },
      include: {
        category: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    // 検索結果数を更新
    if (user && articles.length > 0) {
      await knowledgeDb.searchLog.updateMany({
        where: {
          userId: user.id,
          query,
          clicked: null
        },
        data: {
          results: articles.length
        }
      })
    }

    return {
      success: true,
      data: articles
    }
  } catch (error) {
    console.error('Error searching articles:', error)
    return {
      success: false,
      error: '検索に失敗しました'
    }
  }
}