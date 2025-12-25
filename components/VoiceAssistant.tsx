import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from "@google/genai";
import { AppView } from '../types';

interface VoiceAssistantProps {
  setView: (view: AppView) => void;
}

interface TranscriptItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

// Function definition for Voice Navigation
const navigationTool: FunctionDeclaration = {
  name: 'navigate',
  description: 'Navigate to a different section of the application. Use this when the user asks to see specific pages like home, trips, guides, etc.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      view: {
        type: Type.STRING,
        enum: ['home', 'trips', 'guides'],
        description: 'The destination view ID to navigate to.'
      }
    },
    required: ['view']
  }
};

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ setView }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [volume, setVolume] = useState(0);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const transcriptListRef = useRef<HTMLDivElement>(null);
  
  const audioStack = useRef<Array<AudioBuffer>>([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptListRef.current) {
      transcriptListRef.current.scrollTop = transcriptListRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (sessionRef.current) {
        // Live session close not strictly explicitly available on session object, usually controlled via component unmount logic
      }
    };
  }, []);

  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const decodeAudioData = async (
    data: ArrayBuffer,
    ctx: AudioContext,
    sampleRate = 24000
  ): Promise<AudioBuffer> => {
    const data16 = new Int16Array(data);
    const float32 = new Float32Array(data16.length);
    for (let i = 0; i < data16.length; i++) {
      float32[i] = data16[i] / 32768;
    }
    const buffer = ctx.createBuffer(1, float32.length, sampleRate);
    buffer.copyToChannel(float32, 0);
    return buffer;
  };

  const playNextBuffer = (ctx: AudioContext) => {
    if (audioStack.current.length === 0) {
      isPlayingRef.current = false;
      setStatus('listening');
      return;
    }
    
    isPlayingRef.current = true;
    setStatus('speaking');
    const buffer = audioStack.current.shift();
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    const currentTime = ctx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
    
    source.onended = () => {
       playNextBuffer(ctx);
    };
  };

  const visualize = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setVolume(avg);
    animationFrameRef.current = requestAnimationFrame(visualize);
  };

  const toggleSession = async () => {
    if (isActive) {
      // Hard reset for safety
      window.location.reload(); 
      return;
    }

    setIsActive(true);
    setStatus('idle');
    setTranscripts([{ id: 'init', sender: 'ai', text: 'Hello! I am your AI travel assistant. Ask me anything!' }]);

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    audioContextRef.current = ctx;
    const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      visualize();

      const config = {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        },
        tools: [{ functionDeclarations: [navigationTool] }],
        systemInstruction: "You are an accessible travel assistant. Speak clearly. You can navigate the app. If the user says 'Go to trips', call the navigate tool.",
      };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config,
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setStatus('listening');
            
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) pcmData[i] = inputData[i] * 32768;
              
              let binary = '';
              const bytes = new Uint8Array(pcmData.buffer);
              const len = bytes.byteLength;
              for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
              const b64 = btoa(binary);

              sessionPromise.then(session => {
                  sessionRef.current = session;
                  session.sendRealtimeInput({
                      media: { mimeType: 'audio/pcm;rate=16000', data: b64 }
                  });
              });
            };
            source.connect(processor);
            processor.connect(ctx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Tool Calls
            if (msg.toolCall) {
              for (const call of msg.toolCall.functionCalls) {
                if (call.name === 'navigate') {
                  const view = (call.args as any).view;
                  setView(view as AppView);
                  setTranscripts(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: `Navigating to ${view}...` }]);
                  
                  sessionPromise.then(session => session.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: call.name,
                      response: { result: "Navigation successful" }
                    }]
                  }));
                }
              }
            }

            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
               setStatus('speaking');
               const arrayBuffer = base64ToArrayBuffer(audioData);
               const audioBuffer = await decodeAudioData(arrayBuffer, outCtx);
               audioStack.current.push(audioBuffer);
               if (!isPlayingRef.current) playNextBuffer(outCtx);
            }
          },
          onclose: () => { setIsActive(false); setStatus('idle'); },
          onerror: (err) => { console.error(err); setIsActive(false); }
        }
      });

    } catch (e) {
      console.error(e);
      alert("Microphone access required for Voice Assistant.");
      setIsActive(false);
    }
  };

  return (
    <>
      {isActive && (
        <div 
          className="fixed bottom-24 right-6 z-[100] w-80 md:w-96 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border-2 border-primary/20 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 transition-all duration-300 glass-panel"
          style={{ maxHeight: '60vh' }}
        >
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined animate-pulse">
                {status === 'listening' ? 'mic' : status === 'speaking' ? 'volume_up' : 'more_horiz'}
              </span>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest">Travel Assistant</h3>
                <p className="text-[10px] font-medium opacity-80">
                  {status === 'listening' ? 'Listening...' : status === 'speaking' ? 'Speaking...' : 'Thinking...'}
                </p>
              </div>
            </div>
            <button 
              onClick={toggleSession}
              className="size-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div 
            ref={transcriptListRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/20"
          >
            {transcripts.map((t, i) => (
              <div key={i} className={`flex ${t.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${
                    t.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {t.text}
                </div>
              </div>
            ))}
            
            <div className="h-16 flex items-center justify-center gap-1 mt-2">
                {[...Array(8)].map((_, i) => (
                    <div 
                        key={i}
                        className="w-1.5 bg-primary rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(4, Math.random() * volume * 1.5)}px` }}
                    />
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[100]">
        <button 
          onClick={toggleSession}
          className={`size-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/50 relative ${
              isActive 
              ? 'bg-red-500 text-white' 
              : 'bg-primary text-white'
          }`}
        >
            <span className="material-symbols-outlined text-3xl">
              {isActive ? 'mic_off' : 'mic'}
            </span>
            
            {isActive && status === 'listening' && (
              <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
            )}
        </button>
      </div>
    </>
  );
};