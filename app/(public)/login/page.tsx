"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white p-3 w-full rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-black font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
