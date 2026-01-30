import { PropertyProfile } from "@/lib/flipcalc/types";
import { money } from "@/lib/flipcalc/calc";

export default function StatGrid({ p }: { p: PropertyProfile }) {
  return (
    <div className="plastic p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold tracking-tight crt-text">{p.address}</div>
          <div className="mt-1 text-sm text-white/70">{p.cityState}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">ARV RANGE</div>
          <div className="mt-1 text-sm font-semibold text-white/90">
            {money(p.arvMin)} – {money(p.arvMax)}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Pill label="Beds" value={`${p.beds}`} />
        <Pill label="Baths" value={`${p.baths}`} />
        <Pill label="Sqft" value={`${p.sqft.toLocaleString()}`} />
        <Pill label="Year" value={`${p.yearBuilt}`} />
        <Pill label="Tax/yr" value={money(p.taxAnnual)} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">EXTERIOR</div>
          <div className="mt-2 h-24 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-black/20" />
          <div className="mt-2 text-xs text-white/45">Image placeholder (Street View hook later).</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">COMPS (SNAP)</div>
          <div className="mt-2 space-y-2 text-sm text-white/78">
            {p.comps.map((c) => (
              <div key={c.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-3 py-2">
                <div>
                  <div className="text-white/85">{c.label}</div>
                  <div className="text-xs text-white/45">
                    {c.beds}bd/{c.baths}ba • {c.sqft.toLocaleString()} sqft • {c.distanceMi.toFixed(1)} mi
                  </div>
                </div>
                <div className="font-semibold text-white/90">{money(c.soldPrice)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80">
      <span className="text-white/40">{label} · </span>
      <span className="text-white/85">{value}</span>
    </div>
  );
}
