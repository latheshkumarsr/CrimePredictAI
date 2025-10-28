import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      datasets: {
        Row: {
          id: string;
          name: string;
          upload_date: string;
          size: number;
          rows: number;
          columns: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          upload_date?: string;
          size: number;
          rows: number;
          columns: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          upload_date?: string;
          size?: number;
          rows?: number;
          columns?: string[];
          created_at?: string;
        };
      };
      crime_data: {
        Row: {
          id: string;
          dataset_id: string;
          crime_id: string;
          type: string;
          location_lat: number;
          location_lng: number;
          location_address: string;
          location_district: string;
          timestamp: string;
          severity: string;
          status: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          dataset_id: string;
          crime_id: string;
          type: string;
          location_lat: number;
          location_lng: number;
          location_address: string;
          location_district: string;
          timestamp: string;
          severity: string;
          status: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          dataset_id?: string;
          crime_id?: string;
          type?: string;
          location_lat?: number;
          location_lng?: number;
          location_address?: string;
          location_district?: string;
          timestamp?: string;
          severity?: string;
          status?: string;
          description?: string;
          created_at?: string;
        };
      };
    };
  };
}
