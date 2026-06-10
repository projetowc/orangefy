"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Package, ChevronRight, ExternalLink, Bookmark, Loader2 } from "lucide-react";

export type Tag = "viral" | "high-margin" | "easy" | "trending" | "easy-shipping";
export type Trend = "up" | "stable" | "down";

export interface Product {
  id: number;
  name: string;
  score: number;
  margin: number;
  competition: string;
  difficulty: string;
  trend: Trend;
  tags: Tag[];
  avgPrice: string;
  category: string;
  analysis: string;
  image?: string;
  aliexpressUrl?: string;
}

export const tagLabels: Record<Tag, string> = {
  viral: "Viral",
  "high-margin": "Alta margem",
  easy: "Fácil iniciante",
  trending: "Tendência",
  "easy-shipping": "Fácil envio",
};

export function ScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circ = 2 * Math.PI * radius;
  const color = score >= 80 ? "#10B981" : score >= 65 ? "#EE4D2D" : "#EF4444";
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#F0F0F0" strokeWidth="5" />
        <circle cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-surface-100 flex-shrink-0" />
        <div className="flex-1 space-y-2 pr-16">
          <div className="h-4 bg-surface-100 rounded w-3/4" />
          <div className="h-3 bg-surface-100 rounded w-1/3" />
        </div>
        <div className="w-14 h-14 rounded-full bg-surface-100 flex-shrink-0" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-surface-100 rounded w-16" />
        <div className="h-5 bg-surface-100 rounded w-20" />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[0, 1, 2].map((i) => <div key={i} className="h-14 bg-surface-100 rounded-lg" />)}
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-surface-100 rounded w-20" />
        <div className="h-3 bg-surface-100 rounded w-16" />
      </div>
    </div>
  );
}

function SaveButton({ isSaved, saving, onToggle, floating }: { isSaved: boolean; saving: boolean; onToggle: (e: React.MouseEvent) => void; floating?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={saving}
      title={isSaved ? "Remover dos salvos" : "Salvar produto"}
      className={
        floating
          ? "bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm text-dark-muted hover:text-brand transition-colors disabled:opacity-50"
          : "text-dark-muted hover:text-brand transition-colors disabled:opacity-50"
      }
    >
      {saving ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-brand text-brand" : ""}`} />
      )}
    </button>
  );
}

export function ProductCard({ product, index, onClick, isSaved, onToggleSave, saving }: {
  product: Product;
  index: number;
  onClick: () => void;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
  saving?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!product.image && !imgError;

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`card cursor-pointer hover:shadow-card-hover transition-all duration-200 border border-surface-200 hover:border-dark/10 relative${showImage ? " overflow-hidden" : ""}`}
    >
      {showImage && (
        <div className="-mx-6 -mt-6 mb-4 h-52 bg-surface-50 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-dark text-sm font-black px-2.5 py-1 rounded-lg shadow-sm">
            {product.avgPrice}
          </span>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-0.5 shadow-sm">
            <ScoreRing score={product.score} />
          </div>
          {onToggleSave && (
            <div className="absolute top-3 right-[4.5rem]">
              <SaveButton isSaved={!!isSaved} saving={!!saving} onToggle={onToggleSave} floating />
            </div>
          )}
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        {!showImage && (
          <div className="w-10 h-10 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-dark-muted" />
          </div>
        )}
        <div className={`flex-1 min-w-0 ${showImage ? "" : "pr-16"}`}>
          <h3 className="font-semibold text-dark text-sm leading-snug line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-dark-muted mt-0.5">
            <span>{product.category}</span>
            {!showImage && (
              <>
                <span>·</span>
                <span className="font-bold text-dark">{product.avgPrice}</span>
              </>
            )}
          </div>
        </div>
        {!showImage && <ScoreRing score={product.score} />}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-surface-100 text-dark-muted rounded-md font-medium">
            {tagLabels[tag]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-surface-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-success">{product.margin}%</div>
          <div className="text-xs text-dark-muted">Margem</div>
        </div>
        <div className="bg-surface-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-dark">{product.competition}</div>
          <div className="text-xs text-dark-muted">Concorrência</div>
        </div>
        <div className="bg-surface-50 rounded-lg p-2 text-center flex flex-col items-center">
          {product.trend === "up" ? <TrendingUp className="w-4 h-4 text-success" /> :
            product.trend === "down" ? <TrendingDown className="w-4 h-4 text-danger" /> :
              <Minus className="w-4 h-4 text-dark-muted" />}
          <div className="text-xs text-dark-muted mt-0.5">Tendência</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-dark-muted">{product.avgPrice}</span>
        <div className="flex items-center gap-3">
          {product.aliexpressUrl && (
            <a
              href={product.aliexpressUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-dark-muted hover:text-brand transition-colors"
              title="Ver no AliExpress"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {onToggleSave && !showImage && (
            <SaveButton isSaved={!!isSaved} saving={!!saving} onToggle={onToggleSave} />
          )}
          <button className="text-brand text-xs font-semibold flex items-center gap-1">
            Analisar <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
