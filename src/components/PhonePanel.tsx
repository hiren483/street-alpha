import React from 'react';
import { useGameStore } from '../store/gameStore';
import { PhoneTabType } from '../store/gameStore';
import { formatTime } from '../engine/timeEngine';
import { calculateTotalPortfolioValue, calculatePositionPnL } from '../engine/marketEngine';
import {
  X,
  Newspaper,
  MessageSquare,
  TrendingUp,
  Mail,
  Briefcase,
  BookOpen,
  Calendar,
  Sparkles,
  Check,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const PhonePanel: React.FC = () => {
  const {
    phoneTab,
    setPhoneTab,
    closeOverlay,
    currentEvent,
    messages,
    invitations,
    assets,
    portfolio,
    player,
    discoveredIntel,
    attendParty,
    respondToInvitation,
  } = useGameStore(state => ({
    phoneTab: state.phoneTab,
    setPhoneTab: state.setPhoneTab,
    closeOverlay: state.closeOverlay,
    currentEvent: state.currentEvent,
    messages: state.messages,
    invitations: state.invitations,
    assets: state.assets,
    portfolio: state.portfolio,
    player: state.player,
    discoveredIntel: state.discoveredIntel,
    attendParty: state.attendParty,
    respondToInvitation: state.respondToInvitation,
  }));

  const { marketValue, totalPnL } = calculateTotalPortfolioValue(portfolio, assets);
  const unreadCount = messages.filter(m => m.unread).length;
  const pendingInvites = invitations.filter(i => !i.accepted && !i.declined).length;

  return (
    <div className="modal-overlay">
      {/* Smartphone Outer Shell */}
      <div className="w-full max-w-md h-[90vh] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col relative select-none">
        {/* Phone Speaker & Camera Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full flex items-center justify-center gap-2 z-20">
          <div className="w-10 h-1.5 bg-slate-800 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full"></div>
        </div>

        {/* Close Button top right */}
        <button
          onClick={closeOverlay}
          className="absolute top-4 right-5 p-1 text-slate-400 hover:text-white z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Phone Screen Display */}
        <div className="w-full h-full bg-slate-900 rounded-[32px] overflow-hidden flex flex-col pt-8">
          {/* Status Bar */}
          <div className="px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800">
            <span>ApexOS 4.2</span>
            <span>LTE 5G ● 98%</span>
          </div>

          {/* Navigation App Tabs */}
          <div className="grid grid-cols-6 bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-center">
            <button
              onClick={() => setPhoneTab('news')}
              className={`py-2.5 flex flex-col items-center gap-0.5 ${
                phoneTab === 'news' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>News</span>
            </button>
            <button
              onClick={() => setPhoneTab('messages')}
              className={`py-2.5 flex flex-col items-center gap-0.5 relative ${
                phoneTab === 'messages' ? 'text-sky-400 border-b-2 border-sky-400 bg-sky-400/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Texts</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>
            <button
              onClick={() => setPhoneTab('market')}
              className={`py-2.5 flex flex-col items-center gap-0.5 ${
                phoneTab === 'market' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Quote</span>
            </button>
            <button
              onClick={() => setPhoneTab('invitations')}
              className={`py-2.5 flex flex-col items-center gap-0.5 relative ${
                phoneTab === 'invitations' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-400/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Invites</span>
              {pendingInvites > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              )}
            </button>
            <button
              onClick={() => setPhoneTab('portfolio')}
              className={`py-2.5 flex flex-col items-center gap-0.5 ${
                phoneTab === 'portfolio' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>P&L</span>
            </button>
            <button
              onClick={() => setPhoneTab('intel')}
              className={`py-2.5 flex flex-col items-center gap-0.5 ${
                phoneTab === 'intel' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-400/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Intel</span>
            </button>
          </div>

          {/* Tab Body View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
            {/* 1. NEWS TAB */}
            {phoneTab === 'news' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Morning Financial Wire
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Live Edition</span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/30">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold uppercase">
                    BREAKING LEAD
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 mt-1 mb-1">
                    {currentEvent.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentEvent.publicInformation}
                  </p>
                </div>

                {currentEvent.publicNews.map((article, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="font-bold text-sky-400">{article.category}</span>
                      <span>{article.time}</span>
                    </div>
                    <h5 className="text-xs font-semibold text-slate-100">{article.headline}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{article.body}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 2. MESSAGES TAB */}
            {phoneTab === 'messages' && (
              <div className="space-y-2.5">
                <div className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-1">
                  Direct Messages
                </div>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200">{msg.sender}</span>
                        {msg.role && (
                          <span className="text-[9px] font-mono text-slate-400">({msg.role})</span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. MARKET TAB */}
            {phoneTab === 'market' && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Exchange Spot Rates
                </div>
                {assets.map(asset => {
                  const diff = asset.price - asset.previousPrice;
                  const pct = asset.previousPrice > 0 ? (diff / asset.previousPrice) * 100 : 0;
                  const isUp = diff >= 0;
                  return (
                    <div
                      key={asset.symbol}
                      className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 flex items-center justify-between font-mono"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200">{asset.symbol}</div>
                        <div className="text-[10px] text-slate-500">{asset.sector}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-100">${asset.price.toFixed(2)}</div>
                        <div className={`text-[10px] ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isUp ? '+' : ''}{pct.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. INVITATIONS TAB */}
            {phoneTab === 'invitations' && (
              <div className="space-y-3">
                <div className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider mb-1">
                  Private Invitations
                </div>
                {invitations.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-950/50 rounded-xl border border-slate-800">
                    No active invitations. Build your reputation and invitations will arrive from high-net-worth investors!
                  </div>
                ) : (
                  invitations.map(inv => (
                    <div
                      key={inv.id}
                      className="p-3.5 bg-slate-950 rounded-xl border border-purple-500/30 space-y-2 shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">{inv.fromName}</span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          {inv.timeString}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100">{inv.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{inv.description}</p>

                      <div className="pt-2 flex items-center gap-2">
                        {inv.attended ? (
                          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Attended (+2 hrs spent)
                          </span>
                        ) : inv.declined ? (
                          <span className="text-xs text-slate-500 font-mono">Declined</span>
                        ) : (
                          <>
                            <button
                              onClick={() => attendParty(inv.id)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-mono text-xs font-bold shadow"
                            >
                              ATTEND (+2 hrs)
                            </button>
                            <button
                              onClick={() => respondToInvitation(inv.id, false)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs"
                            >
                              DECLINE
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 5. PORTFOLIO TAB */}
            {phoneTab === 'portfolio' && (
              <div className="space-y-3 font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Cash Reserves:</span>
                    <span className="text-emerald-400 font-bold">${player.cash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Market Positions:</span>
                    <span className="text-slate-200">${marketValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                    <span>Unrealized P&L:</span>
                    <span className={totalPnL >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {totalPnL >= 0 ? '+$' : '-$'}{Math.abs(Math.round(totalPnL)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  Open Positions ({portfolio.length})
                </div>

                {portfolio.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">No open positions.</p>
                ) : (
                  portfolio.map((pos, idx) => {
                    const asset = assets.find(a => a.symbol === pos.symbol);
                    const currentPrice = asset ? asset.price : pos.entryPrice;
                    const pnl = calculatePositionPnL(pos, currentPrice);
                    return (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-200">
                            {pos.side} {pos.quantity} {pos.symbol}
                          </span>
                          <span className={pnl >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {pnl >= 0 ? '+$' : '-$'}{Math.abs(Math.round(pnl)).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Entry: ${pos.entryPrice.toFixed(2)}</span>
                          <span>Now: ${currentPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 6. INTEL NOTEBOOK TAB */}
            {phoneTab === 'intel' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-yellow-400 uppercase tracking-wider">
                    Discovered Clues ({discoveredIntel.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Field Dossier</span>
                </div>

                {discoveredIntel.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-950/50 rounded-xl border border-slate-800">
                    No intelligence gathered yet today. Walk around and talk to Maya, Daniel, Sam, Priya, or club executives!
                  </div>
                ) : (
                  discoveredIntel.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                            item.tier === 'Insider'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.tier === 'Analyst'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : item.tier === 'Rumor'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {item.tier}
                        </span>
                        <span className="text-slate-400">{item.sourceName}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">{item.content}</p>
                      {item.assetAffected && (
                        <div className="text-[10px] font-mono text-sky-400 flex items-center gap-1">
                          Target Asset: {item.assetAffected}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="py-2 flex justify-center bg-slate-950">
            <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
