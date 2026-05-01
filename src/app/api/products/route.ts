import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SOL_USD = Number(process.env.NEXT_PUBLIC_SOL_USD ?? "180");

export async function GET(req: Request) {
  const url = new URL(req.url);
  const store_id = url.searchParams.get("store_id");
  const search = url.searchParams.get("q");
  const sb = supabaseAdmin();
  let q = sb.from("products")
    .select("*, stores(slug, name, ticker, owner_wallet)")
    .eq("visible", true)
    .order("created_at", { ascending: false });
  if (store_id) q = q.eq("store_id", store_id);
  if (search) q = q.ilike("title", `%${search}%`);
  const { data, error } = await q;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, products: data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sb = supabaseAdmin();
    const insert = {
      store_id: body.store_id ?? null,
      printify_product_id: body.printify_product_id ?? null,
      title: body.title,
      description: body.description ?? "",
      image: body.image ?? null,
      price_usd: body.price_usd ?? 0,
      price_sol: body.price_sol ?? Number(((body.price_usd ?? 0) / SOL_USD).toFixed(4)),
      blueprint_id: body.blueprint_id ?? null,
      gate_mint: body.gate_mint ?? null,
      visible: body.visible ?? true,
    };
    const { data, error } = await sb.from("products").insert(insert).select().single();
    if (error) throw error;
    return NextResponse.json({ ok: true, product: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
