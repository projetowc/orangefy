import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// Rota apenas para ambiente de desenvolvimento e testes internos
// Protegida pelo ADMIN_SECRET — nunca exposta ao público
export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name, plan } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://orangefy-rlhr.vercel.app";

  // Verifica se já existe
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json({ message: "Usuário já existe", existing: true });
  }

  // Envia convite (mesmo fluxo do webhook da Cakto)
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/auth/callback`,
    data: {
      name: name || email,
      plan: plan || "monthly",
      status: "active",
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("users").upsert({
    email,
    name: name || email,
    plan: plan || "monthly",
    status: "active",
    xp: 0,
    level: 1,
    sales_count: 0,
    shopee_score: 0,
  });

  return NextResponse.json({
    success: true,
    message: `Convite enviado para ${email}. Verifique a caixa de entrada.`,
  });
}
