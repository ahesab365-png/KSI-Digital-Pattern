import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Folder, ShieldCheck, BarChart3, HelpCircle, LogOut, Plus, Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem('admin_token');

  const menuItems = [
    { icon: <LayoutGrid size={18} />, label: 'نظرة عامة', path: '/' },
    { icon: <Folder size={18} />, label: 'برامجي', path: '/programs' },
    ...(isAdmin ? [
      { icon: <ShieldCheck size={18} />, label: 'الإدارة', path: '/admin' },
      { icon: <BarChart3 size={18} />, label: 'التقارير', path: '/reports' },
    ] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <aside 
        className={`fixed right-0 top-0 h-screen bg-white border-l border-slate-100 shadow-2xl z-[100] transition-all duration-500 ease-in-out flex flex-col font-arabic ${
          isOpen ? 'w-60 translate-x-0' : 'w-0 translate-x-full'
        }`}
      >
        <button 
          onClick={onToggle}
          className={`fixed top-4 transition-all duration-500 z-[110] p-2 bg-blue-600 text-white shadow-xl rounded-l-xl flex items-center justify-center active:scale-90 ${
            isOpen ? 'right-60' : 'right-0'
          }`}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`w-60 flex flex-col h-full bg-white ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-sm font-black text-slate-800 tracking-tightest uppercase">KSI Digital Pattern</h2>
            <p className="text-[10px] text-slate-400 mt-0.5 tracking-widest uppercase opacity-60">Digital Studio</p>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-6 overflow-y-auto">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-[13px] font-bold whitespace-nowrap">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 space-y-3 pb-8 border-t border-slate-50 mt-auto bg-white">
            {isAdmin && (
              <NavLink to="/admin/create-article" className="w-full bg-slate-900 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95">
                <Plus size={16} />
                <span className="font-bold text-xs whitespace-nowrap">جديد</span>
              </NavLink>
            )}

            <div className="space-y-1">
              <button className="flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-slate-800 w-full transition-colors text-xs">
                <HelpCircle size={16} />
                <span className="whitespace-nowrap font-medium text-right">المساعدة</span>
              </button>
              
              {isAdmin && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-red-500 w-full transition-colors text-xs"
                >
                  <LogOut size={16} />
                  <span className="whitespace-nowrap font-medium text-right">الخروج</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
