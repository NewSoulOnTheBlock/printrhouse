import Link from "next/link";
import { fetchLiveProducts } from "@/lib/live-products";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function MarketplacePage() {
  const result = await fetchLiveProducts();

  return (
    <div className="px-4 sm:px-12 py-8">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-ph-cream text-4xl sm:text-6xl tracking-tight">Merch Marketplace</h1>
          <p className="text-[0.65rem] uppercase tracking-widest text-ph-cream/60 mt-2">
            live from your printify shop · threeded · #16220075
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/designer" className="pixel-btn">+ Design new</Link>
          <Link href="/admin/printify" className="pixel-btn" style={{ background: "#ff59c7" }}>Manage shop</Link>
        </div>
      </div>

      {!result.ok && (
        <div className="pixel-card p-6 text-ph-pink text-xs">
          ⚠ Printify API error: <span className="break-all">{result.error}</span>
        </div>
      )}

      {result.ok && result.products.length === 0 && (
        <div className="pixel-card p-10 text-center space-y-4">
          <div className="text-5xl">🛒</div>
          <h2 className="text-ph-cream text-2xl">Shop connected — 0 products yet</h2>
          <p className="text-ph-cream/70 text-[0.7rem] uppercase tracking-widest max-w-xl mx-auto">
            Your Printify shop is live, but no products are published. Use the on-site Designer to upload art and create one,
            or publish products directly inside Printify and they will appear here automatically.
          </p>
          <div className="flex gap-3 justify-center pt-3 flex-wrap">
            <Link href="/designer" className="pixel-btn">Open designer →</Link>
            <a href="https://printify.com/app/store-manager/products" target="_blank" rel="noreferrer"
               className="pixel-btn" style={{ background: "#ff59c7" }}>Open Printify dashboard ↗</a>
          </div>
        </div>
      )}

      {result.ok && result.products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {result.products.map((p) => (
            <Link key={p.id} href={`/marketplace/${p.id}`} className="pixel-card p-3 block hover:-translate-y-1 transition-transform">
              <div className="bg-white/95 rounded-md aspect-square overflow-hidden mb-3 flex items-center justify-center">
                {p.image
                  ? <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                  : <span className="text-ph-purple-dark text-xs">no image</span>}
              </div>
              <div className="text-ph-cream text-[0.7rem] uppercase truncate">{p.title}</div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-ph-mint text-[0.65rem]">${p.priceUsd}</span>
                <span className="text-ph-cream/50 text-[0.55rem]">{p.priceSol}◎</span>
              </div>
              {!p.visible && <div className="text-[0.5rem] uppercase text-ph-pink mt-1">draft</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
