"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { useAuth } from "@/lib/auth";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  const count = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);
  const { currency, setCurrency } = useCurrency();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  return (
    <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between gap-4 z-30 relative">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo-wordmark.png" alt="printrhouse" className="h-[18rem] sm:h-[22rem] w-auto" />
      </Link>

      <nav className="hidden md:flex gap-6 text-[0.65rem] uppercase tracking-widest text-ph-cream/80">
        <Link href="/stores" className="hover:text-ph-pink">Stores</Link>
        <Link href="/launch" className="hover:text-ph-pink">Launch</Link>
        <Link href="/designer" className="hover:text-ph-pink">Designer</Link>
        <Link href="/admin" className="hover:text-ph-pink">Admin</Link>
      </nav>

      <div className="flex items-center gap-3">
        <div className="toggle-pill">
          <button data-active={currency==="SOL"} onClick={()=>setCurrency("SOL")}>$Sol</button>
          <button data-active={currency==="USD"} onClick={()=>setCurrency("USD")}>$Usd</button>
        </div>
        <button onClick={() => setOpen(true)} className="pixel-btn relative">
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-ph-pink text-[0.6rem] px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </button>
        {user ? (
          <button onClick={logout} className="pixel-btn">{user.handle}</button>
        ) : (
          <Link href="/login" className="pixel-btn">+ login</Link>
        )}
        <div className="hidden lg:block">
          <WalletMultiButton style={{ background:"#ff59c7", color:"#fff", height:"36px", fontSize:"0.7rem", borderRadius:"4px" }} />
        </div>
      </div>
    </header>
  );
}
