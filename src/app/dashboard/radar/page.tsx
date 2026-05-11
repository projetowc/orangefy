"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, TrendingUp, TrendingDown, Minus,
  Package, ChevronRight, Star, BarChart2, Truck
} from "lucide-react";
import Header from "@/components/dashboard/Header";

type Tag = "viral" | "high-margin" | "easy" | "trending" | "easy-shipping";
type Trend = "up" | "stable" | "down";
type Level = "low" | "medium" | "high" | "easy" | "hard";

interface Product {
  id: number;
  name: string;
  score: number;
  margin: number;
  competition: Level;
  difficulty: Level;
  trend: Trend;
  tags: Tag[];
  avgPrice: string;
  category: string;
  potential: string;
  analysis: string;
}

const products: Product[] = [
  {
    id: 1, name: "Organizador de gaveta modular", score: 87, margin: 62,
    competition: "low", difficulty: "easy", trend: "up",
    tags: ["viral", "high-margin"], avgPrice: "R$29–R$45", category: "Casa",
    potential: "Alto", analysis: "Produto com alta procura e baixíssima concorrência. Ótimo para iniciantes.",
  },
  {
    id: 2, name: "Suporte veicular celular magnético", score: 81, margin: 58,
    competition: "medium", difficulty: "easy", trend: "up",
    tags: ["easy", "easy-shipping"], avgPrice: "R$15–R$35", category: "Acessórios",
    potential: "Alto", analysis: "Item de consumo constante, fácil de enviar e com margem atrativa.",
  },
  {
    id: 3, name: "Kit pincéis maquiagem 12 peças", score: 75, margin: 48,
    competition: "medium", difficulty: "easy", trend: "up",
    tags: ["trending", "high-margin"], avgPrice: "R$25–R$60", category: "Beleza",
    potential: "Médio", analysis: "Tendência crescente no nicho de beleza. Ticket médio bom para a margem.",
  },
  {
    id: 4, name: "Lâmpada LED inteligente RGB", score: 72, margin: 44,
    competition: "high", difficulty: "medium", trend: "stable",
    tags: ["trending"], avgPrice: "R$35–R$80", category: "Eletrônicos",
    potential: "Médio", analysis: "Concorrência moderada. Foco em diferenciação por imagens e título.",
  },
  {
    id: 5, name: "Capa silicone iPhone 15 colorida", score: 68, margin: 52,
    competition: "high", difficulty: "medium", trend: "stable",
    tags: ["easy-shipping", "high-margin"], avgPrice: "R$12–R$25", category: "Acessórios",
    potential: "Médio", analysis: "Nicho saturado, mas com volume alto. Diferencie por design exclusivo.",
  },
  {
    id: 6, name: "Panela elétrica 1,8L portátil", score: 65, margin: 38,
    competition: "medium", difficulty: "hard", trend: "up",
    tags: ["trending"], avgPrice: "R$60–R$120", category: "Casa",
    potential: "Médio", analysis: "Tendência pós-pandemia. Requer capital inicial maior mas com bom retorno.",
  },
  {
    id: 7, name: "Almofada pescoço viagem ergonômica", score: 79, margin: 60,
    competition: "low", difficulty: "easy", trend: "up",
    tags: ["easy", "high-margin", "easy-shipping"], avgPrice: "R$20–R$45", category: "Viagem",
    potential: "Alto", analysis: "Produto evergreen com sazonalidade positiva em feriados e férias.",
  },
  {
    id: 8, name: "Fita LED decorativa 5m RGB", score: 83, margin: 65,
    competition: "low", difficulty: "easy", trend: "up",
    tags: ["viral", "high-margin", "trending"], avgPrice: "R$25–R$55", category: "Casa",
    potential: "Alto", analysis: "Viral nas redes sociais. Demanda crescente e margem excelente.",
  },
];

const tagLabels: Record<Tag, string> = {
  viral: "🔥 Viral",
  "high-margin": "💰 Alta margem",
  easy: "🟢 Fácil iniciante",
  trending: "📈 Tendência",
  "easy-shipping": "📦 Fácil envio",
};

const tagColors: Record<Tag, string> = {
  viral: "bg-red-100 text-red-700",
  "high-margin": "bg-green-100 text-green-700",
  easy: "bg-emerald-100 text-emerald-700",
  trending: "bg-blue-100 text-blue-700",
  "easy-shipping": "bg-purple-100 text-purple-700",
};

function ScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10B981" : score >= 65 ? "#FF7337" : "#EF4444";

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#F0F0F0" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={radius} fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-success" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-danger" />;
  return <Minus className="w-4 h-4 text-dark-muted" />;
}

const competitionLabel: Record<string, string> = {
  low: "Baixa", medium: "Média", high: "Alta"
};

export default function RadarPage() {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<Tag | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === "all" || p.tags.includes(filterTag);
    return matchSearch && matchTag;
  });

  return (
    <>
      <Header title="Radar de Produtos" subtitle="Produtos validados e lucrativos para você anunciar hoje" />

      <div className="p-6 space-y-6">
        {/* FILTERS */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input
                className="input-field pl-10"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-dark-muted" />
              {(["all", "viral", "high-margin", "easy", "trending", "easy-shipping"] as const).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filterTag === tag
                      ? "bg-brand text-white"
                      : "bg-surface-100 text-dark-muted hover:bg-surface-200"
                  }`}
                >
                  {tag === "all" ? "Todos" : tagLabels[tag]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* PRODUCTS GRID */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(product)}
              className="card-hover cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark text-sm leading-tight mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <span className="text-xs text-dark-muted">{product.category}</span>
                </div>
                <ScoreRing score={product.score} />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.tags.map((tag) => (
                  <span key={tag} className={`badge ${tagColors[tag]} text-xs`}>
                    {tagLabels[tag]}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-surface-50 rounded-xl p-2 text-center">
                  <div className="text-sm font-bold text-success">{product.margin}%</div>
                  <div className="text-xs text-dark-muted">Margem</div>
                </div>
                <div className="bg-surface-50 rounded-xl p-2 text-center">
                  <div className="text-sm font-bold text-dark">{competitionLabel[product.competition]}</div>
                  <div className="text-xs text-dark-muted">Concorrência</div>
                </div>
                <div className="bg-surface-50 rounded-xl p-2 text-center flex flex-col items-center">
                  <TrendIcon trend={product.trend} />
                  <div className="text-xs text-dark-muted mt-0.5">Tendência</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-muted">{product.avgPrice}</span>
                <button className="text-brand text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Ver análise <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DETAIL MODAL */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-dark/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <Package className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark">{selected.name}</h3>
                    <span className="text-xs text-dark-muted">{selected.category}</span>
                  </div>
                </div>
                <ScoreRing score={selected.score} />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {selected.tags.map((tag) => (
                  <span key={tag} className={`badge ${tagColors[tag]}`}>{tagLabels[tag]}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Margem estimada", value: `${selected.margin}%`, icon: BarChart2, color: "text-success" },
                  { label: "Concorrência", value: competitionLabel[selected.competition], icon: Star, color: "text-amber-500" },
                  { label: "Preço médio", value: selected.avgPrice, icon: Package, color: "text-brand" },
                  { label: "Logística", value: "Fácil", icon: Truck, color: "text-blue-600" },
                ].map((item) => (
                  <div key={item.label} className="bg-surface-50 rounded-xl p-3">
                    <item.icon className={`w-4 h-4 ${item.color} mb-1`} />
                    <div className={`font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-dark-muted">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="text-xs font-semibold text-blue-700 mb-1">📊 Análise Orangefy</div>
                <p className="text-sm text-blue-800">{selected.analysis}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="btn-brand w-full"
              >
                Fechar análise
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
