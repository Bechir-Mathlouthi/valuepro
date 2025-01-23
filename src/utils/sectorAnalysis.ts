import type { SectorSpecificMetrics, ValidationRules } from '../types/valuation';

export const getSectorValidationRules = (sector: string): ValidationRules[] => {
  const commonRules: ValidationRules[] = [
    {
      type: 'error',
      field: 'revenue',
      condition: 'Revenue must be positive',
      comparator: 'gt',
      threshold: 0,
      severity: 3,
    },
    {
      type: 'warning',
      field: 'profitability.ebitdaMargin',
      condition: 'EBITDA margin should be reasonable',
      comparator: 'between',
      threshold: 0.5,
      severity: 2,
    },
  ];

  const sectorRules: Record<string, ValidationRules[]> = {
    technology: [
      {
        type: 'warning',
        field: 'technology.churnRate',
        condition: 'Churn rate should be below industry average',
        comparator: 'lt',
        threshold: 0.15,
        severity: 2,
      },
      {
        type: 'error',
        field: 'technology.arpu',
        condition: 'ARPU must be positive',
        comparator: 'gt',
        threshold: 0,
        severity: 3,
      },
    ],
    manufacturing: [
      {
        type: 'warning',
        field: 'manufacturing.capacityUtilization',
        condition: 'Capacity utilization should be optimal',
        comparator: 'between',
        threshold: 0.7,
        severity: 2,
      },
    ],
    // Add rules for other sectors
  };

  return [...commonRules, ...(sectorRules[sector] || [])];
};

export const calculateSectorMetrics = (
  sector: string,
  data: any
): SectorSpecificMetrics => {
  switch (sector) {
    case 'technology':
      return {
        technology: {
          arpu: calculateARPU(data),
          userAcquisitionCost: calculateCAC(data),
          churnRate: calculateChurnRate(data),
          monthlyActiveUsers: data.activeUsers || 0,
          lifetimeValue: calculateLTV(data),
          paybackPeriod: calculatePaybackPeriod(data),
        },
      };
    case 'manufacturing':
      return {
        manufacturing: {
          capacityUtilization: calculateCapacityUtilization(data),
          orderBacklog: calculateOrderBacklog(data),
          supplierConcentration: calculateSupplierConcentration(data),
          rawMaterialCosts: data.rawMaterialCosts || 0,
          productionEfficiency: calculateProductionEfficiency(data),
          qualityMetrics: calculateQualityMetrics(data),
        },
      };
    // Add calculations for other sectors
    default:
      return {};
  }
};

// Helper functions for metric calculations
const calculateARPU = (data: any): number => {
  return data.revenue / data.activeUsers || 0;
};

const calculateCAC = (data: any): number => {
  return data.marketingCosts / data.newUsers || 0;
};

const calculateChurnRate = (data: any): number => {
  return data.churnedUsers / data.totalUsers || 0;
};

const calculateLTV = (data: any): number => {
  const arpu = calculateARPU(data);
  const churnRate = calculateChurnRate(data);
  return arpu / churnRate;
};

const calculatePaybackPeriod = (data: any): number => {
  const cac = calculateCAC(data);
  const arpu = calculateARPU(data);
  return cac / arpu;
};

const calculateCapacityUtilization = (data: any): number => {
  return data.actualProduction / data.totalCapacity || 0;
};

const calculateOrderBacklog = (data: any): number => {
  return data.orderBacklogValue / data.revenue || 0;
};

const calculateSupplierConcentration = (data: any): number => {
  return data.topSupplierPurchases / data.totalPurchases || 0;
};

const calculateProductionEfficiency = (data: any): number => {
  return data.outputUnits / data.inputUnits || 0;
};

const calculateQualityMetrics = (data: any): number => {
  return 1 - (data.defectiveUnits / data.totalUnits || 0);
};