import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[2000] bg-white/30 backdrop-blur-md flex flex-col items-center justify-center font-arabic">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Animated Drawing SVG */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-24 h-24 text-black fill-none stroke-black stroke-[1.5]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            className="shirt-path"
            d="M20.38 8.57l-1.23 1.85a2.503 2.503 0 01-2.09 1.1h-2.13v9.48c0 .55-.45 1-1 1h-3.86c-.55 0-1-.45-1-1v-9.48H6.94c-.81 0-1.55-.4-2.09-1.1L3.62 8.57c-.23-.34-.23-.79.01-1.13l2.09-3.13C5.97 3.93 6.4 3.7 6.85 3.7h1.49a3.655 3.655 0 017.31 0h1.49c.45 0 .88.23 1.13.61l2.09 3.13c.25.34.25.79.02 1.13z" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>

        {/* Outer Circular Loader */}
        <div className="absolute inset-0 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Modern Minimal Text */}
      <div className="mt-6 flex flex-col items-center">
        <span className="text-[10px] font-black text-black uppercase tracking-[0.4em]">Designing Your Experience</span>
        <div className="h-1 w-20 bg-black/10 mt-2 rounded-full overflow-hidden">
           <div className="h-full bg-black w-full animate-loading-bar"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .shirt-path {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-shirt 3s infinite alternate ease-in-out;
        }

        @keyframes draw-shirt {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite linear;
        }
      `}} />
    </div>
  );
};

export default Loader;
