import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CrimeData, CrimeTrend, LocationHotspot } from '../types';
import { defaultCrimeData, generateCrimeTrends, generateLocationHotspots } from '../data/mockData';
import { generateIndianCrimeData } from '../data/indianCrimeData';
import { supabase } from '../lib/supabase';

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
    name: 'Enhanced Indian Crime Dataset (8000+ records)',
    uploadDate: new Date(),
    size: 400000,
    rows: 8000,
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
      const columns = ['date', 'time', 'location', 'latitude', 'longitude', 'crime_type', 'severity', 'district'];

      const { data: datasetResult, error: datasetError } = await supabase
        .from('datasets')
        .insert({
          name: file.name,
          upload_date: new Date().toISOString(),
          size: file.size,
          rows: data.length,
          columns
        })
        .select()
        .single();

      if (datasetError) throw datasetError;
      if (!datasetResult) throw new Error('Failed to create dataset');

      const crimeDataInserts = data.map(crime => ({
        dataset_id: datasetResult.id,
        crime_id: crime.id,
        type: crime.type,
        location_lat: crime.location.lat,
        location_lng: crime.location.lng,
        location_address: crime.location.address,
        location_district: crime.location.district,
        timestamp: crime.timestamp.toISOString(),
        severity: crime.severity,
        status: crime.status,
        description: crime.description
      }));

      const batchSize = 1000;
      for (let i = 0; i < crimeDataInserts.length; i += batchSize) {
        const batch = crimeDataInserts.slice(i, i + batchSize);
        const { error: crimeError } = await supabase
          .from('crime_data')
          .insert(batch);

        if (crimeError) throw crimeError;
      }

      const newDataset: DatasetInfo = {
        id: datasetResult.id,
        name: datasetResult.name,
        uploadDate: new Date(datasetResult.upload_date),
        size: datasetResult.size,
        rows: datasetResult.rows,
        columns: datasetResult.columns
      };

      const { trends, hotspots } = generateAnalytics(data);

      setAvailableDatasets(prev => [newDataset, ...prev]);
      setCurrentDataset(newDataset);
      setCrimeData(data);
      setCrimeTrends(trends);
      setLocationHotspots(hotspots);

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
      if (datasetId === 'default-dataset') {
        const { trends, hotspots } = generateAnalytics(defaultCrimeData);
        setCurrentDataset(defaultDataset);
        setCrimeData(defaultCrimeData);
        setCrimeTrends(trends);
        setLocationHotspots(hotspots);
        return;
      }

      if (datasetId === 'indian-dataset') {
        const indianData = generateIndianCrimeData(5000);
        const { trends, hotspots } = generateAnalytics(indianData);
        setCurrentDataset(indianDataset);
        setCrimeData(indianData);
        setCrimeTrends(trends);
        setLocationHotspots(hotspots);
        return;
      }

      const { data: datasetResult, error: datasetError } = await supabase
        .from('datasets')
        .select('*')
        .eq('id', datasetId)
        .maybeSingle();

      if (datasetError) throw datasetError;
      if (!datasetResult) throw new Error('Dataset not found');

      const { data: crimeDataResult, error: crimeError } = await supabase
        .from('crime_data')
        .select('*')
        .eq('dataset_id', datasetId);

      if (crimeError) throw crimeError;

      const data: CrimeData[] = (crimeDataResult || []).map(crime => ({
        id: crime.crime_id,
        type: crime.type,
        location: {
          lat: Number(crime.location_lat),
          lng: Number(crime.location_lng),
          address: crime.location_address,
          district: crime.location_district
        },
        timestamp: new Date(crime.timestamp),
        severity: crime.severity as 'Low' | 'Medium' | 'High' | 'Critical',
        status: crime.status as 'Open' | 'Under Investigation' | 'Closed' | 'Cold Case',
        description: crime.description
      }));

      const dataset: DatasetInfo = {
        id: datasetResult.id,
        name: datasetResult.name,
        uploadDate: new Date(datasetResult.upload_date),
        size: datasetResult.size,
        rows: datasetResult.rows,
        columns: datasetResult.columns
      };

      const { trends, hotspots } = generateAnalytics(data);

      setCurrentDataset(dataset);
      setCrimeData(data);
      setCrimeTrends(trends);
      setLocationHotspots(hotspots);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dataset');
      const { trends, hotspots } = generateAnalytics(defaultCrimeData);
      setCurrentDataset(defaultDataset);
      setCrimeData(defaultCrimeData);
      setCrimeTrends(trends);
      setLocationHotspots(hotspots);
    } finally {
      setIsLoading(false);
    }
  }, [generateAnalytics]);

  const refreshDashboard = useCallback(() => {
    if (currentDataset) {
      selectDataset(currentDataset.id);
    } else {
      // Fallback to default dataset
      selectDataset('default-dataset');
    }
  }, [currentDataset, selectDataset]);

  React.useEffect(() => {
    const loadDatasets = async () => {
      try {
        const { data: datasetsResult, error } = await supabase
          .from('datasets')
          .select('*')
          .order('upload_date', { ascending: false });

        if (error) throw error;

        const loadedDatasets: DatasetInfo[] = (datasetsResult || []).map(ds => ({
          id: ds.id,
          name: ds.name,
          uploadDate: new Date(ds.upload_date),
          size: ds.size,
          rows: ds.rows,
          columns: ds.columns
        }));

        const allDatasets = [defaultDataset, indianDataset, ...loadedDatasets];
        setAvailableDatasets(allDatasets);
      } catch (err) {
        console.error('Failed to load datasets:', err);
        setAvailableDatasets([defaultDataset, indianDataset]);
      }

      const { trends, hotspots } = generateAnalytics(defaultCrimeData);
      setCurrentDataset(defaultDataset);
      setCrimeData(defaultCrimeData);
      setCrimeTrends(trends);
      setLocationHotspots(hotspots);
    };

    loadDatasets();
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