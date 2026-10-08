import { Asset, AssetSymbol, Position, MarketImpact } from '../types/game';

export function calculatePositionPnL(pos: Position, currentPrice: number): number {
  if (pos.side === 'LONG') {
    return (currentPrice - pos.entryPrice) * pos.quantity;
  } else {
    // SHORT: profit when currentPrice < entryPrice
    return (pos.entryPrice - currentPrice) * pos.quantity;
  }
}

export function calculateTotalPortfolioValue(positions: Position[], assets: Asset[]): {
  marketValue: number;
  totalPnL: number;
} {
  const assetMap = new Map<AssetSymbol, Asset>(assets.map(a => [a.symbol, a]));

  let totalPnL = 0;
  let marketValue = 0;

  for (const pos of positions) {
    const asset = assetMap.get(pos.symbol);
    if (!asset) continue;
    const pnl = calculatePositionPnL(pos, asset.price);
    totalPnL += pnl;

    if (pos.side === 'LONG') {
      marketValue += pos.quantity * asset.price;
    } else {
      // Short collateral + unrealized P&L
      const collateral = pos.quantity * pos.entryPrice;
      marketValue += collateral + pnl;
    }
  }

  return { marketValue, totalPnL };
}

export function calculateNetWorth(cash: number, positions: Position[], assets: Asset[]): number {
  const { marketValue } = calculateTotalPortfolioValue(positions, assets);
  return Math.round((cash + marketValue) * 100) / 100;
}

export function applyMarketEventImpact(
  assets: Asset[],
  impact: MarketImpact
): {
  updatedAssets: Asset[];
  priceChanges: { symbol: AssetSymbol; from: number; to: number; changePercent: number }[];
} {
  const priceChanges: { symbol: AssetSymbol; from: number; to: number; changePercent: number }[] = [];

  const updatedAssets = assets.map(asset => {
    const pct = impact[asset.symbol] ?? (Math.floor((Math.random() * 3 - 1.5) * 10) / 10); // +-1.5% baseline drift
    const prev = asset.price;
    const rawNewPrice = prev * (1 + pct / 100);
    const newPrice = Math.max(1, Math.round(rawNewPrice * 100) / 100);

    priceChanges.push({
      symbol: asset.symbol,
      from: prev,
      to: newPrice,
      changePercent: Math.round(((newPrice - prev) / prev) * 1000) / 10,
    });

    return {
      ...asset,
      previousPrice: prev,
      price: newPrice,
      history: [...asset.history, newPrice],
    };
  });

  return { updatedAssets, priceChanges };
}
