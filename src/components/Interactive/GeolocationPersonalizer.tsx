import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Shield, Clock, Thermometer, Users } from 'lucide-react';

interface GeolocationPersonalizerProps {
  userLocation: { lat: number; lng: number } | null;
  onPreferencesUpdate: (preferences: any) => void;
}

const GeolocationPersonalizer: React.FC<GeolocationPersonalizerProps> = ({ 
  userLocation, 
  onPreferencesUpdate 
}) => {
  const [localInsights, setLocalInsights] = useState<any>(null);
  const [personalizedContent, setPersonalizedContent] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (userLocation) {
      analyzeLocation();
    }
  }, [userLocation]);

  const analyzeLocation = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis of user's location
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockInsights = {
      areaName: getAreaName(userLocation!),
      riskLevel: getRiskLevel(userLocation!),
      localTrends: generateLocalTrends(),
      recommendations: generateRecommendations(),
      timeBasedAlerts: generateTimeAlerts(),
      communityStats: generateCommunityStats()
    };
    
    setLocalInsights(mockInsights);
    setPersonalizedContent(generatePersonalizedContent(mockInsights));
    onPreferencesUpdate(mockInsights);
    setIsAnalyzing(false);
  };

  const getAreaName = (location: { lat: number; lng: number }) => {
    // Simulate area detection based on coordinates
    if (location.lat > 40.75) return "Uptown District";
    if (location.lat > 40.72) return "Midtown Area";
    return "Downtown Core";
  };

  const getRiskLevel = (location: { lat: number; lng: number }) => {
    const risk = Math.random();
    if (risk > 0.7) return { level: 'High', color: 'red', score: 78 };
    if (risk > 0.4) return { level: 'Medium', color: 'yellow', score: 45 };
    return { level: 'Low', color: 'green', score: 23 };
  };

  const generateLocalTrends = () => [
    { type: 'Theft', trend: '+12%', period: 'Last 30 days' },
    { type: 'Burglary', trend: '-8%', period: 'Last 30 days' },
    { type: 'Vandalism', trend: '+3%', period: 'Last 30 days' }
  ];

  const generateRecommendations = () => [
    "Avoid walking alone after 9 PM in this area",
    "Use well-lit main streets when possible",
    "Consider ride-sharing for late evening travel",
    "Stay alert near transit stations during rush hours"
  ];

  const generateTimeAlerts = () => [
    { time: '6-9 PM', alert: 'Peak crime hours - extra caution advised', severity: 'high' },
    { time: '10 PM-2 AM', alert: 'Increased theft risk in commercial areas', severity: 'medium' },
    { time: '3-6 AM', alert: 'Low activity period - generally safer', severity: 'low' }
  ];

  const generateCommunityStats = () => ({
    population: Math.floor(Math.random() * 50000) + 10000,
    crimeRate: (Math.random() * 5 + 2).toFixed(1),
    safetyRating: (Math.random() * 2 + 7).toFixed(1),
    policeResponse: Math.floor(Math.random() * 10) + 5
  });

  const generatePersonalizedContent = (insights: any) => ({
    welcomeMessage: `Welcome to ${insights.areaName}! Based on your location, we've customized your safety insights.`,
    primaryColor: insights.riskLevel.color === 'red' ? '#dc2626' : insights.riskLevel.color === 'yellow' ? '#d97706' : '#059669',
    focusAreas: ['Local Crime Trends', 'Safety Recommendations', 'Community Resources'],
    urgentAlerts: insights.riskLevel.level === 'High' ? 2 : insights.riskLevel.level === 'Medium' ? 1 : 0
  });

  if (!userLocation) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Detecting Your Location</h3>
        <p className="text-gray-500">
          We're analyzing your area to provide personalized safety insights...
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="text-center py-12">
        <div className="relative">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">AI Analyzing Your Area</h3>
        <p className="text-gray-500">
          Processing local crime patterns and generating personalized insights...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personalized Welcome */}
      <div 
        className="p-6 rounded-xl text-white relative overflow-hidden"
        style={{ backgroundColor: personalizedContent?.primaryColor || '#3b82f6' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-20"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">
            {personalizedContent?.welcomeMessage}
          </h3>
          <div className="flex items-center space-x-4 text-sm opacity-90">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
            <span className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Risk Level: {localInsights?.riskLevel.level}
            </span>
          </div>
        </div>
      </div>

      {/* Local Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Area Risk Assessment */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <Shield className={`h-6 w-6 text-${localInsights?.riskLevel.color}-600`} />
            <span className={`px-2 py-1 rounded-full text-xs font-bold text-${localInsights?.riskLevel.color}-800 bg-${localInsights?.riskLevel.color}-100`}>
              {localInsights?.riskLevel.level} Risk
            </span>
          </div>
          <h4 className="font-bold text-gray-800 mb-2">Area Safety Score</h4>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {localInsights?.riskLevel.score}/100
          </div>
          <p className="text-sm text-gray-600">Based on local crime data</p>
        </div>

        {/* Community Stats */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-xs text-gray-500">Live Data</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-2">Community Stats</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Population:</span>
              <span className="font-semibold">{localInsights?.communityStats.population.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Crime Rate:</span>
              <span className="font-semibold">{localInsights?.communityStats.crimeRate}/1000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time:</span>
              <span className="font-semibold">{localInsights?.communityStats.policeResponse} min</span>
            </div>
          </div>
        </div>

        {/* Weather Impact */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <Thermometer className="h-6 w-6 text-orange-600" />
            <span className="text-xs text-gray-500">AI Prediction</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-2">Weather Impact</h4>
          <div className="text-lg font-bold text-orange-600 mb-1">
            +{Math.floor(Math.random() * 15 + 5)}%
          </div>
          <p className="text-sm text-gray-600">Crime increase expected due to weather patterns</p>
        </div>
      </div>

      {/* Local Trends */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Local Crime Trends
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {localInsights?.localTrends.map((trend: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{trend.type}</span>
                <span className={`font-bold ${trend.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                  {trend.trend}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{trend.period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Time-Based Alerts */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-purple-600" />
          Time-Based Safety Alerts
        </h4>
        <div className="space-y-3">
          {localInsights?.timeBasedAlerts.map((alert: any, index: number) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-green-50 border-green-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-gray-800">{alert.time}</span>
                  <p className="text-sm text-gray-600 mt-1">{alert.alert}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          AI Safety Recommendations for Your Area
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localInsights?.recommendations.map((rec: string, index: number) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeolocationPersonalizer;