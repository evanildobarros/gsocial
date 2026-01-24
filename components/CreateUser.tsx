import React, { useState } from 'react';
import {
    UserPlus,
    ArrowLeft,
    Mail,
    User,
    Shield,
    Key,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { UserRole } from '../types';
import { supabase } from '../utils/supabase';

interface CreateUserProps {
    onBack: () => void;
}

export const CreateUser: React.FC<CreateUserProps> = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'user' as UserRole,
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Chamada real para a Edge Function que criamos
            const { data, error: funcError } = await supabase.functions.invoke('create-user', {
                body: {
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.fullName,
                    role: formData.role
                }
            });

            // Se o invoke retornar erro (ex: 400), o funcError estará preenchido
            if (funcError) {
                // Tentamos extrair a mensagem de erro do corpo se possível
                let errorMessage = 'Falha ao criar usuário';
                try {
                    const errBody = await funcError.context?.json();
                    errorMessage = errBody?.error || funcError.message;
                } catch {
                    errorMessage = funcError.message;
                }
                throw new Error(errorMessage);
            }

            if (data?.error) throw new Error(data.error);

            setSuccess(true);
            setTimeout(() => {
                onBack();
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'Erro inesperado ao criar usuário');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[600px] flex items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-6 bg-white p-12 rounded-sm shadow-2xl shadow-happiness-1/10 border border-gray-100 max-w-md w-full">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100">
                        <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sucesso!</h2>
                        <p className="text-gray-500 font-medium mt-2 italic">O novo membro foi registrado e já pode acessar o ecossistema.</p>
                    </div>
                    <div className="pt-4">
                        <button
                            onClick={onBack}
                            className="bg-gray-900 text-white px-8 py-4 rounded-sm font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4" /> Voltar para Membros
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-happiness-1 font-black text-[10px] uppercase tracking-[0.2em] mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar à Gestão
                    </button>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cadastrar Novo Membro</h2>
                    <p className="text-gray-500 font-medium italic">Adicione um novo integrante e defina suas responsabilidades estratégicas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-12 space-y-8">
                            {error && (
                                <div className="bg-red-50 border-2 border-red-100 p-4 rounded-sm flex items-center gap-3 text-red-600 font-bold text-sm">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Nome Completo */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-happiness-1 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Ex: João Silva"
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-sm text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-happiness-1 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* E-mail */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-happiness-1 transition-colors" />
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="joao@empresa.com"
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-sm text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-happiness-1 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Nível de Acesso */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Perfil de Acesso</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-happiness-1 transition-colors" />
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-sm text-sm font-semibold text-gray-900 focus:bg-white focus:border-happiness-1 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="user">Usuário Comum</option>
                                            <option value="admin">Administrador</option>
                                            <option value="master">Master Admin</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Senha Inicial */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Senha Provisória</label>
                                    <div className="relative group">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-happiness-1 transition-colors" />
                                        <input
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-sm text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-happiness-1 transition-all outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-happiness-1 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-happiness-1 text-white px-8 py-4 rounded-sm shadow-xl shadow-happiness-1/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <UserPlus className="w-5 h-5" />
                                    )}
                                    {loading ? 'Processando...' : 'Confirmar Cadastro'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="px-8 py-4 bg-gray-100 text-gray-500 rounded-sm font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div className="bg-[#1C1C1C] p-8 rounded-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-happiness-1/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-happiness-1/20 transition-all duration-700"></div>
                        <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-happiness-3" />
                            Níveis de Acesso
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-sm border border-white/5">
                                <p className="text-happiness-2 text-[10px] font-black uppercase tracking-widest mb-1">Master Admin</p>
                                <p className="text-gray-400 text-xs font-medium">Controle total do sistema, gestão de faturamento e níveis de acesso.</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-sm border border-white/5">
                                <p className="text-happiness-3 text-[10px] font-black uppercase tracking-widest mb-1">Administrador</p>
                                <p className="text-gray-400 text-xs font-medium">Gere projetos, visualiza relatórios e gerencia usuários comuns.</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-sm border border-white/5">
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Usuário Comum</p>
                                <p className="text-gray-500 text-xs font-medium">Acesso limitado à leitura de projetos e envio de mensagens.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-8 rounded-sm border border-blue-100">
                        <AlertCircle className="w-8 h-8 text-happiness-1 mb-4" />
                        <h3 className="text-happiness-1 font-black text-lg mb-2">Importante</h3>
                        <p className="text-blue-900/60 text-sm font-medium leading-relaxed italic">
                            O novo usuário receberá as credenciais definidas e deverá realizar o primeiro acesso para validar seu perfil no ecossistema ESGporto.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
