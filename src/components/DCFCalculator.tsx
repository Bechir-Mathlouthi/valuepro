import React, { useState } from 'react';
import { Calculator, TrendingUp, ArrowRight } from 'lucide-react';

interface CashFlow {
  year: number;
  revenue: number;
  growthRate: number;
  ebitdaMargin: number;
  capex: number;
  workingCapital: number;
}

const DCFCalculator: React.FC = () => {
  const [wacc, setWacc] = useState<number>(10);
  const [perpetualGrowth, setPerpetualGrowth] = useState<number>(2);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    {
      year: 1,
      revenue: 1000000,
      growthRate: 5,
      ebitdaMargin: 15,
      capex: 50000,
      workingCapital: 100000,
    },
  ]);

  const addYear = () => {
    const lastYear = cashFlows[cashFlows.length - 1];
    const newYear: CashFlow = {
      year: lastYear.year + 1,
      revenue: lastYear.revenue * (1 + lastYear.growthRate / 100),
      growthRate: lastYear.growthRate,
      ebitdaMargin: lastYear.ebitdaMargin,
      capex: lastYear.capex,
      workingCapital: lastYear.workingCapital,
    };
    setCashFlows([...cashFlows, newYear]);
  };

  const calculateDCF = () => {
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

  const calculateFreeCashFlow = (cf: CashFlow): number => {
    const ebitda = cf.revenue * (cf.ebitdaMargin / 100);
    return ebitda - cf.capex - cf.workingCapital;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Calculateur DCF</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WACC (%)
          </label>
          <input
            type="number"
            value={wacc}
            onChange={(e) => setWacc(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Croissance perpétuelle (%)
          </label>
          <input
            type="number"
            value={perpetualGrowth}
            onChange={(e) => setPerpetualGrowth(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Flux de trésorerie</h3>
          <button
            onClick={addYear}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Ajouter une année
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">CA</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Croissance (%)</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Marge EBITDA (%)</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">CAPEX</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">BFR</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cashFlows.map((cf, index) => (
                <tr key={cf.year}>
                  <td className="px-4 py-3 text-sm text-gray-900">Année {cf.year}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={cf.revenue}
                      onChange={(e) => {
                        const newCashFlows = [...cashFlows];
                        newCashFlows[index].revenue = Number(e.target.value);
                        setCashFlows(newCashFlows);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={cf.growthRate}
                      onChange={(e) => {
                        const newCashFlows = [...cashFlows];
                        newCashFlows[index].growthRate = Number(e.target.value);
                        setCashFlows(newCashFlows);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={cf.ebitdaMargin}
                      onChange={(e) => {
                        const newCashFlows = [...cashFlows];
                        newCashFlows[index].ebitdaMargin = Number(e.target.value);
                        setCashFlows(newCashFlows);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={cf.capex}
                      onChange={(e) => {
                        const newCashFlows = [...cashFlows];
                        newCashFlows[index].capex = Number(e.target.value);
                        setCashFlows(newCashFlows);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={cf.workingCapital}
                      onChange={(e) => {
                        const newCashFlows = [...cashFlows];
                        newCashFlows[index].workingCapital = Number(e.target.value);
                        setCashFlows(newCashFlows);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-lg font-medium text-gray-900">Valeur d'entreprise</span>
          </div>
          <div className="flex items-center">
            <ArrowRight className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-2xl font-bold text-indigo-600">
              {formatCurrency(calculateDCF())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DCFCalculator;