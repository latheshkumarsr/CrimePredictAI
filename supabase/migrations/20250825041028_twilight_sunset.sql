/*
  # Create datasets table for crime data storage

  1. New Tables
    - `datasets`
      - `id` (uuid, primary key)
      - `name` (text, dataset filename)
      - `file_path` (text, storage path)
      - `file_size` (bigint, file size in bytes)
      - `row_count` (integer, number of records)
      - `columns` (jsonb, detected columns)
      - `upload_date` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `is_active` (boolean, currently selected dataset)
    - `crime_records`
      - `id` (uuid, primary key)
      - `dataset_id` (uuid, references datasets)
      - `crime_type` (text)
      - `location_name` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `district` (text)
      - `severity` (text)
      - `status` (text)
      - `incident_date` (timestamp)
      - `description` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data

  3. Storage
    - Create storage bucket for dataset files
    - Add RLS policies for file access
*/

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  row_count integer NOT NULL DEFAULT 0,
  columns jsonb DEFAULT '[]'::jsonb,
  upload_date timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crime_records table
CREATE TABLE IF NOT EXISTS crime_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  crime_type text NOT NULL,
  location_name text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  district text,
  severity text CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  status text CHECK (status IN ('Open', 'Under Investigation', 'Closed', 'Cold Case')),
  incident_date timestamptz,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crime_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for datasets
CREATE POLICY "Users can view own datasets"
  ON datasets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own datasets"
  ON datasets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own datasets"
  ON datasets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own datasets"
  ON datasets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for crime_records
CREATE POLICY "Users can view own crime records"
  ON crime_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = crime_records.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own crime records"
  ON crime_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = crime_records.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own crime records"
  ON crime_records
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = crime_records.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = crime_records.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own crime records"
  ON crime_records
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = crime_records.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_datasets_is_active ON datasets(is_active);
CREATE INDEX IF NOT EXISTS idx_datasets_upload_date ON datasets(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_crime_records_dataset_id ON crime_records(dataset_id);
CREATE INDEX IF NOT EXISTS idx_crime_records_crime_type ON crime_records(crime_type);
CREATE INDEX IF NOT EXISTS idx_crime_records_location ON crime_records(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_crime_records_incident_date ON crime_records(incident_date);

-- Create storage bucket for dataset files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('datasets', 'datasets', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload own dataset files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own dataset files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own dataset files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);