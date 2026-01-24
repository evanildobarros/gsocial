import React, { useEffect, useState, useRef } from 'react';
import {
    User,
    Mail,
    Shield,
    Calendar,
    Edit2,
    Save,
    X,
    Camera,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../utils/supabase';
import { showSuccess, showError } from '../utils/notifications';

export const UserProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: ''
    });
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            let profileData: UserProfile | null = null;

            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (data) profileData = data as UserProfile;
            }

            // Fallback para demonstração se não houver usuário logado ou perfil no banco
            if (!profileData) {
                profileData = {
                    id: '00000000-0000-0000-0000-000000000000',
                    email: 'evanildobarros@gmail.com',
                    full_name: 'Evanildo Barros',
                    role: 'master',
                    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop',
                    cover_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&h=400&auto=format&fit=crop',
                    created_at: new Date().toISOString()
                };
            }

            setProfile(profileData);
            setFormData({ full_name: profileData.full_name || '' });
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!profile) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: formData.full_name })
                .eq('id', profile.id);

            if (error) throw error;

            setProfile({ ...profile, full_name: formData.full_name });
            setIsEditing(false);
            showSuccess('Perfil atualizado com sucesso!');
        } catch (error: any) {
            showError('Erro ao atualizar perfil: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = event.target.files?.[0];
        if (!file || !profile) return;

        try {
            setUploading(type);
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
            const filePath = `${type}s/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profile_images')
                .upload(filePath, file);

            if (uploadError) {
                throw new Error('Erro ao subir imagem. Certifique-se que o bucket "profile_images" existe no Supabase e é público.');
            }

            const { data: { publicUrl } } = supabase.storage
                .from('profile_images')
                .getPublicUrl(filePath);

            const updateData = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
            const { error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', profile.id);

            if (updateError) throw updateError;

            setProfile({ ...profile, ...updateData });
            showSuccess(`${type === 'avatar' ? 'Foto de perfil' : 'Capa'} atualizada com sucesso!`);
        } catch (error: any) {
            console.error('Upload error:', error);
            showError(error.message);
        } finally {
            setUploading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 text-[#2148C0] animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando seu perfil...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Não foi possível carregar as informações do perfil.</p>
            </div>
        );
    }

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                {/* Header/Cover Background */}
                <div
                    className="h-48 bg-gradient-to-r from-[#2148C0] via-blue-600 to-indigo-600 relative bg-cover bg-center group/cover"
                    style={profile.cover_url ? { backgroundImage: `url(${profile.cover_url})` } : {}}
                >
                    <div className="absolute inset-0 bg-blue-900/40 opacity-20"></div>
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,100 C30,80 70,120 100,100 L100,0 L0,0 Z" fill="white" opacity="0.1" />
                        </svg>
                    </div>

                    {/* Cover Edit Button */}
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploading === 'cover'}
                        className="absolute bottom-4 right-4 p-3 bg-black/30 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-black/50 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50 z-10"
                    >
                        {uploading === 'cover' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                        Alterar Capa
                    </button>
                    <input
                        type="file"
                        ref={coverInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, 'cover')}
                    />
                </div>

                {/* Profile Info Section */}
                <div className="px-12 pb-12 relative">
                    {/* Avatar Positioning */}
                    <div className="relative -mt-20 mb-8 flex items-end justify-between">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl relative overflow-hidden">
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.full_name}
                                        className="w-full h-full rounded-[2rem] object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-full rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-inner ${profile.role === 'master' ? 'bg-gradient-to-tr from-purple-600 to-indigo-500' :
                                        profile.role === 'admin' ? 'bg-gradient-to-tr from-blue-600 to-cyan-500' :
                                            'bg-gradient-to-tr from-gray-400 to-gray-300'
                                        }`}>
                                        {profile.full_name?.substring(0, 2).toUpperCase() || 'GS'}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={uploading === 'avatar'}
                                className="absolute bottom-2 right-2 p-3 bg-white rounded-2xl shadow-xl text-gray-400 hover:text-[#2148C0] transition-all transform hover:scale-110 active:scale-95 border border-gray-50 disabled:opacity-50"
                            >
                                {uploading === 'avatar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5" />}
                            </button>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, 'avatar')}
                            />
                        </div>

                        <div className="flex gap-3 pb-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    <Edit2 className="w-4 h-4" /> Editar Perfil
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-100 transition-all border border-red-100"
                                    >
                                        <X className="w-4 h-4" /> Cancelar
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#2148C0] text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Salvar Alterações
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ full_name: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:border-[#2148C0] transition-all outline-none"
                                    />
                                ) : (
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">{profile.full_name || 'Não informado'}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
                                    <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <Mail className="w-5 h-5 text-gray-300" />
                                        <span className="font-bold text-gray-600">{profile.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Data de Ingresso</label>
                                    <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <Calendar className="w-5 h-5 text-gray-300" />
                                        <span className="font-bold text-gray-600">{new Date(profile.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform">
                                    <Shield className="w-20 h-20" />
                                </div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Seu Nível de Acesso</label>

                                <div className="space-y-4 relative z-10">
                                    <div className={`flex items-center gap-3 p-4 rounded-2xl border ${profile.role === 'master' ? 'bg-purple-100/50 border-purple-200 text-purple-700' :
                                        profile.role === 'admin' ? 'bg-blue-100/50 border-blue-200 text-blue-700' :
                                            'bg-gray-200/50 border-gray-300 text-gray-600'
                                        }`}>
                                        <Shield className="w-6 h-6 shrink-0" />
                                        <span className="font-black uppercase tracking-widest text-xs">
                                            {profile.role === 'master' ? 'Master Admin' :
                                                profile.role === 'admin' ? 'Administrador' : 'Usuário Comum'}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        {profile.role === 'master' ? 'Você possui privilégios totais para gerenciar membros, projetos e métricas de impacto.' :
                                            profile.role === 'admin' ? 'Você pode gerenciar projetos e visualizar métricas, mas não alterar permissões de segurança.' :
                                                'Você tem acesso de visualização ao dashboard e portfólio de projetos.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-6 bg-green-50 rounded-2xl border border-green-100">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-xs font-bold text-green-700">Conta Verificada ESGporto</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
