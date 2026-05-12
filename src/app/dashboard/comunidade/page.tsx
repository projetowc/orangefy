"use client";

import { motion } from "framer-motion";
import { Users, MessageCircle, Heart, Share2, Bookmark, TrendingUp } from "lucide-react";
import Header from "@/components/dashboard/Header";

const posts = [
  {
    id: 1,
    author: "Fernanda L.",
    avatar: "FL",
    level: 8,
    time: "há 2 horas",
    content: "Pessoal! Fiz minha 47ª venda hoje!!  O radar de produtos da Orangefy me ajudou a achar esse nicho incrível. Quem quiser saber mais, me manda mensagem!",
    likes: 34,
    comments: 12,
    tag: "conquista",
  },
  {
    id: 2,
    author: "Ricardo M.",
    avatar: "RM",
    level: 7,
    time: "há 5 horas",
    content: "Dica de ouro: sempre responda as perguntas dos clientes em menos de 1 hora. Minha taxa de conversão saiu de 1.5% para 4.2% só com isso. Testei com 3 produtos diferentes e funcionou nos 3!",
    likes: 28,
    comments: 8,
    tag: "dica",
  },
  {
    id: 3,
    author: "Ana Paula S.",
    avatar: "AP",
    level: 3,
    time: "há 8 horas",
    content: "Oi pessoal! Iniciante aqui  Acabei de fazer minha PRIMEIRA VENDA!! Segui as missões da Orangefy passo a passo e em 12 dias consegui! Obrigada a todo mundo que deu força!",
    likes: 56,
    comments: 19,
    tag: "conquista",
  },
  {
    id: 4,
    author: "Bruno T.",
    avatar: "BT",
    level: 5,
    time: "há 1 dia",
    content: "Alguém já vendeu no nicho de beleza? Estou vendo uma margem de 60% no kit de pincéis que o radar indicou mas estou com medo da concorrência. Qualquer feedback ajuda!",
    likes: 14,
    comments: 22,
    tag: "dúvida",
  },
];

const tagColors: Record<string, string> = {
  conquista: "bg-green-100 text-green-700",
  dica: "bg-blue-100 text-blue-700",
  dúvida: "bg-purple-100 text-purple-700",
};

export default function ComunidadePage() {
  return (
    <>
      <Header title="Comunidade" subtitle="Conecte-se com outros vendedores Orangefy" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-2xl">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { label: "Membros ativos", value: "1.240", icon: Users },
            { label: "Posts hoje", value: "38", icon: MessageCircle },
            { label: "Vendas reportadas", value: "8.4k", icon: TrendingUp },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <s.icon className="w-5 h-5 text-brand mx-auto mb-2" />
              <div className="font-black text-dark text-xl">{s.value}</div>
              <div className="text-xs text-dark-muted">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* POSTS */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              className="card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-dark text-sm">{post.author}</span>
                    <span className="badge-gray text-xs">Nível {post.level}</span>
                    <span className={`badge ${tagColors[post.tag]} text-xs`}>
                      {post.tag === "conquista" ? "" : post.tag === "dica" ? "" : ""} {post.tag}
                    </span>
                  </div>
                  <div className="text-xs text-dark-muted">{post.time}</div>
                </div>
              </div>

              <p className="text-dark text-sm leading-relaxed mb-4">{post.content}</p>

              <div className="flex items-center gap-4 pt-3 border-t border-surface-200">
                <button className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-brand transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-green-500 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-amber-500 transition-colors ml-auto">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card text-center border-dashed">
          <Users className="w-8 h-8 text-dark-muted mx-auto mb-3" />
          <h3 className="font-semibold text-dark mb-2">Comunidade em crescimento</h3>
          <p className="text-dark-muted text-sm">A comunidade completa será lançada em breve com chat ao vivo, grupos por nicho e mentoria.</p>
          <button className="btn-outline mt-4 text-sm px-5 py-2">
            Entrar na lista de espera
          </button>
        </div>
      </div>
    </>
  );
}
