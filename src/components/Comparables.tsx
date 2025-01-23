import React, { useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import MultiCompanyComparison from './MultiCompanyComparison';
import type { CompanyData } from '../types/valuation';

const mockCompanies: CompanyData[] = [
  {
    name: 'TechCorp',
    sector: 'Technology',
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
    comparables: [],
    historicalData: [],
  },
  // Add more mock companies...
];

const Comparables: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyData[]>([mockCompanies[0]]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredCompanies = mockCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCompany = (company: CompanyData) => {
    if (selectedCompanies.length < 5 && !selectedCompanies.find(c => c.name === company.name)) {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const removeCompany = (companyName: string) => {
    setSelectedCompanies(selectedCompanies.filter(c => c.name !== companyName));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Comparables</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Entreprises sélectionnées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCompanies.map(company => (
              <div
                key={company.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-gray-500">{company.sector}</p>
                </div>
                <button
                  onClick={() => removeCompany(company.name)}
                  className="text-red-600 hover:text-red-800"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedCompanies.length > 0 && (
          <MultiCompanyComparison
            companies={selectedCompanies}
            formatCurrency={formatCurrency}
          />
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Ajouter des comparables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map(company => (
              <div
                key={company.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-gray-500">{company.sector}</p>
                </div>
                <button
                  onClick={() => addCompany(company)}
                  className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                  disabled={selectedCompanies.find(c => c.name === company.name)}
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparables;