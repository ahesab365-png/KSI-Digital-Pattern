import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width > 1024) setIsSidebarOpen(true);
      else if (!isSidebarOpen) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-arabic overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Backdrop (Only for mobile) */}
      {isSidebarOpen && windowWidth <= 1024 && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Content wrapper */}
      <div className="flex flex-1 relative">
        <main 
          className={`flex-1 w-full transition-all duration-500 ease-in-out min-h-screen ${
            isSidebarOpen && windowWidth > 1024 ? 'mr-64' : 'mr-0'
          }`}
        >
          {/* Header */}
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-[80] px-6 md:px-10">
             <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button 
                  onClick={toggleSidebar}
                  className="lg:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-100"
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <Link to="/" className="flex items-center">
                  <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform tracking-tight">
                    KSI Digital Pattern
                  </h1>
                </Link>
             </div>
            
            <div className="hidden md:flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Learning Platform</span>
            </div>
          </header>

          {/* Actual Page Content */}
          <div className="w-full px-4 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
