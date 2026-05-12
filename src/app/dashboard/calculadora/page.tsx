"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Percent, RefreshCw } from "lucide-react";
import Header from "@/components/dashboard/Header";
import { formatCurrency } from "@/lib/utils";

function InputField({
  label, value, onChange, prefix = "R$", hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-dark mb-2">{label}</label>
      {hint && <p className="text-xs text-dark-muted mb-2">{hint}</p>}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted font-semibold text-sm">
          {prefix}
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-12"
          placeholder="0,00"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
}

export default function CalculadoraPage() {
  const [custo, setCusto] = useState("25");
  const [frete, setFrete] = useState("8");
  const [embalagem, setEmbalagem] = useState("2");
  const [comissao, setComissao] = useState("10");
  const [precoVenda, setPrecoVenda] = useState("59.90");
  const [vendasMes, setVendasMes] = useState("30");

  const custoNum = parseFloat(custo) || 0;
  const freteNum = parseFloat(frete) || 0;
  const embalagemNum = parseFloat(embalagem) || 0;
  const comissaoNum = parseFloat(comissao) || 0;
  const precoNum = parseFloat(precoVenda) || 0;
  const vendasNum = parseInt(vendasMes) || 0;

  const totalCusto = custoNum + freteNum + embalagemNum;
  const valorComissao = precoNum * (comissaoNum / 100);
  const totalGasto = totalCusto + valorComissao;
  const lucroLiquido = precoNum - totalGasto;
  const margem = precoNum > 0 ? (lucroLiquido / precoNum) * 100 : 0;
  const roi = totalGasto > 0 ? (lucroLiquido / totalGasto) * 100 : 0;
  const lucroMensal = lucroLiquido * vendasNum;

  const isProfit = lucroLiquido > 0;

  function reset() {
    setCusto(""); setFrete(""); setEmbalagem("");
    setComissao("10"); setPrecoVenda(""); setVendasMes("30");
  }

  return (
    <>
      <Header title="Calculadora de Lucro" subtitle="Calcule sua margem antes de anunciar" />

      <div className="p-6 space-y-6 max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* INPUTS */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-bold text-dark">Dados do Produto</h2>
              </div>
              <button onClick={reset} className="text-dark-muted hover:text-dark transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <InputField
                label="Custo do produto"
                value={custo}
                onChange={setCusto}
                hint="Quanto você paga pelo produto no fornecedor"
              />
              <InputField
                label="Frete de compra"
                value={frete}
                onChange={setFrete}
                hint="Frete para receber o produto"
              />
              <InputField
                label="Embalagem"
                value={embalagem}
                onChange={setEmbalagem}
                hint="Custo de caixa, plástico bolha, fita, etc."
              />
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Comissão Shopee (%)
                </label>
                <p className="text-xs text-dark-muted mb-2">Geralmente entre 8–12% dependendo da categoria</p>
                <div className="relative">
                  <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                  <input
                    type="number"
                    value={comissao}
                    onChange={(e) => setComissao(e.target.value)}
                    className="input-field pr-10"
                    placeholder="10"
                    min="0" max="100" step="0.1"
                  />
                </div>
              </div>
              <InputField
                label="Preço de venda"
                value={precoVenda}
                onChange={setPrecoVenda}
                hint="Quanto você vai cobrar na Shopee"
              />
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Vendas estimadas/mês
                </label>
                <input
                  type="number"
                  value={vendasMes}
                  onChange={(e) => setVendasMes(e.target.value)}
                  className="input-field"
                  placeholder="30"
                  min="0"
                />
              </div>
            </div>
          </motion.div>

          {/* RESULTS */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Result */}
            <div className={`card border-2 ${isProfit ? "border-success/30 bg-green-50/50" : "border-danger/30 bg-red-50/50"}`}>
              <div className="text-center">
                <div className={`text-5xl font-black mb-2 ${isProfit ? "text-success" : "text-danger"}`}>
                  {isProfit ? "+" : ""}{formatCurrency(lucroLiquido)}
                </div>
                <div className="text-dark-muted font-medium">Lucro líquido por venda</div>
                {isProfit ? (
                  <div className="badge-success mt-3 inline-flex">✓ Produto lucrativo!</div>
                ) : (
                  <div className="bg-red-100 text-danger text-xs font-semibold px-3 py-1 rounded-full mt-3 inline-flex">
                    ✗ Revise os custos
                  </div>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Margem de Lucro",
                  value: `${margem.toFixed(1)}%`,
                  icon: Percent,
                  color: margem >= 30 ? "text-success" : margem >= 15 ? "text-amber-500" : "text-danger",
                  bg: margem >= 30 ? "bg-green-50" : margem >= 15 ? "bg-amber-50" : "bg-red-50",
                  hint: margem >= 30 ? "Excelente" : margem >= 15 ? "Aceitável" : "Muito baixa",
                },
                {
                  label: "ROI",
                  value: `${roi.toFixed(1)}%`,
                  icon: TrendingUp,
                  color: roi >= 50 ? "text-success" : roi >= 20 ? "text-amber-500" : "text-danger",
                  bg: roi >= 50 ? "bg-green-50" : roi >= 20 ? "bg-amber-50" : "bg-red-50",
                  hint: roi >= 50 ? "Excelente" : roi >= 20 ? "Bom" : "Baixo",
                },
              ].map((m) => (
                <div key={m.label} className={`card ${m.bg} border-0`}>
                  <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
                  <div className={`text-2xl font-black ${m.color}`}>{m.value}</div>
                  <div className="text-xs text-dark-muted">{m.label}</div>
                  <div className={`text-xs font-semibold mt-1 ${m.color}`}>{m.hint}</div>
                </div>
              ))}
            </div>

            {/* Monthly Projection */}
            <div className="card bg-gradient-brand text-white border-0">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">Projeção Mensal</span>
              </div>
              <div className="text-4xl font-black mb-1">{formatCurrency(lucroMensal)}</div>
              <div className="text-white/70 text-sm">
                com {vendasMes} vendas/mês
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="card">
              <h3 className="font-semibold text-dark mb-4">Breakdown de Custos</h3>
              <div className="space-y-3">
                {[
                  { label: "Produto", value: custoNum },
                  { label: "Frete de compra", value: freteNum },
                  { label: "Embalagem", value: embalagemNum },
                  { label: `Comissão Shopee (${comissao}%)`, value: valorComissao },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-dark-muted">{item.label}</span>
                    <span className="text-sm font-semibold text-dark">{formatCurrency(item.value)}</span>
                  </div>
                ))}
                <div className="border-t border-surface-200 pt-3 flex items-center justify-between">
                  <span className="font-semibold text-dark">Total de custos</span>
                  <span className="font-bold text-danger">{formatCurrency(totalGasto)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-dark">Preço de venda</span>
                  <span className="font-bold text-dark">{formatCurrency(precoNum)}</span>
                </div>
                <div className="flex items-center justify-between bg-surface-50 rounded-xl p-3 mt-2">
                  <span className="font-bold text-dark">Lucro líquido</span>
                  <span className={`font-black text-lg ${isProfit ? "text-success" : "text-danger"}`}>
                    {formatCurrency(lucroLiquido)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* TIPS */}
        <motion.div
          className="card bg-blue-50 border-blue-200"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-blue-800 mb-3"> Dicas para maximizar sua margem</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Busque fornecedores no AliExpress, 1688 ou mercados locais para reduzir o custo</li>
            <li>• Margem ideal para iniciantes: acima de 35%</li>
            <li>• ROI acima de 50% é excelente para revendedores iniciantes</li>
            <li>• Inclua todos os custos — muitos esquecem a embalagem e o frete de compra</li>
            <li>• A comissão da Shopee varia por categoria — verifique no painel de vendedor</li>
          </ul>
        </motion.div>
      </div>
    </>
  );
}
