import React from 'react';
import { useCSVData } from '../context/CSVDataContext';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Search, AlertTriangle, Target, FileText, Layers } from 'lucide-react';

const PatternMatching = () => {
  const { csvData, fileName, patternResults, columns, isLoading } = useCSVData();

  if (!fileName || !patternResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <Activity className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-800 mb-4">No Pattern Analysis Available</h2>
            <p className="text-blue-600">
              Upload a CSV dataset to see real-time pattern recognition and anomaly detection results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const numericColumns = columns.filter(col => 
    csvData.some(row => typeof row[col] === 'number')
  );

  // Prepare scatter plot data for anomaly visualization
  const scatterData = patternResults.anomalies.map((anomaly, index) => ({
    x: index + 1,
    y: anomaly.score,
    record: anomaly.record,
    index: anomaly.index
  }));

  // Prepare cluster data for visualization
  const clusterData = patternResults.clusters.map(cluster => ({
    cluster: `Cluster ${cluster.cluster}`,
    count: cluster.count,
    percentage: ((cluster.count / csvData.length) * 100).toFixed(1)
  }));

  const getAnomalyColor = (score: number) => {
    if (score > 4) return 'text-red-600 bg-red-100';
    if (score > 3) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getPatternColor = (frequency: number) => {
    if (frequency > 50) return 'text-green-600 bg-green-100';
    if (frequency > 25) return 'text-blue-600 bg-blue-100';
    return 'text-purple-600 bg-purple-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Pattern Matching</h1>
          <p className="text-gray-600">
            Real-time pattern recognition and anomaly detection from your dataset: <span className="font-medium text-blue-600">{fileName}</span>
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Analyzing {csvData.length.toLocaleString()} records • {patternResults.anomalies.length} anomalies detected • {patternResults.patterns.length} patterns found
            {isLoading && <span className="ml-2 text-blue-600">• Updating...</span>}
          </div>
        </div>

        {/* Pattern Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <span className="font-semibold text-gray-800">Anomalies</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{patternResults.anomalies.length}</p>
            <p className="text-sm text-gray-500 mt-1">Outliers detected</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Layers className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">Clusters</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{patternResults.clusters.length}</p>
            <p className="text-sm text-gray-500 mt-1">Data groups found</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Search className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-800">Patterns</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{patternResults.patterns.length}</p>
            <p className="text-sm text-gray-500 mt-1">Common patterns</p>
          </div>
        </div>

        {/* Anomaly Detection */}
        {patternResults.anomalies.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-800">Anomaly Detection Results</h2>
            </div>
            
            {/* Anomaly Scatter Plot */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Anomaly Scores</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={scatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name="Anomaly Index" />
                  <YAxis dataKey="y" name="Anomaly Score" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'y' ? `Score: ${Number(value).toFixed(2)}` : value,
                      name === 'y' ? 'Anomaly Score' : 'Index'
                    ]}
                  />
                  <Scatter dataKey="y" fill="#ef4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Top Anomalies Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Top Anomalies from Your Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Record #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anomaly Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample Values</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patternResults.anomalies.slice(0, 5).map((anomaly, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {anomaly.index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {anomaly.score.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getAnomalyColor(anomaly.score)}`}>
                            {anomaly.score > 4 ? 'High' : anomaly.score > 3 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {Object.entries(anomaly.record).slice(0, 3).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Cluster Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Layers className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Cluster Analysis</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clusterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cluster" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} records (${clusterData.find(d => d.count === value)?.percentage}%)`,
                  'Cluster Size'
                ]}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Common Patterns */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Detected Patterns</h2>
          </div>
          
          <div className="space-y-3">
            {patternResults.patterns.map((pattern, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{pattern.pattern}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPatternColor(pattern.frequency)}`}>
                    {pattern.frequency.toFixed(1)}% frequency
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{pattern.description}</p>
              </div>
            ))}
          </div>

          {patternResults.patterns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No significant patterns detected in the current dataset.</p>
              <p className="text-sm mt-1">Try uploading a larger dataset for better pattern recognition.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatternMatching;