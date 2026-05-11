"use client";

import { Bell, Search, Flame } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-surface-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">{title}</h1>
          {subtitle && <p className="text-sm text-dark-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 w-56">
            <Search className="w-4 h-4 text-dark-muted" />
            <input
              placeholder="Buscar..."
              className="bg-transparent text-sm text-dark placeholder-dark-muted outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 text-brand rounded-xl px-3 py-2 text-sm font-semibold">
            <Flame className="w-4 h-4" />
            <span>7 dias</span>
          </div>
          <button className="relative w-10 h-10 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors">
            <Bell className="w-4 h-4 text-dark-muted" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
