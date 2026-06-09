"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Sparkles, Copy, Check, ChevronDown, Tag, FileText,
  Lightbulb, AlertCircle, ShoppingCart, Video, Camera, Music,
  Scissors, Eye, Mic, Clock
} from "lucide-react";
import Header from "@/components/dashboard/Header";

const MARKETPLACES = [
  { id: "shopee",       label: "Shopee",         color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  { id: "mercadolivre", label: "Mercado Livre",  color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  { id: "amazon",       label: "Amazon",          color: "bg-blue-100 text-blue-700 border-blue-200",       dot: "bg-blue-500"   },
  { id: "magalu",       label: "Magazine Luiza", color: "bg-blue-100 text-blue-800 border-blue-300",       dot: "bg-blue-700"   },
  { id: "americanas",   label: "Americanas",      color: "bg-red-100 text-red-700 border-red-200",          dot: "bg-red-500"    },
  { id: "shopify",      label: "Loja Própria",   color: "bg-green-100 text-green-700 border-green-200",    dot: "bg-green-500"  },
];

const CATEGORIES = [
  "Casa e Jardim", "Beleza e Cosméticos", "Eletrônicos", "Moda Feminina",
  "Moda Masculina", "Esporte e Lazer", "Brinquedos", "Acessórios para Celular",
  "Alimentos e Bebidas", "Pet Shop", "Papelaria", "Ferramentas",
  "Bebês e Maternidade", "Saúde e Bem-estar", "Automotivo", "Informática",
];

const VIDEO_PLATFORMS = [
  { id: "tiktok",  label: "TikTok",          color: "bg-black text-white border-black",           dot: "bg-white" },
  { id: "reels",   label: "Instagram Reels", color: "bg-pink-100 text-pink-700 border-pink-300",  dot: "bg-pink-500" },
  { id: "shorts",  label: "YouTube Shorts",  color: "bg-red-100 text-red-700 border-red-200",     dot: "bg-red-500" },
];

const SCENE_TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
  GANCHO:      { color: "text-red-600",    bg: "bg-red-50 border-red-200" },
  PROBLEMA:    { color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  SOLUÇÃO:     { color: "text-brand",      bg: "bg-orange-50 border-brand/30" },
  APRESENTAÇÃO:{ color: "text-brand",      bg: "bg-orange-50 border-brand/30" },
  BENEFÍCIOS:  { color: "text-green-600",  bg: "bg-green-50 border-green-200" },
  "PROVA SOCIAL":{ color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  OFERTA:      { color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
  CTA:         { color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
};

interface Generated {
  titulo: string;
  descricao: string;
  palavrasChave: string[];
  hashtags: string[];
  precoSugerido: string;
  dicaVendedor: string;
  callToAction: string;
}

interface VideoScene {
  numero: number;
  tipo: string;
  tempoInicio: string;
  tempoFim: string;
  visual: string;
  legenda: string;
  narracao: string;
  dica: string;
}

interface VideoScript {
  plataforma: string;
  duracaoTotal: string;
  formato: string;
  musicaSugerida: string;
  gancho: string;
  cenas: VideoScene[];
  dicaGravacao: string;
  dicaEdicao: string;
  cta: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-xs text-dark-muted hover:text-brand transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

function ResultCard({ label, icon: Icon, content }: { label: string; icon: React.ElementType; content: string }) {
  return (
    <div className="card border border-surface-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-brand" />
          <span className="text-sm font-semibold text-dark">{label}</span>
        </div>
        <CopyButton text={content} />
      </div>
      <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function SceneCard({ scene, index }: { scene: VideoScene; index: number }) {
  const config = SCENE_TYPE_CONFIG[scene.tipo] ?? { color: "text-dark-muted", bg: "bg-surface-50 border-surface-200" };
  const sceneText = `CENA ${scene.numero} — ${scene.tipo} (${scene.tempoInicio}–${scene.tempoFim})\nVisual: ${scene.visual}\nLegenda: ${scene.legenda}\nNarração: ${scene.narracao}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-2xl p-4 ${config.bg}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-white border border-current flex items-center justify-center text-xs font-black" style={{ color: "inherit" }}>
            {scene.numero}
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>{scene.tipo}</span>
          <span className="flex items-center gap-1 text-xs text-dark-muted">
            <Clock className="w-3 h-3" />
            {scene.tempoInicio}–{scene.tempoFim}
          </span>
        </div>
        <CopyButton text={sceneText} />
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Eye className="w-3.5 h-3.5 text-dark-muted flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Visual </span>
            <span className="text-sm text-dark">{scene.visual}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs font-black text-dark-muted flex-shrink-0 mt-0.5">T</span>
          <div>
            <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Legenda </span>
            <span className="text-sm font-bold text-dark">&ldquo;{scene.legenda}&rdquo;</span>
          </div>
        </div>
        {scene.narracao && scene.narracao.toLowerCase() !== "sem narração" && (
          <div className="flex items-start gap-2">
            <Mic className="w-3.5 h-3.5 text-dark-muted flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Narração </span>
              <span className="text-sm text-dark italic">&ldquo;{scene.narracao}&rdquo;</span>
            </div>
          </div>
        )}
        {scene.dica && (
          <div className="mt-2 pt-2 border-t border-black/10 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-dark-muted">{scene.dica}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function GeradorPage() {
  const [activeTab, setActiveTab] = useState<"anuncio" | "video">("anuncio");

  // form state (shared)
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [benefits, setBenefits] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [showCat, setShowCat] = useState(false);

  // anuncio state
  const [marketplace, setMarketplace] = useState("shopee");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Generated | null>(null);
  const [error, setError] = useState("");

  // video state
  const [videoPlatform, setVideoPlatform] = useState("tiktok");
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<VideoScript | null>(null);
  const [videoError, setVideoError] = useState("");

  async function generate() {
    if (!product.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/gerador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: product.trim(), category, benefits, marketplace, price, details }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch {
      setError("Erro ao gerar anúncio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function generateVideo() {
    if (!product.trim()) return;
    setVideoLoading(true);
    setVideoError("");
    setVideoResult(null);
    try {
      const res = await fetch("/api/gerador/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: product.trim(), category, benefits, price, details, platform: videoPlatform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideoResult(data);
    } catch {
      setVideoError("Erro ao gerar roteiro. Tente novamente.");
    } finally {
      setVideoLoading(false);
    }
  }

  const selectedMP = MARKETPLACES.find(m => m.id === marketplace)!;
  const selectedVP = VIDEO_PLATFORMS.find(p => p.id === videoPlatform)!;

  const fullAd = result
    ? `TÍTULO:\n${result.titulo}\n\nDESCRIÇÃO:\n${result.descricao}\n\nPALAVRAS-CHAVE:\n${result.palavrasChave.join(", ")}\n\nHASHTAGS:\n${result.hashtags.join(" ")}\n\nCALL TO ACTION:\n${result.callToAction}`
    : "";

  const fullScript = videoResult
    ? `ROTEIRO DE VÍDEO — ${videoResult.plataforma}\nDuração: ${videoResult.duracaoTotal}\nMúsica: ${videoResult.musicaSugerida}\nGancho: ${videoResult.gancho}\n\n${videoResult.cenas.map(c => `CENA ${c.numero} — ${c.tipo} (${c.tempoInicio}–${c.tempoFim})\nVisual: ${c.visual}\nLegenda: "${c.legenda}"\nNarração: "${c.narracao}"`).join("\n\n")}\n\nCTA: ${videoResult.cta}\n\nDica de Gravação: ${videoResult.dicaGravacao}\nDica de Edição: ${videoResult.dicaEdicao}`
    : "";

  return (
    <>
      <Header title="Gerador de Anúncios" subtitle="Crie anúncios e roteiros de vídeo com IA para qualquer plataforma" />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl">
          <button
            onClick={() => setActiveTab("anuncio")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "anuncio" ? "bg-white text-dark shadow-sm" : "text-dark-muted hover:text-dark"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Anúncio de Texto
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "video" ? "bg-white text-dark shadow-sm" : "text-dark-muted hover:text-dark"
            }`}
          >
            <Video className="w-4 h-4" />
            Roteiro de Vídeo
            <span className="text-xs bg-brand text-white px-1.5 py-0.5 rounded-full">novo</span>
          </button>
        </div>

        {/* Platform selector */}
        <AnimatePresence mode="wait">
          {activeTab === "anuncio" ? (
            <motion.div key="mp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-4 h-4 text-brand" />
                <span className="text-sm font-semibold text-dark">Escolha o marketplace</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MARKETPLACES.map((m) => (
                  <button key={m.id} onClick={() => setMarketplace(m.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      marketplace === m.id ? `${m.color} border-current` : "bg-white border-surface-200 text-dark-muted hover:border-surface-300"
                    }`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${marketplace === m.id ? m.dot : "bg-surface-200"}`} />
                    {m.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="vp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-4 h-4 text-brand" />
                <span className="text-sm font-semibold text-dark">Plataforma do vídeo</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {VIDEO_PLATFORMS.map((p) => (
                  <button key={p.id} onClick={() => setVideoPlatform(p.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      videoPlatform === p.id ? `${p.color} border-current` : "bg-white border-surface-200 text-dark-muted hover:border-surface-300"
                    }`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${videoPlatform === p.id ? p.dot : "bg-surface-200"}`} />
                    {p.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form (shared) */}
        <div className="card space-y-4">
          <div>
            <label className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-1.5 block">Nome do produto *</label>
            <input className="input-field" placeholder="Ex: Fone Bluetooth TWS sem fio"
              value={product} onChange={(e) => setProduct(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (activeTab === "anuncio" ? generate() : generateVideo())} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-1.5 block">Categoria</label>
              <div className="relative">
                <button onClick={() => setShowCat(!showCat)} className="input-field flex items-center justify-between w-full text-left">
                  <span className={category ? "text-dark" : "text-dark-muted"}>{category || "Selecione..."}</span>
                  <ChevronDown className="w-4 h-4 text-dark-muted" />
                </button>
                {showCat && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-surface-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => { setCategory(cat); setShowCat(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-50 text-dark">{cat}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-1.5 block">Preço de venda (R$)</label>
              <input className="input-field" placeholder="Ex: 49,90" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-1.5 block">Benefícios e diferenciais</label>
            <input className="input-field" placeholder="Ex: resistente à água, bateria 8h, cancelamento de ruído"
              value={benefits} onChange={(e) => setBenefits(e.target.value)} />
            <p className="text-xs text-dark-muted mt-1">Separe por vírgula</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-1.5 block">Detalhes técnicos (opcional)</label>
            <textarea className="input-field resize-none" rows={2}
              placeholder="Ex: compatível com iOS e Android, cor preta, peso 45g, garantia 12 meses"
              value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>

          {activeTab === "anuncio" ? (
            <button onClick={generate} disabled={loading || !product.trim()}
              className="btn-brand w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Gerando anúncio...</>
                : <><Sparkles className="w-4 h-4" />Gerar Anúncio para {selectedMP.label}</>}
            </button>
          ) : (
            <button onClick={generateVideo} disabled={videoLoading || !product.trim()}
              className="btn-brand w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {videoLoading
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Gerando roteiro...</>
                : <><Video className="w-4 h-4" />Gerar Roteiro para {selectedVP.label}</>}
            </button>
          )}
        </div>

        {/* Anuncio errors */}
        {activeTab === "anuncio" && error && (
          <div className="card border-red-100 bg-red-50 flex items-center gap-3 py-4">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Video errors */}
        {activeTab === "video" && videoError && (
          <div className="card border-red-100 bg-red-50 flex items-center gap-3 py-4">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
            <p className="text-sm text-danger">{videoError}</p>
          </div>
        )}

        {/* Anuncio results */}
        <AnimatePresence>
          {activeTab === "anuncio" && result && !loading && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand" />
                  <span className="text-sm font-semibold text-dark">Anúncio gerado para {selectedMP.label}</span>
                </div>
                <CopyButton text={fullAd} />
              </div>

              {result.precoSugerido && (
                <div className="card bg-success/5 border-success/20 flex items-center gap-3 py-4">
                  <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-success font-black text-sm">R$</span>
                  </div>
                  <div>
                    <div className="text-xs text-dark-muted mb-0.5">Preço sugerido de venda</div>
                    <div className="font-bold text-dark">{result.precoSugerido}</div>
                  </div>
                </div>
              )}

              <ResultCard label="Título do Anúncio" icon={Megaphone} content={result.titulo} />
              <ResultCard label="Descrição Completa" icon={FileText} content={result.descricao} />

              <div className="card border border-surface-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand" />
                    <span className="text-sm font-semibold text-dark">Palavras-chave</span>
                  </div>
                  <CopyButton text={result.palavrasChave.join(", ")} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.palavrasChave.map((kw) => (
                    <span key={kw} className="text-xs px-2.5 py-1 bg-surface-50 border border-surface-200 rounded-lg text-dark-muted">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="card border border-surface-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-brand font-bold text-sm">#</span>
                    <span className="text-sm font-semibold text-dark">Hashtags</span>
                  </div>
                  <CopyButton text={result.hashtags.join(" ")} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 bg-brand/5 border border-brand/20 rounded-lg text-brand font-medium">{tag}</span>
                  ))}
                </div>
              </div>

              <ResultCard label="Call to Action" icon={Megaphone} content={result.callToAction} />

              <div className="card bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Dica para {selectedMP.label}</div>
                    <p className="text-sm text-dark leading-relaxed">{result.dicaVendedor}</p>
                  </div>
                </div>
              </div>

              <button onClick={() => navigator.clipboard.writeText(fullAd)}
                className="btn-brand w-full flex items-center justify-center gap-2 py-3">
                <Copy className="w-4 h-4" />
                Copiar anúncio completo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video results */}
        <AnimatePresence>
          {activeTab === "video" && videoResult && !videoLoading && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-brand" />
                  <span className="text-sm font-semibold text-dark">Roteiro para {videoResult.plataforma}</span>
                </div>
                <CopyButton text={fullScript} />
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="card py-3 text-center">
                  <Clock className="w-4 h-4 text-brand mx-auto mb-1" />
                  <div className="text-xs font-bold text-dark">{videoResult.duracaoTotal}</div>
                  <div className="text-xs text-dark-muted">Duração</div>
                </div>
                <div className="card py-3 text-center">
                  <Camera className="w-4 h-4 text-brand mx-auto mb-1" />
                  <div className="text-xs font-bold text-dark">{videoResult.formato?.split("—")[0]?.trim() || "9:16"}</div>
                  <div className="text-xs text-dark-muted">Formato</div>
                </div>
                <div className="card py-3 text-center">
                  <FileText className="w-4 h-4 text-brand mx-auto mb-1" />
                  <div className="text-xs font-bold text-dark">{videoResult.cenas?.length || 0} cenas</div>
                  <div className="text-xs text-dark-muted">Roteiro</div>
                </div>
              </div>

              {/* Gancho */}
              <div className="card bg-red-50 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">🎯 Gancho Principal</span>
                </div>
                <p className="text-base font-black text-dark">&ldquo;{videoResult.gancho}&rdquo;</p>
                <p className="text-xs text-dark-muted mt-1">Use nos primeiros 3 segundos para parar o scroll</p>
              </div>

              {/* Music */}
              <div className="card bg-purple-50 border-purple-200">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Música Sugerida</span>
                </div>
                <p className="text-sm text-dark mt-1">{videoResult.musicaSugerida}</p>
              </div>

              {/* Scenes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Video className="w-4 h-4 text-brand" />
                  <span className="text-sm font-semibold text-dark">Cenas do Roteiro</span>
                </div>
                <div className="space-y-3">
                  {videoResult.cenas?.map((scene, i) => (
                    <SceneCard key={i} scene={scene} index={i} />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="card bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Call to Action Final</span>
                </div>
                <p className="text-sm font-bold text-dark">&ldquo;{videoResult.cta}&rdquo;</p>
              </div>

              {/* Tips */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card bg-amber-50 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Dicas de Gravação</span>
                  </div>
                  <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{videoResult.dicaGravacao}</p>
                </div>
                <div className="card bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Scissors className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Dicas de Edição</span>
                  </div>
                  <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{videoResult.dicaEdicao}</p>
                </div>
              </div>

              <button onClick={() => navigator.clipboard.writeText(fullScript)}
                className="btn-brand w-full flex items-center justify-center gap-2 py-3">
                <Copy className="w-4 h-4" />
                Copiar roteiro completo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
