"use client";

import { motion } from "framer-motion";
import {
  Store, TrendingUp, Package, Star, Eye, ShoppingCart,
  BarChart3, ExternalLink, Award, Clock
} from "lucide-react";
import Header from "@/components/dashboard/Header";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const weeklyData = [
  { dia: "Seg", visitas: 12, vendas: 0 },
  { dia: "Ter", visitas: 28, vendas: 1 },
  { dia: "Qua", visitas: 35, vendas: 1 },
  { dia: "Qui", visitas: 42, vendas: 2 },
  { dia: "Sex", visitas: 58, vendas: 1 },
  { dia: "Sáb", visitas: 71, vendas: 2 },
  { dia: "Dom", visitas: 20, vendas: 0 },
];

const myProducts = [
  {
    id: 1, name: "Organizador gaveta modular", visits: 142, sales: 4,
    revenue: "R$ 180", status: "active", score: 87,
  },
  {
    id: 2, name: "Suporte veicular magnético", visits: 98, sales: 3,
    revenue: "R$ 90", status: "active", score: 79,
  },
  {
    id: 3, name: "Kit pincéis maquiagem", visits: 45, sales: 0,
    revenue: "R$ 0", status: "active", score: 72,
  },
];

export default function MinhaLojaPage() {
  return (
    <>
      <Header title="Minha Loja" subtitle="Acompanhe a performance da sua loja na Shopee" />

      <div className="p-6 space-y-6">
        {/* LOJA INFO */}
        <motion.div
          className="card bg-gradient-brand border-0 text-white"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black">Minha Loja Shopee</h2>
                <p className="text-white/70 text-sm">Conectada e ativa</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/80 text-xs font-medium">Online</span>
                </div>
              </div>
            </div>
            <a
              href="#"
              className="bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
            >
              Abrir na Shopee
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total de visitas", value: "266", icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total de vendas", value: "7", icon: ShoppingCart, color: "text-brand", bg: "bg-orange-50" },
            { label: "Avaliação", value: "5.0 ★", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Taxa de conversão", value: "2.6%", icon: TrendingUp, color: "text-success", bg: "bg-green-50" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-black text-dark">{s.value}</div>
              <div className="text-xs text-dark-muted mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CHART */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-dark">Visitas vs Vendas</h2>
              <p className="text-xs text-dark-muted">Últimos 7 dias</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-dark-muted">Visitas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-brand" />
                <span className="text-dark-muted">Vendas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB" }}
              />
              <Bar dataKey="visitas" fill="#93C5FD" radius={[6, 6, 0, 0]} />
              <Bar dataKey="vendas" fill="#EE4D2D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PRODUCTS TABLE */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-dark">Meus Anúncios</h2>
            <div className="badge-success">
              <Package className="w-3 h-3" />
              {myProducts.length} ativos
            </div>
          </div>
          <div className="space-y-3">
            {myProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl hover:bg-surface-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-dark text-sm truncate">{p.name}</div>
                  <div className="flex items-center gap-3 text-xs text-dark-muted mt-0.5">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{p.visits} visitas</span>
                    <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3" />{p.sales} vendas</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-success text-sm">{p.revenue}</div>
                  <div className="text-xs text-dark-muted">receita</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-lg font-black text-brand">{p.score}</div>
                  <div className="text-xs text-dark-muted text-center">score</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TIPS */}
        <motion.div
          className="grid sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card bg-amber-50 border-amber-200">
            <Award className="w-6 h-6 text-amber-600 mb-3" />
            <h3 className="font-bold text-amber-800 mb-2">Próxima conquista</h3>
            <p className="text-sm text-amber-700">Faça sua 10ª venda para desbloquear o badge "Vendedor Profissional"!</p>
            <div className="mt-3 h-2 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "70%" }} />
            </div>
            <div className="text-xs text-amber-700 mt-1">7 de 10 vendas</div>
          </div>

          <div className="card bg-blue-50 border-blue-200">
            <Clock className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="font-bold text-blue-800 mb-2">Dica do dia</h3>
            <p className="text-sm text-blue-700">
              Responda perguntas dos clientes em menos de 2 horas. Isso aumenta sua taxa de conversão em até 35%.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
