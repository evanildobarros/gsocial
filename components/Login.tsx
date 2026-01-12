import React, { useState } from 'react';
import { Anchor, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API authentication delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Brand & Visual */}
      <div className="hidden lg:flex w-1/2 bg-blue-950 text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-950 z-0"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent z-0"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                <Anchor className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">gSocial ESG</h1>
          </div>
          <div className="max-w-lg space-y-6">
            <h2 className="text-5xl font-extrabold leading-tight">
              Gestão Inteligente para um <span className="text-orange-500">Porto Sustentável</span>.
            </h2>
            <p className="text-blue-200 text-xl font-light leading-relaxed">
              Plataforma integrada de monitoramento, compliance e inteligência de dados baseada no Inventário 2030 do Porto do Itaqui.
            </p>
          </div>
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm text-blue-300/60 font-medium">
                <span>© 2025 Porto do Itaqui</span>
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                <span>Termos de Uso</span>
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                <span>Privacidade</span>
            </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8 lg:p-24">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-white">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bem-vindo de volta</h2>
            <p className="text-gray-500 mt-3 text-sm">Acesse o painel de controle ESG com suas credenciais.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 outline-none" 
                  placeholder="gestor@portodoitaqui.com.br"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 outline-none" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-gray-600">Lembrar-me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">Recuperar senha</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-900/10 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Acessar Painel <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium">
              <span className="flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Ambiente Seguro · Criptografia SSL
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};