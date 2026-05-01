import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { 
  ArrowRight, BookOpen, Clock, Tag, ChevronLeft, Image as ImageIcon, 
  X, Maximize2, PlayCircle, Info, ChevronDown
} from 'lucide-react';
import SEO from '../components/common/SEO';


const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchArticle = async () => {
      const data = await articleService.getById(id);
      setArticle(data);
      setLoading(false);
      if (data) {
        articleService.trackView(id);
      }
    };
    fetchArticle();
  }, [id]);

  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
        return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
        return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  const renderBlock = (block, bIndex) => {
    if (!block) return null;
    
    switch (block.type) {
      case 'video':
        return (
          <div key={bIndex} className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                  <PlayCircle className="text-red-600 shrink-0" size={24} />
                  <h3 className="text-lg md:text-xl font-black text-slate-800">شرح فيديو توضيحي</h3>
              </div>
              <div className="aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden border-4 border-slate-50 shadow-xl bg-black">
                  <iframe 
                      src={getEmbedUrl(block.videoUrl)} 
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Video Tutorial"
                  />
              </div>
          </div>
        );
      case 'extra':
        return (
          <div key={bIndex} className="space-y-4">
              <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-50 rounded-lg shrink-0"><Info className="text-blue-600" size={18} /></div>
                  <h3 className="text-base md:text-lg font-black text-black">{block.title}</h3>
              </div>
              <div className="bg-slate-50/50 p-5 md:p-8 rounded-2xl border border-slate-100">
                  <p className="text-slate-600 text-sm md:text-base leading-[2.2] break-all whitespace-pre-wrap font-medium">
                      {block.content}
                  </p>
              </div>
          </div>
        );
      case 'steps':
        return (
          <div key={bIndex} className="space-y-10 md:space-y-16">
              {block.steps.map((step, sIndex) => (
                  <div key={sIndex} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start overflow-hidden">
                      {/* Image Container */}
                      <div 
                          className="w-full md:w-[280px] lg:w-[400px] h-[200px] sm:h-[250px] md:h-[220px] lg:h-[300px] rounded-2xl md:rounded-3xl border-4 border-white bg-slate-50 relative overflow-hidden group/img cursor-zoom-in shrink-0 shadow-lg"
                          onClick={() => step.image && setSelectedImage(step.image)}
                      >
                          {step.image ? (
                              <>
                                  <img src={step.image} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="Step" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                      <div className="bg-white p-3 rounded-full shadow-2xl transform scale-50 group-hover/img:scale-100 transition-transform duration-500">
                                          <Maximize2 size={20} className="text-black" />
                                      </div>
                                  </div>
                              </>
                          ) : (
                              <div className="flex flex-col items-center justify-center h-full opacity-20">
                                  <ImageIcon size={48} />
                                  <span className="text-[10px] font-black mt-3 uppercase tracking-widest">No Visual Guide</span>
                              </div>
                          )}
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 min-w-0 space-y-4 md:space-y-6 w-full">
                          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 md:pb-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-black text-white flex items-center justify-center font-black text-sm md:text-lg shrink-0 shadow-md">
                                  {sIndex + 1}
                              </div>
                              <h3 className="font-black text-black text-lg md:text-2xl break-all leading-tight">
                                  {step.title || `المرحلة ${sIndex + 1}`}
                              </h3>
                          </div>
                          <div className="bg-slate-50/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-50 overflow-hidden">
                              <p className="text-slate-600 text-sm md:text-base leading-[2.2] break-all whitespace-pre-wrap font-medium">
                                  {step.text}
                              </p>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Grouping Logic
  const sections = [];
  let currentAccordion = null;

  article?.blocks?.forEach((block, index) => {
    if (block.type === 'title') {
      currentAccordion = {
        id: `section-${index}`,
        title: block.title,
        blocks: [],
        groupType: 'accordion'
      };
      sections.push(currentAccordion);
    } else if (block.type === 'video') {
      sections.push({ ...block, groupType: 'standalone' });
      currentAccordion = null;
    } else {
      if (currentAccordion) {
        currentAccordion.blocks.push(block);
      } else {
        sections.push({ ...block, groupType: 'standalone' });
      }
    }
  });

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
    </div>
  );

  if (!article) return <div className="text-center py-20 font-black">المقال غير موجود</div>;

  return (
    <div className="max-w-5xl mx-auto font-arabic px-3 sm:px-6 md:px-0 pb-20" dir="rtl">
      {article && (
        <SEO 
          title={article.title} 
          description={article.content?.replace(/<[^>]*>?/gm, '').substring(0, 160)} 
          image={article.blocks?.find(b => b.type === 'steps')?.steps[0]?.image}
          url={window.location.href}
        />
      )}
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
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 text-slate-400 gap-4">
        <div className="flex items-center gap-2">
           <span className="text-[10px] md:text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">
             {article.mainCategory === 'women' ? 'حريمي' : article.mainCategory === 'men' ? 'رجالي' : 'أطفال'}
           </span>
           <ChevronLeft size={14} className="rotate-180" />
           <span className="text-[10px] md:text-xs font-bold text-black">{article.category}</span>
        </div>
        <Link to={`/program/${article.program}/${article.mainCategory}`} className="text-[10px] md:text-xs hover:text-black flex items-center gap-1 transition-colors font-bold">
           <ArrowRight size={14} className="rotate-180" /> العودة للأقسام
        </Link>
      </div>

      {/* Header Info */}
      <div className="text-right mb-10 px-2">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-black mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-slate-400 font-black text-[10px] md:text-xs">
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
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Article Introduction Section */}
        <div className="p-5 md:p-12 bg-slate-50/30 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-black shrink-0" size={24} />
            <h2 className="text-lg md:text-xl font-black text-black">مقدمة الدرس</h2>
          </div>
          <div 
            className="prose prose-slate max-w-none text-right font-medium leading-[2.2] text-slate-700 break-words text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        </div>

        {/* Dynamic Blocks Container with Accordion Support */}
        <div className="p-3 md:p-8 space-y-4">
           {sections.map((section, idx) => {
              if (section.groupType === 'accordion') {
                const isOpen = openSections[section.id];
                return (
                  <div key={idx} className="group">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className="w-full !flex flex-row items-center !justify-between px-4 py-3 md:px-10 md:py-5 hover:bg-slate-50 transition-all border border-slate-100 rounded-xl md:rounded-2xl bg-white shadow-sm"
                    >
                        <h2 className="text-base md:text-xl font-black text-black border-r-4 md:border-r-8 border-black pr-3 md:pr-4 leading-none text-right">
                            {section.title}
                        </h2>
                        <div className={`p-1.5 rounded-full bg-slate-100 text-slate-400 transition-all ${isOpen ? 'rotate-180 bg-black text-white' : ''}`}>
                            <ChevronDown size={18} className="md:w-5 md:h-5" />
                        </div>
                    </button>
                    {isOpen && (
                      <div className="mt-2 p-4 md:p-10 space-y-10 md:space-y-12 bg-white border border-slate-100 rounded-xl md:rounded-2xl animate-in slide-in-from-top-2 duration-300 overflow-hidden">
                         {section.blocks.map((block, bIdx) => renderBlock(block, bIdx))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="p-4 md:p-8 border border-slate-100 rounded-xl md:rounded-2xl bg-white shadow-sm">
                     {renderBlock(section, idx)}
                  </div>
                );
              }
           })}
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">End of Tutorial - KSI Digital Pattern</p>
      </div>
    </div>
  );
};

export default Article;
