import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

const MEMO_PROGRAM = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
const TREASURY = process.env.NEXT_PUBLIC_PRINTRHOUSE_TREASURY!;

export type Split = { recipient: string; lamports: number };

/** Builds a multi-recipient SOL transfer tx with a memo instruction. */
export async function buildSplitTx(opts: {
  connection: Connection;
  payer: PublicKey;
  splits: Split[];
  memo: string;
}) {
  const { connection, payer, splits, memo } = opts;
  const tx = new Transaction();
  for (const s of splits) {
    tx.add(SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: new PublicKey(s.recipient),
      lamports: s.lamports,
    }));
  }
  tx.add(new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM,
    data: Buffer.from(memo, "utf8"),
  }));
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = payer;
  return { tx, blockhash, lastValidBlockHeight };
}

/** Computes splits from total SOL and a creator royalty in basis points. */
export function computeSplits(totalSol: number, creatorWallet: string | null, royaltyBps: number): Split[] {
  const totalLamports = Math.round(totalSol * 1_000_000_000);
  if (!creatorWallet || royaltyBps <= 0) {
    return [{ recipient: TREASURY, lamports: totalLamports }];
  }
  const creatorShare = Math.floor((totalLamports * royaltyBps) / 10_000);
  const treasuryShare = totalLamports - creatorShare;
  return [
    { recipient: TREASURY, lamports: treasuryShare },
    { recipient: creatorWallet, lamports: creatorShare },
  ];
}
