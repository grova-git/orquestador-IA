"use client";

import { login, signup } from './actions'
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl shadow-[#25D366]/5">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#25D366] flex items-center justify-center font-bold text-black text-2xl mx-auto mb-4">
            W
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Orchestrator</h1>
          <p className="text-gray-400 mt-2 text-sm">Gestiona tus ventas en piloto automático</p>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-xl px-4 py-3 font-semibold hover:bg-gray-100 transition-colors mb-6 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          {loading ? "Conectando..." : "Continuar con Google"}
        </button>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">o usa tu email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
        
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#25D366] transition-colors placeholder:text-gray-600"
              name="email"
              placeholder="tu@negocio.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#25D366] transition-colors placeholder:text-gray-600"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex gap-3 mt-4">
            <button
              formAction={login}
              className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-black rounded-xl px-4 py-3 font-semibold transition-colors"
            >
              Entrar
            </button>
            <button
              formAction={signup}
              className="flex-1 border border-white/20 hover:bg-white/5 text-white rounded-xl px-4 py-3 font-medium transition-colors"
            >
              Registrarse
            </button>
          </div>
          
          {message && (
            <p className="mt-4 p-4 bg-red-500/10 border border-red-500/50 text-red-400 text-center text-sm rounded-xl">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
