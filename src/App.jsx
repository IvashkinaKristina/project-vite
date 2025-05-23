import React from 'react';
import ReactDOM from 'react-dom/client';
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Menu from "./pages/Menu/Menu.jsx";
import Main from "./pages/Main/Baze.jsx";
import Registration from "./pages/Registration/Registration.jsx";
import { getCurrentUser } from './services/api';

function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/registration" element={<Registration />} />
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}