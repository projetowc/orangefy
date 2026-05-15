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
  const planLower = plan?.toLowerCase() || "";
  const planType = planLower.includes("vitalicio") || planLower.includes("lifetime") || planLower.includes("vitalício")
    ? "lifetime"
    : planLower.includes("annual") || planLower.includes("anual")
    ? "annual"
    : "monthly";

  // Apenas registra a compra — o cliente cria a senha na plataforma
  await supabase.from("purchases").upsert({
    email: customer.email.toLowerCase(),
    name: customer.name || customer.email,
    plan: planType,
    purchased_at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, message: "Purchase registered" });
}
