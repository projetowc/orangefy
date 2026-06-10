import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://orange-fy.com";

  // Tenta convidar — se já existe, gera link de redefinição de senha
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/auth/callback`,
    data: { name: name || email, plan: plan || "monthly", status: "active" },
  });

  if (inviteError) {
    // Usuário já cadastrado — gera link de acesso/recuperação de senha
    if (inviteError.message.includes("already been registered") || inviteError.code === "email_exists") {
      const { data, error: resetError } = await supabase.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo: `${appUrl}/auth/callback` },
      });

      if (resetError) {
        return NextResponse.json({ error: resetError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        existing: true,
        message: `Usuário já existia. Link de acesso enviado para ${email}.`,
        link: data?.properties?.action_link, // só visível aqui, nunca no front
      });
    }

    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  // Cria o perfil na tabela users
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
