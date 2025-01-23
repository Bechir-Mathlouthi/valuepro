import type { ExportOptions, CompanyData, ValuationResult } from '../types/valuation';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table } from 'docx';

export const exportValuation = async (
  format: ExportOptions['format'],
  data: {
    company: CompanyData;
    valuation: ValuationResult;
  },
  options: ExportOptions
): Promise<Blob> => {
  switch (format) {
    case 'excel':
      return exportToExcel(data, options);
    case 'pdf':
      return exportToPDF(data, options);
    case 'powerpoint':
      return exportToPowerPoint(data, options);
    case 'word':
      return exportToWord(data, options);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

const exportToExcel = async (
  data: any,
  options: ExportOptions
): Promise<Blob> => {
  const workbook = XLSX.utils.book_new();

  if (options.sections.companyOverview) {
    const overviewSheet = XLSX.utils.json_to_sheet([
      {
        Company: data.company.name,
        Sector: data.company.sector,
        Revenue: data.company.financials.revenue,
        EBITDA: data.company.financials.ebitda,
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Company Overview');
  }

  if (options.sections.valuation) {
    const valuationSheet = XLSX.utils.json_to_sheet([
      {
        Method: 'DCF',
        Value: data.valuation.dcfValue,
      },
      {
        Method: 'Comparables',
        Value: data.valuation.comparablesValue,
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, valuationSheet, 'Valuation');
  }

  // Add more sections based on options...

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

const exportToPDF = async (
  data: any,
  options: ExportOptions
): Promise<Blob> => {
  const doc = new jsPDF();
  let y = 20;

  if (options.sections.companyOverview) {
    doc.setFontSize(16);
    doc.text('Company Overview', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Company: ${data.company.name}`, 20, y);
    y += 10;
    doc.text(`Sector: ${data.company.sector}`, 20, y);
    y += 20;
  }

  // Add more sections based on options...

  return doc.output('blob');
};

const exportToPowerPoint = async (
  data: any,
  options: ExportOptions
): Promise<Blob> => {
  const pres = new pptxgen();

  if (options.sections.companyOverview) {
    const slide = pres.addSlide();
    slide.addText('Company Overview', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.5,
      fontSize: 24,
    });
    // Add more content...
  }

  // Add more slides based on options...

  return pres.write('blob');
};

const exportToWord = async (
  data: any,
  options: ExportOptions
): Promise<Blob> => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'Valuation Report',
            heading: 'Title',
          }),
          // Add more content based on options...
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};