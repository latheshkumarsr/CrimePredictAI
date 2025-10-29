import React, { useState } from 'react';
import { Shield, Zap, Award, ArrowRight, RotateCcw } from 'lucide-react';

interface GameifiedQuestionnaireProps {
  userLocation: { lat: number; lng: number } | null;
  userPreferences: Record<string, string | number | boolean>;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'scenario' | 'priority';
  options: Array<{
    text: string;
    value: string;
    consequence?: string;
    points?: number;
  }>;
}

const GameifiedQuestionnaire: React.FC<GameifiedQuestionnaireProps> = ({ 
  userLocation, 
  userPreferences 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [storyPath, setStoryPath] = useState<string[]>([]);

  const questions: Question[] = [
    {
      id: 'time_preference',
      text: "🌆 You're planning to visit downtown. What time would you prefer?",
      type: 'scenario',
      options: [
        { text: "Early morning (6-9 AM)", value: "morning", consequence: "Smart choice! Crime rates are 60% lower in morning hours.", points: 10 },
        { text: "Afternoon (12-5 PM)", value: "afternoon", consequence: "Good timing! Moderate activity with decent visibility.", points: 7 },
        { text: "Evening (6-9 PM)", value: "evening", consequence: "Caution advised! This is peak crime time in urban areas.", points: 3 },
        { text: "Late night (10 PM+)", value: "night", consequence: "High risk! Consider alternative timing or extra precautions.", points: 1 }
      ]
    },
    {
      id: 'transportation',
      text: "🚗 How do you usually travel in unfamiliar areas?",
      type: 'multiple',
      options: [
        { text: "Walk alone", value: "walk_alone", points: 2 },
        { text: "Walk with friends", value: "walk_group", points: 8 },
        { text: "Use ride-sharing", value: "rideshare", points: 9 },
        { text: "Public transportation", value: "public", points: 6 },
        { text: "Personal vehicle", value: "car", points: 7 }
      ]
    },
    {
      id: 'awareness',
      text: "👀 You notice someone following you. What's your first action?",
      type: 'scenario',
      options: [
        { text: "Change direction and go to a public place", value: "public_place", consequence: "Excellent! Public spaces provide safety and witnesses.", points: 10 },
        { text: "Call someone while walking", value: "call_someone", consequence: "Good strategy! Staying connected increases safety.", points: 8 },
        { text: "Speed up and try to lose them", value: "speed_up", consequence: "Risky approach. Better to seek help or public areas.", points: 4 },
        { text: "Confront them directly", value: "confront", consequence: "Dangerous! Never confront potential threats directly.", points: 1 }
      ]
    },
    {
      id: 'preparation',
      text: "🎒 What safety items do you typically carry?",
      type: 'multiple',
      options: [
        { text: "Personal alarm", value: "alarm", points: 8 },
        { text: "Pepper spray", value: "spray", points: 7 },
        { text: "Emergency contacts list", value: "contacts", points: 9 },
        { text: "Fully charged phone", value: "phone", points: 10 },
        { text: "None of the above", value: "none", points: 2 }
      ]
    },
    {
      id: 'priority',
      text: "🎯 What's most important for your personal safety?",
      type: 'priority',
      options: [
        { text: "Knowing local crime patterns", value: "patterns", points: 9 },
        { text: "Having emergency contacts", value: "contacts", points: 8 },
        { text: "Staying in well-lit areas", value: "lighting", points: 7 },
        { text: "Traveling in groups", value: "groups", points: 8 },
        { text: "Using technology for safety", value: "technology", points: 9 }
      ]
    }
  ];

  const handleAnswer = (value: string, points: number = 0) => {
    const question = questions[currentQuestion];
    setAnswers({ ...answers, [question.id]: value });
    setScore(score + points);
    setStoryPath([...storyPath, value]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuestionnaire = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
    setStoryPath([]);
  };

  const getSafetyLevel = (score: number) => {
    if (score >= 40) return { level: 'Safety Expert', color: 'green', description: 'You have excellent safety awareness!' };
    if (score >= 30) return { level: 'Safety Conscious', color: 'blue', description: 'Good safety practices with room for improvement.' };
    if (score >= 20) return { level: 'Learning', color: 'yellow', description: 'Building safety awareness - keep learning!' };
    return { level: 'Needs Attention', color: 'red', description: 'Consider improving your safety practices.' };
  };

  const getPersonalizedTips = () => {
    const tips = [];
    if (answers.time_preference === 'night') {
      tips.push("Consider earlier travel times when possible - crime rates drop significantly before 8 PM");
    }
    if (answers.transportation === 'walk_alone') {
      tips.push("Try to walk with others or use ride-sharing in unfamiliar areas");
    }
    if (answers.preparation === 'none') {
      tips.push("Carry basic safety items like a charged phone and emergency contacts");
    }
    return tips;
  };

  if (showResults) {
    const safetyLevel = getSafetyLevel(score);
    const personalizedTips = getPersonalizedTips();

    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className={`p-6 rounded-xl text-white bg-${safetyLevel.color}-600`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Safety Assessment Complete!</h3>
              <p className="opacity-90">{safetyLevel.description}</p>
            </div>
            <Award className="h-12 w-12 opacity-80" />
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Your Safety Profile</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">{score}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">{safetyLevel.level}</div>
              <div className="text-sm text-gray-600">Safety Level</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1">{questions.length}</div>
              <div className="text-sm text-gray-600">Scenarios Completed</div>
            </div>
          </div>
        </div>

        {/* Personalized Tips */}
        {personalizedTips.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h4 className="text-lg font-bold text-yellow-800 mb-4">Personalized Safety Tips</h4>
            <div className="space-y-3">
              {personalizedTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-yellow-800">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={resetQuestionnaire}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={() => window.open('/prediction', '_blank')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Shield className="h-4 w-4" />
            <span>Get Live Predictions</span>
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-lg">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-500">
              Score: {score} points
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{question.text}</h3>
          {question.type === 'scenario' && (
            <p className="text-gray-600">Choose your response to this safety scenario:</p>
          )}
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.value, option.points)}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.02] group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800 group-hover:text-blue-800">
                  {option.text}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              {option.consequence && (
                <p className="text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  💡 {option.consequence}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Story Path Visualization */}
      {storyPath.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Safety Journey:</h4>
          <div className="flex flex-wrap gap-2">
            {storyPath.map((path, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {path.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameifiedQuestionnaire;