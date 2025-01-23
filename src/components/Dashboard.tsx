import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import type { CompanyData, ValuationResult } from '../types/valuation';
import ValuationCard from './ValuationCard';
import DCFCalculator from './DCFCalculator';
import ImportData from './ImportData';
import ComparableAnalysis from './ComparableAnalysis';
import SensitivityAnalysis from './SensitivityAnalysis';
import ValuationReport from './ValuationReport';

const Dashboard = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationResult>({
    dcfValue: 2500000,
    comparablesValue: 3100000,
    averageValue: 2800000,
    sensitivityMatrix: {
      wacc: [8, 9, 10, 11, 12],
      perpetualGrowth: [1, 1.5, 2, 2.5, 3],
      results: [
        [3000000, 3200000, 3400000, 3600000, 3800000],
        [2800000, 3000000, 3200000, 3400000, 3600000],
        [2600000, 2800000, 3000000, 3200000, 3400000],
        [2400000, 2600000, 2800000, 3000000, 3200000],
        [2200000, 2400000, 2600000, 2800000, 3000000],
      ],
    },
  });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const metrics = [
    {
      title: 'Valorisation DCF',
      value: formatCurrency(valuationResult.dcfValue),
      change: '+14.6%',
      icon: TrendingUp,
    },
    {
      title: 'Multiple EV/EBITDA',
      value: '8.2x',
      change: '+2.3%',
      icon: Activity,
    },
    {
      title: 'Comparables',
      value: companyData?.comparables.length.toString() || '12',
      change: `Secteur ${companyData?.sector || 'Tech'}`,
      icon: Users,
    },
    {
      title: 'Valeur d\'entreprise',
      value: formatCurrency(valuationResult.averageValue),
      change: 'Moyenne',
      icon: DollarSign,
    },
  ];

  const handleDataImport = (data: CompanyData) => {
    setCompanyData(data);
    // Update valuation results based on imported data
    // This would involve recalculating all the valuations
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <ValuationCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>

      <ImportData onDataImport={handleDataImport} />
      
      <DCFCalculator />

      {companyData && (
        <>
          <ComparableAnalysis
            comparables={companyData.comparables}
            companyName={companyData.name}
            companyMetrics={{
              evToEbitda: 7.5,
              peRatio: 15.2,
              evToRevenue: 2.1,
            }}
          />

          <SensitivityAnalysis
            data={valuationResult.sensitivityMatrix}
            formatCurrency={formatCurrency}
          />

          <ValuationReport
            companyData={companyData}
            valuationResult={valuationResult}
            formatCurrency={formatCurrency}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;