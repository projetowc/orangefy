import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é um especialista em sourcing e fornecedores para vendedores da Shopee Brasil. Retorne SOMENTE JSON válido, sem markdown, sem texto extra.`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: `O vendedor quer encontrar fornecedores para o nicho/produto: "${query.trim()}".

Retorne SOMENTE este JSON com os melhores fornecedores reais para esse nicho no Brasil:

{
  "nicho": "nome limpo do nicho/produto analisado",
  "insight": "1-2 frases com dica estratégica sobre fornecimento neste nicho",
  "fornecedores": [
    {
      "nome": "Nome real do fornecedor",
      "site": "site.com.br",
      "tipo": "Dropshipping" | "Atacado Nacional" | "Importado",
      "pedidoMinimo": "ex: Sem mínimo / R$200 / 10 unidades",
      "prazoEntrega": "ex: 3–7 dias / 15–30 dias",
      "aceitaCPF": true | false,
      "destaque": "principal vantagem deste fornecedor em 1 frase curta",
      "nicho": "categoria principal que atende"
    }
  ]
}

Regras:
- Retorne entre 6 e 9 fornecedores REAIS e conhecidos no mercado brasileiro
- Misture tipos: pelo menos 2 dropshipping, 2 atacado nacional, 2 importado
- Priorize fornecedores com boa reputação no Brasil
- Se o nicho for moda/roupas, inclua atacadistas do Brás e Feira da Madrugada
- Se for eletrônicos, inclua Santa Ifigênia e importadores confiáveis
- Se for pets, casa, beleza — indique distribuidores nacionais conhecidos
- NUNCA invente fornecedores fictícios
- Retorne SOMENTE o JSON`,
        },
      ],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    let data;
    try {
      data = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("JSON inválido");
      data = JSON.parse(match[0]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fornecedores search error:", error);
    return NextResponse.json({ error: "Erro ao buscar fornecedores" }, { status: 500 });
  }
}
