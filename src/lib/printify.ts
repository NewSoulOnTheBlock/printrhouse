const BASE = "https://api.printify.com/v1";

function key() {
  const k = process.env.PRINTIFY_API_KEY;
  if (!k) throw new Error("PRINTIFY_API_KEY missing");
  return k;
}

export function shopId() {
  const s = process.env.PRINTIFY_SHOP_ID;
  if (!s) throw new Error("PRINTIFY_SHOP_ID missing");
  return s;
}

async function pf<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key()}`,
      "Content-Type": "application/json",
      "User-Agent": "Printrhouse/1.0",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  let data: any = text;
  try { data = JSON.parse(text); } catch {}
  if (!res.ok) {
    const msg = typeof data === "object" ? JSON.stringify(data) : data;
    throw new Error(`Printify ${res.status}: ${msg}`);
  }
  return data as T;
}

export const printify = {
  shops: () => pf<any[]>("/shops.json"),

  listProducts: (page = 1, limit = 50) =>
    pf<{ data: any[]; total: number; current_page: number; last_page: number }>(
      `/shops/${shopId()}/products.json?limit=${limit}&page=${page}`
    ),

  getProduct: (id: string) => pf(`/shops/${shopId()}/products/${id}.json`),

  publishProduct: (id: string) =>
    pf(`/shops/${shopId()}/products/${id}/publish.json`, {
      method: "POST",
      body: JSON.stringify({
        title: true, description: true, images: true, variants: true, tags: true, keyFeatures: true, shipping_template: true,
      }),
    }),

  catalogBlueprints: () => pf<any[]>("/catalog/blueprints.json"),

  catalogBlueprint: (id: number) => pf(`/catalog/blueprints/${id}.json`),

  blueprintProviders: (blueprintId: number) =>
    pf<any[]>(`/catalog/blueprints/${blueprintId}/print_providers.json`),

  blueprintVariants: (blueprintId: number, providerId: number) =>
    pf<{ variants: any[] }>(
      `/catalog/blueprints/${blueprintId}/print_providers/${providerId}/variants.json`
    ),

  uploadImage: (file_name: string, contents_base64: string) =>
    pf("/uploads/images.json", {
      method: "POST",
      body: JSON.stringify({ file_name, contents: contents_base64 }),
    }),

  createProduct: (body: any) =>
    pf(`/shops/${shopId()}/products.json`, { method: "POST", body: JSON.stringify(body) }),

  createOrder: (body: any) =>
    pf(`/shops/${shopId()}/orders.json`, { method: "POST", body: JSON.stringify(body) }),

  shippingRates: (address: any, line_items: any[]) =>
    pf(`/shops/${shopId()}/orders/shipping.json`, {
      method: "POST",
      body: JSON.stringify({ address_to: address, line_items }),
    }),
};
