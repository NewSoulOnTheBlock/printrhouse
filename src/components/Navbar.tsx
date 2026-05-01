"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="w-full px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 z-30 relative">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
            className="pixel-btn flex flex-col gap-[3px] items-center justify-center w-10 h-10 sm:w-11 sm:h-11 p-0"
          >
            <span className="block w-5 h-[2px] bg-ph-cream"></span>
            <span className="block w-5 h-[2px] bg-ph-cream"></span>
            <span className="block w-5 h-[2px] bg-ph-cream"></span>
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              <Link href="/stores" className="menu-item" onClick={() => setMenuOpen(false)}>
                Merch Marketplace
                <span className="desc">All merchandise listed for sale</span>
              </Link>
              <Link href="/launch" className="menu-item" onClick={() => setMenuOpen(false)}>
                Create Your Store
                <span className="desc">Upload memes, add descriptions, pick merch styles</span>
              </Link>
              <span className="menu-item" data-disabled="true">
                NFT Marketplace
                <span className="desc">Coming soon</span>
              </span>
              <span className="menu-item" data-disabled="true">
                Meme Generator
                <span className="desc">Coming soon</span>
              </span>
            </div>
          )}
        </div>
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <img src="/logo-wordmark.png" alt="printrhouse" className="h-12 sm:h-20 lg:h-[9rem] w-auto max-w-[55vw] object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="toggle-pill hidden sm:inline-flex">
          <button data-active={currency==="SOL"} onClick={()=>setCurrency("SOL")}>$Sol</button>
          <button data-active={currency==="USD"} onClick={()=>setCurrency("USD")}>$Usd</button>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open cart"
          className="pixel-btn relative w-10 h-10 sm:w-11 sm:h-11 p-0 text-lg sm:text-xl flex items-center justify-center"
        >
          🛒
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-ph-pink text-[0.55rem] sm:text-[0.6rem] px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </button>
        {user ? (
          <button onClick={logout} className="pixel-btn hidden sm:inline-block">{user.handle}</button>
        ) : (
          <Link href="/login" className="pixel-btn hidden sm:inline-block">+ login</Link>
        )}
        <div className="hidden lg:block">
          <WalletMultiButton style={{ background:"#ab4cc7", color:"#fff", height:"36px", fontSize:"0.7rem", borderRadius:"4px" }} />
        </div>
      </div>
    </header>
  );
}
