import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';

interface ParametersProps {
  onSave?: (parameters: any) => void;
}

const Parameters: React.FC<ParametersProps> = ({ onSave }) => {
  const [parameters, setParameters] = useState({
    general: {
      currency: 'EUR',
      language: 'fr',
      dateFormat: 'DD/MM/YYYY',
    },
    valuation: {
      defaultWacc: 10,
      defaultGrowthRate: 2,
      defaultTaxRate: 25,
      projectionYears: 5,
    },
    display: {
      showCharts: true,
      showTables: true,
      decimalPlaces: 2,
    },
    export: {
      includeLogo: true,
      defaultFormat: 'pdf',
      companyName: '',
      companyLogo: '',
    },
  });

  const handleSave = () => {
    localStorage.setItem('valuationParameters', JSON.stringify(parameters));
    onSave?.(parameters);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Paramètres généraux</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Devise</label>
              <select
                value={parameters.general.currency}
                onChange={(e) => setParameters({
                  ...parameters,
                  general: { ...parameters.general, currency: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Langue</label>
              <select
                value={parameters.general.language}
                onChange={(e) => setParameters({
                  ...parameters,
                  general: { ...parameters.general, language: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Paramètres de valorisation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">WACC par défaut (%)</label>
              <input
                type="number"
                value={parameters.valuation.defaultWacc}
                onChange={(e) => setParameters({
                  ...parameters,
                  valuation: { ...parameters.valuation, defaultWacc: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taux de croissance (%)</label>
              <input
                type="number"
                value={parameters.valuation.defaultGrowthRate}
                onChange={(e) => setParameters({
                  ...parameters,
                  valuation: { ...parameters.valuation, defaultGrowthRate: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taux d'imposition (%)</label>
              <input
                type="number"
                value={parameters.valuation.defaultTaxRate}
                onChange={(e) => setParameters({
                  ...parameters,
                  valuation: { ...parameters.valuation, defaultTaxRate: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Années de projection</label>
              <input
                type="number"
                value={parameters.valuation.projectionYears}
                onChange={(e) => setParameters({
                  ...parameters,
                  valuation: { ...parameters.valuation, projectionYears: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Paramètres d'affichage</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={parameters.display.showCharts}
                onChange={(e) => setParameters({
                  ...parameters,
                  display: { ...parameters.display, showCharts: e.target.checked }
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Afficher les graphiques
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={parameters.display.showTables}
                onChange={(e) => setParameters({
                  ...parameters,
                  display: { ...parameters.display, showTables: e.target.checked }
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Afficher les tableaux
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Paramètres d'export</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Format par défaut</label>
              <select
                value={parameters.export.defaultFormat}
                onChange={(e) => setParameters({
                  ...parameters,
                  export: { ...parameters.export, defaultFormat: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
                <option value="powerpoint">PowerPoint</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
              <input
                type="text"
                value={parameters.export.companyName}
                onChange={(e) => setParameters({
                  ...parameters,
                  export: { ...parameters.export, companyName: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parameters;