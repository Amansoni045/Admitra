"use client";

import React from "react";
import { ArrowUp } from "lucide-react";

interface MessageComposerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function MessageComposer({
  onSendMessage,
  isLoading,
}: MessageComposerProps) {
  const [text, setText] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none z-30">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="relative flex items-end bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 focus-within:border-zinc-700/80 rounded-2xl shadow-2xl transition-all duration-200 p-2 sm:p-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask anything about your college rules, fees, or academics..."
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none resize-none px-2 py-1.5 min-h-[40px] max-h-[180px] no-scrollbar leading-relaxed"
          />

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              aria-label="Send message"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ${
                text.trim() && !isLoading
                  ? "bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 scale-100"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed scale-95"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
