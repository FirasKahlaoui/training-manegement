import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  if (!user) return null;
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />

          <Route path="/formations" element={
            <ProtectedRoute roles={['administrateur','utilisateur']}>
              <FormationsPage />
            </ProtectedRoute>
          } />

          <Route path="/participants" element={
            <ProtectedRoute roles={['administrateur','utilisateur']}>
              <ParticipantsPage />
            </ProtectedRoute>
          } />

          <Route path="/formateurs" element={
            <ProtectedRoute roles={['administrateur','utilisateur']}>
              <FormateursPage />
            </ProtectedRoute>
          } />

          <Route path="/domaines" element={
            <ProtectedRoute roles={['administrateur','utilisateur']}>
              <DomainesPage />
            </ProtectedRoute>
          } />

          <Route path="/structures" element={
            <ProtectedRoute roles={['administrateur','utilisateur']}>
              <StructuresPage />
            </ProtectedRoute>
          } />

          <Route path="/profils" element={
            <ProtectedRoute roles={['administrateur','utilisateur']}>
              <ProfilsPage />
            </ProtectedRoute>
          } />

          <Route path="/utilisateurs" element={
            <ProtectedRoute roles={['administrateur']}>
              <UtilisateursPage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function AuthShell() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
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
