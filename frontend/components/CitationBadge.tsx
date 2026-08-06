"use client";

import React from "react";
import { FileText } from "lucide-react";

interface SourceItem {
  source?: string;
  page?: number;
  content?: string;
  similarity_score?: number;
}

interface CitationBadgeProps {
  sources: SourceItem[];
}

export function CitationBadge({ sources }: CitationBadgeProps) {
  if (!sources || sources.length === 0) return null;

  // Deduplicate sources by name and page
  const uniqueSourcesMap = new Map<string, SourceItem>();
  sources.forEach((src) => {
    const rawName = src.source || "Official Handbook";
    // Format human-friendly document name
    const cleanName = rawName.includes("fee")
      ? "Fee Structure PDF"
      : "Academic Handbook PDF";
    const pageNum = src.page ? `Page ${src.page}` : "";
    const key = `${cleanName}-${pageNum}`;
    if (!uniqueSourcesMap.has(key)) {
      uniqueSourcesMap.set(key, { ...src, source: cleanName });
    }
  });

  const uniqueSources = Array.from(uniqueSourcesMap.values());

  return (
    <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mr-1">
        Answer based on:
      </span>
      {uniqueSources.map((item, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-medium text-zinc-300 hover:border-zinc-700 transition-colors"
          title={item.content ? item.content.slice(0, 120) + "..." : undefined}
        >
          <FileText className="w-3 h-3 text-indigo-400" />
          <span>{item.source}</span>
          {item.page && (
            <span className="text-zinc-500 font-mono text-[10px]">
              (Page {item.page})
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
