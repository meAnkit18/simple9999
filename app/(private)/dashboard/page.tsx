"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

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

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: { title: string; company: string; duration: string }[];
  education: { degree: string; institution: string; year: string }[];
  skillsCount: number;
  experienceCount: number;
  educationCount: number;
  certificationsCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "documents" | "profile">("create");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Load projects, files, and profile on mount
  useEffect(() => {
    loadProjects();
    loadFiles();
    loadProfile();
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

  async function loadProfile() {
    setProfileLoading(true);
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      const data = await res.json();
      if (data.hasProfile && data.profile) {
        setProfile(data.profile);
        setHasProfile(true);
      } else {
        setHasProfile(false);
        setProfile(null);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setProfileLoading(false);
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
        loadFiles();
        // Refresh profile after uploading new document
        setTimeout(() => loadProfile(), 1000);
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border p-4 flex justify-between items-center bg-card/50 backdrop-blur sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Simple9999</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${activeTab === "profile"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            My Profile {hasProfile && "✓"}
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${activeTab === "documents"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Documents ({files.length})
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${activeTab === "create"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Generate Resume
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <section>
            <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
            <p className="text-gray-400 mb-6">
              This is what the AI knows about you from your uploaded documents.
            </p>

            {profileLoading ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center animate-pulse">
                <div className="text-2xl mb-2">🔄</div>
                <p className="text-muted-foreground">Analyzing your documents...</p>
              </div>
            ) : !hasProfile ? (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
                <div className="text-2xl mb-2">📤</div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">No Profile Yet</h3>
                <p className="text-gray-300 mb-4">
                  Upload your LinkedIn PDF, certificates, or existing resume to build your profile.
                  The AI will extract your information and use it to generate tailored resumes.
                </p>
                <button
                  onClick={() => setActiveTab("documents")}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg"
                >
                  Upload Documents →
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Overview */}
                {/* Profile Overview */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {profile?.fullName || "Name not found"}
                      </h3>
                      <div className="text-muted-foreground mt-1 space-y-1">
                        {profile?.email && <div>📧 {profile.email}</div>}
                        {profile?.phone && <div>📱 {profile.phone}</div>}
                        {profile?.location && <div>📍 {profile.location}</div>}
                      </div>
                    </div>
                    <div className="text-green-600 dark:text-green-400 text-sm bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                      ✓ Profile Ready
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profile?.skillsCount || 0}</div>
                    <div className="text-muted-foreground text-sm">Skills</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{profile?.experienceCount || 0}</div>
                    <div className="text-muted-foreground text-sm">Experiences</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{profile?.educationCount || 0}</div>
                    <div className="text-muted-foreground text-sm">Education</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{profile?.certificationsCount || 0}</div>
                    <div className="text-muted-foreground text-sm">Certifications</div>
                  </div>
                </div>

                {/* Skills */}
                {profile?.skills && profile.skills.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 20).map((skill, i) => (
                        <span key={i} className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-200 dark:border-blue-800">
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 20 && (
                        <span className="text-muted-foreground text-sm">+{profile.skills.length - 20} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {profile?.experience && profile.experience.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Experience</h4>
                    <div className="space-y-3">
                      {profile.experience.slice(0, 5).map((exp, i) => (
                        <div key={i} className="border-l-2 border-purple-500 pl-4">
                          <div className="font-medium text-foreground">{exp.title}</div>
                          <div className="text-muted-foreground text-sm">{exp.company} • {exp.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {profile?.education && profile.education.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Education</h4>
                    <div className="space-y-3">
                      {profile.education.map((edu, i) => (
                        <div key={i} className="border-l-2 border-green-500 pl-4">
                          <div className="font-medium text-foreground">{edu.degree}</div>
                          <div className="text-muted-foreground text-sm">{edu.institution} • {edu.year}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/50 rounded-lg p-6 text-center">
                  <h4 className="text-lg font-semibold mb-2 text-white">Ready to Generate a Tailored Resume?</h4>
                  <p className="text-gray-200 mb-4">
                    Now that we know your background, tell us about the company or job you're applying to.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Generate Resume →
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Create Resume Tab */}
        {activeTab === "create" && (
          <>
            {/* Step indicator */}
            {!hasProfile && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 dark:text-yellow-300">
                  <strong>⚠️ No profile found.</strong> Upload your documents first for personalized resumes.
                </p>
                <button
                  onClick={() => setActiveTab("documents")}
                  className="mt-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 text-sm underline"
                >
                  Go to Documents →
                </button>
              </div>
            )}

            {hasProfile && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-green-800 dark:text-green-300">
                    <strong>✓ Profile Ready:</strong> {profile?.fullName}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {profile?.skillsCount} skills • {profile?.experienceCount} experiences • {profile?.educationCount} education
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 text-sm"
                >
                  View Profile
                </button>
              </div>
            )}

            {/* Chat Input - Core Feature */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Generate Tailored Resume</h2>
              <p className="text-muted-foreground mb-4">
                Describe the company, job role, or requirements. The AI will create a resume
                using your profile data, optimized for this specific opportunity.
              </p>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Example: I'm applying for a Senior Backend Engineer position at a fintech startup. They use Node.js, PostgreSQL, and AWS. The job requires experience with payment systems and microservices. They value scalability and clean code."
                  className="w-full h-36 bg-card border border-input rounded-lg p-4 text-foreground resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Generating Your Tailored Resume..." : "Generate Resume"}
                </button>
              </form>
            </section>

            {/* Projects List */}
            <section>
              <h2 className="text-lg font-semibold mb-3 text-foreground">Your Resumes</h2>
              {projects.length === 0 ? (
                <p className="text-muted-foreground">No resumes yet. Generate one above!</p>
              ) : (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/editor/${p.id}`)}
                      className="bg-card border border-border p-4 rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                    >
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-muted-foreground text-sm">
                        Last modified: {new Date(p.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <section>
            <h2 className="text-2xl font-bold mb-2 text-foreground">Document Vault</h2>
            <p className="text-muted-foreground mb-6">
              Upload your career documents. The AI will extract your information to build your profile.
            </p>

            {/* Upload Area */}
            <div className="bg-card border-2 border-dashed border-border rounded-lg p-8 text-center mb-6 hover:bg-accent/50 transition-colors">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-muted-foreground mb-4">
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
                <span className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg cursor-pointer inline-block transition-colors">
                  {uploading ? "Uploading & Processing..." : "Choose File"}
                </span>
              </label>
              <p className="text-muted-foreground text-sm mt-3">Supports PDF files</p>
            </div>

            {/* Files List */}
            {files.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No documents uploaded yet. Upload your first document to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="bg-card border border-border p-4 rounded-lg flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {f.type === "application/pdf" ? "📕" : "📄"}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{f.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {new Date(f.createdAt).toLocaleDateString()} •{" "}
                          {f.chunksCount > 0 ? (
                            <span className="text-green-600 dark:text-green-400">
                              {f.chunksCount} chunks indexed ✓
                            </span>
                          ) : (
                            <span className="text-yellow-600 dark:text-yellow-400">No text extracted</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {f.url && (
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* After uploading, show next step */}
            {files.length > 0 && (
              <div className="mt-6 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
                <p className="text-blue-800 dark:text-blue-300 mb-2">
                  ✓ Documents uploaded! Your profile is being built from these files.
                </p>
                <button
                  onClick={() => {
                    loadProfile();
                    setActiveTab("profile");
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
                >
                  View Your Profile →
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
