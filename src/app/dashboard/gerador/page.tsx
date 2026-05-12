"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Sparkles, Copy, Check, ChevronDown,
  Tag, FileText, Hash, Zap, Target
} from "lucide-react";
import Header from "@/components/dashboard/Header";

const categories = [
  "Casa e Jardim", "Beleza e Cosméticos", "Eletrônicos", "Moda Feminina",
  "Moda Masculina", "Esporte e Lazer", "Brinquedos", "Acessórios para Celular",
  "Alimentos e Bebidas", "Pet Shop", "Papelaria", "Ferramentas",
];

interface Generated {
  titulo: string;
  descricao: string;
  palavrasChave: string[];
  hashtags: string[];
  cta: string;
  copy: string;
}

function generateContent(name: string, category: string, benefits: string): Generated {
  const benefitList = benefits.split(",").map((b) => b.trim()).filter(Boolean);

  const titulo = `${name} | ${benefitList[0] || "Alta Qualidade"} | ${category} | Frete Grátis`;

  const descricao = ` ${name} — O produto que você estava procurando!

${benefitList.map((b) => `✓ ${b}`).join("\n")}

 POR QUE ESCOLHER NOSSO PRODUTO?
• Alta qualidade garantida
• Enviamos em até 24h após confirmação do pagamento
• Embalagem segura e discreta
• Suporte completo após a compra
• 100% satisfação garantida ou devolvemos seu dinheiro

📦 SOBRE O ENVIO:
Trabalhamos com os melhores Correios e transportadoras parceiras para garantir que seu produto chegue em perfeito estado.

⭐ COMPRE COM CONFIANÇA:
Somos uma loja comprometida com sua satisfação. Avalie nossa loja após receber!

 DÚVIDAS?
Estamos disponíveis no chat da Shopee para responder todas as suas perguntas.`;

  const palavrasChave = [
    name.toLowerCase(),
    category.toLowerCase(),
    ...benefitList.slice(0, 3).map((b) => b.toLowerCase()),
    "frete grátis",
    "qualidade premium",
    "envio rápido",
  ];

  const hashtags = [
    `#${name.replace(/\s+/g, "")}`,
    `#${category.replace(/\s+/g, "")}`,
    "#freteGratis",
    "#melhorPreco",
    "#qualidadePremium",
    "#shopee",
  ];

  const cta = ` COMPRE AGORA e receba em casa com frete grátis! Estoque limitado — aproveite antes que acabe!`;

  const copy = ` ${name.toUpperCase()} — ${benefitList[0] || "Qualidade Premium"}!

${benefitList.length > 0 ? benefitList.map((b) => `✓ ${b}`).join(" | ") : "Alta qualidade garantida"}

 Perfeito para quem quer qualidade com o melhor custo-benefício.
💥 Promoção por tempo limitado!
📦 Enviamos hoje mesmo!

${cta}`;

  return { titulo, descricao, palavrasChave, hashtags, cta, copy };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
        copied ? "bg-success text-white" : "bg-surface-100 text-dark-muted hover:bg-surface-200"
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

export default function GeradorPage() {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [beneficios, setBeneficios] = useState("");
  const [resultado, setResultado] = useState<Generated | null>(null);
  const [loading, setLoading] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  async function generate() {
    if (!nome || !categoria) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResultado(generateContent(nome, categoria, beneficios));
    setLoading(false);
  }

  return (
    <>
      <Header title="Gerador de Anúncios" subtitle="Crie títulos e descrições otimizadas para vender mais" />

      <div className="p-6 space-y-6 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* FORM */}
          <motion.div
            className="card lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-dark">Dados do Produto</h2>
                <p className="text-xs text-dark-muted">Preencha e gere seu anúncio</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Nome do produto <span className="text-brand">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Organizador de gaveta modular"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Categoria <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCatOpen(!catOpen)}
                    className="input-field text-left flex items-center justify-between"
                  >
                    <span className={categoria ? "text-dark" : "text-dark-muted"}>
                      {categoria || "Selecione a categoria"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-dark-muted transition-transform ${catOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {catOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-xl shadow-card-hover overflow-hidden"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => { setCategoria(cat); setCatOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-50 transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Principais benefícios
                </label>
                <p className="text-xs text-dark-muted mb-2">Separe por vírgulas</p>
                <textarea
                  className="input-field resize-none h-24"
                  placeholder="Ex: durável, fácil de instalar, sem fio, design elegante"
                  value={beneficios}
                  onChange={(e) => setBeneficios(e.target.value)}
                />
              </div>

              <button
                onClick={generate}
                disabled={!nome || !categoria || loading}
                className="btn-brand w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Gerando anúncio...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Anúncio
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* RESULTS */}
          <div className="lg:col-span-3 space-y-4">
            {!resultado && !loading && (
              <motion.div
                className="card flex flex-col items-center justify-center text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
                  <Megaphone className="w-8 h-8 text-dark-muted" />
                </div>
                <h3 className="font-semibold text-dark mb-2">Seu anúncio aparecerá aqui</h3>
                <p className="text-dark-muted text-sm max-w-xs">
                  Preencha os dados ao lado e clique em "Gerar Anúncio" para criar seu anúncio otimizado.
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                className="card flex flex-col items-center justify-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-12 h-12 rounded-full border-4 border-brand/20 border-t-brand animate-spin mb-4" />
                <p className="text-dark-muted font-medium">Gerando seu anúncio...</p>
                <p className="text-xs text-dark-muted mt-1">Isso pode levar alguns segundos</p>
              </motion.div>
            )}

            <AnimatePresence>
              {resultado && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Título */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-brand" />
                        <span className="font-semibold text-dark text-sm">Título Otimizado</span>
                      </div>
                      <CopyButton text={resultado.titulo} />
                    </div>
                    <p className="text-dark text-sm bg-surface-50 rounded-xl p-3 font-medium">
                      {resultado.titulo}
                    </p>
                    <p className="text-xs text-dark-muted mt-2">
                      {resultado.titulo.length}/120 caracteres
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold text-dark text-sm">Call to Action</span>
                      </div>
                      <CopyButton text={resultado.cta} />
                    </div>
                    <p className="text-dark text-sm bg-amber-50 border border-amber-200 rounded-xl p-3">
                      {resultado.cta}
                    </p>
                  </div>

                  {/* Copy persuasiva */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-dark text-sm">Copy Persuasiva</span>
                      </div>
                      <CopyButton text={resultado.copy} />
                    </div>
                    <pre className="text-dark text-sm bg-purple-50 border border-purple-200 rounded-xl p-3 whitespace-pre-wrap font-sans leading-relaxed">
                      {resultado.copy}
                    </pre>
                  </div>

                  {/* Keywords & Hashtags */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="card">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-dark text-sm">Palavras-chave</span>
                        </div>
                        <CopyButton text={resultado.palavrasChave.join(", ")} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resultado.palavrasChave.map((kw) => (
                          <span key={kw} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-dark text-sm">Hashtags</span>
                        </div>
                        <CopyButton text={resultado.hashtags.join(" ")} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resultado.hashtags.map((ht) => (
                          <span key={ht} className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            {ht}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Full Description */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand" />
                        <span className="font-semibold text-dark text-sm">Descrição Completa</span>
                      </div>
                      <CopyButton text={resultado.descricao} />
                    </div>
                    <pre className="text-dark text-sm bg-surface-50 rounded-xl p-4 whitespace-pre-wrap font-sans leading-relaxed text-xs">
                      {resultado.descricao}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
