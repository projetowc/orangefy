"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Sparkles, RefreshCw, Play, Image as ImageIcon, LayoutGrid,
  Facebook, Instagram, Clock, Users, Eye, X, Lightbulb,
  TrendingUp, Flame, Minus, Target, Globe, Copy, Check, Package
} from "lucide-react";
import Header from "@/components/dashboard/Header";

interface CompetitorAd {
  id: number;
  anunciante: string;
  avatarLetra: string;
  avatarCor: string;
  plataforma: "facebook" | "instagram" | "ambos";
  formato: "imagem" | "video" | "carrossel";
  titulo: string;
  texto: string;
  cta: string;
  diasAtivo: number;
  regioes: string;
  publicoEstimado: string;
  impressoesEstimadas: string;
  objetivo: "conversao" | "trafego" | "awareness";
  performance: "viral" | "alta" | "media";
  produtoTermo?: string;
  image?: string;
}

const formatConfig = {
  imagem: { label: "Imagem", icon: ImageIcon, color: "bg-blue-100 text-blue-700" },
  video: { label: "Vídeo", icon: Play, color: "bg-purple-100 text-purple-700" },
  carrossel: { label: "Carrossel", icon: LayoutGrid, color: "bg-orange-100 text-orange-700" },
};

const performanceConfig = {
  viral: { label: "Viral", icon: Flame, color: "text-red-500", bg: "bg-red-50 border-red-200" },
  alta: { label: "Alta", icon: TrendingUp, color: "text-success", bg: "bg-green-50 border-green-200" },
  media: { label: "Média", icon: Minus, color: "text-dark-muted", bg: "bg-surface-50 border-surface-200" },
};

const objetivoConfig = {
  conversao: { label: "Conversão", color: "bg-brand/10 text-brand" },
  trafego: { label: "Tráfego", color: "bg-blue-50 text-blue-700" },
  awareness: { label: "Awareness", color: "bg-purple-50 text-purple-700" },
};

function PlataformaIcon({ plataforma }: { plataforma: CompetitorAd["plataforma"] }) {
  if (plataforma === "facebook") return <Facebook className="w-3.5 h-3.5 text-blue-600" />;
  if (plataforma === "instagram") return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F58529" /><stop offset=".5" stopColor="#DD2A7B" /><stop offset="1" stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="#DD2A7B" />
    </svg>
  );
  return (
    <span className="flex items-center gap-0.5">
      <Facebook className="w-3 h-3 text-blue-600" />
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="ig-grad2" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F58529" /><stop offset=".5" stopColor="#DD2A7B" /><stop offset="1" stopColor="#8134AF" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="url(#ig-grad2)" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad2)" strokeWidth="2.5" />
      </svg>
    </span>
  );
}

function AdImage({ ad }: { ad: CompetitorAd }) {
  const [err, setErr] = useState(false);
  const fmt = formatConfig[ad.formato];
  if (ad.image && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={ad.image}
        alt={ad.titulo}
        className="w-full h-full object-cover"
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      <fmt.icon className="w-7 h-7 text-surface-300" />
      <span className="text-xs text-surface-300 font-medium">{fmt.label}</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors text-dark-muted hover:text-dark">
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function AdModal({ ad, onClose }: { ad: CompetitorAd; onClose: () => void }) {
  const perf = performanceConfig[ad.performance];
  const fmt = formatConfig[ad.formato];
  const obj = objetivoConfig[ad.objetivo];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-surface-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
              style={{ backgroundColor: ad.avatarCor }}
            >
              {ad.avatarLetra}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-dark text-sm truncate">{ad.anunciante}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <PlataformaIcon plataforma={ad.plataforma} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${fmt.color}`}>{fmt.label}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-dark-muted hover:text-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Creative */}
          <div className="rounded-2xl overflow-hidden bg-surface-50 border border-surface-200 h-52">
            <AdImage ad={ad} />
          </div>

          {/* Ad copy */}
          <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-black text-dark text-base leading-snug">{ad.titulo}</h4>
              <CopyButton text={ad.titulo} />
            </div>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-dark-muted leading-relaxed">{ad.texto}</p>
              <CopyButton text={ad.texto} />
            </div>
            <button className="mt-1 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg">
              {ad.cta}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Clock, label: "Ativo há", value: `${ad.diasAtivo} dias` },
              { icon: Globe, label: "Regiões", value: ad.regioes },
              { icon: Users, label: "Público est.", value: ad.publicoEstimado },
              { icon: Eye, label: "Impressões est.", value: ad.impressoesEstimadas },
            ].map((s) => (
              <div key={s.label} className="bg-surface-50 border border-surface-200 rounded-xl p-3">
                <s.icon className="w-3.5 h-3.5 text-brand mb-1" />
                <div className="font-bold text-dark text-sm">{s.value}</div>
                <div className="text-xs text-dark-muted">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${perf.bg} ${perf.color}`}>
              <perf.icon className="w-3 h-3" />
              {perf.label}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${obj.color}`}>
              {obj.label}
            </span>
          </div>

          {/* Insight */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">O que aprender com esse anúncio</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">
              Este anúncio está ativo há <strong>{ad.diasAtivo} dias</strong>, o que indica que está
              {ad.diasAtivo > 30 ? " convertendo bem — anúncios que não lucram são desativados rapidamente." : " sendo testado recentemente."}
              {" "}O formato <strong>{fmt.label}</strong> com objetivo de <strong>{objetivoConfig[ad.objetivo].label}</strong> pode ser uma estratégia rentável para replicar no seu nicho.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdCard({ ad, index, onClick }: { ad: CompetitorAd; index: number; onClick: () => void }) {
  const perf = performanceConfig[ad.performance];
  const fmt = formatConfig[ad.formato];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card cursor-pointer hover:shadow-card-hover hover:border-brand/20 transition-all duration-200 border border-surface-200 flex flex-col gap-3"
      onClick={onClick}
    >
      {/* Advertiser header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs flex-shrink-0"
            style={{ backgroundColor: ad.avatarCor }}
          >
            {ad.avatarLetra}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-dark text-xs truncate">{ad.anunciante}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <PlataformaIcon plataforma={ad.plataforma} />
              <span className="text-[10px] text-dark-muted capitalize">{ad.plataforma}</span>
            </div>
          </div>
        </div>
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border flex-shrink-0 ${perf.bg} ${perf.color}`}>
          <perf.icon className="w-2.5 h-2.5" />
          {perf.label}
        </span>
      </div>

      {/* Creative image */}
      <div className="rounded-xl overflow-hidden bg-surface-50 border border-surface-100 h-40 flex-shrink-0">
        <AdImage ad={ad} />
      </div>

      {/* Ad copy */}
      <div>
        <h3 className="font-bold text-dark text-sm leading-snug line-clamp-2">{ad.titulo}</h3>
        <p className="text-xs text-dark-muted mt-1 leading-relaxed line-clamp-2">{ad.texto}</p>
      </div>

      {/* CTA */}
      <div>
        <span className="inline-block bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
          {ad.cta}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-100 text-xs text-dark-muted">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Ativo há {ad.diasAtivo}d
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${fmt.color}`}>{fmt.label}</span>
          <Target className="w-3 h-3 text-brand" />
          <span className="text-[10px]">{ad.publicoEstimado}</span>
        </div>
      </div>
    </motion.div>
  );
}

function AdSkeleton() {
  return (
    <div className="card animate-pulse space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-surface-100" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-surface-100 rounded w-28" />
          <div className="h-2.5 bg-surface-100 rounded w-16" />
        </div>
      </div>
      <div className="h-40 bg-surface-100 rounded-xl" />
      <div className="space-y-2">
        <div className="h-3.5 bg-surface-100 rounded w-full" />
        <div className="h-3 bg-surface-100 rounded w-4/5" />
      </div>
      <div className="h-7 bg-surface-100 rounded-lg w-24" />
    </div>
  );
}

const PLATFORM_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
] as const;

const PERFORMANCE_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "viral", label: "Viral" },
  { id: "alta", label: "Alta performance" },
  { id: "media", label: "Média" },
] as const;

export default function AdsConcorrentesPage() {
  const [ads, setAds] = useState<CompetitorAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CompetitorAd | null>(null);
  const [platformFilter, setPlatformFilter] = useState<typeof PLATFORM_FILTERS[number]["id"]>("todos");
  const [perfFilter, setPerfFilter] = useState<typeof PERFORMANCE_FILTERS[number]["id"]>("todos");

  const fetchAds = async (q: string) => {
    if (q.trim().length < 2) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/ads-concorrentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.trim() }),
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
  };

  useEffect(() => { fetchAds("moda e beleza"); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = ads
    .filter((a) => platformFilter === "todos" || a.plataforma === platformFilter || a.plataforma === "ambos")
    .filter((a) => perfFilter === "todos" || a.performance === perfFilter);

  return (
    <>
      <Header
        title="Ads de Concorrentes"
        subtitle="Descubra os anúncios que seus concorrentes estão rodando no Meta Ads agora"
      />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Search */}
        <div className="card space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input
                className="input-field pl-10"
                placeholder="Pesquise um nicho: pets, beleza, moda, fitness, casa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAds(search)}
              />
            </div>
            <button
              onClick={() => fetchAds(search)}
              disabled={loading || search.trim().length < 2}
              className="btn-brand flex items-center gap-2 px-5 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Buscando..." : "Buscar Ads"}
            </button>
          </div>

          {/* Filters */}
          {ads.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-dark-muted">Plataforma:</span>
                {PLATFORM_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPlatformFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      platformFilter === f.id
                        ? "bg-brand text-white"
                        : "bg-surface-50 border border-surface-200 text-dark-muted hover:text-dark"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-dark-muted">Performance:</span>
                {PERFORMANCE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPerfFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      perfFilter === f.id
                        ? "bg-brand text-white"
                        : "bg-surface-50 border border-surface-200 text-dark-muted hover:text-dark"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty state */}
        {!loading && !error && ads.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card py-14 flex flex-col items-center gap-3 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-50 border border-surface-200 flex items-center justify-center">
              <Package className="w-6 h-6 text-surface-300" />
            </div>
            <h3 className="font-bold text-dark">Pesquise um nicho para começar</h3>
            <p className="text-sm text-dark-muted max-w-xs">
              Digite um nicho como <strong>pets</strong>, <strong>beleza</strong> ou <strong>fitness</strong> e veja os anúncios dos seus concorrentes no Meta Ads.
            </p>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <div className="card flex items-center justify-center gap-3 py-5">
              <div className="w-5 h-5 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
              <span className="text-dark-muted font-medium text-sm">Analisando anúncios do Meta Ads com IA...</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <AdSkeleton key={i} />)}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="card border-red-100 bg-red-50 text-center py-8">
            <p className="text-sm text-danger font-medium mb-2">Erro ao buscar anúncios. Tente novamente.</p>
            <button onClick={() => fetchAds(search)} className="text-xs text-brand hover:underline">Tentar novamente</button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-2 text-sm text-dark-muted">
              <Sparkles className="w-4 h-4 text-brand" />
              <span>
                <strong className="text-dark">{filtered.length}</strong> anúncios encontrados para{" "}
                <strong className="text-dark">&ldquo;{search}&rdquo;</strong> no Meta Ads
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((ad, i) => (
                <AdCard key={ad.id} ad={ad} index={i} onClick={() => setSelected(ad)} />
              ))}
            </div>
          </>
        )}

        {/* No results after filter */}
        {!loading && !error && ads.length > 0 && filtered.length === 0 && (
          <div className="card text-center py-8 text-dark-muted text-sm">
            Nenhum anúncio corresponde aos filtros selecionados.
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <AdModal ad={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
