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
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const resp = data?.aliexpress_affiliate_product_query_response?.resp_result;
    if (resp?.resp_code !== 200) return "";
    const candidates: Array<{ product_main_image_url?: string; product_title?: string }> = resp?.result?.products?.product ?? [];
    if (!candidates.length) return "";
    const keywordWords = normalizeWords(cleanKeyword);
    let best = candidates[0];
    let bestScore = -1;
    for (const c of candidates) {
      const score = keywordWords.filter((w) => normalizeWords(c.product_title ?? "").includes(w)).length;
      if (score > bestScore) { bestScore = score; best = c; }
    }
    return best?.product_main_image_url ?? "";
  } catch {
    return "";
  }
}

const SYSTEM_PROMPT = `Você é um especialista em publicidade digital e inteligência de mercado, com acesso simulado à Meta Ads Library. Você gera perfis realistas de anúncios de concorrentes que estariam rodando no Facebook e Instagram para um determinado nicho. Retorne SOMENTE JSON válido, sem markdown, sem texto extra.`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 });
    }
    const q = query.trim();

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3500,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{
        role: "user",
        content: `Gere 6 anúncios de CONCORRENTES que estariam rodando no Meta Ads (Facebook/Instagram) para o nicho: "${q}".

Simule como se fossem anúncios reais da Meta Ads Library — cada um de um anunciante diferente, com dados realistas e específicos para esse nicho.

Retorne EXATAMENTE este JSON:
{
  "ads": [
    {
      "id": número de 1 a 6,
      "anunciante": "nome de marca fictício mas plausível para esse nicho (ex: 'PetAmor Brasil', 'FitZone Store')",
      "avatarLetra": "primeira letra do nome do anunciante",
      "avatarCor": "cor hex vibrante para o avatar, ex: '#E91E63'",
      "plataforma": "facebook" | "instagram" | "ambos",
      "formato": "imagem" | "video" | "carrossel",
      "titulo": "headline do anúncio — chamativo e direto, até 60 caracteres",
      "texto": "corpo do anúncio — persuasivo, 2-3 frases curtas que geram curiosidade ou urgência",
      "cta": "texto do botão CTA, ex: 'Comprar Agora', 'Saiba Mais', 'Ver Oferta', 'Aproveitar'",
      "diasAtivo": número entre 3 e 180 representando há quantos dias o anúncio está rodando,
      "regioes": "regiões principais onde o anúncio está ativo, ex: 'São Paulo, Rio de Janeiro, Brasil'",
      "publicoEstimado": "tamanho estimado do público alcançado, ex: '85k – 200k' ou '1.2M – 3M'",
      "impressoesEstimadas": "range de impressões estimadas, ex: '50k – 100k' ou '500k – 1M'",
      "objetivo": "conversao" | "trafego" | "awareness",
      "performance": "alta" | "media" | "viral",
      "produtoTermo": "termo PRECISO em inglês (3-5 palavras) para buscar uma imagem real do produto anunciado"
    }
  ]
}

REGRAS:
- Cada anúncio deve ser de um ANUNCIANTE diferente
- Os anúncios devem ser coerentes com o nicho "${q}"
- Varie os formatos, plataformas e objetivos
- Títulos e textos devem parecer anúncios reais de e-commerce brasileiro
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

    const ads = parsed.ads as Array<Record<string, unknown>>;
    const imagePromise = Promise.all(ads.map(async (ad) => {
      const keyword = ((ad.produtoTermo || ad.titulo) as string);
      const image = await fetchProductImage(keyword);
      return { ...ad, image };
    }));
    const adsWithImages = await Promise.race([
      imagePromise,
      new Promise<Array<Record<string, unknown>>>((resolve) =>
        setTimeout(() => resolve(ads.map((ad) => ({ ...ad, image: "" }))), 4500)
      ),
    ]);

    return NextResponse.json({ ads: adsWithImages });
  } catch (error) {
    console.error("Ads concorrentes error:", error);
    return NextResponse.json({ error: "Erro ao buscar anúncios" }, { status: 500 });
  }
}
