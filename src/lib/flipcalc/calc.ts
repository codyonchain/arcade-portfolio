import { FinishLevel, PropertyProfile, RehabLineItem, UnderwriteInputs, Verdict } from "./types";

export function ageMultiplier(yearBuilt: number) {
  if (yearBuilt < 1970) return 1.25;
  if (yearBuilt < 2000) return 1.1;
  return 1;
}

export function rehabPresetPerSf(finish: FinishLevel) {
  if (finish === "Low") return 25;
  if (finish === "Standard") return 40;
  return 65;
}

export function defaultRehabLineItems(sqft: number, yearBuilt: number, finish: FinishLevel): RehabLineItem[] {
  const perSf = rehabPresetPerSf(finish);
  const mult = ageMultiplier(yearBuilt);
  const base = Math.round(sqft * perSf * mult);
  const buckets: Array<[string, number]> = [
    ["Kitchen + Bath Refresh", 0.3],
    ["Flooring + Paint", 0.22],
    ["Mechanical Contingency", 0.18],
    ["Exterior + Curb Appeal", 0.12],
    ["Permissive Contingency", 0.1],
    ["Cleanup + Punch", 0.08],
  ];
  return buckets.map(([name, pct], idx) => ({
    id: `li_${idx}`,
    name,
    cost: Math.round(base * pct),
  }));
}

export function sumLineItems(items: RehabLineItem[]) {
  return items.reduce((sum, item) => sum + (Number.isFinite(item.cost) ? item.cost : 0), 0);
}

export function gradeFromRoi(roi: number): Pick<Verdict, "grade" | "verdictLabel"> {
  if (roi >= 0.2) return { grade: "A", verdictLabel: "SEND IT" };
  if (roi >= 0.12) return { grade: "B", verdictLabel: "GOOD" };
  if (roi >= 0.06) return { grade: "C", verdictLabel: "THIN" };
  return { grade: "D", verdictLabel: "PASS ON THIS" };
}

export function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export function buildDefaultInputs(property: PropertyProfile): UnderwriteInputs {
  const arvMid = Math.round((property.arvMin + property.arvMax) / 2);
  const finish: FinishLevel = "Standard";
  const rehabLineItems = defaultRehabLineItems(property.sqft, property.yearBuilt, finish);

  return {
    purchasePrice: Math.round(arvMid * 0.72),
    arv: arvMid,
    holdingMonths: 4,
    finish,
    rehabLineItems,
    financing: "HardMoney",
    downPaymentPct: 0.15,
    hardMoneyRateApr: 0.12,
    pointsPct: 0.02,
    taxesMonthly: Math.round(property.taxAnnual / 12),
    insuranceMonthly: Math.round(property.insuranceAnnual / 12),
    utilitiesMonthly: 350,
  };
}

export function computeVerdict(inputs: UnderwriteInputs): Verdict {
  const rehabTotal = sumLineItems(inputs.rehabLineItems);
  const netSale = inputs.arv * (1 - 0.07);
  const purchaseClosing = inputs.purchasePrice * 0.02;
  const taxes = inputs.taxesMonthly * inputs.holdingMonths;
  const insurance = inputs.insuranceMonthly * inputs.holdingMonths;
  const utilities = inputs.utilitiesMonthly * inputs.holdingMonths;

  let points = 0;
  let interest = 0;
  if (inputs.financing === "HardMoney") {
    const loanAmount = inputs.purchasePrice * (1 - inputs.downPaymentPct);
    points = loanAmount * inputs.pointsPct;
    interest = loanAmount * (inputs.hardMoneyRateApr / 12) * inputs.holdingMonths;
  }

  const holdingTotal = taxes + insurance + utilities + interest;
  const totalCost = inputs.purchasePrice + purchaseClosing + rehabTotal + holdingTotal + points;
  const profit = netSale - totalCost;
  const roiDenom = inputs.purchasePrice + rehabTotal + purchaseClosing;
  const roi = roiDenom > 0 ? profit / roiDenom : 0;
  const { grade, verdictLabel } = gradeFromRoi(roi);
  const targetProfit = Math.max(25000, inputs.arv * 0.1);
  const maxOffer = netSale - (rehabTotal + holdingTotal + points) - targetProfit - purchaseClosing;

  return {
    netSale,
    purchaseClosing,
    points,
    holdingTotal,
    rehabTotal,
    totalCost,
    profit,
    roi,
    grade,
    verdictLabel,
    maxOffer,
    targetProfit,
  };
}
