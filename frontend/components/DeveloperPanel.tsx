"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Cpu, Layers, Activity, FileCode } from "lucide-react";

export interface DiagnosticsData {
  workflow_timeline?: Array<{
    node_name: string;
    timestamp: string;
    latency_ms: number;
    routing_decision?: string;
    retrieved_chunk_count?: number;
  }>;
  node_execution_order?: string[];
  routing_decision?: string;
  retrieved_documents?: Array<{
    content?: string;
    source?: string;
    page?: number;
    similarity_score?: number;
  }>;
  retrieved_page_numbers?: number[];
  similarity_scores?: number[];
  latency_per_node?: Record<string, number>;
  total_latency_ms?: number;
  llm_model_used?: string;
  embedding_model_used?: string;
  fallback_decisions?: string[];
}

interface DeveloperPanelProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostics?: DiagnosticsData;
}

export function DeveloperPanel({
  isOpen,
  onClose,
  diagnostics,
}: DeveloperPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-zinc-950 border-l border-zinc-800 p-6 z-50 overflow-y-auto no-scrollbar shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center">
                    <Activity className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-100">
                      Developer Diagnostics
                    </h2>
                    <p className="text-[11px] text-zinc-500">
                      Pipeline Telemetry & Execution Graph
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!diagnostics ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  Run a query to inspect live node execution logs and chunk distance metrics.
                </div>
              ) : (
                <div className="space-y-6 text-xs">
                  {/* Performance Summary */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                        Total Latency
                      </span>
                      <span className="text-sm font-semibold text-indigo-400 font-mono">
                        {diagnostics.total_latency_ms || 0} ms
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                        Routing Decision
                      </span>
                      <span className="text-sm font-semibold text-emerald-400 font-mono uppercase">
                        {diagnostics.routing_decision || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* System Models */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <Cpu className="w-3.5 h-3.5" /> LLM Model:
                      </span>
                      <span className="font-mono text-zinc-200 text-[11px]">
                        {diagnostics.llm_model_used || "llama-3.3-70b"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <Layers className="w-3.5 h-3.5" /> Embeddings:
                      </span>
                      <span className="font-mono text-zinc-200 text-[11px]">
                        all-MiniLM-L6-v2
                      </span>
                    </div>
                  </div>

                  {/* Node Execution Timeline */}
                  <div>
                    <h3 className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Workflow Timeline
                    </h3>
                    <div className="space-y-2">
                      {diagnostics.workflow_timeline?.map((log, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono font-medium text-zinc-200 text-xs block">
                              {log.node_name}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {log.timestamp ? log.timestamp.slice(11, 19) : ""}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-indigo-400 text-xs block">
                              {log.latency_ms} ms
                            </span>
                            {log.retrieved_chunk_count ? (
                              <span className="text-[10px] text-zinc-500">
                                {log.retrieved_chunk_count} chunks
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Retrieved Chunks Telemetry */}
                  {diagnostics.retrieved_documents &&
                    diagnostics.retrieved_documents.length > 0 && (
                      <div>
                        <h3 className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5" /> Retrieved Chunk Metrics
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {diagnostics.retrieved_documents.map((doc, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-zinc-900/30 border border-zinc-800/50 space-y-1"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-medium text-zinc-300">
                                  {doc.source} (Page {doc.page})
                                </span>
                                <span className="font-mono text-emerald-400 text-[10px]">
                                  Score: {doc.similarity_score}
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-500 line-clamp-2 italic">
                                "{doc.content}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-900 text-center">
              <span className="text-[10px] text-zinc-600 font-mono">
                Admitra Architecture v1.0 • Developer Mode
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
