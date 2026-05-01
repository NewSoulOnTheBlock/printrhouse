export type Variant = { size: string; color: string; stock: number; printifyVariantId?: number };
export type Product = {
  id: string;
  slug: string;
  storeId: string;
  name: string;
  ticker: string;
  priceSol: number;
  priceUsd: number;
  type: "tshirt" | "hoodie" | "sweatshirt" | "longsleeve" | "cap";
  image: string;
  variants: Variant[];
  description: string;
  printifyProductId?: string;
};
export type Store = {
  id: string;
  slug: string;
  name: string;
  owner: string;
  ticker: string;
  banner: string;
  avatar: string;
  bio: string;
};

export const stores: Store[] = [
  { id: "s1", slug: "fatchoi", name: "FAT CHOI", owner: "Charlotte M.", ticker: "$FAT", banner: "/stores/cover-1.jpg", avatar: "/avatars/a1.svg", bio: "Lucky merch for lucky degens." },
  { id: "s2", slug: "believe", name: "BELIEVE", owner: "Kade R.", ticker: "$BLV", banner: "/stores/cover-2.jpg", avatar: "/avatars/a2.svg", bio: "Faith-based fits for the on-chain faithful." },
  { id: "s3", slug: "sprintr", name: "SPRINTR", owner: "Mika O.", ticker: "$PRINT", banner: "/stores/cover-3.jpg", avatar: "/avatars/a3.svg", bio: "House brand. Pixel-perfect drops." },
  { id: "s4", slug: "printrhouse", name: "PRINTRHOUSE", owner: "House", ticker: "$PRTR", banner: "/stores/cover-4.jpg", avatar: "/mascot.png", bio: "Official house drops." },
];

export const products: Product[] = [
  { id: "p1", slug: "fat-choi-tshirt", storeId: "s1", name: "FAT CHOI T-shirt", ticker: "$FAT", priceSol: 0.3, priceUsd: 32, type: "tshirt", image: "/products/tee-cloud.svg",
    variants: [{ size:"S",color:"white",stock:12},{size:"M",color:"white",stock:18},{size:"L",color:"white",stock:9},{size:"XL",color:"white",stock:4},{size:"M",color:"black",stock:7}],
    description: "Heavyweight 240gsm cotton tee with a serene cloud print on the chest. Fulfilled by Printful." },
  { id: "p2", slug: "believe-hoodie", storeId: "s2", name: "BELIEVE Hoodie", ticker: "$BLV", priceSol: 0.3, priceUsd: 64, type: "hoodie", image: "/products/hoodie-cloud.svg",
    variants: [{size:"M",color:"white",stock:6},{size:"L",color:"white",stock:11},{size:"XL",color:"white",stock:5}],
    description: "Brushed-fleece pullover hoodie. Heavy. Soft. Holy." },
  { id: "p3", slug: "sprintr-sweatshirt", storeId: "s3", name: "SPRINTR Sweat Shirt", ticker: "$PRINT", priceSol: 0.3, priceUsd: 58, type: "sweatshirt", image: "/products/sweat-cloud.svg",
    variants: [{size:"S",color:"white",stock:8},{size:"M",color:"white",stock:14},{size:"L",color:"white",stock:10}],
    description: "Crewneck sweatshirt with back-print. House drop." },
  { id: "p4", slug: "sprintr-cap", storeId: "s3", name: "SPRINTR Cap", ticker: "$PRINT", priceSol: 0.15, priceUsd: 28, type: "cap", image: "/products/cap.svg",
    variants: [{size:"OS",color:"purple",stock:25}], description: "Six-panel pixel-logo cap. One size." },
  { id: "p5", slug: "fat-choi-longsleeve", storeId: "s1", name: "FAT CHOI Longsleeve", ticker: "$FAT", priceSol: 0.35, priceUsd: 42, type: "longsleeve", image: "/products/long-cloud.svg",
    variants: [{size:"M",color:"white",stock:10},{size:"L",color:"white",stock:12}], description: "Long sleeve, ringspun cotton, sleeve hits." },
  { id: "p6", slug: "believe-tee", storeId: "s2", name: "BELIEVE Tee", ticker: "$BLV", priceSol: 0.25, priceUsd: 30, type: "tshirt", image: "/products/tee-cloud.svg",
    variants: [{size:"S",color:"white",stock:9},{size:"M",color:"white",stock:16}], description: "Lightweight cotton tee with chest emblem." },
];

export function getProduct(slug: string) { return products.find((p) => p.slug === slug); }
export function getStore(slug: string) { return stores.find((s) => s.slug === slug); }
export function productsForStore(storeId: string) { return products.filter((p) => p.storeId === storeId); }
