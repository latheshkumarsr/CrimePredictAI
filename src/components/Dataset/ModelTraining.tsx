import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Award, Target, TrendingUp } from 'lucide-react';

interface TrainingResults {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  featureImportance: Array<{ feature: string; importance: number }>;
}

interface ModelTrainingProps {
  trainingResults: TrainingResults;
}

const ModelTraining: React.FC<ModelTrainingProps> = ({ trainingResults }) => {
  const {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix,
    featureImportance
  } = trainingResults;

  const metricsData = [
    { metric: 'Accuracy', value: accuracy },
    { metric: 'Precision', value: precision },
    { metric: 'Recall', value: recall },
    { metric: 'F1-Score', value: f1Score }
  ];

  const confusionLabels = ['Theft', 'Burglary', 'Assault', 'Vandalism'];

  const getColor = (value: number, max: number) => {
    const intensity = value / max;
    return `rgba(59, 130, 246, ${intensity})`;
  };

  const maxValue = Math.max(...confusionMatrix.flat());

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Model Training Results</h2>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Precision</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{precision.toFixed(1)}%</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-900">Recall</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{recall.toFixed(1)}%</p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-orange-900">F1-Score</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{f1Score.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Metrics Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
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

        {/* Feature Importance Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Feature Importance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 1]} />
              <YAxis dataKey="feature" type="category" width={100} />
              <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Importance']} />
              <Bar dataKey="importance" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confusion Matrix</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Predicted
                </th>
                {confusionLabels.map((label, index) => (
                  <th key={index} className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confusionMatrix.map((row, rowIndex) => (
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

      {/* Training Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Training Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
          <div>
            <p className="font-medium">Model Performance:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Achieved {accuracy.toFixed(1)}% accuracy on test set</li>
              <li>• Balanced precision and recall scores</li>
              <li>• Strong performance across all crime categories</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Key Insights:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Time of day is the most important feature</li>
              <li>• Geographic location significantly impacts predictions</li>
              <li>• Model ready for deployment and real-time predictions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;