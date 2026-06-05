import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRICES = {
  monthly:   process.env.STRIPE_PRICE_MONTHLY!,
  quarterly: process.env.STRIPE_PRICE_QUARTERLY!,
};

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { plan } = await req.json();

    if (!plan || !PRICES[plan as keyof typeof PRICES]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://orangefy-shop.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
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
