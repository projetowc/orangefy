"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Target, Calculator, Megaphone,
  Store, Settings, LogOut,
  ChevronRight, X, Menu, Bot, Truck, Eye, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, getInitials, getFirstName } from "@/context/UserContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/radar", icon: Target, label: "Radar de Produtos" },
  { href: "/dashboard/assistente", icon: Bot, label: "Assistente IA" },
  { href: "/dashboard/fornecedores", icon: Truck, label: "Radar de Fornecedores" },
  { href: "/dashboard/spy", icon: Eye, label: "Spy de Concorrentes", badge: "novo" },
  { href: "/dashboard/anuncios-virais", icon: Flame, label: "Anúncios Virais", badge: "novo" },
  { href: "/dashboard/calculadora", icon: Calculator, label: "Calculadora" },
  { href: "/dashboard/gerador", icon: Megaphone, label: "Gerador de Anúncios" },
  { href: "/dashboard/minha-loja", icon: Store, label: "Minha Loja" },
  { href: "/dashboard/configuracoes", icon: Settings, label: "Configurações" },
];


function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { profile, user, signOut } = useUser();

  const name = profile?.name || user?.email?.split("@")[0] || "Usuário";
  const initials = getInitials(name);
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const xpToNext = level * 1000;
  const xpPercent = Math.min(Math.round((xp / xpToNext) * 100), 100);

  const levelLabels: Record<number, string> = {
    1: "Iniciante", 2: "Aprendiz", 3: "Intermediário",
    4: "Avançado", 5: "Especialista", 6: "Mestre",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-surface-200">
        <Link href="/dashboard" onClick={onClose}>
          <Image
            src="/orangefy-logo-dark.png"
            alt="Orangefy"
            width={160}
            height={46}
            className="h-8 lg:h-10 w-auto"
            priority
          />
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-dark-muted hover:text-dark p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="m-3 p-3 bg-gradient-hero rounded-2xl border border-surface-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-dark text-sm truncate">{getFirstName(name)}</div>
            <div className="text-xs text-dark-muted">Nível {level} · {levelLabels[level] ?? "Vendedor"}</div>
          </div>
        </div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-dark-muted font-medium">{xp} / {xpToNext} XP</span>
          <span className="text-brand font-semibold">{xpPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-brand rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }} />
        </div>
      </div>

      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn("sidebar-item", isActive && "active")}
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

      <div className="p-3 border-t border-surface-200">
        <button
          onClick={signOut}
          className="sidebar-item w-full text-danger hover:bg-red-50 hover:text-danger"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

function BottomNav({ onMenuOpen }: { onMenuOpen: () => void }) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Início" },
    { href: "/dashboard/radar", icon: Target, label: "Radar" },
    { href: "/dashboard/anuncios-virais", icon: Flame, label: "Anúncios" },
    { href: "/dashboard/minha-loja", icon: Store, label: "Loja" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-200">
      <div className="flex items-stretch h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-brand" : "text-dark-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onMenuOpen}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-dark-muted"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-surface-200 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile bottom nav */}
      <BottomNav onMenuOpen={() => setMobileOpen(true)} />

      {/* Mobile slide-in sidebar */}
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
