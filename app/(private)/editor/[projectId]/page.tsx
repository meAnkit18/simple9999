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
        <div className="w-1/3 border-r border-border flex flex-col bg-card/30">
          <div className="p-3 border-b border-border">
            <h2 className="font-semibold">Chat</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatHistory.length === 0 && (
              <div className="text-muted-foreground text-sm text-center py-4">
                Ask the AI to edit your resume...
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded text-sm ${msg.role === "user"
                  ? "bg-primary/10 text-foreground ml-4 border border-primary/20"
                  : "bg-muted text-foreground mr-4 border border-border"
                  }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border bg-card">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Make it more concise..."
              className="w-full h-20 bg-background border border-input rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendChat();
                }
              }}
            />
            <button
              onClick={sendChat}
              disabled={chatLoading}
              className="mt-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 py-2 rounded text-sm font-medium transition-colors"
            >
              {chatLoading ? "Applying..." : "Apply Change"}
            </button>
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
