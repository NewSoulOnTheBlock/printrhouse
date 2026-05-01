import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { owner_wallet, slug, name, ticker, bio, royalty_bps } = body;
    if (!owner_wallet || !slug || !name) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const sb = supabaseAdmin();
    const { data, error } = await sb.from("stores").insert({
      owner_wallet, slug, name, ticker, bio,
      royalty_bps: royalty_bps ?? 1000,
    }).select().single();
    if (error) throw error;
    return NextResponse.json({ ok: true, store: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const slug = url.searchParams.get("slug");
  const sb = supabaseAdmin();
  let q = sb.from("stores").select("*").order("created_at", { ascending: false });
  if (owner) q = q.eq("owner_wallet", owner);
  if (slug) q = q.eq("slug", slug);
  const { data, error } = await q;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, stores: data });
}
