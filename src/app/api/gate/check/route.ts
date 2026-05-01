import { NextResponse } from "next/server";

const HELIUS_RPC = process.env.SOLANA_RPC ?? process.env.NEXT_PUBLIC_SOLANA_RPC!;

export async function POST(req: Request) {
  try {
    const { wallet, mint, minAmount = 1 } = await req.json();
    if (!wallet || !mint) return NextResponse.json({ ok: false, error: "wallet+mint required" }, { status: 400 });
    const res = await fetch(HELIUS_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "getTokenAccountsByOwner",
        params: [wallet, { mint }, { encoding: "jsonParsed" }],
      }),
    });
    const data = await res.json();
    const accounts = data?.result?.value ?? [];
    let balance = 0;
    for (const a of accounts) {
      const ui = a?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;
      balance += Number(ui);
    }
    return NextResponse.json({ ok: true, holds: balance >= Number(minAmount), balance });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
