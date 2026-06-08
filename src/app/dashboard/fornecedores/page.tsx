"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Truck, ExternalLink, Package, Globe, ShoppingBag, Sparkles, AlertCircle, CheckCircle2, X, ChevronRight } from "lucide-react";
import Header from "@/components/dashboard/Header";

interface Fornecedor {
  nome: string;
  site: string;
  tipo: "Dropshipping" | "Atacado Nacional" | "Importado";
  pedidoMinimo: string;
  prazoEntrega: string;
  aceitaCPF: boolean;
  destaque: string;
  nicho: string;
}

interface SearchResult {
  nicho: string;
  insight: string;
  fornecedores: Fornecedor[];
}

const QUICK_SEARCHES = [
  "Roupas femininas",
  "Eletrônicos e gadgets",
  "Produtos de beleza",
  "Acessórios pet",
  "Casa e organização",
  "Suplementos fitness",
];

const tipoConfig = {
  "Dropshipping": {
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Globe,
    iconColor: "text-purple-500",
  },
  "Atacado Nacional": {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: ShoppingBag,
    iconColor: "text-green-500",
  },
  "Importado": {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Package,
    iconColor: "text-blue-500",
  },
};

function SupplierCard({ f, index }: { f: Fornecedor; index: number }) {
  const config = tipoConfig[f.tipo] ?? tipoConfig["Importado"];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="card border border-surface-200 hover:shadow-card-hover hover:border-dark/10 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-surface-50 border border-surface-200 flex items-center justify-center flex-shrink-0">
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-dark text-sm leading-snug">{f.nome}</h3>
            <span className="text-xs text-dark-muted">{f.nicho}</span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${config.color}`}>
          {f.tipo}
        </span>
      </div>

      <p className="text-xs text-dark-muted leading-relaxed mb-4 bg-surface-50 rounded-lg px-3 py-2">
        {f.destaque}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-surface-50 rounded-lg p-2.5">
          <div className="text-xs text-dark-muted mb-0.5">Pedido mínimo</div>
          <div className="text-xs font-semibold text-dark">{f.pedidoMinimo}</div>
        </div>
        <div className="bg-surface-50 rounded-lg p-2.5">
          <div className="text-xs text-dark-muted mb-0.5">Prazo de entrega</div>
          <div className="text-xs font-semibold text-dark">{f.prazoEntrega}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1 text-xs font-medium ${f.aceitaCPF ? "text-success" : "text-danger"}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          {f.aceitaCPF ? "Aceita CPF" : "Requer CNPJ"}
        </span>
        <a
          href={`https://${f.site}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-brand text-xs font-semibold hover:underline"
        >
          Acessar site <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-100 flex-shrink-0" />
          <div className="space-y-1.5">
            <div className="h-4 bg-surface-100 rounded w-32" />
            <div className="h-3 bg-surface-100 rounded w-20" />
          </div>
        </div>
        <div className="h-6 bg-surface-100 rounded-full w-24" />
      </div>
      <div className="h-8 bg-surface-100 rounded-lg mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-12 bg-surface-100 rounded-lg" />
        <div className="h-12 bg-surface-100 rounded-lg" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 bg-surface-100 rounded w-20" />
        <div className="h-3 bg-surface-100 rounded w-24" />
      </div>
    </div>
  );
}

export default function FornecedoresPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(q: string) {
    const trimmed = q.trim();
    if (trimmed.length < 2 || loading) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/fornecedores/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao buscar fornecedores.");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { search("eletrônicos e casa"); }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") search(query);
  }

  const grouped = result?.fornecedores.reduce((acc, f) => {
    if (!acc[f.tipo]) acc[f.tipo] = [];
    acc[f.tipo].push(f);
    return acc;
  }, {} as Record<string, Fornecedor[]>);

  const tipoOrder = ["Dropshipping", "Atacado Nacional", "Importado"];

  return (
    <>
      <Header title="Radar de Fornecedores" subtitle="Encontre os melhores fornecedores para o seu nicho" />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Search */}
        <div className="card">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input
                className="input-field pl-10 pr-10"
                placeholder="Ex: roupas femininas, eletrônicos, beleza, pets..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setResult(null); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => search(query)}
              disabled={loading || query.trim().length < 2}
              className="btn-brand px-5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Truck className="w-4 h-4" />}
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>

          {/* Quick searches */}
          {!result && !loading && (
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  onClick={() => { setQuery(q); search(q); }}
                  className="text-xs px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-dark-muted hover:border-brand/40 hover:text-brand transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-5">
            <div className="h-16 bg-surface-50 border border-surface-200 rounded-2xl animate-pulse" />
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="card border-red-100 bg-red-50 flex items-center gap-3 py-5">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
            <p className="text-sm text-danger font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Insight */}
              <div className="card bg-brand/5 border-brand/20">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-brand" />
                  </div>
                  <div>
                    <div className="text-xs text-brand font-semibold uppercase tracking-wide mb-1">
                      Fornecedores para: {result.nicho}
                    </div>
                    <p className="text-sm text-dark leading-relaxed">{result.insight}</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3">
                {tipoOrder.map((tipo) => {
                  const config = tipoConfig[tipo as keyof typeof tipoConfig];
                  return (
                    <span key={tipo} className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.color}`}>
                      <config.icon className="w-3 h-3" />
                      {tipo}
                    </span>
                  );
                })}
              </div>

              {/* Cards grouped by type */}
              {tipoOrder.map((tipo) => {
                const items = grouped?.[tipo];
                if (!items?.length) return null;
                return (
                  <div key={tipo}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-bold text-dark">{tipo}</h3>
                      <span className="text-xs text-dark-muted bg-surface-100 px-2 py-0.5 rounded-full">{items.length} encontrados</span>
                    </div>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {items.map((f, i) => (
                        <SupplierCard key={i} f={f} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* CTA */}
              <div className="card bg-surface-50 border-surface-200 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-dark mb-0.5">Encontrou um fornecedor?</p>
                  <p className="text-xs text-dark-muted">Calcule a margem real antes de comprar.</p>
                </div>
                <a href="/dashboard/calculadora" className="btn-brand text-xs px-4 py-2 flex items-center gap-1.5 whitespace-nowrap">
                  Calculadora <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="card text-center py-14 border-dashed">
            <Truck className="w-12 h-12 text-surface-200 mx-auto mb-4" />
            <h3 className="font-bold text-dark mb-1">Busque fornecedores para seu nicho</h3>
            <p className="text-sm text-dark-muted max-w-xs mx-auto">
              Digite um produto ou nicho acima e a IA encontra os melhores fornecedores: dropshipping, atacado nacional e importado.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
