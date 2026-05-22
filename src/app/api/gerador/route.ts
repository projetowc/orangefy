import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MARKETPLACE_RULES: Record<string, string> = {
  shopee: `
- Título: máximo 120 caracteres, inclua palavras-chave principais no início, use | para separar, mencione "Frete Grátis" se possível
- Descrição: use emojis estratégicos (✅ 📦 ⭐ 🔥 💥), destaque benefícios, inclua política de envio, mencione chat disponível
- Palavras-chave: foco em buscas do consumidor brasileiro na Shopee, termos populares
- Formato: descreva como se fosse uma loja pequena/pessoal no Shopee`,

  mercadolivre: `
- Título: máximo 60 caracteres, SEM emojis no título, objetivo e técnico, inclua marca/modelo se relevante
- Descrição: mais formal e técnica, use bullet points com traço (-), especificações técnicas, condição do produto (Novo)
- Palavras-chave: termos técnicos e específicos, como o consumidor busca no ML
- Formato: profissional, sem gírias, mencione garantia e NF`,

  amazon: `
- Título: máximo 200 caracteres, inclua marca + produto + característica principal + compatibilidade
- Descrição: 5 bullet points no formato "• BENEFÍCIO: descrição", foco em features e benefícios, linguagem persuasiva
- Palavras-chave: SEO-focused, backend keywords, termos de busca específicos
- Formato: profissional americano adaptado ao Brasil, mencione Prime se aplicável`,

  magalu: `
- Título: máximo 100 caracteres, claro e direto, inclua especificação principal
- Descrição: limpa e organizada, foco em especificações técnicas, use tópicos numerados
- Palavras-chave: buscas de consumidor final no Magazine Luiza
- Formato: institucional e confiável, mencione garantia do fabricante`,

  americanas: `
- Título: máximo 100 caracteres, direto ao ponto, inclua modelo/versão
- Descrição: objetiva, especificações em lista, foco em entrega rápida e garantia
- Palavras-chave: termos populares no e-commerce brasileiro
- Formato: simples e claro, sem exageros`,

  shopify: `
- Título: conciso e atrativo, foco no benefício principal
- Descrição: storytelling do produto, por que comprar, HTML básico permitido, 200-400 palavras
- Palavras-chave: SEO para Google, long-tail keywords
- Formato: moderno e sofisticado, foco na experiência do cliente`,
};

export async function POST(req: NextRequest) {
  try {
    const { product, category, benefits, marketplace, price, details } = await req.json();

    if (!product || !marketplace) {
      return NextResponse.json({ error: "Produto e marketplace são obrigatórios" }, { status: 400 });
    }

    const rules = MARKETPLACE_RULES[marketplace] || MARKETPLACE_RULES.shopee;
    const marketplaceNames: Record<string, string> = {
      shopee: "Shopee Brasil",
      mercadolivre: "Mercado Livre Brasil",
      amazon: "Amazon Brasil",
      magalu: "Magazine Luiza",
      americanas: "Americanas",
      shopify: "Shopify / Loja Própria",
    };

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: `Você é um especialista em copywriting e criação de anúncios para e-commerce brasileiro. Cria anúncios otimizados que vendem, seguindo as melhores práticas de cada marketplace. Retorne SOMENTE JSON válido.`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Crie um anúncio completo e otimizado para o marketplace: ${marketplaceNames[marketplace]}

PRODUTO: ${product}
CATEGORIA: ${category || "Geral"}
PREÇO SUGERIDO: ${price ? `R$${price}` : "a definir"}
BENEFÍCIOS/DIFERENCIAIS: ${benefits || "qualidade, entrega rápida"}
DETALHES EXTRAS: ${details || "nenhum"}

REGRAS ESPECÍFICAS PARA ${marketplaceNames[marketplace]}:
${rules}

Retorne EXATAMENTE este JSON:
{
  "titulo": "título otimizado seguindo as regras do marketplace",
  "descricao": "descrição completa formatada para o marketplace (use \\n para quebras de linha)",
  "palavrasChave": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5", "palavra6", "palavra7", "palavra8"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "precoSugerido": "R$XX,XX",
  "dicaVendedor": "1 dica estratégica específica para vender bem neste marketplace",
  "callToAction": "chamada para ação otimizada para este marketplace"
}

Retorne SOMENTE o JSON.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
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
    console.error("Gerador error:", error);
    return NextResponse.json({ error: "Erro ao gerar anúncio" }, { status: 500 });
  }
}
