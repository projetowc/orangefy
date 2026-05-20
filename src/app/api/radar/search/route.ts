import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function generateSign(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort();
  let str = secret;
  for (const key of sorted) str += key + params[key];
  str += secret;
  return crypto.createHash("md5").update(str, "utf8").digest("hex").toUpperCase();
}

async function searchAliExpress(keywords: string) {
  const appKey = process.env.ALIEXPRESS_APP_KEY!;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET!;
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  const params: Record<string, string> = {
    app_key: appKey,
    method: "aliexpress.affiliate.product.smartmatch",
    sign_method: "md5",
    timestamp,
    keywords,
    page_size: "8",
    page_no: "1",
    tracking_id: "orangefy",
    fields: "product_id,product_title,product_main_image_url,target_sale_price,evaluate_rate,hot_product_commission_rate,promotion_link,product_detail_url",
  };
  params.sign = generateSign(params, appSecret);

  const res = await fetch("https://api-sg.aliexpress.com/sync", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 });
    }

    const q = query.trim();

    // 1. Busca produtos reais no AliExpress
    let aliProducts: Array<{
      product_id: string | number;
      product_title: string;
      product_main_image_url: string;
      target_sale_price: string;
      evaluate_rate: string;
      hot_product_commission_rate?: string;
      promotion_link?: string;
      product_detail_url?: string;
    }> = [];

    try {
      const data = await searchAliExpress(q);
      const result = data?.aliexpress_affiliate_product_smartmatch_response?.resp_result?.result;
      aliProducts = result?.products?.product || [];
    } catch (e) {
      console.error("AliExpress search error:", e);
    }

    // 2. Usa Claude para analisar e traduzir
    if (aliProducts.length >= 3) {
      const productList = aliProducts.slice(0, 8).map((p, i) => ({
        index: i + 1,
        title: p.product_title?.substring(0, 120),
        price: p.target_sale_price,
        rating: p.evaluate_rate,
        commission: p.hot_product_commission_rate,
      }));

      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system: [{ type: "text", text: "Especialista em mercado Shopee Brasil. Retorne SOMENTE JSON válido.", cache_control: { type: "ephemeral" } }],
        messages: [{
          role: "user",
          content: `O usuário buscou: "${q}". Estes são produtos reais do AliExpress encontrados:

${JSON.stringify(productList, null, 2)}

Analise para venda na Shopee Brasil e retorne:
{
  "products": [
    {
      "index": número do produto,
      "name": "nome limpo em português",
      "score": 50-95,
      "margin": 30-70,
      "competition": "Baixa"|"Média"|"Alta",
      "difficulty": "Fácil"|"Médio"|"Difícil",
      "trend": "up"|"stable"|"down",
      "tags": ["viral","high-margin","easy","trending","easy-shipping"],
      "avgPrice": "R$XX–R$XX (preço sugerido de venda na Shopee)",
      "category": "categoria em português",
      "analysis": "2-3 frases sobre potencial, margem e dica prática"
    }
  ]
}
Retorne SOMENTE o JSON.`,
        }],
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";
      let analyzed: { products: Array<{ index: number; name: string; score: number; margin: number; competition: string; difficulty: string; trend: string; tags: string[]; avgPrice: string; category: string; analysis: string }> };
      try {
        analyzed = JSON.parse(text.replace(/```json|```/g, "").trim());
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        analyzed = JSON.parse(match![0]);
      }

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

      return NextResponse.json({ products });
    }

    // 3. Fallback: só Claude
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: [{ type: "text", text: "Especialista em vendas Shopee Brasil. Retorne SOMENTE JSON válido.", cache_control: { type: "ephemeral" } }],
      messages: [{
        role: "user",
        content: `Busca: "${q}". Retorne 6-8 produtos relacionados que vendam bem na Shopee Brasil:
{
  "products": [{
    "id": 1,
    "name": "nome em português",
    "score": 50-95,
    "margin": 30-70,
    "competition": "Baixa"|"Média"|"Alta",
    "difficulty": "Fácil"|"Médio"|"Difícil",
    "trend": "up"|"stable"|"down",
    "tags": ["viral","high-margin","easy","trending","easy-shipping"],
    "avgPrice": "R$XX–R$XX",
    "category": "categoria",
    "analysis": "análise 2-3 frases",
    "image": "",
    "aliexpressUrl": ""
  }]
}
Retorne SOMENTE o JSON.`,
      }],
    });

    const fallbackText = message.content[0].type === "text" ? message.content[0].text : "";
    let parsed;
    try {
      parsed = JSON.parse(fallbackText.replace(/```json|```/g, "").trim());
    } catch {
      const match = fallbackText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(match![0]);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Radar search error:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}
