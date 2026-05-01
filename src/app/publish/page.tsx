"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useToasts } from "@/lib/toasts";

export default function PublishPage() {
  const { show } = useToasts();
  const [busy, setBusy] = useState(false);
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    store_id: "",
    blueprint_id: "",
    print_provider_id: "",
    title: "",
    description: "",
    price_usd: 25,
    upload_id: "",
    variant_ids: [] as number[],
    placement: "front",
    gate_mint: "",
  });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pod/catalog").then(r => r.json()).then(d => setBlueprints(d.blueprints?.slice(0,40) ?? []));
    fetch("/api/stores").then(r => r.json()).then(d => setStores(d.stores ?? []));
  }, []);

  useEffect(() => {
    if (!form.blueprint_id) return;
    fetch(`/api/pod/catalog?blueprintId=${form.blueprint_id}&providers=1`)
      .then(r => r.json())
      .then(d => setProviders(d.providers ?? []));
  }, [form.blueprint_id]);

  useEffect(() => {
    if (!form.blueprint_id || !form.print_provider_id) return;
    fetch(`/api/pod/catalog?blueprintId=${form.blueprint_id}&providerId=${form.print_provider_id}`)
      .then(r => r.json())
      .then(d => setVariants(d.variants ?? []));
  }, [form.blueprint_id, form.print_provider_id]);

  function toggleVariant(id: number) {
    setForm((f: any) => ({
      ...f,
      variant_ids: f.variant_ids.includes(id) ? f.variant_ids.filter((x: number) => x !== id) : [...f.variant_ids, id],
    }));
  }

  async function publish() {
    setBusy(true); setResult(null);
    try {
      const res = await fetch("/api/publish", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          blueprint_id: Number(form.blueprint_id),
          print_provider_id: Number(form.print_provider_id),
          gate_mint: form.gate_mint || null,
          store_id: form.store_id || null,
        }),
      }).then(r => r.json());
      if (!res.ok) throw new Error(res.error);
      setResult(res);
      show("ok", `Published "${res.product.title}" to your shop`);
    } catch (e: any) {
      show("err", e.message);
    } finally { setBusy(false); }
  }

  return (
    <div className="px-4 sm:px-12 py-8 max-w-3xl">
      <h1 className="text-white text-3xl sm:text-5xl font-bold mb-2">Publish a product</h1>
      <p className="text-white/60 text-sm mb-6">
        Upload your art in the <Link href="/designer" className="text-ph-yellow underline">Designer</Link> first to get an <code>upload_id</code>,
        then fill this form to push a real product to your Printify shop + marketplace.
      </p>

      <div className="space-y-4">
        <Field label="Store">
          <select className="input" value={form.store_id} onChange={e => setForm({ ...form, store_id: e.target.value })}>
            <option value="">— none / house —</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>

        <Field label="Title">
          <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </Field>

        <Field label="Description">
          <textarea className="input min-h-24" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (USD)">
            <input type="number" className="input" value={form.price_usd}
                   onChange={e => setForm({ ...form, price_usd: Number(e.target.value) })} />
          </Field>
          <Field label="Token gate (mint, optional)">
            <input className="input" placeholder="So1111…" value={form.gate_mint}
                   onChange={e => setForm({ ...form, gate_mint: e.target.value })} />
          </Field>
        </div>

        <Field label="Printify Upload ID (from Designer)">
          <input className="input" placeholder="e.g. 5e16d…"
                 value={form.upload_id} onChange={e => setForm({ ...form, upload_id: e.target.value })} />
        </Field>

        <Field label="Blueprint">
          <select className="input" value={form.blueprint_id} onChange={e => setForm({ ...form, blueprint_id: e.target.value, print_provider_id: "", variant_ids: [] })}>
            <option value="">— pick blueprint —</option>
            {blueprints.map((b) => <option key={b.id} value={b.id}>{b.id} · {b.title}</option>)}
          </select>
        </Field>

        {providers.length > 0 && (
          <Field label="Print provider">
            <select className="input" value={form.print_provider_id} onChange={e => setForm({ ...form, print_provider_id: e.target.value, variant_ids: [] })}>
              <option value="">— pick provider —</option>
              {providers.map((p: any) => <option key={p.id} value={p.id}>{p.id} · {p.title}</option>)}
            </select>
          </Field>
        )}

        {variants.length > 0 && (
          <Field label={`Variants (${form.variant_ids.length} selected)`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-auto">
              {variants.slice(0, 60).map((v: any) => (
                <button key={v.id} onClick={() => toggleVariant(v.id)}
                        data-active={form.variant_ids.includes(v.id)}
                        className="pixel-btn text-[0.65rem] data-[active=true]:bg-ph-yellow data-[active=true]:text-black">
                  {v.title}
                </button>
              ))}
            </div>
          </Field>
        )}

        <button onClick={publish} disabled={busy} className="feature-cta w-full justify-center disabled:opacity-40">
          {busy ? "Publishing…" : "Publish to marketplace →"}
        </button>

        {result && (
          <div className="pixel-card p-4 text-sm text-ph-yellow">
            ✓ Live product: <Link className="underline" href={`/marketplace/${result.printify_id}`}>view →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: any }) {
  return (
    <div>
      <label className="block text-xs text-white/60 uppercase tracking-widest mb-1">{label}</label>
      {children}
    </div>
  );
}
