import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MapPin, Clock, TrendingUp, AlertTriangle, Shield, Target } from 'lucide-react';

interface TrainingResults {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  featureImportance: Array<{ feature: string; importance: number }>;
}

interface DatasetInfo {
  name: string;
  size: number;
  rows: number;
  columns: string[];
  preview: any[];
}

interface DatasetInsightsProps {
  trainingResults: TrainingResults;
  datasetInfo: DatasetInfo | null;
}

const DatasetInsights: React.FC<DatasetInsightsProps> = ({ trainingResults, datasetInfo }) => {
  // Mock time-based predictions
  const hourlyPredictions = [
    { hour: '00:00', risk: 15, crimes: 8 },
    { hour: '02:00', risk: 25, crimes: 12 },
    { hour: '04:00', risk: 18, crimes: 6 },
    { hour: '06:00', risk: 12, crimes: 4 },
    { hour: '08:00', risk: 22, crimes: 15 },
    { hour: '10:00', risk: 35, crimes: 28 },
    { hour: '12:00', risk: 45, crimes: 35 },
    { hour: '14:00', risk: 52, crimes: 42 },
    { hour: '16:00', risk: 48, crimes: 38 },
    { hour: '18:00', risk: 65, crimes: 55 },
    { hour: '20:00', risk: 78, crimes: 68 },
    { hour: '22:00', risk: 85, crimes: 72 }
  ];

  // Mock hotspot predictions
  const hotspots = [
    { location: 'Downtown Core', risk: 'Critical', predicted: 45, actual: 42, accuracy: 93.3 },
    { location: 'North District', risk: 'High', predicted: 28, actual: 31, accuracy: 90.3 },
    { location: 'East Side', risk: 'High', predicted: 22, actual: 19, accuracy: 86.4 },
    { location: 'West Village', risk: 'Medium', predicted: 15, actual: 17, accuracy: 88.2 },
    { location: 'South Bay', risk: 'Low', predicted: 8, actual: 6, accuracy: 75.0 }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* AI-Generated Insights */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">AI-Generated Insights</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900">Temporal Patterns</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Crime rates peak between 8 PM - 10 PM with a 78% higher risk compared to morning hours. 
                    Weekend evenings show 23% increase in criminal activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900">Geographic Hotspots</h3>
                  <p className="text-red-700 text-sm mt-1">
                    Downtown Core shows critical risk levels with 45 predicted incidents. 
                    Concentration of theft and burglary cases in commercial districts.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900">Prevention Opportunities</h3>
                  <p className="text-green-700 text-sm mt-1">
                    Increased patrol presence during 6-10 PM could reduce crime by up to 35%. 
                    Focus on high-traffic commercial areas and transit hubs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-900">Seasonal Trends</h3>
                  <p className="text-purple-700 text-sm mt-1">
                    Summer months show 18% increase in street crimes. 
                    Holiday periods correlate with higher burglary rates in residential areas.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Risk Factors</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Proximity to transit stations increases theft probability by 42%. 
                    Areas with limited lighting show higher assault incident rates.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-indigo-900">Model Confidence</h3>
                  <p className="text-indigo-700 text-sm mt-1">
                    Predictions show 87.3% accuracy with highest confidence in theft and burglary categories. 
                    Real-time updates improve prediction reliability by 12%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Temporal Risk Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Hourly Crime Risk Prediction</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={hourlyPredictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'risk' ? `${value}% Risk` : `${value} Incidents`,
                name === 'risk' ? 'Crime Risk' : 'Predicted Crimes'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="risk" 
              stackId="1" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.6}
              name="risk"
            />
            <Area 
              type="monotone" 
              dataKey="crimes" 
              stackId="2" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
              name="crimes"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hotspot Predictions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Crime Hotspot Predictions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Predicted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotspots.map((hotspot, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hotspot.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(hotspot.risk)}`}>
                      {hotspot.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotspot.predicted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotspot.actual}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-medium ${hotspot.accuracy > 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {hotspot.accuracy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Strategic Recommendations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Resource Allocation</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">Deploy 40% more patrol units in Downtown Core during evening hours</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">Increase surveillance coverage in North District commercial areas</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">Focus community policing efforts on East Side residential zones</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-4">Prevention Strategies</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">Implement targeted lighting improvements in high-risk areas</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">Establish mobile command units during peak crime hours</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">Launch community awareness programs in medium-risk neighborhoods</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetInsights;