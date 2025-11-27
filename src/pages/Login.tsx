import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Shield } from 'lucide-react';
import { Link as RLink } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* background orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="relative max-w-md w-full bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl shadow-purple-500/10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-6 ring-1 ring-purple-400/20">
          <Shield className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Anmelden</h1>
        <p className="text-gray-300 mb-8">Melde dich mit Discord an, um deine Server‑Links zu verwalten.</p>
        <button onClick={login} className="w-full inline-flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-indigo-500/10">
          <LogIn className="w-5 h-5" />
          Mit Discord anmelden
        </button>
        <p className="text-gray-400 text-xs mt-6">Mit der Anmeldung erklärst du dich mit unseren Nutzungsbedingungen einverstanden.</p>
        <div className="mt-6 text-sm text-gray-400">
          Noch kein Account? <RLink to="/register" className="text-purple-300 hover:text-purple-200 underline underline-offset-4">Jetzt registrieren</RLink>
        </div>
        <div className="mt-2 text-sm">
          <RLink to="/" className="text-gray-400 hover:text-gray-200">Zurück zur Startseite</RLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
