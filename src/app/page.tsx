"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Zap, Target, Calculator, Megaphone, BarChart3, TrendingUp,
  Star, CheckCircle2, ArrowRight, ShoppingBag, Shield,
  ChevronRight, Clock, Users, Award, AlertCircle
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const benefits = [
  { icon: Target, title: "Radar de Produtos com IA", description: "Descubra produtos virais com alta margem antes da concorrência. A IA analisa o mercado por você.", color: "bg-orange-50 text-brand" },
  { icon: Zap, title: "Missões Diárias Gamificadas", description: "Um roteiro passo a passo que transforma aprendizado em ação. Sem pular etapas, sem se perder.", color: "bg-amber-50 text-amber-600" },
  { icon: Calculator, title: "Calculadora de Lucro", description: "Calcule margem, ROI e lucro líquido antes de anunciar. Nunca mais venda no prejuízo.", color: "bg-blue-50 text-blue-600" },
  { icon: Megaphone, title: "Gerador de Anúncios com IA", description: "Títulos e descrições otimizadas geradas automaticamente. Anúncios que convertem, sem esforço.", color: "bg-purple-50 text-purple-600" },
  { icon: BarChart3, title: "Score Shopee 0–100", description: "Pontuação visual de cada produto: margem, concorrência e potencial viral em segundos.", color: "bg-green-50 text-success" },
  { icon: TrendingUp, title: "Dashboard Completo", description: "Acompanhe vendas, lucro e evolução de nível. Tudo em um lugar, sempre atualizado.", color: "bg-rose-50 text-rose-600" },
];

const steps = [
  { number: "01", title: "Assine o plano", desc: "Escolha mensal ou anual. Acesso liberado na hora." },
  { number: "02", title: "Crie sua conta", desc: "Entre com o e-mail da compra e defina sua senha." },
  { number: "03", title: "Siga as missões", desc: "O roteiro gamificado mostra exatamente o que fazer." },
  { number: "04", title: "Venda e lucre", desc: "Publique anúncios e receba suas primeiras vendas." },
];

const testimonials = [
  { name: "Ana Paula S.", role: "Iniciante na Shopee", text: "Em 3 semanas segui as missões e fiz minhas primeiras 8 vendas. O radar me mostrou exatamente o produto certo.", avatar: "AP", sales: 8 },
  { name: "Carlos M.", role: "Revendedor", text: "Achei um nicho com 60% de margem em 20 minutos usando o radar com IA. Nunca teria achado sozinho.", avatar: "CM", sales: 24 },
  { name: "Juliana R.", role: "Empreendedora", text: "A calculadora de lucro mudou tudo. Antes eu vendia sem saber se estava ganhando dinheiro de verdade.", avatar: "JR", sales: 15 },
];

const planFeatures = ["Radar de Produtos com IA", "Missões Diárias Gamificadas", "Calculadora de Lucro", "Gerador de Anúncios com IA", "Score Shopee", "Dashboard Completo"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold text-dark">Orange<span className="text-brand">fy</span></span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="text-dark-muted font-medium hover:text-dark transition-colors text-sm px-3 py-2">
              Entrar
            </Link>
            <a href="#planos" className="btn-brand text-sm px-4 py-2">
              Assinar Agora
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 pb-12 px-4 bg-gradient-hero overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(238,77,45,0.07)_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left: Copy */}
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-dark leading-[1.1] mb-4">
                Aprenda a vender na{" "}
                <span className="text-gradient">Shopee</span>{" "}
                e lucre de verdade.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-dark-muted leading-relaxed mb-6 max-w-xl">
                A Orangefy entrega um sistema completo — radar de produtos com IA, missões diárias e calculadora de lucro — para você fazer sua primeira venda sem achismo.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-6">
                <a href="#planos" className="btn-brand flex items-center justify-center gap-2 text-base px-7 py-3.5">
                  Começar agora
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link href="/login" className="btn-outline flex items-center justify-center gap-2 text-base px-7 py-3.5">
                  Já tenho conta
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-dark-muted">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" />Acesso imediato</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" />Cancele quando quiser</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" />Suporte incluso</span>
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_64px_-16px_rgba(238,77,45,0.25)]">
                <Image
                  src="/dashboard-preview.png"
                  alt="Vendedor feliz usando a Orangefy no computador"
                  width={640}
                  height={480}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-56 bg-white rounded-xl shadow-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-dark-muted">Lucro esta semana</div>
                    <div className="text-lg font-black text-success">+ R$ 340,00</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* URGENCY BANNER */}
      <div className="bg-dark text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-center">
          <span className="flex items-center gap-2 font-semibold">
            <Clock className="w-4 h-4 text-brand" />
            Oferta por tempo limitado — 35% OFF no plano anual
          </span>
          <span className="text-white/50 hidden sm:block">|</span>
          <span className="text-white/70">Uma única venda já cobre meses de assinatura</span>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <section className="py-8 bg-surface-50 border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              { value: "1.200+", label: "Usuários ativos", icon: Users },
              { value: "8.400+", label: "Vendas geradas", icon: ShoppingBag },
              { value: "R$ 290k+", label: "Em lucro estimado", icon: TrendingUp },
              { value: "4.8 ★", label: "Avaliação média", icon: Award },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-black text-dark">{s.value}</div>
                <div className="text-xs sm:text-sm text-dark-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN POINT */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
              <h2 className="text-xl font-black text-dark">Você já tentou vender na Shopee e se perdeu?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-dark-muted">
              {[
                "Não sabe qual produto escolher sem ter prejuízo",
                "Fica sem saber se a margem é boa o suficiente",
                "Cria anúncios que não aparecem na busca",
                "Desiste antes de fazer a primeira venda",
              ].map((p) => (
                <div key={p} className="flex items-start gap-2">
                  <span className="text-danger font-bold mt-0.5">✗</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-red-200 text-sm font-semibold text-brand">
              A Orangefy resolve tudo isso. Passo a passo.
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="recursos" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-3">Tudo que você precisa</motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-dark mb-3">
              Ferramentas que <span className="text-gradient">realmente funcionam</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base text-dark-muted max-w-xl mx-auto">
              Cada recurso foi pensado para acelerar seus resultados e eliminar o achismo.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp} className="card-hover group">
                <div className={`w-10 h-10 rounded-xl ${b.color} flex items-center justify-center mb-3`}>
                  <b.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-dark mb-1.5 group-hover:text-brand transition-colors">{b.title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 px-4 bg-surface-50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-3">Como funciona</motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-dark">
              Do zero à <span className="text-gradient">primeira venda</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-lg sm:text-xl font-black mx-auto mb-3 shadow-brand">
                  {step.number}
                </div>
                <h3 className="font-bold text-dark text-sm sm:text-base mb-1">{step.title}</h3>
                <p className="text-dark-muted text-xs sm:text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-3">Resultados reais</motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-dark">
              Quem usou, <span className="text-gradient">vendeu</span>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-dark-muted text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-dark text-sm">{t.name}</div>
                      <div className="text-xs text-dark-muted">{t.role}</div>
                    </div>
                  </div>
                  <div className="badge-success text-xs">{t.sales} vendas</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SCREENSHOTS */}
      <section className="py-12 overflow-hidden bg-surface-50 border-y border-surface-200">
        <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
          <div className="badge-brand inline-flex mb-3">Resultados reais</div>
          <h2 className="text-3xl sm:text-4xl font-black text-dark mb-2">
            Capturas reais da <span className="text-gradient">Shopee</span>
          </h2>
          <p className="text-sm text-dark-muted">
            Screenshots originais de vendedores que usaram a Orangefy. Sem edição, sem filtro.
          </p>
        </div>

        {/* Row 1 — left to right */}
        <div className="overflow-hidden mb-4">
          <div className="flex gap-4 animate-marquee" style={{ width: "max-content" }}>
            {[1, 2, 3, 7, 1, 2, 3, 7].map((n, i) => (
              <div
                key={i}
                className="w-44 sm:w-52 flex-shrink-0 rounded-2xl overflow-hidden border border-surface-200 shadow-sm bg-white"
              >
                <Image
                  src={`/resultados/${n}.png`}
                  alt={`Resultado Shopee ${n}`}
                  width={300}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right to left */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-marquee-reverse" style={{ width: "max-content" }}>
            {[4, 5, 6, 3, 4, 5, 6, 3].map((n, i) => (
              <div
                key={i}
                className="w-44 sm:w-52 flex-shrink-0 rounded-2xl overflow-hidden border border-surface-200 shadow-sm bg-white"
              >
                <Image
                  src={`/resultados/${n}.png`}
                  alt={`Resultado Shopee ${n}`}
                  width={300}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 px-4">
          <p className="text-xs text-dark-muted">
            Resultados variam conforme dedicação, nicho e capital investido. Passe o mouse para pausar.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="planos" className="py-12 px-4 bg-surface-50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-3">Planos e preços</motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-dark mb-2">
              Investimento que se <span className="text-gradient">paga rápido</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base text-dark-muted">
              Uma única venda já cobre meses de assinatura.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Mensal */}
            <motion.div
              className="card border-2 border-surface-200 hover:border-brand/30 transition-all"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-dark mb-0.5">Plano Mensal</h3>
                <p className="text-dark-muted text-sm">Comece agora, cancele quando quiser.</p>
              </div>
              <div className="mb-5">
                <span className="text-4xl font-black text-dark">R$99</span>
                <span className="text-xl font-bold text-dark">,90</span>
                <span className="text-dark-muted text-sm">/mês</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {planFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />{f}
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

            {/* Anual */}
            <motion.div
              className="card border-2 border-brand relative overflow-hidden shadow-brand"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="absolute top-3 right-3">
                <div className="bg-gradient-brand text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-brand">
                  Mais Popular
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-dark mb-0.5">Plano Anual</h3>
                <p className="text-dark-muted text-sm">Economize 35% — melhor custo-benefício.</p>
              </div>
              <div className="mb-5">
                <div className="text-xs text-dark-muted line-through mb-0.5">R$1.198,80/ano</div>
                <span className="text-4xl font-black text-dark">R$779</span>
                <span className="text-xl font-bold text-dark">,22</span>
                <span className="text-dark-muted text-sm">/ano</span>
                <div className="badge-brand mt-1.5 inline-flex">35% OFF · Economize R$419,58</div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[...planFeatures, "Suporte prioritário", "Acesso antecipado"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />{f}
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-sm text-dark-muted">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-success" />Pagamento 100% seguro</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" />Acesso imediato após aprovação</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-success" />Cancele quando quiser</span>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-14 px-4 bg-gradient-brand text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">
              Mais de 1.200 vendedores já começaram
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black mb-4">
              Pronto para fazer sua primeira venda?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-7 max-w-xl mx-auto">
              Pare de aprender na teoria. A Orangefy coloca você para vender com método, ferramentas e suporte.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://pay.cakto.com.br/555a875"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-brand font-bold rounded-xl px-7 py-3.5 hover:bg-surface-50 transition-colors flex items-center justify-center gap-2"
              >
                Começar com 35% OFF
                <ChevronRight className="w-4 h-4" />
              </a>
              <Link href="/login" className="border-2 border-white/40 text-white font-bold rounded-xl px-7 py-3.5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                Já tenho conta
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-lg font-bold">Orange<span className="text-brand">fy</span></span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                A plataforma que transforma iniciantes em vendedores de sucesso na Shopee.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white/80 text-sm">Produto</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white/80 text-sm">Suporte</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><a href="mailto:suporte@orangefy.com.br" className="hover:text-white transition-colors">suporte@orangefy.com.br</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white/80 text-sm">Legal</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>© 2025 Orangefy. Todos os direitos reservados.</p>
            <p>Feito para vendedores brasileiros</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
