import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICES = {
  monthly:  process.env.STRIPE_PRICE_MONTHLY!,
  lifetime: process.env.STRIPE_PRICE_LIFETIME!,
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || !PRICES[plan as keyof typeof PRICES]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const isLifetime = plan === "lifetime";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://orangefy-shop.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? "payment" : "subscription",
      line_items: [{ price: PRICES[plan as keyof typeof PRICES], quantity: 1 }],
      success_url: `${appUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#planos`,
      locale: "pt-BR",
      metadata: { plan },
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
