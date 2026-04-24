import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
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
    </Routes>
  );

  return (
    <>
      {isLoginPage ? AppRoutes : <MainLayout>{AppRoutes}</MainLayout>}
    </>
  );
}

export default App;
