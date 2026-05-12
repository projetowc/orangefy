"use client";

import { Bell, Flame } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { profile } = useUser();
  const streak = profile?.streak_days ?? 0;

  return (
    <header className="bg-white border-b border-surface-200 px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-base lg:text-xl font-bold text-dark truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-dark-muted mt-0.5 truncate hidden sm:block">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-50 text-brand rounded-lg px-2 py-1.5 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{streak} dias</span>
              <span className="sm:hidden">{streak}</span>
            </div>
          )}
          <button className="w-9 h-9 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors">
            <Bell className="w-4 h-4 text-dark-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
