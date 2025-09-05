import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CrimeData, CrimeTrend, LocationHotspot } from '../types';
import { defaultCrimeData, generateCrimeTrends, generateLocationHotspots } from '../data/mockData';
import { generateIndianCrimeData } from '../data/indianCrimeData';

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
  // Initialize with default dataset
  const defaultDataset: DatasetInfo = {
    id: 'default-dataset',
    name: 'Global Crime Dataset (6000 records)',
    uploadDate: new Date(),
    size: 300000, // Approximate size
    rows: 6000,
    columns: ['date', 'time', 'location', 'latitude', 'longitude', 'crime_type', 'severity', 'district']
  };

  // Indian dataset
  const indianDataset: DatasetInfo = {
    id: 'indian-dataset',
    name: 'Indian Crime Dataset (5000 records)',
    uploadDate: new Date(),
    size: 250000,
    rows: 5000,
    columns: ['date', 'time', 'location', 'latitude', 'longitude', 'crime_type', 'severity', 'district', 'city', 'state']
  };

  const [currentDataset, setCurrentDataset] = useState<DatasetInfo>(defaultDataset);
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([defaultDataset, indianDataset]);
  const [crimeData, setCrimeData] = useState<CrimeData[]>(defaultCrimeData);
  const [crimeTrends, setCrimeTrends] = useState<CrimeTrend[]>(generateCrimeTrends(defaultCrimeData));
  const [locationHotspots, setLocationHotspots] = useState<LocationHotspot[]>(generateLocationHotspots(defaultCrimeData));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate analytics from crime data
  const generateAnalytics = useCallback((data: CrimeData[]) => {
    const trends = generateCrimeTrends(data);
    const hotspots = generateLocationHotspots(data);
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
      // Handle default dataset
      if (datasetId === 'default-dataset') {
        const { trends, hotspots } = generateAnalytics(defaultCrimeData);
        setCurrentDataset(defaultDataset);
        setCrimeData(defaultCrimeData);
        setCrimeTrends(trends);
        setLocationHotspots(hotspots);
        return;
      }

      // Handle Indian dataset
      if (datasetId === 'indian-dataset') {
        const indianData = generateIndianCrimeData(5000);
        const { trends, hotspots } = generateAnalytics(indianData);
        setCurrentDataset(indianDataset);
        setCrimeData(indianData);
        setCrimeTrends(trends);
        setLocationHotspots(hotspots);
        return;
      }

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
      // Fallback to default dataset
      const { trends, hotspots } = generateAnalytics(defaultCrimeData);
      setCurrentDataset(defaultDataset);
      setCrimeData(defaultCrimeData);
      setCrimeTrends(trends);
      setLocationHotspots(hotspots);
    } finally {
      setIsLoading(false);
    }
  }, [availableDatasets, generateAnalytics]);

  const refreshDashboard = useCallback(() => {
    if (currentDataset) {
      selectDataset(currentDataset.id);
    } else {
      // Fallback to default dataset
      selectDataset('default-dataset');
    }
  }, [currentDataset, selectDataset]);

  // Load datasets from localStorage on mount
  React.useEffect(() => {
    const storedDatasets = JSON.parse(localStorage.getItem('crimeDatasets') || '[]');
    const allDatasets = [defaultDataset, ...storedDatasets];
    setAvailableDatasets(allDatasets);
    
    // Always start with default dataset
    const { trends, hotspots } = generateAnalytics(defaultCrimeData);
    setCurrentDataset(defaultDataset);
    setCrimeData(defaultCrimeData);
    setCrimeTrends(trends);
    setLocationHotspots(hotspots);
  }, [generateAnalytics]);

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