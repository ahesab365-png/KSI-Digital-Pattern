import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loading components for better performance
const Home = lazy(() => import('./pages/Home'));
const ProgramDetails = lazy(() => import('./pages/ProgramDetails'));
const Article = lazy(() => import('./pages/Article'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CreateArticle = lazy(() => import('./pages/CreateArticle'));
const CategoryDetails = lazy(() => import('./pages/CategoryDetails'));

// Loading component (simple placeholder)
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  const AppRoutes = (
    <Suspense fallback={<PageLoader />}>
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
      </Routes>
    </Suspense>
  );


  return (
    <>
      {isLoginPage ? AppRoutes : <MainLayout>{AppRoutes}</MainLayout>}
    </>
  );
}

export default App;
