import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// AliExpress API signature
function generateSign(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort();
  let str = secret;
  for (const key of sorted) str += key + params[key];
  str += secret;
  return crypto.createHash("md5").update(str, "utf8").digest("hex").toUpperCase();
}

async function callAliExpress(method: string, extra: Record<string, string>) {
  const appKey = process.env.ALIEXPRESS_APP_KEY!;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET!;
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  const params: Record<string, string> = {
    app_key: appKey,
    method,
    sign_method: "md5",
    timestamp,
    ...extra,
  };
  params.sign = generateSign(params, appSecret);

  const res = await fetch("https://api-sg.aliexpress.com/sync", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  return res.json();
}

interface AliProduct {
  product_id: string | number;
  product_title: string;
  product_main_image_url: string;
  target_sale_price: string;
  evaluate_rate: string;
  hot_product_commission_rate?: string;
  promotion_link?: string;
  product_detail_url?: string;
}

interface AnalyzedProduct {
  index: number;
  id: number;
  name: string;
  score: number;
  margin: number;
  competition: string;
  difficulty: string;
  trend: string;
  tags: string[];
  avgPrice: string;
  category: string;
  analysis: string;
  image: string;
  aliexpressUrl: string;
}

const CATEGORY_IDS = ["200000783", "200000828", "200003655", "200000789", "200000784"];

export async function GET(req: NextRequest) {
  try {
    const seed = req.nextUrl.searchParams.get("seed") || Date.now().toString();
    const catIndex = parseInt(seed) % CATEGORY_IDS.length;

    // 1. Busca produtos reais do AliExpress
    let aliProducts: AliProduct[] = [];
    try {
      const data = await callAliExpress("aliexpress.affiliate.hotproduct.query", {
        fields: "product_id,product_title,product_main_image_url,target_sale_price,evaluate_rate,hot_product_commission_rate,promotion_link,product_detail_url",
        page_size: "8",
        page_no: "1",
        category_ids: CATEGORY_IDS[catIndex],
        tracking_id: "orangefy",
        device_id: "orangefy_web",
        device_type: "2",
      });

      const result = data?.aliexpress_affiliate_hotproduct_query_response?.resp_result?.result;
      aliProducts = result?.products?.product || [];
    } catch (e) {
      console.error("AliExpress API error:", e);
    }

    // 2. Se AliExpress retornou produtos, usa Claude para analisar
    if (aliProducts.length >= 3) {
      const productList = aliProducts.slice(0, 8).map((p, i) => ({
        index: i + 1,
        title: p.product_title?.substring(0, 100),
        price: p.target_sale_price,
        rating: p.evaluate_rate,
        commission: p.hot_product_commission_rate,
      }));

      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2500,
        system: [{ type: "text", text: "Você é especialista em mercado da Shopee Brasil. Retorne SOMENTE JSON válido.", cache_control: { type: "ephemeral" } }],
        messages: [{
          role: "user",
          content: `Analise estes produtos reais do AliExpress para vendedores da Shopee Brasil e retorne análise de mercado:

${JSON.stringify(productList, null, 2)}

Para cada produto, retorne SOMENTE este JSON:
{
  "products": [
    {
      "index": número do produto (1 a 8),
      "name": "nome limpo e traduzido em português",
      "score": número 60-95 baseado no potencial de venda na Shopee,
      "margin": número percentual 30-70 (margem estimada para revendedor brasileiro),
      "competition": "Baixa" | "Média" | "Alta",
      "difficulty": "Fácil" | "Médio" | "Difícil",
      "trend": "up" | "stable" | "down",
      "tags": array 1-3 de ["viral","high-margin","easy","trending","easy-shipping"],
      "avgPrice": "R$XX–R$XX (preço sugerido de venda na Shopee)",
      "category": "categoria em português",
      "analysis": "2-3 frases: potencial de venda, margem real, dica prática para iniciante"
    }
  ]
}

Retorne SOMENTE o JSON.`,
        }],
      });

      const text = message.content.filter(b => b.type === "text").map(b => (b as {type:"text";text:string}).text).join("");
      let analyzed: { products: AnalyzedProduct[] };
      try {
        analyzed = JSON.parse(text.replace(/```json|```/g, "").trim());
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        analyzed = JSON.parse(match![0]);
      }

      // Mescla dados reais do AliExpress com análise do Claude
      const products = analyzed.products.map((p) => {
        const ali = aliProducts[p.index - 1];
        return {
          id: p.index,
          name: p.name,
          score: p.score,
          margin: p.margin,
          competition: p.competition,
          difficulty: p.difficulty,
          trend: p.trend,
          tags: p.tags,
          avgPrice: p.avgPrice,
          category: p.category,
          analysis: p.analysis,
          image: ali?.product_main_image_url || "",
          aliexpressUrl: ali?.promotion_link || ali?.product_detail_url || "",
        };
      });

      return NextResponse.json({ products, source: "aliexpress" });
    }

    // 3. Fallback: só Claude se AliExpress falhar
    const fallback = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      system: [{ type: "text", text: "Especialista em mercado Shopee Brasil. Retorne SOMENTE JSON válido.", cache_control: { type: "ephemeral" } }],
      messages: [{
        role: "user",
        content: `Gere 8 produtos com alto potencial de venda na Shopee Brasil agora (${new Date().toLocaleDateString("pt-BR")}). Seed: ${seed}.

Retorne:
{
  "products": [
    {
      "id": 1,
      "name": "nome específico",
      "score": 60-95,
      "margin": 35-70,
      "competition": "Baixa"|"Média"|"Alta",
      "difficulty": "Fácil"|"Médio"|"Difícil",
      "trend": "up"|"stable"|"down",
      "tags": ["viral","high-margin","easy","trending","easy-shipping"],
      "avgPrice": "R$XX–R$XX",
      "category": "categoria",
      "analysis": "análise 2-3 frases",
      "image": "",
      "aliexpressUrl": ""
    }
  ]
}
Retorne SOMENTE o JSON.`,
      }],
    });

    const fallbackText = fallback.content.filter(b => b.type === "text").map(b => (b as {type:"text";text:string}).text).join("");
    let fallbackData;
    try {
      fallbackData = JSON.parse(fallbackText.replace(/```json|```/g, "").trim());
    } catch {
      const match = fallbackText.match(/\{[\s\S]*\}/);
      fallbackData = JSON.parse(match![0]);
    }

    return NextResponse.json({ ...fallbackData, source: "ai" });
  } catch (error) {
    console.error("Radar products error:", error);
    return NextResponse.json({ error: "Erro ao carregar produtos" }, { status: 500 });
  }
}
