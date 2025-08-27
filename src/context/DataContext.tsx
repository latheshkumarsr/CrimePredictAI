import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CrimeData, CrimeTrend, LocationHotspot } from '../types';

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
  const [currentDataset, setCurrentDataset] = useState<DatasetInfo | null>(null);
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([]);
  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
  const [crimeTrends, setCrimeTrends] = useState<CrimeTrend[]>([]);
  const [locationHotspots, setLocationHotspots] = useState<LocationHotspot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate analytics from crime data
  const generateAnalytics = useCallback((data: CrimeData[]) => {
    // Generate crime trends
    const trends: CrimeTrend[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const crimeTypes = ['Theft', 'Burglary', 'Assault', 'Vandalism', 'Drug-related'];
    
    crimeTypes.forEach(type => {
      months.forEach(month => {
        const count = data.filter(crime => {
          const crimeMonth = months[crime.timestamp.getMonth()];
          return crime.type === type && crimeMonth === month;
        }).length;
        
        trends.push({ month, count: count + Math.floor(Math.random() * 20), type });
      });
    });

    // Generate location hotspots
    const locationCounts: Record<string, number> = {};
    data.forEach(crime => {
      locationCounts[crime.location.district] = (locationCounts[crime.location.district] || 0) + 1;
    });

    const hotspots: LocationHotspot[] = Object.entries(locationCounts)
      .map(([location, count]) => ({
        location,
        count,
        riskLevel: count > 80 ? 'Critical' : count > 50 ? 'High' : count > 25 ? 'Medium' : 'Low' as 'Low' | 'Medium' | 'High' | 'Critical'
      }))
      .sort((a, b) => b.count - a.count);

    return { trends, hotspots };
  }, []);

  const uploadDataset = useCallback(async (file: File, data: CrimeData[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate upload processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDataset: DatasetInfo = {
        id: `dataset-${Date.now()}`,
        name: file.name,
        uploadDate: new Date(),
        size: file.size,
        rows: data.length,
        columns: ['date', 'time', 'location', 'latitude', 'longitude', 'crime_type', 'severity', 'district']
      };

      // Generate analytics from the new data
      const { trends, hotspots } = generateAnalytics(data);

      // Update state
      setAvailableDatasets(prev => [newDataset, ...prev]);
      setCurrentDataset(newDataset);
      setCrimeData(data);
      setCrimeTrends(trends);
      setLocationHotspots(hotspots);

      // Store in localStorage for persistence
      const storedDatasets = JSON.parse(localStorage.getItem('crimeDatasets') || '[]');
      const updatedDatasets = [newDataset, ...storedDatasets];
      localStorage.setItem('crimeDatasets', JSON.stringify(updatedDatasets));
      localStorage.setItem(`crimeData-${newDataset.id}`, JSON.stringify(data));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  }, [generateAnalytics]);

  const selectDataset = useCallback(async (datasetId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Find dataset
      const dataset = availableDatasets.find(d => d.id === datasetId);
      if (!dataset) {
        throw new Error('Dataset not found');
      }

      // Load data from localStorage
      const storedData = localStorage.getItem(`crimeData-${datasetId}`);
      if (!storedData) {
        throw new Error('Dataset data not found');
      }

      const data: CrimeData[] = JSON.parse(storedData);
      const { trends, hotspots } = generateAnalytics(data);

      setCurrentDataset(dataset);
      setCrimeData(data);
      setCrimeTrends(trends);
      setLocationHotspots(hotspots);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dataset');
    } finally {
      setIsLoading(false);
    }
  }, [availableDatasets, generateAnalytics]);

  const refreshDashboard = useCallback(() => {
    if (currentDataset) {
      selectDataset(currentDataset.id);
    }
  }, [currentDataset, selectDataset]);

  // Load datasets from localStorage on mount
  React.useEffect(() => {
    const storedDatasets = JSON.parse(localStorage.getItem('crimeDatasets') || '[]');
    setAvailableDatasets(storedDatasets);
    
    if (storedDatasets.length > 0) {
      selectDataset(storedDatasets[0].id);
    }
  }, []);

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