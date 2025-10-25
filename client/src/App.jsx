import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SMTPManager from './components/SMTP/SMTPManager';
import EmailDesigner from './components/EmailDesigner/EmailDesigner';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CompanyManager from './components/Companies/CompanyManager';
import ResumeManager from './components/Resumes/ResumeManager';
import BulkSender from './components/Emails/BulkSender';
import EmailTemplates from './components/Emails/EmailTemplates';
import EmailHistory from './components/Emails/EmailHistory';
import Navbar from './components/Common/Navbar';
import Loading from './components/Common/Loading';
import Profile from './components/Profile/Profile';
import NotFoundPage from './components/404/404';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  return !user ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/email-designer" element={
          <ProtectedRoute>
            <Navbar />
            <EmailDesigner />
          </ProtectedRoute>
        } />
        <Route path="/companies" element={
          <ProtectedRoute>
            <Navbar />
            <CompanyManager />
          </ProtectedRoute>
        } />
        <Route path="/resumes" element={
          <ProtectedRoute>
            <Navbar />
            <ResumeManager />
          </ProtectedRoute>
        } />
        <Route path="/send-emails" element={
          <ProtectedRoute>
            <Navbar />
            <BulkSender />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <Navbar />
            <EmailTemplates />
          </ProtectedRoute>
        } />
        <Route path="/smtp" element={
          <ProtectedRoute>
            <Navbar />
            <SMTPManager />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <Navbar />
            <EmailHistory />
          </ProtectedRoute>
        } />
          <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar />
            <Profile/>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;