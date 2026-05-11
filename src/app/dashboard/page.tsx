"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag, TrendingUp, Star, Zap, ArrowRight,
  CheckCircle2, Clock, Package, Flame, Trophy, ChevronRight
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import Header from "@/components/dashboard/Header";

const salesData = [
  { day: "Seg", vendas: 0, lucro: 0 },
  { day: "Ter", vendas: 1, lucro: 28 },
  { day: "Qua", vendas: 1, lucro: 28 },
  { day: "Qui", vendas: 2, lucro: 56 },
  { day: "Sex", vendas: 1, lucro: 28 },
  { day: "Sáb", vendas: 2, lucro: 56 },
  { day: "Dom", vendas: 0, lucro: 0 },
];

const missions = [
  {
    id: 1,
    title: "Criar conta na Shopee",
    xp: 100,
    completed: true,
    category: "setup",
  },
  {
    id: 2,
    title: "Escolher produto campeão",
    xp: 150,
    completed: true,
    category: "product",
  },
  {
    id: 3,
    title: "Publicar primeiro anúncio",
    xp: 200,
    completed: false,
    category: "listing",
    current: true,
  },
  {
    id: 4,
    title: "Fazer primeira venda",
    xp: 500,
    completed: false,
    category: "sales",
  },
  {
    id: 5,
    title: "Atingir 10 vendas",
    xp: 1000,
    completed: false,
    category: "growth",
  },
];

const recommendedProducts = [
  {
    id: 1,
    name: "Organizador de gaveta modular",
    score: 87,
    margin: 62,
    tags: ["🔥 Viral", "💰 Alta margem"],
    price: "R$29–R$45",
  },
  {
    id: 2,
    name: "Suporte para celular universal",
    score: 79,
    margin: 55,
    tags: ["🟢 Fácil iniciante", "📦 Fácil envio"],
    price: "R$15–R$35",
  },
  {
    id: 3,
    name: "Kit pincel maquiagem 12 peças",
    score: 73,
    margin: 48,
    tags: ["📈 Tendência", "💰 Alta margem"],
    price: "R$25–R$60",
  },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DashboardPage() {
  const xpPercent = 84;

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Bom dia, Wesley! Você tem 3 missões ativas hoje."
      />

      <div className="p-6 space-y-6">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {[
            {
              label: "Total de Vendas",
              value: "7",
              sub: "+2 esta semana",
              icon: ShoppingBag,
              color: "text-brand",
              bg: "bg-orange-50",
              trend: true,
            },
            {
              label: "Lucro Estimado",
              value: "R$ 340",
              sub: "R$48/venda média",
              icon: TrendingUp,
              color: "text-success",
              bg: "bg-green-50",
              trend: true,
            },
            {
              label: "Score Shopee",
              value: "78",
              sub: "de 100 pontos",
              icon: Star,
              color: "text-amber-500",
              bg: "bg-amber-50",
              trend: null,
            },
            {
              label: "Nível Atual",
              value: "3",
              sub: "840 / 1000 XP",
              icon: Trophy,
              color: "text-purple-600",
              bg: "bg-purple-50",
              trend: null,
            },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                {stat.trend && (
                  <span className="badge-success text-xs">
                    <TrendingUp className="w-3 h-3" />
                    Alta
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-dark mb-0.5">{stat.value}</div>
              <div className="text-xs text-dark-muted font-medium">{stat.label}</div>
              <div className="text-xs text-dark-muted mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* CHART */}
          <motion.div
            className="card lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-dark">Evolução de Vendas</h2>
                <p className="text-xs text-dark-muted mt-0.5">Últimos 7 dias</p>
              </div>
              <div className="badge-brand">Esta semana</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EE4D2D" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#EE4D2D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(v: number) => [`R$${v}`, "Lucro"]}
                />
                <Area
                  type="monotone"
                  dataKey="lucro"
                  stroke="#EE4D2D"
                  strokeWidth={2.5}
                  fill="url(#brandGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* SCORE */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-bold text-dark mb-4">Score da Loja</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#F0F0F0" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.78} ${2 * Math.PI * 50}`}
                    className="score-ring"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF7337" />
                      <stop offset="100%" stopColor="#EE4D2D" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-dark">78</span>
                  <span className="text-xs text-dark-muted">de 100</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Margem", value: 82, color: "#10B981" },
                { label: "Concorrência", value: 65, color: "#EE4D2D" },
                { label: "Potencial viral", value: 78, color: "#FF7337" },
                { label: "Logística", value: 90, color: "#10B981" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-dark-muted">{item.label}</span>
                    <span className="font-semibold text-dark">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* MISSIONS */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-dark">Jornada de Missões</h2>
                <p className="text-xs text-dark-muted mt-0.5">2 de 5 concluídas</p>
              </div>
              <Link href="/dashboard/missoes" className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Ver todas <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    m.completed
                      ? "bg-green-50 border-green-200 opacity-70"
                      : m.current
                      ? "bg-orange-50 border-brand/30"
                      : "bg-surface-50 border-surface-200"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.completed ? "bg-success" : m.current ? "bg-gradient-brand" : "bg-surface-200"
                  }`}>
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : m.current ? (
                      <Zap className="w-4 h-4 text-white" />
                    ) : (
                      <Clock className="w-4 h-4 text-dark-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${m.completed ? "text-success line-through" : "text-dark"}`}>
                      {m.title}
                    </div>
                    <div className="text-xs text-dark-muted">+{m.xp} XP</div>
                  </div>
                  {m.current && (
                    <span className="badge-brand text-xs">Atual</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RECOMMENDED PRODUCTS */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-dark">Produtos Recomendados</h2>
                <p className="text-xs text-dark-muted mt-0.5">Selecionados para seu perfil</p>
              </div>
              <Link href="/dashboard/radar" className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Ver radar <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recommendedProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors border border-surface-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-dark text-sm truncate">{p.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.tags.map((tag) => (
                        <span key={tag} className="text-xs text-dark-muted">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-black text-brand">{p.score}</div>
                    <div className="text-xs text-dark-muted">score</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* STREAK BANNER */}
        <motion.div
          className="bg-gradient-brand rounded-2xl p-6 flex items-center justify-between text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5" />
              <span className="font-bold">7 dias de streak!</span>
            </div>
            <p className="text-white/70 text-sm">Continue assim. Você está indo muito bem!</p>
          </div>
          <Link
            href="/dashboard/missoes"
            className="relative z-10 bg-white text-brand font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-surface-50 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            Ver missões
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </>
  );
}
