
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [thinkingStep, setThinkingStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thoughts = [
    "Analyzing your request...",
    "Reviewing travel data...",
    "Checking availability...",
    "Curating recommendations...",
    "Formulating response..."
  ];

  // Initialize chat session on open
  useEffect(() => {
    if (isOpen && !chatSession) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chat = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
            systemInstruction: "You are a knowledgeable and enthusiastic travel assistant for 'Book My Trip'. You help users discover destinations, plan itineraries, and provide travel tips. Be concise but helpful."
          }
        });
        setChatSession(chat);
        setMessages([{ role: 'model', text: "Hello! I'm your AI travel concierge. Where are you dreaming of going?" }]);
      } catch (e) {
        console.error("Failed to init chat", e);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setThinkingStep(0);
      interval = setInterval(() => {
        setThinkingStep(prev => (prev + 1) % thoughts.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatSession || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userText });
      
      let fullResponse = '';
      let isFirstChunk = true;
      
      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          
          if (isFirstChunk) {
            setMessages(prev => [...prev, { role: 'model', text: fullResponse }]);
            isFirstChunk = false;
          } else {
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1] = { role: 'model', text: fullResponse };
              return newMsgs;
            });
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a bit of trouble connecting to the travel network right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 z-[100] w-80 md:w-96 bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
        }`}
        style={{ height: '600px', maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className="bg-primary p-4 flex items-center justify-between text-white shadow-md">
           <div className="flex items-center gap-3">
              <div className="size-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                 <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                 <h3 className="font-bold text-sm">Travel Concierge</h3>
                 <div className="flex items-center gap-1.5 opacity-80">
                    <span className={`size-1.5 rounded-full ${isLoading ? 'bg-yellow-300 animate-pulse' : 'bg-green-400'}`}></span>
                    <span className="text-[10px] font-medium uppercase tracking-wide">{isLoading ? 'Thinking...' : 'Online'}</span>
                 </div>
              </div>
           </div>
           <button onClick={() => setIsOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">close</span>
           </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/20 scroll-smooth">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                   <div className="size-6 rounded-full bg-primary/10 flex-shrink-0 mr-2 flex items-center justify-center mt-1">
                      <span className="material-symbols-outlined text-xs text-primary">smart_toy</span>
                   </div>
                )}
                <div 
                  className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20' 
                    : 'bg-white dark:bg-gray-800 text-text-main-light dark:text-text-main-dark rounded-tl-sm border border-gray-100 dark:border-white/5 shadow-sm'
                  }`}
                >
                   {msg.text}
                </div>
             </div>
           ))}
           
           {/* Thinking Indicator - Shown while waiting for first chunk */}
           {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="size-6 rounded-full bg-primary/10 flex-shrink-0 mr-2 flex items-center justify-center mt-1">
                      <span className="material-symbols-outlined text-xs text-primary">psychology</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-2 min-w-[180px]">
                     <div className="flex items-center gap-2">
                        <span className="size-1.5 bg-primary rounded-full animate-bounce"></span>
                        <span className="size-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                        <span className="size-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-80 animate-pulse transition-all duration-300">
                        {thoughts[thinkingStep]}
                     </p>
                  </div>
              </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-white/5">
           <div className="relative flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..." 
                className="flex-1 h-12 bg-gray-100 dark:bg-white/5 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                 <span className="material-symbols-outlined">send</span>
              </button>
           </div>
        </form>
      </div>

      {/* Agent Vector Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] group outline-none"
        aria-label="Toggle AI Assistant"
      >
        <div className={`relative flex items-center justify-center size-12 md:size-14 rounded-full shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isOpen 
          ? 'bg-red-500 rotate-180 scale-90' 
          : 'bg-primary hover:scale-110'
        }`}>
           {isOpen ? (
             <span className="material-symbols-outlined text-white text-2xl md:text-3xl transition-transform">close</span>
           ) : (
             <div className="relative flex items-center justify-center w-full h-full">
                {/* Agent Vector */}
                <svg className="size-6 md:size-7 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <rect x="3" y="11" width="18" height="10" rx="2" />
                   <circle cx="12" cy="5" r="2" />
                   <path d="M12 7v4" />
                   <line x1="8" y1="16" x2="8.01" y2="16" />
                   <line x1="16" y1="16" x2="16.01" y2="16" />
                </svg>
                
                {/* Status Indicator */}
                <span className="absolute -top-1 -right-1 flex size-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-3.5 bg-red-500 border-2 border-primary"></span>
                </span>
             </div>
           )}
        </div>
      </button>
    </>
  );
};
