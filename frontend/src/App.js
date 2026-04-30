import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FormationsPage from './pages/FormationsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import FormateursPage from './pages/FormateursPage';
import { DomainesPage, StructuresPage, ProfilsPage } from './pages/SimpleCrudPages';
import UtilisateursPage from './pages/UtilisateursPage';

import './App.css';

function AppShell() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  // Close sidebar on navigation (mobile)
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  if (!user) return null;

  return (
    <div className="app-layout">
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />
      
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="app-main">
        <Routes>
          <Route path="/" element={
            <Navigate to={user?.role?.toLowerCase() === 'simple utilisateur' ? '/formations' : '/dashboard'} replace />
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute roles={['administrateur', 'responsable']}>
              <DashboardPage onMenuClick={() => setSidebarOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="/formations" element={
            <ProtectedRoute roles={['administrateur', 'utilisateur', 'responsable', 'simple utilisateur']}>
              <FormationsPage onMenuClick={() => setSidebarOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="/participants" element={
            <ProtectedRoute roles={['administrateur', 'utilisateur', 'responsable', 'simple utilisateur']}>
              <ParticipantsPage onMenuClick={() => setSidebarOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="/formateurs" element={
            <ProtectedRoute roles={['administrateur', 'utilisateur', 'responsable', 'simple utilisateur']}>
              <FormateursPage onMenuClick={() => setSidebarOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="/domaines" element={
            <ProtectedRoute roles={['administrateur']}>
              <DomainesPage onMenuClick={() => setSidebarOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="/structures" element={
            <ProtectedRoute roles={['administrateur']}>
              <StructuresPage onMenuClick={() => setSidebarOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="/profils" element={
            <ProtectedRoute roles={['administrateur']}>
              <ProfilsPage onMenuClick={() => setSidebarOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="/utilisateurs" element={
            <ProtectedRoute roles={['administrateur']}>
              <UtilisateursPage onMenuClick={() => setSidebarOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="*" element={
            <Navigate to={user?.role?.toLowerCase() === 'simple utilisateur' ? '/formations' : '/dashboard'} replace />
          } />
        </Routes>
      </div>
    </div>
  );
}

function AuthShell() {
  const { user } = useAuth();
  
  const defaultRoute = user?.role?.toLowerCase() === 'simple utilisateur' ? '/formations' : '/dashboard';

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={defaultRoute} replace /> : <LoginPage />} />
      <Route path="/*" element={user ? <AppShell /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(15,23,42,0.15)',
            },
          }}
        />
        <AuthShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
