"use client";
import { useToasts } from "@/lib/toasts";

export default function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className="pixel-card text-left p-3 text-sm pr-8 relative shadow-2xl"
          style={{
            background: t.kind === "ok" ? "#1a4d2e" : t.kind === "err" ? "#5a1a2e" : "#2d1054",
            color: "#fff",
          }}
        >
          <span className="absolute right-2 top-1 text-white/50">×</span>
          {t.kind === "ok" && "✓ "}{t.kind === "err" && "⚠ "}{t.text}
        </button>
      ))}
    </div>
  );
}
