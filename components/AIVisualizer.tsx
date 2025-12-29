
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

export const AIVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [activeStyle, setActiveStyle] = useState('Cinematic');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Edit Mode State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ratios = [
    { label: 'Square', value: '1:1', icon: 'square' },
    { label: 'Standard', value: '4:3', icon: 'aspect_ratio' },
    { label: 'Landscape', value: '16:9', icon: 'crop_landscape' },
    { label: 'Portrait', value: '9:16', icon: 'crop_portrait' },
    { label: 'Classic', value: '3:2', icon: 'photo_size_select_actual' },
    { label: 'Tall', value: '2:3', icon: 'portrait' },
    { label: 'Vertical', value: '3:4', icon: 'crop_portrait' },
    { label: 'Cinema', value: '21:9', icon: 'panorama_horizontal' },
  ];
  
  const sizes = ['1K', '2K', '4K'];
  
  const styles = [
    { id: 'Cinematic', label: 'Cinematic', icon: 'movie_filter' },
    { id: 'Photorealistic', label: 'Realistic', icon: 'photo_camera' },
    { id: 'Anime', label: 'Anime', icon: 'palette' },
    { id: 'Digital Art', label: 'Digital 3D', icon: 'view_in_ar' },
    { id: 'Vintage', label: 'Vintage', icon: 'history_edu' }
  ];

  const inspirations = [
    "A futuristic floating city in the clouds at sunset",
    "A cozy wooden cabin in a snowy forest with aurora borealis",
    "A neon-lit street market in Tokyo during rain",
    "A hidden waterfall inside a bioluminescent cave"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setGeneratedImage(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const checkApiKey = async () => {
    if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
    }
  };

  const handleAction = async () => {
    if (!prompt) return;
    
    setLoading(true);
    setGeneratedImage(null);
    
    try {
      await checkApiKey();
      // Re-initialize with potentially new key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mode === 'create') {
        const finalPrompt = `${activeStyle} style image of ${prompt}. High quality, detailed.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
            parts: [{ text: finalPrompt }],
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
      } else {
        // Edit Mode using gemini-2.5-flash-image
        if (!uploadedImage) return;

        // Extract base64 data (remove data:image/jpeg;base64, prefix)
        const base64Data = uploadedImage.split(',')[1];
        const mimeType = uploadedImage.split(';')[0].split(':')[1] || 'image/jpeg';

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              { 
                inlineData: { 
                  data: base64Data, 
                  mimeType: mimeType 
                } 
              },
              { text: prompt }
            ],
          },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }

    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found") && (window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
      }
      alert(`AI ${mode === 'create' ? 'Generation' : 'Editing'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-[1200px] px-4 md:px-6 py-10 md:py-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl filled">auto_awesome</span>
             </div>
             <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">AI Visuals</h2>
          </div>
          <p className="text-text-sec-light dark:text-text-sec-dark max-w-xl text-sm md:text-base opacity-80 leading-relaxed font-medium">
            Create dream destinations from scratch or reimagine your existing photos with our advanced generation engine.
          </p>
        </div>
        
        {/* Mode Toggles */}
        <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-xl flex self-start md:self-auto">
          <button
            onClick={() => setMode('create')}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${
              mode === 'create' 
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' 
              : 'text-text-sec-light hover:text-text-main-light'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setMode('edit')}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${
              mode === 'edit' 
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' 
              : 'text-text-sec-light hover:text-text-main-light'
            }`}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
           <div className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {mode === 'edit' && (
                <div className="mb-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block ml-1">Source Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative active:scale-[0.99] ${
                      uploadedImage 
                      ? 'border-primary/50' 
                      : 'border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl opacity-40 mb-2">cloud_upload</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Click to Upload</p>
                      </>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </div>
                </div>
              )}

              {/* Prompt Input */}
              <div className="mb-6 relative">
                 <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block ml-1">
                   {mode === 'create' ? 'Your Vision' : 'Editing Instructions'}
                 </label>
                 <textarea 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder={mode === 'create' ? "E.g., A minimalist beach villa in the Maldives..." : "E.g., Add a retro filter, remove the person in background..."}
                   className="w-full h-32 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all resize-none shadow-inner text-text-main-light dark:text-text-main-dark placeholder:text-text-sec-light/40"
                 />
                 <button 
                   onClick={() => setPrompt('')}
                   className={`absolute top-10 right-3 size-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all ${prompt ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                 >
                   <span className="material-symbols-outlined text-sm">close</span>
                 </button>
              </div>

              {/* Inspirations - Only for Create Mode */}
              {mode === 'create' && (
                <div className="mb-6">
                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block ml-1">Quick Inspiration</label>
                   <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                      {inspirations.map((insp, i) => (
                        <button 
                          key={i}
                          onClick={() => setPrompt(insp)}
                          className="whitespace-nowrap px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl text-[10px] font-bold text-text-sec-light dark:text-text-sec-dark hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all active:scale-95"
                        >
                          {insp}
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {/* Settings Grid - Only for Create Mode */}
              {mode === 'create' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   {/* Aspect Ratio */}
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block ml-1">Canvas Shape</label>
                      <div className="grid grid-cols-4 gap-2">
                         {ratios.map((r) => (
                           <button
                             key={r.value}
                             onClick={() => setAspectRatio(r.value)}
                             className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl border transition-all active:scale-95 ${
                               aspectRatio === r.value 
                               ? 'bg-primary/10 border-primary text-primary shadow-inner' 
                               : 'bg-gray-50 dark:bg-white/5 border-transparent text-text-sec-light hover:bg-gray-100 dark:hover:bg-white/10'
                             }`}
                           >
                             <span className="material-symbols-outlined text-sm">{r.icon}</span>
                             <span className="text-[7px] font-bold uppercase">{r.value}</span>
                           </button>
                         ))}
                      </div>
                   </div>

                   {/* Style & Size */}
                   <div className="flex flex-col gap-4">
                      <div>
                         <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block ml-1">Art Style</label>
                         <div className="relative">
                            <select 
                              value={activeStyle}
                              onChange={(e) => setActiveStyle(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold appearance-none outline-none focus:ring-1 focus:ring-primary cursor-pointer text-text-main-light dark:text-text-main-dark hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                              {styles.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-sm">expand_more</span>
                         </div>
                      </div>
                      <div>
                         <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block ml-1">Resolution</label>
                         <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-xl">
                            {sizes.map(s => (
                              <button 
                                key={s}
                                onClick={() => setSize(s as any)}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${
                                  size === s 
                                  ? 'bg-white dark:bg-gray-700 shadow-md text-primary' 
                                  : 'text-text-sec-light dark:text-text-sec-dark opacity-60 hover:opacity-100'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              <button 
                onClick={handleAction}
                disabled={loading || !prompt || (mode === 'edit' && !uploadedImage)}
                className={`w-full h-14 rounded-2xl font-bold uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 shadow-xl transition-all ${
                  loading || !prompt || (mode === 'edit' && !uploadedImage)
                  ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary text-white shadow-primary/25 hover:scale-[1.02] active:scale-95 hover:shadow-primary/40'
                }`}
              >
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{mode === 'create' ? 'Rendering...' : 'Editing...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">{mode === 'create' ? 'brush' : 'auto_fix'}</span>
                    {mode === 'create' ? 'Generate Scene' : 'Apply Edits'}
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7 h-[400px] lg:h-auto bg-gray-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center group order-1 lg:order-2">
           {generatedImage ? (
             <>
               <img 
                 src={generatedImage} 
                 alt="AI Generated" 
                 className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700 bg-black"
               />
               
               {/* Overlay Controls */}
               <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={generatedImage} 
                    download={`bmt-${mode}.png`}
                    className="size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-xl active:scale-90"
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-xl">download</span>
                  </a>
                  <button 
                    onClick={() => setGeneratedImage(null)}
                    className="size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all shadow-xl active:scale-90"
                    title="Clear"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
               </div>
               
               <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                 <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Prompt</p>
                 <p className="text-white text-sm font-medium truncate">{prompt}</p>
               </div>
             </>
           ) : (
             <div className="text-center px-6 relative z-10">
                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative size-20">
                       <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
                       <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold font-display tracking-tight mb-1">Processing Vision</h3>
                      <p className="text-white/40 text-xs">High-fidelity rendering in progress...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="size-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                       <span className="material-symbols-outlined text-5xl text-white/20">{mode === 'create' ? 'image' : 'edit'}</span>
                    </div>
                    <h3 className="text-white text-2xl font-bold font-display tracking-tight mb-3">
                      {mode === 'create' ? 'Ready to Visualize' : 'Ready to Edit'}
                    </h3>
                    <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                       {mode === 'create' 
                         ? 'Enter a detailed prompt and adjust the advanced settings to see your imagination come to life in 4K.' 
                         : 'Upload an image and use natural language commands like "Add a sunset" or "Remove people".'}
                    </p>
                  </>
                )}
             </div>
           )}
           
           {/* Grid Background Effect */}
           {!generatedImage && (
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
           )}
        </div>
      </div>
    </section>
  );
};
