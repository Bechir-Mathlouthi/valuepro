import React from 'react';
import { History, TrendingUp, BarChart2 } from 'lucide-react';
import type { HistoricalData } from '../types/valuation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface HistoricalTrendAnalysisProps {
  historicalData: HistoricalData[];
  formatCurrency: (value: number) => string;
}

const HistoricalTrendAnalysis: React.FC<HistoricalTrendAnalysisProps> = ({
  historicalData,
  formatCurrency,
}) => {
  const sortedData = [...historicalData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const marginData = sortedData.map(d => ({
    date: new Date(d.date).getFullYear(),
    'Marge EBITDA': d.ratios.profitability.ebitdaMargin * 100,
    'Marge nette': d.ratios.profitability.netMargin * 100,
    'Marge opérationnelle': d.ratios.profitability.operatingMargin * 100,
  }));

  const financialData = sortedData.map(d => ({
    date: new Date(d.date).getFullYear(),
    'Chiffre d\'affaires': d.financials.revenue,
    'EBITDA': d.financials.ebitda,
    'Résultat net': d.financials.netIncome,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <History className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Évolution des marges</h2>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marginData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Marge EBITDA" 
                stroke="#4F46E5" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="Marge nette" 
                stroke="#10B981" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="Marge opérationnelle" 
                stroke="#F59E0B" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <BarChart2 className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Performance financière</h2>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area
                type="monotone"
                dataKey="Chiffre d'affaires"
                stackId="1"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="EBITDA"
                stackId="2"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="Résultat net"
                stackId="3"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTrendAnalysis;