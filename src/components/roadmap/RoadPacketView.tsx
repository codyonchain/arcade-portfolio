"use client";

import NeonButton from "@/components/NeonButton";
import { Roadmap30, RoadmapInputs, SnapPlan } from "@/lib/roadmap/types";

export default function RoadPacketView({
  open,
  onClose,
  inputs,
  snap,
  r30,
}: {
  open: boolean;
  onClose: () => void;
  inputs: RoadmapInputs;
  snap: SnapPlan | null;
  r30: Roadmap30 | null;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 flex h-full flex-col">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden p-4 sm:p-6">
          <div className="flex-1 overflow-auto rounded-3xl border border-white/12 bg-[#0b0b10]/90 shadow-[0_30px_120px_rgba(0,0,0,0.6)] print:border-0 print:bg-white print:text-black">
            <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-white/10 bg-[#0b0b10]/95 px-5 py-4 backdrop-blur print:hidden sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">SEARCH PRESENCE PACKET</div>
                <div className="mt-1 text-lg font-semibold text-white/90">{inputs.domain || "yourdomain.com"}</div>
                <div className="text-sm text-white/60">Pipeline-ready SEO + AEO roadmap</div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <NeonButton variant="ghost" onClick={onClose} className="w-full justify-center text-xs sm:w-auto">CLOSE</NeonButton>
                <NeonButton variant="primary" onClick={() => window.print()} className="w-full justify-center text-xs sm:w-auto">PRINT / SAVE PDF</NeonButton>
              </div>
            </div>

            <div className="space-y-5 px-5 pb-6 pt-4 print:px-6">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 print:border-[#ddd] print:bg-white">
                <h2 className="text-lg font-semibold">Snapshot</h2>
                <div className="mt-3 grid gap-2 text-sm">
                  <div><strong>Product:</strong> {inputs.productName || "—"}</div>
                  <div><strong>What it does:</strong> {inputs.offerDescription || "—"}</div>
                  <div><strong>ICP:</strong> {inputs.icp || "—"}</div>
                  <div><strong>Differentiator:</strong> {inputs.differentiator || "—"}</div>
                  <div><strong>Tone:</strong> {inputs.tone}</div>
                  <div><strong>Competitors:</strong> {inputs.competitors.length ? inputs.competitors.join(", ") : "—"}</div>
                  <div><strong>Cadence:</strong> {inputs.cadence} • <strong>Channels:</strong> {channelString(inputs.channels)}</div>
                </div>

                {snap && (
                  <>
                    <h2 className="mt-6 text-lg font-semibold">Snap Plan</h2>
                    <div className="mt-2 text-sm"><strong>Positioning:</strong> {snap.positioning}</div>
                    <div className="mt-2 text-sm"><strong>Hooks:</strong> {snap.hooks.join(" | ")}</div>
                    <div className="mt-2 text-sm"><strong>Next 8:</strong></div>
                    <ul className="mt-2 list-disc pl-5 text-sm">
                      {snap.next8.map((item) => (
                        <li key={item.title}>{item.title}</li>
                      ))}
                    </ul>
                  </>
                )}

                {r30 && (
                  <>
                    <h2 className="mt-6 text-lg font-semibold">30-Day Roadmap</h2>
                    <div className="mt-2 grid gap-3 text-sm md:grid-cols-2">
                      {r30.weeks.map((week) => (
                        <div key={week.week} className="rounded-xl border border-white/10 bg-black/10 p-4 print:border-[#ddd] print:bg-white">
                          <div className="font-semibold">Week {week.week}: {week.theme}</div>
                          <ul className="mt-2 list-disc pl-5">
                            {week.deliverables.map((deliverable, idx) => (
                              <li key={idx}>{deliverable}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <h2 className="mt-6 text-lg font-semibold">Brief summaries</h2>
                    <ul className="mt-2 list-disc pl-5 text-sm">
                      {r30.briefs.map((brief) => (
                        <li key={brief.id}>{brief.title} — {brief.intent}</li>
                      ))}
                    </ul>

                    <h2 className="mt-6 text-lg font-semibold">Quick wins</h2>
                    <ul className="mt-2 list-disc pl-5 text-sm">
                      {r30.quickWins.map((win) => (
                        <li key={win.page}>{win.fix} ({win.impact})</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="text-xs text-white/45 print:hidden">Phase 1–2 only. No scraping or integrations yet.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function channelString(channels: RoadmapInputs["channels"]) {
  const list: string[] = [];
  if (channels.blog) list.push("Blog");
  if (channels.linkedin) list.push("LinkedIn");
  if (channels.youtube) list.push("YouTube");
  if (channels.email) list.push("Email");
  return list.length ? list.join(" + ") : "Blog";
}
