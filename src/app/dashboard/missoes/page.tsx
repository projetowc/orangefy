"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, CheckCircle2, Clock, Lock, ChevronDown, ChevronUp,
  Star, Trophy, Flame, Target
} from "lucide-react";
import Header from "@/components/dashboard/Header";

const allMissions = [
  {
    id: 1,
    title: "Criar conta na Shopee",
    description: "O primeiro passo da jornada. Crie sua conta de vendedor na Shopee.",
    xp: 100,
    reward: "Desbloqueio do Radar de Produtos",
    completed: true,
    category: "setup",
    difficulty: "easy",
    checklist: [
      { id: "c1", text: "Acessar shopee.com.br e criar conta", done: true },
      { id: "c2", text: "Verificar e-mail e número de celular", done: true },
      { id: "c3", text: "Preencher dados da loja", done: true },
    ],
  },
  {
    id: 2,
    title: "Escolher produto campeão",
    description: "Use o Radar de Produtos para encontrar um produto validado.",
    xp: 150,
    reward: "+150 XP e badge Explorador",
    completed: true,
    category: "product",
    difficulty: "easy",
    checklist: [
      { id: "c4", text: "Acessar o Radar de Produtos", done: true },
      { id: "c5", text: "Filtrar por 'Fácil iniciante'", done: true },
      { id: "c6", text: "Escolher produto com score acima de 70", done: true },
    ],
  },
  {
    id: 3,
    title: "Publicar primeiro anúncio",
    description: "Crie seu primeiro anúncio usando o Gerador de Anúncios da Orangefy.",
    xp: 200,
    reward: "Badge Vendedor Ativo + acesso a estratégias",
    completed: false,
    active: true,
    category: "listing",
    difficulty: "medium",
    progress: 1,
    total: 3,
    checklist: [
      { id: "c7", text: "Gerar título otimizado no Gerador de Anúncios", done: true },
      { id: "c8", text: "Tirar fotos do produto com fundo branco", done: false },
      { id: "c9", text: "Publicar anúncio na Shopee", done: false },
    ],
  },
  {
    id: 4,
    title: "Fazer primeira venda",
    description: "Receba sua primeira compra. Pode demorar um pouco — seja persistente!",
    xp: 500,
    reward: "Badge Primeiro Sangue + desbloqueio do Ranking",
    completed: false,
    active: false,
    locked: false,
    category: "sales",
    difficulty: "medium",
    checklist: [
      { id: "c10", text: "Anúncio publicado e ativo", done: false },
      { id: "c11", text: "Preço competitivo configurado", done: false },
      { id: "c12", text: "Receber primeira notificação de compra", done: false },
    ],
  },
  {
    id: 5,
    title: "Atingir 5 vendas",
    description: "Prove que é consistente. 5 vendas mostram que seu produto funciona.",
    xp: 750,
    reward: "Badge Consistência + desconto especial no plano anual",
    completed: false,
    locked: true,
    category: "growth",
    difficulty: "hard",
    checklist: [
      { id: "c13", text: "Manter anúncio sempre ativo", done: false },
      { id: "c14", text: "Responder perguntas de clientes", done: false },
      { id: "c15", text: "Acumular 5 vendas confirmadas", done: false },
    ],
  },
  {
    id: 6,
    title: "Atingir 10 vendas — e continue crescendo!",
    description: "Atingir 10 vendas é só o começo. A partir daqui você escala e diversifica produtos.",
    xp: 1000,
    reward: "Badge Lendário + acesso ao Nível Avançado",
    completed: false,
    locked: true,
    category: "growth",
    difficulty: "hard",
    checklist: [
      { id: "c16", text: "Ter pelo menos 3 anúncios ativos", done: false },
      { id: "c17", text: "Manter score acima de 75", done: false },
      { id: "c18", text: "Atingir 10 vendas confirmadas", done: false },
    ],
  },
];

const categoryColors: Record<string, string> = {
  setup: "bg-blue-100 text-blue-700",
  product: "bg-purple-100 text-purple-700",
  listing: "bg-orange-100 text-brand",
  sales: "bg-green-100 text-success",
  growth: "bg-amber-100 text-amber-700",
};

const categoryLabels: Record<string, string> = {
  setup: "Configuração",
  product: "Produto",
  listing: "Anúncio",
  sales: "Vendas",
  growth: "Crescimento",
};

const difficultyLabels: Record<string, string> = {
  easy: "🟢 Fácil",
  medium: "🟡 Médio",
  hard: "🔴 Difícil",
};

export default function MissoesPage() {
  const [expanded, setExpanded] = useState<number | null>(3);

  const completedCount = allMissions.filter((m) => m.completed).length;
  const totalXP = allMissions.filter((m) => m.completed).reduce((a, m) => a + m.xp, 0);

  return (
    <>
      <Header title="Missões" subtitle="Sua jornada gamificada para o sucesso nas vendas" />

      <div className="p-6 space-y-6">
        {/* PROGRESS BAR */}
        <motion.div
          className="card bg-gradient-to-r from-orange-50 to-white border-brand/20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-dark">Progresso da Jornada</h2>
                  <p className="text-sm text-dark-muted">{completedCount} de {allMissions.length} missões concluídas</p>
                </div>
              </div>
              <div className="w-full h-3 bg-surface-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-brand rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / allMissions.length) * 100}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-white rounded-xl p-3 border border-surface-200 min-w-[80px]">
                <div className="text-2xl font-black text-brand">{totalXP}</div>
                <div className="text-xs text-dark-muted">XP ganhos</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-surface-200 min-w-[80px]">
                <div className="text-2xl font-black text-dark">7</div>
                <div className="text-xs text-dark-muted flex items-center gap-1 justify-center"><Flame className="w-3 h-3 text-brand" />Streak</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MISSIONS LIST */}
        <div className="space-y-4">
          {allMissions.map((mission, i) => {
            const isExpanded = expanded === mission.id;
            const completedChecklist = mission.checklist.filter((c) => c.done).length;

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`card border-2 transition-all duration-200 ${
                  mission.completed
                    ? "border-green-200 bg-green-50/50 opacity-80"
                    : mission.active
                    ? "border-brand/40 shadow-brand/20 shadow-md"
                    : mission.locked
                    ? "border-surface-200 opacity-60"
                    : "border-surface-200"
                }`}
              >
                <button
                  onClick={() => !mission.locked && setExpanded(isExpanded ? null : mission.id)}
                  className="w-full text-left"
                  disabled={!!mission.locked}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      mission.completed ? "bg-success" :
                      mission.active ? "bg-gradient-brand shadow-brand" :
                      mission.locked ? "bg-surface-200" : "bg-surface-100"
                    }`}>
                      {mission.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : mission.active ? (
                        <Zap className="w-6 h-6 text-white" />
                      ) : mission.locked ? (
                        <Lock className="w-6 h-6 text-dark-muted" />
                      ) : (
                        <Clock className="w-6 h-6 text-dark-muted" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`font-bold text-dark ${mission.completed ? "line-through text-dark-muted" : ""}`}>
                          {mission.title}
                        </span>
                        {mission.active && <span className="badge-brand text-xs">Em andamento</span>}
                        {mission.locked && <span className="badge-gray text-xs">🔒 Bloqueada</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-dark-muted flex-wrap">
                        <span className={`badge ${categoryColors[mission.category]}`}>
                          {categoryLabels[mission.category]}
                        </span>
                        <span>{difficultyLabels[mission.difficulty]}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          +{mission.xp} XP
                        </span>
                      </div>
                      {mission.progress !== undefined && (
                        <div className="mt-2 w-full max-w-xs h-1.5 bg-surface-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-brand rounded-full"
                            style={{ width: `${(mission.progress / mission.total!) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {!mission.locked && (
                      <div className="flex-shrink-0 text-dark-muted">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && !mission.locked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-surface-200 space-y-4">
                        <p className="text-dark-muted text-sm">{mission.description}</p>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                          <div className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> Recompensa
                          </div>
                          <p className="text-sm text-amber-800">{mission.reward}</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm font-semibold text-dark mb-3">
                            <span>Checklist</span>
                            <span className="text-dark-muted font-normal">{completedChecklist}/{mission.checklist.length}</span>
                          </div>
                          <div className="space-y-2">
                            {mission.checklist.map((item) => (
                              <div key={item.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${item.done ? "bg-green-50" : "bg-surface-50"}`}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  item.done ? "bg-success border-success" : "border-surface-200"
                                }`}>
                                  {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-sm ${item.done ? "text-success line-through" : "text-dark"}`}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
