"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Minus, Package, ChevronRight, BarChart2, Truck, Filter } from "lucide-react";
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

const products: Product[] = [
  { id: 1, name: "Organizador de gaveta modular", score: 87, margin: 62, competition: "Baixa", difficulty: "Fácil", trend: "up", tags: ["viral", "high-margin"], avgPrice: "R$29–R$45", category: "Casa", analysis: "Produto com alta procura e baixa concorrência. Ótimo para iniciantes com pouco capital inicial." },
  { id: 2, name: "Suporte veicular celular magnético", score: 81, margin: 58, competition: "Média", difficulty: "Fácil", trend: "up", tags: ["easy", "easy-shipping"], avgPrice: "R$15–R$35", category: "Acessórios", analysis: "Item de consumo constante, leve para enviar e com margem atrativa. Ideal para primeiro produto." },
  { id: 3, name: "Kit pincéis maquiagem 12 peças", score: 75, margin: 48, competition: "Média", difficulty: "Fácil", trend: "up", tags: ["trending", "high-margin"], avgPrice: "R$25–R$60", category: "Beleza", analysis: "Tendência crescente. Ticket médio bom. Diferenciação por fotos de qualidade faz grande diferença." },
  { id: 4, name: "Lâmpada LED inteligente RGB", score: 72, margin: 44, competition: "Alta", difficulty: "Médio", trend: "stable", tags: ["trending"], avgPrice: "R$35–R$80", category: "Eletrônicos", analysis: "Concorrência moderada. Foque em diferenciação por descrição e imagens de qualidade." },
  { id: 5, name: "Capa silicone colorida (iPhone/Samsung)", score: 68, margin: 52, competition: "Alta", difficulty: "Médio", trend: "stable", tags: ["easy-shipping", "high-margin"], avgPrice: "R$12–R$25", category: "Acessórios", analysis: "Volume alto, mas saturado. Diferencie por variedade de modelos e cores exclusivas." },
  { id: 6, name: "Almofada pescoço viagem ergonômica", score: 79, margin: 60, competition: "Baixa", difficulty: "Fácil", trend: "up", tags: ["easy", "high-margin", "easy-shipping"], avgPrice: "R$20–R$45", category: "Viagem", analysis: "Produto evergreen com picos em feriados e férias. Envio simples por ser leve e flexível." },
  { id: 7, name: "Fita LED decorativa 5m", score: 83, margin: 65, competition: "Baixa", difficulty: "Fácil", trend: "up", tags: ["viral", "high-margin", "trending"], avgPrice: "R$25–R$55", category: "Casa", analysis: "Alta procura nas redes. Margem excelente e produto compacto. Boa foto de ambiente vende sozinha." },
  { id: 8, name: "Porta-retrato digital 7 polegadas", score: 70, margin: 42, competition: "Média", difficulty: "Médio", trend: "up", tags: ["trending"], avgPrice: "R$60–R$120", category: "Casa", analysis: "Produto de presente. Pico de vendas em datas comemorativas. Ticket médio maior que a média." },
];

const tagLabels: Record<Tag, string> = {
  viral: "Viral",
  "high-margin": "Alta margem",
  easy: "Fácil iniciante",
  trending: "Tendência",
  "easy-shipping": "Fácil envio",
};

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

export default function RadarPage() {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<Tag | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === "all" || p.tags.includes(filterTag);
    return matchSearch && matchTag;
  });

  return (
    <>
      <Header title="Radar de Produtos" subtitle="Produtos validados com análise de margem e concorrência" />

      <div className="p-6 space-y-5">
        {/* Filtros */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input className="input-field pl-10" placeholder="Buscar produto ou categoria..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
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
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(product)}
              className="card cursor-pointer hover:shadow-card-hover transition-all duration-200 border border-surface-200 hover:border-dark/10"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-dark-muted" />
                </div>
                <div className="flex-1 min-w-0">
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
          ))}
        </div>

        {/* Modal de análise */}
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
                  { label: "Logística", value: "Simples", icon: Truck },
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
