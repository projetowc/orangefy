"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Zap, Target, Calculator, Megaphone,
  Store, Trophy, Users, Settings, ShoppingBag, LogOut,
  ChevronRight, X, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/missoes", icon: Zap, label: "Missões", badge: "3" },
  { href: "/dashboard/radar", icon: Target, label: "Radar de Produtos" },
  { href: "/dashboard/calculadora", icon: Calculator, label: "Calculadora" },
  { href: "/dashboard/gerador", icon: Megaphone, label: "Gerador de Anúncios" },
  { href: "/dashboard/minha-loja", icon: Store, label: "Minha Loja" },
  { href: "/dashboard/ranking", icon: Trophy, label: "Ranking" },
  { href: "/dashboard/comunidade", icon: Users, label: "Comunidade" },
  { href: "/dashboard/configuracoes", icon: Settings, label: "Configurações" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-surface-200">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
            <ShoppingBag className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
          </div>
          <span className="text-xl font-black text-dark">
            Orange<span className="text-brand">fy</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-dark-muted hover:text-dark">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User XP Card */}
      <div className="m-4 p-4 bg-gradient-hero rounded-2xl border border-surface-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
            W
          </div>
          <div>
            <div className="font-semibold text-dark text-sm">Wesley S.</div>
            <div className="text-xs text-dark-muted">Nível 3 · Iniciante</div>
          </div>
        </div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-dark-muted font-medium">840 / 1000 XP</span>
          <span className="text-brand font-semibold">84%</span>
        </div>
        <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-brand rounded-full" style={{ width: "84%" }} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "sidebar-item",
                isActive && "active"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && !isActive && (
                <span className="bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-surface-200">
        <button className="sidebar-item w-full text-danger hover:bg-red-50 hover:text-danger">
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-card border border-surface-200 flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-dark" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-surface-200 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-dark/50 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
