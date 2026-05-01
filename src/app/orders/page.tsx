"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

export default function OrdersPage() {
  const { publicKey } = useWallet();
  const [orders, setOrders] = useState<any[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) return;
    fetch(`/api/orders?wallet=${publicKey.toBase58()}`)
      .then((r) => r.json())
      .then((d) => d.ok ? setOrders(d.orders) : setErr(d.error))
      .catch((e) => setErr(e.message));
  }, [publicKey]);

  return (
    <div className="px-4 sm:px-12 py-8">
      <h1 className="text-white text-3xl sm:text-5xl font-bold mb-2">Your Orders</h1>
      <p className="text-white/60 text-sm mb-8">Connected wallet shows orders linked to it.</p>

      {!publicKey && <div className="pixel-card p-6 text-white/70 text-sm">Connect your wallet to see your orders.</div>}
      {err && <div className="pixel-card p-6 text-ph-pink text-sm">⚠ {err}</div>}
      {publicKey && !orders && !err && <SkeletonRows />}
      {orders?.length === 0 && (
        <div className="pixel-card p-6 text-white/70 text-sm">
          No orders yet. <Link href="/stores" className="text-ph-yellow underline">Go shop →</Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="pixel-card p-4 grid sm:grid-cols-[1fr_auto] gap-3 items-center">
              <div>
                <div className="text-white font-semibold text-sm break-all">{o.order_id}</div>
                <div className="text-white/50 text-xs mt-1">
                  {o.items?.length ?? 0} items · ${o.total_usd ?? "—"} · {o.total_sol ?? "—"} SOL
                </div>
                {o.sig && (
                  <a href={`https://solscan.io/tx/${o.sig}`} target="_blank" rel="noreferrer"
                     className="text-xs text-ph-yellow underline break-all">
                    tx: {o.sig.slice(0, 16)}…
                  </a>
                )}
                {o.printify_order_id && (
                  <div className="text-white/40 text-[0.65rem] mt-1">printify: {o.printify_order_id}</div>
                )}
              </div>
              <StatusPill status={o.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "#444",
    paid: "#2d6e9c",
    in_production: "#a36a1f",
    shipped: "#1f7a4a",
    delivered: "#1a7a3e",
    cancelled: "#7a1a1a",
  };
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: colors[status] ?? "#444" }}>
      {status?.replace("_", " ") ?? "—"}
    </span>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {[0,1,2].map((i) => (
        <div key={i} className="pixel-card p-4 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-white/5 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
