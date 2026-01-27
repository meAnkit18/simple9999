import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextReveal } from "@/components/ui/text-reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { WaterDotsBackground } from "@/components/ui/water-dots-background";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden font-sans selection:bg-primary/20">
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
          <Link href="#resources" className="hover:text-foreground transition-colors">Resources</Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
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
      {/* Hero Section */}
      {/* Hero Section */}
      {/* Hero Section */}
      <main className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <WaterDotsBackground className="z-0" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none select-none">
          <div className="flex items-center gap-3 mb-6 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <Logo className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <span className="text-2xl md:text-3xl font-bold tracking-tight">simple9999.com</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            Vibe with simplicity
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-lg mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            Now make your Resumes easily for every job
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
