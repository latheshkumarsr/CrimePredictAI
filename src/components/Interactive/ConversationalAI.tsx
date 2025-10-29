import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe, Mic, MicOff, Volume2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language?: string;
}

interface ConversationalAIProps {
  userLocation: { lat: number; lng: number } | null;
  userPreferences: Record<string, string | number | boolean | { level?: string }>;
}

const ConversationalAI: React.FC<ConversationalAIProps> = ({ 
  userLocation, 
  userPreferences 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Crime Safety Assistant. I can help you with local crime insights, safety tips, and answer any questions about staying safe in your area. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses based on user location and preferences
    if (lowerMessage.includes('safe') || lowerMessage.includes('safety')) {
      const areaName = userLocation ? getAreaName(userLocation) : 'your area';
      return `Based on your location in ${areaName}, here are key safety tips: 1) Avoid walking alone after 9 PM, 2) Stay in well-lit areas, 3) Keep your phone charged, 4) Trust your instincts. Current risk level in your area is ${userPreferences?.riskLevel?.level || 'moderate'}.`;
    }
    
    if (lowerMessage.includes('crime') || lowerMessage.includes('statistics')) {
      return `In your area, the most common crimes are theft (35%), burglary (25%), and vandalism (15%). Peak crime hours are 8-11 PM. Would you like specific prevention tips for any of these crime types?`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
      return `🚨 For immediate emergencies, always call 911. For non-emergency police: dial 311. I can also help you find the nearest police station or safe location. Would you like me to provide emergency contacts for your area?`;
    }
    
    if (lowerMessage.includes('prediction') || lowerMessage.includes('predict')) {
      return `Our AI models can predict crime probability with 88.6% accuracy! Based on your current location and time, I can provide real-time risk assessments. Would you like me to analyze the crime risk for your current area?`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm here to help keep you safe. I can provide local crime insights, safety recommendations, emergency information, and real-time risk assessments. What would you like to know about staying safe in your area?`;
    }

    // Default intelligent response
    return `I understand you're asking about "${userMessage}". I can help with crime safety, local risk assessments, emergency information, and prevention tips. Could you be more specific about what safety information you need?`;
  };

  const getAreaName = (location: { lat: number; lng: number }) => {
    if (location.lat > 40.75) return "Uptown District";
    if (location.lat > 40.72) return "Midtown Area";
    return "Downtown Core";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as { webkitSpeechRecognition: new () => SpeechRecognition }).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      recognition.start();
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const quickActions = [
    { text: "What's the crime risk in my area?", action: () => setInputText("What's the crime risk in my area?") },
    { text: "Safety tips for walking at night", action: () => setInputText("Safety tips for walking at night") },
    { text: "Emergency contacts", action: () => setInputText("Emergency contacts") },
    { text: "Predict crime for my location", action: () => setInputText("Predict crime for my location") }
  ];

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-600" />
          AI Safety Assistant
        </h3>
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-gray-600" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border-2 border-gray-200 rounded-xl h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                  {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 text-white" />}
                  <div className="flex-1">
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender === 'ai' && (
                    <button
                      onClick={() => speakMessage(message.text)}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crime safety, local risks, or emergency information..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={startVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalAI;