import React from 'react';
import { useCSVData } from '../context/CSVDataContext';
import { BarChart3, Database, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const LiveDemo = () => {
  const { csvData, fileName, columns, isLoading } = useCSVData();

  if (!fileName) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-800 mb-4">No Dataset Loaded</h2>
            <p className="text-blue-600 mb-6">
              Please upload a CSV file to see live data preview and statistics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const numericColumns = columns.filter(col => 
    csvData.some(row => typeof row[col] === 'number')
  );

  const categoricalColumns = columns.filter(col => 
    csvData.some(row => typeof row[col] === 'string')
  );

  const summaryStats = numericColumns.map(col => {
    const values = csvData.map(row => Number(row[col]) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      column: col,
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      count: values.length
    };
  });

  const categoricalStats = categoricalColumns.map(col => {
    const valueCounts: Record<string, number> = {};
    csvData.forEach(row => {
      const value = String(row[col]);
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    const uniqueValues = Object.keys(valueCounts).length;
    const mostCommon = Object.entries(valueCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      column: col,
      uniqueValues,
      mostCommon: mostCommon ? `${mostCommon[0]} (${mostCommon[1]} times)` : 'N/A',
      totalValues: csvData.length
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Data Demo</h1>
          <p className="text-gray-600">
            Real-time preview and statistics from your uploaded CSV dataset
          </p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-blue-600">
            <span>📁 {fileName}</span>
            <span>📊 {csvData.length.toLocaleString()} records</span>
            <span>📋 {columns.length} columns</span>
            {isLoading && (
              <span className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4 animate-pulse" />
                <span>Updating...</span>
              </span>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Database className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">Total Records</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{csvData.length.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-800">Columns</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{columns.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <span className="font-semibold text-gray-800">Numeric Columns</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{numericColumns.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-6 w-6 text-orange-600" />
              <span className="font-semibold text-gray-800">Text Columns</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{categoricalColumns.length}</p>
          </div>
        </div>

        {/* Numeric Statistics */}
        {numericColumns.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Numeric Column Statistics</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mean</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Median</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summaryStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{stat.column}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.mean}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.median}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.min}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.max}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categorical Statistics */}
        {categoricalColumns.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Categorical Column Statistics</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unique Values</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Most Common</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Values</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoricalStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{stat.column}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.uniqueValues}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.mostCommon}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.totalValues}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Latest Records Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Records Preview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.slice(0, 10).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {String(row[column] || '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {csvData.length > 10 && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              Showing first 10 of {csvData.length.toLocaleString()} records
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveDemo;