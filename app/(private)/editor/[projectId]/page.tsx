"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

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
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 p-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <span className="font-medium">{projectName}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => generatePreview()}
            disabled={previewLoading}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            {previewLoading ? "Generating..." : "Preview"}
          </button>
          <button
            onClick={saveLatex}
            disabled={saveLoading}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            {saveLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="w-1/4 border-r border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-700">
            <h2 className="font-semibold">Chat</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded text-sm ${msg.role === "user"
                  ? "bg-blue-900 ml-4"
                  : "bg-gray-800 mr-4"
                  }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-700">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Make it more concise..."
              className="w-full h-20 bg-gray-800 border border-gray-600 rounded p-2 text-sm resize-none"
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
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-2 rounded text-sm"
            >
              {chatLoading ? "Applying..." : "Apply Change"}
            </button>
          </div>
        </div>

        {/* Center: LaTeX Editor */}
        <div className="w-2/5 flex flex-col border-r border-gray-700">
          <div className="p-3 border-b border-gray-700">
            <h2 className="font-semibold">LaTeX</h2>
          </div>
          <textarea
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            className="flex-1 bg-gray-800 p-3 font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Right: Preview */}
        <div className="w-[35%] flex flex-col">
          <div className="p-3 border-b border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold">Preview</h2>
            {previewLoading && (
              <span className="text-xs text-blue-400 animate-pulse">
                Updating...
              </span>
            )}
          </div>
          <div className="flex-1 overflow-auto bg-white relative">
            {previewLoading && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
                <div className="text-white text-sm animate-pulse">
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
              <div className="h-full flex items-center justify-center text-gray-500">
                {latex.trim() ? "Preview will auto-generate..." : "Enter LaTeX code to preview"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
