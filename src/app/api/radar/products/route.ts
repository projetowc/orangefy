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

function normalizeWords(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);
}

async function fetchProductImage(keyword: string): Promise<string> {
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  if (!appSecret || !keyword.trim()) return "";
  const cleanKeyword = keyword.trim().slice(0, 80);
  try {
    const params: Record<string, string> = {
      app_key: "534762",
      timestamp: Date.now().toString(),
      sign_method: "sha256",
      method: "aliexpress.affiliate.product.query",
      keywords: cleanKeyword,
      page_no: "1",
      page_size: "5",
      fields: "product_main_image_url,product_title",
    };
    params.sign = signAliExpressParams(params, appSecret);
    const url = "https://api-sg.aliexpress.com/sync?" + new URLSearchParams(params).toString();
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const resp = data?.aliexpress_affiliate_product_query_response?.resp_result;
    if (resp?.resp_code !== 200) {
      console.error(`AliExpress error for "${cleanKeyword}":`, resp?.resp_msg, resp?.resp_code);
      return "";
    }
    const candidates: Array<{ product_main_image_url?: string; product_title?: string }> = resp?.result?.products?.product ?? [];
    if (!candidates.length) return "";

    // Pick the candidate whose title best overlaps with the search keyword, instead of blindly trusting the first result
    const keywordWords = normalizeWords(cleanKeyword);
    let best = candidates[0];
    let bestScore = -1;
    for (const candidate of candidates) {
      const titleWords = normalizeWords(candidate.product_title ?? "");
      const score = keywordWords.filter((w) => titleWords.includes(w)).length;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
    return best?.product_main_image_url ?? "";
  } catch (err) {
    console.error(`AliExpress fetch error for "${cleanKeyword}":`, err);
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
      "imageKeyword": "termo PRECISO em inglês (3 a 5 palavras) descrevendo a aparência física e função do produto, ideal para localizar uma FOTO REAL correspondente em catálogos como AliExpress",
      "aliexpressUrl": "https://www.aliexpress.com/wholesale?SearchText=TERMO_EM_INGLES"
    }
  ]
}

Para imageKeyword: descreva o objeto físico de forma literal e visual, com substantivo principal + características distintivas — não use termos vagos, criativos ou metafóricos. O termo precisa casar com o título de um produto real catalogado.
Exemplo: para "Suporte Vertical para Prato e Panela Magnético" → "magnetic pot lid stand holder"
Exemplo: para "Cinto de Segurança de Carro com Almofada de Memória" → "car seatbelt shoulder pad cushion"

Para aliexpressUrl: gere a URL de busca no AliExpress em inglês para cada produto, usando o mesmo termo de imageKeyword (substitua espaços por +).

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

    const products = parsed.products as Array<Record<string, unknown>>;
    const imagePromise = Promise.all(products.map(async (p) => {
      const urlMatch = (p.aliexpressUrl as string | undefined)?.match(/SearchText=([^&]+)/);
      const keyword = (p.imageKeyword as string) || (urlMatch ? decodeURIComponent(urlMatch[1].replace(/\+/g, " ")) : p.name as string);
      const image = await fetchProductImage(keyword);
      return { ...p, image };
    }));
    const productsWithImages = await Promise.race([
      imagePromise,
      new Promise<Array<Record<string, unknown>>>((resolve) =>
        setTimeout(() => resolve(products.map((p) => ({ ...p, image: "" }))), 4500)
      ),
    ]);

    return NextResponse.json({ products: productsWithImages, source: "ai" });
  } catch (error) {
    console.error("Radar products error:", error);
    return NextResponse.json({ error: "Erro ao carregar produtos" }, { status: 500 });
  }
}
