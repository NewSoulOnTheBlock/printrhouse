"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { useAuth } from "@/lib/auth";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalSol, totalUsd, clear } = useCart();
  const { currency } = useCurrency();
  const user = useAuth((s) => s.user);
  const { publicKey } = useWallet();
  const [method, setMethod] = useState<"sol" | "card">("sol");
  const [status, setStatus] = useState<string>("");
  const [form, setForm] = useState({ name: user?.handle ?? "", email: user?.email ?? "", address: "", city: "", zip: "", country: "US" });

  async function pay() {
    if (items.length === 0) return;
    setStatus("Processing...");
    if (method === "sol") {
      if (!publicKey) { setStatus("Connect a Solana wallet first."); return; }
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("Paid in SOL · order submitted to Printful for fulfillment.");
      clear();
    } else {
      const res = await fetch("/api/stripe", {
        method: "POST",
        body: JSON.stringify({ items, total: totalUsd() }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setStatus("Card checkout (demo): order recorded."); clear(); }
    }
  }

  return (
    <div className="px-4 sm:px-12 py-8 grid lg:grid-cols-2 gap-8">
      <div>
        <h1 className="text-ph-cream text-4xl tracking-tight mb-6">Checkout</h1>
        <div className="pixel-card p-5 space-y-3">
          {(["name","email","address","city","zip","country"] as const).map((k) => (
            <input key={k} placeholder={k.toUpperCase()} value={(form as any)[k]}
                   onChange={(e)=>setForm({...form, [k]: e.target.value})}
                   className="w-full bg-ph-purple-dark text-ph-cream text-xs p-3 rounded" />
          ))}
        </div>

        <div className="mt-6 pixel-card p-5">
          <div className="text-[0.65rem] uppercase tracking-widest text-ph-cream/60 mb-3">Payment</div>
          <div className="flex gap-3">
            <button onClick={()=>setMethod("sol")} data-active={method==="sol"}
                    className="pixel-btn flex-1 data-[active=true]:bg-ph-pink">Pay with SOL</button>
            <button onClick={()=>setMethod("card")} data-active={method==="card"}
                    className="pixel-btn flex-1 data-[active=true]:bg-ph-pink">Card (Stripe)</button>
          </div>
        </div>

        <button onClick={pay} className="pixel-btn w-full mt-6" style={{ background: "#ff59c7" }}>
          Place Order · {currency === "SOL" ? `${totalSol().toFixed(2)} SOL` : `$${totalUsd().toFixed(2)}`}
        </button>
        {status && <p className="mt-4 text-ph-mint text-xs">{status}</p>}
      </div>

      <aside className="pixel-card p-5 h-fit">
        <h2 className="text-ph-cream text-lg mb-4">Order</h2>
        {items.length === 0 ? (
          <p className="text-ph-cream/60 text-xs">Cart is empty. <Link href="/stores" className="text-ph-pink">Find a drop →</Link></p>
        ) : (
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.productId+i.size+i.color} className="flex justify-between text-xs text-ph-cream">
                <span>{i.name} · {i.size}/{i.color} ×{i.qty}</span>
                <span className="text-ph-mint">{currency==="SOL"?`${(i.priceSol*i.qty).toFixed(2)} SOL`:`$${(i.priceUsd*i.qty).toFixed(2)}`}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-white/10 mt-4 pt-4 flex justify-between text-ph-cream text-sm">
          <span>Total</span>
          <span className="text-ph-mint">{currency==="SOL"?`${totalSol().toFixed(2)} SOL`:`$${totalUsd().toFixed(2)}`}</span>
        </div>
      </aside>
    </div>
  );
}
