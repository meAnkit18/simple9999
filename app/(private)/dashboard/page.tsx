"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const uploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      console.log("Upload success:", data);
      alert("File uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <label className="block mb-2 font-semibold  text-black">
            Upload document
          </label>

          <input
            type="file"
            onChange={uploadFile}
            className="block w-full border rounded p-2 text-black"
            accept=".pdf"
          />
        </div>
      </div>
    </div>
  );
}
