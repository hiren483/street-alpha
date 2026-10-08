import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatTime, getDayName, getTimePhase } from '../engine/timeEngine';
import { calculateTotalPortfolioValue } from '../engine/marketEngine';
import { sound } from '../utils/audio';
import {
  Newspaper,
  TrendingUp,
  Briefcase,
  Smartphone,
  BookOpen,
  Moon,
  Volume2,
  VolumeX,
  Award,
  DollarSign,
  Clock,
} from 'lucide-react';

export const HUD: React.FC = () => {
  const {
    day,
    currentTimeMinutes,
    player,
    portfolio,
    assets,
    messages,
    invitations,
    discoveredIntel,
    openOverlay,
    endDayAndSleep,
  } = useGameStore(state => ({
    day: state.day,
    currentTimeMinutes: state.currentTimeMinutes,
    player: state.player,
    portfolio: state.portfolio,
    assets: state.assets,
    messages: state.messages,
    invitations: state.invitations,
    discoveredIntel: state.discoveredIntel,
    openOverlay: state.openOverlay,
    endDayAndSleep: state.endDayAndSleep,
  }));

  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
    if (sound.enabled) sound.playClick();
  };

  const { marketValue } = calculateTotalPortfolioValue(portfolio, assets);
  const netWorth = Math.round((player.cash + marketValue) * 100) / 100;
  const timePhase = getTimePhase(currentTimeMinutes);
  const unreadMessages = messages.filter(m => m.unread).length;
  const pendingInvitations = invitations.filter(i => !i.accepted && !i.declined).length;

  return (
    <div className="w-full flex flex-col gap-1 z-30 select-none">
      {/* Top HUD Bar */}
      <header className="w-full px-4 py-2.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 flex items-center justify-between shadow-xl">
        {/* Left: Day & Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded border border-slate-700">
            <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">
              DAY {day}
            </span>
            <span className="text-slate-500 font-mono">/</span>
            <span className="text-xs font-semibold text-slate-300 tracking-wide">
              {getDayName(day)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-sm font-semibold text-sky-300">
              {formatTime(currentTimeMinutes)}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                timePhase === 'Morning'
                  ? 'bg-amber-500/20 text-amber-300'
                  : timePhase === 'Daytime'
                  ? 'bg-blue-500/20 text-blue-300'
                  : timePhase === 'Evening'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-indigo-500/20 text-indigo-300'
              }`}
            >
              {timePhase}
            </span>
          </div>
        </div>

        {/* Center: Live Asset Ticker Strip */}
        <div className="hidden lg:flex items-center gap-4 px-3 py-1 bg-slate-950/70 rounded border border-slate-800 font-mono text-xs">
          {assets.map(asset => {
            const diff = asset.price - asset.previousPrice;
            const pct = asset.previousPrice > 0 ? (diff / asset.previousPrice) * 100 : 0;
            const isUp = diff >= 0;
            return (
              <div key={asset.symbol} className="flex items-center gap-1">
                <span className="font-bold text-slate-300">{asset.symbol}</span>
                <span className="text-slate-100">${asset.price.toFixed(2)}</span>
                <span
                  className={`text-[11px] font-semibold ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? '+' : ''}
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Financial Health & Reputation */}
        <div className="flex items-center gap-4">
          {/* Cash */}
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-mono">Cash</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ${player.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Net Worth */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded border border-slate-700">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-mono">Net Worth</span>
              <span className="font-mono font-bold text-sky-300 text-sm">
                ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Reputation */}
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-mono">Reputation</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {player.reputation}
              </span>
            </div>
          </div>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/50 rounded border border-slate-700 hover:bg-slate-700/50 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>
      </header>

      {/* Bottom Action HUD Dock */}
      <footer className="w-full px-4 py-2 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-between shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          {/* News Wire */}
          <button
            onClick={() => openOverlay('news')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-sky-500 text-xs font-semibold transition-all active:scale-95"
          >
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span>News Wire</span>
          </button>

          {/* Market / Trading */}
          <button
            onClick={() => openOverlay('market')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-emerald-500 text-xs font-semibold transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Market Terminal</span>
          </button>

          {/* Portfolio */}
          <button
            onClick={() => openOverlay('portfolio')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-sky-500 text-xs font-semibold transition-all active:scale-95"
          >
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>Portfolio</span>
            {portfolio.length > 0 && (
              <span className="px-1.5 py-0.2 bg-sky-500/30 text-sky-300 rounded text-[10px] font-mono">
                {portfolio.length}
              </span>
            )}
          </button>

          {/* Intel Notebook */}
          <button
            onClick={() => openOverlay('intel')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-purple-500 text-xs font-semibold transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Intel Notebook</span>
            {discoveredIntel.length > 0 && (
              <span className="px-1.5 py-0.2 bg-purple-500/30 text-purple-300 rounded text-[10px] font-mono">
                {discoveredIntel.length}
              </span>
            )}
          </button>

          {/* Smartphone */}
          <button
            onClick={() => openOverlay('phone')}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-amber-500 text-xs font-semibold transition-all active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Phone</span>
            {(unreadMessages > 0 || pendingInvitations > 0) && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>
        </div>

        {/* Sleep / End Day Quick Button */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Return to Apartment Bed or End Day
          </span>
          <button
            onClick={() => {
              sound.playNotification();
              endDayAndSleep();
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg shadow-lg border border-indigo-400/40 transition-transform active:scale-95"
          >
            <Moon className="w-4 h-4 text-indigo-200" />
            <span>SLEEP / END DAY</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
