"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, ArrowRight, ArrowUpRight, Target, Star, Percent, Tags,
  Package, Flame, ChevronRight, Sparkles, Store, Globe
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import Header from "@/components/dashboard/Header";
import { useUser, getFirstName } from "@/context/UserContext";

interface FeaturedProduct {
  id: number;
  name: string;
  score: number;
  margin: number;
  category: string;
  avgPrice: string;
  image?: string;
}

interface ShopPreview {
  id: number;
  nome: string;
  nicho: string;
  crescimentoPercentual: number;
  tendencia: "alta" | "estavel";
}

interface GlobalTrend {
  categoria: string;
  regiao: string;
  crescimento: number;
  dados: number[];
}

const globalTrends: GlobalTrend[] = [
  { categoria: "Eletrônicos & Gadgets", regiao: "Global", crescimento: 34, dados: [40, 45, 52, 58, 65, 74] },
  { categoria: "Casa & Decoração", regiao: "EUA & Europa", crescimento: 28, dados: [35, 38, 44, 50, 55, 62] },
  { categoria: "Beleza & Cuidados Pessoais", regiao: "Ásia & Brasil", crescimento: 41, dados: [30, 36, 45, 53, 61, 70] },
  { categoria: "Pet Tech", regiao: "Global", crescimento: 52, dados: [25, 32, 41, 50, 60, 72] },
  { categoria: "Fitness & Wellness", regiao: "Global", crescimento: 22, dados: [45, 48, 52, 56, 60, 64] },
  { categoria: "Moda Sustentável", regiao: "Europa & EUA", crescimento: 37, dados: [33, 38, 45, 52, 58, 66] },
];

function TrendSparkline({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const gradId = `trend-grad-${data.join("-")}`;
  return (
    <div className="h-12 w-full -mx-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} fill={`url(#${gradId})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#FF7337";
  return "#EE4D2D";
}

function truncateName(name: string, max = 16) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function FeaturedProductCard({ product, index }: { product: FeaturedProduct; index: number }) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!product.image && !imgError;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(product.score, 100) / 100) * circumference;

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
        <div className="absolute top-2 right-2 w-10 h-10">
          <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
            <circle cx="20" cy="20" r={radius} fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
            <circle
              cx="20" cy="20" r={radius} fill="none"
              stroke={scoreColor(product.score)} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white">
            {product.score}
          </span>
        </div>
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
  const streak = profile?.streak_days ?? 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [shops, setShops] = useState<ShopPreview[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = sessionStorage.getItem("radar_products_v3");
        if (cached) {
          const { products: cachedProducts } = JSON.parse(cached);
          if (Array.isArray(cachedProducts) && cachedProducts.length > 0 && !cancelled) {
            setProducts(cachedProducts.slice(0, 8));
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
          setProducts(data.products.slice(0, 8));
        }
      } catch {
        // silently ignore — section just won't render
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("lojas_virais_v1");
      if (cached) {
        const { shops: cachedShops } = JSON.parse(cached);
        if (Array.isArray(cachedShops) && cachedShops.length > 0) {
          setShops(cachedShops.slice(0, 3));
        }
      }
    } catch {
      // ignore cache errors
    }
  }, []);

  const rankedProducts = [...products].sort((a, b) => b.score - a.score);
  const chartData = rankedProducts.map((p) => ({ name: truncateName(p.name), score: p.score }));
  const avgScore = products.length ? Math.round(products.reduce((sum, p) => sum + p.score, 0) / products.length) : 0;
  const avgMargin = products.length ? Math.round(products.reduce((sum, p) => sum + p.margin, 0) / products.length) : 0;
  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const stats = [
    {
      label: "Produtos no Radar",
      value: loadingProducts ? "—" : String(products.length),
      sub: "selecionados pela IA agora",
      icon: Target,
      color: "text-brand",
      bg: "bg-orange-50",
    },
    {
      label: "Score Médio",
      value: loadingProducts ? "—" : String(avgScore),
      sub: "de 100 pontos de oportunidade",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Margem Média",
      value: loadingProducts ? "—" : `${avgMargin}%`,
      sub: "lucro estimado por produto",
      icon: Percent,
      color: "text-success",
      bg: "bg-green-50",
    },
    {
      label: "Categoria em Alta",
      value: loadingProducts ? "—" : topCategory,
      sub: "mais frequente nos destaques",
      icon: Tags,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`${greeting}, ${firstName}! Aqui está o resumo da sua operação.`}
      />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* BANNER */}
        <div className="w-full rounded-2xl overflow-hidden">
          <Image
            src="/banner-dashboard.png"
            alt="Banner Orangefy"
            width={1200}
            height={300}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* STATS */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-black text-dark mb-0.5 truncate">{stat.value}</div>
              <div className="text-xs text-dark-muted font-medium">{stat.label}</div>
              <div className="text-xs text-dark-muted mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* TENDÊNCIA DE OPORTUNIDADES */}
          <motion.div
            className="card lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-dark">Tendência de Oportunidades</h2>
                <p className="text-xs text-dark-muted mt-0.5">Score dos produtos em destaque, do mais ao menos promissor</p>
              </div>
              <div className="badge-brand">Radar agora</div>
            </div>
            {loadingProducts ? (
              <div className="h-[220px] rounded-xl bg-surface-100 animate-pulse" />
            ) : chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[220px] text-center">
                <Package className="w-10 h-10 text-surface-200 mb-3" />
                <p className="text-dark-muted text-sm font-medium">Nenhum produto carregado ainda</p>
                <p className="text-xs text-dark-muted mt-1">Explore o Radar de Produtos para ver as melhores oportunidades</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EE4D2D" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EE4D2D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB" }}
                    formatter={(value: number) => [`${value} pontos`, "Score"]}
                  />
                  <Area type="monotone" dataKey="score" stroke="#EE4D2D" strokeWidth={2.5} fill="url(#scoreTrendGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* LOJAS EM ALTA — RESUMO */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-dark flex items-center gap-2">
                <Store className="w-4 h-4 text-brand" />
                Lojas em Alta
              </h2>
              <Link href="/dashboard/lojas-virais" className="text-brand text-xs font-semibold flex items-center gap-1 hover:gap-1.5 transition-all whitespace-nowrap">
                Ver todas <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {shops.length === 0 ? (
              <div className="text-center py-6">
                <TrendingUp className="w-8 h-8 text-surface-200 mx-auto mb-3" />
                <p className="text-dark-muted text-sm font-medium mb-1">Lojas que mais vendem agora</p>
                <p className="text-xs text-dark-muted mb-3">Produtos campeões, faturamento e gráficos de vendas mensais.</p>
                <Link href="/dashboard/lojas-virais" className="btn-brand text-xs px-4 py-2 inline-flex items-center gap-1.5">
                  Explorar lojas <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {shops.map((shop) => (
                  <Link
                    key={shop.id}
                    href="/dashboard/lojas-virais"
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-surface-200 hover:border-brand/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {shop.nome.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-dark text-sm truncate">{shop.nome}</div>
                      <div className="text-xs text-dark-muted truncate">{shop.nicho}</div>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-bold flex-shrink-0 ${shop.tendencia === "alta" ? "text-success" : "text-dark-muted"}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{shop.crescimentoPercentual}%
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* PRODUTOS EM DESTAQUE */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-dark flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand" />
                Produtos em Destaque
              </h2>
              <p className="text-xs text-dark-muted mt-0.5">Selecionados pelo Radar Orangefy com IA — score de oportunidade e imagens reais</p>
            </div>
            <Link href="/dashboard/radar" className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
              Ver radar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loadingProducts
              ? [...Array(8)].map((_, i) => <FeaturedProductSkeleton key={i} />)
              : products.map((p, i) => <FeaturedProductCard key={p.id} product={p} index={i} />)}
          </div>
        </motion.div>

        {/* TENDÊNCIAS DE MERCADO GLOBAL */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-dark flex items-center gap-2">
                <Globe className="w-4 h-4 text-success" />
                Tendências de Mercado Global
              </h2>
              <p className="text-xs text-dark-muted mt-0.5">Categorias de produtos em crescimento acelerado no e-commerce mundial nos últimos 6 meses</p>
            </div>
            <span className="badge-success text-xs flex items-center gap-1 flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
              Em alta
            </span>
          </div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden" animate="show" variants={stagger}
          >
            {globalTrends.map((t) => (
              <motion.div
                key={t.categoria}
                variants={fadeUp}
                className="bg-surface-50 border border-surface-200 rounded-xl p-4 hover:border-success/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <h3 className="font-bold text-dark text-sm truncate">{t.categoria}</h3>
                    <p className="text-xs text-dark-muted">{t.regiao}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-success font-bold text-sm flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {t.crescimento}%
                  </div>
                </div>
                <TrendSparkline data={t.dados} />
              </motion.div>
            ))}
          </motion.div>
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
