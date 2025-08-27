import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Dataset {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  row_count: number;
  columns: string[];
  upload_date: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrimeRecord {
  id: string;
  dataset_id: string;
  crime_type: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  district?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  status?: 'Open' | 'Under Investigation' | 'Closed' | 'Cold Case';
  incident_date?: string;
  description?: string;
  created_at: string;
}

// Dataset operations
export const datasetService = {
  async uploadDataset(file: File, crimeData: any[]) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('datasets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Deactivate other datasets
      await supabase
        .from('datasets')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Create dataset record
      const { data: dataset, error: datasetError } = await supabase
        .from('datasets')
        .insert({
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          row_count: crimeData.length,
          columns: Object.keys(crimeData[0] || {}),
          user_id: user.id,
          is_active: true
        })
        .select()
        .single();

      if (datasetError) throw datasetError;

      // Insert crime records in batches for better performance
      const batchSize = 500;
      for (let i = 0; i < crimeData.length; i += batchSize) {
        const batch = crimeData.slice(i, i + batchSize);
        const crimeRecords = batch.map(record => ({
          dataset_id: dataset.id,
          crime_type: record.type || record.crime_type || 'Unknown',
          location_name: record.location?.address || record.address || record.location_name,
          latitude: record.location?.lat || record.latitude,
          longitude: record.location?.lng || record.longitude,
          district: record.location?.district || record.district,
          severity: record.severity || 'Medium',
          status: record.status || 'Open',
          incident_date: record.timestamp || record.date || record.incident_date,
          description: record.description || `${record.type || record.crime_type} incident`
        }));

        const { error: recordsError } = await supabase
          .from('crime_records')
          .insert(crimeRecords);

        if (recordsError) throw recordsError;
      }

      return dataset;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  async getDatasets() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getActiveDataset() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async setActiveDataset(datasetId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Deactivate all datasets
    await supabase
      .from('datasets')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Activate selected dataset
    const { error } = await supabase
      .from('datasets')
      .update({ is_active: true })
      .eq('id', datasetId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async getCrimeRecords(datasetId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('crime_records')
      .select(`
        *,
        datasets!inner(user_id)
      `)
      .eq('datasets.user_id', user.id);

    if (datasetId) {
      query = query.eq('dataset_id', datasetId);
    } else {
      // Get records from active dataset
      const activeDataset = await this.getActiveDataset();
      if (!activeDataset) return [];
      query = query.eq('dataset_id', activeDataset.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async deleteDataset(datasetId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get dataset info for file deletion
    const { data: dataset } = await supabase
      .from('datasets')
      .select('file_path')
      .eq('id', datasetId)
      .eq('user_id', user.id)
      .single();

    if (dataset) {
      // Delete file from storage
      await supabase.storage
        .from('datasets')
        .remove([dataset.file_path]);
    }

    // Delete dataset (cascade will handle crime_records)
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', datasetId)
      .eq('user_id', user.id);

    if (error) throw error;
  }
};