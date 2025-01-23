import React from 'react';
import { LineChart, Activity, TrendingUp } from 'lucide-react';
import HistoricalTrendAnalysis from './HistoricalTrendAnalysis';
import FinancialMetrics from './FinancialMetrics';
import IndustryBenchmark from './IndustryBenchmark';

const mockHistoricalData = [
  {
    date: '2020-01-01',
    financials: {
      revenue: 1000000,
      ebitda: 200000,
      ebit: 150000,
      netIncome: 100000,
      totalAssets: 2000000,
      totalDebt: 800000,
      cashAndEquivalents: 300000,
      workingCapital: 400000,
      capex: 50000,
      depreciation: 50000,
      inventory: 200000,
      accountsReceivable: 150000,
      accountsPayable: 100000,
      totalEquity: 1200000,
      interestExpense: 40000,
    },
    ratios: {
      profitability: {
        grossMargin: 0.4,
        ebitdaMargin: 0.2,
        operatingMargin: 0.15,
        netMargin: 0.1,
        roa: 0.05,
        roe: 0.083,
        roic: 0.075,
      },
      liquidity: {
        currentRatio: 2,
        quickRatio: 1.5,
        cashRatio: 0.8,
        workingCapitalRatio: 0.4,
      },
      efficiency: {
        assetTurnover: 0.5,
        inventoryTurnover: 5,
        receivablesTurnover: 6.67,
        payablesTurnover: 10,
        cashConversionCycle: 73,
      },
      leverage: {
        debtToEquity: 0.67,
        debtToEbitda: 4,
        interestCoverage: 5,
        netDebtToEbitda: 2.5,
      },
      growth: {
        revenueGrowth: 0.1,
        ebitdaGrowth: 0.12,
        netIncomeGrowth: 0.15,
      },
    },
  },
  // Add more historical data points...
];

const mockIndustryMetrics = {
  sector: 'Technology',
  metrics: {
    marketShare: 15,
    customerConcentration: 0.2,
    regulatoryRisk: 0.3,
    rdToRevenue: 0.12,
    digitalRevenue: 0.8,
  },
  benchmarks: {
    quartiles: {
      q1: {
        profitability: {
          ebitdaMargin: 0.15,
          roe: 0.06,
        },
      },
      median: {
        profitability: {
          ebitdaMargin: 0.2,
          roe: 0.08,
        },
      },
      q3: {
        profitability: {
          ebitdaMargin: 0.25,
          roe: 0.1,
        },
      },
    },
  },
};

const Analyses: React.FC = () => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <LineChart className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Analyses Financières</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Tendances Historiques</h2>
          </div>
          <HistoricalTrendAnalysis
            historicalData={mockHistoricalData}
            formatCurrency={formatCurrency}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Métriques Financières</h2>
          </div>
          <FinancialMetrics
            ratios={mockHistoricalData[0].ratios}
            industryAverages={mockIndustryMetrics.benchmarks.quartiles.median}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <IndustryBenchmark
            companyRatios={mockHistoricalData[0].ratios}
            industryMetrics={mockIndustryMetrics}
          />
        </div>
      </div>
    </div>
  );
};

export default Analyses;