"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, BarChart2, Truck, Filter, Sparkles, X, RefreshCw, Package, Bookmark, Loader2 } from "lucide-react";
import Header from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase-browser";
import { Product, Tag, tagLabels, ScoreRing, CardSkeleton, ProductCard } from "@/components/dashboard/ProductCard";

const CACHE_KEY = "radar_products_v3";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

const STATIC_PRODUCTS: Product[] = [
  { id: 1, name: "Secador de Cabelo Profissional 2200W", score: 83, margin: 55, competition: "Média", difficulty: "Fácil", trend: "up", tags: ["viral", "high-margin"], avgPrice: "R$59–R$99", category: "Beleza", analysis: "Alta demanda feminina, fácil de diferenciar com kit de acessórios. Margem acima de 50% no dropshipping.", image: "/produtos/p25.png" },
  { id: 2, name: "Fone de Ouvido Bluetooth Over-Ear", score: 86, margin: 58, competition: "Média", difficulty: "Fácil", trend: "up", tags: ["trending", "easy-shipping"], avgPrice: "R$49–R$89", category: "Eletrônicos", analysis: "Produto viral em alta, boa margem e fácil envio. Demanda constante por qualidade de som acessível.", image: "/produtos/p21.png" },
  { id: 3, name: "Máquina de Cortar Cabelo Profissional", score: 88, margin: 62, competition: "Baixa", difficulty: "Fácil", trend: "up", tags: ["high-margin", "easy-shipping", "viral"], avgPrice: "R$49–R$79", category: "Beleza", analysis: "Produto viral no TikTok, público masculino fiel. Margem excelente com demonstrações em vídeo.", image: "/produtos/p26.png" },
  { id: 4, name: "Controle Gamer Wireless", score: 81, margin: 50, competition: "Alta", difficulty: "Médio", trend: "up", tags: ["trending", "viral"], avgPrice: "R$69–R$119", category: "Games", analysis: "Nicho de games em crescimento no Brasil. Consumidores buscam alternativas mais baratas às marcas.", image: "/produtos/p28.png" },
  { id: 5, name: "Mouse Sem Fio RGB LED", score: 79, margin: 53, competition: "Média", difficulty: "Fácil", trend: "stable", tags: ["easy-shipping", "trending"], avgPrice: "R$39–R$69", category: "Eletrônicos", analysis: "Alta busca por periféricos com iluminação RGB. Diferencial visual vende muito no feed.", image: "/produtos/p08.png" },
  { id: 6, name: "Shorts Esportivo Dry Fit Masculino", score: 74, margin: 60, competition: "Alta", difficulty: "Fácil", trend: "stable", tags: ["easy", "easy-shipping"], avgPrice: "R$25–R$45", category: "Fitness", analysis: "Evergreen com alta rotatividade, vende bem o ano todo. Ticket baixo mas volume alto compensa.", image: "/produtos/p06.png" },
  { id: 7, name: "Afiador de Facas 3 Estágios", score: 72, margin: 65, competition: "Baixa", difficulty: "Fácil", trend: "up", tags: ["high-margin", "easy-shipping", "easy"], avgPrice: "R$29–R$49", category: "Casa e Cozinha", analysis: "Nicho pouco explorado com margem altíssima. Produto prático que resolve dor real na cozinha.", image: "/produtos/p33.png" },
  { id: 8, name: "Casaco Pet com Capuz", score: 77, margin: 58, competition: "Baixa", difficulty: "Fácil", trend: "up", tags: ["viral", "high-margin"], avgPrice: "R$35–R$65", category: "Pets", analysis: "Mercado pet em explosão no Brasil. Roupas para animais têm margem excelente e público muito fiel.", image: "/produtos/p38.png" },
];

export default function RadarPage() {
  const [baseProducts, setBaseProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [loadingBase, setLoadingBase] = useState(false);
  const [baseError, setBaseError] = useState(false);

  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<Tag | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [aiProducts, setAiProducts] = useState<Product[] | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [savedMap, setSavedMap] = useState<Map<string, string>>(new Map());
  const [savingNames, setSavingNames] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || "";
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      try {
        const res = await fetch("/api/radar/saved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const map = new Map<string, string>();
        for (const item of data.saved || []) {
          if (item.product?.name) map.set(item.product.name, item.id);
        }
        setSavedMap(map);
      } catch {
        // ignore
      }
    })();
  }, [getToken]);

  const toggleSave = useCallback(async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = await getToken();
    if (!token) return;

    setSavingNames((prev) => new Set(prev).add(product.name));
    try {
      const existingId = savedMap.get(product.name);
      if (existingId) {
        await fetch("/api/radar/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: existingId }),
        });
        setSavedMap((prev) => {
          const next = new Map(prev);
          next.delete(product.name);
          return next;
        });
      } else {
        const res = await fetch("/api/radar/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product }),
        });
        if (res.ok) {
          const data = await res.json();
          setSavedMap((prev) => new Map(prev).set(product.name, data.saved.id));
        }
      }
    } finally {
      setSavingNames((prev) => {
        const next = new Set(prev);
        next.delete(product.name);
        return next;
      });
    }
  }, [getToken, savedMap]);

  const fetchBaseProducts = useCallback(async (force = false) => {
    if (force) setLoadingBase(true);
    setBaseError(false);

    if (!force) {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { products, timestamp } = JSON.parse(cached);
          const hasImages = Array.isArray(products) && products.some((p: Product) => !!p.image);
          if (hasImages && Date.now() - timestamp < CACHE_TTL) {
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
      if (force) setBaseError(true);
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
                      isSaved={savedMap.has(product.name)}
                      onToggleSave={(e) => toggleSave(product, e)}
                      saving={savingNames.has(product.name)}
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
              className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image && (
                <div className="h-48 bg-surface-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
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
                <div className="flex flex-col items-end gap-2">
                  <ScoreRing score={selected.score} />
                  <button
                    onClick={(e) => toggleSave(selected, e)}
                    disabled={savingNames.has(selected.name)}
                    className="flex items-center gap-1 text-xs font-medium text-dark-muted hover:text-brand transition-colors disabled:opacity-50"
                  >
                    {savingNames.has(selected.name) ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Bookmark className={`w-3.5 h-3.5 ${savedMap.has(selected.name) ? "fill-brand text-brand" : ""}`} />
                    )}
                    {savedMap.has(selected.name) ? "Salvo" : "Salvar"}
                  </button>
                </div>
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
