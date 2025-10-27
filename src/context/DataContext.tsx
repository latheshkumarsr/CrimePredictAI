import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CrimeData, CrimeTrend, LocationHotspot } from '../types';
import { googleSheetsService, CrimeRecord } from '../services/googleSheetsService';

interface DatasetInfo {
  id: string;
  name: string;
  uploadDate: Date;
  size: number;
  rows: number;
  columns: string[];
}

interface DataContextType {
  currentDataset: DatasetInfo | null;
  availableDatasets: DatasetInfo[];
  crimeData: CrimeData[];
  crimeTrends: CrimeTrend[];
  locationHotspots: LocationHotspot[];
  isLoading: boolean;
  error: string | null;
  uploadDataset: (file: File, data: CrimeData[]) => Promise<void>;
  selectDataset: (datasetId: string) => Promise<void>;
  refreshDashboard: () => void;
}

// Convert Google Sheets record to CrimeData format
const convertToCrimeData = (record: CrimeRecord): CrimeData => {
  return {
    id: record.id,
    type: record.crime_type,
    location: {
      lat: record.latitude,
      lng: record.longitude,
      address: record.location,
      district: record.district
    },
    timestamp: new Date(`${record.date} ${record.time}`),
    severity: record.severity as 'Low' | 'Medium' | 'High' | 'Critical',
    status: (record.status || 'Open') as 'Open' | 'Under Investigation' | 'Closed' | 'Cold Case',
    description: record.description || `${record.crime_type} incident reported in ${record.district}`
  };
};

// Generate analytics from crime data
const generateCrimeTrends = (data: CrimeData[]): CrimeTrend[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const crimeTypes = ['Theft', 'Burglary', 'Assault', 'Vandalism', 'Drug-related'];
  const trends: CrimeTrend[] = [];

  crimeTypes.forEach(type => {
    months.forEach(month => {
      const monthIndex = months.indexOf(month);
      const count = data.filter(crime => {
        const crimeMonth = crime.timestamp.getMonth();
        return crime.type === type && crimeMonth === monthIndex;
      }).length;
      
      trends.push({ month, count, type });
    });
  });

  return trends;
};

// Generate location hotspots from actual data
const generateLocationHotspots = (data: CrimeData[]): LocationHotspot[] => {
  const locationCounts: Record<string, number> = {};
  
  data.forEach(crime => {
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

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Google Sheets dataset
  const googleSheetsDataset: DatasetInfo = {
    id: 'google-sheets-dataset',
    name: 'Google Sheets Crime Database (Live)',
    uploadDate: new Date(),
    size: 0, // Will be calculated dynamically
    rows: 0, // Will be calculated dynamically
    columns: ['id', 'date', 'time', 'location', 'latitude', 'longitude', 'crime_type', 'severity', 'district', 'city', 'state', 'description', 'status']
  };

  const [currentDataset, setCurrentDataset] = useState<DatasetInfo>(googleSheetsDataset);
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([googleSheetsDataset]);
  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
  const [crimeTrends, setCrimeTrends] = useState<CrimeTrend[]>([]);
  const [locationHotspots, setLocationHotspots] = useState<LocationHotspot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from Google Sheets
  const loadGoogleSheetsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const records = await googleSheetsService.readAllData();
      const crimeDataFromSheets = records.map(convertToCrimeData);
      
      // Update dataset info
      const updatedDataset = {
        ...googleSheetsDataset,
        rows: records.length,
        size: records.length * 100 // Approximate size
      };
      
      setCurrentDataset(updatedDataset);
      setAvailableDatasets([updatedDataset]);
      setCrimeData(crimeDataFromSheets);
      setCrimeTrends(generateCrimeTrends(crimeDataFromSheets));
      setLocationHotspots(generateLocationHotspots(crimeDataFromSheets));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data from Google Sheets');
      console.error('Error loading Google Sheets data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadDataset = useCallback(async (file: File, data: CrimeData[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert CrimeData to CrimeRecord format
      const records: CrimeRecord[] = data.map(crime => ({
        id: crime.id,
        date: crime.timestamp.toISOString().split('T')[0],
        time: crime.timestamp.toTimeString().split(' ')[0],
        location: crime.location.address,
        latitude: crime.location.lat,
        longitude: crime.location.lng,
        crime_type: crime.type,
        severity: crime.severity,
        district: crime.location.district,
        city: '',
        state: '',
        description: crime.description,
        status: crime.status
      }));

      // Clear existing data and add new records
      await googleSheetsService.clearAllData();
      await googleSheetsService.addRecords(records);
      
      // Reload data from sheets
      await loadGoogleSheetsData();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload to Google Sheets');
    } finally {
      setIsLoading(false);
    }
  }, [loadGoogleSheetsData]);

  const selectDataset = useCallback(async (datasetId: string) => {
    // Only Google Sheets dataset is available
    if (datasetId === 'google-sheets-dataset') {
      await loadGoogleSheetsData();
    }
  }, [loadGoogleSheetsData]);

  const refreshDashboard = useCallback(() => {
    loadGoogleSheetsData();
  }, [loadGoogleSheetsData]);

  // Load Google Sheets data on mount
  React.useEffect(() => {
    loadGoogleSheetsData();
  }, [loadGoogleSheetsData]);

  const value: DataContextType = {
    currentDataset,
    availableDatasets,
    crimeData,
    crimeTrends,
    locationHotspots,
    isLoading,
    error,
    uploadDataset,
    selectDataset,
    refreshDashboard
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};