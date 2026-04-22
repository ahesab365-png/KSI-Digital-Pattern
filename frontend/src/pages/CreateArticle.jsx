import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Image as ImageIcon, Plus, Trash2, Eye, EyeOff, Settings, History, CheckCircle2, ChevronDown, ChevronUp, Layers, Type, X, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const DRAFT_KEY = 'article_creation_draft';

const SaveStatus = ({ time, isAuto }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
    <div className={`w-1.5 h-1.5 rounded-full ${time ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></div>
    <span className="text-slate-500 text-[10px] font-black">
      {time ? (isAuto ? `تلقائي: ${time}` : `حُفظ: ${time}`) : 'جاري المزامنة...'}
    </span>
  </div>
);

const CreateArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // States
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [program, setProgram] = useState('1');
  const [mainCategory, setMainCategory] = useState('women');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [steps, setSteps] = useState([{ id: Date.now(), title: '', text: '', image: null }]);
  const [lastSaved, setLastSaved] = useState(null);
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const mainCategories = [
    { id: 'women', title: 'حريمي' },
    { id: 'men', title: 'رجالي' },
    { id: 'kids', title: 'أطفال' },
  ];

  // Load Initial Data (Draft or DB)
  useEffect(() => {
    const fetchArticle = async () => {
      if (isEditMode) {
        const art = await articleService.getById(id);
        if (art) {
          setTitle(art.title);
          setContent(art.content);
          setProgram(art.program);
          setMainCategory(art.mainCategory);
          setCategory(art.category);
          setIsPublic(art.isPublic);
          setSteps(art.steps);
        }
      } else {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          MySwal.fire({
            title: <span className="font-arabic text-lg">استرجاع مسودة؟</span>,
            text: "لديك نسخة غير منشورة محفوظة تلقائياً، هل تود استعادتها؟",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'نعم، استعدها',
            cancelButtonText: 'ابدأ من جديد',
            confirmButtonColor: '#2563eb'
          }).then((result) => {
            if (result.isConfirmed) {
                const data = JSON.parse(savedDraft);
                setTitle(data.title || '');
                setContent(data.content || '');
                setProgram(data.program || '1');
                setMainCategory(data.mainCategory || 'women');
                setCategory(data.category || '');
                setIsPublic(data.isPublic !== undefined ? data.isPublic : true);
                if (data.steps) setSteps(data.steps);
            } else {
                localStorage.removeItem(DRAFT_KEY);
            }
          });
        }
      }
    };
    fetchArticle();
  }, [id, isEditMode]);

  // Auto-Save Logic (Local Storage)
  useEffect(() => {
    if (isEditMode) return; // Don't auto-overwrite DB in edit mode without user action
    if (!title && !content) return;

    const timer = setTimeout(() => {
      const draftData = { title, content, program, mainCategory, category, isPublic, steps };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      setIsAutoSaved(true);
      setLastSaved(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, content, program, mainCategory, category, isPublic, steps, isEditMode]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  const validateForm = (checkAll = true) => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'يرجى كتابة عنوان للمقال';
    
    if (checkAll) {
        if (!content.trim() || content === '<p><br></p>') newErrors.content = 'يرجى كتابة مقدمة للمقال';
        if (!category.trim()) newErrors.category = 'يرجى كتابة نوع القطعة';
        
        const stepsErrors = [];
        steps.forEach((step, index) => {
          const stepError = {};
          if (!step.title.trim()) stepError.title = true;
          if (!step.text.trim()) stepError.text = true;
          if (!step.image) stepError.image = true;
          if (Object.keys(stepError).length > 0) stepsErrors[index] = stepError;
        });
        if (stepsErrors.length > 0) newErrors.steps = stepsErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processSave = async (forceDraft = false) => {
    const isActuallyPublishing = !forceDraft;
    
    if (!validateForm(isActuallyPublishing)) {
        return MySwal.fire({
            title: <span className="font-arabic text-lg text-red-600">بيانات ناقصة!</span>,
            text: isActuallyPublishing ? "عذراً، يجب إكمال كافة البيانات قبل النشر." : "يرجى كتابة عنوان المقال على الأقل لحفظه كمسودة.",
            icon: 'error',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#ef4444'
        });
    }

    const finalIsPublic = forceDraft ? false : isPublic;

    MySwal.fire({
        title: <span className="font-arabic">{forceDraft ? 'حفظ كمسودة؟' : 'تأكيد النشر؟'}</span>,
        text: forceDraft ? "سيتم حفظ المقال في لوحة التحكم كمسودة (لن يظهر للجمهور)." : "سيتم نشر المقال فوراً على الموقع.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: forceDraft ? '#94a3b8' : '#2563eb',
        confirmButtonText: forceDraft ? 'حفظ كمسودة الآن' : 'نعم، انشر الآن',
        cancelButtonText: 'إلغاء',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
              if (isEditMode) {
                  await articleService.update(id, { title, content, program, mainCategory, category, isPublic: finalIsPublic, steps });
              } else {
                  await articleService.save({ title, content, program, mainCategory, category, isPublic: finalIsPublic, steps });
                  localStorage.removeItem(DRAFT_KEY);
              }
              
              MySwal.fire({
                  title: forceDraft ? 'تم الحفظ!' : 'تم النشر!',
                  text: forceDraft ? 'تم حفظ المقال كمسودة بنجاح.' : 'مقالك متاح الآن للجميع.',
                  icon: 'success',
                  confirmButtonColor: '#10b981'
              }).then(() => navigate('/admin'));
            } catch (error) {
              MySwal.fire({ title: 'خطأ!', text: error.message || 'حدث خطأ في الاتصال بالسيرفر.', icon: 'error' });
            }
        }
    });
  };

  const handleStepTitleChange = (id, val) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, title: val } : s));
  };
  const handleStepTextChange = (id, val) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, text: val } : s));
  };
  const handleImageChange = async (id, file) => {
    if (!file) return;
    
    // Set loading state for this step
    setSteps(prev => prev.map(s => s.id === id ? { ...s, isUploading: true } : s));

    try {
      const imageUrl = await articleService.uploadImage(file);
      setSteps(prev => prev.map(s => s.id === id ? { ...s, image: imageUrl, isUploading: false } : s));
    } catch (error) {
      setSteps(prev => prev.map(s => s.id === id ? { ...s, isUploading: false } : s));
      MySwal.fire({
          title: 'خطأ في الرفع',
          text: 'لم نتمكن من رفع الصورة، يرجى المحاولة مرة أخرى.',
          icon: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-arabic flex flex-col">
      
      {/* HEADER SECTION */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/admin')} className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
              <X size={20} />
           </button>
           <div className="flex flex-col">
             <h1 className="font-black text-sm text-slate-900">
               {isEditMode ? 'تعديل الدرس' : 'إنشاء درس جديد'}
             </h1>
             <SaveStatus time={lastSaved} isAuto={isAutoSaved} />
           </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Draft Button */}
          <button 
            onClick={() => processSave(true)} 
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl text-[11px] font-black transition-all flex items-center gap-2"
          >
            <FileText size={16} className="text-slate-400" /> حفظ كمسودة
          </button>
          
          {/* Publish Button */}
          <button 
            onClick={() => processSave(false)} 
            className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl text-[11px] font-black shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
          >
            <Save size={16} /> {isEditMode ? 'حفظ التعديلات' : 'نشر الدرس الآن'}
          </button>
        </div>
      </header>

      {/* BODY SECTION */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 md:p-10 gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* RIGHT SIDE (Settings) */}
        <aside className="w-full lg:w-[320px] order-2 lg:order-1">
           <div className="sticky top-28 space-y-6">
             <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
                <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-5">
                   <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Settings size={18} /></div>
                   <span className="font-black text-xs">إعدادات النشر</span>
                </div>

                <div className="space-y-8">
                   <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 block text-right px-2">فئة المتدربين</label>
                     <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                        {mainCategories.map(cat => (
                          <button key={cat.id} onClick={() => setMainCategory(cat.id)} className={`py-2.5 rounded-xl text-[10px] font-black transition-all ${mainCategory === cat.id ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
                            {cat.title}
                          </button>
                        ))}
                     </div>
                   </div>

                   <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 block text-right px-2">نوع القطعة</label>
                     <input 
                       type="text" 
                       className={`w-full bg-slate-50 border rounded-2xl py-3.5 px-5 text-xs font-bold outline-none transition-all text-right shadow-inner ${errors.category ? 'border-red-300' : 'border-slate-200 focus:border-blue-400'}`}
                       value={category}
                       onChange={(e) => setCategory(e.target.value)}
                       dir="rtl"
                       placeholder="مثلاً: قميص، فستان..."
                     />
                   </div>

                   <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 block text-right px-2">برنامج التصميم</label>
                     <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setProgram('1')} className={`py-3.5 rounded-2xl text-[11px] font-black border transition-all ${program === '1' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            Gerber
                          </button>
                          <button onClick={() => setProgram('2')} className={`py-3.5 rounded-2xl text-[11px] font-black border transition-all ${program === '2' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            Gemini
                          </button>
                     </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-slate-50">
                     <label className="text-[11px] font-black text-slate-400 block text-right px-2">خصوصية الدرس</label>
                     <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => setIsPublic(true)} 
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isPublic ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          <div className={`p-1.5 rounded-lg ${isPublic ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}><Eye size={14} /></div>
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] font-black">عام (Public)</span>
                            <span className="text-[9px] opacity-70">يظهر للجميع على الموقع</span>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => setIsPublic(false)} 
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${!isPublic ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          <div className={`p-1.5 rounded-lg ${!isPublic ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}><EyeOff size={14} /></div>
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] font-black">خاص (Private)</span>
                            <span className="text-[9px] opacity-70">يظهر لك فقط في لوحة التحكم</span>
                          </div>
                        </button>
                     </div>
                   </div>
                </div>
             </div>
           </div>
        </aside>

        {/* LEFT SIDE (Editor) */}
        <main className="flex-1 space-y-10 order-1 lg:order-2">
           <section className={`bg-white rounded-[3.5rem] p-8 md:p-14 shadow-2xl shadow-slate-200/50 border relative overflow-hidden transition-all ${errors.title ? 'border-red-200' : 'border-slate-100'}`}>
              <div className="space-y-10">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-blue-600 flex items-center justify-end gap-3 uppercase mr-4">
                       عنوان المقال الرئيسي <Type size={14} className="text-blue-200" />
                    </label>
                    <input 
                       type="text" 
                       placeholder="تعلم كيفية تصميم باترون..."
                       className="w-full text-2xl md:text-4xl font-black text-slate-900 border-b-[3px] border-slate-50 pb-8 outline-none placeholder-slate-200 focus:border-blue-600 transition-all text-right bg-transparent"
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       dir="rtl"
                    />
                 </div>
                 <div className="quill-transparent text-right" dir="rtl">
                   <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} placeholder="مقدمة الدرس..." />
                 </div>
              </div>
           </section>

           {/* Steps Management */}
           <div className="space-y-8">
              {steps.map((step, index) => (
                <article key={step.id} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative group">
                   <div className="absolute -right-4 top-12 w-10 h-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-sm border-4 border-white shadow-2xl transform -rotate-12">
                     {index + 1}
                   </div>
                   <div className="space-y-10">
                      <input 
                        type="text"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pr-14 pl-6 text-[13px] font-black text-slate-800 text-right outline-none focus:border-blue-400 transition-all"
                        placeholder="اسم المرحلة"
                        value={step.title}
                        onChange={(e) => handleStepTitleChange(step.id, e.target.value)}
                        dir="rtl"
                      />
                      <div className="grid lg:grid-cols-12 gap-8">
                         <div className="lg:col-span-8">
                            <textarea 
                              className="w-full h-full bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 text-sm text-slate-600 leading-relaxed outline-none focus:border-blue-300 transition-all resize-none text-right min-h-[220px]"
                              placeholder="اشرح هذه الخطوة..."
                              value={step.text}
                              onChange={(e) => handleStepTextChange(step.id, e.target.value)}
                              dir="rtl"
                            ></textarea>
                         </div>
                         <div className="lg:col-span-4">
                            <input type="file" id={`f-${step.id}`} className="hidden" accept="image/*" onChange={(e) => handleImageChange(step.id, e.target.files[0])} />
                            <label htmlFor={`f-${step.id}`} className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-all">
                                {step.isUploading ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <Loader2 size={32} className="text-blue-500 animate-spin" />
                                    <span className="text-[10px] font-black text-blue-400">جاري الرفع...</span>
                                  </div>
                                ) : step.image ? (
                                  <img src={step.image} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon size={32} className="text-slate-200" />
                                )}
                            </label>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => setSteps(steps.filter(s => s.id !== step.id))} className="absolute left-6 top-6 p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={18} /></button>
                </article>
              ))}
              <button onClick={() => setSteps([...steps, { id: Date.now(), title: '', text: '', image: null }])} className="w-full py-8 border-3 border-dashed border-slate-200 rounded-[3.5rem] text-slate-400 font-black hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-3 text-sm bg-white/30">
                 <Plus size={24} /> إضافة مرحلة جديدة
              </button>
           </div>
        </main>
      </div>
    </div>
  );
};

export default CreateArticle;
