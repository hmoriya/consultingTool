import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  File,
  FileType
} from 'lucide-react'

/**
 * ファイルタイプから適切なアイコンコンポーネントを返す
 */
export function getFileIcon(fileName: string, fileType?: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  // MIMEタイプでの判定
  if (fileType) {
    if (fileType === 'application/pdf') return FileText
    if (fileType.startsWith('image/')) return FileImage
    if (fileType.startsWith('video/')) return FileVideo
    if (fileType.startsWith('audio/')) return FileAudio
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileSpreadsheet
    if (fileType.includes('document') || fileType.includes('word')) return FileText
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return FileType
    if (fileType.includes('zip') || fileType.includes('compressed')) return FileArchive
  }

  // 拡張子での判定
  switch (extension) {
    // ドキュメント
    case 'pdf':
      return FileText
    case 'doc':
    case 'docx':
    case 'txt':
    case 'rtf':
    case 'odt':
      return FileText

    // スプレッドシート
    case 'xls':
    case 'xlsx':
    case 'csv':
    case 'ods':
      return FileSpreadsheet

    // プレゼンテーション
    case 'ppt':
    case 'pptx':
    case 'odp':
      return FileType

    // 画像
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
    case 'ico':
    case 'bmp':
      return FileImage

    // 動画
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
    case 'mkv':
      return FileVideo

    // 音声
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
    case 'aac':
    case 'm4a':
      return FileAudio

    // アーカイブ
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
    case 'bz2':
      return FileArchive

    // コード
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
    case 'cs':
    case 'php':
    case 'rb':
    case 'go':
    case 'rust':
    case 'swift':
    case 'kt':
    case 'scala':
    case 'html':
    case 'css':
    case 'scss':
    case 'json':
    case 'xml':
    case 'yaml':
    case 'yml':
    case 'sql':
    case 'sh':
    case 'bash':
    case 'ps1':
      return FileCode

    default:
      return File
  }
}

/**
 * ファイルが画像かどうかを判定
 */
export function isImageFile(fileName: string, fileType?: string): boolean {
  if (fileType && fileType.startsWith('image/')) {
    return true
  }

  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp']

  return imageExtensions.includes(extension)
}

/**
 * ファイルタイプの表示名を取得
 */
export function getFileTypeLabel(fileName: string, fileType?: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  // MIMEタイプでの判定
  if (fileType) {
    if (fileType === 'application/pdf') return 'PDF'
    if (fileType.startsWith('image/')) return '画像'
    if (fileType.startsWith('video/')) return '動画'
    if (fileType.startsWith('audio/')) return '音声'
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'スプレッドシート'
    if (fileType.includes('document') || fileType.includes('word')) return 'ドキュメント'
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'プレゼンテーション'
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'アーカイブ'
  }

  // 拡張子での判定
  const typeMap: Record<string, string> = {
    // ドキュメント
    pdf: 'PDF',
    doc: 'Word',
    docx: 'Word',
    txt: 'テキスト',
    rtf: 'リッチテキスト',
    odt: 'OpenDocument',

    // スプレッドシート
    xls: 'Excel',
    xlsx: 'Excel',
    csv: 'CSV',
    ods: 'OpenDocument',

    // プレゼンテーション
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    odp: 'OpenDocument',

    // 画像
    jpg: 'JPEG画像',
    jpeg: 'JPEG画像',
    png: 'PNG画像',
    gif: 'GIF画像',
    webp: 'WebP画像',
    svg: 'SVG画像',
    ico: 'アイコン',
    bmp: 'ビットマップ',

    // 動画
    mp4: 'MP4動画',
    avi: 'AVI動画',
    mov: 'QuickTime',
    wmv: 'Windows Media',
    flv: 'Flash動画',
    webm: 'WebM動画',
    mkv: 'Matroska',

    // 音声
    mp3: 'MP3音声',
    wav: 'WAV音声',
    ogg: 'OGG音声',
    flac: 'FLAC音声',
    aac: 'AAC音声',
    m4a: 'M4A音声',

    // アーカイブ
    zip: 'ZIPアーカイブ',
    rar: 'RARアーカイブ',
    '7z': '7-Zipアーカイブ',
    tar: 'TARアーカイブ',
    gz: 'GZIPアーカイブ',
    bz2: 'BZIP2アーカイブ',

    // コード
    js: 'JavaScript',
    ts: 'TypeScript',
    tsx: 'TypeScript React',
    jsx: 'JavaScript React',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    cs: 'C#',
    php: 'PHP',
    rb: 'Ruby',
    go: 'Go',
    rust: 'Rust',
    swift: 'Swift',
    kt: 'Kotlin',
    scala: 'Scala',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    json: 'JSON',
    xml: 'XML',
    yaml: 'YAML',
    yml: 'YAML',
    sql: 'SQL',
    sh: 'シェルスクリプト',
    bash: 'Bashスクリプト',
    ps1: 'PowerShell',
  }

  return typeMap[extension] || extension.toUpperCase() + 'ファイル'
}

/**
 * ファイルタイプに応じた背景色を取得（Tailwind CSS クラス）
 */
export function getFileTypeColor(fileName: string, fileType?: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  // MIMEタイプでの判定
  if (fileType) {
    if (fileType === 'application/pdf') return 'bg-red-100 dark:bg-red-900/20'
    if (fileType.startsWith('image/')) return 'bg-blue-100 dark:bg-blue-900/20'
    if (fileType.startsWith('video/')) return 'bg-purple-100 dark:bg-purple-900/20'
    if (fileType.startsWith('audio/')) return 'bg-pink-100 dark:bg-pink-900/20'
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'bg-green-100 dark:bg-green-900/20'
    if (fileType.includes('document') || fileType.includes('word')) return 'bg-blue-100 dark:bg-blue-900/20'
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'bg-orange-100 dark:bg-orange-900/20'
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'bg-yellow-100 dark:bg-yellow-900/20'
  }

  // 拡張子での判定
  const colorMap: Record<string, string> = {
    // ドキュメント系
    pdf: 'bg-red-100 dark:bg-red-900/20',
    doc: 'bg-blue-100 dark:bg-blue-900/20',
    docx: 'bg-blue-100 dark:bg-blue-900/20',
    txt: 'bg-gray-100 dark:bg-gray-900/20',

    // スプレッドシート系
    xls: 'bg-green-100 dark:bg-green-900/20',
    xlsx: 'bg-green-100 dark:bg-green-900/20',
    csv: 'bg-green-100 dark:bg-green-900/20',

    // プレゼンテーション系
    ppt: 'bg-orange-100 dark:bg-orange-900/20',
    pptx: 'bg-orange-100 dark:bg-orange-900/20',

    // 画像系
    jpg: 'bg-blue-100 dark:bg-blue-900/20',
    jpeg: 'bg-blue-100 dark:bg-blue-900/20',
    png: 'bg-blue-100 dark:bg-blue-900/20',
    gif: 'bg-blue-100 dark:bg-blue-900/20',

    // 動画系
    mp4: 'bg-purple-100 dark:bg-purple-900/20',
    avi: 'bg-purple-100 dark:bg-purple-900/20',
    mov: 'bg-purple-100 dark:bg-purple-900/20',

    // 音声系
    mp3: 'bg-pink-100 dark:bg-pink-900/20',
    wav: 'bg-pink-100 dark:bg-pink-900/20',

    // アーカイブ系
    zip: 'bg-yellow-100 dark:bg-yellow-900/20',
    rar: 'bg-yellow-100 dark:bg-yellow-900/20',

    // コード系
    js: 'bg-indigo-100 dark:bg-indigo-900/20',
    ts: 'bg-indigo-100 dark:bg-indigo-900/20',
    py: 'bg-indigo-100 dark:bg-indigo-900/20',
  }

  return colorMap[extension] || 'bg-gray-100 dark:bg-gray-900/20'
}