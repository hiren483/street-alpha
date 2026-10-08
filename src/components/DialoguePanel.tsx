import React from 'react';
import { useGameStore } from '../store/gameStore';
import { NPCS } from '../data/npcs';
import { MessageSquare, Clock, X, Sparkles, AlertCircle } from 'lucide-react';

export const DialoguePanel: React.FC = () => {
  const {
    activeNpcId,
    dialogueHistory,
    currentEvent,
    selectDialogueChoice,
    closeDialogue,
  } = useGameStore(state => ({
    activeNpcId: state.activeNpcId,
    dialogueHistory: state.dialogueHistory,
    currentEvent: state.currentEvent,
    selectDialogueChoice: state.selectDialogueChoice,
    closeDialogue: state.closeDialogue,
  }));

  if (!activeNpcId) return null;

  const npc = NPCS.find(n => n.id === activeNpcId);
  if (!npc) return null;

  const eventDialogue = npc.dialogueByEventId[currentEvent.id] || npc.defaultDialogue;
  const choices = eventDialogue.choices;

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header with NPC Portrait and Info */}
        <div className="px-6 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* NPC Avatar Circle */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-slate-950 shadow-md relative"
              style={{ backgroundColor: npc.color }}
            >
              {npc.name.charAt(0)}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">{npc.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {npc.personality}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{npc.role}</p>
            </div>
          </div>

          <button
            onClick={closeDialogue}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Transcript Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-950/40">
          {dialogueHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                item.isPlayer ? 'items-end' : 'items-start'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 mb-1 px-1">
                {item.speaker}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  item.isPlayer
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Choices Footer */}
        <div className="p-5 bg-slate-900/90 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>DIALOGUE OPTIONS</span>
            <span className="flex items-center gap-1 text-amber-400/90">
              <Clock className="w-3.5 h-3.5" />
              Costs +30 mins
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => selectDialogueChoice(index)}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-sky-950/80 border border-slate-700 hover:border-sky-500 text-slate-200 hover:text-sky-200 transition-all text-xs font-medium flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-700 group-hover:bg-sky-600 flex items-center justify-center font-mono font-bold text-[10px] text-slate-300 group-hover:text-white transition-colors">
                    {index + 1}
                  </span>
                  <span>"{choice.text}"</span>
                </div>
                {choice.intel && (
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    Intel Tip
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={closeDialogue}
              className="w-full text-center py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              [End Conversation]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
