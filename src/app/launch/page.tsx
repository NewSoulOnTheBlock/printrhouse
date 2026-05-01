"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useToasts } from "@/lib/toasts";
import Link from "next/link";

export default function LaunchPage() {
  const { publicKey } = useWallet();
  const { show } = useToasts();
  const [form, setForm] = useState({ slug: "", name: "", ticker: "", bio: "", royalty_bps: 1000 });
  const [stores, setStores] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!publicKey) return;
    fetch(`/api/stores?owner=${publicKey.toBase58()}`)
      .then(r => r.json())
      .then(d => setStores(d.stores ?? []));
  }, [publicKey]);

  async function create() {
    if (!publicKey) { show("err", "Connect a wallet first"); return; }
    if (!form.name || !form.slug) { show("err", "Name + slug required"); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/stores", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, owner_wallet: publicKey.toBase58() }),
      }).then(r => r.json());
      if (!res.ok) throw new Error(res.error);
      show("ok", `Store "${res.store.name}" created`);
      setStores([res.store, ...stores]);
      setForm({ slug: "", name: "", ticker: "", bio: "", royalty_bps: 1000 });
    } catch (e: any) { show("err", e.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="px-4 sm:px-12 py-8 max-w-3xl">
      <h1 className="text-white text-3xl sm:text-5xl font-bold mb-2">Launch your store</h1>
      <p className="text-white/60 text-sm mb-8">
        Connect a Solana wallet — that becomes the store owner and earns royalties on every sale.
      </p>

      {!publicKey && (
        <div className="pixel-card p-6">
          <p className="text-white/80 text-sm mb-4">Step 1: connect a wallet</p>
          <WalletMultiButton style={{ background:"#6b2a96", color:"#fff", borderRadius:"9999px", height:"44px", fontWeight:600 }} />
        </div>
      )}

      {publicKey && (
        <div className="space-y-4">
          <div className="pixel-card p-4">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Owner wallet</p>
            <p className="text-ph-yellow text-sm break-all">{publicKey.toBase58()}</p>
          </div>

          <Field label="Store name">
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Slug (url)">
            <input className="input" placeholder="my-store" value={form.slug}
                   onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ticker">
              <input className="input" placeholder="$TICKER" value={form.ticker}
                     onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="Royalty % (you keep)">
              <input type="number" min={0} max={50} className="input"
                     value={form.royalty_bps / 100}
                     onChange={e => setForm({ ...form, royalty_bps: Number(e.target.value) * 100 })} />
            </Field>
          </div>
          <Field label="Bio">
            <textarea className="input min-h-24" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </Field>

          <button onClick={create} disabled={busy} className="feature-cta justify-center w-full disabled:opacity-40">
            {busy ? "Creating…" : "Create store →"}
          </button>

          {stores.length > 0 && (
            <div className="mt-8">
              <h2 className="text-white text-2xl font-bold mb-3">Your stores</h2>
              <div className="space-y-2">
                {stores.map((s) => (
                  <div key={s.id} className="pixel-card p-4 flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">{s.name}</div>
                      <div className="text-white/50 text-xs">/{s.slug} · {s.royalty_bps/100}% royalty</div>
                    </div>
                    <Link href="/publish" className="pixel-btn text-xs">+ Publish product</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: any }) {
  return (
    <div>
      <label className="block text-xs text-white/60 uppercase tracking-widest mb-1">{label}</label>
      {children}
    </div>
  );
}
