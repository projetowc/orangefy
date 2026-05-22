import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email || session.customer_email;
    const name  = session.customer_details?.name || email || "Cliente";
    const planMeta = session.metadata?.plan;
    const plan = (planMeta === "quarterly" ? "quarterly" : "monthly") as "quarterly" | "monthly";

    if (!email) {
      console.error("No email in session");
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    await supabase.from("purchases").upsert({
      email: email.toLowerCase(),
      name,
      plan,
      purchased_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ received: true });
}
