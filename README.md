# Cody // Arcade_OS

**Shipping is the skill. Taste is the multiplier.**  
A retro-futuristic arcade portfolio where each “world” is a playable product — not a case study.

## What this is
This repo is a portfolio as an **interactive console UI**. You don’t read about projects — you **play** them.

**Worlds included:**
- **SpecSharp** (external): Construction intelligence product (opens in new tab)
- **World: FlipCalc**: Address → Prefill → ARV range → Verdict + Max Offer → Investment Packet
- **World: The Roadmap**: Search Presence Roadmap (SEO + AEO) → Snap Plan → Underwrite → Briefs → Packet
- **World: Levels.app**: Choose character → quests → XP → level up → recap card

## Why it exists
Most portfolios are screenshots and paragraphs. This is an arcade cabinet:
- One click to “holy shit”
- Tight UX + clean systems
- Real interactions, deterministic logic, print-ready packets

## Quick start

### Requirements
- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run (fixed port)

This project runs on http://localhost:3007 by default.

```bash
npm run dev
```

### Build

```bash
npm run build
npm run start
```

## Worlds

### FlipCalc (World 04)
- A flip underwriting snap verdict + underwrite loop.
- Prefill from mock property dataset
- Deterministic rehab presets + line items
- Financing toggles
- Print-ready Investment Packet  
Route: `/flipcalc`

### The Roadmap (World 03)
- A productized “Search Presence Roadmap” optimized for pipeline leads.
- Snap Plan (positioning, hooks, pillars, next pieces)
- Underwrite (cadence, channels, competitors)
- Brief generator + Packet export  
Route: `/roadmap`

### Levels.app (World 02)
- A gamified quest loop.
- Character select
- Quest board + XP + level ups
- Custom quests
- Recap card (shareable)  
Route: `/levels`

### SpecSharp (World 01)
- External link (opens new tab).  
Route: https://specsharp.ai

## Project structure

```
src/
  app/
    page.tsx                # Arcade start screen
    flipcalc/page.tsx       # FlipCalc world
    roadmap/page.tsx        # Roadmap world
    levels/page.tsx         # Levels world
  components/
    ...shared UI...
    flipcalc/...
    roadmap/...
    levels/...
  lib/
    projects.ts             # Arcade machine metadata
    tryNow.ts               # Dock preview logic
    flipcalc/...
    roadmap/...
    levels/...
```

## Design principles

- Product-first: the demo is the pitch.
- Arcade OS: retro cues + modern polish.
- Deterministic logic: no external APIs required for the portfolio version.
- Exportable artifacts: packets/recaps feel real.

## How to add a new world

1. Create a route in `src/app/<world>/page.tsx`.
2. Add world metadata in `src/lib/projects.ts`.
3. Add dock preview behavior in `src/lib/tryNow.ts`.

## Roadmap

- Replace mock datasets with real integrations (optional)
- Shareable recap cards as images (canvas export)
- More “world” personality (micro-animations, sound toggle)

## License

MIT
