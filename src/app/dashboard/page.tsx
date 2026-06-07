"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, ArrowRight,
  Package, Flame, ChevronRight, Sparkles, Store
} from "lucide-react";
import Link from "next/link";
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

function scoreColor(score: number) {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#FF7337";
  return "#EE4D2D";
}

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

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`${greeting}, ${firstName}! Aqui está o resumo da sua operação.`}
      />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
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

        {/* LOJAS EM ALTA */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-dark flex items-center gap-2">
                <Store className="w-4 h-4 text-brand" />
                Lojas em Alta
              </h2>
              <p className="text-xs text-dark-muted mt-0.5">Lojas que mais vendem agora, com seus produtos campeões</p>
            </div>
            <Link href="/dashboard/lojas-virais" className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {shops.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <TrendingUp className="w-9 h-9 text-surface-200 mb-3" />
              <p className="text-dark-muted text-sm font-medium mb-1">Descubra as lojas que mais vendem na internet</p>
              <p className="text-xs text-dark-muted mb-4 max-w-sm">Veja produtos campeões, faturamento estimado e gráficos de vendas mensais de lojas em crescimento acelerado.</p>
              <Link href="/dashboard/lojas-virais" className="btn-brand text-sm px-4 py-2 inline-flex items-center gap-1.5">
                Explorar lojas em alta <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4">
              {shops.map((shop, i) => (
                <Link
                  key={shop.id}
                  href="/dashboard/lojas-virais"
                  className="block p-4 rounded-2xl border border-surface-200 hover:border-brand/30 hover:shadow-card-hover transition-all duration-200"
                >
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {shop.nome.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-dark text-sm truncate">{shop.nome}</div>
                        <div className="text-xs text-dark-muted truncate">{shop.nicho}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${shop.tendencia === "alta" ? "text-success bg-green-50" : "text-dark-muted bg-surface-100"}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{shop.crescimentoPercentual}% no período
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
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
