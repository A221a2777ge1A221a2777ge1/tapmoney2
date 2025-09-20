export type User = {
  id: string;
  name: string;
  et: number;
  rank?: number;
  weeklyGrowth: number;
};

export type Investment = {
  id: string;
  name: string;
  sector: 'Agriculture' | 'Technology' | 'Real Estate' | 'Finance' | 'Other';
  country: string;
  city: string;
  description: string;
  minInvestment: number;
  expectedReturn: string;
  imageId: string;
};

export type PortfolioPosition = {
  id: string;
  investment: Investment;
  amountInvested: number;
  currentValue: number;
  purchaseDate: string;
};
