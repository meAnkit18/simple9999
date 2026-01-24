"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const { projectId } = useParams() as { projectId: string };

  const [latex, setLatex] = useState("");
  const [loading, setLoading] = useState(true);

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // -----------------------------
  // LOAD PROJECT
  // -----------------------------
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch("/api/projects", {
          credentials: "include",
        });

        const data = await res.json();

        const project = data.projects.find(
          (p: any) => p.id === projectId
        );

        if (project) {
          setLatex(project.latexCode || "");
        }
      } catch (err) {
        console.error("Failed to load project", err);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  // -----------------------------
  // SAVE LATEX (MANUAL)
  // -----------------------------
  async function saveLatex() {
    setSaveLoading(true);

    try {
      await fetch("/api/projects", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectId,
          latexCode: latex,
          lastModified: Date.now(),
        }),
      });
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaveLoading(false);
    }
  }

  // -----------------------------
  // CHAT → EDIT LATEX
  // -----------------------------
  async function sendChat() {
    if (!chatInput.trim()) return;

    setChatLoading(true);

    try {
      const res = await fetch("/api/chat/edit", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          message: chatInput,
        }),
      });

      const data = await res.json();

      if (data.latexCode) {
        setLatex(data.latexCode);
      }

      setChatInput("");
    } catch (err) {
      console.error("Chat edit failed", err);
    } finally {
      setChatLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading resume...</div>;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* LEFT: CHAT */}
      <div className="w-1/3 border-r bg-white p-4 flex flex-col">
        <h2 className="font-bold mb-3">Chat</h2>

        <textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Tell me what to change in the resume…"
          className="w-full h-32 border rounded p-2 text-sm resize-none"
        />

        <button
          onClick={sendChat}
          disabled={chatLoading}
          className="mt-2 w-full bg-black text-white py-2 rounded"
        >
          {chatLoading ? "Applying changes..." : "Apply Change"}
        </button>

        <p className="mt-3 text-xs text-gray-500">
          Examples:
          <br />• Make experience more impact-driven
          <br />• Optimize for backend role
          <br />• Shorten to one page
        </p>
      </div>

      {/* RIGHT: LATEX EDITOR */}
      <div className="w-2/3 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">LaTeX Editor</h2>

          <button
            onClick={saveLatex}
            disabled={saveLoading}
            className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
          >
            {saveLoading ? "Saving..." : "Save"}
          </button>
        </div>

        <textarea
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          className="flex-1 border rounded p-3 font-mono text-sm resize-none"
        />
      </div>
    </div>
  );
}
