import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, Target, Brain, BookOpen, Upload, LogOut, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import AuthModal from '../Auth/AuthModal';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, signOut } = useData();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Shield },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/prediction', label: 'Live Demo', icon: Target },
    { path: '/dataset-upload', label: 'Upload Dataset', icon: Upload },
    { path: '/models', label: 'Model Performance', icon: Brain },
    { path: '/about', label: 'About', icon: BookOpen },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <nav className="bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">CrimePredictAI</span>
            </Link>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
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
                
                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-blue-200 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navbar;