"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Lock, CreditCard, LogOut, ChevronRight,
  Check, Shield, Mail
} from "lucide-react";
import Header from "@/components/dashboard/Header";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
        value ? "bg-brand" : "bg-surface-200"
      }`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-200 ${
        value ? "translate-x-5" : "translate-x-0.5"
      }`} />
    </button>
  );
}

export default function ConfiguracoesPage() {
  const [notifSales, setNotifSales] = useState(true);
  const [notifMissions, setNotifMissions] = useState(true);
  const [notifTips, setNotifTips] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <Header title="Configurações" subtitle="Gerencie sua conta e preferências" />

      <div className="p-6 space-y-6 max-w-2xl">
        {/* PROFILE */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-brand" />
            <h2 className="font-bold text-dark">Perfil</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-xl font-black shadow-brand">
              W
            </div>
            <div>
              <div className="font-bold text-dark">Wesley Souza</div>
              <div className="text-sm text-dark-muted">wcprodutosdigitais@gmail.com</div>
              <div className="badge-brand mt-1">Plano Mensal · Ativo</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Nome completo</label>
              <input type="text" defaultValue="Wesley Souza" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">E-mail</label>
              <input type="email" defaultValue="wcprodutosdigitais@gmail.com" className="input-field" disabled />
              <p className="text-xs text-dark-muted mt-1">O e-mail não pode ser alterado.</p>
            </div>
          </div>
        </motion.div>

        {/* NOTIFICATIONS */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-brand" />
            <h2 className="font-bold text-dark">Notificações</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: "Alertas de vendas", desc: "Receba quando uma venda for confirmada", value: notifSales, onChange: setNotifSales },
              { label: "Lembretes de missões", desc: "Notificações sobre missões pendentes", value: notifMissions, onChange: setNotifMissions },
              { label: "Dicas e sugestões", desc: "Produtos recomendados e estratégias", value: notifTips, onChange: setNotifTips },
              { label: "E-mail semanal", desc: "Resumo semanal de performance", value: notifEmail, onChange: setNotifEmail },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-dark text-sm">{item.label}</div>
                  <div className="text-xs text-dark-muted">{item.desc}</div>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* PLAN */}
        <motion.div
          className="card border-brand/20 bg-orange-50/50"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-brand" />
            <h2 className="font-bold text-dark">Assinatura</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-brand/20 mb-4">
            <div>
              <div className="font-bold text-dark">Plano Mensal</div>
              <div className="text-sm text-dark-muted">R$99,90/mês · Renova em 10/06/2025</div>
            </div>
            <div className="badge-success">Ativo</div>
          </div>

          <a
            href="https://pay.cakto.com.br/454awz8_880943"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand w-full text-center flex items-center justify-center gap-2 text-sm"
          >
            Fazer upgrade para Anual (35% OFF)
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* SECURITY */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-brand" />
            <h2 className="font-bold text-dark">Segurança</h2>
          </div>

          <div className="space-y-3">
            {[
              { label: "Alterar senha", icon: Lock },
              { label: "Verificação de e-mail", icon: Mail },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-dark-muted" />
                  <span className="text-sm font-medium text-dark">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-dark-muted" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={save}
            className={`btn-brand flex-1 flex items-center justify-center gap-2 ${saved ? "bg-success border-success" : ""}`}
          >
            {saved ? <><Check className="w-4 h-4" /> Salvo!</> : "Salvar alterações"}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border-2 border-danger text-danger font-semibold rounded-xl px-6 py-3 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        </motion.div>
      </div>
    </>
  );
}
