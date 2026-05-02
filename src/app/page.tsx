"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products, stores } from "@/lib/data";

const SLIDES = [
  { id: "mascot",   label: "Printrhouse",   img: "/mascot.png",                    href: "/stores" },
  { id: "flateric", label: "Flat Eric",     img: "/stores/cover-flateric.png",     href: "/store/fatchoi" },
  { id: "cheeto",   label: "Cheeto Tiger",  img: "/stores/cover-cheeto.png",       href: "/store/fatchoi" },
  { id: "cover2",   label: "BELIEVE",       img: "/stores/cover-2.png",            href: "/store/believe" },
];

export default function HomePage() {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="px-4 sm:px-8 lg:px-12">
      {/* Featured Drop hero */}
      <section className="pt-1 pb-3 sm:pt-2 sm:pb-4">
        <div className="feature-card aspect-[4/3] sm:aspect-[16/8] lg:aspect-[16/6]">
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
            <span className="feature-pill">Featured Drop</span>
          </div>

          <div className="absolute inset-0">
            {SLIDES.map((s, i) => (
              s.id === "mascot" ? (
                <img
                  key={s.id}
                  src={s.img}
                  alt={s.label}
                  className="absolute right-4 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 max-h-[85%] w-auto object-contain transition-opacity duration-500"
                  style={{ opacity: i === idx ? 1 : 0 }}
                />
              ) : (
                <img
                  key={s.id}
                  src={s.img}
                  alt={s.label}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
                  style={{ opacity: i === idx ? 1 : 0 }}
                />
              )
            ))}
          </div>

          <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 max-w-[60%] z-10">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-white text-xl sm:text-3xl lg:text-4xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">{slide.label}</h2>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffd24a">
                <path d="M12 2l2.39 4.84L20 8l-4 3.91.94 5.5L12 14.77 7.06 17.4 8 11.91 4 8l5.61-1.16z" />
              </svg>
            </div>
            <Link href={slide.href} className="feature-cta">
              View Collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="dot-row">
          {SLIDES.map((_, i) => (
            <button key={i} data-active={i === idx} onClick={() => setIdx(i)} aria-label={`slide ${i+1}`} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="pt-2 pb-4 sm:pt-4 sm:pb-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-2xl sm:text-3xl font-bold">Best Sellers</h2>
          <Link href="/stores" className="text-white/60 text-sm hover:text-white">See All</Link>
        </div>

        {(() => {
          const realProducts = products.filter((p) => p.image && !p.image.endsWith(".svg"));
          return (
            <>
              {/* Mobile: ~2-up snap-scroll slider (larger tiles) */}
              <div className="sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-3 pb-3 scrollbar-thin">
                {realProducts.map((p, i) => <ProductTile key={p.id} p={p} discount={i === 1} />)}
              </div>

              {/* Tablet/Desktop grid */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {realProducts.map((p, i) => <ProductTile key={p.id} p={p} discount={i === 1} />)}
              </div>
            </>
          );
        })()}
      </section>

      {/* Featured Stores */}
      <section className="py-4 sm:py-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-2xl sm:text-3xl font-bold">Featured Stores</h2>
          <Link href="/stores" className="text-white/60 text-sm hover:text-white">See All</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((s, i) => {
            const covers = ["/stores/cover-1.png", "/stores/cover-2.png", "/stores/cover-3.jpg", "/stores/cover-4.jpg"];
            const cover = covers[i % covers.length];
            return (
              <Link key={s.id} href={`/store/${s.slug}`} className="pixel-card p-4 hover:bg-ph-navy-3 transition-colors block">
                <div className="aspect-square rounded-lg mb-3 overflow-hidden bg-white/5 flex items-center justify-center">
                  <img src={cover} alt={s.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white text-sm font-semibold">{s.name}</div>
                    <div className="text-white/50 text-xs">by {s.owner}</div>
                  </div>
                  <div className="text-ph-cyan text-xs">{s.ticker}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <h3 className="text-white text-3xl sm:text-5xl font-bold mb-2">Printr. Ship. Earn.</h3>
          <p className="text-white/60 text-sm mb-5">join the printrhouse · create your store · and earn</p>
          <Link href="/launch" className="feature-cta">Open my store →</Link>
        </div>
        <img src="/mascot.png" alt="" className="h-44 sm:h-64 lg:h-72 w-auto justify-self-center lg:justify-self-end" />
      </section>
    </div>
  );
}

function ProductTile({ p, discount }: { p: any; discount?: boolean }) {
  return (
    <Link
      href={`/product/${p.slug}`}
      className="snap-start shrink-0 basis-[46%] sm:basis-auto min-w-[46%] sm:min-w-0 block group"
    >
      <div className="relative bg-white rounded-2xl aspect-square overflow-hidden flex items-center justify-center">
        <img src={p.image} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
        {discount && <span className="discount-pill">5% OFF</span>}
      </div>
      <div className="mt-2 text-white text-sm sm:text-base font-semibold truncate">{p.name}</div>
      <div className="text-white/50 text-xs">${p.priceUsd}</div>
    </Link>
  );
}
