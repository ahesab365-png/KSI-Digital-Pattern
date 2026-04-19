import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Shirt, Scissors, Layers, ArrowRight, BookOpen, ImageIcon } from 'lucide-react';
import { articleService } from '../services/articleService';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const mainCategories = [
    { id: 'women', title: 'حريمي', image: '/images/women.jpeg' },
    { id: 'men', title: 'رجالي', image: '/images/men.jpeg' },
    { id: 'kids', title: 'أطفال', image: '/images/kids.jpeg' },
  ];

  return (
    <div className="max-w-6xl mx-auto font-arabic px-4 md:px-0">
      {/* Back to Home */}
      <div className="flex items-center justify-end gap-2 mb-8 text-slate-400">
        <Link to="/" className="text-xs hover:text-blue-600 flex items-center gap-1 transition-colors">
          الرئيسية <ArrowRight size={14} />
        </Link>
      </div>

      {/* Program Header */}
      <div className="text-right mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-3 tracking-tight">
          برنامج {id === '1' ? 'Gerber' : 'Gemini'}
        </h1>
        <p className="text-slate-400 text-sm md:text-lg">اختر الفئة المستهدفة لبدء تصفح التصاميم </p>
      </div>

      {/* Static Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {mainCategories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => navigate(`/program/${id}/${cat.id}`)}
            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-blue-200/50 transition-all duration-500 border border-slate-100"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-right">
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 block">Category</span>
              <h3 className="text-3xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">
                {cat.title}
              </h3>
              <div className="flex items-center justify-end gap-2 text-blue-400 font-bold text-sm transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                <span>تصفح الآن</span>
                <ArrowRight size={18} className="rotate-180" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Minimal Footer Info */}
      <div className="mt-20 pt-10 border-t border-slate-100 text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] mb-10">
         Luminescent Monolith Fashion Education
      </div>
    </div>
  );
};

export default ProgramDetails;
