"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextReveal } from "@/components/ui/text-reveal";
import { MagicButton } from "@/components/ui/magic-button";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { WaterDotsBackground } from "@/components/ui/water-dots-background";
import { AnimatedVideoSection } from "@/components/ui/animated-video-section";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FeedbackForm } from "@/components/ui/feedback-form";
import { SiteHeader } from "@/components/SiteHeader";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GuestOnboardingModal from "@/components/GuestOnboardingModal";
import { Sparkles, ArrowRight, Loader2, Paperclip, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface AttachedFile {
  id: string; // temporary ID for UI key
  file: File;
  status: 'uploading' | 'ready' | 'error';
  serverId?: string; // ID from backend
}

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (!prompt.trim() && attachedFiles.length === 0) {
      // Focus input if empty
      const input = document.getElementById("hero-prompt-input");
      input?.focus();
      return;
    }
    // Block if files are still uploading
    if (attachedFiles.some(f => f.status === 'uploading')) {
      alert("Please wait for files to finish uploading.");
      return;
    }
    setIsModalOpen(true);
  };

  const uploadFile = async (file: File) => {
    const tempId = Math.random().toString(36).substr(2, 9);

    // Add to state immediately
    setAttachedFiles(prev => [...prev, {
      id: tempId,
      file,
      status: 'uploading'
    }]);

    try {
      // 1. Ensure Guest Session (if not logged in)
      // We try to upload. If 401, we create guest session then retry.
      // Actually, standardizing: just try to create guest session first if we don't think we have one?
      // Better: Try upload. If 401, call guest auth, then retry.

      let res = await fetch("/api/upload", {
        method: "POST",
        body: (() => {
          const fd = new FormData();
          fd.append("file", file);
          return fd;
        })(),
      });

      if (res.status === 401) {
        // Create guest session
        await fetch("/api/auth/guest", { method: "POST" });
        // Retry upload
        res = await fetch("/api/upload", {
          method: "POST",
          body: (() => {
            const fd = new FormData();
            fd.append("file", file);
            return fd;
          })(),
        });
      }

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      // Update state to ready
      setAttachedFiles(prev => prev.map(f =>
        f.id === tempId ? { ...f, status: 'ready', serverId: data.file.id } : f
      ));

    } catch (err) {
      console.error(err);
      setAttachedFiles(prev => prev.map(f =>
        f.id === tempId ? { ...f, status: 'error' } : f
      ));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const pdfs = newFiles.filter(f => f.type === "application/pdf");

      if (pdfs.length !== newFiles.length) {
        alert("Only PDF files are supported.");
      }

      pdfs.forEach(file => uploadFile(file));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
    // Optional: Call delete API if needed, but for guest flow generic cleanup is fine/later
  };

  const handleGuestContinue = async () => {
    setLoading(true);
    try {
      // 1. Ensure session (should exist from upload, but safe to call)
      const authRes = await fetch("/api/auth/guest", { method: "POST" });
      if (!authRes.ok) throw new Error("Failed to create guest session");

      // 2. Generate resume
      // Files are already uploaded and processed into profile. Just send prompt.
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await chatRes.json();

      if (data.projectId) {
        router.push(`/editor/${data.projectId}`);
      } else {
        alert("Failed to generate resume. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colonomrs duration-300 overflow-x-hidden font-sans selection:bg-primary/20">
      <div className="fixed inset-0 -z-10">

      </div>

      <div className="fixed inset-0 -z-10">
      </div>

      {/* Navbar */}
      <SiteHeader />

      <GuestOnboardingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContinueAsGuest={handleGuestContinue}
        onSignUp={() => router.push(`/signup?prompt=${encodeURIComponent(prompt)}`)}
        onLogin={() => router.push(`/login?prompt=${encodeURIComponent(prompt)}`)}
      />

      {/* Hero Section */}
      <main className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <WaterDotsBackground className="z-0" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-16 md:mt-0 w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <Logo className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            <span className="text-xl md:text-3xl font-bold tracking-tight select-none">Simple9999.com</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 animate-fade-in-up opacity-0 select-none" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            Agentic Resume Builder
          </h1><br />

          <p className="mt-4 md:mt-6 text-lg md:text-2xl text-muted-foreground max-w-lg mx-auto animate-fade-in-up opacity-0 px-4 select-none" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            Stop filling forms. Just tell it what you want.
          </p>

          <div className="mt-10 animate-fade-in-up opacity-0 w-full max-w-2xl px-4 relative group" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <div className="relative flex flex-col items-start bg-background/80 dark:bg-zinc-900/50 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 focus-within:border-primary shadow-2xl rounded-3xl transition-all duration-300">

              {/* File Chips */}
              {attachedFiles.length > 0 && (
                <div className="w-full px-6 pt-4 flex flex-wrap gap-2">
                  {attachedFiles.map((file) => (
                    <div key={file.id} className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm animate-in fade-in zoom-in-95 ${file.status === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
                      file.status === 'uploading' ? 'bg-primary/5 border-primary/20 text-primary' :
                        'bg-accent/50 border-border/50'
                      }`}>
                      <FileText className="w-4 h-4" />
                      <span className="max-w-[150px] truncate">{file.file.name}</span>

                      {file.status === 'uploading' && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                      {file.status === 'ready' && <CheckCircle2 className="w-3 h-3 text-green-500 ml-1" />}
                      {file.status === 'error' && <AlertCircle className="w-3 h-3 ml-1" />}

                      <button
                        type="button"
                        onClick={() => removeAttachedFile(file.id)}
                        className="ml-1 p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="w-full relative">
                <textarea
                  id="hero-prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="I need a resume for a Senior Frontend Engineer role at Google. I have 5 years of experience with React..."
                  className="w-full h-40 md:h-28 py-5 px-6 pr-36 bg-transparent border-none focus:ring-0 resize-none text-lg leading-relaxed placeholder:text-muted-foreground/60 rounded-3xl"
                />

                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf"
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl text-muted-foreground hover:bg-accent/50 hover:text-primary transition-all"
                    title="Attach PDF"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleGenerate}
                    disabled={loading || (!prompt.trim() && attachedFiles.length === 0) || attachedFiles.some(f => f.status === 'uploading')}
                    className="p-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg
                        width="24"
                        height="24"
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
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Try:</span>
              <button onClick={() => setPrompt("Software Engineer with Python expertise")} className="text-xs px-2 py-1 bg-accent/50 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">Python Dev</button>
              <button onClick={() => setPrompt("Marketing Manager with 3 years exp")} className="text-xs px-2 py-1 bg-accent/50 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">Marketing Manager</button>
              <button onClick={() => setPrompt("Fresh Graduate from MIT")} className="text-xs px-2 py-1 bg-accent/50 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">Fresh Grad</button>
            </div>
          </div>
        </div>
      </main>

      {/* Video Section */}
      <AnimatedVideoSection>
        <video
          className="w-full h-full object-cover rounded-4xl"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://res.cloudinary.com/dhrfuos4s/video/upload/v1770005442/VIdeo1_w3v7bq.mp4" type="video/mp4" />
        </video>
      </AnimatedVideoSection>

      {/* Tagline Section */}
      <section id="features" className="w-full px-6 py-16 md:py-32">
        <div className="max-w-[1400px] mx-auto text-left">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            <TypewriterText text="Agentic Resume builder website," speed={40} showCursor />
            <br />
            <span className="text-muted-foreground">
              <TypewriterText text="Just by pasting job requirements" speed={40} delay={2000} showCursor />
            </span>
          </h2>
        </div>
      </section>

      {/* Scattered Documents Section */}
      <section className="w-full px-6 py-16 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left - Text */}
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                <TypewriterText text="Scattered documents" speed={50} showCursor />
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Certificates, achievements, PDFs, and proofs are often lost or stored across multiple platforms.
              </p>
            </div>
            {/* Right - Visual */}
            <div className="relative flex-1 w-full h-[250px] md:h-[400px]">
              <Image
                src="https://res.cloudinary.com/dhrfuos4s/image/upload/v1770640343/Screenshot_from_2026-02-09_17-56-49_hxgvu3.png"
                alt="Scattered documents"
                fill
                className="object-cover rounded-[32px] border border-muted-foreground/20 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resume Customization Section */}
      <section className="w-full px-6 py-16 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            {/* Right - Text */}
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                <TypewriterText text="Targeted resume customization" speed={40} showCursor />
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Creating a tailored resume for every company is time-consuming and mentally exhausting.
              </p>
            </div>
            {/* Left - Visual */}
            <div className="relative flex-1 w-full h-[250px] md:h-[400px]">
              <Image
                src="https://res.cloudinary.com/dhrfuos4s/image/upload/v1770640905/Screenshot_from_2026-02-09_17-56-01_d5l9ku.png"
                alt="Targeted resume customization"
                fill
                className="object-cover rounded-[32px] border border-muted-foreground/20 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ATS Score Section */}
      <section className="w-full px-6 py-16 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left - Text */}
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                <TypewriterText text="ATS Score" speed={60} showCursor />
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Many resumes get rejected before a human ever sees them due to poor ATS compatibility.
              </p>
            </div>
            {/* Right - Visual */}
            <div className="relative flex-1 w-full h-[250px] md:h-[400px]">
              <Image
                src="https://res.cloudinary.com/dhrfuos4s/image/upload/v1770640837/Screenshot_from_2026-02-09_17-56-39_cakxh9.png"
                alt="ATS Score"
                fill
                className="object-cover rounded-[32px] border border-muted-foreground/20 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Video Section - Above Footer */}
      <AnimatedVideoSection>
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 overflow-hidden group">
          {/* Abstract Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto w-full">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm animate-pulse mx-auto">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Join the Beta
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground dark:text-white mb-2">
              Help Shape the <span className="text-primary">Future</span>
            </h2>

            <p className="text-muted-foreground dark:text-zinc-400 text-lg md:text-xl max-w-lg mx-auto mb-8">
              We value your input. Share your thoughts or feature requests to help us build the perfect tool for you.
            </p>

            <FeedbackForm />
          </div>
        </div>
      </AnimatedVideoSection>

      <Footer />
    </div>
  );
}
