'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        h1: ({children}) => <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>,
        h2: ({children}) => <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>,
        h3: ({children}) => <h3 className="text-xl font-semibold mb-2 mt-4">{children}</h3>,
        h4: ({children}) => <h4 className="text-lg font-semibold mb-2 mt-3">{children}</h4>,
        p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
        ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
        ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
        li: ({children}) => <li className="mb-1">{children}</li>,
        blockquote: ({children}) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700">
            {children}
          </blockquote>
        ),
        code: ({inline, children}) => {
          if (inline) {
            return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
          }
          return (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm font-mono">{children}</code>
            </pre>
          )
        },
        table: ({children}) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-gray-300">
              {children}
            </table>
          </div>
        ),
        thead: ({children}) => <thead className="bg-gray-100">{children}</thead>,
        tbody: ({children}) => <tbody>{children}</tbody>,
        tr: ({children}) => <tr className="border-b border-gray-300">{children}</tr>,
        th: ({children}) => <th className="px-4 py-2 text-left font-semibold border-r border-gray-300 last:border-r-0">{children}</th>,
        td: ({children}) => <td className="px-4 py-2 border-r border-gray-300 last:border-r-0">{children}</td>,
        a: ({href, children}) => (
          <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        hr: () => <hr className="my-6 border-gray-300" />,
        strong: ({children}) => <strong className="font-bold">{children}</strong>,
        em: ({children}) => <em className="italic">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  )
}