import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import AIChat from './pages/AIChat';
import SmartGen from './pages/SmartGen';
import Mentorship from './pages/Mentorship';
import CreateCourse from './pages/CreateCourse';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  
  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Redirect if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/" element={<Navigate to="/dashboard" replace />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/courses" element={<Courses />} />
             <Route path="/create-course" element={<CreateCourse />} />
             <Route path="/ai-tutor" element={<AIChat />} />
             <Route path="/smart-gen" element={<SmartGen />} />
             <Route path="/mentorship" element={<Mentorship />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;