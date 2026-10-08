import React from 'react';
import { useGameStore } from './store/gameStore';
import { TitleScreen } from './components/TitleScreen';
import { GameWorld } from './components/GameWorld';
import { HUD } from './components/HUD';
import { MarketPanel } from './components/MarketPanel';
import { DialoguePanel } from './components/DialoguePanel';
import { PhonePanel } from './components/PhonePanel';
import { NewsPanel } from './components/NewsPanel';
import { PortfolioPanel } from './components/PortfolioPanel';
import { DaySummary } from './components/DaySummary';
import { WeekSummary } from './components/WeekSummary';
import { Toasts } from './components/Toasts';

export const App: React.FC = () => {
  const {
    isStarted,
    activeOverlay,
    daySummary,
    showWeekSummary,
  } = useGameStore(state => ({
    isStarted: state.isStarted,
    activeOverlay: state.activeOverlay,
    daySummary: state.daySummary,
    showWeekSummary: state.showWeekSummary,
  }));

  if (!isStarted) {
    return <TitleScreen />;
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#070b13] overflow-hidden select-none">
      {/* HUD Header & Ticker */}
      <HUD />

      {/* Main 2D Viewport */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-2">
        <GameWorld />
      </main>

      {/* Interactive Overlays */}
      {activeOverlay === 'market' && <MarketPanel />}
      {activeOverlay === 'dialogue' && <DialoguePanel />}
      {activeOverlay === 'phone' && <PhonePanel />}
      {activeOverlay === 'news' && <NewsPanel />}
      {(activeOverlay === 'portfolio' || activeOverlay === 'intel') && <PortfolioPanel />}

      {/* End-of-Day Settlement Screen */}
      {daySummary && <DaySummary />}

      {/* Week End Audit & Scoring Screen */}
      {showWeekSummary && <WeekSummary />}

      {/* Global Toast Notifications */}
      <Toasts />
    </div>
  );
};

export default App;
