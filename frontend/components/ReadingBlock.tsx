"use client";

import React from "react";
import { motion } from "framer-motion";
import { Copy, Check, User } from "lucide-react";
import { CitationBadge } from "./CitationBadge";

export interface MessageItem {
  id: string;
  sender: "user" | "assistant";
  content: string;
  queryType?: string;
  sources?: Array<{
    source?: string;
    page?: number;
    content?: string;
    similarity_score?: number;
  }>;
  timestamp: string;
}

interface ReadingBlockProps {
  message: MessageItem;
}

export function ReadingBlock({ message }: ReadingBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.sender === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-start gap-3 justify-end my-6"
      >
        <div className="max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-100 font-normal">
          {message.content}
        </div>
        <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5 text-zinc-400" />
        </div>
      </motion.div>
    );
  }

  // Formatting Markdown text lightly for Apple documentation readability
  const formattedParagraphs = message.content
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="my-8 max-w-2xl mx-auto"
    >
      {/* Assistant Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-zinc-200">
            Admitra Answer
          </span>
          {message.queryType && (
            <span className="text-[10px] font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.5 uppercase tracking-wider">
              {message.queryType}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors focus:outline-none"
          title="Copy Answer"
          aria-label="Copy Answer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Main Document Body */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl">
        <div className="prose prose-invert max-w-none text-sm text-zinc-200 leading-relaxed space-y-4">
          {formattedParagraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-wrap leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Citations Footer */}
        {message.sources && message.sources.length > 0 && (
          <CitationBadge sources={message.sources} />
        )}
      </div>
    </motion.div>
  );
}
