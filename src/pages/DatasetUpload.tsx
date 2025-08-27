import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Upload, FileText, BarChart3, Brain, Eye, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { CrimeData } from '../types';
import DatasetPreview from '../components/Dataset/DatasetPreview';
import DatasetAnalysis from '../components/Dataset/DatasetAnalysis';
import ModelTraining from '../components/Dataset/ModelTraining';
import DatasetInsights from '../components/Dataset/DatasetInsights';

interface DatasetInfo {
  name: string;
  size: number;
  rows: number;
  columns: string[];
  preview: any[];
}

interface AnalysisResults {
  summary: {
    totalRecords: number;
    missingValues: Record<string, number>;
    uniqueValues: Record<string, number>;
  };
  distributions: any[];
}

interface TrainingResults {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  featureImportance: Array<{ feature: string; importance: number }>;
}

const DatasetUpload = () => {
  const navigate = useNavigate();
  const { uploadDataset, isLoading: contextLoading } = useData();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [trainingResults, setTrainingResults] = useState<TrainingResults | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'train' | 'insights'>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Generate mock crime data from uploaded file
  const generateCrimeDataFromFile = (file: File, rows: number): CrimeData[] => {
    const crimeTypes = ['Theft', 'Burglary', 'Assault', 'Vandalism', 'Drug-related', 'Vehicle Crime', 'Robbery', 'Fraud'];
    const districts = ['Downtown', 'North Side', 'East End', 'West Village', 'South Bay', 'Central Park', 'Harbor District'];
    const severities: Array<'Low' | 'Medium' | 'High' | 'Critical'> = ['Low', 'Medium', 'High', 'Critical'];
    const statuses: Array<'Open' | 'Under Investigation' | 'Closed' | 'Cold Case'> = ['Open', 'Under Investigation', 'Closed', 'Cold Case'];

    return Array.from({ length: rows }, (_, i) => {
      const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
      const district = districts[Math.floor(Math.random() * districts.length)];
      const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
      const lng = -74.0060 + (Math.random() - 0.5) * 0.1;
      
      return {
        id: `crime-${file.name}-${i + 1}`,
        type,
        location: {
          lat,
          lng,
          address: `${Math.floor(Math.random() * 9999)} ${district} Street`,
          district
        },
        timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        severity: severities[Math.floor(Math.random() * severities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: `${type} incident reported in ${district} area`
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
        throw new Error('Please upload a CSV or Excel file');
      }

      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock dataset info
      const mockColumns = ['date', 'time', 'location', 'latitude', 'longitude', 'crime_type', 'severity', 'district'];
      const mockPreview = [
        { date: '2024-01-15', time: '14:30', location: '123 Main St', latitude: 40.7128, longitude: -74.0060, crime_type: 'Theft', severity: 'Medium', district: 'Downtown' },
        { date: '2024-01-16', time: '22:15', location: '456 Oak Ave', latitude: 40.7589, longitude: -73.9851, crime_type: 'Burglary', severity: 'High', district: 'North Side' },
        { date: '2024-01-17', time: '09:45', location: '789 Pine St', latitude: 40.6892, longitude: -74.0445, crime_type: 'Vandalism', severity: 'Low', district: 'West Village' }
      ];

      const info: DatasetInfo = {
        name: file.name,
        size: file.size,
        rows: Math.floor(Math.random() * 5000) + 1000,
        columns: mockColumns,
        preview: mockPreview
      };

      setUploadedFile(file);
      setDatasetInfo(info);
      setSuccess('Dataset uploaded successfully!');

      // Generate crime data and upload to context
      const crimeDataFromFile = generateCrimeDataFromFile(file, info.rows);
      await uploadDataset(file, crimeDataFromFile);
      
      // Show success message with navigation option
      setSuccess('Dataset uploaded and dashboard updated successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeDataset = async () => {
    if (!datasetInfo) return;

    setLoading(true);
    setError(null);
    setCurrentStep('analyze');

    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockAnalysis: AnalysisResults = {
        summary: {
          totalRecords: datasetInfo.rows,
          missingValues: {
            'date': 0,
            'time': 12,
            'location': 5,
            'latitude': 0,
            'longitude': 0,
            'crime_type': 0,
            'severity': 8,
            'district': 2
          },
          uniqueValues: {
            'crime_type': 8,
            'severity': 4,
            'district': 7
          }
        },
        distributions: [
          { name: 'Theft', value: 35 },
          { name: 'Burglary', value: 25 },
          { name: 'Assault', value: 20 },
          { name: 'Vandalism', value: 12 },
          { name: 'Drug-related', value: 8 }
        ]
      };

      setAnalysisResults(mockAnalysis);
      setSuccess('Dataset analysis completed!');
    } catch (err) {
      setError('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async () => {
    if (!datasetInfo) return;

    setLoading(true);
    setError(null);
    setCurrentStep('train');

    try {
      // Simulate model training
      await new Promise(resolve => setTimeout(resolve, 5000));

      const mockTraining: TrainingResults = {
        accuracy: 87.3 + Math.random() * 3,
        precision: 85.1 + Math.random() * 4,
        recall: 88.7 + Math.random() * 3,
        f1Score: 86.9 + Math.random() * 3,
        confusionMatrix: [
          [142, 8, 5, 2],
          [12, 138, 7, 4],
          [6, 9, 135, 8],
          [3, 5, 11, 128]
        ],
        featureImportance: [
          { feature: 'time_of_day', importance: 0.28 },
          { feature: 'location_lat', importance: 0.24 },
          { feature: 'location_lng', importance: 0.22 },
          { feature: 'day_of_week', importance: 0.15 },
          { feature: 'district', importance: 0.11 }
        ]
      };

      setTrainingResults(mockTraining);
      setSuccess('Model training completed successfully!');
    } catch (err) {
      setError('Model training failed');
    } finally {
      setLoading(false);
    }
  };

  const handleShowInsights = () => {
    setCurrentStep('insights');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  const downloadSampleDataset = () => {
    const sampleData = `date,time,location,latitude,longitude,crime_type,severity,district
2024-01-15,14:30,123 Main St,40.7128,-74.0060,Theft,Medium,Downtown
2024-01-16,22:15,456 Oak Ave,40.7589,-73.9851,Burglary,High,North Side
2024-01-17,09:45,789 Pine St,40.6892,-74.0445,Vandalism,Low,West Village
2024-01-18,18:20,321 Elm Dr,40.7505,-73.9934,Assault,High,East End
2024-01-19,11:30,654 Maple Ln,40.7282,-74.0776,Drug-related,Medium,Harbor District`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_crime_dataset.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Crime Dataset</h1>
          <p className="text-gray-600">
            Upload your crime data to train custom ML models and generate insights
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div className="flex-1">
              <span className="text-green-700">{success}</span>
            </div>
            {success.includes('dashboard updated') && (
              <button
                onClick={handleViewDashboard}
                className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                View Dashboard
              </button>
            )}
          </div>
        )}

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Dataset Upload</h2>
            <button
              onClick={downloadSampleDataset}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Sample Dataset</span>
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Crime Dataset
            </h3>
            <p className="text-gray-600 mb-4">
              Supports CSV and Excel files with columns: date, time, location, crime_type, etc.
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors inline-flex items-center"
            >
              {loading || contextLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
            </label>
          </div>
        </div>

        {/* Dataset Preview */}
        {datasetInfo && (
          <DatasetPreview datasetInfo={datasetInfo} />
        )}

        {/* Action Buttons */}
        {datasetInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Analysis Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleAnalyzeDataset}
                disabled={loading || contextLoading || currentStep === 'analyze'}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {(loading || contextLoading) && currentStep === 'analyze' ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <BarChart3 className="h-5 w-5" />
                )}
                <span>Analyze Dataset</span>
              </button>

              <button
                onClick={handleTrainModel}
                disabled={loading || contextLoading || !analysisResults || currentStep === 'train'}
                className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {(loading || contextLoading) && currentStep === 'train' ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Brain className="h-5 w-5" />
                )}
                <span>Train Model</span>
              </button>

              <button
                onClick={handleShowInsights}
                disabled={loading || contextLoading || !trainingResults}
                className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Eye className="h-5 w-5" />
                <span>Show Insights</span>
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResults && (
          <DatasetAnalysis analysisResults={analysisResults} />
        )}

        {/* Training Results */}
        {trainingResults && (
          <ModelTraining trainingResults={trainingResults} />
        )}

        {/* Insights */}
        {currentStep === 'insights' && trainingResults && (
          <DatasetInsights 
            trainingResults={trainingResults}
            datasetInfo={datasetInfo}
          />
        )}
      </div>
    </div>
  );
};

export default DatasetUpload;