"use client";

import React from "react";
import { ArrowUpRight, BookOpen, CreditCard, ShieldCheck } from "lucide-react";

interface SuggestionChipsProps {
  onSelectSuggestion: (prompt: string) => void;
}

const SUGGESTIONS = [
  {
    icon: BookOpen,
    label: "Attendance & Exam Rules",
    prompt: "What is the minimum attendance required to appear for final exams?",
  },
  {
    icon: CreditCard,
    label: "Fee Structure & Schedules",
    prompt: "What are the tuition fee payment dates and late charge policies?",
  },
  {
    icon: ShieldCheck,
    label: "Grading & Promotion",
    prompt: "What are the passing criteria and credit requirements for promotion?",
  },
];

export function SuggestionChips({ onSelectSuggestion }: SuggestionChipsProps) {
  return (
    <div className="w-full max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4">
      {SUGGESTIONS.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(item.prompt)}
            className="group text-left p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <div className="flex items-center justify-between w-full">
              <IconComponent className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100 line-clamp-2 leading-snug">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
