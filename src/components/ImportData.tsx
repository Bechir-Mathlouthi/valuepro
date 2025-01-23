import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { CompanyData } from '../types/valuation';

interface ImportDataProps {
  onDataImport: (data: CompanyData) => void;
}

const ImportData: React.FC<ImportDataProps> = ({ onDataImport }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          const parsedData = transformCSVData(results.data);
          onDataImport(parsedData);
        },
        header: true,
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const parsedData = transformExcelData(jsonData);
        onDataImport(parsedData);
      };
      reader.readAsBinaryString(file);
    }
  }, [onDataImport]);

  const transformCSVData = (data: any[]): CompanyData => {
    // Transform CSV data to CompanyData structure
    return {
      name: data[0]?.['Company Name'] || '',
      sector: data[0]?.['Sector'] || '',
      financials: {
        revenue: Number(data[0]?.['Revenue']) || 0,
        ebitda: Number(data[0]?.['EBITDA']) || 0,
        netIncome: Number(data[0]?.['Net Income']) || 0,
        totalAssets: Number(data[0]?.['Total Assets']) || 0,
        totalDebt: Number(data[0]?.['Total Debt']) || 0,
        cashAndEquivalents: Number(data[0]?.['Cash and Equivalents']) || 0,
      },
      comparables: data.slice(1).map((row) => ({
        name: row['Comparable Company'] || '',
        evToEbitda: Number(row['EV/EBITDA']) || 0,
        peRatio: Number(row['P/E Ratio']) || 0,
        evToRevenue: Number(row['EV/Revenue']) || 0,
      })),
    };
  };

  const transformExcelData = (data: any[]): CompanyData => {
    // Similar transformation for Excel data
    return transformCSVData(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center mb-4">
        <FileSpreadsheet className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Importer des données</h2>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier Excel ou CSV
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                <span>Télécharger un fichier</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              CSV, XLS, ou XLSX jusqu'à 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportData;