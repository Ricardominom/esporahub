import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Función para limpiar localStorage si está corrupto
const cleanupStorage = () => {
  try {
    // Intentar acceder a localStorage
    localStorage.getItem('test');
  } catch (e) {
    console.error('localStorage error detected, clearing storage:', e);
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error('Failed to clear localStorage:', clearError);
    }
  }
};

// Limpiar localStorage si hay problemas
cleanupStorage();

// Renderizar la aplicación
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
