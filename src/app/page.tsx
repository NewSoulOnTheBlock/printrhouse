import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products, stores } from "@/lib/data";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="px-4 sm:px-12 pt-6 pb-20 grid lg:grid-cols-2 gap-8 items-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-ph-cream leading-[0.9] text-[14vw] lg:text-[7rem] tracking-tighter">
            <span className="block">LAUNCH</span>
            <span className="block">YOUR</span>
            <span className="block">STORE</span>
          </h1>
          <p className="mt-6 text-[0.7rem] uppercase tracking-widest text-ph-cream/80">
            launch a store, zero upfront cost
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/launch" className="pixel-btn">Start a Store</Link>
            <Link href="/stores" className="pixel-btn" style={{ background: "#ff59c7" }}>Shop drops</Link>
          </div>
        </div>
        <div className="relative h-[420px] lg:h-[520px]">
          <div className="absolute right-4 top-0 w-[70%] aspect-[3/4] pixel-card p-6 rotate-3">
            <img src="/products/tee-cloud.svg" className="w-full h-full object-contain bg-white/95 rounded" />
            <div className="absolute -top-3 left-6 bg-ph-mint text-ph-purple-dark text-[0.6rem] px-2 py-1 rounded">Drop</div>
          </div>
          <div className="absolute left-0 bottom-0 w-[45%] aspect-square pixel-card p-3 -rotate-6">
            <img src="/products/cap.svg" className="w-full h-full object-contain bg-white/95 rounded" />
            <div className="absolute -top-3 right-3 bg-ph-pink text-white text-[0.6rem] px-2 py-1 rounded">Steph</div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="px-4 sm:px-12 py-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-ph-cream text-3xl sm:text-5xl tracking-tight">New Arrivals</h2>
          <Link href="/stores" className="text-[0.65rem] uppercase tracking-widest text-ph-cream/70 hover:text-ph-pink">view all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 6).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* FEATURED STORES */}
      <section className="px-4 sm:px-12 py-10">
        <h2 className="text-ph-cream text-3xl sm:text-5xl tracking-tight mb-6">Featured Stores</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((s) => (
            <Link key={s.id} href={`/store/${s.slug}`} className="pixel-card p-5 hover:-translate-y-1 transition-transform block">
              <div className="aspect-[3/1] bg-white/10 rounded mb-4 flex items-center justify-center text-ph-cream/40 text-xs uppercase tracking-widest">{s.name} banner</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-ph-cream text-sm">{s.name}</div>
                  <div className="text-ph-cream/60 text-[0.6rem] uppercase">by {s.owner}</div>
                </div>
                <div className="text-ph-mint text-xs">{s.ticker}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-12 py-20 text-center">
        <h3 className="text-ph-cream text-4xl sm:text-6xl tracking-tight mb-4">Print. Ship. Earn.</h3>
        <p className="text-ph-cream/70 text-[0.7rem] uppercase tracking-widest mb-6">we handle production. you keep the profit.</p>
        <Link href="/launch" className="pixel-btn" style={{ background: "#ff59c7" }}>Open my store →</Link>
      </section>
    </div>
  );
}
