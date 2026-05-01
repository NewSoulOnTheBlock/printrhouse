import { printify } from "./printify";

export type LiveProduct = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  priceUsd: number;
  priceSol: number;
  defaultVariantId: number | null;
  visible: boolean;
};

const SOL_USD = Number(process.env.NEXT_PUBLIC_SOL_USD ?? "180");

export async function fetchLiveProducts(): Promise<{ ok: true; products: LiveProduct[] } | { ok: false; error: string }> {
  try {
    const res = await printify.listProducts(1, 50);
    const products: LiveProduct[] = (res.data ?? []).map((p: any) => {
      const v = (p.variants ?? []).find((x: any) => x.is_default && x.is_enabled)
              ?? (p.variants ?? []).find((x: any) => x.is_enabled)
              ?? p.variants?.[0];
      const cents = v?.price ?? 0;
      const usd = cents / 100;
      return {
        id: String(p.id),
        title: p.title ?? "Untitled",
        description: (p.description ?? "").replace(/<[^>]*>/g, "").slice(0, 240),
        image: p.images?.[0]?.src ?? null,
        priceUsd: Number(usd.toFixed(2)),
        priceSol: Number((usd / SOL_USD).toFixed(3)),
        defaultVariantId: v?.id ?? null,
        visible: !!p.visible,
      };
    });
    return { ok: true, products };
  } catch (e: any) {
    return { ok: false, error: e.message ?? String(e) };
  }
}
