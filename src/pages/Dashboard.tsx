import React from 'react';
import { useData } from '../context/DataContext';
import CustomBarChart from '../components/Charts/BarChart';
import CustomLineChart from '../components/Charts/LineChart';
import CustomPieChart from '../components/Charts/PieChart';
import CrimeMap from '../components/Map/CrimeMap';
import StatCard from '../components/Stats/StatCard';
import DatasetSelector from '../components/Dashboard/DatasetSelector';
import { TrendingUp, MapPin, AlertTriangle, Shield, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { 
    crimeData, 
    crimeTrends, 
    locationHotspots, 
    currentDataset, 
    isLoading, 
    error,
    refreshDashboard 
  } = useData();

  // Process data for charts
  const crimeTypeData = crimeData.reduce((acc, crime) => {
    acc[crime.type] = (acc[crime.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(crimeTypeData).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const severityData = crimeData.reduce((acc, crime) => {
    acc[crime.severity] = (acc[crime.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityChartData = Object.entries(severityData).map(([severity, count]) => ({
    severity,
    count
  }));

  // Aggregate trend data by month
  const monthlyTrends = crimeTrends.reduce((acc, trend) => {
    const existing = acc.find(item => item.month === trend.month);
    if (existing) {
      existing.Theft = trend.type === 'Theft' ? trend.count : existing.Theft || 0;
      existing.Burglary = trend.type === 'Burglary' ? trend.count : existing.Burglary || 0;
    } else {
      acc.push({
        month: trend.month,
        Theft: trend.type === 'Theft' ? trend.count : 0,
        Burglary: trend.type === 'Burglary' ? trend.count : 0
      });
    }
    return acc;
  }, [] as any[]);

  const totalCrimes = crimeData.length;
  const highSeverityCrimes = crimeData.filter(crime => crime.severity === 'High' || crime.severity === 'Critical').length;
  const openCases = crimeData.filter(crime => crime.status === 'Open' || crime.status === 'Under Investigation').length;
  const riskScore = ((highSeverityCrimes / totalCrimes) * 100).toFixed(1);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshDashboard}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crime Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive crime data analysis and visualization</p>
            {currentDataset && (
              <p className="text-sm text-blue-600 mt-1">
                Current Dataset: {currentDataset.name} ({currentDataset.rows.toLocaleString()} records)
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshDashboard}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <DatasetSelector />
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
              <span className="text-gray-800">Updating dashboard...</span>
            </div>
          </div>
        )}

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Crimes"
            value={totalCrimes.toLocaleString()}
            icon={TrendingUp}
            description="Last 12 months"
            color="blue"
          />
          <StatCard
            title="High Risk Cases"
            value={highSeverityCrimes}
            icon={AlertTriangle}
            description="Critical & High severity"
            color="red"
          />
          <StatCard
            title="Open Cases"
            value={openCases}
            icon={Shield}
            description="Under investigation"
            color="yellow"
          />
          <StatCard
            title="Risk Score"
            value={`${riskScore}%`}
            icon={MapPin}
            description="Area risk assessment"
            color="green"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CustomBarChart
            data={locationHotspots}
            dataKey="count"
            xAxisKey="location"
            title="Top Crime Locations"
            color="#3b82f6"
          />
          
          <CustomPieChart
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            title="Crime Type Distribution"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CustomLineChart
            data={monthlyTrends}
            title="Monthly Crime Trends"
            lines={[
              { dataKey: 'Theft', stroke: '#3b82f6', name: 'Theft' },
              { dataKey: 'Burglary', stroke: '#ef4444', name: 'Burglary' }
            ]}
          />
          
          <CustomBarChart
            data={severityChartData}
            dataKey="count"
            xAxisKey="severity"
            title="Crime Severity Levels"
            color="#f59e0b"
          />
        </div>

        {/* Crime Map */}
        <div className="mb-8">
          <CrimeMap 
            crimeData={crimeData.length > 0 ? crimeData : []} 
            height={600} 
            showAllPoints={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;