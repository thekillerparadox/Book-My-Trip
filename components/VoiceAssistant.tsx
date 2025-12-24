import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { AppView } from '../types';

interface VoiceAssistantProps {
  setView: (view: AppView) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ setView }) => {
  const [isActive, setIsActive] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  const audioStack = useRef<Array<AudioBuffer>>([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);

  // Helper: Decode Base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Helper: Decode Audio Data (Raw PCM)
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
      return;
    }
    
    isPlayingRef.current = true;
    const buffer = audioStack.current.shift();
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    // Schedule playback
    const currentTime = ctx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
    
    source.onended = () => {
       setIsTalking(false);
       playNextBuffer(ctx);
    };
  };

  const visualize = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Simple average volume calculation
    const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setVolume(avg);
    
    animationFrameRef.current = requestAnimationFrame(visualize);
  };

  const toggleSession = async () => {
    if (isActive) {
      window.location.reload(); 
      return;
    }

    setIsActive(true);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    audioContextRef.current = ctx;
    
    const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Setup Analyser for visualization
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      visualize(); // Start visualizer loop

      const config = {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        },
        systemInstruction: "You are a helpful travel assistant for 'Book My Trip'. Keep answers short, friendly, and travel-focused."
      };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config,
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                  pcmData[i] = inputData[i] * 32768;
              }
              
              let binary = '';
              const bytes = new Uint8Array(pcmData.buffer);
              const len = bytes.byteLength;
              for (let i = 0; i < len; i++) {
                  binary += String.fromCharCode(bytes[i]);
              }
              const b64 = btoa(binary);

              sessionPromise.then(session => {
                  session.sendRealtimeInput({
                      media: {
                          mimeType: 'audio/pcm;rate=16000',
                          data: b64
                      }
                  });
              });
            };

            source.connect(processor);
            processor.connect(ctx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
               setIsTalking(true);
               const arrayBuffer = base64ToArrayBuffer(audioData);
               const audioBuffer = await decodeAudioData(arrayBuffer, outCtx);
               audioStack.current.push(audioBuffer);
               if (!isPlayingRef.current) {
                 playNextBuffer(outCtx);
               }
            }
          },
          onclose: () => setIsActive(false),
          onerror: (err) => {
             console.error(err);
             setIsActive(false);
          }
        }
      });

    } catch (e) {
      console.error(e);
      alert("Microphone access required.");
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
       {/* Compact Visualizer Panel */}
       {isActive && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl mb-2 animate-in slide-in-from-bottom-5 w-64 shadow-2xl relative overflow-hidden">
             {/* Background Pulse Effect based on volume */}
             <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/30 rounded-full blur-2xl transition-all duration-75"
                style={{ width: `${Math.max(50, volume * 2)}px`, height: `${Math.max(50, volume * 2)}px` }}
             ></div>

             <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                   {/* Audio Bars Animation */}
                   <div className="flex gap-1 h-8 items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className={`w-1 bg-white rounded-full transition-all duration-150 ${isTalking ? 'animate-pulse' : ''}`}
                          style={{ height: isTalking ? `${Math.random() * 24 + 4}px` : '4px' }}
                        ></div>
                      ))}
                   </div>
                </div>
                <p className="text-white text-xs font-bold uppercase tracking-widest text-center">
                   {isTalking ? 'Gemini Speaking...' : 'Listening...'}
                </p>
             </div>
          </div>
       )}
       
       {/* Small Accessible Icon Button (FAB) */}
       <button 
         onClick={toggleSession}
         className={`size-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 focus:outline-none focus:ring-4 focus:ring-primary/50 relative ${
            isActive 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-primary text-white border-2 border-white/20 hover:border-white/40'
         }`}
         aria-label={isActive ? "Stop Voice Assistant" : "Start Voice Assistant"}
         title={isActive ? "Stop Listening" : "Start Voice Assistant"}
       >
          <span className="material-symbols-outlined text-2xl">
             {isActive ? 'mic_off' : 'mic'}
          </span>
          
          {/* Ripple Effect Ring when active */}
          {isActive && (
             <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
          )}
       </button>
    </div>
  );
};