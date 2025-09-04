import { useState, useEffect } from 'react';

interface UserBehavior {
  visitCount: number;
  timeSpent: number;
  pagesVisited: string[];
  preferredFeatures: string[];
  lastVisit: Date;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location?: { lat: number; lng: number };
}

interface PersonalizationData {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  layout: 'compact' | 'spacious' | 'minimal';
  contentPreferences: string[];
  riskTolerance: 'low' | 'medium' | 'high';
}

export const usePersonalization = () => {
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);
  const [personalization, setPersonalization] = useState<PersonalizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePersonalization();
    trackUserBehavior();
  }, []);

  const initializePersonalization = () => {
    try {
      // Load existing user behavior
      const stored = localStorage.getItem('userBehavior');
      const behavior: UserBehavior = stored ? JSON.parse(stored) : {
        visitCount: 1,
        timeSpent: 0,
        pagesVisited: [window.location.pathname],
        preferredFeatures: [],
        lastVisit: new Date(),
        deviceType: getDeviceType()
      };

      // Update visit count
      behavior.visitCount += 1;
      behavior.lastVisit = new Date();
      
      setUserBehavior(behavior);
      
      // Generate personalization based on behavior
      const personalizedData = generatePersonalization(behavior);
      setPersonalization(personalizedData);
      
      // Save updated behavior
      localStorage.setItem('userBehavior', JSON.stringify(behavior));
      
    } catch (error) {
      console.error('Personalization initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackUserBehavior = () => {
    const startTime = Date.now();
    
    // Track page visits
    const currentPage = window.location.pathname;
    setUserBehavior(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        pagesVisited: [...new Set([...prev.pagesVisited, currentPage])]
      };
      localStorage.setItem('userBehavior', JSON.stringify(updated));
      return updated;
    });

    // Track time spent
    const trackTime = () => {
      const timeSpent = Date.now() - startTime;
      setUserBehavior(prev => {
        if (!prev) return prev;
        const updated = { ...prev, timeSpent: prev.timeSpent + timeSpent };
        localStorage.setItem('userBehavior', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('beforeunload', trackTime);
    return () => window.removeEventListener('beforeunload', trackTime);
  };

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const generatePersonalization = (behavior: UserBehavior): PersonalizationData => {
    // Determine theme preference
    const hour = new Date().getHours();
    const theme = hour >= 18 || hour <= 6 ? 'dark' : 'light';

    // Determine primary color based on usage patterns
    const primaryColor = behavior.visitCount > 5 ? '#7c3aed' : // Purple for power users
                        behavior.pagesVisited.includes('/prediction') ? '#dc2626' : // Red for prediction users
                        '#3b82f6'; // Default blue

    // Determine layout preference
    const layout = behavior.deviceType === 'mobile' ? 'compact' :
                   behavior.timeSpent > 300000 ? 'spacious' : // 5+ minutes
                   'minimal';

    // Determine content preferences
    const contentPreferences = [];
    if (behavior.pagesVisited.includes('/dashboard')) contentPreferences.push('analytics');
    if (behavior.pagesVisited.includes('/prediction')) contentPreferences.push('predictions');
    if (behavior.pagesVisited.includes('/models')) contentPreferences.push('technical');

    return {
      theme,
      primaryColor,
      layout,
      contentPreferences,
      riskTolerance: behavior.visitCount > 3 ? 'high' : 'medium'
    };
  };

  const updatePreference = (key: keyof PersonalizationData, value: any) => {
    if (!personalization) return;
    
    const updated = { ...personalization, [key]: value };
    setPersonalization(updated);
    localStorage.setItem('personalization', JSON.stringify(updated));
  };

  const trackFeatureUsage = (feature: string) => {
    setUserBehavior(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        preferredFeatures: [...new Set([...prev.preferredFeatures, feature])]
      };
      localStorage.setItem('userBehavior', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    userBehavior,
    personalization,
    isLoading,
    updatePreference,
    trackFeatureUsage
  };
};