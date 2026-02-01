"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Paperclip, X, File as FileIcon } from "lucide-react";

export default function EditorPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();

  const [latex, setLatex] = useState("");
  // const [previewHtml, setPreviewHtml] = useState(""); // Removed in favor of previewUrl
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chat file attachment
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Preview URL for PDF
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [autoFixCount, setAutoFixCount] = useState(0);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Generate preview function (memoized)
  const generatePreview = useCallback(async (latexCode?: string) => {
    const codeToUse = latexCode || latestLatexRef.current;
    if (!codeToUse.trim()) return;

    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, latexCode: codeToUse }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Preview generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setPreviewUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setAutoFixCount(0);

    } catch (err) {
      console.error("Preview failed", err);
      setPreviewError(err instanceof Error ? err.message : "Failed to generate preview");
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
          setProjectName(project.name || "");
          setChatHistory(project.chatHistory || []);

          // Auto-generate preview on load if we have LaTeX
          if (project.latexCode) {
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

  // Handle file selection for chat
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const pdfs = newFiles.filter(f => f.type === "application/pdf");

      if (pdfs.length !== newFiles.length) {
        alert("Only PDF files are supported currently.");
      }

      setAttachedFiles(prev => [...prev, ...pdfs]);
    }
    if (chatFileInputRef.current) {
      chatFileInputRef.current.value = "";
    }
  }

  // Remove attached file
  function removeAttachedFile(index: number) {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set to false if we're actually leaving the container, not just entering a child
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;

    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const pdfs = newFiles.filter(f => f.type === "application/pdf");

      if (pdfs.length !== newFiles.length) {
        alert("Only PDF files are supported currently.");
      }

      if (pdfs.length > 0) {
        setAttachedFiles(prev => [...prev, ...pdfs]);
      }
    }
  }, []);

  // Chat to edit LaTeX
  async function sendChat(messageOverride?: string) {
    const message = messageOverride || chatInput;
    if (!message.trim() && attachedFiles.length === 0) return;

    setChatLoading(true);
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("message", message);

      attachedFiles.forEach(file => {
        formData.append("files", file);
      });

      const res = await fetch("/api/chat/edit", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.latexCode) {
        setLatex(data.latexCode);
        setChatHistory((prev) => [
          ...prev,
          { role: "user", content: message + (attachedFiles.length > 0 ? ` [Attached: ${attachedFiles.map(f => f.name).join(", ")}]` : "") },
          { role: "assistant", content: data.summary || "Changes applied." },
        ]);
        setAttachedFiles([]);

        // If this was an auto-fix, clear the error temporarily to encourage preview
        if (messageOverride) {
          setPreviewError(null);
        }
      }
      setChatInput("");
    } catch (err) {
      console.error("Chat edit failed", err);
    } finally {
      setChatLoading(false);
    }
  }

  const handleAutoFix = () => {
    if (!previewError) return;

    const truncatedError = previewError.length > 1500
      ? previewError.substring(0, 1500) + "... (error truncated)"
      : previewError;

    const prompt = `The LaTeX code failed to compile with this error:\n${truncatedError}\n\nPlease fix the syntax errors.`;
    sendChat(prompt);
  };

  // Auto-fix effect
  useEffect(() => {
    if (previewError && autoFixCount < 1 && !loading && !chatLoading && !previewLoading) {
      console.log("Triggering auto-fix for error:", previewError);
      setAutoFixCount(c => c + 1);

      const errorToReport = previewError && previewError.trim().replace(/^Compilation failed:\s*$/, "")
        ? previewError
        : "Unknown compilation error. Please check for common LaTeX syntax issues like unclosed environments, missing items in lists, or invalid characters.";

      const truncatedError = errorToReport.length > 1500
        ? errorToReport.substring(0, 1500) + "... (error truncated)"
        : errorToReport;

      const prompt = `The LaTeX code failed to compile with this error:\n${truncatedError}\n\nPlease fix the syntax errors.`;
      sendChat(prompt);
    }
  }, [previewError, autoFixCount, loading, chatLoading, previewLoading]);

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
        <div
          className="w-1/3 border-r border-border flex flex-col bg-muted/10 backdrop-blur-sm relative transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center backdrop-blur-[1px]">
              <div className="bg-background p-4 rounded-xl shadow-lg border border-border flex flex-col items-center gap-2 animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileIcon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Drop PDF files here</p>
              </div>
            </div>
          )}
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
            <div className="relative flex flex-col gap-2 bg-background border border-input rounded-xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">

              {/* Attached Files Preview */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 px-1">
                  {attachedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-accent/50 border border-border/50 rounded-lg px-2 py-1 text-xs animate-in fade-in zoom-in-95">
                      <FileIcon className="w-3 h-3 text-primary" />
                      <span className="max-w-[100px] truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachedFile(i)}
                        className="ml-1 p-0.5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                {/* File Attachment Button */}
                <input
                  type="file"
                  ref={chatFileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => chatFileInputRef.current?.click()}
                  disabled={chatLoading}
                  className="mb-1 p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
                  title="Attach PDF"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

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
                  onClick={() => sendChat()}
                  disabled={chatLoading || (!chatInput.trim() && attachedFiles.length === 0)}
                  className="mb-1 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  title="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
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
              {activeView === "latex" && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(latex);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  disabled={!latex.trim()}
                  className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground disabled:opacity-50 rounded text-xs transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy LaTeX
                    </>
                  )}
                </button>
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
                {previewUrl ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Resume Preview"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                    {previewError ? (
                      <div className="text-destructive mb-2 max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <p className="font-medium text-sm">Preview Generation Failed</p>
                        <p className="text-xs opacity-90 mt-1 bg-destructive/10 p-2 rounded text-left overflow-auto max-h-32 font-mono">{previewError}</p>
                        <div className="flex gap-2 justify-center mt-3">
                          <button
                            onClick={() => generatePreview()}
                            className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs rounded transition-colors"
                          >
                            Try Again
                          </button>
                          <button
                            onClick={handleAutoFix}
                            disabled={chatLoading}
                            className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {chatLoading ? "Fixing..." : "Auto-Fix with AI"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>{latex.trim() ? "Preview will auto-generate..." : "Enter LaTeX code to preview"}</>
                    )}
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
