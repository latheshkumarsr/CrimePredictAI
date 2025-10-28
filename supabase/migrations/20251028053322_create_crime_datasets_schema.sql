/*
  # Create Crime Dataset Management Schema

  ## Overview
  This migration creates the database structure for storing crime datasets and their associated data points.

  ## New Tables
  
  ### `datasets`
  Stores metadata about uploaded crime datasets
  - `id` (uuid, primary key) - Unique identifier for the dataset
  - `name` (text) - Name of the dataset file
  - `upload_date` (timestamptz) - When the dataset was uploaded
  - `size` (bigint) - File size in bytes
  - `rows` (integer) - Number of data rows
  - `columns` (text[]) - Array of column names
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `crime_data`
  Stores individual crime records from datasets
  - `id` (uuid, primary key) - Unique identifier for the crime record
  - `dataset_id` (uuid, foreign key) - Reference to parent dataset
  - `crime_id` (text) - Original crime ID from dataset
  - `type` (text) - Type of crime (Theft, Burglary, etc.)
  - `location_lat` (numeric) - Latitude coordinate
  - `location_lng` (numeric) - Longitude coordinate
  - `location_address` (text) - Street address
  - `location_district` (text) - District name
  - `timestamp` (timestamptz) - When the crime occurred
  - `severity` (text) - Severity level (Low, Medium, High, Critical)
  - `status` (text) - Investigation status (Open, Under Investigation, Closed, Cold Case)
  - `description` (text) - Crime description
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Enables RLS on all tables
  - Public read access for demonstration purposes (all users can view all data)
  - This can be restricted later by adding authentication

  ## Important Notes
  
  1. Uses `IF NOT EXISTS` clauses to make migration idempotent
  2. Foreign key relationship ensures data integrity between datasets and crime_data
  3. Indexes added on frequently queried columns for performance
  4. Default values provided for timestamps
*/

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  upload_date timestamptz NOT NULL DEFAULT now(),
  size bigint NOT NULL DEFAULT 0,
  rows integer NOT NULL DEFAULT 0,
  columns text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create crime_data table
CREATE TABLE IF NOT EXISTS crime_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  crime_id text NOT NULL,
  type text NOT NULL,
  location_lat numeric NOT NULL,
  location_lng numeric NOT NULL,
  location_address text NOT NULL DEFAULT '',
  location_district text NOT NULL DEFAULT '',
  timestamp timestamptz NOT NULL,
  severity text NOT NULL DEFAULT 'Medium',
  status text NOT NULL DEFAULT 'Open',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_crime_data_dataset_id ON crime_data(dataset_id);
CREATE INDEX IF NOT EXISTS idx_crime_data_type ON crime_data(type);
CREATE INDEX IF NOT EXISTS idx_crime_data_timestamp ON crime_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_crime_data_district ON crime_data(location_district);
CREATE INDEX IF NOT EXISTS idx_crime_data_severity ON crime_data(severity);

-- Enable Row Level Security
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crime_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for demonstration)
-- Note: In production, you would restrict this based on user authentication

CREATE POLICY "Allow public read access to datasets"
  ON datasets FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to datasets"
  ON datasets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to crime_data"
  ON crime_data FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to crime_data"
  ON crime_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to datasets"
  ON datasets FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from datasets"
  ON datasets FOR DELETE
  USING (true);