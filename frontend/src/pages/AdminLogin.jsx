import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('admin_token', data.token);
            navigate('/admin');
        } else {
            // This handles 401, 404, 400 etc with the message from backend
            MySwal.fire({
                title: <span className="font-arabic">تنبيه</span>,
                text: data.message || 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور',
                icon: 'error',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#2563eb'
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        MySwal.fire({
            title: <span className="font-arabic">خطأ فني</span>,
            text: 'حدثت مشكلة أثناء الاتصال بالسيرفر. تأكد من تشغيل الباك-اند.',
            icon: 'warning',
            confirmButtonText: 'مفهوم',
            confirmButtonColor: '#f57c00'
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-arabic overflow-hidden relative">
      {/* Abstract background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">تسجيل دخول الإدارة</h1>
            <p className="text-slate-400">أهلاً بك مجدداً، يرجى إدخال بياناتك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-300 mr-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300 mr-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>دخول المنصة</span>
                  <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-slate-500 hover:text-white text-sm transition-colors"
            >
              العودة للموقع الرئيسي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
