"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, TrendingUp, ShoppingBag, DollarSign,
  Trash2, X, Package, Info, AlertCircle
} from "lucide-react";
import Header from "@/components/dashboard/Header";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface Sale {
  id: string;
  product_name: string;
  sale_price: number;
  profit: number;
  platform: string;
  sold_at: string;
}

function groupByDay(sales: Sale[]) {
  const map: Record<string, number> = {};
  sales.forEach((s) => {
    const day = new Date(s.sold_at).toLocaleDateString("pt-BR", { weekday: "short" });
    map[day] = (map[day] || 0) + s.profit;
  });
  return Object.entries(map).map(([dia, lucro]) => ({ dia, lucro }));
}

export default function MinhaLojaPage() {
  const { refreshProfile } = useUser();
  const supabase = createClient();

  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [product, setProduct] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [cost, setCost] = useState("");

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || "";
  }

  async function fetchSales() {
    const token = await getToken();
    const res = await fetch("/api/sales", {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSales(data.sales || []);
    }
    setLoading(false);
  }

  useEffect(() => { fetchSales(); }, []);

  async function handleAddSale(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    const token = await getToken();
    const res = await fetch("/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ product_name: product, sale_price: salePrice, cost }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitError(data.error || "Erro ao registrar venda. Tente novamente.");
      setSubmitting(false);
      return;
    }

    setProduct(""); setSalePrice(""); setCost("");
    setShowForm(false);
    setSubmitting(false);
    fetchSales();
    refreshProfile();
  }

  async function handleDelete(id: string) {
    const token = await getToken();
    await fetch("/api/sales", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    setSales((prev) => prev.filter((s) => s.id !== id));
    refreshProfile();
  }

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((a, s) => a + s.sale_price, 0);
  const totalProfit = sales.reduce((a, s) => a + s.profit, 0);
  const avgProfit = totalSales > 0 ? totalProfit / totalSales : 0;
  const chartData = groupByDay(sales.slice(0, 14));

  return (
    <>
      <Header title="Minha Loja" subtitle="Registre suas vendas e acompanhe seu lucro real" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-4xl">
        <div className="flex items-start gap-3 bg-surface-50 border border-surface-200 rounded-xl p-4 text-sm text-dark-muted">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-dark-muted" />
          <p>
            A Shopee não disponibiliza API pública de vendas para plataformas externas no Brasil.
            Registre suas vendas manualmente aqui para acompanhar seu progresso com precisão.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Vendas", value: String(totalSales), icon: ShoppingBag, color: "text-brand" },
            { label: "Faturamento", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-dark" },
            { label: "Lucro total", value: formatCurrency(totalProfit), icon: DollarSign, color: "text-success" },
            { label: "Lucro médio", value: formatCurrency(avgProfit), icon: Package, color: "text-dark" },
          ].map((s) => (
            <div key={s.label} className="card">
              <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
              <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-dark-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Gráfico */}
        {chartData.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-dark mb-4 text-sm">Lucro por dia</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12 }}
                  formatter={(v: number) => [formatCurrency(v), "Lucro"]}
                />
                <Bar dataKey="lucro" fill="#EE4D2D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Botão registrar venda */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-dark">Vendas registradas</h2>
          <button
            onClick={() => { setShowForm(true); setSubmitError(""); }}
            className="btn-brand flex items-center gap-2 text-sm px-4 py-2.5"
          >
            <Plus className="w-4 h-4" />
            Registrar venda
          </button>
        </div>

        {/* Modal formulário */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-dark">Registrar venda</h3>
                  <button onClick={() => setShowForm(false)} className="text-dark-muted hover:text-dark">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddSale} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Nome do produto</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ex: Suporte veicular magnético"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1.5">Preço de venda (R$)</label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="0,00"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        min="0" step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1.5">Custo total (R$)</label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="0,00"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        min="0" step="0.01"
                      />
                    </div>
                  </div>
                  {salePrice && cost && (
                    <div className="bg-surface-50 border border-surface-200 rounded-xl p-3 text-sm">
                      <span className="text-dark-muted">Lucro estimado: </span>
                      <span className={`font-bold ${parseFloat(salePrice) - parseFloat(cost) >= 0 ? "text-success" : "text-danger"}`}>
                        {formatCurrency(parseFloat(salePrice) - parseFloat(cost))}
                      </span>
                    </div>
                  )}
                  {submitError && (
                    <div className="flex items-center gap-2 text-sm text-danger bg-red-50 border border-red-200 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}
                  <button type="submit" disabled={submitting} className="btn-brand w-full flex items-center justify-center gap-2">
                    {submitting
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Plus className="w-4 h-4" /> Registrar</>
                    }
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de vendas */}
        {loading ? (
          <div className="card flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
          </div>
        ) : sales.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-14 text-center">
            <ShoppingBag className="w-10 h-10 text-surface-200 mb-3" />
            <h3 className="font-semibold text-dark mb-1">Nenhuma venda registrada</h3>
            <p className="text-sm text-dark-muted max-w-xs">
              Quando fizer sua primeira venda na Shopee, registre aqui para acompanhar seu progresso.
            </p>
            <button onClick={() => setShowForm(true)} className="btn-brand mt-4 text-sm px-5 py-2.5 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Registrar primeira venda
            </button>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="divide-y divide-surface-100">
              {sales.map((sale) => (
                <div key={sale.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-dark-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-dark text-sm truncate">{sale.product_name}</div>
                    <div className="text-xs text-dark-muted mt-0.5">
                      {new Date(sale.sold_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-dark text-sm">{formatCurrency(sale.sale_price)}</div>
                    <div className={`text-xs font-medium ${sale.profit >= 0 ? "text-success" : "text-danger"}`}>
                      {sale.profit >= 0 ? "+" : ""}{formatCurrency(sale.profit)} lucro
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="text-surface-200 hover:text-danger transition-colors flex-shrink-0 ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
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
