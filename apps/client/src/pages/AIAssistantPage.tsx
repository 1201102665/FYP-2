import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Send,
  Camera,
  Image as ImageIcon,
  Plane,
  MapPin,
  Calendar,
  MessageCircle,
  Loader2,
  Sparkles,
  Globe,
  Clock,
  Zap,
  Star,
  ArrowUp,
  Trash2,
  Copy,
  RefreshCw,
  Bot
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const AIAssistantPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCugUveFrMezRbB1EnFUrMHLcjCXE3lABo';

  const faqQuestions = [
    { text: "What's the best time to visit Paris?", icon: "🗼", category: "Destinations" },
    { text: "Help me plan a 7-day trip to Japan", icon: "🏯", category: "Planning" },
    { text: "What documents do I need for international travel?", icon: "📋", category: "Documents" },
    { text: "Recommend budget-friendly destinations in Europe", icon: "💰", category: "Budget" },
    { text: "What should I pack for a tropical vacation?", icon: "🏝️", category: "Packing" },
    { text: "Find me cheap flights to New York", icon: "✈️", category: "Flights" },
    { text: "Best hotels in Dubai under $200", icon: "🏨", category: "Hotels" },
    { text: "Travel insurance recommendations", icon: "🛡️", category: "Insurance" },
    { text: "Best local food to try in Thailand", icon: "🍜", category: "Food" },
    { text: "Safety tips for solo female travelers", icon: "👩‍🦱", category: "Safety" }
  ];

  const quickActions = [
    { text: "Plan a weekend getaway", icon: Calendar },
    { text: "Find flight deals", icon: Plane },
    { text: "Suggest destinations", icon: Globe },
    { text: "Travel checklist", icon: MapPin }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const callGeminiAPI = async (message: string, imageFile?: File): Promise<string> => {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      let requestBody: any;

      if (imageFile) {
        // Convert image to base64
        const base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(imageFile);
        });

        requestBody = {
          contents: [{
            parts: [
              {
                text: `As a professional travel advisor for AeroTrav, analyze this image and the following request: ${message}. Provide helpful travel advice, destination recommendations, or travel planning assistance based on what you see in the image and the user's question.`
              },
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64Image
                }
              }
            ]
          }]
        };
      } else {
        requestBody = {
          contents: [{
            parts: [{
              text: `As a professional travel advisor for AeroTrav, help the user with their travel-related question: ${message}. Provide helpful, accurate, and friendly advice about travel planning, destinations, bookings, or any travel-related topics. Keep responses informative yet conversational.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      setIsConnected(false);
      return "I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to browse our travel services while I get back online! 🔧";
    }
  };

  const sendMessage = async (text: string = inputText) => {
    if (text.trim().length === 0) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setIsConnected(true);

    try {
      const aiResponse = await callGeminiAPI(text, selectedImage || undefined);

      const aiMessage: ChatMessage = {
        id: generateMessageId(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact our support team for immediate assistance with your travel needs! 🛠️",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className="flex items-start space-x-3 max-w-[85%] md:max-w-[70%]">
        {!message.isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-aerotrav-blue to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}

        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${message.isUser
            ? 'bg-gradient-to-r from-aerotrav-blue to-blue-600 text-white rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
            }`}
        >
          <div className="prose prose-sm max-w-none">
            <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed m-0">
              {message.text}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-opacity-20 border-current">
            <p className={`text-xs ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>

            {!message.isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyMessage(message.text)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {message.isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="p-8 max-w-md w-full text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="relative mb-6">
              <div className="h-20 w-20 mx-auto bg-gradient-to-r from-aerotrav-blue to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-yellow-800" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Travel Assistant</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Unlock personalized travel recommendations, instant planning assistance, and expert travel advice with our AI-powered assistant.
            </p>
            <Button
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-aerotrav-blue to-blue-600 hover:from-aerotrav-blue-700 hover:to-blue-700 text-white shadow-lg w-full"
            >
              Login to Continue
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col">
        {/* Enhanced Page Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-14 w-14 bg-gradient-to-r from-aerotrav-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageCircle className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white">
                    {isConnected && <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">AeroTrav AI Assistant</h1>
                  <p className="text-gray-600 mt-1">Your intelligent travel planning companion ✈️</p>
                </div>
              </div>

              {messages.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearChat}
                  className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden md:inline">Clear Chat</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Image Preview Enhanced */}
        {selectedImage && imagePreview && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100 p-4 shadow-sm">
            <div className="container mx-auto">
              <div className="flex items-center space-x-4 bg-blue-50 rounded-xl p-4">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="h-24 w-24 object-cover rounded-lg shadow-md"
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900">📸 Image Ready for Analysis</p>
                  <p className="text-xs text-gray-600 mt-1">{selectedImage.name}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    AI will analyze this image along with your message
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced FAQ Questions */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-5 w-5 text-aerotrav-blue" />
              <span className="text-sm font-semibold text-gray-700">Quick Questions</span>
            </div>
            <div className="flex overflow-x-auto space-x-3 pb-2">
              {faqQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-aerotrav-blue hover:text-white transition-all duration-200 whitespace-nowrap flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105"
                  onClick={() => sendMessage(question.text)}
                >
                  <span>{question.icon}</span>
                  <span className="text-sm">{question.text}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Chat Area */}
        <div className="flex-grow overflow-hidden flex flex-col">
          <div className="flex-grow overflow-y-auto p-4">
            <div className="container mx-auto max-w-5xl">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="relative mb-8">
                    <div className="h-24 w-24 mx-auto bg-gradient-to-r from-aerotrav-blue to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                      <MessageCircle className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-8 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="h-4 w-4 text-yellow-800" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Welcome to your AI Travel Assistant! ✈️
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    I'm here to help you plan amazing trips, find the best deals, and answer any travel questions you might have.
                    Ask me about destinations, create itineraries, or get expert travel advice!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                    {quickActions.map((action, index) => (
                      <Card
                        key={index}
                        className="p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:scale-105"
                        onClick={() => sendMessage(action.text)}
                      >
                        <action.icon className="h-8 w-8 text-aerotrav-blue mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">{action.text}</h4>
                      </Card>
                    ))}
                  </div>

                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>24/7 Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Expert Advice</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Global Coverage</span>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isTyping && (
                <div className="flex justify-start mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-aerotrav-blue to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-sm shadow-sm">
                      <div className="flex space-x-2 items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-aerotrav-blue" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-aerotrav-blue rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-aerotrav-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-aerotrav-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="bg-white/90 backdrop-blur-sm border-t border-blue-100 p-4 shadow-lg">
            <div className="container mx-auto max-w-5xl">
              <div className="flex items-end space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 hover:bg-blue-50 hover:border-blue-200 border-gray-300"
                  disabled={isTyping}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>

                <div className="flex-grow relative">
                  <Textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask me anything about travel... (e.g., 'Plan a romantic trip to Paris' or 'Best time to visit Japan')"
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                    className="min-h-[48px] max-h-32 border-gray-300 focus:border-aerotrav-blue focus:ring-aerotrav-blue resize-none pr-12 bg-white/80"
                    rows={1}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {inputText.length}/2000
                  </div>
                </div>

                <Button
                  onClick={() => sendMessage()}
                  disabled={isTyping || inputText.trim().length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-aerotrav-blue to-blue-600 hover:from-aerotrav-blue-700 hover:to-blue-700 text-white shadow-lg flex-shrink-0 transform hover:scale-105 transition-all duration-200"
                >
                  {isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {!isConnected && (
                <div className="mt-2 flex items-center space-x-2 text-amber-600 text-sm">
                  <RefreshCw className="h-4 w-4" />
                  <span>Connection issues detected. Trying to reconnect...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIAssistantPage; 