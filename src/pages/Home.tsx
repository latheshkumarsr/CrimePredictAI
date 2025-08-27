import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BarChart3, Target, TrendingUp, Users, Award } from 'lucide-react';
import StatCard from '../components/Stats/StatCard';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              CrimePredictAI
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Advanced Machine Learning for Crime Pattern Analysis & Prediction
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-3xl mx-auto">
              Leveraging cutting-edge artificial intelligence to analyze crime patterns, 
              predict criminal activity, and enhance public safety through data-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/prediction"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-flex items-center"
              >
                <Target className="h-5 w-5 mr-2" />
                Try Live Demo
              </Link>
              <Link
                to="/dashboard"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-flex items-center"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proven AI Performance
            </h2>
            <p className="text-lg text-gray-600">
              Our machine learning models deliver exceptional accuracy in crime prediction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              title="Model Accuracy"
              value="88.6%"
              icon={Award}
              description="Random Forest Algorithm"
              color="green"
            />
            <StatCard
              title="Algorithms Tested"
              value="4"
              icon={BarChart3}
              description="ML Models Compared"
              color="blue"
            />
            <StatCard
              title="Data Points"
              value="10K+"
              icon={TrendingUp}
              description="Crime Records Analyzed"
              color="yellow"
            />
            <StatCard
              title="Predictions"
              value="Real-time"
              icon={Target}
              description="Instant Crime Risk Assessment"
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive crime analysis tools powered by artificial intelligence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore Crime Analytics?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Experience the power of AI-driven crime prediction and analysis
          </p>
          <Link
            to="/prediction"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-flex items-center"
          >
            <Shield className="h-5 w-5 mr-2" />
            Start Predicting Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: Target,
    title: "Real-time Predictions",
    description: "Get instant crime risk assessments for any location and time with confidence scores."
  },
  {
    icon: BarChart3,
    title: "Interactive Dashboards",
    description: "Visualize crime trends, hotspots, and patterns through comprehensive analytics."
  },
  {
    icon: Shield,
    title: "Multi-Algorithm Analysis",
    description: "Compare performance across Random Forest, SVM, Decision Tree, and KNN models."
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description: "Identify seasonal patterns and emerging crime trends in your area."
  },
  {
    icon: Users,
    title: "Risk Assessment",
    description: "Evaluate crime risk levels across different neighborhoods and districts."
  },
  {
    icon: Award,
    title: "Proven Accuracy",
    description: "Validated models with 88.6% accuracy rate for reliable predictions."
  }
];

export default Home;