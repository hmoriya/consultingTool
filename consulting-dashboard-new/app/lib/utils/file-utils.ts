import { FileText, Image, FileCode, File, Archive, Music, Video, FileSpreadsheet } from 'lucide-react'

export function getFileIcon(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return Image
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return FileText
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'html':
    case 'css':
    case 'json':
      return FileCode
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return Archive
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return Music
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'webm':
      return Video
    case 'xls':
    case 'xlsx':
    case 'csv':
      return FileSpreadsheet
    default:
      return File
  }
}

export function isImageFile(fileName: string): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase()
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  return imageExtensions.includes(extension || '')
}

export function getFileTypeLabel(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
    case 'bmp':
    case 'ico':
      return '画像'
    case 'pdf':
      return 'PDF'
    case 'doc':
    case 'docx':
      return 'Word文書'
    case 'txt':
      return 'テキスト'
    case 'xls':
    case 'xlsx':
      return 'Excel'
    case 'csv':
      return 'CSV'
    case 'ppt':
    case 'pptx':
      return 'PowerPoint'
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return 'アーカイブ'
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return '音声'
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'webm':
      return '動画'
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'html':
    case 'css':
    case 'json':
    case 'xml':
      return 'コード'
    default:
      return 'ファイル'
  }
}

export function getFileTypeColor(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
    case 'bmp':
    case 'ico':
      return 'bg-green-100 text-green-800'
    case 'pdf':
      return 'bg-red-100 text-red-800'
    case 'doc':
    case 'docx':
      return 'bg-blue-100 text-blue-800'
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'bg-emerald-100 text-emerald-800'
    case 'ppt':
    case 'pptx':
      return 'bg-orange-100 text-orange-800'
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return 'bg-yellow-100 text-yellow-800'
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return 'bg-purple-100 text-purple-800'
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'webm':
      return 'bg-pink-100 text-pink-800'
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'html':
    case 'css':
    case 'json':
    case 'xml':
      return 'bg-indigo-100 text-indigo-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}