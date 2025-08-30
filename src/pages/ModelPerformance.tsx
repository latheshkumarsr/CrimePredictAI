import React from 'react';
import { useCSVData } from '../context/CSVDataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Award, TrendingUp, Brain, FileText, RefreshCw } from 'lucide-react';

const ModelPerformance = () => {
  const { csvData, fileName, modelMetrics, isLoading } = useCSVData();

  if (!fileName) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-800 mb-4">No Dataset Loaded</h2>
            <p className="text-blue-600">
              Upload a CSV file to see live model performance metrics calculated on your data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!modelMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <RefreshCw className="h-16 w-16 text-yellow-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Calculating Metrics</h2>
            <p className="text-yellow-600">
              Processing your dataset to generate live model performance metrics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const metricsData = [
    { metric: 'Accuracy', value: modelMetrics.accuracy },
    { metric: 'Precision', value: modelMetrics.precision },
    { metric: 'Recall', value: modelMetrics.recall },
    { metric: 'F1-Score', value: modelMetrics.f1Score }
  ];

  const confusionLabels = Array.from({ length: modelMetrics.confusionMatrix.length }, (_, i) => `Class ${i + 1}`);
  const maxValue = Math.max(...modelMetrics.confusionMatrix.flat());

  const getColor = (value: number, max: number) => {
    const intensity = value / max;
    return `rgba(59, 130, 246, ${intensity})`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Model Performance</h1>
          <p className="text-gray-600">
            Real-time metrics calculated on your current dataset: <span className="font-medium text-blue-600">{fileName}</span>
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Based on {csvData.length.toLocaleString()} records • Last updated: {new Date().toLocaleTimeString()}
            {isLoading && <span className="ml-2 text-blue-600">• Updating...</span>}
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-800">Accuracy</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{modelMetrics.accuracy.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">Overall correctness</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">Precision</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{modelMetrics.precision.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">Positive prediction accuracy</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <span className="font-semibold text-gray-800">Recall</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{modelMetrics.recall.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">True positive detection</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Brain className="h-6 w-6 text-orange-600" />
              <span className="font-semibold text-gray-800">F1-Score</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{modelMetrics.f1Score.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">Balanced performance</p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Score']} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion Matrix */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Confusion Matrix</h2>
          <p className="text-gray-600 mb-4">
            Generated from your dataset with {modelMetrics.confusionMatrix.length} detected classes
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Predicted →</th>
                  {confusionLabels.map((label, index) => (
                    <th key={index} className="px-3 py-2 text-xs font-medium text-gray-500 uppercase text-center">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modelMetrics.confusionMatrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">
                      {confusionLabels[rowIndex]}
                    </td>
                    {row.map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-3 py-2 text-sm text-center font-medium"
                        style={{ backgroundColor: getColor(value, maxValue) }}
                      >
                        <span className={value > maxValue * 0.5 ? 'text-white' : 'text-gray-900'}>
                          {value}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dataset Context */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Live Data Context</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-700">
            <div>
              <p className="font-medium">Dataset Source:</p>
              <p className="text-sm">{fileName}</p>
            </div>
            <div>
              <p className="font-medium">Training Records:</p>
              <p className="text-sm">{csvData.length.toLocaleString()} samples</p>
            </div>
            <div>
              <p className="font-medium">Feature Count:</p>
              <p className="text-sm">{modelMetrics.featureImportance.length} features analyzed</p>
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-3">
            All metrics above are calculated in real-time from your uploaded CSV data. 
            Upload a new file to see metrics update automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;