"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Clock, Lock, Star, Target } from "lucide-react";
import Header from "@/components/dashboard/Header";
import { useUser } from "@/context/UserContext";

const MISSIONS = [
  {
    id: 1,
    title: "Criar conta na Shopee",
    description: "Acesse shopee.com.br, crie sua conta de vendedor e preencha todos os dados da loja.",
    xp: 100,
    reward: "Acesso ao Radar de Produtos",
    category: "Configuração",
    difficulty: "Fácil",
    checklist: [
      { id: "c1", text: "Acessar shopee.com.br e criar conta de vendedor" },
      { id: "c2", text: "Verificar e-mail e número de celular" },
      { id: "c3", text: "Preencher dados completos da loja" },
    ],
  },
  {
    id: 2,
    title: "Escolher produto para vender",
    description: "Use o Radar de Produtos para encontrar um produto com score acima de 70 e margem acima de 35%.",
    xp: 150,
    reward: "Badge Explorador",
    category: "Produto",
    difficulty: "Fácil",
    checklist: [
      { id: "c4", text: "Acessar o Radar de Produtos" },
      { id: "c5", text: "Filtrar por investimento e margem" },
      { id: "c6", text: "Definir o produto que vai vender" },
    ],
  },
  {
    id: 3,
    title: "Calcular seu lucro real",
    description: "Use a Calculadora de Lucro com os dados reais do produto escolhido e valide se a margem compensa.",
    xp: 100,
    reward: "Clareza financeira antes de anunciar",
    category: "Financeiro",
    difficulty: "Fácil",
    checklist: [
      { id: "c7", text: "Pesquisar o custo do produto no fornecedor" },
      { id: "c8", text: "Inserir custo, frete e embalagem na calculadora" },
      { id: "c9", text: "Confirmar que a margem está acima de 30%" },
    ],
  },
  {
    id: 4,
    title: "Criar e publicar seu anúncio",
    description: "Use o Gerador de Anúncios para criar título e descrição otimizados e publique na Shopee.",
    xp: 200,
    reward: "Badge Vendedor Ativo",
    category: "Anúncio",
    difficulty: "Médio",
    checklist: [
      { id: "c10", text: "Gerar título otimizado no Gerador de Anúncios" },
      { id: "c11", text: "Fotografar o produto com fundo branco ou neutro" },
      { id: "c12", text: "Publicar anúncio completo na Shopee" },
    ],
  },
  {
    id: 5,
    title: "Registrar sua primeira venda",
    description: "Quando receber sua primeira compra, registre em Minha Loja para acompanhar seu progresso.",
    xp: 500,
    reward: "Badge Primeira Venda + desbloqueio do Ranking",
    category: "Vendas",
    difficulty: "Médio",
    checklist: [
      { id: "c13", text: "Receber notificação de compra na Shopee" },
      { id: "c14", text: "Registrar a venda em Minha Loja" },
      { id: "c15", text: "Enviar o produto dentro do prazo" },
    ],
  },
  {
    id: 6,
    title: "Atingir 5 vendas",
    description: "Prove consistência. Com 5 vendas você já tem dados para otimizar seus anúncios.",
    xp: 750,
    reward: "Badge Consistência",
    category: "Crescimento",
    difficulty: "Médio",
    checklist: [
      { id: "c16", text: "Manter anúncio ativo e com estoque" },
      { id: "c17", text: "Responder perguntas de clientes em menos de 2h" },
      { id: "c18", text: "Registrar 5 vendas confirmadas" },
    ],
  },
];

type MissionProgress = {
  mission_id: number;
  completed: boolean;
  checklist_progress: Record<string, boolean>;
};

export default function MissoesPage() {
  const { user, refreshProfile } = useUser();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [progress, setProgress] = useState<MissionProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/missions")
      .then((r) => r.json())
      .then((d) => {
        setProgress(d.missions || []);
        setLoading(false);
      });
  }, []);

  function getMissionProgress(missionId: number): MissionProgress {
    return (
      progress.find((p) => p.mission_id === missionId) || {
        mission_id: missionId,
        completed: false,
        checklist_progress: {},
      }
    );
  }

  async function toggleItem(missionId: number, itemId: string, currentValue: boolean) {
    setSaving(`${missionId}-${itemId}`);
    const newValue = !currentValue;

    // Atualiza local imediatamente
    setProgress((prev) => {
      const existing = prev.find((p) => p.mission_id === missionId);
      if (existing) {
        return prev.map((p) =>
          p.mission_id === missionId
            ? { ...p, checklist_progress: { ...p.checklist_progress, [itemId]: newValue } }
            : p
        );
      }
      return [
        ...prev,
        { mission_id: missionId, completed: false, checklist_progress: { [itemId]: newValue } },
      ];
    });

    await fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mission_id: missionId, checklist_item_id: itemId, completed: newValue }),
    });

    setSaving(null);
  }

  async function completeMission(mission: (typeof MISSIONS)[0]) {
    setSaving(`complete-${mission.id}`);
    await fetch("/api/missions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mission_id: mission.id, xp: mission.xp }),
    });

    setProgress((prev) => {
      const existing = prev.find((p) => p.mission_id === mission.id);
      if (existing) {
        return prev.map((p) => (p.mission_id === mission.id ? { ...p, completed: true } : p));
      }
      return [...prev, { mission_id: mission.id, completed: true, checklist_progress: {} }];
    });

    await refreshProfile();
    setSaving(null);
  }

  const completedCount = MISSIONS.filter((m) => getMissionProgress(m.id).completed).length;
  const totalXP = MISSIONS.filter((m) => getMissionProgress(m.id).completed).reduce(
    (acc, m) => acc + m.xp,
    0
  );

  // Primeira missão não concluída = ativa
  const activeMissionId = MISSIONS.find((m) => !getMissionProgress(m.id).completed)?.id;

  if (loading) {
    return (
      <>
        <Header title="Missões" subtitle="Carregando seu progresso..." />
        <div className="p-6 flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Missões" subtitle="Siga o roteiro para vender na Shopee com consistência" />

      <div className="p-6 space-y-4 max-w-3xl">
        {/* Progresso geral */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <h2 className="font-semibold text-dark">Seu progresso</h2>
                  <p className="text-xs text-dark-muted">{completedCount} de {MISSIONS.length} missões concluídas</p>
                </div>
              </div>
              <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / MISSIONS.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 text-center min-w-[72px]">
                <div className="text-xl font-black text-brand">{totalXP}</div>
                <div className="text-xs text-dark-muted">XP ganhos</div>
              </div>
              <div className="bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 text-center min-w-[72px]">
                <div className="text-xl font-black text-dark">{completedCount}</div>
                <div className="text-xs text-dark-muted">Concluídas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de missões */}
        {MISSIONS.map((mission, i) => {
          const mp = getMissionProgress(mission.id);
          const isCompleted = mp.completed;
          const isActive = mission.id === activeMissionId;
          const isLocked = !isCompleted && !isActive && mission.id !== activeMissionId &&
            MISSIONS.findIndex((m) => m.id === mission.id) >
            MISSIONS.findIndex((m) => m.id === activeMissionId!);
          const isExpanded = expanded === mission.id;

          const checkedItems = mission.checklist.filter(
            (item) => mp.checklist_progress[item.id]
          ).length;
          const allChecked = checkedItems === mission.checklist.length;

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`card border transition-all duration-200 ${
                isCompleted
                  ? "border-surface-200 opacity-60"
                  : isActive
                  ? "border-brand/30"
                  : "border-surface-200"
              }`}
            >
              <button
                onClick={() => !isLocked && setExpanded(isExpanded ? null : mission.id)}
                className="w-full text-left"
                disabled={isLocked}
              >
                <div className="flex items-center gap-4">
                  {/* Indicador */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? "bg-success"
                      : isActive
                      ? "bg-brand"
                      : "bg-surface-100"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-surface-200" />
                    ) : (
                      <Clock className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${isCompleted ? "line-through text-dark-muted" : "text-dark"}`}>
                        {mission.title}
                      </span>
                      {isActive && (
                        <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                          Em andamento
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-dark-muted">
                      <span>{mission.category}</span>
                      <span>·</span>
                      <span>{mission.difficulty}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {mission.xp} XP
                      </span>
                    </div>
                    {!isCompleted && !isLocked && checkedItems > 0 && (
                      <div className="mt-2 w-36 h-1 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand rounded-full transition-all"
                          style={{ width: `${(checkedItems / mission.checklist.length) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {!isLocked && (
                    <div className="text-dark-muted flex-shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-surface-200 space-y-4">
                      <p className="text-sm text-dark-muted leading-relaxed">{mission.description}</p>

                      <div className="bg-surface-50 rounded-xl p-3 text-sm">
                        <span className="font-semibold text-dark text-xs uppercase tracking-wide">Recompensa</span>
                        <p className="text-dark-muted mt-1">{mission.reward}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm font-semibold text-dark mb-3">
                          <span>Checklist</span>
                          <span className="text-xs text-dark-muted font-normal">{checkedItems}/{mission.checklist.length}</span>
                        </div>
                        <div className="space-y-2">
                          {mission.checklist.map((item) => {
                            const done = mp.checklist_progress[item.id] || false;
                            const isSaving = saving === `${mission.id}-${item.id}`;
                            return (
                              <button
                                key={item.id}
                                onClick={() => !isCompleted && toggleItem(mission.id, item.id, done)}
                                disabled={isCompleted || isSaving}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                                  done ? "bg-green-50" : "bg-surface-50 hover:bg-surface-100"
                                } disabled:cursor-default`}
                              >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                  done ? "bg-success border-success" : "border-surface-200"
                                }`}>
                                  {isSaving ? (
                                    <div className="w-2 h-2 border border-dark-muted/30 border-t-dark-muted rounded-full animate-spin" />
                                  ) : done ? (
                                    <Check className="w-3 h-3 text-white" />
                                  ) : null}
                                </div>
                                <span className={`text-sm ${done ? "line-through text-dark-muted" : "text-dark"}`}>
                                  {item.text}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {allChecked && !isCompleted && (
                        <motion.button
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => completeMission(mission)}
                          disabled={saving === `complete-${mission.id}`}
                          className="btn-brand w-full flex items-center justify-center gap-2"
                        >
                          {saving === `complete-${mission.id}` ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <><Check className="w-4 h-4" /> Concluir missão e ganhar {mission.xp} XP</>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
