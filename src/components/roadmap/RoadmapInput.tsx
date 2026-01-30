"use client";

import { useState } from "react";
import ExampleChips from "@/components/ExampleChips";
import NeonButton from "@/components/NeonButton";
import { ROADMAP_EXAMPLES } from "@/lib/roadmap/mockData";
import { RoadmapInputs, Tone } from "@/lib/roadmap/types";
import { cn } from "@/lib/utils";

export default function RoadmapInput({
  inputs,
  setInputs,
  onGenerateSnap,
  onGenerate30,
  error,
}: {
  inputs: RoadmapInputs;
  setInputs: (v: RoadmapInputs) => void;
  onGenerateSnap: () => void;
  onGenerate30: () => void;
  error?: string;
}) {
  const labels = ROADMAP_EXAMPLES.map((e) => e.label);
  const [step, setStep] = useState<1 | 2>(1);

  const applyExample = (label: string) => {
    const ex = ROADMAP_EXAMPLES.find((x) => x.label === label);
    if (!ex) return;
    setInputs({
      ...inputs,
      ...ex.values,
      competitors: ex.values.competitors ?? inputs.competitors,
      channels: ex.values.channels ?? inputs.channels,
      cadence: ex.values.cadence ?? inputs.cadence,
      tone: (ex.values.tone as Tone) ?? inputs.tone,
    } as RoadmapInputs);
  };

  const setField = <K extends keyof RoadmapInputs>(key: K, value: RoadmapInputs[K]) =>
    setInputs({ ...inputs, [key]: value });

  const setCompetitor = (idx: number, value: string) => {
    const next = [...(inputs.competitors ?? [])];
    next[idx] = value;
    setField("competitors", next);
  };

  const toggleChannel = (key: keyof RoadmapInputs["channels"]) => {
    setField("channels", { ...inputs.channels, [key]: !inputs.channels[key] });
  };

  return (
    <div className="plastic glow-border p-6">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">SNAP PLAN</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight crt-text">Generate pipeline-ready search presence.</div>
      <div className="mt-1 text-sm text-white/70">SEO + AEO. Answer-first. Built to create leads.</div>

      <div className="mt-5 space-y-4">
        <ExampleChips items={labels} value={undefined} onChange={applyExample} label="Examples" />

        <div className="md:hidden">
          <div className="flex gap-2 text-[10px] uppercase tracking-[0.35em] text-white/45">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={cn(
                "flex-1 rounded-full border border-white/20 px-3 py-2",
                step === 1 ? "bg-white/15 text-white" : "text-white/60"
              )}
            >
              Step 1
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={cn(
                "flex-1 rounded-full border border-white/20 px-3 py-2",
                step === 2 ? "bg-white/15 text-white" : "text-white/60"
              )}
            >
              Step 2
            </button>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-4">
          <div className={cn("space-y-3", step !== 1 && "hidden md:block")}>
            <Text label="Domain" value={inputs.domain} onChange={(v) => setField("domain", v)} placeholder="yourdomain.com" />
            <SelectTone value={inputs.tone} onChange={(v) => setField("tone", v)} />
            <Text label="Product name" value={inputs.productName} onChange={(v) => setField("productName", v)} placeholder="SpecSharp" />
            <Text label="What it does" value={inputs.offerDescription} onChange={(v) => setField("offerDescription", v)} placeholder="AI tool that..." />
            <Text label="Ideal customer" value={inputs.icp} onChange={(v) => setField("icp", v)} placeholder="Who buys?" />
            <Text label="Differentiator" value={inputs.differentiator} onChange={(v) => setField("differentiator", v)} placeholder="Why you?" />
          </div>

          <div className={cn("space-y-3", step !== 2 && "hidden md:block")}>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">Competitors</div>
              <div className="mt-3 space-y-2">
                {[0, 1, 2].map((idx) => (
                  <input
                    key={`competitor_${idx}`}
                    value={inputs.competitors[idx] ?? ""}
                    onChange={(e) => setCompetitor(idx, e.target.value)}
                    placeholder={idx === 0 ? "Main rival" : "Optional"}
                    className="focus-ring w-full rounded-xl border border-white/12 bg-black/20 px-3 py-2.5 text-sm text-white/85 placeholder:text-white/35"
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">Cadence</div>
                <select
                  value={inputs.cadence}
                  onChange={(e) => setField("cadence", e.target.value as RoadmapInputs["cadence"])}
                  className="focus-ring mt-2 w-full rounded-xl border border-white/12 bg-black/20 px-3 py-2.5 text-sm text-white/90"
                >
                  <option value="2/wk" className="bg-black">2 per week</option>
                  <option value="3/wk" className="bg-black">3 per week</option>
                  <option value="5/wk" className="bg-black">5 per week</option>
                </select>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">Channels</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["blog", "linkedin", "youtube", "email"] as Array<keyof RoadmapInputs["channels"]>).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => toggleChannel(channel)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.25em]",
                        inputs.channels[channel]
                          ? "border-white/30 bg-white/15 text-white"
                          : "border-white/15 bg-white/5 text-white/60"
                      )}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <NeonButton variant="ghost" onClick={onGenerateSnap} className="w-full justify-center">
            GENERATE SNAP PLAN
          </NeonButton>
          <NeonButton variant="primary" onClick={onGenerate30} className="w-full justify-center">
            GENERATE 30-DAY ROADMAP
          </NeonButton>
        </div>

        {error ? (
          <div className="text-xs text-red-300">{error}</div>
        ) : (
          <div className="text-xs text-white/45">Step 1 = Snap Plan. Step 2 adds cadence, channels, competitors before you underwrite.</div>
        )}
      </div>
    </div>
  );
}

function Text({ label, value, onChange, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-black/20 p-4", className)}>
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">{label.toUpperCase()}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring mt-2 w-full rounded-xl border border-white/12 bg-black/20 px-3 py-2.5 text-sm text-white/90 placeholder:text-white/35"
      />
    </div>
  );
}

function SelectTone({ value, onChange }: { value: Tone; onChange: (v: Tone) => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">TONE</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Tone)}
        className="focus-ring mt-2 w-full rounded-xl border border-white/12 bg-black/20 px-3 py-2.5 text-sm text-white/90"
      >
        <option value="Direct" className="bg-black">Direct</option>
        <option value="Premium" className="bg-black">Premium</option>
        <option value="Playful" className="bg-black">Playful</option>
      </select>
    </div>
  );
}
