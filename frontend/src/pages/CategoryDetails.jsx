import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shirt, Scissors, Layers, ArrowRight, BookOpen } from 'lucide-react';
import { articleService } from '../services/articleService';

const CategoryDetails = () => {
  const { id, category } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      setLoading(true);
      const dynamicSubs = await articleService.getSubCategories(id, category);
      setSubCategories(dynamicSubs);
      setLoading(false);
    };
    fetchSubs();
  }, [id, category]);

  const categoryNames = {
    women: 'حريمي',
    men: 'رجالي',
    kids: 'أطفال'
  };

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('تيشيرت')) return <Shirt size={28} className="text-pink-500" />;
    if (n.includes('بنطلون')) return <Scissors size={28} className="text-orange-500" />;
    if (n.includes('قميص')) return <Layers size={28} className="text-blue-500" />;
    return <BookOpen size={28} className="text-emerald-500" />;
  };

  return (
    <div className="max-w-6xl mx-auto font-arabic px-4 md:px-0">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-end gap-2 mb-8 text-slate-400">
        <span className="text-xs text-slate-300">{categoryNames[category]}</span>
        <ArrowRight size={14} />
        <Link to={`/program/${id}`} className="text-xs hover:text-blue-600 transition-colors">
          برنامج {id === '1' ? 'Gerber' : 'Gemini'}
        </Link>
        <ArrowRight size={14} />
        <Link to="/" className="text-xs hover:text-blue-600 transition-colors">الرئيسية</Link>
      </div>

      {/* Header */}
      <div className="text-right mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-3 tracking-tight">
          تصاميم {categoryNames[category]}
        </h1>
        <p className="text-slate-400 text-sm md:text-lg">استكشف الشروحات التفصيلية لكل قطعة ملابس</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
           <span className="text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">Loading Tutorials...</span>
        </div>
      ) : subCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {subCategories.map((sub) => (
            <Link 
              to={`/article/${sub.articleId}`}
              key={sub.articleId}
              onClick={() => articleService.trackClick(sub.articleId)}
              className="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all flex flex-col items-center gap-6 group hover:shadow-xl hover:-translate-y-2"
            >

              <div className="p-5 rounded-3xl bg-slate-50 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-500">
                {getIcon(sub.name)}
              </div>
              <div className="text-center">
                <span className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors block mb-1">
                  {sub.name}
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                   فتح الشرح
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/50 rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-slate-300" size={32} />
           </div>
           <h3 className="text-lg font-black text-slate-400">لا توجد شروحات متاحة حالياً في هذا القسم</h3>
           <p className="text-slate-300 text-xs mt-2 max-w-xs mx-auto leading-relaxed px-6">
             يرجى مراجعة لوحة التحكم لإضافة محتوى جديد.
           </p>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
