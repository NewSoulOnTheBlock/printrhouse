"use client";
import {
  Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export const TREASURY = process.env.NEXT_PUBLIC_PRINTRHOUSE_TREASURY ||
  // public, configurable via NEXT_PUBLIC_PRINTRHOUSE_TREASURY at build time
  "49hca5vrJ3ca1T2hEAiHa61HCRRw8E7AsxJMsoU8xVGo";

const MEMO_PROGRAM = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export function lamportsFor(sol: number): number {
  return Math.round(sol * LAMPORTS_PER_SOL);
}

export async function buildTransferTx(opts: {
  connection: Connection;
  payer: PublicKey;
  sol: number;
  memo: string;
}) {
  const { connection, payer, sol, memo } = opts;
  const tx = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: new PublicKey(TREASURY),
      lamports: lamportsFor(sol),
    })
  );
  tx.add(
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM,
      data: Buffer.from(memo, "utf8"),
    })
  );
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");
  tx.recentBlockhash = blockhash;
  tx.feePayer = payer;
  return { tx, blockhash, lastValidBlockHeight };
}
