"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, TrendingUp, Star, Crown } from "lucide-react";
import Header from "@/components/dashboard/Header";

const rankings = [
  { pos: 1, name: "Fernanda L.", avatar: "FL", xp: 4820, sales: 47, level: 8, badge: "👑" },
  { pos: 2, name: "Ricardo M.", avatar: "RM", xp: 3910, sales: 38, level: 7, badge: "🥈" },
  { pos: 3, name: "Camila S.", avatar: "CS", xp: 3240, sales: 31, level: 6, badge: "🥉" },
  { pos: 4, name: "Bruno T.", avatar: "BT", xp: 2870, sales: 28, level: 5, badge: null },
  { pos: 5, name: "Aline P.", avatar: "AP", xp: 2450, sales: 24, level: 5, badge: null },
  { pos: 6, name: "Diego F.", avatar: "DF", xp: 2100, sales: 20, level: 4, badge: null },
  { pos: 7, name: "Juliana R.", avatar: "JR", xp: 1850, sales: 18, level: 4, badge: null },
  { pos: 8, name: "Marcos O.", avatar: "MO", xp: 1620, sales: 15, level: 3, badge: null },
  { pos: 9, name: "Patricia H.", avatar: "PH", xp: 1400, sales: 14, level: 3, badge: null },
  { pos: 10, name: "Você", avatar: "EU", xp: 0, sales: 0, level: 1, badge: null, isMe: true },
];

const levelColors = ["", "", "", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-orange-500", "bg-red-500", "bg-gradient-brand"];

export default function RankingPage() {
  return (
    <>
      <Header title="Ranking" subtitle="Top vendedores da comunidade Orangefy" />

      <div className="p-6 space-y-6 max-w-3xl">
        {/* TOP 3 PODIUM */}
        <motion.div
          className="card bg-gradient-to-b from-amber-50 to-white border-amber-200"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h2 className="font-black text-dark text-xl">Top Vendedores do Mês</h2>
          </div>

          <div className="flex items-end justify-center gap-4">
            {/* 2nd */}
            <div className="text-center flex-1">
              <div className="text-2xl mb-2">🥈</div>
              <div className="w-14 h-14 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                {rankings[1].avatar}
              </div>
              <div className="font-semibold text-dark text-sm">{rankings[1].name}</div>
              <div className="text-xs text-dark-muted">{rankings[1].sales} vendas</div>
              <div className="bg-slate-100 rounded-t-xl h-16 mt-2 flex items-center justify-center">
                <span className="text-slate-600 font-bold">#2</span>
              </div>
            </div>
            {/* 1st */}
            <div className="text-center flex-1">
              <div className="text-3xl mb-2">👑</div>
              <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold mx-auto mb-2 shadow-brand">
                {rankings[0].avatar}
              </div>
              <div className="font-bold text-dark">{rankings[0].name}</div>
              <div className="text-xs text-dark-muted">{rankings[0].sales} vendas</div>
              <div className="bg-gradient-brand rounded-t-xl h-24 mt-2 flex items-center justify-center">
                <span className="text-white font-black text-lg">#1</span>
              </div>
            </div>
            {/* 3rd */}
            <div className="text-center flex-1">
              <div className="text-2xl mb-2">🥉</div>
              <div className="w-14 h-14 rounded-full bg-amber-300 flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                {rankings[2].avatar}
              </div>
              <div className="font-semibold text-dark text-sm">{rankings[2].name}</div>
              <div className="text-xs text-dark-muted">{rankings[2].sales} vendas</div>
              <div className="bg-amber-100 rounded-t-xl h-12 mt-2 flex items-center justify-center">
                <span className="text-amber-700 font-bold">#3</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FULL RANKING */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-bold text-dark mb-5">Classificação Completa</h2>
          <div className="space-y-2">
            {rankings.map((user, i) => (
              <motion.div
                key={user.pos}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-colors ${
                  user.isMe
                    ? "bg-brand/10 border-2 border-brand/30"
                    : "hover:bg-surface-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${
                  user.pos === 1 ? "bg-gradient-brand text-white shadow-brand" :
                  user.pos === 2 ? "bg-slate-300 text-white" :
                  user.pos === 3 ? "bg-amber-400 text-white" :
                  "bg-surface-100 text-dark-muted"
                }`}>
                  {user.badge || user.pos}
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${user.isMe ? "text-brand" : "text-dark"}`}>
                      {user.name}
                    </span>
                    {user.isMe && <span className="badge-brand text-xs">Você</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-dark-muted">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {user.xp.toLocaleString()} XP
                    </span>
                    <span>Nível {user.level}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-black text-dark">{user.sales}</div>
                  <div className="text-xs text-dark-muted">vendas</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* MOTIVATIONAL */}
        <motion.div
          className="card bg-gradient-brand text-white text-center border-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Flame className="w-8 h-8 mx-auto mb-3" />
          <h3 className="font-black text-xl mb-2">Você está no Top 10!</h3>
          <p className="text-white/80 text-sm">
            Continue suas missões e suba no ranking. Faltam apenas 2 vendas para o Top 8!
          </p>
        </motion.div>
      </div>
    </>
  );
}
