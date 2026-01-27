import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextReveal } from "@/components/ui/text-reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";


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
      <main className="relative w-full pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
        </div>

        {/* Gradient Blur Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen dark:mix-blend-screen" />

        <div className="px-6 w-full flex flex-col items-center text-center relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 max-w-6xl mx-auto leading-[1.05]">
            <TextReveal text="Experience liftoff with the" className="block mb-4" delay={0.2} />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent block pb-4">
              <TextReveal text="next-generation Resume Builder" delay={0.5} />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-forwards opacity-0">
            Create, manage, and optimize your resumes with ease using our professional tools.
            The ultimate platform for job seekers.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-forwards opacity-0">
            <MagneticButton href="/signup" variant="primary" className="min-w-[220px] text-lg py-6">
              Start Building
            </MagneticButton>
            <MagneticButton href="#features" variant="secondary" className="min-w-[220px] text-lg py-6">
              Explore Features
            </MagneticButton>
          </div>

          {/* Abstract Visual Element - Glassmorphic Dashboard Preview */}
          <div className="mt-32 w-full max-w-6xl aspect-[16/9] rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000 fill-mode-forwards opacity-0 ring-1 ring-white/10">
            {/* Mock UI Header */}
            <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
            </div>

            {/* Mock UI Content */}
            <div className="absolute top-12 left-0 right-0 bottom-0 p-8 flex gap-8">
              {/* Sidebar Mock */}
              <div className="w-64 h-full rounded-lg bg-white/5 border border-white/5 hidden md:block" />

              {/* Main Content Mock */}
              <div className="flex-1 h-full flex flex-col gap-4">
                <div className="h-32 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 border border-white/5" />
                <div className="flex-1 rounded-lg bg-white/5 border border-white/5 grid grid-cols-2 gap-4 p-4">
                  <div className="rounded bg-white/5" />
                  <div className="rounded bg-white/5" />
                  <div className="rounded bg-white/5" />
                  <div className="rounded bg-white/5" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>
      </main>

      {/* Features Section */}
      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary/20 border-t border-border/50">
        <div className="w-full px-6 max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Simple9999?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to land your dream job, built into one powerful platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📄", title: "Easy Resume Builder", desc: "Create professional resumes in minutes with our intuitive builder. Drag and drop sections with ease." },
              { icon: "🎯", title: "ATS Optimized", desc: "Our resumes are optimized to pass Applicant Tracking Systems, ensuring your resume gets seen." },
              { icon: "💼", title: "Company Specific", desc: "Generate tailored resumes for specific companies and roles to increase your chances of hiring." }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-6 w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
