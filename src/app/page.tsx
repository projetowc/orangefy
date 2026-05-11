"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap, Target, Calculator, Megaphone, BarChart3, TrendingUp,
  Star, CheckCircle2, ArrowRight, ShoppingBag, Users, Award,
  ChevronRight, Shield, Rocket, Play
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const benefits = [
  {
    icon: Target,
    title: "Radar de Produtos",
    description: "Descubra produtos virais com alta margem antes da concorrência.",
    color: "bg-orange-50 text-brand",
  },
  {
    icon: Zap,
    title: "Missões Diárias",
    description: "Sistema gamificado que guia cada passo da sua jornada.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Calculator,
    title: "Calculadora de Lucro",
    description: "Calcule margem, ROI e lucro líquido antes de anunciar.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Megaphone,
    title: "Gerador de Anúncios",
    description: "Crie títulos e descrições otimizadas com IA.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Score Shopee",
    description: "Pontuação visual 0–100 para cada produto analisado.",
    color: "bg-green-50 text-success",
  },
  {
    icon: TrendingUp,
    title: "Dashboard Inteligente",
    description: "Acompanhe evolução, vendas e lucro em tempo real.",
    color: "bg-rose-50 text-rose-600",
  },
];

const steps = [
  { number: "01", title: "Compre o plano", desc: "Escolha mensal ou anual e garanta seu acesso." },
  { number: "02", title: "Acesse a plataforma", desc: "Faça login e encontre tudo pronto para você." },
  { number: "03", title: "Execute as missões", desc: "Siga o roteiro gamificado e aprenda vendendo." },
  { number: "04", title: "Faça suas vendas", desc: "Publique anúncios e receba suas primeiras vendas." },
];

const testimonials = [
  {
    name: "Ana Paula S.",
    role: "Iniciante na Shopee",
    text: "Em 3 semanas segui as missões e fiz minhas primeiras 8 vendas. Incrível!",
    avatar: "AP",
    sales: 8,
  },
  {
    name: "Carlos M.",
    role: "Revendedor",
    text: "O radar de produtos me salvou. Encontrei um nicho lucrativo em minutos.",
    avatar: "CM",
    sales: 24,
  },
  {
    name: "Juliana R.",
    role: "Empreendedora",
    text: "A calculadora de lucro mudou tudo. Agora sei exatamente o que estou ganhando.",
    avatar: "JR",
    sales: 15,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-dark">
              Orange<span className="text-brand">fy</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-dark-muted font-medium hover:text-dark transition-colors text-sm px-4 py-2"
            >
              Entrar
            </Link>
            <a
              href="#planos"
              className="btn-brand text-sm px-5 py-2.5"
            >
              Assinar Agora
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 bg-gradient-hero overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(238,77,45,0.08)_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-brand/10 text-brand rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <Rocket className="w-4 h-4" />
              Plataforma #1 para iniciantes na Shopee
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-dark leading-[1.1] mb-6"
            >
              Aprenda a vender na{" "}
              <span className="text-gradient">Shopee</span>{" "}
              de forma prática.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-dark-muted leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              Descubra produtos lucrativos, acompanhe missões diárias e faça suas primeiras vendas com a Orangefy.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-brand flex items-center justify-center gap-2 text-base px-8 py-4">
                <Play className="w-5 h-5" />
                Começar agora
              </Link>
              <a href="#planos" className="btn-outline flex items-center justify-center gap-2 text-base px-8 py-4">
                Ver planos
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mt-10 text-sm text-dark-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Sem taxa de setup
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Cancele quando quiser
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Suporte incluso
              </div>
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="mt-20 relative"
          >
            <div className="bg-white rounded-3xl shadow-[0_30px_80px_-20px_rgba(238,77,45,0.2)] border border-surface-200 p-6 max-w-4xl mx-auto">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">W</div>
                  <div>
                    <div className="text-sm font-semibold text-dark">Bem-vindo, Wesley</div>
                    <div className="text-xs text-dark-muted">Nível 3 · 840 XP</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="badge-brand">🔥 7 dias de streak</div>
                </div>
              </div>

              {/* Mock Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Vendas", value: "7", icon: "🛍️", color: "text-brand" },
                  { label: "Lucro Est.", value: "R$ 340", icon: "💰", color: "text-success" },
                  { label: "Score", value: "78/100", icon: "⭐", color: "text-amber-500" },
                  { label: "Missões", value: "3/5", icon: "🎯", color: "text-blue-600" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-dark-muted">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Mock Chart */}
              <div className="bg-surface-50 rounded-2xl p-4">
                <div className="flex items-end gap-2 h-20">
                  {[30, 45, 35, 60, 55, 80, 70].map((h, i) => (
                    <div key={i} className="flex-1">
                      <div
                        className="w-full rounded-t-lg bg-gradient-brand opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                    <div key={d} className="text-xs text-dark-muted flex-1 text-center">{d}</div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-12 bg-surface-50 border-y border-surface-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-dark-muted mb-6 font-medium uppercase tracking-wider">Confiado por iniciantes em todo o Brasil</p>
          <div className="flex items-center justify-center gap-8 sm:gap-16 flex-wrap">
            {[
              { value: "1.200+", label: "Usuários ativos" },
              { value: "8.400+", label: "Vendas geradas" },
              { value: "R$ 290k+", label: "Em lucro estimado" },
              { value: "4.8 ★", label: "Avaliação média" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-dark">{s.value}</div>
                <div className="text-sm text-dark-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="recursos" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-4">
              Tudo que você precisa
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-dark mb-4">
              Ferramentas que <span className="text-gradient">realmente funcionam</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-dark-muted max-w-2xl mx-auto">
              Cada recurso foi pensado para acelerar seus resultados e eliminar o achismo.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp} className="card-hover group">
                <div className={`w-12 h-12 rounded-2xl ${b.color} flex items-center justify-center mb-4`}>
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-brand transition-colors">{b.title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-surface-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-4">
              Como funciona
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-dark mb-4">
              Do zero às primeiras <span className="text-gradient">10 vendas</span>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-brand">
                  {step.number}
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{step.title}</h3>
                <p className="text-dark-muted text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-4">
              Resultados reais
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-dark mb-4">
              Quem usou, <span className="text-gradient">vendeu</span>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-dark-muted text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-dark text-sm">{t.name}</div>
                      <div className="text-xs text-dark-muted">{t.role}</div>
                    </div>
                  </div>
                  <div className="badge-success">{t.sales} vendas</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="planos" className="py-24 px-4 bg-surface-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-4">
              Planos e preços
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-dark mb-4">
              Investimento que se <span className="text-gradient">paga rápido</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-dark-muted">
              Uma única venda já cobre meses de assinatura.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Plano Mensal */}
            <motion.div
              className="card border-2 border-surface-200 hover:border-brand/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-dark mb-1">Plano Mensal</h3>
                <p className="text-dark-muted text-sm">Comece agora, cancele quando quiser.</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-dark">R$99</span>
                <span className="text-2xl font-bold text-dark">,90</span>
                <span className="text-dark-muted text-sm">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Radar de Produtos", "Missões Diárias", "Calculadora de Lucro", "Gerador de Anúncios", "Score Shopee", "Dashboard Completo"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://pay.cakto.com.br/454awz8_880943"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center block"
              >
                Assinar Mensal
              </a>
            </motion.div>

            {/* Plano Anual */}
            <motion.div
              className="card border-2 border-brand relative overflow-hidden shadow-brand"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-brand text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-brand">
                  ⭐ Mais Popular
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-dark mb-1">Plano Anual</h3>
                <p className="text-dark-muted text-sm">Economize 35% no plano anual.</p>
              </div>
              <div className="mb-6">
                <div className="text-sm text-dark-muted line-through mb-1">R$1.198,80/ano</div>
                <div>
                  <span className="text-5xl font-black text-dark">R$779</span>
                  <span className="text-2xl font-bold text-dark">,22</span>
                  <span className="text-dark-muted text-sm">/ano</span>
                </div>
                <div className="badge-brand mt-2">35% OFF · Economize R$419,58</div>
              </div>
              <ul className="space-y-3 mb-8">
                {["Radar de Produtos", "Missões Diárias", "Calculadora de Lucro", "Gerador de Anúncios", "Score Shopee", "Dashboard Completo", "Suporte prioritário", "Acesso antecipado"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://pay.cakto.com.br/555a875"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand w-full text-center block"
              >
                Assinar Anual — Melhor Valor
              </a>
            </motion.div>
          </div>

          <div className="text-center mt-8 flex items-center justify-center gap-6 text-sm text-dark-muted">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-success" />Pagamento seguro</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" />Acesso imediato após aprovação</div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 bg-gradient-brand text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black mb-6">
              Pronto para fazer sua primeira venda?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Junte-se a mais de 1.200 iniciantes que já estão vendendo na Shopee com a Orangefy.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://pay.cakto.com.br/555a875"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-brand font-bold rounded-xl px-8 py-4 hover:bg-surface-50 transition-colors flex items-center justify-center gap-2"
              >
                Começar com 35% OFF
                <ChevronRight className="w-5 h-5" />
              </a>
              <Link href="/login" className="border-2 border-white/40 text-white font-bold rounded-xl px-8 py-4 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                Já tenho conta
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Orange<span className="text-brand">fy</span></span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                A plataforma que leva iniciantes às primeiras 10 vendas na Shopee.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Produto</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Suporte</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><a href="mailto:suporte@orangefy.com.br" className="hover:text-white transition-colors">suporte@orangefy.com.br</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Legal</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>© 2024 Orangefy. Todos os direitos reservados.</p>
            <p>Feito com ❤️ para vendedores brasileiros</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
