import { NextRequest, NextResponse } from "next/server";
import { printify } from "@/lib/printify";

// Submits an order to Printify. Falls back to Printful if PRINTIFY_API_KEY isn't set.
// Real provider only — no demo path when keys are present.
export async function POST(req: NextRequest) {
  const order = await req.json();
  const printifyKey = process.env.PRINTIFY_API_KEY;
  const printful = process.env.PRINTFUL_API_KEY;

  if (printifyKey) {
    try {
      const data = await printify.createOrder(order);
      return NextResponse.json({ ok: true, provider: "printify", data });
    } catch (e: any) {
      return NextResponse.json({ ok: false, provider: "printify", error: e.message }, { status: 502 });
    }
  }

  if (printful) {
    const res = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${printful}`, "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    return NextResponse.json({ ok: res.ok, provider: "printful", data }, { status: res.status });
  }

  return NextResponse.json({ ok: false, error: "No POD provider configured. Set PRINTIFY_API_KEY or PRINTFUL_API_KEY." }, { status: 503 });
}

export async function GET() {
  const printifyKey = process.env.PRINTIFY_API_KEY;
  if (!printifyKey) return NextResponse.json({ ok: false, configured: false });
  const res = await fetch("https://api.printify.com/v1/shops.json", {
    headers: { Authorization: `Bearer ${printifyKey}` },
  });
  const shops = await res.json();
  return NextResponse.json({ ok: res.ok, configured: true, shops });
}

