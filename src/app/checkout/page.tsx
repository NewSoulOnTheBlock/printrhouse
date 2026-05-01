"use client";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { useAuth } from "@/lib/auth";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { buildSplitTx, computeSplits } from "@/lib/sol-pay-split";
import { useToasts } from "@/lib/toasts";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalSol, totalUsd, clear } = useCart();
  const { currency } = useCurrency();
  const user = useAuth((s) => s.user);
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const { show } = useToasts();
  const [method, setMethod] = useState<"sol" | "card">("sol");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState<{ sig: string; podOk: boolean; podMsg?: string } | null>(null);
  const [storeMeta, setStoreMeta] = useState<{ creator: string | null; royaltyBps: number; gates: string[] }>({
    creator: null, royaltyBps: 0, gates: [],
  });
  const [form, setForm] = useState({
    first_name: user?.handle ?? "", last_name: "", email: user?.email ?? "", phone: "",
    address1: "", address2: "", city: "", region: "", zip: "", country: "US",
  });

  const orderId = useMemo(() => `PH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, []);

  // Look up store/royalty + gates for items in cart
  useEffect(() => {
    if (items.length === 0) return;
    (async () => {
      const all = await fetch("/api/products").then(r => r.json()).catch(() => ({ products: [] }));
      const products: any[] = all.products ?? [];
      const matches = products.filter((p) =>
        items.some((i) => i.printifyProductId && String(i.printifyProductId) === String(p.printify_product_id))
      );
      const creators = matches.map((p) => p.stores?.owner_wallet).filter(Boolean);
      const royaltyBps = matches[0]?.stores?.royalty_bps ?? 0;
      const gates = matches.map((p) => p.gate_mint).filter(Boolean);
      setStoreMeta({
        creator: creators[0] ?? null,
        royaltyBps: Number(royaltyBps) || 0,
        gates,
      });
    })();
  }, [items.length]);

  function validateAddress(): string | null {
    for (const k of ["first_name","last_name","email","address1","city","zip","country"] as const) {
      if (!form[k]) return `Missing ${k.replace("_"," ")}`;
    }
    return null;
  }

  async function payWithSol() {
    setErrMsg(""); setSuccess(null);
    const addrErr = validateAddress();
    if (addrErr) { setErrMsg(addrErr); return; }
    if (!connected || !publicKey) { setErrMsg("Connect a Solana wallet first."); return; }
    if (items.length === 0) { setErrMsg("Cart is empty."); return; }

    setBusy(true);
    try {
      // Token-gate enforcement
      if (storeMeta.gates.length > 0) {
        setStep("Checking token gate…");
        for (const mint of storeMeta.gates) {
          const r = await fetch("/api/gate/check", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet: publicKey.toBase58(), mint }),
          }).then((r) => r.json());
          if (!r.ok || !r.holds) throw new Error(`Token gate: must hold ${mint.slice(0,8)}…`);
        }
      }

      setStep("Recording order…");
      await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId, buyer_wallet: publicKey.toBase58(), buyer_email: form.email,
          total_sol: totalSol(), total_usd: totalUsd(),
          items: items.map((i) => ({ name: i.name, qty: i.qty, size: i.size, color: i.color,
                                     printify_product_id: i.printifyProductId, printify_variant_id: i.printifyVariantId })),
          shipping: form,
        }),
      });

      setStep("Building split transaction…");
      const sol = totalSol();
      const splits = computeSplits(sol, storeMeta.creator, storeMeta.royaltyBps);
      const { tx, blockhash, lastValidBlockHeight } = await buildSplitTx({
        connection, payer: publicKey, splits, memo: orderId,
      });

      setStep("Awaiting wallet signature…");
      const signature = await sendTransaction(tx, connection);

      setStep("Confirming on-chain…");
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

      setStep("Verifying payment server-side…");
      const verify = await fetch("/api/pay/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, expectedSol: sol, orderId }),
      }).then((r) => r.json());
      if (!verify.ok) throw new Error(`Payment verification failed: ${verify.error}`);

      setStep("Submitting order to Printify…");
      const printifyItems = items
        .filter((i) => i.printifyProductId && i.printifyVariantId)
        .map((i) => ({ product_id: i.printifyProductId!, variant_id: i.printifyVariantId!, quantity: i.qty }));

      let podOk = true; let podMsg: string | undefined; let printifyOrderId: string | undefined;
      if (printifyItems.length === 0) {
        podOk = false;
        podMsg = "Payment received & verified on-chain. (Cart items have no Printify product mapping yet.)";
      } else {
        const order = await fetch("/api/pod/order", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            external_id: orderId, label: `Printrhouse ${orderId}`,
            line_items: printifyItems, shipping_method: 1, send_shipping_notification: true,
            address_to: {
              first_name: form.first_name, last_name: form.last_name,
              email: form.email, phone: form.phone,
              country: form.country, region: form.region, city: form.city,
              address1: form.address1, address2: form.address2, zip: form.zip,
            },
          }),
        }).then((r) => r.json());
        if (!order.ok) { podOk = false; podMsg = `Printify error: ${order.error}`; }
        else printifyOrderId = order.order?.id ?? order.id;
      }

      // Patch order with sig + status + printify id
      await fetch("/api/orders", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId, sig: signature,
          printify_order_id: printifyOrderId, status: podOk ? "paid" : "paid",
        }),
      });

      show("ok", "Payment confirmed");
      setSuccess({ sig: signature, podOk, podMsg });
      clear();
    } catch (e: any) {
      setErrMsg(e.message || String(e));
      show("err", e.message || "Checkout failed");
    } finally {
      setBusy(false); setStep("");
    }
  }

  async function payWithCard() {
    setErrMsg(""); setBusy(true); setStep("Creating Stripe session…");
    try {
      const res = await fetch("/api/stripe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total: totalUsd() }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.demo) setErrMsg("Stripe key not configured on server.");
      else throw new Error(data.error || "Stripe init failed");
    } catch (e: any) { setErrMsg(e.message); }
    finally { setBusy(false); setStep(""); }
  }

  return (
    <div className="px-3 sm:px-12 py-6 sm:py-8 grid lg:grid-cols-2 gap-6 lg:gap-8">
      <div>
        <h1 className="text-ph-cream text-3xl sm:text-4xl tracking-tight mb-2">Checkout</h1>
        <p className="text-ph-cream/60 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-widest mb-5 sm:mb-6 break-all">order id: {orderId}</p>

        <div className="pixel-card p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            ["first_name","First name"],["last_name","Last name"],
            ["email","Email"],["phone","Phone"],
            ["address1","Address line 1"],["address2","Address line 2"],
            ["city","City"],["region","State/Region"],
            ["zip","ZIP"],["country","Country (e.g. US)"],
          ] as const).map(([k,label]) => (
            <input key={k} placeholder={label} value={(form as any)[k]}
                   onChange={(e)=>setForm({...form, [k]: e.target.value})}
                   className="bg-ph-purple-dark text-ph-cream text-xs p-3 rounded col-span-1" />
          ))}
        </div>

        {storeMeta.creator && storeMeta.royaltyBps > 0 && (
          <div className="mt-4 pixel-card p-4 text-[0.65rem] uppercase tracking-widest text-ph-cream/70">
            Royalty split → creator <span className="text-ph-yellow">{storeMeta.creator.slice(0,6)}…</span> earns {(storeMeta.royaltyBps/100).toFixed(1)}%
          </div>
        )}
        {storeMeta.gates.length > 0 && (
          <div className="mt-3 pixel-card p-3 text-[0.65rem] uppercase tracking-widest text-ph-pink">
            🔒 token-gated drop · {storeMeta.gates.length} mint(s) required
          </div>
        )}

        <div className="mt-6 pixel-card p-5">
          <div className="text-[0.65rem] uppercase tracking-widest text-ph-cream/60 mb-3">Payment method</div>
          <div className="flex gap-3">
            <button onClick={()=>setMethod("sol")} data-active={method==="sol"}
                    className="pixel-btn flex-1 data-[active=true]:bg-ph-pink">Pay with SOL</button>
            <button onClick={()=>setMethod("card")} data-active={method==="card"}
                    className="pixel-btn flex-1 data-[active=true]:bg-ph-pink">Card (Stripe)</button>
          </div>
          {method === "sol" && (
            <div className="mt-4">
              <WalletMultiButton style={{ background: "#ff59c7", color:"#fff", height:"40px", width:"100%", borderRadius:"4px", justifyContent:"center" }} />
              {publicKey && (
                <p className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 mt-2">
                  paying from: <span className="text-ph-mint">{publicKey.toBase58().slice(0,6)}…{publicKey.toBase58().slice(-6)}</span>
                </p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={method === "sol" ? payWithSol : payWithCard}
          disabled={busy || items.length === 0}
          className="pixel-btn w-full mt-6 disabled:opacity-40"
          style={{ background: "#ff59c7" }}>
          {busy ? (step || "Working…") : `Place Order · ${currency === "SOL" ? `${totalSol().toFixed(3)} SOL` : `$${totalUsd().toFixed(2)}`}`}
        </button>

        {errMsg && <p className="mt-4 text-ph-pink text-xs break-all">⚠ {errMsg}</p>}
        {success && (
          <div className="mt-4 pixel-card p-4 space-y-2">
            <p className="text-ph-mint text-xs">✓ Payment confirmed on-chain</p>
            <a className="text-[0.65rem] underline text-ph-cream/80 break-all"
               href={`https://solscan.io/tx/${success.sig}`} target="_blank" rel="noreferrer">
              View tx → {success.sig.slice(0,12)}…
            </a>
            <p className={`text-xs ${success.podOk ? "text-ph-mint" : "text-ph-cream/80"}`}>
              {success.podOk ? "✓ Order submitted to Printify for fulfillment." : success.podMsg}
            </p>
            <Link href="/orders" className="text-[0.65rem] underline text-ph-yellow">Track in Your Orders →</Link>
          </div>
        )}
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
                <span className="text-ph-mint">{currency==="SOL"?`${(i.priceSol*i.qty).toFixed(3)} SOL`:`$${(i.priceUsd*i.qty).toFixed(2)}`}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-white/10 mt-4 pt-4 flex justify-between text-ph-cream text-sm">
          <span>Total</span>
          <span className="text-ph-mint">{currency==="SOL"?`${totalSol().toFixed(3)} SOL`:`$${totalUsd().toFixed(2)}`}</span>
        </div>
        <p className="text-[0.55rem] uppercase tracking-widest text-ph-cream/40 mt-3">payments split on-chain · settled via helius rpc</p>
      </aside>
    </div>
  );
}
