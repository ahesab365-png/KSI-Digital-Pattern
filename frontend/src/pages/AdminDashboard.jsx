import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ExternalLink, Filter, TrendingUp, Users, BookOpen } from 'lucide-react';
import { articleService } from '../services/articleService';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const data = await articleService.getAll();
    setArticles(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setLoading(false);
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف مقال "${title}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        await articleService.remove(id);
        Swal.fire('تم الحذف!', 'تم حذف المقال بنجاح.', 'success');
        loadArticles();
      }
    });
  };

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full font-arabic overflow-hidden">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-10">
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">لوحة الإدارة</h1>
          <p className="text-slate-400 text-xs mt-1">إشراف وإدارة المحتوى التعليمي للمنصة</p>
        </div>
        <button 
          onClick={() => navigate('/admin/create-article')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>إضافة مقال جديد</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="p-5 border-b flex flex-col sm:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
             <input 
               type="text" 
               placeholder="ابحث بالعنوان أو التصنيف..."
               className="w-full bg-slate-50 border-none rounded-2xl py-3 pr-12 pl-4 outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all font-bold"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[700px]">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-8 py-5">المقال التعليمي</th>
                <th className="px-6 py-5 text-center">البرنامج</th>
                <th className="px-6 py-5 text-center">الفئة / النوع</th>
                <th className="px-6 py-5 text-center">الحالة</th>
                <th className="px-8 py-5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredArticles.length > 0 ? filteredArticles.map((art) => (
                <tr key={art._id} className="hover:bg-blue-50/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{art.title}</span>
                      <span className="text-[10px] text-slate-300 font-bold mt-1">نُشر في: {new Date(art.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-slate-600 text-[11px] font-bold px-3 py-1 bg-slate-100 rounded-lg">
                        {art.program === '1' ? 'Gerber' : 'Gemini'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col gap-1 items-center">
                       <span className="bg-blue-50 px-3 py-0.5 rounded-full text-[9px] font-black text-blue-600 uppercase">{art.mainCategory}</span>
                       <span className="text-slate-400 text-[10px] font-bold">{art.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {art.isPublic ? 
                      <span className="text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg text-[9px] font-black">منشور</span> :
                      <span className="text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg text-[9px] font-black">مسودة</span>
                    }
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => navigate(`/article/${art._id}`)}
                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" 
                        title="معاينة"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/edit-article/${art._id}`)}
                        className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm" 
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(art._id, art.title)}
                        className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" 
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                          <BookOpen size={24} className="text-slate-200" />
                       </div>
                       <p className="text-slate-400 font-bold text-sm">لا توجد مقالات مطابقة للبحث</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
