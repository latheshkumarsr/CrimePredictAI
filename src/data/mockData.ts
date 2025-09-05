import { CrimeData, ModelMetrics, CrimeTrend, LocationHotspot } from '../types';
import { largeIndianCrimeData } from './indianCrimeData';

// Generate realistic crime data with 1000 records
export const generateCrimeData = (count: number = 1000): CrimeData[] => {
  const crimeTypes = ['Theft', 'Burglary', 'Assault', 'Vandalism', 'Drug-related', 'Vehicle Crime', 'Robbery', 'Fraud', 'Domestic Violence', 'Public Disorder'];
  const districts = ['Downtown', 'North Side', 'East End', 'West Village', 'South Bay', 'Central Park', 'Harbor District', 'Industrial Zone', 'University Area', 'Residential Hills'];
  const severities: Array<'Low' | 'Medium' | 'High' | 'Critical'> = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: Array<'Open' | 'Under Investigation' | 'Closed' | 'Cold Case'> = ['Open', 'Under Investigation', 'Closed', 'Cold Case'];
  
  const streetNames = ['Main St', 'Oak Ave', 'Pine St', 'Elm Dr', 'Maple Ln', 'Cedar Rd', 'Birch Way', 'Willow Ct', 'Spruce Blvd', 'Ash Pl'];

  return Array.from({ length: count }, (_, i) => {
    const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    
    // Generate coordinates around NYC area with some variation
    const baseLat = 40.7128;
    const baseLng = -74.0060;
    const lat = baseLat + (Math.random() - 0.5) * 0.2; // Wider spread
    const lng = baseLng + (Math.random() - 0.5) * 0.2;
    
    // Generate realistic timestamps over the past year
    const now = new Date();
    const pastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const randomTime = new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
    
    // Weight severity based on crime type
    let severity: 'Low' | 'Medium' | 'High' | 'Critical';
    if (type === 'Assault' || type === 'Robbery' || type === 'Domestic Violence') {
      severity = Math.random() > 0.3 ? 'High' : 'Critical';
    } else if (type === 'Theft' || type === 'Burglary' || type === 'Vehicle Crime') {
      severity = Math.random() > 0.5 ? 'Medium' : 'High';
    } else {
      severity = severities[Math.floor(Math.random() * severities.length)];
    }
    
    return {
      id: `crime-${i + 1}`,
      type,
      location: {
        lat,
        lng,
        address: `${Math.floor(Math.random() * 9999)} ${streetName}`,
        district
      },
      timestamp: randomTime,
      severity,
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

// Generate comprehensive crime trends
export const generateCrimeTrends = (crimeData: CrimeData[]): CrimeTrend[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const crimeTypes = ['Theft', 'Burglary', 'Assault', 'Vandalism', 'Drug-related'];
  const trends: CrimeTrend[] = [];

  crimeTypes.forEach(type => {
    months.forEach(month => {
      const monthIndex = months.indexOf(month);
      const count = crimeData.filter(crime => {
        const crimeMonth = crime.timestamp.getMonth();
        return crime.type === type && crimeMonth === monthIndex;
      }).length;
      
      trends.push({ month, count, type });
    });
  });

  return trends;
};

// Generate location hotspots from actual data
export const generateLocationHotspots = (crimeData: CrimeData[]): LocationHotspot[] => {
  const locationCounts: Record<string, number> = {};
  
  crimeData.forEach(crime => {
    locationCounts[crime.location.district] = (locationCounts[crime.location.district] || 0) + 1;
  });

  return Object.entries(locationCounts)
    .map(([location, count]) => ({
      location,
      count,
      riskLevel: count > 80 ? 'Critical' : count > 50 ? 'High' : count > 25 ? 'Medium' : 'Low' as 'Low' | 'Medium' | 'High' | 'Critical'
    }))
    .sort((a, b) => b.count - a.count);
};

// Default dataset with 1000 records
export const defaultCrimeData = [...generateCrimeData(1000), ...largeIndianCrimeData];
export const defaultCrimeTrends = generateCrimeTrends(defaultCrimeData);
export const defaultLocationHotspots = generateLocationHotspots(defaultCrimeData);

// For backward compatibility
export const crimeData = defaultCrimeData;
export const crimeTrends = defaultCrimeTrends;
export const locationHotspots = defaultLocationHotspots;