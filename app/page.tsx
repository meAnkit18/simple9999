import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Simple9999
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium border border-accent">
          🚀 The Ultimate Resume Builder
        </div>
        <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-balance">
          Craft Your Perfect <span className="text-primary">Resume</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed text-balance">
          Your powerful resume builder platform. Create, manage, and optimize
          your resumes with ease using our professional tools.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold text-lg transition-all hover:scale-105"
          >
            Login
          </Link>
        </div>
      </main>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-2xl border border-border bg-card text-card-foreground hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="mb-4 text-4xl">📄</div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
              Easy Resume Builder
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Create professional resumes in minutes with our intuitive builder.
              Drag and drop sections with ease.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-border bg-card text-card-foreground hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="mb-4 text-4xl">🎯</div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
              ATS Optimized
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Our resumes are optimized to pass Applicant Tracking Systems,
              ensuring your resume gets seen.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-border bg-card text-card-foreground hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="mb-4 text-4xl">💼</div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
              Company Specific
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate tailored resumes for specific companies and roles to
              increase your chances of hiring.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
