"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, TrendingUp, Star, Trophy, ArrowRight,
  Package, Flame, ChevronRight, Sparkles
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import Header from "@/components/dashboard/Header";
import { useUser, getFirstName } from "@/context/UserContext";

const salesData = [
  { day: "Seg", lucro: 0 },
  { day: "Ter", lucro: 0 },
  { day: "Qua", lucro: 0 },
  { day: "Qui", lucro: 0 },
  { day: "Sex", lucro: 0 },
  { day: "Sáb", lucro: 0 },
  { day: "Dom", lucro: 0 },
];

interface FeaturedProduct {
  id: number;
  name: string;
  score: number;
  margin: number;
  category: string;
  avgPrice: string;
  image?: string;
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function FeaturedProductCard({ product, index }: { product: FeaturedProduct; index: number }) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!product.image && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border border-surface-200 overflow-hidden hover:shadow-card-hover transition-all duration-200 hover:border-brand/30 bg-white"
    >
      <div className="h-32 bg-surface-50 relative">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-surface-300" />
          </div>
        )}
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-brand text-xs font-black px-2 py-1 rounded-lg shadow-sm">
          {product.score}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-dark text-sm leading-snug line-clamp-2 mb-1">{product.name}</h3>
        <div className="flex items-center justify-between text-xs text-dark-muted">
          <span>{product.category}</span>
          <span className="text-success font-semibold">{product.margin}% margem</span>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedProductSkeleton() {
  return (
    <div className="rounded-2xl border border-surface-200 overflow-hidden animate-pulse">
      <div className="h-32 bg-surface-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-surface-100 rounded w-4/5" />
        <div className="h-3 bg-surface-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { profile, user } = useUser();

  const name = profile?.name || user?.email?.split("@")[0] || "Vendedor";
  const firstName = getFirstName(name);
  const sales = profile?.sales_count ?? 0;
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const xpToNext = level * 1000;
  const score = profile?.shopee_score ?? 0;
  const streak = profile?.streak_days ?? 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = sessionStorage.getItem("radar_products_v3");
        if (cached) {
          const { products: cachedProducts } = JSON.parse(cached);
          if (Array.isArray(cachedProducts) && cachedProducts.length > 0 && !cancelled) {
            setProducts(cachedProducts.slice(0, 4));
            setLoadingProducts(false);
            return;
          }
        }
      } catch {
        // ignore cache errors
      }

      try {
        const res = await fetch(`/api/radar/products?seed=${Date.now()}`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (!cancelled && data.products && Array.isArray(data.products)) {
          setProducts(data.products.slice(0, 4));
        }
      } catch {
        // silently ignore — section just won't render
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`${greeting}, ${firstName}! Aqui está o resumo da sua operação.`}
      />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
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
              value: String(sales),
              sub: sales === 0 ? "Faça sua primeira venda!" : `${sales} venda${sales > 1 ? "s" : ""} realizadas`,
              icon: ShoppingBag,
              color: "text-brand",
              bg: "bg-orange-50",
            },
            {
              label: "Lucro Estimado",
              value: sales === 0 ? "R$ 0" : `R$ ${(sales * 48).toFixed(0)}`,
              sub: "Baseado nas suas vendas",
              icon: TrendingUp,
              color: "text-success",
              bg: "bg-green-50",
            },
            {
              label: "Score Shopee",
              value: score === 0 ? "—" : String(score),
              sub: score === 0 ? "Cadastre sua loja" : "de 100 pontos",
              icon: Star,
              color: "text-amber-500",
              bg: "bg-amber-50",
            },
            {
              label: "Nível Atual",
              value: String(level),
              sub: `${xp} / ${xpToNext} XP`,
              icon: Trophy,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
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
            {sales === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <ShoppingBag className="w-10 h-10 text-surface-200 mb-3" />
                <p className="text-dark-muted text-sm font-medium">Nenhuma venda ainda</p>
                <p className="text-xs text-dark-muted mt-1">Use o Radar de Produtos para encontrar seu primeiro campeão de vendas</p>
              </div>
            ) : (
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
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB" }} />
                  <Area type="monotone" dataKey="lucro" stroke="#EE4D2D" strokeWidth={2.5} fill="url(#brandGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
                    cx="60" cy="60" r="50" fill="none"
                    stroke={score > 0 ? "url(#scoreGrad)" : "#E5E7EB"}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50 * (score / 100)} ${2 * Math.PI * 50}`}
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
                  <span className="text-4xl font-black text-dark">{score || "—"}</span>
                  <span className="text-xs text-dark-muted">{score > 0 ? "de 100" : "Cadastre sua loja"}</span>
                </div>
              </div>
            </div>
            {score === 0 ? (
              <div className="text-center">
                <p className="text-xs text-dark-muted mb-3">Cadastre sua loja em Minha Loja para ver seu score aqui.</p>
                <Link href="/dashboard/minha-loja" className="text-brand text-xs font-semibold hover:underline">
                  Ir para Minha Loja →
                </Link>
              </div>
            ) : (
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
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* FEATURED PRODUCTS */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-dark flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand" />
                Produtos em Destaque
              </h2>
              <p className="text-xs text-dark-muted mt-0.5">Selecionados pelo Radar Orangefy com IA, com imagens reais</p>
            </div>
            <Link href="/dashboard/radar" className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
              Ver radar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loadingProducts
              ? [...Array(4)].map((_, i) => <FeaturedProductSkeleton key={i} />)
              : products.map((p, i) => <FeaturedProductCard key={p.id} product={p} index={i} />)}
          </div>
        </motion.div>

        {/* WELCOME / CTA BANNER */}
        <motion.div
          className="bg-gradient-brand rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5" />
              <span className="font-bold">
                {streak > 0 ? `${streak} dias de streak!` : `Bem-vindo, ${firstName}!`}
              </span>
            </div>
            <p className="text-white/70 text-sm">
              {streak > 0
                ? "Continue assim. Você está construindo um hábito vencedor!"
                : "Explore o Radar de Produtos e descubra seu próximo campeão de vendas agora."}
            </p>
          </div>
          <Link
            href="/dashboard/radar"
            className="relative z-10 bg-white text-brand font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-surface-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
          >
            Explorar Radar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </>
  );
}
