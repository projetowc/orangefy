"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag, Eye, EyeOff, ArrowRight, Lock, Mail,
  CheckCircle2, AlertCircle, ChevronLeft
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

type View = "login" | "forgot" | "sent";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [view, setView] = useState<View>("login");
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "link_expirado") {
      setLinkError("Este link expirou ou já foi usado. Solicite um novo abaixo.");
    }
  }, [searchParams]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-mail ou senha inválidos. Verifique suas credenciais.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    setView("sent");
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Orangefy</span>
        </Link>

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Sua jornada para o sucesso nas vendas
              <span className="block text-white/70">começa aqui.</span>
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Entre na plataforma e descubra exatamente o que fazer hoje.
            </p>
            <div className="space-y-4">
              {[
                "Missões diárias guiadas",
                "Produtos validados e lucrativos",
                "Calculadora de margem precisa",
                "Anúncios gerados por IA",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white/80 flex-shrink-0" />
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-white/40 text-sm">
          © 2024 Orangefy. Todos os direitos reservados.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-dark">Orange<span className="text-brand">fy</span></span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-dark mb-2">Bem-vindo de volta</h1>
                  <p className="text-dark-muted">
                    Ainda não tem acesso?{" "}
                    <a href="https://pay.cakto.com.br/454awz8_880943" target="_blank" rel="noopener noreferrer" className="text-brand font-semibold hover:underline">
                      Assine agora
                    </a>
                  </p>
                </div>

                {linkError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 mb-4"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {linkError}
                  </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                      <input
                        type="email"
                        className="input-field pl-10"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input-field pl-10 pr-12"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => setView("forgot")} className="text-sm text-brand font-medium hover:underline">
                      Esqueci minha senha
                    </button>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-danger"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-brand w-full flex items-center justify-center gap-2 py-4 disabled:opacity-70 disabled:cursor-not-allowed"
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
              </motion.div>
            )}

            {view === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button onClick={() => setView("login")} className="flex items-center gap-2 text-dark-muted hover:text-dark text-sm mb-8 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar ao login
                </button>
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-dark mb-2">Recuperar senha</h1>
                  <p className="text-dark-muted">Digite seu e-mail e enviaremos um link de recuperação.</p>
                </div>
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                      <input
                        type="email"
                        className="input-field pl-10"
                        placeholder="seu@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-brand w-full flex items-center justify-center gap-2 py-4">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Enviar link de recuperação"}
                  </button>
                </form>
              </motion.div>
            )}

            {view === "sent" && (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h1 className="text-3xl font-black text-dark mb-3">E-mail enviado!</h1>
                <p className="text-dark-muted mb-8">
                  Enviamos um link para <strong>{resetEmail}</strong>. Verifique sua caixa de entrada.
                </p>
                <button onClick={() => setView("login")} className="btn-brand w-full flex items-center justify-center gap-2 py-4">
                  Voltar ao login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
