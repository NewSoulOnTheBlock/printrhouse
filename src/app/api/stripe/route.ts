import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ ok: true, demo: true, message: "Stripe not configured. Add STRIPE_SECRET_KEY to .env.local." });
  }
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(key);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: body.items.map((i: any) => ({
      price_data: { currency: "usd", product_data: { name: `${i.name} (${i.size}/${i.color})` }, unit_amount: Math.round(i.priceUsd * 100) },
      quantity: i.qty,
    })),
    success_url: `${req.nextUrl.origin}/checkout?ok=1`,
    cancel_url: `${req.nextUrl.origin}/checkout?cancelled=1`,
  });
  return NextResponse.json({ url: session.url });
}
