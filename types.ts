
export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters
  type: 'condo' | 'house' | 'land';
  status: 'for-sale' | 'sold';
  description: string;
  features: string[];
  images: string[];
  isFeatured: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  qualificationResponses: Record<string, any>;
  notes: string;
  createdAt: string;
}

export interface SiteSettings {
  logoUrl: string; // Can be a URL or a base64 string
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
}

export interface MortgageInput {
    propertyPrice: number;
    downPaymentPercent: number;
    interestRatePercent: number;
    loanTermYears: number;
}

export interface MortgageMetrics {
    monthlyPayment: number;
    loanAmount: number;
    downPaymentAmount: number;
}

export interface RoiInput extends MortgageInput {
    closingCostsPercent: number;
    monthlyRentalIncome: number;
    monthlyExpenses: number; // Taxes, Insurance, HOA, etc.
    vacancyRatePercent: number;
    annualAppreciationPercent: number;
}

export interface RoiMetrics {
    noi: number;
    capRate: number;
    totalCashInvested: number;
    annualCashFlow: number;
    cashOnCashReturn: number;
    yearOneTotalReturn: number;
    projections: { year: number; propertyValue: number; equity: number; totalReturn: number }[];
}