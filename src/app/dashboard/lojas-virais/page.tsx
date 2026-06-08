"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, TrendingUp, Users, Star, Globe, Package,
  ChevronRight, X, Lightbulb, Sparkles, ArrowUpRight, RefreshCw, ShoppingBag,
  Target, Radio, Award
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import Header from "@/components/dashboard/Header";

interface ShopProduct {
  nome: string;
  precoFaixa: string;
  vendasEstimadas: string;
  image?: string;
}

interface Shop {
  id: number;
  nome: string;
  nicho: string;
  categoria: string;
  mercado?: "brasil" | "eua";
  pais: string;
  moeda?: "BRL" | "USD";
  visitasMensais: string;
  faturamentoEstimado: string;
  seguidoresSociais: string;
  avaliacaoMedia: number;
  crescimentoPercentual: number;
  tendencia: "alta" | "estavel";
  grafico: number[];
  principaisCanais?: string;
  publicoAlvo?: string;
  diferencial?: string;
  produtos: ShopProduct[];
  insight: string;
}

const CACHE_PREFIX = "lojas_virais_v2_";
const CACHE_TTL = 30 * 60 * 1000;

const MARKETS = [
  { id: "todos", label: "Todas", flag: "🌎" },
  { id: "brasil", label: "Brasil", flag: "🇧🇷" },
  { id: "eua", label: "Estados Unidos", flag: "🇺🇸" },
] as const;

function marketFlag(mercado?: string) {
  if (mercado === "eua") return "🇺🇸";
  if (mercado === "brasil") return "🇧🇷";
  return "🌎";
}

const monthLabels = ["Há 6 meses", "Há 5 meses", "Há 4 meses", "Há 3 meses", "Há 2 meses", "Mês atual"];

function chartData(values: number[]) {
  return values.map((v, i) => ({ mes: monthLabels[i] ?? `M${i + 1}`, vendas: v }));
}

function MiniChart({ values }: { values: number[] }) {
  return (
    <div className="h-12 w-24 flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData(values)}>
          <defs>
            <linearGradient id={`mini-${values.join("-")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="vendas" stroke="#10B981" strokeWidth={2} fill={`url(#mini-${values.join("-")})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProductThumb({ product }: { product: ShopProduct }) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!product.image && !imgError;
  return (
    <div className="w-12 h-12 rounded-lg bg-surface-50 border border-surface-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.nome} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <Package className="w-5 h-5 text-surface-300" />
      )}
    </div>
  );
}

function ShopCardSkeleton() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-surface-100 rounded w-32" />
          <div className="h-3 bg-surface-100 rounded w-24" />
        </div>
        <div className="h-12 w-24 bg-surface-100 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => <div key={i} className="h-14 bg-surface-100 rounded-lg" />)}
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => <div key={i} className="w-12 h-12 bg-surface-100 rounded-lg" />)}
      </div>
    </div>
  );
}

function ShopCard({ shop, index, onClick }: { shop: Shop; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className="card cursor-pointer hover:shadow-card-hover transition-all duration-200 border border-surface-200 hover:border-brand/30 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              {shop.nome.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-dark text-sm truncate">{shop.nome}</h3>
                <span className="text-sm flex-shrink-0" title={shop.pais}>{marketFlag(shop.mercado)}</span>
              </div>
              <p className="text-xs text-dark-muted truncate">{shop.nicho}</p>
            </div>
          </div>
        </div>
        <MiniChart values={shop.grafico} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-dark">{shop.visitasMensais}</div>
          <div className="text-xs text-dark-muted">Visitas/mês</div>
        </div>
        <div className="bg-surface-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-success truncate">{shop.faturamentoEstimado.split("–")[0].trim()}</div>
          <div className="text-xs text-dark-muted">Faturamento</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-sm font-bold text-success">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {shop.crescimentoPercentual}%
          </div>
          <div className="text-xs text-dark-muted">Crescimento</div>
        </div>
      </div>

      {/* Channels + audience */}
      {(shop.principaisCanais || shop.publicoAlvo) && (
        <div className="space-y-1.5">
          {shop.principaisCanais && (
            <div className="flex items-center gap-1.5 text-xs text-dark-muted">
              <Radio className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span className="truncate">{shop.principaisCanais}</span>
            </div>
          )}
          {shop.publicoAlvo && (
            <div className="flex items-center gap-1.5 text-xs text-dark-muted">
              <Target className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span className="truncate">{shop.publicoAlvo}</span>
            </div>
          )}
        </div>
      )}

      {/* Top products preview */}
      <div>
        <div className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-2">Produtos mais vendidos</div>
        <div className="flex items-center gap-2">
          {shop.produtos.slice(0, 3).map((p) => <ProductThumb key={p.nome} product={p} />)}
          <button className="ml-auto text-brand text-xs font-semibold flex items-center gap-1">
            Ver loja <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ShopModal({ shop, onClose }: { shop: Shop; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-surface-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black flex-shrink-0">
              {shop.nome.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-dark truncate">{shop.nome}</h3>
                <span className="text-sm flex-shrink-0">{marketFlag(shop.mercado)}</span>
              </div>
              <p className="text-xs text-dark-muted truncate">{shop.nicho} · {shop.categoria}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-dark-muted hover:text-dark transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Visitas/mês", value: shop.visitasMensais, icon: TrendingUp },
              { label: "Faturamento", value: shop.faturamentoEstimado, icon: ShoppingBag, small: true },
              { label: "Seguidores", value: shop.seguidoresSociais, icon: Users },
              { label: "Avaliação", value: `${shop.avaliacaoMedia.toFixed(1)} ★`, icon: Star },
            ].map((item) => (
              <div key={item.label} className="bg-surface-50 border border-surface-200 rounded-xl p-3">
                <item.icon className="w-4 h-4 text-dark-muted mb-1" />
                <div className={`font-bold text-dark ${item.small ? "text-xs" : "text-sm"}`}>{item.value}</div>
                <div className="text-xs text-dark-muted">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Origin + growth */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-full text-xs font-medium text-dark-muted">
              <Globe className="w-3.5 h-3.5" />
              {marketFlag(shop.mercado)} {shop.pais}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-success">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{shop.crescimentoPercentual}% nos últimos 6 meses
            </span>
          </div>

          {/* Channels, audience & differentiator */}
          {(shop.principaisCanais || shop.publicoAlvo || shop.diferencial) && (
            <div className="grid sm:grid-cols-3 gap-3">
              {shop.principaisCanais && (
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Radio className="w-3.5 h-3.5 text-brand" />
                    <span className="text-xs font-bold text-dark-muted uppercase tracking-wide">Canais</span>
                  </div>
                  <p className="text-xs text-dark leading-relaxed">{shop.principaisCanais}</p>
                </div>
              )}
              {shop.publicoAlvo && (
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Target className="w-3.5 h-3.5 text-brand" />
                    <span className="text-xs font-bold text-dark-muted uppercase tracking-wide">Público-alvo</span>
                  </div>
                  <p className="text-xs text-dark leading-relaxed">{shop.publicoAlvo}</p>
                </div>
              )}
              {shop.diferencial && (
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Award className="w-3.5 h-3.5 text-brand" />
                    <span className="text-xs font-bold text-dark-muted uppercase tracking-wide">Diferencial</span>
                  </div>
                  <p className="text-xs text-dark leading-relaxed">{shop.diferencial}</p>
                </div>
              )}
            </div>
          )}

          {/* Sales chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Evolução de vendas (6 meses)</span>
            </div>
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData(shop.grafico)}>
                  <defs>
                    <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EE4D2D" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EE4D2D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="vendas" stroke="#EE4D2D" strokeWidth={2.5} fill="url(#modalGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top products */}
          <div>
            <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide block mb-3">Produtos mais vendidos</span>
            <div className="space-y-2.5">
              {shop.produtos.map((p) => (
                <div key={p.nome} className="flex items-center gap-3 p-2.5 rounded-xl border border-surface-200 bg-white">
                  <ProductThumb product={p} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-dark text-sm truncate">{p.nome}</div>
                    <div className="text-xs text-dark-muted">{p.precoFaixa}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-brand">{p.vendasEstimadas}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Por que essa loja está bombando</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">{shop.insight}</p>
          </div>

          <button onClick={onClose} className="btn-brand w-full text-sm py-3">
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LojasViraisPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState<typeof MARKETS[number]["id"]>("todos");
  const [selected, setSelected] = useState<Shop | null>(null);

  const fetchShops = useCallback(async (query: string, mercado: string, force = false) => {
    setLoading(true);
    setError(false);
    const cacheKey = `${CACHE_PREFIX}${mercado}`;

    if (!force && query.trim().length < 2) {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const { shops: cachedShops, timestamp } = JSON.parse(cached);
          if (Array.isArray(cachedShops) && cachedShops.length > 0 && Date.now() - timestamp < CACHE_TTL) {
            setShops(cachedShops);
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore cache errors
      }
    }

    try {
      const res = await fetch("/api/lojas-virais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), mercado }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.shops && Array.isArray(data.shops)) {
        setShops(data.shops);
        if (query.trim().length < 2) {
          sessionStorage.setItem(cacheKey, JSON.stringify({ shops: data.shops, timestamp: Date.now() }));
        }
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchShops("", market); }, [fetchShops, market]);

  const handleMarketChange = (id: typeof MARKETS[number]["id"]) => {
    if (id === market) return;
    setMarket(id);
  };

  return (
    <>
      <Header
        title="Lojas em Alta"
        subtitle="Lojas de e-commerce que mais vendem agora — produtos campeões e evolução de vendas"
      />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Search */}
        <div className="card space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input
                className="input-field pl-10"
                placeholder="Buscar por nicho: moda, pets, beleza, casa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchShops(search, market, true)}
              />
            </div>
            <button
              onClick={() => fetchShops(search, market, true)}
              disabled={loading}
              className="btn-brand flex items-center gap-2 px-5 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? "Buscando..." : "Buscar lojas"}
            </button>
          </div>

          {/* Market filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Mercado:</span>
            {MARKETS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMarketChange(m.id)}
                disabled={loading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
                  market === m.id
                    ? "bg-brand text-white"
                    : "bg-surface-50 border border-surface-200 text-dark-muted hover:text-dark hover:border-brand/30"
                }`}
              >
                <span>{m.flag}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <div className="card flex items-center justify-center gap-3 py-5">
              <div className="w-5 h-5 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
              <span className="text-dark-muted font-medium text-sm">Analisando lojas em alta com IA...</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <ShopCardSkeleton key={i} />)}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="card border-red-100 bg-red-50 text-center py-8">
            <p className="text-sm text-danger font-medium mb-2">Erro ao buscar lojas. Tente novamente.</p>
            <button onClick={() => fetchShops(search, market, true)} className="text-xs text-brand hover:underline">Tentar novamente</button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && shops.length > 0 && (
          <>
            <div className="flex items-center gap-2 text-sm text-dark-muted">
              <Sparkles className="w-4 h-4 text-brand" />
              <span>
                <strong className="text-dark">{shops.length}</strong> lojas em alta
                {search.trim().length >= 2 ? <> no nicho <strong className="text-dark">&ldquo;{search}&rdquo;</strong></> : " selecionadas pela IA agora"}
                {market !== "todos" && <> · {MARKETS.find((m) => m.id === market)?.flag} {MARKETS.find((m) => m.id === market)?.label}</>}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {shops.map((shop, i) => (
                <ShopCard key={shop.id} shop={shop} index={i} onClick={() => setSelected(shop)} />
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selected && <ShopModal shop={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
