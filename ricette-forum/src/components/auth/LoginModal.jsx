// src/components/auth/LoginModal.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { useAuthModal } from '@/src/providers/AuthModalProvider';
import { SocialLogin } from './SocialLogin';

export function LoginModal() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const { isLoginOpen, closeLogin, openSignUp } = useAuthModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const result = await login('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError('Email o password non corretti');
      } else if (result?.ok) {
        closeLogin();
        // Reset form
        setFormData({ email: '', password: '' });
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Errore durante il login. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSwitchToSignup = () => {
    setFormData({ email: '', password: '' });
    setError('');
    openSignUp();
  };

  const handleClose = () => {
    setFormData({ email: '', password: '' });
    setError('');
    closeLogin();
  };

  if (!isLoginOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Accedi</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-1">Bentornato! Accedi al tuo account</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Social Login */}
          <SocialLogin onSuccess={closeLogin} className="mb-6" />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">oppure</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="tua@email.com"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Accedendo...
                </div>
              ) : (
                'Accedi'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Non hai un account?{' '}
            <button
              onClick={handleSwitchToSignup}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Registrati
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}