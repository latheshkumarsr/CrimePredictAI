import React, { ReactNode } from 'react';
import { usePersonalization } from '../../hooks/usePersonalization';

interface PersonalizedLayoutProps {
  children: ReactNode;
}

const PersonalizedLayout: React.FC<PersonalizedLayoutProps> = ({ children }) => {
  const { personalization, userBehavior, isLoading } = usePersonalization();

  if (isLoading || !personalization) {
    return <div>{children}</div>;
  }

  const getLayoutClasses = () => {
    const base = 'transition-all duration-500';
    switch (personalization.layout) {
      case 'compact':
        return `${base} space-y-4 px-2`;
      case 'spacious':
        return `${base} space-y-8 px-8`;
      default:
        return `${base} space-y-6 px-4`;
    }
  };

  const getThemeClasses = () => {
    switch (personalization.theme) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'light':
        return 'bg-white text-gray-900';
      default:
        return 'bg-gray-50 text-gray-900';
    }
  };

  return (
    <div 
      className={`${getThemeClasses()} min-h-screen`}
      style={{ 
        '--primary-color': personalization.primaryColor,
        '--user-visits': userBehavior?.visitCount || 1
      } as React.CSSProperties}
    >
      <div className={getLayoutClasses()}>
        {/* Personalization Indicator */}
        {userBehavior && userBehavior.visitCount > 1 && (
          <div className="fixed top-20 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium z-30 animate-pulse">
            Welcome back! Visit #{userBehavior.visitCount}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default PersonalizedLayout;