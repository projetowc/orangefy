"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Minus, Tag, Lightbulb, Target, Clock, RotateCcw, AlertCircle, ShoppingCart } from "lucide-react";
import Header from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase-browser";

interface ProdutoConcorrente {
  nome: string;
  precoMedio: number;
  volumeVendas: "Alto" | "Médio" | "Baixo";
  diferencial: string;
}

interface SpyResult {
  produto: string;
  demanda: "Alta" | "Média" | "Baixa";
  concorrencia: "Alta" | "Média" | "Baixa";
  faixaPreco: { min: number; max: number };
  scoreOportunidade: number;
  nichoCorrelato: string;
  palavrasChave: string[];
  insight: string;
  produtosConcorrentes?: ProdutoConcorrente[];
}

interface HistoricoItem {
  id: string;
  query: string;
  resultado: SpyResult;
  criado_em: string;
}

const levelColors = {
  Alta: { demand: "bg-green-100 text-green-700 border-green-200", competition: "bg-red-100 text-red-700 border-red-200" },
  Média: { demand: "bg-yellow-100 text-yellow-700 border-yellow-200", competition: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  Baixa: { demand: "bg-red-100 text-red-700 border-red-200", competition: "bg-green-100 text-green-700 border-green-200" },
};

function ScoreGauge({ score }: { score: number }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const color = score >= 70 ? "#10B981" : score >= 45 ? "#EE4D2D" : "#EF4444";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="#F0F0F0" strokeWidth="7" />
          <circle
            cx="44" cy="44" r={radius} fill="none" stroke={color} strokeWidth="7"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ - (score / 100) * circ}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{score}</span>
          <span className="text-xs text-dark-muted">/100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-dark-muted">Score de Oportunidade</span>
    </div>
  );
}

function LevelBadge({ label, value, type }: { label: string; value: "Alta" | "Média" | "Baixa"; type: "demand" | "competition" }) {
  const colors = levelColors[value][type];
  const Icon = value === "Alta" ? TrendingUp : value === "Baixa" ? TrendingDown : Minus;
  return (
    <div className={`flex flex-col items-center gap-1.5 border rounded-xl p-3 flex-1 ${colors}`}>
      <Icon className="w-5 h-5" />
      <span className="text-base font-bold">{value}</span>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </div>
  );
}

export default function SpyPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SpyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const supabase = createClient();

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || "";
  }

  const fetchHistorico = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch("/api/spy", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistorico(data.historico || []);
      }
    } catch {
      // silently ignore history errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchHistorico(); }, [fetchHistorico]);

  async function analyze(q: string) {
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/spy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");
      setResult(data);
      fetchHistorico();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao analisar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") analyze(query);
  }

  return (
    <>
      <Header title="Spy de Concorrentes" subtitle="Analise demanda, concorrência e oportunidades de nicho com IA" />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Search */}
        <div className="card">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input
                className="input-field pl-10"
                placeholder="Ex: capinha de celular, fone bluetooth, organizador..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
            </div>
            <button
              onClick={() => analyze(query)}
              disabled={loading || query.trim().length < 2}
              className="btn-brand px-5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Analisar</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card flex items-center justify-center gap-3 py-12"
            >
              <div className="w-5 h-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
              <span className="text-dark-muted font-medium">Analisando mercado com IA...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-red-100 bg-red-50 flex items-center gap-3 py-5"
          >
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
            <p className="text-sm text-danger font-medium">{error}</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Score + levels */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-brand" />
                  <h2 className="font-bold text-dark text-sm">{result.produto}</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ScoreGauge score={result.scoreOportunidade} />
                  <div className="flex gap-3 flex-1 w-full sm:w-auto">
                    <LevelBadge label="Demanda" value={result.demanda} type="demand" />
                    <LevelBadge label="Concorrência" value={result.concorrencia} type="competition" />
                  </div>
                </div>
              </div>

              {/* Price range */}
              <div className="card flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-black text-sm">R$</span>
                </div>
                <div>
                  <div className="text-xs text-dark-muted mb-0.5">Faixa de Preço Praticada</div>
                  <div className="font-bold text-dark text-lg">
                    R${result.faixaPreco.min} – R${result.faixaPreco.max}
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-brand" />
                  <span className="text-sm font-semibold text-dark">Palavras-chave para o título</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.palavrasChave.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-xs font-medium text-dark-muted hover:border-brand hover:text-brand transition-colors cursor-default"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nicho correlato */}
              <div className="card bg-brand/5 border-brand/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <div className="text-xs text-brand font-semibold uppercase tracking-wide mb-1">Nicho Correlato com Menos Concorrência</div>
                    <p className="text-sm font-semibold text-dark">&ldquo;{result.nichoCorrelato}&rdquo;</p>
                  </div>
                </div>
              </div>

              {/* Insight */}
              <div className="card bg-surface-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-xs text-dark-muted font-semibold uppercase tracking-wide mb-1">Insight Estratégico</div>
                    <p className="text-sm text-dark leading-relaxed">{result.insight}</p>
                  </div>
                </div>
              </div>

              {/* Produtos dos concorrentes */}
              {result.produtosConcorrentes && result.produtosConcorrentes.length > 0 && (
                <div className="card">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart className="w-4 h-4 text-brand" />
                    <span className="text-sm font-semibold text-dark">O que os concorrentes mais vendem</span>
                  </div>
                  <div className="space-y-3">
                    {result.produtosConcorrentes.map((p, i) => {
                      const volumeColor =
                        p.volumeVendas === "Alto"
                          ? "bg-green-100 text-green-700"
                          : p.volumeVendas === "Médio"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-surface-100 text-dark-muted";
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-surface-100"
                        >
                          <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-black text-brand">#{i + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-semibold text-dark leading-snug">{p.nome}</p>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${volumeColor}`}>
                                {p.volumeVendas}
                              </span>
                            </div>
                            <p className="text-xs text-dark-muted leading-relaxed">{p.diferencial}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-bold text-dark">R${p.precoMedio}</div>
                            <div className="text-xs text-dark-muted">preço médio</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Histórico */}
        {historico.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-dark-muted" />
              <span className="text-sm font-semibold text-dark">Últimas Análises</span>
            </div>
            <div className="space-y-2">
              {historico.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100 hover:border-surface-200 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-dark truncate">{item.query}</p>
                    <p className="text-xs text-dark-muted">
                      Score {item.resultado.scoreOportunidade} · {item.resultado.demanda} demanda
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuery(item.query);
                      analyze(item.query);
                    }}
                    className="ml-3 p-2 text-dark-muted hover:text-brand hover:bg-brand/5 rounded-lg transition-colors flex-shrink-0"
                    title="Reanalisar"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
