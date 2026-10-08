export type AssetSymbol = 'CHPX' | 'OILA' | 'BNKR' | 'TECH' | 'ENRG';

export interface Asset {
  symbol: AssetSymbol;
  name: string;
  price: number;
  previousPrice: number;
  sector: string;
  history: number[]; // Price history for charts
}

export type PositionSide = 'LONG' | 'SHORT';

export interface Position {
  symbol: AssetSymbol;
  quantity: number;
  side: PositionSide;
  entryPrice: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  trading: number;
  research: number;
  risk: number;
  loyalty: number;
  personality: string;
  style: string;
  avatarColor: string;
}

export interface DialogueChoice {
  text: string;
  response: string;
  intel?: DiscoveredIntel;
  requiresTimeMinutes?: number;
}

export interface Dialogue {
  greeting: string;
  choices: DialogueChoice[];
}

export interface DiscoveredIntel {
  id: string;
  tier: 'Public' | 'Analyst' | 'Rumor' | 'Insider';
  sourceName: string;
  content: string;
  assetAffected?: AssetSymbol;
  timestamp: string;
  trustworthinessScore?: 'High' | 'Medium' | 'Low' | 'Speculative';
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  locationId: LocationId;
  personality: string;
  trustworthiness: number; // 0 to 100
  color: string;
  x: number;
  y: number;
  dialogueByEventId: Record<string, Dialogue>;
  defaultDialogue: Dialogue;
}

export type LocationId = 'apartment' | 'office' | 'financial_district' | 'cafe' | 'club';

export interface LocationInfo {
  id: LocationId;
  name: string;
  description: string;
  bounds: { x: number; y: number; width: number; height: number };
  door: { x: number; y: number };
  color: string;
  labelX: number;
  labelY: number;
}

export interface MarketImpact {
  [symbol: string]: number; // Percentage, e.g. -18 for -18%
}

export interface MarketEvent {
  id: string;
  dayIndex: number;
  title: string;
  description: string;
  publicNews: {
    time: string;
    headline: string;
    body: string;
    category: 'BREAKING' | 'MARKETS' | 'ANALYSIS' | 'MACRO';
  }[];
  affectedAssets: AssetSymbol[];
  trueImpact: MarketImpact;
  publicInformation: string;
  analystInformation: { employeeId: string; statement: string; leaning: 'BULLISH' | 'BEARISH' | 'NEUTRAL' }[];
  rumorInformation: { npcId: string; rumor: string; isAccurate: boolean }[];
  insiderInformation?: { npcId: string; tip: string; isAccurate: boolean };
}

export interface Hypothesis {
  asset: AssetSymbol;
  direction: 'RISE' | 'FALL';
  reason: string;
  confidence: number; // 50 to 100
}

export interface DayResult {
  day: number;
  eventId: string;
  eventTitle: string;
  startingNetWorth: number;
  endingNetWorth: number;
  dayProfit: number;
  priceChanges: { symbol: AssetSymbol; from: number; to: number; changePercent: number }[];
  tradesMade: number;
  reputationChange: number;
  hypothesis?: Hypothesis;
  hypothesisCorrect?: boolean;
  employeeReactions: { employeeName: string; comment: string; mood: 'happy' | 'impressed' | 'concerned' | 'neutral' }[];
}

export interface Message {
  id: string;
  sender: string;
  role?: string;
  time: string;
  text: string;
  unread: boolean;
}

export interface Invitation {
  id: string;
  fromName: string;
  title: string;
  locationId: LocationId;
  timeString: string;
  day: number;
  accepted: boolean;
  declined: boolean;
  attended: boolean;
  description: string;
}

export interface PlayerState {
  x: number;
  y: number;
  cash: number;
  reputation: number;
  currentLocationId: LocationId;
  facing: 'up' | 'down' | 'left' | 'right';
}
