"use client";
import { useRef, useState } from "react";

export default function DesignerPage() {
  const [bg, setBg] = useState("/products/tee-cloud.svg");
  const [art, setArt] = useState<string | null>(null);
  const [text, setText] = useState("PRINTR");
  const [color, setColor] = useState("#ff59c7");
  const fileRef = useRef<HTMLInputElement>(null);

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f); setArt(url);
  }

  return (
    <div className="px-4 sm:px-12 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
      <div className="pixel-card p-6">
        <div className="bg-white/95 rounded aspect-square relative flex items-center justify-center overflow-hidden">
          <img src={bg} className="w-full h-full object-contain" />
          {art && <img src={art} className="absolute w-1/3 top-1/3 left-1/3" />}
          {text && (
            <div className="absolute bottom-1/3 left-0 right-0 text-center font-bold tracking-tighter text-2xl"
                 style={{ color }}>{text}</div>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="pixel-card p-4">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 mb-2">Garment</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { l:"Tee", v:"/products/tee-cloud.svg"},
              { l:"Hood", v:"/products/hoodie-cloud.svg"},
              { l:"Cap", v:"/products/cap.svg"},
            ].map(g=>(
              <button key={g.l} onClick={()=>setBg(g.v)} data-active={bg===g.v}
                      className="pixel-btn data-[active=true]:bg-ph-pink">{g.l}</button>
            ))}
          </div>
        </div>

        <div className="pixel-card p-4">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 mb-2">Upload art</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="text-xs text-ph-cream/80" />
        </div>

        <div className="pixel-card p-4 space-y-3">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60">Text</div>
          <input value={text} onChange={(e)=>setText(e.target.value)} className="w-full bg-ph-purple-dark text-ph-cream text-xs p-2 rounded" />
          <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} className="w-full h-10 rounded" />
        </div>

        <button className="pixel-btn w-full" style={{ background: "#ff59c7" }}>Save to my store</button>
      </aside>
    </div>
  );
}
