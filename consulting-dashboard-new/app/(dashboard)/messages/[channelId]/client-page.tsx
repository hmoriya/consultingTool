'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Send,
  Paperclip,
  Smile,
  File,
  Image as ImageIcon,
  FileText,
  X
} from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { sendMessage, addReaction, pinMessage, markChannelAsRead, toggleMessageFlag } from '@/actions/messages'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MessageItem } from '@/components/messages/message-item'
import { ChannelHeader } from '@/components/messages/channel-header'
import { ThreadView } from '@/components/messages/thread-view'
import { EditMessageDialog } from '@/components/messages/edit-message-dialog'
import { DeleteMessageDialog } from '@/components/messages/delete-message-dialog'
import { sendThreadMessage, getThreadMessages } from '@/actions/messages'

interface ThreadMessage {
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

interface Message {
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

// APIから返される部分的なMessageデータの型
interface MessageApiResponse {
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
  _count?: {
    threadMessages: number
  }
}

interface Channel {
  id: string
  name?: string | null
  description?: string | null
  type: string
  isPrivate: boolean
  members: Array<{
    userId: string
    role: string
  }>
  _count: {
    messages: number
  }
}

interface ChatClientProps {
  channel: Channel
  initialMessages: Message[]
  currentUserId: string
  currentUser?: {
    id: string
    name: string
    email: string
  }
}

export default function ChatClient({ channel, initialMessages, currentUserId, currentUser }: ChatClientProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMentionList, setShowMentionList] = useState(false)
  const [mentionSearch, setMentionSearch] = useState('')
  const [mentionIndex, setMentionIndex] = useState(0)
  const [selectedThread, setSelectedThread] = useState<Message | null>(null)
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([])
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null)
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // よく使う絵文字のリスト
  const quickEmojis = ['😊', '👍', '❤️', '🎉', '😂', '🙏', '👏', '🔥', '✨', '💪', '🚀', '💯']

  // メンション用のユーザーリスト（デモデータ）
  const mentionUsers = [
    { id: 'user1', name: '山田 太郎', email: 'yamada@example.com' },
    { id: 'user2', name: '佐藤 次郎', email: 'sato@example.com' },
    { id: 'user3', name: '鈴木 花子', email: 'suzuki@example.com' },
    { id: 'user4', name: '高橋 愛', email: 'takahashi@example.com' },
    { id: 'user5', name: '渡辺 健', email: 'watanabe@example.com' },
  ]

  // メンション検索結果
  const filteredMentionUsers = mentionUsers.filter(user =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(mentionSearch.toLowerCase())
  )

  // 最下部にスクロール
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // メッセージ入力のハンドラ
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNewMessage(value)

    // @が入力された場合、メンションリストを表示
    const lastAtIndex = value.lastIndexOf('@')
    if (lastAtIndex !== -1) {
      const afterAt = value.substring(lastAtIndex + 1)
      const spaceIndex = afterAt.indexOf(' ')

      if (spaceIndex === -1) {
        // @の後にスペースがない場合、メンションリストを表示
        setMentionSearch(afterAt)
        setShowMentionList(true)
        setMentionIndex(0)
      } else {
        setShowMentionList(false)
      }
    } else {
      setShowMentionList(false)
    }
  }

  // メンションを選択
  const selectMention = (user: typeof mentionUsers[0]) => {
    const lastAtIndex = newMessage.lastIndexOf('@')
    if (lastAtIndex !== -1) {
      const beforeAt = newMessage.substring(0, lastAtIndex)
      const afterAt = newMessage.substring(lastAtIndex + 1)
      const spaceIndex = afterAt.indexOf(' ')
      const afterMention = spaceIndex !== -1 ? afterAt.substring(spaceIndex) : ''

      setNewMessage(`${beforeAt}@[${user.name}] ${afterMention}`)
      setShowMentionList(false)
      inputRef.current?.focus()
    }
  }

  // キーボードナビゲーション
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentionList) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setMentionIndex(prev =>
        prev < filteredMentionUsers.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setMentionIndex(prev => prev > 0 ? prev - 1 : 0)
    } else if (e.key === 'Enter' && filteredMentionUsers.length > 0) {
      e.preventDefault()
      const mentionUser = filteredMentionUsers[mentionIndex]
      if (mentionUser) {
        selectMention(mentionUser)
      }
    } else if (e.key === 'Escape') {
      setShowMentionList(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // チャンネルを開いた時に既読を更新（ページロード後に実行）
  useEffect(() => {
    console.log('Setting up markChannelAsRead for channel:', channel.id)
    // タイムアウトを使用してレンダリング完了後に実行
    const timer = setTimeout(async () => {
      try {
        console.log('Calling markChannelAsRead for channel:', channel.id)
        const result = await markChannelAsRead(channel.id)
        console.log('markChannelAsRead result:', result)
      } catch (error) {
        console.error('Failed to mark channel as read:', error)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [channel.id])

  // ネイティブDOMイベントリスナーを使用してファイル選択を処理
  useEffect(() => {
    const fileInput = fileInputRef.current
    if (!fileInput) return

    const handleNativeFileSelect = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]

      if (file) {
        // ファイルサイズチェック（10MB）
        if (file.size > 10 * 1024 * 1024) {
          toast.error('ファイルサイズが大きすぎます（10MB以下にしてください）')
          // inputをリセット
          target.value = ''
          return
        }
        setSelectedFile(file)
      }
    }

    // ネイティブDOMイベントリスナーを追加
    fileInput.addEventListener('change', handleNativeFileSelect)

    // クリーンアップ
    return () => {
      fileInput.removeEventListener('change', handleNativeFileSelect)
    }
  }, [])


  // ファイルアップロードとメッセージ送信
  const handleFileUpload = async () => {
    if (!selectedFile || isUploading) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // ファイルをアップロード
      const formData = new FormData()
      formData.append('file', selectedFile)

      // アップロードの進捗をシミュレート（実際のXHRでは onUploadProgress を使用）
      setUploadProgress(30)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      setUploadProgress(60)

      const uploadResult = await uploadResponse.json()
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'アップロードに失敗しました')
      }

      setUploadProgress(80)

      // ファイルメッセージを送信
      const metadata = {
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        fileType: uploadResult.fileType
      }

      const result = await sendMessage({
        channelId: channel.id,
        content: uploadResult.fileName,
        type: 'file',
        metadata
      })

      setUploadProgress(100)

      if (result.success && result.data) {
        const apiResponse = result.data as MessageApiResponse
        const tempMsg: Message = {
          ...apiResponse,
          createdAt: apiResponse.createdAt.toISOString(),
          metadata: apiResponse.metadata || '',
          editedAt: apiResponse.editedAt ? apiResponse.editedAt.toISOString() : '',
          deletedAt: apiResponse.deletedAt ? apiResponse.deletedAt.toISOString() : '',
          reactions: apiResponse.reactions || [],
          mentions: apiResponse.mentions || [],
          readReceipts: apiResponse.readReceipts || [],
          _count: apiResponse._count || { threadMessages: 0 },
          sender: currentUser || {
            id: currentUserId,
            name: 'You',
            email: ''
          }
        }
        setMessages(prev => [...prev, tempMsg])
        router.refresh()
        setSelectedFile(null)
        toast.success('ファイルを送信しました')
      } else {
        throw new Error(result.error || 'メッセージの送信に失敗しました')
      }
    } catch (_error) {
      console.error('File upload error:', _error)
      toast.error(_error instanceof Error ? _error.message : 'ファイルの送信に失敗しました')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // メッセージ送信
  const handleSendMessage = async () => {
    // ファイルが選択されている場合はファイルアップロード
    if (selectedFile) {
      await handleFileUpload()
      return
    }

    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)
    const tempMessage = newMessage
    setNewMessage('')

    try {
      const result = await sendMessage({
        channelId: channel.id,
        content: tempMessage,
        type: 'text'
      })

      if (result.success && result.data) {
        // 送信したメッセージを一時的に追加（sender情報を含む）
        const apiResponse = result.data as MessageApiResponse
        const tempMsg: Message = {
          ...apiResponse,
          createdAt: apiResponse.createdAt.toISOString(),
          metadata: apiResponse.metadata || '',
          editedAt: apiResponse.editedAt ? apiResponse.editedAt.toISOString() : '',
          deletedAt: apiResponse.deletedAt ? apiResponse.deletedAt.toISOString() : '',
          reactions: apiResponse.reactions || [],
          mentions: apiResponse.mentions || [],
          readReceipts: apiResponse.readReceipts || [],
          _count: apiResponse._count || { threadMessages: 0 },
          sender: currentUser || {
            id: currentUserId,
            name: 'You',
            email: ''
          }
        }
        setMessages(prev => [...prev, tempMsg])
        // バックグラウンドでページを更新
        router.refresh()
      } else {
        toast.error(result.error || 'メッセージの送信に失敗しました')
        setNewMessage(tempMessage) // 失敗時は復元
      }
    } catch {
      toast.error('エラーが発生しました')
      setNewMessage(tempMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // メッセージを日付でグループ化
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt)
    const dateKey = format(date, 'yyyy-MM-dd')
    
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(message)
    return groups
  }, {} as Record<string, Message[]>)

  // 日付ラベルを生成
  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return '今日'
    if (isYesterday(date)) return '昨日'
    return format(date, 'M月d日(E)', { locale: ja })
  }

  // スレッドを開く
  const handleThreadClick = async (message: Message) => {
    setSelectedThread(message)
    // スレッドメッセージを取得
    const result = await getThreadMessages(message.id)
    if (result.success && result.data) {
      // APIレスポンスをThreadMessage型に変換
      const convertedMessages: ThreadMessage[] = result.data.map((threadMsg: MessageApiResponse) => ({
        id: threadMsg.id,
        messageId: message.id, // 親メッセージのIDを設定
        senderId: threadMsg.senderId,
        content: threadMsg.content,
        createdAt: threadMsg.createdAt.toISOString(),
        sender: {
          id: threadMsg.senderId,
          name: 'User', // 実際の実装では適切なユーザー情報を取得
          email: ''
        }
      }))
      setThreadMessages(convertedMessages)
    }
  }

  // スレッドに返信を送信
  const handleSendThreadReply = async (content: string) => {
    if (!selectedThread) return

    const result = await sendThreadMessage({
      messageId: selectedThread.id,
      content
    })

    if (result.success && result.data) {
      // APIレスポンスをThreadMessage型に変換
      const apiResponse = result.data as MessageApiResponse
      const newThreadMessage: ThreadMessage = {
        id: apiResponse.id,
        messageId: selectedThread.id, // 親メッセージのIDを設定
        senderId: apiResponse.senderId,
        content: apiResponse.content,
        createdAt: apiResponse.createdAt.toISOString(),
        sender: currentUser || {
          id: currentUserId,
          name: 'You',
          email: ''
        }
      }
      setThreadMessages(prev => [...prev, newThreadMessage])
      // メインメッセージのスレッドカウントを更新
      setMessages(prev => prev.map(msg =>
        msg.id === selectedThread.id
          ? { ...msg, _count: { ...msg._count, threadMessages: (msg._count?.threadMessages || 0) + 1 } }
          : msg
      ))
      toast.success('返信を送信しました')
    } else {
      throw new Error(result.error || '返信の送信に失敗しました')
    }
  }

  // メッセージを編集
  const handleEditMessage = (message: Message) => {
    setEditingMessage({ id: message.id, content: message.content })
  }

  // 編集成功時の処理
  const handleEditSuccess = (newContent: string) => {
    // メッセージリストの内容を更新
    if (editingMessage) {
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === editingMessage.id 
          ? { ...msg, content: newContent, editedAt: new Date().toISOString() }
          : msg
      ))
    }
    setEditingMessage(null)
    // 念のためリフレッシュも実行
    router.refresh()
  }

  // メッセージを削除
  const handleDeleteMessage = (messageId: string) => {
    setDeletingMessageId(messageId)
  }

  // 削除成功時の処理
  const handleDeleteSuccess = () => {
    // メッセージリストから削除されたメッセージを除外
    if (deletingMessageId) {
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== deletingMessageId))
    }
    setDeletingMessageId(null)
    // 念のためリフレッシュも実行
    router.refresh()
  }

  // メッセージをピン留め
  const handlePinMessage = async (messageId: string) => {
    const result = await pinMessage(messageId, channel.id)
    if (result.success) {
      toast.success('メッセージをピン留めしました')
    } else {
      toast.error(result.error || 'ピン留めに失敗しました')
    }
  }

  // メッセージにフラグを立てる/外す
  const handleToggleFlag = async (messageId: string) => {
    const result = await toggleMessageFlag(messageId)
    if (result.success) {
      // メッセージリストを更新
      setMessages(prevMessages => prevMessages.map(msg => {
        if (msg.id === messageId) {
          const flags = msg.flags || []
          const hasFlagged = result.data?.flagged
          
          if (hasFlagged) {
            // フラグを追加
            return {
              ...msg,
              flags: [...flags, { id: Date.now().toString(), userId: currentUserId }]
            }
          } else {
            // フラグを削除
            return {
              ...msg,
              flags: flags.filter(f => f.userId !== currentUserId)
            }
          }
        }
        return msg
      }))
      
      toast.success(result.data?.flagged ? 'フラグを立てました' : 'フラグを外しました')
    } else {
      toast.error(result.error || 'フラグの設定に失敗しました')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* ヘッダー */}
      <ChannelHeader channel={channel} />

      {/* メッセージエリア */}
      <ScrollArea className="flex-1 overflow-y-auto pb-32" ref={scrollAreaRef}>
        <div className="py-4">
          {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              {/* 日付セパレーター */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                <span className="text-xs text-muted-foreground font-medium bg-background px-3 py-1 rounded-full border">
                  {getDateLabel(dateKey)}
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              </div>

              {/* メッセージ */}
              <div className="space-y-0">
                {dateMessages.map((message, index) => {
                  const prevMessage = index > 0 ? dateMessages[index - 1] : null
                  const showAvatar = !prevMessage ||
                    prevMessage.senderId !== message.senderId ||
                    new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000 // 5分以上の差


                  // 編集中のメッセージの場合
                  // インライン編集を削除（モーダルで編集）

                  return (
                    <MessageItem
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === currentUserId}
                      showAvatar={showAvatar}
                      currentUserId={currentUserId}
                      onReaction={async (emoji) => {
                        const result = await addReaction(message.id, emoji)
                        if (result.success) {
                          // メッセージリストを更新
                          const updatedMessages = messages.map(msg => {
                            if (msg.id === message.id) {
                              const reactions = msg.reactions || []
                              const existingReaction = reactions.find(
                                r => r.userId === currentUserId && r.emoji === emoji
                              )

                              if (result.data?.action === 'removed') {
                                // リアクションを削除
                                return {
                                  ...msg,
                                  reactions: reactions.filter(
                                    r => !(r.userId === currentUserId && r.emoji === emoji)
                                  )
                                }
                              } else {
                                // リアクションを追加
                                return {
                                  ...msg,
                                  reactions: existingReaction
                                    ? reactions
                                    : [...reactions, {
                                        id: Date.now().toString(),
                                        userId: currentUserId,
                                        emoji,
                                        messageId: message.id
                                      }]
                                }
                              }
                            }
                            return msg
                          })
                          setMessages(updatedMessages)
                        } else {
                          toast.error('リアクションの追加に失敗しました')
                        }
                      }}
                      onThreadClick={() => handleThreadClick(message)}
                      onEdit={() => handleEditMessage(message)}
                      onDelete={() => handleDeleteMessage(message.id)}
                      onPin={() => handlePinMessage(message.id)}
                      onFlag={() => handleToggleFlag(message.id)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* 入力エリア - 固定位置 */}
      <div className="fixed bottom-0 left-64 right-0 border-t bg-background p-4 z-10">
        <div className="max-w-4xl mx-auto">
          {/* ファイル選択表示 */}
          {selectedFile && (
            <div className="mb-3 p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedFile.type.startsWith('image/') ? (
                    <ImageIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  ) : selectedFile.type === 'application/pdf' ? (
                    <FileText className="h-5 w-5 text-red-500" />
                  ) : (
                    <File className="h-5 w-5 text-gray-500" />
                  )}
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <span className="text-xs text-muted-foreground">アップロード中... {uploadProgress}%</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 items-end">
            {/* ネイティブDOM addEventListenerを使用（onChange属性を削除） */}
            <label
              htmlFor="file-upload-input"
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 w-9 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Paperclip className="h-5 w-5" />
            </label>
            <input
              ref={fileInputRef}
              id="file-upload-input"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.zip"
              disabled={isUploading}
              style={{ display: 'none' }}
            />
            
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                placeholder="メッセージを入力... (@でメンション)\nShift+Enterで改行"
                value={newMessage}
                onChange={handleMessageChange}
                onKeyDown={(e) => {
                  handleKeyDown(e)
                  if (e.key === 'Enter' && !e.shiftKey && !showMentionList) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={isLoading}
                className="pr-10 py-3 text-base bg-muted/50 border-input focus:ring-2 focus:ring-primary resize-none min-h-[60px] max-h-[200px]"
                rows={2}
              />

              {/* メンションリスト */}
              {showMentionList && filteredMentionUsers.length > 0 && (
                <div className="absolute bottom-full left-0 mb-2 w-full max-w-sm bg-popover border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredMentionUsers.map((user, index) => (
                    <button
                      key={user.id}
                      onClick={() => selectMention(user)}
                      className={cn(
                        "w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center gap-2",
                        index === mentionIndex && "bg-muted"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs flex items-center justify-center">
                        {user.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" />
              </Button>

              {/* 絵文字ピッカー */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-popover border rounded-lg shadow-lg z-50">
                  <div className="grid grid-cols-6 gap-1">
                    {quickEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewMessage(prev => prev + emoji)
                          setShowEmojiPicker(false)
                        }}
                        className="p-2 hover:bg-muted rounded text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && !selectedFile) || isLoading || isUploading}
              size="icon"
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* スレッドビュー */}
      {selectedThread && (
        <ThreadView
          parentMessage={selectedThread}
          isOpen={!!selectedThread}
          onClose={() => setSelectedThread(null)}
          onSendReply={handleSendThreadReply}
          threadMessages={threadMessages}
          currentUserId={currentUserId}
        />
      )}

      {/* 編集ダイアログ */}
      {editingMessage && (
        <EditMessageDialog
          messageId={editingMessage.id}
          initialContent={editingMessage.content}
          open={!!editingMessage}
          onClose={() => setEditingMessage(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* 削除確認ダイアログ */}
      {deletingMessageId && (
        <DeleteMessageDialog
          messageId={deletingMessageId}
          open={!!deletingMessageId}
          onClose={() => setDeletingMessageId(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}