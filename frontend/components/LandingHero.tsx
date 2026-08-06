"use client";

import React from "react";
import { motion } from "framer-motion";
import { SuggestionChips } from "./SuggestionChips";

interface LandingHeroProps {
  selectedProgramme: string;
  onSelectSuggestion: (prompt: string) => void;
}

export function LandingHero({
  selectedProgramme,
  onSelectSuggestion,
}: LandingHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-20 max-w-2xl mx-auto my-auto"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-medium text-zinc-400 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Official Knowledge Base ({selectedProgramme})</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100 mb-3">
        Admitra
      </h1>

      <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md mb-8">
        Your calm, accurate companion for college regulations, fee structures,
        and academic guidelines.
      </p>

      <SuggestionChips onSelectSuggestion={onSelectSuggestion} />
    </motion.div>
  );
}
