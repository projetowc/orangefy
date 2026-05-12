"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag, Eye, EyeOff, ArrowRight, Lock, Mail,
  CheckCircle2, AlertCircle, ChevronLeft, UserPlus, LogIn
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

type Tab = "login" | "register";
type View = "form" | "forgot" | "sent";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("login");
  const [view, setView] = useState<View>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  // Forgot
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "link_expirado") {
      setError("Este link expirou. Faça login ou redefina sua senha.");
    }
  }, [searchParams]);

  // Limpa erro ao trocar de aba
  function switchTab(t: Tab) {
    setTab(t);
    setError("");
    setView("form");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setError("E-mail ou senha inválidos.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (regPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail, password: regPassword }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    // Conta criada — faz login automaticamente
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: regEmail,
      password: regPassword,
    });

    if (loginError) {
      setError("Conta criada! Faça login com suas credenciais.");
      setTab("login");
      setLoginEmail(regEmail);
    } else {
      router.push("/dashboard");
      router.refresh();
    }

    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/callback`,
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
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Sua jornada para o sucesso nas vendas
            <span className="block text-white/70">começa aqui.</span>
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Entre na plataforma e descubra exatamente o que fazer hoje.
          </p>
          <div className="space-y-4">
            {["Missões diárias guiadas", "Produtos validados e lucrativos", "Calculadora de margem precisa", "Anúncios gerados por IA"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white/80 flex-shrink-0" />
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white/40 text-sm">© 2024 Orangefy. Todos os direitos reservados.</div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-dark">Orange<span className="text-brand">fy</span></span>
            </Link>
          </div>

          <AnimatePresence mode="wait">

            {/* RECUPERAR SENHA */}
            {view === "forgot" && (
              <motion.div key="forgot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <button onClick={() => setView("form")} className="flex items-center gap-2 text-dark-muted hover:text-dark text-sm mb-8">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
                <h1 className="text-3xl font-black text-dark mb-2">Recuperar senha</h1>
                <p className="text-dark-muted mb-6">Enviaremos um link para redefinir sua senha.</p>
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input type="email" className="input-field pl-10" placeholder="seu@email.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                  </div>
                  <button type="submit" disabled={loading} className="btn-brand w-full py-4 flex items-center justify-center gap-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Enviar link"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* EMAIL ENVIADO */}
            {view === "sent" && (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h1 className="text-3xl font-black text-dark mb-3">E-mail enviado!</h1>
                <p className="text-dark-muted mb-8">Verifique sua caixa de entrada e clique no link para redefinir a senha.</p>
                <button onClick={() => { setView("form"); setTab("login"); }} className="btn-brand w-full py-4">Voltar ao login</button>
              </motion.div>
            )}

            {/* TABS: LOGIN / CRIAR CONTA */}
            {view === "form" && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {/* TABS */}
                <div className="flex bg-surface-50 rounded-2xl p-1 mb-8 border border-surface-200">
                  <button
                    onClick={() => switchTab("login")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      tab === "login"
                        ? "bg-white text-dark shadow-card"
                        : "text-dark-muted hover:text-dark"
                    }`}
                  >
                    <LogIn className="w-4 h-4" /> Entrar
                  </button>
                  <button
                    onClick={() => switchTab("register")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      tab === "register"
                        ? "bg-white text-dark shadow-card"
                        : "text-dark-muted hover:text-dark"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" /> Criar conta
                  </button>
                </div>

                <AnimatePresence mode="wait">

                  {/* LOGIN */}
                  {tab === "login" && (
                    <motion.div key="login-tab" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">E-mail</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                            <input type="email" className="input-field pl-10" placeholder="seu@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">Senha</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                            <input type={showPassword ? "text" : "password"} className="input-field pl-10 pr-12" placeholder="Sua senha" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button type="button" onClick={() => { setView("forgot"); setForgotEmail(loginEmail); }} className="text-sm text-brand font-medium hover:underline">
                            Esqueci minha senha
                          </button>
                        </div>
                        {error && tab === "login" && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-danger">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                          </motion.div>
                        )}
                        <button type="submit" disabled={loading} className="btn-brand w-full flex items-center justify-center gap-2 py-4 disabled:opacity-70">
                          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Entrar na plataforma</span><ArrowRight className="w-5 h-5" /></>}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* REGISTER */}
                  {tab === "register" && (
                    <motion.div key="register-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                      <p className="text-sm text-dark-muted mb-5">
                        Use o <strong>mesmo e-mail</strong> utilizado na sua compra para criar a conta.
                      </p>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">E-mail da compra</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                            <input type="email" className="input-field pl-10" placeholder="email@usado.na.compra.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">Criar senha</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                            <input type={showPassword ? "text" : "password"} className="input-field pl-10 pr-12" placeholder="Mínimo 6 caracteres" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">Confirmar senha</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                            <input type={showConfirm ? "text" : "password"} className="input-field pl-10 pr-12" placeholder="Repita a senha" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} required />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark">
                              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {regConfirm && regPassword !== regConfirm && (
                            <p className="text-xs text-danger mt-1">As senhas não coincidem</p>
                          )}
                        </div>
                        {error && tab === "register" && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-danger">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <div>
                              {error}
                              {error.includes("adquira") && (
                                <a href="https://pay.cakto.com.br/454awz8_880943" target="_blank" rel="noopener noreferrer" className="block mt-1 font-bold underline">
                                  Clique aqui para adquirir o acesso →
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                        <button type="submit" disabled={loading} className="btn-brand w-full flex items-center justify-center gap-2 py-4 disabled:opacity-70">
                          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="w-5 h-5" /><span>Criar minha conta</span></>}
                        </button>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
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
