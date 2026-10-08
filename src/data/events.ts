import { MarketEvent } from '../types/game';

export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: 'semiconductor_shutdown',
    dayIndex: 1,
    title: 'Semiconductor Factory Shutdown',
    description: 'Major CHPX manufacturing facility unexpectedly shuts down due to industrial fire and wafer contamination.',
    affectedAssets: ['CHPX', 'TECH'],
    trueImpact: {
      CHPX: -18,
      TECH: -5,
    },
    publicInformation: 'CHPX announced an emergency halt at its primary fabrication plant in Dresden. Management claims backup inventory will cushion deliveries.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'CHPX Factory Halts Operations Unexpectedly',
        body: 'ChipCore Technologies reported an emergency maintenance shutdown at their largest fabrication line early this morning.',
        category: 'BREAKING',
      },
      {
        time: '08:25 AM',
        headline: 'Tech Hardware Futures Slip in Pre-Market',
        body: 'Tech components across the sector experienced jittery trading following the Dresden foundry news.',
        category: 'MARKETS',
      },
      {
        time: '08:45 AM',
        headline: 'Analysts Clash Over Duration of Semiconductor Halt',
        body: 'Some brokerages argue inventories can last 45 days, while others warn of immediate delivery failure.',
        category: 'ANALYSIS',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "This is classic panic overselling. Chip buyers will bid prices up to secure scarce supplies! I say we buy the dip aggressively.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "I examined their balance sheet: their inventory buffer is barely 10 days, not 45. Revenue guidance will crash. We should short CHPX.",
        leaning: 'BEARISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'sam_cafe',
        rumor: "My cousin works logistics in Dresden. He texted me that half the wafer cleanrooms are totaled. This shutdown could take months.",
        isAccurate: true,
      },
      {
        npcId: 'priya_cafe',
        rumor: "Competitors are already privately bragging they will absorb all of CHPX's client orders by Friday.",
        isAccurate: true,
      },
    ],
    insiderInformation: {
      npcId: 'victor_club',
      tip: "Management is holding an emergency board meeting right now to slash full-year revenue projections by 25%. Don't hold long shares.",
      isAccurate: true,
    },
  },
  {
    id: 'oil_supply_disruption',
    dayIndex: 2,
    title: 'Oil Supply Disruption',
    description: 'A major oil-producing cartel announces sudden unexpected export restrictions and pipeline sabotage.',
    affectedAssets: ['OILA', 'ENRG', 'TECH'],
    trueImpact: {
      OILA: 15,
      ENRG: 8,
      TECH: -3,
    },
    publicInformation: 'Strait transit halted following pipeline security alerts. Global crude supply deficit estimated at 1.8M barrels/day.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'Critical Export Pipelines Suspended Following Sabotage',
        body: 'Trans-continental supply routes shut down after pressure sensors indicated severe pipeline damage in key transit corridors.',
        category: 'BREAKING',
      },
      {
        time: '08:20 AM',
        headline: 'Energy Commodities Surge on Spot Scramble',
        body: 'Refineries are desperately bidding for tanker deliveries as delivery schedules fall into disarray.',
        category: 'MARKETS',
      },
      {
        time: '08:50 AM',
        headline: 'High Fuel Prices Threaten Tech Cloud Operating Margins',
        body: 'Data center power costs are projected to climb, putting pressure on tech valuations.',
        category: 'MACRO',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "OILA is going to the moon today! Energy rallies like this don't wait for hesitation. Go heavy on long OILA and ENRG.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "High crude prices act as a direct tax on enterprise margins. Watch out for tech multiple compression if energy keeps running.",
        leaning: 'NEUTRAL',
      },
    ],
    rumorInformation: [
      {
        npcId: 'robert_bank',
        rumor: "Our energy trading desk just saw institutional buyers put in massive block orders for December OILA delivery contracts.",
        isAccurate: true,
      },
      {
        npcId: 'priya_cafe',
        rumor: "Some are saying the pipeline damage will be repaired by tonight. I'm not convinced.",
        isAccurate: false,
      },
    ],
    insiderInformation: {
      npcId: 'marcus_club',
      tip: "Strategic reserves will NOT be tapped this month. The government wants domestic producers like OILA to capture the windfall.",
      isAccurate: true,
    },
  },
  {
    id: 'banking_stress',
    dayIndex: 3,
    title: 'Banking Stress',
    description: 'Concerns emerge about commercial real estate loan defaults and liquidity in regional lenders.',
    affectedAssets: ['BNKR', 'TECH'],
    trueImpact: {
      BNKR: -14,
      TECH: -4,
    },
    publicInformation: 'Several mid-tier lenders requested emergency liquidity window facilities from the Federal Reserve after deposit outflows.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'Deposit Outflows Trigger Scramble at Financial Institutions',
        body: 'Two commercial lenders report heavy cash withdrawals following rumors of unhedged property bond portfolios.',
        category: 'BREAKING',
      },
      {
        time: '08:30 AM',
        headline: 'Financial Credit Spreads Widen Sharply',
        body: 'Interbank lending rates spiked 40 basis points in early money market auctions.',
        category: 'MARKETS',
      },
      {
        time: '08:55 AM',
        headline: 'Regulators Announce Comprehensive Capital Reviews',
        body: 'Banking authorities insist tier-1 capital ratios remain adequate, but market participants remain skeptical.',
        category: 'ANALYSIS',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "Banks always get bailed out. This is a classic bear trap! Everyone selling BNKR right now will regret it when the Fed intervenes.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "Do not touch bank equity in a liquidity run. BNKR has toxic bond portfolios marked at held-to-maturity. It is a prime short candidate.",
        leaning: 'BEARISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'lisa_district',
        rumor: "Word at the clearinghouse is that interbank credit lines to BNKR have been quietly frozen until Monday audit checks.",
        isAccurate: true,
      },
      {
        npcId: 'sam_cafe',
        rumor: "I heard the CEO of BNKR just bought $2 million in stock this morning! (Actually it was a routine stock grant vesting).",
        isAccurate: false,
      },
    ],
    insiderInformation: {
      npcId: 'victor_club',
      tip: "We moved $300M out of BNKR custody accounts yesterday afternoon. A forced asset fire-sale is coming.",
      isAccurate: true,
    },
  },
  {
    id: 'tech_boom',
    dayIndex: 4,
    title: 'Tech Boom',
    description: 'New AI neural computing architecture delivers 10x throughput, triggering colossal enterprise software upgrades.',
    affectedAssets: ['TECH', 'CHPX'],
    trueImpact: {
      TECH: 18,
      CHPX: 10,
    },
    publicInformation: 'Benchmark results reveal next-generation AI foundation models running autonomously on OmniTech enterprise clusters.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'Breakthrough Autonomous AI System Shatters Cloud Benchmarks',
        body: 'OmniTech unveiled its new generation platform that reduces inference latency by 90%, prompting wave of corporate orders.',
        category: 'BREAKING',
      },
      {
        time: '08:35 AM',
        headline: 'Hyperscalers Place Uncapped Semiconductor Orders',
        body: 'Data center operators rush to procure hardware components to support anticipated workload surges.',
        category: 'MARKETS',
      },
      {
        time: '08:50 AM',
        headline: 'Wall Street Raises Tech Sector Growth Forecasts by 25%',
        body: 'Every major brokerage is scrambling to revise price targets upward ahead of opening bell.',
        category: 'ANALYSIS',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "A paradigm shift! Put everything into TECH and CHPX. Momentum this strong can carry stocks through the ceiling.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "The valuation multiples are undeniably stretched, but the hardware order confirmations are verifiable. Long TECH is the logical play.",
        leaning: 'BULLISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'sam_cafe',
        rumor: "The demo was just a marketing stunt recorded on a supercomputer. It will fail in actual enterprise deployment.",
        isAccurate: false,
      },
      {
        npcId: 'priya_cafe',
        rumor: "Three Fortune 50 firms have already signed 9-figure enterprise deals with TECH this morning.",
        isAccurate: true,
      },
    ],
    insiderInformation: {
      npcId: 'emma_club',
      tip: "My firm signed the enterprise contract at midnight. Our CIO says it's replacing half our legacy software licenses. TECH is unstoppable.",
      isAccurate: true,
    },
  },
  {
    id: 'energy_breakthrough',
    dayIndex: 5,
    title: 'Energy Breakthrough',
    description: 'Commercial solid-state battery and perovskite solar cells achieve 40% efficiency at half the manufacturing cost.',
    affectedAssets: ['ENRG', 'OILA'],
    trueImpact: {
      ENRG: 12,
      OILA: -10,
    },
    publicInformation: 'International Energy Consortium certifies peer-reviewed breakthrough in scalable clean energy storage and production.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'Clean Energy Efficiency Milestone Certified by Global Labs',
        body: 'Independent laboratories confirm continuous 40% photovoltaic yield paired with ultra-low degradation storage cells.',
        category: 'BREAKING',
      },
      {
        time: '08:30 AM',
        headline: 'Renewables Surge as Fossil Fuels Face Long-Term Demand Discount',
        body: 'Utility grid operators announce accelerated transition plans towards green baseload generation.',
        category: 'MARKETS',
      },
      {
        time: '08:55 AM',
        headline: 'Crude Futures Tumble as Substitution Timelines Advance',
        body: 'Commodity desks anticipate permanent erosion of peak fossil fuel demand assumptions.',
        category: 'ANALYSIS',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "Green tech hype has returned! ENRG is set for an epic short squeeze. We should ride the wave with heavy long contracts.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "Commercial scaling takes years, but market sentiment trades on immediate narrative. ENRG will rise while OILA bears the blunt selling.",
        leaning: 'BULLISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'robert_bank',
        rumor: "Our energy lending desk is already recalculating loan covenants for legacy oil drillers. Expect capital to flee oil into green energy.",
        isAccurate: true,
      },
      {
        npcId: 'lisa_district',
        rumor: "The patent office allegedly rejected the battery filing due to prior art.",
        isAccurate: false,
      },
    ],
    insiderInformation: {
      npcId: 'marcus_club',
      tip: "Two major sovereign wealth funds have reallocated $1.5B from hydrocarbon portfolios directly into ENRG. OILA is getting dumped.",
      isAccurate: true,
    },
  },
  {
    id: 'inflation_shock',
    dayIndex: 6,
    title: 'Inflation Shock',
    description: 'Consumer Price Index (CPI) comes in hot at 8.4% annualized, crushing hopes for monetary easing.',
    affectedAssets: ['BNKR', 'TECH', 'OILA'],
    trueImpact: {
      BNKR: -5,
      TECH: -10,
      OILA: 8,
    },
    publicInformation: 'Labor Department report reveals persistent price pressure across services and goods, sparking fears of stagflation.',
    publicNews: [
      {
        time: '08:30 AM',
        headline: 'CPI Leaps to 8.4%, Far Exceeding Consensus 5.2%',
        body: 'Core inflation gauges surged to fresh multi-year highs as energy and wage pressures continue unabated.',
        category: 'BREAKING',
      },
      {
        time: '08:45 AM',
        headline: 'Bond Yields Spike to Cycle Peaks',
        body: 'Yields on 10-year Treasury notes jumped 28 basis points in minutes, punishing growth equities.',
        category: 'MARKETS',
      },
      {
        time: '09:00 AM',
        headline: 'Commodities Outperform While Tech Valuation Multiples Shrink',
        body: 'Real assets and crude contracts are catching inflation hedging flows away from high-PE software.',
        category: 'MACRO',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "High inflation means strong nominal revenues! People still need computers. TECH will bounce back by lunchtime.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "Discount rates just blew out. TECH's terminal cash flows are worth 10% less right now. Short TECH, buy commodities like OILA.",
        leaning: 'BEARISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'sam_cafe',
        rumor: "Don't worry about CPI, the central bank said it's just 'transitory' supply chain noise again.",
        isAccurate: false,
      },
      {
        npcId: 'priya_cafe',
        rumor: "Hedge fund macro desks have initiated emergency risk-off liquidation in tech growth baskets.",
        isAccurate: true,
      },
    ],
    insiderInformation: {
      npcId: 'victor_club',
      tip: "The central bank governors held an unannounced call. Expect emergency quantitative tightening rhetoric. Tech is toxic today.",
      isAccurate: true,
    },
  },
  {
    id: 'rate_cut',
    dayIndex: 7,
    title: 'Rate Cut',
    description: 'Central bank unexpectedly signals an emergency 50 basis point interest rate cut to foster capital investment.',
    affectedAssets: ['TECH', 'BNKR'],
    trueImpact: {
      TECH: 12,
      BNKR: 8,
    },
    publicInformation: 'Monetary policy board releases surprise statement stating borrowing costs will be slashed ahead of schedule.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'Central Bank Pivots: Surprise 50bps Rate Cut Signaling',
        body: 'Policymakers cite robust disinflation and desire to support corporate capital expenditure initiatives.',
        category: 'BREAKING',
      },
      {
        time: '08:20 AM',
        headline: 'Equities Skyrocket in Pre-Market Liquidity Euphoria',
        body: 'Cheap money is back on the table. Growth sectors and financial lending margins rally across the board.',
        category: 'MARKETS',
      },
      {
        time: '08:40 AM',
        headline: 'Borrowing Frenzy Anticipated as Debt Capital Markets Reopen',
        body: 'Corporate treasurers prepare large bond issuance programs at newly reduced rates.',
        category: 'MACRO',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "Free money printer goes brrr! Go max leverage long on TECH and BNKR. The market cannot drop on a rate cut day.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "Historically, the first surprise rate cut drives an immediate 8-12% relief rally in growth assets before macro reality sets in. Long is favored.",
        leaning: 'BULLISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'robert_bank',
        rumor: "Commercial loan applications doubled this morning before our branches even unlocked their doors.",
        isAccurate: true,
      },
      {
        npcId: 'lisa_district',
        rumor: "Rumor has it the cut is actually because a top bank is secretly bankrupt and needed rescue.",
        isAccurate: false,
      },
    ],
    insiderInformation: {
      npcId: 'marcus_club',
      tip: "Every institutional cash desk is deploying idle money market reserves into TECH and BNKR equities. The bid will not stop.",
      isAccurate: true,
    },
  },
  {
    id: 'tech_regulation',
    dayIndex: 8,
    title: 'Tech Regulation',
    description: 'Antitrust regulators announce sweeping investigations and mandatory revenue divestitures for dominant platforms.',
    affectedAssets: ['TECH', 'CHPX'],
    trueImpact: {
      TECH: -12,
      CHPX: -5,
    },
    publicInformation: 'Joint regulatory commission files lawsuits demanding the break-up of cloud monopolies and strict chip licensing.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'Antitrust Commission Launches Historic Break-Up Actions',
        body: 'Federal authorities file formal complaints accusing enterprise software monopolies of anti-competitive bundling.',
        category: 'BREAKING',
      },
      {
        time: '08:30 AM',
        headline: 'Software Valuations Face Legal Uncertainty Discount',
        body: 'Analysts project billions in compliance costs and potential forced spinoffs of proprietary cloud platforms.',
        category: 'MARKETS',
      },
      {
        time: '08:50 AM',
        headline: 'Semiconductor Shipments Subject to New Export Review',
        body: 'New restrictions will require ChipCore to file individual licensing requests for high-performance processors.',
        category: 'ANALYSIS',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "Regulation takes decades in court. These suits will get settled for pennies. Let's buy the panic discount on TECH!",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "Institutional compliance mandates will force pension funds to trim TECH exposure immediately regardless of long-term legal outcomes. Short TECH.",
        leaning: 'BEARISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'priya_cafe',
        rumor: "I talked to the DOJ press liaison. This isn't just fines—they have smoking gun emails regarding price-fixing.",
        isAccurate: true,
      },
      {
        npcId: 'sam_cafe',
        rumor: "The president will veto the antitrust legislation by Friday afternoon.",
        isAccurate: false,
      },
    ],
    insiderInformation: {
      npcId: 'emma_club',
      tip: "Our general counsel told the board to halt our enterprise expansion until the antitrust rulings clear. Cloud spending is frozen.",
      isAccurate: true,
    },
  },
  {
    id: 'global_growth_surprise',
    dayIndex: 9,
    title: 'Global Growth Surprise',
    description: 'Global manufacturing PMIs and trade figures rebound dramatically, sparking a broad-based economic resurgence.',
    affectedAssets: ['TECH', 'BNKR', 'OILA', 'ENRG'],
    trueImpact: {
      TECH: 8,
      BNKR: 10,
      OILA: 7,
      ENRG: 6,
    },
    publicInformation: 'Purchasing managers indices across Europe, Asia, and the Americas expand at fastest rate in seven quarters.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'Global Factory Output Expands at Record Pace',
        body: 'Export orders surged worldwide as consumer demand and industrial investment rebounded simultaneously.',
        category: 'BREAKING',
      },
      {
        time: '08:30 AM',
        headline: 'Broad-Based Rally Across Financials, Energy, and Tech',
        body: 'All major sectors are in the green as cyclical and growth companies both post robust bookings.',
        category: 'MARKETS',
      },
      {
        time: '08:50 AM',
        headline: 'Lending Activity Expands as Corporate Confidences Soars',
        body: 'Banks report surging loan books as companies borrow to expand operations.',
        category: 'ANALYSIS',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "A rising tide lifts all boats! Buy BNKR and TECH. When the global economy fires on all cylinders, financial earnings explode.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "Synchronized global growth is the rarest and most bullish macroeconomic setup. Financials like BNKR stand to gain the most from yield curves.",
        leaning: 'BULLISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'robert_bank',
        rumor: "Our commercial loan division booked more transaction volume in the last 48 hours than in all of last quarter.",
        isAccurate: true,
      },
      {
        npcId: 'sam_cafe',
        rumor: "I think it's a statistical fluke caused by calendar adjustments.",
        isAccurate: false,
      },
    ],
    insiderInformation: {
      npcId: 'marcus_club',
      tip: "Global sovereign funds are rebalancing billions from government cash bonds into equities across financials and energy today.",
      isAccurate: true,
    },
  },
  {
    id: 'recession_fear',
    dayIndex: 10,
    title: 'Recession Fear',
    description: 'Leading economic indicators and inverted yield curves point toward an imminent severe economic downturn.',
    affectedAssets: ['TECH', 'BNKR', 'OILA', 'ENRG'],
    trueImpact: {
      TECH: -12,
      BNKR: -10,
      OILA: -8,
      ENRG: -6,
    },
    publicInformation: 'Leading economic index posts sixth consecutive monthly decline while unemployment claims trend higher.',
    publicNews: [
      {
        time: '08:00 AM',
        headline: 'Recession Alarms Sound as Key Indicators Plunge',
        body: 'The Conference Board leading economic index falls to depths previously seen only prior to past severe recessions.',
        category: 'BREAKING',
      },
      {
        time: '08:30 AM',
        headline: 'Widespread Selloff Engulfs Equities and Commodities',
        body: 'Cyclical stocks, tech multiples, and oil contracts all retreat as investors seek refuge in short positions and cash.',
        category: 'MARKETS',
      },
      {
        time: '08:50 AM',
        headline: 'Credit Analysts Warn of Default Cascades',
        body: 'Bank loss provisions are slated to increase dramatically as corporate balance sheets weaken.',
        category: 'MACRO',
      },
    ],
    analystInformation: [
      {
        employeeId: 'maya',
        statement: "Markets always climb a wall of worry. Everyone is too pessimistic! This could be the best buying opportunity of the month.",
        leaning: 'BULLISH',
      },
      {
        employeeId: 'daniel',
        statement: "This is a full macro breakdown. Corporate margins will collapse across banking and tech. Short TECH and BNKR with conviction.",
        leaning: 'BEARISH',
      },
    ],
    rumorInformation: [
      {
        npcId: 'priya_cafe',
        rumor: "Three major automotive manufacturers have issued hiring freezes and cancelled capital expenditures this morning.",
        isAccurate: true,
      },
      {
        npcId: 'sam_cafe',
        rumor: "A famous investor on Twitter said the economy is actually about to experience a super-boom.",
        isAccurate: false,
      },
    ],
    insiderInformation: {
      npcId: 'victor_club',
      tip: "We have moved our fund to 60% cash and opened massive synthetic shorts on banks and software. Don't fight the downturn.",
      isAccurate: true,
    },
  },
];
