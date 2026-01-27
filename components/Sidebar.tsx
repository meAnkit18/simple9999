"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  MessageSquarePlus,
  Folder,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: "create" | "documents" | "profile") => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { id: "create", label: "New Chat", icon: MessageSquarePlus },
    { id: "documents", label: "Documents", icon: Folder },
    { id: "profile", label: "My Profile", icon: User },
  ] as const;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={`
          fixed md:relative z-50 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col
          ${isCollapsed ? "w-0 md:w-16" : "w-64"}
          ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Header */}
        <div className={`p-4 flex ${isCollapsed ? "flex-col gap-4 items-center" : "flex-row items-center justify-between"} border-b border-border/50`}>
          <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}>
            <Logo className="w-8 h-8 text-primary" />
            {!isCollapsed && (
              <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate">
                Simple9999
              </h1>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setIsCollapsed(true);
              }}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
                ${activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }
              `}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon size={24} />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
            <ThemeToggle />
            {!isCollapsed && <span className="text-sm text-muted-foreground">Theme</span>}
          </div>

          <button
            onClick={onLogout}
            className={`
              w-full flex items-center gap-3 p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors
              ${isCollapsed ? "justify-center" : ""}
            `}
            title="Logout"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button (when sidebar is hidden) */}
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-40 p-2 bg-card border border-border rounded-lg shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}
