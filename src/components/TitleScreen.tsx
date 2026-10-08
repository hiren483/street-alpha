import React from 'react';
import { useGameStore } from '../store/gameStore';
import { TrendingUp, Play, ShieldAlert, Award, Compass, DollarSign } from 'lucide-react';

export const TitleScreen: React.FC = () => {
  const startGame = useGameStore(state => state.startGame);

  return (
    <div className="fixed inset-0 bg-[#070b13] flex items-center justify-center p-4 z-50 select-none">
      {/* Background glow effects */}
      <div className="absolute w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl -top-32 -left-32 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -bottom-32 -right-32 pointer-events-none"></div>

      {/* Main Intro Card */}
      <div className="glass-panel w-full max-w-xl p-8 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-indigo-500"></div>

        {/* Brand Icon */}
        <div className="p-3.5 bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 rounded-2xl border border-sky-400/30 text-sky-400 mb-4 shadow-lg">
          <TrendingUp className="w-10 h-10" />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100 font-mono">
          APEX CAPITAL
        </h1>
        <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-emerald-400 mt-1 mb-6">
          A 2D LIFE & WALL STREET TRADING SIMULATOR
        </p>

        {/* Atmospheric Mission Statement */}
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed max-w-md font-sans mb-8">
          <p className="font-semibold text-slate-100 text-base">
            You have <span className="text-emerald-400 font-mono font-bold">$100,000</span>.
          </p>
          <p>
            Build your firm. Walk the city. Read the world. Trust the right people. Make your bets.
          </p>
          <p className="text-xs text-slate-400 font-mono italic">
            "The market doesn't care about your plans."
          </p>
        </div>

        {/* Gameplay loop summary cards */}
        <div className="grid grid-cols-3 gap-2 w-full text-[11px] font-mono text-slate-400 mb-8">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-0.5">1. GATHER INTEL</span>
            Interview employees & cafe regulars
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-sky-400 font-bold block mb-0.5">2. FORM THESIS</span>
            Decide who to trust before trading
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-0.5">3. HARVEST P&L</span>
            Sleep & watch the market react
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startGame}
          className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-black font-mono text-base rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
        >
          <span>START DAY 1</span>
          <Play className="w-5 h-5 fill-slate-950 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Controls footer */}
        <div className="mt-6 text-[11px] text-slate-500 font-mono">
          Controls: WASD / Arrow keys to walk • [E] to interact • [P] Phone • [M] Market
        </div>
      </div>
    </div>
  );
};
