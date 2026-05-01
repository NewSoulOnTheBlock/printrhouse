"use client";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import Link from "next/link";

export default function CartDrawer() {
  const { items, open, setOpen, remove, setQty, totalSol, totalUsd } = useCart();
  const { currency } = useCurrency();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
      <aside className="w-full max-w-md bg-ph-purple-deep p-5 overflow-y-auto pixel-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-ph-cream text-sm uppercase tracking-widest">Your Cart</h2>
          <button className="pixel-btn" onClick={() => setOpen(false)}>x</button>
        </div>
        {items.length === 0 ? (
          <p className="text-ph-cream/70 text-xs">empty. go cop something.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.productId + i.size + i.color} className="pixel-card p-3 flex gap-3 items-center">
                <img src={i.image} alt="" className="w-16 h-16 bg-white/90 rounded" />
                <div className="flex-1">
                  <div className="text-[0.7rem] text-ph-cream uppercase">{i.name}</div>
                  <div className="text-[0.6rem] text-ph-cream/60">{i.size} / {i.color}</div>
                  <div className="text-[0.7rem] text-ph-mint mt-1">
                    {currency === "SOL" ? `${(i.priceSol * i.qty).toFixed(2)} SOL` : `$${(i.priceUsd * i.qty).toFixed(2)}`}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <input
                    type="number" min={1} value={i.qty}
                    onChange={(e) => setQty(i.productId, i.size, i.color, parseInt(e.target.value || "1"))}
                    className="w-14 bg-ph-purple-dark text-ph-cream text-xs p-1 text-center rounded"
                  />
                  <button onClick={() => remove(i.productId, i.size, i.color)} className="text-[0.6rem] text-ph-pink uppercase">remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex justify-between text-ph-cream text-sm mb-3">
              <span>Total</span>
              <span className="text-ph-mint">
                {currency === "SOL" ? `${totalSol().toFixed(2)} SOL` : `$${totalUsd().toFixed(2)}`}
              </span>
            </div>
            <Link href="/checkout" onClick={() => setOpen(false)} className="pixel-btn w-full block text-center">Checkout</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
