import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginButton from './LoginButton';
import Logo from './Logo';
// import FlowEffect from './FlowEffect'; // Temporalmente deshabilitado
import MeltingText from './MeltingText';
import { useAuthStore } from '../stores/authStore';
import '../styles/header.css';
import '../styles/flow-effect.css';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsVisible(true);
    // Force dark mode on landing page
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }, []);

  // Verificar si hay una sesión activa
  useEffect(() => {
    // Solo redirigir si estamos en la página principal
    if (location.pathname === '/') {
      if (isAuthenticated) {
        console.log('Usuario autenticado en la página principal, redirigiendo a dashboard');
        navigate('/dashboard');
      }
    }
  }, [navigate, location.pathname, isAuthenticated]);

  return (
    <header className="header dark-theme">
      {/* <FlowEffect /> */} {/* Temporalmente deshabilitado */}
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>
      <div className={`overlay ${isVisible ? 'visible' : ''}`}>
        <div className="content">
          <h1 className="title">
            <MeltingText text="esporahub" />
          </h1>
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;