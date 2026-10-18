"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard } from "lucide-react";

export function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
        aria-label="Account menu"
      >
        <User className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-md">
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}