import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase";

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

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = getServiceSupabase();
  const { data } = await service
    .from("saved_products")
    .select("id, product, criado_em")
    .eq("user_id", user.id)
    .order("criado_em", { ascending: false });

  return NextResponse.json({ saved: data || [] });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product } = await req.json();
  if (!product || typeof product !== "object" || !product.name) {
    return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
  }

  const service = getServiceSupabase();
  const { data, error } = await service
    .from("saved_products")
    .insert({ user_id: user.id, product })
    .select("id, product, criado_em")
    .single();

  if (error) {
    console.error("Saved products insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: data });
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const service = getServiceSupabase();
  await service.from("saved_products").delete().eq("id", id).eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
