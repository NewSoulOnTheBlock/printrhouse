import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const RPC = process.env.SOLANA_RPC || process.env.NEXT_PUBLIC_SOLANA_RPC;
const TREASURY = process.env.PRINTRHOUSE_TREASURY;
const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

export async function POST(req: NextRequest) {
  if (!RPC || !TREASURY) {
    return NextResponse.json({ ok: false, error: "Server missing SOLANA_RPC or PRINTRHOUSE_TREASURY" }, { status: 500 });
  }
  const { signature, expectedSol, orderId } = await req.json();
  if (!signature || expectedSol == null || !orderId) {
    return NextResponse.json({ ok: false, error: "signature, expectedSol, orderId required" }, { status: 400 });
  }

  const conn = new Connection(RPC, "confirmed");

  for (let i = 0; i < 8; i++) {
    const status = await conn.getSignatureStatus(signature, { searchTransactionHistory: true });
    const conf = status?.value?.confirmationStatus;
    if (conf === "confirmed" || conf === "finalized") break;
    await new Promise((r) => setTimeout(r, 1500));
  }

  const tx = await conn.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0, commitment: "confirmed" });
  if (!tx) return NextResponse.json({ ok: false, error: "Transaction not found yet" }, { status: 404 });
  if (tx.meta?.err) return NextResponse.json({ ok: false, error: "Transaction failed on-chain", details: tx.meta.err }, { status: 400 });

  const treasuryPk = new PublicKey(TREASURY);
  const expectedLamports = Math.round(expectedSol * LAMPORTS_PER_SOL);

  let receivedLamports = 0;
  let memoOk = false;

  const allInstr = [
    ...(tx.transaction.message.instructions || []),
    ...((tx.meta?.innerInstructions || []).flatMap((i) => i.instructions)),
  ];
  for (const ix of allInstr as any[]) {
    if (ix.program === "system" && ix.parsed?.type === "transfer") {
      const info = ix.parsed.info;
      if (info?.destination === treasuryPk.toBase58()) {
        receivedLamports += Number(info.lamports || 0);
      }
    }
    const pid = ix.programId?.toBase58?.() || ix.programId;
    if (pid === MEMO_PROGRAM || ix.program === "spl-memo") {
      const memoText = typeof ix.parsed === "string" ? ix.parsed : (ix.parsed?.info ?? "");
      if (typeof memoText === "string" && memoText.includes(orderId)) memoOk = true;
    }
  }

  if (!memoOk) {
    const logs = tx.meta?.logMessages || [];
    if (logs.some((l) => l.includes(orderId))) memoOk = true;
  }

  if (receivedLamports < expectedLamports) {
    return NextResponse.json({ ok: false, error: "Underpaid", receivedLamports, expectedLamports }, { status: 402 });
  }
  if (!memoOk) {
    return NextResponse.json({ ok: false, error: "Order memo missing from transaction" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true, signature, receivedLamports, expectedLamports,
    confirmation: "confirmed",
    explorer: `https://solscan.io/tx/${signature}`,
  });
}
