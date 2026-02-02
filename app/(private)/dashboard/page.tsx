"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { Logo } from "@/components/Logo";
import ProfileEditModal from "@/components/ProfileEditModal";
import {
  Sparkles,
  User,
  FileText,
  Upload,
  File as FileIcon,
  Check,
  Loader2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Pencil,
  Paperclip,
  X,
  Book
} from "lucide-react";

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
  linkedin?: string;
  summary?: string;
  skills: string[];
  experience: { title: string; company: string; duration: string; description?: string }[];
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingChat, setIsDraggingChat] = useState(false);
  const [isDraggingUpload, setIsDraggingUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

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
  function removeAttachedFile(index: number) {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }
  const handleChatDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingChat(true);
  };

  const handleChatDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingChat(false);
  };

  const handleChatDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingChat(false);

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
  };
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if ((!message.trim() && attachedFiles.length === 0) || loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", message);

      attachedFiles.forEach(file => {
        formData.append("files", file);
      });

      const res = await fetch("/api/chat", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.projectId) {
        setAttachedFiles([]);
        setMessage("");
        if (attachedFiles.length > 0) {
          loadFiles();
          setTimeout(() => loadProfile(), 2000);
        }

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

  async function processFileUpload(file: File) {
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
        setTimeout(() => loadProfile(), 1000);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
    e.target.value = "";
  }

  const handleUploadDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingUpload(true);
  };

  const handleUploadDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingUpload(false);
  };

  const handleUploadDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingUpload(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are supported currently.");
        return;
      }
      await processFileUpload(file);
    }
  };

  async function deleteFile(fileId: string, fileName: string) {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setFiles(files.filter(f => f.id !== fileId));
        setTimeout(() => loadProfile(), 1000);
      } else {
        alert(data.error || "Failed to delete file");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete file");
    }
  }
  async function handleSaveProfile(updatedProfile: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    summary?: string;
    skills: string[];
    experience: { title: string; company: string; duration: string; description?: string }[];
    education: { degree: string; institution: string; year: string }[];
  }) {
    const fullProfile: UserProfile = {
      ...updatedProfile,
      skillsCount: updatedProfile.skills.length,
      experienceCount: updatedProfile.experience.length,
      educationCount: updatedProfile.education.length,
      certificationsCount: 0,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: fullProfile }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
      } else {
        throw new Error(data.error || "Failed to save profile");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      throw err;
    }
  }

  // Logout
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto h-full flex flex-col">

            {/* Create / Chat Tab */}
            {activeTab === "create" && (
              <div className="flex flex-col h-full justify-center items-center relative">

                {/* Welcome / Empty State */}
                <div className="text-center space-y-6 mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="inline-block p-4 rounded-full bg-primary/5 mb-4">
                    <Logo className="w-12 h-12 text-primary" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    What can I help you build?
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    I can help you create resume based on your profile and the job description.
                  </p>

                  <div className="mt-2 flex justify-center">
                    <a
                      href="/docs"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
                    >
                      <Book className="w-4 h-4" />
                      How to use it
                    </a>
                  </div>
                </div>

                {/* Chat Input Area */}
                <div className="w-full max-w-2xl relative z-10">

                  <form
                    onSubmit={handleSubmit}
                    className="relative group"
                    onDragOver={handleChatDragOver}
                    onDragLeave={handleChatDragLeave}
                    onDrop={handleChatDrop}
                  >

                    {/* soft hover glow only */}
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/20 blur opacity-0 group-hover:opacity-30 transition duration-500 pointer-events-none" />

                    {/* input container */}
                    <div
                      className={`
      relative
      bg-card
      rounded-2xl
      border border-transparent
      shadow-md
      transition-all duration-200

      focus-within:border-primary/40
      active:scale-95
      ${isDraggingChat ? "border-primary shadow-lg bg-primary/5" : ""}
    `}
                    >
                      {/* Drag Overlay */}
                      {isDraggingChat && (
                        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-2xl border-2 border-dashed border-primary">
                          <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <FileIcon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="font-medium text-foreground">Drop PDF files here</p>
                          </div>
                        </div>
                      )}

                      {/* Attached Files Preview */}
                      {attachedFiles.length > 0 && (
                        <div className="px-4 pt-4 flex flex-wrap gap-2">
                          {attachedFiles.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 bg-accent/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm animate-in fade-in zoom-in-95">
                              <FileIcon className="w-4 h-4 text-primary" />
                              <span className="max-w-[150px] truncate">{file.name}</span>
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

                      <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                        placeholder="Paste a job description or describe the role..."
                        disabled={loading}
                        rows={1}
                        className="
        w-full
        min-h-[60px]
        max-h-48
        bg-transparent
        border-none
        outline-none
        focus:ring-0
        resize-none
        p-4
        pl-12
        pr-14
        text-lg
        placeholder:text-muted-foreground/50
      "
                      />

                      {/* File Attachment Button (Left) */}
                      <div className="absolute left-2 bottom-2">
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
                          disabled={loading}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                          title="Attach PDF"
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Send Button (Right) */}
                      <div className="absolute right-2 bottom-2">
                        <button
                          type="submit"
                          disabled={loading || (!message.trim() && attachedFiles.length === 0)}
                          className="
          p-2
          rounded-xl
          bg-primary
          text-primary-foreground
          hover:opacity-90
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
        "
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="22" y1="2" x2="11" y2="13" />
                              <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>


                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                    <span className="px-3 py-1 bg-accent/50 rounded-full border border-border/50">Senior Backend Engineer</span>
                    <span className="px-3 py-1 bg-accent/50 rounded-full border border-border/50">Product Manager at Google</span>
                    <span className="px-3 py-1 bg-accent/50 rounded-full border border-border/50">Marketing Lead</span>
                  </div>
                </div>

                {/* Recent Projects (History) */}
                {projects.length > 0 && (
                  <div className="mt-16 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Recent Resumes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {projects.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => router.push(`/editor/${p.id}`)}
                          className="group p-4 bg-card border border-border/50 rounded-xl cursor-pointer hover:bg-accent/50 hover:border-primary/20 transition-all duration-200"
                        >
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(p.lastModified).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold">Your Profile</h2>
                    <p className="text-muted-foreground mt-1">Managed by AI from your documents</p>
                  </div>
                  {hasProfile && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                      </button>
                      <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium border border-green-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                        Active & Ready
                      </span>
                    </div>
                  )}
                </div>

                {profileLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Analyzing your digital footprint...</p>
                  </div>
                ) : !hasProfile ? (
                  <div className="text-center py-12 bg-card border border-dashed border-border rounded-2xl">
                    <div className="inline-block p-4 bg-accent/50 rounded-full mb-4">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Profile Not Found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Upload your resume or LinkedIn PDF to let the AI build your professional profile automatically.
                    </p>
                    <button
                      onClick={() => setActiveTab("documents")}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Go to Documents
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header Card */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div className="relative">
                        <h3 className="text-2xl font-bold">{profile?.fullName}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
                          {profile?.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {profile.email}</span>}
                          {profile?.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {profile.phone}</span>}
                          {profile?.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Skills", value: profile?.skillsCount, color: "text-blue-500" },
                        { label: "Experience", value: profile?.experienceCount, color: "text-purple-500" },
                        { label: "Education", value: profile?.educationCount, color: "text-green-500" },
                        { label: "Certs", value: profile?.certificationsCount, color: "text-orange-500" },
                      ].map((stat, i) => (
                        <div key={i} className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/20 transition-colors">
                          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value || 0}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Skills Cloud */}
                    {profile?.skills && profile.skills.length > 0 && (
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <h4 className="text-lg font-semibold mb-4">Skills Cloud</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-accent/50 text-foreground rounded-full text-sm border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience Timeline */}
                    {profile?.experience && profile.experience.length > 0 && (
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <h4 className="text-lg font-semibold mb-4">Experience</h4>
                        <div className="space-y-6">
                          {profile.experience.map((exp, i) => (
                            <div key={i} className="relative pl-6 border-l-2 border-border last:border-0">
                              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                              <div className="font-medium text-lg">{exp.title}</div>
                              <div className="text-primary/80">{exp.company}</div>
                              <div className="text-sm text-muted-foreground mt-1">{exp.duration}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold">Document Vault</h2>
                    <p className="text-muted-foreground mt-1">Manage your source materials</p>
                  </div>
                </div>

                {/* Upload Zone */}
                <div
                  className="mb-8 relative"
                  onDragOver={handleUploadDragOver}
                  onDragLeave={handleUploadDragLeave}
                  onDrop={handleUploadDrop}
                >
                  <label className="block w-full cursor-pointer group">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={uploadFile}
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className={`
                      border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                      ${isDraggingUpload
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-border group-hover:border-primary/50 group-hover:bg-primary/5"
                      }
                    `}>
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        ) : (
                          <Upload className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {uploading ? "Processing Document..." : (isDraggingUpload ? "Drop PDF to Upload" : "Click to Upload PDF")}
                      </h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Upload LinkedIn profiles, resumes, or cover letters. We'll extract the text automatically.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Files Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="group bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                            {f.type === "application/pdf" ? (
                              <FileText className="w-6 h-6" />
                            ) : (
                              <FileIcon className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium truncate max-w-[200px]" title={f.name}>{f.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(f.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            title="View File"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteFile(f.id, f.name)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs">
                        {f.chunksCount > 0 ? (
                          <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> {f.chunksCount} chunks
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Processing...
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />
      </main>
    </div>
  );
}
