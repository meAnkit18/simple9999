import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Simple9999</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded border border-white hover:bg-white hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded bg-white text-gray-900 hover:bg-gray-200 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Welcome to Simple9999
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Your powerful resume builder platform. Create, manage, and optimize your resumes with ease.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-lg bg-white text-gray-900 font-semibold text-lg hover:bg-gray-200 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-lg border-2 border-white font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
        </div>
      </main>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">📄 Easy Resume Builder</h3>
            <p className="text-gray-400">
              Create professional resumes in minutes with our intuitive builder.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">🎯 ATS Optimized</h3>
            <p className="text-gray-400">
              Our resumes are optimized to pass Applicant Tracking Systems.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">💼 Company Specific</h3>
            <p className="text-gray-400">
              Generate tailored resumes for specific companies and roles.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
