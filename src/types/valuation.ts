export interface CompanyData {
  name: string;
  sector: string;
  financials: FinancialData;
  comparables: ComparableCompany[];
  ratios: FinancialRatios;
  historicalData: HistoricalData[];
  industryMetrics?: IndustryMetrics;
  sectorMetrics?: SectorSpecificMetrics;
  validation?: {
    rules: ValidationRules[];
    lastValidated: string;
    validationScore: number;
  };
}

export interface FinancialData {
  revenue: number;
  ebitda: number;
  ebit: number;
  netIncome: number;
  totalAssets: number;
  totalDebt: number;
  cashAndEquivalents: number;
  workingCapital: number;
  capex: number;
  depreciation: number;
  inventory: number;
  accountsReceivable: number;
  accountsPayable: number;
  totalEquity: number;
  interestExpense: number;
}

export interface FinancialRatios {
  profitability: {
    grossMargin: number;
    ebitdaMargin: number;
    operatingMargin: number;
    netMargin: number;
    roa: number;
    roe: number;
    roic: number;
  };
  liquidity: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    workingCapitalRatio: number;
  };
  efficiency: {
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
    payablesTurnover: number;
    cashConversionCycle: number;
  };
  leverage: {
    debtToEquity: number;
    debtToEbitda: number;
    interestCoverage: number;
    netDebtToEbitda: number;
  };
  growth: {
    revenueGrowth: number;
    ebitdaGrowth: number;
    netIncomeGrowth: number;
  };
}

export interface ComparableCompany {
  name: string;
  evToEbitda: number;
  peRatio: number;
  evToRevenue: number;
  evToEbit: number;
  priceToBook: number;
  priceToSales: number;
  dividendYield?: number;
}

export interface CashFlow {
  year: number;
  revenue: number;
  growthRate: number;
  ebitdaMargin: number;
  capex: number;
  workingCapital: number;
  taxRate: number;
  depreciationRate: number;
}

export interface SensitivityAnalysis {
  wacc: number[];
  perpetualGrowth: number[];
  results: number[][];
}

export interface ValuationResult {
  dcfValue: number;
  comparablesValue: number;
  averageValue: number;
  sensitivityMatrix: SensitivityAnalysis;
  methodologies: {
    dcf: {
      enterpriseValue: number;
      equityValue: number;
      impliedMultiples: {
        evToEbitda: number;
        evToEbit: number;
        peRatio: number;
      };
    };
    comparables: {
      evToEbitdaValue: number;
      evToEbitValue: number;
      peValue: number;
    };
  };
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface CalculationExport {
  company: CompanyData;
  valuation: ValuationResult;
  assumptions: {
    wacc: number;
    perpetualGrowth: number;
    taxRate: number;
    projectionPeriod: number;
  };
  cashFlowProjections: CashFlow[];
  timestamp: string;
  version: string;
}

export interface HistoricalData {
  date: string;
  financials: FinancialData;
  ratios: FinancialRatios;
}

export interface IndustryMetrics {
  sector: string;
  subsector?: string;
  metrics: {
    marketShare?: number;
    customerConcentration?: number;
    geographicDiversification?: number;
    productDiversification?: number;
    regulatoryRisk?: number;
    cyclicality?: number;
    rdToRevenue?: number;
    patentCount?: number;
    newProductRevenue?: number;
    carbonEmissions?: number;
    energyEfficiency?: number;
    waterUsage?: number;
    wasteManagement?: number;
    employeeTurnover?: number;
    digitalRevenue?: number;
    ecommerceShare?: number;
    itSpending?: number;
  };
  benchmarks: {
    ratios: Partial<FinancialRatios>;
    quartiles: {
      q1: Partial<FinancialRatios>;
      median: Partial<FinancialRatios>;
      q3: Partial<FinancialRatios>;
    };
  };
  sectorMetrics?: SectorSpecificMetrics;
  advancedAnalytics?: {
    seasonality: {
      index: number[];
      peakMonths: string[];
      troughMonths: string[];
    };
    correlation: {
      gdpBeta: number;
      marketBeta: number;
      interestRateSensitivity: number;
    };
    riskMetrics: {
      operationalLeverage: number;
      financialLeverage: number;
      businessRiskScore: number;
      geographicRiskIndex: number;
    };
  };
}

export interface SectorSpecificMetrics {
  technology?: {
    arpu: number;
    userAcquisitionCost: number;
    churnRate: number;
    monthlyActiveUsers: number;
    lifetimeValue: number;
    paybackPeriod: number;
  };
  manufacturing?: {
    capacityUtilization: number;
    orderBacklog: number;
    supplierConcentration: number;
    rawMaterialCosts: number;
    productionEfficiency: number;
    qualityMetrics: number;
  };
  retail?: {
    sameStoreSales: number;
    salesPerSquareFoot: number;
    inventoryTurnover: number;
    customerRetention: number;
    basketSize: number;
    storeCount: number;
  };
  healthcare?: {
    patientVolume: number;
    averageLengthOfStay: number;
    occupancyRate: number;
    reimbursementRate: number;
    readmissionRate: number;
    patientSatisfaction: number;
  };
  financial?: {
    netInterestMargin: number;
    costOfFunds: number;
    nonPerformingLoans: number;
    capitalAdequacy: number;
    loanToDeposit: number;
    feesToIncome: number;
  };
}

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'powerpoint' | 'word';
  sections: {
    companyOverview: boolean;
    financialAnalysis: boolean;
    valuation: boolean;
    comparables: boolean;
    industryAnalysis: boolean;
    charts: boolean;
  };
  template?: string;
  language?: string;
  branding?: {
    logo?: string;
    colors?: string[];
    fonts?: string[];
  };
}

export interface ValidationRules {
  type: 'warning' | 'error';
  field: string;
  condition: string;
  message: string;
  threshold?: number;
  comparator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  severity: 1 | 2 | 3;
}