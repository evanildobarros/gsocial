import React, { useState } from 'react';
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
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
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="8" strokeDasharray="31.42 251.32" strokeDashoffset="0" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="8" strokeDasharray="31.42 251.32" strokeDashoffset="-31.42" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="8" strokeDasharray="31.42 251.32" strokeDashoffset="-62.84" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="8" strokeDasharray="31.42 251.32" strokeDashoffset="-94.26" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#6366F1" strokeWidth="8" strokeDasharray="31.42 251.32" strokeDashoffset="-125.68" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8B5CF6" strokeWidth="8" strokeDasharray="31.42 251.32" strokeDashoffset="-157.10" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EC4899" strokeWidth="8" strokeDasharray="31.42 251.32" strokeDashoffset="-188.52" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22D3EE" strokeWidth="8" strokeDasharray="31.42 251.32" strokeDashoffset="-219.94" />
      </svg>
      <h5 className="relative z-10 text-white font-black text-2xl tracking-tighter">
        ESG
      </h5>
    </div>
  );

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      {/* Left Side: Visual Identity */}
      <div className="hidden lg:flex w-2/5 bg-happiness-1 relative overflow-hidden items-center justify-center p-12">
        {/* Abstract Blobs */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-happiness-2/30 rounded-full blur-[80px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-happiness-4/20 rounded-full blur-[60px]" />

        <div className="relative z-10 text-center flex flex-col items-center gap-8">
          <ESGLogo />
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              ESGporto
            </h1>
            <p className="text-white/80 text-lg max-w-[280px]">
              Gestão e Monitoramento de Sustentabilidade para o Porto do Itaqui.
            </p>
          </div>

          <div className="pt-12">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-widest border border-white/20 px-3 py-1.5 rounded-full">
              <AutoAwesome sx={{ color: 'cyan', fontSize: 14 }} />
              <span>Powered by AI Studio</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-6 left-12 right-12 flex justify-between text-white/40 font-bold text-[9px] uppercase tracking-[0.15em]">
          <span>© 2026 Porto do Itaqui</span>
          <span>Versão 2.5.0</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden flex-col items-center mb-12">
            <div className="scale-75 mb-2"><ESGLogo /></div>
            <h2 className="text-2xl font-black text-happiness-1">ESGporto</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              {resetMode ? 'Recuperar Senha' : 'Login'}
            </h2>
            <p className="text-sm text-gray-500">
              {resetMode ? 'Insira seu e-mail para receber as instruções.' : 'Insira suas credenciais para acessar o painel.'}
            </p>
          </div>

          {resetSuccess ? (
            <div className="bg-green-50 border-2 border-green-500 text-center p-8 rounded-sm">
              <CheckCircle sx={{ fontSize: 48, color: '#22c55e', mb: 2 }} />
              <h3 className="text-lg font-black text-gray-900 mb-1">
                E-mail Enviado!
              </h3>
              <p className="text-sm text-gray-600 italic mb-6">
                Verifique sua caixa de entrada (e o spam) para redefinir sua senha.
              </p>
              <Button
                variant="text"
                onClick={() => { setResetMode(false); setResetSuccess(false); }}
                sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 11 }}
              >
                Voltar para o Login
              </Button>
            </div>
          ) : (
            <form onSubmit={resetMode ? handleResetPassword : handleSubmit}>
              <div className="flex flex-col gap-6">
                {error && (
                  <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
                    {error === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error}
                  </Alert>
                )}

                <TextField
                  label={resetMode ? 'E-mail de Recuperação' : 'E-mail'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  placeholder="seu-email@exemplo.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {!resetMode && (
                  <div>
                    <TextField
                      label="Senha"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fullWidth
                      placeholder="Sua senha"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setResetMode(true)}
                        sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                      >
                        Esqueceu a senha?
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : (resetMode ? <Send /> : <ArrowForward />)}
                    sx={{
                      py: 1.75,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: 13,
                    }}
                  >
                    {resetMode ? 'Enviar Instruções' : 'Entrar no Sistema'}
                  </Button>

                  {resetMode && (
                    <Button
                      variant="text"
                      onClick={() => setResetMode(false)}
                      startIcon={<ArrowBack />}
                      sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11, color: 'text.secondary' }}
                    >
                      Voltar ao Login
                    </Button>
                  )}
                </div>
              </div>
            </form>
          )}

          <p className="text-center mt-8 text-xs text-gray-500 font-semibold tracking-wide">
            Ambiente Seguro e Monitorado · gSocial ESGporto
          </p>
        </div>
      </div>
    </div>
  );
};