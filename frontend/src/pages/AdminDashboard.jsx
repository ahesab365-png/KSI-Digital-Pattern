import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ChevronDown, Eye, RefreshCw, Pause, Play, FileEdit, TrendingUp, MousePointer2, MoreVertical } from 'lucide-react';
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
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
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
      console.error('Error loading articles:', error);
      Swal.fire('خطأ!', 'فشل جلب البيانات من السيرفر.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ids, newStatus) => {
    const labels = { active: 'تفعيل', draft: 'نقل للمسودات', paused: 'إيقاف مؤقت' };
    const success = await articleService.bulkUpdateStatus(Array.isArray(ids) ? ids : [ids], newStatus);
    if (success) {
      Swal.fire({ title: 'تم!', text: `تم ${labels[newStatus]} المنشورات.`, icon: 'success', timer: 1500, showConfirmButton: false });
      loadArticles();
    } else {
      Swal.fire('خطأ!', 'فشل تحديث الحالة.', 'error');
    }
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف "${title}" نهائياً!`,
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
          Swal.fire('تم الحذف!', '', 'success');
          loadArticles();
        } else {
          Swal.fire('خطأ!', 'فشل حذف المقال.', 'error');
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف ${selectedIds.length} منشورات نهائياً!`,
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
          Swal.fire('تم الحذف!', '', 'success');
          loadArticles();
        } else {
          Swal.fire('خطأ!', 'فشل حذف بعض المنشورات.', 'error');
        }
      }
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredArticles.length ? [] : filteredArticles.map(a => a._id));
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const tabs = [
    { id: 'active', label: 'النشطة', count: articles.filter(a => a.status === 'active').length },
    { id: 'draft', label: 'المسودات', count: articles.filter(a => a.status === 'draft').length },
    { id: 'paused', label: 'المتوقفة', count: articles.filter(a => a.status === 'paused').length },
  ];

  const filteredArticles = articles.filter(art => {
    const matchesSearch = (art.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && art.status === activeTab;
  });

  const getThumbnail = (art) => {
    if (art.steps?.length > 0 && art.steps[0].image) return art.steps[0].image;
    return art.image || null;
  };

  const ArticleMenu = ({ art }) => (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        className="p-2 border border-[#dadbdd] rounded text-[#b5b6ba] hover:text-[#74767e] hover:bg-gray-50 transition-all"
        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === art._id ? null : art._id); }}
      >
        <MoreVertical size={16} />
      </button>
      {openMenuId === art._id && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#dadbdd] rounded-lg shadow-2xl z-50 py-2">
          <button onClick={() => navigate(`/admin/edit-article/${art._id}`)} className="w-full text-right px-4 py-2.5 text-[13px] font-semibold text-[#404145] hover:bg-[#f7f7f7] flex items-center gap-3">
            <Edit2 size={14} className="text-[#95979d]" /> تعديل المنشور
          </button>
          {art.status !== 'active' && (
            <button onClick={() => handleStatusUpdate(art._id, 'active')} className="w-full text-right px-4 py-2.5 text-[13px] font-semibold text-[#1dbf73] hover:bg-[#f7f7f7] flex items-center gap-3">
              <Play size={14} /> تفعيل المنشور
            </button>
          )}
          {art.status === 'active' && (
            <button onClick={() => handleStatusUpdate(art._id, 'paused')} className="w-full text-right px-4 py-2.5 text-[13px] font-semibold text-amber-600 hover:bg-[#f7f7f7] flex items-center gap-3">
              <Pause size={14} /> إيقاف مؤقت
            </button>
          )}
          {art.status !== 'draft' && (
            <button onClick={() => handleStatusUpdate(art._id, 'draft')} className="w-full text-right px-4 py-2.5 text-[13px] font-semibold text-[#74767e] hover:bg-[#f7f7f7] flex items-center gap-3">
              <FileEdit size={14} /> نقل للمسودة
            </button>
          )}
          <button onClick={() => navigate(`/article/${art._id}`)} className="w-full text-right px-4 py-2.5 text-[13px] font-semibold text-[#404145] hover:bg-[#f7f7f7] flex items-center gap-3">
            <Eye size={14} className="text-[#95979d]" /> معاينة المنشور
          </button>
          <div className="border-t border-[#e4e5e7] my-1" />
          <button onClick={() => handleDelete(art._id, art.title)} className="w-full text-right px-4 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3">
            <Trash2 size={14} /> حذف نهائي
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full font-arabic bg-[#f7f7f7] min-h-screen text-[#404145]" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">

        {/* Top Header */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#404145]">إدارة المنشورات</h1>
            <button
              onClick={loadArticles}
              className="p-2 text-[#95979d] hover:text-[#1dbf73] transition-colors rounded-full hover:bg-white border border-transparent hover:border-gray-200"
              title="تحديث"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-bold text-[#404145] hidden xs:block">قبول الطلبات</span>
            <button
              onClick={() => setAcceptingOrders(!acceptingOrders)}
              className={`w-10 h-5 sm:w-11 sm:h-6 rounded-full p-0.5 sm:p-1 transition-colors relative ${acceptingOrders ? 'bg-[#1dbf73]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${acceptingOrders ? '-translate-x-4 sm:-translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-5 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 sm:gap-4 border-b border-gray-200 min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedIds([]); }}
                className={`pb-3 px-2 sm:px-3 text-[12px] sm:text-[13px] font-bold tracking-wide transition-all relative flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-[#404145]' : 'text-[#95979d] hover:text-[#404145]'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === tab.id ? 'bg-[#1dbf73] text-white' : 'bg-[#e4e5e7] text-[#74767e]'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1dbf73] rounded-t" />}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => navigate('/admin/create-article')}
              className="mb-3 bg-[#1dbf73] hover:bg-[#19a463] text-white px-3 sm:px-5 py-2 rounded font-bold text-[12px] sm:text-[13px] transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">إنشاء منشور جديد</span>
              <span className="sm:hidden">جديد</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-[#e4e5e7] shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-3 sm:px-4 py-3 border-b border-[#e4e5e7] flex flex-wrap justify-between items-center gap-3 bg-white">
            <h2 className="text-[11px] font-bold uppercase text-[#404145] tracking-widest">
              {tabs.find(t => t.id === activeTab)?.label}
              {selectedIds.length > 0 && <span className="mr-2 text-[#1dbf73]">({selectedIds.length} محدد)</span>}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {/* Bulk actions — only visible when items selected */}
              {selectedIds.length > 0 && (
                <div className="flex items-center border border-[#dadbdd] rounded-md overflow-hidden text-[11px] font-bold">
                  {activeTab !== 'active' && (
                    <button onClick={() => handleStatusUpdate(selectedIds, 'active')} className="px-3 py-1.5 text-[#1dbf73] hover:bg-gray-50 border-e border-[#dadbdd] flex items-center gap-1">
                      <Play size={11} /> <span className="hidden sm:inline">تفعيل</span>
                    </button>
                  )}
                  {activeTab === 'active' && (
                    <button onClick={() => handleStatusUpdate(selectedIds, 'paused')} className="px-3 py-1.5 text-amber-600 hover:bg-amber-50 border-e border-[#dadbdd] flex items-center gap-1">
                      <Pause size={11} /> <span className="hidden sm:inline">إيقاف</span>
                    </button>
                  )}
                  {activeTab !== 'draft' && (
                    <button onClick={() => handleStatusUpdate(selectedIds, 'draft')} className="px-3 py-1.5 text-[#74767e] hover:bg-gray-50 border-e border-[#dadbdd] flex items-center gap-1">
                      <FileEdit size={11} /> <span className="hidden sm:inline">مسودة</span>
                    </button>
                  )}
                  <button onClick={handleBulkDelete} className="px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-1">
                    <Trash2 size={11} /> <span className="hidden sm:inline">حذف</span>
                  </button>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#b5b6ba]" size={13} />
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="pr-8 pl-3 py-1.5 border border-[#dadbdd] rounded-md text-[13px] outline-none focus:border-[#1dbf73] transition-all w-36 sm:w-52 md:w-64 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── DESKTOP TABLE (md+) ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b border-[#e4e5e7]">
                <tr className="text-[#95979d] text-[11px] font-bold uppercase tracking-wider">
                  <th className="w-10 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#1dbf73] rounded cursor-pointer"
                      checked={filteredArticles.length > 0 && selectedIds.length === filteredArticles.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-right">المنشور</th>
                  <th className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1"><TrendingUp size={11} /> المشاهدات</div>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1"><MousePointer2 size={11} /> النقرات</div>
                  </th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e5e7]">
                {loading ? (
                  <tr><td colSpan="5" className="py-20 text-center text-[#95979d] font-bold">جاري التحميل...</td></tr>
                ) : filteredArticles.length > 0 ? filteredArticles.map((art) => (
                  <tr key={art._id} className={`transition-colors group ${selectedIds.includes(art._id) ? 'bg-[#f1fcf7]' : 'hover:bg-[#fbfbfb]'}`}>
                    <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#1dbf73] rounded cursor-pointer"
                        checked={selectedIds.includes(art._id)}
                        onChange={() => toggleSelect(art._id)}
                      />
                    </td>
                    <td className="px-4 py-3 cursor-pointer" onClick={() => navigate(`/admin/edit-article/${art._id}`)}>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-md bg-[#f5f5f5] overflow-hidden flex-shrink-0 border border-[#eee] group-hover:border-[#1dbf73] transition-colors">
                          {getThumbnail(art)
                            ? <img src={getThumbnail(art)} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-[8px] text-[#ccc]">بلا صورة</div>}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[14px] font-semibold text-[#404145] leading-snug line-clamp-2 group-hover:text-[#1dbf73] transition-colors">{art.title}</span>
                          <span className="text-[11px] text-[#b5b6ba] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 size={9} /> اضغط للتعديل
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[13px] font-bold inline-block min-w-[36px]">{art.views || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[13px] font-bold inline-block min-w-[36px]">{art.clicks || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                      <ArticleMenu art={art} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-[#f7f7f7] rounded-full flex items-center justify-center text-[#e4e5e7]"><Search size={40} /></div>
                        <p className="text-[#404145] font-bold text-lg">لا توجد أي نتائج</p>
                        <p className="text-[#95979d] text-sm">حاول تغيير الكلمات المفتاحية أو التبويب</p>
                        <button onClick={() => navigate('/admin/create-article')} className="bg-[#1dbf73] text-white px-6 py-2 rounded font-bold text-sm hover:bg-[#19a463] transition-all">
                          إنشاء أول منشور
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS (< md) ── */}
          <div className="md:hidden">
            {loading ? (
              <div className="py-20 text-center text-[#95979d] font-bold text-sm">جاري التحميل...</div>
            ) : filteredArticles.length > 0 ? (
              <div className="divide-y divide-[#e4e5e7]">
                {/* Select All for mobile */}
                <div className="px-4 py-2.5 flex items-center gap-3 bg-gray-50">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#1dbf73] rounded cursor-pointer"
                    checked={filteredArticles.length > 0 && selectedIds.length === filteredArticles.length}
                    onChange={toggleSelectAll}
                  />
                  <span className="text-[12px] font-bold text-[#95979d]">تحديد الكل</span>
                </div>
                {filteredArticles.map((art) => (
                  <div key={art._id} className={`px-4 py-4 transition-colors ${selectedIds.includes(art._id) ? 'bg-[#f1fcf7]' : ''}`}>
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className="pt-1" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[#1dbf73] rounded cursor-pointer"
                          checked={selectedIds.includes(art._id)}
                          onChange={() => toggleSelect(art._id)}
                        />
                      </div>

                      {/* Thumbnail */}
                      <div
                        className="w-16 h-12 rounded-lg bg-[#f5f5f5] overflow-hidden flex-shrink-0 border border-[#eee] cursor-pointer"
                        onClick={() => navigate(`/admin/edit-article/${art._id}`)}
                      >
                        {getThumbnail(art)
                          ? <img src={getThumbnail(art)} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[8px] text-[#ccc]">بلا صورة</div>}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[14px] font-bold text-[#404145] line-clamp-2 leading-snug cursor-pointer hover:text-[#1dbf73] transition-colors"
                          onClick={() => navigate(`/admin/edit-article/${art._id}`)}
                        >
                          {art.title}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                            <TrendingUp size={9} /> {art.views || 0}
                          </span>
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                            <MousePointer2 size={9} /> {art.clicks || 0}
                          </span>
                        </div>
                      </div>

                      {/* Menu */}
                      <div onClick={e => e.stopPropagation()}>
                        <ArticleMenu art={art} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center px-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-[#f7f7f7] rounded-full flex items-center justify-center text-[#e4e5e7]"><Search size={32} /></div>
                  <p className="text-[#404145] font-bold">لا توجد أي نتائج</p>
                  <p className="text-[#95979d] text-sm">حاول تغيير الكلمات أو التبويب</p>
                  <button onClick={() => navigate('/admin/create-article')} className="bg-[#1dbf73] text-white px-6 py-2 rounded font-bold text-sm hover:bg-[#19a463] transition-all">
                    إنشاء أول منشور
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
