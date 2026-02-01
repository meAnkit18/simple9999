import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextReveal } from "@/components/ui/text-reveal";
import { MagicButton } from "@/components/ui/magic-button";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { WaterDotsBackground } from "@/components/ui/water-dots-background";
import { AnimatedVideoSection } from "@/components/ui/animated-video-section";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { ScatteredDocumentVisual } from "@/components/ui/scattered-document-visual";
import { ResumeCustomizationVisual } from "@/components/ui/resume-customization-visual";
import { ATSScoreVisual } from "@/components/ui/ats-score-visual";
import { FeedbackForm } from "@/components/ui/feedback-form";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colonomrs duration-300 overflow-x-hidden font-sans selection:bg-primary/20">
      <div className="fixed inset-0 -z-10">

      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 w-full bg-background/50 backdrop-blur-md border-b border-border/10 supports-[backdrop-filter]:bg-background/20">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Simple9999.com</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#resources" className="hover:text-foreground transition-colors">Developer</Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">Docs</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            Get Started
          </Link>
        </div>
      </nav>


      {/* Hero Section */}
      <main className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <WaterDotsBackground className="z-0" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none select-none">
          <div className="flex items-center gap-3 mb-6 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <Logo className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <span className="text-2xl md:text-3xl font-bold tracking-tight">simple9999.com</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            Agentic Resume Builder
          </h1><br />
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            with Simplicity
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-lg mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            Stop filling forms. Just tell it what you want.
          </p>

          <div className="mt-10 animate-fade-in-up opacity-0 pointer-events-auto" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <MagicButton href="/signup" className="w-full md:w-auto">
              Start Building Now
            </MagicButton>
          </div>
        </div>
      </main>

      {/* Video Section */}
      <AnimatedVideoSection>
        <video
          src="/videos/Video1.mp4"
          className="w-full h-full object-cover rounded-4xl"
          autoPlay
          muted
          loop
          playsInline
        />
      </AnimatedVideoSection>

      {/* Tagline Section */}
      <section className="w-full px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto text-left">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            <TypewriterText text="Simple9999 is agentic Resume builder website," speed={40} showCursor />
            <br />
            <span className="text-muted-foreground">
              <TypewriterText text="Just by pasting job requirements" speed={40} delay={2000} showCursor />
            </span>
          </h2>
        </div>
      </section>

      {/* Scattered Documents Section */}
      <section className="w-full px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
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
            <div className="flex-1 w-full h-[300px] md:h-[400px]">
              <ScatteredDocumentVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Resume Customization Section */}
      <section className="w-full px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
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
            <div className="flex-1 w-full h-[300px] md:h-[400px]">
              <ResumeCustomizationVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ATS Score Section */}
      <section className="w-full px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
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
            <div className="flex-1 w-full h-[300px] md:h-[400px]">
              <ATSScoreVisual />
            </div>
          </div>
        </div>
      </section>

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
