import React from 'react';
import { TrendingUp, Activity, Scale, Wallet } from 'lucide-react';
import type { FinancialRatios } from '../types/valuation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface FinancialMetricsProps {
  ratios: FinancialRatios;
  industryAverages?: Partial<FinancialRatios>;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ ratios, industryAverages }) => {
  const profitabilityData = [
    { name: 'Marge brute', value: ratios.profitability.grossMargin * 100, avg: industryAverages?.profitability?.grossMargin ? industryAverages.profitability.grossMargin * 100 : null },
    { name: 'Marge EBITDA', value: ratios.profitability.ebitdaMargin * 100, avg: industryAverages?.profitability?.ebitdaMargin ? industryAverages.profitability.ebitdaMargin * 100 : null },
    { name: 'Marge nette', value: ratios.profitability.netMargin * 100, avg: industryAverages?.profitability?.netMargin ? industryAverages.profitability.netMargin * 100 : null },
    { name: 'ROE', value: ratios.profitability.roe * 100, avg: industryAverages?.profitability?.roe ? industryAverages.profitability.roe * 100 : null },
  ];

  const efficiencyData = [
    { metric: 'Rotation des actifs', value: ratios.efficiency.assetTurnover },
    { metric: 'Rotation des stocks', value: ratios.efficiency.inventoryTurnover },
    { metric: 'Rotation des créances', value: ratios.efficiency.receivablesTurnover },
    { metric: 'Rotation des dettes', value: ratios.efficiency.payablesTurnover },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Ratios de rentabilité</h2>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Entreprise" fill="#4F46E5" />
              {industryAverages && (
                <Bar dataKey="avg" name="Moyenne sectorielle" fill="#10B981" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Activity className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Efficacité opérationnelle</h2>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={efficiencyData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Radar
                name="Ratios d'efficacité"
                dataKey="value"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Scale className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Ratios de liquidité</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Ratio courant</p>
              <p className="text-lg font-semibold text-gray-900">
                {ratios.liquidity.currentRatio.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ratio rapide</p>
              <p className="text-lg font-semibold text-gray-900">
                {ratios.liquidity.quickRatio.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ratio de trésorerie</p>
              <p className="text-lg font-semibold text-gray-900">
                {ratios.liquidity.cashRatio.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Wallet className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Ratios d'endettement</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Dette / Fonds propres</p>
              <p className="text-lg font-semibold text-gray-900">
                {ratios.leverage.debtToEquity.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dette / EBITDA</p>
              <p className="text-lg font-semibold text-gray-900">
                {ratios.leverage.debtToEbitda.toFixed(2)}x
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Couverture des intérêts</p>
              <p className="text-lg font-semibold text-gray-900">
                {ratios.leverage.interestCoverage.toFixed(2)}x
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetrics;