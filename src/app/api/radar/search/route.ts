import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é um especialista em vendas no Shopee Brasil e análise de mercado de e-commerce. Sua função é analisar produtos e retornar recomendações detalhadas para vendedores iniciantes.

Quando receber uma busca por produto, retorne EXATAMENTE um JSON válido com o seguinte formato, sem nenhum texto antes ou depois:

{
  "products": [
    {
      "id": número único,
      "name": "nome do produto em português",
      "score": número entre 50 e 95,
      "margin": número percentual estimado entre 30 e 75,
      "competition": "Baixa" | "Média" | "Alta",
      "difficulty": "Fácil" | "Médio" | "Difícil",
      "trend": "up" | "stable" | "down",
      "tags": array com 1-3 de: ["viral", "high-margin", "easy", "trending", "easy-shipping"],
      "avgPrice": "R$XX–R$XX",
      "category": "categoria em português",
      "analysis": "análise de 2-3 frases em português explicando por que é bom produto, margem esperada, nível de concorrência e dica prática para o iniciante"
    }
  ]
}

Regras importantes:
- Retorne entre 6 e 9 produtos relacionados ao que o usuário pesquisou
- Foque em produtos que realmente vendem bem no Shopee Brasil
- Priorize produtos leves (fácil envio), com boa margem e baixa concorrência
- O score deve refletir o potencial real: margem alta + concorrência baixa = score alto
- A análise deve ser prática e útil para iniciantes no dropshipping/revenda
- Sugira variações e produtos complementares relacionados à busca
- Seja realista com preços do mercado brasileiro
- Apenas retorne o JSON, sem markdown, sem explicação`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Busca do usuário: "${query.trim()}"

Retorne produtos relacionados a esta busca que vendam bem no Shopee Brasil. Inclua o produto exato pesquisado e variações/complementos relevantes.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Resposta da IA não é JSON válido");
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Radar search error:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}
