import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InterviewConfig from './pages/InterviewConfig';
import InterviewSession from './pages/InterviewSession';
import Report from './pages/Report';
import CommunicationPractice from './pages/CommunicationPractice';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/configure" element={<PrivateRoute><InterviewConfig /></PrivateRoute>} />
          <Route path="/interview/:sessionId" element={<PrivateRoute><InterviewSession /></PrivateRoute>} />
          <Route path="/report/:sessionId" element={<PrivateRoute><Report /></PrivateRoute>} />
          <Route path="/communication" element={<PrivateRoute><CommunicationPractice /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;