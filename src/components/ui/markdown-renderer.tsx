import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("text-sm", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
          <h1 className="text-lg font-bold mt-3 mb-2 text-foreground">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mt-3 mb-2 text-foreground">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mt-2 mb-1 text-foreground">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 text-foreground/90">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-2 space-y-1 text-foreground/90">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1 text-foreground/90">{children}</ol>
        ),
        li: ({ children }) => <li className="text-foreground/90">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-primary">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 rounded bg-background/50 text-primary text-xs font-mono">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="p-2 rounded bg-background/50 overflow-x-auto mb-2 text-xs">
            {children}
          </pre>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary/50 pl-3 italic text-foreground/70 my-2">
            {children}
          </blockquote>
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
