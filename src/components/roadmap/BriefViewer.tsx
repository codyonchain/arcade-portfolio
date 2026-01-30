"use client";

import NeonButton from "@/components/NeonButton";
import { Brief } from "@/lib/roadmap/types";

export default function BriefViewer({
  open,
  brief,
  onClose,
}: {
  open: boolean;
  brief: Brief | null;
  onClose: () => void;
}) {
  if (!open || !brief) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 overflow-auto p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/12 bg-[#0b0b10]/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.6)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">ARTICLE BRIEF</div>
              <div className="mt-2 text-xl font-semibold text-white/90">{brief.title}</div>
              <div className="mt-1 text-sm text-white/60">Intent: {brief.intent} • Score: {brief.score.total}/15</div>
            </div>
            <NeonButton variant="ghost" onClick={onClose} className="text-xs">CLOSE</NeonButton>
          </div>

          <div className="mt-5 grid gap-3">
            <Box label="Target query" value={brief.targetQuery} />
            <Box label="Best answer (AEO)" value={brief.bestAnswer} />
            <Box label="Outline" value={brief.outline.map((o) => `• ${o}`).join("\n")} pre />
            <Box label="Proof requirements" value={brief.proof.map((p) => `• ${p}`).join("\n")} pre />
            <Box label="CTA" value={brief.cta} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Box({ label, value, pre }: { label: string; value: string; pre?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">{label.toUpperCase()}</div>
      {pre ? <div className="mt-3 whitespace-pre-wrap text-sm text-white/80">{value}</div> : <div className="mt-3 text-sm text-white/80">{value}</div>}
    </div>
  );
}
