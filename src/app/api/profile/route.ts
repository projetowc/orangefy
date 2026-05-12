import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase";

async function getUserFromToken(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await client.auth.getUser(token);
  return user;
}

// Create profile if it doesn't exist
export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const service = getServiceSupabase();

  const { data: existing } = await service
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existing) return NextResponse.json({ exists: true });

  const { error } = await service.from("users").insert({
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || user.email?.split("@")[0] || "Usuário",
    plan: user.user_metadata?.plan || "monthly",
    status: "active",
    xp: 0,
    level: 1,
    sales_count: 0,
    shopee_score: 0,
    streak_days: 0,
  });

  if (error) {
    console.error("Profile create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ created: true });
}

// Update profile name
export async function PATCH(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const name = (body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Nome inválido" }, { status: 400 });

  const service = getServiceSupabase();
  const { error } = await service.from("users").update({ name }).eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
