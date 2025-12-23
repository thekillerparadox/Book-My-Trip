import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const AIVisualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('16:9');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ratios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const sizes = ['1K', '2K', '4K'];

  const handleGenerate = async () => {
    if (!prompt) return;
    
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey();
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `A photorealistic ultra-high-definition cinematic travel landscape of ${prompt}, professional lighting, professional photography style.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: size as any,
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio?.openSelectKey();
      }
      alert("AI Generation failed. Please try again with a valid API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-[1000px] px-6">
      <div className="bg-white dark:bg-[#0D1117] rounded-xl p-3 md:p-4 border border-gray-100 dark:border-white/5 shadow-md overflow-hidden relative group transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-20"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Input Controls */}
          <div className={`${(generatedImage || loading) ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3 transition-all duration-500`}>
             <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-1 w-fit">
                    <span className="material-symbols-outlined text-[9px]">auto_awesome</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider">Nano Engine</span>
                  </div>
                  <h2 className="text-sm font-bold text-text-main-light dark:text-text-main-dark tracking-tight font-display">
                    Visualize Your <span className="text-primary">Adventure</span>
                  </h2>
                </div>
                {!generatedImage && !loading && (
                  <p className="hidden md:block text-text-sec-light dark:text-text-sec-dark text-[9px] font-medium opacity-60">
                    Render your dream destination in 4K resolution instantly.
                  </p>
                )}
             </div>

             <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., A minimalist beach villa in the Maldives..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg py-1.5 px-3 text-[11px] text-text-main-light dark:text-text-main-dark placeholder:text-text-sec-light/30 focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[44px] md:min-h-[56px] transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-2 min-w-[140px]">
                   <div className="flex bg-gray-50 dark:bg-white/5 p-0.5 rounded-md border border-gray-100 dark:border-white/5">
                      {sizes.map(s => (
                        <button 
                          key={s}
                          onClick={() => setSize(s as any)}
                          className={`flex-1 py-1 rounded text-[8px] font-bold transition-all ${size === s ? 'bg-primary text-white shadow-sm' : 'text-text-sec-light/60 hover:text-primary'}`}
                        >
                          {s}
                        </button>
                      ))}
                   </div>
                   <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="h-8 bg-primary text-white font-bold rounded-md shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest"
                  >
                    {loading ? (
                      <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">brush</span>
                        Render
                      </>
                    )}
                  </button>
                </div>
             </div>
          </div>

          {/* Preview Result - Only visible when active */}
          {(generatedImage || loading) && (
            <div className="lg:col-span-7 relative h-48 lg:h-40 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 overflow-hidden flex items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500 shadow-inner">
              {generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="AI Render" 
                    className="w-full h-full object-cover animate-in fade-in duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a 
                      href={generatedImage} 
                      download="bmt-ai-render.png"
                      className="size-8 rounded-lg bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-xl"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                    </a>
                  </div>
                  <button 
                    onClick={() => setGeneratedImage(null)}
                    className="absolute top-2 right-2 size-6 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </>
              ) : loading && (
                <div className="absolute inset-0 bg-white/95 dark:bg-[#0D1117]/98 flex flex-col items-center justify-center text-center p-3 z-20 backdrop-blur-sm">
                    <div className="size-6 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mb-2"></div>
                    <h3 className="text-[10px] font-bold text-text-main-light dark:text-text-main-dark mb-0.5 font-display tracking-tight uppercase">Synthesizing Scene</h3>
                    <p className="text-text-sec-light text-[8px] opacity-60">Applying ultra-HD lighting...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
