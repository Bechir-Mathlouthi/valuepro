import type { CompanyData, FinancialData, CashFlow, ValuationResult, HistoricalData, IndustryMetrics, ValidationError, CalculationExport } from '../types/valuation';

export const calculateDCF = (
  cashFlows: CashFlow[],
  wacc: number,
  perpetualGrowth: number
): number => {
  let enterpriseValue = 0;
  
  // Calculate present value of projected cash flows
  cashFlows.forEach((cf, index) => {
    const fcf = calculateFreeCashFlow(cf);
    enterpriseValue += fcf / Math.pow(1 + wacc / 100, index + 1);
  });

  // Calculate terminal value
  const lastCF = cashFlows[cashFlows.length - 1];
  const terminalFCF = calculateFreeCashFlow(lastCF) * (1 + perpetualGrowth / 100);
  const terminalValue = terminalFCF / (wacc / 100 - perpetualGrowth / 100);
  const presentTerminalValue = terminalValue / Math.pow(1 + wacc / 100, cashFlows.length);

  return enterpriseValue + presentTerminalValue;
};

export const calculateFreeCashFlow = (cf: CashFlow): number => {
  const ebitda = cf.revenue * (cf.ebitdaMargin / 100);
  const ebit = ebitda * (1 - cf.depreciationRate / 100);
  const tax = ebit * (cf.taxRate / 100);
  const depreciation = cf.revenue * (cf.depreciationRate / 100);
  return ebit - tax + depreciation - cf.capex - cf.workingCapital;
};

export const calculateComparableValue = (
  companyData: CompanyData,
  metric: 'evToEbitda' | 'peRatio' | 'evToRevenue'
): number => {
  const comparables = companyData.comparables;
  if (!comparables.length) return 0;

  // Calculate median multiple
  const multiples = comparables.map(c => c[metric]).sort((a, b) => a - b);
  const medianMultiple = multiples[Math.floor(multiples.length / 2)];

  // Apply multiple to company's corresponding metric
  switch (metric) {
    case 'evToEbitda':
      return medianMultiple * companyData.financials.ebitda;
    case 'peRatio':
      return medianMultiple * companyData.financials.netIncome;
    case 'evToRevenue':
      return medianMultiple * companyData.financials.revenue;
    default:
      return 0;
  }
};

export const calculateHistoricalTrends = (historicalData: HistoricalData[]) => {
  if (historicalData.length < 2) return null;

  const sortedData = [...historicalData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const trends = {
    cagr: {
      revenue: calculateCAGR(sortedData.map(d => d.financials.revenue)),
      ebitda: calculateCAGR(sortedData.map(d => d.financials.ebitda)),
      netIncome: calculateCAGR(sortedData.map(d => d.financials.netIncome)),
    },
    volatility: {
      revenue: calculateVolatility(sortedData.map(d => d.financials.revenue)),
      ebitda: calculateVolatility(sortedData.map(d => d.financials.ebitda)),
      margins: calculateVolatility(sortedData.map(d => d.ratios.profitability.ebitdaMargin)),
    },
    stability: {
      marginTrend: calculateTrendStability(sortedData.map(d => d.ratios.profitability.ebitdaMargin)),
      leverageTrend: calculateTrendStability(sortedData.map(d => d.ratios.leverage.debtToEbitda)),
    },
  };

  return trends;
};

const calculateCAGR = (values: number[]): number => {
  const years = values.length - 1;
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  return Math.pow(lastValue / firstValue, 1 / years) - 1;
};

const calculateVolatility = (values: number[]): number => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length);
};

const calculateTrendStability = (values: number[]): number => {
  const diffs = values.slice(1).map((val, i) => Math.abs(val - values[i]));
  return 1 - (diffs.reduce((sum, val) => sum + val, 0) / values.length);
};

export const validateIndustryMetrics = (data: IndustryMetrics): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate sector-specific metrics
  if (data.metrics.marketShare && (data.metrics.marketShare < 0 || data.metrics.marketShare > 100)) {
    errors.push({
      field: 'marketShare',
      message: 'Market share must be between 0 and 100',
      type: 'error'
    });
  }

  // Validate ESG metrics
  if (data.metrics.carbonEmissions && data.metrics.carbonEmissions < 0) {
    errors.push({
      field: 'carbonEmissions',
      message: 'Carbon emissions cannot be negative',
      type: 'error'
    });
  }

  // Validate digital transformation metrics
  if (data.metrics.digitalRevenue && 
      (data.metrics.digitalRevenue < 0 || data.metrics.digitalRevenue > 100)) {
    errors.push({
      field: 'digitalRevenue',
      message: 'Digital revenue percentage must be between 0 and 100',
      type: 'error'
    });
  }

  return errors;
};

export const exportToExcel = async (data: CalculationExport): Promise<Blob> => {
  const XLSX = await import('xlsx');
  
  const workbook = XLSX.utils.book_new();
  
  // Company Overview
  const overviewData = [
    ['Company Overview'],
    ['Name', data.company.name],
    ['Sector', data.company.sector],
    [''],
    ['Key Metrics'],
    ['Revenue', data.company.financials.revenue],
    ['EBITDA', data.company.financials.ebitda],
    ['Net Income', data.company.financials.netIncome],
  ];
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');

  // Valuation Results
  const valuationData = [
    ['Valuation Results'],
    ['Method', 'Value'],
    ['DCF', data.valuation.dcfValue],
    ['Comparables', data.valuation.comparablesValue],
    ['Average', data.valuation.averageValue],
  ];
  const valuationSheet = XLSX.utils.aoa_to_sheet(valuationData);
  XLSX.utils.book_append_sheet(workbook, valuationSheet, 'Valuation');

  // Export to blob
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};