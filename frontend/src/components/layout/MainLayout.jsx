import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth > 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-arabic">
      {/* Sidebar - Highest Z-index */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Simplified Mobile Header */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-[80] px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-slate-600 bg-slate-50 rounded-xl"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-xl font-black text-blue-600">KSI Digital</Link>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex flex-1">
        <main 
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen && window.innerWidth > 1024 ? 'mr-64' : 'mr-0'
          }`}
        >
          <div className="p-4 md:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Transparent Click-to-Close (Mobile Only) */}
      {isSidebarOpen && window.innerWidth <= 1024 && (
        <div 
          className="fixed inset-0 bg-black/20 z-[90]" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
