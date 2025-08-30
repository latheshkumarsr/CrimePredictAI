import React, { useState } from 'react';
import { useCSVData } from '../context/CSVDataContext';
import { Upload, FileText, Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const DataUpload = () => {
  const { uploadCSV, fileName, csvData, isLoading, error } = useCSVData();
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    try {
      await uploadCSV(file);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `id,feature1,feature2,feature3,category,value,timestamp
1,23.5,45.2,12.8,A,100,2024-01-15
2,18.7,52.1,15.3,B,85,2024-01-16
3,31.2,38.9,9.7,A,120,2024-01-17
4,27.8,41.5,18.2,C,95,2024-01-18
5,22.1,48.7,14.6,B,110,2024-01-19
6,35.4,33.2,11.9,A,130,2024-01-20
7,19.9,55.8,16.4,C,75,2024-01-21
8,29.3,42.1,13.1,B,105,2024-01-22
9,26.7,39.6,17.8,A,115,2024-01-23
10,21.5,51.3,12.5,C,90,2024-01-24`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_dataset.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CSV Data Upload</h1>
          <p className="text-gray-600">
            Upload your CSV dataset to automatically update all dashboard modules in real-time
          </p>
        </div>

        {/* Current Dataset Status */}
        {fileName && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Active Dataset</h3>
                <p className="text-gray-600">{fileName} • {csvData.length.toLocaleString()} records</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Upload New Dataset</h2>
            <button
              onClick={downloadSampleCSV}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Sample CSV</span>
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Processing CSV File</h3>
                <p className="text-gray-600">Parsing data and updating all modules...</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop CSV file here or click to upload
                </h3>
                <p className="text-gray-600 mb-4">
                  All dashboard modules will update automatically with your data
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  disabled={isLoading}
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose CSV File
                </label>
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">CSV Format Requirements</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Required Format:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• First row must contain column headers</li>
                <li>• Comma-separated values (.csv format)</li>
                <li>• At least one numeric column for analysis</li>
                <li>• Consistent data types within each column</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">What Happens After Upload:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>Live Demo:</strong> Shows your data summary and latest records</li>
                <li>• <strong>Model Performance:</strong> Calculates accuracy metrics on your data</li>
                <li>• <strong>About Accuracy:</strong> Explains how metrics are computed from your dataset</li>
                <li>• <strong>Interpretability:</strong> Generates feature importance from your columns</li>
                <li>• <strong>Pattern Matching:</strong> Detects anomalies and patterns in your data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;