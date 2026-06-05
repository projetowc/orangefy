import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é um especialista em análise de mercado da Shopee Brasil. Sua função é identificar produtos com maior potencial de lucro para vendedores iniciantes. Retorne SOMENTE JSON válido, sem markdown, sem texto extra.`;

const CATEGORIES = [
  "Casa e Organização, Cozinha, Decoração",
  "Beleza, Cuidados Pessoais, Perfumaria",
  "Eletrônicos, Gadgets, Acessórios Tech",
  "Fitness, Esportes, Saúde",
  "Moda, Acessórios, Bolsas",
  "Bebês, Maternidade, Brinquedos",
  "Pets, Animais de Estimação",
  "Automotivo, Ferramentas",
  "Papelaria, Escritório, Estudo",
  "Viagem, Lazer, Ao Ar Livre",
];

const CACHE_KEY_PREFIX = "radar_products_";

function signAliExpressParams(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort().map(k => `${k}${params[k]}`).join("");
  return crypto.createHmac("sha256", secret).update(sorted).digest("hex").toUpperCase();
}

async function fetchProductImage(keyword: string): Promise<string> {
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  if (!appSecret) return "";
  try {
    const params: Record<string, string> = {
      app_key: "534762",
      timestamp: Date.now().toString(),
      sign_method: "sha256",
      method: "aliexpress.affiliate.product.query",
      keywords: keyword,
      page_no: "1",
      page_size: "1",
      fields: "product_main_image_url",
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

export async function GET(req: NextRequest) {
  try {
    const seed = req.nextUrl.searchParams.get("seed") || Date.now().toString();
    const seedNum = parseInt(seed) % CATEGORIES.length;
    const primaryCategory = CATEGORIES[seedNum];
    const secondaryCategory = CATEGORIES[(seedNum + 3) % CATEGORIES.length];
    const tertiaryCategory = CATEGORIES[(seedNum + 6) % CATEGORIES.length];

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: `Hoje é ${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}. Identificador: ${seed}.

Gere 8 produtos DIFERENTES e VARIADOS que estão vendendo bem na Shopee Brasil AGORA. Priorize produtos das categorias: ${primaryCategory}, ${secondaryCategory} e ${tertiaryCategory}.

Regras:
- Cada produto deve ser de uma subcategoria diferente
- Inclua produtos de nicho pouco explorados, não os óbvios
- Varie entre produtos virais, evergreen e tendências sazonais
- Priorize itens leves com margem acima de 40%
- Seja criativo — evite produtos genéricos como "capinha de celular" ou "fone bluetooth"

Retorne EXATAMENTE este JSON:
{
  "products": [
    {
      "id": número de 1 a 8,
      "name": "nome específico e descritivo do produto",
      "score": número entre 60 e 95,
      "margin": número percentual entre 35 e 75,
      "competition": "Baixa" | "Média" | "Alta",
      "difficulty": "Fácil" | "Médio" | "Difícil",
      "trend": "up" | "stable" | "down",
      "tags": array com 1 a 3 de: ["viral", "high-margin", "easy", "trending", "easy-shipping"],
      "avgPrice": "R$XX–R$XX",
      "category": "categoria em português",
      "analysis": "análise prática de 2-3 frases: por que vende, margem real, dica de diferenciação",
      "image": "",
      "aliexpressUrl": "https://www.aliexpress.com/wholesale?SearchText=TERMO_EM_INGLES"
    }
  ]
}

Para aliexpressUrl: gere a URL de busca no AliExpress em inglês para cada produto.
Exemplo: para "organizador de gaveta modular" → "https://www.aliexpress.com/wholesale?SearchText=modular+drawer+organizer"

Retorne SOMENTE o JSON.`,
        },
      ],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("JSON inválido");
      parsed = JSON.parse(match[0]);
    }

    const productsWithImages = await Promise.all(
      (parsed.products as Array<{ aliexpressUrl?: string; name: string } & Record<string, unknown>>).map(async (p) => {
        const urlMatch = p.aliexpressUrl?.match(/SearchText=([^&]+)/);
        const keyword = urlMatch ? decodeURIComponent(urlMatch[1].replace(/\+/g, " ")) : p.name;
        const image = await fetchProductImage(keyword);
        return { ...p, image };
      })
    );

    return NextResponse.json({ products: productsWithImages, source: "ai" });
  } catch (error) {
    console.error("Radar products error:", error);
    return NextResponse.json({ error: "Erro ao carregar produtos" }, { status: 500 });
  }
}
