import { NextResponse } from "next/server";
import { printify } from "@/lib/printify";

export async function GET() {
  try {
    const data = await printify.listProducts(1, 50);
    return NextResponse.json({
      ok: true,
      total: data.total,
      products: data.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        images: p.images?.map((i: any) => i.src) ?? [],
        thumbnail: p.images?.[0]?.src ?? null,
        variants: (p.variants ?? []).map((v: any) => ({
          id: v.id, title: v.title, price: v.price,
          is_enabled: v.is_enabled, is_default: v.is_default, is_available: v.is_available, sku: v.sku,
        })),
        blueprint_id: p.blueprint_id,
        print_provider_id: p.print_provider_id,
        visible: p.visible,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
