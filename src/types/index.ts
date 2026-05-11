export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: "monthly" | "annual";
  status: "active" | "inactive" | "pending";
  xp: number;
  level: number;
  sales_count: number;
  shopee_score: number;
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  reward: string;
  completed: boolean;
  progress: number;
  total: number;
  checklist: ChecklistItem[];
  category: "setup" | "product" | "listing" | "sales" | "growth";
  difficulty: "easy" | "medium" | "hard";
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  score: number;
  margin: number;
  competition: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  profit_potential: number;
  trend: "up" | "stable" | "down";
  tags: ProductTag[];
  avg_price: number;
  shipping_weight: string;
  category: string;
  analysis: string;
  strategy: string;
}

export type ProductTag = "viral" | "high-margin" | "easy" | "trending" | "easy-shipping";

export interface DashboardStats {
  total_sales: number;
  estimated_profit: number;
  shopee_score: number;
  current_level: number;
  xp: number;
  xp_to_next_level: number;
  active_missions: number;
  completed_missions: number;
  streak_days: number;
}
