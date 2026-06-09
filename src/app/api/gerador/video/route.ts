import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é um especialista em criação de conteúdo viral para TikTok, Instagram Reels e YouTube Shorts, com foco em vídeos de anúncio de produtos para e-commerce brasileiro. Retorne SOMENTE JSON válido, sem markdown, sem texto extra.`;

export async function POST(request: NextRequest) {
  try {
    const { product, category, benefits, price, details, platform } = await request.json();

    if (!product || typeof product !== "string" || product.trim().length < 2) {
      return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
    }

    const platformLabel = platform === "reels" ? "Instagram Reels" : platform === "shorts" ? "YouTube Shorts" : "TikTok";
    const duracao = platform === "shorts" ? "30–60 segundos" : "15–30 segundos";

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{
        role: "user",
        content: `Crie um roteiro de vídeo de anúncio para ${platformLabel} do seguinte produto:

Produto: ${product.trim()}
${category ? `Categoria: ${category}` : ""}
${benefits ? `Benefícios: ${benefits}` : ""}
${price ? `Preço: R$${price}` : ""}
${details ? `Detalhes: ${details}` : ""}

O roteiro deve seguir a fórmula comprovada de vídeos virais de produto: GANCHO → PROBLEMA → SOLUÇÃO → PROVA/BENEFÍCIOS → OFERTA → CTA.
Duração total: ${duracao}.

Retorne EXATAMENTE este JSON:
{
  "plataforma": "${platformLabel}",
  "duracaoTotal": "duração total ex: '28 segundos'",
  "formato": "ex: 'Vertical 9:16 — 1080x1920px'",
  "musicaSugerida": "descrição do tipo de música ideal ex: 'Beat animado e acelerado, trending no TikTok — pesquise: upbeat product ad music'",
  "gancho": "frase de gancho impactante dos primeiros 3 segundos que vai parar o scroll",
  "cenas": [
    {
      "numero": 1,
      "tipo": "GANCHO",
      "tempoInicio": "0s",
      "tempoFim": "3s",
      "visual": "descrição do que aparece na tela (ângulo, ação, elementos visuais)",
      "legenda": "texto exibido na tela (curto, impactante, em caixa alta se necessário)",
      "narracao": "fala ou voz over — escreva exatamente o que será dito, ou 'sem narração' se for só música",
      "dica": "dica prática de como gravar/executar essa cena"
    }
  ],
  "dicaGravacao": "3 dicas práticas de gravação para esse produto específico",
  "dicaEdicao": "3 dicas de edição no CapCut ou similar para esse tipo de vídeo",
  "cta": "chamada para ação final clara e direta"
}

REGRAS:
- Gere entre 6 e 8 cenas cobrindo todo o roteiro
- Cada cena deve ter legenda curta (máximo 8 palavras) — pense em texto de tela de TikTok
- Narração deve soar natural e brasileiro, não corporativo
- O gancho DEVE ser surpreendente ou provocativo — é o que para o scroll
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

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gerador vídeo error:", error);
    return NextResponse.json({ error: "Erro ao gerar roteiro. Tente novamente." }, { status: 500 });
  }
}
