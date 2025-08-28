import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import AuthModal from '../components/Auth/AuthModal';
import CustomBarChart from '../components/Charts/BarChart';
import CustomLineChart from '../components/Charts/LineChart';
import CustomPieChart from '../components/Charts/PieChart';
import GlobalCrimeMap from '../components/Map/GlobalCrimeMap';
import StatCard from '../components/Stats/StatCard';
import DatasetSelector from '../components/Dashboard/DatasetSelector';
import { TrendingUp, MapPin, AlertTriangle, Shield, RefreshCw, Upload, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { 
    crimeData, 
    crimeTrends, 
    locationHotspots, 
    currentDataset, 
    isLoading, 
    error,
    refreshDashboard,
    isAuthenticated
  } = useData();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Authentication Required</h2>
            <p className="text-blue-600 mb-6">
              Please sign in to access your crime analytics dashboard and upload datasets.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

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

  // Show empty state if no data
  if (crimeData.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h2>
            <p className="text-gray-600 mb-6">
              Upload your first crime dataset to start analyzing patterns and generating insights.
            </p>
            <Link
              to="/dataset-upload"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Dataset
            </Link>
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
                Current Dataset: {currentDataset.name} ({currentDataset.row_count.toLocaleString()} records)
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
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
              <div>
                <span className="text-gray-800 font-medium">Processing data...</span>
                <p className="text-sm text-gray-600">This may take a moment for large datasets</p>
              </div>
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
          <GlobalCrimeMap 
            crimeData={crimeData} 
            height={500}
            showHeatmap={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;