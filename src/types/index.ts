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
