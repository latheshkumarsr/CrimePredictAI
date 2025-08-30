import React from 'react';
import { useCSVData } from '../context/CSVDataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Brain, Eye, TrendingUp, FileText, Zap, AlertCircle } from 'lucide-react';

const ModelInterpretability = () => {
  const { csvData, fileName, modelMetrics, columns, isLoading } = useCSVData();

  if (!fileName || !modelMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-800 mb-4">No Model Available</h2>
            <p className="text-blue-600">
              Upload a CSV dataset to see live feature importance and model interpretability analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const numericColumns = columns.filter(col => 
    csvData.some(row => typeof row[col] === 'number')
  );

  // Calculate correlation matrix for numeric features
  const correlationData = numericColumns.slice(0, 5).map((col1, i) => {
    return numericColumns.slice(0, 5).map((col2, j) => {
      const values1 = csvData.map(row => Number(row[col1]) || 0);
      const values2 = csvData.map(row => Number(row[col2]) || 0);
      
      const correlation = calculateCorrelation(values1, values2);
      
      return {
        x: i,
        y: j,
        correlation: correlation,
        feature1: col1,
        feature2: col2
      };
    });
  }).flat();

  // Generate SHAP-like explanations
  const shapExplanations = modelMetrics.featureImportance.slice(0, 5).map(feature => {
    const values = csvData.map(row => Number(row[feature.feature]) || 0);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const impact = feature.importance > 0.2 ? 'High' : feature.importance > 0.1 ? 'Medium' : 'Low';
    
    return {
      feature: feature.feature,
      importance: feature.importance,
      impact,
      meanValue: mean.toFixed(2),
      explanation: generateFeatureExplanation(feature.feature, feature.importance, mean)
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Model Interpretability</h1>
          <p className="text-gray-600">
            Real-time feature importance and model explanations from your dataset: <span className="font-medium text-blue-600">{fileName}</span>
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Analyzing {csvData.length.toLocaleString()} records • {numericColumns.length} numeric features
            {isLoading && <span className="ml-2 text-blue-600">• Updating...</span>}
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Feature Importance (Live from Your Data)</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={modelMetrics.featureImportance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 1]} />
              <YAxis dataKey="feature" type="category" width={120} />
              <Tooltip 
                formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Importance']}
                labelFormatter={(label) => `Feature: ${label}`}
              />
              <Bar dataKey="importance" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SHAP-like Explanations */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Feature Impact Analysis</h2>
          </div>
          
          <div className="space-y-4">
            {shapExplanations.map((explanation, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{explanation.feature}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      explanation.impact === 'High' ? 'bg-red-100 text-red-800' :
                      explanation.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {explanation.impact} Impact
                    </span>
                    <span className="text-sm text-gray-500">
                      {(explanation.importance * 100).toFixed(1)}% importance
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{explanation.explanation}</p>
                <div className="text-xs text-gray-500">
                  Mean value in your dataset: <span className="font-medium">{explanation.meanValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Correlation Heatmap */}
        {numericColumns.length > 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Feature Correlation Matrix</h2>
            </div>
            
            <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
              {correlationData.map((cell, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center text-xs font-medium rounded"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${Math.abs(cell.correlation)})`,
                    color: Math.abs(cell.correlation) > 0.5 ? 'white' : 'black'
                  }}
                  title={`${cell.feature1} vs ${cell.feature2}: ${cell.correlation.toFixed(2)}`}
                >
                  {cell.correlation.toFixed(1)}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Correlation values range from -1 to 1. Higher absolute values indicate stronger relationships.
              </p>
            </div>
          </div>
        )}

        {/* Model Decision Process */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">Model Decision Process</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800 mb-2">How the Model Uses Your Data</h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• Analyzes {numericColumns.length} numeric features from your CSV</li>
                <li>• Identifies {modelMetrics.confusionMatrix.length} distinct classes in your data</li>
                <li>• Uses feature variance to determine importance rankings</li>
                <li>• Calculates correlations between all numeric columns</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800 mb-2">Top Contributing Factors</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                {modelMetrics.featureImportance.slice(0, 3).map((feature, index) => (
                  <li key={index}>
                    • <strong>{feature.feature}</strong>: {(feature.importance * 100).toFixed(1)}% contribution to predictions
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800 mb-2">Real-time Adaptability</h3>
              <p className="text-purple-700 text-sm">
                All interpretability metrics automatically recalculate when you upload new CSV data. 
                The model adapts its feature importance rankings based on the variance and patterns 
                found specifically in your dataset, ensuring explanations are always relevant to your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate correlation
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

// Generate human-readable explanations
function generateFeatureExplanation(feature: string, importance: number, meanValue: number): string {
  const impactLevel = importance > 0.2 ? 'strongly' : importance > 0.1 ? 'moderately' : 'weakly';
  
  return `This feature ${impactLevel} influences model predictions. With an average value of ${meanValue} in your dataset, it contributes ${(importance * 100).toFixed(1)}% to the overall decision-making process.`;
}

export default ModelInterpretability;