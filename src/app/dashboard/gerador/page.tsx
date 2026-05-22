"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Sparkles, Copy, Check, ChevronDown, Tag, FileText, Lightbulb, AlertCircle, ShoppingCart } from "lucide-react";
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

interface Generated {
  titulo: string;
  descricao: string;
  palavrasChave: string[];
  hashtags: string[];
  precoSugerido: string;
  dicaVendedor: string;
  callToAction: string;
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

function ResultCard({ label, icon: Icon, content }: {
  label: string; icon: React.ElementType; content: string;
}) {
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

export default function GeradorPage() {
  const [marketplace, setMarketplace] = useState("shopee");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [benefits, setBenefits] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Generated | null>(null);
  const [error, setError] = useState("");
  const [showCat, setShowCat] = useState(false);

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

  const selectedMP = MARKETPLACES.find(m => m.id === marketplace)!;
  const fullAd = result
    ? `TÍTULO:\n${result.titulo}\n\nDESCRIÇÃO:\n${result.descricao}\n\nPALAVRAS-CHAVE:\n${result.palavrasChave.join(", ")}\n\nHASHTAGS:\n${result.hashtags.join(" ")}\n\nCALL TO ACTION:\n${result.callToAction}`
    : "";

  return (
    <>
      <Header title="Gerador de Anúncios" subtitle="Crie anúncios otimizados com IA para qualquer marketplace" />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Marketplace */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-4 h-4 text-brand" />
            <span className="text-sm font-semibold text-dark">Escolha o marketplace</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MARKETPLACES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMarketplace(m.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  marketplace === m.id ? `${m.color} border-current` : "bg-white border-surface-200 text-dark-muted hover:border-surface-300"
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${marketplace === m.id ? m.dot : "bg-surface-200"}`} />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card space-y-4">
          <div>
            <label className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-1.5 block">Nome do produto *</label>
            <input
              className="input-field"
              placeholder="Ex: Fone Bluetooth TWS sem fio"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
            />
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

          <button onClick={generate} disabled={loading || !product.trim()}
            className="btn-brand w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Gerando anúncio...</>
              : <><Sparkles className="w-4 h-4" />Gerar Anúncio para {selectedMP.label}</>}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="card border-red-100 bg-red-50 flex items-center gap-3 py-4">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
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
      </div>
    </>
  );
}
