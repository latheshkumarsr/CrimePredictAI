import React, { useState, useEffect } from 'react';

const DynamicVisuals: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1
    }));
    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 100 ? -5 : particle.y + particle.speed * 0.5,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.5
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Background Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 opacity-10 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-purple-400 opacity-10 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-blue-300 opacity-5 rounded-full animate-ping"></div>

      {/* Floating Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute bg-white opacity-20 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/20 to-transparent"></div>
    </div>
  );
};

export default DynamicVisuals;