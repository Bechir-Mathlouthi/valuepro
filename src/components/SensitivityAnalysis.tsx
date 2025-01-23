import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { SensitivityAnalysis as SensitivityData } from '../types/valuation';

interface SensitivityAnalysisProps {
  data: SensitivityData;
  formatCurrency: (value: number) => string;
}

const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({ data, formatCurrency }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Analyse de sensibilité</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">WACC / g</th>
              {data.perpetualGrowth.map((g) => (
                <th key={g} className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                  {g}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.wacc.map((wacc, i) => (
              <tr key={wacc}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{wacc}%</td>
                {data.results[i].map((value, j) => (
                  <td
                    key={`${i}-${j}`}
                    className={`px-4 py-3 text-sm ${
                      value === Math.max(...data.results.flat())
                        ? 'bg-green-100 text-green-800'
                        : value === Math.min(...data.results.flat())
                        ? 'bg-red-100 text-red-800'
                        : 'text-gray-900'
                    }`}
                  >
                    {formatCurrency(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          Cette analyse montre l'impact de la variation du WACC et du taux de croissance perpétuelle sur la valeur de l'entreprise.
          Les valeurs en vert représentent le scénario le plus optimiste, tandis que celles en rouge représentent le scénario le plus pessimiste.
        </p>
      </div>
    </div>
  );
};

export default SensitivityAnalysis;