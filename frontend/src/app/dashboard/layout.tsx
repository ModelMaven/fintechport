"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FilePlus2, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  ShieldAlert, 
  Sparkles, 
  LogOut,
  ChevronDown,
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { api } from "../../lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Sync authenticated user on dashboard layout load
    api.getCurrentUser()
      .then(res => setUser(res))
      .catch(err => console.error("Error loading user me:", err));
  }, []);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Report", href: "/dashboard/new-report", icon: FilePlus2 },
    { name: "Borrowers", href: "/dashboard/borrowers", icon: Users },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Admin Panel", href: "/dashboard/admin", icon: ShieldAlert, adminOnly: true },
    { name: "Settings", href: "/dashboard/settings", icon: Settings }
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && user?.role !== "admin") return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-brand-surface text-brand-textPrimary font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 border-r border-brand-border bg-white z-50 flex flex-col justify-between
        transition-transform duration-200 md:static md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-16 border-b border-brand-border px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6.5 h-6.5 rounded bg-brand-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">L</span>
              </div>
              <span className="font-bold text-sm tracking-tight text-brand-textPrimary">
                LoanCraft<span className="text-brand-primary font-medium">AI</span>
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="p-1 md:hidden hover:bg-brand-surface rounded">
              <X size={16} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold transition-all
                    ${isActive 
                      ? "bg-brand-primary text-white" 
                      : "text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-surface border border-transparent"}
                  `}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card Footer */}
        <div className="p-4 border-t border-brand-border bg-brand-surface/40">
          {user ? (
            <div className="flex items-center gap-3 p-2 bg-white border border-brand-border rounded-xl">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs uppercase">
                {user.email[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-brand-textPrimary truncate">{user.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <UserCheck size={10} className="text-brand-primary" />
                  <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider">{user.role}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-10 bg-white border border-brand-border rounded-xl animate-pulse" />
          )}
        </div>
      </aside>

      {/* Main Panel Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-brand-border bg-white flex items-center justify-between px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 border border-brand-border rounded-lg md:hidden text-brand-textSecondary hover:text-brand-textPrimary">
              <Menu size={18} />
            </button>
            <h2 className="text-sm font-bold text-brand-textPrimary capitalize">
              {pathname === "/dashboard" ? "Dashboard Overview" : pathname.split("/").pop()?.replace("-", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-brand-surface rounded-full border border-brand-border text-[10px] font-bold text-brand-textSecondary">
              <Sparkles size={11} className="text-brand-primary" /> Beta Sandbox Environment
            </div>
            
            <Link href="/" className="p-2 border border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-surface rounded-full transition-colors">
              <LogOut size={14} />
            </Link>
          </div>
        </header>

        {/* Content view window */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
