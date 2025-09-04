import React, { useState, useEffect, useRef } from 'react';
import { Zap, Target, Shield, Brain, Sparkles, MousePointer, Eye, Gamepad2 } from 'lucide-react';

const MicroInteractions: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; hit: boolean }>>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const startTargetGame = () => {
    setIsGameActive(true);
    setGameScore(0);
    const newTargets = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      hit: false
    }));
    setTargets(newTargets);

    // Auto-end game after 15 seconds
    setTimeout(() => {
      setIsGameActive(false);
    }, 15000);
  };

  const hitTarget = (targetId: number) => {
    setTargets(prev => prev.map(target => 
      target.id === targetId ? { ...target, hit: true } : target
    ));
    setGameScore(prev => prev + 10);
  };

  const interactiveElements = [
    {
      title: "Animated Cursor Trail",
      description: "Watch the magic cursor follow your movements",
      component: (
        <div className="relative h-32 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg overflow-hidden">
          <div 
            className="absolute w-4 h-4 bg-purple-500 rounded-full transition-all duration-100 ease-out pointer-events-none"
            style={{ 
              left: `${(cursorPosition.x % 300)}px`, 
              top: `${(cursorPosition.y % 100)}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MousePointer className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>
      )
    },
    {
      title: "Scroll-Triggered Animation",
      description: "Elements animate as you scroll through content",
      component: (
        <div className="relative h-32 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-16 h-16 bg-green-500 rounded-full transition-all duration-500 flex items-center justify-center"
              style={{ 
                transform: `scale(${0.5 + (scrollProgress / 100) * 0.5}) rotate(${scrollProgress * 3.6}deg)`,
                opacity: 0.3 + (scrollProgress / 100) * 0.7
              }}
            >
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 text-xs text-green-700">
            Scroll Progress: {scrollProgress.toFixed(0)}%
          </div>
        </div>
      )
    },
    {
      title: "Interactive Target Game",
      description: "Test your reflexes with this crime prevention mini-game",
      component: (
        <div className="relative h-32 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg overflow-hidden">
          {!isGameActive ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startTargetGame}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Gamepad2 className="h-4 w-4" />
                <span>Start Safety Game</span>
              </button>
            </div>
          ) : (
            <>
              {targets.map(target => (
                <button
                  key={target.id}
                  onClick={() => hitTarget(target.id)}
                  className={`absolute w-8 h-8 rounded-full transition-all duration-200 ${
                    target.hit 
                      ? 'bg-green-500 scale-150 opacity-50' 
                      : 'bg-red-500 hover:bg-red-600 animate-pulse hover:scale-110'
                  }`}
                  style={{ 
                    left: `${target.x}%`, 
                    top: `${target.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  disabled={target.hit}
                >
                  <Target className="h-4 w-4 text-white mx-auto" />
                </button>
              ))}
              <div className="absolute top-2 right-2 bg-white rounded px-2 py-1 text-sm font-bold text-red-600">
                Score: {gameScore}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      title: "Hover Morphing Cards",
      description: "Cards that transform and reveal hidden content",
      component: (
        <div 
          className="relative h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-105"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className={`absolute inset-0 transition-all duration-500 ${
            isHovering ? 'bg-blue-600' : 'bg-transparent'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`transition-all duration-500 ${
                isHovering ? 'text-white scale-110' : 'text-blue-600 scale-100'
              }`}>
                <Sparkles className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm font-medium text-center">
                  {isHovering ? 'Crime Prevention Tips Unlocked!' : 'Hover to Reveal Safety Secrets'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div ref={containerRef} className="space-y-6 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Zap className="h-6 w-6 mr-2 text-yellow-500" />
          Interactive Experience Lab
        </h3>
        <p className="text-gray-600">
          Explore dynamic interactions and micro-animations that make safety engaging
        </p>
      </div>

      {/* Interactive Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interactiveElements.map((element, index) => (
          <div key={index} className="space-y-3">
            <div>
              <h4 className="font-bold text-gray-800">{element.title}</h4>
              <p className="text-sm text-gray-600">{element.description}</p>
            </div>
            {element.component}
          </div>
        ))}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 space-y-3 z-40">
        <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
          <Brain className="h-5 w-5" />
        </button>
        <button className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
          <Shield className="h-5 w-5" />
        </button>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MicroInteractions;