import Link from "next/link";
import { stores, productsForStore } from "@/lib/data";

export default function StoresIndex() {
  return (
    <div className="px-4 sm:px-12 py-8">
      <h1 className="text-ph-cream text-4xl sm:text-6xl tracking-tight mb-8">All Stores</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stores.map((s) => {
          const count = productsForStore(s.id).length;
          return (
            <Link key={s.id} href={`/store/${s.slug}`} className="pixel-card p-5 hover:-translate-y-1 transition-transform">
              <div className="aspect-[3/1] bg-white/10 rounded mb-4 flex items-center justify-center text-ph-cream/40 text-xs uppercase">{s.name}</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-ph-cream text-sm">{s.name}</div>
                  <div className="text-ph-cream/60 text-[0.6rem] uppercase">by {s.owner} · {count} drops</div>
                </div>
                <div className="text-ph-mint text-xs">{s.ticker}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
