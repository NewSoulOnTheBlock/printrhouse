"use client";
import Link from "next/link";
import { products, stores } from "@/lib/data";
import { useCurrency } from "@/lib/currency";

export default function ShopPage() {
  const { currency } = useCurrency();
  const onSale = products.filter((p) => p.image && !p.image.endsWith(".svg"));

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl sm:text-4xl font-bold">Shop</h1>
          <p className="text-white/60 text-sm mt-1">All items currently on sale across every store.</p>
        </div>
        <div className="text-white/60 text-sm">{onSale.length} items</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {onSale.map((p) => {
          const store = stores.find((s) => s.id === p.storeId);
          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="pixel-card p-3 sm:p-4 hover:bg-ph-navy-3 transition-colors block"
            >
              <div className="aspect-square rounded-lg mb-3 overflow-hidden bg-white/5">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-white text-sm font-semibold truncate">{p.name}</div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-white/50 text-xs truncate">{store?.name}</div>
                <div className="text-ph-cyan text-sm font-semibold shrink-0">
                  {currency === "SOL" ? `${p.priceSol} SOL` : `$${p.priceUsd}`}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
