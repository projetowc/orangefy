import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Lista curada de fornecedores reais e verificados
// A IA NUNCA inventa URLs — apenas seleciona desta lista
const VERIFIED_SUPPLIERS = [
  // DROPSHIPPING
  { id: "aliexpress",       nome: "AliExpress",        site: "aliexpress.com",        tipo: "Dropshipping",     pedidoMinimo: "Sem mínimo",            prazoEntrega: "15–45 dias", aceitaCPF: true,  tags: ["geral","eletrônicos","moda","casa","beleza","pets","acessórios","fitness","papelaria","automotivo"] },
  { id: "cjdropshipping",   nome: "CJ Dropshipping",   site: "cjdropshipping.com",    tipo: "Dropshipping",     pedidoMinimo: "Sem mínimo",            prazoEntrega: "7–20 dias",  aceitaCPF: true,  tags: ["geral","eletrônicos","moda","casa","beleza","acessórios","pets","fitness"] },
  { id: "dropi",            nome: "Dropi",             site: "dropi.com.br",          tipo: "Dropshipping",     pedidoMinimo: "Sem mínimo",            prazoEntrega: "3–8 dias",   aceitaCPF: true,  tags: ["geral","moda","casa","beleza","fitness","pets","acessórios"] },
  { id: "dsers",            nome: "DSers",             site: "dsers.com",             tipo: "Dropshipping",     pedidoMinimo: "Sem mínimo",            prazoEntrega: "15–45 dias", aceitaCPF: true,  tags: ["geral","eletrônicos","casa","moda"] },
  { id: "spocket",          nome: "Spocket",           site: "spocket.co",            tipo: "Dropshipping",     pedidoMinimo: "Plano a partir de $24", prazoEntrega: "5–15 dias",  aceitaCPF: true,  tags: ["geral","moda","casa","beleza","acessórios"] },
  { id: "shein-parceiro",   nome: "Shein Parceiros",   site: "shein.com/br",          tipo: "Dropshipping",     pedidoMinimo: "Sem mínimo",            prazoEntrega: "10–20 dias", aceitaCPF: true,  tags: ["moda","roupas","acessórios","beleza"] },

  // ATACADO NACIONAL
  { id: "brasOnline",       nome: "Brás Online",       site: "brasonline.com.br",     tipo: "Atacado Nacional", pedidoMinimo: "R$100",                 prazoEntrega: "3–7 dias",   aceitaCPF: false, tags: ["moda","roupas","acessórios","bolsas","calçados"] },
  { id: "atacadoNet",       nome: "Atacado.net",       site: "atacado.net",           tipo: "Atacado Nacional", pedidoMinimo: "Varia por produto",     prazoEntrega: "3–10 dias",  aceitaCPF: true,  tags: ["geral","casa","beleza","fitness","papelaria","pets"] },
  { id: "martins",          nome: "Martins Atacado",   site: "martins.com.br",        tipo: "Atacado Nacional", pedidoMinimo: "R$300",                 prazoEntrega: "3–7 dias",   aceitaCPF: false, tags: ["geral","beleza","casa","higiene","alimentos"] },
  { id: "dentalCremer",     nome: "Dental Cremer",     site: "dentalcremer.com.br",   tipo: "Atacado Nacional", pedidoMinimo: "R$150",                 prazoEntrega: "3–7 dias",   aceitaCPF: false, tags: ["beleza","saúde","higiene","estética"] },
  { id: "unibolso",         nome: "Unibolso",          site: "unibolso.com.br",       tipo: "Atacado Nacional", pedidoMinimo: "6 unidades",            prazoEntrega: "5–10 dias",  aceitaCPF: false, tags: ["acessórios","bolsas","moda","carteiras"] },
  { id: "modaCenter",       nome: "Moda Center Santa Cruz", site: "modacenter.com.br",tipo: "Atacado Nacional", pedidoMinimo: "R$200",                 prazoEntrega: "5–12 dias",  aceitaCPF: false, tags: ["moda","roupas","acessórios","calçados"] },
  { id: "amorettoAtacado",  nome: "Amorretto Atacado", site: "amorettoatacado.com.br",tipo: "Atacado Nacional", pedidoMinimo: "12 peças",              prazoEntrega: "5–10 dias",  aceitaCPF: false, tags: ["moda","roupas","moda feminina"] },
  { id: "petlandia",        nome: "Petlandia Atacado", site: "petlandia.com.br",      tipo: "Atacado Nacional", pedidoMinimo: "R$250",                 prazoEntrega: "5–10 dias",  aceitaCPF: false, tags: ["pets","animais"] },
  { id: "kalunga",          nome: "Kalunga Empresas",  site: "kalunga.com.br",        tipo: "Atacado Nacional", pedidoMinimo: "R$500",                 prazoEntrega: "3–7 dias",   aceitaCPF: false, tags: ["papelaria","escritório","eletrônicos","estudo"] },

  // IMPORTADO
  { id: "alibaba",          nome: "Alibaba",           site: "alibaba.com",           tipo: "Importado",        pedidoMinimo: "50+ unidades",          prazoEntrega: "20–60 dias", aceitaCPF: true,  tags: ["geral","eletrônicos","moda","casa","beleza","pets","acessórios","fitness","automotivo"] },
  { id: "dhgate",           nome: "DHgate",            site: "dhgate.com",            tipo: "Importado",        pedidoMinimo: "1–10 unidades",         prazoEntrega: "15–40 dias", aceitaCPF: true,  tags: ["geral","eletrônicos","moda","acessórios","casa","relógios","fitness"] },
  { id: "madeinchina",      nome: "Made-in-China",     site: "made-in-china.com",     tipo: "Importado",        pedidoMinimo: "50+ unidades",          prazoEntrega: "20–50 dias", aceitaCPF: true,  tags: ["geral","eletrônicos","casa","automotivo","fitness","ferramentas"] },
  { id: "globalsources",    nome: "Global Sources",    site: "globalsources.com",     tipo: "Importado",        pedidoMinimo: "Varia por fornecedor",  prazoEntrega: "20–45 dias", aceitaCPF: true,  tags: ["eletrônicos","acessórios","casa","automotivo"] },
  { id: "1688",             nome: "1688.com",          site: "1688.com",              tipo: "Importado",        pedidoMinimo: "Sem mínimo fixo",       prazoEntrega: "20–40 dias", aceitaCPF: true,  tags: ["geral","moda","acessórios","casa","beleza","papelaria"] },
];

const SYSTEM_PROMPT = `Você é especialista em sourcing para vendedores da Shopee Brasil. Retorne SOMENTE JSON válido, sem markdown, sem texto extra.`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 });
    }

    const suppliersJson = JSON.stringify(VERIFIED_SUPPLIERS.map(({ id, nome, tipo, tags }) => ({ id, nome, tipo, tags })));

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: `Nicho buscado: "${query.trim()}"

Lista de fornecedores disponíveis (com seus IDs e categorias):
${suppliersJson}

Selecione entre 6 e 8 fornecedores da lista acima que sejam mais relevantes para o nicho "${query.trim()}". Para cada um, escreva um "destaque" e um "nicho" específicos para este produto/nicho.

Retorne SOMENTE este JSON:
{
  "nicho": "nome limpo do nicho pesquisado",
  "insight": "1-2 frases com dica estratégica de sourcing para este nicho no Brasil",
  "selecionados": [
    {
      "id": "id exato do fornecedor da lista",
      "destaque": "vantagem específica deste fornecedor para o nicho pesquisado, em 1 frase",
      "nicho": "categoria específica que este fornecedor atende neste contexto"
    }
  ]
}

IMPORTANTE: use apenas IDs que existem na lista acima. Não invente IDs.`,
        },
      ],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    let aiData: { nicho: string; insight: string; selecionados: { id: string; destaque: string; nicho: string }[] };
    try {
      aiData = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("JSON inválido");
      aiData = JSON.parse(match[0]);
    }

    // Monta resultado final combinando dados verificados com descrições da IA
    const fornecedores = aiData.selecionados
      .map((sel) => {
        const verified = VERIFIED_SUPPLIERS.find((s) => s.id === sel.id);
        if (!verified) return null;
        return {
          nome: verified.nome,
          site: verified.site,
          tipo: verified.tipo,
          pedidoMinimo: verified.pedidoMinimo,
          prazoEntrega: verified.prazoEntrega,
          aceitaCPF: verified.aceitaCPF,
          destaque: sel.destaque,
          nicho: sel.nicho,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      nicho: aiData.nicho,
      insight: aiData.insight,
      fornecedores,
    });
  } catch (error) {
    console.error("Fornecedores search error:", error);
    return NextResponse.json({ error: "Erro ao buscar fornecedores" }, { status: 500 });
  }
}
