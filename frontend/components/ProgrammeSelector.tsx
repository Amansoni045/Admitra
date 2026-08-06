"use client";

import React from "react";
import { ChevronDown, GraduationCap } from "lucide-react";

interface ProgrammeSelectorProps {
  selectedProgramme: string;
  onSelectProgramme: (programme: string) => void;
}

const PROGRAMMES = [
  { id: "BCA", label: "BCA (Computer Applications)" },
  { id: "BBA", label: "BBA (Business Administration)" },
  { id: "B.Com (Hons)", label: "B.Com (Hons) (Commerce)" },
];

export function ProgrammeSelector({
  selectedProgramme,
  onSelectProgramme,
}: ProgrammeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
        <span>{selectedProgramme}</span>
        <ChevronDown
          className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 z-50 focus:outline-none backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2 py-1.5 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Select Your Programme
          </div>
          {PROGRAMMES.map((prog) => {
            const isSelected = prog.id === selectedProgramme;
            return (
              <button
                key={prog.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectProgramme(prog.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-indigo-950/60 text-indigo-200 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <span>{prog.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
