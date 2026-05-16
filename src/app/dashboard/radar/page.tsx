"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Minus, Package, ChevronRight, BarChart2, Truck, Filter, Sparkles, X, RefreshCw } from "lucide-react";
import Header from "@/components/dashboard/Header";

type Tag = "viral" | "high-margin" | "easy" | "trending" | "easy-shipping";
type Trend = "up" | "stable" | "down";

interface Product {
  id: number;
  name: string;
  score: number;
  margin: number;
  competition: string;
  difficulty: string;
  trend: Trend;
  tags: Tag[];
  avgPrice: string;
  category: string;
  analysis: string;
}

const tagLabels: Record<Tag, string> = {
  viral: "Viral",
  "high-margin": "Alta margem",
  easy: "Fácil iniciante",
  trending: "Tendência",
  "easy-shipping": "Fácil envio",
};

const CACHE_KEY = "radar_products_cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

function ScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circ = 2 * Math.PI * radius;
  const color = score >= 80 ? "#10B981" : score >= 65 ? "#EE4D2D" : "#EF4444";
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#F0F0F0" strokeWidth="5" />
        <circle cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-surface-100 flex-shrink-0" />
        <div className="flex-1 space-y-2 pr-16">
          <div className="h-4 bg-surface-100 rounded w-3/4" />
          <div className="h-3 bg-surface-100 rounded w-1/3" />
        </div>
        <div className="w-14 h-14 rounded-full bg-surface-100 flex-shrink-0" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-surface-100 rounded w-16" />
        <div className="h-5 bg-surface-100 rounded w-20" />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[0, 1, 2].map((i) => <div key={i} className="h-14 bg-surface-100 rounded-lg" />)}
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-surface-100 rounded w-20" />
        <div className="h-3 bg-surface-100 rounded w-16" />
      </div>
    </div>
  );
}

function ProductCard({ product, index, onClick, aiGenerated }: {
  product: Product;
  index: number;
  onClick: () => void;
  aiGenerated?: boolean;
}) {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="card cursor-pointer hover:shadow-card-hover transition-all duration-200 border border-surface-200 hover:border-dark/10 relative"
    >
      {aiGenerated && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span className="text-xs text-purple-600 font-medium">IA</span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-dark-muted" />
        </div>
        <div className="flex-1 min-w-0 pr-16">
          <h3 className="font-semibold text-dark text-sm leading-snug line-clamp-2">{product.name}</h3>
          <span className="text-xs text-dark-muted">{product.category}</span>
        </div>
        <ScoreRing score={product.score} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-surface-100 text-dark-muted rounded-md font-medium">
            {tagLabels[tag]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-surface-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-success">{product.margin}%</div>
          <div className="text-xs text-dark-muted">Margem</div>
        </div>
        <div className="bg-surface-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-dark">{product.competition}</div>
          <div className="text-xs text-dark-muted">Concorrência</div>
        </div>
        <div className="bg-surface-50 rounded-lg p-2 text-center flex flex-col items-center">
          {product.trend === "up" ? <TrendingUp className="w-4 h-4 text-success" /> :
            product.trend === "down" ? <TrendingDown className="w-4 h-4 text-danger" /> :
              <Minus className="w-4 h-4 text-dark-muted" />}
          <div className="text-xs text-dark-muted mt-0.5">Tendência</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-dark-muted">{product.avgPrice}</span>
        <button className="text-brand text-xs font-semibold flex items-center gap-1">
          Analisar <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

export default function RadarPage() {
  const [baseProducts, setBaseProducts] = useState<Product[]>([]);
  const [loadingBase, setLoadingBase] = useState(true);
  const [baseError, setBaseError] = useState(false);

  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<Tag | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [aiProducts, setAiProducts] = useState<Product[] | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchBaseProducts = useCallback(async (force = false) => {
    setLoadingBase(true);
    setBaseError(false);

    if (!force) {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { products, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setBaseProducts(products);
            setLoadingBase(false);
            return;
          }
        }
      } catch {
        // ignore cache errors
      }
    }

    try {
      const seed = Date.now().toString();
      const res = await fetch(`/api/radar/products?seed=${seed}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        setBaseProducts(data.products);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ products: data.products, timestamp: Date.now() }));
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setBaseError(true);
    } finally {
      setLoadingBase(false);
    }
  }, []);

  useEffect(() => { fetchBaseProducts(); }, [fetchBaseProducts]);

  // AI search debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (search.trim().length < 3) { setAiProducts(null); setAiError(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoadingAi(true);
      setAiError(false);
      try {
        const res = await fetch("/api/radar/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: search.trim() }),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setAiProducts(data.products);
        } else throw new Error("Invalid response");
      } catch {
        setAiError(true);
        setAiProducts(null);
      } finally {
        setLoadingAi(false);
      }
    }, 700);
  }, [search]);

  const isAiMode = search.trim().length >= 3;
  const loading = isAiMode ? loadingAi : loadingBase;

  const filteredBase = baseProducts.filter((p) => {
    const matchTag = filterTag === "all" || p.tags.includes(filterTag);
    return matchTag;
  });

  const displayProducts = isAiMode ? (aiProducts ?? []) : filteredBase;

  return (
    <>
      <Header title="Radar de Produtos" subtitle="Produtos validados com análise de margem e concorrência" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-5">
        {/* Filtros */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input
                className="input-field pl-10 pr-10"
                placeholder="Buscar produto para análise com IA..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setAiProducts(null); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {!isAiMode && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-dark-muted flex-shrink-0" />
                {(["all", "viral", "high-margin", "easy", "trending", "easy-shipping"] as const).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      filterTag === tag
                        ? "bg-dark text-white border-dark"
                        : "bg-white text-dark-muted border-surface-200 hover:border-dark-muted"
                    }`}
                  >
                    {tag === "all" ? "Todos" : tagLabels[tag]}
                  </button>
                ))}
                <button
                  onClick={() => fetchBaseProducts(true)}
                  disabled={loadingBase}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-surface-200 text-dark-muted hover:border-brand hover:text-brand transition-all disabled:opacity-50"
                  title="Buscar novos produtos"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingBase ? "animate-spin" : ""}`} />
                  Atualizar
                </button>
              </div>
            )}
          </div>

          {isAiMode && (
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Busca com IA — mostrando produtos relacionados a <strong>&quot;{search}&quot;</strong></span>
            </div>
          )}
        </div>

        {/* Loading IA search */}
        <AnimatePresence>
          {loadingAi && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="card flex items-center justify-center gap-3 py-12"
            >
              <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <span className="text-dark-muted font-medium">Analisando produtos com IA...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error AI */}
        {aiError && !loadingAi && (
          <div className="card border-red-100 bg-red-50 text-center py-8">
            <p className="text-sm text-danger font-medium">Erro ao buscar produtos. Tente novamente.</p>
            <button
              onClick={() => { const q = search; setSearch(""); setTimeout(() => setSearch(q), 50); }}
              className="text-xs text-brand mt-2 hover:underline"
            >Tentar novamente</button>
          </div>
        )}

        {/* Error base */}
        {baseError && !loadingBase && !isAiMode && (
          <div className="card border-red-100 bg-red-50 text-center py-8">
            <p className="text-sm text-danger font-medium">Erro ao carregar produtos. Tente novamente.</p>
            <button onClick={() => fetchBaseProducts(true)} className="text-xs text-brand mt-2 hover:underline">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Skeleton loading base */}
        {loadingBase && !isAiMode && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* Grid */}
        {!loading && !aiError && !baseError && (
          <>
            {displayProducts.length === 0 && isAiMode && (
              <div className="card text-center py-10">
                <Package className="w-10 h-10 text-surface-200 mx-auto mb-3" />
                <p className="text-dark-muted text-sm">Nenhum produto encontrado para esta busca.</p>
              </div>
            )}

            {displayProducts.length > 0 && (
              <>
                <div className="flex items-center gap-2 text-xs text-dark-muted">
                  {isAiMode ? (
                    <><Sparkles className="w-3 h-3 text-purple-500" /><span>{displayProducts.length} produtos gerados pela IA</span></>
                  ) : (
                    <><Sparkles className="w-3 h-3 text-brand" /><span>{displayProducts.length} produtos selecionados pela IA agora</span></>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      onClick={() => setSelected(product)}
                      aiGenerated={isAiMode && !!aiProducts}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Modal */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-dark/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-dark-muted" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm">{selected.name}</h3>
                    <span className="text-xs text-dark-muted">{selected.category}</span>
                  </div>
                </div>
                <ScoreRing score={selected.score} />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {selected.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-surface-100 text-dark-muted rounded-md font-medium">
                    {tagLabels[tag]}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Margem estimada", value: `${selected.margin}%`, icon: BarChart2 },
                  { label: "Concorrência", value: selected.competition, icon: TrendingUp },
                  { label: "Preço médio", value: selected.avgPrice, icon: Package },
                  { label: "Logística", value: selected.difficulty, icon: Truck },
                ].map((item) => (
                  <div key={item.label} className="bg-surface-50 border border-surface-200 rounded-xl p-3">
                    <item.icon className="w-4 h-4 text-dark-muted mb-1" />
                    <div className="font-semibold text-dark text-sm">{item.value}</div>
                    <div className="text-xs text-dark-muted">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 mb-4">
                <div className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-2">Análise</div>
                <p className="text-sm text-dark leading-relaxed">{selected.analysis}</p>
              </div>

              <button onClick={() => setSelected(null)} className="btn-brand w-full text-sm py-3">
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
