import React from 'react';
import { modelMetrics } from '../data/mockData';
import ConfusionMatrix from '../components/Charts/ConfusionMatrix';
import CustomBarChart from '../components/Charts/BarChart';
import { Brain, Award, Target, BarChart3 } from 'lucide-react';

const Models = () => {
  const confusionLabels = ['Theft', 'Burglary', 'Assault', 'Vandalism'];

  // Prepare data for model comparison chart
  const comparisonData = modelMetrics.map(model => ({
    name: model.name,
    accuracy: model.accuracy,
    precision: model.precision,
    recall: model.recall,
    f1Score: model.f1Score
  }));

  const getModelColor = (accuracy: number) => {
    if (accuracy >= 85) return 'bg-green-500';
    if (accuracy >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getModelRank = (accuracy: number) => {
    if (accuracy >= 85) return 'Excellent';
    if (accuracy >= 80) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Model Performance Analysis</h1>
          <p className="text-gray-600">
            Comprehensive evaluation and comparison of machine learning algorithms
          </p>
        </div>

        {/* Model Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {modelMetrics.map((model, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getModelColor(model.accuracy)}`}>
                  {getModelRank(model.accuracy)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{model.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-semibold text-blue-600">{model.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precision:</span>
                  <span className="font-semibold">{model.precision}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recall:</span>
                  <span className="font-semibold">{model.recall}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">F1-Score:</span>
                  <span className="font-semibold">{model.f1Score}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Model Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CustomBarChart
            data={comparisonData}
            dataKey="accuracy"
            xAxisKey="name"
            title="Model Accuracy Comparison"
            color="#3b82f6"
          />
          <CustomBarChart
            data={comparisonData}
            dataKey="f1Score"
            xAxisKey="name"
            title="F1-Score Comparison"
            color="#10b981"
          />
        </div>

        {/* Confusion Matrices */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Confusion Matrices</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modelMetrics.slice(0, 4).map((model, index) => (
              <ConfusionMatrix
                key={index}
                matrix={model.confusionMatrix}
                labels={confusionLabels}
                title={`${model.name} Confusion Matrix`}
              />
            ))}
          </div>
        </div>

        {/* Model Insights */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Model Insights & Analysis</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <Award className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Best Performer</h3>
              <p className="text-green-700">
                <strong>Random Forest</strong> achieved the highest accuracy at 88.6%, 
                demonstrating superior performance in crime type classification.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Balanced Performance</h3>
              <p className="text-blue-700">
                <strong>SVM</strong> shows consistent performance across precision and recall, 
                making it reliable for balanced crime prediction scenarios.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-yellow-600 mb-3" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Interpretability</h3>
              <p className="text-yellow-700">
                <strong>Decision Tree</strong> offers excellent interpretability, 
                making it valuable for understanding crime prediction factors.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Findings</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Random Forest consistently outperforms other algorithms across all metrics
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                All models show strong performance in theft and burglary prediction
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Ensemble methods prove more effective for complex crime pattern recognition
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Model performance varies by crime type, with violent crimes showing lower prediction accuracy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;