import React from 'react';
import { Shirt } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[2000] bg-white flex flex-col items-center justify-center font-arabic">
      {/* Outer Glow effect */}
      <div className="relative">
        {/* Animated Rings */}
        <div className="absolute inset-0 scale-150 animate-ping opacity-20">
           <Shirt size={80} className="text-black" />
        </div>
        
        {/* Main Icon Container */}
        <div className="relative bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-bounce duration-[2000ms]">
          <Shirt size={60} className="text-black stroke-[2.5px]" />
          
          {/* Internal Progress Line (Simulated) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-1 bg-black rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-full animate-progress-fast origin-right"></div>
          </div>
        </div>
      </div>

      {/* Text Info */}
      <div className="mt-12 text-center">
        <h2 className="text-xl font-black text-black tracking-widest uppercase">KSI Pattern</h2>
        <div className="flex items-center gap-2 mt-2">
           <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
           <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
           <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress-fast {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-progress-fast {
          animation: progress-fast 1.5s infinite linear;
        }
      `}} />
    </div>
  );
};

export default Loader;
