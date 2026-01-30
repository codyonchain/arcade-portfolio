"use client";

import { useRef, useState } from "react";
import RoadWorldShell from "@/components/roadmap/RoadWorldShell";
import RoadmapInput from "@/components/roadmap/RoadmapInput";
import RoadmapOutput from "@/components/roadmap/RoadmapOutput";
import BriefViewer from "@/components/roadmap/BriefViewer";
import RoadPacketView from "@/components/roadmap/RoadPacketView";
import { DEFAULT_INPUTS } from "@/lib/roadmap/mockData";
import { generate30Day, generateSnap } from "@/lib/roadmap/generator";
import { Brief, Roadmap30, RoadmapInputs, SnapPlan } from "@/lib/roadmap/types";

export default function RoadmapPage() {
  const [inputs, setInputs] = useState<RoadmapInputs>(DEFAULT_INPUTS);
  const [snap, setSnap] = useState<SnapPlan | null>(null);
  const [roadmap30, setRoadmap30] = useState<Roadmap30 | null>(null);
  const [packetOpen, setPacketOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [activeBrief, setActiveBrief] = useState<Brief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);

  const ready = inputs.productName && inputs.offerDescription && inputs.icp && inputs.differentiator;

  const ensureReady = () => {
    if (!ready) {
      setError("Add product name, what it does, ICP, and differentiator.");
      return false;
    }
    setError(null);
    return true;
  };

  const runSnap = () => {
    if (!ensureReady()) return;
    const generated = generateSnap(inputs);
    setSnap(generated);
    setRoadmap30(null);
  };

  const runRoadmap = () => {
    if (!ensureReady()) return;
    const generatedSnap = snap ?? generateSnap(inputs);
    setSnap(generatedSnap);
    const roadmap = generate30Day(inputs, generatedSnap);
    setRoadmap30(roadmap);
    requestAnimationFrame(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openBrief = (brief: Brief) => {
    setActiveBrief(brief);
    setBriefOpen(true);
  };

  return (
    <RoadWorldShell>
      <section className="pt-2">
        <div className="max-w-4xl">
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">WORLD 03 • GROWTH GRID</div>
          <h1 className="crt-text mt-3 text-5xl font-semibold tracking-tight md:text-6xl">Search Presence Roadmap.</h1>
          <p className="mt-3 text-sm text-white/70 md:text-base">
            Productized SEO + AEO tuned for pipeline leads. Snap plan in seconds. Underwrite and print in minutes.
          </p>
        </div>
        <div className="mt-6 h-px w-full bg-white/10" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <RoadmapInput inputs={inputs} setInputs={setInputs} onGenerateSnap={runSnap} onGenerate30={runRoadmap} error={error || undefined} />
        <div ref={outputRef}>
          <RoadmapOutput snap={snap} r30={roadmap30} onOpenBrief={openBrief} onOpenPacket={() => setPacketOpen(true)} />
        </div>
      </section>

      <BriefViewer open={briefOpen} brief={activeBrief} onClose={() => setBriefOpen(false)} />
      <RoadPacketView open={packetOpen} onClose={() => setPacketOpen(false)} inputs={inputs} snap={snap} r30={roadmap30} />
    </RoadWorldShell>
  );
}
