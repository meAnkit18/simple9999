"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function EditorPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();

  const [latex, setLatex] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Toggle between LaTeX and Preview view
  const [activeView, setActiveView] = useState<"latex" | "preview">("preview");

  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);

  // Refs for debouncing and tracking latest values
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestLatexRef = useRef(latex);
  const isInitialLoadRef = useRef(true);

  // Keep the ref in sync with state
  useEffect(() => {
    latestLatexRef.current = latex;
  }, [latex]);

  // Generate preview function (memoized)
  const generatePreview = useCallback(async (latexCode?: string) => {
    const codeToUse = latexCode || latestLatexRef.current;
    if (!codeToUse.trim()) return;

    setPreviewLoading(true);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, latexCode: codeToUse }),
      });

      const data = await res.json();
      if (data.html) {
        setPreviewHtml(data.html);
      }
    } catch (err) {
      console.error("Preview failed", err);
    } finally {
      setPreviewLoading(false);
    }
  }, [projectId]);

  // Load project
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch("/api/projects", { credentials: "include" });
        const data = await res.json();
        const project = data.projects?.find((p: { id: string }) => p.id === projectId);

        if (project) {
          setLatex(project.latexCode || "");
          setPreviewHtml(project.previewHtml || "");
          setProjectName(project.name || "");
          setChatHistory(project.chatHistory || []);

          // Auto-generate preview on load if we have LaTeX but no preview
          if (project.latexCode && !project.previewHtml) {
            setTimeout(() => generatePreview(project.latexCode), 500);
          }
        }
      } catch (err) {
        console.error("Failed to load project", err);
      } finally {
        setLoading(false);
        isInitialLoadRef.current = false;
      }
    }

    loadProject();
  }, [projectId, generatePreview]);

  // Auto-regenerate preview when LaTeX changes (debounced)
  useEffect(() => {
    // Skip on initial load
    if (isInitialLoadRef.current || !latex.trim()) return;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer (1.5 seconds after user stops typing)
    debounceTimerRef.current = setTimeout(() => {
      generatePreview(latex);
    }, 1500);

    // Cleanup on unmount or before next effect run
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [latex, generatePreview]);

  // Save LaTeX
  async function saveLatex() {
    setSaveLoading(true);
    try {
      await fetch("/api/projects", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: projectId,
          latexCode: latex,
          lastModified: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaveLoading(false);
    }
  }

  // Chat to edit LaTeX
  async function sendChat() {
    if (!chatInput.trim()) return;

    setChatLoading(true);
    try {
      const res = await fetch("/api/chat/edit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, message: chatInput }),
      });

      const data = await res.json();
      if (data.latexCode) {
        setLatex(data.latexCode);
        setChatHistory((prev) => [
          ...prev,
          { role: "user", content: chatInput },
          { role: "assistant", content: data.summary || "Changes applied." },
        ]);
      }
      setChatInput("");
    } catch (err) {
      console.error("Chat edit failed", err);
    } finally {
      setChatLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border p-3 flex justify-between items-center bg-card/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          <span className="font-medium truncate max-w-[200px]">{projectName}</span>
        </div>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <button
            onClick={saveLatex}
            disabled={saveLoading}
            className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 rounded text-sm font-medium transition-colors"
          >
            {saveLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="w-1/3 border-r border-border flex flex-col bg-muted/10 backdrop-blur-sm">
          <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div>
                <h2 className="font-semibold text-sm">AI Editor</h2>
                <p className="text-xs text-muted-foreground">Always here to edit</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {chatHistory.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h3 className="font-medium text-foreground mb-1">No messages yet</h3>
                <p className="text-sm text-muted-foreground">Ask me to edit your resume, fix typos, or improve formatting.</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted border border-border text-foreground"
                  }`}>
                  {msg.role === "user" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" /><path d="m2 10 2-2" /><path d="m22 10-2-2" /><path d="m16 6-4 4-4-4" /><path d="M12 14v8" /><path d="M8 18h8" /></svg>
                  )}
                </div>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card border border-border text-foreground rounded-tl-sm"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" /><path d="m2 10 2-2" /><path d="m22 10-2-2" /><path d="m16 6-4 4-4-4" /><path d="M12 14v8" /><path d="M8 18h8" /></svg>
                </div>
                <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="relative flex items-end gap-2 bg-background border border-input rounded-xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask AI to improve your resume..."
                className="w-full max-h-32 bg-transparent border-none p-2 text-sm resize-none focus:outline-none placeholder:text-muted-foreground/70"
                rows={1}
                style={{ minHeight: "44px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChat();
                  }
                }}
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="mb-1 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                title="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              AI can make mistakes. Please review the changes.
            </p>
          </div>
        </div>

        {/* Right: Merged LaTeX/Preview Panel */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Toggle Switch Header */}
          <div className="p-3 border-b border-border flex items-center justify-between bg-card/30">
            {/* Toggle Switch */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveView("latex")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${activeView === "latex"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                LaTeX
              </button>
              <button
                onClick={() => setActiveView("preview")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${activeView === "preview"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Preview
              </button>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-3">
              {previewLoading && (
                <span className="text-xs text-primary animate-pulse">
                  Updating preview...
                </span>
              )}
              {activeView === "preview" && (
                <button
                  onClick={() => generatePreview()}
                  disabled={previewLoading}
                  className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground disabled:opacity-50 rounded text-xs transition-colors"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative overflow-hidden">
            {/* LaTeX Editor */}
            <div
              className={`absolute inset-0 transition-all duration-300 ${activeView === "latex"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full pointer-events-none"
                }`}
            >
              <textarea
                value={latex}
                onChange={(e) => setLatex(e.target.value)}
                className="w-full h-full bg-background p-4 font-mono text-sm resize-none focus:outline-none text-foreground"
                spellCheck={false}
                placeholder="Enter your LaTeX code here..."
              />
            </div>

            {/* Preview */}
            <div
              className={`absolute inset-0 transition-all duration-300 ${activeView === "preview"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full pointer-events-none"
                }`}
            >
              <div className="w-full h-full bg-white relative overflow-auto">
                {previewLoading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm">
                    <div className="bg-card px-4 py-2 rounded-lg text-foreground text-sm animate-pulse border border-border shadow-lg">
                      Generating preview...
                    </div>
                  </div>
                )}
                {previewHtml ? (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    title="Resume Preview"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {latex.trim() ? "Preview will auto-generate..." : "Enter LaTeX code to preview"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
