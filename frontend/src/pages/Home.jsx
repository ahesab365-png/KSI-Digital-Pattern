import React from 'react';
import { ArrowLeft, Rocket, Zap, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const programs = [
    {
      id: 1,
      title: 'Gerber',
      icon: <Rocket className="text-white" size={20} />,
      iconBg: 'bg-blue-500',
      actionText: 'دخول البرنامج',
      bgImage: '/images/gerber.jpeg'
    },
    {
      id: 2,
      title: 'Gemini',
      icon: <Zap className="text-white" size={20} />,
      iconBg: 'bg-purple-500',
      actionText: 'دخول البرنامج',
      bgImage: '/images/gemini.jpeg'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 font-arabic px-4 md:px-0">
      {/* Hero Section - Compact */}
      <div className="mb-12 text-right">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1 tracking-tight">منصة KSI Digital Pattern تعليم الباترون</h1>
        <p className="text-slate-400 text-sm">ابدأ رحلتك في عالم الموضة والابتكار</p>
      </div>

      {/* Cards Grid - Medium Size */}
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {programs.map((program) => (
          <div 
            key={program.id}
            onClick={() => navigate(`/program/${program.id}`)}
            className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden min-h-[180px] sm:h-[220px] md:h-[240px]"
          >
            {/* Background Image Container */}
            {program.bgImage && (
              <>
                <div 
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105 bg-[#1a1a1a]"
                  style={{ backgroundImage: `url(${program.bgImage})` }}
                />
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10 group-hover:via-slate-900/50 transition-all duration-500" />
              </>
            )}

            <div className="relative z-10 flex flex-col h-full">
               <div className="flex justify-between items-start mb-4">
                 <div className={`w-11 h-11 ${program.iconBg} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                   {program.icon}
                 </div>
               </div>

               <h2 className={`text-xl font-black mb-2 transition-colors duration-300 ${program.bgImage ? 'text-white' : 'text-slate-800'}`}>
                {program.title}
               </h2>
               <p className={`text-[11px] leading-relaxed mb-auto opacity-80 ${program.bgImage ? 'text-slate-100' : 'text-slate-500'}`}>
                 {program.description}
               </p>

               <div className="flex justify-between items-center text-[11px] font-black mt-4">
                 <div className={`flex items-center gap-1.5 ${program.bgImage ? 'text-blue-300 group-hover:text-white' : 'text-blue-600'} transition-colors`}>
                   <ArrowLeft size={14} />
                   <span>{program.actionText}</span>
                 </div>
                 {program.badge && (
                   <span className="text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                     {program.badge}
                   </span>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Banner - Medium & Elegant */}
      <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-100 shadow-lg">
        <div className="text-right flex-1">
          <h3 className="text-base font-bold text-slate-800 mb-1">تحتاج لتوجيه؟</h3>
          <p className="text-slate-400 text-xs">تحدث مع خبراء الباترون لدينا لمساعدتك في أي وقت.</p>
        </div>
        <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 border border-transparent">
          <span>تواصل معنا</span>
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default Home;
