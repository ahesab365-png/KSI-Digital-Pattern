import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { ArrowRight, BookOpen, Clock, Tag, ChevronLeft, Image as ImageIcon, X, Maximize2 } from 'lucide-react';

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const data = await articleService.getById(id);
      setArticle(data);
      setLoading(false);
      // Track view
      if (data) {
        articleService.trackView(id);
      }
    };
    fetchArticle();
  }, [id]);


  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
    </div>
  );

  if (!article) return <div className="text-center py-20 font-black">المقال غير موجود</div>;

  return (
    <div className="max-w-5xl mx-auto font-arabic px-4 md:px-0 pb-20">
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform">
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" 
            alt="Preview" 
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mb-8 text-slate-400">
        <div className="flex items-center gap-2">
           <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">
             {article.mainCategory === 'women' ? 'حريمي' : article.mainCategory === 'men' ? 'رجالي' : 'أطفال'}
           </span>
           <ChevronLeft size={14} />
           <span className="text-xs font-bold text-black">{article.category}</span>
        </div>
        <Link to={`/program/${article.program}/${article.mainCategory}`} className="text-xs hover:text-black flex items-center gap-1 transition-colors font-bold">
          العودة للأقسام <ArrowRight size={14} />
        </Link>
      </div>

      {/* Header Info */}
      <div className="text-right mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap justify-end gap-4 text-slate-400 font-black text-[10px] md:text-xs">
           <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
             <Clock size={14} className="text-black" />
             <span>نُشر في {new Date(article.createdAt).toLocaleDateString('ar-EG')}</span>
           </div>
           <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
             <Tag size={14} className="text-black" />
             <span>{article.program === '1' ? 'Gerber CAD' : 'Gemini CAD'}</span>
           </div>
        </div>
      </div>

      {/* Unified Article Content Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl">
        
        {/* Article Introduction Section */}
        <div className="p-6 md:p-12 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center justify-end gap-3 mb-6">
            <h2 className="text-xl font-black text-black">مقدمة الدرس</h2>
            <BookOpen className="text-black" size={24} />
          </div>
          <div 
            className="prose prose-slate max-w-none text-right font-medium leading-[2] text-slate-700 break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        </div>

        {/* Steps Section - Directly integrated */}
        <div className="p-6 md:p-12 space-y-16 bg-white">
           <div className="flex items-center justify-end gap-3 mb-10 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-black">خطوات التنفيذ</h2>
           </div>

           {article.steps && article.steps.map((step, index) => (
             <div key={index} className={`relative group ${index !== article.steps.length - 1 ? 'border-b border-slate-100 pb-16 mb-16' : ''}`}>
                {/* Step Marker */}
                <div className="hidden lg:flex absolute -right-10 top-0 w-10 h-10 rounded-xl bg-black text-white items-center justify-center font-black text-sm shadow-lg border border-slate-100">
                  {index + 1}
                </div>

                <div className="flex flex-col md:flex-row gap-8 text-right">
                   {/* Step Text Side */}
                  <div className="flex-1 space-y-4">
                     <div className="flex items-center justify-end gap-4 border-b border-slate-100 pb-3">
                        <h3 className="font-black text-black text-lg md:text-xl text-right w-full">{step.title || `المرحلة ${index + 1}`}</h3>
                        <div className="lg:hidden w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-sm shrink-0">
                          {index + 1}
                        </div>
                     </div>
                      <p className="text-slate-600 text-sm md:text-base leading-[2] whitespace-pre-wrap break-all overflow-hidden">
                        {step.text}
                     </p>
                  </div>

                  {/* Step Image Side */}
                  <div 
                    className="w-full md:w-[320px] h-[200px] sm:h-[240px] rounded-3xl border border-slate-200 bg-slate-50 relative overflow-hidden group/img cursor-zoom-in"
                    onClick={() => step.image && setSelectedImage(step.image)}
                  >
                    {step.image ? (
                      <>
                        <img src={step.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" alt="Step" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                           <div className="bg-white/90 p-3 rounded-full shadow-lg">
                              <Maximize2 size={20} className="text-black" />
                           </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full opacity-20">
                         <ImageIcon size={48} />
                         <span className="text-[10px] font-black mt-2 uppercase">No Image Available</span>
                      </div>
                    )}
                  </div>
                </div>
             </div>
           ))}
        </div>

        {/* Custom Extra Sections Display */}
        {article.extraSections && article.extraSections.length > 0 && (
          <div className="p-6 md:p-12 space-y-12 bg-slate-50/50 border-t border-slate-100">
            {article.extraSections.map((section, index) => (
              <div key={index} className="text-right space-y-4">
                 <div className="flex items-center justify-end gap-3 border-b border-slate-100 pb-2">
                    <h3 className="text-xl font-black text-black">{section.title}</h3>
                    <div className="w-2 h-6 bg-black rounded-full"></div>
                 </div>
                 <p className="text-slate-600 text-sm md:text-base leading-[2] whitespace-pre-wrap font-medium">
                    {section.content}
                 </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">End of Tutorial - KSI Digital Pattern</p>
      </div>
    </div>
  );
};

export default Article;
