"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const login = useAuth((s) => s.login);
  const router = useRouter();
  const [email, setEmail] = useState("");
  return (
    <div className="px-4 sm:px-12 py-12 max-w-md mx-auto">
      <h1 className="text-ph-cream text-4xl mb-6">Login</h1>
      <div className="pixel-card p-6 space-y-4">
        <input type="email" placeholder="EMAIL" value={email} onChange={(e)=>setEmail(e.target.value)}
               className="w-full bg-ph-purple-dark text-ph-cream text-xs p-3 rounded" />
        <button onClick={() => { if(email){ login(email); router.push("/"); } }}
                className="pixel-btn w-full" style={{ background: "#ff59c7" }}>Continue</button>
        <p className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 text-center">or connect wallet from the navbar</p>
      </div>
    </div>
  );
}
