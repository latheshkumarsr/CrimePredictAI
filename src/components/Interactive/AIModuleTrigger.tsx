import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Zap } from 'lucide-react';

interface AIModuleTriggerProps {
  onActivate: () => void;
}

const AIModuleTrigger: React.FC<AIModuleTriggerProps> = ({ onActivate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show trigger after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setIsAnimating(false);
    onActivate();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={handleClick}
        className={`group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isAnimating ? 'animate-bounce' : ''
        }`}
      >
        {/* Pulsing Ring */}
        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        
        {/* Main Icon */}
        <div className="relative z-10 flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap">
            Activate AI Hub
          </span>
        </div>

        {/* Floating Sparkles */}
        <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400 animate-pulse" />
        <Zap className="absolute -bottom-1 -left-1 h-3 w-3 text-yellow-300 animate-bounce" />
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Experience AI-Powered Interactions
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default AIModuleTrigger;