import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { AssetSymbol, PositionSide, Hypothesis } from '../types/game';
import { calculatePositionPnL } from '../engine/marketEngine';
import {
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const MarketPanel: React.FC = () => {
  const {
    assets,
    portfolio,
    player,
    todayHypothesis,
    executeTrade,
    setHypothesis,
    closeOverlay,
    addToast,
  } = useGameStore(state => ({
    assets: state.assets,
    portfolio: state.portfolio,
    player: state.player,
    todayHypothesis: state.todayHypothesis,
    executeTrade: state.executeTrade,
    setHypothesis: state.setHypothesis,
    closeOverlay: state.closeOverlay,
    addToast: state.addToast,
  }));

  const [selectedSymbol, setSelectedSymbol] = useState<AssetSymbol>('CHPX');
  const [action, setAction] = useState<'BUY' | 'SELL' | 'SHORT' | 'COVER'>('BUY');
  const [quantity, setQuantity] = useState<number>(100);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Hypothesis form state
  const [hypDirection, setHypDirection] = useState<'RISE' | 'FALL'>('FALL');
  const [hypReason, setHypReason] = useState<string>('Factory Supply Disruption');
  const [hypConfidence, setHypConfidence] = useState<number>(80);

  const selectedAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];
  const longPos = portfolio.find(p => p.symbol === selectedSymbol && p.side === 'LONG');
  const shortPos = portfolio.find(p => p.symbol === selectedSymbol && p.side === 'SHORT');

  const tradeCost = Math.round(quantity * selectedAsset.price * 100) / 100;
  const isClosing = action === 'SELL' || action === 'COVER';

  const handleExecute = () => {
    setStatusMessage(null);
    let side: PositionSide = 'LONG';
    let isClose = false;

    if (action === 'BUY') {
      side = 'LONG';
      isClose = false;
    } else if (action === 'SELL') {
      side = 'LONG';
      isClose = true;
    } else if (action === 'SHORT') {
      side = 'SHORT';
      isClose = false;
    } else if (action === 'COVER') {
      side = 'SHORT';
      isClose = true;
    }

    const result = executeTrade(selectedSymbol, side, quantity, isClose);
    if (result.success) {
      setStatusMessage({ text: result.message, isError: false });
      addToast('Trade Executed', result.message, 'success');
    } else {
      setStatusMessage({ text: result.message, isError: true });
      addToast('Trade Rejected', result.message, 'alert');
    }
  };

  const handleSaveHypothesis = () => {
    const hyp: Hypothesis = {
      asset: selectedSymbol,
      direction: hypDirection,
      reason: hypReason,
      confidence: hypConfidence,
    };
    setHypothesis(hyp);
    addToast('Hypothesis Formed', `Hypothesis set for ${selectedSymbol}: ${hypDirection} (${hypConfidence}%)`, 'info');
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-4xl max-h-[92vh] rounded-xl overflow-hidden flex flex-col border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                APEX CAPITAL // TRADING TERMINAL
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Institutional Execution & Hypothesis Engine
              </p>
            </div>
          </div>
          <button
            onClick={closeOverlay}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Asset Selector Row */}
          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Market Assets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {assets.map(asset => {
                const diff = asset.price - asset.previousPrice;
                const pct = asset.previousPrice > 0 ? (diff / asset.previousPrice) * 100 : 0;
                const isUp = diff >= 0;
                const isSelected = asset.symbol === selectedSymbol;

                return (
                  <button
                    key={asset.symbol}
                    onClick={() => {
                      setSelectedSymbol(asset.symbol);
                      setStatusMessage(null);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-400 shadow-md ring-1 ring-sky-400'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-slate-100">
                        {asset.symbol}
                      </span>
                      <span
                        className={`text-xs font-mono font-semibold ${
                          isUp ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{asset.name}</div>
                    <div className="text-sm font-mono font-bold text-slate-200 mt-1">
                      ${asset.price.toFixed(2)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Asset Detail & Order Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Asset Detail & Active Positions */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{selectedAsset.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Sector: {selectedAsset.sector}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-emerald-400">
                    ${selectedAsset.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Last Close: ${selectedAsset.previousPrice.toFixed(2)}</div>
                </div>
              </div>

              {/* Price History Mini Chart */}
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Recent Price Path
                </span>
                <div className="flex items-end gap-1.5 h-16 bg-slate-950/80 p-2 rounded border border-slate-800">
                  {selectedAsset.history.map((val, idx) => {
                    const min = Math.min(...selectedAsset.history) * 0.95;
                    const max = Math.max(...selectedAsset.history) * 1.05;
                    const heightPct = Math.max(10, Math.min(100, ((val - min) / (max - min || 1)) * 100));
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-sky-500/60 hover:bg-sky-400 rounded-t transition-all relative group"
                        style={{ height: `${heightPct}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-sky-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 z-10 whitespace-nowrap">
                          ${val.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Position Status for this asset */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase text-slate-400 block">
                  Your Current Positions in {selectedSymbol}
                </span>

                {longPos ? (
                  <div className="flex items-center justify-between p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs">
                    <div>
                      <span className="font-bold text-emerald-400">LONG</span> {longPos.quantity} shs @ ${longPos.entryPrice.toFixed(2)}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">P&L: </span>
                      <span
                        className={`font-bold ${
                          calculatePositionPnL(longPos, selectedAsset.price) >= 0
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {calculatePositionPnL(longPos, selectedAsset.price) >= 0 ? '+$' : '-$'}
                        {Math.abs(Math.round(calculatePositionPnL(longPos, selectedAsset.price))).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : null}

                {shortPos ? (
                  <div className="flex items-center justify-between p-2.5 rounded bg-rose-950/30 border border-rose-500/30 font-mono text-xs">
                    <div>
                      <span className="font-bold text-rose-400">SHORT</span> {shortPos.quantity} shs @ ${shortPos.entryPrice.toFixed(2)}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">P&L: </span>
                      <span
                        className={`font-bold ${
                          calculatePositionPnL(shortPos, selectedAsset.price) >= 0
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {calculatePositionPnL(shortPos, selectedAsset.price) >= 0 ? '+$' : '-$'}
                        {Math.abs(Math.round(calculatePositionPnL(shortPos, selectedAsset.price))).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : null}

                {!longPos && !shortPos && (
                  <p className="text-xs text-slate-500 italic">No active position in {selectedSymbol}.</p>
                )}
              </div>
            </div>

            {/* Right Column: Execution Form */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-100 text-sm font-mono uppercase tracking-wide">
                Order Execution
              </h3>

              {/* Action Selection Tabs */}
              <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono font-bold">
                <button
                  onClick={() => {
                    setAction('BUY');
                    setStatusMessage(null);
                  }}
                  className={`py-2 rounded transition-colors ${
                    action === 'BUY'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => {
                    setAction('SELL');
                    setStatusMessage(null);
                  }}
                  className={`py-2 rounded transition-colors ${
                    action === 'SELL'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SELL
                </button>
                <button
                  onClick={() => {
                    setAction('SHORT');
                    setStatusMessage(null);
                  }}
                  className={`py-2 rounded transition-colors ${
                    action === 'SHORT'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SHORT
                </button>
                <button
                  onClick={() => {
                    setAction('COVER');
                    setStatusMessage(null);
                  }}
                  className={`py-2 rounded transition-colors ${
                    action === 'COVER'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  COVER
                </button>
              </div>

              {/* Quantity Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">QUANTITY (SHARES)</span>
                  <span className="text-slate-400 font-mono">
                    Avail Cash: ${player.cash.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    step="10"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                  {/* Preset quick buttons */}
                  <div className="flex gap-1">
                    {[50, 100, 250, 500].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setQuantity(amt)}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs border border-slate-700"
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary Receipt */}
              <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Unit Price:</span>
                  <span className="text-slate-200">${selectedAsset.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Total:</span>
                  <span className="text-slate-100 font-bold">${tradeCost.toLocaleString()}</span>
                </div>
                {!isClosing && (
                  <div className="flex justify-between text-slate-400">
                    <span>Remaining Cash:</span>
                    <span
                      className={`font-semibold ${
                        player.cash >= tradeCost ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      ${Math.max(0, player.cash - tradeCost).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                    statusMessage.isError
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {statusMessage.isError ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleExecute}
                className={`w-full py-2.5 rounded-lg font-mono font-bold text-sm tracking-wide shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                  action === 'BUY'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : action === 'SELL'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : action === 'SHORT'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <span>EXECUTE {action} ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hypothesis Formulation Section (Core Game Mechanic) */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-sky-500/30 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <h3 className="font-mono font-bold text-sm text-sky-300 uppercase tracking-wide">
                Trading Hypothesis Formulation
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Apex Capital manages risk through explicit theses. Record your belief to earn reputation points at end-of-day.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">I believe:</label>
                <div className="p-2 bg-slate-950 rounded border border-slate-700 font-mono text-sm font-bold text-slate-200">
                  {selectedSymbol}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Will:</label>
                <select
                  value={hypDirection}
                  onChange={e => setHypDirection(e.target.value as 'RISE' | 'FALL')}
                  className="w-full p-2 bg-slate-950 rounded border border-slate-700 font-mono text-sm font-bold text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="FALL">FALL (Bearish)</option>
                  <option value="RISE">RISE (Bullish)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Because of:</label>
                <select
                  value={hypReason}
                  onChange={e => setHypReason(e.target.value)}
                  className="w-full p-2 bg-slate-950 rounded border border-slate-700 font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="Factory Supply Disruption">Factory Supply Disruption</option>
                  <option value="Institutional Pipeline Sabotage">Pipeline / Energy Shock</option>
                  <option value="Liquidity Squeeze & Toxic Debt">Liquidity Squeeze / Bank Stress</option>
                  <option value="Generational AI Enterprise Orders">AI / Enterprise Demand Boom</option>
                  <option value="Clean Energy Technology Breakthrough">Clean Energy Technological Leap</option>
                  <option value="Inflation CPI Shock">CPI / Inflation Shock</option>
                  <option value="Central Bank Rate Cut">Central Bank Rate Cut</option>
                  <option value="Regulatory Antitrust Crackdown">Antitrust / Regulation Enforcement</option>
                  <option value="Global Macro Expansion">Global Manufacturing Expansion</option>
                  <option value="Macroeconomic Recession Wave">Imminent Macro Recession</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Confidence ({hypConfidence}%):
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={hypConfidence}
                  onChange={e => setHypConfidence(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
              {todayHypothesis ? (
                <div className="text-xs font-mono text-sky-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Current Thesis: {todayHypothesis.asset} will {todayHypothesis.direction} ({todayHypothesis.confidence}%)
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">No hypothesis registered for today yet.</span>
              )}

              <button
                type="button"
                onClick={handleSaveHypothesis}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs rounded shadow transition-colors"
              >
                CONFIRM HYPOTHESIS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
