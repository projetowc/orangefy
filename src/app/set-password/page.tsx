"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Mínimo 8 caracteres", ok: password.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-danger", "bg-amber-400", "bg-amber-400", "bg-success"];
  const labels = ["", "Fraca", "Média", "Forte"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${i < score ? colors[score] : "bg-surface-200"}`}
          />
        ))}
      </div>
      <div className="space-y-1">
        {checks.map((c) => (
          <div key={c.label} className={`flex items-center gap-2 text-xs ${c.ok ? "text-success" : "text-dark-muted"}`}>
            <CheckCircle2 className={`w-3 h-3 ${c.ok ? "text-success" : "text-surface-200"}`} />
            {c.label}
          </div>
        ))}
      </div>
      {score === 3 && (
        <p className="text-xs font-semibold text-success">✓ Senha {labels[score]}</p>
      )}
    </div>
  );
}

export default function SetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionReady(true);
        setUserEmail(session.user.email || "");
      } else {
        router.push("/login");
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("A senha deve ter pelo menos uma letra maiúscula.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("A senha deve ter pelo menos um número.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Erro ao definir a senha. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-dark">Orange<span className="text-brand">fy</span></span>
          </div>

          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-success rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Acesso confirmado!
          </div>

          <h1 className="text-3xl font-black text-dark mb-2">Crie sua senha</h1>
          <p className="text-dark-muted">
            Olá! Sua conta foi criada para{" "}
            <strong className="text-dark">{userEmail}</strong>.
            <br />Defina uma senha para acessar a plataforma.
          </p>
        </div>

        <div className="card shadow-card-hover">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Nova senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field pl-10 pr-12"
                  placeholder="Crie uma senha segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input
                  type={showConfirm ? "text" : "password"}
                  className="input-field pl-10 pr-12"
                  placeholder="Repita a senha"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs text-danger mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> As senhas não coincidem
                </p>
              )}
              {confirm && password === confirm && confirm.length >= 8 && (
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Senhas coincidem
                </p>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-danger"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || password !== confirm || password.length < 6}
              className="btn-brand w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar na plataforma
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-dark-muted mt-6">
          Problemas para acessar?{" "}
          <a href="mailto:suporte@orangefy.com.br" className="text-brand font-medium hover:underline">
            Fale com o suporte
          </a>
        </p>
      </motion.div>
    </div>
  );
}
