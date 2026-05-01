"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products, stores } from "@/lib/data";

const SLIDES = [
  { kind: "mascot",  src: "/mascot.png",                label: "Mascot" },
  { kind: "tee",     src: "/products/tee-cloud.svg",    label: "Drop" },
  { kind: "hoodie",  src: "/products/hoodie-cloud.svg", label: "Hoodie" },
  { kind: "cap",     src: "/products/cap.svg",          label: "Cap" },
];

export default function HomePage() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO carousel */}
      <section className="px-4 sm:px-12 pt-6 pb-20">
        <div className="hero-carousel relative">
          <div className="grid lg:grid-cols-2 gap-6 items-center p-6 sm:p-10 min-h-[520px]">
            <div className="relative z-10">
              <h1 className="font-pixel-hero text-ph-cream text-[7vw] lg:text-[3.4rem]">
                <span className="block">LAUNCH</span>
                <span className="block">YOUR</span>
                <span className="block">STORE</span>
              </h1>
              <p className="mt-6 text-[0.7rem] uppercase tracking-widest text-ph-cream/80">
                launch a store, zero upfront cost
              </p>
              <div className="mt-8 flex gap-3 flex-wrap">
                <Link href="/launch" className="pixel-btn">Launch Store</Link>
                <Link href="/stores" className="pixel-btn" style={{ background: "#ff59c7" }}>Shop drops</Link>
              </div>
            </div>

            <div className="relative h-[360px] lg:h-[460px] flex items-center justify-center">
              {SLIDES.map((s, i) => (
                <img
                  key={s.kind}
                  src={s.src}
                  alt={s.label}
                  className="hero-slide absolute max-h-[100%] max-w-[80%] w-auto h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                  style={{ opacity: i === idx ? 1 : 0 }}
                />
              ))}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hero-dots">
                {SLIDES.map((_, i) => (
                  <button key={i} data-active={i === idx} onClick={() => setIdx(i)} aria-label={`slide ${i+1}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW COLLECTIONS */}
      <section className="px-4 sm:px-12 py-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-ph-cream text-3xl sm:text-5xl tracking-tight">New Collections</h2>
          <Link href="/stores" className="text-[0.65rem] uppercase tracking-widest text-ph-cream/70 hover:text-ph-pink">view all →</Link>
        </div>

        {/* Mobile: horizontal snap-scroll, ~3 per row */}
        <div className="sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-3 pb-3 scrollbar-thin">
          {products.map((p) => (
            <div key={p.id} className="snap-start shrink-0 basis-[31%] min-w-[31%]">
              <ProductCard p={p} compact />
            </div>
          ))}
        </div>

        {/* Tablet/Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      <section className="px-4 sm:px-12 py-20 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <h3 className="text-ph-cream text-4xl sm:text-6xl tracking-tight mb-4">Printr. Ship. Earn.</h3>
          <p className="text-ph-cream/70 text-[0.7rem] uppercase tracking-widest mb-6">we handle production. you keep the profit.</p>
          <Link href="/launch" className="pixel-btn" style={{ background: "#ff59c7" }}>Open my store →</Link>
        </div>
        <img src="/mascot.png" alt="" className="h-64 lg:h-80 w-auto justify-self-center lg:justify-self-end drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
      </section>
    </div>
  );
}
