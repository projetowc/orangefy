import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é um especialista em análise de mercado da Shopee Brasil. Analise produtos/nichos e retorne dados de mercado realistas. Responda SOMENTE com JSON válido, sem markdown, sem texto extra.`;

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await client.auth.getUser(token);
  return user;
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 });
    }

    const user = await getUserFromRequest(req);

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: `O usuário quer fazer spy de concorrentes para o produto/nicho: "${query.trim()}".

Simule uma análise realista de mercado da Shopee Brasil e retorne SOMENTE um JSON válido com esta estrutura exata:

{
  "produto": "nome limpo do produto analisado",
  "demanda": "Alta",
  "concorrencia": "Alta",
  "faixaPreco": { "min": 0, "max": 0 },
  "scoreOportunidade": 0,
  "nichoCorrelato": "sugestão de nicho com menos concorrência",
  "palavrasChave": ["p1", "p2", "p3", "p4", "p5"],
  "insight": "1 insight estratégico em português, máx 2 frases",
  "produtosConcorrentes": [
    {
      "nome": "nome exato do produto mais vendido pelos concorrentes",
      "precoMedio": 0,
      "volumeVendas": "Alto",
      "diferencial": "o que faz esse produto se destacar na Shopee"
    }
  ]
}

Regras:
- demanda e concorrencia: "Alta", "Média" ou "Baixa"
- scoreOportunidade: 0 a 100 (100 = máxima oportunidade)
- faixaPreco em reais (R$)
- produtosConcorrentes: exatamente 4 itens, produtos reais que concorrentes vendem bastante nesse nicho na Shopee Brasil
- volumeVendas: "Alto", "Médio" ou "Baixo"
- precoMedio em número (sem R$)
- diferencial: 1 frase curta explicando o diferencial competitivo
- Seja realista com o mercado brasileiro
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
      if (!match) throw new Error("Resposta inválida da IA");
      data = JSON.parse(match[0]);
    }

    if (user) {
      const service = getServiceSupabase();
      await service.from("spy_historico").insert({
        user_id: user.id,
        query: query.trim(),
        resultado: data,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Spy route error:", error);
    return NextResponse.json({ error: "Erro ao analisar produto" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = getServiceSupabase();
  const { data } = await service
    .from("spy_historico")
    .select("id, query, resultado, criado_em")
    .eq("user_id", user.id)
    .order("criado_em", { ascending: false })
    .limit(5);

  return NextResponse.json({ historico: data || [] });
}
