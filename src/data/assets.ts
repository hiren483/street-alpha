import { Asset } from '../types/game';

export const INITIAL_ASSETS: Asset[] = [
  {
    symbol: 'CHPX',
    name: 'ChipCore Technologies',
    price: 100.0,
    previousPrice: 100.0,
    sector: 'Semiconductors',
    history: [98.5, 99.2, 100.0],
  },
  {
    symbol: 'OILA',
    name: 'Trans-Oceanic Oil',
    price: 100.0,
    previousPrice: 100.0,
    sector: 'Crude & Commodities',
    history: [101.2, 99.8, 100.0],
  },
  {
    symbol: 'BNKR',
    name: 'Metropolitan Bank Corp',
    price: 100.0,
    previousPrice: 100.0,
    sector: 'Banking & Financials',
    history: [99.5, 100.4, 100.0],
  },
  {
    symbol: 'TECH',
    name: 'OmniTech Cloud Systems',
    price: 100.0,
    previousPrice: 100.0,
    sector: 'Software & Infrastructure',
    history: [97.8, 98.9, 100.0],
  },
  {
    symbol: 'ENRG',
    name: 'Vanguard Renewable Energy',
    price: 100.0,
    previousPrice: 100.0,
    sector: 'Clean Energy & Utilities',
    history: [100.5, 100.1, 100.0],
  },
];
