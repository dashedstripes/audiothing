"use client";

import { isTextUIPart, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface MessageProps {
  message: UIMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const parts = message.parts ?? [];

  const content = parts.filter(isTextUIPart).filter((part) => part.text.trim());

  if (content.length === 0) return null;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] space-y-2 rounded-lg px-4 py-3 text-sm",
          isUser
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-900"
        )}
      >
        {content.map((part, i) => (
          <div key={i} className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                a: ({ href = "", children }) => {
                  const isInternal = href.startsWith("/");
                  const className = cn(
                    "underline",
                    isUser
                      ? "text-white/90 hover:text-white"
                      : "text-blue-600 hover:text-blue-700"
                  );

                  if (isInternal) {
                    return (
                      <Link href={href} className={className}>
                        {children}
                      </Link>
                    );
                  }

                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {children}
                    </a>
                  );
                },
                p: ({ children }) => (
                  <p className="whitespace-pre-wrap mb-2 last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-2">{children}</ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                code: ({ children }) => (
                  <code className="bg-neutral-200 px-1 py-0.5 rounded text-xs">
                    {children}
                  </code>
                ),
              }}
            >
              {part.text}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}
