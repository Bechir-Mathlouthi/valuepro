import React from 'react';
import { Users, ArrowUpDown } from 'lucide-react';
import type { CompanyData } from '../types/valuation';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface MultiCompanyComparisonProps {
  companies: CompanyData[];
  formatCurrency: (value: number) => string;
}

const MultiCompanyComparison: React.FC<MultiCompanyComparisonProps> = ({
  companies,
  formatCurrency,
}) => {
  const metrics = [
    { key: 'ebitdaMargin', label: 'Marge EBITDA' },
    { key: 'netMargin', label: 'Marge nette' },
    { key: 'roa', label: 'ROA' },
    { key: 'roe', label: 'ROE' },
    { key: 'currentRatio', label: 'Ratio courant' },
    { key: 'debtToEbitda', label: 'Dette/EBITDA' },
  ];

  const radarData = metrics.map(metric => ({
    metric: metric.label,
    ...companies.reduce((acc, company) => {
      let value;
      if (metric.key.includes('Margin')) {
        value = company.ratios.profitability[metric.key] * 100;
      } else if (metric.key === 'currentRatio') {
        value = company.ratios.liquidity.currentRatio;
      } else if (metric.key === 'debtToEbitda') {
        value = company.ratios.leverage.debtToEbitda;
      } else {
        value = company.ratios.profitability[metric.key] * 100;
      }
      return { ...acc, [company.name]: value };
    }, {}),
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Comparaison multi-entreprises</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Tooltip />
              <Legend />
              {companies.map((company, index) => (
                <Radar
                  key={company.name}
                  name={company.name}
                  dataKey={company.name}
                  stroke={`hsl(${index * (360 / companies.length)}, 70%, 50%)`}
                  fill={`hsl(${index * (360 / companies.length)}, 70%, 50%)`}
                  fillOpacity={0.3}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                  Métrique
                </th>
                {companies.map(company => (
                  <th
                    key={company.name}
                    className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {company.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Chiffre d'affaires
                </td>
                {companies.map(company => (
                  <td key={company.name} className="px-4 py-3 text-sm text-gray-900">
                    {formatCurrency(company.financials.revenue)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  EBITDA
                </td>
                {companies.map(company => (
                  <td key={company.name} className="px-4 py-3 text-sm text-gray-900">
                    {formatCurrency(company.financials.ebitda)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Résultat net
                </td>
                {companies.map(company => (
                  <td key={company.name} className="px-4 py-3 text-sm text-gray-900">
                    {formatCurrency(company.financials.netIncome)}
                  </td>
                ))}
              </tr>
              {metrics.map(metric => (
                <tr key={metric.key}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {metric.label}
                  </td>
                  {companies.map(company => {
                    let value;
                    if (metric.key.includes('Margin')) {
                      value = `${(company.ratios.profitability[metric.key] * 100).toFixed(1)}%`;
                    } else if (metric.key === 'currentRatio') {
                      value = company.ratios.liquidity.currentRatio.toFixed(2);
                    } else if (metric.key === 'debtToEbitda') {
                      value = `${company.ratios.leverage.debtToEbitda.toFixed(2)}x`;
                    } else {
                      value = `${(company.ratios.profitability[metric.key] * 100).toFixed(1)}%`;
                    }
                    return (
                      <td key={company.name} className="px-4 py-3 text-sm text-gray-900">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MultiCompanyComparison;