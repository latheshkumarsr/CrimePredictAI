import { CrimeData, ModelMetrics, CrimeTrend, LocationHotspot } from '../types';

// Generate realistic crime data (fallback for when no dataset is uploaded)
export const generateCrimeData = (): CrimeData[] => {
  const crimeTypes = ['Theft', 'Burglary', 'Assault', 'Vandalism', 'Drug-related', 'Vehicle Crime', 'Robbery', 'Fraud'];
  const districts = ['Downtown', 'North Side', 'East End', 'West Village', 'South Bay', 'Central Park', 'Harbor District'];
  const severities: Array<'Low' | 'Medium' | 'High' | 'Critical'> = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: Array<'Open' | 'Under Investigation' | 'Closed' | 'Cold Case'> = ['Open', 'Under Investigation', 'Closed', 'Cold Case'];

  return Array.from({ length: 500 }, (_, i) => {
    const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
    const lng = -74.0060 + (Math.random() - 0.5) * 0.1;
    
    return {
      id: `crime-${i + 1}`,
      type,
      location: {
        lat,
        lng,
        address: `${Math.floor(Math.random() * 9999)} ${district} Street`,
        district
      },
      timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: `${type} incident reported in ${district} area`
    };
  });
};

export const modelMetrics: ModelMetrics[] = [
  {
    name: 'Random Forest',
    accuracy: 88.60,
    precision: 87.2,
    recall: 89.1,
    f1Score: 88.15,
    confusionMatrix: [[145, 12, 8, 3], [15, 132, 11, 6], [9, 8, 127, 14], [4, 7, 12, 119]]
  },
  {
    name: 'Support Vector Machine',
    accuracy: 84.30,
    precision: 83.5,
    recall: 84.8,
    f1Score: 84.15,
    confusionMatrix: [[138, 18, 12, 8], [22, 125, 15, 12], [14, 13, 118, 19], [8, 12, 18, 108]]
  },
  {
    name: 'Decision Tree',
    accuracy: 81.25,
    precision: 80.1,
    recall: 82.3,
    f1Score: 81.20,
    confusionMatrix: [[134, 22, 15, 5], [25, 120, 18, 11], [18, 16, 114, 16], [12, 15, 21, 104]]
  },
  {
    name: 'K-Nearest Neighbors',
    accuracy: 79.10,
    precision: 78.3,
    recall: 79.8,
    f1Score: 79.05,
    confusionMatrix: [[130, 25, 18, 3], [28, 118, 22, 6], [22, 20, 110, 12], [15, 18, 25, 98]]
  }
];

export const crimeTrends: CrimeTrend[] = [
  { month: 'Jan', count: 45, type: 'Theft' },
  { month: 'Feb', count: 38, type: 'Theft' },
  { month: 'Mar', count: 52, type: 'Theft' },
  { month: 'Apr', count: 48, type: 'Theft' },
  { month: 'May', count: 61, type: 'Theft' },
  { month: 'Jun', count: 68, type: 'Theft' },
  { month: 'Jul', count: 72, type: 'Theft' },
  { month: 'Aug', count: 69, type: 'Theft' },
  { month: 'Sep', count: 58, type: 'Theft' },
  { month: 'Oct', count: 54, type: 'Theft' },
  { month: 'Nov', count: 49, type: 'Theft' },
  { month: 'Dec', count: 43, type: 'Theft' },
  
  { month: 'Jan', count: 28, type: 'Burglary' },
  { month: 'Feb', count: 25, type: 'Burglary' },
  { month: 'Mar', count: 34, type: 'Burglary' },
  { month: 'Apr', count: 31, type: 'Burglary' },
  { month: 'May', count: 38, type: 'Burglary' },
  { month: 'Jun', count: 42, type: 'Burglary' },
  { month: 'Jul', count: 45, type: 'Burglary' },
  { month: 'Aug', count: 41, type: 'Burglary' },
  { month: 'Sep', count: 36, type: 'Burglary' },
  { month: 'Oct', count: 33, type: 'Burglary' },
  { month: 'Nov', count: 29, type: 'Burglary' },
  { month: 'Dec', count: 26, type: 'Burglary' },
];

export const locationHotspots: LocationHotspot[] = [
  { location: 'Downtown', count: 127, riskLevel: 'Critical' },
  { location: 'North Side', count: 89, riskLevel: 'High' },
  { location: 'East End', count: 76, riskLevel: 'High' },
  { location: 'Harbor District', count: 54, riskLevel: 'Medium' },
  { location: 'West Village', count: 43, riskLevel: 'Medium' },
  { location: 'South Bay', count: 38, riskLevel: 'Low' },
  { location: 'Central Park', count: 21, riskLevel: 'Low' },
];

// Default fallback data
export const defaultCrimeData = generateCrimeData();

// For backward compatibility
export const crimeData = defaultCrimeData;