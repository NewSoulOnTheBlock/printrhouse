"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  const count = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);
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
    <header className="w-full px-4 sm:px-8 py-3 sm:py-4 grid grid-cols-[auto_1fr_auto] items-center gap-3 z-30 relative">
      {/* Hamburger */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
          className="w-10 h-10 flex flex-col gap-[5px] items-center justify-center rounded-md hover:bg-white/5"
        >
          <span className="block w-6 h-[2px] bg-white"></span>
          <span className="block w-6 h-[2px] bg-white"></span>
          <span className="block w-6 h-[2px] bg-white"></span>
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

      {/* Centered logo */}
      <Link href="/" className="flex items-center gap-2 justify-self-center">
        <img src="/logo-wordmark.png" alt="printrhouse" className="h-9 sm:h-12 w-auto object-contain" />
      </Link>

      {/* Right cluster: cart + bell */}
      <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open cart"
          className="relative w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3h2.6l2.4 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.5l1.6-6.5H6" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-ph-cyan text-[10px] text-ph-navy font-semibold px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </button>
        <button aria-label="Notifications" className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5z" />
            <path d="M10.5 19a1.7 1.7 0 0 0 3 0" />
          </svg>
        </button>
        {user ? (
          <button onClick={logout} className="hidden sm:inline-block pixel-btn">{user.handle}</button>
        ) : (
          <Link href="/login" className="hidden sm:inline-block pixel-btn">Log in</Link>
        )}
        <div className="hidden lg:block">
          <WalletMultiButton style={{ background:"#ab4cc7", color:"#fff", height:"36px", fontSize:"0.75rem", borderRadius:"9999px", fontWeight:600 }} />
        </div>
      </div>
    </header>
  );
}
