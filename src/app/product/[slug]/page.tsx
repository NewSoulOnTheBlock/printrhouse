"use client";
import { use, useState } from "react";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { getProduct, products } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const p = getProduct(slug);
  if (!p) notFound();
  const { currency } = useCurrency();
  const add = useCart((s) => s.add);

  const sizes = Array.from(new Set(p.variants.map((v) => v.size)));
  const colors = Array.from(new Set(p.variants.map((v) => v.color)));
  const [size, setSize] = useState(sizes[0]);
  const [color, setColor] = useState(colors[0]);
  const [qty, setQty] = useState(1);
  const variant = p.variants.find((v) => v.size === size && v.color === color);

  return (
    <div className="px-4 sm:px-12 py-8 grid lg:grid-cols-2 gap-10">
      <div className="pixel-card p-6">
        <div className="bg-white/95 rounded aspect-square flex items-center justify-center">
          <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
        </div>
      </div>
      <div>
        <Link href="/stores" className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 hover:text-ph-pink">← back to stores</Link>
        <h1 className="text-ph-cream text-4xl sm:text-5xl tracking-tight mt-4">{p.name}</h1>
        <div className="text-ph-mint mt-2 text-sm">{currency === "SOL" ? `${p.priceSol} SOL` : `$${p.priceUsd}`} · {p.ticker}</div>
        <p className="text-ph-cream/80 text-xs mt-4 leading-relaxed">{p.description}</p>

        <div className="mt-6">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 mb-2">Size</div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} data-active={s===size}
                className="pixel-btn data-[active=true]:bg-ph-pink">{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 mb-2">Color</div>
          <div className="flex gap-2 flex-wrap">
            {colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} data-active={c===color}
                className="pixel-btn data-[active=true]:bg-ph-pink capitalize">{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input type="number" min={1} value={qty} onChange={(e)=>setQty(parseInt(e.target.value||"1"))}
                 className="w-20 bg-ph-purple-dark text-ph-cream text-sm p-2 text-center rounded" />
          <button
            disabled={!variant || variant.stock < 1}
            onClick={() => add({ productId: p.id, slug: p.slug, name: p.name, ticker: p.ticker, size, color, qty, priceSol: p.priceSol, priceUsd: p.priceUsd, image: p.image })}
            className="pixel-btn flex-1" style={{ background: "#ff59c7" }}>
            {variant && variant.stock > 0 ? "Add to cart" : "Sold out"}
          </button>
        </div>

        <div className="mt-4 text-[0.6rem] text-ph-cream/60 uppercase">
          {variant ? `${variant.stock} in stock · ships in 5-7 days` : "select a variant"}
        </div>

        <Link href="/designer" className="pixel-btn mt-6 inline-block">Customize this →</Link>
      </div>

      <div className="lg:col-span-2 mt-10">
        <h2 className="text-ph-cream text-2xl sm:text-3xl mb-4">More from the house</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.filter((x) => x.id !== p.id).slice(0, 4).map((x) => (
            <Link key={x.id} href={`/product/${x.slug}`} className="pixel-card p-3 hover:-translate-y-1 transition-transform">
              <div className="bg-white/95 rounded aspect-square mb-2"><img src={x.image} className="w-full h-full object-contain" /></div>
              <div className="text-ph-cream text-[0.65rem]">{x.name}</div>
              <div className="text-ph-mint text-[0.6rem]">{currency === "SOL" ? `${x.priceSol} SOL` : `$${x.priceUsd}`}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

