import { notFound } from "next/navigation";
import { getStore, productsForStore, stores } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getStore(slug);
  if (!s) notFound();
  const items = productsForStore(s.id);
  return (
    <div>
      <div className="h-48 sm:h-64 bg-gradient-to-br from-ph-pink to-ph-purple-deep relative">
        <div className="absolute inset-0 scanlines" />
      </div>
      <div className="px-4 sm:px-12 -mt-12 relative z-10">
        <div className="pixel-card p-5 flex items-center gap-4">
          <div className="w-20 h-20 bg-ph-cream/90 rounded" />
          <div className="flex-1">
            <h1 className="text-ph-cream text-2xl">{s.name}</h1>
            <p className="text-ph-cream/60 text-[0.65rem] uppercase">by {s.owner} · {s.ticker}</p>
          </div>
          <button className="pixel-btn" style={{ background: "#ff59c7" }}>Follow</button>
        </div>
        <p className="text-ph-cream/80 text-xs mt-4 max-w-xl">{s.bio}</p>
      </div>
      <div className="px-4 sm:px-12 py-10">
        <h2 className="text-ph-cream text-2xl mb-4">Drops</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }));
}
