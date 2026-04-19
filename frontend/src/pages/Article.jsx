import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Tag, ImageIcon } from 'lucide-react';
import { articleService } from '../services/articleService';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const art = await articleService.getById(id);
      if (art) setArticle(art);
    };
    fetchArticle();
  }, [id]);

  if (!article) return <div className="text-center py-20 font-arabic text-slate-400">جاري تحميل الشرح...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6 font-arabic px-6 md:px-8">
      {/* Header */}
      <div className="mb-8 text-right">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors mb-4 text-xs"
        >
          <span className="font-medium">العودة</span>
          <ArrowRight size={14} />
        </button>
        
        <div className="flex items-center gap-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3">
           <Tag size={12} />
           <span>برنامج {article.program === '1' ? 'Gerber' : 'Gemini'} / {article.category}</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-slate-400 text-[11px] border-b border-slate-100 pb-6">
           <div className="flex items-center gap-1.5">
             <BookOpen size={14} />
             <span>8 دقائق قراءة</span>
           </div>
           <div className="flex items-center gap-1.5">
             <Clock size={14} />
             <span>نُشر في: {new Date(article.createdAt).toLocaleDateString('ar-EG')}</span>
           </div>
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-slate max-w-none text-right">
        {/* Intro */}
        <div className="ql-snow">
          <div 
            className="ql-editor text-slate-600 text-sm leading-relaxed mb-10 overflow-visible quill-content !p-0 !min-h-0 break-words"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Steps Grid */}
        <div className="space-y-8">
          <h3 className="text-lg font-bold text-slate-800 border-r-4 border-blue-600 pr-3">خطوات العمل التنفيذية</h3>
          
          {article.steps && article.steps.map((step, index) => (
            <div key={index} className="bg-white rounded-3xl border border-slate-50 shadow-sm overflow-hidden border-b-2 border-b-slate-100">
               <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-3">
                       <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">{index + 1}</span>
                       <h4 className="font-bold text-slate-800 text-sm">{step.title || `الخطوة رقم ${index + 1}`}</h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed pr-11 break-words">
                      {step.text || "لا يوجد وصف لهذه الخطوة."}
                    </p>
                  </div>
                  
                  <div className="w-full md:w-72 h-48 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 order-1 md:order-2 overflow-hidden border">
                     {step.image ? (
                       <img src={step.image} alt={`Step ${index + 1}`} className="w-full h-full object-cover" />
                     ) : (
                       <div className="flex flex-col items-center">
                         <ImageIcon size={24} className="opacity-20 mb-1" />
                         <span className="text-[10px]">لا توجد صورة لهذه الخطوة</span>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </article>
      
      <div className="mt-20 border-t pt-8 text-center text-[10px] text-slate-200 uppercase tracking-widest">
        KSI Digital Pattern Education
      </div>
    </div>
  );
};

export default Article;
