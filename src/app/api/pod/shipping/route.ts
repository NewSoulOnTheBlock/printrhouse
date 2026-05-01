import { NextRequest, NextResponse } from "next/server";
import { printify } from "@/lib/printify";

export async function POST(req: NextRequest) {
  try {
    const { address, line_items } = await req.json();
    if (!address || !line_items) return NextResponse.json({ ok: false, error: "address + line_items required" }, { status: 400 });
    const data = await printify.shippingRates(address, line_items);
    return NextResponse.json({ ok: true, rates: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 502 });
  }
}
