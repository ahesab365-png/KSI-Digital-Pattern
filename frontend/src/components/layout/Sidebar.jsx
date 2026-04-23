import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Folder, ShieldCheck, BarChart3, HelpCircle, LogOut, Plus, X } from 'lucide-react';

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
    <aside 
      className={`fixed right-0 top-0 h-screen bg-white border-l border-slate-100 shadow-2xl z-[150] transition-all duration-500 ease-in-out flex flex-col font-arabic w-64 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className={`w-64 flex flex-col h-full bg-white ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {/* Sidebar Header with Close Button */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-slate-800 tracking-tightest uppercase">KSI Digital</h2>
            <p className="text-[10px] text-slate-400 mt-0.5 tracking-widest uppercase opacity-60">Digital Studio</p>
          </div>
          <button onClick={onToggle} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 flex flex-col space-y-1 mt-8 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-[13px] font-black whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 space-y-4 pb-10 border-t border-slate-50 mt-auto bg-white">
          {isAdmin && (
            <NavLink to="/admin/create-article" className="w-full bg-slate-900 text-white rounded-2xl py-4 px-4 flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95">
              <Plus size={16} />
              <span className="font-black text-xs whitespace-nowrap">إضافة جديد</span>
            </NavLink>
          )}

          <div className="space-y-1">
            <button className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-slate-800 w-full transition-colors text-xs font-bold">
              <HelpCircle size={16} />
              <span className="whitespace-nowrap text-right">المساعدة والتعليمات</span>
            </button>
            
            {isAdmin && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-500 w-full transition-colors text-xs font-bold"
              >
                <LogOut size={16} />
                <span className="whitespace-nowrap text-right">تسجيل الخروج</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
