import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cakto-signature") || req.headers.get("authorization");

  if (secret !== process.env.CAKTO_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    event?: string;
    customer?: { email?: string; name?: string };
    product?: { id?: string; name?: string };
    plan?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, customer, plan } = body;

  if (event !== "payment.completed" && event !== "subscription.active") {
    return NextResponse.json({ message: "Event ignored" });
  }

  if (!customer?.email) {
    return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  const planType = plan?.includes("annual") || plan?.includes("anual") ? "annual" : "monthly";

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", customer.email)
    .single();

  if (existing) {
    await supabase
      .from("users")
      .update({ status: "active", plan: planType })
      .eq("email", customer.email);
  } else {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://orangefy-rlhr.vercel.app";

    const { error: authError } = await supabase.auth.admin.inviteUserByEmail(customer.email, {
      redirectTo: `${appUrl}/auth/callback`,
      data: {
        name: customer.name || customer.email,
        plan: planType,
        status: "active",
      },
    });

    if (authError) {
      console.error("Supabase invite error:", authError);
      return NextResponse.json({ error: "Failed to invite user" }, { status: 500 });
    }

    await supabase.from("users").upsert({
      email: customer.email,
      name: customer.name || customer.email,
      plan: planType,
      status: "active",
      xp: 0,
      level: 1,
      sales_count: 0,
      shopee_score: 0,
    });
  }

  return NextResponse.json({ success: true, message: "User access granted" });
}
