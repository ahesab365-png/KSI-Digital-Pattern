import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Image as ImageIcon, Plus, Trash2, Eye, EyeOff, Settings, Type, X, FileText, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const DRAFT_KEY = 'article_creation_draft';

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
  const [extraSections, setExtraSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const mainCategories = [
    { id: 'women', title: 'حريمي' },
    { id: 'men', title: 'رجالي' },
    { id: 'kids', title: 'أطفال' },
  ];

  // Load Initial Data
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
          setSteps(art.steps || []);
          setExtraSections(art.extraSections || []);
        }
      }
    };
    fetchArticle();
  }, [id, isEditMode]);

  const handleSave = async (publish = true) => {
    // Basic Validation for both Draft and Publish
    if (!title.trim()) {
        return MySwal.fire({ title: 'بيانات ناقصة', text: 'يرجى كتابة عنوان للمقال على الأقل لحفظه', icon: 'warning', confirmButtonText: 'حسناً' });
    }

    // Strict Validation only for Publishing
    if (publish) {
        const isContentEmpty = !content || content === '<p><br></p>' || content.trim() === '';
        if (isContentEmpty) {
            return MySwal.fire({ title: 'بيانات ناقصة', text: 'يرجى كتابة وصف أو مقدمة للدرس قبل النشر', icon: 'warning', confirmButtonText: 'حسناً' });
        }

        if (!category.trim()) {
            return MySwal.fire({ title: 'بيانات ناقصة', text: 'يرجى تحديد نوع القطعة قبل النشر', icon: 'warning', confirmButtonText: 'حسناً' });
        }

        if (steps.length === 0) {
            return MySwal.fire({ title: 'بيانات ناقصة', text: 'يجب إضافة خطوة واحدة على الأقل للدرس قبل النشر', icon: 'warning', confirmButtonText: 'حسناً' });
        }

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (!step.title.trim() || !step.text.trim() || !step.image) {
                return MySwal.fire({ 
                    title: 'بيانات ناقصة في الخطوات', 
                    text: `يرجى إكمال بيانات الخطوة رقم (${i + 1}) قبل النشر.`, 
                    icon: 'warning', 
                    confirmButtonText: 'حسناً' 
                });
            }
        }

        for (let i = 0; i < extraSections.length; i++) {
            const section = extraSections[i];
            if (!section.title.trim() || !section.content.trim()) {
                return MySwal.fire({ 
                    title: 'بيانات ناقصة في الأقسام الإضافية', 
                    text: `يرجى إكمال بيانات القسم الإضافي رقم (${i + 1}) أو حذفه قبل النشر.`, 
                    icon: 'warning', 
                    confirmButtonText: 'حسناً' 
                });
            }
        }
    }

    setIsSaving(true);
    try {
        const articleData = { 
          title, 
          content, 
          program, 
          mainCategory, 
          category, 
          isPublic: publish ? true : false, 
          steps,
          extraSections
        };
        if (isEditMode) {
            await articleService.update(id, articleData);
        } else {
            await articleService.save(articleData);
            localStorage.removeItem(DRAFT_KEY);
        }
        MySwal.fire({ 
            title: publish ? 'تم النشر بنجاح!' : 'تم الحفظ كمسودة!', 
            icon: 'success', 
            timer: 2000, 
            showConfirmButton: false 
        });
        navigate('/admin');
    } catch (error) {
        MySwal.fire({ title: 'خطأ أثناء الحفظ', text: error.message, icon: 'error' });
    } finally {
        setIsSaving(false);
    }
  };

  const addStep = () => setSteps([...steps, { id: Date.now(), title: '', text: '', image: null }]);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const addExtraSection = () => setExtraSections([...extraSections, { title: '', content: '' }]);
  const removeExtraSection = (index) => setExtraSections(extraSections.filter((_, i) => i !== index));
  const updateExtraSection = (index, field, value) => {
    const newSections = [...extraSections];
    newSections[index][field] = value;
    setExtraSections(newSections);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;
    try {
      updateStep(index, 'isUploading', true);
      const url = await articleService.uploadImage(file);
      updateStep(index, 'image', url);
    } catch (error) {
      MySwal.fire({ title: 'خطأ في الرفع', icon: 'error' });
    } finally {
      updateStep(index, 'isUploading', false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-arabic pb-20 md:pb-0">
      {/* Responsive Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-[120] px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-right w-full md:w-auto flex items-center justify-between md:block">
            <button onClick={() => navigate('/admin')} className="md:hidden p-2 text-slate-400"><X /></button>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-slate-800">{isEditMode ? 'تعديل الدرس' : 'إضافة درس جديد'}</h1>
              <p className="text-slate-400 text-[10px] hidden md:block">مسودة ذكية قيد التحرير</p>
            </div>
            <div className="md:hidden"></div> {/* Spacer */}
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => handleSave(false)} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-black transition-all"
            >
              <FileText size={16} /> <span>المسودة</span>
            </button>
            <button 
              onClick={() => handleSave(true)} 
              disabled={isSaving}
              className="flex-[2] md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              <Save size={16} /> <span>{isEditMode ? 'حفظ' : 'نشر'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Editor Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-4 md:p-10 shadow-sm border border-slate-100">
               <div className="space-y-6 text-right">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-black block pr-1">عنوان المقال الرئيسي <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <Type className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={20} />
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded-2xl pr-10 py-4 text-xl md:text-2xl font-black text-slate-800 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 transition-all text-right outline-none"
                        placeholder="اكتب عنوان الدرس هنا..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Introduction Editor */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-black block pr-1">وصف و مقدمة الدرس <span className="text-red-500">*</span></label>
                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                      <ReactQuill 
                        value={content} 
                        onChange={setContent}
                        theme="snow"
                        className="quill-bold-border border-none"
                      />
                    </div>
                  </div>
               </div>
            </div>

            {/* Steps Container */}
            <div className="space-y-12">
              <div className="flex items-center justify-end px-2 border-b border-slate-100 pb-4">
                 <h3 className="text-xl font-black text-black">خطوات التنفيذ</h3>
              </div>

              {steps.length === 0 && (
                <button 
                  onClick={addStep}
                  className="w-full py-10 rounded-[2rem] border-4 border-dashed border-slate-200 hover:border-black hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-black" />
                  </div>
                  <span className="font-black text-slate-400 group-hover:text-black">ابدأ بإضافة الخطوة الأولى</span>
                </button>
              )}

              {steps.map((step, index) => (
                <div key={index} className="space-y-10">
                  <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-slate-100 relative group">
                    <div className="absolute -right-2 -top-2 w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-sm font-black z-10 shadow-lg border-2 border-white">
                      {index + 1}
                    </div>
                    
                    <div className="flex flex-col gap-6 text-right">
                      {/* Step Title */}
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-black block pr-1">عنوان المرحلة / الخطوة <span className="text-red-500">*</span></label>
                         <div className="flex items-center gap-3 w-full">
                             <button onClick={() => removeStep(index)} className="p-2.5 text-red-600 bg-white border border-slate-200 hover:bg-red-50 rounded-xl transition-all shrink-0">
                              <Trash2 size={18} />
                            </button>
                            <input
                              type="text"
                               className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 transition-all text-right outline-none"
                              placeholder="مثال: مرحلة قص القماش"
                              value={step.title}
                              onChange={(e) => updateStep(index, 'title', e.target.value)}
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-black block pr-1">تفاصيل المرحلة (الشرح) <span className="text-red-500">*</span></label>
                             <textarea
                               className="w-full h-44 bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-600 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 transition-all text-right resize-none outline-none"
                             placeholder="اشرح هذه الخطوة بالتفصيل للمتدربين..."
                             value={step.text}
                             onChange={(e) => updateStep(index, 'text', e.target.value)}
                           />
                         </div>

                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-black block pr-1">صورة توضيحية للمرحلة <span className="text-red-500">*</span></label>
                            <div className="relative h-44 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all group overflow-hidden">
                              {step.isUploading ? (
                                  <div className="absolute inset-0 flex items-center justify-center bg-white/60"><Loader2 className="animate-spin text-black" /></div>
                              ) : step.image ? (
                                <>
                                  <img src={step.image} className="w-full h-full object-contain p-2" alt="Step" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                      <button onClick={() => updateStep(index, 'image', null)} className="bg-white border border-slate-200 text-red-600 p-2 rounded-lg hover:scale-110 transition-transform"><Trash2 size={18} /></button>
                                  </div>
                                </>
                              ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                  <input type="file" className="hidden" onChange={(e) => handleImageUpload(index, e.target.files[0])} />
                                  <ImageIcon size={28} className="text-slate-300 mb-2" />
                                   <span className="text-[10px] font-black text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">رفع صورة</span>
                                </label>
                              )}
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Sequential Add Button */}
                  <div className="flex justify-center relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t-2 border-dashed border-slate-200"></div>
                    </div>
                      <button 
                        onClick={addStep}
                        className="relative flex items-center gap-2 bg-white border border-slate-200 px-6 py-2.5 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group shadow-md"
                      >
                      <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span className="text-xs font-black">إضافة الخطوة التالية</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Information Sections */}
            <div className="space-y-8 pt-10 border-t border-slate-100">
               <div className="flex items-center justify-between px-2">
                 <button onClick={addExtraSection} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm border border-transparent">
                   <Plus size={20} />
                 </button>
                 <div className="text-right">
                   <h3 className="text-xl font-black text-black">أقسام إضافية مخصصة</h3>
                   <p className="text-slate-400 text-[10px] font-bold">يمكنك إضافة أقسام (مثل: تعليمات عامة، الأدوات..إلخ)</p>
                 </div>
               </div>

               {extraSections.map((section, index) => (
                  <div key={index} className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-slate-100 relative animate-in fade-in slide-in-from-right-4 duration-500">
                    <button onClick={() => removeExtraSection(index)} className="absolute -left-2 -top-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-white shadow-lg hover:scale-110 transition-transform">
                      <X size={14} />
                    </button>
                    
                    <div className="space-y-6 text-right">
                       <div className="space-y-2">
                         <label className="text-xs font-black text-black block pr-1">اسم القسم (مثال: تعليمات هامة)</label>
                         <input
                           type="text"
                           className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 transition-all text-right outline-none"
                           placeholder="اكتب اسم القسم هنا..."
                           value={section.title}
                           onChange={(e) => updateExtraSection(index, 'title', e.target.value)}
                         />
                       </div>

                       <div className="space-y-2">
                         <label className="text-xs font-black text-black block pr-1">محتوى القسم</label>
                          <textarea
                            className="w-full h-32 bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-600 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 transition-all text-right resize-none outline-none"
                           placeholder="اكتب تفاصيل هذا القسم هنا..."
                           value={section.content}
                           onChange={(e) => updateExtraSection(index, 'content', e.target.value)}
                         />
                       </div>
                    </div>
                 </div>
               ))}

               {extraSections.length === 0 && (
                 <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-[2rem]">
                    <p className="text-slate-300 text-xs font-black">لا توجد أقسام إضافية مخصصة حالياً</p>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 sticky top-28">
                <div className="flex items-center justify-end gap-3 mb-8 border-b border-slate-100 pb-4">
                   <span className="text-sm font-black text-black uppercase">إعدادات الدرس</span>
                   <Settings className="text-black" size={20} />
                </div>

                <div className="space-y-8">
                   <div className="space-y-4">
                     <label className="text-[11px] font-black text-black block text-right px-2">فئة المتدربين</label>
                     <div className="grid grid-cols-3 gap-2">
                        {mainCategories.map((cat) => (
                          <button 
                            key={cat.id}
                            onClick={() => setMainCategory(cat.id)}                             className={`py-3 rounded-xl text-[10px] font-black border transition-all ${mainCategory === cat.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600'}`}
                          >
                            {cat.title}
                          </button>
                        ))}
                     </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t-2 border-slate-50">
                     <label className="text-[11px] font-black text-black block text-right px-2">نوع القطعة <span className="text-red-500">*</span></label>
                     <input
                       type="text"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 text-right focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 outline-none"
                       placeholder="تيشيرت، قميص..."
                       value={category}
                       onChange={(e) => setCategory(e.target.value)}
                     />
                   </div>

                   <div className="space-y-4 pt-4 border-t-2 border-slate-50">
                     <label className="text-[11px] font-black text-black block text-right px-2">برنامج الباترون</label>
                     <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => setProgram('1')} className={`py-3.5 rounded-2xl text-[11px] font-black border transition-all ${program === '1' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600'}`}>
                            Gerber
                          </button>
                           <button onClick={() => setProgram('2')} className={`py-3.5 rounded-2xl text-[11px] font-black border transition-all ${program === '2' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600'}`}>
                            Gemini
                          </button>
                     </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t-2 border-slate-50">
                     <label className="text-[11px] font-black text-black block text-right px-2">خصوصية الدرس</label>
                     <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => setIsPublic(true)}                           className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isPublic ? 'bg-blue-50/50 border-blue-600 text-blue-700' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-600'}`}
                        >
                           <div className={`p-1.5 rounded-lg border ${isPublic ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200'}`}><Eye size={14} /></div>
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] font-black">عام (Public)</span>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => setIsPublic(false)}                           className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${!isPublic ? 'bg-amber-50/50 border-amber-600 text-amber-700' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-600'}`}
                        >
                           <div className={`p-1.5 rounded-lg border ${!isPublic ? 'bg-amber-500 border-amber-600 text-white' : 'bg-white border-slate-200'}`}><EyeOff size={14} /></div>
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] font-black">خاص (Private)</span>
                          </div>
                        </button>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
