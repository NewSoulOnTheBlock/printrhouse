import { NextRequest, NextResponse } from "next/server";
import { printify } from "@/lib/printify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blueprintId = searchParams.get("blueprintId");
  const providerId = searchParams.get("providerId");
  const wantProviders = searchParams.get("providers");

  try {
    if (blueprintId && providerId) {
      const v = await printify.blueprintVariants(Number(blueprintId), Number(providerId));
      return NextResponse.json({ ok: true, variants: v.variants });
    }
    if (blueprintId && wantProviders) {
      const p = await printify.blueprintProviders(Number(blueprintId));
      return NextResponse.json({ ok: true, providers: p });
    }
    if (blueprintId) {
      const b = await printify.catalogBlueprint(Number(blueprintId));
      return NextResponse.json({ ok: true, blueprint: b });
    }
    const list = await printify.catalogBlueprints();
    return NextResponse.json({ ok: true, blueprints: list.slice(0, 100) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
