import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signAliExpressParams(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort().map(k => `${k}${params[k]}`).join("");
  return crypto.createHmac("sha256", secret).update(sorted).digest("hex").toUpperCase();
}

async function fetchProductImage(keyword: string): Promise<string> {
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  if (!appSecret) return "";
  const shortKeyword = keyword.split(" ").slice(0, 3).join(" ");
  try {
    const params: Record<string, string> = {
      app_key: "534762",
      timestamp: Date.now().toString(),
      sign_method: "sha256",
      method: "aliexpress.affiliate.product.query",
      keywords: shortKeyword,
      page_no: "1",
      page_size: "1",
      fields: "product_main_image_url",
      tracking_id: "orangefy",
    };
    params.sign = signAliExpressParams(params, appSecret);
    const url = "https://api-sg.aliexpress.com/sync?" + new URLSearchParams(params).toString();
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    return data?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product?.[0]?.product_main_image_url ?? "";
  } catch {
    return "";
  }
}

const SYSTEM_PROMPT = `Você é um especialista em vendas no Shopee Brasil e análise de mercado de e-commerce. Retorne SOMENTE JSON válido, sem markdown, sem texto extra.`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 });
    }

    const q = query.trim();

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: `Busca do usuário: "${q}"

Retorne 6 a 8 produtos DIRETAMENTE relacionados a "${q}" que vendam bem na Shopee Brasil. Os produtos devem ser EXATAMENTE do nicho pesquisado, não produtos genéricos ou de outros nichos.

Retorne EXATAMENTE este JSON:
{
  "products": [
    {
      "id": número único,
      "name": "nome específico e descritivo do produto em português",
      "score": número entre 50 e 95,
      "margin": número percentual estimado entre 30 e 75,
      "competition": "Baixa" | "Média" | "Alta",
      "difficulty": "Fácil" | "Médio" | "Difícil",
      "trend": "up" | "stable" | "down",
      "tags": array com 1-3 de: ["viral", "high-margin", "easy", "trending", "easy-shipping"],
      "avgPrice": "R$XX–R$XX",
      "category": "categoria em português",
      "analysis": "análise de 2-3 frases sobre potencial, margem e dica prática",
      "image": "",
      "aliexpressUrl": "https://www.aliexpress.com/wholesale?SearchText=TERMO_DE_BUSCA_EM_INGLES"
    }
  ]
}

REGRAS IMPORTANTES:
- Todos os produtos devem ser do nicho "${q}" — nada fora do tema
- aliexpressUrl: gere uma URL de busca no AliExpress em inglês para cada produto (substitua espaços por +)
- Exemplo: para "coleira para cachorro" → "https://www.aliexpress.com/wholesale?SearchText=dog+collar"
- Seja criativo e específico com os produtos, evite genéricos
- Inclua variações e complementos do nicho pesquisado
- Retorne SOMENTE o JSON`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Resposta da IA não é JSON válido");
      }
    }

    const productsWithImages = await Promise.all(
      (parsed.products as Array<{ aliexpressUrl?: string; name: string } & Record<string, unknown>>).map(async (p) => {
        const urlMatch = p.aliexpressUrl?.match(/SearchText=([^&]+)/);
        const keyword = urlMatch ? decodeURIComponent(urlMatch[1].replace(/\+/g, " ")) : p.name;
        const image = await fetchProductImage(keyword);
        return { ...p, image };
      })
    );

    return NextResponse.json({ products: productsWithImages });
  } catch (error) {
    console.error("Radar search error:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}
