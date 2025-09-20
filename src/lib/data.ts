import type { User, Investment, PortfolioPosition } from './types';

export const MOCK_USER: User = {
  id: 'user-123',
  name: 'TON Tapper',
  et: 12345,
  rank: 301,
  weeklyGrowth: 150.78,
};

export const LEADERBOARD_USERS: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `TapperKing${i + 1}`,
  et: 1000000 - i * 15000,
  rank: i + 1,
  weeklyGrowth: Math.random() * 500,
}));

export const INVESTMENT_OPPORTUNITIES: Investment[] = [
  {
    id: 'inv-001',
    name: 'EcoFarm Initiative',
    sector: 'Agriculture',
    country: 'Nigeria',
    city: 'Lagos',
    description: 'Invest in sustainable urban farming projects to improve food security.',
    minInvestment: 500,
    expectedReturn: '15-20% Annually',
    imageId: 'investment-agriculture',
  },
  {
    id: 'inv-002',
    name: 'AfriTech Hub',
    sector: 'Technology',
    country: 'Kenya',
    city: 'Nairobi',
    description: 'Support a growing ecosystem of tech startups and digital innovators.',
    minInvestment: 1000,
    expectedReturn: '25-30% Annually',
    imageId: 'investment-tech',
  },
  {
    id: 'inv-003',
    name: 'Cape Town Properties',
    sector: 'Real Estate',
    country: 'South Africa',
    city: 'Cape Town',
    description: 'Acquire shares in high-value commercial and residential real estate.',
    minInvestment: 2500,
    expectedReturn: '12% Annually',
    imageId: 'investment-real-estate',
  },
  {
    id: 'inv-004',
    name: 'Ghana Fintech Fund',
    sector: 'Finance',
    country: 'Ghana',
    city: 'Accra',
    description: 'Fund the next generation of financial technology disrupting mobile payments.',
    minInvestment: 750,
    expectedReturn: '22% Annually',
    imageId: 'investment-finance',
  },
  {
    id: 'inv-005',
    name: 'Savannah Solar',
    sector: 'Other',
    country: 'Tanzania',
    city: 'Dodoma',
    description: 'Powering rural communities with clean and affordable solar energy solutions.',
    minInvestment: 600,
    expectedReturn: '18% Annually',
    imageId: 'investment-general',
  },
  {
    id: 'inv-006',
    name: 'Nile Logistics',
    sector: 'Other',
    country: 'Egypt',
    city: 'Cairo',
    description: 'Modernizing supply chain and logistics across North Africa.',
    minInvestment: 1200,
    expectedReturn: '14% Annually',
    imageId: 'investment-general',
  },
];

export const USER_PORTFOLIO: PortfolioPosition[] = [
  {
    id: 'pos-001',
    investment: INVESTMENT_OPPORTUNITIES[1], // AfriTech Hub
    amountInvested: 2000,
    currentValue: 2350,
    purchaseDate: '2023-05-10',
  },
  {
    id: 'pos-002',
    investment: INVESTMENT_OPPORTUNITIES[3], // Ghana Fintech Fund
    amountInvested: 1500,
    currentValue: 1680,
    purchaseDate: '2023-08-22',
  },
];
