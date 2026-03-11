"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Handshake,
  FileText,
  ClipboardCheck,
  BarChart3,
  MessageSquare,
  Settings,
  Waves,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Paviljoens", href: "/paviljoens", icon: Building2 },
  { label: "Kopers & CRM", href: "/kopers", icon: Users },
  { label: "Dealflow", href: "/deals", icon: Handshake },
  { label: "Documenten", href: "/documenten", icon: FileText },
  { label: "Mystery Visits", href: "/mystery-visits", icon: ClipboardCheck },
  { label: "Financieel", href: "/financieel", icon: BarChart3 },
  { label: "Communicatie", href: "/communicatie", icon: MessageSquare },
  { label: "Instellingen", href: "/instellingen", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col" style={{ backgroundColor: "#1e3a5f" }}>
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#c9a84c" }}
        >
          <Waves className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Paviljoen
          </h1>
          <p className="-mt-1 text-xs font-medium text-white/50">Partner</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/10" />

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "text-white shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              }`}
              style={
                active
                  ? { backgroundColor: "rgba(201, 168, 76, 0.15)" }
                  : undefined
              }
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  active ? "" : "text-white/40 group-hover:text-white/70"
                }`}
                style={active ? { color: "#c9a84c" } : undefined}
              />
              <span>{item.label}</span>
              {active && (
                <div
                  className="ml-auto h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "#c9a84c" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="mx-4 border-t border-white/10" />
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: "#c9a84c" }}
          >
            {getInitials("Admin Gebruiker")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white/90">
              Admin Gebruiker
            </p>
            <p className="truncate text-xs text-white/40">Beheerder</p>
          </div>
          <button
            className="rounded-md p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
            title="Uitloggen"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-5 rounded-md p-1 text-white/50 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 lg:block">
        {sidebarContent}
      </aside>
    </>
  );
}
