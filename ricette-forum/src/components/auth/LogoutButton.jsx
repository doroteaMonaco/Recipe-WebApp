// src/components/auth/LogoutButton.jsx
'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { useState } from 'react';

export function LogoutButton({ 
  children = "Esci", 
  className = "",
  showConfirm = false,
  variant = "secondary"
}) {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [isConfirming, setIsConfirming] = useState(false);

  // Se l'utente non è loggato, non mostrare il button
  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    if (showConfirm && !isConfirming) {
      setIsConfirming(true);
      return;
    }

    try {
      await logout({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  const baseClasses = "font-medium rounded-lg transition-colors duration-200 disabled:opacity-50";
  
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
  };

  if (isConfirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`${baseClasses} ${variants.danger} px-3 py-1.5 text-sm`}
        >
          Conferma Uscita
        </button>
        <button
          onClick={handleCancel}
          className={`${baseClasses} ${variants.secondary} px-3 py-1.5 text-sm`}
        >
          Annulla
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoading}
      className={`${baseClasses} ${variants[variant]} px-4 py-2 ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Uscendo...
        </div>
      ) : (
        children
      )}
    </button>
  );
}