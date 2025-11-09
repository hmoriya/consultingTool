/**
 * メッセージ型変換ユーティリティ
 * データベース結果とアプリケーション型の統一的な変換を提供
 */

// データベースから返される生の型定義
interface DbMessage {
  id: string
  channelId: string
  senderId: string
  content: string
  type: string
  metadata?: string | null
  editedAt?: Date | null
  deletedAt?: Date | null
  createdAt: Date
  reactions?: Array<{
    id: string
    userId: string
    emoji: string
  }>
  mentions?: Array<{
    id: string
    userId: string
    type: string
  }>
  readReceipts?: Array<{
    id: string
    userId: string
    readAt: string
  }>
  flags?: Array<{
    id: string
    userId: string
  }>
  _count?: {
    threadMessages: number
  }
  sender?: {
    id: string
    name: string
    email: string
  }
}

// アプリケーション型定義
export interface Message {
  id: string
  channelId: string
  senderId: string
  content: string
  type: string
  metadata?: string
  editedAt?: string
  deletedAt?: string
  createdAt: string
  reactions: Array<{
    id: string
    userId: string
    emoji: string
  }>
  mentions: Array<{
    id: string
    userId: string
    type: string
  }>
  readReceipts: Array<{
    id: string
    userId: string
    readAt: string
  }>
  flags?: Array<{
    id: string
    userId: string
  }>
  _count?: {
    threadMessages: number
  }
  sender?: {
    id: string
    name: string
    email: string
  }
}

/**
 * データベース結果をMessage型に変換
 */
export function convertDbMessageToMessage(dbMessage: DbMessage): Message {
  return {
    ...dbMessage,
    metadata: dbMessage.metadata || undefined,
    editedAt: dbMessage.editedAt ? dbMessage.editedAt.toISOString() : undefined,
    deletedAt: dbMessage.deletedAt ? dbMessage.deletedAt.toISOString() : undefined,
    createdAt: dbMessage.createdAt.toISOString(),
    reactions: dbMessage.reactions || [],
    mentions: dbMessage.mentions || [],
    readReceipts: dbMessage.readReceipts || [],
    flags: dbMessage.flags || undefined,
    _count: dbMessage._count || undefined,
    sender: dbMessage.sender || undefined
  }
}

/**
 * データベース結果配列をMessage配列に変換
 */
export function convertDbMessagesToMessages(dbMessages: DbMessage[]): Message[] {
  return dbMessages.map(convertDbMessageToMessage)
}

/**
 * ThreadMessage型への変換（スレッド表示用）
 */
export interface ThreadMessage {
  id: string
  messageId: string
  senderId: string
  content: string
  createdAt: string
  sender?: {
    id: string
    name: string
    email: string
  }
}

/**
 * MessageをThreadMessageに変換
 */
export function convertMessageToThreadMessage(message: Message, parentMessageId: string): ThreadMessage {
  return {
    id: message.id,
    messageId: parentMessageId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
    sender: message.sender
  }
}

/**
 * Message配列をThreadMessage配列に変換
 */
export function convertMessagesToThreadMessages(messages: Message[], parentMessageId: string): ThreadMessage[] {
  return messages.map(message => convertMessageToThreadMessage(message, parentMessageId))
}