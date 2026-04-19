import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width > 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-arabic overflow-x-hidden">
      {/* Sidebar - z-100 */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Backdrop */}
      {isSidebarOpen && windowWidth <= 1024 && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90]" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Content wrapper */}
      <div className="flex flex-1 relative">
        <main 
          className={`flex-1 w-full transition-all duration-500 ease-in-out min-h-screen ${
            isSidebarOpen && windowWidth > 1024 ? 'mr-60' : 'mr-0'
          }`}
        >
          {/* Header - Global Safe Zone for Toggle Burger Button */}
          <header className={`h-16 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-[40] transition-all duration-500 pr-16 md:pr-10 pl-6`}>
             {/* Logo - Always protected by pr-16/pr-10 */}
             <div className="flex items-center">
               <Link to="/" className="flex items-center">
                  <h1 className="text-base md:text-xl font-black bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform tracking-tight">
                    KSI Digital Pattern
                  </h1>
                </Link>
             </div>
            
            <div className="flex items-center gap-3">
               {/* User Avatar Removed */}
            </div>
          </header>

          {/* Actual Page Content */}
          <div className="w-full px-4 py-6 md:p-8 max-w-7xl mx-auto overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
