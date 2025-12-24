import React, { useState, useEffect } from 'react';

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    
    // Text Size
    root.style.fontSize = `${textSize}%`;

    // Reduced Motion
    if (reducedMotion) {
      root.style.scrollBehavior = 'auto';
      document.body.classList.add('reduce-motion');
    } else {
      root.style.scrollBehavior = 'smooth';
      document.body.classList.remove('reduce-motion');
    }

    // High Contrast
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [textSize, reducedMotion, highContrast]);

  return (
    <>
      <style>{`
        .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        .high-contrast {
          filter: contrast(120%);
          --tw-bg-opacity: 1 !important;
        }
        .high-contrast body {
           background-color: #000 !important;
           color: #fff !important;
        }
        .high-contrast * {
           border-color: #fff !important;
        }
      `}</style>

      <div className="fixed bottom-6 left-6 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`size-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 focus:outline-none focus:ring-4 focus:ring-blue-400/50 ${
             isOpen ? 'bg-text-main-light text-white rotate-45' : 'bg-blue-600 text-white'
          }`}
          aria-label="Accessibility Settings"
          title="Open Accessibility Menu"
        >
          <span className="material-symbols-outlined text-3xl">accessibility_new</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-20 left-0 w-72 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-gray-700 p-6 animate-in slide-in-from-bottom-5 origin-bottom-left">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-main-light dark:text-white">
              <span className="material-symbols-outlined text-primary">settings_accessibility</span>
              Accessibility
            </h3>

            <div className="space-y-6">
              {/* Text Size */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">Text Size</label>
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                  <button 
                    onClick={() => setTextSize(Math.max(100, textSize - 10))} 
                    className="size-10 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center font-bold hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
                    aria-label="Decrease Text Size"
                  >-</button>
                  <span className="flex-1 text-center font-bold text-sm">{textSize}%</span>
                  <button 
                    onClick={() => setTextSize(Math.min(150, textSize + 10))} 
                    className="size-10 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center font-bold hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
                    aria-label="Increase Text Size"
                  >+</button>
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">High Contrast</label>
                <button 
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-12 h-7 rounded-full relative transition-colors ${highContrast ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                  aria-label="Toggle High Contrast"
                >
                  <div className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${highContrast ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Reduced Motion</label>
                <button 
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-12 h-7 rounded-full relative transition-colors ${reducedMotion ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                  aria-label="Toggle Reduced Motion"
                >
                  <div className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${reducedMotion ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>

              <button 
                onClick={() => { setTextSize(100); setHighContrast(false); setReducedMotion(false); }}
                className="w-full py-3 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
              >
                Reset Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};