"use client";
import { useState } from "react";

export default function LaunchPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", ticker: "$", bio: "", payout: "" });
  return (
    <div className="px-4 sm:px-12 py-10 max-w-2xl mx-auto">
      <h1 className="text-ph-cream text-4xl sm:text-5xl tracking-tight mb-2">Launch your store</h1>
      <p className="text-ph-cream/70 text-[0.7rem] uppercase tracking-widest mb-8">step {step} of 3 · zero upfront cost</p>

      <div className="pixel-card p-6 space-y-4">
        {step === 1 && (
          <>
            <input placeholder="STORE NAME" value={data.name} onChange={(e)=>setData({...data, name:e.target.value})} className="w-full bg-ph-purple-dark text-ph-cream text-xs p-3 rounded" />
            <input placeholder="$TICKER" value={data.ticker} onChange={(e)=>setData({...data, ticker:e.target.value})} className="w-full bg-ph-purple-dark text-ph-cream text-xs p-3 rounded" />
            <textarea placeholder="BIO" value={data.bio} onChange={(e)=>setData({...data, bio:e.target.value})} rows={4} className="w-full bg-ph-purple-dark text-ph-cream text-xs p-3 rounded" />
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-ph-cream/80 text-xs">Pick a starter product. We'll mock it up so you can drop it today.</p>
            <div className="grid grid-cols-3 gap-3">
              {["TEE","HOODIE","CAP"].map(t => (
                <button key={t} className="pixel-btn">{t}</button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p className="text-ph-cream/80 text-xs">Where should we send your earnings?</p>
            <input placeholder="SOL WALLET OR PAYPAL" value={data.payout} onChange={(e)=>setData({...data, payout:e.target.value})} className="w-full bg-ph-purple-dark text-ph-cream text-xs p-3 rounded" />
          </>
        )}
        <div className="flex justify-between pt-2">
          <button disabled={step===1} onClick={()=>setStep(step-1)} className="pixel-btn disabled:opacity-30">Back</button>
          {step < 3 ? (
            <button onClick={()=>setStep(step+1)} className="pixel-btn" style={{ background: "#ff59c7" }}>Next</button>
          ) : (
            <button onClick={()=>alert("Store created (demo). Check /admin")} className="pixel-btn" style={{ background: "#ff59c7" }}>Create store</button>
          )}
        </div>
      </div>
    </div>
  );
}
