import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const normalizedEmail = email.toLowerCase().trim();

  // Verifica se o e-mail tem uma compra aprovada
  const { data: purchase } = await supabase
    .from("purchases")
    .select("email, name, plan")
    .eq("email", normalizedEmail)
    .single();

  if (!purchase) {
    return NextResponse.json({
      error: "E-mail não encontrado. Verifique se utilizou o mesmo e-mail da compra ou adquira o acesso.",
      notPurchased: true,
    }, { status: 403 });
  }

  // Verifica se já tem conta criada
  const { data: existing } = await supabase.auth.admin.listUsers();
  const alreadyExists = existing?.users?.find(
    (u) => u.email?.toLowerCase() === normalizedEmail
  );

  if (alreadyExists) {
    return NextResponse.json({
      error: "Conta já criada com este e-mail. Faça login normalmente ou redefina sua senha.",
      alreadyExists: true,
    }, { status: 409 });
  }

  // Cria a conta no Supabase Auth
  const { data: authData, error: createError } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      name: purchase.name,
      plan: purchase.plan,
    },
  });

  if (createError || !authData?.user) {
    return NextResponse.json({ error: "Erro ao criar conta. Tente novamente." }, { status: 500 });
  }

  // Cria o perfil do usuário
  await supabase.from("users").insert({
    id: authData.user.id,
    email: normalizedEmail,
    name: purchase.name,
    plan: purchase.plan,
    status: "active",
    xp: 0,
    level: 1,
    sales_count: 0,
    shopee_score: 0,
    streak_days: 0,
  });

  return NextResponse.json({ success: true });
}
