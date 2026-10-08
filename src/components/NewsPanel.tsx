import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getDayName } from '../engine/timeEngine';
import { X, Newspaper, TrendingUp, AlertTriangle } from 'lucide-react';

export const NewsPanel: React.FC = () => {
  const { currentEvent, day, closeOverlay } = useGameStore(state => ({
    currentEvent: state.currentEvent,
    day: state.day,
    closeOverlay: state.closeOverlay,
  }));

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
        {/* Newspaper Masthead */}
        <div className="px-8 py-5 bg-slate-900 border-b-2 border-slate-700 flex flex-col items-center justify-center relative select-none">
          <button
            onClick={closeOverlay}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
            THE FINANCIAL CHRONICLE • EDITION {day} • {getDayName(day)}
          </span>
          <h1 className="text-2xl font-serif font-black tracking-tight text-slate-100 my-1">
            WALL STREET MORNING DISPATCH
          </h1>
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-b border-slate-800 py-1 mt-1">
            <span>VOL. CXVIII NO. 42</span>
            <span>APEX CAPITAL INTELLIGENCE FEED</span>
            <span>$3.50 NEWSTAND / FREE FOR TRADERS</span>
          </div>
        </div>

        {/* Newspaper Article Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-slate-950/70">
          {/* Main Headline */}
          <div className="space-y-3 pb-6 border-b border-slate-800">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              BREAKING MARKET EVENT
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight leading-snug">
              {currentEvent.title}: {currentEvent.description}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-serif">
              {currentEvent.publicInformation}
            </p>
          </div>

          {/* Sub-Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentEvent.publicNews.map((news, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="font-bold text-sky-400">{news.category}</span>
                  <span>{news.time}</span>
                </div>
                <h4 className="font-bold text-slate-100 text-xs leading-snug">
                  {news.headline}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {news.body}
                </p>
              </div>
            ))}
          </div>

          {/* Editorial Analysis Box */}
          <div className="p-4 bg-sky-950/30 rounded-xl border border-sky-500/30 text-xs space-y-1">
            <span className="font-mono font-bold text-sky-400 uppercase tracking-wider block">
              Apex Desk Trading Note:
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              Headlines represent public perception. To find the true market mispricing, speak with your macro trader Maya and quantitative researcher Daniel at the office, or listen to street rumors in the cafe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
