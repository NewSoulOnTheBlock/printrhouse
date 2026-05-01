"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DbProduct = {
  id: string;
  printify_product_id: string | null;
  title: string;
  image: string | null;
  price_usd: number;
  price_sol: number;
  visible: boolean;
  gate_mint: string | null;
  stores?: { slug: string; name: string; ticker: string | null } | null;
};

type LiveProduct = {
  id: string;
  title: string;
  image: string;
  priceUsd: number;
  priceSol: number;
  visible: boolean;
};

export default function MarketplacePage() {
  const [dbItems, setDbItems] = useState<DbProduct[] | null>(null);
  const [liveItems, setLiveItems] = useState<LiveProduct[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/products").then(r => r.json())
      .then(d => setDbItems(d.ok ? d.products : []))
      .catch(() => setDbItems([]));
    fetch("/api/pod/products").then(r => r.json())
      .then(d => {
        if (d.ok) setLiveItems(d.products);
        else setErr(d.error);
      })
      .catch((e) => setErr(e.message));
  }, []);

  const merged = useMemo(() => {
    const out: { id: string; title: string; image: string; priceUsd: number; priceSol: number;
                 store?: string; storeSlug?: string; gated?: boolean; href: string }[] = [];
    const dbPidSet = new Set<string>();
    (dbItems ?? []).forEach((p) => {
      if (p.printify_product_id) dbPidSet.add(p.printify_product_id);
      out.push({
        id: p.id, title: p.title, image: p.image ?? "",
        priceUsd: Number(p.price_usd), priceSol: Number(p.price_sol),
        store: p.stores?.name, storeSlug: p.stores?.slug,
        gated: !!p.gate_mint,
        href: p.printify_product_id ? `/marketplace/${p.printify_product_id}` : `/marketplace`,
      });
    });
    (liveItems ?? []).forEach((p) => {
      if (dbPidSet.has(p.id)) return;
      if (!p.visible) return;
      out.push({ id: p.id, title: p.title, image: p.image, priceUsd: p.priceUsd, priceSol: p.priceSol, href: `/marketplace/${p.id}` });
    });
    if (!q.trim()) return out;
    const needle = q.toLowerCase();
    return out.filter((p) => p.title.toLowerCase().includes(needle) || (p.store?.toLowerCase().includes(needle)));
  }, [dbItems, liveItems, q]);

  const loading = dbItems === null || liveItems === null;

  return (
    <div className="px-4 sm:px-12 py-8">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-ph-cream text-4xl sm:text-6xl tracking-tight">Merch Marketplace</h1>
          <p className="text-[0.65rem] uppercase tracking-widest text-ph-cream/60 mt-2">
            live drops · creator stores · printify fulfilled
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/launch" className="pixel-btn">+ Launch store</Link>
          <Link href="/designer" className="pixel-btn" style={{ background: "#ff59c7" }}>Open designer</Link>
        </div>
      </div>

      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search products or stores…"
        className="input mb-6 max-w-md" />

      {err && (
        <div className="pixel-card p-4 text-ph-pink text-xs mb-4">⚠ {err}</div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[0,1,2,3,4,5,6,7].map((i) => (
            <div key={i} className="pixel-card p-3 animate-pulse">
              <div className="bg-white/10 rounded-md aspect-square mb-3"></div>
              <div className="h-3 bg-white/10 rounded mb-2"></div>
              <div className="h-2 bg-white/5 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && merged.length === 0 && (
        <div className="pixel-card p-10 text-center space-y-4">
          <div className="text-5xl">🛒</div>
          <h2 className="text-ph-cream text-2xl">No products yet</h2>
          <p className="text-ph-cream/70 text-[0.7rem] uppercase tracking-widest max-w-xl mx-auto">
            Be the first — launch a store and publish a drop.
          </p>
          <div className="flex gap-3 justify-center pt-3 flex-wrap">
            <Link href="/launch" className="pixel-btn">Launch store →</Link>
            <Link href="/designer" className="pixel-btn" style={{ background: "#ff59c7" }}>Open designer →</Link>
          </div>
        </div>
      )}

      {!loading && merged.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {merged.map((p) => (
            <Link key={p.id} href={p.href} className="pixel-card p-3 block hover:-translate-y-1 transition-transform">
              <div className="bg-white/95 rounded-md aspect-square overflow-hidden mb-3 flex items-center justify-center relative">
                {p.image
                  ? <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                  : <span className="text-ph-purple-dark text-xs">no image</span>}
                {p.gated && (
                  <span className="absolute top-1 right-1 text-[0.5rem] uppercase bg-ph-yellow text-black px-1.5 py-0.5 rounded">🔒 gated</span>
                )}
              </div>
              <div className="text-ph-cream text-[0.7rem] uppercase truncate">{p.title}</div>
              {p.store && <div className="text-ph-cream/40 text-[0.55rem] truncate">by {p.store}</div>}
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-ph-mint text-[0.65rem]">${p.priceUsd}</span>
                <span className="text-ph-cream/50 text-[0.55rem]">{p.priceSol}◎</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
