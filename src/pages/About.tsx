import React from 'react';
import { BookOpen, Database, Brain, Target, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About Crime Pattern Analysis and Prediction</h1>
          <p className="text-gray-600">
            Understanding our methodology, technology, and approach to crime prediction
          </p>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Target className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Project Overview</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Crime Pattern Analysis and Prediction represents a cutting-edge application of machine learning 
            techniques to the critical challenge of crime prediction and prevention. 
            This project demonstrates how artificial intelligence can be leveraged to 
            analyze complex crime patterns and provide actionable insights for law 
            enforcement agencies and policymakers.
          </p>
          <p className="text-gray-700">
            By combining historical crime data with advanced algorithms, we've created 
            a comprehensive platform that not only predicts potential criminal activity 
            but also provides detailed analytics to help understand the underlying 
            factors contributing to crime in different areas.
          </p>
        </div>

        {/* Technical Implementation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Technical Implementation</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Machine Learning Algorithms</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Random Forest:</strong> 88.6% accuracy - Best overall performer
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Support Vector Machine:</strong> 84.3% accuracy - Balanced performance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Decision Tree:</strong> 81.25% accuracy - High interpretability
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>K-Nearest Neighbors:</strong> 79.1% accuracy - Pattern matching
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Technology Stack</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Frontend:</strong> React, TypeScript, Tailwind CSS
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Visualization:</strong> Recharts, React-Leaflet
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>ML Backend:</strong> Python, Scikit-learn, Pandas
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Deployment:</strong> Modern web standards
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dataset Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Dataset & Preprocessing</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Data Sources</h3>
              <p className="text-gray-700">
                Our dataset comprises over 10,000 crime records spanning multiple years, 
                including various crime types such as theft, burglary, assault, vandalism, 
                and drug-related offenses. The data includes temporal, geographical, and 
                categorical features essential for accurate prediction.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Feature Engineering</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-1 text-gray-700">
                  <li>• Temporal features (hour, day, month, season)</li>
                  <li>• Geographic coordinates and district mapping</li>
                  <li>• Crime type categorization and severity levels</li>
                  <li>• Historical pattern indicators</li>
                </ul>
                <ul className="space-y-1 text-gray-700">
                  <li>• Weather and environmental factors</li>
                  <li>• Demographic and socioeconomic indicators</li>
                  <li>• Event and holiday markers</li>
                  <li>• Law enforcement resource allocation</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Data Preprocessing</h3>
              <p className="text-gray-700">
                Extensive preprocessing included data cleaning, outlier detection, 
                feature scaling, and categorical encoding. Missing values were handled 
                through imputation strategies, and data was normalized to ensure 
                optimal algorithm performance.
              </p>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Research Methodology</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">1. Data Collection & Analysis</h3>
              <p className="text-gray-700">
                Comprehensive collection of historical crime data with careful attention 
                to data quality, completeness, and representativeness across different 
                geographical areas and time periods.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">2. Model Development</h3>
              <p className="text-gray-700">
                Implementation and comparison of multiple machine learning algorithms, 
                with hyperparameter tuning and cross-validation to ensure robust 
                performance across different scenarios.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">3. Performance Evaluation</h3>
              <p className="text-gray-700">
                Rigorous evaluation using multiple metrics including accuracy, precision, 
                recall, and F1-score, with confusion matrices to understand model 
                performance across different crime categories.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">4. Validation & Testing</h3>
              <p className="text-gray-700">
                Extensive validation on held-out test sets and temporal validation to 
                ensure model generalizability and real-world applicability.
              </p>
            </div>
          </div>
        </div>

        {/* Impact & Applications */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Impact & Applications</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Law Enforcement</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Predictive policing and resource allocation
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Crime prevention strategy development
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Patrol route optimization
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Risk assessment and threat analysis
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Urban Planning</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Safety-informed urban development
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Community safety program planning
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Public space security enhancement
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Emergency response optimization
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Academic References */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Academic References</h2>
          </div>
          
          <div className="space-y-3 text-gray-700">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">
                Chen, H., Chung, W., Xu, J. J., Wang, G., Qin, Y., & Chau, M. (2004). 
                Crime data mining: a general framework and some examples. Computer, 37(4), 50-56.
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">
                Mohler, G. O., Short, M. B., Brantingham, P. J., Schoenberg, F. P., & Tita, G. E. (2011). 
                Self-exciting point process modeling of crime. Journal of the American Statistical Association, 106(493), 100-108.
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">
                Kianmehr, K., & Alhajj, R. (2006). 
                Effectiveness of support vector machine for crime hot-spots prediction. 
                Applied Artificial Intelligence, 20(5), 433-458.
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">
                Yu, C. H., Ward, M. W., Morabito, M., & Ding, W. (2011). 
                Crime forecasting using data mining techniques. 
                IEEE 11th International Conference on Data Mining Workshops, 779-786.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;