import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs: { name: string; value: string; options?: Record<string, unknown> }[]) =>
          cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options as never)),
      },
    }
  );
}

export async function GET() {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("user_sales")
    .select("*")
    .eq("user_id", user.id)
    .order("sold_at", { ascending: false });

  return NextResponse.json({ sales: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_name, sale_price, cost, platform } = await req.json();

  if (!product_name || !sale_price) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const profit = parseFloat(sale_price) - (parseFloat(cost) || 0);

  const { error } = await supabase.from("user_sales").insert({
    user_id: user.id,
    product_name,
    sale_price: parseFloat(sale_price),
    profit,
    platform: platform || "shopee",
    sold_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Atualiza contador de vendas
  const { data: profile } = await supabase
    .from("users")
    .select("sales_count")
    .eq("id", user.id)
    .single();

  await supabase
    .from("users")
    .update({ sales_count: (profile?.sales_count || 0) + 1 })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await supabase.from("user_sales").delete().eq("id", id).eq("user_id", user.id);

  // Recalcula contador
  const { count } = await supabase
    .from("user_sales")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase.from("users").update({ sales_count: count || 0 }).eq("id", user.id);

  return NextResponse.json({ success: true });
}
