import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Lectures from './GeneralModules/Lectures/Lectures';
import Create from './GeneralModules/Create/Create';
import PersonalAccount from './GeneralModules/PersonalAccount/PersonalAccount';
import Statistics from './GeneralModules/Statistics/Statistics';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute allowedRoles={['student', 'teacher']}>
            <Lectures />
          </PrivateRoute>
        } />
        <Route path="/lectures" element={
          <PrivateRoute allowedRoles={['student', 'teacher']}>
            <Lectures />
          </PrivateRoute>
        } />
        <Route path="/create" element={
          <PrivateRoute allowedRoles={['teacher']}>
            <Create />
          </PrivateRoute>
        } />
        <Route path="/personal-account" element={
          <PrivateRoute allowedRoles={['student', 'teacher']}>
            <PersonalAccount />
          </PrivateRoute>
        } />
        <Route path="/statistics" element={
          <PrivateRoute allowedRoles={['teacher']}>
            <Statistics />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;