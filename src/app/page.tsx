"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Zap, Target, Calculator, Megaphone, BarChart3, TrendingUp,
  Star, CheckCircle2, ArrowRight, ShoppingBag, Shield,
  ChevronRight, Clock, Users, Award, AlertCircle, Sparkles
} from "lucide-react";

async function goToCheckout(plan: "monthly" | "quarterly" | "annual") {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(`Erro ao iniciar pagamento: ${data.error || "Tente novamente."}`);
    }
  } catch (e) {
    alert(`Erro de conexão: ${e}`);
  }
}

function CheckoutButton({ plan, className, children }: { plan: "monthly" | "quarterly" | "annual"; className?: string; children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => { setLoading(true); await goToCheckout(plan); setLoading(false); }}
      disabled={loading}
      className={`${className} disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {loading ? "Aguarde..." : children}
    </button>
  );
}

function WistiaEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.querySelector('script[data-wistia-player]')) {
      const s1 = document.createElement("script");
      s1.src = "https://fast.wistia.com/player.js";
      s1.async = true;
      s1.setAttribute("data-wistia-player", "");
      document.head.appendChild(s1);
    }
    if (!document.querySelector('script[data-wistia-embed]')) {
      const s2 = document.createElement("script");
      s2.src = "https://fast.wistia.com/embed/4hz6khumkn.js";
      s2.async = true;
      s2.type = "module";
      s2.setAttribute("data-wistia-embed", "4hz6khumkn");
      document.head.appendChild(s2);
    }
    if (containerRef.current && !containerRef.current.querySelector("wistia-player")) {
      const player = document.createElement("wistia-player");
      player.setAttribute("media-id", "4hz6khumkn");
      player.setAttribute("aspect", "1.8461538461538463");
      player.style.width = "100%";
      containerRef.current.appendChild(player);
    }
  }, []);

  return (
    <>
      <style>{`wistia-player[media-id='4hz6khumkn']:not(:defined){background:center/contain no-repeat url('https://fast.wistia.com/embed/medias/4hz6khumkn/swatch');display:block;filter:blur(5px);padding-top:54.17%}`}</style>
      <div ref={containerRef} />
    </>
  );
}

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
  { icon: BarChart3, title: "Score de Oportunidade 0–100", description: "Pontuação visual de cada produto: margem, concorrência e potencial viral em segundos.", color: "bg-green-50 text-success" },
  { icon: TrendingUp, title: "Dashboard Completo", description: "Acompanhe vendas, lucro e evolução de nível. Tudo em um lugar, sempre atualizado.", color: "bg-rose-50 text-rose-600" },
];

const steps = [
  { number: "01", title: "Assine o plano", desc: "Escolha mensal, trimestral ou anual. Acesso liberado na hora." },
  { number: "02", title: "Crie sua conta", desc: "Entre com o e-mail da compra e defina sua senha." },
  { number: "03", title: "Siga as missões", desc: "O roteiro gamificado mostra exatamente o que fazer." },
  { number: "04", title: "Venda e lucre", desc: "Publique anúncios e receba suas primeiras vendas." },
];

const testimonials = [
  { name: "Ana Paula S.", role: "Vendedora online", text: "Em 3 semanas segui as missões e fiz minhas primeiras 8 vendas. O radar me mostrou exatamente o produto certo.", avatar: "AP", sales: 8 },
  { name: "Carlos M.", role: "Revendedor", text: "Achei um nicho com 60% de margem em 20 minutos usando o radar com IA. Nunca teria achado sozinho.", avatar: "CM", sales: 24 },
  { name: "Juliana R.", role: "Empreendedora digital", text: "A calculadora de lucro mudou tudo. Antes eu vendia sem saber se estava ganhando dinheiro de verdade.", avatar: "JR", sales: 15 },
];

const planFeatures = ["Radar de Produtos com IA", "Missões Diárias Gamificadas", "Calculadora de Lucro", "Gerador de Anúncios com IA", "Score de Oportunidade", "Dashboard Completo"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/orangefy-logo-dark.png"
              alt="Orangefy"
              width={160}
              height={46}
              className="h-8 sm:h-11 w-auto"
              priority
            />
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
              <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black text-dark leading-[1.15] mb-4">
                Encontre produtos com alta demanda para vender na sua loja e{" "}
                <span className="text-gradient">lucrar de verdade.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-dark-muted leading-relaxed mb-6 max-w-xl">
                A Orangefy usa IA para encontrar produtos com alta margem e baixa concorrência — para você anunciar na Shopee, Mercado Livre, Amazon ou qualquer marketplace com confiança e lucrar desde o primeiro produto.
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
            Plano Anual por apenas R$249,90 · R$20,82/mês — Melhor custo-benefício
          </span>
          <span className="text-white/50 hidden sm:block">|</span>
          <span className="text-white/70">Uma única venda já cobre meses de assinatura</span>
        </div>
      </div>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
          <span className="inline-flex items-center gap-2 bg-brand/10 text-brand text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Identificados pela IA Orangefy
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-dark mb-2">
            Produtos com alto potencial de lucro
          </h2>
          <p className="text-dark-muted text-sm max-w-lg mx-auto">
            Exemplos reais de produtos identificados pela Orangefy com boa margem e baixa concorrência nos maiores marketplaces do Brasil.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative">
          {/* fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <div className="animate-marquee flex gap-4 flex-shrink-0">
              {[
                { img: "/produtos/produto-01.png", name: "Toalhas de Banho Kit", score: 84, tag: "Alta margem" },
                { img: "/produtos/produto-02.png", name: "Relógio LED Digital", score: 78, tag: "Viral" },
                { img: "/produtos/produto-03.png", name: "Mini Câmera WiFi", score: 91, tag: "Tendência" },
                { img: "/produtos/produto-04.png", name: "Luvas Táticas", score: 76, tag: "Fácil envio" },
                { img: "/produtos/produto-05.png", name: "Umidificador USB", score: 88, tag: "Alta margem" },
                { img: "/produtos/produto-06.png", name: "Shorts Esportivo", score: 73, tag: "Tendência" },
                { img: "/produtos/produto-07.png", name: "Mini Aspirador Portátil", score: 85, tag: "Viral" },
                { img: "/produtos/produto-08.png", name: "Mouse RGB Sem Fio", score: 80, tag: "Fácil envio" },
                { img: "/produtos/produto-09.png", name: "Relógio Premium Aço", score: 82, tag: "Alta margem" },
                { img: "/produtos/produto-10.png", name: "Camiseta Dry Fit", score: 77, tag: "Tendência" },
                { img: "/produtos/produto-11.png", name: "Smartwatch Fitness", score: 89, tag: "Viral" },
                { img: "/produtos/produto-12.png", name: "Borrifador Azeite", score: 83, tag: "Alta margem" },
                { img: "/produtos/produto-13.png", name: "Camiseta Feminina", score: 75, tag: "Fácil envio" },
                { img: "/produtos/produto-14.png", name: "Kit Meias 10 Pares", score: 86, tag: "Alta margem" },
                { img: "/produtos/produto-15.png", name: "Mochila Executiva", score: 81, tag: "Tendência" },
                // duplicate for seamless loop
                { img: "/produtos/produto-01.png", name: "Toalhas de Banho Kit", score: 84, tag: "Alta margem" },
                { img: "/produtos/produto-02.png", name: "Relógio LED Digital", score: 78, tag: "Viral" },
                { img: "/produtos/produto-03.png", name: "Mini Câmera WiFi", score: 91, tag: "Tendência" },
                { img: "/produtos/produto-04.png", name: "Luvas Táticas", score: 76, tag: "Fácil envio" },
                { img: "/produtos/produto-05.png", name: "Umidificador USB", score: 88, tag: "Alta margem" },
                { img: "/produtos/produto-06.png", name: "Shorts Esportivo", score: 73, tag: "Tendência" },
                { img: "/produtos/produto-07.png", name: "Mini Aspirador Portátil", score: 85, tag: "Viral" },
                { img: "/produtos/produto-08.png", name: "Mouse RGB Sem Fio", score: 80, tag: "Fácil envio" },
                { img: "/produtos/produto-09.png", name: "Relógio Premium Aço", score: 82, tag: "Alta margem" },
                { img: "/produtos/produto-10.png", name: "Camiseta Dry Fit", score: 77, tag: "Tendência" },
                { img: "/produtos/produto-11.png", name: "Smartwatch Fitness", score: 89, tag: "Viral" },
                { img: "/produtos/produto-12.png", name: "Borrifador Azeite", score: 83, tag: "Alta margem" },
                { img: "/produtos/produto-13.png", name: "Camiseta Feminina", score: 75, tag: "Fácil envio" },
                { img: "/produtos/produto-14.png", name: "Kit Meias 10 Pares", score: 86, tag: "Alta margem" },
                { img: "/produtos/produto-15.png", name: "Mochila Executiva", score: 81, tag: "Tendência" },
              ].map((p, i) => (
                <div key={i} className="flex-shrink-0 w-44 bg-white border border-surface-200 rounded-2xl p-3 shadow-sm hover:shadow-card-hover transition-shadow">
                  <div className="w-full h-36 rounded-xl bg-surface-50 overflow-hidden mb-3 flex items-center justify-center">
                    <Image src={p.img} alt={p.name} width={160} height={144} className="w-full h-full object-contain p-2" />
                  </div>
                  <p className="text-xs font-semibold text-dark leading-snug line-clamp-2 mb-2">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-muted bg-surface-100 px-2 py-0.5 rounded-full">{p.tag}</span>
                    <span className="text-xs font-black text-brand">{p.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-8 bg-surface-50 border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              { value: "1.200+", label: "Vendedores ativos", icon: Users },
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
              <h2 className="text-xl font-black text-dark">Você já tentou vender online e não sabia por onde começar?</h2>
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
              Cada recurso foi pensado para acelerar seus resultados em qualquer marketplace e eliminar o achismo.
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

      {/* VIDEO DEMO */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="badge-brand inline-flex mb-3">
              Veja em ação
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-dark mb-3">
              Conheça a <span className="text-gradient">plataforma completa</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base text-dark-muted max-w-xl mx-auto">
              Veja como encontrar produtos lucrativos, analisar margem e gerar anúncios em minutos.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-[0_24px_64px_-16px_rgba(238,77,45,0.2)] border border-surface-200"
          >
            <WistiaEmbed />
          </motion.div>
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

          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Mensal */}
            <motion.div
              className="card border-2 border-surface-200 hover:border-brand/30 transition-all flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-dark mb-0.5">Mensal</h3>
                <p className="text-dark-muted text-sm">Comece agora, cancele quando quiser.</p>
              </div>
              <div className="mb-5">
                <div className="flex items-end gap-1 leading-none">
                  <span className="text-4xl font-black text-dark">R$49</span>
                  <span className="text-xl font-bold text-dark mb-0.5">,90</span>
                  <span className="text-dark-muted text-sm mb-1">/mês</span>
                </div>
                <div className="text-xs text-dark-muted mt-1.5">Cobrado mensalmente</div>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {planFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <CheckoutButton plan="monthly" className="btn-outline w-full text-center">
                Assinar Mensal
              </CheckoutButton>
            </motion.div>

            {/* Trimestral */}
            <motion.div
              className="card border-2 border-brand relative overflow-hidden shadow-brand flex flex-col"
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
                <h3 className="text-lg font-bold text-dark mb-0.5">Trimestral</h3>
                <p className="text-dark-muted text-sm">3 meses de acesso completo.</p>
              </div>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-dark-muted line-through">R$49,90/mês</span>
                  <span className="bg-green-100 text-success text-xs font-bold px-2 py-0.5 rounded-full">-13%</span>
                </div>
                <div className="flex items-end gap-1 leading-none">
                  <span className="text-4xl font-black text-dark">R$43</span>
                  <span className="text-xl font-bold text-dark mb-0.5">,30</span>
                  <span className="text-dark-muted text-sm mb-1">/mês</span>
                </div>
                <div className="text-sm text-dark-muted mt-1.5">R$129,90 cobrado a cada 3 meses</div>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {planFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <CheckoutButton plan="quarterly" className="btn-brand w-full text-center">
                Assinar Trimestral
              </CheckoutButton>
            </motion.div>

            {/* Anual */}
            <motion.div
              className="card border-2 border-surface-200 hover:border-brand/30 transition-all flex flex-col relative"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
            >
              <div className="absolute top-3 right-3">
                <div className="bg-success text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Melhor valor
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-dark mb-0.5">Anual</h3>
                <p className="text-dark-muted text-sm">12 meses de acesso completo.</p>
              </div>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-dark-muted line-through">R$49,90/mês</span>
                  <span className="bg-green-100 text-success text-xs font-bold px-2 py-0.5 rounded-full">-58%</span>
                </div>
                <div className="flex items-end gap-1 leading-none">
                  <span className="text-4xl font-black text-dark">R$20</span>
                  <span className="text-xl font-bold text-dark mb-0.5">,83</span>
                  <span className="text-dark-muted text-sm mb-1">/mês</span>
                </div>
                <div className="text-sm text-dark-muted mt-1.5">R$249,90 cobrado anualmente</div>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {[...planFeatures, "Suporte prioritário", "Acesso antecipado"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <CheckoutButton plan="annual" className="btn-outline w-full text-center border-success text-success hover:bg-green-50">
                Assinar Anual
              </CheckoutButton>
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
              Pare de aprender na teoria. A Orangefy coloca você para vender em qualquer marketplace com método, ferramentas e suporte.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <CheckoutButton plan="annual" className="bg-white text-brand font-bold rounded-xl px-7 py-3.5 hover:bg-surface-50 transition-colors flex items-center justify-center gap-2">
                Garantir Plano Anual — R$249,90
                <ChevronRight className="w-4 h-4" />
              </CheckoutButton>
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
              <div className="mb-3">
                <Image
                  src="/orangefy-logo-white.png"
                  alt="Orangefy"
                  width={160}
                  height={46}
                  className="h-8 sm:h-11 w-auto"
                />
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                A plataforma que transforma iniciantes em vendedores de sucesso nos maiores marketplaces do Brasil.
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
