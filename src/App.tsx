import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CardProvider } from './contexts/CardContext';
import { Navigation } from './components/Navigation';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Auth/Signup';
import { Login } from './pages/Auth/Login';
import { Queue } from './pages/Queue';
import { Archive } from './pages/Archive';
import { Settings } from './pages/Settings';

function AppRoutes() {
  const { user, loading } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-teal-600 rounded-card animate-pulse" />
          <p className="text-taupe">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navigation onAddScreenshots={() => setShowUploadModal(true)} />
      <Routes>
        <Route path="/queue" element={<Queue />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/queue" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CardProvider>
          <AppRoutes />
        </CardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
