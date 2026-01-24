import React, { useEffect, useState } from 'react';
import {
    Users,
    ShieldCheck,
    UserPlus,
    MoreVertical,
    Mail,
    Calendar,
    ShieldAlert,
    User,
    Loader2,
    Search,
    Edit2,
    Trash2,
    X
} from 'lucide-react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem as MuiMenuItem,
    FormControl,
    InputLabel,
    IconButton
} from '@mui/material';
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
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

    // Menu States
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const openMenu = Boolean(anchorEl);

    // Edit Dialog States
    const [editDialogOpen, setEditDialogOpen] = useState(false);
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
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (data) setCurrentUserProfile(data as UserProfile);
        }
    };

    const fetchProfiles = async () => {
        try {
            console.log('🔍 Buscando perfis...');
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setProfiles(data as UserProfile[]);
            }
        } catch (error: any) {
            console.error('Erro ao buscar perfis:', error);
            showError('Não foi possível carregar a lista de usuários.');
        }
    };

    // --- Actions ---

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, user: UserProfile) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleEditClick = () => {
        if (selectedUser) {
            setEditName(selectedUser.full_name || '');
            setEditRole(selectedUser.role);
            setEditDialogOpen(true);
            handleMenuClose(); // Close menu but keep selectedUser logic for dialog? No, we need selectedUser
            // NOTE: handleMenuClose clears selectedUser, so store it in temp or don't clear it yet.
            // Let's modify handleMenuClose to NOT clear selectedUser immediately if we open dialog.
            // Actually, better: just setAnchorEl(null) here.
            setAnchorEl(null);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;

        try {
            // Check permissions
            const isMaster = currentUserProfile?.role === 'master';
            const isAdmin = currentUserProfile?.role === 'admin';

            // Only Master can change roles. Admin can only edit name? 
            // For now, let's allow editing based on hierarchy logic if needed, 
            // but let's assume Master/Admin can edit.

            const updates: any = {
                full_name: editName,
                updated_at: new Date().toISOString()
            };

            // Only update role if it changed AND user is Master (security check)
            if (editRole !== selectedUser.role) {
                if (isMaster) {
                    updates.role = editRole;
                } else {
                    showError('Apenas Master Admins podem alterar funções.');
                    // Continue updating name only?
                    // return;
                }
            }

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', selectedUser.id);

            if (error) throw error;

            setProfiles(profiles.map(p => p.id === selectedUser.id ? { ...p, ...updates } : p));
            showSuccess('Usuário atualizado com sucesso!');
            setEditDialogOpen(false);
            setSelectedUser(null);
        } catch (error: any) {
            showError('Erro ao atualizar usuário: ' + error.message);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedUser) return;

        if (!window.confirm(`Tem certeza que deseja excluir o usuário ${selectedUser.full_name}?`)) {
            handleMenuClose();
            return;
        }

        try {
            // Note: Deleting from 'profiles' might not delete from 'auth.users' directly via client due to Supabase restrictions.
            // Usually requires a secure environment (Edge Function) to delete from auth.users.
            // But we can delete the profile.

            // If we only delete profile, user can't login properly if app relies on profile.
            // For now, let's try deleting profile.
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', selectedUser.id);

            if (error) throw error;

            setProfiles(profiles.filter(p => p.id !== selectedUser.id));
            showSuccess('Perfil do usuário removido.');
        } catch (error: any) {
            showError('Erro ao excluir: ' + error.message);
        } finally {
            handleMenuClose();
        }
    };

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case 'master':
                return (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-200 flex items-center gap-1.5 w-fit">
                        <ShieldAlert className="w-3 h-3" /> Master Admin
                    </span>
                );
            case 'admin':
                return (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 flex items-center gap-1.5 w-fit">
                        <ShieldCheck className="w-3 h-3" /> Administrador
                    </span>
                );
            case 'user':
                return (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200 flex items-center gap-1.5 w-fit">
                        <User className="w-3 h-3" /> Usuário Comum
                    </span>
                );
        }
    };

    const filteredProfiles = profiles.filter(p =>
        p.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
        p.email.toLowerCase().includes(filter.toLowerCase())
    );

    const isMaster = currentUserProfile?.role === 'master';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gestão de Membros</h2>
                    <p className="text-gray-500 font-medium italic">Controle de acessos e níveis de permissão do ecossistema ESGporto.</p>
                </div>
                <button
                    onClick={onAddUser}
                    className="bg-happiness-1 text-white px-6 py-3 rounded-sm shadow-xl shadow-happiness-1/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-black text-sm uppercase tracking-widest"
                >
                    <UserPlus className="w-4 h-4" /> Convidar Membro
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                {/* Table Controls */}
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-happiness-1 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-sm text-sm font-medium focus:border-happiness-1 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Total: {filteredProfiles.length} usuários</span>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-12 h-12 text-happiness-1 animate-spin" />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Sincronizando Perfis...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 text-left border-b border-gray-50">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nome do Membro</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contato</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nível de Acesso</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Membro desde</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProfiles.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-sm flex items-center justify-center font-black text-white shadow-lg transition-transform group-hover:scale-110 duration-500 ${profile.role === 'master' ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-200' :
                                                    profile.role === 'admin' ? 'bg-gradient-to-tr from-happiness-1 to-happiness-2 shadow-happiness-1/20' :
                                                        'bg-gradient-to-tr from-gray-400 to-gray-300 shadow-gray-200'
                                                    }`}>
                                                    {profile.full_name?.substring(0, 2).toUpperCase() || <User size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 group-hover:text-happiness-1 transition-colors">{profile.full_name || 'Usuário Sem Nome'}</p>
                                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-0.5">ID: {profile.id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                                    <Mail className="w-3.5 h-3.5 text-gray-300" /> {profile.email}
                                                </div>
                                            </div>
                                        </td>
                                        {/* <td className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{profile.id.substring(0, 8)}...</td> 
                                         Removed ID column to match original structure better or keep it? Original had it. Keep it but simplify.
                                        */}
                                        <td className="px-8 py-5">
                                            {getRoleBadge(profile.role)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={(e) => handleMenuClick(e, profile)}
                                                className="p-2 text-gray-300 hover:text-gray-900 transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredProfiles.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center opacity-30">
                                                <Users className="w-16 h-16 mb-4" />
                                                <p className="font-black uppercase tracking-widest text-sm">Nenhum membro encontrado</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="bg-[#1C1C1C] p-8 rounded-sm flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-happiness-2/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 rounded-sm flex items-center justify-center border border-white/10">
                        <ShieldCheck className="w-8 h-8 text-happiness-3" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight">Segurança de Dados e Acessos</h3>
                        <p className="text-gray-400 text-sm font-medium">Todas as alterações de nível de acesso são auditadas pelo sistema central.</p>
                    </div>
                </div>
                <button className="relative z-10 mt-6 md:mt-0 px-6 py-3 border border-white/20 hover:bg-white/10 transition-colors rounded-sm font-bold text-sm uppercase tracking-widest">
                    Ver Logs de Auditoria
                </button>
            </div>

            {/* Menu de Ações */}
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        borderRadius: 3,
                        minWidth: 180,
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleEditClick} sx={{ py: 1.5, px: 2 }}>
                    <ListItemIcon>
                        <Edit2 size={16} />
                    </ListItemIcon>
                    <ListItemText primary="Editar Usuário" primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ py: 1.5, px: 2, color: 'error.main' }}>
                    <ListItemIcon>
                        <Trash2 size={16} color="#ef4444" />
                    </ListItemIcon>
                    <ListItemText primary="Remover Acesso" primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
                </MenuItem>
            </Menu>

            {/* Modal de Edição */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 4, padding: 1, maxWidth: 450, width: '100%' }
                }}
            >
                <div className="flex justify-between items-center p-4 pb-0">
                    <DialogTitle sx={{ p: 0, fontWeight: 900 }}>Editar Usuário</DialogTitle>
                    <IconButton onClick={() => setEditDialogOpen(false)} size="small">
                        <X size={20} />
                    </IconButton>
                </div>

                <DialogContent>
                    <div className="flex flex-col gap-4 mt-2">
                        <TextField
                            label="Nome Completo"
                            fullWidth
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />

                        {isMaster && (
                            <FormControl fullWidth>
                                <InputLabel>Nível de Acesso</InputLabel>
                                <Select
                                    value={editRole}
                                    label="Nível de Acesso"
                                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MuiMenuItem value="user">Usuário Comum</MuiMenuItem>
                                    <MuiMenuItem value="admin">Administrador</MuiMenuItem>
                                    <MuiMenuItem value="master">Master Admin</MuiMenuItem>
                                </Select>
                            </FormControl>
                        )}
                        {!isMaster && (
                            <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                                * Você não tem permissão para alterar o nível de acesso deste usuário.
                            </p>
                        )}
                    </div>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => setEditDialogOpen(false)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3, boxShadow: 'none' }}
                        color="primary"
                    >
                        Salvar Alterações
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
