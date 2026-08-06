"use client";

import React from "react";
import { Terminal, RefreshCw } from "lucide-react";
import { ProgrammeSelector } from "./ProgrammeSelector";

interface HeaderProps {
  selectedProgramme: string;
  onSelectProgramme: (programme: string) => void;
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
  onResetSession: () => void;
  hasMessages: boolean;
}

export function Header({
  selectedProgramme,
  onSelectProgramme,
  developerMode,
  onToggleDeveloperMode,
  onResetSession,
  hasMessages,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/70 border-b border-zinc-900/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetSession}
            className="flex items-center gap-2 group text-left focus:outline-none"
            title="Start new conversation"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
              Admitra
            </span>
          </button>
          <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-500 bg-zinc-900/60 border border-zinc-800/60 rounded-full px-2.5 py-0.5">
            College Advisor
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <ProgrammeSelector
            selectedProgramme={selectedProgramme}
            onSelectProgramme={onSelectProgramme}
          />

          {hasMessages && (
            <button
              type="button"
              onClick={onResetSession}
              aria-label="New Session"
              title="New Session"
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Developer Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDeveloperMode}
            aria-label="Toggle Pipeline Diagnostics"
            title={
              developerMode
                ? "Developer Mode Active (Diagnostics Enabled)"
                : "Toggle Developer Mode"
            }
            className={`p-2 rounded-full transition-all duration-150 relative ${
              developerMode
                ? "bg-indigo-950/80 text-indigo-300 border border-indigo-500/30"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            {developerMode && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
