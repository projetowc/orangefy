"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp, Truck, Package, Bookmark, Loader2 } from "lucide-react";
import Header from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase-browser";
import { Product, tagLabels, ScoreRing, CardSkeleton, ProductCard } from "@/components/dashboard/ProductCard";

interface SavedItem {
  id: string;
  product: Product;
  criado_em: string;
}

export default function ProdutosSalvosPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<SavedItem | null>(null);
  const supabase = createClient();

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || "";
  }, [supabase]);

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const token = await getToken();
      if (!token) throw new Error("Sem sessão");
      const res = await fetch("/api/radar/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setItems(data.saved || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  const removeSaved = useCallback(async (item: SavedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = await getToken();
    if (!token) return;

    setRemovingIds((prev) => new Set(prev).add(item.id));
    try {
      await fetch("/api/radar/saved", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: item.id }),
      });
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setSelected((prev) => (prev?.id === item.id ? null : prev));
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  }, [getToken]);

  return (
    <>
      <Header title="Produtos Salvos" subtitle="Produtos que você salvou no Radar de Produtos para analisar depois" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-5">
        {loading && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {error && !loading && (
          <div className="card border-red-100 bg-red-50 text-center py-8">
            <p className="text-sm text-danger font-medium">Erro ao carregar produtos salvos. Tente novamente.</p>
            <button onClick={fetchSaved} className="text-xs text-brand mt-2 hover:underline">
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="card text-center py-14">
            <Bookmark className="w-10 h-10 text-surface-200 mx-auto mb-3" />
            <p className="text-dark font-medium mb-1">Nenhum produto salvo ainda</p>
            <p className="text-dark-muted text-sm">
              Vá até o Radar de Produtos e clique no ícone de salvar para guardar produtos aqui.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <ProductCard
                key={item.id}
                product={item.product}
                index={i}
                onClick={() => setSelected(item)}
                isSaved={true}
                onToggleSave={(e) => removeSaved(item, e)}
                saving={removingIds.has(item.id)}
              />
            ))}
          </div>
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
              {selected.product.image && (
                <div className="h-48 bg-surface-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.product.image} alt={selected.product.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-dark-muted" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark text-sm">{selected.product.name}</h3>
                      <span className="text-xs text-dark-muted">{selected.product.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ScoreRing score={selected.product.score} />
                    <button
                      onClick={(e) => removeSaved(selected, e)}
                      disabled={removingIds.has(selected.id)}
                      className="flex items-center gap-1 text-xs font-medium text-dark-muted hover:text-brand transition-colors disabled:opacity-50"
                    >
                      {removingIds.has(selected.id) ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5 fill-brand text-brand" />
                      )}
                      Remover
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selected.product.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-surface-100 text-dark-muted rounded-md font-medium">
                      {tagLabels[tag]}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Margem estimada", value: `${selected.product.margin}%`, icon: BarChart2 },
                    { label: "Concorrência", value: selected.product.competition, icon: TrendingUp },
                    { label: "Preço médio", value: selected.product.avgPrice, icon: Package },
                    { label: "Logística", value: selected.product.difficulty, icon: Truck },
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
                  <p className="text-sm text-dark leading-relaxed">{selected.product.analysis}</p>
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
