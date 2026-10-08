import { NPC, Employee, LocationInfo } from '../types/game';

export const EMPLOYEES: Employee[] = [
  {
    id: 'maya',
    name: 'Maya Shah',
    role: 'Macro Trader',
    trading: 82,
    research: 70,
    risk: 65,
    loyalty: 75,
    personality: 'Confident, aggressive, optimistic',
    style: "I think the market is underestimating this. Let's take a larger position and capitalize on momentum!",
    avatarColor: '#f59e0b', // Amber
  },
  {
    id: 'daniel',
    name: 'Daniel Wong',
    role: 'Research Analyst',
    trading: 60,
    research: 88,
    risk: 40,
    loyalty: 80,
    personality: 'Analytical, cautious, skeptical',
    style: "The evidence isn't strong enough yet. Let's manage downside risk and avoid reckless exposure.",
    avatarColor: '#3b82f6', // Blue
  },
];

export const LOCATIONS: LocationInfo[] = [
  {
    id: 'apartment',
    name: 'Your Apartment',
    description: 'A modest studio overlooking the financial skyline. Review your ledger and sleep here to conclude the trading day.',
    bounds: { x: 50, y: 50, width: 240, height: 200 },
    door: { x: 170, y: 250 },
    color: '#1e293b',
    labelX: 170,
    labelY: 70,
  },
  {
    id: 'office',
    name: 'Apex Capital Office',
    description: 'Your boutique fund headquarters. Maya and Daniel work here analyzing markets and risk.',
    bounds: { x: 370, y: 50, width: 280, height: 200 },
    door: { x: 510, y: 250 },
    color: '#0f172a',
    labelX: 510,
    labelY: 70,
  },
  {
    id: 'cafe',
    name: 'Greenback Espresso Cafe',
    description: 'A bustling coffeehouse where brokers, journalists, and traders exchange gossip and rumors.',
    bounds: { x: 50, y: 340, width: 240, height: 210 },
    door: { x: 170, y: 340 },
    color: '#292524',
    labelX: 170,
    labelY: 360,
  },
  {
    id: 'financial_district',
    name: 'Stock Exchange Plaza',
    description: 'The monumental core of Wall Street with the stock exchange, banking towers, and news feeds.',
    bounds: { x: 370, y: 340, width: 280, height: 210 },
    door: { x: 510, y: 340 },
    color: '#1e1b4b',
    labelX: 510,
    labelY: 360,
  },
  {
    id: 'club',
    name: 'The Sovereign Club',
    description: 'An exclusive private lounge for fund titans, tech executives, and high-net-worth investors.',
    bounds: { x: 720, y: 180, width: 250, height: 260 },
    door: { x: 720, y: 310 },
    color: '#31102f',
    labelX: 845,
    labelY: 200,
  },
];

export const NPCS: NPC[] = [
  // Apex Capital Office NPCs
  {
    id: 'maya',
    name: 'Maya Shah',
    role: 'Macro Trader (Apex Capital)',
    locationId: 'office',
    personality: 'Aggressive & Momentum-Driven',
    trustworthiness: 75,
    color: '#f59e0b',
    x: 440,
    y: 130,
    defaultDialogue: {
      greeting: "Boss! The tape is moving fast. What's on your mind?",
      choices: [
        {
          text: "What's your read on the market today?",
          response: "Momentum is everything. If the crowd is leaning one way, the real money is in catching the breakout!",
        },
        {
          text: "Should we play it safe today?",
          response: "Safe? We didn't launch Apex Capital to earn bank deposit interest! Fortune favors the bold.",
        },
        {
          text: "I'll review the terminal.",
          response: "Give me the word and I'll execute with size.",
        },
      ],
    },
    dialogueByEventId: {
      semiconductor_shutdown: {
        greeting: "I've been watching CHPX all morning. The market is overreacting to the Dresden news!",
        choices: [
          {
            text: "Do you think CHPX will bounce back?",
            response: "Absolutely. Buyers will scramble to hoard chips before prices climb. Panic dips are made for buying!",
            intel: {
              id: 'intel_maya_chpx_bull',
              tier: 'Analyst',
              sourceName: 'Maya Shah',
              content: "Maya believes CHPX will rally because buyers will bid up existing supply in a panic hoard.",
              assetAffected: 'CHPX',
              timestamp: '09:30 AM',
              trustworthinessScore: 'Medium',
            },
            requiresTimeMinutes: 30,
          },
          {
            text: "What about the damage to their factory?",
            response: "Insurance covers it, and Dresden is only one facility. The media loves doom headlines.",
            requiresTimeMinutes: 30,
          },
        ],
      },
      oil_supply_disruption: {
        greeting: "Did you see crude oil futures? The pipeline attack caught everyone flat-footed!",
        choices: [
          {
            text: "Should we buy OILA?",
            response: "Load the boat! Energy supply disruptions persist for weeks. OILA and ENRG are textbook long setups.",
            intel: {
              id: 'intel_maya_oila_bull',
              tier: 'Analyst',
              sourceName: 'Maya Shah',
              content: "Maya insists going long on OILA and ENRG is the highest conviction trade of the week.",
              assetAffected: 'OILA',
              timestamp: '09:30 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      banking_stress: {
        greeting: "Everyone is dumping financial stocks. But banks are the backbone of the economy!",
        choices: [
          {
            text: "Are you thinking about buying BNKR?",
            response: "Central bankers won't allow a systemic crash. As soon as a liquidity backstop is announced, BNKR will rocket.",
            intel: {
              id: 'intel_maya_bnkr_trap',
              tier: 'Analyst',
              sourceName: 'Maya Shah',
              content: "Maya believes BNKR is a bargain and expects a swift regulatory bailout rally.",
              assetAffected: 'BNKR',
              timestamp: '09:30 AM',
              trustworthinessScore: 'Low',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      tech_boom: {
        greeting: "This AI model release is insane! Enterprise cloud computing will never be the same.",
        choices: [
          {
            text: "Is TECH the trade of the day?",
            response: "Without question! TECH and CHPX are primed for an explosive expansion. Don't fight the future!",
            intel: {
              id: 'intel_maya_tech_boom',
              tier: 'Analyst',
              sourceName: 'Maya Shah',
              content: "Maya urges aggressive long positioning in TECH and CHPX on generational AI demand.",
              assetAffected: 'TECH',
              timestamp: '09:30 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },
  {
    id: 'daniel',
    name: 'Daniel Wong',
    role: 'Research Analyst (Apex Capital)',
    locationId: 'office',
    personality: 'Skeptical & Quantitative',
    trustworthiness: 88,
    color: '#3b82f6',
    x: 580,
    y: 130,
    defaultDialogue: {
      greeting: "Hello. I've been running the sensitivity models. What do you need?",
      choices: [
        {
          text: "What does the data say?",
          response: "Numbers don't lie, but traders often deceive themselves. Always verify before taking size.",
        },
        {
          text: "Should we trust market rumors?",
          response: "Almost never without verifying secondary balance sheets and trade manifests.",
        },
        {
          text: "Keep monitoring the tape.",
          response: "Will do. I will update you as soon as anomalies appear.",
        },
      ],
    },
    dialogueByEventId: {
      semiconductor_shutdown: {
        greeting: "I analyzed CHPX's supplier filings. The situation in Dresden is far worse than management admitted.",
        choices: [
          {
            text: "What did you discover in the numbers?",
            response: "Their warehouse inventory is only 10 days of orders. They cannot fulfill quarterly delivery commitments. CHPX is going to plunge.",
            intel: {
              id: 'intel_daniel_chpx_bear',
              tier: 'Analyst',
              sourceName: 'Daniel Wong',
              content: "Daniel's research proves CHPX only has 10 days of buffer stock. Urges shorting CHPX.",
              assetAffected: 'CHPX',
              timestamp: '09:45 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
          {
            text: "Maya thinks buyers will bid it up.",
            response: "Maya trades emotions; I trade balance sheets. When guidance is cut, the stock drops 15% or more.",
            requiresTimeMinutes: 30,
          },
        ],
      },
      oil_supply_disruption: {
        greeting: "I examined the pipeline transit manifests. The outage removes 1.8M barrels/day from active circulation.",
        choices: [
          {
            text: "How will this hit other sectors?",
            response: "OILA will surge, and ENRG alternatives will see spillover capital. But high energy costs will pinch software margins like TECH.",
            intel: {
              id: 'intel_daniel_oila_macro',
              tier: 'Analyst',
              sourceName: 'Daniel Wong',
              content: "Daniel confirms 1.8M bpd deficit. OILA will gain significantly; TECH cloud margins may shrink.",
              assetAffected: 'OILA',
              timestamp: '09:45 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      banking_stress: {
        greeting: "The interbank repo spread blew out 45 bps this morning. BNKR has severe duration mismatch.",
        choices: [
          {
            text: "Is BNKR facing a solvency issue?",
            response: "Their held-to-maturity bond book is under water. If deposits flee, they will suffer massive losses. Short BNKR.",
            intel: {
              id: 'intel_daniel_bnkr_short',
              tier: 'Analyst',
              sourceName: 'Daniel Wong',
              content: "Daniel warns BNKR has toxic unrealized bond losses. High probability of sharp selloff.",
              assetAffected: 'BNKR',
              timestamp: '09:45 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      tech_boom: {
        greeting: "I validated the benchmark claims for the new enterprise AI architecture.",
        choices: [
          {
            text: "Are the enterprise revenue estimates real?",
            response: "Yes. In this case the hype is backed by contractual hardware bookings. TECH and CHPX are legitimate long targets.",
            intel: {
              id: 'intel_daniel_tech_valid',
              tier: 'Analyst',
              sourceName: 'Daniel Wong',
              content: "Daniel verified corporate orders for TECH. Validates long positions.",
              assetAffected: 'TECH',
              timestamp: '09:45 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },

  // Cafe NPCs
  {
    id: 'sam_cafe',
    name: 'Sam',
    role: 'Day Trader (Cafe Regular)',
    locationId: 'cafe',
    personality: 'Impulsive & Rumor-Obsessed',
    trustworthiness: 40,
    color: '#10b981', // Green
    x: 110,
    y: 430,
    defaultDialogue: {
      greeting: "Hey! Just sipping a triple espresso and watching the tickers. Got any hot tips?",
      choices: [
        {
          text: "What are people saying today?",
          response: "Everyone at this cafe has a theory! Half of them are broke, but the vibes are electric.",
        },
        {
          text: "How's your portfolio doing?",
          response: "Down 40% on Monday, up 50% on Tuesday. That's the life!",
        },
      ],
    },
    dialogueByEventId: {
      semiconductor_shutdown: {
        greeting: "Yo! You hear about CHPX? My buddy's cousin works logistics in Germany!",
        choices: [
          {
            text: "What did your buddy's cousin say?",
            response: "He said the cleanrooms are completely charred. The company won't be shipping silicon wafers for at least three months!",
            intel: {
              id: 'intel_sam_chpx_cleanroom',
              tier: 'Rumor',
              sourceName: 'Sam (Cafe)',
              content: "Rumor from a logistics worker: CHPX wafer cleanrooms suffered catastrophic damage, shutdown will be prolonged.",
              assetAffected: 'CHPX',
              timestamp: '10:30 AM',
              trustworthinessScore: 'Medium',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      banking_stress: {
        greeting: "Man, people are panicking over BNKR. But check this out—I heard the CEO bought $2M in shares today!",
        choices: [
          {
            text: "Did the CEO really buy shares?",
            response: "Saw it on my trading Discord! Guaranteed to double when market opens. (Warning: It was actually a pre-scheduled vesting).",
            intel: {
              id: 'intel_sam_bnkr_fake',
              tier: 'Rumor',
              sourceName: 'Sam (Cafe)',
              content: "Rumor claims BNKR CEO bought $2M shares. (Might be unverified Discord gossip).",
              assetAffected: 'BNKR',
              timestamp: '10:30 AM',
              trustworthinessScore: 'Speculative',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },
  {
    id: 'priya_cafe',
    name: 'Priya',
    role: 'Financial Investigative Journalist',
    locationId: 'cafe',
    personality: 'Inquisitive & Well-Connected',
    trustworthiness: 78,
    color: '#a855f7', // Purple
    x: 210,
    y: 440,
    defaultDialogue: {
      greeting: "Good morning. I'm finishing a column for the Financial Chronicle. Off the record?",
      choices: [
        {
          text: "What stories are moving the street?",
          response: "Follow the regulatory paper trail and corporate filings, not the press releases.",
        },
      ],
    },
    dialogueByEventId: {
      semiconductor_shutdown: {
        greeting: "I was just on the phone with three hardware procurement chiefs about CHPX.",
        choices: [
          {
            text: "What are equipment buyers saying?",
            response: "They are furiously reallocating purchase orders to competing foundries. CHPX is bleeding market share by the hour.",
            intel: {
              id: 'intel_priya_chpx_procure',
              tier: 'Rumor',
              sourceName: 'Priya (Journalist)',
              content: "Procurement chiefs confirm major clients are cancelling purchase orders with CHPX.",
              assetAffected: 'CHPX',
              timestamp: '11:00 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      tech_regulation: {
        greeting: "My sources at the antitrust division sent me a heads up. This lawsuit has teeth.",
        choices: [
          {
            text: "How serious is the tech antitrust action?",
            response: "They have internal emails showing deliberate anti-competitive pricing. Institutional investors will dump TECH before midday.",
            intel: {
              id: 'intel_priya_tech_reg',
              tier: 'Rumor',
              sourceName: 'Priya (Journalist)',
              content: "DOJ holds damning internal communications. TECH faces severe legal discount.",
              assetAffected: 'TECH',
              timestamp: '11:00 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },

  // Financial District NPCs
  {
    id: 'robert_bank',
    name: 'Robert',
    role: 'Commercial Lending VP',
    locationId: 'financial_district',
    personality: 'Conservative & Institutional',
    trustworthiness: 82,
    color: '#06b6d4', // Cyan
    x: 430,
    y: 440,
    defaultDialogue: {
      greeting: "Apex Capital, correct? Busy day on the exchange floor.",
      choices: [
        {
          text: "How are lending flows looking?",
          response: "Credit is the lifeblood of the market. When lenders tighten, equity markets inevitably shudder.",
        },
      ],
    },
    dialogueByEventId: {
      oil_supply_disruption: {
        greeting: "Our commodity financing desk just cleared massive letters of credit for crude shipments.",
        choices: [
          {
            text: "Are refiners paying whatever it takes for oil?",
            response: "Yes. Big refiners are desperate for immediate physical delivery. OILA is in an extraordinary position of strength.",
            intel: {
              id: 'intel_robert_oila_flows',
              tier: 'Analyst',
              sourceName: 'Robert (Bank VP)',
              content: "Bank letters of credit confirm refiners are bidding unprecedented premiums for physical crude (OILA).",
              assetAffected: 'OILA',
              timestamp: '11:30 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      energy_breakthrough: {
        greeting: "Our sustainability underwriting group just issued a memorandum on renewable capital allocations.",
        choices: [
          {
            text: "Are debt syndicates pivoting to clean energy?",
            response: "Capital is rotating rapidly. We are trimming hydrocarbon loan facilities and pouring credit into ENRG projects.",
            intel: {
              id: 'intel_robert_enrg_realloc',
              tier: 'Analyst',
              sourceName: 'Robert (Bank VP)',
              content: "Commercial debt desks are redirecting capital away from oil into renewable infrastructure (ENRG).",
              assetAffected: 'ENRG',
              timestamp: '11:30 AM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },
  {
    id: 'lisa_district',
    name: 'Lisa',
    role: 'Junior Exchange Specialist',
    locationId: 'financial_district',
    personality: 'Fast-Talking & Observant',
    trustworthiness: 65,
    color: '#ec4899', // Pink
    x: 570,
    y: 440,
    defaultDialogue: {
      greeting: "Hey! Orders are pouring into the order book at 500,000 shares a second today.",
      choices: [
        {
          text: "What looks unusual on the tape?",
          response: "Watch the market depth. Large dark pool prints tell you where the smart money is really hiding.",
        },
      ],
    },
    dialogueByEventId: {
      banking_stress: {
        greeting: "The order book for BNKR is completely dry. Bid support has evaporated.",
        choices: [
          {
            text: "Is anyone supporting bank bids?",
            response: "No major market makers want to step in front of the selling train. If bids are this thin, BNKR drops like a stone.",
            intel: {
              id: 'intel_lisa_bnkr_depth',
              tier: 'Rumor',
              sourceName: 'Lisa (Exchange Specialist)',
              content: "Exchange floor order book shows institutional bid support for BNKR has completely evaporated.",
              assetAffected: 'BNKR',
              timestamp: '12:00 PM',
              trustworthinessScore: 'Medium',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },

  // Private Club NPCs
  {
    id: 'victor_club',
    name: 'Victor Vance',
    role: 'Senior Hedge Fund Titan',
    locationId: 'club',
    personality: 'Cynical, Ruthless, Ultra-Wealthy',
    trustworthiness: 85,
    color: '#e11d48', // Red
    x: 800,
    y: 280,
    defaultDialogue: {
      greeting: "Ah, the new face from Apex Capital. Let's see if you have the stomach for real risk.",
      choices: [
        {
          text: "What makes a great fund manager, Victor?",
          response: "Never falling in love with a position. When the thesis dies, you execute the trade without mercy.",
        },
      ],
    },
    dialogueByEventId: {
      semiconductor_shutdown: {
        greeting: "Between you and me, I had dinner last night with CHPX's lead institutional underwriter.",
        choices: [
          {
            text: "What did the underwriter share with you?",
            response: "They are quietly staging an emergency secondary offering because operating cash flow will turn negative. We are aggressively short.",
            intel: {
              id: 'intel_victor_chpx_insider',
              tier: 'Insider',
              sourceName: 'Victor Vance (Titan)',
              content: "Victor's syndicate dinner reveals CHPX faces negative cash flow and emergency dilutive financing. Short CHPX.",
              assetAffected: 'CHPX',
              timestamp: '02:00 PM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      banking_stress: {
        greeting: "We moved $300M out of BNKR custody accounts yesterday. A bank run is already underway behind closed doors.",
        choices: [
          {
            text: "Is BNKR really that close to the brink?",
            response: "The big accounts always leave first. The retail public finds out 48 hours later. Short it while you still can.",
            intel: {
              id: 'intel_victor_bnkr_run',
              tier: 'Insider',
              sourceName: 'Victor Vance (Titan)',
              content: "Mega-funds pulled $300M+ from BNKR custody accounts. Forced fire-sale imminent.",
              assetAffected: 'BNKR',
              timestamp: '02:00 PM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      recession_fear: {
        greeting: "We have taken down risk across all books. The global economy is slowing far faster than consensus admits.",
        choices: [
          {
            text: "What is your fund's posture right now?",
            response: "60% cash, heavy short equity index derivatives. Stay cautious, protect capital, or play the downside.",
            intel: {
              id: 'intel_victor_recession',
              tier: 'Insider',
              sourceName: 'Victor Vance (Titan)',
              content: "Top funds are 60% cash and aggressively shorting broad equities (TECH, BNKR, OILA).",
              assetAffected: 'TECH',
              timestamp: '02:00 PM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },
  {
    id: 'emma_club',
    name: 'Emma Sterling',
    role: 'Enterprise Tech Executive',
    locationId: 'club',
    personality: 'Sharp, Discerning, Connected',
    trustworthiness: 90,
    color: '#8b5cf6', // Indigo
    x: 880,
    y: 280,
    defaultDialogue: {
      greeting: "Good evening. Good to see young managers interested in genuine corporate strategy rather than just price charts.",
      choices: [
        {
          text: "How do corporate balance sheets look from the executive suite?",
          response: "Executives only spend capital when ROI is undeniable. When tech delivers productivity, budgets expand without limit.",
        },
      ],
    },
    dialogueByEventId: {
      tech_boom: {
        greeting: "I just walked out of our executive committee meeting. We authorized $50M in immediate purchase contracts with TECH.",
        choices: [
          {
            text: "Is OmniTech's new AI platform that transformative?",
            response: "It cuts our software operating costs in half. Every Fortune 500 company in my Rolodex is signing up. TECH will exceed all earnings forecasts.",
            intel: {
              id: 'intel_emma_tech_contracts',
              tier: 'Insider',
              sourceName: 'Emma Sterling (Exec)',
              content: "Emma confirms Fortune 500 firms are deploying $50M+ enterprise allocations to TECH platform.",
              assetAffected: 'TECH',
              timestamp: '02:30 PM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      tech_regulation: {
        greeting: "Our general counsel informed our board to freeze multi-year cloud contracts pending the antitrust investigation.",
        choices: [
          {
            text: "Are enterprise budgets freezing?",
            response: "Yes. Corporate legal departments hate regulatory ambiguity. TECH won't sign a major contract until this lawsuit is settled.",
            intel: {
              id: 'intel_emma_tech_freeze',
              tier: 'Insider',
              sourceName: 'Emma Sterling (Exec)',
              content: "Corporate legal counsel freezing enterprise software procurement for TECH platforms.",
              assetAffected: 'TECH',
              timestamp: '02:30 PM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },
  {
    id: 'marcus_club',
    name: 'Marcus Croft',
    role: 'Sovereign Macro Allocator',
    locationId: 'club',
    personality: 'Calm, Grand, Long-Horizon',
    trustworthiness: 88,
    color: '#eab308', // Yellow gold
    x: 840,
    y: 370,
    defaultDialogue: {
      greeting: "Welcome to the lounge. When you manage billions, patience is the only reliable edge.",
      choices: [
        {
          text: "What drives market sentiment on macro scales?",
          response: "Sovereign liquidity tides. Small traders watch the surf; we observe the tectonic ocean floor.",
        },
      ],
    },
    dialogueByEventId: {
      oil_supply_disruption: {
        greeting: "Our energy advisory committee met this morning. Strategic reserves will remain locked.",
        choices: [
          {
            text: "Will governments release strategic oil reserves?",
            response: "Not this time. Geopolitical tensions are too high. That means spot oil prices will spike without government intervention.",
            intel: {
              id: 'intel_marcus_reserves',
              tier: 'Insider',
              sourceName: 'Marcus Croft (Allocator)',
              content: "Marcus confirms strategic oil reserves will NOT be tapped. Unconstrained upside for OILA.",
              assetAffected: 'OILA',
              timestamp: '03:00 PM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      energy_breakthrough: {
        greeting: "Two foreign sovereign reserve funds have begun a multi-billion dollar reallocation into renewable technology.",
        choices: [
          {
            text: "Is ENRG receiving sovereign inflows?",
            response: "Indeed. The institutional mandate has flipped. Clean energy assets like ENRG will absorb massive institutional capital.",
            intel: {
              id: 'intel_marcus_sovereign_enrg',
              tier: 'Insider',
              sourceName: 'Marcus Croft (Allocator)',
              content: "Sovereign funds executing multi-billion rotation into ENRG clean energy equities.",
              assetAffected: 'ENRG',
              timestamp: '03:00 PM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
      rate_cut: {
        greeting: "Central bank credit facilities are opening up. Our desks are preparing to deploy liquidity directly into growth equities.",
        choices: [
          {
            text: "Will rate cuts spark an immediate rally?",
            response: "Without question. Institutional money market funds holding hundreds of billions must re-enter risk assets. Long TECH and BNKR.",
            intel: {
              id: 'intel_marcus_rate_deploy',
              tier: 'Insider',
              sourceName: 'Marcus Croft (Allocator)',
              content: "Institutional cash reserves deploying aggressively into TECH and BNKR following rate cut signaling.",
              assetAffected: 'TECH',
              timestamp: '03:00 PM',
              trustworthinessScore: 'High',
            },
            requiresTimeMinutes: 30,
          },
        ],
      },
    },
  },
];
