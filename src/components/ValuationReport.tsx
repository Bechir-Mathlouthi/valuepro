import React from 'react';
import { FileText, Download } from 'lucide-react';
import type { ValuationResult, CompanyData } from '../types/valuation';

interface ValuationReportProps {
  companyData: CompanyData;
  valuationResult: ValuationResult;
  formatCurrency: (value: number) => string;
}

const ValuationReport: React.FC<ValuationReportProps> = ({
  companyData,
  valuationResult,
  formatCurrency,
}) => {
  const generatePDF = () => {
    // In a real implementation, we would use a PDF generation library
    // For now, we'll just create a text version
    const content = `
      Rapport de valorisation - ${companyData.name}
      Secteur: ${companyData.sector}
      
      1. Résumé des valorisations
         DCF: ${formatCurrency(valuationResult.dcfValue)}
         Comparables: ${formatCurrency(valuationResult.comparablesValue)}
         Moyenne: ${formatCurrency(valuationResult.averageValue)}
      
      2. Données financières
         Chiffre d'affaires: ${formatCurrency(companyData.financials.revenue)}
         EBITDA: ${formatCurrency(companyData.financials.ebitda)}
         Résultat net: ${formatCurrency(companyData.financials.netIncome)}
      
      3. Analyse des comparables
         Nombre de comparables: ${companyData.comparables.length}
         Moyenne EV/EBITDA: ${(companyData.comparables.reduce((acc, comp) => acc + comp.evToEbitda, 0) / companyData.comparables.length).toFixed(2)}x
      
      4. Analyse de sensibilité
         WACC min: ${Math.min(...valuationResult.sensitivityMatrix.wacc)}%
         WACC max: ${Math.max(...valuationResult.sensitivityMatrix.wacc)}%
         Croissance min: ${Math.min(...valuationResult.sensitivityMatrix.perpetualGrowth)}%
         Croissance max: ${Math.max(...valuationResult.sensitivityMatrix.perpetualGrowth)}%
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valuation-report-${companyData.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Rapport de valorisation</h2>
        </div>
        <button
          onClick={generatePDF}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger le rapport
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Résumé des valorisations</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">DCF</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(valuationResult.dcfValue)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Comparables</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(valuationResult.comparablesValue)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Moyenne</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(valuationResult.averageValue)}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Données financières clés</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Chiffre d'affaires</p>
              <p className="text-base font-medium text-gray-900">
                {formatCurrency(companyData.financials.revenue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">EBITDA</p>
              <p className="text-base font-medium text-gray-900">
                {formatCurrency(companyData.financials.ebitda)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dette nette</p>
              <p className="text-base font-medium text-gray-900">
                {formatCurrency(companyData.financials.totalDebt - companyData.financials.cashAndEquivalents)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Résultat net</p>
              <p className="text-base font-medium text-gray-900">
                {formatCurrency(companyData.financials.netIncome)}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Méthodologie</h3>
          <div className="prose prose-sm text-gray-500">
            <p>
              La valorisation a été réalisée en utilisant deux méthodes principales :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                La méthode DCF (Discounted Cash Flow) qui actualise les flux de trésorerie futurs
                avec un WACC de {valuationResult.sensitivityMatrix.wacc[0]}% et une croissance perpétuelle
                de {valuationResult.sensitivityMatrix.perpetualGrowth[0]}%.
              </li>
              <li>
                L'analyse des comparables basée sur un échantillon de {companyData.comparables.length} entreprises
                du secteur {companyData.sector}.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ValuationReport;