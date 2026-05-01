import { NextRequest, NextResponse } from "next/server";

// Stub for Printful / Printify order submission.
// Wire in your real API key + product mapping in production.
export async function POST(req: NextRequest) {
  const order = await req.json();
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: true, demo: true, message: "POD provider not configured. Add PRINTFUL_API_KEY." });
  }
  const res = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
