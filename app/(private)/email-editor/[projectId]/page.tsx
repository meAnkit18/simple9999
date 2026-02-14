
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Paperclip, X, File as FileIcon, Copy, Mail } from "lucide-react";

export default function EmailEditorPage() {
    const { projectId } = useParams() as { projectId: string };
    const router = useRouter();
    const [emailContent, setEmailContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [projectName, setProjectName] = useState("Draft Email");
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const chatFileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [chatHistory, setChatHistory] = useState<
        { role: string; content: string }[]
    >([]);

    useEffect(() => {
        async function loadProject() {
            try {
                const res = await fetch("/api/projects", { credentials: "include" });
                const data = await res.json();
                const project = data.projects?.find((p: { id: string }) => p.id === projectId);

                if (project) {
                    setEmailContent(project.emailContent || "");
                    setProjectName(project.name || "Draft Email");
                    setChatHistory(project.chatHistory || []);
                }
            } catch (err) {
                console.error("Failed to load project", err);
            } finally {
                setLoading(false);
            }
        }

        loadProject();
    }, [projectId]);

    async function saveEmail() {
        setSaveLoading(true);
        try {
            await fetch("/api/projects", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: projectId,
                    emailContent: emailContent,
                    lastModified: new Date().toISOString(),
                }),
            });
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setSaveLoading(false);
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

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
            if (data.emailContent) {
                setEmailContent(data.emailContent);
                setChatHistory((prev) => [
                    ...prev,
                    { role: "user", content: message + (attachedFiles.length > 0 ? ` [Attached: ${attachedFiles.map(f => f.name).join(", ")}]` : "") },
                    { role: "assistant", content: data.summary || "Changes applied." },
                ]);
                setAttachedFiles([]);
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
                Loading email editor...
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
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="font-medium truncate max-w-[200px]">{projectName}</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(emailContent);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        disabled={!emailContent.trim()}
                        className="px-3 py-1.5 bg-accent hover:bg-accent/80 text-accent-foreground disabled:opacity-50 rounded text-sm font-medium transition-colors flex items-center gap-1.5"
                    >
                        {copied ? <span className="text-green-500 font-bold">Copied!</span> : <><Copy className="w-4 h-4" /> Copy Text</>}
                    </button>
                    <ThemeToggle />
                    <button
                        onClick={saveEmail}
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
                                <Mail className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-sm">AI Email Editor</h2>
                                <p className="text-xs text-muted-foreground">Chat to refine your email</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        {chatHistory.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-medium text-foreground mb-1">Draft your email</h3>
                                <p className="text-sm text-muted-foreground">Ask me to make it more professional, shorter, or add specific details.</p>
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
                                    placeholder="E.g. Make it more polite..."
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
                    </div>
                </div>

                {/* Right: Email Editor */}
                <div className="flex-1 flex flex-col bg-background">
                    <div className="flex-1 relative overflow-hidden p-6 md:p-12">
                        <div className="max-w-3xl mx-auto h-full flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-muted px-4 py-2 border-b border-border text-sm text-muted-foreground font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Draft
                            </div>
                            <textarea
                                value={emailContent}
                                onChange={(e) => setEmailContent(e.target.value)}
                                className="flex-1 w-full bg-transparent p-6 font-sans text-base leading-relaxed resize-none focus:outline-none"
                                spellCheck={false}
                                placeholder="Your email will appear here..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
