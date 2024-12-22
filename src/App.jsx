import React from 'react';
import ReactDOM from 'react-dom/client';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from "./pages/Menu/Menu.jsx";
import Main from "./pages/Main/Baze.jsx";

export default function App() {
  return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/menu" element={<Menu />} />
            </Routes>
        </BrowserRouter>
    );
}
