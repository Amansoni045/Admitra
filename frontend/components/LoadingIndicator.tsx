"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const LOADING_MESSAGES = [
  "Checking the college handbook...",
  "Looking for the latest fee details...",
  "Verifying against official guidelines...",
  "Preparing your answer...",
];

export function LoadingIndicator() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 w-fit my-3">
      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
      <div className="h-5 overflow-hidden relative min-w-[220px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs text-zinc-400 font-medium block absolute left-0"
          >
            {LOADING_MESSAGES[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
