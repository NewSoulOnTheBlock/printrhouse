import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, buyer_wallet, buyer_email, total_sol, total_usd, items, shipping } = body;
    if (!order_id) return NextResponse.json({ ok: false, error: "order_id required" }, { status: 400 });
    const sb = supabaseAdmin();
    const { data, error } = await sb.from("orders").upsert({
      order_id, buyer_wallet, buyer_email, total_sol, total_usd, items, shipping,
      status: "pending",
    }, { onConflict: "order_id" }).select().single();
    if (error) throw error;
    return NextResponse.json({ ok: true, order: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { order_id, sig, printify_order_id, status } = body;
    if (!order_id) return NextResponse.json({ ok: false, error: "order_id required" }, { status: 400 });
    const sb = supabaseAdmin();
    const patch: any = { updated_at: new Date().toISOString() };
    if (sig) patch.sig = sig;
    if (printify_order_id) patch.printify_order_id = printify_order_id;
    if (status) patch.status = status;
    const { data, error } = await sb.from("orders").update(patch).eq("order_id", order_id).select().single();
    if (error) throw error;
    return NextResponse.json({ ok: true, order: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const wallet = url.searchParams.get("wallet");
  const sb = supabaseAdmin();
  let q = sb.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
  if (wallet) q = q.eq("buyer_wallet", wallet);
  const { data, error } = await q;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, orders: data });
}
