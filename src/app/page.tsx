"use client";

import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS, ProjectId } from "@/lib/projects";
import { runTryNow, LevelsDockInput, RoadmapDockInput } from "@/lib/tryNow";
import { LEVEL_CLASSES } from "@/lib/levels/classes";
import ProjectCard from "@/components/ProjectCard";
import ExampleChips from "@/components/ExampleChips";
import NeonButton from "@/components/NeonButton";

const ORDER: ProjectId[] = ["specsharp", "levels", "roadmap", "flipcalc"];
const INITIAL_PROJECT: ProjectId = "roadmap";
const IDLE_DELAY_MS = 6000;
const ATTRACT_INTERVAL_MS = 4000;

const ROADMAP_PRESETS: Record<string, RoadmapDockInput> = {
  "SpecSharp / underwriting for contractors": {
    productName: "SpecSharp",
    offerDesc: "underwriting autopilot for commercial contractors",
    icp: "mid-market GC teams",
    differentiator: "turns messy bids into decision-grade packets",
  },
  "B2B SaaS for dental practices": {
    productName: "PearlPilot",
    offerDesc: "ops platform for growth-minded dental groups",
    icp: "dental practice COOs",
    differentiator: "makes every play searchable and automates intake-to-billing",
  },
  "Local sports court installs": {
    productName: "CourtWorks",
    offerDesc: "turnkey pickleball + sport court installs",
    icp: "municipal + hospitality development teams",
    differentiator: "bundles permitting, surfacing, and financing in one crew",
  },
};

const DEFAULT_ROADMAP_KEY = PROJECTS.find((p) => p.id === "roadmap")?.examples[0] ?? "SpecSharp / underwriting for contractors";
const DEFAULT_LEVEL_CLASS = LEVEL_CLASSES[0]?.name ?? "Monk of Momentum";
const DEFAULT_LEVEL_GOAL = PROJECTS.find((p) => p.id === "levels")?.examples[0] ?? "Ship one feature/day";
const SPEC_DEFAULT_INPUT = PROJECTS.find((p) => p.id === "specsharp")?.examples[0] ?? "";
const FLIP_DEFAULT_INPUT = PROJECTS.find((p) => p.id === "flipcalc")?.examples[0] ?? "";

type DockValues = {
  specsharp: string;
  roadmap: RoadmapDockInput;
  levels: LevelsDockInput;
  flipcalc: string;
};

function cloneRoadmapPreset(example?: string): RoadmapDockInput {
  const base = (example && ROADMAP_PRESETS[example]) || ROADMAP_PRESETS[DEFAULT_ROADMAP_KEY];
  return { ...base };
}

function createDefaultDockValues(): DockValues {
  return {
    specsharp: SPEC_DEFAULT_INPUT,
    flipcalc: FLIP_DEFAULT_INPUT,
    roadmap: cloneRoadmapPreset(DEFAULT_ROADMAP_KEY),
    levels: { className: DEFAULT_LEVEL_CLASS, goal: DEFAULT_LEVEL_GOAL },
  };
}

function createDefaultExampleSelections(): Record<ProjectId, string | undefined> {
  return ORDER.reduce(
    (acc, id) => {
      const project = PROJECTS.find((p) => p.id === id);
      acc[id] = project?.examples[0];
      return acc;
    },
    {} as Record<ProjectId, string | undefined>
  );
}


function idxOf(id: ProjectId) {
  return ORDER.indexOf(id);
}

function hexToRgbTuple(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  const bigint = Number.parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ProjectId>(INITIAL_PROJECT);
  const [dockValues, setDockValues] = useState<DockValues>(() => createDefaultDockValues());
  const [runValues, setRunValues] = useState<DockValues>(() => createDefaultDockValues());
  const [exampleSelections, setExampleSelections] = useState<Record<ProjectId, string | undefined>>(
    () => createDefaultExampleSelections()
  );
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attractTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedProject = useMemo(() => PROJECTS.find((p) => p.id === selected)!, [selected]);
  const compactProjects = useMemo(
    () => ORDER.filter((id) => id !== selected).map((id) => PROJECTS.find((p) => p.id === id)!),
    [selected]
  );

  const stopAttract = useCallback(() => {
    if (attractTimer.current) {
      clearInterval(attractTimer.current);
      attractTimer.current = null;
    }
  }, []);

  const startAttract = useCallback(() => {
    if (attractTimer.current) return;
    attractTimer.current = setInterval(() => {
      setSelected((prev) => {
        const nextIndex = (idxOf(prev) + 1) % ORDER.length;
        return ORDER[nextIndex];
      });
    }, ATTRACT_INTERVAL_MS);
  }, []);

  const resetIdle = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = setTimeout(() => {
      startAttract();
    }, IDLE_DELAY_MS);
  }, [startAttract]);

  const registerActivity = useCallback(() => {
    stopAttract();
    resetIdle();
  }, [resetIdle, stopAttract]);

  const enterProject = useCallback(
    (id: ProjectId) => {
      registerActivity();
      const project = PROJECTS.find((p) => p.id === id);
      if (!project) return;
      if (project.external) {
        window.open(project.route, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(project.route);
    },
    [registerActivity, router]
  );

  const activateProject = useCallback(
    (id: ProjectId) => {
      registerActivity();
      setSelected(id);
    },
    [registerActivity]
  );

  useEffect(() => {
    registerActivity();
    const activityEvents = ["mousemove", "mousedown", "touchstart"] as const;
    const handleActivity = () => registerActivity();
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (attractTimer.current) clearInterval(attractTimer.current);
    };
  }, [registerActivity]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      registerActivity();
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea";
      if (typing && ["ArrowUp", "ArrowDown"].includes(e.key)) {
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => ORDER[(idxOf(prev) + ORDER.length - 1) % ORDER.length]);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) => ORDER[(idxOf(prev) + 1) % ORDER.length]);
      }
      if (e.key === "Enter" && !typing) {
        e.preventDefault();
        enterProject(selected);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enterProject, registerActivity, selected]);

  useEffect(() => {
    const nextExample = selectedProject.examples[0] ?? "";
    if (selected === "roadmap") {
      const preset = cloneRoadmapPreset(nextExample);
      setDockValues((prev) => ({ ...prev, roadmap: preset }));
      setRunValues((prev) => ({ ...prev, roadmap: preset }));
    } else if (selected === "levels") {
      const preset: LevelsDockInput = {
        className: DEFAULT_LEVEL_CLASS,
        goal: nextExample || DEFAULT_LEVEL_GOAL,
      };
      setDockValues((prev) => ({ ...prev, levels: preset }));
      setRunValues((prev) => ({ ...prev, levels: preset }));
    } else if (selected === "flipcalc") {
      setDockValues((prev) => ({ ...prev, flipcalc: nextExample }));
      setRunValues((prev) => ({ ...prev, flipcalc: nextExample }));
    } else {
      setDockValues((prev) => ({ ...prev, specsharp: nextExample }));
      setRunValues((prev) => ({ ...prev, specsharp: nextExample }));
    }
    setExampleSelections((prev) => ({ ...prev, [selected]: nextExample || undefined }));
  }, [selected, selectedProject.examples, setDockValues, setRunValues]);

  const currentRunValue = runValues[selected];
  const currentDockValue = dockValues[selected];
  const output = useMemo(() => runTryNow(selected, currentRunValue), [selected, currentRunValue]);

  const handleRun = () => {
    registerActivity();
    let nextValue: DockValues[keyof DockValues];
    if (selected === "roadmap") {
      nextValue = { ...dockValues.roadmap };
    } else if (selected === "levels") {
      nextValue = { ...dockValues.levels };
    } else if (selected === "flipcalc") {
      nextValue = dockValues.flipcalc;
    } else {
      nextValue = dockValues.specsharp;
    }
    setRunValues((prev) => ({ ...prev, [selected]: nextValue }));
  };

  const handleExample = (value: string) => {
    registerActivity();
    setExampleSelections((prev) => ({ ...prev, [selected]: value }));
    if (selected === "roadmap") {
      const preset = cloneRoadmapPreset(value);
      setDockValues((prev) => ({ ...prev, roadmap: preset }));
      setRunValues((prev) => ({ ...prev, roadmap: preset }));
      return;
    }
    if (selected === "levels") {
      const preset: LevelsDockInput = { ...dockValues.levels, goal: value };
      setDockValues((prev) => ({ ...prev, levels: preset }));
      setRunValues((prev) => ({ ...prev, levels: preset }));
      return;
    }
    if (selected === "flipcalc") {
      setDockValues((prev) => ({ ...prev, flipcalc: value }));
      setRunValues((prev) => ({ ...prev, flipcalc: value }));
      return;
    }
    setDockValues((prev) => ({ ...prev, specsharp: value }));
    setRunValues((prev) => ({ ...prev, specsharp: value }));
  };

  const clearExampleSelection = useCallback(() => {
    setExampleSelections((prev) => ({ ...prev, [selected]: undefined }));
  }, [selected]);

  const handleSingleInputChange = (value: string) => {
    registerActivity();
    clearExampleSelection();
    if (selected === "flipcalc") {
      setDockValues((prev) => ({ ...prev, flipcalc: value }));
    } else if (selected === "specsharp") {
      setDockValues((prev) => ({ ...prev, specsharp: value }));
    }
  };

  const handleRoadmapFieldChange = (key: keyof RoadmapDockInput, value: string) => {
    registerActivity();
    clearExampleSelection();
    setDockValues((prev) => ({
      ...prev,
      roadmap: { ...prev.roadmap, [key]: value },
    }));
  };

  const handleLevelsFieldChange = (key: keyof LevelsDockInput, value: string) => {
    registerActivity();
    clearExampleSelection();
    setDockValues((prev) => ({
      ...prev,
      levels: { ...prev.levels, [key]: value },
    }));
  };

  const accentTuple = useMemo(() => hexToRgbTuple(selectedProject.accent), [selectedProject.accent]);
  const accent2Tuple = useMemo(() => hexToRgbTuple(selectedProject.accent2), [selectedProject.accent2]);
  const bg1Tuple = useMemo(() => hexToRgbTuple(selectedProject.bg1), [selectedProject.bg1]);
  const bg2Tuple = useMemo(() => hexToRgbTuple(selectedProject.bg2), [selectedProject.bg2]);
  const accent = `${accentTuple[0]} ${accentTuple[1]} ${accentTuple[2]}`;
  const accent2 = `${accent2Tuple[0]} ${accent2Tuple[1]} ${accent2Tuple[2]}`;
  const bg1 = `${bg1Tuple[0]} ${bg1Tuple[1]} ${bg1Tuple[2]}`;
  const bg2 = `${bg2Tuple[0]} ${bg2Tuple[1]} ${bg2Tuple[2]}`;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-rgb", accent);
    root.style.setProperty("--accent2-rgb", accent2);
    root.style.setProperty("--bg1-rgb", bg1);
    root.style.setProperty("--bg2-rgb", bg2);
  }, [accent, accent2, bg1, bg2]);

  return (
    <div className="space-y-12 pb-16">
      <section className="space-y-4 pt-4">
        <p className="font-[var(--font-display)] text-[12px] uppercase tracking-[0.5em] text-white/50">PRESS START</p>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
          Shipping is the skill. Taste is the multiplier.
        </h1>
        <h2 className="text-xl text-white/85 md:text-2xl">Warning: contains working software.</h2>
        <p className="text-base text-white/70">Choose your machine. Insert taste. Launch.</p>
        <div className="text-xl font-[var(--font-display)] uppercase tracking-[0.6em] text-white/60">
          WORLD: <span className="text-white">{selectedProject.worldName}</span>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          {compactProjects.map((project) => (
            <ProjectCard
              key={project.id}
              model={{
                id: project.id,
                title: project.title,
                tagline: project.tagline,
                micro: project.micro,
                cta: project.cta,
                accent: project.accent,
                accent2: project.accent2,
                worldName: project.worldName,
              }}
              selected={selected === project.id}
              onSelect={() => activateProject(project.id)}
              onEnter={() => activateProject(project.id)}
              variant="compact"
            />
          ))}
        </div>

        <div className="space-y-6">
          <div className="plastic relative overflow-hidden">
            <ProjectCard
              model={{
                id: selectedProject.id,
                title: selectedProject.title,
                tagline: selectedProject.tagline,
                micro: selectedProject.micro,
                cta: selectedProject.cta,
                accent: selectedProject.accent,
                accent2: selectedProject.accent2,
                worldName: selectedProject.worldName,
              }}
              selected
              onSelect={() => enterProject(selectedProject.id)}
              onEnter={() => enterProject(selectedProject.id)}
              variant="featured"
            />
          </div>

          <div className="glass space-y-5 rounded-[28px] p-6">
            <div className="flex flex-col gap-2 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-[var(--font-display)] text-[11px] tracking-[0.4em] text-white/60">TRY DOCK</div>
                <div className="text-white/85">{selectedProject.title}</div>
              </div>
              <button
                type="button"
                className="text-xs text-white/50 underline-offset-4 hover:text-white"
                onClick={() => enterProject(selectedProject.id)}
              >
                OPEN FULL EXPERIENCE
              </button>
            </div>

            <ExampleChips
              items={selectedProject.examples}
              value={exampleSelections[selected]}
              onChange={handleExample}
              label="Examples"
            />

            {selectedProject.dockFields?.length ? (
              <div className="grid gap-3">
                {selectedProject.dockFields.map((field) => {
                  const isRoadmap = selected === "roadmap";
                  const fieldValue = isRoadmap
                    ? dockValues.roadmap[field.key as keyof RoadmapDockInput] ?? ""
                    : dockValues.levels[field.key as keyof LevelsDockInput] ?? "";
                  const baseLabel = field.label;
                  return (
                    <div key={field.key} className="space-y-2">
                      <div className="font-[var(--font-display)] text-[10px] tracking-[0.3em] text-white/55">
                        {baseLabel.toUpperCase()}
                      </div>
                      {selected === "levels" && field.key === "className" ? (
                        <select
                          value={dockValues.levels.className}
                          onChange={(e) => handleLevelsFieldChange("className", e.target.value)}
                          className="focus-ring w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white"
                        >
                          {LEVEL_CLASSES.map((cls) => (
                            <option key={cls.id} value={cls.name}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={fieldValue as string}
                          onChange={(e) =>
                            isRoadmap
                              ? handleRoadmapFieldChange(field.key as keyof RoadmapDockInput, e.target.value)
                              : handleLevelsFieldChange(field.key as keyof LevelsDockInput, e.target.value)
                          }
                          placeholder={field.placeholder}
                          className="focus-ring w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white/85 placeholder:text-white/35"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-[var(--font-display)] text-[10px] tracking-[0.35em] text-white/55">INPUT</div>
                {selected === "specsharp" ? (
                  <textarea
                    value={dockValues.specsharp}
                    onChange={(e) => handleSingleInputChange(e.target.value)}
                    placeholder={selectedProject.inputLabel}
                    rows={3}
                    className="focus-ring w-full rounded-3xl border border-white/20 bg-black/30 px-5 py-3 text-sm text-white/85 placeholder:text-white/35"
                  />
                ) : (
                  <input
                    type="text"
                    value={dockValues.flipcalc}
                    onChange={(e) => handleSingleInputChange(e.target.value)}
                    placeholder={selectedProject.inputLabel}
                    className="focus-ring w-full rounded-full border border-white/20 bg-black/30 px-5 py-3 text-sm text-white/85 placeholder:text-white/40"
                  />
                )}
              </div>
            )}

            <NeonButton
              variant="primary"
              onClick={handleRun}
              className="w-full justify-center"
              style={{ "--accent": accent } as CSSProperties}
            >
              {selectedProject.runLabel}
            </NeonButton>

            <div className="panel-crt rounded-[22px] p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/60">
                <span>{output.title}</span>
                <span>PREVIEW</span>
              </div>
              <div className="mt-4 space-y-4 text-sm text-white/85">
                {output.blocks.map((block) => (
                  <div key={block.label}>
                    <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">{block.label}</div>
                    <p className="mt-1 whitespace-pre-line text-white/80">{block.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="hr" />
        <div className="mt-6 flex flex-col gap-3 text-xs uppercase tracking-[0.4em] text-white/50 md:flex-row md:items-center md:justify-between">
          <div>CONTACT: cody@arcade-interface.com</div>
          <div>↑↓ TO BROWSE • ENTER TO START • ESC TO BREATHE</div>
        </div>
      </section>
    </div>
  );
}
