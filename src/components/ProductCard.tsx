"use client";
import Link from "next/link";
import { useCurrency } from "@/lib/currency";
import type { Product } from "@/lib/data";

export default function ProductCard({ p }: { p: Product }) {
  const { currency } = useCurrency();
  return (
    <Link href={`/product/${p.slug}`} className="pixel-card p-4 block hover:-translate-y-1 transition-transform">
      <div className="bg-white/95 rounded-md aspect-square flex items-center justify-center overflow-hidden mb-3">
        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-ph-cream text-[0.7rem] uppercase">{p.ticker} {p.name.replace(/\$?\w+\s/, "").toLowerCase()}</span>
        <span className="text-ph-mint text-[0.65rem]">
          {currency === "SOL" ? `${p.priceSol} SOL` : `$${p.priceUsd}`}
        </span>
      </div>
      <button className="pixel-btn w-full mt-3 text-[0.65rem]">Connect</button>
    </Link>
  );
}
