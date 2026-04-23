import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ChevronDown, Eye, RefreshCw, Pause, Play, FileEdit, TrendingUp, MousePointer2 } from 'lucide-react';
import { articleService } from '../services/articleService';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
        const data = await articleService.getAll();
        const sanitizedData = (Array.isArray(data) ? data : []).map(art => ({
            ...art,
            status: art.status || (art.isPublic ? 'active' : 'draft')
        }));
        setArticles(sanitizedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setSelectedIds([]);
    } catch (error) {
        console.error("Error loading articles:", error);
        Swal.fire('خطأ!', 'فشل جلب البيانات من السيرفر.', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handleStatusUpdate = async (ids, newStatus) => {
    const labels = { 'active': 'تفعيل', 'draft': 'نقل للمسودات', 'paused': 'إيقاف مؤقت' };
    const success = await articleService.bulkUpdateStatus(Array.isArray(ids) ? ids : [ids], newStatus);
    if (success) {
        Swal.fire({
            title: 'تم التحديث!',
            text: `تم ${labels[newStatus]} المنشورات المختارة بنجاح.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        loadArticles();
    } else {
        Swal.fire('خطأ!', 'فشل تحديث الحالة.', 'error');
    }
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
        const success = await articleService.remove(id);
        if (success) {
            Swal.fire('تم الحذف!', 'تم حذف المقال بنجاح.', 'success');
            loadArticles();
        } else {
            Swal.fire('خطأ!', 'فشل حذف المقال.', 'error');
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف ${selectedIds.length} منشورات مختارة نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'نعم، احذف الكل',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await articleService.bulkRemove(selectedIds);
        if (success) {
            Swal.fire('تم الحذف!', 'تم حذف المنشورات المختارة بنجاح.', 'success');
            loadArticles();
        } else {
            Swal.fire('خطأ!', 'فشل حذف بعض المنشورات.', 'error');
        }
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map(a => a._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: 'active', label: 'النشطة', count: articles.filter(a => a.status === 'active').length },
    { id: 'draft', label: 'المسودات', count: articles.filter(a => a.status === 'draft').length },
    { id: 'paused', label: 'المتوقفة', count: articles.filter(a => a.status === 'paused').length },
  ];

  const filteredArticles = articles.filter(art => {
    const title = art.title || '';
    const category = art.category || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch && art.status === activeTab;
  });

  const getThumbnail = (art) => {
    if (art.steps && Array.isArray(art.steps) && art.steps.length > 0 && art.steps[0].image) {
        return art.steps[0].image;
    }
    return art.image || null;
  };

  return (
    <div className="w-full font-arabic bg-[#f7f7f7] min-h-screen p-4 md:p-8 text-[#404145]" dir="rtl">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#404145]">إدارة المنشورات</h1>
            <button 
                onClick={loadArticles}
                className="p-2 text-[#95979d] hover:text-[#1dbf73] transition-colors rounded-full hover:bg-white border border-transparent hover:border-gray-200"
                title="تحديث البيانات"
            >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#404145]">قبول الطلبات المخصصة</span>
            <button 
              onClick={() => setAcceptingOrders(!acceptingOrders)}
              className={`w-11 h-6 rounded-full p-1 transition-colors relative ${acceptingOrders ? 'bg-[#1dbf73]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${acceptingOrders ? '-translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap items-center gap-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-[13px] font-bold tracking-wider transition-all relative flex items-center gap-2 ${
                activeTab === tab.id ? 'text-[#404145]' : 'text-[#95979d] hover:text-[#404145]'
              }`}
            >
              {tab.label.toUpperCase()}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === tab.id ? 'bg-[#1dbf73] text-white' : 'bg-[#e4e5e7] text-[#74767e]'
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1dbf73]" />}
            </button>
          ))}
          <div className="flex-1" />
          <button 
            onClick={() => navigate('/admin/create-article')}
            className="mb-4 bg-[#1dbf73] hover:bg-[#19a463] text-white px-5 py-2.5 rounded font-bold text-[14px] transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            إنشاء منشور جديد
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto bg-white rounded border border-[#e4e5e7] shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-4 py-3 border-b border-[#e4e5e7] flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <h2 className="text-xs font-bold uppercase text-[#404145] tracking-widest">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center border border-[#dadbdd] rounded-md overflow-hidden transition-all ${selectedIds.length > 0 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                {activeTab !== 'active' && (
                    <button 
                        onClick={() => handleStatusUpdate(selectedIds, 'active')}
                        className="px-4 py-1.5 text-[11px] font-bold text-[#1dbf73] hover:bg-gray-50 border-e border-[#dadbdd] uppercase flex items-center gap-1"
                    >
                        <Play size={12} /> تفعيل
                    </button>
                )}
                {activeTab === 'active' && (
                    <button 
                        onClick={() => handleStatusUpdate(selectedIds, 'paused')}
                        className="px-4 py-1.5 text-[11px] font-bold text-amber-600 hover:bg-amber-50 border-e border-[#dadbdd] uppercase flex items-center gap-1"
                    >
                        <Pause size={12} /> إيقاف
                    </button>
                )}
                {activeTab !== 'draft' && (
                    <button 
                        onClick={() => handleStatusUpdate(selectedIds, 'draft')}
                        className="px-4 py-1.5 text-[11px] font-bold text-[#74767e] hover:bg-gray-50 border-e border-[#dadbdd] uppercase flex items-center gap-1"
                    >
                        <FileEdit size={12} /> للمسودة
                    </button>
                )}
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 border-e border-[#dadbdd] uppercase flex items-center gap-1"
                >
                  <Trash2 size={12} /> حذف
                </button>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b5b6ba]" size={14} />
              <input 
                type="text" 
                placeholder="ابحث في منشوراتك..."
                className="pr-9 pl-4 py-1.5 border border-[#dadbdd] rounded-md text-sm outline-none focus:border-[#1dbf73] transition-all w-64 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#fff] border-b border-[#e4e5e7]">
              <tr className="text-[#95979d] text-[11px] font-bold uppercase tracking-wider">
                <th className="w-12 px-4 py-4 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-[#1dbf73] border-[#dadbdd] rounded cursor-pointer"
                    checked={filteredArticles.length > 0 && selectedIds.length === filteredArticles.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-right">المنشور</th>
                <th className="px-4 py-4 text-center">
                   <div className="flex items-center justify-center gap-1.5">
                      <TrendingUp size={12} /> المشاهدات
                   </div>
                </th>
                <th className="px-4 py-4 text-center">
                   <div className="flex items-center justify-center gap-1.5">
                      <MousePointer2 size={12} /> النقرات
                   </div>
                </th>
                <th className="px-4 py-4 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e5e7]">
              {loading ? (
                <tr>
                   <td colSpan="5" className="py-24 text-center text-[#95979d] font-bold">جاري تحميل البيانات...</td>
                </tr>
              ) : filteredArticles.length > 0 ? filteredArticles.map((art) => (
                <tr key={art._id} className={`hover:bg-[#fbfbfb] transition-colors group ${selectedIds.includes(art._id) ? 'bg-[#f1fcf7]' : ''}`}>
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-[#1dbf73] border-[#dadbdd] rounded cursor-pointer"
                      checked={selectedIds.includes(art._id)}
                      onChange={() => toggleSelect(art._id)}
                    />
                  </td>
                  <td className="px-4 py-4 min-w-[300px]">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-10 rounded bg-[#f5f5f5] overflow-hidden flex-shrink-0 border border-[#eee]">
                        {getThumbnail(art) ? (
                          <img src={getThumbnail(art)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-[#ccc]">بلا صورة</div>
                        )}
                      </div>
                      <span className="text-[14px] font-semibold text-[#404145] leading-snug line-clamp-2 hover:text-[#1dbf73] transition-colors cursor-pointer" onClick={() => navigate(`/article/${art._id}`)}>
                        {art.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[13px] font-bold min-w-[40px] inline-block">
                        {art.views || 0}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[13px] font-bold min-w-[40px] inline-block">
                        {art.clicks || 0}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="relative inline-block group/actions">
                        <button className="p-1 border border-[#dadbdd] rounded text-[#b5b6ba] hover:text-[#74767e] hover:bg-gray-50 transition-all">
                            <ChevronDown size={18} />
                        </button>
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-[#dadbdd] rounded shadow-xl opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-20 py-2">
                            <button 
                                onClick={() => navigate(`/admin/edit-article/${art._id}`)}
                                className="w-full text-right px-4 py-2 text-[13px] font-semibold text-[#404145] hover:bg-[#f7f7f7] flex items-center gap-3"
                            >
                                <Edit2 size={14} className="text-[#95979d]" /> تعديل المنشور
                            </button>
                            {art.status !== 'active' && (
                                <button 
                                    onClick={() => handleStatusUpdate(art._id, 'active')}
                                    className="w-full text-right px-4 py-2 text-[13px] font-semibold text-[#1dbf73] hover:bg-[#f7f7f7] flex items-center gap-3"
                                >
                                    <Play size={14} /> تفعيل المنشور
                                </button>
                            )}
                            {art.status === 'active' && (
                                <button 
                                    onClick={() => handleStatusUpdate(art._id, 'paused')}
                                    className="w-full text-right px-4 py-2 text-[13px] font-semibold text-amber-600 hover:bg-[#f7f7f7] flex items-center gap-3"
                                >
                                    <Pause size={14} /> إيقاف مؤقت
                                </button>
                            )}
                            {art.status !== 'draft' && (
                                <button 
                                    onClick={() => handleStatusUpdate(art._id, 'draft')}
                                    className="w-full text-right px-4 py-2 text-[13px] font-semibold text-[#74767e] hover:bg-[#f7f7f7] flex items-center gap-3"
                                >
                                    <FileEdit size={14} /> نقل للمسودة
                                </button>
                            )}
                            <button 
                                onClick={() => navigate(`/article/${art._id}`)}
                                className="w-full text-right px-4 py-2 text-[13px] font-semibold text-[#404145] hover:bg-[#f7f7f7] flex items-center gap-3"
                            >
                                <Eye size={14} className="text-[#95979d]" /> معاينة المنشور
                            </button>
                            <div className="border-t border-[#e4e5e7] my-2" />
                            <button 
                                onClick={() => handleDelete(art._id, art.title)}
                                className="w-full text-right px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3"
                            >
                                <Trash2 size={14} /> حذف نهائي
                            </button>
                        </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-5">
                       <div className="w-24 h-24 bg-[#f7f7f7] rounded-full flex items-center justify-center text-[#e4e5e7]">
                          <Search size={48} />
                       </div>
                       <div className="space-y-1">
                         <p className="text-[#404145] font-bold text-xl">لا توجد أي نتائج</p>
                         <p className="text-[#95979d] text-sm font-medium">حاول تغيير الكلمات المفتاحية أو التبديل بين التبويبات</p>
                       </div>
                       <button 
                         onClick={() => navigate('/admin/create-article')}
                         className="bg-[#1dbf73] text-white px-8 py-2.5 rounded font-bold text-sm hover:bg-[#19a463] transition-all shadow-sm"
                       >
                         ابدأ بإنشاء أول منشور
                       </button>
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
