"use client";
import { products, stores } from "@/lib/data";

export default function AdminPage() {
  const totalRevenue = products.reduce((a,p)=>a+p.priceUsd*5, 0);
  return (
    <div className="px-4 sm:px-12 py-8">
      <h1 className="text-ph-cream text-4xl tracking-tight mb-8">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Stores", value: stores.length },
          { label: "Products", value: products.length },
          { label: "Revenue (USD)", value: `$${totalRevenue.toFixed(0)}` },
        ].map(s => (
          <div key={s.label} className="pixel-card p-5">
            <div className="text-ph-cream/60 text-[0.6rem] uppercase tracking-widest">{s.label}</div>
            <div className="text-ph-cream text-3xl mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-ph-cream text-2xl mb-4">Products</h2>
      <div className="pixel-card overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-ph-purple-dark text-ph-cream/60 uppercase text-[0.6rem]">
            <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Store</th><th className="p-3 text-right">USD</th><th className="p-3 text-right">SOL</th><th className="p-3 text-right">Stock</th></tr>
          </thead>
          <tbody>
            {products.map(p => {
              const stock = p.variants.reduce((a,v)=>a+v.stock,0);
              const store = stores.find(s=>s.id===p.storeId)?.name;
              return (
                <tr key={p.id} className="border-t border-white/5 text-ph-cream">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{store}</td>
                  <td className="p-3 text-right text-ph-mint">${p.priceUsd}</td>
                  <td className="p-3 text-right text-ph-mint">{p.priceSol}</td>
                  <td className="p-3 text-right">{stock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
