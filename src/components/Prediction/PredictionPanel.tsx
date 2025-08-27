import React, { useState } from 'react';
import { Target, MapPin, Calendar, Clock } from 'lucide-react';
import { PredictionResult } from '../../types';

interface PredictionPanelProps {
  onPredict: (data: any) => Promise<PredictionResult[]>;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ onPredict }) => {
  const [formData, setFormData] = useState({
    latitude: '40.7128',
    longitude: '-74.0060',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    crimeType: ''
  });
  
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);

  const crimeTypes = ['All Types', 'Theft', 'Burglary', 'Assault', 'Vandalism', 'Drug-related', 'Vehicle Crime'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const results = await onPredict(formData);
      setPredictions(results);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability > 0.7) return 'text-red-600 bg-red-100';
    if (probability > 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Crime Prediction Panel</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="h-4 w-4 inline mr-1" />
              Latitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="40.7128"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="h-4 w-4 inline mr-1" />
              Longitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-74.0060"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="h-4 w-4 inline mr-1" />
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crime Type Filter (Optional)
          </label>
          <select
            value={formData.crimeType}
            onChange={(e) => setFormData({ ...formData, crimeType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {crimeTypes.map((type) => (
              <option key={type} value={type === 'All Types' ? '' : type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          {loading ? 'Predicting...' : 'Generate Prediction'}
        </button>
      </form>

      {predictions.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Prediction Results</h3>
          {predictions.map((prediction, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{prediction.crimeType}</span>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getProbabilityColor(prediction.probability)}`}>
                    {(prediction.probability * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;