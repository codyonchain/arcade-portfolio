"use client";

import NeonButton from "@/components/NeonButton";
import { Brief, Roadmap30, SnapPlan } from "@/lib/roadmap/types";

export default function RoadmapOutput({
  snap,
  r30,
  onOpenBrief,
  onOpenPacket,
}: {
  snap: SnapPlan | null;
  r30: Roadmap30 | null;
  onOpenBrief: (b: Brief) => void;
  onOpenPacket: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="plastic glow-border p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">OUTPUT</div>
            <div className="mt-2 text-xl font-semibold tracking-tight crt-text">Pipeline-ready plan</div>
            <div className="mt-1 text-sm text-white/70">What to publish, how it converts, and why it matters.</div>
          </div>
          <NeonButton variant="primary" onClick={onOpenPacket} className="text-xs">
            GENERATE PACKET
          </NeonButton>
        </div>

        {!snap ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">
            Generate a Snap Plan to populate this section.
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-4">
                <Block title="Positioning" body={snap.positioning} />
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">PILLARS</div>
                  {snap.pillars.length > 0 && (
                    <>
                      <div className="mt-3 rounded-2xl border border-white/12 bg-black/15 p-5 min-h-[130px]">
                        <div
                          className="text-base font-semibold text-white/90"
                          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                        >
                          {snap.pillars[0].name}
                        </div>
                        <div
                          className="mt-3 text-sm text-white/70"
                          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                        >
                          {snap.pillars[0].why}
                        </div>
                      </div>
                      {snap.pillars.length > 1 && (
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          {snap.pillars.slice(1).map((pillar) => (
                            <div key={pillar.name} className="rounded-2xl border border-white/12 bg-black/10 p-4 min-h-[120px]">
                              <div
                                className="text-sm font-semibold text-white/90"
                                style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                              >
                                {pillar.name}
                              </div>
                              <div
                                className="mt-2 text-sm text-white/70"
                                style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                              >
                                {pillar.why}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">HOOKS</div>
                  <ul className="mt-3 space-y-2 text-sm text-white/80">
                    {snap.hooks.map((hook) => (
                      <li key={hook}>• {hook}</li>
                    ))}
                  </ul>
                  <div className="mt-4 text-xs text-white/55">Why it converts: hooks turn ICP pain + differentiator into immediate proof.</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">NEXT 8 PIECES</div>
              <div className="mt-3 divide-y divide-white/10">
                {snap.next8.map((topic) => (
                  <div key={topic.title} className="flex flex-col gap-2 py-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white/90">{topic.title}</div>
                      <div className="text-xs text-white/60">{topic.why}</div>
                    </div>
                    <div className="text-right text-xs text-white/60">
                      <div className="text-sm font-semibold text-white/85">Score {topic.score.total}/15</div>
                      <div>Pipeline {topic.score.pipelineFit}/5 • Authority {topic.score.authority}/5 • Ease {topic.score.ease}/5</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="plastic glow-border p-6">
        <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">30-DAY ROADMAP</div>
        <div className="mt-2 text-xl font-semibold tracking-tight crt-text">Schedule + briefs</div>

        {!r30 ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">Generate the 30-day roadmap to unlock schedule, briefs, and quick wins.</div>
        ) : (
          <>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {r30.weeks.map((week) => (
                <div key={week.week} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold text-white/90">Week {week.week}: {week.theme}</div>
                  <div className="mt-2 space-y-1 text-sm text-white/75">
                    {week.deliverables.map((deliverable, idx) => (
                      <div key={idx}>• {deliverable}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">BRIEFS</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {r30.briefs.map((brief) => (
                  <button key={brief.id} onClick={() => onOpenBrief(brief)} className="focus-ring text-left rounded-2xl border border-white/10 bg-black/10 p-4 hover:bg-white/5">
                    <div className="text-sm font-semibold text-white/90">{brief.title}</div>
                    <div className="mt-2 text-xs text-white/55">Intent: {brief.intent} • Score: {brief.score.total}/15</div>
                    <div className="mt-3 text-sm text-white/70 line-clamp-2">{brief.bestAnswer}</div>
                    <div className="mt-4 inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/80">OPEN BRIEF</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">QUICK WINS</div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {r30.quickWins.map((win) => (
                  <div key={win.page} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="text-sm font-semibold text-white/90">{win.page}</div>
                    <div className="mt-2 text-sm text-white/70">{win.fix}</div>
                    <div className="mt-3 text-xs text-white/55">Impact: {win.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Block({ title, body, pre }: { title: string; body: string; pre?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">{title.toUpperCase()}</div>
      {pre ? <div className="mt-3 whitespace-pre-wrap text-sm text-white/80">{body}</div> : <div className="mt-3 text-sm text-white/80">{body}</div>}
    </div>
  );
}
