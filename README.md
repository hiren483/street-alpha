# Apex Capital: Wall Street Life Simulator (2D Web Prototype)

A playable 2D browser life and trading simulator built with **React**, **TypeScript**, **Vite**, and **Zustand**.

You play as the founder and lead portfolio manager of **Apex Capital**, a boutique fund on Wall Street. Each trading day brings new market turbulence, conflicting employee opinions, street rumors, and high-stakes choices.

---

## The Core Gameplay Loop

```text
WAKE UP IN APARTMENT 
  → RECEIVE MORNING NEWS (Phone / Newspaper)
  → WALK THE CITY (WASD / Arrow Keys)
  → INTERVIEW YOUR TEAM (Maya & Daniel at Office)
  → GATHER RUMORS & INSIDER TIPS (Cafe & Sovereign Club)
  → FORM A HYPOTHESIS & EXECUTE TRADES (Buy, Short, Sell)
  → ADVANCE TIME (Time slots & action costs)
  → SLEEP AT APARTMENT TO END DAY
  → WITNESS MARKET IMPACTS & TALLY P&L
  → AUDIT REPUTATION & EMPLOYEE RELATIONSHIPS
  → REPEAT ACROSS THE 5-DAY TRADING CYCLE
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## Controls

| Key / Action | Function |
|---|---|
| **W, A, S, D** or **Arrow Keys** | Walk character across city streets and interiors |
| **E** or **Space** | Interact with nearby NPCs, Bed, or Trading Terminal |
| **P** | Open Smartphone (News, Texts, Quotes, Invitations, Intel) |
| **M** | Open Market Execution Terminal & Hypothesis Engine |
| **N** | Open Financial Chronicle Morning Dispatch |
| **Click / Tap** | All HUD buttons and on-screen interaction triggers are fully clickable |

---

## World Map Locations

1. **Your Apartment** (Top-Left): Start the day, review your cash and previous day's P&L, sleep in bed to conclude the day.
2. **Apex Capital Office** (Top-Center): Headquarters where Maya Shah (Macro Trader) and Daniel Wong (Research Analyst) work alongside your executive trading desk.
3. **Financial District & Exchange Plaza** (Bottom-Center): Wall Street Bull statue, LED price boards, Robert (Lending VP), and Lisa (Exchange Specialist).
4. **Greenback Espresso Cafe** (Bottom-Left): Coffee bar with Sam (Impulsive Day Trader) and Priya (Financial Journalist).
5. **The Sovereign Club** (Right): Private luxury lounge with Victor Vance (Hedge Fund Titan), Emma Sterling (Tech Executive), and Marcus Croft (Sovereign Allocator).

---

## Assets & Trading Mechanics

- **CHPX**: ChipCore Technologies (Semiconductors)
- **OILA**: Trans-Oceanic Oil (Crude & Commodities)
- **BNKR**: Metropolitan Bank Corp (Banking & Financials)
- **TECH**: OmniTech Cloud Systems (Software & Infrastructure)
- **ENRG**: Vanguard Renewable Energy (Clean Energy & Utilities)

All assets start at **$100.00**. Supports **BUY** (Long), **SELL** (Close Long), **SHORT** (Profit from price drops), and **COVER** (Close Short).

---

## Built With
- **React 18** + **TypeScript**
- **Vite 5** + **@tailwindcss/vite**
- **Zustand** (Centralized game state store)
- **HTML5 Canvas 2D** (Smooth 60 FPS top-down rendering with collisions)
- **Web Audio API** (Pure procedural synthesizers for sounds)
- **Lucide React** & **Canvas Confetti**
