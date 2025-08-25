import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CrimeData, CrimeTrend, LocationHotspot } from '../types';
import { supabase, datasetService, Dataset, CrimeRecord } from '../lib/supabase';

interface DataContextType {
  currentDataset: Dataset | null;
  availableDatasets: Dataset[];
  crimeData: CrimeData[];
  crimeTrends: CrimeTrend[];
  locationHotspots: LocationHotspot[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  uploadDataset: (file: File, data: CrimeData[]) => Promise<void>;
  selectDataset: (datasetId: string) => Promise<void>;
  refreshDashboard: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [availableDatasets, setAvailableDatasets] = useState<Dataset[]>([]);
  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
  const [crimeTrends, setCrimeTrends] = useState<CrimeTrend[]>([]);
  const [locationHotspots, setLocationHotspots] = useState<LocationHotspot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Convert Supabase records to app format
  const convertCrimeRecords = useCallback((records: CrimeRecord[]): CrimeData[] => {
    return records.map(record => ({
      id: record.id,
      type: record.crime_type,
      location: {
        lat: record.latitude || 40.7128,
        lng: record.longitude || -74.0060,
        address: record.location_name || 'Unknown Location',
        district: record.district || 'Unknown District'
      },
      timestamp: new Date(record.incident_date || record.created_at),
      severity: record.severity || 'Medium',
      status: record.status || 'Open',
      description: record.description || `${record.crime_type} incident`
    }));
  }, []);

  // Generate analytics from crime data
  const generateAnalytics = useCallback((data: CrimeData[]) => {
    if (data.length === 0) {
      setCrimeTrends([]);
      setLocationHotspots([]);
      return;
    }

    // Generate crime trends
    const trends: CrimeTrend[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const crimeTypes = [...new Set(data.map(crime => crime.type))].slice(0, 5);
    
    crimeTypes.forEach(type => {
      months.forEach(month => {
        const count = data.filter(crime => {
          const crimeMonth = months[crime.timestamp.getMonth()];
          return crime.type === type && crimeMonth === month;
        }).length;
        
        trends.push({ month, count, type });
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

    setCrimeTrends(trends);
    setLocationHotspots(hotspots);
  }, []);

  // Load datasets and data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Load available datasets
      const datasets = await datasetService.getDatasets();
      setAvailableDatasets(datasets);

      // Load active dataset
      const activeDataset = await datasetService.getActiveDataset();
      setCurrentDataset(activeDataset);

      if (activeDataset) {
        // Load crime records for active dataset
        const records = await datasetService.getCrimeRecords(activeDataset.id);
        const crimeData = convertCrimeRecords(records);
        setCrimeData(crimeData);
        generateAnalytics(crimeData);
      } else {
        setCrimeData([]);
        generateAnalytics([]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [convertCrimeRecords, generateAnalytics]);

  // Upload dataset
  const uploadDataset = useCallback(async (file: File, data: CrimeData[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const dataset = await datasetService.uploadDataset(file, data);
      
      // Reload data to reflect changes
      await loadData();
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  // Select dataset
  const selectDataset = useCallback(async (datasetId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await datasetService.setActiveDataset(datasetId);
      await loadData();
    } catch (err) {
      console.error('Error selecting dataset:', err);
      setError(err instanceof Error ? err.message : 'Failed to select dataset');
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  // Refresh dashboard
  const refreshDashboard = useCallback(() => {
    loadData();
  }, [loadData]);

  // Authentication functions
  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setCurrentDataset(null);
      setAvailableDatasets([]);
      setCrimeData([]);
      setCrimeTrends([]);
      setLocationHotspots([]);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          await loadData();
        } else {
          setIsAuthenticated(false);
          setCurrentDataset(null);
          setAvailableDatasets([]);
          setCrimeData([]);
          setCrimeTrends([]);
          setLocationHotspots([]);
        }
      }
    );

    // Initial load
    loadData();

    return () => subscription.unsubscribe();
  }, [loadData]);

  const value: DataContextType = {
    currentDataset,
    availableDatasets,
    crimeData,
    crimeTrends,
    locationHotspots,
    isLoading,
    error,
    isAuthenticated,
    uploadDataset,
    selectDataset,
    refreshDashboard,
    signIn,
    signUp,
    signOut
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};