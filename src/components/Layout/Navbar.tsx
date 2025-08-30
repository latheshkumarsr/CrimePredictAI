import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Upload, BarChart3, Target, Brain, BookOpen, Activity, RefreshCw } from 'lucide-react';
import { useCSVData } from '../../context/CSVDataContext';

const Navbar = () => {
  const location = useLocation();
  const { fileName, refreshAnalysis, isLoading } = useCSVData();

  const navItems = [
    { path: '/', label: 'Data Upload', icon: Upload },
    { path: '/live-demo', label: 'Live Demo', icon: BarChart3 },
    { path: '/model-performance', label: 'Model Performance', icon: Target },
    { path: '/about-accuracy', label: 'About Accuracy', icon: BookOpen },
    { path: '/interpretability', label: 'Interpretability', icon: Brain },
    { path: '/pattern-matching', label: 'Pattern Matching', icon: Activity },
  ];

  return (
    <nav className="bg-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">ML Dashboard</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            
            {fileName && (
              <div className="flex items-center space-x-2 text-blue-200">
                <span className="text-sm">Dataset: {fileName}</span>
                <button
                  onClick={refreshAnalysis}
                  disabled={isLoading}
                  className="p-1 hover:bg-blue-800 rounded transition-colors"
                  title="Refresh Analysis"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;