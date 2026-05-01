import type { Metadata } from "next";
import WalletContextProvider from "@/components/WalletProvider";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const pixel = Press_Start_2P({ variable: "--font-pixel", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Printrhouse — Launch your store",
  description: "Creator merch marketplace. Launch a store, zero upfront cost.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${pixel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <WalletContextProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <footer className="px-6 py-10 mt-16 text-center text-xs text-white/40">
            © printrhouse · launch a store, zero upfront cost · fulfilled by printify
          </footer>
        </WalletContextProvider>
      </body>
    </html>
  );
}
