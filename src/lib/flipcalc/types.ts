export type Comp = {
  label: string;
  soldPrice: number;
  beds: number;
  baths: number;
  sqft: number;
  distanceMi: number;
};

export type PropertyProfile = {
  id: string;
  address: string;
  cityState: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  taxAnnual: number;
  insuranceAnnual: number;
  arvMin: number;
  arvMax: number;
  comps: Comp[];
  photoUrl?: string;
};

export type FinishLevel = "Low" | "Standard" | "High";
export type FinancingType = "Cash" | "HardMoney";

export type RehabLineItem = {
  id: string;
  name: string;
  cost: number;
};

export type UnderwriteInputs = {
  purchasePrice: number;
  arv: number;
  holdingMonths: number;

  finish: FinishLevel;
  rehabLineItems: RehabLineItem[];

  financing: FinancingType;
  downPaymentPct: number;
  hardMoneyRateApr: number;
  pointsPct: number;

  taxesMonthly: number;
  insuranceMonthly: number;
  utilitiesMonthly: number;
};

export type Verdict = {
  netSale: number;
  purchaseClosing: number;
  points: number;
  holdingTotal: number;
  rehabTotal: number;
  totalCost: number;
  profit: number;
  roi: number;
  grade: "A" | "B" | "C" | "D";
  verdictLabel: "SEND IT" | "GOOD" | "THIN" | "PASS ON THIS";
  maxOffer: number;
  targetProfit: number;
};
