import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Loader from './components/common/Loader';
import Home from './pages/Home';
import ProgramDetails from './pages/ProgramDetails';
import Article from './pages/Article';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateArticle from './pages/CreateArticle';
import CategoryDetails from './pages/CategoryDetails';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [showLoader, setShowLoader] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setShowLoader(false);

    // Initial load/navigation timer
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 600);

    // Delay showing the UI loader to avoid flicker for fast users
    const showLoaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 450); // Only show if loading takes longer than 450ms

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(showLoaderTimer);
    };
  }, [location.pathname]);

  const isLoginPage = location.pathname === '/admin/login';


  const AppRoutes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/programs" element={<Home />} />
      <Route path="/program/:id" element={<ProgramDetails />} />
      <Route path="/program/:id/:category" element={<CategoryDetails />} />
      <Route path="/article/:id" element={<Article />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/create-article" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
      <Route path="/admin/edit-article/:id" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
      
      <Route path="/reports" element={<ProtectedRoute><div className="text-center py-20 text-slate-400">قسم التقارير قريباً</div></ProtectedRoute>} />
    </Routes>
  );

  return (
    <>
      {(loading && showLoader) && <Loader />}
      {isLoginPage ? AppRoutes : <MainLayout>{AppRoutes}</MainLayout>}
    </>
  );
}

export default App;
