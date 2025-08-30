import React from 'react';
import { useCSVData } from '../context/CSVDataContext';
import { BookOpen, Calculator, Target, TrendingUp, FileText, AlertCircle } from 'lucide-react';

const AboutAccuracy = () => {
  const { csvData, fileName, modelMetrics, columns } = useCSVData();

  if (!fileName || !modelMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-800 mb-4">No Model Metrics Available</h2>
            <p className="text-blue-600">
              Upload a CSV dataset to see detailed explanations of how accuracy metrics are computed from your data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const numericColumns = columns.filter(col => 
    csvData.some(row => typeof row[col] === 'number')
  );

  const totalPredictions = modelMetrics.confusionMatrix.reduce((sum, row) => 
    sum + row.reduce((rowSum, val) => rowSum + val, 0), 0
  );

  const correctPredictions = modelMetrics.confusionMatrix.reduce((sum, row, i) => 
    sum + row[i], 0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About Model Accuracy</h1>
          <p className="text-gray-600">
            Understanding how accuracy metrics are calculated from your dataset: <span className="font-medium text-blue-600">{fileName}</span>
          </p>
        </div>

        {/* Current Dataset Context */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Your Dataset Analysis</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{csvData.length.toLocaleString()}</div>
              <div className="text-sm text-blue-800">Total Records</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{numericColumns.length}</div>
              <div className="text-sm text-green-800">Numeric Features</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{modelMetrics.confusionMatrix.length}</div>
              <div className="text-sm text-purple-800">Detected Classes</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{totalPredictions}</div>
              <div className="text-sm text-orange-800">Test Predictions</div>
            </div>
          </div>
        </div>

        {/* Accuracy Calculation Explanation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calculator className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Accuracy Calculation</h2>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800 mb-2">Formula Applied to Your Data</h3>
              <div className="bg-white p-4 rounded border font-mono text-sm">
                Accuracy = (Correct Predictions / Total Predictions) × 100
              </div>
              <div className="mt-3 text-green-700">
                <p><strong>From your dataset:</strong></p>
                <p>• Correct Predictions: <span className="font-bold">{correctPredictions}</span></p>
                <p>• Total Predictions: <span className="font-bold">{totalPredictions}</span></p>
                <p>• Calculated Accuracy: <span className="font-bold text-green-600">{modelMetrics.accuracy.toFixed(1)}%</span></p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800 mb-2">Precision Calculation</h3>
              <div className="bg-white p-4 rounded border font-mono text-sm">
                Precision = True Positives / (True Positives + False Positives)
              </div>
              <p className="mt-2 text-blue-700 text-sm">
                Measures how many of the positive predictions were actually correct. 
                Your dataset achieves <strong>{modelMetrics.precision.toFixed(1)}%</strong> precision.
              </p>
            </div>

            <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800 mb-2">Recall Calculation</h3>
              <div className="bg-white p-4 rounded border font-mono text-sm">
                Recall = True Positives / (True Positives + False Negatives)
              </div>
              <p className="mt-2 text-purple-700 text-sm">
                Measures how many actual positives were correctly identified. 
                Your dataset achieves <strong>{modelMetrics.recall.toFixed(1)}%</strong> recall.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border-l-4 border-orange-500">
              <h3 className="font-semibold text-orange-800 mb-2">F1-Score Calculation</h3>
              <div className="bg-white p-4 rounded border font-mono text-sm">
                F1-Score = 2 × (Precision × Recall) / (Precision + Recall)
              </div>
              <p className="mt-2 text-orange-700 text-sm">
                Harmonic mean of precision and recall, providing balanced performance measure. 
                Your dataset achieves <strong>{modelMetrics.f1Score.toFixed(1)}%</strong> F1-score.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Live Metrics from Your Data</h2>
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

        {/* Data Quality Impact */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-800">How Your Data Affects Accuracy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Data Quality Factors</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Dataset Size:</strong> {csvData.length.toLocaleString()} records provide {csvData.length > 1000 ? 'excellent' : csvData.length > 500 ? 'good' : 'limited'} training data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Feature Count:</strong> {numericColumns.length} numeric features enable {numericColumns.length > 5 ? 'complex' : 'simple'} pattern recognition</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Class Balance:</strong> {modelMetrics.confusionMatrix.length} classes detected in your data</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Performance Insights</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Your accuracy of <strong>{modelMetrics.accuracy.toFixed(1)}%</strong> is {modelMetrics.accuracy > 85 ? 'excellent' : modelMetrics.accuracy > 75 ? 'good' : 'needs improvement'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Precision-Recall balance: {Math.abs(modelMetrics.precision - modelMetrics.recall) < 5 ? 'Well balanced' : 'Some imbalance detected'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Model complexity: Optimized for {csvData.length} records with {numericColumns.length} features</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm">
              <strong>Real-time Updates:</strong> These metrics automatically recalculate whenever you upload a new CSV file. 
              The model adapts to your data structure, size, and quality to provide accurate performance measurements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAccuracy;