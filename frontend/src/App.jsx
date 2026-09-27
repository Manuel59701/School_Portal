import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import { clearAllResults } from './lib/portalStore';

export default function App() {
  // Navigation views: 'landing', 'login', 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const [authState, setAuthState] = useState(null); // { user, role, token }

  const handleNavigateLogin = () => {
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (authData) => {
    setAuthState(authData);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    // Staff sessions end with a clean slate so no scores carry into the next session.
    if (authState && (authState.role === 'teacher' || authState.role === 'admin')) {
      clearAllResults();
    }
    setAuthState(null);
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {currentView === 'landing' && (
        <LandingPage onNavigateLogin={handleNavigateLogin} />
      )}

      {currentView === 'login' && (
        <LoginPage 
          onBackToHome={handleBackToHome} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {currentView === 'dashboard' && authState && (
        <>
          {authState.role === 'student' && (
            <StudentDashboard user={authState.user} onLogout={handleLogout} />
          )}

          {authState.role === 'teacher' && (
            <TeacherDashboard user={authState.user} onLogout={handleLogout} />
          )}

          {authState.role === 'admin' && (
            <AdminDashboard user={authState.user} onLogout={handleLogout} />
          )}
        </>
      )}
    </div>
  );
}
