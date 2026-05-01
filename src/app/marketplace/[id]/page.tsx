import Link from "next/link";
import { notFound } from "next/navigation";
import { printify } from "@/lib/printify";

export const dynamic = "force-dynamic";

const SOL_USD = Number(process.env.NEXT_PUBLIC_SOL_USD ?? "180");

export default async function MarketplaceProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any;
  try {
    product = await printify.getProduct(id);
  } catch {
    notFound();
  }
  const variants = (product.variants ?? []).filter((v: any) => v.is_enabled);
  const v = variants.find((x: any) => x.is_default) ?? variants[0];
  const usd = (v?.price ?? 0) / 100;
  const sol = (usd / SOL_USD).toFixed(3);

  return (
    <div className="px-4 sm:px-12 py-8 grid lg:grid-cols-2 gap-10">
      <div className="pixel-card p-4">
        <div className="bg-white/95 rounded aspect-square overflow-hidden flex items-center justify-center">
          <img src={product.images?.[0]?.src} alt={product.title} className="w-full h-full object-contain" />
        </div>
        <div className="grid grid-cols-5 gap-2 mt-3">
          {product.images?.slice(0, 5).map((img: any, i: number) => (
            <div key={i} className="bg-white/95 rounded aspect-square overflow-hidden">
              <img src={img.src} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-ph-cream text-3xl sm:text-5xl tracking-tight">{product.title}</h1>
        <div className="mt-4 flex gap-3 items-baseline">
          <span className="text-ph-mint text-2xl">${usd.toFixed(2)}</span>
          <span className="text-ph-cream/60 text-sm">{sol}◎</span>
        </div>

        <div className="mt-6 text-ph-cream/80 text-xs leading-relaxed"
             dangerouslySetInnerHTML={{ __html: product.description ?? "" }} />

        <div className="mt-8 space-y-2">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60">Variants ({variants.length})</div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-auto">
            {variants.slice(0, 24).map((vv: any) => (
              <span key={vv.id} className="pixel-card px-2 py-1 text-[0.55rem] uppercase">
                {vv.title} · ${(vv.price/100).toFixed(2)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/checkout" className="pixel-btn" style={{ background: "#ff59c7" }}>Buy with SOL →</Link>
          <Link href="/stores" className="pixel-btn">← back</Link>
        </div>

        <p className="mt-4 text-[0.55rem] uppercase tracking-widest text-ph-cream/40">
          printify product id: {product.id}
        </p>
      </div>
    </div>
  );
}
