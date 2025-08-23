import React from 'react';
import { crimeData, crimeTrends, locationHotspots } from '../data/mockData';
import CustomBarChart from '../components/Charts/BarChart';
import CustomLineChart from '../components/Charts/LineChart';
import CustomPieChart from '../components/Charts/PieChart';
import CrimeMap from '../components/Map/CrimeMap';
import StatCard from '../components/Stats/StatCard';
import { TrendingUp, MapPin, AlertTriangle, Shield } from 'lucide-react';

const Dashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crime Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive crime data analysis and visualization</p>
        </div>

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
          <CrimeMap crimeData={crimeData} height={500} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;