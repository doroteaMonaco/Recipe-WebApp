// src/components/auth/LoginButton.jsx
'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { useAuthModal } from '@/src/providers/AuthModalProvider';

export function LoginButton({ 
  children = "Accedi", 
  className = "",
  variant = "primary",
  size = "medium"
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLogin } = useAuthModal();

  // Se l'utente è già loggato, non mostrare il button
  if (isAuthenticated) return null;

  const baseClasses = "font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-4 focus:ring-blue-300"
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  return (
    <button 
      onClick={openLogin}
      disabled={isLoading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}