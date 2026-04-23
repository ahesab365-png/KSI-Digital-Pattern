import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar automatically on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-arabic">
      
      {/* 1. Header - Fixed & Reliable */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-[100] px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600 bg-slate-50 rounded-xl active:bg-slate-200 transition-colors"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-xl font-black text-blue-600 tracking-tighter">KSI DIGITAL</Link>
        </div>
        <div className="hidden md:block text-[10px] font-black text-slate-300">PLATFORM V1.0</div>
      </header>

      <div className="flex flex-1 relative">
        {/* 2. Sidebar - Managed via props */}
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />

        {/* 3. Main Content - Responsive Margins */}
        <main className={`flex-1 w-full transition-all duration-300 ${isSidebarOpen ? 'lg:mr-64' : 'lg:mr-0'}`}>
          <div className="p-0 md:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 4. Protective Overlay - Only exists when open on mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
