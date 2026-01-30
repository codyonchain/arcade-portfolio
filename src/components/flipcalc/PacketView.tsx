"use client";

import NeonButton from "@/components/NeonButton";
import { PropertyProfile, UnderwriteInputs, Verdict } from "@/lib/flipcalc/types";
import { money, pct } from "@/lib/flipcalc/calc";

export default function PacketView({
  open,
  onClose,
  p,
  inputs,
  verdict,
}: {
  open: boolean;
  onClose: () => void;
  p: PropertyProfile;
  inputs: UnderwriteInputs;
  verdict: Verdict;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 overflow-auto p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/12 bg-[#0b0b10]/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.6)] print:border-0 print:bg-white print:text-black">
          <div className="flex items-start justify-between gap-4 print:hidden">
            <div>
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">INVESTMENT PACKET</div>
              <div className="mt-2 text-xl font-semibold text-white/90">{p.address}</div>
              <div className="text-sm text-white/60">{p.cityState}</div>
            </div>
            <div className="flex gap-2">
              <NeonButton variant="ghost" onClick={onClose} className="text-xs">
                CLOSE
              </NeonButton>
              <NeonButton variant="primary" onClick={() => window.print()} className="text-xs">
                PRINT / SAVE PDF
              </NeonButton>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5 print:border-[#ddd] print:bg-white">
            <div className="text-sm font-semibold text-white/90 print:text-black">Snap Verdict</div>
            <div className="mt-3 grid gap-3 text-sm text-white/80 print:text-black md:grid-cols-2">
              <div>
                Purchase: <strong>{money(inputs.purchasePrice)}</strong>
              </div>
              <div>
                ARV: <strong>{money(inputs.arv)}</strong>
              </div>
              <div>
                Rehab: <strong>{money(verdict.rehabTotal)}</strong>
              </div>
              <div>
                Holding: <strong>{money(verdict.holdingTotal)}</strong>
              </div>
              <div>
                Net Sale: <strong>{money(verdict.netSale)}</strong>
              </div>
              <div>
                Total Cost: <strong>{money(verdict.totalCost)}</strong>
              </div>
              <div>
                Profit: <strong>{money(verdict.profit)}</strong>
              </div>
              <div>
                ROI: <strong>{pct(verdict.roi)}</strong>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 print:border-[#ddd] print:bg-white">
                <div className="text-xs uppercase tracking-[0.35em] text-white/60 print:text-black">Verdict</div>
                <div className="mt-1 text-lg font-bold text-white/90 print:text-black">{verdict.verdictLabel}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 print:border-[#ddd] print:bg-white">
                <div className="text-xs uppercase tracking-[0.35em] text-white/60 print:text-black">Grade</div>
                <div className="mt-1 text-lg font-bold text-white/90 print:text-black">{verdict.grade}</div>
              </div>
            </div>

            <div className="mt-5 text-sm text-white/80 print:text-black">
              <div className="font-semibold">Assumptions</div>
              <div className="mt-2 space-y-1">
                <div>• Selling fees: 7% (6% agent + 1% closing)</div>
                <div>• Purchase closing: 2%</div>
                <div>• Target profit: {money(verdict.targetProfit)}</div>
                <div>• Financing: {inputs.financing}</div>
              </div>
            </div>

            <div className="mt-5 text-sm text-white/80 print:text-black">
              <div className="font-semibold">Rehab line items</div>
              <div className="mt-2 space-y-1">
                {inputs.rehabLineItems.map((li) => (
                  <div key={li.id} className="flex justify-between gap-3">
                    <span>{li.name}</span>
                    <span>{money(li.cost)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-white/45 print:hidden">
            Phase 1–2 only. Due diligence (liens, permits, full comps) intentionally excluded.
          </div>
        </div>
      </div>
    </div>
  );
}
