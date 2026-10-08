import React from 'react';
import { useGameStore } from '../store/gameStore';
import { calculateTotalPortfolioValue, calculatePositionPnL } from '../engine/marketEngine';
import { Briefcase, X, DollarSign, TrendingUp, TrendingDown, BookOpen, Sparkles } from 'lucide-react';

export const PortfolioPanel: React.FC = () => {
  const {
    portfolio,
    assets,
    player,
    discoveredIntel,
    todayHypothesis,
    closeOverlay,
    openOverlay,
  } = useGameStore(state => ({
    portfolio: state.portfolio,
    assets: state.assets,
    player: state.player,
    discoveredIntel: state.discoveredIntel,
    todayHypothesis: state.todayHypothesis,
    closeOverlay: state.closeOverlay,
    openOverlay: state.openOverlay,
  }));

  const { marketValue, totalPnL } = calculateTotalPortfolioValue(portfolio, assets);
  const netWorth = Math.round((player.cash + marketValue) * 100) / 100;

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                APEX CAPITAL // FUND PORTFOLIO & AUDIT
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Asset Allocations, Active Contracts, and Intelligence Dossier
              </p>
            </div>
          </div>
          <button
            onClick={closeOverlay}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Cash Balance</span>
              <span className="font-mono text-lg font-bold text-emerald-400">
                ${player.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Holdings Value</span>
              <span className="font-mono text-lg font-bold text-slate-200">
                ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Net Worth</span>
              <span className="font-mono text-lg font-bold text-sky-300">
                ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Unrealized P&L</span>
              <span
                className={`font-mono text-lg font-bold ${
                  totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {totalPnL >= 0 ? '+$' : '-$'}
                {Math.abs(Math.round(totalPnL)).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Active Positions Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Positions ({portfolio.length})
              </h3>
              <button
                onClick={() => openOverlay('market')}
                className="text-xs text-sky-400 hover:text-sky-300 font-mono underline"
              >
                + Place New Order
              </button>
            </div>

            {portfolio.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-900/50 rounded-xl border border-slate-800">
                Portfolio is 100% in cash. Visit your office terminal or open the market to deploy capital.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Asset</th>
                      <th className="py-2.5 px-4">Side</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4">Entry Price</th>
                      <th className="py-2.5 px-4">Current Price</th>
                      <th className="py-2.5 px-4 text-right">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                    {portfolio.map((pos, i) => {
                      const asset = assets.find(a => a.symbol === pos.symbol);
                      const currentPrice = asset ? asset.price : pos.entryPrice;
                      const pnl = calculatePositionPnL(pos, currentPrice);
                      return (
                        <tr key={i} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-bold text-slate-200">{pos.symbol}</td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                                pos.side === 'LONG'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {pos.side}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">{pos.quantity.toLocaleString()}</td>
                          <td className="py-2.5 px-4 text-slate-400">${pos.entryPrice.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-slate-300">${currentPrice.toFixed(2)}</td>
                          <td
                            className={`py-2.5 px-4 text-right font-bold ${
                              pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {pnl >= 0 ? '+$' : '-$'}{Math.abs(Math.round(pnl)).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Today's Thesis Box */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
              Today's Registered Thesis
            </span>
            {todayHypothesis ? (
              <p className="text-xs text-sky-300 font-mono">
                "I believe {todayHypothesis.asset} will {todayHypothesis.direction} because of {todayHypothesis.reason} with {todayHypothesis.confidence}% conviction."
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No active thesis formulated yet today. Open the Market Terminal to register one.
              </p>
            )}
          </div>

          {/* Intel Clues Gathering Dossier */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Gathered Intelligence Dossier ({discoveredIntel.length} Clues)</span>
            </h3>

            {discoveredIntel.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-900/50 rounded-xl border border-slate-800">
                No field intel recorded. Talk to your team and city NPCs to discover valuable tips.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {discoveredIntel.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                          item.tier === 'Insider'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : item.tier === 'Analyst'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : item.tier === 'Rumor'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {item.tier}
                      </span>
                      <span className="text-slate-400">{item.sourceName}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-sans">{item.content}</p>
                    {item.assetAffected && (
                      <span className="text-[10px] font-mono text-sky-400 block pt-1">
                        Affected Asset: {item.assetAffected}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
