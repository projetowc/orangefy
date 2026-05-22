import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Radar search error:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}
