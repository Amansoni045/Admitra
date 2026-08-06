"use client";

import React from "react";
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { ReadingBlock, MessageItem } from "@/components/ReadingBlock";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MessageComposer } from "@/components/MessageComposer";
import { DeveloperPanel, DiagnosticsData } from "@/components/DeveloperPanel";

export default function Home() {
  const [selectedProgramme, setSelectedProgramme] = React.useState("BCA");
  const [messages, setMessages] = React.useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [developerMode, setDeveloperMode] = React.useState(false);
  const [lastDiagnostics, setLastDiagnostics] = React.useState<
    DiagnosticsData | undefined
  >(undefined);
  const [isDevPanelOpen, setIsDevPanelOpen] = React.useState(false);

  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const userMsg: MessageItem = {
      id: Date.now().toString(),
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programme: selectedProgramme,
          message: text,
          developer_mode: developerMode,
        }),
      });

      const data = await response.json();

      const assistantMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content:
          data.answer ||
          "We couldn't retrieve an answer right now. Please try again.",
        queryType: data.query_type,
        sources: data.retrieved_sources || data.diagnostics?.retrieved_documents,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.diagnostics) {
        setLastDiagnostics(data.diagnostics);
      }
    } catch (err) {
      console.error("Chat invocation failed:", err);
      const errorMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content:
          "We encountered a network error while connecting to the assistant. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setMessages([]);
    setLastDiagnostics(undefined);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Pinned Top Navigation */}
      <Header
        selectedProgramme={selectedProgramme}
        onSelectProgramme={setSelectedProgramme}
        developerMode={developerMode}
        onToggleDeveloperMode={() => {
          setDeveloperMode(!developerMode);
          setIsDevPanelOpen(!isDevPanelOpen);
        }}
        onResetSession={handleResetSession}
        hasMessages={messages.length > 0}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-32 flex flex-col justify-center">
        {messages.length === 0 ? (
          <LandingHero
            selectedProgramme={selectedProgramme}
            onSelectSuggestion={handleSendMessage}
          />
        ) : (
          <div className="space-y-4 w-full">
            {messages.map((msg) => (
              <ReadingBlock key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="max-w-2xl mx-auto">
                <LoadingIndicator />
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Bottom Floating Composer */}
      <MessageComposer
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />

      {/* Side Developer Panel */}
      <DeveloperPanel
        isOpen={isDevPanelOpen}
        onClose={() => setIsDevPanelOpen(false)}
        diagnostics={lastDiagnostics}
      />
    </div>
  );
}
