import React, { useState } from 'react';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ArrowForward,
  ArrowBack,
  AutoAwesome,
  CheckCircle,
  Send,
} from '@mui/icons-material';
import { supabase } from '../utils/supabase';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      onLogin();
    } catch (err: any) {
      console.error('Erro de login:', err);
      setError(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setResetSuccess(true);
    } catch (err: any) {
      console.error('Erro ao resetar senha:', err);
      setError(err.message || 'Erro ao enviar e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  const ESGLogo = () => (
    <div className="flex justify-center mb-8">
      <img
        src="/logo_itaqui.png"
        alt="Porto do Itaqui"
        className="w-32 h-auto brightness-0 invert"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-zinc-950">
      {/* Left Side: Visual Identity */}
      <div className="hidden lg:flex lg:flex-[0_0_40%] bg-primary relative overflow-hidden items-center justify-center p-12">
        {/* Glow Effects */}
        <div className="absolute w-[600px] h-[600px] -top-[10%] -left-[10%] bg-white/10 rounded-full blur-[80px] z-0 pointer-events-none"></div>
        <div className="absolute w-[700px] h-[700px] -bottom-[20%] -right-[10%] bg-black/20 rounded-full blur-[80px] z-0 pointer-events-none"></div>

        <div className="relative z-10 text-center flex flex-col items-center gap-6">
          <ESGLogo />
          <div>
            <h2 className="text-5xl font-black text-white mb-2 tracking-tight">
              ESGporto
            </h2>
            <p className="text-lg text-white/70 max-w-xs mx-auto font-medium leading-relaxed">
              Gestão e Monitoramento de Sustentabilidade para o Porto do Itaqui.
            </p>
          </div>

          <div className="pt-8">
            <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <AutoAwesome style={{ color: '#00e5ff', fontSize: 18 }} />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Powered by AI Studio
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-10 right-10 flex justify-between z-10">
          <span className="text-xs font-bold text-white/40">
            © 2026 Porto do Itaqui
          </span>
          <span className="text-xs font-bold text-white/40">
            Versão 2.5.0
          </span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-20 lg:p-32">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="w-20 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-primary">
              ESGporto
            </h2>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-black mb-2 tracking-tight text-gray-900 dark:text-white">
              {resetMode ? 'Recuperar Senha' : 'Login'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {resetMode ? 'Insira seu e-mail para receber as instruções.' : 'Acesse o painel integrado de sustentabilidade.'}
            </p>
          </div>

          {resetSuccess ? (
            <div className="p-8 text-center rounded-3xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10">
              <CheckCircle style={{ fontSize: 64 }} className="text-emerald-500 mb-4" />
              <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                Link de acesso enviado!
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                Verifique sua caixa de entrada (e o spam) para redefinir sua senha.
              </p>
              <button
                onClick={() => { setResetMode(false); setResetSuccess(false); }}
                className="w-full py-3 rounded-full border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Voltar ao Login
              </button>
            </div>
          ) : (
            <form onSubmit={resetMode ? handleResetPassword : handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                  <span>{error === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error}</span>
                </div>
              )}

              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  {resetMode ? 'E-MAIL DE RECUPERAÇÃO' : 'E-MAIL CORPORATIVO'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <EmailIcon fontSize="small" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {!resetMode && (
                <div className="relative">
                  <div className="flex justify-between items-center mb-1 ml-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      SENHA DE ACESSO
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <LockIcon fontSize="small" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setResetMode(true)}
                      className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-primary hover:bg-primary-hover text-white rounded-full font-black text-sm tracking-wide shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {resetMode ? 'REDEFINIR SENHA' : 'ENTRAR NO SISTEMA'}
                    {resetMode ? <Send fontSize="small" /> : <ArrowForward fontSize="small" />}
                  </>
                )}
              </button>

              {resetMode && (
                <button
                  type="button"
                  onClick={() => setResetMode(false)}
                  className="w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowBack fontSize="small" />
                  Voltar ao Login
                </button>
              )}
            </form>
          )}

          <div className="mt-10 text-center">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest block">
              Ambiente Seguro · gSocial ESGporto v2.5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};