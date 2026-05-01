import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { printify } from "@/lib/printify";

const SOL_USD = Number(process.env.NEXT_PUBLIC_SOL_USD ?? "180");

/**
 * Publish a designed product: creates Printify product, then records in DB.
 * Body: { store_id?, blueprint_id, print_provider_id, title, description?,
 *         price_usd, upload_id, variant_ids: number[], placement?, gate_mint? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      store_id, blueprint_id, print_provider_id, title, description, price_usd,
      upload_id, variant_ids, placement = "front", gate_mint = null,
    } = body;

    if (!blueprint_id || !print_provider_id || !title || !upload_id || !variant_ids?.length) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const priceCents = Math.round(Number(price_usd ?? 25) * 100);
    const variants = variant_ids.map((id: number, i: number) => ({
      id, price: priceCents, is_enabled: true, is_default: i === 0,
    }));

    const printifyProduct: any = await printify.createProduct({
      title, description: description ?? "",
      blueprint_id, print_provider_id,
      variants,
      print_areas: [{
        variant_ids,
        placeholders: [{
          position: placement,
          images: [{ id: upload_id, x: 0.5, y: 0.5, scale: 1, angle: 0 }],
        }],
      }],
    });

    const sb = supabaseAdmin();
    const { data, error } = await sb.from("products").insert({
      store_id: store_id ?? null,
      printify_product_id: String(printifyProduct.id),
      title,
      description: description ?? "",
      image: printifyProduct.images?.[0]?.src ?? null,
      price_usd: priceCents / 100,
      price_sol: Number(((priceCents / 100) / SOL_USD).toFixed(4)),
      blueprint_id,
      gate_mint,
      visible: true,
    }).select().single();
    if (error) throw error;

    return NextResponse.json({ ok: true, product: data, printify_id: printifyProduct.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
