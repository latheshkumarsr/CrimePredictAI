import React, { useState, useEffect, useRef } from 'react';
import { MapPin, MessageCircle, Shield, Brain } from 'lucide-react';
import GeolocationPersonalizer from './GeolocationPersonalizer';
import GameifiedQuestionnaire from './GameifiedQuestionnaire';
import ConversationalAI from './ConversationalAI';
import DynamicVisuals from './DynamicVisuals';

interface AIModuleProps {
  isVisible: boolean;
  onClose: () => void;
}

const AIModule: React.FC<AIModuleProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'personalize' | 'adventure' | 'chat'>('personalize');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const moduleRef = useRef<HTMLDivElement>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      startRealtimeTracking();
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isVisible]);

  const startRealtimeTracking = () => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.log('Geolocation error:', error);
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  if (!isVisible) return null;

  const tabs = [
    { id: 'personalize', label: 'Smart Adapt', icon: Brain, color: 'blue' },
    { id: 'adventure', label: 'Safety Quest', icon: Shield, color: 'green' },
    { id: 'chat', label: 'AI Assistant', icon: MessageCircle, color: 'purple' }
  ];

  const getTabColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      green: isActive ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
      purple: isActive ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={moduleRef}
        className={`bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header with Dynamic Background */}
        <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white p-6">
          <DynamicVisuals />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI-Powered Crime Intelligence Hub</h2>
              <p className="text-blue-200">Personalized safety insights powered by advanced AI</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  getTabColor(tab.color, activeTab === tab.id)
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'personalize' && (
            <GeolocationPersonalizer 
              userLocation={userLocation}
              onPreferencesUpdate={setUserPreferences}
            />
          )}
          
          {activeTab === 'adventure' && (
            <GameifiedQuestionnaire 
              userLocation={userLocation}
              userPreferences={userPreferences}
            />
          )}
          
          {activeTab === 'chat' && (
            <ConversationalAI
              userLocation={userLocation}
              userPreferences={userPreferences}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModule;