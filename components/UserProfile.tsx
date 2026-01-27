import React, { useEffect, useState, useRef } from 'react';
import {
    Mail as MailIcon,
    Shield as ShieldIcon,
    CalendarToday as CalendarIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    PhotoCamera as CameraIcon,
    Verified as VerifiedIcon,
} from '@mui/icons-material';
import { UserProfile } from '../types';
import { supabase } from '../utils/supabase';
import { showSuccess, showError } from '../utils/notifications';

export const UserProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ full_name: '' });
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
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (data) profileData = data as UserProfile;
            }

            // Fallback para desenvolvimento
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
            const { error } = await supabase.from('profiles').update({ full_name: formData.full_name }).eq('id', profile.id);
            if (error) throw error;
            setProfile({ ...profile, full_name: formData.full_name });
            setIsEditing(false);
            showSuccess('Perfil atualizado!');
        } catch (error: any) {
            showError('Erro ao atualizar: ' + error.message);
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

            const { error: uploadError } = await supabase.storage.from('profile_images').upload(filePath, file);
            if (uploadError) throw new Error('Erro ao subir imagem.');

            const { data: { publicUrl } } = supabase.storage.from('profile_images').getPublicUrl(filePath);
            const updateData = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
            const { error: updateError } = await supabase.from('profiles').update(updateData).eq('id', profile.id);
            if (updateError) throw updateError;

            setProfile({ ...profile, ...updateData });
            showSuccess(`${type === 'avatar' ? 'Foto' : 'Capa'} atualizada!`);
        } catch (error: any) {
            showError(error.message);
        } finally {
            setUploading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">
                    Sincronizando seu perfil...
                </span>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="w-full mb-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">

                {/* Header/Cover Section */}
                <div
                    className="h-60 relative bg-cover bg-center transition-all duration-500 ease-in-out"
                    style={{
                        backgroundImage: profile.cover_url
                            ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url(${profile.cover_url})`
                            : 'linear-gradient(135deg, #4973F2 0%, #0A1929 100%)'
                    }}
                >
                    <div className="absolute bottom-6 right-6 z-10">
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            disabled={uploading === 'cover'}
                            className="group flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full text-white font-bold text-sm transition-all"
                        >
                            {uploading === 'cover' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CameraIcon fontSize="small" />}
                            Alterar Capa
                        </button>
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'cover')} />
                    </div>
                </div>

                {/* Profile Identity Section */}
                <div className="px-6 md:px-12 pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                        <div className="relative -mt-20 ml-0 md:ml-6 group">
                            <div
                                className={`w-40 h-40 rounded-[40px] border-8 border-white dark:border-zinc-900 shadow-2xl overflow-hidden flex items-center justify-center text-5xl font-black text-white ${profile.role === 'master' ? 'bg-gradient-to-br from-purple-600 to-red-600' : 'bg-primary'
                                    }`}
                            >
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    profile.full_name?.substring(0, 2).toUpperCase()
                                )}
                            </div>
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={uploading === 'avatar'}
                                className="absolute bottom-2 right-2 p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 text-primary hover:text-primary-hover transition-colors"
                            >
                                {uploading === 'avatar' ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <CameraIcon fontSize="small" />}
                            </button>
                            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'avatar')} />
                        </div>

                        <div className="flex gap-3 mb-2 w-full md:w-auto">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 md:flex-none items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-white/10 rounded-full font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex"
                                >
                                    <EditIcon fontSize="small" />
                                    Editar Perfil
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center justify-center gap-2 px-6 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors"
                                    >
                                        <CloseIcon fontSize="small" /> Cancelar
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={saving}
                                        className="flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-full font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
                                    >
                                        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SaveIcon fontSize="small" />}
                                        Salvar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8 md:mt-12">
                        <div className="lg:col-span-2 space-y-10">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">
                                    Identificação
                                </span>
                                {isEditing ? (
                                    <input
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ full_name: e.target.value })}
                                        className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white w-full bg-transparent border-b-2 border-gray-200 dark:border-white/10 focus:border-primary outline-none transition-colors pb-2"
                                        placeholder="Seu Nome Completo"
                                    />
                                ) : (
                                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                                        {profile.full_name || 'Usuário ESGporto'}
                                    </h1>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary shadow-sm">
                                        <MailIcon fontSize="small" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">E-mail Corporativo</p>
                                        <p className="font-bold text-gray-900 dark:text-white break-all">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary shadow-sm">
                                        <CalendarIcon fontSize="small" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Data de Ingresso</p>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-8 rounded-[32px] border border-dashed border-primary/30 bg-primary/5 dark:bg-primary/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <ShieldIcon className="text-primary" />
                                    <span className="text-xs font-black uppercase tracking-[0.1em] text-primary">Nível de Acesso</span>
                                </div>

                                <div className={`inline-block px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide mb-6 ${profile.role === 'master' ? 'bg-purple-100 text-purple-700 dark:bg-black dark:text-purple-300' :
                                        profile.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-black dark:text-blue-300' :
                                            'bg-gray-200 text-gray-700 dark:bg-black dark:text-gray-300'
                                    }`}>
                                    {profile.role === 'master' ? 'Master Admin' : profile.role === 'admin' ? 'Administrador' : 'Colaborador'}
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium italic leading-relaxed">
                                    {profile.role === 'master'
                                        ? 'Você possui privilégios totais de supervisão, auditoria e gestão de membros do ecossistema ESGporto.'
                                        : profile.role === 'admin'
                                            ? 'Permissão para gestão operacional e relatórios estratégicos.'
                                            : 'Acesso às ferramentas de monitoramento e input de dados.'}
                                </p>
                            </div>

                            <div className="px-6 py-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-500/20 flex items-center gap-3">
                                <VerifiedIcon className="text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                                    Conta Verificada
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
