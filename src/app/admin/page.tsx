"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, UserPlus, CheckCircle2, AlertCircle,
  Lock, Mail, User, CreditCard, Send, Shield
} from "lucide-react";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; existing?: boolean } | null>(null);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (secret === process.env.NEXT_PUBLIC_ADMIN_HINT || secret === "orangefy_admin_2024") {
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Senha incorreta.");
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/admin/invite-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ email, name, plan }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);

    if (data.success) {
      setEmail("");
      setName("");
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-dark">Orange<span className="text-brand">fy</span></span>
            </div>
            <div className="badge-gray inline-flex gap-1 mb-2">
              <Shield className="w-3 h-3" /> Área restrita
            </div>
            <h1 className="text-2xl font-black text-dark">Admin</h1>
          </div>

          <div className="card shadow-card-hover">
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Senha de admin</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                  <input
                    type="password"
                    className="input-field pl-10"
                    placeholder="••••••••"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    required
                  />
                </div>
              </div>
              {authError && (
                <div className="flex items-center gap-2 text-sm text-danger">
                  <AlertCircle className="w-4 h-4" /> {authError}
                </div>
              )}
              <button type="submit" className="btn-brand w-full py-3">
                Entrar
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 p-4">
      <div className="max-w-xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-dark">Orangefy Admin</h1>
            <p className="text-xs text-dark-muted">Gerenciamento de usuários</p>
          </div>
        </div>

        {/* Invite Form */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="font-bold text-dark">Convidar usuário</h2>
              <p className="text-xs text-dark-muted">O usuário receberá um e-mail para criar a senha</p>
            </div>
          </div>

          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Nome</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Nome do cliente"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Plano</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <select
                  className="input-field pl-10 appearance-none"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                >
                  <option value="monthly">Mensal — R$99,90/mês</option>
                  <option value="annual">Anual — R$779,22/ano</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2 py-4 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar convite
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 flex items-start gap-3 p-4 rounded-xl border ${
                  result.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-semibold ${result.success ? "text-success" : "text-danger"}`}>
                    {result.success ? (result.existing ? "Acesso reenviado!" : "Convite enviado!") : "Erro"}
                  </p>
                  <p className="text-sm text-dark-muted mt-0.5">{result.message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2 text-sm">Como funciona</h3>
          <ol className="space-y-1 text-sm text-blue-700 list-decimal list-inside">
            <li>Digite o e-mail e nome do cliente</li>
            <li>Clique em "Enviar convite"</li>
            <li>O cliente recebe um e-mail com link de acesso</li>
            <li>Ele clica, cria a senha e entra no sistema</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
