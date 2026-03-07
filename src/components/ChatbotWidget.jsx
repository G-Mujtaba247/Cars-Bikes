/**
 * ChatbotWidget Component - AI-powered vehicle recommendation chatbot
 * Features: Floating widget, message history, quick action buttons, vehicle recommendations
 * Uses local vehicle data intelligence (no external API dependency)
 */
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import { allVehicles, carsData, bikesData, formatPrice } from '../data/vehicles';

// Simple AI response engine using local vehicle data
function generateResponse(message) {
  const msg = message.toLowerCase().trim();

  // Best bike under a price
  const bikeUnderMatch = msg.match(/best\s+bike[s]?\s+(?:under|below|within)\s+(\d+)\s*(lakh|l|lac)?/);
  if (bikeUnderMatch) {
    const amount = parseInt(bikeUnderMatch[1]) * 100000;
    const results = bikesData
      .filter(b => b.price <= amount)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    if (results.length > 0) {
      return {
        text: `Here are the best bikes under ${formatPrice(amount)}:`,
        vehicles: results,
      };
    }
    return { text: `I couldn't find any bikes under ${formatPrice(amount)}. Try increasing your budget!` };
  }

  // Best car under a price
  const carUnderMatch = msg.match(/best\s+car[s]?\s+(?:under|below|within)\s+(\d+)\s*(lakh|l|lac|crore|cr)?/);
  if (carUnderMatch) {
    const multiplier = carUnderMatch[2] && (carUnderMatch[2].startsWith('cr') || carUnderMatch[2] === 'crore') ? 10000000 : 100000;
    const amount = parseInt(carUnderMatch[1]) * multiplier;
    const results = carsData
      .filter(c => c.price <= amount)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    if (results.length > 0) {
      return {
        text: `Here are the best cars under ${formatPrice(amount)}:`,
        vehicles: results,
      };
    }
    return { text: `I couldn't find any cars under ${formatPrice(amount)}. Try increasing your budget!` };
  }

  // Compare two vehicles
  if (msg.includes('compare')) {
    const vehicles = allVehicles.filter(v =>
      msg.includes(v.name.toLowerCase()) || msg.includes(v.brand.toLowerCase())
    );
    if (vehicles.length >= 2) {
      return {
        text: `Here's a quick comparison of ${vehicles[0].name} and ${vehicles[1].name}:`,
        comparison: [vehicles[0], vehicles[1]],
      };
    }
    return {
      text: "I'd love to help you compare! Please mention two vehicle names. For example: 'Compare Honda Civic and BMW 3 Series'",
    };
  }

  // Best mileage
  if (msg.includes('best mileage') || msg.includes('fuel efficient') || msg.includes('fuel economy')) {
    const type = msg.includes('bike') ? 'bike' : msg.includes('car') ? 'car' : 'all';
    const data = type === 'bike' ? bikesData : type === 'car' ? carsData : allVehicles;
    const results = [...data].sort((a, b) => b.mileageValue - a.mileageValue).slice(0, 3);
    return {
      text: `Here are the most fuel-efficient ${type === 'all' ? 'vehicles' : type + 's'}:`,
      vehicles: results,
    };
  }

  // Electric vehicles
  if (msg.includes('electric') || msg.includes('ev')) {
    const evs = allVehicles.filter(v => v.fuelType === 'Electric');
    if (evs.length > 0) {
      return {
        text: "Here are the electric vehicles available:",
        vehicles: evs,
      };
    }
    return { text: "We currently have limited electric vehicle options. Check back soon!" };
  }

  // SUV recommendations
  if (msg.includes('suv')) {
    const suvs = carsData.filter(c => c.bodyType === 'SUV').sort((a, b) => b.rating - a.rating);
    return {
      text: "Here are the top-rated SUVs:",
      vehicles: suvs.slice(0, 3),
    };
  }

  // Sports bike
  if (msg.includes('sports') && msg.includes('bike')) {
    const sports = bikesData.filter(b => b.bodyType === 'Sports').sort((a, b) => b.rating - a.rating);
    return {
      text: "Here are the best sports bikes:",
      vehicles: sports.slice(0, 3),
    };
  }

  // Brand-specific search
  const brandMatch = allVehicles.find(v => msg.includes(v.brand.toLowerCase()));
  if (brandMatch) {
    const brand = brandMatch.brand;
    const brandVehicles = allVehicles.filter(v => v.brand === brand);
    return {
      text: `Here are all ${brand} vehicles we have:`,
      vehicles: brandVehicles,
    };
  }

  // Vehicle name search
  const vehicleMatch = allVehicles.find(v => msg.includes(v.name.toLowerCase()));
  if (vehicleMatch) {
    return {
      text: `Here's what I know about the ${vehicleMatch.name}:`,
      vehicles: [vehicleMatch],
      detailed: true,
    };
  }

  // Greetings
  if (msg.match(/^(hi|hello|hey|howdy|greetings)/)) {
    return {
      text: "Hello! 👋 I'm your AI vehicle assistant. I can help you with:\n\n• Finding the best cars or bikes in your budget\n• Comparing vehicles side-by-side\n• Recommending fuel-efficient vehicles\n• Finding SUVs, sports bikes, and more!\n\nTry asking: 'Best bike under 3 lakh' or 'Compare Honda Civic and BMW 3 Series'",
    };
  }

  // Help
  if (msg.includes('help') || msg.includes('what can you do')) {
    return {
      text: "I can assist you with:\n\n🔍 **Search**: 'Best car under 20 lakh'\n⚡ **Compare**: 'Compare KTM Duke and Yamaha R15'\n⛽ **Mileage**: 'Best mileage car'\n🚗 **SUVs**: 'Show me SUVs'\n🏍️ **Sports Bikes**: 'Best sports bikes'\n🔋 **Electric**: 'Electric vehicles'\n🏷️ **Brand**: 'Show Honda vehicles'\n\nJust type your question!",
    };
  }

  // Default response
  return {
    text: "I'm not sure I understand that. Try asking me about:\n\n• Best cars/bikes under a budget\n• Comparing two vehicles\n• Most fuel-efficient vehicles\n• Specific brands or vehicle types\n\nOr type 'help' to see all my capabilities!",
  };
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! 👋 I'm your AI Vehicle Assistant. Ask me about cars and bikes!\n\nTry: 'Best bike under 3 lakh' or 'Help'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = generateResponse(userMessage.text);
      const botMessage = {
        type: 'bot',
        ...response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    'Best bike under 3 lakh',
    'Best car under 15 lakh',
    'Best mileage car',
    'Show me SUVs',
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl ${
          isOpen
            ? 'bg-dark-800 border border-white/10 rotate-0'
            : 'bg-gradient-to-br from-primary-500 to-accent-500 hover:scale-110'
        }`}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <ChevronDown className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900 animate-pulse" />
          </>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] transition-all duration-500 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col h-[500px]">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-primary-600/20 to-accent-600/20 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">AI Vehicle Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 animate-fade-in ${
                  msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user'
                      ? 'bg-primary-500/20'
                      : 'bg-accent-500/20'
                  }`}
                >
                  {msg.type === 'user' ? (
                    <User className="w-3.5 h-3.5 text-primary-400" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                    msg.type === 'user'
                      ? 'bg-primary-500/20 border border-primary-500/30 rounded-tr-md'
                      : 'bg-white/5 border border-white/10 rounded-tl-md'
                  }`}
                >
                  <p className="text-sm text-gray-200 whitespace-pre-line">{msg.text}</p>

                  {/* Vehicle Cards in Chat */}
                  {msg.vehicles && (
                    <div className="mt-2 space-y-2">
                      {msg.vehicles.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => window.open(`/vehicle/${v.id}`, '_self')}
                        >
                          <img
                            src={v.image}
                            alt={v.name}
                            className="w-12 h-8 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{v.name}</p>
                            <p className="text-[10px] text-gray-500">
                              {v.priceFormatted} • {v.mileage}
                            </p>
                          </div>
                          <span className="text-[10px] text-yellow-400">★ {v.rating}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comparison in Chat */}
                  {msg.comparison && (
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-500">
                        <span></span>
                        <span className="truncate">{msg.comparison[0].name}</span>
                        <span className="truncate">{msg.comparison[1].name}</span>
                      </div>
                      {['priceFormatted', 'engine', 'mileage', 'power', 'fuelType'].map(key => (
                        <div key={key} className="grid grid-cols-3 gap-1">
                          <span className="text-gray-500 capitalize">{key.replace('Formatted', '')}</span>
                          <span className="text-white">{msg.comparison[0][key]}</span>
                          <span className="text-white">{msg.comparison[1][key]}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-gray-600 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 animate-fade-in">
                <div className="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider">Quick Actions</p>
              <div className="flex flex-wrap gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setInput(action);
                      setTimeout(() => {
                        handleSend();
                      }, 0);
                      setMessages(prev => [...prev, { type: 'user', text: action, timestamp: new Date() }]);
                      setInput('');
                      setIsTyping(true);
                      setTimeout(() => {
                        const response = generateResponse(action);
                        setMessages(prev => [...prev, { type: 'bot', ...response, timestamp: new Date() }]);
                        setIsTyping(false);
                      }, 1000);
                    }}
                    className="px-2.5 py-1 rounded-full text-[10px] bg-primary-500/10 text-primary-300 border border-primary-500/20 hover:bg-primary-500/20 transition-all duration-200"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about cars & bikes..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  input.trim()
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/25'
                    : 'bg-white/5 text-gray-600'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
