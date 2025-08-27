import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResults {
  summary: {
    totalRecords: number;
    missingValues: Record<string, number>;
    uniqueValues: Record<string, number>;
  };
  distributions: any[];
}

interface DatasetAnalysisProps {
  analysisResults: AnalysisResults;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const DatasetAnalysis: React.FC<DatasetAnalysisProps> = ({ analysisResults }) => {
  const { summary, distributions } = analysisResults;

  const missingValuesData = Object.entries(summary.missingValues).map(([column, count]) => ({
    column,
    missing: count,
    percentage: ((count / summary.totalRecords) * 100).toFixed(1)
  }));

  const uniqueValuesData = Object.entries(summary.uniqueValues).map(([column, count]) => ({
    column,
    unique: count
  }));

  const totalMissing = Object.values(summary.missingValues).reduce((sum, count) => sum + count, 0);
  const dataQualityScore = Math.max(0, 100 - (totalMissing / summary.totalRecords) * 100);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Dataset Analysis Results</h2>

      {/* Data Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Total Records</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{summary.totalRecords.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-900">Missing Values</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{totalMissing}</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">Data Quality</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{dataQualityScore.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Missing Values Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Missing Values by Column</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={missingValuesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="column" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} (${missingValuesData.find(d => d.missing === value)?.percentage}%)`,
                  'Missing Values'
                ]}
              />
              <Bar dataKey="missing" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crime Type Distribution */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Crime Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributions}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {distributions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Quality Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">Data Quality Recommendations</h3>
        <ul className="space-y-2 text-yellow-700">
          {totalMissing > 0 && (
            <li className="flex items-start">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Consider handling missing values through imputation or removal before training
            </li>
          )}
          {dataQualityScore < 90 && (
            <li className="flex items-start">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Data quality score is below 90% - review data preprocessing steps
            </li>
          )}
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Ensure date and time columns are properly formatted for temporal analysis
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Verify geographic coordinates are within valid ranges
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DatasetAnalysis;