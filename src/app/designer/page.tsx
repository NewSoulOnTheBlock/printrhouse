"use client";
import { useEffect, useRef, useState } from "react";

type GarmentKey = "tshirt" | "hoodie" | "sweatshirt" | "longsleeve" | "cap";

const GARMENTS: Record<GarmentKey, { label: string; image: string; printArea: { x: number; y: number; w: number; h: number } }> = {
  tshirt:     { label: "Tee",        image: "/products/tee-cloud.svg",    printArea: { x: 175, y: 145, w: 250, h: 320 } },
  hoodie:     { label: "Hoodie",     image: "/products/hoodie-cloud.svg", printArea: { x: 185, y: 200, w: 230, h: 280 } },
  sweatshirt: { label: "Sweatshirt", image: "/products/sweat-cloud.svg",  printArea: { x: 175, y: 165, w: 250, h: 300 } },
  longsleeve: { label: "Longsleeve", image: "/products/long-cloud.svg",   printArea: { x: 175, y: 195, w: 250, h: 280 } },
  cap:        { label: "Cap",        image: "/products/cap.svg",          printArea: { x: 220, y: 110, w: 160, h: 90  } },
};

export default function DesignerPage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fcRef = useRef<any>(null);
  const printAreaRef = useRef<any>(null);
  const bgRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [garment, setGarment] = useState<GarmentKey>("tshirt");
  const [text, setText] = useState("PRINTR");
  const [color, setColor] = useState("#ff59c7");
  const [busy, setBusy] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  // Initialize fabric canvas once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fabric = await import("fabric");
      if (cancelled || !canvasElRef.current) return;

      const fc = new fabric.Canvas(canvasElRef.current, {
        width: 600,
        height: 600,
        backgroundColor: "rgba(255,255,255,0.95)",
        preserveObjectStacking: true,
      });
      fcRef.current = fc;
      await loadGarment(garment);
    })();
    return () => {
      cancelled = true;
      fcRef.current?.dispose?.();
      fcRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-load garment when changed
  useEffect(() => {
    if (fcRef.current) loadGarment(garment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garment]);

  async function loadGarment(g: GarmentKey) {
    const fabric = await import("fabric");
    const fc = fcRef.current;
    if (!fc) return;
    const cfg = GARMENTS[g];

    if (bgRef.current) { fc.remove(bgRef.current); bgRef.current = null; }
    if (printAreaRef.current) { fc.remove(printAreaRef.current); printAreaRef.current = null; }

    await new Promise<void>((resolve) => {
      fabric.Image.fromURL(cfg.image, { crossOrigin: "anonymous" }).then((img: any) => {
        img.set({ selectable: false, evented: false, left: 100, top: 60, scaleX: 0.85, scaleY: 0.85 });
        fc.add(img); fc.sendObjectToBack(img);
        bgRef.current = img;
        resolve();
      });
    });

    const rect = new fabric.Rect({
      left: cfg.printArea.x, top: cfg.printArea.y,
      width: cfg.printArea.w, height: cfg.printArea.h,
      fill: "transparent",
      stroke: "rgba(255,89,199,0.9)", strokeDashArray: [6, 4], strokeWidth: 2,
      selectable: false, evented: false,
    });
    fc.add(rect);
    printAreaRef.current = rect;
    fc.requestRenderAll();
  }

  async function addText() {
    const fabric = await import("fabric");
    const fc = fcRef.current; if (!fc) return;
    const cfg = GARMENTS[garment];
    const t = new fabric.Textbox(text || "TEXT", {
      left: cfg.printArea.x + cfg.printArea.w / 2 - 60,
      top: cfg.printArea.y + cfg.printArea.h / 2 - 18,
      fontSize: 36, fill: color,
      fontFamily: "Press Start 2P, monospace",
      width: 200, textAlign: "center",
    });
    fc.add(t); fc.setActiveObject(t); fc.requestRenderAll();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const fabric = await import("fabric");
      const fc = fcRef.current; if (!fc) return;
      const cfg = GARMENTS[garment];
      const img = await fabric.Image.fromURL(ev.target?.result as string);
      const scale = Math.min(cfg.printArea.w / img.width!, cfg.printArea.h / img.height!) * 0.7;
      img.set({
        left: cfg.printArea.x + cfg.printArea.w / 2,
        top: cfg.printArea.y + cfg.printArea.h / 2,
        originX: "center", originY: "center",
        scaleX: scale, scaleY: scale,
      });
      fc.add(img); fc.setActiveObject(img); fc.requestRenderAll();
    };
    reader.readAsDataURL(f);
  }

  function deleteSelected() {
    const fc = fcRef.current; if (!fc) return;
    const obj = fc.getActiveObject();
    if (obj && obj !== bgRef.current && obj !== printAreaRef.current) {
      fc.remove(obj); fc.discardActiveObject(); fc.requestRenderAll();
    }
  }

  // Export only the print area as a transparent PNG (suitable for Printify upload)
  async function exportPrintArea(): Promise<string> {
    const fc = fcRef.current; if (!fc) throw new Error("Canvas not ready");
    const cfg = GARMENTS[garment];
    if (printAreaRef.current) printAreaRef.current.visible = false;
    if (bgRef.current) bgRef.current.visible = false;
    fc.requestRenderAll();
    const dataUrl = fc.toDataURL({
      format: "png",
      left: cfg.printArea.x,
      top: cfg.printArea.y,
      width: cfg.printArea.w,
      height: cfg.printArea.h,
      multiplier: 2,
    });
    if (printAreaRef.current) printAreaRef.current.visible = true;
    if (bgRef.current) bgRef.current.visible = true;
    fc.requestRenderAll();
    return dataUrl;
  }

  async function uploadToPrintify() {
    setErr(null); setUploadResult(null); setBusy(true);
    try {
      const dataUrl = await exportPrintArea();
      const base64 = dataUrl.split(",")[1];
      const file_name = `printrhouse-${garment}-${Date.now()}.png`;
      const res = await fetch("/api/pod/upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_name, contents: base64 }),
      }).then((r) => r.json());
      if (!res.ok) throw new Error(res.error || "Upload failed");
      setUploadResult(res.upload);
    } catch (e: any) { setErr(e.message); }
    finally { setBusy(false); }
  }

  function downloadPng() {
    exportPrintArea().then((url) => {
      const a = document.createElement("a");
      a.href = url; a.download = `printrhouse-${garment}.png`;
      a.click();
    });
  }

  return (
    <div className="px-4 sm:px-12 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="pixel-card p-4">
        <div ref={wrapRef} className="bg-white/95 rounded overflow-hidden flex items-center justify-center">
          <canvas ref={canvasElRef} />
        </div>
        <p className="text-[0.55rem] uppercase tracking-widest text-ph-cream/60 mt-3">
          dashed pink box = printify print area · drag/resize/rotate any layer
        </p>
      </div>

      <aside className="space-y-4">
        <div className="pixel-card p-4">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 mb-2">Garment</div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(GARMENTS) as GarmentKey[]).map((g) => (
              <button key={g} onClick={() => setGarment(g)} data-active={g === garment}
                      className="pixel-btn data-[active=true]:bg-ph-pink text-[0.6rem]">
                {GARMENTS[g].label}
              </button>
            ))}
          </div>
        </div>

        <div className="pixel-card p-4">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60 mb-2">Upload art</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload}
                 className="text-xs text-ph-cream/80 w-full" />
        </div>

        <div className="pixel-card p-4 space-y-3">
          <div className="text-[0.6rem] uppercase tracking-widest text-ph-cream/60">Text layer</div>
          <input value={text} onChange={(e) => setText(e.target.value)}
                 className="w-full bg-ph-purple-dark text-ph-cream text-xs p-2 rounded" />
          <div className="flex gap-2">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 rounded" />
            <button onClick={addText} className="pixel-btn flex-1 text-[0.65rem]">+ Add text</button>
          </div>
        </div>

        <div className="pixel-card p-4 space-y-2">
          <button onClick={deleteSelected} className="pixel-btn w-full text-[0.65rem]">Delete selected</button>
          <button onClick={downloadPng} className="pixel-btn w-full text-[0.65rem]">Download PNG</button>
        </div>

        <button onClick={uploadToPrintify} disabled={busy}
                className="pixel-btn w-full disabled:opacity-40" style={{ background: "#ff59c7" }}>
          {busy ? "Uploading…" : "Upload to Printify →"}
        </button>

        {err && <p className="text-ph-pink text-xs break-all">⚠ {err}</p>}
        {uploadResult && (
          <div className="pixel-card p-3 text-[0.65rem] text-ph-cream/80 space-y-1">
            <p className="text-ph-mint">✓ Uploaded to your Printify media library</p>
            <p>id: <span className="text-ph-mint break-all">{uploadResult.id}</span></p>
            <p>file: {uploadResult.file_name}</p>
            <p>size: {uploadResult.width}×{uploadResult.height}</p>
            <p className="text-ph-cream/60 mt-2">
              Use this <code>id</code> when calling <code>printify.createProduct(...)</code> to make a real product.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
