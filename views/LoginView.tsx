import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LoginViewProps {
  onLogin: (username: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        onLogin(data.user.email || '');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#1a0809]">
      <div className="relative flex w-full flex-col justify-between lg:w-5/12 xl:w-1/2 overflow-hidden group/design-root p-6 lg:p-8">
        <div className="relative flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-[#4a0f12] to-[#2b080a] overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0 h-full w-full bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("https://picsum.photos/id/10/1200/800")' }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#2b080a] via-transparent to-transparent opacity-80"></div>

          <div className="relative z-10 flex h-full flex-col p-8 sm:p-12 lg:p-14 justify-center text-white">
            <div className="mb-12 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ea2a33] to-[#9F1212] shadow-lg">
                <span className="material-symbols-outlined text-2xl text-white">library_books</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">KV Library</h2>
            </div>

            <div className="max-w-lg">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.5rem] mb-2 text-white drop-shadow-lg">
                Welcome to <br /><span className="text-[#ea2a33]">KV LIBRARY</span>
              </h1>
              <h2 className="text-xl font-medium tracking-wide text-red-200/90 sm:text-2xl mb-8">
                by Marcomm Area 3
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-[#ea2a33] to-transparent rounded-full mb-10"></div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-inner">
                <p className="text-lg font-normal leading-relaxed text-red-100/90 sm:text-xl">
                  Semakin mudah dan simple mencari KV untuk campaignmu.
                </p>
              </div>
            </div>

            <div className="mt-auto pt-12 text-sm text-red-300/60 font-medium">
              © 2026 Telkomsel Marketing Communications Area 3 Jawa Bali
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[500px] bg-[#451a1d] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex mb-8 items-center justify-center relative">
            <h3 className="text-3xl font-bold text-white mb-2">Welcome back!</h3>
          </div>

          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <p className="text-[#d4a5a5] text-sm">Sign in with your corporate credentials.</p>
            </div>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl text-red-400 text-sm font-medium animate-pulse">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 ml-1">Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ea2a33] text-[20px]">email</span>
                  <input
                    className="block w-full rounded-2xl border-0 bg-[#230b0d] py-4 pl-12 pr-4 text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-[#ea2a33]/60 transition-all sm:text-sm"
                    placeholder="e.g., admin@telkomsel.co.id"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ea2a33] text-[20px]">lock</span>
                  <input
                    className="block w-full rounded-2xl border-0 bg-[#230b0d] py-4 pl-12 pr-12 text-gray-100 focus:ring-2 focus:ring-[#ea2a33]/60 transition-all sm:text-sm"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-600 bg-[#230b0d] text-[#ea2a33] focus:ring-[#ea2a33]" />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-[#ea2a33] hover:text-red-400">Forgot password?</a>
              </div>

              <button
                className="flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#ea2a33] to-[#9F1212] px-3 py-4 text-sm font-bold text-white shadow-lg hover:shadow-red-900/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
