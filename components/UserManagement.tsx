import React, { useEffect, useState } from 'react';
import {
    Search as SearchIcon,
    PersonAdd as UserPlusIcon,
    MoreVert as MoreIcon,
    Email as MailIcon,
    CalendarToday as CalendarIcon,
    Shield as ShieldIcon,
    AdminPanelSettings as ShieldAlertIcon,
    Person as UserIcon,
    Edit as EditIcon,
    Delete as TrashIcon,
    Close as CloseIcon,
    VerifiedUser as ShieldCheckIcon,
} from '@mui/icons-material';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../utils/supabase';
import { showSuccess, showError } from '../utils/notifications';

interface UserManagementProps {
    onAddUser?: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onAddUser }) => {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

    // Menu States
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    // Edit Dialog States
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState<UserRole>('user');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([fetchProfiles(), fetchCurrentUser()]);
        setLoading(false);
    };

    const fetchCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) setCurrentUserProfile(data as UserProfile);
        }
    };

    const fetchProfiles = async () => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            if (data) setProfiles(data as UserProfile[]);
        } catch (error: any) {
            console.error('Erro ao buscar perfis:', error);
            showError('Não foi possível carregar a lista de usuários.');
        }
    };

    const toggleMenu = (id: string | null) => {
        setMenuOpenId(menuOpenId === id ? null : id);
    };

    const handleEditClick = (user: UserProfile) => {
        setEditName(user.full_name || '');
        setEditRole(user.role);
        setSelectedUser(user);
        setEditDialogOpen(true);
        setMenuOpenId(null);
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;
        try {
            const isMaster = currentUserProfile?.role === 'master';
            const updates: any = { full_name: editName, updated_at: new Date().toISOString() };
            if (editRole !== selectedUser.role && isMaster) updates.role = editRole;

            const { error } = await supabase.from('profiles').update(updates).eq('id', selectedUser.id);
            if (error) throw error;

            setProfiles(profiles.map(p => p.id === selectedUser.id ? { ...p, ...updates } : p));
            showSuccess('Usuário atualizado com sucesso!');
            setEditDialogOpen(false);
            setSelectedUser(null);
        } catch (error: any) {
            showError('Erro ao atualizar usuário: ' + error.message);
        }
    };

    const handleDeleteClick = async (user: UserProfile) => {
        if (!window.confirm(`Excluir o usuário ${user.full_name}?`)) {
            setMenuOpenId(null);
            return;
        }
        try {
            const { error } = await supabase.from('profiles').delete().eq('id', user.id);
            if (error) throw error;
            setProfiles(profiles.filter(p => p.id !== user.id));
            showSuccess('Perfil do usuário removido.');
        } catch (error: any) {
            showError('Erro ao excluir: ' + error.message);
        } finally {
            setMenuOpenId(null);
        }
    };

    const getRoleChip = (role: UserRole) => {
        switch (role) {
            case 'master': return (
                <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wide">
                    <ShieldAlertIcon sx={{ fontSize: 14 }} /> Master Admin
                </span>
            );
            case 'admin': return (
                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wide">
                    <ShieldCheckIcon sx={{ fontSize: 14 }} /> Administrador
                </span>
            );
            case 'user': return (
                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wide border border-gray-200 dark:border-gray-700">
                    <UserIcon sx={{ fontSize: 14 }} /> Usuário
                </span>
            );
        }
    };

    const getAvatarGradient = (role: string) => {
        switch (role) {
            case 'master': return 'from-purple-600 to-red-600';
            case 'admin': return 'from-blue-600 to-blue-300';
            default: return 'from-gray-500 to-gray-300';
        }
    };

    const filteredProfiles = profiles.filter(p =>
        p.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
        p.email.toLowerCase().includes(filter.toLowerCase())
    );

    const isMaster = currentUserProfile?.role === 'master';

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">
                        Gestão de Membros
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Controle de acessos e níveis de permissão do ecossistema ESGporto.
                    </p>
                </div>
                <button
                    onClick={onAddUser}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                    <UserPlusIcon fontSize="small" />
                    Convidar Membro
                </button>
            </div>

            {/* Main Table Card */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                {/* Search Bar */}
                <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <SearchIcon fontSize="small" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Total: {filteredProfiles.length} usuários
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
                            Sincronizando Perfis...
                        </span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Membro</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Contato</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Nível</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Desde</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filteredProfiles.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarGradient(profile.role)} flex items-center justify-center shadow-md text-white font-black`}>
                                                    {profile.full_name?.substring(0, 2).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 dark:text-white text-sm">
                                                        {profile.full_name || 'Sem Nome'}
                                                    </p>
                                                    <p className="text-[10px] font-mono text-gray-400">ID: {profile.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <MailIcon style={{ fontSize: 16 }} className="text-gray-400" />
                                                <span className="text-sm font-semibold">{profile.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleChip(profile.role)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <CalendarIcon style={{ fontSize: 16 }} className="text-gray-400" />
                                                <span className="text-sm">{new Date(profile.created_at).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => toggleMenu(profile.id)}
                                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                            >
                                                <MoreIcon fontSize="small" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {menuOpenId === profile.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)}></div>
                                                    <div className="absolute right-8 top-12 z-20 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-xl w-48 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                        <button
                                                            onClick={() => handleEditClick(profile)}
                                                            className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                                                        >
                                                            <EditIcon fontSize="small" /> Editar Usuário
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(profile)}
                                                            className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                                                        >
                                                            <TrashIcon fontSize="small" /> Remover Acesso
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Audit Banner */}
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary shadow-lg lg:block hidden">
                        <ShieldCheckIcon style={{ fontSize: 32 }} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">
                            Segurança de Acessos
                        </h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 max-w-md">
                            Todas as alterações de nível de acesso são auditadas e registradas. Mantenha os privilégios de Master Admin restritos.
                        </p>
                    </div>
                </div>

                <button className="relative z-10 px-6 py-2 rounded-full border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all">
                    Ver Logs de Auditoria
                </button>
            </div>

            {/* Edit Modal */}
            {editDialogOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Editar Usuário</h3>
                            <button onClick={() => setEditDialogOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <CloseIcon fontSize="small" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Nome Completo</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Nível de Acesso</label>
                                {isMaster ? (
                                    <div className="relative">
                                        <ShieldIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" style={{ fontSize: 18 }} />
                                        <select
                                            value={editRole}
                                            onChange={(e) => setEditRole(e.target.value as UserRole)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                                        >
                                            <option value="user">Usuário Comum</option>
                                            <option value="admin">Administrador</option>
                                            <option value="master">Master Admin</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-white/20">
                                        <p className="text-xs text-gray-500 italic text-center">
                                            * Alteração de nível restrita a Master Admins.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSaveEdit}
                                className="w-full mt-2 py-3 bg-primary hover:bg-primary-hover text-white rounded-full font-black text-sm shadow-lg shadow-primary/20 transition-all"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
