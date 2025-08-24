// src/components/auth/ProtectedRoute.jsx
'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { useAuthModal } from '@/src/providers/AuthModalProvider';
import { useEffect } from 'react';

export function ProtectedRoute({ 
  children, 
  fallback = null,
  redirectToLogin = true,
  requiredRole = null,
  showLoader = true
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectToLogin) {
      openLogin();
    }
  }, [isAuthenticated, isLoading, redirectToLogin, openLogin]);

  // Show loader while checking authentication
  if (isLoading && showLoader) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return fallback || (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso Richiesto</h2>
          <p className="text-gray-600 mb-6">
            Devi essere autenticato per accedere a questa sezione.
          </p>
          {redirectToLogin && (
            <button
              onClick={openLogin}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Accedi ora
            </button>
          )}
        </div>
      </div>
    );
  }

  // Check role-based access (if required)
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso Negato</h2>
          <p className="text-gray-600">
            Non hai i permessi necessari per accedere a questa sezione.
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return children;
}

// Higher-order component version
export function withProtection(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Hook for checking if user has access
export function useProtectedAccess(requiredRole = null) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  const hasAccess = isAuthenticated && (!requiredRole || user?.role === requiredRole);
  
  return {
    hasAccess,
    isAuthenticated,
    isLoading,
    user,
    missingRole: requiredRole && user?.role !== requiredRole
  };
}