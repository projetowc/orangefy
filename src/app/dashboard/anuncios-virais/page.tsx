"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Flame, TrendingUp, Minus, Play, Image as ImageIcon,
  LayoutGrid, X, Lightbulb, Target, Clock, Users, Sparkles,
  ChevronRight, Copy, Check
} from "lucide-react";
import Header from "@/components/dashboard/Header";

interface Ad {
  id: number;
  platform: "meta" | "tiktok";
  format: "video" | "imagem" | "carrossel";
  hook: string;
  headline: string;
  copy: string;
  cta: string;
  audiencia: string;
  performance: "viral" | "alta" | "media";
  diasRodando: number;
  objetivo: "conversao" | "trafego" | "awareness";
  dica: string;
  image?: string;
}

type PlatformFilter = "todos" | "meta" | "tiktok";
type FormatFilter = "todos" | "video" | "imagem" | "carrossel";

const performanceConfig = {
  viral: { label: "Viral", icon: Flame, color: "text-red-500", bg: "bg-red-50 border-red-200" },
  alta: { label: "Alta", icon: TrendingUp, color: "text-success", bg: "bg-green-50 border-green-200" },
  media: { label: "Média", icon: Minus, color: "text-dark-muted", bg: "bg-surface-50 border-surface-200" },
};

const formatConfig = {
  video: { label: "Vídeo", icon: Play, color: "bg-purple-100 text-purple-700" },
  imagem: { label: "Imagem", icon: ImageIcon, color: "bg-blue-100 text-blue-700" },
  carrossel: { label: "Carrossel", icon: LayoutGrid, color: "bg-orange-100 text-orange-700" },
};

const objetivoLabels = {
  conversao: "Conversão",
  trafego: "Tráfego",
  awareness: "Awareness",
};

function MetaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.25 8.25 0 004.83 1.56V7.05a4.85 4.85 0 01-1.06-.36z"/>
    </svg>
  );
}

function AdCardSkeleton() {
  return (
    <div className="card animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-surface-100 rounded-full" />
          <div className="h-6 w-20 bg-surface-100 rounded-full" />
        </div>
        <div className="h-6 w-14 bg-surface-100 rounded-full" />
      </div>
      <div className="h-5 bg-surface-100 rounded w-full" />
      <div className="h-4 bg-surface-100 rounded w-4/5" />
      <div className="h-16 bg-surface-100 rounded" />
      <div className="h-px bg-surface-100" />
      <div className="flex items-center justify-between">
        <div className="h-3 bg-surface-100 rounded w-24" />
        <div className="h-3 bg-surface-100 rounded w-16" />
      </div>
    </div>
  );
}

function AdCard({ ad, index, onClick }: { ad: Ad; index: number; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!ad.image && !imgError;
  const perf = performanceConfig[ad.performance];
  const fmt = formatConfig[ad.format];
  const PerfIcon = perf.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`card cursor-pointer hover:shadow-card-hover transition-all duration-200 border border-surface-200 hover:border-brand/30 flex flex-col gap-3${showImage ? " overflow-hidden" : ""}`}
    >
      {showImage && (
        <div className="-mx-6 -mt-6 h-40 bg-surface-50 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ad.image}
            alt={ad.headline}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <span className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${perf.bg} ${perf.color} backdrop-blur-sm bg-opacity-90`}>
            <PerfIcon className="w-3 h-3" />
            {perf.label}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            ad.platform === "meta"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-900 text-white border-gray-900"
          }`}>
            <span className={ad.platform === "tiktok" ? "text-white" : ""}>
              {ad.platform === "meta" ? <MetaIcon /> : <TikTokIcon />}
            </span>
            {ad.platform === "meta" ? "Meta" : "TikTok"}
          </span>
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${fmt.color}`}>
            <fmt.icon className="w-3 h-3" />
            {fmt.label}
          </span>
        </div>
        {!showImage && (
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${perf.bg} ${perf.color}`}>
            <PerfIcon className="w-3 h-3" />
            {perf.label}
          </span>
        )}
      </div>

      {/* Hook */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-brand/20 rounded-xl p-3">
        <div className="text-xs text-brand font-semibold mb-1 uppercase tracking-wide">Hook de abertura</div>
        <p className="text-sm font-bold text-dark leading-snug">&ldquo;{ad.hook}&rdquo;</p>
      </div>

      {/* Headline & Copy */}
      <div>
        <p className="text-sm font-semibold text-dark mb-1">{ad.headline}</p>
        <p className="text-xs text-dark-muted leading-relaxed line-clamp-2">{ad.copy}</p>
      </div>

      <div className="h-px bg-surface-100" />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-dark-muted">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {ad.diasRodando}d
          </span>
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {objetivoLabels[ad.objetivo]}
          </span>
        </div>
        <button className="text-brand text-xs font-semibold flex items-center gap-1">
          Ver anúncio <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

function AdModal({ ad, onClose }: { ad: Ad; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const perf = performanceConfig[ad.performance];
  const fmt = formatConfig[ad.format];
  const PerfIcon = perf.icon;

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

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
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {ad.image && (
          <div className="h-52 bg-surface-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ad.image} alt={ad.headline} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Modal header */}
        <div className="sticky top-0 bg-white border-b border-surface-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              ad.platform === "meta"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-gray-900 text-white border-gray-900"
            }`}>
              {ad.platform === "meta" ? <MetaIcon /> : <TikTokIcon />}
              {ad.platform === "meta" ? "Meta" : "TikTok"}
            </span>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${fmt.color}`}>
              <fmt.icon className="w-3 h-3" />
              {fmt.label}
            </span>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${perf.bg} ${perf.color}`}>
              <PerfIcon className="w-3 h-3" />
              {perf.label}
            </span>
          </div>
          <button onClick={onClose} className="text-dark-muted hover:text-dark transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Hook */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-brand/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-brand font-bold uppercase tracking-wide">Hook de abertura</span>
              <button
                onClick={() => copyText(ad.hook, "hook")}
                className="text-dark-muted hover:text-brand transition-colors"
              >
                {copied === "hook" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-base font-bold text-dark leading-snug">&ldquo;{ad.hook}&rdquo;</p>
          </div>

          {/* Headline */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Título / Headline</span>
              <button onClick={() => copyText(ad.headline, "headline")} className="text-dark-muted hover:text-brand transition-colors">
                {copied === "headline" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm font-semibold text-dark">{ad.headline}</p>
          </div>

          {/* Copy */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Texto do anúncio</span>
              <button onClick={() => copyText(ad.copy, "copy")} className="text-dark-muted hover:text-brand transition-colors">
                {copied === "copy" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-dark leading-relaxed">{ad.copy}</p>
          </div>

          {/* CTA */}
          <div>
            <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide block mb-2">Botão de CTA</span>
            <span className="inline-flex items-center gap-2 bg-brand text-white text-sm font-bold px-4 py-2 rounded-xl">
              {ad.cta}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-dark-muted mx-auto mb-1" />
              <div className="text-sm font-bold text-dark">{ad.diasRodando}d</div>
              <div className="text-xs text-dark-muted">Duração</div>
            </div>
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-3 text-center">
              <Target className="w-4 h-4 text-dark-muted mx-auto mb-1" />
              <div className="text-xs font-bold text-dark">{objetivoLabels[ad.objetivo]}</div>
              <div className="text-xs text-dark-muted">Objetivo</div>
            </div>
            <div className={`border rounded-xl p-3 text-center ${perf.bg}`}>
              <PerfIcon className={`w-4 h-4 mx-auto mb-1 ${perf.color}`} />
              <div className={`text-xs font-bold ${perf.color}`}>{perf.label}</div>
              <div className="text-xs text-dark-muted">Performance</div>
            </div>
          </div>

          {/* Audience */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-brand" />
              <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Público-alvo</span>
            </div>
            <p className="text-sm text-dark bg-surface-50 border border-surface-200 rounded-xl p-3">{ad.audiencia}</p>
          </div>

          {/* Dica */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Dica de execução</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">{ad.dica}</p>
          </div>

          <button onClick={onClose} className="btn-brand w-full text-sm py-3">
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AnunciosViraisPage() {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [platform, setPlatform] = useState<PlatformFilter>("todos");
  const [format, setFormat] = useState<FormatFilter>("todos");
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Ad | null>(null);
  const [searched, setSearched] = useState(false);

  async function search() {
    const q = inputValue.trim();
    if (q.length < 2) return;

    setLoading(true);
    setError(false);
    setAds([]);
    setQuery(q);
    setSearched(true);

    try {
      const res = await fetch("/api/anuncios-virais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, platform, format }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.ads && Array.isArray(data.ads)) {
        setAds(data.ads);
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const filteredAds = ads.filter((ad) => {
    if (platform !== "todos" && ad.platform !== platform) return false;
    if (format !== "todos" && ad.format !== format) return false;
    return true;
  });

  return (
    <>
      <Header
        title="Anúncios Virais"
        subtitle="Descubra conceitos de anúncios vencedores com inteligência artificial"
      />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Search */}
        <div className="card space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input
                className="input-field pl-10"
                placeholder="Ex: fone bluetooth, organizador de gaveta, capa de celular..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
              />
            </div>
            <button
              onClick={search}
              disabled={loading || inputValue.trim().length < 2}
              className="btn-brand flex items-center gap-2 px-5 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? "Gerando..." : "Gerar Anúncios"}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-dark-muted font-medium">Plataforma:</span>
              {(["todos", "meta", "tiktok"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    platform === p
                      ? "bg-dark text-white border-dark"
                      : "bg-white text-dark-muted border-surface-200 hover:border-dark-muted"
                  }`}
                >
                  {p === "todos" ? "Todos" : p === "meta" ? "Meta" : "TikTok"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-dark-muted font-medium">Formato:</span>
              {(["todos", "video", "imagem", "carrossel"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    format === f
                      ? "bg-dark text-white border-dark"
                      : "bg-white text-dark-muted border-surface-200 hover:border-dark-muted"
                  }`}
                >
                  {f === "todos" ? "Todos" : f === "video" ? "Vídeo" : f === "imagem" ? "Imagem" : "Carrossel"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {!searched && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card py-12 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-brand" />
            </div>
            <h3 className="font-bold text-dark mb-2">Encontre anúncios vencedores</h3>
            <p className="text-dark-muted text-sm max-w-sm">
              Digite o nome de um produto ou nicho e a IA vai gerar os melhores conceitos de anúncio para Meta e TikTok.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["fone bluetooth", "luminária led", "capa para celular", "organizador de closet", "câmera de segurança"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setInputValue(s); }}
                  className="px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-xs text-dark-muted hover:border-brand hover:text-brand transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="card flex items-center justify-center gap-3 py-5">
                <div className="w-5 h-5 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
                <span className="text-dark-muted font-medium text-sm">
                  Analisando padrões de anúncios vencedores para <strong>&ldquo;{query}&rdquo;</strong>...
                </span>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <AdCardSkeleton key={i} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && !loading && (
          <div className="card border-red-100 bg-red-50 text-center py-8">
            <p className="text-sm text-danger font-medium mb-2">Erro ao gerar anúncios. Tente novamente.</p>
            <button onClick={search} className="text-xs text-brand hover:underline">Tentar novamente</button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && ads.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-dark-muted">
                <Sparkles className="w-4 h-4 text-brand" />
                <span>
                  <strong className="text-dark">{filteredAds.length}</strong> anúncios gerados para{" "}
                  <strong className="text-dark">&ldquo;{query}&rdquo;</strong>
                </span>
              </div>
            </div>

            {filteredAds.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-dark-muted text-sm">Nenhum anúncio corresponde aos filtros selecionados.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAds.map((ad, i) => (
                  <AdCard key={ad.id} ad={ad} index={i} onClick={() => setSelected(ad)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <AdModal ad={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
