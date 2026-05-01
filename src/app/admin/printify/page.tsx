"use client";
import { useEffect, useState } from "react";

export default function PrintifyAdmin() {
  const [products, setProducts] = useState<any>(null);
  const [catalog, setCatalog] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true); setErr(null);
    try {
      const p = await fetch("/api/pod/products").then((r) => r.json());
      if (!p.ok) throw new Error(p.error || "Failed to load products");
      setProducts(p);
      const c = await fetch("/api/pod/catalog").then((r) => r.json());
      setCatalog(c);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="px-4 sm:px-12 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-ph-cream text-4xl tracking-tight">Printify</h1>
        <button onClick={load} className="pixel-btn" style={{ background: "#ff59c7" }}>Refresh</button>
      </div>

      {loading && <p className="text-ph-cream/70 text-xs">Loading…</p>}
      {err && <p className="text-ph-pink text-xs">Error: {err}</p>}

      <section className="pixel-card p-5">
        <h2 className="text-ph-cream text-lg mb-3">Your shop</h2>
        <p className="text-ph-cream/70 text-xs">
          Shop ID: <span className="text-ph-mint">16220075</span> · Channel: Shopify ("Threeded")
        </p>
        <p className="text-ph-cream/70 text-xs mt-2">
          Total products: <span className="text-ph-mint">{products?.total ?? "—"}</span>
        </p>
      </section>

      <section className="pixel-card p-5">
        <h2 className="text-ph-cream text-lg mb-3">Products in shop</h2>
        {products?.products?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.products.map((p: any) => (
              <div key={p.id} className="bg-ph-purple-dark p-3 rounded">
                {p.thumbnail && <img src={p.thumbnail} alt="" className="w-full aspect-square object-cover rounded mb-2" />}
                <div className="text-ph-cream text-xs">{p.title}</div>
                <div className="text-ph-cream/60 text-[0.6rem] mt-1">{p.variants.length} variants · blueprint {p.blueprint_id}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ph-cream/60 text-xs">
            No products yet. Browse the catalog below, then create one via{" "}
            <code className="text-ph-mint">printify.createProduct()</code> in <code>src/lib/printify.ts</code>.
          </p>
        )}
      </section>

      <section className="pixel-card p-5">
        <h2 className="text-ph-cream text-lg mb-3">Master catalog (first 20 blueprints)</h2>
        {catalog?.blueprints?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {catalog.blueprints.slice(0, 20).map((b: any) => (
              <div key={b.id} className="bg-ph-purple-dark p-3 rounded">
                {b.images?.[0] && <img src={b.images[0]} alt="" className="w-full aspect-square object-contain rounded mb-2 bg-white/90" />}
                <div className="text-ph-cream text-xs">{b.title}</div>
                <div className="text-ph-cream/60 text-[0.55rem] mt-1">id {b.id} · {b.brand}</div>
              </div>
            ))}
          </div>
        ) : <p className="text-ph-cream/60 text-xs">…</p>}
      </section>

      <section className="pixel-card p-5">
        <h2 className="text-ph-cream text-lg mb-3">API endpoints (live)</h2>
        <ul className="text-ph-cream/80 text-[0.7rem] space-y-1 font-mono">
          <li><span className="text-ph-mint">GET</span> /api/pod          — provider status</li>
          <li><span className="text-ph-mint">GET</span> /api/pod/products — list shop products</li>
          <li><span className="text-ph-mint">GET</span> /api/pod/catalog  — browse master catalog</li>
          <li><span className="text-ph-mint">GET</span> /api/pod/catalog?blueprintId=12&providers=1</li>
          <li><span className="text-ph-mint">GET</span> /api/pod/catalog?blueprintId=12&providerId=29</li>
          <li><span className="text-ph-pink">POST</span> /api/pod/upload   — upload print art (url or base64)</li>
          <li><span className="text-ph-pink">POST</span> /api/pod/shipping — get shipping rates</li>
          <li><span className="text-ph-pink">POST</span> /api/pod/order    — submit order to Printify</li>
        </ul>
      </section>
    </div>
  );
}
