import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Printify webhook handler.
 * Configure at: https://printify.com/app/account/webhooks
 * Endpoint: https://printrhouse.vercel.app/api/webhooks/printify
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event: string = body?.type ?? "";
    const resource = body?.resource ?? body?.data ?? body;
    const printify_order_id = resource?.id ?? body?.id;
    const external_id = resource?.external_id ?? body?.external_id;
    if (!external_id) return NextResponse.json({ ok: true, ignored: "no external_id" });

    let status = "paid";
    if (event.includes("sent-to-production")) status = "in_production";
    else if (event.includes("shipment:created") || event.includes("shipped")) status = "shipped";
    else if (event.includes("delivered")) status = "delivered";
    else if (event.includes("cancelled") || event.includes("canceled")) status = "cancelled";
    else if (event.includes("created")) status = "paid";

    const sb = supabaseAdmin();
    await sb.from("orders").update({
      status,
      printify_order_id: String(printify_order_id ?? ""),
      updated_at: new Date().toISOString(),
    }).eq("order_id", external_id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: "printify webhook endpoint" });
}
