import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import type { ComparableCompany } from '../types/valuation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComparableAnalysisProps {
  comparables: ComparableCompany[];
  companyName: string;
  companyMetrics: {
    evToEbitda: number;
    peRatio: number;
    evToRevenue: number;
  };
}

const ComparableAnalysis: React.FC<ComparableAnalysisProps> = ({
  comparables,
  companyName,
  companyMetrics,
}) => {
  const chartData = comparables.map((comp) => ({
    name: comp.name,
    'EV/EBITDA': comp.evToEbitda,
    'P/E': comp.peRatio,
    'EV/Revenue': comp.evToRevenue,
  }));

  // Add company's own metrics
  chartData.push({
    name: companyName,
    'EV/EBITDA': companyMetrics.evToEbitda,
    'P/E': companyMetrics.peRatio,
    'EV/Revenue': companyMetrics.evToRevenue,
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Users className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Analyse des comparables</h2>
      </div>

      <div className="mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">EV/EBITDA</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">P/E Ratio</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">EV/Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparables.map((company) => (
                <tr key={company.name}>
                  <td className="px-4 py-3 text-sm text-gray-900">{company.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{company.evToEbitda.toFixed(2)}x</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{company.peRatio.toFixed(2)}x</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{company.evToRevenue.toFixed(2)}x</td>
                </tr>
              ))}
              <tr className="bg-indigo-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{companyName}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{companyMetrics.evToEbitda.toFixed(2)}x</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{companyMetrics.peRatio.toFixed(2)}x</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{companyMetrics.evToRevenue.toFixed(2)}x</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="EV/EBITDA" stroke="#4F46E5" />
            <Line type="monotone" dataKey="P/E" stroke="#10B981" />
            <Line type="monotone" dataKey="EV/Revenue" stroke="#F59E0B" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparableAnalysis;