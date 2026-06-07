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
    };
    params.sign = signAliExpressParams(params, appSecret);
    const url = "https://api-sg.aliexpress.com/sync?" + new URLSearchParams(params).toString();
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    const resp = data?.aliexpress_affiliate_product_query_response?.resp_result;
    if (resp?.resp_code !== 200) {
      console.error(`AliExpress error for "${shortKeyword}":`, resp?.resp_msg, resp?.resp_code);
    }
    return resp?.result?.products?.product?.[0]?.product_main_image_url ?? "";
  } catch (err) {
    console.error(`AliExpress fetch error for "${shortKeyword}":`, err);
    return "";
  }
}

const SYSTEM_PROMPT = `Você é um especialista em publicidade digital e marketing de performance para e-commerce brasileiro. Analisa padrões de anúncios vencedores no Meta (Facebook/Instagram) e TikTok. Retorne SOMENTE JSON válido, sem markdown, sem texto extra.`;

export async function POST(request: NextRequest) {
  try {
    const { query, platform, format } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 });
    }

    const platformFilter = platform && platform !== "todos" ? `Foque em anúncios para a plataforma: ${platform === "meta" ? "Meta (Facebook/Instagram)" : "TikTok"}.` : "Inclua anúncios para Meta e TikTok.";
    const formatFilter = format && format !== "todos" ? `Foque no formato: ${format}.` : "Varie os formatos entre vídeo, imagem e carrossel.";

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{
        role: "user",
        content: `Gere 6 conceitos de anúncios vencedores para o nicho/produto: "${query.trim()}"

${platformFilter}
${formatFilter}

Baseie-se em padrões reais de anúncios de alta performance no mercado brasileiro de e-commerce.

Retorne EXATAMENTE este JSON:
{
  "ads": [
    {
      "id": número de 1 a 6,
      "produtoTermo": "termo de busca em inglês para o produto anunciado, 2-4 palavras (ex: 'bluetooth earphones', 'led desk lamp')",
      "platform": "meta" | "tiktok",
      "format": "video" | "imagem" | "carrossel",
      "hook": "gancho de abertura impactante (primeiros 3 segundos ou primeira frase - seja criativo e específico)",
      "headline": "título principal do anúncio",
      "copy": "texto do anúncio de 2-3 frases diretas e persuasivas",
      "cta": "texto do botão de ação (ex: Comprar Agora, Ver Oferta, Quero Esse)",
      "audiencia": "público-alvo específico (idade, interesses, comportamentos)",
      "performance": "viral" | "alta" | "media",
      "diasRodando": número entre 7 e 120,
      "objetivo": "conversao" | "trafego" | "awareness",
      "dica": "dica prática e específica para executar esse anúncio com sucesso"
    }
  ]
}

Retorne SOMENTE o JSON.`
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

    const adsWithImages = await Promise.all(
      (parsed.ads as Array<{ produtoTermo?: string; headline: string } & Record<string, unknown>>).map(async (ad) => {
        const keyword = ad.produtoTermo || ad.headline;
        const image = await fetchProductImage(keyword);
        return { ...ad, image };
      })
    );

    return NextResponse.json({ ads: adsWithImages });
  } catch (error) {
    console.error("Anúncios virais error:", error);
    return NextResponse.json({ error: "Erro ao gerar anúncios" }, { status: 500 });
  }
}
