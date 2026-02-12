"use client";

import { Send, Square } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

export function ChatInput(props: ChatInputProps) {
  const { input, setInput, onSubmit, disabled } = props;

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about audio production..."
        className="flex-1 rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-900 text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? (
          <Square className="h-3 w-3" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </form>
  );
}
