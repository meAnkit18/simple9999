"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            setLoggingOut(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard!</h2>
                    <p className="text-black-600">
                        You have successfully logged in. This is a protected page that only authenticated users can access.
                    </p>
                </div>
            </main>
        </div>
    );
}