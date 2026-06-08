import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    const resp = data?.aliexpress_affiliate_product_query_response?.resp_result;
    if (resp?.resp_code !== 200) {
      console.error(`AliExpress error for "${cleanKeyword}":`, resp?.resp_msg, resp?.resp_code);
      return "";
    }
    const candidates: Array<{ product_main_image_url?: string; product_title?: string }> = resp?.result?.products?.product ?? [];
    if (!candidates.length) return "";

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

const SYSTEM_PROMPT = `Você é um analista de e-commerce e inteligência competitiva, especialista em identificar lojas online de alta performance e seus produtos campeões de venda. Retorne SOMENTE JSON válido, sem markdown, sem texto extra.`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    const q = typeof query === "string" ? query.trim() : "";

    const nicheInstruction = q.length >= 2
      ? `Foque em lojas do nicho/segmento: "${q}".`
      : `Traga uma variedade de nichos populares e lucrativos (moda, casa, beleza, pets, eletrônicos, fitness, bebês).`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{
        role: "user",
        content: `Gere um relatório de 4 lojas de e-commerce fictícias, porém extremamente realistas, que estariam "bombando" agora — vendendo muito e em crescimento acelerado.

${nicheInstruction}

Para cada loja, invente um nome de marca plausível (não use marcas reais existentes) e construa um perfil completo com produtos campeões e histórico de vendas.

Retorne EXATAMENTE este JSON:
{
  "shops": [
    {
      "id": número de 1 a 4,
      "nome": "nome de marca fictício e plausível",
      "nicho": "nicho específico em português",
      "categoria": "categoria geral (Moda, Casa & Decoração, Beleza, Pets, Eletrônicos, Fitness, Bebês, etc.)",
      "pais": "país de origem (Brasil, Estados Unidos, China, Portugal, etc.)",
      "visitasMensais": "estimativa de visitas mensais, ex: '1.2M' ou '480k'",
      "faturamentoEstimado": "faixa de faturamento mensal estimado em reais, ex: 'R$ 450k – R$ 800k/mês'",
      "seguidoresSociais": "estimativa de seguidores nas redes sociais, ex: '62.4k'",
      "avaliacaoMedia": número decimal entre 4.0 e 5.0,
      "crescimentoPercentual": número entre 8 e 90 representando crescimento no período,
      "tendencia": "alta" | "estavel",
      "grafico": [6 números entre 20 e 100 representando o volume relativo de vendas nos últimos 6 meses, em ordem crescente ou com pico recente — deve mostrar uma tendência de crescimento condizente com 'crescimentoPercentual'],
      "produtos": [
        {
          "nome": "nome específico do produto mais vendido",
          "produtoTermo": "termo PRECISO e literal em inglês (3 a 5 palavras) descrevendo a aparência física e função do produto, para localizar uma FOTO REAL correspondente em catálogos como AliExpress — sem termos vagos ou criativos",
          "precoFaixa": "faixa de preço em reais, ex: 'R$ 49 – R$ 89'",
          "vendasEstimadas": "estimativa de vendas mensais, ex: '8.400 vendas/mês'"
        }
      ],
      "insight": "análise de 2 frases explicando por que essa loja está crescendo tanto e o que vendedores podem aprender com ela"
    }
  ]
}

REGRAS:
- Cada loja deve ter EXATAMENTE 3 produtos no array "produtos"
- Os produtos devem ser coerentes com o nicho da loja
- Seja específico e evite generalidades — números, nomes e análises devem parecer reais
- Retorne SOMENTE o JSON`
      }]
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("JSON inválido");
      parsed = JSON.parse(match[0]);
    }

    const shopsWithImages = await Promise.all(
      (parsed.shops as Array<{ produtos: Array<{ produtoTermo?: string; nome: string } & Record<string, unknown>> } & Record<string, unknown>>).map(async (shop) => {
        const produtosComImagem = await Promise.all(
          shop.produtos.map(async (produto) => {
            const keyword = produto.produtoTermo || produto.nome;
            const image = await fetchProductImage(keyword);
            return { ...produto, image };
          })
        );
        return { ...shop, produtos: produtosComImagem };
      })
    );

    return NextResponse.json({ shops: shopsWithImages });
  } catch (error) {
    console.error("Lojas virais error:", error);
    return NextResponse.json({ error: "Erro ao gerar lojas virais" }, { status: 500 });
  }
}
