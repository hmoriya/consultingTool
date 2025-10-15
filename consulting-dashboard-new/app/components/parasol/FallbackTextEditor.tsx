'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface FallbackTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function FallbackTextEditor({
  value,
  onChange,
  placeholder = 'マークダウンを入力してください...',
  className = '',
}: FallbackTextEditorProps) {
  // カーソル位置での挿入
  const insertText = (text: string, cursorOffset: number = 0) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);

    onChange(newValue);

    // カーソル位置を調整
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  };

  // Markdownツールバーアクション
  const actions = [
    {
      icon: Heading1,
      label: '見出し1',
      action: () => insertText('# ', 2),
    },
    {
      icon: Heading2,
      label: '見出し2',
      action: () => insertText('## ', 3),
    },
    {
      icon: Heading3,
      label: '見出し3',
      action: () => insertText('### ', 4),
    },
    {
      icon: Bold,
      label: '太字',
      action: () => insertText('****', 2),
    },
    {
      icon: Italic,
      label: '斜体',
      action: () => insertText('**', 1),
    },
    {
      icon: Quote,
      label: '引用',
      action: () => insertText('> ', 2),
    },
    {
      icon: Code,
      label: 'コード',
      action: () => insertText('``', 1),
    },
    {
      icon: List,
      label: 'リスト',
      action: () => insertText('- ', 2),
    },
    {
      icon: ListOrdered,
      label: '番号付きリスト',
      action: () => insertText('1. ', 3),
    },
    {
      icon: Link,
      label: 'リンク',
      action: () => insertText('[]()', 1),
    },
    {
      icon: Image,
      label: '画像',
      action: () => insertText('![]()', 2),
    },
    {
      icon: Table,
      label: 'テーブル',
      action: () => insertText('| 項目1 | 項目2 |\n|-------|-------|\n| 値1   | 値2   |', 0),
    },
  ];

  // キーボードショートカット
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + B: 太字
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertText('****', 2);
    }
    // Ctrl/Cmd + I: 斜体
    else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertText('**', 1);
    }
    // Ctrl/Cmd + K: リンク
    else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      insertText('[]()', 1);
    }
    // Tab: インデント
    else if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ', 2);
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* ツールバー */}
      <div className="border-b bg-muted/30 p-2">
        <div className="flex items-center gap-1 flex-wrap">
          <Badge variant="outline" className="text-xs mr-2">
            簡易エディタ（Monaco Editor代替）
          </Badge>

          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.action}
                title={action.label}
                className="h-8 w-8 p-0"
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          <span className="mr-4">Ctrl+B: 太字</span>
          <span className="mr-4">Ctrl+I: 斜体</span>
          <span className="mr-4">Ctrl+K: リンク</span>
          <span>Tab: インデント</span>
        </div>
      </div>

      {/* エディタエリア */}
      <div className="flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-full resize-none border-0 rounded-none focus:ring-0 focus:border-0 font-mono text-sm leading-relaxed"
          style={{
            minHeight: '100%',
            lineHeight: '1.6',
          }}
        />
      </div>

      {/* ステータスバー */}
      <div className="border-t bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>
            {value.split('\n').length} 行 | {value.length} 文字
          </span>
          <span>
            Markdown形式
          </span>
        </div>
      </div>
    </div>
  );
}