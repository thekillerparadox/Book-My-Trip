
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, LiveServerMessage, Modality, FunctionDeclaration, Type } from "@google/genai";
import { AppView } from '../types';

interface AccessibilityAgentProps {
  setView: (view: AppView) => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const navigationTool: FunctionDeclaration = {
  name: 'navigate',
  description: 'Navigate to a different section of the application.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      view: {
        type: Type.STRING,
        enum: ['home', 'trips', 'guides'],
        description: 'The destination view ID.'
      }
    },
    required: ['view']
  }
};

export const AccessibilityAgent: React.FC<AccessibilityAgentProps> = ({ setView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Init Chat Session
  useEffect(() => {
    if (isOpen && mode === 'chat' && !chatSession) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chat = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
            systemInstruction: "You are a 24/7 AI travel agent and accessibility assistant for Book My Trip. You help users navigate the site, plan trips, and find accessibility information. Be concise, helpful, and friendly."
          }
        });
        setChatSession(chat);
        setMessages([{ role: 'model', text: "Hi! I'm your 24/7 accessibility agent. I can help you plan trips, navigate the site, or answer any questions. How can I assist you today?" }]);
      } catch (e) {
        console.error("Chat Init Failed", e);
      }
    }
  }, [isOpen, mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  // Chat Handlers
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatSession || isChatLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userText });
      
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]); // Placeholder

      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { role: 'model', text: fullText };
            return newMsgs;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Voice Handlers
  const visualize = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setVolume(avg);
    animationFrameRef.current = requestAnimationFrame(visualize);
  };

  const toggleVoiceSession = async () => {
    if (isVoiceActive) {
      audioContextRef.current?.close();
      setIsVoiceActive(false);
      setVoiceStatus('idle');
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    setIsVoiceActive(true);
    setVoiceStatus('listening');
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = ctx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      visualize();

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          tools: [{ functionDeclarations: [navigationTool] }],
          systemInstruction: "You are a helpful voice assistant for Book My Trip. You can navigate the app using the navigate tool."
        },
        callbacks: {
          onopen: () => {
            console.log("Connected");
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) pcmData[i] = inputData[i] * 32768;
              const b64 = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              sessionPromise.then(session => session.sendRealtimeInput({ media: { mimeType: 'audio/pcm;rate=16000', data: b64 } }));
            };
            source.connect(processor);
            processor.connect(ctx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.toolCall) {
              for (const call of msg.toolCall.functionCalls) {
                if (call.name === 'navigate') {
                  const view = (call.args as any).view;
                  setView(view as AppView);
                  sessionPromise.then(session => session.sendToolResponse({
                    functionResponses: [{ id: call.id, name: call.name, response: { result: "OK" } }]
                  }));
                }
              }
            }
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setVoiceStatus('speaking');
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for(let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
              
              const data16 = new Int16Array(bytes.buffer);
              const f32 = new Float32Array(data16.length);
              for(let i=0; i<data16.length; i++) f32[i] = data16[i]/32768;

              const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
              const buffer = outCtx.createBuffer(1, f32.length, 24000);
              buffer.copyToChannel(f32, 0);
              const src = outCtx.createBufferSource();
              src.buffer = buffer;
              src.connect(outCtx.destination);
              src.start();
              src.onended = () => setVoiceStatus('listening');
            }
          },
          onclose: () => { setIsVoiceActive(false); setVoiceStatus('idle'); },
          onerror: (e) => { console.error(e); setIsVoiceActive(false); }
        }
      });
    } catch (e) {
      console.error(e);
      alert("Microphone access failed.");
      setIsVoiceActive(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[999] size-14 md:size-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
        aria-label="Toggle Accessibility Agent"
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:opacity-40"></div>
        <span className="material-symbols-outlined text-3xl">support_agent</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-[999] w-[calc(100vw-2rem)] md:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-surface-dark rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-white shrink-0">
             <div className="flex items-center gap-3">
               <div className="size-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                 <span className="material-symbols-outlined text-xl">smart_toy</span>
               </div>
               <div>
                 <h3 className="font-bold text-sm">24/7 Agent</h3>
                 <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">
                   {mode === 'chat' ? 'Thinking Mode Active' : 'Live Voice Active'}
                 </p>
               </div>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => setMode(mode === 'chat' ? 'voice' : 'chat')}
                  className="size-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  title={mode === 'chat' ? "Switch to Voice" : "Switch to Chat"}
                >
                   <span className="material-symbols-outlined text-sm">{mode === 'chat' ? 'mic' : 'chat'}</span>
                </button>
                <button onClick={() => setIsOpen(false)} className="size-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative bg-gray-50 dark:bg-black/20">
             {mode === 'chat' ? (
               <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {messages.map((msg, i) => (
                       <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-primary text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-gray-800 text-text-main-light dark:text-text-main-dark border border-gray-100 dark:border-white/5 rounded-tl-sm shadow-sm'
                          }`}>
                            {msg.text}
                          </div>
                       </div>
                     ))}
                     {isChatLoading && (
                       <div className="flex justify-start">
                         <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-white/5 flex gap-1.5 items-center">
                            <span className="size-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                            <span className="size-1.5 bg-primary/40 rounded-full animate-bounce delay-100"></span>
                            <span className="size-1.5 bg-primary/40 rounded-full animate-bounce delay-200"></span>
                            <span className="text-[10px] text-text-sec-light dark:text-text-sec-dark ml-1">Thinking...</span>
                         </div>
                       </div>
                     )}
                     <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-white/5 shrink-0">
                     <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask about accessibility or trips..."
                          className="flex-1 h-12 bg-gray-100 dark:bg-white/5 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                        <button type="submit" className="size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all">
                           <span className="material-symbols-outlined">send</span>
                        </button>
                     </div>
                  </form>
               </div>
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className={`relative size-24 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ${isVoiceActive ? 'bg-red-500 shadow-2xl shadow-red-500/30' : 'bg-primary shadow-xl shadow-primary/30'}`}>
                     <span className="material-symbols-outlined text-5xl text-white">
                        {isVoiceActive ? 'graphic_eq' : 'mic'}
                     </span>
                     {isVoiceActive && (
                        <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
                     )}
                  </div>
                  
                  <h3 className="text-xl font-bold font-display mb-2 text-text-main-light dark:text-text-main-dark">
                    {isVoiceActive 
                      ? (voiceStatus === 'listening' ? "I'm listening..." : "Speaking...") 
                      : "Tap to Speak"}
                  </h3>
                  <p className="text-sm text-text-sec-light dark:text-text-sec-dark max-w-xs mx-auto mb-8">
                     {isVoiceActive 
                      ? "Ask me to navigate to home, trips, or guides." 
                      : "I can help you navigate hands-free."}
                  </p>

                  <button 
                    onClick={toggleVoiceSession}
                    className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg transition-all ${
                       isVoiceActive 
                       ? 'bg-white dark:bg-white/10 text-red-500 border border-red-500/20 hover:bg-red-50' 
                       : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                     {isVoiceActive ? 'End Session' : 'Start Conversation'}
                  </button>

                  {/* Visualizer Bar */}
                  {isVoiceActive && (
                     <div className="flex items-end justify-center gap-1 h-12 mt-12 w-full max-w-[200px]">
                        {[...Array(5)].map((_, i) => (
                           <div 
                              key={i} 
                              className="w-2 bg-primary/50 rounded-full transition-all duration-75"
                              style={{ height: `${Math.max(10, Math.random() * volume)}%` }}
                           ></div>
                        ))}
                     </div>
                  )}
               </div>
             )}
          </div>
        </div>
      )}
    </>
  );
};
