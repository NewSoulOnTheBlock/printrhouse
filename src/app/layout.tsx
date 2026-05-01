import type { Metadata } from "next";
import WalletContextProvider from "@/components/WalletProvider";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Printrhouse — Launch your store",
  description: "Creator merch marketplace. Launch a store, zero upfront cost.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pixel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <WalletContextProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <footer className="px-8 py-10 mt-16 text-center text-[0.6rem] uppercase tracking-widest text-ph-cream/60">
            © printrhouse. zero upfront cost. fulfilled by printful & printify.
          </footer>
        </WalletContextProvider>
      </body>
    </html>
  );
}
