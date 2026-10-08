import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import confetti from 'canvas-confetti';
import { Trophy, TrendingUp, Award, RotateCcw, CheckCircle, BarChart3 } from 'lucide-react';

export const WeekSummary: React.FC = () => {
  const {
    startingNetWorth,
    player,
    hypothesesHistory,
    dayHistory,
    restartGame,
  } = useGameStore(state => ({
    startingNetWorth: state.startingNetWorth,
    player: state.player,
    hypothesesHistory: state.hypothesesHistory,
    dayHistory: state.dayHistory,
    restartGame: state.restartGame,
  }));

  const finalNetWorth = player.cash; // After closing or net worth tally
  const lastDay = dayHistory[dayHistory.length - 1];
  const netWorthEnd = lastDay ? lastDay.endingNetWorth : player.cash;

  const returnPct = Math.round(((netWorthEnd - startingNetWorth) / startingNetWorth) * 1000) / 10;
  const correctCount = hypothesesHistory.filter(h => h.wasCorrect).length;
  const totalTheses = hypothesesHistory.length;

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  let performanceTier = 'Rising Fund Manager';
  let tierColor = 'text-sky-400';
  if (returnPct >= 20) {
    performanceTier = 'Legendary Titan of Wall Street';
    tierColor = 'text-amber-400';
  } else if (returnPct >= 5) {
    performanceTier = 'Boutique Market Winner';
    tierColor = 'text-emerald-400';
  } else if (returnPct < 0) {
    performanceTier = 'Humbled Contrarian';
    tierColor = 'text-rose-400';
  }

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-3xl max-h-[92vh] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col select-none">
        {/* Banner Header */}
        <div className="px-8 py-8 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center relative">
          <div className="inline-flex items-center gap-2 p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40 mb-3 shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">
            WEEK 1 PERFORMANCE AUDIT
          </h2>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
            Apex Capital Founder Assessment
          </p>
          <div className={`text-sm font-mono font-bold mt-2 ${tierColor}`}>
            Title Conferred: {performanceTier}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-slate-950/80">
          {/* Key Scorecard Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Starting Capital
              </span>
              <div className="text-base font-mono font-bold text-slate-200 mt-1">
                ${startingNetWorth.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Final Net Worth
              </span>
              <div className="text-lg font-mono font-black text-sky-300 mt-1">
                ${netWorthEnd.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Cumulative Return
              </span>
              <div
                className={`text-lg font-mono font-black mt-1 ${
                  returnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {returnPct >= 0 ? '+' : ''}{returnPct}%
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Final Reputation
              </span>
              <div className="text-lg font-mono font-black text-amber-400 mt-1">
                {player.reputation}
              </div>
            </div>
          </div>

          {/* Decision Accuracy Stat */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block">Thematic Accuracy:</span>
              <span className="text-slate-100 font-bold text-sm">
                {correctCount} / {totalTheses > 0 ? totalTheses : 0} Correct Predictions
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Active Team:</span>
              <span className="text-slate-100 font-bold text-sm">
                Maya Shah & Daniel Wong (Apex Capital)
              </span>
            </div>
          </div>

          {/* Daily Track Record Table */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
              Daily Ledger Breakdown
            </h4>
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Day</th>
                    <th className="py-2.5 px-4">Event</th>
                    <th className="py-2.5 px-4 text-right">Daily P&L</th>
                    <th className="py-2.5 px-4 text-right">Net Worth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {dayHistory.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-bold text-slate-300">Day {d.day}</td>
                      <td className="py-2.5 px-4 text-slate-300 truncate max-w-[200px]">
                        {d.eventTitle}
                      </td>
                      <td
                        className={`py-2.5 px-4 text-right font-bold ${
                          d.dayProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {d.dayProfit >= 0 ? '+$' : '-$'}{Math.abs(d.dayProfit).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-100">
                        ${d.endingNetWorth.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Restart Action Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400 italic font-sans">
            Ready for a new market cycle with randomized event sequence?
          </p>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black font-mono text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
