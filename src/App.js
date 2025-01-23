import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ChatLogin from './components/Chat/ChatLogin';
import ChatRoom from './pages/ChatRoom';
import AuthPage from './pages/AuthPage';

const ProtectedRoute = ({ element }) => {
  const user = localStorage.getItem('user'); // Access user from AuthContext
  return user ? element : <Navigate to="/login" />; // Redirect to login if not authenticated
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute element={<ChatLogin />} />} />
          <Route path="/chatRoom" element={<ProtectedRoute element={<ChatRoom />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
