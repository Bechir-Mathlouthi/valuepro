import React from 'react';
import { Target, TrendingUp, Activity } from 'lucide-react';
import type { IndustryMetrics, FinancialRatios } from '../types/valuation';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface IndustryBenchmarkProps {
  companyRatios: FinancialRatios;
  industryMetrics: IndustryMetrics;
}

const IndustryBenchmark: React.FC<IndustryBenchmarkProps> = ({
  companyRatios,
  industryMetrics,
}) => {
  const profitabilityData = [
    {
      metric: 'Marge EBITDA',
      company: companyRatios.profitability.ebitdaMargin * 100,
      q1: industryMetrics.benchmarks.quartiles.q1.profitability?.ebitdaMargin! * 100,
      median: industryMetrics.benchmarks.quartiles.median.profitability?.ebitdaMargin! * 100,
      q3: industryMetrics.benchmarks.quartiles.q3.profitability?.ebitdaMargin! * 100,
    },
    {
      metric: 'ROE',
      company: companyRatios.profitability.roe * 100,
      q1: industryMetrics.benchmarks.quartiles.q1.profitability?.roe! * 100,
      median: industryMetrics.benchmarks.quartiles.median.profitability?.roe! * 100,
      q3: industryMetrics.benchmarks.quartiles.q3.profitability?.roe! * 100,
    },
    // Add more metrics as needed
  ];

  const industrySpecificData = [
    { metric: 'Part de marché', value: industryMetrics.metrics.marketShare },
    { metric: 'Concentration clients', value: industryMetrics.metrics.customerConcentration },
    { metric: 'Risque réglementaire', value: industryMetrics.metrics.regulatoryRisk },
    { metric: 'Innovation (R&D/CA)', value: industryMetrics.metrics.rdToRevenue },
    { metric: 'Digital (% CA)', value: industryMetrics.metrics.digitalRevenue },
  ].filter(item => item.value !== undefined);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Target className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Benchmark sectoriel</h2>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="company" name="Entreprise" fill="#4F46E5" />
              <Bar dataKey="q1" name="Q1" fill="#D1D5DB" />
              <Bar dataKey="median" name="Médiane" fill="#9CA3AF" />
              <Bar dataKey="q3" name="Q3" fill="#6B7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Activity className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Métriques sectorielles</h2>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={industrySpecificData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Radar
                name="Métriques"
                dataKey="value"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IndustryBenchmark;