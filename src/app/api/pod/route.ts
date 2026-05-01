import { NextRequest, NextResponse } from "next/server";

// Submits an order to Printify. Falls back to Printful if PRINTIFY_API_KEY isn't set.
export async function POST(req: NextRequest) {
  const order = await req.json();
  const printify = process.env.PRINTIFY_API_KEY;
  const printful = process.env.PRINTFUL_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (printify) {
    if (!shopId) {
      // Auto-discover the first shop on the account
      const s = await fetch("https://api.printify.com/v1/shops.json", {
        headers: { Authorization: `Bearer ${printify}` },
      });
      const shops = await s.json();
      if (!Array.isArray(shops) || shops.length === 0) {
        return NextResponse.json({ ok: false, error: "No Printify shops found. Set PRINTIFY_SHOP_ID." }, { status: 400 });
      }
      order._discoveredShopId = shops[0].id;
    }
    const id = shopId ?? order._discoveredShopId;
    const res = await fetch(`https://api.printify.com/v1/shops/${id}/orders.json`, {
      method: "POST",
      headers: { Authorization: `Bearer ${printify}`, "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    return NextResponse.json({ provider: "printify", shopId: id, data }, { status: res.status });
  }

  if (printful) {
    const res = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${printful}`, "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    return NextResponse.json({ provider: "printful", data }, { status: res.status });
  }

  return NextResponse.json({ ok: true, demo: true, message: "No POD provider configured. Set PRINTIFY_API_KEY or PRINTFUL_API_KEY." });
}

export async function GET() {
  const printify = process.env.PRINTIFY_API_KEY;
  if (!printify) return NextResponse.json({ ok: false, configured: false });
  const res = await fetch("https://api.printify.com/v1/shops.json", {
    headers: { Authorization: `Bearer ${printify}` },
  });
  const shops = await res.json();
  return NextResponse.json({ ok: res.ok, configured: true, shops });
}

