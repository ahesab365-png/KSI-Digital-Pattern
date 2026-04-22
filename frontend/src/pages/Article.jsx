import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Tag, ImageIcon } from 'lucide-react';
import { articleService } from '../services/articleService';

const StepCard = ({ step, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = step.text || "لا يوجد وصف لهذه الخطوة.";
  const isLongText = text.length > 350; 

  return (
    <div className="bg-white rounded-[2rem] border-2 border-black shadow-sm overflow-hidden relative group">
       {/* Mobile Step Badge */}
       <div className="absolute right-4 top-4 w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shadow-lg md:hidden z-10 border-2 border-white">
         {index + 1}
       </div>

       <div className="p-5 md:p-10 flex flex-col md:flex-row gap-6 md:gap-14 text-right">
          <div className="flex-1 order-2 md:order-1 relative pt-10 md:pt-0">
            <div className="hidden md:flex items-center gap-4 mb-6 border-b-2 border-black pb-4">
               <span className="w-10 h-10 rounded-xl bg-black shrink-0 text-white flex items-center justify-center font-black text-sm shadow-md">{index + 1}</span>
               <h4 className="font-black text-black text-xl">{step.title || `الخطوة رقم ${index + 1}`}</h4>
            </div>
            {/* Mobile Title */}
            <h4 className="md:hidden font-black text-black text-lg mb-4 pr-12 border-b-2 border-black pb-2">{step.title || `الخطوة رقم ${index + 1}`}</h4>

            <div className={`relative ${!isExpanded && isLongText ? 'max-h-[240px] overflow-hidden' : ''}`}>
                <p className="text-slate-700 text-base md:text-lg leading-[1.8] md:pr-14 break-words whitespace-pre-wrap">
                  {text}
                </p>
                {!isExpanded && isLongText && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2">
                     <button 
                       onClick={() => setIsExpanded(true)}
                       className="text-white text-xs font-black bg-black px-8 py-2.5 rounded-full shadow-lg border-2 border-white"
                     >
                       اقرأ المزيد
                     </button>
                  </div>
                )}
            </div>
            {isExpanded && isLongText && (
               <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-black text-xs font-black hover:underline mt-6 md:pr-14 transition-colors"
               >
                 طي التفاصيل
               </button>
            )}
          </div>
          
          <div className="w-full md:w-[350px] bg-slate-50 rounded-[2rem] flex items-center justify-center order-1 md:order-2 overflow-hidden border-2 border-black min-h-[220px] shadow-inner">
             {step.image ? (
               <img src={step.image} alt={`Step ${index + 1}`} className="w-full h-full object-contain p-2" />
             ) : (
               <div className="flex flex-col items-center py-12">
                 <ImageIcon size={40} className="text-slate-200 mb-2" />
                 <span className="text-[10px] font-black text-slate-300">بدون صورة توضيحية</span>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

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
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4 break-all">
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
            className="ql-editor text-slate-600 text-sm leading-relaxed mb-10 overflow-hidden quill-content !p-0 !min-h-0 break-all whitespace-pre-wrap w-full"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Steps Grid */}
        <div className="space-y-8">
          <h3 className="text-lg font-bold text-slate-800 border-r-4 border-blue-600 pr-3">خطوات العمل التنفيذية</h3>
          
          {article.steps && article.steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
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
