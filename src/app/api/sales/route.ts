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
    .from("user_sales")
    .select("*")
    .eq("user_id", user.id)
    .order("sold_at", { ascending: false });

  return NextResponse.json({ sales: data || [] });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_name, sale_price, cost, platform } = await req.json();

  if (!product_name || !sale_price) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const profit = parseFloat(sale_price) - (parseFloat(cost) || 0);
  const service = getServiceSupabase();

  const { error } = await service.from("user_sales").insert({
    user_id: user.id,
    product_name,
    sale_price: parseFloat(sale_price),
    profit,
    platform: platform || "shopee",
    sold_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Sales insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: profile } = await service
    .from("users")
    .select("sales_count")
    .eq("id", user.id)
    .single();

  await service
    .from("users")
    .update({ sales_count: (profile?.sales_count || 0) + 1 })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const service = getServiceSupabase();

  await service.from("user_sales").delete().eq("id", id).eq("user_id", user.id);

  const { count } = await service
    .from("user_sales")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  await service.from("users").update({ sales_count: count || 0 }).eq("id", user.id);

  return NextResponse.json({ success: true });
}
