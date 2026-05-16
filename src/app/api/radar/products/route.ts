import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é um especialista em análise de mercado da Shopee Brasil com acesso a dados em tempo real de tendências e vendas. Sua função é identificar os produtos com maior potencial de lucro para vendedores iniciantes neste momento.

Retorne SOMENTE um JSON válido, sem markdown, sem texto extra.`;

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
          content: `Hoje é ${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}. Identificador de sessão: ${seed}.

Gere 8 produtos DIFERENTES e VARIADOS que estão vendendo bem na Shopee Brasil AGORA. Priorize produtos das categorias: ${primaryCategory}, ${secondaryCategory} e ${tertiaryCategory}.

Regras importantes:
- Cada produto deve ser de uma subcategoria diferente (não repita categorias)
- Inclua produtos de nicho pouco explorados, não os óbvios
- Varie entre produtos virais, produtos evergreen e tendências sazonais
- Priorize itens leves (fácil envio) com margem acima de 40%
- Seja criativo — evite os produtos genéricos como "capinha de celular" ou "fone bluetooth"

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
      "analysis": "análise prática de 2-3 frases: por que vende, margem real, dica de diferenciação"
    }
  ]
}

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

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Radar products error:", error);
    return NextResponse.json({ error: "Erro ao carregar produtos" }, { status: 500 });
  }
}
