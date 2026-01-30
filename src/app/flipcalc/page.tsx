"use client";

import { useEffect, useMemo, useState } from "react";
import FlipWorldShell from "@/components/flipcalc/FlipWorldShell";
import AddressPicker from "@/components/flipcalc/AddressPicker";
import StatGrid from "@/components/flipcalc/StatGrid";
import RehabEditor from "@/components/flipcalc/RehabEditor";
import PacketView from "@/components/flipcalc/PacketView";
import NeonButton from "@/components/NeonButton";
import { MOCK_PROPERTIES } from "@/lib/flipcalc/mockData";
import { buildDefaultInputs, computeVerdict, money, pct } from "@/lib/flipcalc/calc";
import { FinancingType, FinishLevel, PropertyProfile, UnderwriteInputs } from "@/lib/flipcalc/types";
import { cn } from "@/lib/utils";

export default function FlipCalcPage() {
  const [selectedId, setSelectedId] = useState(MOCK_PROPERTIES[3].id);
  const property: PropertyProfile = useMemo(
    () => MOCK_PROPERTIES.find((p) => p.id === selectedId) ?? MOCK_PROPERTIES[0],
    [selectedId]
  );

  const [query, setQuery] = useState(`${property.address}, ${property.cityState}`);
  const [inputs, setInputs] = useState<UnderwriteInputs>(() => buildDefaultInputs(property));
  const [packetOpen, setPacketOpen] = useState(false);

  useEffect(() => {
    setQuery(`${property.address}, ${property.cityState}`);
    setInputs(buildDefaultInputs(property));
  }, [property]);

  const verdict = useMemo(() => computeVerdict(inputs), [inputs]);

  const verdictTone =
    verdict.verdictLabel === "PASS ON THIS"
      ? "text-red-300"
      : verdict.verdictLabel === "THIN"
        ? "text-amber-200"
        : "text-emerald-300";

  const setNum = <K extends keyof UnderwriteInputs>(key: K, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const setValue = <K extends keyof UnderwriteInputs>(key: K, value: UnderwriteInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <FlipWorldShell>
      <section className="pt-2">
        <div className="max-w-4xl">
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">WORLD 04 • COIN CASTLE</div>
          <h1 className="crt-text mt-3 text-5xl font-semibold tracking-tight md:text-6xl">Flip Verdict in 30 seconds.</h1>
          <p className="mt-3 text-sm text-white/70 md:text-base">Address → Prefill → ARV range → rehab preset → profit grade. Then underwrite and print a packet.</p>
        </div>
        <div className="mt-6 h-px w-full bg-white/10" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <AddressPicker items={MOCK_PROPERTIES} selectedId={selectedId} onSelect={setSelectedId} query={query} onQueryChange={setQuery} />

        <div className="plastic p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">VERDICT</div>
              <div className="mt-2 text-xl font-semibold tracking-tight crt-text">Snap Verdict</div>
              <div className="mt-1 text-sm text-white/70">Verdict + ROI + max offer — then you can refine in Underwrite.</div>
            </div>
            <div className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-center text-sm font-semibold">
              <span className="text-white/50">Verdict</span>
              <div className={cn("text-base font-bold uppercase", verdictTone)}>{verdict.verdictLabel}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <StatBadge label="Verdict" value={verdict.verdictLabel} tone={verdictTone} />
            <StatBadge label="ROI" value={pct(verdict.roi)} />
            <StatBadge label="Grade" value={verdict.grade} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Field label="Purchase Price" value={inputs.purchasePrice} onChange={(n) => setNum("purchasePrice", n)} />
            <Field label="ARV (editable)" value={inputs.arv} onChange={(n) => setNum("arv", n)} />
            <Read label="Rehab Total" value={money(verdict.rehabTotal)} />
            <Read label="Holding Total" value={money(verdict.holdingTotal)} />
            <Read label="Net Sale (after 7%)" value={money(verdict.netSale)} />
            <Read label="Profit" value={money(verdict.profit)} emphasize />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Read label="Total Cost" value={money(verdict.totalCost)} />
            <Read label="Max Offer (target profit)" value={money(verdict.maxOffer)} />
          </div>

          <div className="mt-5 flex gap-2">
            <NeonButton variant="primary" onClick={() => setPacketOpen(true)} className="w-full justify-center">
              GENERATE INVESTMENT PACKET
            </NeonButton>
          </div>

          <div className="mt-3 text-xs text-white/45">Phase 1–2 only. No deep diligence features.</div>
        </div>
      </section>

      <StatGrid p={property} />

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <RehabEditor
          sqft={property.sqft}
          yearBuilt={property.yearBuilt}
          finish={inputs.finish}
          setFinish={(v: FinishLevel) => setValue("finish", v)}
          items={inputs.rehabLineItems}
          setItems={(items) => setValue("rehabLineItems", items)}
        />

        <div className="plastic p-6">
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">UNDERWRITE</div>
          <div className="mt-2 text-xl font-semibold tracking-tight crt-text">Financing + holding</div>
          <div className="mt-1 text-sm text-white/70">Tweak assumptions. Watch the verdict update instantly.</div>

          <div className="mt-5 grid gap-3">
            <Select label="Financing" value={inputs.financing} onChange={(v) => setValue("financing", v as FinancingType)} options={["Cash", "HardMoney"]} />
            <Field label="Holding Months" value={inputs.holdingMonths} onChange={(n) => setNum("holdingMonths", n)} />
            <Field label="Taxes / Month" value={inputs.taxesMonthly} onChange={(n) => setNum("taxesMonthly", n)} />
            <Field label="Insurance / Month" value={inputs.insuranceMonthly} onChange={(n) => setNum("insuranceMonthly", n)} />
            <Field label="Utilities / Month" value={inputs.utilitiesMonthly} onChange={(n) => setNum("utilitiesMonthly", n)} />

            {inputs.financing === "HardMoney" && (
              <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">HARD MONEY</div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <FieldPct label="Down Payment" value={inputs.downPaymentPct} onChange={(n) => setValue("downPaymentPct", n)} />
                  <FieldPct label="Rate (APR)" value={inputs.hardMoneyRateApr} onChange={(n) => setValue("hardMoneyRateApr", n)} />
                  <FieldPct label="Points" value={inputs.pointsPct} onChange={(n) => setValue("pointsPct", n)} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
            <div className="font-semibold text-white/85">What you’re automating</div>
            <div className="mt-2 space-y-1">
              <div>• Snap verdict with real assumptions.</div>
              <div>• Rehab presets that scale with sqft + age.</div>
              <div>• Underwrite quickly → print packet → raise money.</div>
            </div>
          </div>
        </div>
      </section>

      <PacketView open={packetOpen} onClose={() => setPacketOpen(false)} p={property} inputs={inputs} verdict={verdict} />
    </FlipWorldShell>
  );
}

function Read({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">{label.toUpperCase()}</div>
      <div className={cn("mt-2 text-sm text-white/85", emphasize && "text-base font-semibold")}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">{label.toUpperCase()}</div>
      <input
        value={String(value)}
        onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
        className="focus-ring mt-2 w-full rounded-xl border border-white/12 bg-black/20 px-3 py-2 text-sm text-white/90"
        inputMode="numeric"
      />
    </div>
  );
}

function FieldPct({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">{label.toUpperCase()}</div>
      <input
        value={String(Math.round(value * 100))}
        onChange={(e) => {
          const v = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
          onChange(v / 100);
        }}
        className="focus-ring mt-2 w-full rounded-xl border border-white/12 bg-black/20 px-3 py-2 text-sm text-white/90"
        inputMode="numeric"
      />
      <div className="mt-1 text-xs text-white/45">{Math.round(value * 100)}%</div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">{label.toUpperCase()}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring mt-2 w-full rounded-xl border border-white/12 bg-black/20 px-3 py-2 text-sm text-white/90"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-black text-white">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatBadge({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-full border border-white/15 bg-black/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/65">
      <span>{label}</span>
      <span className={cn("ml-2 text-white", tone)}>{value}</span>
    </div>
  );
}
