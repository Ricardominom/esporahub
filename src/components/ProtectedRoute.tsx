import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import { storage } from '../utils/storage';
import AccessDeniedModal from './AccessDeniedModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredPermissions?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredPermissions = []
}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [deniedFeature, setDeniedFeature] = useState('');
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const token = localStorage.getItem('authToken');

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si es la página principal (/) y hay un token pero no está autenticado, 
  // probablemente el token es inválido, así que lo eliminamos y forzamos un logout
  if (isLandingPage && !isAuthenticated && token) {
    console.log('Token inválido detectado en la página principal, eliminando...');
    localStorage.removeItem('authToken');
    logout();
    return <>{children}</>;
  }

  // Si requiere autenticación y no está autenticado, redirigir al login,
  // excepto si estamos en la página principal (/)
  if (requireAuth && !isAuthenticated && !isLandingPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si requiere permisos específicos y el usuario no los tiene
  if (requireAuth && isAuthenticated && user && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(user, permission)
    );
    
    if (!hasAllPermissions) {
      // Determinar qué característica está intentando acceder
      let feature = "esta sección";
      
      if (requiredPermissions.includes('create_accounts')) {
        feature = "Gestión de Cuentas";
      } else if (requiredPermissions.includes('edit_checklist')) {
        feature = "Edición de Checklist";
      } else if (requiredPermissions.includes('assign_tasks')) {
        feature = "Asignación de Tareas";
      }
      
      setDeniedFeature(feature);
      setShowAccessDeniedModal(true);
      
      // Mostrar el modal pero también redirigir al dashboard
      return (
        <>
          <AccessDeniedModal
            isOpen={true}
            onClose={() => setShowAccessDeniedModal(false)}
            featureName={feature}
          />
          <Navigate to="/dashboard" replace />
        </>
      );
    }
  }

  // Si está autenticado y trata de acceder al login, redirigir al dashboard
  if (!requireAuth && isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {children}
      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        featureName={deniedFeature}
      />
    </>
  );
};

export default ProtectedRoute;