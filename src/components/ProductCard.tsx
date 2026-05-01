"use client";
import Link from "next/link";
import { useCurrency } from "@/lib/currency";
import type { Product } from "@/lib/data";

export default function ProductCard({ p, compact = false }: { p: Product; compact?: boolean }) {
  const { currency } = useCurrency();
  return (
    <Link
      href={`/product/${p.slug}`}
      className={`pixel-card block hover:-translate-y-1 transition-transform ${compact ? "p-2" : "p-4"}`}
    >
      <div className={`bg-white/95 rounded-md aspect-square flex items-center justify-center overflow-hidden ${compact ? "mb-2" : "mb-3"}`}>
        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
      </div>
      <div className="flex justify-between items-baseline gap-1">
        <span className={`text-ph-cream uppercase truncate ${compact ? "text-[0.5rem]" : "text-[0.7rem]"}`}>
          {p.ticker} {p.name.replace(/\$?\w+\s/, "").toLowerCase()}
        </span>
        <span className={`text-ph-mint shrink-0 ${compact ? "text-[0.5rem]" : "text-[0.65rem]"}`}>
          {currency === "SOL" ? `${p.priceSol}◎` : `$${p.priceUsd}`}
        </span>
      </div>
      {!compact && <button className="pixel-btn w-full mt-3 text-[0.65rem]">Connect</button>}
    </Link>
  );
}
