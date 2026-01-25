"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  lastModified: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  createdAt: string;
  chunksCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "documents">("create");

  // Load projects and files on mount
  useEffect(() => {
    loadProjects();
    loadFiles();
  }, []);

  async function loadProjects() {
    try {
      const res = await fetch("/api/projects", { credentials: "include" });
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  }

  async function loadFiles() {
    try {
      const res = await fetch("/api/files", { credentials: "include" });
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error("Failed to load files:", err);
    }
  }

  // Create new resume via chat
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (data.projectId) {
        router.push(`/editor/${data.projectId}`);
      } else {
        alert(data.error || "Failed to create resume");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create resume");
    } finally {
      setLoading(false);
    }
  }

  // Upload document
  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Uploaded: ${data.file.name}\n${data.chunksStored} text chunks indexed for AI`);
        loadFiles(); // Refresh the files list
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // Logout
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Simple9999</h1>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white text-sm"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("create")}
            className={`pb-3 px-2 font-medium ${activeTab === "create"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400"
              }`}
          >
            Create Resume
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 px-2 font-medium ${activeTab === "documents"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400"
              }`}
          >
            Document Vault ({files.length})
          </button>
        </div>

        {activeTab === "create" && (
          <>
            {/* Info Banner */}
            {files.length === 0 && (
              <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4 mb-6">
                <p className="text-blue-200">
                  <strong>💡 Tip:</strong> Upload your LinkedIn PDF, certificates, or old
                  resumes first. The AI will use this data to create more personalized
                  resumes.
                </p>
                <button
                  onClick={() => setActiveTab("documents")}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Go to Document Vault →
                </button>
              </div>
            )}

            {/* Chat Input - Core Feature */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Create Resume</h2>
              <p className="text-gray-400 mb-4">
                Tell me what kind of resume you need. Be specific about role, skills, and
                tone. I'll use your uploaded documents to personalize it.
              </p>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Create a backend resume for a fintech startup, focus on Node.js and scalability. Highlight my payment systems experience."
                  className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Generating Resume..." : "Generate Resume"}
                </button>
              </form>

              {files.length > 0 && (
                <p className="text-sm text-green-400 mt-3">
                  ✓ Using context from {files.length} uploaded document(s)
                </p>
              )}
            </section>

            {/* Projects List */}
            <section>
              <h2 className="text-lg font-semibold mb-3">Your Resumes</h2>
              {projects.length === 0 ? (
                <p className="text-gray-500">No resumes yet. Create one above!</p>
              ) : (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/editor/${p.id}`)}
                      className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium">{p.name}</div>
                      <div className="text-gray-400 text-sm">
                        Last modified: {new Date(p.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "documents" && (
          <section>
            <h2 className="text-2xl font-bold mb-2">Document Vault</h2>
            <p className="text-gray-400 mb-6">
              Upload your career documents. The AI will extract and index the content to
              create personalized resumes.
            </p>

            {/* Upload Area */}
            <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-gray-300 mb-4">
                Upload LinkedIn PDF, certificates, recommendation letters, or old resumes
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={uploadFile}
                  disabled={uploading}
                  className="hidden"
                />
                <span className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg cursor-pointer inline-block">
                  {uploading ? "Uploading..." : "Choose File"}
                </span>
              </label>
              <p className="text-gray-500 text-sm mt-3">Supports PDF files</p>
            </div>

            {/* Files List */}
            {files.length === 0 ? (
              <p className="text-gray-500 text-center">
                No documents uploaded yet. Upload your first document to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {f.type === "application/pdf" ? "📕" : "📄"}
                      </div>
                      <div>
                        <div className="font-medium">{f.name}</div>
                        <div className="text-gray-400 text-sm">
                          {new Date(f.createdAt).toLocaleDateString()} •{" "}
                          {f.chunksCount > 0 ? (
                            <span className="text-green-400">
                              {f.chunksCount} chunks indexed
                            </span>
                          ) : (
                            <span className="text-yellow-400">No text extracted</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {f.url && (
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
