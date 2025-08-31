'use client';
import { LoginButton } from "@/src/components/auth/LoginButton";
import { LogoutButton } from "@/src/components/auth/LogoutButton";
import { SocialLogin } from "@/src/components/auth/SocialLogin";
import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { useAuth } from "@/src/hooks/useAuth";
import { useAuthModal } from "@/src/providers/AuthModalProvider";

export default function Home() {
  const { user, isAuthenticated, isLoading, status } = useAuth();
  const { openSignUp } = useAuthModal();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-2">Test Autenticazione</h1>
      <div className="flex gap-4">
        <LoginButton />
        <LogoutButton />
        <button
          onClick={openSignUp}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Registrati
        </button>
      </div>
      <SocialLogin className="w-full max-w-xs" />
      <div className="mt-6 p-4 bg-white rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Stato utente:</h2>
        {isLoading ? (
          <p className="text-blue-600">Caricamento...</p>
        ) : isAuthenticated ? (
          <div>
            <p className="text-green-700">Autenticato come <b>{user?.name || user?.email}</b></p>
            <pre className="bg-gray-100 p-2 rounded text-xs mt-2">{JSON.stringify(user, null, 2)}</pre>
          </div>
        ) : (
          <p className="text-red-600">Non autenticato</p>
        )}
        <p className="mt-2 text-xs text-gray-500">Status: {status}</p>
      </div>
      <div className="mt-8 w-full max-w-md">
        <ProtectedRoute fallback={<div className="p-4 bg-yellow-100 rounded">Questa sezione è visibile solo agli utenti autenticati.</div>}>
          <div className="p-4 bg-green-100 rounded">
            <h3 className="font-bold">Area Privata</h3>
            <p>Benvenuto nella sezione protetta! Solo gli utenti autenticati possono vedere questo messaggio.</p>
          </div>
        </ProtectedRoute>
      </div>
    </div>
  );
}
