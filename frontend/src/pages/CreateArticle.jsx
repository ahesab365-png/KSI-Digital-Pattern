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
          setSteps(art.steps);
        }
      } else {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          const data = JSON.parse(savedDraft);
          // Optional: Ask to restore. For now, we'll skip to keep it clean.
        }
      }
    };
    fetchArticle();
  }, [id, isEditMode]);

  const handleSave = async (publish = true) => {
    if (!title.trim()) {
        return MySwal.fire({ title: 'نقص في البيانات', text: 'يرجى كتابة عنوان للمقال', icon: 'error' });
    }

    setIsSaving(true);
    try {
        const articleData = { title, content, program, mainCategory, category, isPublic: publish ? isPublic : false, steps };
        if (isEditMode) {
            await articleService.update(id, articleData);
        } else {
            await articleService.save(articleData);
            localStorage.removeItem(DRAFT_KEY);
        }
        MySwal.fire({ title: publish ? 'تم النشر!' : 'تم الحفظ كمسودة!', icon: 'success' });
        navigate('/admin');
    } catch (error) {
        MySwal.fire({ title: 'خطأ', text: error.message, icon: 'error' });
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
            <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100">
               <div className="space-y-6">
                  {/* Title Input */}
                  <div className="relative group">
                    <Type className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      className="w-full bg-transparent border-none pr-8 py-4 text-2xl md:text-4xl font-black text-slate-800 focus:ring-0 placeholder:text-slate-200 text-right"
                      placeholder="عنوان المقال الرئيسي"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Introduction Editor */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 block text-right pr-2">وصف و مقدمة الدرس</label>
                    <div className="rounded-2xl border border-slate-50 overflow-hidden bg-slate-50/30">
                      <ReactQuill 
                        value={content} 
                        onChange={setContent}
                        theme="snow"
                        className="quill-transparent border-none"
                      />
                    </div>
                  </div>
               </div>
            </div>

            {/* Steps Container */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <button onClick={addStep} className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                   <Plus size={20} />
                 </button>
                 <h3 className="text-lg font-black text-slate-800">خطوات التنفيذ</h3>
              </div>

              {steps.map((step, index) => (
                <div key={index} className="bg-white rounded-[2rem] p-5 md:p-8 shadow-sm border border-slate-100 relative group">
                  <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black z-10 shadow-lg">
                    {index + 1}
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                       <button onClick={() => removeStep(index)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                         <Trash2 size={18} />
                       </button>
                       <input
                         type="text"
                         className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all text-right"
                         placeholder={`عنوان الخطوة رقم ${index + 1}`}
                         value={step.title}
                         onChange={(e) => updateStep(index, 'title', e.target.value)}
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <textarea
                         className="w-full h-40 bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-100 transition-all text-right resize-none"
                         placeholder="اشرح هذه الخطوة بالتفصيل..."
                         value={step.text}
                         onChange={(e) => updateStep(index, 'text', e.target.value)}
                       />
                       <div className="relative h-40 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 hover:bg-slate-100 group overflow-hidden">
                          {step.isUploading ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/60"><Loader2 className="animate-spin text-blue-500" /></div>
                          ) : step.image ? (
                            <>
                              <img src={step.image} className="w-full h-full object-contain p-2" alt="Step" />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                 <button onClick={() => updateStep(index, 'image', null)} className="bg-white text-red-500 p-2 rounded-lg"><Trash2 size={18} /></button>
                              </div>
                            </>
                          ) : (
                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                              <input type="file" className="hidden" onChange={(e) => handleImageUpload(index, e.target.files[0])} />
                              <ImageIcon size={20} className="text-slate-300 mb-1" />
                              <span className="text-[10px] font-black text-slate-400">إضافة صورة</span>
                            </label>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 sticky top-28">
                <div className="flex items-center justify-end gap-3 mb-8 border-b border-slate-50 pb-4">
                   <span className="text-sm font-black text-slate-800">إعدادات النشر</span>
                   <Settings className="text-blue-500" size={20} />
                </div>

                <div className="space-y-8">
                   <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 block text-right px-2">فئة المتدربين</label>
                     <div className="grid grid-cols-3 gap-2">
                        {mainCategories.map((cat) => (
                          <button 
                            key={cat.id}
                            onClick={() => setMainCategory(cat.id)} 
                            className={`py-3 rounded-xl text-[10px] font-black border transition-all ${mainCategory === cat.id ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                          >
                            {cat.title}
                          </button>
                        ))}
                     </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-slate-50">
                     <label className="text-[11px] font-black text-slate-400 block text-right px-2">نوع القطعة</label>
                     <input
                       type="text"
                       className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 text-right focus:ring-2 focus:ring-blue-100"
                       placeholder="مثال: تيشيرت، قميص..."
                       value={category}
                       onChange={(e) => setCategory(e.target.value)}
                     />
                   </div>

                   <div className="space-y-4 pt-4 border-t border-slate-50">
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
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => setIsPublic(false)} 
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${!isPublic ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          <div className={`p-1.5 rounded-lg ${!isPublic ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}><EyeOff size={14} /></div>
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
