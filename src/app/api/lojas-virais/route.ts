import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const maxDuration = 60;

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
    const { query, mercado } = await request.json();
    const q = typeof query === "string" ? query.trim() : "";
    const mercadoFiltro = typeof mercado === "string" ? mercado.trim().toLowerCase() : "todos";

    const nicheInstruction = q.length >= 2
      ? `Foque em lojas do nicho/segmento: "${q}".`
      : `Traga uma variedade de nichos populares e lucrativos (moda, casa, beleza, pets, eletrônicos, fitness, bebês).`;

    const marketInstruction = mercadoFiltro === "brasil"
      ? `Gere as 6 lojas do MERCADO BRASILEIRO (mercado: "brasil"), com faturamento em reais (R$) e canais como Shopee, Mercado Livre, Instagram e TikTok Shop Brasil.`
      : mercadoFiltro === "eua"
        ? `Gere as 6 lojas do MERCADO AMERICANO/EUA (mercado: "eua"), com faturamento em dólares (US$) e canais como Shopify, Amazon, TikTok Shop US, Etsy e Instagram Shopping.`
        : `Gere 6 lojas no TOTAL, sendo EXATAMENTE 3 do mercado brasileiro (mercado: "brasil", faturamento em R$, canais como Shopee, Mercado Livre, Instagram, TikTok Shop Brasil) e EXATAMENTE 3 do mercado americano/EUA (mercado: "eua", faturamento em US$, canais como Shopify, Amazon, TikTok Shop US, Etsy). Intercale a ordem entre os dois mercados.`;

    const produtoSchema = {
      type: "object" as const,
      properties: {
        nome: { type: "string", description: "nome específico do produto mais vendido" },
        produtoTermo: { type: "string", description: "termo PRECISO e literal em inglês (3 a 5 palavras) descrevendo a aparência física e função do produto, para localizar uma FOTO REAL correspondente em catálogos como AliExpress — sem termos vagos ou criativos" },
        precoFaixa: { type: "string", description: "faixa de preço NA MOEDA DO MERCADO (R$ para brasil, US$ para eua), ex: 'R$ 49 – R$ 89' ou 'US$ 19 – US$ 35'" },
        vendasEstimadas: { type: "string", description: "estimativa de vendas mensais, ex: '8.400 vendas/mês'" },
      },
      required: ["nome", "produtoTermo", "precoFaixa", "vendasEstimadas"],
    };

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 6000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      tools: [{
        name: "retornar_lojas",
        description: "Retorna a lista de lojas de e-commerce em alta geradas",
        input_schema: {
          type: "object",
          properties: {
            shops: {
              type: "array",
              minItems: 6,
              maxItems: 6,
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", description: "número sequencial" },
                  nome: { type: "string", description: "nome de marca fictício e plausível (condizente com o mercado: nomes brasileiros para lojas do Brasil, nomes em inglês para lojas dos EUA)" },
                  nicho: { type: "string", description: "nicho específico em português" },
                  categoria: { type: "string", description: "categoria geral (Moda, Casa & Decoração, Beleza, Pets, Eletrônicos, Fitness, Bebês, etc.)" },
                  mercado: { type: "string", enum: ["brasil", "eua"] },
                  pais: { type: "string", enum: ["Brasil", "Estados Unidos"] },
                  moeda: { type: "string", enum: ["BRL", "USD"] },
                  visitasMensais: { type: "string", description: "estimativa de visitas mensais, ex: '1.2M' ou '480k'" },
                  faturamentoEstimado: { type: "string", description: "faixa de faturamento mensal estimado NA MOEDA DO MERCADO (R$ para brasil, US$ para eua), ex: 'R$ 450k – R$ 800k/mês' ou 'US$ 90k – US$ 160k/mês'" },
                  seguidoresSociais: { type: "string", description: "estimativa de seguidores nas redes sociais, ex: '62.4k'" },
                  avaliacaoMedia: { type: "number", description: "número decimal entre 4.0 e 5.0" },
                  crescimentoPercentual: { type: "number", description: "número entre 8 e 90 representando crescimento no período" },
                  tendencia: { type: "string", enum: ["alta", "estavel"] },
                  grafico: {
                    type: "array",
                    minItems: 6,
                    maxItems: 6,
                    items: { type: "number" },
                    description: "6 números entre 20 e 100 representando o volume relativo de vendas nos últimos 6 meses, em ordem crescente ou com pico recente — deve mostrar uma tendência de crescimento condizente com 'crescimentoPercentual'",
                  },
                  principaisCanais: { type: "string", description: "2-3 canais de venda/aquisição reais e condizentes com o mercado da loja, separados por vírgula, ex: 'TikTok Shop, Instagram, Shopee' ou 'Shopify, Meta Ads, Amazon'" },
                  publicoAlvo: { type: "string", description: "descrição objetiva do público-alvo principal (idade, perfil, comportamento de compra) em 1 frase" },
                  diferencial: { type: "string", description: "o que torna essa loja diferente da concorrência e por que os clientes escolhem ela, em 1 frase" },
                  produtos: {
                    type: "array",
                    minItems: 3,
                    maxItems: 3,
                    items: produtoSchema,
                    description: "EXATAMENTE 3 produtos campeões de venda, coerentes com o nicho, mercado e moeda da loja",
                  },
                  insight: { type: "string", description: "análise de 2 frases explicando por que essa loja está crescendo tanto e o que vendedores podem aprender com ela" },
                },
                required: ["id", "nome", "nicho", "categoria", "mercado", "pais", "moeda", "visitasMensais", "faturamentoEstimado", "seguidoresSociais", "avaliacaoMedia", "crescimentoPercentual", "tendencia", "grafico", "principaisCanais", "publicoAlvo", "diferencial", "produtos", "insight"],
              },
            },
          },
          required: ["shops"],
        },
      }],
      tool_choice: { type: "tool", name: "retornar_lojas" },
      messages: [{
        role: "user",
        content: `Gere um relatório de lojas de e-commerce fictícias, porém extremamente realistas, que estariam "bombando" agora — vendendo muito e em crescimento acelerado.

${nicheInstruction}
${marketInstruction}

Para cada loja, invente um nome de marca plausível (não use marcas reais existentes) e construa um perfil completo e detalhado com produtos campeões, histórico de vendas, canais de aquisição, público-alvo e diferencial competitivo. Seja específico e evite generalidades — números, nomes e análises devem parecer reais.`
      }]
    });

    const toolUse = message.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") throw new Error("Resposta sem tool_use");
    const parsed = toolUse.input as { shops: unknown };

    const shops = parsed.shops as Array<{ produtos: Array<Record<string, unknown>> } & Record<string, unknown>>;
    const imagePromise = Promise.all(
      shops.map(async (shop) => {
        const produtosComImagem = await Promise.all(
          shop.produtos.map(async (produto) => {
            const keyword = ((produto.produtoTermo || produto.nome) as string);
            const image = await fetchProductImage(keyword);
            return { ...produto, image };
          })
        );
        return { ...shop, produtos: produtosComImagem };
      })
    );
    const shopsWithImages = await Promise.race([
      imagePromise,
      new Promise<typeof shops>((resolve) => setTimeout(() => resolve(shops), 4500)),
    ]);

    return NextResponse.json({ shops: shopsWithImages });
  } catch (error) {
    console.error("Lojas virais error:", error);
    return NextResponse.json({ error: "Erro ao gerar lojas virais" }, { status: 500 });
  }
}
