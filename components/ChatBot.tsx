
import React, { useState, useRef, useEffect } from 'react';
import { motion as m, AnimatePresence as AP } from 'framer-motion';
import { MessageCircle, X, Send, Mic, Check, CheckCheck, AlertCircle, Volume2, VolumeX, Leaf, Stethoscope, Pill } from 'lucide-react';
import * as RRD from 'react-router-dom';
import { useApp } from '../context/AppContext';

const { Link } = RRD as any;
const motion = m as any;
const AnimatePresence = AP as any;

export const ChatBot = () => {
  const { messages, addMessage, isChatTyping } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Global mute state
  
  // Suggestion State
  const [clickedSuggestions, setClickedSuggestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested Actions for empty state
  const allSuggestions = [
    { label: "Book a consultation", icon: <Stethoscope size={14} />, query: "I want to book a consultation with a specialist." },
    { label: "Hair fall remedy", icon: <Leaf size={14} />, query: "What are the best Ayurvedic remedies for hair fall?" },
    { label: "Immunity boosters", icon: <Pill size={14} />, query: "Suggest some immunity boosting medicines." },
    { label: "Digestion issues", icon: <Leaf size={14} />, query: "I have digestion problems, what should I take?" },
  ];

  // Filter suggestions: exclude clicked ones
  const activeSuggestions = allSuggestions.filter(s => !clickedSuggestions.includes(s.query));
  
  // Logic updated: Show suggestions if input is empty, regardless of message count.
  // This ensures remaining recommendations show up after a conversation turn.
  const showSuggestions = input.trim().length === 0 && activeSuggestions.length > 0;

  // Stop audio when closed
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  // Auto-speak new AI messages
  useEffect(() => {
    if (messages.length > 0 && !isMuted) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'model' && lastMsg.status === 'read' && isOpen) {
        const text = lastMsg.text.replace(/\[.*?\]\(.*?\)/g, ''); // Remove links
        speak(text);
      }
    }
  }, [messages, isOpen, isMuted]);

  const speak = (text: string) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    window.speechSynthesis.speak(u);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMuted) {
        window.speechSynthesis.cancel();
    }
    setIsMuted(!isMuted);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen, isChatTyping, showSuggestions]);

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(input, 'user');
    setInput('');
  };

  const handleSuggestionClick = (query: string) => {
      setClickedSuggestions(prev => [...prev, query]);
      addMessage(query, 'user');
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }

    if (isListening) {
        setIsListening(false);
        return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // This will automatically hide recommendations via logic
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const renderStatusIcon = (status?: string) => {
    if (status === 'sending') return <span className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />;
    if (status === 'sent') return <Check size={12} className="text-gray-400" />;
    if (status === 'read') return <CheckCheck size={12} className="text-blue-500" />;
    if (status === 'error') return <AlertCircle size={12} className="text-red-500" />;
    return null;
  };

  const renderMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
        if (!line.trim()) return <div key={lineIndex} className="h-2" />; 

        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
                parts.push(parseBold(line.substring(lastIndex, match.index)));
            }
            parts.push(
                <Link 
                    key={`${lineIndex}-${match.index}`} 
                    to={match[2]}
                    onClick={() => setIsOpen(false)} 
                    className="inline-flex items-center gap-1 mt-2 mb-1 px-4 py-2 bg-herbal-700 text-white text-xs font-bold rounded-full hover:bg-herbal-800 hover:scale-105 transition-all shadow-md mx-1 no-underline"
                >
                    {match[1]}
                </Link>
            );
            lastIndex = linkRegex.lastIndex;
        }
        if (lastIndex < line.length) {
            parts.push(parseBold(line.substring(lastIndex)));
        }

        return <div key={lineIndex} className="mb-1">{parts}</div>;
    });
  };

  const parseBold = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-herbal-900">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-herbal-800 to-herbal-600 text-white rounded-full shadow-2xl z-40 flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        <MessageCircle size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#16482e] p-4 flex justify-between items-center text-white shadow-md shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Leaf size={20} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Ayur Assistant</h3>
                  <p className="text-[10px] text-herbal-200 font-medium opacity-80">AI-Powered Health Guide</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={toggleMute} 
                    className={`p-1.5 rounded-full transition-colors ${isMuted ? 'text-red-300 bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/20'}`}
                    title={isMuted ? "Unmute" : "Mute AI Voice"}
                >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa] relative overscroll-contain"
                // Prevent scroll propagation to background
                onWheel={(e) => e.stopPropagation()}
            >
               
               {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} relative z-10`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                    msg.role === 'user' 
                      ? 'bg-herbal-700 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.role === 'user' ? msg.text : renderMessageText(msg.text)}
                    
                    {/* Timestamp & Status */}
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.role === 'user' ? 'text-herbal-200' : 'text-gray-400'}`}>
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.role === 'user' && renderStatusIcon(msg.status)}
                    </div>
                  </div>
                  {msg.role === 'model' && !isMuted && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            speak(msg.text.replace(/\[.*?\]\(.*?\)/g, ''));
                        }} 
                        className="mt-1 ml-1 text-gray-400 hover:text-herbal-600"
                        title="Replay Audio"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              
              {isChatTyping && (
                <div className="flex justify-start relative z-10">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex space-x-1.5 items-center w-16 h-10">
                    <motion.span 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                    <motion.span 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                    <motion.span 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              )}

               {/* Suggestions Overlay - Now shows at bottom if input is empty */}
               {showSuggestions && (
                  <div className="mt-4 pt-2 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Suggested for you</p>
                      <div className="flex flex-col gap-2">
                          {activeSuggestions.map((action, i) => (
                              <button 
                                key={i}
                                onClick={() => handleSuggestionClick(action.query)}
                                className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-herbal-300 hover:shadow-md transition-all text-left flex items-center gap-3 group"
                              >
                                  <div className="w-8 h-8 rounded-full bg-herbal-50 flex items-center justify-center text-herbal-600 group-hover:bg-herbal-100">
                                      {action.icon}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                              </button>
                          ))}
                      </div>
                  </div>
               )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 z-10 shrink-0">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-2 py-2 border border-transparent focus-within:border-herbal-300 focus-within:ring-2 focus-within:ring-herbal-100 transition-all">
                <button
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-herbal-600 hover:bg-gray-200'}`}
                    title="Speak"
                >
                    <Mic size={20} />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                  className="flex-1 bg-transparent border-none text-sm focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400"
                />
                
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 bg-herbal-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-herbal-800 transition-colors shadow-sm transform active:scale-95"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
