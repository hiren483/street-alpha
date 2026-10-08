import { create } from 'zustand';
import {
  Asset,
  AssetSymbol,
  Position,
  PositionSide,
  NPC,
  Employee,
  MarketEvent,
  DiscoveredIntel,
  Message,
  Invitation,
  Hypothesis,
  DayResult,
  LocationId,
} from '../types/game';
import { INITIAL_ASSETS } from '../data/assets';
import { MARKET_EVENTS } from '../data/events';
import { EMPLOYEES, NPCS, LOCATIONS } from '../data/npcs';
import { advanceTime, formatTime } from '../engine/timeEngine';
import {
  calculateNetWorth,
  calculateTotalPortfolioValue,
  calculatePositionPnL,
  applyMarketEventImpact,
} from '../engine/marketEngine';
import { sound } from '../utils/audio';

export type OverlayType = 'phone' | 'market' | 'news' | 'portfolio' | 'intel' | 'dialogue' | 'hypothesis' | null;
export type PhoneTabType = 'news' | 'messages' | 'market' | 'invitations' | 'portfolio' | 'intel';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface GameState {
  // Game lifecycle
  isStarted: boolean;
  day: number;
  totalDays: number;
  currentTimeMinutes: number; // 540 = 9:00 AM
  isGameOver: boolean;

  // Player & Economics
  player: {
    x: number;
    y: number;
    cash: number;
    reputation: number;
    currentLocationId: LocationId;
    facing: 'up' | 'down' | 'left' | 'right';
  };
  startingNetWorth: number;

  // Market & Trading
  assets: Asset[];
  portfolio: Position[];
  todayHypothesis: Hypothesis | null;
  hypothesesHistory: { day: number; hypothesis: Hypothesis; wasCorrect: boolean }[];

  // Entities & Intel
  employees: Employee[];
  npcs: NPC[];
  discoveredIntel: DiscoveredIntel[];
  messages: Message[];
  invitations: Invitation[];
  
  // Events
  currentEvent: MarketEvent;
  upcomingEvents: MarketEvent[];
  dayHistory: DayResult[];

  // UI state
  activeOverlay: OverlayType;
  phoneTab: PhoneTabType;
  activeNpcId: string | null;
  dialogueHistory: { speaker: string; text: string; isPlayer?: boolean }[];
  daySummary: DayResult | null;
  showWeekSummary: boolean;
  toasts: ToastNotification[];
  tutorialStep: number;
  tutorialHint: string;

  // Actions
  startGame: () => void;
  movePlayer: (x: number, y: number, facing: 'up' | 'down' | 'left' | 'right') => void;
  openDialogue: (npcId: string) => void;
  selectDialogueChoice: (choiceIndex: number) => void;
  closeDialogue: () => void;
  openOverlay: (overlay: OverlayType, tab?: PhoneTabType) => void;
  closeOverlay: () => void;
  setPhoneTab: (tab: PhoneTabType) => void;
  executeTrade: (symbol: AssetSymbol, side: PositionSide, quantity: number, isCoverOrSell?: boolean) => { success: boolean; message: string };
  setHypothesis: (hypothesis: Hypothesis) => void;
  respondToInvitation: (invitationId: string, accept: boolean) => void;
  attendParty: (invitationId: string) => void;
  advanceMinutes: (minutes: number) => void;
  endDayAndSleep: () => void;
  continueToNextDay: () => void;
  restartGame: () => void;
  dismissToast: (id: string) => void;
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'alert') => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  isStarted: false,
  day: 1,
  totalDays: 5,
  currentTimeMinutes: 9 * 60, // 9:00 AM
  isGameOver: false,

  player: {
    x: 170, // Starts inside Apartment
    y: 150,
    cash: 100000,
    reputation: 10,
    currentLocationId: 'apartment',
    facing: 'down',
  },
  startingNetWorth: 100000,

  assets: INITIAL_ASSETS,
  portfolio: [],
  todayHypothesis: null,
  hypothesesHistory: [],

  employees: EMPLOYEES,
  npcs: NPCS,
  discoveredIntel: [],
  messages: [
    {
      id: 'msg_init_maya',
      sender: 'Maya Shah',
      role: 'Macro Trader',
      time: '08:45 AM',
      text: 'Boss, something feels huge with CHPX this morning. Walk over to the office before making any bets!',
      unread: true,
    },
    {
      id: 'msg_init_daniel',
      sender: 'Daniel Wong',
      role: 'Research Analyst',
      time: '08:50 AM',
      text: "I'm digging through CHPX supply manifests right now. Don't trust the headline press release.",
      unread: true,
    },
  ],
  invitations: [],

  currentEvent: MARKET_EVENTS[0],
  upcomingEvents: MARKET_EVENTS.slice(1),
  dayHistory: [],

  activeOverlay: null,
  phoneTab: 'news',
  activeNpcId: null,
  dialogueHistory: [],
  daySummary: null,
  showWeekSummary: false,
  toasts: [],
  tutorialStep: 1,
  tutorialHint: 'Check the Morning News on your Phone (or press P), then head to the Office to talk to Maya & Daniel.',

  startGame: () => {
    sound.playNotification();
    set({
      isStarted: true,
      toasts: [
        {
          id: 'welcome',
          title: 'Day 1 Has Begun',
          message: 'Wake up, check news, walk to your office, investigate and trade!',
          type: 'info',
        },
      ],
    });
  },

  movePlayer: (x, y, facing) => {
    // Check which location player is inside
    let currentLocationId: LocationId = 'financial_district';
    for (const loc of LOCATIONS) {
      if (
        x >= loc.bounds.x &&
        x <= loc.bounds.x + loc.bounds.width &&
        y >= loc.bounds.y &&
        y <= loc.bounds.y + loc.bounds.height
      ) {
        currentLocationId = loc.id;
        break;
      }
    }

    set(state => ({
      player: {
        ...state.player,
        x,
        y,
        facing,
        currentLocationId,
      },
    }));
  },

  openDialogue: (npcId) => {
    const { npcs, currentEvent } = get();
    const npc = npcs.find(n => n.id === npcId);
    if (!npc) return;

    sound.playClick();
    const eventDialogue = npc.dialogueByEventId[currentEvent.id] || npc.defaultDialogue;

    set({
      activeNpcId: npcId,
      activeOverlay: 'dialogue',
      dialogueHistory: [
        { speaker: npc.name, text: eventDialogue.greeting, isPlayer: false },
      ],
      tutorialHint: 'Ask questions to gather information, then check your Intel Notebook.',
    });
  },

  selectDialogueChoice: (choiceIndex) => {
    const { activeNpcId, npcs, currentEvent, currentTimeMinutes, discoveredIntel } = get();
    if (!activeNpcId) return;

    const npc = npcs.find(n => n.id === activeNpcId);
    if (!npc) return;

    const eventDialogue = npc.dialogueByEventId[currentEvent.id] || npc.defaultDialogue;
    const choice = eventDialogue.choices[choiceIndex];
    if (!choice) return;

    sound.playClick();

    // Advance time (e.g. 30 mins)
    const cost = choice.requiresTimeMinutes ?? 30;
    const newTime = advanceTime(currentTimeMinutes, cost);

    // Save discovered intel if provided
    let newIntelList = [...discoveredIntel];
    if (choice.intel && !discoveredIntel.some(item => item.id === choice.intel!.id)) {
      newIntelList = [choice.intel, ...discoveredIntel];
      sound.playNotification();
    }

    set(state => ({
      currentTimeMinutes: newTime,
      discoveredIntel: newIntelList,
      dialogueHistory: [
        ...state.dialogueHistory,
        { speaker: 'You', text: choice.text, isPlayer: true },
        { speaker: npc.name, text: choice.response, isPlayer: false },
      ],
      tutorialHint: 'Conflicting opinions gathered! Form a hypothesis at your Trading Terminal.',
    }));
  },

  closeDialogue: () => {
    sound.playClick();
    set({
      activeNpcId: null,
      activeOverlay: null,
    });
  },

  openOverlay: (overlay, tab) => {
    sound.playClick();
    set({
      activeOverlay: overlay,
      phoneTab: tab ?? 'news',
    });
  },

  closeOverlay: () => {
    sound.playClick();
    set({ activeOverlay: null });
  },

  setPhoneTab: (tab) => {
    sound.playClick();
    set({ phoneTab: tab });
  },

  executeTrade: (symbol, side, quantity, isCoverOrSell = false) => {
    const { assets, player, portfolio, currentTimeMinutes } = get();
    const asset = assets.find(a => a.symbol === symbol);
    if (!asset) return { success: false, message: 'Invalid asset.' };

    if (quantity <= 0 || isNaN(quantity)) {
      sound.playError();
      return { success: false, message: 'Please enter a valid quantity.' };
    }

    const tradeCost = Math.round(quantity * asset.price * 100) / 100;
    const existingIndex = portfolio.findIndex(p => p.symbol === symbol && p.side === side);
    const existingPos = portfolio[existingIndex];

    if (isCoverOrSell) {
      // Selling long OR covering short
      if (!existingPos) {
        sound.playError();
        return { success: false, message: `No active ${side} position to close.` };
      }
      if (quantity > existingPos.quantity) {
        sound.playError();
        return { success: false, message: `Cannot close more than owned ${existingPos.quantity} units.` };
      }

      // Calculate realized P&L
      const pnl = calculatePositionPnL(
        { ...existingPos, quantity },
        asset.price
      );

      // Settle cash:
      // If long: cash back = quantity * currentPrice
      // If short: cash back = collateral (quantity * entryPrice) + pnl
      const returnedCash = side === 'LONG'
        ? quantity * asset.price
        : quantity * existingPos.entryPrice + pnl;

      const newCash = Math.round((player.cash + returnedCash) * 100) / 100;
      let newPortfolio = [...portfolio];

      if (quantity === existingPos.quantity) {
        newPortfolio.splice(existingIndex, 1);
      } else {
        newPortfolio[existingIndex] = {
          ...existingPos,
          quantity: existingPos.quantity - quantity,
        };
      }

      sound.playTrade();
      const newTime = advanceTime(currentTimeMinutes, 15);

      set(state => ({
        player: { ...state.player, cash: newCash },
        portfolio: newPortfolio,
        currentTimeMinutes: newTime,
        tutorialHint: 'Trade closed! Walk back to your Apartment and select SLEEP to settle the day.',
      }));

      return {
        success: true,
        message: `Successfully closed ${quantity} shares of ${symbol} (${pnl >= 0 ? '+$' : '-$'}${Math.abs(Math.round(pnl))}).`,
      };
    } else {
      // Opening or adding to LONG or SHORT
      // For both BUY and SHORT, player needs cash collateral
      if (tradeCost > player.cash) {
        sound.playError();
        return {
          success: false,
          message: `Insufficient cash. Need $${tradeCost.toLocaleString()} but only have $${player.cash.toLocaleString()}.`,
        };
      }

      const newCash = Math.round((player.cash - tradeCost) * 100) / 100;
      let newPortfolio = [...portfolio];

      if (existingPos) {
        // Average entry price
        const totalShares = existingPos.quantity + quantity;
        const avgEntry = (existingPos.quantity * existingPos.entryPrice + tradeCost) / totalShares;
        newPortfolio[existingIndex] = {
          ...existingPos,
          quantity: totalShares,
          entryPrice: Math.round(avgEntry * 100) / 100,
        };
      } else {
        newPortfolio.push({
          symbol,
          quantity,
          side,
          entryPrice: asset.price,
        });
      }

      sound.playTrade();
      const newTime = advanceTime(currentTimeMinutes, 15);

      set(state => ({
        player: { ...state.player, cash: newCash },
        portfolio: newPortfolio,
        currentTimeMinutes: newTime,
        tutorialHint: 'Trade executed! Head to your Apartment to Sleep and see market consequences.',
      }));

      return {
        success: true,
        message: `Trade executed: ${side} ${quantity} ${symbol} @ $${asset.price.toFixed(2)}.`,
      };
    }
  },

  setHypothesis: (hypothesis) => {
    sound.playClick();
    set({
      todayHypothesis: hypothesis,
      tutorialHint: 'Hypothesis confirmed. Make sure your trade aligns with your thesis!',
    });
  },

  respondToInvitation: (invitationId, accept) => {
    sound.playClick();
    set(state => ({
      invitations: state.invitations.map(inv =>
        inv.id === invitationId
          ? { ...inv, accepted: accept, declined: !accept }
          : inv
      ),
    }));
  },

  attendParty: (invitationId) => {
    const { currentTimeMinutes, player } = get();
    sound.playNotification();
    const newTime = advanceTime(currentTimeMinutes, 120); // +2 hours

    set(state => ({
      currentTimeMinutes: newTime,
      player: {
        ...player,
        x: 800,
        y: 280,
        currentLocationId: 'club',
      },
      invitations: state.invitations.map(inv =>
        inv.id === invitationId ? { ...inv, attended: true } : inv
      ),
      activeOverlay: null,
      tutorialHint: 'You arrived at the VIP Club Party! Talk to Victor, Emma, and Marcus for insider scoops.',
    }));
  },

  advanceMinutes: (minutes) => {
    const { currentTimeMinutes } = get();
    const newTime = advanceTime(currentTimeMinutes, minutes);
    set({ currentTimeMinutes: newTime });
  },

  endDayAndSleep: () => {
    const {
      day,
      totalDays,
      currentEvent,
      assets,
      portfolio,
      player,
      todayHypothesis,
      hypothesesHistory,
      upcomingEvents,
      dayHistory,
    } = get();

    // 1. Apply market event impacts
    const { updatedAssets, priceChanges } = applyMarketEventImpact(
      assets,
      currentEvent.trueImpact
    );

    // 2. Compute portfolio P&L
    const startingNW = player.cash + calculateTotalPortfolioValue(portfolio, assets).marketValue;
    const endingNW = calculateNetWorth(player.cash, portfolio, updatedAssets);
    const dayProfit = Math.round((endingNW - startingNW) * 100) / 100;

    // 3. Evaluate hypothesis
    let hypothesisCorrect: boolean | undefined = undefined;
    let reputationDelta = 0;

    if (todayHypothesis) {
      const change = priceChanges.find(p => p.symbol === todayHypothesis.asset);
      if (change) {
        if (
          (todayHypothesis.direction === 'RISE' && change.changePercent > 0) ||
          (todayHypothesis.direction === 'FALL' && change.changePercent < 0)
        ) {
          hypothesisCorrect = true;
          reputationDelta += 2; // Correct major prediction +2
        } else {
          hypothesisCorrect = false;
          reputationDelta -= 1;
        }
      }
    }

    // Additional reputation from P&L
    if (dayProfit > 5000) {
      reputationDelta += 1;
    } else if (dayProfit < -5000) {
      reputationDelta -= 1;
    }

    const newReputation = Math.max(1, player.reputation + reputationDelta);

    // 4. Employee reactions
    const mayaMood = dayProfit >= 0 ? 'impressed' : 'concerned';
    const danielMood = (hypothesisCorrect ?? dayProfit >= 0) ? 'happy' : 'neutral';

    const employeeReactions = [
      {
        employeeName: 'Maya Shah',
        mood: mayaMood as 'impressed' | 'concerned',
        comment:
          dayProfit >= 0
            ? "Tremendous trading, boss! We pressed our advantage and caught the market on the right foot."
            : "Tough tape today. But that's the cost of doing business. Tomorrow we hit them twice as hard.",
      },
      {
        employeeName: 'Daniel Wong',
        mood: danielMood as 'happy' | 'neutral',
        comment:
          hypothesisCorrect
            ? "Our research thesis was proven out mathematically. Disciplined capital allocation wins every time."
            : "The volatility skew diverged from fundamentals. We should tighten position sizing tomorrow.",
      },
    ];

    const result: DayResult = {
      day,
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
      startingNetWorth: Math.round(startingNW),
      endingNetWorth: Math.round(endingNW),
      dayProfit,
      priceChanges,
      tradesMade: portfolio.length,
      reputationChange: reputationDelta,
      hypothesis: todayHypothesis ?? undefined,
      hypothesisCorrect,
      employeeReactions,
    };

    if (dayProfit >= 0) {
      sound.playProfitFanfare();
    } else {
      sound.playNotification();
    }

    set({
      daySummary: result,
      dayHistory: [...dayHistory, result],
      assets: updatedAssets,
      player: {
        ...player,
        reputation: newReputation,
      },
      hypothesesHistory: todayHypothesis
        ? [...hypothesesHistory, { day, hypothesis: todayHypothesis, wasCorrect: hypothesisCorrect ?? false }]
        : hypothesesHistory,
    });
  },

  continueToNextDay: () => {
    const { day, totalDays, upcomingEvents, player } = get();

    if (day >= totalDays) {
      sound.playProfitFanfare();
      set({
        daySummary: null,
        showWeekSummary: true,
      });
      return;
    }

    const nextDay = day + 1;
    const nextEvent = upcomingEvents[0] || MARKET_EVENTS[(nextDay - 1) % MARKET_EVENTS.length];
    const remainingEvents = upcomingEvents.slice(1);

    // Generate new day invitation (e.g. Victor party at Club on Day 2 or 3)
    const newInvitations: Invitation[] = [];
    if (nextDay === 2 || nextDay === 4) {
      newInvitations.push({
        id: `invitation_day_${nextDay}`,
        fromName: 'Victor Vance',
        title: 'Private Investor Dinner & Wine Reception',
        locationId: 'club',
        timeString: '8:00 PM',
        day: nextDay,
        accepted: false,
        declined: false,
        attended: false,
        description: 'Join top institutional asset managers and tech executives at The Sovereign Club.',
      });
    }

    sound.playNotification();

    set({
      day: nextDay,
      currentTimeMinutes: 9 * 60, // Reset to 9:00 AM
      currentEvent: nextEvent,
      upcomingEvents: remainingEvents,
      todayHypothesis: null,
      daySummary: null,
      activeOverlay: null,
      player: {
        ...player,
        x: 170, // Wake up in apartment
        y: 150,
        currentLocationId: 'apartment',
        facing: 'down',
      },
      invitations: newInvitations,
      messages: [
        {
          id: `msg_day_${nextDay}_morning`,
          sender: 'Morning Financial Wire',
          time: '08:00 AM',
          text: `DAY ${nextDay} BULLETIN: ${nextEvent.title}. ${nextEvent.publicNews[0]?.headline || ''}`,
          unread: true,
        },
      ],
      tutorialHint: `Day ${nextDay} begins! Review the new breaking news, speak to your team, and construct your thesis.`,
    });
  },

  restartGame: () => {
    // Shuffle events for exciting replayability
    const shuffled = [...MARKET_EVENTS].sort(() => Math.random() - 0.5);
    sound.playClick();

    set({
      isStarted: true,
      day: 1,
      totalDays: 5,
      currentTimeMinutes: 9 * 60,
      isGameOver: false,
      player: {
        x: 170,
        y: 150,
        cash: 100000,
        reputation: 10,
        currentLocationId: 'apartment',
        facing: 'down',
      },
      startingNetWorth: 100000,
      assets: INITIAL_ASSETS,
      portfolio: [],
      todayHypothesis: null,
      hypothesesHistory: [],
      discoveredIntel: [],
      messages: [
        {
          id: 'msg_restart_maya',
          sender: 'Maya Shah',
          role: 'Macro Trader',
          time: '08:45 AM',
          text: 'Fresh week, fresh alpha! Let us build Apex Capital into a juggernaut.',
          unread: true,
        },
      ],
      invitations: [],
      currentEvent: shuffled[0],
      upcomingEvents: shuffled.slice(1),
      dayHistory: [],
      activeOverlay: null,
      daySummary: null,
      showWeekSummary: false,
      tutorialHint: 'Day 1 started! Walk to the Office and interview Maya and Daniel.',
    });
  },

  dismissToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },

  addToast: (title, message, type = 'info') => {
    sound.playNotification();
    const id = `toast_${Date.now()}`;
    set(state => ({
      toasts: [...state.toasts, { id, title, message, type }],
    }));
    setTimeout(() => {
      get().dismissToast(id);
    }, 4000);
  },
}));
