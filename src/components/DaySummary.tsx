import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getDayName } from '../engine/timeEngine';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  TrendingDown,
  Award,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export const DaySummary: React.FC = () => {
  const { daySummary, continueToNextDay } = useGameStore(state => ({
    daySummary: state.daySummary,
    continueToNextDay: state.continueToNextDay,
  }));

  const [displayedProfit, setDisplayedProfit] = useState<number>(0);
  const [displayedNetWorth, setDisplayedNetWorth] = useState<number>(
    daySummary ? daySummary.startingNetWorth : 100000
  );

  useEffect(() => {
    if (!daySummary) return;

    if (daySummary.dayProfit > 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    // Number count-up animation
    const targetProfit = daySummary.dayProfit;
    const targetNW = daySummary.endingNetWorth;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setDisplayedProfit(Math.round(targetProfit * easeProgress));
      setDisplayedNetWorth(
        Math.round(
          daySummary.startingNetWorth +
            (targetNW - daySummary.startingNetWorth) * easeProgress
        )
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [daySummary]);

  if (!daySummary) return null;

  const isProfitable = daySummary.dayProfit >= 0;

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-3xl max-h-[92vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col select-none">
        {/* Banner Header */}
        <div
          className={`px-8 py-6 text-center border-b ${
            isProfitable
              ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/30'
              : 'bg-gradient-to-b from-rose-950/80 to-slate-900 border-rose-500/30'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-amber-400 font-bold mb-2">
            DAY {daySummary.day} SETTLEMENT • {getDayName(daySummary.day)}
          </div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">
            TRADING DAY COMPLETE
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Market Event: {daySummary.eventTitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-slate-950/70">
          {/* Main Profit / Net Worth Tally Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Daily P&L
              </span>
              <div
                className={`text-2xl font-mono font-black mt-1 ${
                  isProfitable ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {displayedProfit >= 0 ? '+$' : '-$'}
                {Math.abs(displayedProfit).toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Closing Net Worth
              </span>
              <div className="text-2xl font-mono font-black text-sky-300 mt-1">
                ${displayedNetWorth.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Reputation Change
              </span>
              <div
                className={`text-2xl font-mono font-black mt-1 flex items-center justify-center gap-1 ${
                  daySummary.reputationChange >= 0
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                <Award className="w-5 h-5" />
                <span>
                  {daySummary.reputationChange >= 0 ? '+' : ''}
                  {daySummary.reputationChange}
                </span>
              </div>
            </div>
          </div>

          {/* Market Price Consequences Table */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              Asset Settlement & True Market Impact
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
              {daySummary.priceChanges.map(change => {
                const isUp = change.changePercent >= 0;
                return (
                  <div
                    key={change.symbol}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{change.symbol}</span>
                      <span
                        className={`text-[11px] font-semibold ${
                          isUp ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {change.changePercent}%
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1">
                      ${change.from.toFixed(2)} → <span className="text-slate-100 font-bold">${change.to.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hypothesis Audit */}
          {daySummary.hypothesis && (
            <div
              className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
                daySummary.hypothesisCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {daySummary.hypothesisCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  HYPOTHESIS EVALUATION:{' '}
                  {daySummary.hypothesisCorrect ? 'VERIFIED (+2 REP)' : 'FALSIFIED (-1 REP)'}
                </span>
              </div>
              <p className="text-slate-300 font-sans">
                You predicted {daySummary.hypothesis.asset} would {daySummary.hypothesis.direction} ({daySummary.hypothesis.confidence}% confidence) due to {daySummary.hypothesis.reason}.
              </p>
            </div>
          )}

          {/* Employee Debrief & Reactions */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>Office Team Debrief</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {daySummary.employeeReactions.map((reaction, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{reaction.employeeName}</span>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      [{reaction.mood}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{reaction.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Next Day Button */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={continueToNextDay}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <span>CONTINUE TO DAY {daySummary.day + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
