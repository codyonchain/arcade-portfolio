"use client";

import ExampleChips from "@/components/ExampleChips";
import { PropertyProfile } from "@/lib/flipcalc/types";
import { cn } from "@/lib/utils";

export default function AddressPicker({
  items,
  selectedId,
  onSelect,
  query,
  onQueryChange,
}: {
  items: PropertyProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const selected = items.find((x) => x.id === selectedId);
  const examples = items.map((x) => `${x.address}, ${x.cityState}`);

  return (
    <div className="plastic p-6">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">SNAP VERDICT</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight crt-text">Enter an address</div>
      <div className="mt-1 text-sm text-white/70">Prefill → ARV range → rehab preset → profit grade.</div>

      <div className="mt-5 space-y-4">
        <ExampleChips
          items={examples}
          value={selected ? `${selected.address}, ${selected.cityState}` : undefined}
          onChange={(v) => {
            const hit = items.find((x) => `${x.address}, ${x.cityState}` === v);
            if (hit) {
              onSelect(hit.id);
            }
            onQueryChange(v);
          }}
          label="Examples"
        />

        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="123 Main St, City, ST"
          className={cn(
            "focus-ring w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/35"
          )}
        />
      </div>
    </div>
  );
}
