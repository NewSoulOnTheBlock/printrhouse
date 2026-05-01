import { NextRequest, NextResponse } from "next/server";
import { printify } from "@/lib/printify";

type IncomingItem = { product_id: string; variant_id: number; quantity: number };
type IncomingOrder = {
  external_id?: string;
  label?: string;
  line_items: IncomingItem[];
  address_to: {
    first_name: string; last_name: string;
    email: string; phone?: string;
    country: string; region?: string; city: string; address1: string; address2?: string; zip: string;
  };
  shipping_method?: 1 | 2;
  send_shipping_notification?: boolean;
};

export async function POST(req: NextRequest) {
  let body: IncomingOrder;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }
  if (!body.line_items?.length) return NextResponse.json({ ok: false, error: "No line_items" }, { status: 400 });
  if (!body.address_to) return NextResponse.json({ ok: false, error: "Missing address_to" }, { status: 400 });

  const order = {
    external_id: body.external_id || `printrhouse-${Date.now()}`,
    label: body.label || "Printrhouse order",
    line_items: body.line_items.map((i) => ({ product_id: i.product_id, variant_id: i.variant_id, quantity: i.quantity })),
    shipping_method: body.shipping_method ?? 1,
    is_printify_express: false,
    is_economy_shipping: false,
    send_shipping_notification: body.send_shipping_notification ?? true,
    address_to: body.address_to,
  };

  try {
    const created = await printify.createOrder(order);
    return NextResponse.json({ ok: true, order: created });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 502 });
  }
}
