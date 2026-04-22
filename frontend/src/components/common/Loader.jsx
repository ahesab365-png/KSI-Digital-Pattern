import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[2000] bg-white/20 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Animated Drawing SVG Only */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-20 h-20 text-black fill-none stroke-black stroke-[1.2]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            className="shirt-path-clean"
            d="M20.38 8.57l-1.23 1.85a2.503 2.503 0 01-2.09 1.1h-2.13v9.48c0 .55-.45 1-1 1h-3.86c-.55 0-1-.45-1-1v-9.48H6.94c-.81 0-1.55-.4-2.09-1.1L3.62 8.57c-.23-.34-.23-.79.01-1.13l2.09-3.13C5.97 3.93 6.4 3.7 6.85 3.7h1.49a3.655 3.655 0 017.31 0h1.49c.45 0 .88.23 1.13.61l2.09 3.13c.25.34.25.79.02 1.13z" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .shirt-path-clean {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: draw-shirt-simple 2.5s infinite alternate ease-in-out;
        }

        @keyframes draw-shirt-simple {
          0% { stroke-dashoffset: 80; }
          100% { stroke-dashoffset: 0; }
        }
      `}} />
    </div>
  );
};

export default Loader;
